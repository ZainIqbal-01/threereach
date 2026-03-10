import { RefreshCw, ExternalLink, Upload, Check, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SubmissionCard {
  id: string;
  platform: string;
  logo: string;
  emoji: string;
  submittedDate?: string;
  liveDate?: string;
  indexedDate?: string;
  verifiedDate?: string;
  status: "not_started" | "submitted" | "live" | "indexed" | "verified";
  link?: string;
}

const submissions: SubmissionCard[] = [
  { id: "1", platform: "Crunchbase", logo: "CB", emoji: "🏢", submittedDate: "Jan 10", liveDate: "Jan 12", indexedDate: "Jan 18", verifiedDate: "Jan 20", status: "verified", link: "#" },
  { id: "2", platform: "AngelList", logo: "AL", emoji: "😇", submittedDate: "Jan 12", liveDate: "Jan 14", indexedDate: "Jan 19", status: "indexed", link: "#" },
  { id: "3", platform: "LinkedIn", logo: "LI", emoji: "💼", submittedDate: "Jan 15", liveDate: "Jan 16", status: "live", link: "#" },
  { id: "4", platform: "Product Hunt", logo: "PH", emoji: "🚀", submittedDate: "Jan 18", status: "submitted" },
  { id: "5", platform: "G2 Crowd", logo: "G2", emoji: "⭐", status: "not_started" },
  { id: "6", platform: "Capterra", logo: "CA", emoji: "📊", status: "not_started" },
];

const columns = [
  { id: "not_started", label: "Not Started", emoji: "⬜", color: "bg-muted border-border" },
  { id: "submitted", label: "Submitted", emoji: "📤", color: "bg-warning-light border-warning/20" },
  { id: "live", label: "Live", emoji: "🟢", color: "bg-electric-light border-electric/20" },
  { id: "indexed", label: "Indexed", emoji: "🧠", color: "bg-cyan-light border-cyan/20" },
  { id: "verified", label: "AI Verified", emoji: "✅", color: "bg-success-light border-success/20" },
];

export default function Distribution() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">📡 Distribution Engine</h1>
          <p className="text-muted-foreground mt-1 font-semibold">Get your brand everywhere AI looks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl border-2 font-bold">
            <Upload className="h-4 w-4" /> Manual Upload
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted border-2 border-border">
            <span className="text-sm text-muted-foreground font-bold">Auto Retry</span>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-5 gap-4">
        {columns.map((col) => {
          const count = submissions.filter((s) => s.status === col.id).length;
          return (
            <div key={col.id} className={`card-reach py-4 ${col.color} border-2`}>
              <div className="text-center">
                <span className="text-2xl">{col.emoji}</span>
                <div className="text-2xl font-black text-foreground mt-1">{count}</div>
                <div className="text-xs text-muted-foreground font-bold">{col.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Pipeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-5 gap-4 min-h-[400px]">
        {columns.map((col) => (
          <div key={col.id} className="space-y-3">
            <div className={`p-3 rounded-2xl ${col.color} border-2`}>
              <h3 className="text-sm font-black text-foreground text-center">{col.emoji} {col.label}</h3>
            </div>
            <div className="space-y-3">
              {submissions.filter((s) => s.status === col.id).map((sub) => (
                <motion.div
                  key={sub.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="card-reach p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{sub.emoji}</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{sub.platform}</h4>
                  {sub.submittedDate && (
                    <p className="text-xs text-muted-foreground font-semibold">📅 {sub.submittedDate}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    {sub.link && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-electric font-bold rounded-xl">
                        <ExternalLink className="h-3 w-3 mr-1" /> View
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
