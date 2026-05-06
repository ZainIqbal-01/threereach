import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, TrendingUp, Zap, Brain } from "lucide-react";

interface Insight {
  id: string;
  priority: "high" | "medium" | "low";
  icon: typeof Sparkles;
  title: string;
  description: string;
  impact: string;
  cta: string;
  href: string;
  accent: "primary" | "warning" | "accent" | "success";
}

interface NextBestActionProps {
  score: number;
  footprintProgress: number;
  distributionLive: number;
  distributionTotal: number;
}

export function NextBestAction({
  score,
  footprintProgress,
  distributionLive,
  distributionTotal,
}: NextBestActionProps) {
  const insights = useMemo<Insight[]>(() => {
    const items: Insight[] = [];

    if (score < 50) {
      items.push({
        id: "score",
        priority: "high",
        icon: Target,
        title: "Your visibility is below industry average",
        description: `Score of ${score} is 18 points behind peers. Run a full scan to identify gaps.`,
        impact: "+15 pts",
        cta: "Run Full Scan",
        href: "/dashboard/scan",
        accent: "warning",
      });
    }

    if (footprintProgress < 60) {
      items.push({
        id: "footprint",
        priority: "high",
        icon: Zap,
        title: "Complete your AI footprint",
        description: `Only ${footprintProgress}% built. Adding case studies & schema unlocks AI engine indexing.`,
        impact: "+8 pts",
        cta: "Build Footprint",
        href: "/dashboard/footprint",
        accent: "primary",
      });
    }

    const distPct = (distributionLive / distributionTotal) * 100;
    if (distPct < 50) {
      items.push({
        id: "distribution",
        priority: "medium",
        icon: TrendingUp,
        title: "Activate more distribution channels",
        description: `${distributionLive}/${distributionTotal} sources live. LinkedIn & Quora drive 40% of mentions.`,
        impact: "+12 mentions/wk",
        cta: "Distribute Content",
        href: "/dashboard/distribution",
        accent: "accent",
      });
    }

    if (items.length < 3) {
      items.push({
        id: "intel",
        priority: "low",
        icon: Brain,
        title: "Benchmark against competitors",
        description: "See how 3 top competitors rank in AI engines & where you can outperform.",
        impact: "Strategic",
        cta: "View Intelligence",
        href: "/dashboard/brand-intelligence",
        accent: "success",
      });
    }

    return items.slice(0, 3);
  }, [score, footprintProgress, distributionLive, distributionTotal]);

  const accentMap = {
    primary: { bg: "bg-primary/10", text: "text-primary", ring: "border-primary/30", chip: "bg-primary/15 text-primary" },
    warning: { bg: "bg-warning/10", text: "text-warning", ring: "border-warning/30", chip: "bg-warning/15 text-warning" },
    accent: { bg: "bg-accent/10", text: "text-accent", ring: "border-accent/30", chip: "bg-accent/15 text-accent" },
    success: { bg: "bg-success/10", text: "text-success", ring: "border-success/30", chip: "bg-success/15 text-success" },
  };

  return (
    <div className="card-premium relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Smart Recommendations</h3>
            <p className="text-[10px] text-muted-foreground">Prioritized by AI impact on your visibility score</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[10px] font-medium text-muted-foreground bg-secondary/70 px-2 py-1 rounded-full border border-border/60">
          {insights.length} actions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((insight, i) => {
          const a = accentMap[insight.accent];
          const Icon = insight.icon;
          return (
            <Link
              key={insight.id}
              to={insight.href}
              className={`group relative p-4 rounded-xl border ${a.ring} ${a.bg} hover:shadow-md transition-all hover:-translate-y-0.5 animate-slide-up`}
              style={{ animationFillMode: "both", animationDelay: `${i * 70}ms` }}
            >
              {insight.priority === "high" && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-warning opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
                </span>
              )}
              <div className="flex items-start gap-2.5 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-card/80 ${a.text} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.chip} tabular-nums`}>
                  {insight.impact}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-foreground leading-snug mb-1">
                {insight.title}
              </h4>
              <p className="text-[10.5px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {insight.description}
              </p>
              <div className={`flex items-center gap-1 text-[11px] font-semibold ${a.text}`}>
                {insight.cta}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
