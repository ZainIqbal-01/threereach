import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProofCountProps {
  count: number;
  recentMentions?: string[];
}

export function ProofCount({ count, recentMentions = [] }: ProofCountProps) {
  // Rotate through mentions one at a time with a gentle fade
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (recentMentions.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % recentMentions.length);
        setVisible(true);
      }, 280);
    }, 4200);
    return () => clearInterval(id);
  }, [recentMentions.length]);

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
          <span className="text-3xl font-bold text-foreground tabular-nums">{count}</span>
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Latest mention
            </p>
            {recentMentions.length > 1 && (
              <div className="flex items-center gap-1">
                {recentMentions.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === idx ? "w-3 bg-primary" : "w-1 bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <p
            className={`text-xs text-foreground leading-relaxed transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {recentMentions[idx]}
          </p>
        </div>
      )}
    </div>
  );
}
