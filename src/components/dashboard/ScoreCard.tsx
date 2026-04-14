import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  status: "invisible" | "weak" | "visible" | "strong";
}

const statusConfig = {
  invisible: {
    label: "Invisible",
    gradient: ["hsl(0, 84%, 60%)", "hsl(0, 60%, 50%)"],
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  weak: {
    label: "Weak",
    gradient: ["hsl(38, 92%, 50%)", "hsl(25, 95%, 53%)"],
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  visible: {
    label: "Visible",
    gradient: ["hsl(217, 91%, 60%)", "hsl(187, 85%, 53%)"],
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  strong: {
    label: "Strong",
    gradient: ["hsl(142, 71%, 45%)", "hsl(160, 84%, 39%)"],
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
};

export function ScoreCard({ score, previousScore = 0, status }: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const change = score - previousScore;
  const config = statusConfig[status];
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const viewBox = 130;
  const center = viewBox / 2;

  // Animate score on mount
  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1200;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3); // ease-out cubic
      setAnimatedScore(Math.round(score * eased));
      if (pct < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  // Tick marks
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 10 === 0;
    const outerR = radius + strokeWidth / 2 + 4;
    const innerR = outerR + (isMajor ? 5 : 3);
    return {
      x1: center + outerR * Math.cos(rad),
      y1: center + outerR * Math.sin(rad),
      x2: center + innerR * Math.cos(rad),
      y2: center + innerR * Math.sin(rad),
      isMajor,
    };
  });

  return (
    <div className="card-premium flex flex-col items-center justify-center py-6 sm:py-8">
      <div className="flex items-center gap-2 mb-5">
        <Zap className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Visibility Score</p>
      </div>

      <div className="relative">
        <svg className="w-44 h-44 sm:w-48 sm:h-48" viewBox={`0 0 ${viewBox} ${viewBox}`}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
            <filter id="scoreGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bgRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--border))" />
            </linearGradient>
          </defs>

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="hsl(var(--border))"
              strokeWidth={t.isMajor ? 1.5 : 0.8}
              opacity={t.isMajor ? 0.5 : 0.25}
            />
          ))}

          {/* Background ring */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#bgRing)" strokeWidth={strokeWidth}
            className="opacity-40"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />

          {/* Progress arc */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#scoreGradient)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            className="transition-all duration-700 ease-out"
            filter="url(#scoreGlow)"
          />

          {/* Inner subtle ring */}
          <circle
            cx={center} cy={center} r={radius - strokeWidth / 2 - 3}
            fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl sm:text-[3.25rem] font-bold tabular-nums ${config.text} counter-up`}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-0.5">/100</span>
          <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border`}>
            {config.label}
          </span>
        </div>
      </div>

      {change !== 0 && (
        <div className="mt-5 flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${change > 0 ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
            {change > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={`font-semibold ${change > 0 ? "text-success" : "text-destructive"}`}>
              {change > 0 ? "+" : ""}{change} pts
            </span>
          </div>
          <span className="text-muted-foreground">this week</span>
        </div>
      )}
    </div>
  );
}
