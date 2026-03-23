import { TrendingUp } from "lucide-react";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  status: "invisible" | "weak" | "visible" | "strong";
}

export function ScoreCard({ score, previousScore = 0, status }: ScoreCardProps) {
  const change = score - previousScore;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const statusColors = {
    invisible: { stroke: "stroke-red-500", text: "text-red-600" },
    weak: { stroke: "stroke-amber-500", text: "text-amber-600" },
    visible: { stroke: "stroke-electric", text: "text-electric" },
    strong: { stroke: "stroke-emerald-500", text: "text-emerald-600" },
  };

  const colors = statusColors[status];

  return (
    <div className="card-reach flex flex-col items-center p-8">
      <h3 className="text-sm font-medium text-muted-foreground mb-6">AI Visibility Score</h3>
      
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colors.stroke} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>

      {change !== 0 && (
        <div className="mt-4 flex items-center gap-1.5 text-sm">
          <TrendingUp className={`h-4 w-4 ${change > 0 ? "text-emerald-500" : "text-red-500 rotate-180"}`} />
          <span className={change > 0 ? "text-emerald-600" : "text-red-600"}>
            {change > 0 ? "+" : ""}{change} points
          </span>
          <span className="text-muted-foreground">from last week</span>
        </div>
      )}
    </div>
  );
}
