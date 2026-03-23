import { Bell, User, ChevronDown } from "lucide-react";

interface TopBarProps {
  workspaceName?: string;
  status?: "invisible" | "weak" | "visible" | "strong";
}

const statusConfig = {
  invisible: { label: "Invisible", className: "status-invisible" },
  weak: { label: "Weak", className: "status-weak" },
  visible: { label: "Visible", className: "status-visible" },
  strong: { label: "Strong", className: "status-strong" },
};

export function TopBar({ workspaceName = "Acme Corp", status = "weak" }: TopBarProps) {
  const statusInfo = statusConfig[status];

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-navy">{workspaceName}</h1>
          <span className={`status-badge ${statusInfo.className}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusInfo.label}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-electric" />
          </button>

          {/* User menu */}
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric text-primary-foreground text-sm font-medium">
              JD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium text-navy">John Doe</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
