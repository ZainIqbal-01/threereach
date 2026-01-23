import { Search, Filter, Download, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProofCard {
  id: string;
  engine: string;
  engineLogo: string;
  query: string;
  dateTime: string;
  screenshot: string;
  verified: boolean;
}

const proofs: ProofCard[] = [
  {
    id: "1",
    engine: "ChatGPT",
    engineLogo: "🤖",
    query: "Best fintech startups in Pakistan",
    dateTime: "Jan 22, 2026 • 14:32",
    screenshot: "/placeholder.svg",
    verified: true,
  },
  {
    id: "2",
    engine: "Gemini",
    engineLogo: "✨",
    query: "Payment processing solutions for startups",
    dateTime: "Jan 21, 2026 • 09:15",
    screenshot: "/placeholder.svg",
    verified: true,
  },
  {
    id: "3",
    engine: "Perplexity",
    engineLogo: "🔍",
    query: "Top B2B fintech companies",
    dateTime: "Jan 20, 2026 • 16:45",
    screenshot: "/placeholder.svg",
    verified: true,
  },
  {
    id: "4",
    engine: "ChatGPT",
    engineLogo: "🤖",
    query: "Recommended payment gateways Pakistan",
    dateTime: "Jan 18, 2026 • 11:20",
    screenshot: "/placeholder.svg",
    verified: true,
  },
  {
    id: "5",
    engine: "Gemini",
    engineLogo: "✨",
    query: "Digital banking solutions",
    dateTime: "Jan 15, 2026 • 08:55",
    screenshot: "/placeholder.svg",
    verified: true,
  },
  {
    id: "6",
    engine: "ChatGPT",
    engineLogo: "🤖",
    query: "SME financial technology providers",
    dateTime: "Jan 12, 2026 • 17:30",
    screenshot: "/placeholder.svg",
    verified: true,
  },
];

export default function ProofTracking() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Proof & Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Your verified AI mentions with screenshot evidence
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All Proofs
        </Button>
      </div>

      {/* Filters */}
      <div className="card-reach">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by query or keyword..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Proof Vault Grid */}
      <div className="grid grid-cols-3 gap-6">
        {proofs.map((proof) => (
          <div
            key={proof.id}
            className="card-reach overflow-hidden hover:shadow-card-hover transition-shadow group"
          >
            {/* Screenshot Preview */}
            <div className="relative aspect-video bg-muted -mx-6 -mt-6 mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
              <img
                src={proof.screenshot}
                alt="Screenshot proof"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-2xl">{proof.engineLogo}</span>
                <span className="px-2 py-1 rounded-md bg-background/90 text-xs font-medium text-navy">
                  {proof.engine}
                </span>
              </div>
              {proof.verified && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Full
              </Button>
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-medium text-navy line-clamp-2 mb-2">
                "{proof.query}"
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {proof.dateTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Proofs</Button>
      </div>
    </div>
  );
}
