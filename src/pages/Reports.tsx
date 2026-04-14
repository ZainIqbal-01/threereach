import { useState } from "react";
import { FileText, Share2, Download, Eye, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { agents } from "@/components/agents/agentRegistry";
import { toast } from "@/hooks/use-toast";

interface ReportSection {
  id: string;
  label: string;
  checked: boolean;
}

export default function Reports() {
  const [sections, setSections] = useState<ReportSection[]>([
    { id: "score", label: "AI Visibility Score", checked: true },
    { id: "mentions", label: "AI Mentions Summary", checked: true },
    { id: "screenshots", label: "Screenshot Proofs", checked: true },
    { id: "timeline", label: "Progress Timeline", checked: false },
    { id: "engines", label: "Engine Breakdown", checked: true },
    { id: "distribution", label: "Distribution Status", checked: false },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
    setReportReady(false);
  };

  const generateReport = () => {
    const selected = sections.filter(s => s.checked);
    if (selected.length === 0) {
      toast({ title: "Select sections", description: "Choose at least one section to include", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
      toast({ title: "📊 Report generated!", description: `Report with ${selected.length} sections is ready` });
    }, 2000);
  };

  const exportPDF = () => {
    if (!reportReady) {
      toast({ title: "Generate first", description: "Generate a report before exporting", variant: "destructive" });
      return;
    }
    toast({ title: "📥 Downloading PDF...", description: "Your report is being prepared for download" });
    setTimeout(() => {
      const content = `AI Visibility Report - Acme Corp\nGenerated: ${new Date().toLocaleDateString()}\n\nVisibility Score: 42/100\nStatus: Weak\n\nSections: ${sections.filter(s => s.checked).map(s => s.label).join(", ")}\n\nChatGPT: Weak (Position #3)\nGemini: Strong (Position #1)\nPerplexity: Not Found`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-visibility-report.txt";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✅ Report downloaded!" });
    }, 1000);
  };

  const shareLink = () => {
    if (!reportReady) {
      toast({ title: "Generate first", description: "Generate a report before sharing", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText("https://threereach.app/report/acme-corp-jan-2026");
    toast({ title: "🔗 Link copied!", description: "Share link copied to clipboard" });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <AgentBadge agent={agents.sage} isWorking={isGenerating} mood={reportReady ? "excited" : undefined} size={48} />
        <div>
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Sage generates and shares your AI visibility reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Report Builder */}
        <div className="lg:col-span-4">
          <div className="card-reach h-full">
            <h3 className="text-sm font-semibold text-foreground mb-1">Report Builder</h3>
            <p className="text-[11px] text-muted-foreground mb-5">Select sections to include:</p>

            <div className="space-y-2.5">
              {sections.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleSection(item.id)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    item.checked ? "border-primary/30 bg-primary/5" : "border-border/60 hover:border-primary/20"
                  }`}
                >
                  <Checkbox id={item.id} checked={item.checked} onCheckedChange={() => toggleSection(item.id)} />
                  <Label htmlFor={item.id} className="text-xs font-medium text-foreground cursor-pointer flex-1">
                    {item.label}
                  </Label>
                  {item.checked && <Check className="h-3 w-3 text-primary" />}
                </div>
              ))}
            </div>

            <div className="pt-5 space-y-2.5">
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 text-xs"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
              {reportReady && (
                <p className="text-[10px] text-success text-center flex items-center justify-center gap-1">
                  <Check className="h-3 w-3" /> Report ready
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8">
          <div className="card-reach h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Report Preview</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-1 h-8 rounded-xl text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  {showPreview ? "Compact" : "Full Preview"}
                </Button>
                <Button variant="outline" size="sm" onClick={shareLink} className="gap-1 h-8 rounded-xl text-xs">
                  <Share2 className="h-3.5 w-3.5" />
                  Share Link
                </Button>
                <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1 h-8 rounded-xl text-xs">
                  <Download className="h-3.5 w-3.5" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className={`bg-card rounded-xl border border-border/60 shadow-lg overflow-hidden ${showPreview ? "" : "aspect-[8.5/11]"}`}>
              <div className="p-6 h-full">
                <div className="border-b border-border/60 pb-5 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">AI Visibility Report</h2>
                      <p className="text-xs text-muted-foreground">Acme Corp • January 2026</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">42</div>
                      <div className="text-[10px] text-muted-foreground">Visibility Score</div>
                    </div>
                  </div>
                </div>

                {sections.filter(s => s.checked).map(section => (
                  <div key={section.id} className="mb-5 animate-fade-in">
                    {section.id === "score" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Executive Summary</h4>
                        <div className="bg-secondary/40 rounded-xl p-4">
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Your business has been mentioned in 3 AI engines this month. 
                            ChatGPT shows weak presence, Gemini shows strong presence, 
                            and Perplexity has not indexed your content yet.
                          </p>
                        </div>
                      </div>
                    )}
                    {section.id === "engines" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Engine Breakdown</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "ChatGPT", status: "Weak", className: "bg-warning-light text-warning" },
                            { name: "Gemini", status: "Strong", className: "bg-success-light text-success" },
                            { name: "Perplexity", status: "Not Found", className: "bg-destructive/10 text-destructive" },
                          ].map((engine) => (
                            <div key={engine.name} className="p-3 rounded-xl border border-border/60">
                              <div className="text-xs font-medium text-foreground">{engine.name}</div>
                              <span className={`text-[10px] font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${engine.className}`}>
                                {engine.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.id === "mentions" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Recent Mentions</h4>
                        <div className="space-y-2">
                          {["Best fintech startups in Pakistan", "Payment processing solutions", "Recommended fintech providers"].map((mention, i) => (
                            <div key={i} className="text-[11px] p-2.5 bg-secondary/40 rounded-xl">
                              <span className="text-muted-foreground">"{mention}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.id === "screenshots" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Screenshot Proofs</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {["ChatGPT", "Gemini"].map(eng => (
                            <div key={eng} className="aspect-video bg-secondary/40 rounded-xl flex items-center justify-center border border-border/40">
                              <span className="text-xs text-muted-foreground">{eng} Screenshot</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.id === "timeline" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Progress Timeline</h4>
                        <div className="space-y-2">
                          {[{ date: "Jan 22", event: "Score increased to 42", type: "success" }, { date: "Jan 15", event: "First Gemini mention", type: "info" }, { date: "Jan 10", event: "Initial scan completed", type: "info" }].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-secondary/40">
                              <span className="text-[10px] text-muted-foreground w-12">{item.date}</span>
                              <div className={`h-1.5 w-1.5 rounded-full ${item.type === "success" ? "bg-success" : "bg-primary"}`} />
                              <span className="text-[11px] text-foreground">{item.event}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.id === "distribution" && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">Distribution Status</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ name: "Reddit", posts: 2 }, { name: "LinkedIn", posts: 1 }, { name: "Quora", posts: 1 }].map(p => (
                            <div key={p.name} className="p-2.5 rounded-xl bg-secondary/40 text-center">
                              <div className="text-xs font-medium text-foreground">{p.name}</div>
                              <div className="text-[10px] text-muted-foreground">{p.posts} posts</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}