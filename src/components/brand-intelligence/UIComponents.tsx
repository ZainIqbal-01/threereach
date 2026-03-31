import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

export const MetaCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] p-5 ${className}`}>
    {children}
  </div>
);

export const SentimentPill = ({ sentiment }: { sentiment: "positive" | "neutral" | "negative" }) => {
  const styles = {
    positive: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)]",
    neutral: "bg-secondary text-muted-foreground",
    negative: "bg-destructive/8 text-destructive",
  };
  const icons = {
    positive: <ThumbsUp className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />,
    negative: <ThumbsDown className="h-3 w-3" />,
  };
  const labels = { positive: "Positive", neutral: "Neutral", negative: "Negative" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[sentiment]}`}>
      {icons[sentiment]} {labels[sentiment]}
    </span>
  );
};

export const PriorityDot = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  const colors = {
    high: "bg-destructive",
    medium: "bg-[hsl(38,92%,50%)]",
    low: "bg-muted-foreground/40",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium capitalize">
      <span className={`h-1.5 w-1.5 rounded-full ${colors[priority]}`} />
      {priority}
    </span>
  );
};

export const statusStyles: Record<string, { label: string; color: string }> = {
  invisible: { label: "Invisible", color: "bg-destructive/10 text-destructive" },
  weak: { label: "Weak", color: "bg-[hsl(38,92%,90%)] text-[hsl(38,92%,35%)]" },
  visible: { label: "Visible", color: "bg-primary/10 text-primary" },
  strong: { label: "Strong", color: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)]" },
};
