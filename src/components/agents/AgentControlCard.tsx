import { useState } from "react";
import { Loader2, ChevronDown, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StarAgent } from "@/components/StarAgent";
import type { AgentConfig } from "@/components/agents/agentRegistry";
import type { AgentRuntime } from "@/hooks/useAgentSimulation";

interface Props {
  agent: AgentConfig;
  runtime: AgentRuntime;
  onToggle: (active: boolean) => void;
  onDeployMission: (missionId: string) => void;
  onOpenDetail: () => void;
}

function relTime(ts: number | null) {
  if (!ts) return "Never";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function AgentControlCard({ agent, runtime, onToggle, onDeployMission, onOpenDetail }: Props) {
  const isActive = runtime.status === "active";
  const isPaused = runtime.status === "paused";
  const accent = `hsl(${agent.accentHue}, 75%, 55%)`;
  const accentSoft = `hsl(${agent.accentHue}, 80%, 95%)`;

  const statusLabel = isActive ? "Active" : isPaused ? "Paused" : "Idle";
  const statusTone = isActive
    ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.25)]"
    : isPaused
    ? "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.25)]"
    : "bg-secondary text-muted-foreground border-border";

  const upNext = runtime.queue.slice(0, 3);

  return (
    <div
      className="relative group rounded-2xl border border-border/60 bg-card p-4 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
      style={isActive ? { boxShadow: `0 0 0 1px hsl(${agent.accentHue}, 75%, 55%, 0.18), 0 8px 24px -10px hsl(${agent.accentHue}, 75%, 50%, 0.18)` } : undefined}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <button onClick={onOpenDetail} className="relative shrink-0 group/avatar" aria-label={`Open ${agent.name} details`}>
          {isActive && (
            <span
              className="absolute -inset-1.5 rounded-full halo-pulse"
              style={{ background: `radial-gradient(circle, hsl(${agent.accentHue}, 80%, 60%, 0.35), transparent 70%)` }}
            />
          )}
          <div
            className="relative rounded-full p-1"
            style={{ background: accentSoft }}
          >
            <StarAgent mood={isActive ? agent.activeMood : agent.defaultMood} size={42} animate />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px] bg-card border border-border rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
            {agent.emoji}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onOpenDetail}
              className="text-sm font-bold hover:underline underline-offset-2"
              style={{ color: accent }}
            >
              {agent.name}
            </button>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-semibold uppercase tracking-wide ${statusTone}`}>
              {statusLabel}
            </span>
            {(agent.id === "scout" || agent.id === "oracle") && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-success/10 text-success border border-success/20 font-semibold uppercase tracking-wide flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-success live-dot" />
                Live
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{agent.role}</p>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          aria-label={`${isActive ? "Pause" : "Deploy"} ${agent.name}`}
        />
      </div>

      {/* Now doing */}
      <div className="rounded-xl border border-border/40 bg-secondary/40 p-2.5 mb-2.5 min-h-[58px]">
        <div className="flex items-center gap-1.5 mb-1.5">
          {isActive && runtime.current ? (
            <Loader2 className="h-3 w-3 animate-spin" style={{ color: accent }} />
          ) : (
            <CheckCircle2 className="h-3 w-3 text-muted-foreground/60" />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {isActive && runtime.current ? "Now doing" : "Standing by"}
          </span>
          {isActive && runtime.current && (
            <span className="ml-auto text-[10px] font-semibold tabular-nums" style={{ color: accent }}>
              {Math.round(runtime.current.progress)}%
            </span>
          )}
        </div>
        {isActive && runtime.current ? (
          <>
            <p className="text-[12px] font-medium text-foreground truncate">
              {runtime.current.mission.label}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden relative progress-shimmer">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${runtime.current.progress}%`,
                  background: `linear-gradient(90deg, hsl(${agent.accentHue}, 75%, 55%), hsl(${agent.accentHue}, 85%, 65%))`,
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">{agent.statusMessages.idle}</p>
        )}
      </div>

      {/* Up next */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Up next</span>
          <span className="text-[10px] text-muted-foreground">{runtime.queue.length} queued</span>
        </div>
        <div className="space-y-1">
          {upNext.length === 0 && (
            <p className="text-[11px] text-muted-foreground/70 italic">Queue is empty</p>
          )}
          {upNext.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 text-[11px] py-1">
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: accent, opacity: 1 - i * 0.25 }}
              />
              <span className="text-foreground truncate flex-1">{q.mission.label}</span>
              <span className="text-muted-foreground tabular-nums shrink-0 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {q.etaSec}s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3 pt-2.5 border-t border-border/40">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-2.5 w-2.5" />
          <span className="font-semibold text-foreground tabular-nums">{runtime.tasksToday}</span> today
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="h-2.5 w-2.5" />
          <span className="font-semibold text-foreground tabular-nums">{runtime.successRate}%</span> success
        </span>
        <span>Last run {relTime(runtime.lastRun)}</span>
      </div>

      {/* Quick deploy */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-between text-[12px] h-8"
            style={{ borderColor: `hsl(${agent.accentHue}, 75%, 55%, 0.3)`, color: accent }}
          >
            Deploy mission
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wide">
            {agent.name}'s missions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {agent.missions.map(m => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => onDeployMission(m.id)}
              className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
            >
              <span className="text-[12px] font-medium">{m.label}</span>
              <span className="text-[10px] text-muted-foreground">{m.description} · ~{m.durationSec}s</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
