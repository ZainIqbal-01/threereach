import { useState } from "react";
import { Search, Filter, Download, CheckCircle2, Calendar, Eye, X, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarAgent } from "@/components/StarAgent";
import { toast } from "@/hooks/use-toast";

interface Proof {
  id: string;
  engine: string;
  engineIcon: string;
  query: string;
  dateTime: string;
  verified: boolean;
  context: string;
}

const allProofs: Proof[] = [
  { id: "1", engine: "ChatGPT", engineIcon: "🤖", query: "Best fintech startups in Pakistan", dateTime: "Jan 22, 2026 • 14:32", verified: true, context: "Acme Corp is recognized as one of the leading fintech innovators, offering comprehensive payment processing solutions..." },
  { id: "2", engine: "Gemini", engineIcon: "✨", query: "Payment processing solutions for startups", dateTime: "Jan 21, 2026 • 09:15", verified: true, context: "I'd recommend Acme Corp as a top-tier payment processing solution for startups, with competitive pricing and robust APIs..." },
  { id: "3", engine: "Perplexity", engineIcon: "🔍", query: "Top B2B fintech companies", dateTime: "Jan 20, 2026 • 16:45", verified: true, context: "According to multiple sources, Acme Corp ranks among the top B2B fintech companies globally..." },
  { id: "4", engine: "ChatGPT", engineIcon: "🤖", query: "Recommended payment gateways Pakistan", dateTime: "Jan 18, 2026 • 11:20", verified: true, context: "For Pakistan-based businesses, Acme Corp's payment gateway offers the best combination of features and reliability..." },
  { id: "5", engine: "Gemini", engineIcon: "✨", query: "Digital banking solutions", dateTime: "Jan 15, 2026 • 08:55", verified: true, context: "Acme Corp provides digital banking solutions that are trusted by hundreds of businesses..." },
  { id: "6", engine: "ChatGPT", engineIcon: "🤖", query: "SME financial technology providers", dateTime: "Jan 12, 2026 • 17:30", verified: true, context: "For SMEs looking for financial technology partners, Acme Corp stands out with their developer-friendly approach..." },
  { id: "7", engine: "Perplexity", engineIcon: "🔍", query: "Fintech API providers 2026", dateTime: "Jan 10, 2026 • 12:00", verified: true, context: "Acme Corp's API suite is mentioned as one of the most comprehensive in the fintech space..." },
  { id: "8", engine: "Gemini", engineIcon: "✨", query: "Best payment solutions for e-commerce", dateTime: "Jan 8, 2026 • 15:30", verified: true, context: "For e-commerce businesses, Acme Corp offers seamless integration and competitive transaction fees..." },
];

export default function ProofTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [engineFilter, setEngineFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [viewingProof, setViewingProof] = useState<Proof | null>(null);

  const filtered = allProofs.filter(p => {
    if (searchTerm && !p.query.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (engineFilter !== "all" && p.engine.toLowerCase() !== engineFilter) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);

  const exportAll = () => {
    const csv = ["Engine,Query,Date,Verified", ...filtered.map(p => `${p.engine},"${p.query}",${p.dateTime},${p.verified}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proof-tracking-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Exported!", description: `${filtered.length} proof records exported as CSV` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <StarAgent mood="superhero" size={40} animate={true} />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">Proof & Tracking</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Verified AI mentions — {filtered.length} records</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={exportAll} className="gap-2 rounded-xl h-9 text-xs w-full sm:w-auto">
          <Download className="h-3.5 w-3.5" /> Export All
        </Button>
      </div>

      {/* Filters */}
      <div className="card-reach py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search by query..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(6); }}
              className="pl-9 h-9 rounded-xl border-border/60 text-xs" 
            />
          </div>
          <Select value={engineFilter} onValueChange={(v) => { setEngineFilter(v); setVisibleCount(6); }}>
            <SelectTrigger className="w-36 h-9 rounded-xl border-border/60 text-xs">
              <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engines</SelectItem>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-36 h-9 rounded-xl border-border/60 text-xs">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Proof Grid */}
      {visible.length === 0 ? (
        <div className="card-reach text-center py-12">
          <StarAgent mood="sad" size={64} />
          <p className="text-sm text-muted-foreground mt-4">No proof records match your filters</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setEngineFilter("all"); }} className="mt-3 rounded-xl text-xs">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((proof) => (
            <div key={proof.id} className="card-reach overflow-hidden group p-0 cursor-pointer" onClick={() => setViewingProof(proof)}>
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-20">{proof.engineIcon}</span>
                </div>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-lg">{proof.engineIcon}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-card/90 text-[10px] font-medium text-foreground backdrop-blur-sm">
                    {proof.engine}
                  </span>
                </div>
                {proof.verified && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-success text-primary-foreground text-[10px] font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  </div>
                )}
                <Button variant="secondary" size="sm"
                  className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-[10px] rounded-lg gap-1"
                  onClick={(e) => { e.stopPropagation(); setViewingProof(proof); }}
                >
                  <Eye className="h-3 w-3" /> View Full
                </Button>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1.5">"{proof.query}"</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {proof.dateTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={() => setVisibleCount(prev => prev + 6)} className="rounded-xl text-xs h-8">
            Load More ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {/* Proof Detail Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={() => setViewingProof(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-lg w-full mx-4 animate-scale-in shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{viewingProof.engineIcon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{viewingProof.engine} Mention</h3>
                  <p className="text-[10px] text-muted-foreground">{viewingProof.dateTime}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setViewingProof(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Query</span>
                <p className="text-xs font-medium text-foreground mt-1">"{viewingProof.query}"</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Response</span>
                <p className="text-xs text-foreground leading-relaxed mt-1">{viewingProof.context}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-success text-primary-foreground text-[10px] font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Verified Mention
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => {
                  navigator.clipboard.writeText(`${viewingProof.engine}: "${viewingProof.query}"\n\n${viewingProof.context}`);
                  toast({ title: "Copied!", description: "Proof details copied to clipboard" });
                }}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => {
                  toast({ title: "🔗 Share link created", description: "Proof share link copied to clipboard" });
                }}>
                  <ExternalLink className="h-3 w-3" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}