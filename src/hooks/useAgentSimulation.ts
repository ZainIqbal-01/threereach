import { useEffect, useRef, useState, useCallback } from "react";
import { agentList, type AgentConfig, type AgentMission } from "@/components/agents/agentRegistry";

export type AgentRuntimeStatus = "active" | "idle" | "paused";

export interface QueuedTask {
  id: string;
  agentId: string;
  mission: AgentMission;
  etaSec: number;
}

export interface InProgressTask {
  id: string;
  agentId: string;
  mission: AgentMission;
  progress: number; // 0-100
  startedAt: number;
}

export interface CompletedTask {
  id: string;
  agentId: string;
  mission: AgentMission;
  completedAt: number;
  result: string;
}

export interface ActivityEvent {
  id: string;
  agentId: string;
  type: "deploy" | "progress" | "complete" | "pause" | "queue";
  message: string;
  timestamp: number;
}

export interface AgentRuntime {
  id: string;
  status: AgentRuntimeStatus;
  current: InProgressTask | null;
  queue: QueuedTask[];
  tasksToday: number;
  successRate: number;
  lastRun: number | null;
}

const RESULT_TEMPLATES: Record<string, string[]> = {
  scout: ["12 mentions found", "8 new citations", "Engine sweep complete", "23 prompts probed"],
  oracle: ["Sentiment +6%", "3 narrative drifts flagged", "Competitor delta logged", "Tone score updated"],
  spark: ["3 drafts ready", "Posted to LinkedIn", "5 Quora answers staged", "Reddit reply published"],
  atlas: ["Schema updated", "12 profiles synced", "5 entity pages added", "Sitemap refreshed"],
  sentinel: ["8 proofs verified", "0 anomalies detected", "Weekly archive pushed", "Hash chain extended"],
  sage: ["Report compiled", "Exec summary ready", "Trend forecast updated", "PDF exported"],
  nova: ["Dashboards synced", "Health check passed", "Daily brief ready", "All agents nominal"],
};

function pickResult(agentId: string) {
  const arr = RESULT_TEMPLATES[agentId] || ["Done"];
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeQueueFor(agent: AgentConfig, n: number): QueuedTask[] {
  return Array.from({ length: n }, (_, i) => {
    const m = agent.missions[Math.floor(Math.random() * agent.missions.length)];
    return {
      id: `${agent.id}-q-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      agentId: agent.id,
      mission: m,
      etaSec: m.durationSec,
    };
  });
}

const MAX_ACTIVITY = 60;

export function useAgentSimulation() {
  const [runtimes, setRuntimes] = useState<Record<string, AgentRuntime>>(() => {
    const initial: Record<string, AgentRuntime> = {};
    agentList.forEach((a, idx) => {
      const startActive = idx % 2 === 0;
      const queue = makeQueueFor(a, 2 + Math.floor(Math.random() * 2));
      let current: InProgressTask | null = null;
      if (startActive) {
        const m = a.missions[0];
        current = {
          id: `${a.id}-r-${Date.now()}-${idx}`,
          agentId: a.id,
          mission: m,
          progress: Math.floor(Math.random() * 50) + 10,
          startedAt: Date.now(),
        };
      }
      initial[a.id] = {
        id: a.id,
        status: startActive ? "active" : "idle",
        current,
        queue,
        tasksToday: Math.floor(Math.random() * 8) + 2,
        successRate: 92 + Math.floor(Math.random() * 7),
        lastRun: Date.now() - Math.floor(Math.random() * 1000 * 60 * 30),
      };
    });
    return initial;
  });

  const [activity, setActivity] = useState<ActivityEvent[]>(() => {
    const seed: ActivityEvent[] = [];
    agentList.slice(0, 4).forEach((a, i) => {
      seed.push({
        id: `seed-${a.id}-${i}`,
        agentId: a.id,
        type: "complete",
        message: `${pickResult(a.id)}`,
        timestamp: Date.now() - (i + 1) * 1000 * 60 * (3 + i),
      });
    });
    return seed;
  });

  const [completedToday, setCompletedToday] = useState<CompletedTask[]>([]);

  const pushActivity = useCallback((evt: Omit<ActivityEvent, "id" | "timestamp">) => {
    setActivity(prev => [
      { ...evt, id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now() },
      ...prev,
    ].slice(0, MAX_ACTIVITY));
  }, []);

  // Tick every 800ms: advance progress, complete tasks, dequeue next
  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRuntimes(prev => {
        const next: Record<string, AgentRuntime> = { ...prev };
        for (const id of Object.keys(next)) {
          const r = next[id];
          if (r.status !== "active") continue;
          const agent = agentList.find(a => a.id === id)!;

          if (r.current) {
            const inc = 100 / Math.max(8, r.current.mission.durationSec * 1.25);
            const newProgress = r.current.progress + inc;
            if (newProgress >= 100) {
              const result = pickResult(id);
              const completed: CompletedTask = {
                id: r.current.id,
                agentId: id,
                mission: r.current.mission,
                completedAt: Date.now(),
                result,
              };
              setCompletedToday(c => [completed, ...c].slice(0, 40));
              pushActivity({
                agentId: id,
                type: "complete",
                message: `${r.current.mission.label} → ${result}`,
              });
              const [head, ...rest] = r.queue;
              if (head) {
                next[id] = {
                  ...r,
                  current: {
                    id: `${id}-r-${Date.now()}`,
                    agentId: id,
                    mission: head.mission,
                    progress: 0,
                    startedAt: Date.now(),
                  },
                  queue: [...rest, ...makeQueueFor(agent, 1)],
                  tasksToday: r.tasksToday + 1,
                  lastRun: Date.now(),
                };
                pushActivity({ agentId: id, type: "deploy", message: `Started: ${head.mission.label}` });
              } else {
                next[id] = {
                  ...r,
                  current: null,
                  status: "idle",
                  tasksToday: r.tasksToday + 1,
                  lastRun: Date.now(),
                };
              }
            } else {
              next[id] = { ...r, current: { ...r.current, progress: newProgress } };
            }
          } else if (r.queue.length > 0) {
            const [head, ...rest] = r.queue;
            next[id] = {
              ...r,
              current: {
                id: `${id}-r-${Date.now()}`,
                agentId: id,
                mission: head.mission,
                progress: 0,
                startedAt: Date.now(),
              },
              queue: [...rest, ...makeQueueFor(agent, 1)],
            };
            pushActivity({ agentId: id, type: "deploy", message: `Started: ${head.mission.label}` });
          }
        }
        return next;
      });
    }, 800);
    tickRef.current = interval;
    return () => window.clearInterval(interval);
  }, [pushActivity]);

  const deploy = useCallback((agentId: string, mission?: AgentMission) => {
    const agent = agentList.find(a => a.id === agentId);
    if (!agent) return;
    const m = mission || agent.missions[0];
    setRuntimes(prev => {
      const r = prev[agentId];
      const newTask: InProgressTask = {
        id: `${agentId}-r-${Date.now()}`,
        agentId,
        mission: m,
        progress: 0,
        startedAt: Date.now(),
      };
      if (!r.current) {
        return {
          ...prev,
          [agentId]: { ...r, status: "active", current: newTask, lastRun: Date.now() },
        };
      }
      // queue it
      const queued: QueuedTask = {
        id: `${agentId}-q-${Date.now()}`,
        agentId,
        mission: m,
        etaSec: m.durationSec,
      };
      return {
        ...prev,
        [agentId]: { ...r, status: "active", queue: [...r.queue, queued] },
      };
    });
    pushActivity({ agentId, type: r => r === "active" ? "queue" : "deploy", message: `Queued: ${m.label}` } as any);
  }, [pushActivity]);

  const setStatus = useCallback((agentId: string, status: AgentRuntimeStatus) => {
    setRuntimes(prev => ({ ...prev, [agentId]: { ...prev[agentId], status } }));
    pushActivity({
      agentId,
      type: status === "paused" ? "pause" : "deploy",
      message: status === "paused" ? "Paused by operator" : status === "active" ? "Resumed" : "Set to idle",
    });
  }, [pushActivity]);

  const deployAll = useCallback(() => {
    agentList.forEach(a => {
      setRuntimes(prev => {
        const r = prev[a.id];
        if (r.current) return { ...prev, [a.id]: { ...r, status: "active" } };
        const m = a.missions[0];
        return {
          ...prev,
          [a.id]: {
            ...r,
            status: "active",
            current: {
              id: `${a.id}-r-${Date.now()}`,
              agentId: a.id,
              mission: m,
              progress: 0,
              startedAt: Date.now(),
            },
            lastRun: Date.now(),
          },
        };
      });
    });
    pushActivity({ agentId: "nova", type: "deploy", message: "Fleet-wide deploy initiated" });
  }, [pushActivity]);

  const pauseAll = useCallback(() => {
    setRuntimes(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = { ...next[id], status: "paused" };
      });
      return next;
    });
    pushActivity({ agentId: "nova", type: "pause", message: "Fleet-wide pause initiated" });
  }, [pushActivity]);

  const stats = {
    active: Object.values(runtimes).filter(r => r.status === "active").length,
    idle: Object.values(runtimes).filter(r => r.status === "idle").length,
    paused: Object.values(runtimes).filter(r => r.status === "paused").length,
    tasksToday: Object.values(runtimes).reduce((s, r) => s + r.tasksToday, 0),
    queueDepth: Object.values(runtimes).reduce((s, r) => s + r.queue.length, 0),
  };

  return { runtimes, activity, completedToday, stats, deploy, setStatus, deployAll, pauseAll };
}
