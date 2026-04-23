import { useState, useRef, useEffect } from "react";
import { Bell, User, ChevronDown, Settings, LogOut, CreditCard, X, Search, Menu, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useBusinessName } from "@/hooks/useBusinessName";
import { SearchDialog } from "./SearchDialog";
import { RedditLogo } from "@/components/ui/platform-logos";

interface TopBarProps {
  workspaceName?: string;
  status?: "invisible" | "weak" | "visible" | "strong";
  onMenuClick?: () => void;
}

const statusConfig = {
  invisible: { label: "Invisible", className: "status-invisible", dot: "bg-destructive" },
  weak: { label: "Weak", className: "status-weak", dot: "bg-warning" },
  visible: { label: "Visible", className: "status-visible", dot: "bg-primary" },
  strong: { label: "Strong", className: "status-strong", dot: "bg-success" },
};

const notifications = [
  { id: 1, text: "ChatGPT mentioned your brand in fintech query", time: "2h ago", read: false, icon: "🤖" as const },
  { id: 2, text: "Reddit post got 45 upvotes", time: "5h ago", read: false, icon: "reddit" as const },
  { id: 3, text: "Visibility score increased +4", time: "1d ago", read: true, icon: "📊" as const },
  { id: 4, text: "Weekly report is ready", time: "2d ago", read: true, icon: "📄" as const },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Command Center",
  "/dashboard/brand-intelligence": "AI Brand Intelligence",
  "/dashboard/scan": "AI Visibility Scan",
  "/dashboard/footprint": "Build AI Footprint",
  "/dashboard/distribution": "Distribution Engine",
  "/dashboard/proof": "Proof & Tracking",
  "/dashboard/reports": "Reports",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
};

export function TopBar({ status = "weak", onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const workspaceName = useBusinessName();
  const { dark, toggle } = useTheme();
  const statusInfo = statusConfig[status];
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const logout = () => {
    localStorage.removeItem("onboardingComplete");
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-14 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-3 md:px-6">
          {/* Left: Menu + Page context */}
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-none">{pageTitle}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">{workspaceName}</span>
                <span className="text-border hidden sm:inline">·</span>
                <span className={`status-badge ${statusInfo.className} !py-0.5 !px-2 !text-[10px]`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} pulse-dot`} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 text-muted-foreground text-xs hover:bg-secondary transition-colors"
            >
              <Search className="h-3 w-3" />
              <span>Search</span>
              <kbd className="ml-2 text-[10px] bg-card px-1.5 py-0.5 rounded border border-border/60 font-mono">⌘K</kbd>
            </button>

            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-11 w-72 sm:w-80 bg-card rounded-2xl border border-border/60 shadow-lg animate-scale-in z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] text-primary hover:underline font-medium">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 p-3.5 hover:bg-secondary/50 cursor-pointer transition-colors border-b border-border/20 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}
                        onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      >
                        <span className="text-base mt-0.5 shrink-0">
                          {n.icon === "reddit" ? <RedditLogo className="h-4 w-4" style={{ color: "#FF4500" }} /> : n.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-snug">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                        </div>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-secondary transition-all group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--accent))] text-primary-foreground text-xs font-bold shadow-sm">
                  JD
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-foreground leading-none">John Doe</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Admin</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-11 w-52 bg-card rounded-2xl border border-border/60 shadow-lg animate-scale-in z-50 overflow-hidden">
                  <div className="p-2">
                    <Link to="/dashboard/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">Settings</span>
                    </Link>
                    <Link to="/dashboard/billing" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">Billing</span>
                    </Link>
                    <div className="border-t border-border/40 my-1" />
                    <button onClick={logout} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-destructive/10 transition-colors w-full text-left">
                      <LogOut className="h-4 w-4 text-destructive" />
                      <span className="text-xs font-medium text-destructive">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
