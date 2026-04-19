import { useMemo, useState } from "react";
import { format, formatDistanceToNow, isToday, isTomorrow, startOfDay } from "date-fns";
import { CalendarClock, Plus, Trash2, Power, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { agentList, agents } from "@/components/agents/agentRegistry";
import {
  CADENCE_LABEL,
  type AgentSchedule,
  type ScheduleCadence,
  type UpcomingRun,
} from "@/hooks/useAgentSchedules";

interface Props {
  schedules: AgentSchedule[];
  upcomingRuns: (days?: number) => UpcomingRun[];
  onAdd: (agentId: string, missionId: string, cadence: ScheduleCadence) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const CADENCES: ScheduleCadence[] = ["hourly", "every_6h", "every_12h", "daily", "weekly"];

function dayLabel(d: Date) {
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEE, MMM d");
}

export function AgentScheduler({ schedules, upcomingRuns, onAdd, onRemove, onToggle }: Props) {
  const [agentId, setAgentId] = useState<string>("scout");
  const [missionId, setMissionId] = useState<string>(agents.scout.missions[0].id);
  const [cadence, setCadence] = useState<ScheduleCadence>("every_6h");

  const agent = agents[agentId];

  const handleAgentChange = (v: string) => {
    setAgentId(v);
    setMissionId(agents[v].missions[0].id);
  };

  const handleAdd = () => {
    onAdd(agentId, missionId, cadence);
  };

  const runs = useMemo(() => upcomingRuns(7), [upcomingRuns]);
  const grouped = useMemo(() => {
    const map = new Map<number, UpcomingRun[]>();
    for (const r of runs) {
      const key = startOfDay(r.runAt).getTime();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [runs]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <CalendarClock className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Recurring missions</h3>
          <p className="text-[10px] text-muted-foreground">
            Schedule agents to deploy on a cadence — they'll run automatically.
          </p>
        </div>
      </div>

      {/* Add new schedule */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
          <Plus className="h-3 w-3" /> New schedule
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
          <Select value={agentId} onValueChange={handleAgentChange}>
            <SelectTrigger className="h-9 text-[12px]">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              {agentList.map(a => (
                <SelectItem key={a.id} value={a.id} className="text-[12px]">
                  {a.emoji} {a.name} — {a.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={missionId} onValueChange={setMissionId}>
            <SelectTrigger className="h-9 text-[12px]">
              <SelectValue placeholder="Mission" />
            </SelectTrigger>
            <SelectContent>
              {agent.missions.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-[12px]">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cadence} onValueChange={v => setCadence(v as ScheduleCadence)}>
            <SelectTrigger className="h-9 text-[12px]">
              <SelectValue placeholder="Cadence" />
            </SelectTrigger>
            <SelectContent>
              {CADENCES.map(c => (
                <SelectItem key={c} value={c} className="text-[12px]">
                  {CADENCE_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAdd} size="sm" className="h-9">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="active" className="text-[12px]">
            Active ({schedules.length})
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-[12px]">
            Upcoming ({runs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-3">
          {schedules.length === 0 ? (
            <p className="text-[11px] text-muted-foreground italic text-center py-6">
              No schedules yet. Add one above to automate a recurring mission.
            </p>
          ) : (
            <div className="space-y-2">
              {schedules.map(s => {
                const a = agents[s.agentId];
                const m = a.missions.find(x => x.id === s.missionId);
                const accent = `hsl(${a.accentHue}, 75%, 55%)`;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ background: `hsl(${a.accentHue}, 80%, 95%)`, color: accent }}
                    >
                      {a.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[12px] font-bold" style={{ color: accent }}>
                          {a.name}
                        </span>
                        <span className="text-[11px] text-foreground truncate">{m?.label ?? "—"}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {CADENCE_LABEL[s.cadence]} ·{" "}
                        {s.enabled
                          ? `next ${formatDistanceToNow(s.nextRun, { addSuffix: true })}`
                          : "paused"}
                        {s.lastRun
                          ? ` · last ${formatDistanceToNow(s.lastRun, { addSuffix: true })}`
                          : ""}
                      </p>
                    </div>
                    <Switch
                      checked={s.enabled}
                      onCheckedChange={() => onToggle(s.id)}
                      aria-label={`${s.enabled ? "Pause" : "Enable"} schedule`}
                    />
                    <Button
                      onClick={() => onRemove(s.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label="Delete schedule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-3">
          {grouped.length === 0 ? (
            <p className="text-[11px] text-muted-foreground italic text-center py-6">
              No upcoming runs in the next 7 days.
            </p>
          ) : (
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {grouped.map(([day, items]) => {
                const date = new Date(day);
                return (
                  <div key={day}>
                    <div className="flex items-center gap-1.5 mb-1.5 sticky top-0 bg-card py-1">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {dayLabel(date)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70">
                        ({items.length} run{items.length === 1 ? "" : "s"})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {items.slice(0, 30).map(r => {
                        const a = agents[r.agentId];
                        const accent = `hsl(${a.accentHue}, 75%, 55%)`;
                        return (
                          <div
                            key={`${r.scheduleId}-${r.runAt}`}
                            className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 px-2.5 py-1.5"
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ background: accent }}
                            />
                            <span
                              className="text-[10px] font-bold uppercase tracking-wide w-14 shrink-0"
                              style={{ color: accent }}
                            >
                              {a.name}
                            </span>
                            <span className="text-[11px] text-foreground truncate flex-1">
                              {r.missionLabel}
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                              {format(r.runAt, "HH:mm")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
