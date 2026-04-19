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
    barFrom: "from-success",
    barTo: "to-success/60",
  },
  weak: {
    label: "Weak",
    icon: AlertCircle,
    className: "bg-warning-light text-warning border border-warning/20",
    barFrom: "from-warning",
    barTo: "to-warning/60",
  },
  not_found: {
    label: "Not Found",
    icon: X,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
    barFrom: "from-destructive",
    barTo: "to-destructive/60",
  },
};

// Brand-tinted "wells" behind each engine logo (uses palette HSL tokens-style values)
const engineTint: Record<string, { bg: string; ring: string }> = {
  ChatGPT: { bg: "hsl(172 66% 50% / 0.12)", ring: "hsl(172 66% 50% / 0.25)" },
  "Google Gemini": { bg: "hsl(217 91% 60% / 0.12)", ring: "hsl(217 91% 60% / 0.25)" },
  Gemini: { bg: "hsl(217 91% 60% / 0.12)", ring: "hsl(217 91% 60% / 0.25)" },
  Perplexity: { bg: "hsl(187 85% 53% / 0.14)", ring: "hsl(187 85% 53% / 0.28)" },
  Claude: { bg: "hsl(38 92% 50% / 0.14)", ring: "hsl(38 92% 50% / 0.28)" },
  Copilot: { bg: "hsl(142 71% 45% / 0.12)", ring: "hsl(142 71% 45% / 0.25)" },
};

export function EngineCard({
  name,
  logo,
  status,
  lastChecked = "2 hours ago",
  confidence,
}: EngineCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const tint = engineTint[name] ?? {
    bg: "hsl(var(--secondary))",
    ring: "hsl(var(--border))",
  };

  return (
    <div className="engine-card group">
      {/* Brand-tinted circular well + live indicator */}
      <div className="relative shrink-0">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-transform duration-300 group-hover:scale-105"
          style={{
            background: tint.bg,
            boxShadow: `inset 0 0 0 1px ${tint.ring}`,
          }}
        >
          {logo}
        </div>
        {/* Live monitoring pulse — only show when actively tracked (status !== not_found) */}
        {status !== "not_found" && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success live-dot ring-2 ring-card"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <div className="text-[11px] text-muted-foreground">Checked {lastChecked}</div>

        {/* Confidence mini-bar */}
        {confidence !== undefined && (
          <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${config.barFrom} ${config.barTo} transition-all duration-700 ease-out`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${config.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </div>
        {confidence !== undefined && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {confidence}% confidence
          </span>
        )}
      </div>
    </div>
  );
}
