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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center px-5 border-b border-sidebar-border">
          <img src={logo} alt="Three Reach" className="h-12 w-auto" />
        </div>

        {/* Workspace */}
        <div className="px-3 py-3">
          <button className="flex w-full items-center justify-between rounded-xl bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                AC
              </div>
              <div className="text-left">
                <div className="font-medium text-sidebar-accent-foreground text-sm">Acme Corp</div>
                <div className="text-[11px] text-sidebar-muted">Pro Plan</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Star Agent Companion */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
            <StarAgent mood={currentMood} size={36} animate={true} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-sidebar-accent-foreground">Star Agent</p>
              <p className="text-[10px] text-sidebar-muted truncate">
                {currentMood === "scanning" ? "Analyzing..." : currentMood === "excited" ? "Let's distribute!" : "Ready to help"}
              </p>
            </div>
            <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
          </div>
        </div>
      </div>
    </aside>
  );
}
