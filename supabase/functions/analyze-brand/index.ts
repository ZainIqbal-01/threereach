/**
 * Analyze Brand Edge Function — Hardened
 *
 * Security measures:
 * - IP-based rate limiting (5 req/min — heavier operation)
 * - Strict input validation with length limits
 * - URL validation (http/https only)
 * - Competitor array size cap
 * - No client-side key exposure
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsResponse,
  jsonResponse,
  errorResponse,
  checkRateLimit,
  sanitizeString,
  sanitizeUrl,
  enforceLength,
  safeParseBody,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  // ── Rate limit: 5 requests per minute (expensive AI operation) ──
  const rateLimited = checkRateLimit(req, { maxRequests: 5, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    // ── Parse & validate body ──
    const body = await safeParseBody(req);
    if (!body) {
      return errorResponse("Invalid or oversized request body", 400);
    }

    const brandName = enforceLength(sanitizeString(body.brandName), 200);
    const website = sanitizeUrl(body.website);
    const description = enforceLength(sanitizeString(body.description), 1000);
    const industry = enforceLength(sanitizeString(body.industry), 100);
    const detailedInfo = enforceLength(sanitizeString(body.detailedInfo), 5000);
    const targetAudience = enforceLength(sanitizeString(body.targetAudience), 500);

    const rawCompetitors = Array.isArray(body.competitors) ? body.competitors : [];
    const competitors = rawCompetitors
      .slice(0, 10)
      .map((c: unknown) => enforceLength(sanitizeString(c), 200))
      .filter(Boolean);

    // Enrichment: links + uploaded resource titles. Each capped, max 20.
    const rawResources = Array.isArray(body.resources) ? body.resources : [];
    const resources = rawResources
      .slice(0, 20)
      .map((r: unknown) => {
        if (!r || typeof r !== "object") return null;
        const obj = r as Record<string, unknown>;
        return {
          type: enforceLength(sanitizeString(obj.type), 20),
          name: enforceLength(sanitizeString(obj.name), 200),
          url: sanitizeUrl(obj.url),
        };
      })
      .filter((r): r is { type: string; name: string; url: string } => !!r && !!r.name);

    if (!brandName) {
      return errorResponse("brandName is required (max 200 chars)", 400);
    }
    if (!website) {
      return errorResponse("A valid website URL is required", 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return errorResponse("Service configuration error", 503);
    }

    const enrichmentBlock = [
      detailedInfo ? `Additional brand context provided by the founder:\n${detailedInfo}` : "",
      targetAudience ? `Target audience: ${targetAudience}` : "",
      resources.length
        ? `Supporting resources (titles + links):\n${resources.map((r) => `- [${r.type}] ${r.name}${r.url ? ` (${r.url})` : ""}`).join("\n")}`
        : "",
    ].filter(Boolean).join("\n\n");

    const systemPrompt = `You are an AI Brand Visibility Analyst. Analyze how visible a brand is across AI engines (ChatGPT, Gemini, Perplexity). Ground your analysis in any user-provided context. Return a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "status": "<invisible|weak|visible|strong>",
  "engines": [...],
  "gaps": [...],
  "improvementPlan": [...],
  "competitors": [...]
}

Be realistic. Score lower for unknown brands. Use the founder-provided context to inform gaps and recommendations.`;

    const userPrompt = `Analyze brand visibility for:
- Brand: ${brandName}
- Website: ${website}
- Industry: ${industry || "Not specified"}
- Description: ${description || "Not provided"}
- Competitors to benchmark: ${competitors.length ? competitors.join(", ") : "None specified"}

${enrichmentBlock || "No additional context provided."}

Provide a thorough, realistic analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "brand_analysis",
            description: "Return brand visibility analysis results",
            parameters: {
              type: "object",
              properties: {
                overallScore: { type: "number" },
                status: { type: "string", enum: ["invisible", "weak", "visible", "strong"] },
                engines: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      engine: { type: "string" },
                      mentioned: { type: "boolean" },
                      position: { type: "number" },
                      sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                      snippet: { type: "string" },
                      reasons: { type: "array", items: { type: "string" } },
                    },
                    required: ["engine", "mentioned", "sentiment", "snippet", "reasons"],
                  },
                },
                gaps: { type: "array", items: { type: "string" } },
                improvementPlan: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: ["title", "description", "priority"],
                  },
                },
                competitors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      score: { type: "number" },
                      status: { type: "string", enum: ["invisible", "weak", "visible", "strong"] },
                      engines: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            engine: { type: "string" },
                            mentioned: { type: "boolean" },
                            sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                          },
                          required: ["engine", "mentioned", "sentiment"],
                        },
                      },
                    },
                    required: ["name", "score", "status", "engines"],
                  },
                },
              },
              required: ["overallScore", "status", "engines", "gaps", "improvementPlan"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "brand_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return errorResponse("Rate limited by AI provider. Try again shortly.", 429);
      if (response.status === 402) return errorResponse("AI credits exhausted.", 402);
      console.error("AI gateway error:", response.status);
      return errorResponse("AI service temporarily unavailable", 502);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in AI response");
      return errorResponse("Unexpected AI response format", 502);
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    return jsonResponse(analysis);
  } catch (e) {
    console.error("analyze-brand error:", e);
    return errorResponse("An internal error occurred. Please try again.", 500);
  }
});
