import { useState } from "react";
import { InputPhase } from "@/components/brand-intelligence/InputPhase";
import { AnalyzingPhase } from "@/components/brand-intelligence/AnalyzingPhase";
import { ResultsPhase } from "@/components/brand-intelligence/ResultsPhase";
import { mockAnalysis, generateCompetitorData } from "@/components/brand-intelligence/mockData";
import { saveScan } from "@/components/brand-intelligence/scanHistory";
import type { AnalysisPhase, CompetitorData, ScanRecord } from "@/components/brand-intelligence/types";

export default function BrandIntelligence() {
  const [phase, setPhase] = useState<AnalysisPhase>("input");
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

  const startAnalysis = () => {
    if (!brandName.trim() || !website.trim()) return;
    setPhase("analyzing");
    setProgress(0);

    // Generate competitor results
    const compResults = competitors.map(generateCompetitorData);
    setCompetitorData(compResults);

    const steps = [
      { pct: 12, label: "Querying ChatGPT for brand mentions..." },
      { pct: 25, label: "Scanning Gemini responses..." },
      { pct: 38, label: "Analyzing Perplexity citations..." },
      { pct: 50, label: `Benchmarking ${competitors.length > 0 ? competitors.length + " competitors" : "market"}...` },
      { pct: 65, label: "Evaluating sentiment & narrative..." },
      { pct: 80, label: "Identifying visibility gaps..." },
      { pct: 92, label: "Generating improvement strategy..." },
      { pct: 100, label: "Analysis complete!" },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(step.pct);
        setAnalysisStep(step.label);
        if (i === steps.length - 1) {
          setTimeout(() => {
            // Save to history
            const record: ScanRecord = {
              id: crypto.randomUUID(),
              brandName,
              website,
              date: new Date().toISOString(),
              score: mockAnalysis.overallScore,
              status: mockAnalysis.status,
              competitors: compResults,
              data: mockAnalysis,
            };
            saveScan(record);
            setPhase("results");
          }, 800);
        }
      }, (i + 1) * 1000);
    });
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
      data={mockAnalysis}
      competitors={competitorData}
      onReset={resetAnalysis}
    />
  );
}
