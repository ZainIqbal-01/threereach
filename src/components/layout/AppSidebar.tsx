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
} from "lucide-react";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "AI Visibility Scan", href: "/scan", icon: Search },
  { name: "Build AI Footprint", href: "/footprint", icon: Building2 },
  { name: "Distribution", href: "/distribution", icon: Share2 },
  { name: "Proof & Tracking", href: "/proof", icon: Shield },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center px-4 border-b border-sidebar-border">
          <img src={logo} alt="Three Reach" className="h-12 w-auto" />
        </div>

        {/* Workspace Switcher */}
        <div className="px-4 py-4">
          <button className="flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric text-sidebar-primary-foreground text-xs font-semibold">
                AC
              </div>
              <div className="text-left">
                <div className="font-medium text-sidebar-accent-foreground">Acme Corp</div>
                <div className="text-xs text-sidebar-muted">Pro Plan</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-4">
            <p className="text-xs text-sidebar-muted leading-relaxed">
              We build a dedicated website with regularly updated content to keep AI informed.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
