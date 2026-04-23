import { useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Link2, FileText, X, Plus, Sparkles, CheckCircle2, FileCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBusinessProfile, BusinessResource } from "@/hooks/useBusinessProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missing: string[];
}

const ACCEPTED = ".pdf,.doc,.docx,.txt,.md,.csv";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB per file (cloud storage)

export function EnrichmentDialog({ open, onOpenChange, missing }: Props) {
  const { user } = useAuth();
  const { profile, update, addResources, removeResource } = useBusinessProfile();
  const [detailedInfo, setDetailedInfo] = useState(profile.detailedInfo ?? "");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resources = profile.resources ?? [];

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!user) {
      toast.error("Please sign in to upload documents");
      return;
    }
    setUploading(true);
    try {
      const items: Omit<BusinessResource, "id" | "addedAt">[] = [];
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} exceeds the 10MB limit`);
          continue;
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage
          .from("business-resources")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`Upload failed: ${file.name}`);
          continue;
        }
        items.push({
          type: "document",
          name: file.name,
          value: path,
          size: file.size,
          mimeType: file.type,
        });
      }
      if (items.length) {
        await addResources(items);
        toast.success(`${items.length} document${items.length > 1 ? "s" : ""} uploaded`);
      }
    } finally {
      setUploading(false);
    }
  };

  const addLink = async () => {
    const url = linkUrl.trim();
    if (!url) return;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }
    await addResources([{
      type: "link",
      name: linkLabel.trim() || url,
      value: url.startsWith("http") ? url : `https://${url}`,
    }]);
    setLinkUrl("");
    setLinkLabel("");
    toast.success("Link added");
  };

  const handleSave = async () => {
    await update({ detailedInfo: detailedInfo.trim() });
    toast.success("Brand context saved — your AI agents are smarter now");
    onOpenChange(false);
  };

  const formatBytes = (b?: number) => {
    if (!b) return "";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Enrich your brand context</DialogTitle>
              <DialogDescription>
                The more we know, the sharper your AI visibility insights and content become.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {missing.length > 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-foreground mb-1.5">Missing for best results:</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((m) => (
                <span key={m} className="text-[11px] px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details" className="gap-2"><FileText className="h-3.5 w-3.5" />Details</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><Upload className="h-3.5 w-3.5" />Documents</TabsTrigger>
            <TabsTrigger value="links" className="gap-2"><Link2 className="h-3.5 w-3.5" />Links</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-3 pt-4">
            <div>
              <Label className="text-xs text-muted-foreground">Detailed business / startup info</Label>
              <Textarea
                value={detailedInfo}
                onChange={(e) => setDetailedInfo(e.target.value.slice(0, 5000))}
                placeholder="Tell us anything that helps: mission, products, pricing, traction, awards, certifications, key customers, differentiators, target keywords…"
                className="mt-1 min-h-[180px] rounded-xl bg-secondary/30 border-border/60"
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {detailedInfo.length} / 5000
              </p>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-3 pt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors p-6 text-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
              ) : (
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <p className="text-sm font-semibold text-foreground">{uploading ? "Uploading…" : "Upload documents"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, DOCX, TXT, MD, CSV — up to 10MB each</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            />

            {resources.filter(r => r.type === "document").length > 0 && (
              <div className="space-y-1.5">
                {resources.filter(r => r.type === "document").map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/40">
                    <FileCheck2 className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatBytes(r.size)}</p>
                    </div>
                    <button onClick={() => removeResource(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-3 pt-4">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <Input
                placeholder="Label (optional)"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="h-10 rounded-xl bg-secondary/30"
              />
              <Input
                placeholder="https://example.com/about"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                className="h-10 rounded-xl bg-secondary/30"
              />
              <Button onClick={addLink} disabled={!linkUrl.trim()} variant="outline" className="h-10 rounded-xl">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Add press, case studies, GitHub, Crunchbase, social profiles, knowledge bases — anything we should learn from.
            </p>

            {resources.filter(r => r.type === "link").length > 0 && (
              <div className="space-y-1.5">
                {resources.filter(r => r.type === "link").map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/40">
                    <Link2 className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{r.value}</p>
                    </div>
                    <button onClick={() => removeResource(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleSave} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Save context
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
