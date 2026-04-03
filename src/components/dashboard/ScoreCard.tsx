import { TrendingUp, TrendingDown } from "lucide-react";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  status: "invisible" | "weak" | "visible" | "strong";
}

const statusColors = {
  invisible: { stroke: "hsl(0, 84%, 60%)", bg: "hsl(0, 84%, 60%)", text: "text-destructive" },
  weak: { stroke: "hsl(38, 92%, 50%)", bg: "hsl(38, 92%, 50%)", text: "text-warning" },
  visible: { stroke: "hsl(217, 91%, 60%)", bg: "hsl(217, 91%, 60%)", text: "text-primary" },
  strong: { stroke: "hsl(142, 71%, 45%)", bg: "hsl(142, 71%, 45%)", text: "text-success" },
};

export function ScoreCard({ score, previousScore = 0, status }: ScoreCardProps) {
  const change = score - previousScore;
  const colors = statusColors[status];
  const circumference = 2 * Math.PI * 42;
  const progress = (score / 100) * circumference;

  return (
    <div className="card-reach flex flex-col items-center justify-center py-8">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">AI Visibility Score</p>
      
      <div className="relative">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={colors.stroke} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />
          {/* Glow effect */}
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={colors.stroke} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            opacity="0.2" filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-[11px] text-muted-foreground">/100</span>
        </div>
      </div>

      {change !== 0 && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {change > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={change > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
            {change > 0 ? "+" : ""}{change} pts
          </span>
          <span className="text-muted-foreground">this week</span>
        </div>
      )}
    </div>
  );
}
