import { Bell, User, ChevronDown, Activity } from "lucide-react";

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

export function TopBar({ workspaceName = "Acme Corp", status = "weak" }: TopBarProps) {
  const statusInfo = statusConfig[status];

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
          <button className="relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </button>

          <button className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-secondary transition-all">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              JD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-foreground">John Doe</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
