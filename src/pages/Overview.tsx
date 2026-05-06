import { useState, useEffect } from "react";
import { RedditLogo } from "@/components/ui/platform-logos";
import {
  Download,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Brain,
  Share2,
  Shield,
  Zap,
  X,
  Eye,
  Clock,
  MessageSquare,
  Send,
  BarChart3,
  Wand2,
} from "lucide-react";
import { useBusinessName } from "@/hooks/useBusinessName";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { EngineCard } from "@/components/dashboard/EngineCard";
import { ModuleProgress } from "@/components/dashboard/ModuleProgress";
import { ProofCount } from "@/components/dashboard/ProofCount";
import { VisibilityTrendChart } from "@/components/dashboard/VisibilityTrendChart";
import { EngineBreakdownChart } from "@/components/dashboard/EngineBreakdownChart";
import { ContentActivityChart } from "@/components/dashboard/ContentActivityChart";
import { NextBestAction } from "@/components/dashboard/NextBestAction";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { AgentHub } from "@/components/agents/AgentHub";
import { agents } from "@/components/agents/agentRegistry";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ChatGPTLogo, GeminiLogo, PerplexityLogo, getEngineLogo } from "@/components/ui/ai-engine-logos";

// ─── Recent activity (typed so we can group by day & render branded icons) ───
type ActivityItem = {
  category: "engine" | "distribution" | "score" | "scan";
  engine?: string;
  text: string;
  ago: string; // relative
  absolute: string; // tooltip
  group: "Today" | "Yesterday" | "Earlier";
  href: string;
};

const recentActivity: ActivityItem[] = [
  {
    category: "engine",
    engine: "ChatGPT",
    text: "ChatGPT mentioned your brand in a fintech query",
    ago: "2 hours ago",
    absolute: "Today, 09:14",
    group: "Today",
    href: "/dashboard/proof",
  },
  {
    category: "distribution",
    text: "AI-generated Reddit post published to r/technology",
    ago: "5 hours ago",
    absolute: "Today, 06:22",
    group: "Today",
    href: "/dashboard/distribution",
  },
  {
    category: "score",
    text: "Visibility score increased by +4 points",
    ago: "1 day ago",
    absolute: "Yesterday, 18:40",
    group: "Yesterday",
    href: "/dashboard/brand-intelligence",
  },
  {
    category: "scan",
    text: "New improvement plan generated based on scan results",
    ago: "2 days ago",
    absolute: "2 days ago, 11:05",
    group: "Earlier",
    href: "/dashboard/scan",
  },
];

const categoryIcon = (item: ActivityItem) => {
  if (item.category === "engine" && item.engine) {
    return getEngineLogo(item.engine, "h-4 w-4");
  }
  if (item.category === "distribution") return <Send className="h-4 w-4 text-accent" />;
  if (item.category === "score") return <BarChart3 className="h-4 w-4 text-success" />;
  return <Wand2 className="h-4 w-4 text-warning" />;
};

export default function Overview() {
  const navigate = useNavigate();
  const businessName = useBusinessName();
  const [showBoost, setShowBoost] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 5 ? "Working late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 22 ? "Good evening" : "Working late";
  const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const exportDashboard = () => {
    const data = `Three Reach AI - Dashboard Export\nDate: ${new Date().toLocaleDateString()}\n\nVisibility Score: 42/100\nStatus: Weak\n\nEngine Status:\n- ChatGPT: Weak (34% confidence)\n- Gemini: Mentioned (67% confidence)\n- Perplexity: Not Found\n\nFootprint Progress: 40%\nDistribution: 18/60 sources live\nProof Records: 3 verified mentions`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-export.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Dashboard exported!", description: "Summary has been downloaded" });
  };

  // Group activity by day section (preserves order)
  const grouped = recentActivity.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});
  const groupOrder = ["Today", "Yesterday", "Earlier"] as const;

  return (
    <div className="relative space-y-5 md:space-y-6 animate-slide-in mesh-bg -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
      {/* Score + Welcome Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 animate-slide-up" style={{ animationFillMode: "both", animationDelay: "0ms" }}>
          <ScoreCard score={42} previousScore={38} status="weak" />
        </div>
        <div
          className="lg:col-span-8 animate-slide-up"
          style={{ animationFillMode: "both", animationDelay: "60ms" }}
        >
          <div className="card-premium gradient-hero h-full flex flex-col justify-between relative overflow-hidden">
            {/* Layered gradient mesh inside hero */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mesh-bg opacity-80"
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:gap-5">
                <AgentBadge agent={agents.nova} size={48} showRole={false} />
                <div className="leading-tight">
                  <h1 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                    {greeting}, <span className="gradient-text">{businessName}</span>
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success live-dot" />
                      Live · {timeStr}
                    </span>
                    <span className="text-border">·</span>
                    <span>Your AI visibility snapshot</span>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBoost(false)}
              className="h-8 w-8 p-0 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Complete Footprint",
                desc: "Finish your business profile",
                href: "/dashboard/footprint",
                icon: "🏗️",
                color: "from-primary/10 to-primary/5",
              },
              {
                label: "Run Full Scan",
                desc: "Check all AI engines",
                href: "/dashboard/scan",
                icon: "🔍",
                color: "from-accent/10 to-accent/5",
              },
              {
                label: "Distribute Content",
                desc: "AI-generate & post",
                href: "/dashboard/distribution",
                icon: "reddit" as const,
                color: "from-success/10 to-success/5",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setShowBoost(false);
                  navigate(item.href);
                }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-border/40 hover:border-primary/30 transition-all text-left group hover:shadow-md`}
              >
                <span className="text-2xl mb-3 block">
                  {item.icon === "reddit" ? <RedditLogo className="h-7 w-7" style={{ color: "#FF4500" }} /> : item.icon}
                </span>
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
          {
            icon: Brain,
            label: "Brand Intelligence",
            desc: "AI perception analysis",
            href: "/dashboard/brand-intelligence",
            color: "text-primary",
            bgColor: "bg-primary/8",
            gradient: "from-primary/10 via-card to-card",
            trend: "+12%",
            trendPositive: true,
          },
          {
            icon: Share2,
            label: "Distribution",
            desc: "AI content engine",
            href: "/dashboard/distribution",
            color: "text-accent",
            bgColor: "bg-accent/8",
            gradient: "from-accent/10 via-card to-card",
            trend: "+8%",
            trendPositive: true,
          },
          {
            icon: Shield,
            label: "Proof & Tracking",
            desc: "3 verified mentions",
            href: "/dashboard/proof",
            color: "text-[hsl(var(--success))]",
            bgColor: "bg-success-light",
            gradient: "from-success/10 via-card to-card",
            trend: "+2",
            trendPositive: true,
          },
          {
            icon: Zap,
            label: "Build Footprint",
            desc: "40% complete",
            href: "/dashboard/footprint",
            color: "text-[hsl(var(--warning))]",
            bgColor: "bg-warning-light",
            gradient: "from-warning/10 via-card to-card",
            trend: "+5%",
            trendPositive: true,
          },
        ].map((action, i) => (
          <Link
            key={action.label}
            to={action.href}
            className={`card-interactive p-4 md:p-5 group animate-slide-up bg-gradient-to-br ${action.gradient} min-h-[128px] md:min-h-[140px]`}
            style={{ animationFillMode: "both", animationDelay: `${120 + i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  action.trendPositive
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {action.trend}
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-foreground">{action.label}</h3>
            <p className="text-[10px] md:text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary mt-3 transition-all group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      {/* Smart Recommendations */}
      <NextBestAction score={42} footprintProgress={40} distributionLive={18} distributionTotal={60} />

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
          <Link
            to="/dashboard/scan"
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            Run Full Scan{" "}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <EngineCard
            name="ChatGPT"
            logo={<ChatGPTLogo />}
            status="weak"
            lastChecked="2 hours ago"
            confidence={34}
          />
          <EngineCard
            name="Google Gemini"
            logo={<GeminiLogo />}
            status="mentioned"
            lastChecked="1 hour ago"
            confidence={67}
          />
          <EngineCard
            name="Perplexity"
            logo={<PerplexityLogo />}
            status="not_found"
            lastChecked="3 hours ago"
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModuleProgress
          title="Footprint Build"
          description="Profile & content completion"
          progress={40}
          color="primary"
          nextMilestone="Add 2 more case studies to reach 60%"
        />
        <ModuleProgress
          title="Distribution"
          description="Platform submissions"
          progress={18}
          total={60}
          unit="sources live"
          color="accent"
          nextMilestone="Connect LinkedIn & Quora to unlock 12 more"
        />
        <ProofCount
          count={3}
          recentMentions={[
            `"${businessName} is a leading fintech..."`,
            `"Recommended: ${businessName} payment solutions"`,
            `"${businessName} stood out for security and UX"`,
          ]}
        />
      </div>

      {/* Recent Activity */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          </div>
          <Link
            to="/dashboard/proof"
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {groupOrder.map((groupKey) => {
            const items = grouped[groupKey];
            if (!items || items.length === 0) return null;
            return (
              <div key={groupKey}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {groupKey}
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
                <div className="space-y-1.5">
                  {items.map((activity, i) => (
                    <Link
                      key={`${groupKey}-${i}`}
                      to={activity.href}
                      className="flex items-center gap-3 p-3 md:p-3.5 rounded-xl hover:bg-secondary/60 transition-all group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/70 shrink-0 group-hover:bg-card transition-colors">
                        {categoryIcon(activity)}
                      </div>
                      <p className="text-xs text-foreground flex-1 line-clamp-1">
                        {activity.text}
                      </p>
                      <span
                        className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline tabular-nums"
                        title={activity.absolute}
                      >
                        {activity.ago}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
