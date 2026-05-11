import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export function FilesPanel() {
  const { artifacts } = useWorkspace();
  if (artifacts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <FileText className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">No artifacts yet.</p>
        <p className="text-xs mt-1">Generated reports, sitemaps and JSON-LD will appear here.</p>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-2">
      {artifacts.map((a) => (
        <div key={a.id} className="card-reach flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-medium">{a.name}</div>
            <div className="text-[11px] text-muted-foreground">{a.mime}</div>
          </div>
          <Button asChild size="sm" variant="outline">
            <a href={a.content.startsWith("data:") ? a.content : `data:${a.mime};charset=utf-8,${encodeURIComponent(a.content)}`} download={a.name}>
              <Download className="h-3.5 w-3.5 mr-1" /> Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}
