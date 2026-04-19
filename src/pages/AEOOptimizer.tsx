import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LevelBadge } from "@/components/geo/LevelBadge";
import { CITATION_TACTICS } from "@/lib/geoPlaybook";
import { Sparkles, Wand2, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Score {
  total: number;
  checks: { label: string; pass: boolean; weight: number }[];
}

function scoreContent(text: string, title: string): Score {
  const t = text.trim();
  const lower = t.toLowerCase();
  const titleLower = title.trim().toLowerCase();
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  const paragraphs = t.split(/\n\s*\n/).filter((p) => p.trim());
  const avgPara = paragraphs.length ? paragraphs.reduce((a, p) => a + p.split(/\s+/).length, 0) / paragraphs.length : 0;
  const headers = (t.match(/^#{1,6}\s+.+$/gm) || []);
  const questionHeaders = headers.filter((h) => /\?$/.test(h.trim()) || /^#{1,6}\s+(how|why|what|when|where|who|which|can|should|is|are|do|does)/i.test(h));
  const lists = (t.match(/^[-*]\s+/gm) || []).length;
  const numbered = (t.match(/^\d+\.\s+/gm) || []).length;
  const hasFAQ = /faq|frequently asked|q:|q\./i.test(t);
  const hasStat = /\d+%|\d+×|\d{2,}\s*(million|billion|customers|users)|\$\d+/i.test(t);
  const hasSummary = /^(tl;dr|summary|in short|key takeaway)/im.test(t.split("\n").slice(0, 5).join("\n"));
  const titleStartsRight = /^(how|why|top \d|the \d|what)/i.test(titleLower);
  const hasNamedEntities = /[A-Z][a-z]+ [A-Z][a-z]+/.test(t);

  const checks = [
    { label: "Title starts with How/Why/Top X/What", pass: titleStartsRight, weight: 8 },
    { label: "Headers framed as questions (≥2)", pass: questionHeaders.length >= 2, weight: 12 },
    { label: "Has FAQ section", pass: hasFAQ, weight: 10 },
    { label: "TL;DR or summary block at top", pass: hasSummary, weight: 8 },
    { label: "Short paragraphs (avg < 60 words)", pass: avgPara > 0 && avgPara < 60, weight: 10 },
    { label: "Uses lists or numbered steps", pass: lists + numbered >= 3, weight: 8 },
    { label: "Contains original stats / data", pass: hasStat, weight: 12 },
    { label: "Mentions named entities (people/orgs)", pass: hasNamedEntities, weight: 8 },
    { label: "Substantial length (≥ 300 words)", pass: wordCount >= 300, weight: 8 },
    { label: "Multiple sections (≥ 3 headers)", pass: headers.length >= 3, weight: 8 },
    { label: "Conversational tone (uses 'you')", pass: /\byou\b/i.test(t), weight: 4 },
    { label: "Comparison or 'vs' framing", pass: /\bvs\b|\balternative|\bcompared/i.test(lower), weight: 4 },
  ];

  const total = checks.reduce((acc, c) => acc + (c.pass ? c.weight : 0), 0);
  return { total, checks };
}

function transformToAEO(title: string, body: string): string {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const summary = body.split(/[.!?]/).slice(0, 2).join(". ").trim().slice(0, 220);

  return `# ${title}

> **TL;DR:** ${summary || "[Add a 1-2 sentence summary that directly answers the page's main question.]"}

## What is ${title.replace(/^(how to |why |what is |the |top \d+ )/i, "")}?
[Open with a single-paragraph definition. Direct, factual, ≤ 60 words.]

## Why does it matter?
- **Outcome 1:** [Concrete benefit with a number]
- **Outcome 2:** [Quantified result]
- **Outcome 3:** [Time / cost saving]

## How does it work?
1. **Step one** — [single-sentence action]
2. **Step two** — [single-sentence action]
3. **Step three** — [single-sentence action]

## Who is this for?
[Describe the ideal audience in plain language using "you".]

${body}

## Frequently Asked Questions

**Q: How do I get started?**
A: [Direct, complete answer in 1-2 sentences.]

**Q: How long does it take?**
A: [Specific time range.]

**Q: What does it cost?**
A: [Specific number or range.]

**Q: How is this different from alternatives?**
A: [Differentiator + 1 supporting fact.]

---
*AEO Metadata: ${wordCount} source words → answer-unit format · question headers · FAQ schema-ready · proprietary stats placeholders.*
`;
}

export default function AEOOptimizer() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const score = useMemo(() => (title || body ? scoreContent(body, title) : null), [title, body]);
  const outputScore = useMemo(() => (output ? scoreContent(output, title) : null), [output, title]);

  const transform = () => {
    if (!title.trim() && !body.trim()) {
      toast({ title: "Add content first", description: "Paste your page title and body.", variant: "destructive" });
      return;
    }
    setOutput(transformToAEO(title || "Untitled", body));
    toast({ title: "✨ Converted", description: "Your content is now AI-citable" });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <LevelBadge level={3} title="Optimise" />
        <h1 className="text-2xl font-bold text-foreground mt-2">AEO Page Optimizer</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Paste any page. We'll score it against the 14 citation criteria and rewrite it as discrete answer-units that ChatGPT, Perplexity and Claude can quote verbatim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Your current content</h3>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title (e.g. How to dominate AI search in 2026)"
            className="rounded-xl"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste your full page content here…"
            className="min-h-[280px] rounded-xl text-xs font-mono"
          />
          <Button onClick={transform} className="w-full rounded-xl gap-2">
            <Wand2 className="h-4 w-4" /> Convert to AEO format
          </Button>

          {score && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">Citation Readiness</span>
                <span className={`text-lg font-bold tabular-nums ${
                  score.total >= 80 ? "text-success" : score.total >= 50 ? "text-warning" : "text-destructive"
                }`}>{score.total}<span className="text-xs text-muted-foreground">/100</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3">
                <div className={`h-full transition-all ${
                  score.total >= 80 ? "bg-success" : score.total >= 50 ? "bg-warning" : "bg-destructive"
                }`} style={{ width: `${score.total}%` }} />
              </div>
              <div className="space-y-1">
                {score.checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-[11px]">
                    {c.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
                    <span className={c.pass ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">+{c.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" /> AEO-converted output
            </h3>
            {output && (
              <Button size="sm" variant="secondary" className="h-7 text-[11px] gap-1" onClick={copy}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          {output ? (
            <>
              {outputScore && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-light/40 border border-success/20">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs text-foreground">
                    New score: <strong className="text-success">{outputScore.total}/100</strong>
                    {score && ` (+${outputScore.total - score.total} from original)`}
                  </span>
                </div>
              )}
              <pre className="text-[11px] font-mono whitespace-pre-wrap bg-secondary/30 rounded-xl p-3 max-h-[460px] overflow-auto border border-border/40">
                {output}
              </pre>
            </>
          ) : (
            <div className="h-[420px] flex flex-col items-center justify-center text-center text-muted-foreground p-6">
              <Wand2 className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Your AEO-formatted output will appear here.</p>
              <p className="text-[11px] mt-1 max-w-xs">Each paragraph becomes a discrete "answer unit" optimised for verbatim citation.</p>
            </div>
          )}
        </div>
      </div>

      {/* 14 tactics reference */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-1">The 14 citation tactics we score against</h3>
        <p className="text-[11px] text-muted-foreground mb-3">Source: <em>14 Ways To Get Cited By AI</em> · Searchable.com</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
          {CITATION_TACTICS.map((t) => (
            <div key={t.n} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40 text-[11px]">
              <span className="font-bold text-primary tabular-nums">{t.n}.</span>
              <span className="text-foreground">{t.title}</span>
              {t.stat && <span className="ml-auto text-[10px] font-bold text-success">{t.stat}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
