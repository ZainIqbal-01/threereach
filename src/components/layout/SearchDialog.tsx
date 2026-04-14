import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, Brain, ScanSearch, Building2, Share2, Shield, FileText, CreditCard, Settings } from "lucide-react";

const pages = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, keywords: "home command center dashboard" },
  { name: "AI Brand Intelligence", href: "/dashboard/brand-intelligence", icon: Brain, keywords: "brand scan intelligence analyze" },
  { name: "AI Visibility Scan", href: "/dashboard/scan", icon: ScanSearch, keywords: "scan visibility check" },
  { name: "Build AI Footprint", href: "/dashboard/footprint", icon: Building2, keywords: "footprint content build pages" },
  { name: "Distribution Engine", href: "/dashboard/distribution", icon: Share2, keywords: "distribute share social media" },
  { name: "Proof & Tracking", href: "/dashboard/proof", icon: Shield, keywords: "proof tracking mentions citations" },
  { name: "Reports", href: "/dashboard/reports", icon: FileText, keywords: "report export pdf analytics" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, keywords: "billing plan subscription payment" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, keywords: "settings profile team api security" },
];

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filtered = pages.filter(p =>
    `${p.name} ${p.keywords}`.toLowerCase().includes(query.toLowerCase())
  );

  const go = useCallback((href: string) => {
    navigate(href);
    onClose();
    setQuery("");
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        go(filtered[selectedIndex].href);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, go, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-lg mx-4 bg-card border border-border/60 rounded-2xl shadow-lg animate-scale-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border/60 font-mono text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No results found</p>
          ) : (
            filtered.map((page, i) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.href}
                  onClick={() => go(page.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors ${
                    i === selectedIndex ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/70"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{page.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
