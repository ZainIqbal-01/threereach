import { LayoutGrid, Search, Sparkles, GitPullRequest, Megaphone, Bot, FileBarChart2, Settings as SettingsIcon, ShieldCheck, Footprints, CreditCard, Sun, Moon } from "lucide-react";
import { useWorkspace, WorkspaceModule } from "@/hooks/useWorkspace";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const ITEMS: { id: WorkspaceModule; icon: any; label: string }[] = [
  { id: "overview", icon: LayoutGrid, label: "Overview" },
  { id: "scan", icon: Search, label: "AI Scan" },
  { id: "brand", icon: Sparkles, label: "Brand Intel" },
  { id: "optimize", icon: GitPullRequest, label: "Optimize Code" },
  { id: "distribution", icon: Megaphone, label: "Distribution" },
  { id: "agents", icon: Bot, label: "Agents" },
  { id: "footprint", icon: Footprints, label: "Footprint" },
  { id: "proof", icon: ShieldCheck, label: "Proof" },
  { id: "reports", icon: FileBarChart2, label: "Reports" },
  { id: "billing", icon: CreditCard, label: "Billing" },
  { id: "settings", icon: SettingsIcon, label: "Settings" },
];

export function ModuleRail() {
  const { module, setModule, setTab } = useWorkspace();
  const { dark, toggle } = useTheme();
  return (
    <div className="h-full w-14 bg-sidebar text-sidebar-foreground flex flex-col items-center py-3 gap-1 border-r border-sidebar-border">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mb-2">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = module === item.id;
        return (
          <button
            key={item.id}
            title={item.label}
            onClick={() => { setModule(item.id); setTab("preview"); }}
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center transition-all relative group",
              active
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="absolute left-12 px-2 py-1 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {item.label}
            </span>
          </button>
        );
      })}
      <div className="flex-1" />
      <button
        onClick={toggle}
        className="h-9 w-9 rounded-xl flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        title="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
