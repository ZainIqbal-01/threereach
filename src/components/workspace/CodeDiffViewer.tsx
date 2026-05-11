import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { File, GitPullRequest, ExternalLink, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CodeDiffViewer() {
  const { diff } = useWorkspace();
  const [active, setActive] = useState(0);

  if (!diff) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <Code2 className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">No code changes yet.</p>
        <p className="text-xs mt-1">Ask Reach to "optimize my site" to generate a pull request.</p>
      </div>
    );
  }

  const file = diff.files[active];

  return (
    <div className="h-full flex flex-col">
      {diff.pr_url && (
        <div className="flex items-center gap-3 p-3 border-b border-border/60 bg-card/40">
          <GitPullRequest className="h-4 w-4 text-success" />
          <div className="text-xs">
            <div className="font-medium">PR #{diff.pr_number} opened</div>
            {diff.summary && <div className="text-muted-foreground line-clamp-1">{diff.summary}</div>}
          </div>
          <Button asChild size="sm" variant="outline" className="ml-auto h-7 text-xs">
            <a href={diff.pr_url} target="_blank" rel="noreferrer">
              Open on GitHub <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-border/60 bg-card/20 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-2">
            Files changed ({diff.files.length})
          </div>
          {diff.files.map((f, i) => (
            <button key={f.path} onClick={() => setActive(i)}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs",
                active === i ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-foreground hover:bg-secondary"
              )}>
              <File className="h-3 w-3 flex-shrink-0" />
              <span className="truncate font-mono">{f.path}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto bg-[hsl(var(--secondary))]">
          {file && (
            <pre className="text-xs font-mono p-4 leading-relaxed whitespace-pre-wrap">
              {file.patch.split("\n").map((line, i) => {
                const isAdd = line.startsWith("+");
                const isDel = line.startsWith("-");
                return (
                  <div key={i} className={cn(
                    "px-2 -mx-2",
                    isAdd && "bg-success/10 text-success",
                    isDel && "bg-destructive/10 text-destructive",
                  )}>
                    {line}
                  </div>
                );
              })}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
