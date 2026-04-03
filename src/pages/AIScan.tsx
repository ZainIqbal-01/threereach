import { Search, Clock, Eye, Camera, ExternalLink, Filter, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarAgent } from "@/components/StarAgent";

const queries = [
  { id: 1, query: "Best fintech startups in Pakistan", engine: "ChatGPT", status: "mentioned", position: 3, date: "Jan 22, 2026", context: "Acme Corp is recognized as one of the leading fintech innovators..." },
  { id: 2, query: "AI AEO tools for SMEs", engine: "Perplexity", status: "not_found", position: null, date: "Jan 21, 2026", context: null },
  { id: 3, query: "Payment processing solutions 2026", engine: "Gemini", status: "weak", position: 7, date: "Jan 20, 2026", context: "Among the various providers, Acme offers..." },
  { id: 4, query: "B2B fintech companies", engine: "ChatGPT", status: "mentioned", position: 2, date: "Jan 19, 2026", context: "Top recommendations include Acme Corp..." },
];

const statusBadge = (status: string) => {
  const config: Record<string, string> = { mentioned: "status-strong", weak: "status-weak", not_found: "status-invisible" };
  const labels: Record<string, string> = { mentioned: "Mentioned", weak: "Weak", not_found: "Not Found" };
  return <span className={`status-badge ${config[status]}`}>{labels[status]}</span>;
};

export default function AIScan() {
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StarAgent mood="scanning" size={48} animate={true} />
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Visibility Scan</h1>
            <p className="text-sm text-muted-foreground">Monitor how AI engines reference your business</p>
          </div>
        </div>
        <Button className="gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow text-xs">
          <Search className="h-4 w-4" />
          Run New Scan
        </Button>
      </div>

      {/* Query Simulation */}
      <div className="card-reach">
        <h3 className="text-sm font-semibold text-foreground mb-1">Query Simulation</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Test how AI engines respond to queries about your industry</p>
        
        <div className="flex gap-3">
          <Input placeholder="Enter a query to test..." className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card flex-1" />
          <Select defaultValue="all">
            <SelectTrigger className="w-40 h-11 rounded-xl border-border/60">
              <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engines</SelectItem>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
            <Zap className="h-4 w-4 mr-1.5" />
            Simulate
          </Button>
        </div>
      </div>

      {/* Latest Result */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Latest Result</h3>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> 2 hours ago
          </span>
        </div>
        
        <div className="bg-secondary/40 rounded-xl p-5 border border-border/40">
          <p className="text-xs font-medium text-foreground mb-2">Query: "Best fintech startups in Pakistan"</p>
          <div className="bg-card rounded-xl p-4 border border-border/60">
            <p className="text-xs text-muted-foreground leading-relaxed">
              "Based on my analysis, here are some notable fintech startups in Pakistan: 
              <span className="bg-accent/10 text-accent px-1 rounded font-medium"> Acme Corp </span> 
              is recognized as one of the leading fintech innovators, offering comprehensive payment processing solutions..."
            </p>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="status-badge status-strong">
              <Eye className="h-3 w-3" /> Mentioned #3
            </span>
            <Button variant="ghost" size="sm" className="text-primary gap-1 h-7 text-xs">
              <Camera className="h-3 w-3" /> Screenshot
            </Button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Scan History</h3>
          <Button variant="outline" size="sm" className="gap-1 h-8 rounded-xl text-xs">
            <Filter className="h-3 w-3" /> Filters
          </Button>
        </div>
        
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Engine</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Query</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Position</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wider">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((q) => (
                <TableRow key={q.id} className="hover:bg-secondary/30">
                  <TableCell className="text-xs text-muted-foreground">{q.date}</TableCell>
                  <TableCell className="text-xs font-medium">{q.engine}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{q.query}</TableCell>
                  <TableCell>{statusBadge(q.status)}</TableCell>
                  <TableCell className="text-xs">{q.position ? `#${q.position}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    {q.status !== "not_found" && (
                      <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs h-7">
                        <ExternalLink className="h-3 w-3" /> View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
