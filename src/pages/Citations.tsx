import { LevelBadge } from "@/components/geo/LevelBadge";
import { CITATION_DOMAINS } from "@/lib/geoPlaybook";
import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import { LEVELS } from "@/lib/geoPlaybook";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Quote, MessageSquare, Sparkles, ExternalLink } from "lucide-react";

const KIND_COLORS: Record<string, string> = {
  Community: "bg-warning/15 text-warning",
  Professional: "bg-primary/15 text-primary",
  Reference: "bg-accent/15 text-accent",
  Video: "bg-destructive/15 text-destructive",
  Publishing: "bg-muted text-muted-foreground",
  Social: "bg-primary/10 text-primary",
  Authority: "bg-success/15 text-success",
  Press: "bg-warning/15 text-warning",
  Search: "bg-muted text-muted-foreground",
  Commerce: "bg-accent/15 text-accent",
};

const SURFACING_TYPES = [
  {
    type: "AI Overviews",
    icon: Sparkles,
    desc: "Summary snippets at the top of Google / Bing AI search results.",
    optimize: "Concise direct answers, FAQ schema, freshness ≤ 90 days.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    type: "AI Answers",
    icon: MessageSquare,
    desc: "Conversational responses inside ChatGPT, Claude, Gemini.",
    optimize: "Long-form expertise content, named entities, original data.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    type: "AI Citations",
    icon: Quote,
    desc: "Inline source links AI engines attach to their answers.",
    optimize: "Schema markup, authoritative co-mentions, third-party validation.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

export default function Citations() {
  const { state, toggle } = useGEOMaturity();
  const lvl = LEVELS.find((l) => l.key === "monitor")!;
  const max = Math.max(...CITATION_DOMAINS.map((d) => d.pct));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <LevelBadge level={7} title="Monitor & Scale" />
        <h1 className="text-2xl font-bold text-foreground mt-2">Citation Leaderboard & Monitor</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Where the citations live. The 16 most-cited domains by LLMs, the three ways AI surfaces your brand, and your monitoring checklist for compounding visibility.
        </p>
      </div>

      {/* AI Overviews vs Answers vs Citations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SURFACING_TYPES.map((s) => (
          <div key={s.type} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground mt-3">{s.type}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">{s.desc}</p>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">How to win</div>
              <p className="text-[11px] text-foreground mt-0.5">{s.optimize}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-4">
        <p className="text-xs text-foreground">
          <strong>The goal: earn all three.</strong> Brands that do convert AI visitors at up to <strong>15.9%</strong> versus <strong>1.76%</strong> from Google organic.
        </p>
      </div>

      {/* Domain leaderboard */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Top 16 most-cited domains by LLMs</h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Source: SEMrush</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          AI engines pull from these domains far more than from random brand sites. To get cited, you need a presence on the ones at the top of this list.
        </p>
        <div className="space-y-1.5">
          {CITATION_DOMAINS.map((d, i) => (
            <div key={d.domain} className="flex items-center gap-3 group">
              <span className="w-6 text-right text-[11px] tabular-nums text-muted-foreground font-semibold">{i + 1}</span>
              <span className="w-36 text-xs font-medium text-foreground truncate flex items-center gap-1">
                {d.domain}
                <ExternalLink className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${KIND_COLORS[d.kind] || "bg-muted text-muted-foreground"}`}>
                {d.kind}
              </span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${(d.pct / max) * 100}%` }}
                />
              </div>
              <span className="w-14 text-right text-xs font-bold tabular-nums text-foreground">{d.pct.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring checklist */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Monitor & Scale checklist</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">{lvl.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {lvl.checklist.map((item) => (
            <label key={item.id} className="flex items-start gap-2 cursor-pointer text-[12px] py-2 px-2.5 rounded-lg hover:bg-secondary/40 transition-colors">
              <Checkbox checked={!!state[item.id]} onCheckedChange={() => toggle(item.id)} className="mt-0.5" />
              <span className={state[item.id] ? "text-muted-foreground line-through" : "text-foreground"}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
