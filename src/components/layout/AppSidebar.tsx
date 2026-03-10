import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Building2,
  Share2,
  Shield,
  FileText,
  CreditCard,
  Settings,
  ChevronDown,
  Flame,
  Trophy,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, emoji: "🏠" },
  { name: "AI Scan", href: "/dashboard/scan", icon: Search, emoji: "🔍" },
  { name: "Build Footprint", href: "/dashboard/footprint", icon: Building2, emoji: "🏗️" },
  { name: "Distribution", href: "/dashboard/distribution", icon: Share2, emoji: "📡" },
  { name: "Proof & Tracking", href: "/dashboard/proof", icon: Shield, emoji: "🛡️" },
  { name: "Reports", href: "/dashboard/reports", icon: FileText, emoji: "📊" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, emoji: "💳" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, emoji: "⚙️" },
];

export function AppSidebar() {
  const location = useLocation();

  const handleResetOnboarding = () => {
    localStorage.removeItem("onboardingComplete");
    localStorage.removeItem("businessProfile");
    window.location.href = "/";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center px-4 border-b border-sidebar-border">
          <img src={logo} alt="Three Reach" className="h-14 w-auto" />
        </div>

        {/* Gamification stats */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-warning/20 text-warning text-xs font-bold">
              <Flame className="h-3.5 w-3.5" /> 3
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-purple/20 text-purple-light text-xs font-bold">
              <Trophy className="h-3.5 w-3.5" /> Lvl 2
            </div>
            <div className="px-2.5 py-1.5 rounded-full bg-gold/20 text-gold-light text-xs font-bold">
              420 XP
            </div>
          </div>
          {/* XP Progress to next level */}
          <div className="mt-2">
            <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-electric to-cyan" />
            </div>
            <p className="text-[10px] text-sidebar-muted mt-1 font-semibold">420/1000 XP to Level 3</p>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="px-4 py-3">
          <button className="flex w-full items-center justify-between rounded-2xl bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric text-sidebar-primary-foreground text-xs font-bold">
                AC
              </div>
              <div className="text-left">
                <div className="font-bold text-sidebar-accent-foreground text-xs">Acme Corp</div>
                <div className="text-[10px] text-sidebar-muted font-semibold">Pro Plan</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-fun"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <div className="rounded-2xl bg-sidebar-accent/50 p-3">
            <p className="text-[11px] text-sidebar-muted leading-relaxed font-semibold">
              🤖 Complete daily missions to level up and unlock features!
            </p>
          </div>
          <button
            onClick={handleResetOnboarding}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-sidebar-muted hover:text-danger hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Re-analyze Website
          </button>
        </div>
      </div>
    </aside>
  );
}
