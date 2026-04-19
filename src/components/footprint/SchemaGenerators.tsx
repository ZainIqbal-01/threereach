import { useState } from "react";
import { Code2, Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BrandContextValue } from "./BrandContext";
import { orgSchema, faqSchema, personSchema, articleSchema, breadcrumbSchema } from "./templates";

interface Props {
  businessName: string;
  ctx: BrandContextValue;
}

const SCHEMAS = [
  { id: "organization", label: "Organization", gen: orgSchema, desc: "Core entity identity" },
  { id: "faq", label: "FAQPage", gen: faqSchema, desc: "Answers AI engines surface" },
  { id: "person", label: "Person", gen: personSchema, desc: "Founder authority" },
  { id: "article", label: "Article", gen: articleSchema, desc: "Editorial content" },
  { id: "breadcrumb", label: "BreadcrumbList", gen: breadcrumbSchema, desc: "Site navigation" },
] as const;

export function SchemaGenerators({ businessName, ctx }: Props) {
  const [active, setActive] = useState<string>("organization");
  const [copied, setCopied] = useState(false);

  const current = SCHEMAS.find((s) => s.id === active)!;
  const code = current.gen({ name: businessName, ctx });

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "📋 Copied", description: `${current.label} schema copied to clipboard` });
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([code], { type: "application/ld+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active}-schema.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "⬇️ Downloaded", description: `${current.label} schema saved` });
  };

  return (
    <div className="card-reach">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Code2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">JSON-LD Schema Generators</h3>
          <p className="text-[11px] text-muted-foreground">Copy-ready structured data for AI engines & rich results</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SCHEMAS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              active === s.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mb-2">{current.desc}</p>

      <div className="relative">
        <pre className="bg-navy text-cyan-light rounded-xl p-3 text-[10px] leading-relaxed overflow-auto max-h-[260px] font-mono border border-border/40">
          {code}
        </pre>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="sm" variant="secondary" onClick={copy} className="h-6 px-2 text-[10px] rounded-lg gap-1">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="secondary" onClick={download} className="h-6 px-2 text-[10px] rounded-lg gap-1">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
