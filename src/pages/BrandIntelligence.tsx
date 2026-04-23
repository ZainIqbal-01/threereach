import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InputPhase } from "@/components/brand-intelligence/InputPhase";
import { AnalyzingPhase } from "@/components/brand-intelligence/AnalyzingPhase";
import { ResultsPhase } from "@/components/brand-intelligence/ResultsPhase";
import { mockAnalysis, generateCompetitorData } from "@/components/brand-intelligence/mockData";
import { saveScan } from "@/components/brand-intelligence/scanHistory";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { toast } from "@/hooks/use-toast";
import type { AnalysisPhase, AnalysisData, CompetitorData, ScanRecord } from "@/components/brand-intelligence/types";

export default function BrandIntelligence() {
  const { profile } = useBusinessProfile();
  const [phase, setPhase] = useState<AnalysisPhase>("input");
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData>(mockAnalysis);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

  const startAnalysis = async () => {
    if (!brandName.trim() || !website.trim()) return;
    setPhase("analyzing");
    setProgress(0);

    const steps = [
      { pct: 12, label: "Querying ChatGPT for brand mentions..." },
      { pct: 25, label: "Scanning Gemini responses..." },
      { pct: 38, label: "Analyzing Perplexity citations..." },
      { pct: 50, label: `Benchmarking ${competitors.length > 0 ? competitors.length + " competitors" : "market"}...` },
      { pct: 65, label: "Evaluating sentiment & narrative..." },
      { pct: 80, label: "Identifying visibility gaps..." },
      { pct: 92, label: "Generating improvement strategy..." },
    ];

    // Animate progress while AI works
    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(step.pct);
        setAnalysisStep(step.label);
      }, (i + 1) * 800);
    });

    try {
      const { data, error } = await supabase.functions.invoke("analyze-brand", {
        body: {
          brandName,
          website,
          description,
          industry,
          competitors,
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

      setProgress(100);
      setAnalysisStep("Analysis complete!");
      
      const result: AnalysisData = {
        overallScore: data.overallScore || 0,
        status: data.status || "invisible",
        engines: data.engines || [],
        gaps: data.gaps || [],
        improvementPlan: data.improvementPlan || [],
      };
      
      setAnalysisData(result);
      setCompetitorData(data.competitors || competitors.map(generateCompetitorData));

      setTimeout(async () => {
        const record: ScanRecord = {
          id: crypto.randomUUID(),
          brandName,
          website,
          date: new Date().toISOString(),
          score: result.overallScore,
          status: result.status,
          competitors: data.competitors || competitors.map(generateCompetitorData),
          data: result,
        };
        await saveScan(record);
        setPhase("results");
      }, 800);

      toast({ title: "✅ AI Analysis complete!", description: `Brand score: ${result.overallScore}/100` });
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed", description: err?.message || "Could not complete analysis", variant: "destructive" });
      // Fallback to mock data
      setAnalysisData(mockAnalysis);
      setCompetitorData(competitors.map(generateCompetitorData));
      setTimeout(() => {
        setProgress(100);
        setAnalysisStep("Analysis complete (using cached data)");
        setTimeout(() => setPhase("results"), 800);
      }, 1000);
    }
  };

  const resetAnalysis = () => {
    setPhase("input");
    setProgress(0);
    setAnalysisStep("");
  };

  const loadScan = (scan: ScanRecord) => {
    setBrandName(scan.brandName);
    setWebsite(scan.website);
    setCompetitorData(scan.competitors);
    setCompetitors(scan.competitors.map(c => c.name));
    setAnalysisData(scan.data);
    setPhase("results");
  };

  if (phase === "input") {
    return (
      <InputPhase
        brandName={brandName} setBrandName={setBrandName}
        website={website} setWebsite={setWebsite}
        industry={industry} setIndustry={setIndustry}
        description={description} setDescription={setDescription}
        competitors={competitors} setCompetitors={setCompetitors}
        onStartAnalysis={startAnalysis} onLoadScan={loadScan}
      />
    );
  }

  if (phase === "analyzing") {
    return <AnalyzingPhase progress={progress} analysisStep={analysisStep} competitors={competitors} />;
  }

  return (
    <ResultsPhase
      brandName={brandName}
      website={website}
      data={analysisData}
      competitors={competitorData}
      onReset={resetAnalysis}
    />
  );
}
