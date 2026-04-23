import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface EngineStat {
  name: string;
  status: "mentioned" | "weak" | "not_found";
  confidence: number;
  lastChecked: string;
}

export interface DashboardData {
  loading: boolean;
  hasScans: boolean;
  currentScore: number;
  previousScore: number;
  status: "invisible" | "weak" | "visible" | "strong";
  trend: number[];
  engines: EngineStat[];
  totalMentions: number;
  recentMentions: string[];
  totalScans: number;
  scansThisWeek: number;
  refresh: () => Promise<void>;
}

function statusFromScore(score: number): DashboardData["status"] {
  if (score >= 75) return "strong";
  if (score >= 50) return "visible";
  if (score >= 25) return "weak";
  return "invisible";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [state, setState] = useState<Omit<DashboardData, "refresh">>({
    loading: true,
    hasScans: false,
    currentScore: 0,
    previousScore: 0,
    status: "invisible",
    trend: [],
    engines: [],
    totalMentions: 0,
    recentMentions: [],
    totalScans: 0,
    scansThisWeek: 0,
  });

  const load = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true }));

    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      setState({
        loading: false,
        hasScans: false,
        currentScore: 0,
        previousScore: 0,
        status: "invisible",
        trend: [],
        engines: [],
        totalMentions: 0,
        recentMentions: [],
        totalScans: 0,
        scansThisWeek: 0,
      });
      return;
    }

    const aggregate = data.filter((d) => d.engine === "aggregate");
    const engineRows = data.filter((d) => d.engine !== "aggregate");

    const currentScore = Number(aggregate[0]?.score ?? 0);
    const previousScore = Number(aggregate[1]?.score ?? currentScore);
    const trend = aggregate
      .slice(0, 7)
      .reverse()
      .map((d) => Number(d.score ?? 0));

    // Engines: latest result per engine name
    const engineMap = new Map<string, EngineStat>();
    for (const row of engineRows) {
      if (engineMap.has(row.engine)) continue;
      engineMap.set(row.engine, {
        name: row.engine,
        status: ((row.status as EngineStat["status"]) ?? "not_found"),
        confidence: Number(row.confidence ?? 0),
        lastChecked: relativeTime(row.created_at),
      });
    }
    // Pull engines from aggregate raw_results if dedicated rows are missing
    if (engineMap.size === 0 && aggregate[0]?.raw_results) {
      const raw = aggregate[0].raw_results as { data?: { engines?: Array<{ name: string; status: string; confidence?: number }> } };
      const engines = raw?.data?.engines ?? [];
      for (const e of engines) {
        engineMap.set(e.name, {
          name: e.name,
          status: (e.status as EngineStat["status"]) ?? "not_found",
          confidence: Number(e.confidence ?? 0),
          lastChecked: relativeTime(aggregate[0].created_at),
        });
      }
    }

    // Mentions
    const mentions = engineRows.filter((r) => r.status === "mentioned");
    const recentMentions = mentions
      .slice(0, 3)
      .map((r) => {
        const raw = r.raw_results as { context?: string } | null;
        return raw?.context || r.response_text || `Mentioned in "${r.query}"`;
      });

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const scansThisWeek = aggregate.filter((d) => new Date(d.created_at).getTime() > weekAgo).length;

    setState({
      loading: false,
      hasScans: true,
      currentScore,
      previousScore,
      status: statusFromScore(currentScore),
      trend: trend.length >= 2 ? trend : [currentScore],
      engines: Array.from(engineMap.values()),
      totalMentions: mentions.length,
      recentMentions,
      totalScans: aggregate.length,
      scansThisWeek,
    });
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refresh: load };
}
