import { RefreshCw, ExternalLink, Upload, ToggleLeft, Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SubmissionCard {
  id: string;
  platform: string;
  logo: string;
  submittedDate?: string;
  liveDate?: string;
  indexedDate?: string;
  verifiedDate?: string;
  status: "not_started" | "submitted" | "live" | "indexed" | "verified";
  link?: string;
}

const submissions: SubmissionCard[] = [
  {
    id: "1",
    platform: "Crunchbase",
    logo: "CB",
    submittedDate: "Jan 10",
    liveDate: "Jan 12",
    indexedDate: "Jan 18",
    verifiedDate: "Jan 20",
    status: "verified",
    link: "https://crunchbase.com/acme",
  },
  {
    id: "2",
    platform: "AngelList",
    logo: "AL",
    submittedDate: "Jan 12",
    liveDate: "Jan 14",
    indexedDate: "Jan 19",
    status: "indexed",
    link: "https://angel.co/acme",
  },
  {
    id: "3",
    platform: "LinkedIn Company",
    logo: "LI",
    submittedDate: "Jan 15",
    liveDate: "Jan 16",
    status: "live",
    link: "https://linkedin.com/company/acme",
  },
  {
    id: "4",
    platform: "Product Hunt",
    logo: "PH",
    submittedDate: "Jan 18",
    status: "submitted",
  },
  {
    id: "5",
    platform: "G2 Crowd",
    logo: "G2",
    status: "not_started",
  },
  {
    id: "6",
    platform: "Capterra",
    logo: "CA",
    status: "not_started",
  },
];

const columns = [
  { id: "not_started", label: "Not Started", color: "bg-muted" },
  { id: "submitted", label: "Submitted", color: "bg-amber-100" },
  { id: "live", label: "Live", color: "bg-blue-100" },
  { id: "indexed", label: "Indexed", color: "bg-cyan-100" },
  { id: "verified", label: "Verified by AI", color: "bg-emerald-100" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <Check className="h-4 w-4 text-emerald-600" />;
    case "indexed":
    case "live":
      return <Clock className="h-4 w-4 text-electric" />;
    case "submitted":
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    default:
      return null;
  }
};

export default function Distribution() {
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Distribution Engine</h1>
          <p className="text-muted-foreground mt-1">
            Track your presence across platforms and directories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Manual Upload
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <span className="text-sm text-muted-foreground">Auto Retry</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {columns.map((col) => {
          const count = submissions.filter((s) => s.status === col.id).length;
          return (
            <div key={col.id} className={`card-reach py-4 ${col.color}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{count}</div>
                <div className="text-xs text-muted-foreground">{col.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline View */}
      <div className="grid grid-cols-5 gap-4 min-h-[500px]">
        {columns.map((col) => (
          <div key={col.id} className="space-y-3">
            <div className={`p-3 rounded-lg ${col.color}`}>
              <h3 className="text-sm font-semibold text-navy text-center">{col.label}</h3>
            </div>
            <div className="space-y-3">
              {submissions
                .filter((s) => s.status === col.id)
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="card-reach p-4 hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-light text-electric text-sm font-bold">
                        {submission.logo}
                      </div>
                      {getStatusIcon(submission.status)}
                    </div>
                    <h4 className="text-sm font-medium text-navy mb-1">{submission.platform}</h4>
                    
                    {submission.submittedDate && (
                      <p className="text-xs text-muted-foreground">
                        Submitted: {submission.submittedDate}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3">
                      {submission.link && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-electric">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                      {submission.status !== "verified" && submission.status !== "not_started" && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Re-check
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
