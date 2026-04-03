interface ModuleProgressProps {
  title: string;
  description: string;
  progress: number;
  total?: number;
  unit?: string;
  color?: "primary" | "accent" | "success";
}

export function ModuleProgress({ title, description, progress, total, unit, color = "primary" }: ModuleProgressProps) {
  const percentage = total ? (progress / total) * 100 : progress;
  
  const gradients = {
    primary: "from-primary to-primary/70",
    accent: "from-accent to-accent/70",
    success: "from-success to-success/70",
  };

  return (
    <div className="card-reach">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-lg font-bold text-foreground">
          {total ? `${progress}/${total}` : `${progress}%`}
          {unit && <span className="text-[10px] text-muted-foreground ml-1 font-medium">{unit}</span>}
        </span>
      </div>
      
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradients[color]} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
