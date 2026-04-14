import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandName, website, description, industry, competitors } = await req.json();
    
    if (!brandName || !website) {
      return new Response(JSON.stringify({ error: "brandName and website are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
- Competitors to benchmark: ${competitors?.length ? competitors.join(", ") : "None specified"}

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
                      reasons: { type: "array", items: { type: "string" } }
                    },
                    required: ["engine", "mentioned", "sentiment", "snippet", "reasons"]
                  }
                },
                gaps: { type: "array", items: { type: "string" } },
                improvementPlan: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] }
                    },
                    required: ["title", "description", "priority"]
                  }
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
                            sentiment: { type: "string", enum: ["positive", "neutral", "negative"] }
                          },
                          required: ["engine", "mentioned", "sentiment"]
                        }
                      }
                    },
                    required: ["name", "score", "status", "engines"]
                  }
                }
              },
              required: ["overallScore", "status", "engines", "gaps", "improvementPlan"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "brand_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-brand error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
