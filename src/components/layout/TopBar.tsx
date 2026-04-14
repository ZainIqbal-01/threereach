import { useState, useRef, useEffect } from "react";
import { Bell, User, ChevronDown, Activity, Settings, LogOut, CreditCard, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TopBarProps {
  workspaceName?: string;
  status?: "invisible" | "weak" | "visible" | "strong";
}

const statusConfig = {
  invisible: { label: "Invisible", className: "status-invisible", dot: "bg-destructive" },
  weak: { label: "Weak", className: "status-weak", dot: "bg-warning" },
  visible: { label: "Visible", className: "status-visible", dot: "bg-primary" },
  strong: { label: "Strong", className: "status-strong", dot: "bg-success" },
};

const notifications = [
  { id: 1, text: "ChatGPT mentioned your brand", time: "2h ago", read: false },
  { id: 2, text: "Reddit post got 45 upvotes", time: "5h ago", read: false },
  { id: 3, text: "Visibility score increased +4", time: "1d ago", read: true },
  { id: 4, text: "Weekly report is ready", time: "2d ago", read: true },
];

export function TopBar({ workspaceName = "Acme Corp", status = "weak" }: TopBarProps) {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const logout = () => {
    localStorage.removeItem("onboardingComplete");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-14 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold text-foreground">{workspaceName}</h1>
          <span className={`status-badge ${statusInfo.className}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} pulse-dot`} />
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card text-[7px] text-primary-foreground flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-10 w-72 bg-card rounded-xl border border-border/60 shadow-lg animate-scale-in z-50">
                <div className="flex items-center justify-between p-3 border-b border-border/40">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.map(n => (
                    <div key={n.id} className={`p-3 hover:bg-secondary/50 cursor-pointer transition-colors border-b border-border/20 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <p className="text-xs text-foreground">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
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
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-secondary transition-all"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                JD
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium text-foreground">John Doe</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 w-48 bg-card rounded-xl border border-border/60 shadow-lg animate-scale-in z-50">
                <div className="p-2">
                  <Link to="/dashboard/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/70 transition-colors">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">Settings</span>
                  </Link>
                  <Link to="/dashboard/billing" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/70 transition-colors">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">Billing</span>
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 p-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left">
                    <LogOut className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs text-destructive">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}