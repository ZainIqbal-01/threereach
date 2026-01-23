import { Check, Edit2, Eye, RefreshCw, FileText, HelpCircle, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ContentAsset {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "draft" | "published" | "needs_update";
  lastUpdated?: string;
}

const contentAssets: ContentAsset[] = [
  {
    id: "landing",
    title: "AI Landing Page",
    description: "Optimized page for AI engine discovery",
    icon: <FileText className="h-5 w-5" />,
    status: "published",
    lastUpdated: "Jan 15, 2026",
  },
  {
    id: "knowledge",
    title: "Knowledge Base Page",
    description: "Structured business information",
    icon: <FileText className="h-5 w-5" />,
    status: "draft",
  },
  {
    id: "faq",
    title: "FAQ Schema",
    description: "Structured Q&A for AI engines",
    icon: <HelpCircle className="h-5 w-5" />,
    status: "needs_update",
    lastUpdated: "Dec 28, 2025",
  },
  {
    id: "trust",
    title: "Trust Page",
    description: "Credibility and trust signals",
    icon: <Shield className="h-5 w-5" />,
    status: "draft",
  },
  {
    id: "founder",
    title: "Founder Profile Page",
    description: "Leadership visibility content",
    icon: <User className="h-5 w-5" />,
    status: "published",
    lastUpdated: "Jan 10, 2026",
  },
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
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700" },
  needs_update: { label: "Needs Update", className: "bg-amber-50 text-amber-700" },
};

export default function BuildFootprint() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Build AI Footprint</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage content that makes you discoverable by AI engines
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Knowledge Identity Builder */}
        <div className="col-span-5">
          <div className="card-reach h-full">
            <h3 className="text-lg font-semibold text-navy mb-2">Knowledge Identity Builder</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Complete your business profile for AI engine optimization
            </p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy">Profile Completeness</span>
                <span className="text-sm font-semibold text-electric">{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="h-2" />
            </div>

            {/* Fields checklist */}
            <div className="space-y-3">
              {profileFields.map((field, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    field.completed
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-muted/30 border-border hover:border-electric/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        field.completed ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {field.completed ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm ${field.completed ? "text-navy" : "text-muted-foreground"}`}>
                      {field.name}
                    </span>
                  </div>
                  {!field.completed && (
                    <Button variant="ghost" size="sm" className="text-electric h-7 px-2">
                      Add
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Content Assets */}
        <div className="col-span-7">
          <div className="card-reach">
            <h3 className="text-lg font-semibold text-navy mb-2">AI Content Assets</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Publish optimized content pages for AI discovery
            </p>

            <div className="space-y-4">
              {contentAssets.map((asset) => {
                const status = statusConfig[asset.status];
                return (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-electric/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-electric-light text-electric">
                        {asset.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-navy">{asset.title}</h4>
                        <p className="text-xs text-muted-foreground">{asset.description}</p>
                        {asset.lastUpdated && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated: {asset.lastUpdated}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-navy">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-navy">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {asset.status === "published" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-navy">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
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
