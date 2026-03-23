import { FileText, Share2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Reports() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Generate and share your AI visibility reports
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Report Builder */}
        <div className="col-span-4">
          <div className="card-reach h-full">
            <h3 className="text-lg font-semibold text-navy mb-6">Report Builder</h3>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select sections to include:</p>

              <div className="space-y-3">
                {[
                  { id: "score", label: "AI Visibility Score", checked: true },
                  { id: "mentions", label: "AI Mentions Summary", checked: true },
                  { id: "screenshots", label: "Screenshot Proofs", checked: true },
                  { id: "timeline", label: "Progress Timeline", checked: false },
                  { id: "engines", label: "Engine Breakdown", checked: true },
                  { id: "distribution", label: "Distribution Status", checked: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-electric/30 transition-colors"
                  >
                    <Checkbox id={item.id} defaultChecked={item.checked} />
                    <Label htmlFor={item.id} className="text-sm font-medium text-navy cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <Button className="w-full gap-2 bg-electric hover:bg-electric-hover text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="col-span-8">
          <div className="card-reach h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Report Preview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Full Preview
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  Share Link
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Mock PDF Preview */}
            <div className="aspect-[8.5/11] bg-white rounded-lg border border-border shadow-lg overflow-hidden">
              <div className="p-8 h-full">
                {/* Report Header */}
                <div className="border-b border-border pb-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-navy">AI Visibility Report</h2>
                      <p className="text-sm text-muted-foreground">Acme Corp • January 2026</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-electric">42</div>
                      <div className="text-xs text-muted-foreground">Visibility Score</div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-navy mb-2">Executive Summary</h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your business has been mentioned in 3 AI engines this month. 
                      ChatGPT shows weak presence, Gemini shows strong presence, 
                      and Perplexity has not indexed your content yet.
                    </p>
                  </div>
                </div>

                {/* Engine Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "ChatGPT", status: "Weak", color: "text-amber-600 bg-amber-50" },
                    { name: "Gemini", status: "Strong", color: "text-emerald-600 bg-emerald-50" },
                    { name: "Perplexity", status: "Not Found", color: "text-red-600 bg-red-50" },
                  ].map((engine) => (
                    <div key={engine.name} className="p-3 rounded-lg border border-border">
                      <div className="text-xs font-medium text-navy">{engine.name}</div>
                      <div className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${engine.color}`}>
                        {engine.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mentions */}
                <div>
                  <h4 className="text-sm font-semibold text-navy mb-2">Recent Mentions</h4>
                  <div className="space-y-2">
                    {[
                      "Best fintech startups in Pakistan",
                      "Payment processing solutions",
                      "Recommended fintech providers",
                    ].map((mention, i) => (
                      <div key={i} className="text-xs p-2 bg-muted/20 rounded">
                        <span className="text-muted-foreground">"{mention}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
