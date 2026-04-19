import { Link, useLocation } from "react-router-dom";
import { useBusinessName } from "@/hooks/useBusinessName";
import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import {
  LayoutDashboard, Search, Brain, Building2, Share2, Shield, FileText,
  CreditCard, Settings, ChevronDown, Zap, Sparkles, Bot, BookOpen,
  Wrench, Wand2, Layers, Linkedin, TrendingUp,
} from "lucide-react";
import { StarAgent } from "@/components/StarAgent";
import { getAgentForRoute } from "@/components/agents/agentRegistry";
import logo from "@/assets/logo.png";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  level?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Command",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "GEO Playbook", href: "/dashboard/playbook", icon: BookOpen },
      { name: "Agent Command", href: "/dashboard/agents", icon: Bot },
    ],
  },
  {
    label: "L1 · Audit",
    items: [
      { name: "AI Brand Intelligence", href: "/dashboard/brand-intelligence", icon: Brain, level: 1 },
      { name: "AI Visibility Scan", href: "/dashboard/scan", icon: Search, level: 1 },
    ],
  },
  {
    label: "L2 · Foundations",
    items: [
      { name: "Technical Foundations", href: "/dashboard/foundations", icon: Wrench, level: 2 },
    ],
  },
  {
    label: "L3 · Optimise",
    items: [
      { name: "AEO Page Optimizer", href: "/dashboard/aeo-optimizer", icon: Wand2, level: 3 },
    ],
  },
  {
    label: "L4 · Authority",
    items: [
      { name: "Build AI Footprint", href: "/dashboard/footprint", icon: Building2, level: 4 },
    ],
  },
  {
    label: "L5 · Formats",
    items: [
      { name: "Content Studio", href: "/dashboard/content-studio", icon: Layers, level: 5 },
      { name: "Distribution", href: "/dashboard/distribution", icon: Share2, level: 5 },
    ],
  },
  {
    label: "L6 · Entity Signals",
    items: [
      { name: "LinkedIn Optimizer", href: "/dashboard/linkedin", icon: Linkedin, level: 6 },
    ],
  },
  {
    label: "L7 · Monitor & Scale",
    items: [
      { name: "Citations", href: "/dashboard/citations", icon: TrendingUp, level: 7 },
      { name: "Proof & Tracking", href: "/dashboard/proof", icon: Shield, level: 7 },
      { name: "Reports", href: "/dashboard/reports", icon: FileText, level: 7 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

const moodForRoute: Record<string, "happy" | "scanning" | "thinking" | "excited" | "superhero" | "waving"> = {
  "/dashboard": "happy",
  "/dashboard/brand-intelligence": "scanning",
  "/dashboard/scan": "scanning",
  "/dashboard/footprint": "thinking",
  "/dashboard/distribution": "excited",
  "/dashboard/proof": "superhero",
  "/dashboard/reports": "thinking",
  "/dashboard/playbook": "excited",
  "/dashboard/foundations": "thinking",
  "/dashboard/aeo-optimizer": "excited",
  "/dashboard/content-studio": "excited",
  "/dashboard/linkedin": "waving",
  "/dashboard/citations": "superhero",
};

interface AppSidebarProps { onNavigate?: () => void; }

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const location = useLocation();
  const businessName = useBusinessName();
  const { score, completedLevels, currentLevel } = useGEOMaturity();
  const initials = businessName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const currentAgent = getAgentForRoute(location.pathname);
  const currentMood = moodForRoute[location.pathname] || "happy";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center px-5 border-b border-sidebar-border shrink-0">
        <img src={logo} alt="Three Reach" className="h-11 w-auto" />
      </div>

      {/* Workspace */}
      <div className="px-3 py-3 shrink-0">
        <button className="flex w-full items-center justify-between rounded-xl bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--accent))] text-primary-foreground text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="text-left">
              <div className="font-medium text-sidebar-accent-foreground text-[13px]">{businessName}</div>
              <div className="text-[11px] text-sidebar-muted flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Pro Plan
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />
        </button>
      </div>

      {/* GEO Maturity Mini-Widget */}
      <Link to="/dashboard/playbook" onClick={onNavigate} className="mx-3 mb-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-2.5 hover:border-primary/50 transition-colors group">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-sidebar-foreground/80">GEO Maturity</span>
          <span className="text-[10px] font-bold text-sidebar-accent-foreground tabular-nums">{score}/100</span>
        </div>
        <div className="h-1 rounded-full bg-sidebar-accent overflow-hidden mb-1.5">
          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${score}%` }} />
        </div>
        <div className="flex items-center justify-between text-[9px] text-sidebar-muted">
          <span>L{currentLevel.number} · {currentLevel.title}</span>
          <span>{completedLevels}/7 done</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-semibold text-sidebar-muted uppercase tracking-widest px-3 mt-2 mb-1">{section.label}</p>
            {section.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium transition-all duration-200 group relative ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />}
                  <item.icon className={`h-[16px] w-[16px] transition-colors shrink-0 ${isActive ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
                  <span className="truncate">{item.name}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Star Agent */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-sidebar-accent/80 to-sidebar-accent/40 p-3 border border-sidebar-border/50">
          <div className="relative">
            <StarAgent mood={currentMood} size={38} animate={true} />
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-sidebar-accent border border-sidebar-border rounded-full w-4 h-4 flex items-center justify-center">
              {currentAgent.emoji}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-sidebar-accent-foreground flex items-center gap-1">
              {currentAgent.name} <Zap className="h-2.5 w-2.5 text-primary" />
            </p>
            <p className="text-[10px] text-sidebar-muted truncate">
              {currentAgent.statusMessages.idle}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
