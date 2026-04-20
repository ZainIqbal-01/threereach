import { useEffect, useState } from "react";
import { AlertCircle, Sparkles, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { EnrichmentDialog } from "./EnrichmentDialog";

const DISMISS_HOURS = 24;

export function EnrichmentBanner() {
  const { profile, missing, dismissEnrichment } = useBusinessProfile();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (missing.length === 0) {
      setVisible(false);
      return;
    }
    const dismissed = profile.enrichmentDismissedAt;
    if (dismissed) {
      const hoursSince = (Date.now() - new Date(dismissed).getTime()) / 36e5;
      if (hoursSince < DISMISS_HOURS) {
        setVisible(false);
        return;
      }
    }
    // Brief delay so it animates in after the page paints
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [missing.length, profile.enrichmentDismissedAt]);

  if (!visible || missing.length === 0) return null;

  const preview = missing.slice(0, 3).join(", ");
  const more = missing.length > 3 ? ` +${missing.length - 3} more` : "";

  return (
    <>
      <div
        role="status"
        className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-md animate-slide-up"
        style={{ animationFillMode: "both" }}
      >
        <div className="rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Boost your AI visibility accuracy
                  </p>
                  <button
                    onClick={() => { dismissEnrichment(); setVisible(false); }}
                    className="text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We&apos;re missing <span className="font-medium text-foreground">{preview}{more}</span>. Add more details, upload documents, or share links so our agents deliver sharper insights.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" onClick={() => setOpen(true)} className="h-8 rounded-lg gap-1.5 text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    Add details
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { dismissEnrichment(); setVisible(false); }}
                    className="h-8 rounded-lg text-xs text-muted-foreground"
                  >
                    Maybe later
                  </Button>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    {missing.length} item{missing.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnrichmentDialog open={open} onOpenChange={setOpen} missing={missing} />
    </>
  );
}
