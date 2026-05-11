import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace, WorkspaceModule } from "./useWorkspace";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string | null;
  tool_name?: string | null;
  tool_input?: any;
  tool_output?: any;
  status?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  pinned: boolean;
  archived: boolean;
  last_message_at: string;
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const ws = useWorkspace();

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("chat_conversations")
      .select("id,title,pinned,archived,last_message_at")
      .eq("archived", false)
      .order("pinned", { ascending: false })
      .order("last_message_at", { ascending: false })
      .limit(50);
    setConversations((data ?? []) as Conversation[]);
  }, []);

  const newConversation = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data } = await supabase.from("chat_conversations")
      .insert({ user_id: u.user.id, title: "New chat" })
      .select().single();
    if (data) {
      setActiveId(data.id);
      setMessages([]);
      await loadConversations();
      return data.id;
    }
    return null;
  }, [loadConversations]);

  const selectConversation = useCallback(async (id: string) => {
    setActiveId(id);
    const { data } = await supabase.from("chat_messages")
      .select("*").eq("conversation_id", id).order("created_at", { ascending: true });
    setMessages((data ?? []) as ChatMessage[]);
  }, []);

  const renameConversation = useCallback(async (id: string, title: string) => {
    await supabase.from("chat_conversations").update({ title }).eq("id", id);
    loadConversations();
  }, [loadConversations]);

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from("chat_conversations").delete().eq("id", id);
    if (activeId === id) { setActiveId(null); setMessages([]); }
    loadConversations();
  }, [activeId, loadConversations]);

  const applyToolEffects = useCallback((tools: Array<{ name: string; args: any; output: any }>) => {
    for (const t of tools) {
      if (!t.output?.ok) continue;
      if (t.name === "open_module") {
        ws.setModule(t.output.module as WorkspaceModule);
        ws.setTab("preview");
      }
      if (t.name === "run_ai_scan") { ws.setModule("scan"); ws.setTab("preview"); }
      if (t.name === "analyze_brand") { ws.setModule("brand"); ws.setTab("preview"); }
      if (t.name === "generate_content") { ws.setModule("distribution"); ws.setTab("preview"); }
      if (t.name === "fetch_signals") { ws.setModule("overview"); ws.setTab("preview"); }
      if (t.name === "optimize_repo") {
        ws.setModule("optimize");
        ws.setTab("code");
        ws.setDiff({
          pr_url: t.output.pr_url,
          pr_number: t.output.pr_number,
          summary: t.output.summary,
          files: t.output.files ?? demoFiles(t.output.scope ?? ["seo","geo","sitemap","perf"]),
        });
      }
    }
  }, [ws]);

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    let convId = activeId;
    if (!convId) convId = await newConversation();
    if (!convId) return;

    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`, role: "user", content: text, created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-orchestrator", {
        body: { conversationId: convId, message: text },
      });
      if (error) throw error;
      // Reload from DB to get authoritative messages (including tool rows)
      const { data: msgs } = await supabase.from("chat_messages")
        .select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
      setMessages((msgs ?? []) as ChatMessage[]);
      applyToolEffects((data as any)?.tools ?? []);
      loadConversations();
    } catch (e: any) {
      setMessages((m) => [...m, {
        id: `err-${Date.now()}`, role: "assistant",
        content: `⚠️ ${e?.message ?? "Something went wrong."}`,
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
    }
  }, [activeId, newConversation, applyToolEffects, loadConversations]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  return {
    conversations, activeId, messages, sending,
    newConversation, selectConversation, renameConversation, deleteConversation, send,
  };
}

function demoFiles(scope: string[]) {
  const files: { path: string; patch: string }[] = [];
  if (scope.includes("seo")) files.push({
    path: "index.html",
    patch: `+ <title>Acme — Premium AEO Platform</title>\n+ <meta name="description" content="Be the answer AI engines cite." />\n+ <script type="application/ld+json">{ "@context":"https://schema.org","@type":"Organization","name":"Acme" }</script>`,
  });
  if (scope.includes("geo")) files.push({
    path: "public/llms.txt",
    patch: `+ # Acme\n+ Acme helps brands rank inside AI answer engines (ChatGPT, Gemini, Perplexity).\n+ Key facts:\n+ - Founded 2024\n+ - Trusted by 500+ teams`,
  });
  if (scope.includes("sitemap")) files.push({
    path: "public/sitemap.xml",
    patch: `+ <?xml version="1.0" encoding="UTF-8"?>\n+ <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n+   <url><loc>https://acme.com/</loc></url>\n+ </urlset>`,
  });
  if (scope.includes("perf")) files.push({
    path: "vercel.json",
    patch: `+ { "headers": [{ "source": "/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }] }`,
  });
  return files;
}
