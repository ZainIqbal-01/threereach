import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProofCountProps {
  count: number;
  recentMentions?: string[];
}

export function ProofCount({ count, recentMentions = [] }: ProofCountProps) {
  return (
    <div className="card-reach">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🛡️</span>
        <div>
          <h4 className="text-sm font-bold text-foreground">Proof Collected</h4>
          <p className="text-xs text-muted-foreground font-semibold">Verified AI mentions</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <motion.span
            className="text-4xl font-black text-foreground"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            {count}
          </motion.span>
          <span className="text-lg text-muted-foreground ml-1 font-bold">mentions</span>
        </div>
        <Link 
          to="/dashboard/proof"
          className="flex items-center gap-1 text-sm font-bold text-electric hover:text-electric-hover transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {recentMentions.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-border">
          <p className="text-xs text-muted-foreground mb-2 font-bold">Recent mentions:</p>
          <div className="space-y-1">
            {recentMentions.slice(0, 2).map((mention, i) => (
              <p key={i} className="text-sm text-foreground truncate font-semibold">{mention}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
