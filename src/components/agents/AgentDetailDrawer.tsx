import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarAgent } from "@/components/StarAgent";
import { CheckCircle2, Clock, Send, TrendingUp, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import type { AgentConfig } from "@/components/agents/agentRegistry";
import type { AgentRuntime, ActivityEvent } from "@/hooks/useAgentSimulation";

interface Props {
  agent: AgentConfig | null;
  runtime: AgentRuntime | null;
  activity: ActivityEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomDeploy: (label: string) => void;
}

function buildSparkData(seed: number) {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    tasks: Math.floor(((Math.sin(seed + i) + 1.2) * 6) + Math.random() * 4),
  }));
}

export function AgentDetailDrawer({ agent, runtime, activity, open, onOpenChange, onCustomDeploy }: Props) {
  const [customCmd, setCustomCmd] = useState("");

  if (!agent || !runtime) return null;
  const accent = `hsl(${agent.accentHue}, 75%, 55%)`;
  const data = buildSparkData(agent.accentHue);
  const agentEvents = activity.filter(e => e.agentId === agent.id).slice(0, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCmd.trim()) return;
    onCustomDeploy(customCmd.trim());
    setCustomCmd("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto p-0">
        <div
          className="p-6 mesh-bg border-b border-border/60"
          style={{ background: `linear-gradient(135deg, hsl(${agent.accentHue}, 80%, 96%), transparent)` }}
        >
          <SheetHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="rounded-full p-1" style={{ background: `hsl(${agent.accentHue}, 80%, 92%)` }}>
                  <StarAgent mood={agent.activeMood} size={56} animate />
                </div>
                <span className="absolute -bottom-1 -right-1 text-[11px] bg-card border border-border rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {agent.emoji}
                </span>
              </div>
              <div>
                <SheetTitle style={{ color: accent }} className="text-xl">
                  {agent.name}
                </SheetTitle>
                <SheetDescription className="text-xs">{agent.role} · {agent.module}</SheetDescription>
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{agent.description}</p>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <StatBox icon={CheckCircle2} label="Today" value={runtime.tasksToday} accent={accent} />
            <StatBox icon={TrendingUp} label="Success" value={`${runtime.successRate}%`} accent={accent} />
            <StatBox icon={Clock} label="Queued" value={runtime.queue.length} accent={accent} />
          </div>

          {/* Performance chart */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <Activity className="h-3 w-3" /> 7-day performance
            </h4>
            <div className="h-32 rounded-xl border border-border/60 bg-card p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`grad-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip wrapperClassName="!outline-none" contentStyle={{}} />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke={accent}
                    strokeWidth={2}
                    fill={`url(#grad-${agent.id})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mission log */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Recent activity
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {agentEvents.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">No recent events</p>
              )}
              {agentEvents.map(e => (
                <div key={e.id} className="flex items-start gap-2 py-1.5 text-[11px] border-b border-border/30 last:border-0">
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />
                  <p className="flex-1 text-foreground">{e.message}</p>
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                    {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom command */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Send custom command
            </h4>
            <div className="flex gap-2">
              <Input
                value={customCmd}
                onChange={e => setCustomCmd(e.target.value)}
                placeholder={`e.g. "Run a custom scan…"`}
                className="text-[12px] h-9"
              />
              <Button type="submit" size="sm" className="h-9" style={{ background: accent }}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Will be added to {agent.name}'s queue.</p>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatBox({ icon: Icon, label, value, accent }: { icon: any; label: string; value: any; accent: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3">
      <Icon className="h-3 w-3 mb-1" style={{ color: accent }} />
      <div className="text-base font-bold tabular-nums" style={{ color: accent }}>{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
