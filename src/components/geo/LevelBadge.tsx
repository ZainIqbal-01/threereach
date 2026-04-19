import { Badge } from "@/components/ui/badge";

interface Props {
  level: number;
  title: string;
  className?: string;
}

const COLOR_BY_LEVEL: Record<number, string> = {
  1: "bg-warning/15 text-warning border-warning/30",
  2: "bg-primary/15 text-primary border-primary/30",
  3: "bg-accent/15 text-accent border-accent/30",
  4: "bg-success/15 text-success border-success/30",
  5: "bg-primary/15 text-primary border-primary/30",
  6: "bg-accent/15 text-accent border-accent/30",
  7: "bg-success/15 text-success border-success/30",
};

export function LevelBadge({ level, title, className = "" }: Props) {
  return (
    <Badge variant="outline" className={`${COLOR_BY_LEVEL[level]} font-medium text-[10px] gap-1 ${className}`}>
      <span className="opacity-70">L{level}</span>
      <span>·</span>
      <span>{title}</span>
    </Badge>
  );
}
