import { Check, X, AlertCircle } from "lucide-react";

interface EngineCardProps {
  name: string;
  logo: React.ReactNode;
  status: "mentioned" | "weak" | "not_found";
  lastChecked?: string;
}

const statusConfig = {
  mentioned: {
    label: "Mentioned",
    icon: Check,
    className: "text-emerald-600 bg-emerald-50",
    iconClass: "text-emerald-500",
  },
  weak: {
    label: "Weak",
    icon: AlertCircle,
    className: "text-amber-600 bg-amber-50",
    iconClass: "text-amber-500",
  },
  not_found: {
    label: "Not Found",
    icon: X,
    className: "text-red-600 bg-red-50",
    iconClass: "text-red-500",
  },
};

export function EngineCard({ name, logo, status, lastChecked = "2 hours ago" }: EngineCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="engine-card group">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-navy">
        {logo}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-navy">{name}</div>
        <div className="text-xs text-muted-foreground">Checked {lastChecked}</div>
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <StatusIcon className={`h-3.5 w-3.5 ${config.iconClass}`} />
        {config.label}
      </div>
    </div>
  );
}
