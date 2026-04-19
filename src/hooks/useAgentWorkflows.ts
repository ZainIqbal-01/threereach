import { useEffect, useState, useCallback, useRef } from "react";
import { agents, type AgentMission } from "@/components/agents/agentRegistry";

export interface WorkflowRule {
  id: string;
  enabled: boolean;
  // When this agent completes ANY mission (or specific mission)
  triggerAgentId: string;
  triggerMissionId: string | "any";
  // Then deploy this agent's mission
  thenAgentId: string;
  thenMissionId: string;
  delaySec: number;
  createdAt: number;
  timesFired: number;
}

const STORAGE_KEY = "agentWorkflows.v1";

function load(): WorkflowRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultRules();
    const parsed = JSON.parse(raw) as WorkflowRule[];
    return Array.isArray(parsed) ? parsed : defaultRules();
  } catch {
    return defaultRules();
  }
}

function defaultRules(): WorkflowRule[] {
  // Seed two example rules so the feature is discoverable
  const now = Date.now();
  return [
    {
      id: `wf-seed-1`,
      enabled: true,
      triggerAgentId: "scout",
      triggerMissionId: "any",
      thenAgentId: "sentinel",
      thenMissionId: "sentinel-verify",
      delaySec: 5,
      createdAt: now,
      timesFired: 0,
    },
    {
      id: `wf-seed-2`,
      enabled: false,
      triggerAgentId: "sentinel",
      triggerMissionId: "sentinel-verify",
      thenAgentId: "spark",
      thenMissionId: "spark-linkedin",
      delaySec: 10,
      createdAt: now,
      timesFired: 0,
    },
  ];
}

function save(s: WorkflowRule[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

interface UseAgentWorkflowsOptions {
  onTrigger?: (agentId: string, mission: AgentMission, ruleId: string) => void;
}

export function useAgentWorkflows(options: UseAgentWorkflowsOptions = {}) {
  const [rules, setRules] = useState<WorkflowRule[]>(() => load());
  const onTriggerRef = useRef(options.onTrigger);
  onTriggerRef.current = options.onTrigger;

  useEffect(() => {
    save(rules);
  }, [rules]);

  /** Called by the simulation hook whenever a mission completes */
  const handleMissionComplete = useCallback((agentId: string, missionId: string) => {
    const matching = rules.filter(
      r =>
        r.enabled &&
        r.triggerAgentId === agentId &&
        (r.triggerMissionId === "any" || r.triggerMissionId === missionId),
    );
    if (matching.length === 0) return;
    matching.forEach(rule => {
      const targetAgent = agents[rule.thenAgentId];
      const targetMission = targetAgent?.missions.find(m => m.id === rule.thenMissionId);
      if (!targetMission) return;
      window.setTimeout(() => {
        onTriggerRef.current?.(rule.thenAgentId, targetMission, rule.id);
        setRules(prev => prev.map(r => (r.id === rule.id ? { ...r, timesFired: r.timesFired + 1 } : r)));
      }, Math.max(0, rule.delaySec * 1000));
    });
  }, [rules]);

  const addRule = useCallback(
    (rule: Omit<WorkflowRule, "id" | "createdAt" | "timesFired" | "enabled"> & { enabled?: boolean }) => {
      const newRule: WorkflowRule = {
        ...rule,
        enabled: rule.enabled ?? true,
        id: `wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: Date.now(),
        timesFired: 0,
      };
      setRules(prev => [newRule, ...prev]);
      return newRule;
    },
    [],
  );

  const removeRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  return { rules, addRule, removeRule, toggleRule, handleMissionComplete };
}
