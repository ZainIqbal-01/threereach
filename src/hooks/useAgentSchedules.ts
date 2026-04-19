import { useEffect, useState, useCallback, useRef } from "react";
import { agents, type AgentMission } from "@/components/agents/agentRegistry";

export type ScheduleCadence = "hourly" | "every_6h" | "every_12h" | "daily" | "weekly";

export interface AgentSchedule {
  id: string;
  agentId: string;
  missionId: string;
  cadence: ScheduleCadence;
  enabled: boolean;
  lastRun: number | null;
  nextRun: number;
  createdAt: number;
}

const STORAGE_KEY = "agentSchedules.v1";

const CADENCE_MS: Record<ScheduleCadence, number> = {
  hourly: 60 * 60 * 1000,
  every_6h: 6 * 60 * 60 * 1000,
  every_12h: 12 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

export const CADENCE_LABEL: Record<ScheduleCadence, string> = {
  hourly: "Every hour",
  every_6h: "Every 6 hours",
  every_12h: "Every 12 hours",
  daily: "Every day",
  weekly: "Every week",
};

function loadSchedules(): AgentSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AgentSchedule[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSchedules(s: AgentSchedule[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

export interface UpcomingRun {
  scheduleId: string;
  agentId: string;
  missionId: string;
  missionLabel: string;
  cadence: ScheduleCadence;
  runAt: number;
}

interface UseAgentSchedulesOptions {
  onTrigger?: (agentId: string, mission: AgentMission, scheduleId: string) => void;
}

export function useAgentSchedules(options: UseAgentSchedulesOptions = {}) {
  const [schedules, setSchedules] = useState<AgentSchedule[]>(() => loadSchedules());
  const onTriggerRef = useRef(options.onTrigger);
  onTriggerRef.current = options.onTrigger;

  // Persist on change
  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  // Trigger ticker — every 30s, fire any due schedules
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setSchedules(prev => {
        let changed = false;
        const next = prev.map(s => {
          if (!s.enabled) return s;
          if (s.nextRun > now) return s;
          const agent = agents[s.agentId];
          const mission = agent?.missions.find(m => m.id === s.missionId);
          if (mission && onTriggerRef.current) {
            onTriggerRef.current(s.agentId, mission, s.id);
          }
          changed = true;
          return {
            ...s,
            lastRun: now,
            nextRun: now + CADENCE_MS[s.cadence],
          };
        });
        return changed ? next : prev;
      });
    };
    tick();
    const id = window.setInterval(tick, 30 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const addSchedule = useCallback((agentId: string, missionId: string, cadence: ScheduleCadence) => {
    const now = Date.now();
    const newSchedule: AgentSchedule = {
      id: `sched-${now}-${Math.random().toString(36).slice(2, 8)}`,
      agentId,
      missionId,
      cadence,
      enabled: true,
      lastRun: null,
      nextRun: now + CADENCE_MS[cadence],
      createdAt: now,
    };
    setSchedules(prev => [newSchedule, ...prev]);
    return newSchedule;
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  const toggleSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  const upcomingRuns = useCallback((days = 7): UpcomingRun[] => {
    const horizon = Date.now() + days * 24 * 60 * 60 * 1000;
    const runs: UpcomingRun[] = [];
    for (const s of schedules) {
      if (!s.enabled) continue;
      const agent = agents[s.agentId];
      const mission = agent?.missions.find(m => m.id === s.missionId);
      if (!mission) continue;
      let t = s.nextRun;
      while (t <= horizon) {
        runs.push({
          scheduleId: s.id,
          agentId: s.agentId,
          missionId: s.missionId,
          missionLabel: mission.label,
          cadence: s.cadence,
          runAt: t,
        });
        t += CADENCE_MS[s.cadence];
      }
    }
    return runs.sort((a, b) => a.runAt - b.runAt);
  }, [schedules]);

  return { schedules, addSchedule, removeSchedule, toggleSchedule, upcomingRuns };
}
