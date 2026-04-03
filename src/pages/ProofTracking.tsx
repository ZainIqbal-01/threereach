import { Search, Filter, Download, CheckCircle2, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarAgent } from "@/components/StarAgent";

const proofs = [
  { id: "1", engine: "ChatGPT", engineIcon: "🤖", query: "Best fintech startups in Pakistan", dateTime: "Jan 22, 2026 • 14:32", verified: true },
  { id: "2", engine: "Gemini", engineIcon: "✨", query: "Payment processing solutions for startups", dateTime: "Jan 21, 2026 • 09:15", verified: true },
  { id: "3", engine: "Perplexity", engineIcon: "🔍", query: "Top B2B fintech companies", dateTime: "Jan 20, 2026 • 16:45", verified: true },
  { id: "4", engine: "ChatGPT", engineIcon: "🤖", query: "Recommended payment gateways Pakistan", dateTime: "Jan 18, 2026 • 11:20", verified: true },
  { id: "5", engine: "Gemini", engineIcon: "✨", query: "Digital banking solutions", dateTime: "Jan 15, 2026 • 08:55", verified: true },
  { id: "6", engine: "ChatGPT", engineIcon: "🤖", query: "SME financial technology providers", dateTime: "Jan 12, 2026 • 17:30", verified: true },
];

export default function ProofTracking() {
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StarAgent mood="superhero" size={48} animate={true} />
          <div>
            <h1 className="text-xl font-bold text-foreground">Proof & Tracking</h1>
            <p className="text-sm text-muted-foreground">Verified AI mentions with evidence</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl h-9 text-xs">
          <Download className="h-3.5 w-3.5" /> Export All
        </Button>
      </div>

      {/* Filters */}
      <div className="card-reach py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by query..." className="pl-9 h-9 rounded-xl border-border/60 text-xs" />
          </div>
          <Select defaultValue="all">
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
          <Select defaultValue="all">
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
      <div className="grid grid-cols-3 gap-4">
        {proofs.map((proof) => (
          <div key={proof.id} className="card-reach overflow-hidden group p-0">
            {/* Screenshot placeholder */}
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
                className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-[10px] rounded-lg gap-1">
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

      <div className="text-center">
        <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">Load More</Button>
      </div>
    </div>
  );
}
