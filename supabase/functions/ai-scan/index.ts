/**
 * AI Scan Edge Function — Hardened
 * 
 * Security measures:
 * - IP-based rate limiting (10 req/min)
 * - Strict input validation with length limits
 * - Input sanitization against XSS/injection
 * - No client-side key exposure
 * - Graceful error responses (no stack leaks)
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsResponse,
  jsonResponse,
  errorResponse,
  checkRateLimit,
  sanitizeString,
  enforceLength,
  validateStringArray,
  safeParseBody,
} from "../_shared/security.ts";

const ALLOWED_ENGINES = ["ChatGPT", "Gemini", "Perplexity", "Claude", "Copilot"];

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  // ── Rate limit: 10 requests per minute per IP ──
  const rateLimited = checkRateLimit(req, { maxRequests: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  // ── Only accept POST ──
  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    // ── Parse & validate body ──
    const body = await safeParseBody(req);
    if (!body) {
      return errorResponse("Invalid or oversized request body", 400);
    }

    const query = enforceLength(sanitizeString(body.query), 500);
    const brandName = enforceLength(sanitizeString(body.brandName), 200);
    const engines = validateStringArray(body.engines, ALLOWED_ENGINES, 5);

    if (!query) {
      return errorResponse("query is required (max 500 chars)", 400);
    }

    // ── Retrieve API key from environment (never hardcoded) ──
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return errorResponse("Service configuration error", 503);
    }

    const engineList = engines.length > 0 ? engines : ["ChatGPT", "Gemini", "Perplexity"];

    const systemPrompt = `You are simulating how different AI engines (ChatGPT, Gemini, Perplexity) would respond to a user query. For each engine, determine if the brand "${brandName || "the user's brand"}" would be mentioned, at what position, and generate a realistic snippet of how the AI would reference (or not reference) the brand. Be realistic - most small/medium brands won't be mentioned prominently.`;

    const userPrompt = `Simulate how these AI engines would respond to the query: "${query}"

Engines to simulate: ${engineList.join(", ")}
Brand to check for: ${brandName || "Unknown brand"}

For each engine, provide a realistic assessment.`;

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
            name: "scan_results",
            description: "Return AI scan results for each engine",
            parameters: {
              type: "object",
              properties: {
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      engine: { type: "string" },
                      status: { type: "string", enum: ["mentioned", "weak", "not_found"] },
                      position: { type: "number" },
                      context: { type: "string" },
                    },
                    required: ["engine", "status", "context"],
                  },
                },
              },
              required: ["results"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "scan_results" } },
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

    const result = JSON.parse(toolCall.function.arguments);
    return jsonResponse(result);
  } catch (e) {
    console.error("ai-scan error:", e);
    // Never expose internal error details to clients (OWASP A09)
    return errorResponse("An internal error occurred. Please try again.", 500);
  }
});
