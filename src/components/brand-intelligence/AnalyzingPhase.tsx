import { StarAgent } from "@/components/StarAgent";
import { MetaCard } from "./UIComponents";

interface AnalyzingPhaseProps {
  progress: number;
  analysisStep: string;
  competitors: string[];
}

export function AnalyzingPhase({ progress, analysisStep, competitors }: AnalyzingPhaseProps) {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-8">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">AI Brand Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyzing your brand across AI engines...</p>
      </div>

      <div className="max-w-md mx-auto mt-8">
        <MetaCard className="text-center py-12 px-8">
          <div className="mb-6">
            <StarAgent mood="scanning" size={100} animate={true} />
          </div>

          <h2 className="text-base font-semibold text-foreground mb-1">Scanning AI Engines</h2>
          <p className="text-sm text-muted-foreground mb-6">{analysisStep}</p>

          <div className="max-w-xs mx-auto">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">{progress}% complete</p>
          </div>

          <div className="mt-6 flex justify-center gap-5">
            {["ChatGPT", "Gemini", "Perplexity"].map((engine, i) => (
              <span key={engine} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${progress > (i + 1) * 15 ? "bg-primary" : "bg-border"}`} />
                {engine}
              </span>
            ))}
          </div>

          {competitors.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground mb-2">Also scanning competitors:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {competitors.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-full bg-secondary/60 text-[11px] font-medium text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </MetaCard>
      </div>
    </div>
  );
}
