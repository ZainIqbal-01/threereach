import { useEffect, useState } from "react";

interface ModuleProgressProps {
  title: string;
  description: string;
  progress: number;
  total?: number;
  unit?: string;
  color?: "primary" | "accent" | "success";
  /** Optional hint shown below the progress bar (e.g. "Next: publish 3 articles"). */
  nextMilestone?: string;
}

export function ModuleProgress({
  title,
  description,
  progress,
  total,
  unit,
  color = "primary",
  nextMilestone,
}: ModuleProgressProps) {
  const targetPct = total ? (progress / total) * 100 : progress;

  // Animated counter (number) + animated bar fill
  const [displayValue, setDisplayValue] = useState(0);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1000;
    const target = progress;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setDisplayValue(Math.round(target * eased));
      setFillPct(targetPct * eased);
      if (pct < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [progress, targetPct]);

  const gradients = {
    primary: "from-primary to-primary/70",
    accent: "from-accent to-accent/70",
    success: "from-success to-success/70",
  };

  return (
    <div className="card-reach">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {total ? `${displayValue}/${total}` : `${displayValue}%`}
          {unit && (
            <span className="text-[10px] text-muted-foreground ml-1 font-medium">
              {unit}
            </span>
          )}
        </span>
      </div>

      {/* Animated, shimmering progress bar */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradients[color]} progress-shimmer overflow-hidden`}
          style={{
            width: `${fillPct}%`,
            transition: "width 0.1s linear",
            boxShadow: `0 0 10px hsl(var(--${color}) / 0.35)`,
          }}
        />
      </div>

      {nextMilestone && (
        <p className="mt-3 text-[10px] text-muted-foreground">
          <span className="text-muted-foreground/80">Next: </span>
          <span className="text-foreground/80">{nextMilestone}</span>
        </p>
      )}
    </div>
  );
}
