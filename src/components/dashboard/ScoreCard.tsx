import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  status: "invisible" | "weak" | "visible" | "strong";
  /** Optional weekly trail for the inline sparkline (most recent last). */
  trend?: number[];
}

const statusConfig = {
  invisible: {
    label: "Invisible",
    gradient: ["hsl(0, 84%, 60%)", "hsl(0, 60%, 50%)"],
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    glow: "hsl(0, 84%, 60%)",
  },
  weak: {
    label: "Weak",
    gradient: ["hsl(38, 92%, 50%)", "hsl(25, 95%, 53%)"],
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    glow: "hsl(38, 92%, 50%)",
  },
  visible: {
    label: "Visible",
    gradient: ["hsl(217, 91%, 60%)", "hsl(187, 85%, 53%)"],
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    glow: "hsl(217, 91%, 60%)",
  },
  strong: {
    label: "Strong",
    gradient: ["hsl(142, 71%, 45%)", "hsl(160, 84%, 39%)"],
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    glow: "hsl(142, 71%, 45%)",
  },
};

export function ScoreCard({
  score,
  previousScore = 0,
  status,
  trend = [12, 18, 24, 28, 32, 38, 42],
}: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const change = score - previousScore;
  const config = statusConfig[status];

  const radius = 58;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const viewBox = 140;
  const center = viewBox / 2;

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1400;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setAnimatedScore(Math.round(score * eased));
      if (pct < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  // 60-segment tick marks
  const segments = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 15 === 0;
    const isMid = i % 5 === 0;
    const outerR = radius + strokeWidth / 2 + 3;
    const innerR = outerR + (isMajor ? 6 : isMid ? 4 : 2);
    return {
      x1: center + outerR * Math.cos(rad),
      y1: center + outerR * Math.sin(rad),
      x2: center + innerR * Math.cos(rad),
      y2: center + innerR * Math.sin(rad),
      isMajor,
      isMid,
    };
  });

  // Sparkline path generation (80x20 viewbox)
  const sparkW = 80;
  const sparkH = 20;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const sparkPath = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * sparkW;
      const y = sparkH - ((v - min) / range) * sparkH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="card-premium flex flex-col items-center justify-center py-5 sm:py-6 relative overflow-hidden">
      {/* Soft pulsing radial glow tinted by status */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none halo-pulse"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${config.glow}26 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <Activity className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          AI Visibility Score
        </p>
      </div>

      <div className="relative">
        <svg className="w-40 h-40 sm:w-44 sm:h-44" viewBox={`0 0 ${viewBox} ${viewBox}`}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
            <filter id="scoreGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
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

          {segments.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="hsl(var(--border))"
              strokeWidth={t.isMajor ? 1.5 : t.isMid ? 1 : 0.5}
              opacity={t.isMajor ? 0.5 : t.isMid ? 0.35 : 0.15}
            />
          ))}

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#bgRing)"
            strokeWidth={strokeWidth}
            className="opacity-30"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            className="transition-all duration-700 ease-out"
            filter="url(#scoreGlow)"
          />

          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2 - 4}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth / 2 + 1}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            opacity="0.15"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-4xl sm:text-5xl font-bold tabular-nums ${config.text} counter-up`}
          >
            {animatedScore}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">/100</span>
          <span
            className={`mt-1.5 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Inline sparkline + change chip */}
      <div className="relative mt-4 flex items-center gap-3">
        <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} className="opacity-90">
          <defs>
            <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
          </defs>
          <path
            d={sparkPath}
            fill="none"
            stroke="url(#sparkLine)"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {change !== 0 && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
              change > 0
                ? "bg-success/10 border border-success/20"
                : "bg-destructive/10 border border-destructive/20"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span
              className={`font-semibold ${change > 0 ? "text-success" : "text-destructive"}`}
            >
              {change > 0 ? "+" : ""}
              {change}
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
