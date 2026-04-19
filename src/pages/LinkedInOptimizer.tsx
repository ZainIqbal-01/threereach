import { useState } from "react";
import { useBusinessName } from "@/hooks/useBusinessName";
import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import { LEVELS } from "@/lib/geoPlaybook";
import { LevelBadge } from "@/components/geo/LevelBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Linkedin, CheckCircle2, AlertCircle, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  name: string;
  headline: string;
  about: string;
  skills: string;
  url: string;
  articlesPublished: number;
  postsWithKeywords: boolean;
  noHashtags: boolean;
}

const initialProfile: Profile = {
  name: "",
  headline: "",
  about: "",
  skills: "",
  url: "",
  articlesPublished: 0,
  postsWithKeywords: false,
  noHashtags: false,
};

export default function LinkedInOptimizer() {
  const businessName = useBusinessName();
  const { state, toggle } = useGEOMaturity();
  const [p, setP] = useState<Profile>(initialProfile);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const checks = [
    { id: 1, label: "Headline is keyword-rich (≥ 6 words, includes role + outcome)", pass: p.headline.trim().split(/\s+/).length >= 6 && /\b(help|founder|building|growth|ai|seo|aeo|geo|consultant|engineer|cofounder)\b/i.test(p.headline) },
    { id: 2, label: "About section has ≥ 600 chars and uses first-person", pass: p.about.length >= 600 && /\b(i|we)\b/i.test(p.about) },
    { id: 3, label: "Skills list has ≥ 10 entries", pass: p.skills.split(/[,\n]/).filter((s) => s.trim()).length >= 10 },
    { id: 4, label: "Custom URL (linkedin.com/in/yourname)", pass: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-z0-9-]+\/?$/i.test(p.url) && !/\d{6,}/.test(p.url) },
    { id: 5, label: "Published ≥ 3 long-form articles", pass: p.articlesPublished >= 3 },
    { id: 6, label: "Posts use natural keywords (no stuffing)", pass: p.postsWithKeywords },
    { id: 7, label: "Skip hashtags — focus on natural language", pass: p.noHashtags },
  ];
  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  const generateAbout = () => {
    const ai = `Cofounder of ${businessName}.

I help founders and marketing teams get cited by ChatGPT, Perplexity, Claude and Gemini — without burning months on guesswork.

The short version of how I got here:
• Spent years watching brilliant teams build great products that AI engines never mentioned.
• Realised the problem isn't quality — it's that most sites aren't structured for how LLMs extract answers.
• Built ${businessName} to fix exactly that: an autonomous GEO/AEO engine that audits, optimises, and earns citations on autopilot.

What I think about all day:
→ Why some pages get quoted verbatim by ChatGPT and others get ignored.
→ How to engineer "answer units" that AI will surface.
→ Where the next 12 months of agentic search are heading (spoiler: ads inside ChatGPT, ACP feeds, and entity-graph dominance).

If you're a founder or marketing leader trying to get visible inside AI answers, DM me — happy to share what's actually working.

If you're earlier in the journey, I post daily here breaking down the playbooks the top 1% of brands are using.

Currently building: ${businessName}.com`;
    set("about", ai);
    toast({ title: "✨ About section generated", description: "Personalised to your brand" });
  };

  const copyAbout = async () => {
    if (!p.about) return;
    await navigator.clipboard.writeText(p.about);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lvl = LEVELS.find((l) => l.key === "entity")!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <LevelBadge level={6} title="Entity Signals" />
        <h1 className="text-2xl font-bold text-foreground mt-2 flex items-center gap-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" /> LinkedIn SEO/AEO/GEO Optimizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          LinkedIn is the <strong className="text-foreground">#2 most-cited domain by LLMs (11.03%)</strong> — only Reddit ranks higher. If your profile isn't extraction-ready, you're invisible to millions of AI queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: form (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Your LinkedIn profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Step 1 · Name</label>
              <Input value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" className="mt-1 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Step 4 · Custom URL</label>
              <Input value={p.url} onChange={(e) => set("url", e.target.value)} placeholder="https://linkedin.com/in/janedoe" className="mt-1 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground">Step 1 · Headline (keyword-rich, 220 char max)</label>
            <Input
              value={p.headline}
              onChange={(e) => set("headline", e.target.value)}
              placeholder="Founder helping B2B companies scale with AI search optimisation"
              className="mt-1 rounded-xl text-sm"
              maxLength={220}
            />
            <p className="text-[10px] text-muted-foreground mt-0.5">{p.headline.length}/220</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-muted-foreground">Step 2 · About section</label>
              <Button size="sm" variant="ghost" onClick={generateAbout} className="h-6 text-[10px] gap-1">
                <Sparkles className="h-3 w-3" /> Generate
              </Button>
            </div>
            <Textarea
              value={p.about}
              onChange={(e) => set("about", e.target.value)}
              placeholder="Cofounder of [Brand]: An Autonomous SEO & AEO Growth Engine. I help…"
              className="rounded-xl text-xs min-h-[200px]"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>{p.about.length} chars (target ≥ 600)</span>
              {p.about && (
                <button onClick={copyAbout} className="flex items-center gap-1 hover:text-foreground">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground">Step 3 · Skills (comma or newline separated)</label>
            <Textarea
              value={p.skills}
              onChange={(e) => set("skills", e.target.value)}
              placeholder="SEO, AEO, GEO, AI Search, ChatGPT Optimization, Schema Markup, Content Strategy, LLMs, Entity SEO, Technical SEO, Brand Visibility…"
              className="mt-1 rounded-xl text-xs min-h-[80px]"
            />
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {p.skills.split(/[,\n]/).filter((s) => s.trim()).length} skills (target ≥ 10)
            </p>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground">Step 5 · Long-form articles published</label>
            <Input type="number" min={0} value={p.articlesPublished} onChange={(e) => set("articlesPublished", parseInt(e.target.value) || 0)} className="mt-1 rounded-xl text-sm w-32" />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={p.postsWithKeywords} onCheckedChange={(v) => set("postsWithKeywords", !!v)} />
              <span className="text-xs text-foreground">Step 6 · My posts naturally include relevant keywords</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={p.noHashtags} onCheckedChange={(v) => set("noHashtags", !!v)} />
              <span className="text-xs text-foreground">Step 7 · I've stopped using hashtags (AI ignores them)</span>
            </label>
          </div>
        </div>

        {/* Right: score + checklist */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">LinkedIn AEO Score</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-4xl font-extrabold tabular-nums ${
                score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive"
              }`}>{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-2 mb-4">
              <div className={`h-full transition-all ${
                score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive"
              }`} style={{ width: `${score}%` }} />
            </div>
            <div className="space-y-1.5">
              {checks.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-[11px]">
                  {c.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />}
                  <span className={c.pass ? "text-foreground" : "text-muted-foreground"}>
                    <span className="font-bold opacity-60">#{c.id}</span> {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entity Signals checklist</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">{lvl.summary}</p>
            <div className="space-y-1">
              {lvl.checklist.map((item) => (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer text-[12px] py-1">
                  <Checkbox checked={!!state[item.id]} onCheckedChange={() => toggle(item.id)} className="mt-0.5" />
                  <span className={state[item.id] ? "text-muted-foreground line-through" : "text-foreground"}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
