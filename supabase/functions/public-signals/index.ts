/**
 * public-signals — fans out to keyless public APIs (Wikipedia, Wayback,
 * Reddit, Hacker News, GitHub, DuckDuckGo) for a brand/domain, then asks
 * Lovable AI to compute a visibility score + insights.
 *
 * Security:
 * - IP rate-limited (10/min)
 * - Strict input validation; brand 1-100 chars, domain 0-200
 * - Promise.allSettled — partial failures returned as nulls + errors[]
 * - Never exposes API keys to client
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsResponse,
  jsonResponse,
  errorResponse,
  checkRateLimit,
  sanitizeString,
  enforceLength,
  safeParseBody,
} from "../_shared/security.ts";

// ── Source fetchers (each returns { ok, data?, error? }) ──────────────────
type SourceResult<T> = { ok: true; data: T } | { ok: false; error: string };

const TIMEOUT_MS = 8000;
async function timed<T>(p: Promise<T>): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await p;
  } finally {
    clearTimeout(timer);
  }
}

const UA = { "User-Agent": "ThreeReachAI/1.0 (+https://threereach.lovable.app)" };

async function fetchWikipedia(brand: string): Promise<SourceResult<unknown>> {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(brand)}`,
      { headers: UA },
    );
    if (r.status === 404) return { ok: true, data: { found: false } };
    if (!r.ok) return { ok: false, error: `Wikipedia ${r.status}` };
    const j = await r.json();
    return {
      ok: true,
      data: {
        found: !!j.title,
        title: j.title,
        extract: j.extract,
        url: j.content_urls?.desktop?.page,
      },
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Wikipedia fetch failed" };
  }
}

async function fetchWayback(domain: string): Promise<SourceResult<unknown>> {
  if (!domain) return { ok: true, data: null };
  try {
    const r = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(domain)}`,
      { headers: UA },
    );
    if (!r.ok) return { ok: false, error: `Wayback ${r.status}` };
    const j = await r.json();
    const snap = j?.archived_snapshots?.closest;
    return {
      ok: true,
      data: snap
        ? {
            available: snap.available,
            timestamp: snap.timestamp,
            url: snap.url,
          }
        : { available: false },
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Wayback fetch failed" };
  }
}

async function fetchReddit(brand: string): Promise<SourceResult<unknown>> {
  try {
    const r = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(`"${brand}"`)}&sort=new&limit=15`,
      { headers: UA },
    );
    if (!r.ok) return { ok: false, error: `Reddit ${r.status}` };
    const j = await r.json();
    const items = (j?.data?.children || []).slice(0, 10).map((c: { data: Record<string, unknown> }) => ({
      title: c.data.title,
      subreddit: c.data.subreddit,
      url: `https://www.reddit.com${c.data.permalink}`,
      created_utc: c.data.created_utc,
      score: c.data.score,
    }));
    return { ok: true, data: { count: items.length, items } };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Reddit fetch failed" };
  }
}

async function fetchHN(brand: string): Promise<SourceResult<unknown>> {
  try {
    const r = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(brand)}&tags=story&hitsPerPage=10`,
      { headers: UA },
    );
    if (!r.ok) return { ok: false, error: `HN ${r.status}` };
    const j = await r.json();
    const items = (j?.hits || []).map((h: Record<string, unknown>) => ({
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      points: h.points,
      created_at: h.created_at,
    }));
    return { ok: true, data: { count: j?.nbHits ?? items.length, items } };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "HN fetch failed" };
  }
}

async function fetchGitHub(brand: string): Promise<SourceResult<unknown>> {
  try {
    const r = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(brand)}&sort=stars&order=desc&per_page=8`,
      { headers: { ...UA, Accept: "application/vnd.github+json" } },
    );
    if (!r.ok) return { ok: false, error: `GitHub ${r.status}` };
    const j = await r.json();
    const items = (j?.items || []).map((it: Record<string, unknown>) => ({
      name: it.full_name,
      stars: it.stargazers_count,
      url: it.html_url,
      description: it.description,
    }));
    return { ok: true, data: { count: j?.total_count ?? items.length, items } };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "GitHub fetch failed" };
  }
}

async function fetchDDG(brand: string): Promise<SourceResult<unknown>> {
  try {
    const r = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(brand)}&format=json&no_html=1&skip_disambig=1`,
      { headers: UA },
    );
    if (!r.ok) return { ok: false, error: `DDG ${r.status}` };
    const j = await r.json();
    return {
      ok: true,
      data: {
        abstract: j?.AbstractText || null,
        url: j?.AbstractURL || null,
        related: (j?.RelatedTopics || []).slice(0, 5).map((t: Record<string, unknown>) => ({
          text: t.Text,
          url: t.FirstURL,
        })),
      },
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "DDG fetch failed" };
  }
}

// ── Lovable AI scoring ────────────────────────────────────────────────────
async function scoreWithAI(
  brand: string,
  sources: Record<string, unknown>,
  apiKey: string,
): Promise<{ score: unknown; insights: string[] } | null> {
  try {
    const compact = JSON.stringify(sources).slice(0, 8000);
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You score brand visibility on AI/web sources for AEO (Answer Engine Optimization). Output ONLY via the provided tool. Be conservative — most small brands score 20-50.",
          },
          {
            role: "user",
            content: `Brand: ${brand}\nRaw signals JSON:\n${compact}\n\nCompute an overall 0-100 score plus 4 sub-scores (authority, mentions, freshness, ecosystem) and 3-4 insight bullets that are actionable.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report",
              description: "Return visibility score and insights",
              parameters: {
                type: "object",
                properties: {
                  overall: { type: "number" },
                  authority: { type: "number" },
                  mentions: { type: "number" },
                  freshness: { type: "number" },
                  ecosystem: { type: "number" },
                  status: { type: "string", enum: ["weak", "mentioned", "strong"] },
                  insights: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                },
                required: ["overall", "authority", "mentions", "freshness", "ecosystem", "status", "insights"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report" } },
      }),
    });
    if (!r.ok) {
      console.error("AI scoring failed:", r.status);
      return null;
    }
    const j = await r.json();
    const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return null;
    const parsed = JSON.parse(args);
    return {
      score: {
        overall: parsed.overall,
        status: parsed.status,
        breakdown: {
          authority: parsed.authority,
          mentions: parsed.mentions,
          freshness: parsed.freshness,
          ecosystem: parsed.ecosystem,
        },
      },
      insights: parsed.insights || [],
    };
  } catch (e) {
    console.error("AI scoring error:", e);
    return null;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  const limited = checkRateLimit(req, { maxRequests: 10, windowMs: 60_000 });
  if (limited) return limited;

  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body = await safeParseBody(req);
    if (!body) return errorResponse("Invalid request body", 400);

    const brand = enforceLength(sanitizeString(body.brand || ""), 100);
    const domainRaw = enforceLength(sanitizeString(body.domain || ""), 200);
    const domain = domainRaw.replace(/^https?:\/\//, "").replace(/\/$/, "");

    if (!brand || brand.length < 1) {
      return errorResponse("brand is required (max 100 chars)", 400);
    }

    // Fan out
    const [wiki, way, red, hn, gh, ddg] = await Promise.allSettled([
      timed(fetchWikipedia(brand)),
      timed(fetchWayback(domain)),
      timed(fetchReddit(brand)),
      timed(fetchHN(brand)),
      timed(fetchGitHub(brand)),
      timed(fetchDDG(brand)),
    ]);

    const pick = <T,>(s: PromiseSettledResult<SourceResult<T>>, name: string) => {
      if (s.status === "fulfilled" && s.value.ok) return { data: s.value.data, error: null };
      const err =
        s.status === "fulfilled" ? (s.value as { ok: false; error: string }).error : "Network/timeout";
      console.warn(`${name} failed:`, err);
      return { data: null, error: `${name}: ${err}` };
    };

    const wikipedia = pick(wiki, "wikipedia");
    const wayback = pick(way, "wayback");
    const reddit = pick(red, "reddit");
    const hackernews = pick(hn, "hackernews");
    const github = pick(gh, "github");
    const duckduckgo = pick(ddg, "duckduckgo");

    const errors = [wikipedia, wayback, reddit, hackernews, github, duckduckgo]
      .map((s) => s.error)
      .filter((e): e is string => !!e);

    const sources = {
      wikipedia: wikipedia.data,
      wayback: wayback.data,
      reddit: reddit.data,
      hackernews: hackernews.data,
      github: github.data,
      duckduckgo: duckduckgo.data,
    };

    // Score with Lovable AI (graceful if key missing)
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const ai = apiKey ? await scoreWithAI(brand, sources, apiKey) : null;

    return jsonResponse({
      brand,
      domain,
      fetchedAt: new Date().toISOString(),
      sources,
      score: ai?.score ?? null,
      insights: ai?.insights ?? [],
      errors,
    });
  } catch (e) {
    console.error("public-signals error:", e);
    return errorResponse("An internal error occurred", 500);
  }
});
