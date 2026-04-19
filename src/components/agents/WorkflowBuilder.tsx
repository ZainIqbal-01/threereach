import { useState } from "react";
import { GitBranch, Plus, Trash2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agentList, agents } from "@/components/agents/agentRegistry";
import type { WorkflowRule } from "@/hooks/useAgentWorkflows";

interface Props {
  rules: WorkflowRule[];
  onAdd: (
    rule: Omit<WorkflowRule, "id" | "createdAt" | "timesFired" | "enabled"> & { enabled?: boolean },
  ) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export function WorkflowBuilder({ rules, onAdd, onRemove, onToggle }: Props) {
  const [triggerAgentId, setTriggerAgentId] = useState<string>("scout");
  const [triggerMissionId, setTriggerMissionId] = useState<string>("any");
  const [thenAgentId, setThenAgentId] = useState<string>("sentinel");
  const [thenMissionId, setThenMissionId] = useState<string>(agents.sentinel.missions[0].id);
  const [delaySec, setDelaySec] = useState<number>(5);

  const handleTriggerAgent = (v: string) => {
    setTriggerAgentId(v);
    setTriggerMissionId("any");
  };
  const handleThenAgent = (v: string) => {
    setThenAgentId(v);
    setThenMissionId(agents[v].missions[0].id);
  };

  const handleAdd = () => {
    onAdd({ triggerAgentId, triggerMissionId, thenAgentId, thenMissionId, delaySec });
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Inter-agent workflows</h3>
          <p className="text-[10px] text-muted-foreground">
            Chain agents together — when one finishes, another fires automatically.
          </p>
        </div>
      </div>

      {/* Builder */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
          <Plus className="h-3 w-3" /> New rule
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* WHEN */}
          <div className="rounded-lg bg-card border border-border/60 p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              When
            </span>
            <Select value={triggerAgentId} onValueChange={handleTriggerAgent}>
              <SelectTrigger className="h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agentList.map(a => (
                  <SelectItem key={a.id} value={a.id} className="text-[12px]">
                    {a.emoji} {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-[10px] text-muted-foreground">finishes</span>
            <Select value={triggerMissionId} onValueChange={setTriggerMissionId}>
              <SelectTrigger className="h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any" className="text-[12px]">
                  Any mission
                </SelectItem>
                {agents[triggerAgentId].missions.map(m => (
                  <SelectItem key={m.id} value={m.id} className="text-[12px]">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* THEN */}
          <div className="rounded-lg bg-card border border-border/60 p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Then deploy
            </span>
            <Select value={thenAgentId} onValueChange={handleThenAgent}>
              <SelectTrigger className="h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agentList.map(a => (
                  <SelectItem key={a.id} value={a.id} className="text-[12px]">
                    {a.emoji} {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-[10px] text-muted-foreground">to run</span>
            <Select value={thenMissionId} onValueChange={setThenMissionId}>
              <SelectTrigger className="h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents[thenAgentId].missions.map(m => (
                  <SelectItem key={m.id} value={m.id} className="text-[12px]">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">Delay (sec)</span>
          <Input
            type="number"
            min={0}
            max={300}
            value={delaySec}
            onChange={e => setDelaySec(Math.max(0, Math.min(300, Number(e.target.value) || 0)))}
            className="h-8 text-[12px] w-20"
          />
          <Button onClick={handleAdd} size="sm" className="h-8 ml-auto">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add rule
          </Button>
        </div>
      </div>

      {/* Existing rules */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Active rules ({rules.filter(r => r.enabled).length}/{rules.length})
        </p>
        {rules.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic text-center py-6">
            No workflow rules yet. Add one above to chain agents together.
          </p>
        ) : (
          rules.map(r => {
            const fromAgent = agents[r.triggerAgentId];
            const toAgent = agents[r.thenAgentId];
            const fromAccent = `hsl(${fromAgent.accentHue}, 75%, 55%)`;
            const toAccent = `hsl(${toAgent.accentHue}, 75%, 55%)`;
            const fromMission =
              r.triggerMissionId === "any"
                ? "any mission"
                : fromAgent.missions.find(m => m.id === r.triggerMissionId)?.label ?? "—";
            const toMission = toAgent.missions.find(m => m.id === r.thenMissionId)?.label ?? "—";
            return (
              <div
                key={r.id}
                className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span
                      className="font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                      style={{ color: fromAccent, background: `hsl(${fromAgent.accentHue}, 80%, 95%)` }}
                    >
                      {fromAgent.emoji} {fromAgent.name}
                    </span>
                    <span className="text-muted-foreground">finishes</span>
                    <span className="text-foreground italic truncate">{fromMission}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span
                      className="font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                      style={{ color: toAccent, background: `hsl(${toAgent.accentHue}, 80%, 95%)` }}
                    >
                      {toAgent.emoji} {toAgent.name}
                    </span>
                    <span className="text-foreground italic truncate">{toMission}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                    <span>+{r.delaySec}s delay</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5" />
                      Fired {r.timesFired}×
                    </span>
                  </p>
                </div>
                <Switch
                  checked={r.enabled}
                  onCheckedChange={() => onToggle(r.id)}
                  aria-label={`${r.enabled ? "Disable" : "Enable"} rule`}
                />
                <Button
                  onClick={() => onRemove(r.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  aria-label="Delete rule"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
