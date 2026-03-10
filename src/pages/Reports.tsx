import { FileText, Share2, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Reports() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-foreground">📊 Reports</h1>
        <p className="text-muted-foreground mt-1 font-semibold">Generate beautiful AI visibility reports for clients</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Builder */}
        <motion.div className="col-span-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-reach h-full">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🛠️</span>
              <h3 className="text-lg font-black text-foreground">Report Builder</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-semibold">Select sections:</p>
              <div className="space-y-2">
                {[
                  { id: "score", label: "🎯 AI Visibility Score", checked: true },
                  { id: "mentions", label: "🤖 AI Mentions Summary", checked: true },
                  { id: "screenshots", label: "📸 Screenshot Proofs", checked: true },
                  { id: "timeline", label: "🗺️ Progress Timeline", checked: false },
                  { id: "engines", label: "⚙️ Engine Breakdown", checked: true },
                  { id: "distribution", label: "📡 Distribution Status", checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-electric/30 transition-colors">
                    <Checkbox id={item.id} defaultChecked={item.checked} />
                    <Label htmlFor={item.id} className="text-sm font-bold text-foreground cursor-pointer">{item.label}</Label>
                  </div>
                ))}
              </div>
              <Button className="w-full gap-2 bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl font-bold btn-fun mt-4">
                <FileText className="h-4 w-4" /> Generate Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div className="col-span-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="card-reach h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                <h3 className="text-lg font-black text-foreground">Report Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1 rounded-xl border-2 font-bold"><Eye className="h-4 w-4" /> Preview</Button>
                <Button variant="outline" size="sm" className="gap-1 rounded-xl border-2 font-bold"><Share2 className="h-4 w-4" /> Share</Button>
                <Button variant="outline" size="sm" className="gap-1 rounded-xl border-2 font-bold"><Download className="h-4 w-4" /> PDF</Button>
              </div>
            </div>

            <div className="aspect-[8.5/11] bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden">
              <div className="p-8 h-full">
                <div className="border-b-2 border-border pb-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-foreground">🎯 AI Visibility Report</h2>
                      <p className="text-sm text-muted-foreground font-semibold">Acme Corp • January 2026</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-electric">42</div>
                      <div className="text-xs text-muted-foreground font-bold">Visibility Score</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-black text-foreground mb-2">📋 Executive Summary</h4>
                  <div className="bg-muted/30 rounded-xl p-4 border-2 border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                      Your business has been mentioned in 3 AI engines this month. ChatGPT shows weak presence, Gemini shows strong presence, and Perplexity has not indexed yet.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "🤖 ChatGPT", status: "Weak 😐", color: "text-warning bg-warning-light border-warning/20" },
                    { name: "✨ Gemini", status: "Strong 🔥", color: "text-success bg-success-light border-success/20" },
                    { name: "🔍 Perplexity", status: "Not Found 😞", color: "text-danger bg-danger-light border-danger/20" },
                  ].map((engine) => (
                    <div key={engine.name} className="p-3 rounded-xl border-2 border-border">
                      <div className="text-xs font-bold text-foreground">{engine.name}</div>
                      <div className={`text-xs font-bold mt-1 px-2.5 py-1 rounded-full inline-block border-2 ${engine.color}`}>
                        {engine.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
