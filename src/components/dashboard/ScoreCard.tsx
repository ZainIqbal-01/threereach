import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  status: "invisible" | "weak" | "visible" | "strong";
}

const statusEmoji = {
  invisible: "😰",
  weak: "😐",
  visible: "😊",
  strong: "🔥",
};

const statusLabel = {
  invisible: "Invisible",
  weak: "Needs Work",
  visible: "Getting There",
  strong: "Crushing It",
};

export function ScoreCard({ score, previousScore = 0, status }: ScoreCardProps) {
  const change = score - previousScore;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const statusColors = {
    invisible: { stroke: "stroke-danger", text: "text-danger" },
    weak: { stroke: "stroke-warning", text: "text-warning" },
    visible: { stroke: "stroke-electric", text: "text-electric" },
    strong: { stroke: "stroke-success", text: "text-success" },
  };

  const colors = statusColors[status];

  return (
    <div className="card-reach flex flex-col items-center p-8">
      <h3 className="text-sm font-bold text-muted-foreground mb-2">AI Visibility Score</h3>
      
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="45" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/30" />
          <motion.circle
            cx="80" cy="80" r="45" strokeWidth="10" fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={colors.stroke}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {statusEmoji[status]}
          </motion.span>
          <span className={`text-3xl font-black ${colors.text}`}>{score}</span>
          <span className="text-xs font-bold text-muted-foreground">/100</span>
        </div>
      </div>

      <p className={`text-sm font-bold mt-2 ${colors.text}`}>{statusLabel[status]}</p>

      {change !== 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <TrendingUp className={`h-4 w-4 ${change > 0 ? "text-success" : "text-danger rotate-180"}`} />
          <span className={`font-bold ${change > 0 ? "text-success" : "text-danger"}`}>
            {change > 0 ? "+" : ""}{change} points
          </span>
          <span className="text-muted-foreground font-semibold">this week</span>
        </div>
      )}
    </div>
  );
}
