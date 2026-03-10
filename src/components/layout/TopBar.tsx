import { Bell, User, ChevronDown, Flame, Star } from "lucide-react";

interface TopBarProps {
  workspaceName?: string;
  status?: "invisible" | "weak" | "visible" | "strong";
}

const statusConfig = {
  invisible: { label: "Invisible 😰", className: "status-invisible" },
  weak: { label: "Weak 😐", className: "status-weak" },
  visible: { label: "Visible 😊", className: "status-visible" },
  strong: { label: "Strong 🔥", className: "status-strong" },
};

export function TopBar({ workspaceName = "Acme Corp", status = "weak" }: TopBarProps) {
  const statusInfo = statusConfig[status];
  const profile = JSON.parse(localStorage.getItem("businessProfile") || "{}");
  const displayName = profile.businessName || workspaceName;

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b-2 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-foreground">{displayName}</h1>
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-danger border-2 border-card" />
          </button>

          <button className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-muted transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric text-primary-foreground text-sm font-black">
              JD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-bold text-foreground">John Doe</div>
              <div className="text-[10px] font-bold text-muted-foreground">Admin</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
