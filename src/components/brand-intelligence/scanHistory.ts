import { ScanRecord } from "./types";
import { supabase } from "@/integrations/supabase/client";

const LEGACY_KEY = "three-reach-scan-history";

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

  return data.map((row) => ({
    id: row.id,
    timestamp: row.created_at,
    brandName: (row.raw_results as Record<string, unknown>)?.brandName as string ?? "",
    industry: (row.raw_results as Record<string, unknown>)?.industry as string ?? "",
    overallScore: Number(row.score ?? 0),
    status: (row.status ?? "weak") as ScanRecord["status"],
    engines: ((row.raw_results as Record<string, unknown>)?.engines as ScanRecord["engines"]) ?? [],
    gaps: ((row.raw_results as Record<string, unknown>)?.gaps as string[]) ?? [],
    improvementPlan: ((row.raw_results as Record<string, unknown>)?.improvementPlan as ScanRecord["improvementPlan"]) ?? [],
    competitors: ((row.raw_results as Record<string, unknown>)?.competitors as ScanRecord["competitors"]) ?? [],
  }));
}

export async function saveScan(record: ScanRecord): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("scan_history").insert({
    user_id: user.id,
    engine: "aggregate",
    query: record.brandName,
    status: record.status,
    score: record.overallScore,
    confidence: record.overallScore,
    response_text: null,
    raw_results: record as unknown as Record<string, unknown>,
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
      score: r.overallScore,
      confidence: r.overallScore,
      raw_results: r as unknown as Record<string, unknown>,
      created_at: r.timestamp,
    }));
    await supabase.from("scan_history").insert(rows);
    localStorage.removeItem(LEGACY_KEY);
  } catch (e) {
    console.warn("Legacy scan migration failed:", e);
  }
}
