import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, engines, brandName } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const engineList = engines || ["ChatGPT", "Gemini", "Perplexity"];

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
                      position: { type: "number", description: "Position in recommendations, null if not found" },
                      context: { type: "string", description: "Simulated AI response snippet" }
                    },
                    required: ["engine", "status", "context"]
                  }
                }
              },
              required: ["results"],
              additionalProperties: false,
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "scan_results" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited." }), {
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
    console.error("ai-scan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
