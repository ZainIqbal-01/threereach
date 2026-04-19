import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, CheckCircle2, Circle } from "lucide-react";
import { LEVELS } from "@/lib/geoPlaybook";

export function GEOMaturityCard() {
  const { score, completedLevels, currentLevel, levelProgress } = useGEOMaturity();

  const ringSize = 132;
  const stroke = 10;
  const r = (ringSize - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-warning" />
            GEO Maturity Score
          </div>
          <h2 className="text-lg font-bold text-foreground mt-1">
            Level {currentLevel.number} · {currentLevel.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedLevels} of 7 levels complete · the maturity ladder for AI search
          </p>
        </div>
        <Link
          to="/dashboard/playbook"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          Open Playbook <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score ring */}
        <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none" />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              stroke="url(#geoGrad)"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
            />
            <defs>
              <linearGradient id="geoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-foreground tabular-nums">{score}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
          </div>
        </div>

        {/* Per-level rail */}
        <div className="flex-1 w-full grid grid-cols-7 gap-1.5">
          {levelProgress.map((lvl) => {
            const lvlMeta = LEVELS.find((l) => l.key === lvl.key)!;
            return (
              <Link
                key={lvl.key}
                to={lvlMeta.route}
                className="group flex flex-col items-center gap-1.5 hover:opacity-100 transition-opacity"
                title={`Level ${lvl.number}: ${lvl.title} — ${lvl.done}/${lvl.total} complete`}
              >
                {lvl.complete ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Circle className={`h-4 w-4 ${lvl.pct > 0 ? "text-primary" : "text-muted-foreground/40"}`} />
                )}
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      lvl.complete ? "bg-success" : "bg-gradient-to-r from-primary to-accent"
                    }`}
                    style={{ width: `${lvl.pct}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground group-hover:text-foreground">
                  L{lvl.number}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
