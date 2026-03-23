import { useState } from "react";
import { Brain, Search, AlertTriangle, BarChart3, Target, Zap, RefreshCw, ChevronRight, Sparkles, Eye, EyeOff, ThumbsUp, ThumbsDown, Minus, Globe, ArrowRight, Activity, Layers, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const MetaCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] p-5 ${className}`}>
    {children}
  </div>
);

const SentimentPill = ({ sentiment }: { sentiment: "positive" | "neutral" | "negative" }) => {
  const styles = {
    positive: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)]",
    neutral: "bg-secondary text-muted-foreground",
    negative: "bg-destructive/8 text-destructive",
  };
  const icons = {
    positive: <ThumbsUp className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />,
    negative: <ThumbsDown className="h-3 w-3" />,
  };
  const labels = { positive: "Positive", neutral: "Neutral", negative: "Negative" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[sentiment]}`}>
      {icons[sentiment]} {labels[sentiment]}
    </span>
  );
};

const PriorityDot = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  const colors = {
    high: "bg-destructive",
    medium: "bg-[hsl(38,92%,50%)]",
    low: "bg-muted-foreground/40",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium capitalize">
      <span className={`h-1.5 w-1.5 rounded-full ${colors[priority]}`} />
      {priority}
    </span>
  );
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

  // ─── INPUT PHASE ───
  if (phase === "input") {
    return (
      <div className="space-y-6 animate-slide-in">
        {/* Hero header */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">AI Brand Intelligence</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">
            Analyze how AI engines perceive your brand and get a targeted improvement plan
          </p>
        </div>

        <div className="max-w-[620px] mx-auto space-y-5">
          <MetaCard>
            <p className="text-sm font-medium text-foreground mb-5">Enter your brand details</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Brand Name *</label>
                <Input
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Website URL *</label>
                <Input
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Industry</label>
                <Input
                  placeholder="e.g. Fintech, SaaS, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
                <Textarea
                  placeholder="Briefly describe your products, services, and what makes you unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[90px] rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors resize-none"
                />
              </div>

              <Button
                onClick={startAnalysis}
                disabled={!brandName.trim() || !website.trim()}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-none"
              >
                <Search className="h-4 w-4" />
                Analyze AI Perception
              </Button>
            </div>
          </MetaCard>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: Eye, label: "Visibility Check" },
              { icon: BarChart3, label: "Sentiment Analysis" },
              { icon: Target, label: "Improvement Plan" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/70 border border-border/40">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── ANALYZING PHASE ───
  if (phase === "analyzing") {
    return (
      <div className="space-y-6 animate-slide-in">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-8">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">AI Brand Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyzing your brand across AI engines...</p>
        </div>

        <div className="max-w-md mx-auto mt-12">
          <MetaCard className="text-center py-14 px-8">
            {/* Spinner */}
            <div className="relative mx-auto mb-8 h-20 w-20">
              <div className="absolute inset-0 rounded-full border-[3px] border-secondary" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-[10px] rounded-full bg-primary/5 flex items-center justify-center">
                <Radio className="h-7 w-7 text-primary" />
              </div>
            </div>

            <h2 className="text-base font-semibold text-foreground mb-1">Scanning AI Engines</h2>
            <p className="text-sm text-muted-foreground mb-6">{analysisStep}</p>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">{progress}% complete</p>
            </div>

            {/* Engine dots */}
            <div className="mt-8 flex justify-center gap-5">
              {["ChatGPT", "Gemini", "Perplexity"].map((engine, i) => (
                <span key={engine} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${progress > (i + 1) * 15 ? "bg-primary" : "bg-border"}`} />
                  {engine}
                </span>
              ))}
            </div>
          </MetaCard>
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ───
  const data = mockAnalysis;
  const statusStyles: Record<string, { label: string; color: string }> = {
    invisible: { label: "Invisible", color: "bg-destructive/10 text-destructive" },
    weak: { label: "Weak", color: "bg-[hsl(38,92%,90%)] text-[hsl(38,92%,35%)]" },
    visible: { label: "Visible", color: "bg-primary/10 text-primary" },
    strong: { label: "Strong", color: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)]" },
  };

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">AI Brand Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Results for <span className="font-medium text-foreground">{brandName}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAnalysis} className="rounded-xl gap-1.5 h-9 border-border/60 shadow-none text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            New Analysis
          </Button>
          <Button className="rounded-xl gap-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs">
            <Zap className="h-3.5 w-3.5" />
            Activate Plan
          </Button>
        </div>
      </div>

      {/* Score + Engines Row */}
      <div className="grid grid-cols-4 gap-4">
        {/* Score */}
        <MetaCard className="flex flex-col items-center justify-center py-7">
          <div className="relative h-24 w-24 mb-3">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="6"
                strokeDasharray={`${(data.overallScore / 100) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{data.overallScore}</span>
            </div>
          </div>
          <p className="text-xs font-medium text-muted-foreground">Visibility Score</p>
          <span className={`mt-1.5 inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles[data.status].color}`}>
            {statusStyles[data.status].label}
          </span>
        </MetaCard>

        {/* Engine Cards */}
        {data.engines.map((eng) => (
          <MetaCard key={eng.engine}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">{eng.engine}</span>
              {eng.mentioned ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(142,71%,95%)]">
                  <Eye className="h-3 w-3 text-[hsl(142,71%,35%)]" />
                </span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <SentimentPill sentiment={eng.sentiment} />
              {eng.position && (
                <span className="text-[11px] text-muted-foreground ml-auto font-medium">#{eng.position}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{eng.snippet}</p>
          </MetaCard>
        ))}
      </div>

      {/* Two Column: Narrative + Gaps */}
      <div className="grid grid-cols-2 gap-4">
        {/* Narrative */}
        <MetaCard>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Narrative Breakdown</h3>
          </div>
          <div className="space-y-3">
            {data.engines.map((eng) => (
              <div key={eng.engine} className="rounded-xl bg-secondary/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{eng.engine}</span>
                  <SentimentPill sentiment={eng.sentiment} />
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{eng.snippet}</p>
                <div className="space-y-1.5">
                  {eng.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-[hsl(38,92%,50%)] shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MetaCard>

        {/* Visibility Gaps */}
        <MetaCard>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-[hsl(38,92%,50%)]" />
            <h3 className="text-sm font-semibold text-foreground">Visibility Gaps</h3>
          </div>
          <div className="space-y-2.5">
            {data.gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-snug">{gap}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Auto-Detection Active</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Continuously monitoring AI engine responses and detecting new gaps as they emerge.
            </p>
          </div>
        </MetaCard>
      </div>

      {/* Improvement Plan */}
      <MetaCard>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Improvement Plan</h3>
          </div>
          <Button className="rounded-xl gap-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs px-4">
            <Zap className="h-3.5 w-3.5" />
            Activate All
          </Button>
        </div>

        <div className="space-y-2">
          {data.improvementPlan.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors group cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
                  <PriorityDot priority={step.priority} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{step.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </div>
          ))}
        </div>

        {/* Continuous loop banner */}
        <div className="mt-5 flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
            <RefreshCw className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Continuous Optimization Loop</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Three Reach continuously monitors, re-evaluates, and refines your strategy automatically.
            </p>
          </div>
        </div>
      </MetaCard>
    </div>
  );
}
