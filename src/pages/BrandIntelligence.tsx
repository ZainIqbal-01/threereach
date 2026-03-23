import { useState } from "react";
import { Brain, Search, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, BarChart3, Target, Zap, RefreshCw, Globe, Shield, ChevronRight, Sparkles, Eye, EyeOff, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

type AnalysisPhase = "input" | "analyzing" | "results";

interface EngineResult {
  engine: string;
  mentioned: boolean;
  position: number | null;
  sentiment: "positive" | "neutral" | "negative";
  snippet: string;
  reasons: string[];
}

interface AnalysisData {
  overallScore: number;
  status: "invisible" | "weak" | "visible" | "strong";
  engines: EngineResult[];
  gaps: string[];
  improvementPlan: { title: string; description: string; priority: "high" | "medium" | "low" }[];
}

const mockAnalysis: AnalysisData = {
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
    { title: "Build AI Knowledge Identity", description: "Create structured content pages (landing, FAQ, trust, founder) optimized for AI crawlers to establish brand authority.", priority: "high" },
    { title: "Strategic Platform Distribution", description: "Submit and verify brand presence across 60+ platforms that AI engines use as citation sources.", priority: "high" },
    { title: "Deploy GEO Tactics", description: "Implement Generative Engine Optimization with keyword-rich, entity-focused content designed to influence AI model responses.", priority: "medium" },
    { title: "Sentiment Correction Campaign", description: "Address negative or missing narratives by publishing trust statements, case studies, and verified proof points.", priority: "medium" },
    { title: "Continuous Monitoring Loop", description: "Set up automated re-scans to track visibility changes and refine strategy based on real-time AI engine responses.", priority: "low" },
  ],
};

const sentimentIcon = (s: "positive" | "neutral" | "negative") => {
  if (s === "positive") return <ThumbsUp className="h-4 w-4 text-cyan" />;
  if (s === "negative") return <ThumbsDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const sentimentLabel = (s: "positive" | "neutral" | "negative") => {
  const config: Record<string, string> = {
    positive: "status-strong",
    neutral: "status-weak",
    negative: "status-invisible",
  };
  const labels: Record<string, string> = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
  };
  return <span className={`status-badge ${config[s]}`}>{labels[s]}</span>;
};

const priorityColor = (p: "high" | "medium" | "low") => {
  if (p === "high") return "bg-destructive/10 text-destructive border-destructive/20";
  if (p === "medium") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-muted text-muted-foreground border-border";
};

export default function BrandIntelligence() {
  const [phase, setPhase] = useState<AnalysisPhase>("input");
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

  const startAnalysis = () => {
    if (!brandName.trim() || !website.trim()) return;
    setPhase("analyzing");
    setProgress(0);

    const steps = [
      { pct: 15, label: "Querying ChatGPT for brand mentions..." },
      { pct: 30, label: "Scanning Gemini responses..." },
      { pct: 45, label: "Analyzing Perplexity citations..." },
      { pct: 60, label: "Evaluating sentiment & narrative..." },
      { pct: 75, label: "Identifying visibility gaps..." },
      { pct: 90, label: "Generating improvement strategy..." },
      { pct: 100, label: "Analysis complete!" },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(step.pct);
        setAnalysisStep(step.label);
        if (i === steps.length - 1) {
          setTimeout(() => setPhase("results"), 800);
        }
      }, (i + 1) * 1200);
    });
  };

  const resetAnalysis = () => {
    setPhase("input");
    setProgress(0);
    setAnalysisStep("");
  };

  // INPUT PHASE
  if (phase === "input") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div>
          <h1 className="text-2xl font-bold text-navy">AI Brand Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Analyze how AI engines perceive your brand and get a targeted improvement plan
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-reach">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10">
                <Brain className="h-6 w-6 text-electric" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-navy">Brand Analysis Setup</h2>
                <p className="text-sm text-muted-foreground">Enter your brand details to begin AI perception analysis</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Brand / Company Name *</label>
                <Input
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Website URL *</label>
                <Input
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Industry / Category</label>
                <Input
                  placeholder="e.g. Fintech, SaaS, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">What does your brand do?</label>
                <Textarea
                  placeholder="Briefly describe your products, services, and what makes you unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={startAnalysis}
                disabled={!brandName.trim() || !website.trim()}
                className="w-full h-12 bg-electric hover:bg-electric-hover text-primary-foreground text-base font-semibold gap-2"
              >
                <Search className="h-5 w-5" />
                Analyze AI Perception
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: Eye, label: "Visibility Check", desc: "See if AI engines mention you" },
              { icon: BarChart3, label: "Sentiment Analysis", desc: "Understand how you're portrayed" },
              { icon: Target, label: "Improvement Plan", desc: "Get actionable GEO strategy" },
            ].map((item) => (
              <div key={item.label} className="card-reach text-center p-4">
                <item.icon className="h-6 w-6 text-electric mx-auto mb-2" />
                <p className="text-sm font-medium text-navy">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ANALYZING PHASE
  if (phase === "analyzing") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div>
          <h1 className="text-2xl font-bold text-navy">AI Brand Intelligence</h1>
          <p className="text-muted-foreground mt-1">Analyzing your brand across AI engines...</p>
        </div>

        <div className="max-w-xl mx-auto mt-16">
          <div className="card-reach text-center py-12">
            <div className="relative mx-auto mb-8 h-24 w-24">
              <div className="absolute inset-0 rounded-full border-4 border-electric/20" />
              <div className="absolute inset-0 rounded-full border-4 border-electric border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-electric/10 flex items-center justify-center">
                <Brain className="h-10 w-10 text-electric" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-navy mb-2">Scanning AI Engines</h2>
            <p className="text-sm text-muted-foreground mb-6">{analysisStep}</p>

            <div className="max-w-sm mx-auto">
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
            </div>

            <div className="mt-8 flex justify-center gap-6">
              {["ChatGPT", "Gemini", "Perplexity"].map((engine) => (
                <div key={engine} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`h-2 w-2 rounded-full ${progress > 30 ? "bg-cyan" : "bg-muted-foreground/30"} transition-colors`} />
                  {engine}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  const data = mockAnalysis;
  const statusConfig: Record<string, { label: string; class: string }> = {
    invisible: { label: "Invisible", class: "status-invisible" },
    weak: { label: "Weak", class: "status-weak" },
    visible: { label: "Visible", class: "status-moderate" },
    strong: { label: "Strong", class: "status-strong" },
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">AI Brand Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Analysis results for <span className="font-semibold text-navy">{brandName}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetAnalysis} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            New Analysis
          </Button>
          <Button className="gap-2 bg-electric hover:bg-electric-hover text-primary-foreground">
            <Zap className="h-4 w-4" />
            Activate Improvement Plan
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card-reach col-span-1 text-center py-8">
          <div className="relative mx-auto h-28 w-28 mb-4">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="hsl(var(--electric))" strokeWidth="8"
                strokeDasharray={`${(data.overallScore / 100) * 327} 327`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-navy">{data.overallScore}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-navy">AI Visibility Score</p>
          <span className={`status-badge ${statusConfig[data.status].class} mt-2`}>
            {statusConfig[data.status].label}
          </span>
        </div>

        {data.engines.map((eng) => (
          <div key={eng.engine} className="card-reach">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy">{eng.engine}</h3>
              {eng.mentioned ? (
                <Eye className="h-4 w-4 text-cyan" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              {sentimentIcon(eng.sentiment)}
              {sentimentLabel(eng.sentiment)}
              {eng.position && (
                <span className="text-xs text-muted-foreground ml-auto">Position #{eng.position}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{eng.snippet}</p>
          </div>
        ))}
      </div>

      {/* Narrative & Sentiment Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card-reach">
          <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-electric" />
            Narrative Breakdown
          </h3>
          <div className="space-y-4">
            {data.engines.map((eng) => (
              <div key={eng.engine} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-navy text-sm">{eng.engine}</span>
                  {sentimentLabel(eng.sentiment)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{eng.snippet}</p>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-navy">Why this perception:</p>
                  {eng.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility Gaps */}
        <div className="card-reach">
          <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Visibility Gaps Detected
          </h3>
          <div className="space-y-3">
            {data.gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <span className="text-xs font-bold text-destructive">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground">{gap}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-electric/5 border border-electric/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-electric" />
              <p className="text-sm font-semibold text-navy">Auto-Detection Active</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Our system continuously monitors AI engine responses and automatically detects new gaps as they emerge.
            </p>
          </div>
        </div>
      </div>

      {/* Improvement Plan */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
            <Target className="h-5 w-5 text-electric" />
            Targeted Improvement Plan
          </h3>
          <Button className="gap-2 bg-electric hover:bg-electric-hover text-primary-foreground" size="sm">
            <Zap className="h-4 w-4" />
            Activate All Steps
          </Button>
        </div>

        <div className="space-y-4">
          {data.improvementPlan.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-electric/30 transition-colors group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric font-semibold text-sm">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-navy">{step.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColor(step.priority)}`}>
                    {step.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-electric opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                Start <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-cyan-light border border-cyan/20">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-4 w-4 text-cyan" />
            <p className="text-sm font-semibold text-navy">Continuous Optimization Loop</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Once activated, Three Reach continuously monitors AI engine responses, re-evaluates your visibility, and refines the strategy automatically—creating an ongoing loop that actively works to improve and control your brand perception.
          </p>
        </div>
      </div>
    </div>
  );
}
