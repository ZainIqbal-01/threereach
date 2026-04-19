import { Activity, CheckCircle2, Pause, Layers, Play, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarAgent } from "@/components/StarAgent";

interface FleetStatusBarProps {
  active: number;
  idle: number;
  paused: number;
  tasksToday: number;
  queueDepth: number;
  total: number;
  onDeployAll: () => void;
  onPauseAll: () => void;
}

export function FleetStatusBar({
  active,
  idle,
  paused,
  tasksToday,
  queueDepth,
  total,
  onDeployAll,
  onPauseAll,
}: FleetStatusBarProps) {
  const stats = [
    { label: "Active", value: active, icon: Activity, tone: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success)/0.1)]" },
    { label: "Idle", value: idle, icon: Pause, tone: "text-muted-foreground", bg: "bg-secondary" },
    { label: "Paused", value: paused, icon: PowerOff, tone: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning)/0.1)]" },
    { label: "Done today", value: tasksToday, icon: CheckCircle2, tone: "text-primary", bg: "bg-primary/10" },
    { label: "Queued", value: queueDepth, icon: Layers, tone: "text-[hsl(var(--accent))]", bg: "bg-[hsl(var(--accent)/0.1)]" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card mesh-bg p-5 sm:p-6 shadow-card">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/[0.04] via-transparent to-[hsl(var(--accent)/0.04)]" />
      <div className="relative flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <StarAgent mood="excited" size={56} animate />
            <span className="absolute -bottom-1 -right-1 text-[10px] bg-card border border-border rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              ⚡
            </span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Agent Command Center
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Deploy, monitor, and orchestrate your {total} AI agents in real time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {stats.map(s => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-xl border border-border/50 px-3 py-2 ${s.bg}`}
            >
              <s.icon className={`h-3.5 w-3.5 ${s.tone}`} />
              <div className="flex items-baseline gap-1.5">
                <span className={`text-base font-bold tabular-nums ${s.tone}`}>{s.value}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-border/50">
        <Button onClick={onDeployAll} size="sm" className="btn-shimmer gap-1.5">
          <Play className="h-3.5 w-3.5" />
          Deploy all
        </Button>
        <Button onClick={onPauseAll} size="sm" variant="outline" className="gap-1.5">
          <Pause className="h-3.5 w-3.5" />
          Pause all
        </Button>
        <span className="text-[11px] text-muted-foreground ml-auto">
          Live • Updated continuously
        </span>
      </div>
    </div>
  );
}
