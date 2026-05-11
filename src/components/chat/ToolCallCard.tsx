import { CheckCircle2, XCircle, Wrench, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const LABELS: Record<string, string> = {
  open_module: "Switched workspace",
  run_ai_scan: "Ran AI visibility scan",
  analyze_brand: "Analyzed brand",
  optimize_repo: "Opened optimization PR",
  generate_content: "Generated content",
  fetch_signals: "Fetched live signals",
};

export function ToolCallCard({ name, input, output }: { name: string; input: any; output: any }) {
  const ok = output?.ok !== false;
  return (
    <div className="ml-11 max-w-[85%] rounded-xl border border-border/60 bg-card/80 backdrop-blur p-3 text-xs animate-scale-in">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <Wrench className="h-3.5 w-3.5 text-primary" />
        <span>{LABELS[name] ?? name}</span>
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success ml-auto" /> : <XCircle className="h-3.5 w-3.5 text-destructive ml-auto" />}
      </div>
      {input && Object.keys(input).length > 0 && (
        <div className="mt-1.5 text-muted-foreground font-mono text-[11px] truncate">
          {Object.entries(input).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join(" · ")}
        </div>
      )}
      {output?.pr_url && (
        <Button asChild size="sm" variant="outline" className="mt-2 h-7 text-xs">
          <a href={output.pr_url} target="_blank" rel="noreferrer">
            View PR #{output.pr_number} <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      )}
      {output?.error && <div className="mt-1 text-destructive">{String(output.error)}</div>}
    </div>
  );
}
