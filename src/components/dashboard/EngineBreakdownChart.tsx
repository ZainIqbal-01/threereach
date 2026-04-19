import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { getEngineLogo } from "@/components/ui/ai-engine-logos";

const data = [
  { engine: "ChatGPT", confidence: 34, color: "hsl(172, 66%, 50%)" },
  { engine: "Gemini", confidence: 67, color: "hsl(217, 91%, 60%)" },
  { engine: "Perplexity", confidence: 12, color: "hsl(280, 67%, 55%)" },
  { engine: "Claude", confidence: 45, color: "hsl(38, 92%, 50%)" },
  { engine: "Copilot", confidence: 28, color: "hsl(142, 71%, 45%)" },
];

function CustomYAxisTick({ x, y, payload }: any) {
  const engine = payload?.value;
  if (!engine) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-70} y={-10} width={68} height={20}>
        <div className="flex items-center gap-1.5 justify-end" style={{ fontSize: 10, lineHeight: '20px' }}>
          {getEngineLogo(engine, "h-3.5 w-3.5 shrink-0")}
          <span className="text-muted-foreground font-medium truncate">{engine}</span>
        </div>
      </foreignObject>
    </g>
  );
}

export function EngineBreakdownChart() {
  return (
    <div className="card-premium h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Engine Confidence</h3>
        </div>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">5 engines</span>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={22} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="engine"
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--primary) / 0.06)" }}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card) / 0.92)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 10px 30px -8px hsl(222 47% 11% / 0.18)",
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Confidence"]}
            />
            <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
        <span className="text-[10px] text-muted-foreground">Highest: <span className="font-semibold text-foreground">Gemini 67%</span></span>
        <span className="text-[10px] text-muted-foreground">Avg: 37%</span>
      </div>
    </div>
  );
}
