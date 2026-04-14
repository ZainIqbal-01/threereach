import { Users, Eye, EyeOff } from "lucide-react";
import { getEngineLogo } from "@/components/ui/ai-engine-logos";
import { MetaCard, SentimentPill, statusStyles } from "./UIComponents";
import { CompetitorData, AnalysisData } from "./types";

interface CompetitorBenchmarkProps {
  brandName: string;
  brandData: AnalysisData;
  competitors: CompetitorData[];
}

export function CompetitorBenchmark({ brandName, brandData, competitors }: CompetitorBenchmarkProps) {
  if (competitors.length === 0) return null;

  const allBrands = [
    { name: brandName, score: brandData.overallScore, status: brandData.status, engines: brandData.engines.map(e => ({ engine: e.engine, mentioned: e.mentioned, sentiment: e.sentiment })), isYou: true },
    ...competitors.map(c => ({ ...c, isYou: false })),
  ].sort((a, b) => b.score - a.score);

  return (
    <MetaCard>
      <div className="flex items-center gap-2 mb-5">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Competitor Benchmark</h3>
        <span className="text-[11px] text-muted-foreground ml-auto">{competitors.length} competitor{competitors.length > 1 ? "s" : ""}</span>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2 mb-5">
        {allBrands.map((brand, i) => (
          <div key={brand.name} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${brand.isYou ? "bg-primary/5 border border-primary/15" : "bg-secondary/30"}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-[hsl(38,92%,50%)] text-white" : "bg-secondary text-muted-foreground"}`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{brand.name}</p>
                {brand.isYou && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-primary bg-primary/10 uppercase">You</span>}
              </div>
            </div>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[brand.status].color}`}>
              {statusStyles[brand.status].label}
            </span>
            <span className="text-lg font-bold text-foreground w-10 text-right">{brand.score}</span>
          </div>
        ))}
      </div>

      {/* Engine-by-engine comparison */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left py-2 text-muted-foreground font-medium">Brand</th>
              {["ChatGPT", "Gemini", "Perplexity"].map(e => (
                <th key={e} className="text-center py-2 text-muted-foreground font-medium">
                  <div className="flex items-center justify-center gap-1.5">{getEngineLogo(e, "h-3.5 w-3.5")}{e}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allBrands.map((brand) => (
              <tr key={brand.name} className={`border-b border-border/20 ${brand.isYou ? "bg-primary/3" : ""}`}>
                <td className="py-2.5 font-medium text-foreground">
                  {brand.name} {brand.isYou && <span className="text-[9px] text-primary">(you)</span>}
                </td>
                {brand.engines.map((eng) => (
                  <td key={eng.engine} className="text-center py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                      {eng.mentioned ? (
                        <Eye className="h-3 w-3 text-[hsl(142,71%,35%)]" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground/40" />
                      )}
                      <SentimentPill sentiment={eng.sentiment} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MetaCard>
  );
}
