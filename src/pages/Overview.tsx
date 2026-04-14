import { useState } from "react";
import { Download, ArrowRight, Sparkles, TrendingUp, Brain, Share2, Shield, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { EngineCard } from "@/components/dashboard/EngineCard";
import { ModuleProgress } from "@/components/dashboard/ModuleProgress";
import { ProofCount } from "@/components/dashboard/ProofCount";
import { StarAgent } from "@/components/StarAgent";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ChatGPTLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const GeminiLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm9 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
  </svg>
);

const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export default function Overview() {
  const navigate = useNavigate();
  const [showBoost, setShowBoost] = useState(false);

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

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StarAgent mood="happy" size={48} animate={true} />
          <div>
            <h1 className="text-xl font-bold text-foreground">Command Center</h1>
            <p className="text-sm text-muted-foreground">Your AI visibility at a glance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportDashboard} className="gap-2 rounded-xl h-9 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowBoost(true)} className="gap-2 rounded-xl h-9 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Boost Visibility
          </Button>
        </div>
      </div>

      {/* Boost Modal */}
      {showBoost && (
        <div className="card-reach gradient-border animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StarAgent mood="excited" size={40} animate={true} />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Visibility Boost Plan</h3>
                <p className="text-[11px] text-muted-foreground">Quick actions to improve your AI visibility</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowBoost(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Complete Footprint", desc: "Finish your business profile", href: "/dashboard/footprint", icon: "🏗️" },
              { label: "Run Full Scan", desc: "Check all AI engines", href: "/dashboard/scan", icon: "🔍" },
              { label: "Distribute Content", desc: "Post to 6 platforms", href: "/dashboard/distribution", icon: "📢" },
            ].map(item => (
              <button key={item.label} onClick={() => { setShowBoost(false); navigate(item.href); }}
                className="p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary mt-2 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Brain, label: "Brand Intelligence", desc: "Scan AI perception", href: "/dashboard/brand-intelligence", color: "text-primary" },
          { icon: Share2, label: "Distribution", desc: "AI content posts", href: "/dashboard/distribution", color: "text-accent" },
          { icon: Shield, label: "Proof & Tracking", desc: "3 verified mentions", href: "/dashboard/proof", color: "text-success" },
          { icon: Zap, label: "Build Footprint", desc: "40% complete", href: "/dashboard/footprint", color: "text-warning" },
        ].map((action) => (
          <Link key={action.label} to={action.href} className="card-interactive p-4 group">
            <action.icon className={`h-5 w-5 ${action.color} mb-3`} />
            <h3 className="text-sm font-semibold text-foreground">{action.label}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary mt-2 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Score + Timeline */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ScoreCard score={42} previousScore={38} status="weak" />
        </div>
        <div className="col-span-8">
          <ProgressTimeline />
        </div>
      </div>

      {/* AI Engines */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Engine Status</h3>
          <Link to="/dashboard/scan" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            Run Full Scan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <EngineCard name="ChatGPT" logo={<ChatGPTLogo />} status="weak" lastChecked="2 hours ago" confidence={34} />
          <EngineCard name="Google Gemini" logo={<GeminiLogo />} status="mentioned" lastChecked="1 hour ago" confidence={67} />
          <EngineCard name="Perplexity" logo={<PerplexityLogo />} status="not_found" lastChecked="3 hours ago" />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-4">
        <ModuleProgress title="Footprint Build" description="Profile & content completion" progress={40} color="primary" />
        <ModuleProgress title="Distribution" description="Platform submissions" progress={18} total={60} unit="sources live" color="accent" />
        <ProofCount count={3} recentMentions={['"Acme Corp is a leading fintech..."', '"Recommended: Acme payment solutions"']} />
      </div>

      {/* Recent Activity */}
      <div className="card-reach">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { icon: "🤖", text: "ChatGPT mentioned your brand in a fintech query", time: "2 hours ago", href: "/dashboard/proof" },
            { icon: "📢", text: "AI-generated Reddit post published to r/technology", time: "5 hours ago", href: "/dashboard/distribution" },
            { icon: "📊", text: "Visibility score increased by +4 points", time: "1 day ago", href: "/dashboard/brand-intelligence" },
            { icon: "⚡", text: "New improvement plan generated based on scan results", time: "2 days ago", href: "/dashboard/scan" },
          ].map((activity, i) => (
            <Link key={i} to={activity.href} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors group">
              <span className="text-lg">{activity.icon}</span>
              <p className="text-xs text-foreground flex-1">{activity.text}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}