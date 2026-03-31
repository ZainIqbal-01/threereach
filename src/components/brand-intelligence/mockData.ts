import { AnalysisData, CompetitorData } from "./types";

export const mockAnalysis: AnalysisData = {
  overallScore: 32,
  status: "weak",
  engines: [
    {
      engine: "ChatGPT",
      mentioned: true,
      position: 5,
      sentiment: "neutral",
      snippet: "Among various providers in the space, the brand is occasionally referenced but lacks authoritative positioning compared to leading competitors.",
      reasons: ["Limited authority signals", "Competitors dominate top positions", "Insufficient structured data"],
    },
    {
      engine: "Gemini",
      mentioned: false,
      position: null,
      sentiment: "negative",
      snippet: "Not found in relevant queries. The brand does not appear in AI-generated recommendations for this category.",
      reasons: ["No indexed knowledge base", "Missing from key directories", "No trust signals detected"],
    },
    {
      engine: "Perplexity",
      mentioned: true,
      position: 8,
      sentiment: "neutral",
      snippet: "Mentioned briefly in a list format without detailed context or recommendation strength.",
      reasons: ["Weak content footprint", "Poor distribution across citation sources", "No FAQ schema detected"],
    },
  ],
  gaps: [
    "No dedicated AI-optimized landing page",
    "Missing from 42 of 60 key distribution platforms",
    "No structured FAQ schema for AI crawlers",
    "Founder/team authority pages not published",
    "Competitor content outranks across all engines",
  ],
  improvementPlan: [
    { title: "Build AI Knowledge Identity", description: "Create structured content pages optimized for AI crawlers to establish brand authority.", priority: "high" },
    { title: "Strategic Platform Distribution", description: "Submit and verify brand presence across 60+ platforms that AI engines use as citation sources.", priority: "high" },
    { title: "Deploy GEO Tactics", description: "Implement Generative Engine Optimization with keyword-rich, entity-focused content.", priority: "medium" },
    { title: "Sentiment Correction Campaign", description: "Address negative narratives by publishing trust statements and case studies.", priority: "medium" },
    { title: "Continuous Monitoring Loop", description: "Set up automated re-scans to track visibility changes.", priority: "low" },
  ],
};

export const generateCompetitorData = (name: string): CompetitorData => {
  const score = Math.floor(Math.random() * 80) + 10;
  const status = score < 25 ? "invisible" : score < 50 ? "weak" : score < 75 ? "visible" : "strong";
  return {
    name,
    score,
    status,
    engines: [
      { engine: "ChatGPT", mentioned: Math.random() > 0.3, sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any },
      { engine: "Gemini", mentioned: Math.random() > 0.4, sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any },
      { engine: "Perplexity", mentioned: Math.random() > 0.35, sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any },
    ],
  };
};
