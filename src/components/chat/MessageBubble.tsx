import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/hooks/useChat";
import { Sparkles, User } from "lucide-react";
import { ToolCallCard } from "./ToolCallCard";

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === "tool") {
    return <ToolCallCard name={msg.tool_name ?? "tool"} input={msg.tool_input} output={msg.tool_output} />;
  }
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-card border border-border/60 text-foreground"
      }`}>
        {msg.content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-pre:bg-secondary prose-pre:text-foreground prose-code:text-foreground">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ) : <span className="text-muted-foreground italic">…</span>}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
