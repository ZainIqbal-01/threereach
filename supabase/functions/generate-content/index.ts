/**
 * Generate Content Edge Function — Hardened
 *
 * Security measures:
 * - IP-based rate limiting (10 req/min)
 * - Platform allowlist validation
 * - Input length limits on all fields
 * - No client-side key exposure
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

const ALLOWED_PLATFORMS = ["reddit", "quora", "linkedin", "medium", "hackernews", "twitter"];

const platformGuides: Record<string, string> = {
  reddit: "Write a Reddit post. Use markdown, be authentic and community-friendly. Include a disclaimer. Add engaging questions. Format with bullet points and bold text.",
  quora: "Write a Quora answer. Be helpful, authoritative, and detailed. Use numbered points. Sound like a knowledgeable professional sharing genuine advice.",
  linkedin: "Write a LinkedIn post. Use emojis sparingly, include stats, use line breaks for readability. Add relevant hashtags. Professional but engaging tone.",
  medium: "Write a Medium article with markdown headers, intro paragraph, multiple sections with h2/h3 headers, and a conclusion. Long-form, authoritative, SEO-friendly.",
  hackernews: "Write a Hacker News post. Technical, concise, data-driven. No marketing fluff. Appeal to developers and tech founders. Include technical details.",
  twitter: "Write a Twitter/X thread (5-7 tweets). Start with a hook. Use 🧵 emoji. Number each tweet. Include stats and actionable takeaways. End with a CTA.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  // ── Rate limit: 10 requests per minute per IP ──
  const rateLimited = checkRateLimit(req, { maxRequests: 10, windowMs: 60_000 });
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

    const topic = enforceLength(sanitizeString(body.topic), 500);
    const platform = sanitizeString(body.platform).toLowerCase();
    const brandName = enforceLength(sanitizeString(body.brandName), 200);
    const industry = enforceLength(sanitizeString(body.industry), 100);

    if (!topic) {
      return errorResponse("topic is required (max 500 chars)", 400);
    }
    if (!ALLOWED_PLATFORMS.includes(platform)) {
      return errorResponse(`platform must be one of: ${ALLOWED_PLATFORMS.join(", ")}`, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return errorResponse("Service configuration error", 503);
    }

    const systemPrompt = `You are an expert content strategist specializing in AI Engine Optimization (AEO) and brand visibility. Generate platform-optimized content that naturally promotes a brand while providing genuine value. ${platformGuides[platform] || "Write engaging content."}`;

    const userPrompt = `Generate content about "${topic}" for ${platform}.
${brandName ? `Brand: ${brandName}` : ""}
${industry ? `Industry: ${industry}` : ""}

Make it authentic, valuable, and optimized for the platform's audience. The content should subtly position the brand as an authority without being overtly promotional.`;

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
            name: "generated_content",
            description: "Return the generated content",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                estimatedEngagement: { type: "string" },
              },
              required: ["title", "content"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generated_content" } },
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
    console.error("generate-content error:", e);
    return errorResponse("An internal error occurred. Please try again.", 500);
  }
});
