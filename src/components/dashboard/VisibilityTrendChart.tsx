import { TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from "recharts";

const data = [
  { week: "W1", score: 12 },
  { week: "W2", score: 18 },
  { week: "W3", score: 24 },
  { week: "W4", score: 28 },
  { week: "W5", score: 32 },
  { week: "W6", score: 38 },
  { week: "W7", score: 42 },
];

export function VisibilityTrendChart() {
  return (
    <div className="card-premium h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Visibility Trend</h3>
        </div>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Last 7 weeks</span>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(220, 13%, 91%)",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                background: "hsl(0, 0%, 100%)",
              }}
              formatter={(value: number) => [`${value}/100`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              fill="url(#visGrad)"
              dot={{ fill: "hsl(217, 91%, 60%)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-[hsl(142,71%,45%)]" />
          <span className="text-[11px] font-semibold text-[hsl(142,71%,35%)]">+30 pts</span>
          <span className="text-[10px] text-muted-foreground">total growth</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Avg: +4.3/week</span>
      </div>
    </div>
  );
}
