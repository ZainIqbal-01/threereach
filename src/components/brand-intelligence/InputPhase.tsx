import { useState } from "react";
import { Brain, Search, Eye, BarChart3, Target, Plus, X, Globe, Users } from "lucide-react";
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
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">AI Brand Intelligence</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-[52px]">
              Analyze how AI engines perceive your brand and benchmark against competitors
            </p>
          </div>
          <StarAgent mood="waving" size={90} message="Tell me about your brand! I'll check how AI sees you ✨" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main form */}
        <div className="col-span-2 space-y-5">
          <MetaCard>
            <p className="text-sm font-medium text-foreground mb-5 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Brand Details
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Brand Name *</label>
                  <Input placeholder="e.g. Acme Corp" value={brandName} onChange={(e) => setBrandName(e.target.value)}
                    className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Website URL *</label>
                  <Input placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Industry</label>
                <Input placeholder="e.g. Fintech, SaaS, Healthcare" value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
                <Textarea placeholder="Briefly describe your products, services, and what makes you unique..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors resize-none" />
              </div>
            </div>
          </MetaCard>

          {/* Competitor Benchmarking */}
          <MetaCard>
            <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Competitor Benchmarking
              <span className="text-[11px] text-muted-foreground font-normal ml-auto">Up to 5 competitors</span>
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Enter competitor name..."
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
                className="h-10 rounded-xl border-border/60 bg-secondary/40 focus:bg-background transition-colors"
              />
              <Button variant="outline" onClick={addCompetitor} disabled={!competitorInput.trim() || competitors.length >= 5}
                className="h-10 rounded-xl border-border/60 shadow-none px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {competitors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {competitors.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-medium border border-primary/15">
                    {c}
                    <button onClick={() => setCompetitors(competitors.filter(x => x !== c))} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">Add competitors to compare AI visibility side-by-side</p>
            )}
          </MetaCard>

          <Button onClick={onStartAnalysis} disabled={!brandName.trim() || !website.trim()}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-none text-sm">
            <Search className="h-4 w-4" />
            Analyze AI Perception
          </Button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Features */}
          <MetaCard>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">What you'll get</p>
            <div className="space-y-2.5">
              {[
                { icon: Eye, label: "Visibility Check", desc: "See if AI engines mention you" },
                { icon: BarChart3, label: "Sentiment Analysis", desc: "Positive, neutral, or negative" },
                { icon: Target, label: "Improvement Plan", desc: "Actionable steps to improve" },
                { icon: Users, label: "Competitor Benchmark", desc: "Compare against rivals" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-secondary/40">
                  <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </MetaCard>

          {/* Scan History */}
          {history.length > 0 && (
            <MetaCard>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Recent Scans</p>
              <div className="space-y-2">
                {history.slice(0, 5).map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => onLoadScan(scan)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {scan.score}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{scan.brandName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(scan.date).toLocaleDateString()}</p>
                    </div>
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
