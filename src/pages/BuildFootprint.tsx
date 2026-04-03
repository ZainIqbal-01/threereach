import { Check, Edit2, Eye, RefreshCw, FileText, HelpCircle, Shield, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarAgent } from "@/components/StarAgent";

interface ContentAsset {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "draft" | "published" | "needs_update";
  lastUpdated?: string;
}

const contentAssets: ContentAsset[] = [
  { id: "landing", title: "AI Landing Page", description: "Optimized page for AI engine discovery", icon: <FileText className="h-5 w-5" />, status: "published", lastUpdated: "Jan 15, 2026" },
  { id: "knowledge", title: "Knowledge Base Page", description: "Structured business information", icon: <FileText className="h-5 w-5" />, status: "draft" },
  { id: "faq", title: "FAQ Schema", description: "Structured Q&A for AI engines", icon: <HelpCircle className="h-5 w-5" />, status: "needs_update", lastUpdated: "Dec 28, 2025" },
  { id: "trust", title: "Trust Page", description: "Credibility and trust signals", icon: <Shield className="h-5 w-5" />, status: "draft" },
  { id: "founder", title: "Founder Profile Page", description: "Leadership visibility content", icon: <User className="h-5 w-5" />, status: "published", lastUpdated: "Jan 10, 2026" },
];

const profileFields = [
  { name: "Business Description", completed: true },
  { name: "Core Services", completed: true },
  { name: "Founding Year", completed: true },
  { name: "Location & Markets", completed: true },
  { name: "Trust Statements", completed: false },
  { name: "Key Differentiators", completed: false },
  { name: "Client Testimonials", completed: false },
  { name: "Awards & Recognition", completed: false },
];

const completedFields = profileFields.filter((f) => f.completed).length;
const profileProgress = (completedFields / profileFields.length) * 100;

const statusConfig = {
  draft: { label: "Draft", className: "bg-secondary text-muted-foreground" },
  published: { label: "Published", className: "bg-success-light text-success border border-success/20" },
  needs_update: { label: "Needs Update", className: "bg-warning-light text-warning border border-warning/20" },
};

export default function BuildFootprint() {
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <StarAgent mood="thinking" size={48} animate={true} />
        <div>
          <h1 className="text-xl font-bold text-foreground">Build AI Footprint</h1>
          <p className="text-sm text-muted-foreground">Create content that makes you discoverable by AI engines</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Knowledge Identity */}
        <div className="col-span-5">
          <div className="card-reach h-full">
            <h3 className="text-sm font-semibold text-foreground mb-1">Knowledge Identity</h3>
            <p className="text-[11px] text-muted-foreground mb-5">Complete your business profile for AI optimization</p>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">Completeness</span>
                <span className="text-xs font-bold text-primary">{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              {profileFields.map((field, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  field.completed
                    ? "bg-success-light/50 border-success/20"
                    : "bg-secondary/30 border-border/60 hover:border-primary/30"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      field.completed ? "bg-success text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {field.completed ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
                    </div>
                    <span className={`text-xs ${field.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {field.name}
                    </span>
                  </div>
                  {!field.completed && (
                    <Button variant="ghost" size="sm" className="text-primary h-6 px-2 text-[10px]">Add</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Assets */}
        <div className="col-span-7">
          <div className="card-reach">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Content Assets</h3>
                <p className="text-[11px] text-muted-foreground">Publish optimized content for AI discovery</p>
              </div>
              <Button size="sm" className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1">
                <Sparkles className="h-3 w-3" />
                Auto-Generate
              </Button>
            </div>

            <div className="space-y-3">
              {contentAssets.map((asset) => {
                const status = statusConfig[asset.status];
                return (
                  <div key={asset.id} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        {asset.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{asset.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{asset.description}</p>
                        {asset.lastUpdated && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">Updated: {asset.lastUpdated}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
