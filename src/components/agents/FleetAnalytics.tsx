import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, Trophy, Activity, Award } from "lucide-react";
import { agentList, agents } from "@/components/agents/agentRegistry";
import type { AgentRuntime } from "@/hooks/useAgentSimulation";

interface Props {
  runtimes: Record<string, AgentRuntime>;
}

// Deterministic-ish per-agent series so it doesn't jitter every render
function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function FleetAnalytics({ runtimes }: Props) {
  // Build last-30-day per-agent task series
  const { dailyData, successData, leaderboard, totals } = useMemo(() => {
    const days = 30;
    const series: Record<string, { date: string; ts: number } & Record<string, number>> =
      {} as any;

    const buckets: Array<{ date: string; ts: number }> = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      buckets.push({
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        ts: d.getTime(),
      });
    }

    const perAgent: Record<string, number[]> = {};
    const successPerAgent: Record<string, number[]> = {};

    agentList.forEach((a, idx) => {
      const rand = seedRand(a.accentHue * 7 + idx);
      const arr: number[] = [];
      const sArr: number[] = [];
      let trend = 6 + rand() * 6; // baseline tasks/day
      let success = 92 + rand() * 6;
      for (let i = 0; i < days; i++) {
        trend += (rand() - 0.5) * 2;
        trend = Math.max(2, Math.min(20, trend));
        arr.push(Math.round(trend));
        success += (rand() - 0.5) * 1.5;
        success = Math.max(85, Math.min(99.5, success));
        sArr.push(Math.round(success * 10) / 10);
      }
      // Last day reflects today's actual runtime tasks
      arr[days - 1] = Math.max(arr[days - 1], runtimes[a.id]?.tasksToday ?? 0);
      perAgent[a.id] = arr;
      successPerAgent[a.id] = sArr;
    });

    const dailyData = buckets.map((b, i) => {
      const row: any = { date: b.date };
      agentList.forEach(a => {
        row[a.id] = perAgent[a.id][i];
      });
      return row;
    });

    const successData = buckets.map((b, i) => {
      const row: any = { date: b.date };
      agentList.forEach(a => {
        row[a.id] = successPerAgent[a.id][i];
      });
      return row;
    });

    const leaderboard = agentList
      .map(a => {
        const total = perAgent[a.id].reduce((s, x) => s + x, 0);
        const avgSuccess =
          successPerAgent[a.id].reduce((s, x) => s + x, 0) / successPerAgent[a.id].length;
        return {
          agent: a,
          total,
          avgSuccess: Math.round(avgSuccess * 10) / 10,
          today: perAgent[a.id][days - 1],
        };
      })
      .sort((x, y) => y.total - x.total);

    const totals = {
      total30d: leaderboard.reduce((s, l) => s + l.total, 0),
      avgSuccess:
        Math.round((leaderboard.reduce((s, l) => s + l.avgSuccess, 0) / leaderboard.length) * 10) /
        10,
      best: leaderboard[0],
    };

    return { dailyData, successData, leaderboard, totals };
  }, [runtimes]);

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    fontSize: "11px",
    padding: "6px 10px",
    boxShadow: "0 4px 16px hsl(var(--foreground) / 0.06)",
  };

  return (
    <div className="space-y-4">
      {/* Top stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          icon={Activity}
          label="Tasks · last 30d"
          value={totals.total30d.toLocaleString()}
          tone="primary"
        />
        <StatTile
          icon={TrendingUp}
          label="Fleet success rate"
          value={`${totals.avgSuccess}%`}
          tone="success"
        />
        <StatTile
          icon={Trophy}
          label="Top performer"
          value={totals.best?.agent.name ?? "—"}
          subValue={`${totals.best?.total ?? 0} tasks`}
          tone="accent"
        />
      </div>

      {/* Daily tasks per agent */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Tasks per agent — last 30 days</h3>
            <p className="text-[10px] text-muted-foreground">Stacked daily output across the fleet</p>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {agentList.map(a => (
                  <linearGradient key={a.id} id={`fa-grad-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`hsl(${a.accentHue}, 75%, 55%)`} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={`hsl(${a.accentHue}, 75%, 55%)`} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--accent) / 0.1)" }} />
              {agentList.map(a => (
                <Area
                  key={a.id}
                  type="monotone"
                  dataKey={a.id}
                  stackId="1"
                  stroke={`hsl(${a.accentHue}, 75%, 55%)`}
                  strokeWidth={1.5}
                  fill={`url(#fa-grad-${a.id})`}
                  name={a.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* Success rate trend */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-[hsl(var(--success)/0.12)] flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Success rate trend</h3>
              <p className="text-[10px] text-muted-foreground">Per-agent success % over 30 days</p>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={successData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
                {agentList.map(a => (
                  <Line
                    key={a.id}
                    type="monotone"
                    dataKey={a.id}
                    stroke={`hsl(${a.accentHue}, 75%, 55%)`}
                    strokeWidth={1.5}
                    dot={false}
                    name={a.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-[hsl(var(--warning)/0.12)] flex items-center justify-center">
              <Award className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Leaderboard</h3>
              <p className="text-[10px] text-muted-foreground">Top performers · 30-day total</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {leaderboard.map((row, i) => {
              const a = row.agent;
              const accent = `hsl(${a.accentHue}, 75%, 55%)`;
              const max = leaderboard[0].total;
              const pct = max > 0 ? (row.total / max) * 100 : 0;
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-border/60 bg-card p-2.5 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-6 w-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{
                        background: i === 0 ? "hsl(var(--warning) / 0.15)" : "hsl(var(--secondary))",
                        color: i === 0 ? "hsl(var(--warning))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{a.emoji}</span>
                        <span className="text-[12px] font-bold" style={{ color: accent }}>
                          {a.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">{a.role}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[12px] font-bold tabular-nums" style={{ color: accent }}>
                        {row.total}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{row.avgSuccess}%</div>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${accent}, hsl(${a.accentHue}, 85%, 65%))`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  subValue,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  subValue?: string;
  tone: "primary" | "success" | "accent";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "success"
      ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]"
      : "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))]";
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${toneClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      {subValue && <div className="text-[11px] text-muted-foreground">{subValue}</div>}
    </div>
  );
}
