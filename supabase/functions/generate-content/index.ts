import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, platform, brandName, industry } = await req.json();
    
    if (!topic || !platform) {
      return new Response(JSON.stringify({ error: "topic and platform are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const platformGuides: Record<string, string> = {
      reddit: "Write a Reddit post. Use markdown, be authentic and community-friendly. Include a disclaimer. Add engaging questions. Format with bullet points and bold text.",
      quora: "Write a Quora answer. Be helpful, authoritative, and detailed. Use numbered points. Sound like a knowledgeable professional sharing genuine advice.",
      linkedin: "Write a LinkedIn post. Use emojis sparingly, include stats, use line breaks for readability. Add relevant hashtags. Professional but engaging tone.",
      medium: "Write a Medium article with markdown headers, intro paragraph, multiple sections with h2/h3 headers, and a conclusion. Long-form, authoritative, SEO-friendly.",
      hackernews: "Write a Hacker News post. Technical, concise, data-driven. No marketing fluff. Appeal to developers and tech founders. Include technical details.",
      twitter: "Write a Twitter/X thread (5-7 tweets). Start with a hook. Use 🧵 emoji. Number each tweet. Include stats and actionable takeaways. End with a CTA.",
    };

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
                title: { type: "string", description: "Post/article title" },
                content: { type: "string", description: "Full post content" },
                hashtags: { type: "array", items: { type: "string" }, description: "Relevant hashtags" },
                estimatedEngagement: { type: "string", description: "Expected engagement level: low/medium/high" },
              },
              required: ["title", "content"],
              additionalProperties: false,
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generated_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
