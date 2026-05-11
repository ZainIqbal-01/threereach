import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { useBusinessName } from "@/hooks/useBusinessName";

const SUGGESTIONS = [
  { label: "Run an AI visibility scan", prompt: "Run an AI visibility scan across ChatGPT, Gemini and Perplexity for my brand." },
  { label: "Optimize my site", prompt: "Optimize my website with SEO + GEO + sitemap + performance and open a pull request." },
  { label: "Analyze a competitor", prompt: "Analyze the brand presence of stripe.com in AI answer engines." },
  { label: "Draft a LinkedIn post", prompt: "Generate a LinkedIn post about why AEO matters in 2026." },
];

export function ChatPanel() {
  const { messages, sending, send, activeId, newConversation } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const businessName = useBusinessName();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const submit = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    await send(text);
  };

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {empty && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mb-4">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold gradient-text mb-1">How can I help, {businessName}?</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Ask anything about your AI visibility. I can scan engines, analyze competitors, optimize your code and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map(s => (
                <button key={s.label} onClick={() => send(s.prompt)}
                  className="text-left text-xs p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => <MessageBubble key={m.id} msg={m} />)}
        {sending && (
          <div className="flex gap-3 items-center text-muted-foreground text-sm animate-fade-in">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
            </div>
            <span>Thinking…</span>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-3 bg-card/60 backdrop-blur">
        <div className="relative rounded-2xl border border-border bg-background focus-within:border-primary/50 focus-within:shadow-glow transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            placeholder="Ask Reach to scan, analyze or optimize…"
            className="min-h-[56px] max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 pr-12 text-sm"
          />
          <Button
            size="icon"
            onClick={submit}
            disabled={!input.trim() || sending}
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg btn-primary-glow"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[11px] text-muted-foreground">⏎ to send · Shift+⏎ for newline</span>
          {!activeId && (
            <button onClick={newConversation} className="text-[11px] text-primary hover:underline">+ New chat</button>
          )}
        </div>
      </div>
    </div>
  );
}
