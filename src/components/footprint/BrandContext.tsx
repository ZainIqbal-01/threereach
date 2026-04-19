import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export interface BrandContextValue {
  sector: string;
  audience: string;
  usp: string;
  founderName: string;
  founderTitle: string;
  yearFounded: string;
  hqLocation: string;
}

interface Props {
  value: BrandContextValue;
  onChange: (v: BrandContextValue) => void;
}

export function BrandContextEditor({ value, onChange }: Props) {
  const set = <K extends keyof BrandContextValue>(k: K, v: BrandContextValue[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="card-reach">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Brand Context</h3>
          <p className="text-[11px] text-muted-foreground">
            Powers every generated template, schema, and E-E-A-T signal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Sector / Industry" value={value.sector} onChange={(v) => set("sector", v)} placeholder="Fintech, SaaS, Healthcare…" />
        <Field label="Target Audience" value={value.audience} onChange={(v) => set("audience", v)} placeholder="SMB founders, CTOs…" />
        <Field label="HQ Location" value={value.hqLocation} onChange={(v) => set("hqLocation", v)} placeholder="San Francisco, CA" />
        <Field label="Year Founded" value={value.yearFounded} onChange={(v) => set("yearFounded", v)} placeholder="2020" />
        <Field label="Founder Name" value={value.founderName} onChange={(v) => set("founderName", v)} placeholder="Jane Doe" />
        <Field label="Founder Title" value={value.founderTitle} onChange={(v) => set("founderTitle", v)} placeholder="CEO & Co-founder" />
      </div>

      <div className="mt-3">
        <Label className="text-[11px] text-muted-foreground">Unique Value Proposition</Label>
        <Textarea
          value={value.usp}
          onChange={(e) => set("usp", e.target.value)}
          placeholder="What makes you measurably different? (one sentence)"
          className="mt-1 min-h-[64px] rounded-xl border-border/60 bg-secondary/30 text-xs"
        />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-8 rounded-xl border-border/60 bg-secondary/30 text-xs"
      />
    </div>
  );
}
