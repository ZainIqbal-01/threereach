import { useMemo } from "react";
import { TrendingUp, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrandContextValue } from "./BrandContext";
import { EEATState } from "./EEATPanel";

interface Props {
  ctx: BrandContextValue;
  profileCompleted: number;
  profileTotal: number;
  publishedAssets: number;
  totalAssets: number;
  eeat: EEATState;
  onFix: (action: "context" | "profile" | "assets" | "eeat") => void;
}

export function FootprintScore({ ctx, profileCompleted, profileTotal, publishedAssets, totalAssets, eeat, onFix }: Props) {
  const { geo, aeo, eeatScore, gaps } = useMemo(() => {
    // GEO: entity completeness via brand context
    const ctxFields = [ctx.sector, ctx.audience, ctx.usp, ctx.founderName, ctx.founderTitle, ctx.yearFounded, ctx.hqLocation];
    const ctxFilled = ctxFields.filter((f) => f.trim().length > 0).length;
    const geo = Math.round((ctxFilled / ctxFields.length) * 100);

    // AEO: assets published + answer-style content
    const assetRatio = totalAssets ? publishedAssets / totalAssets : 0;
    const profileRatio = profileTotal ? profileCompleted / profileTotal : 0;
    const aeo = Math.round((assetRatio * 0.6 + profileRatio * 0.4) * 100);

    // E-E-A-T
    const enabled = (Object.values(eeat) as { enabled: boolean }[]).filter((v) => v.enabled).length;
    const eeatScore = Math.round((enabled / 4) * 100);

    const gaps: { label: string; action: Props["onFix"] extends (a: infer A) => void ? A : never }[] = [];
    if (geo < 80) gaps.push({ label: "Complete brand context for entity-rich GEO copy", action: "context" });
    if (profileRatio < 1) gaps.push({ label: "Fill remaining knowledge identity fields", action: "profile" });
    if (assetRatio < 1) gaps.push({ label: "Publish all AI content assets", action: "assets" });
    if (enabled < 4) gaps.push({ label: `Activate ${4 - enabled} more E-E-A-T pillar${4 - enabled === 1 ? "" : "s"}`, action: "eeat" });

    return { geo, aeo, eeatScore, gaps };
  }, [ctx, profileCompleted, profileTotal, publishedAssets, totalAssets, eeat]);

  const overall = Math.round((geo + aeo + eeatScore) / 3);

  const tier =
    overall >= 85 ? { label: "Strong", color: "text-success", bg: "bg-success-light", ring: "ring-success/30" } :
    overall >= 60 ? { label: "Visible", color: "text-primary", bg: "bg-electric-light", ring: "ring-primary/30" } :
    overall >= 35 ? { label: "Weak", color: "text-warning", bg: "bg-warning-light", ring: "ring-warning/30" } :
                    { label: "Invisible", color: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/30" };

  return (
    <div className="card-reach">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Footprint Score</h3>
          <p className="text-[11px] text-muted-foreground">GEO · AEO · E-E-A-T composite signal</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-xl ${tier.bg} ring-1 ${tier.ring}`}>
          <span className={`text-2xl font-bold ${tier.color} tabular-nums`}>{overall}</span>
          <span className={`text-[10px] font-semibold ${tier.color} uppercase tracking-wider`}>{tier.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Metric label="GEO" value={geo} hint="Entity completeness" />
        <Metric label="AEO" value={aeo} hint="Answer-ready content" />
        <Metric label="E-E-A-T" value={eeatScore} hint="Trust pillars active" />
      </div>

      {gaps.length > 0 ? (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="h-3 w-3 text-warning" />
            <span className="text-[11px] font-semibold text-foreground">Missing signals</span>
          </div>
          <div className="space-y-1.5">
            {gaps.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-warning-light/40 border border-warning/20">
                <span className="text-[11px] text-foreground">{g.label}</span>
                <Button size="sm" onClick={() => onFix(g.action)} className="h-6 px-2 text-[10px] rounded-lg gap-1 bg-warning hover:bg-warning/90 text-foreground">
                  <Zap className="h-3 w-3" /> Fix
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-success-light/40 border border-success/20 text-center">
          <span className="text-[11px] font-semibold text-success">🎉 All signals active — your AI footprint is comprehensive</span>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-foreground tabular-nums">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 mb-1" />
      <p className="text-[9px] text-muted-foreground">{hint}</p>
    </div>
  );
}
