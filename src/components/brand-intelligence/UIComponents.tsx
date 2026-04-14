import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

export const MetaCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-border/80 ${className}`}
    style={{ boxShadow: 'var(--shadow-card)' }}>
    {children}
  </div>
);

export const SentimentPill = ({ sentiment }: { sentiment: "positive" | "neutral" | "negative" }) => {
  const styles = {
    positive: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)] border border-[hsl(142,71%,45%)/0.15]",
    neutral: "bg-secondary text-muted-foreground border border-border/40",
    negative: "bg-destructive/8 text-destructive border border-destructive/15",
  };
  const icons = {
    positive: <ThumbsUp className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />,
    negative: <ThumbsDown className="h-3 w-3" />,
  };
  const labels = { positive: "Positive", neutral: "Neutral", negative: "Negative" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${styles[sentiment]}`}>
      {icons[sentiment]} {labels[sentiment]}
    </span>
  );
};

export const PriorityDot = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  const colors = {
    high: "bg-destructive shadow-[0_0_6px_hsl(0,84%,60%/0.3)]",
    medium: "bg-[hsl(38,92%,50%)] shadow-[0_0_6px_hsl(38,92%,50%/0.3)]",
    low: "bg-muted-foreground/40",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold capitalize">
      <span className={`h-2 w-2 rounded-full ${colors[priority]}`} />
      {priority}
    </span>
  );
};

export const statusStyles: Record<string, { label: string; color: string }> = {
  invisible: { label: "Invisible", color: "bg-destructive/10 text-destructive border border-destructive/20" },
  weak: { label: "Weak", color: "bg-[hsl(38,92%,90%)] text-[hsl(38,92%,35%)] border border-[hsl(38,92%,50%)/0.2]" },
  visible: { label: "Visible", color: "bg-primary/10 text-primary border border-primary/20" },
  strong: { label: "Strong", color: "bg-[hsl(142,71%,95%)] text-[hsl(142,71%,35%)] border border-[hsl(142,71%,45%)/0.2]" },
};
