import { Plus, MessageSquare, Trash2, Pin } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ConversationList() {
  const { conversations, activeId, selectConversation, newConversation, deleteConversation } = useChat();
  return (
    <div className="flex flex-col h-full">
      <button
        onClick={newConversation}
        className="m-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 btn-primary-glow"
      >
        <Plus className="h-4 w-4" /> New chat
      </button>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        <div className="text-[10px] uppercase tracking-wider text-sidebar-muted px-2 py-1.5">Recent</div>
        {conversations.length === 0 && (
          <div className="text-xs text-sidebar-muted px-2 py-3">No conversations yet</div>
        )}
        {conversations.map((c) => (
          <div key={c.id} className={cn(
            "group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all",
            activeId === c.id
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          )} onClick={() => selectConversation(c.id)}>
            {c.pinned ? <Pin className="h-3 w-3 flex-shrink-0" /> : <MessageSquare className="h-3 w-3 flex-shrink-0" />}
            <span className="flex-1 truncate">{c.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
