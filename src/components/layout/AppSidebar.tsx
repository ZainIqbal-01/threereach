import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Brain,
  Building2,
  Share2,
  Shield,
  FileText,
  CreditCard,
  Settings,
  ChevronDown,
  Zap,
  Sparkles,
} from "lucide-react";
import { StarAgent } from "@/components/StarAgent";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Brand Intelligence", href: "/dashboard/brand-intelligence", icon: Brain },
  { name: "AI Visibility Scan", href: "/dashboard/scan", icon: Search },
  { name: "Build AI Footprint", href: "/dashboard/footprint", icon: Building2 },
  { name: "Distribution", href: "/dashboard/distribution", icon: Share2 },
  { name: "Proof & Tracking", href: "/dashboard/proof", icon: Shield },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const moodForRoute: Record<string, "happy" | "scanning" | "thinking" | "excited" | "superhero" | "waving"> = {
  "/dashboard": "happy",
  "/dashboard/brand-intelligence": "scanning",
  "/dashboard/scan": "scanning",
  "/dashboard/footprint": "thinking",
  "/dashboard/distribution": "excited",
  "/dashboard/proof": "superhero",
  "/dashboard/reports": "thinking",
};

export function AppSidebar() {
  const location = useLocation();
  const currentMood = moodForRoute[location.pathname] || "happy";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center px-5 border-b border-sidebar-border shrink-0">
        <img src={logo} alt="Three Reach" className="h-11 w-auto" />
      </div>

      {/* Workspace Selector */}
      <div className="px-3 py-3 shrink-0">
        <button className="flex w-full items-center justify-between rounded-xl bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--accent))] text-primary-foreground text-xs font-bold shadow-sm">
              AC
            </div>
            <div className="text-left">
              <div className="font-medium text-sidebar-accent-foreground text-[13px]">Acme Corp</div>
              <div className="text-[11px] text-sidebar-muted flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Pro Plan
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-widest px-3 mb-2">Platform</p>
        {navigation.slice(0, 6).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <item.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              )}
            </Link>
          );
        })}

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-widest px-3 mb-2">Account</p>
        </div>
        {navigation.slice(6).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <item.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Star Agent Companion */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-sidebar-accent/80 to-sidebar-accent/40 p-3 border border-sidebar-border/50">
          <StarAgent mood={currentMood} size={38} animate={true} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-sidebar-accent-foreground flex items-center gap-1">
              Star Agent <Zap className="h-2.5 w-2.5 text-primary" />
            </p>
            <p className="text-[10px] text-sidebar-muted truncate">
              {currentMood === "scanning" ? "Analyzing data..." : currentMood === "excited" ? "Content mode! 🔥" : currentMood === "superhero" ? "Protecting proofs!" : "Ready to help ✨"}
            </p>
          </div>
        </div>
        <p className="text-[9px] text-sidebar-muted/60 text-center mt-2.5 leading-relaxed px-2">
          We build a dedicated website with regularly updated content to keep AI informed.
        </p>
      </div>
    </aside>
  );
}
