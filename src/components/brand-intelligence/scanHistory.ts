import { ScanRecord } from "./types";
import { supabase } from "@/integrations/supabase/client";

const LEGACY_KEY = "three-reach-scan-history";

interface ScanRow {
  id: string;
  created_at: string;
  status: string | null;
  score: number | null;
  query: string | null;
  raw_results: unknown;
}

function rowToRecord(row: ScanRow): ScanRecord {
  const raw = (row.raw_results ?? {}) as Partial<ScanRecord>;
  return {
    id: row.id,
    brandName: raw.brandName ?? row.query ?? "",
    website: raw.website ?? "",
    date: row.created_at,
    score: Number(row.score ?? raw.score ?? 0),
    status: row.status ?? raw.status ?? "weak",
    competitors: raw.competitors ?? [],
    data: raw.data ?? {
      overallScore: Number(row.score ?? 0),
      status: (row.status as "invisible" | "weak" | "visible" | "strong") ?? "weak",
      engines: [],
      gaps: [],
      improvementPlan: [],
    },
  };
}

/** Read scans for the current user from the database. Falls back to localStorage when signed out. */
export async function getScanHistory(): Promise<ScanRecord[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  const { data, error } = await supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map((r) => rowToRecord(r as ScanRow));
}

export async function saveScan(record: ScanRecord): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("scan_history").insert({
    user_id: user.id,
    engine: "aggregate",
    query: record.brandName,
    status: record.status,
    score: record.score,
    confidence: record.score,
    raw_results: record as unknown as never,
  });
}

export async function deleteScan(id: string): Promise<void> {
  await supabase.from("scan_history").delete().eq("id", id);
}

/** One-time migration of legacy localStorage scans into the database. */
export async function migrateLegacyScans(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const legacy: ScanRecord[] = JSON.parse(raw);
    if (!Array.isArray(legacy) || legacy.length === 0) {
      localStorage.removeItem(LEGACY_KEY);
      return;
    }
    const rows = legacy.map((r) => ({
      user_id: user.id,
      engine: "aggregate",
      query: r.brandName,
      status: r.status,
      score: r.score,
      confidence: r.score,
      raw_results: r as unknown as never,
      created_at: r.date,
    }));
    await supabase.from("scan_history").insert(rows);
    localStorage.removeItem(LEGACY_KEY);
  } catch (e) {
    console.warn("Legacy scan migration failed:", e);
  }
}
