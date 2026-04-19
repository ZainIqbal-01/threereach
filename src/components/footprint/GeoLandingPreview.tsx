import { useMemo } from "react";
import { Globe, Eye, Code2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandContextValue } from "./BrandContext";
import { geoLandingTemplate } from "./templates";

interface Props {
  businessName: string;
  ctx: BrandContextValue;
  onPublish: () => void;
  isPublishing: boolean;
}

export function GeoLandingPreview({ businessName, ctx, onPublish, isPublishing }: Props) {
  const content = useMemo(() => geoLandingTemplate({ name: businessName, ctx }), [businessName, ctx]);

  // Lightweight markdown → HTML for preview
  const html = useMemo(() => {
    return content
      .replace(/^# (.+)$/gm, '<h1 class="text-base font-bold text-foreground mb-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xs font-semibold text-foreground mt-3 mb-1.5">$1</h2>')
      .replace(/^> \*\*(.+?):\*\* (.+)$/gm, '<p class="text-[10px] text-muted-foreground border-l-2 border-primary/40 pl-2 my-2">$1: $2</p>')
      .replace(/^\*\*Q: (.+?)\*\*$/gm, '<p class="text-[11px] font-semibold text-foreground mt-2">Q: $1</p>')
      .replace(/^A: (.+)$/gm, '<p class="text-[11px] text-muted-foreground mb-1">A: $1</p>')
      .replace(/^\d+\.\s\*\*(.+?)\*\*\s—\s(.+)$/gm, '<p class="text-[11px] text-foreground"><span class="font-semibold">$1</span> — $2</p>')
      .replace(/^- ✅ \*\*(.+?)\*\*\s—\s(.+)$/gm, '<p class="text-[11px] text-foreground flex gap-1.5"><span class="text-success">✓</span><span><span class="font-semibold">$1</span> — $2</span></p>')
      .replace(/^- (.+)$/gm, '<p class="text-[11px] text-muted-foreground pl-3">• $1</p>');
  }, [content]);

  return (
    <div className="card-reach">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">GEO/AEO Landing Preview</h3>
            <p className="text-[11px] text-muted-foreground">Entity-rich, answer-formatted, citation-ready</p>
          </div>
        </div>
        <Button size="sm" onClick={onPublish} disabled={isPublishing}
          className="h-8 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1">
          {isPublishing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
          {isPublishing ? "Publishing…" : "Publish"}
        </Button>
      </div>

      {/* Browser chrome */}
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/60 border-b border-border/60">
          <span className="h-2 w-2 rounded-full bg-destructive/60" />
          <span className="h-2 w-2 rounded-full bg-warning/60" />
          <span className="h-2 w-2 rounded-full bg-success/60" />
          <div className="flex-1 mx-2">
            <div className="bg-card rounded-md px-2 py-0.5 text-[10px] text-muted-foreground font-mono truncate">
              https://{businessName.toLowerCase().replace(/\s+/g, "")}.com/about
            </div>
          </div>
          <Code2 className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="p-4 max-h-[420px] overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
