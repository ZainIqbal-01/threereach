import { useState, useMemo } from "react";
import { Activity, Pause, Play } from "lucide-react";
import { agents, agentList } from "@/components/agents/agentRegistry";
import type { ActivityEvent } from "@/hooks/useAgentSimulation";

interface Props {
  events: ActivityEvent[];
}

function relTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "now";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

export function LiveActivityStream({ events }: Props) {
  const [filter, setFilter] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const filtered = useMemo(
    () => (filter ? events.filter(e => e.agentId === filter) : events),
    [events, filter],
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card flex flex-col h-full min-h-[420px]">
      <div className="p-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Live activity</h3>
            <p className="text-[10px] text-muted-foreground">Real-time agent feed</p>
          </div>
        </div>
        <button
          onClick={() => setPaused(p => !p)}
          className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-md border border-border hover:bg-secondary transition-colors"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="px-4 py-2 border-b border-border/60 flex flex-wrap gap-1.5 overflow-x-auto">
        <button
          onClick={() => setFilter(null)}
          className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors ${
            filter === null
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:bg-secondary"
          }`}
        >
          All
        </button>
        {agentList.map(a => (
          <button
            key={a.id}
            onClick={() => setFilter(filter === a.id ? null : a.id)}
            className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-all ${
              filter === a.id ? "text-white border-transparent" : "border-border text-muted-foreground hover:bg-secondary"
            }`}
            style={
              filter === a.id
                ? { background: `hsl(${a.accentHue}, 75%, 55%)` }
                : undefined
            }
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className={`flex-1 overflow-y-auto p-2 space-y-1 ${paused ? "opacity-70" : ""}`}>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-[11px] text-muted-foreground italic">
            No activity yet — deploy an agent to begin.
          </div>
        )}
        {filtered.slice(0, 40).map((e, i) => {
          const a = agents[e.agentId];
          if (!a) return null;
          const accent = `hsl(${a.accentHue}, 75%, 55%)`;
          return (
            <div
              key={e.id}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-secondary/60 transition-colors animate-fade-in"
              style={i === 0 ? { animation: "slide-up 0.35s ease-out" } : undefined}
            >
              <span
                className="mt-1 h-2 w-2 rounded-full shrink-0"
                style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-bold" style={{ color: accent }}>{a.name}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">{e.type}</span>
                </div>
                <p className="text-[12px] text-foreground truncate">{e.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 mt-0.5">
                {relTime(e.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
