import { useState } from "react";
import {
  Download,
  ArrowRight,
  Sparkles,
  Brain,
  Share2,
  Shield,
  Zap,
  X,
  Eye,
} from "lucide-react";
import { useBusinessName } from "@/hooks/useBusinessName";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { EngineCard } from "@/components/dashboard/EngineCard";
import { ModuleProgress } from "@/components/dashboard/ModuleProgress";
import { ProofCount } from "@/components/dashboard/ProofCount";
import { VisibilityTrendChart } from "@/components/dashboard/VisibilityTrendChart";
import { EngineBreakdownChart } from "@/components/dashboard/EngineBreakdownChart";
import { ContentActivityChart } from "@/components/dashboard/ContentActivityChart";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { AgentHub } from "@/components/agents/AgentHub";
import { agents } from "@/components/agents/agentRegistry";
import {
  ScoreCardSkeleton,
  StatCardSkeleton,
  EngineCardSkeleton,
} from "@/components/dashboard/DashboardSkeletons";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SEO } from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ChatGPTLogo, GeminiLogo, PerplexityLogo, getEngineLogo } from "@/components/ui/ai-engine-logos";
import { buildDashboardCSV, downloadCSV } from "@/lib/exportDashboard";
import { BarChart3 } from "lucide-react";

const LOGO_MAP: Record<string, React.ReactNode> = {
  ChatGPT: <ChatGPTLogo />,
  Gemini: <GeminiLogo />,
  "Google Gemini": <GeminiLogo />,
  Perplexity: <PerplexityLogo />,
};

export default function Overview() {
  const navigate = useNavigate();
  const businessName = useBusinessName();
  const data = useDashboardData();
  const [showBoost, setShowBoost] = useState(false);

  const exportDashboard = () => {
    const csv = buildDashboardCSV(businessName, data);
    downloadCSV(`three-reach-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    toast({ title: "📥 Dashboard exported", description: "CSV summary downloaded" });
  };

  // Loading state
  if (data.loading) {
    return (
      <div className="space-y-5 mesh-bg -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
        <SEO title="Dashboard" description="Your AI visibility command center." />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4"><ScoreCardSkeleton /></div>
          <div className="lg:col-span-8"><StatCardSkeleton /></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <EngineCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Empty state — no scans yet
  if (!data.hasScans) {
    return (
      <div className="space-y-5 mesh-bg -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
        <SEO title="Dashboard" description="Your AI visibility command center." />
        <DashboardEmptyState businessName={businessName} />
        <AgentHub />
      </div>
    );
  }

  const change = data.currentScore - data.previousScore;
  const trendStr = change === 0 ? "—" : `${change > 0 ? "+" : ""}${change}`;
  const proofTrend = `+${Math.min(data.totalMentions, 99)}`;

  const engineDisplayList = data.engines.length
    ? data.engines.slice(0, 3)
    : [
        { name: "ChatGPT", status: "not_found" as const, confidence: 0, lastChecked: "—" },
        { name: "Gemini", status: "not_found" as const, confidence: 0, lastChecked: "—" },
        { name: "Perplexity", status: "not_found" as const, confidence: 0, lastChecked: "—" },
      ];

  return (
    <div className="relative space-y-5 md:space-y-6 animate-slide-in mesh-bg -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
      <SEO
        title="Dashboard"
        description={`AI visibility snapshot for ${businessName}. Track ChatGPT, Gemini and Perplexity mentions in real time.`}
      />

      {/* Score + Welcome Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 animate-slide-up" style={{ animationFillMode: "both" }}>
          <ScoreCard
            score={data.currentScore}
            previousScore={data.previousScore}
            status={data.status}
            trend={data.trend}
          />
        </div>
        <div className="lg:col-span-8 animate-slide-up" style={{ animationFillMode: "both", animationDelay: "60ms" }}>
          <div className="card-premium gradient-hero h-full flex flex-col justify-between relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 pointer-events-none mesh-bg opacity-80" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:gap-5">
                <AgentBadge agent={agents.nova} size={48} showRole={false} />
                <div className="leading-tight">
                  <h1 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                    Welcome back <span className="gradient-text">{businessName}</span>
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {data.scansThisWeek > 0
                      ? `${data.scansThisWeek} scan${data.scansThisWeek === 1 ? "" : "s"} this week · ${data.totalMentions} verified mention${data.totalMentions === 1 ? "" : "s"}`
                      : "Run a scan to refresh today's snapshot"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDashboard}
                  className="gap-2 rounded-xl h-9 text-xs border-border/60 shadow-none flex-1 sm:flex-none"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowBoost(true)}
                  className="gap-2 rounded-xl h-9 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow btn-shimmer text-xs flex-1 sm:flex-none"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Boost Visibility
                </Button>
              </div>
            </div>
            <div className="relative mt-4">
              <ProgressTimeline />
            </div>
          </div>
        </div>
      </div>

      {/* Boost Modal */}
      {showBoost && (
        <div className="card-premium animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <AgentBadge agent={agents.nova} mood="excited" size={42} showRole={false} />
              <div>
                <h3 className="text-sm font-bold text-foreground">Quick Boost Actions</h3>
                <p className="text-[11px] text-muted-foreground">
                  Pick an action to improve your visibility now
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowBoost(false)} className="h-8 w-8 p-0 rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Complete Footprint", desc: "Finish your business profile", href: "/dashboard/footprint", icon: "🏗️", color: "from-primary/10 to-primary/5" },
              { label: "Run Full Scan", desc: "Check all AI engines", href: "/dashboard/scan", icon: "🔍", color: "from-accent/10 to-accent/5" },
              { label: "Distribute Content", desc: "AI-generate & post", href: "/dashboard/distribution", icon: "📢", color: "from-success/10 to-success/5" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setShowBoost(false); navigate(item.href); }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-border/40 hover:border-primary/30 transition-all text-left group hover:shadow-md`}
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary mt-3 transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Brain, label: "Brand Intelligence", desc: "AI perception analysis", href: "/dashboard/brand-intelligence", color: "text-primary", bgColor: "bg-primary/8", gradient: "from-primary/10 via-card to-card", trend: trendStr, trendPositive: change >= 0 },
          { icon: Share2, label: "Distribution", desc: "AI content engine", href: "/dashboard/distribution", color: "text-accent", bgColor: "bg-accent/8", gradient: "from-accent/10 via-card to-card", trend: "Live", trendPositive: true },
          { icon: Shield, label: "Proof & Tracking", desc: `${data.totalMentions} verified mention${data.totalMentions === 1 ? "" : "s"}`, href: "/dashboard/proof", color: "text-[hsl(var(--success))]", bgColor: "bg-success-light", gradient: "from-success/10 via-card to-card", trend: proofTrend, trendPositive: true },
          { icon: Zap, label: "Build Footprint", desc: "Profile & schema", href: "/dashboard/footprint", color: "text-[hsl(var(--warning))]", bgColor: "bg-warning-light", gradient: "from-warning/10 via-card to-card", trend: "—", trendPositive: true },
        ].map((action, i) => (
          <Link
            key={action.label}
            to={action.href}
            className={`card-interactive p-4 md:p-5 group animate-slide-up bg-gradient-to-br ${action.gradient} min-h-[128px] md:min-h-[140px]`}
            style={{ animationFillMode: "both", animationDelay: `${120 + i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${action.trendPositive ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {action.trend}
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-foreground">{action.label}</h3>
            <p className="text-[10px] md:text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary mt-3 transition-all group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Analytics</h2>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-secondary/70 backdrop-blur px-2.5 py-1 rounded-full border border-border/60">
            Last 7 days
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <VisibilityTrendChart />
          <EngineBreakdownChart />
          <ContentActivityChart />
        </div>
      </div>

      {/* Agent Hub */}
      <AgentHub />

      {/* AI Engines */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Engine Status</h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success live-dot" />
              Live monitoring
            </span>
          </div>
          <Link to="/dashboard/scan" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group">
            Run Full Scan{" "}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {engineDisplayList.map((e) => (
            <EngineCard
              key={e.name}
              name={e.name}
              logo={LOGO_MAP[e.name] ?? getEngineLogo(e.name, "h-5 w-5")}
              status={e.status}
              lastChecked={e.lastChecked}
              confidence={e.confidence > 0 ? e.confidence : undefined}
            />
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModuleProgress
          title="Footprint Build"
          description="Profile & content completion"
          progress={Math.min(100, data.scansThisWeek * 12 + 25)}
          color="primary"
          nextMilestone="Add detailed brand info to reach 80%"
        />
        <ModuleProgress
          title="Scans Logged"
          description="Total brand analyses"
          progress={data.totalScans}
          total={Math.max(20, data.totalScans + 5)}
          unit="scans"
          color="accent"
          nextMilestone="Run weekly scans to track trends"
        />
        <ProofCount
          count={data.totalMentions}
          recentMentions={
            data.recentMentions.length > 0
              ? data.recentMentions
              : [`No verified mentions yet — run a scan to find them`]
          }
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
