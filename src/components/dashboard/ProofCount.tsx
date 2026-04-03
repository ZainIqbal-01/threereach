import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProofCountProps {
  count: number;
  recentMentions?: string[];
}

export function ProofCount({ count, recentMentions = [] }: ProofCountProps) {
  return (
    <div className="card-reach">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
          <Shield className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Proof Collected</h4>
          <p className="text-[11px] text-muted-foreground">Verified AI mentions</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-foreground">{count}</span>
          <span className="text-sm text-muted-foreground ml-1.5">mentions</span>
        </div>
        <Link 
          to="/dashboard/proof"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      {recentMentions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Recent</p>
          <div className="space-y-1.5">
            {recentMentions.slice(0, 2).map((mention, i) => (
              <p key={i} className="text-xs text-foreground truncate leading-relaxed">{mention}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
