import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { agents } from "@/components/agents/agentRegistry";

interface DashboardEmptyStateProps {
  businessName: string;
}

export function DashboardEmptyState({ businessName }: DashboardEmptyStateProps) {
  return (
    <div className="card-premium gradient-hero flex flex-col items-center text-center py-10 px-6 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 mesh-bg opacity-70 pointer-events-none" />
      <div className="relative">
        <AgentBadge agent={agents.nova} mood="excited" size={64} showRole={false} />
      </div>
      <h2 className="relative text-xl md:text-2xl font-bold text-foreground mt-5">
        Welcome to <span className="gradient-text">Three Reach AI</span>, {businessName}
      </h2>
      <p className="relative text-sm text-muted-foreground mt-2 max-w-md">
        You haven't run an AI visibility scan yet. Let's measure how ChatGPT, Gemini and Perplexity see your brand
        right now — it takes about a minute.
      </p>
      <div className="relative flex flex-col sm:flex-row gap-3 mt-6">
        <Link
          to="/dashboard/brand-intelligence"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow text-sm font-medium transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Run your first analysis
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/dashboard/scan"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-border/60 hover:bg-secondary/60 text-foreground text-sm font-medium transition-all"
        >
          Quick scan instead
        </Link>
      </div>
    </div>
  );
}
