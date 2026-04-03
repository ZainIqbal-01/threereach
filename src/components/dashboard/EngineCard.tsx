import { Check, X, AlertCircle } from "lucide-react";

interface EngineCardProps {
  name: string;
  logo: React.ReactNode;
  status: "mentioned" | "weak" | "not_found";
  lastChecked?: string;
  confidence?: number;
}

const statusConfig = {
  mentioned: {
    label: "Mentioned",
    icon: Check,
    className: "bg-success-light text-success border border-success/20",
  },
  weak: {
    label: "Weak",
    icon: AlertCircle,
    className: "bg-warning-light text-warning border border-warning/20",
  },
  not_found: {
    label: "Not Found",
    icon: X,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export function EngineCard({ name, logo, status, lastChecked = "2 hours ago", confidence }: EngineCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="engine-card group">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
        {logo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <div className="text-[11px] text-muted-foreground">Checked {lastChecked}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${config.className}`}>
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </div>
        {confidence !== undefined && (
          <span className="text-[10px] text-muted-foreground">{confidence}% confidence</span>
        )}
      </div>
    </div>
  );
}
