import { useMemo } from "react";
import { Award, BookOpen, Shield, Star, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandContextValue } from "./BrandContext";
import { experienceTemplate, expertiseTemplate, authorityTemplate, trustTemplate } from "./templates";

export type EEATKey = "experience" | "expertise" | "authority" | "trust";

export interface EEATState {
  experience: { enabled: boolean; content: string };
  expertise: { enabled: boolean; content: string };
  authority: { enabled: boolean; content: string };
  trust: { enabled: boolean; content: string };
}

interface Props {
  businessName: string;
  ctx: BrandContextValue;
  state: EEATState;
  onChange: (s: EEATState) => void;
  onPreview: (key: EEATKey) => void;
}

const META = {
  experience: { label: "Experience", icon: Star, hint: "Real customer outcomes, usage stats, case studies", color: "text-accent" },
  expertise: { label: "Expertise", icon: BookOpen, hint: "Team credentials, published knowledge, research", color: "text-primary" },
  authority: { label: "Authoritativeness", icon: Award, hint: "Awards, citations, media mentions, backlinks", color: "text-warning" },
  trust: { label: "Trust", icon: Shield, hint: "Certifications, security, transparent commitments", color: "text-success" },
} as const;

export function EEATPanel({ businessName, ctx, state, onChange, onPreview }: Props) {
  const generators = useMemo(() => ({
    experience: experienceTemplate,
    expertise: expertiseTemplate,
    authority: authorityTemplate,
    trust: trustTemplate,
  }), []);

  const generate = (key: EEATKey) => {
    const content = generators[key]({ name: businessName, ctx });
    onChange({ ...state, [key]: { enabled: true, content } });
  };

  const generateAll = () => {
    const next = { ...state };
    (Object.keys(META) as EEATKey[]).forEach((k) => {
      next[k] = { enabled: true, content: generators[k]({ name: businessName, ctx }) };
    });
    onChange(next);
  };

  const enabledCount = (Object.values(state) as { enabled: boolean }[]).filter((v) => v.enabled).length;

  return (
    <div className="card-reach">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">E-E-A-T Content Engine</h3>
          <p className="text-[11px] text-muted-foreground">
            Experience · Expertise · Authoritativeness · Trust — what AI engines look for
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{enabledCount}/4 active</span>
          <Button size="sm" onClick={generateAll} className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1">
            <Sparkles className="h-3 w-3" /> Generate All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(Object.keys(META) as EEATKey[]).map((key) => {
          const m = META[key];
          const Icon = m.icon;
          const active = state[key].enabled;
          return (
            <div
              key={key}
              className={`p-3 rounded-xl border transition-all ${
                active ? "bg-success-light/40 border-success/20" : "bg-secondary/30 border-border/60 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-card ${m.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-foreground">{m.label}</h4>
                      {active && <Check className="h-3 w-3 text-success" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight max-w-[200px]">{m.hint}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 mt-2">
                <Button size="sm" variant={active ? "outline" : "default"} onClick={() => generate(key)}
                  className="h-7 px-2 text-[10px] rounded-lg flex-1">
                  {active ? "Regenerate" : "Generate"}
                </Button>
                {active && (
                  <Button size="sm" variant="ghost" onClick={() => onPreview(key)} className="h-7 px-2 text-[10px] rounded-lg">
                    Preview
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
