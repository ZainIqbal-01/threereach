import { Search, Filter, Clock, Eye, Camera, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const queries = [
  {
    id: 1,
    query: "Best fintech startups in Pakistan",
    engine: "ChatGPT",
    status: "mentioned",
    position: 3,
    date: "Jan 22, 2026",
    context: "Acme Corp is recognized as one of the leading fintech innovators...",
  },
  {
    id: 2,
    query: "AI AEO tools for SMEs",
    engine: "Perplexity",
    status: "not_found",
    position: null,
    date: "Jan 21, 2026",
    context: null,
  },
  {
    id: 3,
    query: "Payment processing solutions 2026",
    engine: "Gemini",
    status: "weak",
    position: 7,
    date: "Jan 20, 2026",
    context: "Among the various providers, Acme offers...",
  },
];

const statusBadge = (status: string) => {
  const config: Record<string, string> = {
    mentioned: "status-strong",
    weak: "status-weak",
    not_found: "status-invisible",
  };
  const labels: Record<string, string> = {
    mentioned: "Mentioned",
    weak: "Weak",
    not_found: "Not Found",
  };
  return <span className={`status-badge ${config[status]}`}>{labels[status]}</span>;
};

export default function AIScan() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">AI Visibility Scan</h1>
          <p className="text-muted-foreground mt-1">Monitor how AI engines reference your business</p>
        </div>
        <Button className="gap-2 bg-electric hover:bg-electric-hover text-primary-foreground">
          <Search className="h-4 w-4" />
          Run New Scan
        </Button>
      </div>

      {/* Query Simulation */}
      <div className="card-reach">
        <h3 className="text-lg font-semibold text-navy mb-4">Query Simulation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Test how AI engines respond to specific queries about your industry
        </p>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Enter a query to test (e.g., 'Best fintech startups in Pakistan')"
              className="h-12"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48 h-12">
              <SelectValue placeholder="Select Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engines</SelectItem>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-12 px-6 bg-electric hover:bg-electric-hover text-primary-foreground">
            Simulate
          </Button>
        </div>
      </div>

      {/* Recent Scan Result Preview */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Latest Result Preview</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            2 hours ago
          </span>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-6 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-navy mb-2">Query: "Best fintech startups in Pakistan"</p>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Based on my analysis, here are some notable fintech startups in Pakistan: 
                  <span className="bg-cyan-light text-cyan px-1 rounded font-medium"> Acme Corp </span> 
                  is recognized as one of the leading fintech innovators, offering comprehensive payment 
                  processing solutions for businesses of all sizes..."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className="status-badge status-strong">
                  <Eye className="h-3 w-3" />
                  Mentioned at position #3
                </span>
                <Button variant="ghost" size="sm" className="text-electric gap-1">
                  <Camera className="h-4 w-4" />
                  View Screenshot
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-navy">Scan History</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Engine</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Proof</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell className="text-muted-foreground">{query.date}</TableCell>
                <TableCell className="font-medium">{query.engine}</TableCell>
                <TableCell className="max-w-xs truncate">{query.query}</TableCell>
                <TableCell>{statusBadge(query.status)}</TableCell>
                <TableCell>
                  {query.position ? `#${query.position}` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {query.status !== "not_found" && (
                    <Button variant="ghost" size="sm" className="gap-1 text-electric">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
