import { useWorkspace } from "@/hooks/useWorkspace";
import { Eye, Code2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewRouter } from "./PreviewRouter";
import { CodeDiffViewer } from "./CodeDiffViewer";
import { FilesPanel } from "./FilesPanel";

const TABS = [
  { id: "preview" as const, label: "Preview", icon: Eye },
  { id: "code" as const, label: "Code", icon: Code2 },
  { id: "files" as const, label: "Files", icon: FileText },
];

export function WorkspaceTabs() {
  const { tab, setTab, module } = useWorkspace();
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/60 bg-card/40 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
        <div className="ml-auto text-[11px] text-muted-foreground capitalize">
          {module}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "preview" && <PreviewRouter />}
        {tab === "code" && <CodeDiffViewer />}
        {tab === "files" && <FilesPanel />}
      </div>
    </div>
  );
}
