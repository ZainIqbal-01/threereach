import { StarAgent } from "@/components/StarAgent";
import { MetaCard } from "./UIComponents";
import { Brain } from "lucide-react";

interface AnalyzingPhaseProps {
  progress: number;
  analysisStep: string;
  competitors: string[];
}

export function AnalyzingPhase({ progress, analysisStep, competitors }: AnalyzingPhaseProps) {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="card-premium gradient-hero">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--accent))] shadow-md">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">AI Brand Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Analyzing your brand across AI engines...</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-4">
        <MetaCard className="text-center py-14 px-8 relative overflow-hidden">
          {/* Background animated rings */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
            <div className="h-48 w-48 rounded-full border-2 border-primary animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute h-64 w-64 rounded-full border border-primary animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
            <div className="absolute h-80 w-80 rounded-full border border-primary animate-[pulse_3s_ease-in-out_infinite_1s]" />
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <StarAgent mood="scanning" size={110} animate={true} />
            </div>

            <h2 className="text-lg font-bold text-foreground mb-1.5">Scanning AI Engines</h2>
            <p className="text-sm text-muted-foreground mb-8 min-h-[20px]">{analysisStep}</p>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent))] rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-muted-foreground">{progress}% complete</p>
                <p className="text-[11px] text-primary font-medium">
                  {progress < 100 ? "Processing..." : "Done! ✓"}
                </p>
              </div>
            </div>

            {/* Engine indicators */}
            <div className="mt-8 flex justify-center gap-6">
              {["ChatGPT", "Gemini", "Perplexity"].map((engine, i) => {
                const isActive = progress > (i + 1) * 15;
                const isScanning = progress > i * 15 && progress <= (i + 1) * 33;
                return (
                  <div key={engine} className="flex flex-col items-center gap-2">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? "bg-primary/15 border border-primary/30" : "bg-secondary border border-border/40"
                    } ${isScanning ? "animate-pulse" : ""}`}>
                      <span className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                        isActive ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]" : "bg-muted-foreground/30"
                      }`} />
                    </div>
                    <span className={`text-[11px] font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {engine}
                    </span>
                  </div>
                );
              })}
            </div>

            {competitors.length > 0 && (
              <div className="mt-8 pt-5 border-t border-border/40">
                <p className="text-[11px] text-muted-foreground mb-2.5">Benchmarking competitors:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {competitors.map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full bg-secondary/60 text-[11px] font-medium text-muted-foreground border border-border/30">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MetaCard>
      </div>
    </div>
  );
}
