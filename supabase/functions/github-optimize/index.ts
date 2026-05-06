// Edge function: generates SEO/GEO/sitemap/perf fixes via Lovable AI and opens a PR
// using the user's stored GitHub PAT. No external secrets required.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GH = "https://api.github.com";
const LOVABLE_AI = "https://ai.gateway.lovable.dev/v1/chat/completions";

function b64encode(s: string) {
  return btoa(unescape(encodeURIComponent(s)));
}
function b64decode(s: string) {
  return decodeURIComponent(escape(atob(s)));
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ThreeReach-Optimizer",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub ${path} ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.json();
}

async function ghRaw(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ThreeReach-Optimizer",
      ...(init.headers || {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub raw ${path} ${res.status}`);
  return res.text();
}

interface OptInput {
  repo: string; // "owner/name"
  baseBranch?: string;
  scope: string[]; // seo, geo, sitemap, perf
  brand: string;
  website?: string;
  description?: string;
}

async function aiPlanFiles(input: OptInput, indexHtml: string | null) {
  const sys =
    "You are an expert SEO/GEO/AEO optimization engineer. Generate production-ready file contents for a Vite/React project. Only output valid JSON matching the schema. Keep changes minimal but high-impact.";
  const user = `Brand: ${input.brand}
Website: ${input.website ?? "n/a"}
Description: ${input.description ?? "n/a"}
Scopes: ${input.scope.join(", ")}

Existing index.html (may be null):
${indexHtml ? indexHtml.slice(0, 4000) : "(none)"}

Tasks:
- If "seo" in scope: rewrite index.html <head> with optimized title (<60 chars), meta description (<160 chars), canonical, OG, Twitter card, and inline JSON-LD Organization + WebSite schema for the brand.
- If "geo" in scope: produce /public/llms.txt with concise AI-engine-optimized brand summary, key facts, and citation-ready sentences.
- If "sitemap" in scope: produce /public/sitemap.xml (homepage + common routes /, /about, /pricing) and /public/robots.txt allowing all and pointing to sitemap.
- If "perf" in scope: produce /public/_headers with sane caching, and ensure index.html includes <link rel="preconnect"> for fonts and font-display:swap if fonts are used.

Return JSON: { files: [{ path: string, content: string, reason: string }], summary: string }`;

  const res = await fetch(LOVABLE_AI, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "emit_files",
            description: "Emit the optimized files",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                files: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string" },
                      content: { type: "string" },
                      reason: { type: "string" },
                    },
                    required: ["path", "content", "reason"],
                  },
                },
              },
              required: ["files", "summary"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "emit_files" } },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
  }
  const j = await res.json();
  const tc = j.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) throw new Error("AI returned no tool call");
  return JSON.parse(tc.function.arguments) as {
    files: { path: string; content: string; reason: string }[];
    summary: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Missing Authorization" }, 401);

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userRes } = await supa.auth.getUser();
    const user = userRes?.user;
    if (!user) return json({ error: "Unauthenticated" }, 401);

    const body = await req.json();
    const action = body.action as "save_token" | "list_repos" | "run";

    // ---------- 1. Save / update PAT ----------
    if (action === "save_token") {
      const token = String(body.token || "").trim();
      if (!token.startsWith("github_pat_") && !token.startsWith("ghp_"))
        return json({ error: "Invalid GitHub token format" }, 400);
      // verify
      const me = await gh(token, "/user").catch(() => null);
      if (!me) return json({ error: "Token rejected by GitHub" }, 400);

      const enc = b64encode(token); // obfuscation; RLS is the real guard
      await supa
        .from("github_connections")
        .upsert(
          {
            user_id: user.id,
            github_username: me.login,
            encrypted_token: enc,
            scopes: ["repo"],
          },
          { onConflict: "user_id" },
        );
      return json({ ok: true, username: me.login });
    }

    // load token for the rest
    const { data: conn } = await supa
      .from("github_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!conn) return json({ error: "No GitHub connection" }, 400);
    const token = b64decode(conn.encrypted_token);

    // ---------- 2. List repos ----------
    if (action === "list_repos") {
      const repos = await gh(
        token,
        "/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator",
      );
      return json({
        username: conn.github_username,
        repos: (repos as any[]).map((r) => ({
          full_name: r.full_name,
          private: r.private,
          default_branch: r.default_branch,
          updated_at: r.updated_at,
        })),
      });
    }

    // ---------- 3. Run optimization & open PR ----------
    if (action === "run") {
      const repo = String(body.repo || "");
      const scope = (body.scope as string[]) || ["seo", "geo", "sitemap", "perf"];
      const website = body.website as string | undefined;
      const brand = String(body.brand || "Your Brand");
      const description = body.description as string | undefined;
      if (!repo.includes("/")) return json({ error: "Invalid repo" }, 400);

      // create run row
      const { data: runRow } = await supa
        .from("optimization_runs")
        .insert({
          user_id: user.id,
          repo,
          branch: "threereach/optimize",
          website_url: website,
          scope,
          status: "running",
        })
        .select()
        .single();

      try {
        const repoInfo = await gh(token, `/repos/${repo}`);
        const baseBranch = repoInfo.default_branch as string;
        const refData = await gh(
          token,
          `/repos/${repo}/git/ref/heads/${baseBranch}`,
        );
        const baseSha = refData.object.sha;

        const newBranch = `threereach/optimize-${Date.now()}`;
        await gh(token, `/repos/${repo}/git/refs`, {
          method: "POST",
          body: JSON.stringify({
            ref: `refs/heads/${newBranch}`,
            sha: baseSha,
          }),
        });

        // try to read existing index.html
        const indexHtml = await ghRaw(
          token,
          `/repos/${repo}/contents/index.html?ref=${baseBranch}`,
        );

        const plan = await aiPlanFiles(
          { repo, scope, brand, website, description, baseBranch },
          indexHtml,
        );

        // commit each file
        for (const f of plan.files) {
          const path = f.path.replace(/^\/+/, "");
          // get sha if file exists on new branch
          const existing = await fetch(
            `${GH}/repos/${repo}/contents/${path}?ref=${newBranch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "User-Agent": "ThreeReach-Optimizer",
                Accept: "application/vnd.github+json",
              },
            },
          );
          const existingJson = existing.ok ? await existing.json() : null;
          await gh(token, `/repos/${repo}/contents/${path}`, {
            method: "PUT",
            body: JSON.stringify({
              message: `chore(threereach): optimize ${path}`,
              content: b64encode(f.content),
              branch: newBranch,
              ...(existingJson?.sha ? { sha: existingJson.sha } : {}),
            }),
          });
        }

        const prBody = `## Three Reach AI Optimization

${plan.summary}

### Changes
${plan.files.map((f) => `- \`${f.path}\` — ${f.reason}`).join("\n")}

Scopes applied: ${scope.join(", ")}

> Auto-generated by Three Reach AI. Review changes before merging.`;

        const pr = await gh(token, `/repos/${repo}/pulls`, {
          method: "POST",
          body: JSON.stringify({
            title: `Three Reach AI: ${scope.join(" + ")} optimization`,
            head: newBranch,
            base: baseBranch,
            body: prBody,
          }),
        });

        await supa
          .from("optimization_runs")
          .update({
            status: "succeeded",
            branch: newBranch,
            pr_url: pr.html_url,
            pr_number: pr.number,
            files_changed: plan.files.length,
            summary: plan.summary,
            diff_preview: plan.files.map((f) => ({
              path: f.path,
              reason: f.reason,
            })),
          })
          .eq("id", runRow!.id);

        return json({
          ok: true,
          pr_url: pr.html_url,
          pr_number: pr.number,
          files: plan.files.length,
          summary: plan.summary,
        });
      } catch (e: any) {
        await supa
          .from("optimization_runs")
          .update({ status: "failed", error: String(e?.message || e) })
          .eq("id", runRow!.id);
        throw e;
      }
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e: any) {
    console.error("github-optimize error", e);
    return new Response(
      JSON.stringify({ error: String(e?.message || e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
