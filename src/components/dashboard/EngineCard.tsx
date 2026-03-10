import { Check, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface EngineCardProps {
  name: string;
  logo: React.ReactNode;
  status: "mentioned" | "weak" | "not_found";
  lastChecked?: string;
}

const statusConfig = {
  mentioned: {
    label: "Found! 🎉",
    className: "text-success bg-success-light border-success/20",
    emoji: "✅",
  },
  weak: {
    label: "Weak 😐",
    className: "text-warning bg-warning-light border-warning/20",
    emoji: "⚠️",
  },
  not_found: {
    label: "Not Found 😞",
    className: "text-danger bg-danger-light border-danger/20",
    emoji: "❌",
  },
};

export function EngineCard({ name, logo, status, lastChecked = "2 hours ago" }: EngineCardProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="engine-card group"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
        {logo}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground font-semibold">Checked {lastChecked}</div>
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${config.className}`}>
        {config.label}
      </div>
    </motion.div>
  );
}
