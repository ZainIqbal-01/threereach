import { Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", posts: 2, mentions: 0 },
  { day: "Tue", posts: 1, mentions: 1 },
  { day: "Wed", posts: 3, mentions: 0 },
  { day: "Thu", posts: 0, mentions: 2 },
  { day: "Fri", posts: 4, mentions: 1 },
  { day: "Sat", posts: 1, mentions: 3 },
  { day: "Sun", posts: 2, mentions: 1 },
];

export function ContentActivityChart() {
  return (
    <div className="card-premium h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[hsl(var(--success))]" />
          <h3 className="text-sm font-semibold text-foreground">Weekly Activity</h3>
        </div>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">This week</span>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mentionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={20} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--primary) / 0.35)", strokeWidth: 1, strokeDasharray: "3 3" }}
              wrapperStyle={{ outline: "none" }}
              {...({ contentClassName: "chart-tooltip" } as any)}
            />
            <Area type="monotone" dataKey="posts" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#postsGrad)" dot={{ r: 3, fill: "hsl(var(--accent))", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
            <Area type="monotone" dataKey="mentions" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#mentionsGrad)" dot={{ r: 3, fill: "hsl(var(--success))", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(187, 85%, 53%)" }} />
          <span className="text-[10px] text-muted-foreground">Posts (13)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
          <span className="text-[10px] text-muted-foreground">Mentions (8)</span>
        </div>
      </div>
    </div>
  );
}
