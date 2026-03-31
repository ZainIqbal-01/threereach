export interface EngineResult {
  engine: string;
  mentioned: boolean;
  position: number | null;
  sentiment: "positive" | "neutral" | "negative";
  snippet: string;
  reasons: string[];
}

export interface AnalysisData {
  overallScore: number;
  status: "invisible" | "weak" | "visible" | "strong";
  engines: EngineResult[];
  gaps: string[];
  improvementPlan: { title: string; description: string; priority: "high" | "medium" | "low" }[];
}

export interface CompetitorData {
  name: string;
  score: number;
  status: "invisible" | "weak" | "visible" | "strong";
  engines: { engine: string; mentioned: boolean; sentiment: "positive" | "neutral" | "negative" }[];
}

export interface ScanRecord {
  id: string;
  brandName: string;
  website: string;
  date: string;
  score: number;
  status: string;
  competitors: CompetitorData[];
  data: AnalysisData;
}

export type AnalysisPhase = "input" | "analyzing" | "results";
