import { useState } from "react";
import { Search, Filter, Clock, Eye, Camera, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const queries = [
  { id: 1, query: "Best fintech startups in Pakistan", engine: "ChatGPT", status: "mentioned", position: 3, date: "Jan 22, 2026", context: "Acme Corp is recognized as one of the leading fintech innovators..." },
  { id: 2, query: "AI AEO tools for SMEs", engine: "Perplexity", status: "not_found", position: null, date: "Jan 21, 2026", context: null },
  { id: 3, query: "Payment processing solutions 2026", engine: "Gemini", status: "weak", position: 7, date: "Jan 20, 2026", context: "Among the various providers, Acme offers..." },
];

const statusBadge = (status: string) => {
  const config: Record<string, { cls: string; label: string }> = {
    mentioned: { cls: "status-strong", label: "Found! 🎉" },
    weak: { cls: "status-weak", label: "Weak 😐" },
    not_found: { cls: "status-invisible", label: "Not Found 😞" },
  };
  const c = config[status];
  return <span className={`status-badge ${c.cls}`}>{c.label}</span>;
};

export default function AIScan() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">🔍 AI Visibility Scan</h1>
          <p className="text-muted-foreground mt-1 font-semibold">See how AI engines talk about your business</p>
        </div>
        <Button className="gap-2 bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl font-bold btn-fun">
          <Search className="h-4 w-4" />
          Run New Scan
        </Button>
      </motion.div>

      {/* Query Simulation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-reach">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🧪</span>
          <h3 className="text-lg font-black text-foreground">Query Simulation</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6 font-semibold">Test a specific question to see if AI recommends you</p>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Input placeholder="e.g., 'Best fintech startups in Pakistan'" className="h-12 rounded-2xl border-2 font-semibold" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48 h-12 rounded-2xl border-2 font-bold">
              <SelectValue placeholder="Select Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All Engines</SelectItem>
              <SelectItem value="chatgpt">🤖 ChatGPT</SelectItem>
              <SelectItem value="gemini">✨ Gemini</SelectItem>
              <SelectItem value="perplexity">🔍 Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-12 px-6 bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl font-bold btn-fun">
            <Zap className="h-4 w-4 mr-2" /> Simulate
          </Button>
        </div>
      </motion.div>

      {/* Latest Result */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h3 className="text-lg font-black text-foreground">Latest Result</h3>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
            <Clock className="h-3 w-3" /> 2 hours ago
          </span>
        </div>
        
        <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border">
          <p className="text-sm font-bold text-foreground mb-2">🤖 ChatGPT — "Best fintech startups in Pakistan"</p>
          <div className="bg-card rounded-xl p-4 border-2 border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Based on my analysis, here are some notable fintech startups in Pakistan: 
              <span className="bg-success-light text-success px-1.5 rounded-lg font-bold"> Acme Corp </span> 
              is recognized as one of the leading fintech innovators..."
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="status-badge status-strong">
              <Eye className="h-3 w-3" /> Mentioned at #3 🎉
            </span>
            <Button variant="ghost" size="sm" className="text-electric gap-1 font-bold rounded-xl">
              <Camera className="h-4 w-4" /> View Screenshot
            </Button>
          </div>
        </div>
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-reach">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h3 className="text-lg font-black text-foreground">Scan History</h3>
          </div>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl font-bold border-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Engine</TableHead>
              <TableHead className="font-bold">Query</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Position</TableHead>
              <TableHead className="text-right font-bold">Proof</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell className="text-muted-foreground font-semibold">{query.date}</TableCell>
                <TableCell className="font-bold">{query.engine}</TableCell>
                <TableCell className="max-w-xs truncate font-semibold">{query.query}</TableCell>
                <TableCell>{statusBadge(query.status)}</TableCell>
                <TableCell className="font-bold">{query.position ? `#${query.position}` : "—"}</TableCell>
                <TableCell className="text-right">
                  {query.status !== "not_found" && (
                    <Button variant="ghost" size="sm" className="gap-1 text-electric font-bold rounded-xl">
                      <ExternalLink className="h-4 w-4" /> View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
