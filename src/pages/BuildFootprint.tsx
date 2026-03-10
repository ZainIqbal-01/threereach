import { Check, Edit2, Eye, RefreshCw, FileText, HelpCircle, Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ContentAsset {
  id: string;
  title: string;
  description: string;
  emoji: string;
  status: "draft" | "published" | "needs_update";
  lastUpdated?: string;
}

const contentAssets: ContentAsset[] = [
  { id: "landing", title: "AI Landing Page", description: "Optimized for AI discovery", emoji: "🌐", status: "published", lastUpdated: "Jan 15, 2026" },
  { id: "knowledge", title: "Knowledge Base Page", description: "Structured business info", emoji: "📚", status: "draft" },
  { id: "faq", title: "FAQ Schema", description: "Q&A for AI engines", emoji: "❓", status: "needs_update", lastUpdated: "Dec 28, 2025" },
  { id: "trust", title: "Trust Page", description: "Credibility signals", emoji: "🛡️", status: "draft" },
  { id: "founder", title: "Founder Profile", description: "Leadership visibility", emoji: "👤", status: "published", lastUpdated: "Jan 10, 2026" },
];

const profileFields = [
  { name: "Business Description", completed: true },
  { name: "Core Services", completed: true },
  { name: "Founding Year", completed: true },
  { name: "Location & Markets", completed: true },
  { name: "Trust Statements", completed: false },
  { name: "Key Differentiators", completed: false },
  { name: "Client Testimonials", completed: false },
  { name: "Awards & Recognition", completed: false },
];

const completedFields = profileFields.filter((f) => f.completed).length;
const profileProgress = (completedFields / profileFields.length) * 100;

const statusConfig = {
  draft: { label: "Draft 📝", className: "bg-muted text-muted-foreground border-2 border-border" },
  published: { label: "Live! ✅", className: "bg-success-light text-success border-2 border-success/20" },
  needs_update: { label: "Update! ⚠️", className: "bg-warning-light text-warning border-2 border-warning/20" },
};

export default function BuildFootprint() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-foreground">🏗️ Build AI Footprint</h1>
        <p className="text-muted-foreground mt-1 font-semibold">Create content that makes AI engines love you</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Identity Builder */}
        <motion.div className="col-span-5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-reach h-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧬</span>
              <h3 className="text-lg font-black text-foreground">Knowledge Identity</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-semibold">Complete your profile for better AI results</p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Profile Completeness</span>
                <span className="text-sm font-black text-electric">{Math.round(profileProgress)}%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${profileProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {profileFields.map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    field.completed
                      ? "bg-success-light/50 border-success/20"
                      : "bg-card border-border hover:border-electric/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{field.completed ? "✅" : "⬜"}</span>
                    <span className={`text-sm font-bold ${field.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {field.name}
                    </span>
                  </div>
                  {!field.completed && (
                    <Button variant="ghost" size="sm" className="text-electric h-7 px-3 font-bold rounded-xl">
                      Add +
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Assets */}
        <motion.div className="col-span-7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="card-reach">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📄</span>
              <h3 className="text-lg font-black text-foreground">AI Content Assets</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-semibold">Publish pages optimized for AI discovery</p>

            <div className="space-y-3">
              {contentAssets.map((asset, i) => {
                const status = statusConfig[asset.status];
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-border hover:border-electric/30 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{asset.emoji}</span>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{asset.title}</h4>
                        <p className="text-xs text-muted-foreground font-semibold">{asset.description}</p>
                        {asset.lastUpdated && (
                          <p className="text-[10px] text-muted-foreground mt-1 font-semibold">Updated: {asset.lastUpdated}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.className}`}>
                        {status.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Eye className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
