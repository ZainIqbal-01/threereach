// Chat orchestrator: streams Lovable AI replies + executes tool-calls server-side.
// Tools proxy existing edge functions so the chat can drive every module.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Reach, the AI copilot for Three Reach AI — a proof-based AEO (Answer Engine Optimization) platform.

You operate inside a chat workspace that mirrors Lovable's editor. The user talks to you in the chat panel; the right side renders live results (Preview / Code / Files tabs).

You can:
- Run AI visibility scans across ChatGPT, Gemini, Perplexity, Claude, Copilot
- Analyze a brand's AI presence (immersive 3-phase scan)
- Open a GitHub Optimizer pull request that adds SEO/GEO/Sitemap/Performance fixes (demo mode if no GitHub connection)
- Generate content for Reddit, LinkedIn, X
- Switch the workspace pane to any module (Overview, Scan, Brand Intel, Optimize, Distribution, Agents, Reports, Settings, Footprint, Proof Tracking, Billing)

Style: concise, confident, action-oriented. Use markdown. Prefer calling tools over describing. After a tool runs, briefly summarize the result and suggest a next step.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "open_module",
      description: "Switch the right-hand workspace to a specific module view.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            enum: ["overview","scan","brand","optimize","distribution","agents","footprint","proof","reports","settings","billing"],
          },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_ai_scan",
      description: "Run an AI visibility scan across selected engines.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "What to ask the AI engines" },
          engines: { type: "array", items: { type: "string", enum: ["chatgpt","gemini","perplexity","claude","copilot"] } },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_brand",
      description: "Analyze a brand's AI presence given its website URL.",
      parameters: {
        type: "object",
        properties: { url: { type: "string" } },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "optimize_repo",
      description: "Open a GitHub PR with SEO/GEO/Sitemap/Performance optimizations. Falls back to demo mode if no GitHub connection.",
      parameters: {
        type: "object",
        properties: {
          repo: { type: "string", description: "owner/name (omit for demo)" },
          scope: { type: "array", items: { type: "string", enum: ["seo","geo","sitemap","perf"] } },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_content",
      description: "Generate AI-optimized content for a platform.",
      parameters: {
        type: "object",
        properties: {
          platform: { type: "string", enum: ["reddit","linkedin","x","blog"] },
          topic: { type: "string" },
        },
        required: ["platform","topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_signals",
      description: "Fetch recent public visibility signals for the user's brand.",
      parameters: { type: "object", properties: {} },
    },
  },
];

async function executeTool(name: string, args: any, supabase: any, authHeader: string) {
  try {
    switch (name) {
      case "open_module":
        return { ok: true, module: args.name };
      case "run_ai_scan": {
        const { data, error } = await supabase.functions.invoke("ai-scan", {
          body: { query: args.query, engines: args.engines ?? ["chatgpt","gemini","perplexity"] },
          headers: { Authorization: authHeader },
        });
        if (error) throw error;
        return { ok: true, ...data };
      }
      case "analyze_brand": {
        const { data, error } = await supabase.functions.invoke("analyze-brand", {
          body: { url: args.url },
          headers: { Authorization: authHeader },
        });
        if (error) throw error;
        return { ok: true, ...data };
      }
      case "optimize_repo": {
        // Always demo unless real connection exists; safe default.
        const { data: conn } = await supabase.from("github_connections").select("id").maybeSingle();
        if (!conn || !args.repo) {
          return {
            ok: true,
            demo: true,
            pr_url: "https://github.com/acme/marketing-site/pull/123",
            pr_number: 123,
            files_changed: 7,
            scope: args.scope ?? ["seo","geo","sitemap","perf"],
            summary: "Demo PR opened with SEO meta tags, JSON-LD schema, llms.txt, sitemap.xml and perf headers.",
          };
        }
        const { data, error } = await supabase.functions.invoke("github-optimize", {
          body: { action: "run", repo: args.repo, scope: args.scope ?? ["seo","geo","sitemap","perf"] },
          headers: { Authorization: authHeader },
        });
        if (error) throw error;
        return { ok: true, ...data };
      }
      case "generate_content": {
        const { data, error } = await supabase.functions.invoke("generate-content", {
          body: { platform: args.platform, topic: args.topic },
          headers: { Authorization: authHeader },
        });
        if (error) throw error;
        return { ok: true, ...data };
      }
      case "fetch_signals": {
        const { data, error } = await supabase.functions.invoke("public-signals", {
          body: {},
          headers: { Authorization: authHeader },
        });
        if (error) throw error;
        return { ok: true, ...data };
      }
      default:
        return { ok: false, error: "Unknown tool" };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const conversationId: string = body.conversationId;
    const userMessage: string = String(body.message ?? "").slice(0, 8000);
    if (!conversationId || !userMessage) {
      return new Response(JSON.stringify({ error: "conversationId and message required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist user message + load history
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId, user_id: user.id, role: "user", content: userMessage,
    });
    await supabase.from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content, tool_name, tool_output")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
    for (const m of history ?? []) {
      if (m.role === "tool") {
        messages.push({ role: "assistant", content: `Tool ${m.tool_name} result: ${JSON.stringify(m.tool_output).slice(0,1500)}` });
      } else if (m.content) {
        messages.push({ role: m.role, content: m.content });
      }
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Loop: allow up to 3 rounds of tool calls
    let assistantText = "";
    const toolEvents: Array<{ name: string; args: any; output: any }> = [];

    for (let round = 0; round < 3; round++) {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          tools: TOOLS,
          tool_choice: "auto",
        }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        if (resp.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please retry shortly." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (resp.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace settings." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AI gateway error", resp.status, t);
        return new Response(JSON.stringify({ error: "AI gateway error" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await resp.json();
      const choice = json.choices?.[0];
      const msg = choice?.message;
      if (!msg) break;

      if (msg.tool_calls && msg.tool_calls.length) {
        messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
        for (const tc of msg.tool_calls) {
          const name = tc.function?.name;
          let args: any = {};
          try { args = JSON.parse(tc.function?.arguments ?? "{}"); } catch {}
          const output = await executeTool(name, args, supabase, authHeader);
          toolEvents.push({ name, args, output });
          await supabase.from("chat_messages").insert({
            conversation_id: conversationId, user_id: user.id, role: "tool",
            tool_name: name, tool_input: args, tool_output: output, content: null,
          });
          messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(output).slice(0, 4000) });
        }
        continue; // ask the model to summarize
      }

      assistantText = msg.content ?? "";
      break;
    }

    if (!assistantText) assistantText = "Done.";

    await supabase.from("chat_messages").insert({
      conversation_id: conversationId, user_id: user.id, role: "assistant", content: assistantText,
    });

    // Auto-title new conversations
    const { count } = await supabase.from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", conversationId);
    if ((count ?? 0) <= 3) {
      const title = userMessage.slice(0, 60);
      await supabase.from("chat_conversations").update({ title }).eq("id", conversationId);
    }

    return new Response(JSON.stringify({ assistant: assistantText, tools: toolEvents }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("chat-orchestrator error", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
