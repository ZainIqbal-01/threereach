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

    // Validate competitors: max 10, each max 200 chars
    const rawCompetitors = Array.isArray(body.competitors) ? body.competitors : [];
    const competitors = rawCompetitors
      .slice(0, 10)
      .map((c: unknown) => enforceLength(sanitizeString(c), 200))
      .filter(Boolean);

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

    const systemPrompt = `You are an AI Brand Visibility Analyst. Analyze how visible a brand is across AI engines (ChatGPT, Gemini, Perplexity). Return a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "status": "<invisible|weak|visible|strong>",
  "engines": [
    {
      "engine": "ChatGPT",
      "mentioned": <boolean>,
      "position": <number or null>,
      "sentiment": "<positive|neutral|negative>",
      "snippet": "<realistic AI response snippet about this brand>",
      "reasons": ["<reason1>", "<reason2>", "<reason3>"]
    },
    { same for "Gemini" },
    { same for "Perplexity" }
  ],
  "gaps": ["<gap1>", "<gap2>", "<gap3>", "<gap4>", "<gap5>"],
  "improvementPlan": [
    { "title": "<action>", "description": "<details>", "priority": "<high|medium|low>" }
  ],
  "competitors": [
    {
      "name": "<competitor name>",
      "score": <number 0-100>,
      "status": "<invisible|weak|visible|strong>",
      "engines": [
        { "engine": "ChatGPT", "mentioned": <boolean>, "sentiment": "<positive|neutral|negative>" },
        { "engine": "Gemini", "mentioned": <boolean>, "sentiment": "<positive|neutral|negative>" },
        { "engine": "Perplexity", "mentioned": <boolean>, "sentiment": "<positive|neutral|negative>" }
      ]
    }
  ]
}

Be realistic. Score lower for unknown brands. Provide actionable, specific gaps and improvement plans.`;

    const userPrompt = `Analyze brand visibility for:
- Brand: ${brandName}
- Website: ${website}
- Industry: ${industry || "Not specified"}
- Description: ${description || "Not provided"}
- Competitors to benchmark: ${competitors.length ? competitors.join(", ") : "None specified"}

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
