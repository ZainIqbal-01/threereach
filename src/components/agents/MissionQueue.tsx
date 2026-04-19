import { Loader2, Clock, CheckCircle2, Layers } from "lucide-react";
import { agents } from "@/components/agents/agentRegistry";
import type { AgentRuntime, CompletedTask } from "@/hooks/useAgentSimulation";

interface Props {
  runtimes: Record<string, AgentRuntime>;
  completed: CompletedTask[];
}

function relTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function MissionQueue({ runtimes, completed }: Props) {
  const inProgress = Object.values(runtimes).filter(r => r.current).map(r => r.current!);
  const queued = Object.values(runtimes).flatMap(r => r.queue);

  const columns = [
    {
      key: "progress",
      title: "In progress",
      icon: Loader2,
      iconClass: "animate-spin",
      tone: "text-primary",
      bg: "bg-primary/5",
      count: inProgress.length,
    },
    {
      key: "queued",
      title: "Queued",
      icon: Clock,
      iconClass: "",
      tone: "text-[hsl(var(--accent))]",
      bg: "bg-[hsl(var(--accent)/0.05)]",
      count: queued.length,
    },
    {
      key: "done",
      title: "Completed today",
      icon: CheckCircle2,
      iconClass: "",
      tone: "text-[hsl(var(--success))]",
      bg: "bg-[hsl(var(--success)/0.05)]",
      count: completed.length,
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Layers className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Mission queue</h3>
          <p className="text-[10px] text-muted-foreground">All tasks across the fleet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {columns.map(col => (
          <div key={col.key} className={`rounded-xl border border-border/50 ${col.bg} p-3 flex flex-col min-h-[260px]`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <col.icon className={`h-3.5 w-3.5 ${col.tone} ${col.iconClass}`} />
                <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">{col.title}</span>
              </div>
              <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-md bg-card border border-border ${col.tone}`}>
                {col.count}
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
              {col.key === "progress" && inProgress.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic text-center py-4">No active tasks</p>
              )}
              {col.key === "progress" &&
                inProgress.map(t => {
                  const a = agents[t.agentId];
                  const accent = `hsl(${a.accentHue}, 75%, 55%)`;
                  return (
                    <div key={t.id} className="rounded-lg bg-card border border-border/60 p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
                          {a.name}
                        </span>
                        <span className="ml-auto text-[10px] font-semibold tabular-nums" style={{ color: accent }}>
                          {Math.round(t.progress)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground font-medium truncate">{t.mission.label}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${t.progress}%`,
                            background: `linear-gradient(90deg, hsl(${a.accentHue}, 75%, 55%), hsl(${a.accentHue}, 85%, 65%))`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

              {col.key === "queued" && queued.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic text-center py-4">Queue is clear</p>
              )}
              {col.key === "queued" &&
                queued.slice(0, 12).map(t => {
                  const a = agents[t.agentId];
                  const accent = `hsl(${a.accentHue}, 75%, 55%)`;
                  return (
                    <div key={t.id} className="rounded-lg bg-card border border-border/60 p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
                          {a.name}
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {t.etaSec}s
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground truncate">{t.mission.label}</p>
                    </div>
                  );
                })}

              {col.key === "done" && completed.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic text-center py-4">Nothing completed yet</p>
              )}
              {col.key === "done" &&
                completed.slice(0, 12).map(t => {
                  const a = agents[t.agentId];
                  const accent = `hsl(${a.accentHue}, 75%, 55%)`;
                  return (
                    <div key={t.id} className="rounded-lg bg-card border border-border/60 p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
                          {a.name}
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                          {relTime(t.completedAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground font-medium truncate">{t.mission.label}</p>
                      <p className="text-[10px] text-[hsl(var(--success))] mt-0.5 truncate">✓ {t.result}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
