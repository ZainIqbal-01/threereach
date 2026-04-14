import { useState } from "react";
import { Brain, Search, Eye, BarChart3, Target, Plus, X, Globe, Users, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarAgent } from "@/components/StarAgent";
import { MetaCard } from "./UIComponents";
import { ScanRecord } from "./types";
import { getScanHistory } from "./scanHistory";

interface InputPhaseProps {
  brandName: string;
  setBrandName: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  competitors: string[];
  setCompetitors: (v: string[]) => void;
  onStartAnalysis: () => void;
  onLoadScan: (scan: ScanRecord) => void;
}

export function InputPhase({
  brandName, setBrandName, website, setWebsite,
  industry, setIndustry, description, setDescription,
  competitors, setCompetitors, onStartAnalysis, onLoadScan,
}: InputPhaseProps) {
  const [competitorInput, setCompetitorInput] = useState("");
  const history = getScanHistory();

  const addCompetitor = () => {
    const name = competitorInput.trim();
    if (name && competitors.length < 5 && !competitors.includes(name)) {
      setCompetitors([...competitors, name]);
      setCompetitorInput("");
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Hero */}
      <div className="card-premium gradient-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--accent))] shadow-md">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">AI Brand Intelligence</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Discover how AI engines perceive your brand across the web
              </p>
            </div>
          </div>
          <StarAgent mood="waving" size={80} message="Tell me about your brand! ✨" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Eye, label: "Engines Scanned", value: "3", desc: "ChatGPT, Gemini, Perplexity" },
          { icon: BarChart3, label: "Analysis Depth", value: "Deep", desc: "Sentiment + Position + Gaps" },
          { icon: Target, label: "Action Items", value: "5+", desc: "Prioritized improvements" },
        ].map((stat, i) => (
          <div key={stat.label} className={`card-reach py-4 px-5 animate-slide-up stagger-${i + 1}`} style={{ animationFillMode: 'both' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main form */}
        <div className="col-span-2 space-y-5">
          <MetaCard>
            <p className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Brand Details
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Brand Name *</label>
                  <Input placeholder="e.g. Acme Corp" value={brandName} onChange={(e) => setBrandName(e.target.value)}
                    className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-background transition-colors focus-glow" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Website URL *</label>
                  <Input placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-background transition-colors focus-glow" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Industry</label>
                <Input placeholder="e.g. Fintech, SaaS, Healthcare" value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-background transition-colors focus-glow" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                <Textarea placeholder="Briefly describe your products, services, and what makes you unique..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] rounded-xl border-border/60 bg-secondary/30 focus:bg-background transition-colors resize-none focus-glow" />
              </div>
            </div>
          </MetaCard>

          {/* Competitor Benchmarking */}
          <MetaCard>
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Competitor Benchmarking
              <span className="text-[11px] text-muted-foreground font-normal ml-auto">{competitors.length}/5</span>
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Enter competitor name..."
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
                className="h-10 rounded-xl border-border/60 bg-secondary/30 focus:bg-background transition-colors focus-glow"
              />
              <Button variant="outline" onClick={addCompetitor} disabled={!competitorInput.trim() || competitors.length >= 5}
                className="h-10 rounded-xl border-border/60 shadow-none px-3 hover:bg-primary/5 hover:border-primary/30">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {competitors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {competitors.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-medium border border-primary/15 transition-all hover:bg-primary/12">
                    {c}
                    <button onClick={() => setCompetitors(competitors.filter(x => x !== c))} className="hover:text-destructive transition-colors ml-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-secondary/30">
                <Users className="h-3.5 w-3.5" />
                Add competitors to compare AI visibility side-by-side
              </div>
            )}
          </MetaCard>

          <Button onClick={onStartAnalysis} disabled={!brandName.trim() || !website.trim()}
            className="w-full h-13 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2.5 shadow-none text-sm btn-primary-glow">
            <Zap className="h-4 w-4" />
            Analyze AI Perception
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* How it works */}
          <MetaCard className="overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">How it works</p>
            </div>
            <div className="space-y-3">
              {[
                { step: "1", icon: Eye, label: "Visibility Check", desc: "See if AI engines mention you" },
                { step: "2", icon: BarChart3, label: "Sentiment Analysis", desc: "Positive, neutral, or negative" },
                { step: "3", icon: Target, label: "Gap Detection", desc: "Find what's missing" },
                { step: "4", icon: Zap, label: "Action Plan", desc: "Prioritized improvements" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </MetaCard>

          {/* Scan History */}
          {history.length > 0 && (
            <MetaCard>
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                Recent Scans
                <span className="text-[10px] text-muted-foreground font-normal ml-auto">{history.length} total</span>
              </p>
              <div className="space-y-2">
                {history.slice(0, 5).map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => onLoadScan(scan)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-all text-left group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {scan.score}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{scan.brandName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(scan.date).toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
            </MetaCard>
          )}
        </div>
      </div>
    </div>
  );
}
