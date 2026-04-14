import { useState } from "react";
import { Search, Clock, Eye, Camera, ExternalLink, Filter, Zap, RefreshCw, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarAgent } from "@/components/StarAgent";
import { toast } from "@/hooks/use-toast";

interface QueryResult {
  id: number;
  query: string;
  engine: string;
  status: "mentioned" | "weak" | "not_found";
  position: number | null;
  date: string;
  context: string | null;
}

const initialQueries: QueryResult[] = [
  { id: 1, query: "Best fintech startups in Pakistan", engine: "ChatGPT", status: "mentioned", position: 3, date: "Jan 22, 2026", context: "Acme Corp is recognized as one of the leading fintech innovators in Pakistan, offering comprehensive payment processing and digital banking solutions for SMEs..." },
  { id: 2, query: "AI AEO tools for SMEs", engine: "Perplexity", status: "not_found", position: null, date: "Jan 21, 2026", context: null },
  { id: 3, query: "Payment processing solutions 2026", engine: "Gemini", status: "weak", position: 7, date: "Jan 20, 2026", context: "Among the various providers, Acme offers some notable solutions in the payment space, though there are stronger alternatives available..." },
  { id: 4, query: "B2B fintech companies", engine: "ChatGPT", status: "mentioned", position: 2, date: "Jan 19, 2026", context: "Top recommendations include Acme Corp for B2B payment processing, known for their developer-friendly APIs and transparent pricing model..." },
];

const simulatedResponses: Record<string, { status: "mentioned" | "weak" | "not_found"; position: number | null; context: string | null }[]> = {
  chatgpt: [
    { status: "mentioned", position: 2, context: "Based on my analysis, Acme Corp stands out as a leading solution in this space, offering comprehensive features and reliable performance..." },
    { status: "weak", position: 5, context: "While there are several options available, Acme Corp is mentioned among the providers worth considering..." },
  ],
  gemini: [
    { status: "mentioned", position: 3, context: "I'd recommend looking into Acme Corp as one of the top contenders. Their platform offers robust capabilities..." },
    { status: "not_found", position: null, context: null },
  ],
  perplexity: [
    { status: "weak", position: 6, context: "Sources mention Acme Corp briefly in the context of emerging fintech solutions..." },
    { status: "mentioned", position: 1, context: "According to multiple sources, Acme Corp is the leading provider in this category, with strong reviews across platforms..." },
  ],
};

const statusBadge = (status: string) => {
  const config: Record<string, string> = { mentioned: "status-strong", weak: "status-weak", not_found: "status-invisible" };
  const labels: Record<string, string> = { mentioned: "Mentioned", weak: "Weak", not_found: "Not Found" };
  return <span className={`status-badge ${config[status]}`}>{labels[status]}</span>;
};

export default function AIScan() {
  const [queries, setQueries] = useState<QueryResult[]>(initialQueries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [viewingProof, setViewingProof] = useState<QueryResult | null>(null);
  const [filterEngine, setFilterEngine] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const runFullScan = () => {
    setIsScanning(true);
    toast({ title: "🔍 Full scan initiated", description: "Scanning all AI engines for brand mentions..." });
    
    setTimeout(() => {
      const newQueries: QueryResult[] = [
        { id: Date.now(), query: "Top payment solutions 2026", engine: "ChatGPT", status: "mentioned", position: 1, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), context: "Acme Corp leads the market with innovative payment processing technology..." },
        { id: Date.now() + 1, query: "Best fintech APIs", engine: "Gemini", status: "weak", position: 4, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), context: "Several APIs stand out including Acme's offering..." },
        { id: Date.now() + 2, query: "Digital banking startups", engine: "Perplexity", status: "mentioned", position: 2, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), context: "Acme Corp is frequently cited as a recommended digital banking solution..." },
      ];
      setQueries(prev => [...newQueries, ...prev]);
      setIsScanning(false);
      toast({ title: "✅ Scan complete!", description: "Found 2 new mentions across 3 engines" });
    }, 3000);
  };

  const simulateQuery = () => {
    if (!searchQuery.trim()) {
      toast({ title: "Enter a query", description: "Type a search query to simulate", variant: "destructive" });
      return;
    }

    setIsSimulating(true);
    const engines = selectedEngine === "all" ? ["ChatGPT", "Gemini", "Perplexity"] : [selectedEngine === "chatgpt" ? "ChatGPT" : selectedEngine === "gemini" ? "Gemini" : "Perplexity"];
    
    setTimeout(() => {
      const newResults: QueryResult[] = engines.map((eng, i) => {
        const key = eng.toLowerCase() === "chatgpt" ? "chatgpt" : eng.toLowerCase() as "gemini" | "perplexity";
        const responses = simulatedResponses[key] || simulatedResponses.chatgpt;
        const resp = responses[Math.floor(Math.random() * responses.length)];
        return {
          id: Date.now() + i,
          query: searchQuery,
          engine: eng,
          status: resp.status,
          position: resp.position,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          context: resp.context,
        };
      });

      setQueries(prev => [...newResults, ...prev]);
      setIsSimulating(false);
      setSearchQuery("");
      const mentioned = newResults.filter(r => r.status === "mentioned").length;
      toast({ title: "🎯 Simulation complete", description: `Found ${mentioned} mention(s) across ${engines.length} engine(s)` });
    }, 2500);
  };

  const filteredQueries = queries.filter(q => {
    if (filterEngine !== "all" && q.engine.toLowerCase().replace(" ", "") !== filterEngine) return false;
    return true;
  });

  const latestMention = queries.find(q => q.status !== "not_found");

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StarAgent mood={isScanning || isSimulating ? "scanning" : "happy"} size={48} animate={true} />
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Visibility Scan</h1>
            <p className="text-sm text-muted-foreground">Monitor how AI engines reference your business</p>
          </div>
        </div>
        <Button 
          onClick={runFullScan} 
          disabled={isScanning}
          className="gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow text-xs"
        >
          {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isScanning ? "Scanning..." : "Run New Scan"}
        </Button>
      </div>

      {/* Query Simulation */}
      <div className="card-reach">
        <h3 className="text-sm font-semibold text-foreground mb-1">Query Simulation</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Test how AI engines respond to queries about your industry</p>
        
        <div className="flex gap-3">
          <Input 
            placeholder="Enter a query to test..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && simulateQuery()}
            className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card flex-1" 
          />
          <Select value={selectedEngine} onValueChange={setSelectedEngine}>
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
          <Button 
            onClick={simulateQuery} 
            disabled={isSimulating}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          >
            {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin mr-1.5" /> : <Zap className="h-4 w-4 mr-1.5" />}
            {isSimulating ? "Simulating..." : "Simulate"}
          </Button>
        </div>
      </div>

      {/* Latest Result */}
      {latestMention && (
        <div className="card-reach">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Latest Result</h3>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {latestMention.date}
            </span>
          </div>
          
          <div className="bg-secondary/40 rounded-xl p-5 border border-border/40">
            <p className="text-xs font-medium text-foreground mb-2">Query: "{latestMention.query}"</p>
            <div className="bg-card rounded-xl p-4 border border-border/60">
              <p className="text-xs text-muted-foreground leading-relaxed">
                "{latestMention.context}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`status-badge ${latestMention.status === "mentioned" ? "status-strong" : "status-weak"}`}>
                <Eye className="h-3 w-3" /> {latestMention.status === "mentioned" ? `Mentioned #${latestMention.position}` : `Weak #${latestMention.position}`}
              </span>
              <Button 
                variant="ghost" size="sm" 
                onClick={() => {
                  toast({ title: "📸 Screenshot captured", description: "Proof screenshot saved to your gallery" });
                }}
                className="text-primary gap-1 h-7 text-xs"
              >
                <Camera className="h-3 w-3" /> Screenshot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Scan History ({filteredQueries.length})</h3>
          <Button 
            variant="outline" size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-1 h-8 rounded-xl text-xs ${showFilters ? "bg-primary/10 text-primary border-primary/30" : ""}`}
          >
            <Filter className="h-3 w-3" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-secondary/40 animate-fade-in">
            <span className="text-xs text-muted-foreground">Engine:</span>
            {["all", "chatgpt", "gemini", "perplexity"].map(eng => (
              <Button
                key={eng}
                variant={filterEngine === eng ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterEngine(eng)}
                className="h-7 px-3 rounded-lg text-[11px]"
              >
                {eng === "all" ? "All" : eng === "chatgpt" ? "ChatGPT" : eng === "gemini" ? "Gemini" : "Perplexity"}
              </Button>
            ))}
          </div>
        )}
        
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
              {filteredQueries.map((q) => (
                <TableRow key={q.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => q.context && setViewingProof(q)}>
                  <TableCell className="text-xs text-muted-foreground">{q.date}</TableCell>
                  <TableCell className="text-xs font-medium">{q.engine}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{q.query}</TableCell>
                  <TableCell>{statusBadge(q.status)}</TableCell>
                  <TableCell className="text-xs">{q.position ? `#${q.position}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    {q.status !== "not_found" && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setViewingProof(q); }} className="gap-1 text-primary text-xs h-7">
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

      {/* Proof Detail Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={() => setViewingProof(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-lg w-full mx-4 animate-scale-in shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">AI Response Proof</h3>
              <Button variant="ghost" size="sm" onClick={() => setViewingProof(null)} className="h-7 w-7 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Engine:</span>
                <span className="text-xs font-semibold text-foreground">{viewingProof.engine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Query:</span>
                <span className="text-xs text-foreground">"{viewingProof.query}"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                {statusBadge(viewingProof.status)}
                {viewingProof.position && <span className="text-xs text-muted-foreground">Position #{viewingProof.position}</span>}
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/40">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{viewingProof.context}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => {
                  navigator.clipboard.writeText(viewingProof.context || "");
                  toast({ title: "Copied!", description: "Response copied to clipboard" });
                }}>
                  <Camera className="h-3 w-3" /> Copy Response
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => {
                  toast({ title: "📸 Screenshot saved", description: "Proof added to your gallery" });
                }}>
                  <Camera className="h-3 w-3" /> Save Screenshot
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}