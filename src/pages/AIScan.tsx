import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, Clock, Eye, Camera, ExternalLink, Filter, Zap, RefreshCw, RotateCcw, X, ChevronDown, Sparkles, GitPullRequest } from "lucide-react";
import { getEngineLogo } from "@/components/ui/ai-engine-logos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { agents } from "@/components/agents/agentRegistry";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessName } from "@/hooks/useBusinessName";

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
  { id: 1, query: "Best fintech startups in Pakistan", engine: "ChatGPT", status: "mentioned", position: 3, date: "Jan 22, 2026", context: "This brand is recognized as one of the leading fintech innovators in Pakistan, offering comprehensive payment processing and digital banking solutions for SMEs..." },
  { id: 2, query: "AI AEO tools for SMEs", engine: "Perplexity", status: "not_found", position: null, date: "Jan 21, 2026", context: null },
  { id: 3, query: "Payment processing solutions 2026", engine: "Gemini", status: "weak", position: 7, date: "Jan 20, 2026", context: "Among the various providers, this company offers some notable solutions in the payment space, though there are stronger alternatives available..." },
  { id: 4, query: "B2B fintech companies", engine: "ChatGPT", status: "mentioned", position: 2, date: "Jan 19, 2026", context: "Top recommendations include this brand for B2B payment processing, known for their developer-friendly APIs and transparent pricing model..." },
];

const statusBadge = (status: string) => {
  const config: Record<string, string> = { mentioned: "status-strong", weak: "status-weak", not_found: "status-invisible" };
  const labels: Record<string, string> = { mentioned: "Mentioned", weak: "Weak", not_found: "Not Found" };
  return <span className={`status-badge ${config[status]}`}>{labels[status]}</span>;
};

export default function AIScan() {
  const businessName = useBusinessName();
  const [queries, setQueries] = useState<QueryResult[]>(initialQueries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [viewingProof, setViewingProof] = useState<QueryResult | null>(null);
  const [filterEngine, setFilterEngine] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [engineErrors, setEngineErrors] = useState<{ engine: string; message: string }[]>([]);
  // Track active toast id to prevent duplicate destructive toasts on rapid retries
  const lastErrorToastRef = useRef<{ key: string; at: number } | null>(null);

  const showErrorToast = (title: string, description: string) => {
    const key = `${title}::${description}`;
    const now = Date.now();
    if (lastErrorToastRef.current && lastErrorToastRef.current.key === key && now - lastErrorToastRef.current.at < 1500) {
      return;
    }
    lastErrorToastRef.current = { key, at: now };
    toast({ title, description, variant: "destructive" });
  };

  const runFullScan = async () => {
    setIsScanning(true);
    setScanError(null);
    setEngineErrors([]);
    toast({ title: "🔍 Full scan initiated", description: "AI is scanning all engines for brand mentions..." });
    try {
      const { data, error } = await supabase.functions.invoke("ai-scan", {
        body: { query: "Top companies in our industry", brandName: businessName, engines: ["ChatGPT", "Gemini", "Perplexity"] },
      });
      if (error) throw error;
      const rawResults: any[] = data?.results || [];
      const failed = rawResults.filter((r) => r.error || r.status === "error");
      const ok = rawResults.filter((r) => !r.error && r.status !== "error");
      if (failed.length) {
        setEngineErrors(failed.map((r) => ({ engine: r.engine || "Unknown", message: r.error || "Engine failed" })));
      }
      const newQueries: QueryResult[] = ok.map((r: any, i: number) => ({
        id: Date.now() + i, query: "Full scan — industry visibility check", engine: r.engine,
        status: r.status, position: r.position || null,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        context: r.context,
      }));
      setQueries(prev => [...newQueries, ...prev]);
      const mentioned = newQueries.filter((r: QueryResult) => r.status === "mentioned").length;
      toast({
        title: failed.length ? "⚠️ Scan completed with errors" : "✅ Scan complete!",
        description: failed.length
          ? `${ok.length} engine(s) succeeded, ${failed.length} failed`
          : `Found ${mentioned} mention(s) across ${newQueries.length} engines`,
      });
    } catch (err: any) {
      console.error("Scan error:", err);
      const message = err?.message || "Could not complete scan";
      setScanError(message);
      showErrorToast("Scan failed", message);
    } finally {
      setIsScanning(false);
    }
  };

  const simulateQuery = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Enter a query", description: "Type a search query to simulate", variant: "destructive" });
      return;
    }
    setIsSimulating(true);
    const engines = selectedEngine === "all" ? ["ChatGPT", "Gemini", "Perplexity"] : [selectedEngine === "chatgpt" ? "ChatGPT" : selectedEngine === "gemini" ? "Gemini" : "Perplexity"];
    try {
      const { data, error } = await supabase.functions.invoke("ai-scan", {
        body: { query: searchQuery, brandName: businessName, engines },
      });
      if (error) throw error;
      const newResults: QueryResult[] = (data.results || []).map((r: any, i: number) => ({
        id: Date.now() + i, query: searchQuery, engine: r.engine,
        status: r.status, position: r.position || null,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        context: r.context,
      }));
      setQueries(prev => [...newResults, ...prev]);
      setSearchQuery("");
      const mentioned = newResults.filter((r: QueryResult) => r.status === "mentioned").length;
      toast({ title: "🎯 AI Simulation complete", description: `Found ${mentioned} mention(s) across ${engines.length} engine(s)` });
    } catch (err: any) {
      console.error("Simulation error:", err);
      toast({ title: "Simulation failed", description: err?.message || "Could not simulate query", variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredQueries = queries.filter(q => {
    if (filterEngine !== "all" && q.engine.toLowerCase().replace(" ", "") !== filterEngine) return false;
    return true;
  });

  const latestMention = queries.find(q => q.status !== "not_found");

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <AgentBadge agent={agents.scout} isWorking={isScanning || isSimulating} size={40} />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">AI Visibility Scan</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Scout monitors how AI engines reference your business</p>
          </div>
        </div>
        <Button 
          onClick={runFullScan} 
          disabled={isScanning}
          className="gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow text-xs w-full sm:w-auto"
        >
          {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isScanning ? "Scanning..." : "Run New Scan"}
        </Button>
      </div>

      {/* In-page progress banner while scanning */}
      {isScanning && (
        <div role="status" aria-live="polite" data-testid="scan-progress" className="card-reach flex items-center gap-3 border-primary/30 bg-primary/5">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">Scanning AI engines…</p>
            <p className="text-[11px] text-muted-foreground">Querying ChatGPT, Gemini, and Perplexity in parallel</p>
          </div>
        </div>
      )}

      {/* Error banner with Retry */}
      {scanError && !isScanning && (
        <div role="alert" data-testid="scan-error" className="card-reach flex items-start gap-3 border-destructive/40 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Scan failed</p>
            <p className="text-[11px] text-muted-foreground break-words">{scanError}</p>
          </div>
          <Button onClick={runFullScan} size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5">
            <RotateCcw className="h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      {/* Per-engine partial errors */}
      {engineErrors.length > 0 && !isScanning && (
        <div role="alert" data-testid="engine-errors" className="card-reach border-warning/40 bg-warning/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs font-semibold text-foreground">Partial results — {engineErrors.length} engine(s) failed</p>
            </div>
            <Button onClick={runFullScan} size="sm" variant="outline" className="h-7 rounded-lg text-[11px] gap-1.5">
              <RotateCcw className="h-3 w-3" /> Retry
            </Button>
          </div>
          <ul className="space-y-1 mt-2">
            {engineErrors.map((e) => (
              <li key={e.engine} className="text-[11px] text-muted-foreground flex items-center gap-2">
                {getEngineLogo(e.engine, "h-3 w-3")}
                <span className="font-medium text-foreground">{e.engine}:</span>
                <span>{e.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Query Simulation */}
      <div className="card-reach">
        <h3 className="text-sm font-semibold text-foreground mb-1">Query Simulation</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Test how AI engines respond to queries about your industry</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="Enter a query to test..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && simulateQuery()}
            className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card flex-1" 
          />
          <div className="flex gap-3">
            <Select value={selectedEngine} onValueChange={setSelectedEngine}>
              <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl border-border/60">
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
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs whitespace-nowrap"
            >
              {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin mr-1.5" /> : <Zap className="h-4 w-4 mr-1.5" />}
              {isSimulating ? "Simulating..." : "Simulate"}
            </Button>
          </div>
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
          <div className="bg-secondary/40 rounded-xl p-4 md:p-5 border border-border/40">
            <p className="text-xs font-medium text-foreground mb-2">Query: "{latestMention.query}"</p>
            <div className="bg-card rounded-xl p-3 md:p-4 border border-border/60">
              <p className="text-xs text-muted-foreground leading-relaxed">"{latestMention.context}"</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`status-badge ${latestMention.status === "mentioned" ? "status-strong" : "status-weak"}`}>
                <Eye className="h-3 w-3" /> {latestMention.status === "mentioned" ? `Mentioned #${latestMention.position}` : `Weak #${latestMention.position}`}
              </span>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "📸 Screenshot captured" })} className="text-primary gap-1 h-7 text-xs">
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
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}
            className={`gap-1 h-8 rounded-xl text-xs ${showFilters ? "bg-primary/10 text-primary border-primary/30" : ""}`}>
            <Filter className="h-3 w-3" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-secondary/40 animate-fade-in">
            <span className="text-xs text-muted-foreground">Engine:</span>
            {["all", "chatgpt", "gemini", "perplexity"].map(eng => (
              <Button key={eng} variant={filterEngine === eng ? "default" : "outline"} size="sm"
                onClick={() => setFilterEngine(eng)} className="h-7 px-3 rounded-lg text-[11px]">
                {eng === "all" ? "All" : eng === "chatgpt" ? "ChatGPT" : eng === "gemini" ? "Gemini" : "Perplexity"}
              </Button>
            ))}
          </div>
        )}
        
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Engine</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider hidden sm:table-cell">Query</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider hidden md:table-cell">Position</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wider">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueries.map((q) => (
                <TableRow key={q.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => q.context && setViewingProof(q)}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{q.date}</TableCell>
                  <TableCell className="text-xs font-medium"><div className="flex items-center gap-1.5">{getEngineLogo(q.engine, "h-3.5 w-3.5")}{q.engine}</div></TableCell>
                  <TableCell className="text-xs max-w-xs truncate hidden sm:table-cell">{q.query}</TableCell>
                  <TableCell>{statusBadge(q.status)}</TableCell>
                  <TableCell className="text-xs hidden md:table-cell">{q.position ? `#${q.position}` : "—"}</TableCell>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4" onClick={() => setViewingProof(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 max-w-lg w-full animate-scale-in shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">AI Response Proof</h3>
              <Button variant="ghost" size="sm" onClick={() => setViewingProof(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                {statusBadge(viewingProof.status)}
                {viewingProof.position && <span className="text-xs text-muted-foreground">Position #{viewingProof.position}</span>}
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/40">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{viewingProof.context}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => {
                  navigator.clipboard.writeText(viewingProof.context || "");
                  toast({ title: "Copied!" });
                }}>
                  <Camera className="h-3 w-3" /> Copy Response
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs gap-1" onClick={() => toast({ title: "📸 Screenshot saved" })}>
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
