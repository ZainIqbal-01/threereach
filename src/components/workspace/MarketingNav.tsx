// Marketing OS sidebar: rail of category icons + expandable module list.
import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useTheme } from "@/hooks/useTheme";
import { MARKETING_CATEGORIES, MARKETING_MODULES } from "@/lib/marketingModules";
import { ChevronRight, MessageSquarePlus, Sparkles, Sun, Moon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { Input } from "@/components/ui/input";

export function MarketingNav() {
  const { module, setModule, setTab } = useWorkspace();
  const { dark, toggle } = useTheme();
  const { conversations, activeId, selectConversation, newConversation, deleteConversation } = useChat();
  const [activeCat, setActiveCat] = useState<string>("core");
  const [view, setView] = useState<"modules" | "chats">("modules");
  const [q, setQ] = useState("");

  const cat = MARKETING_CATEGORIES.find((c) => c.id === activeCat) ?? MARKETING_CATEGORIES[0];
  const modules = cat.modules
    .map((id) => MARKETING_MODULES[id])
    .filter((m) => !q || m.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-full bg-sidebar border-r border-sidebar-border">
      {/* Category rail */}
      <div className="w-12 flex flex-col items-center py-2 gap-0.5 border-r border-sidebar-border overflow-y-auto">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mb-1">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        {MARKETING_CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = activeCat === c.id;
          return (
            <button
              key={c.id}
              title={c.label}
              onClick={() => { setActiveCat(c.id); setView("modules"); }}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all relative group",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="absolute left-10 px-1.5 py-0.5 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {c.label}
              </span>
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          onClick={toggle}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          title="Toggle theme"
        >
          {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Module / chat list */}
      <div className="w-56 flex flex-col">
        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="text-xs font-semibold text-sidebar-foreground">Three Reach</div>
          <div className="text-[10px] text-sidebar-muted">Marketing OS</div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 px-2 py-2 border-b border-sidebar-border">
          <button
            onClick={() => setView("modules")}
            className={cn(
              "flex-1 text-[11px] py-1 rounded-md transition-colors",
              view === "modules" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60"
            )}
          >
            Modules
          </button>
          <button
            onClick={() => setView("chats")}
            className={cn(
              "flex-1 text-[11px] py-1 rounded-md transition-colors",
              view === "chats" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60"
            )}
          >
            Chats
          </button>
        </div>

        {view === "modules" ? (
          <>
            <div className="px-2 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-sidebar-foreground/40" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search modules…"
                  className="h-7 text-[11px] pl-7 bg-sidebar-accent/40 border-sidebar-border"
                />
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-muted px-3 pb-1">{cat.label}</div>
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
              {modules.map((m) => {
                const Icon = m.icon;
                const active = module === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setModule(m.id); setTab("preview"); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-all",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1 truncate">{m.label}</span>
                    {!active && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                  </button>
                );
              })}
              {modules.length === 0 && (
                <div className="text-[11px] text-sidebar-muted px-2 py-3">No matches.</div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={newConversation}
              className="m-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" /> New chat
            </button>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-muted px-3 pb-1">Recent</div>
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
              {conversations.length === 0 && (
                <div className="text-[11px] text-sidebar-muted px-2 py-3">No conversations yet</div>
              )}
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer",
                    activeId === c.id ? "bg-sidebar-accent" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                  )}
                >
                  <span className="flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-sidebar-muted hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
