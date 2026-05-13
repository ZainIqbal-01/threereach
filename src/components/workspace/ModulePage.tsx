// Generic minimal module preview used for every Marketing OS category.
import { getModule } from "@/lib/marketingModules";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plug, Sparkles } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  live: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  beta: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  soon: "bg-muted text-muted-foreground border-border",
  connect: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function ModulePage({ id }: { id: string }) {
  const mod = getModule(id);
  const { setModule } = useWorkspace();
  if (!mod) return null;
  const Icon = mod.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow flex-shrink-0">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{mod.tagline}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{mod.label}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{mod.description}</p>
        </div>
      </div>

      {/* KPIs */}
      {mod.kpis && mod.kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mod.kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-semibold mt-1">{k.value}</div>
              {k.delta && <div className="text-xs text-emerald-600 mt-0.5">{k.delta}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      {mod.features.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Capabilities</h2>
            <span className="text-[11px] text-muted-foreground">{mod.features.length} features</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mod.features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{f.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div>
                  </div>
                  {f.status && (
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${STATUS_COLOR[f.status]}`}>
                      {f.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations */}
      {mod.integrations && mod.integrations.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plug className="h-4 w-4" /> Integrations</h2>
          <div className="flex flex-wrap gap-2">
            {mod.integrations.map((i) => (
              <Badge key={i} variant="outline" className="rounded-lg">{i}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Empty/CTA */}
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <Sparkles className="h-6 w-6 mx-auto text-primary mb-2" />
        <div className="text-sm font-medium">Ask Reach to configure {mod.label}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Use the chat panel — e.g. "set up {mod.label.toLowerCase()} for my brand".
        </div>
        <Button size="sm" variant="outline" className="mt-4" onClick={() => setModule("overview" as any)}>
          Back to Overview <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
