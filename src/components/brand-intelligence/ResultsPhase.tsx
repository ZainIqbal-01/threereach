import { Eye, EyeOff, AlertTriangle, Activity, Sparkles, RefreshCw, Zap, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarAgent, StarMood } from "@/components/StarAgent";
import { MetaCard, SentimentPill, PriorityDot, statusStyles } from "./UIComponents";
import { CompetitorBenchmark } from "./CompetitorBenchmark";
import { HistoryChart } from "./HistoryChart";
import { ExportShare } from "./ExportShare";
import { AnalysisData, CompetitorData } from "./types";

interface ResultsPhaseProps {
  brandName: string;
  website: string;
  data: AnalysisData;
  competitors: CompetitorData[];
  onReset: () => void;
}

export function ResultsPhase({ brandName, website, data, competitors, onReset }: ResultsPhaseProps) {
  const moodMap: Record<string, StarMood> = { invisible: "sad", weak: "thinking", visible: "happy", strong: "superhero" };
  const messageMap: Record<string, string> = {
    invisible: "Oh no! AI can't find you at all 😢",
    weak: "We found some gaps. Let's fix them! 💪",
    visible: "Not bad! Room to grow 🚀",
    strong: "Amazing! Your brand is AI-famous! 🎉",
  };
  const resultMood = moodMap[data.status] || "happy";

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="card-premium gradient-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <StarAgent mood={resultMood} size={60} animate={true} />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">AI Brand Intelligence</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Results for <span className="font-semibold text-foreground">{brandName}</span>
                <span className="mx-2 text-border/60">·</span>
                <span className="text-xs">{messageMap[data.status]}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportShare brandName={brandName} website={website} data={data} competitors={competitors} />
            <Button variant="outline" onClick={onReset} className="rounded-xl gap-1.5 h-9 border-border/60 shadow-none text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> New Scan
            </Button>
            <Button className="rounded-xl gap-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs btn-primary-glow">
              <Zap className="h-3.5 w-3.5" /> Activate Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Score + Engines */}
      <div className="grid grid-cols-4 gap-4">
        <MetaCard className="flex flex-col items-center justify-center py-8 relative overflow-hidden">
          {/* Background decorative ring */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <div className="h-40 w-40 rounded-full border-[3px] border-primary" />
          </div>
          <div className="relative h-28 w-28 mb-4">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="5" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="5"
                strokeDasharray={`${(data.overallScore / 100) * 264} 264`} strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-foreground counter-up">{data.overallScore}</span>
              <span className="text-[10px] text-muted-foreground -mt-0.5">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">Visibility Score</p>
          <span className={`mt-2 inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${statusStyles[data.status].color}`}>
            {statusStyles[data.status].label}
          </span>
        </MetaCard>

        {data.engines.map((eng, i) => (
          <MetaCard key={eng.engine} className={`animate-slide-up stagger-${i + 1}`} style={{ animationFillMode: 'both' } as any}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-foreground">{eng.engine}</span>
              {eng.mentioned ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[hsl(142,71%,95%)] border border-[hsl(142,71%,45%)/0.15]">
                  <Eye className="h-3.5 w-3.5 text-[hsl(142,71%,35%)]" />
                </span>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-secondary border border-border/40">
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <SentimentPill sentiment={eng.sentiment} />
              {eng.position && (
                <span className="text-[11px] text-muted-foreground ml-auto font-bold bg-secondary px-2 py-0.5 rounded-md">
                  #{eng.position}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{eng.snippet}</p>
          </MetaCard>
        ))}
      </div>

      {/* Competitor Benchmark */}
      <CompetitorBenchmark brandName={brandName} brandData={data} competitors={competitors} />

      {/* History Chart */}
      <HistoryChart currentBrandName={brandName} />

      {/* Narrative + Gaps */}
      <div className="grid grid-cols-2 gap-4">
        <MetaCard>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Narrative Breakdown</h3>
          </div>
          <div className="space-y-3">
            {data.engines.map((eng) => (
              <div key={eng.engine} className="rounded-xl bg-secondary/30 p-4 border border-border/30 hover:border-border/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{eng.engine}</span>
                  <SentimentPill sentiment={eng.sentiment} />
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{eng.snippet}</p>
                <div className="space-y-1.5">
                  {eng.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(38,92%,50%)] shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MetaCard>

        <MetaCard>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Visibility Gaps</h3>
            </div>
            <span className="text-xs text-destructive font-semibold bg-destructive/8 px-2 py-0.5 rounded-md">{data.gaps.length} found</span>
          </div>
          <div className="space-y-2.5">
            {data.gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/30 hover:border-destructive/20 transition-colors group">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-[10px] font-bold text-destructive mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-foreground leading-snug">{gap}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-bold text-foreground">Auto-Detection Active</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Continuously monitoring AI engine responses and detecting new gaps.
            </p>
          </div>
        </MetaCard>
      </div>

      {/* Improvement Plan */}
      <MetaCard>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <StarAgent mood="superhero" size={44} animate={false} />
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Improvement Plan
                <span className="text-[10px] text-primary font-semibold bg-primary/8 px-2 py-0.5 rounded-md">{data.improvementPlan.length} steps</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Your AI agent is ready to execute</p>
            </div>
          </div>
          <Button className="rounded-xl gap-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs px-5 btn-primary-glow">
            <Zap className="h-3.5 w-3.5" /> Activate All
          </Button>
        </div>
        <div className="space-y-2">
          {data.improvementPlan.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all group cursor-pointer border border-transparent hover:border-primary/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                  <PriorityDot priority={step.priority} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{step.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/8 to-primary/8 border border-accent/15">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
            <RefreshCw className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Continuous Optimization Loop</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Three Reach continuously monitors, re-evaluates, and refines your strategy automatically.
            </p>
          </div>
        </div>
      </MetaCard>
    </div>
  );
}
