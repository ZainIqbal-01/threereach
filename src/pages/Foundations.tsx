import { useMemo, useState } from "react";
import { useBusinessName } from "@/hooks/useBusinessName";
import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import { ACP_BOTS, LEVELS } from "@/lib/geoPlaybook";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LevelBadge } from "@/components/geo/LevelBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, Download, FileCode2, Bot, Map, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "Copied", description: `${filename} ready to paste` });
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono text-muted-foreground">{filename}</span>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" className="h-6 px-2 text-[10px] gap-1" onClick={copy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="secondary" className="h-6 px-2 text-[10px] gap-1" onClick={download}>
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <pre className="bg-[hsl(var(--navy))] text-[hsl(var(--cyan-light))] rounded-xl p-3 text-[11px] leading-relaxed overflow-auto max-h-[280px] font-mono border border-border/40">
        {code}
      </pre>
    </div>
  );
}

export default function Foundations() {
  const businessName = useBusinessName();
  const { state, toggle } = useGEOMaturity();
  const lvl = LEVELS.find((l) => l.key === "foundations")!;

  const slug = businessName.toLowerCase().replace(/\s+/g, "");
  const domain = `${slug}.com`;

  const robotsTxt = useMemo(
    () =>
      `# ${businessName} — robots.txt
# Allow major AI engines to crawl & cite your content.

${ACP_BOTS.map((b) => `User-agent: ${b.ua}\nAllow: /\n`).join("\n")}
# Default crawler rules
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://${domain}/sitemap.xml
`,
    [businessName, domain],
  );

  const llmsTxt = useMemo(
    () =>
      `# ${businessName}
> ${businessName} helps modern teams get cited by ChatGPT, Perplexity, Claude, and Gemini.

## Key pages
- [About](https://${domain}/about): Who we are, founders, mission
- [Product](https://${domain}/product): How it works, features
- [Pricing](https://${domain}/pricing): Plans and pricing
- [FAQ](https://${domain}/faq): Common questions answered
- [Blog](https://${domain}/blog): Original research and insights
- [Customers](https://${domain}/customers): Case studies and outcomes

## Optional
- [Press](https://${domain}/press): Media kit and mentions
- [Trust](https://${domain}/trust): Security & compliance
`,
    [businessName, domain],
  );

  const sitemapXml = useMemo(
    () =>
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${domain}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://${domain}/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://${domain}/product</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://${domain}/pricing</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://${domain}/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://${domain}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
</urlset>
`,
    [domain],
  );

  const productFeed = useMemo(
    () =>
      JSON.stringify(
        {
          merchant: businessName,
          version: "1.0",
          products: [
            {
              id: "SAMPLE-001",
              title: "Your flagship product",
              description: "Concise, conversational description (max ~250 chars). Include intent modifiers like 'eco-friendly', 'for gifts', 'ships fast'.",
              price: "29.99",
              currency: "USD",
              availability: "InStock",
              brand: businessName,
              gtin: "00000000000000",
              image_link: `https://${domain}/products/sample.jpg`,
              product_category: "Apparel > Accessories",
              url: `https://${domain}/products/sample`,
            },
          ],
        },
        null,
        2,
      ),
    [businessName, domain],
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <LevelBadge level={2} title="Foundations" />
        <h1 className="text-2xl font-bold text-foreground mt-2">Technical Foundations</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          {lvl.summary} <span className="text-foreground font-medium">If AI can't crawl your site, you don't exist in AI search.</span>
        </p>
      </div>

      <Tabs defaultValue="bots" className="w-full">
        <TabsList className="bg-card border border-border rounded-xl flex-wrap h-auto">
          <TabsTrigger value="bots" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> robots.txt</TabsTrigger>
          <TabsTrigger value="llms" className="gap-1.5"><FileCode2 className="h-3.5 w-3.5" /> llms.txt</TabsTrigger>
          <TabsTrigger value="sitemap" className="gap-1.5"><Map className="h-3.5 w-3.5" /> sitemap.xml</TabsTrigger>
          <TabsTrigger value="acp" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> ACP feed</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Allow the AI bots that matter</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Most sites unintentionally block AI engines. Drop this into <code className="bg-secondary px-1 rounded text-[10px]">https://{domain}/robots.txt</code>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-4">
              {ACP_BOTS.map((b) => (
                <div key={b.ua} className="px-2 py-1.5 rounded-lg bg-success-light/40 border border-success/20">
                  <div className="text-[11px] font-mono font-semibold text-foreground">{b.ua}</div>
                  <div className="text-[10px] text-muted-foreground">{b.source}</div>
                </div>
              ))}
            </div>
            <CodeBlock code={robotsTxt} filename="robots.txt" />
          </div>
        </TabsContent>

        <TabsContent value="llms" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Declare your important URLs to LLMs</h3>
            <p className="text-xs text-muted-foreground mb-3">
              The emerging <code className="bg-secondary px-1 rounded text-[10px]">llms.txt</code> standard tells AI crawlers exactly which pages to prioritise.
            </p>
            <CodeBlock code={llmsTxt} filename="llms.txt" />
          </div>
        </TabsContent>

        <TabsContent value="sitemap" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Clean XML sitemap</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Submit this to Google Search Console and Bing Webmaster Tools (Bing powers ChatGPT).
            </p>
            <CodeBlock code={sitemapXml} filename="sitemap.xml" />
          </div>
        </TabsContent>

        <TabsContent value="acp" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Agentic Commerce Protocol — product feed</h3>
            <p className="text-xs text-muted-foreground mb-3">
              For e-commerce: an ACP-compliant feed lets ChatGPT and Perplexity recommend your products in conversational shopping queries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 text-[11px]">
              {[
                { n: "1", label: "Enable OAI-SearchBot in robots.txt" },
                { n: "2", label: "Generate ACP-compliant feed" },
                { n: "3", label: "Submit via Merchant Portal" },
                { n: "4", label: "Validate schema" },
                { n: "5", label: "Track visibility" },
              ].map((s) => (
                <div key={s.n} className="px-2.5 py-2 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-[10px] font-bold text-primary">STEP {s.n}</div>
                  <div className="text-[11px] text-foreground leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <CodeBlock code={productFeed} filename="product_feed.json" />
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Foundations checklist</h3>
            <div className="space-y-1.5">
              {lvl.checklist.map((item) => (
                <label key={item.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                  <Checkbox checked={!!state[item.id]} onCheckedChange={() => toggle(item.id)} className="mt-0.5" />
                  <span className={`text-sm ${state[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
