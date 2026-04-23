import { History, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MetaCard } from "./UIComponents";
import { ScanRecord } from "./types";
import { getScanHistory } from "./scanHistory";

interface HistoryChartProps {
  currentBrandName: string;
}

export function HistoryChart({ currentBrandName }: HistoryChartProps) {
  const history = getScanHistory()
    .filter(s => s.brandName.toLowerCase() === currentBrandName.toLowerCase())
    .reverse(); // oldest first for chart

  if (history.length < 2) return null;

  const chartData = history.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.score,
  }));

  const latest = history[history.length - 1]?.score ?? 0;
  const previous = history[history.length - 2]?.score ?? 0;
  const delta = latest - previous;

  return (
    <MetaCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Visibility Trend</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {delta >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-[hsl(142,71%,35%)]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={`text-xs font-semibold ${delta >= 0 ? "text-[hsl(142,71%,35%)]" : "text-destructive"}`}>
            {delta >= 0 ? "+" : ""}{delta} pts
          </span>
          <span className="text-[11px] text-muted-foreground ml-1">vs last scan</span>
        </div>
      </div>

      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 13%, 91%)", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: number) => [`${value}/100`, "Score"]}
            />
            <Line type="monotone" dataKey="score" stroke="hsl(217, 91%, 60%)" strokeWidth={2.5} dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-muted-foreground mt-2 text-center">
        {history.length} scans tracked for this brand
      </p>
    </MetaCard>
  );
}
