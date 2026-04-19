import { useState } from "react";
import { LevelBadge } from "@/components/geo/LevelBadge";
import { REPURPOSE_SIGNALS, CONTENT_TYPES } from "@/lib/geoPlaybook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VALUE_COLORS: Record<string, string> = {
  high: "bg-success/15 text-success border-success/30",
  med: "bg-warning/15 text-warning border-warning/30",
  low: "bg-muted/40 text-muted-foreground border-border",
};
const DIFF_COLORS: Record<string, string> = {
  low: "text-success",
  med: "text-warning",
  high: "text-destructive",
};

function generateForSignal(id: string, source: string): string {
  const summary = source.split(/[.!?]/).slice(0, 2).join(". ").trim().slice(0, 200) || "[Add a quick punchy summary]";
  switch (id) {
    case "forum":
      return `**Reddit / Quora reply**\n\nGreat question. Quick take from someone who's worked on this:\n\n${summary}\n\nThe key thing most people miss is [specific detail]. We wrote a longer breakdown here: [link]. Happy to answer follow-ups.`;
    case "short":
      return `**60s short script**\n\n[HOOK 0-3s] "Most teams are doing this wrong."\n[VALUE 3-30s] ${summary}\n[STEPS 30-50s] Here's the 3-step fix: 1) … 2) … 3) …\n[CTA 50-60s] Full guide on our blog — link in bio.`;
    case "faq":
      return `**FAQ block (drop on-page)**\n\n**Q: ${summary.split(".")[0]}?**\nA: [Direct 1-2 sentence answer]\n\n**Q: How long does it take?**\nA: [Specific timeframe]\n\n**Q: What does it cost?**\nA: [Number or range]\n\n**Q: Is it worth it?**\nA: [Outcome-based answer with a stat]`;
    case "linkedin":
      return `**LinkedIn post (text)**\n\nMost people get this wrong. Here's what actually works ↓\n\n${summary}\n\nThe 3 things I'd do tomorrow:\n→ [action 1]\n→ [action 2]\n→ [action 3]\n\nIf this resonates, repost ♻️ and follow for more.`;
    case "outreach":
      return `**Cold pitch email**\n\nSubject: A counter-intuitive data point on [topic] for [Publication]\n\nHi [Editor],\n\nI noticed [Publication] recently covered [related topic]. We just analysed [N] data points and found something surprising:\n\n${summary}\n\nHappy to share the full dataset and a 200-word writeup if useful. Either way — keep up the great work.\n\n— [You]`;
    case "visual":
      return `**Infographic brief**\n\nTitle: ${summary.split(".")[0]}\n\nLayout: 3 columns, top-down flow.\n• Column 1: The problem (with stat)\n• Column 2: The framework (3 numbered steps)\n• Column 3: The outcome (before/after metric)\n\nFooter: brand logo + URL. Export 1080×1350 (LinkedIn) and 1080×1080 (Insta).`;
    case "entity":
      return `**Entity link suggestions**\n\nInternal links to add inside the page:\n→ [your /about page] (anchor: your brand name)\n→ [your /pricing page] (anchor: relevant feature)\n\nExternal entity links to add:\n→ Wikipedia entry for [main topic]\n→ Industry standard / spec page\n→ Authoritative research (NIH, Forbes, etc.)`;
    case "audio":
      return `**2-3 minute audio script**\n\n[INTRO 0-15s] "Today: ${summary.split(".")[0]}."\n[BODY 15-150s] Explain the 'why', then the 'how' in 3 beats. Use real numbers.\n[OUTRO 150-180s] "If this was useful, full guide and references in the show notes."\n\n→ Wrap with FAQ schema and Article schema on the host page.`;
    default:
      return summary;
  }
}

export default function ContentStudio() {
  const [source, setSource] = useState("");
  const [generated, setGenerated] = useState<Record<string, string>>({});

  const generate = (id: string) => {
    if (!source.trim()) {
      toast({ title: "Add source content", description: "Paste your blog post or key insight first.", variant: "destructive" });
      return;
    }
    setGenerated((prev) => ({ ...prev, [id]: generateForSignal(id, source) }));
  };

  const generateAll = () => {
    if (!source.trim()) {
      toast({ title: "Add source content", description: "Paste your blog post or key insight first.", variant: "destructive" });
      return;
    }
    const next: Record<string, string> = {};
    REPURPOSE_SIGNALS.forEach((s) => (next[s.id] = generateForSignal(s.id, source)));
    setGenerated(next);
    toast({ title: "✨ 1 → 8 signals generated", description: "All channels ready to publish" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <LevelBadge level={5} title="Formats" />
        <h1 className="text-2xl font-bold text-foreground mt-2">Content Studio</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Turn one blog post into 8 AEO signals across forums, video, FAQ, LinkedIn, outreach, visuals, entity links and audio. Plus the 30 highest-leverage AI search content types.
        </p>
      </div>

      <Tabs defaultValue="repurpose" className="w-full">
        <TabsList className="bg-card border border-border rounded-xl">
          <TabsTrigger value="repurpose">AEO Repurposing Map (1→8)</TabsTrigger>
          <TabsTrigger value="library">30 Content Types</TabsTrigger>
        </TabsList>

        <TabsContent value="repurpose" className="mt-4 space-y-4">
          {/* Source input */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">Source content</h3>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste your blog post, key insight, or original data finding…"
              className="min-h-[100px] rounded-xl text-xs"
            />
            <Button onClick={generateAll} className="mt-3 rounded-xl gap-2">
              <Sparkles className="h-4 w-4" /> Generate all 8 signals
            </Button>
          </div>

          {/* 8 signal grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REPURPOSE_SIGNALS.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-2xl">{s.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
                    <p className="text-[11px] text-muted-foreground"><strong>Format:</strong> {s.format}</p>
                    <p className="text-[11px] text-muted-foreground"><strong>Impact:</strong> {s.impact}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full h-7 text-[11px] rounded-lg gap-1.5"
                  onClick={() => generate(s.id)}>
                  {generated[s.id] ? <><Check className="h-3 w-3" /> Regenerate</> : <><Sparkles className="h-3 w-3" /> Generate</>}
                </Button>
                {generated[s.id] && (
                  <pre className="mt-2 text-[10px] font-mono whitespace-pre-wrap bg-secondary/40 rounded-lg p-2.5 max-h-[180px] overflow-auto border border-border/40 leading-relaxed">
                    {generated[s.id]}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-1">30 types of AI-search content</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Sorted from highest-leverage (high value, low difficulty) to lowest. Tackle the top of the list first.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border">
                  <tr className="text-[10px] uppercase text-muted-foreground">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Content Type</th>
                    <th className="text-left py-2 px-2">Difficulty</th>
                    <th className="text-left py-2 px-2">AI Citation Value</th>
                    <th className="text-right py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...CONTENT_TYPES]
                    .map((c, i) => ({ ...c, i }))
                    .sort((a, b) => {
                      const score = (c: typeof a) => (c.value === "high" ? 3 : c.value === "med" ? 2 : 1) - (c.difficulty === "high" ? 2 : c.difficulty === "med" ? 1 : 0);
                      return score(b) - score(a);
                    })
                    .map((c, idx) => (
                      <tr key={c.type} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                        <td className="py-2 px-2 text-muted-foreground tabular-nums">{idx + 1}</td>
                        <td className="py-2 px-2 font-medium text-foreground">{c.type}</td>
                        <td className={`py-2 px-2 capitalize font-semibold ${DIFF_COLORS[c.difficulty]}`}>{c.difficulty}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${VALUE_COLORS[c.value]} capitalize`}>{c.value}</span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <ArrowRight className="h-3 w-3 text-muted-foreground inline" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
