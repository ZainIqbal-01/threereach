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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-light">
          <Shield className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-navy">Proof Collected</h4>
          <p className="text-xs text-muted-foreground">Verified AI mentions</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-bold text-navy">{count}</span>
          <span className="text-lg text-muted-foreground ml-1">mentions</span>
        </div>
        <Link 
          to="/proof"
          className="flex items-center gap-1 text-sm font-medium text-electric hover:text-electric-hover transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {recentMentions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Recent mentions:</p>
          <div className="space-y-1">
            {recentMentions.slice(0, 2).map((mention, i) => (
              <p key={i} className="text-sm text-navy truncate">{mention}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
