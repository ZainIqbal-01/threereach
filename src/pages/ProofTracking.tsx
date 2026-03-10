import { Search, Filter, Download, CheckCircle2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const proofs = [
  { id: "1", engine: "ChatGPT", emoji: "🤖", query: "Best fintech startups in Pakistan", dateTime: "Jan 22, 2026 • 14:32", verified: true },
  { id: "2", engine: "Gemini", emoji: "✨", query: "Payment processing solutions for startups", dateTime: "Jan 21, 2026 • 09:15", verified: true },
  { id: "3", engine: "Perplexity", emoji: "🔍", query: "Top B2B fintech companies", dateTime: "Jan 20, 2026 • 16:45", verified: true },
  { id: "4", engine: "ChatGPT", emoji: "🤖", query: "Recommended payment gateways Pakistan", dateTime: "Jan 18, 2026 • 11:20", verified: true },
  { id: "5", engine: "Gemini", emoji: "✨", query: "Digital banking solutions", dateTime: "Jan 15, 2026 • 08:55", verified: true },
  { id: "6", engine: "ChatGPT", emoji: "🤖", query: "SME financial technology providers", dateTime: "Jan 12, 2026 • 17:30", verified: true },
];

export default function ProofTracking() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">🛡️ Proof & Tracking</h1>
          <p className="text-muted-foreground mt-1 font-semibold">Your verified AI mentions — screenshot evidence included</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-2xl border-2 font-bold">
          <Download className="h-4 w-4" /> Export All Proofs
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-reach">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by query..." className="pl-10 rounded-2xl border-2 font-semibold" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 rounded-2xl border-2 font-bold"><SelectValue placeholder="Engine" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All</SelectItem>
              <SelectItem value="chatgpt">🤖 ChatGPT</SelectItem>
              <SelectItem value="gemini">✨ Gemini</SelectItem>
              <SelectItem value="perplexity">🔍 Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 rounded-2xl border-2 font-bold"><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Proof Grid */}
      <div className="grid grid-cols-3 gap-6">
        {proofs.map((proof, i) => (
          <motion.div
            key={proof.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="card-reach overflow-hidden group"
          >
            {/* Screenshot area */}
            <div className="relative aspect-video bg-muted -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl flex items-center justify-center">
              <div className="text-5xl">{proof.emoji}</div>
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1.5 rounded-full bg-card/90 text-xs font-bold text-foreground border-2 border-border">
                  {proof.engine}
                </span>
              </div>
              {proof.verified && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success text-white text-xs font-bold">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl font-bold"
              >
                View Full
              </Button>
            </div>

            <div>
              <p className="text-sm font-bold text-foreground line-clamp-2 mb-2">"{proof.query}"</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Calendar className="h-3 w-3" />
                {proof.dateTime}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="rounded-2xl border-2 font-bold">Load More Proofs</Button>
      </div>
    </div>
  );
}
