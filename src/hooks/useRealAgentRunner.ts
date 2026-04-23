import { supabase } from "@/integrations/supabase/client";
import { useBusinessName } from "@/hooks/useBusinessName";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { saveScan } from "@/components/brand-intelligence/scanHistory";
import type { ScanRecord } from "@/components/brand-intelligence/types";

/**
 * Real agent execution layer. Wires `scout` and `oracle` agent IDs to live
 * edge functions instead of the simulation. Other agents stay simulated
 * for now (UI-only).
 */
export function useRealAgentRunner() {
  const { user } = useAuth();
  const businessName = useBusinessName();
  const { profile } = useBusinessProfile();

  const runScout = async () => {
    if (!user) {
      toast.error("Sign in required to run live scans");
      return;
    }
    toast.message("🔍 Scout deploying real scan…", { description: "Querying AI engines now" });
    try {
      const { data, error } = await supabase.functions.invoke("ai-scan", {
        body: {
          query: `Top companies in ${profile.industry || "the industry"}`,
          brandName: businessName,
          engines: ["ChatGPT", "Gemini", "Perplexity"],
        },
      });
      if (error) throw error;
      const results = data?.results ?? [];
      const rows = results.map((r: { engine: string; status: string; context?: string; position?: number }) => ({
        user_id: user.id,
        engine: r.engine,
        query: `Scout — industry visibility check`,
        status: r.status,
        score: r.status === "mentioned" ? 80 : r.status === "weak" ? 45 : 0,
        confidence: r.status === "mentioned" ? 80 : r.status === "weak" ? 45 : 0,
        response_text: r.context ?? null,
        raw_results: { context: r.context, position: r.position } as never,
      }));
      if (rows.length) await supabase.from("scan_history").insert(rows);
      const mentioned = results.filter((r: { status: string }) => r.status === "mentioned").length;
      toast.success("✅ Scout finished", { description: `Found ${mentioned}/${results.length} mentions` });
    } catch (err) {
      console.error("Scout error:", err);
      toast.error("Scout failed", { description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const runOracle = async () => {
    if (!user) {
      toast.error("Sign in required to run live analysis");
      return;
    }
    if (!profile.website) {
      toast.error("Add a business website first", { description: "Oracle needs a URL to analyze" });
      return;
    }
    toast.message("🧠 Oracle deploying brand analysis…", { description: "Deep AI perception scan" });
    try {
      const { data, error } = await supabase.functions.invoke("analyze-brand", {
        body: {
          brandName: businessName,
          website: profile.website,
          description: profile.description ?? "",
          industry: profile.industry ?? "",
          competitors: profile.competitors ?? [],
          detailedInfo: profile.detailedInfo ?? "",
          targetAudience: profile.audience ?? "",
          resources: (profile.resources ?? []).map((r) => ({
            type: r.type,
            name: r.name,
            url: r.type === "link" ? r.value : "",
          })),
        },
      });
      if (error) throw error;
      const record: ScanRecord = {
        id: crypto.randomUUID(),
        brandName: businessName,
        website: profile.website,
        date: new Date().toISOString(),
        score: data?.overallScore ?? 0,
        status: data?.status ?? "weak",
        competitors: data?.competitors ?? [],
        data: {
          overallScore: data?.overallScore ?? 0,
          status: data?.status ?? "weak",
          engines: data?.engines ?? [],
          gaps: data?.gaps ?? [],
          improvementPlan: data?.improvementPlan ?? [],
        },
      };
      await saveScan(record);
      toast.success("✅ Oracle report ready", { description: `Brand score: ${record.score}/100` });
    } catch (err) {
      console.error("Oracle error:", err);
      toast.error("Oracle failed", { description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  /** Returns true if a real backend mission was dispatched, false otherwise. */
  const tryRunReal = async (agentId: string): Promise<boolean> => {
    if (agentId === "scout") {
      await runScout();
      return true;
    }
    if (agentId === "oracle") {
      await runOracle();
      return true;
    }
    return false;
  };

  return { runScout, runOracle, tryRunReal };
}
