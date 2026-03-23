interface ModuleProgressProps {
  title: string;
  description: string;
  progress: number;
  total?: number;
  unit?: string;
}

export function ModuleProgress({ title, description, progress, total, unit }: ModuleProgressProps) {
  const percentage = total ? (progress / total) * 100 : progress;
  
  return (
    <div className="card-reach">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-medium text-navy">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-lg font-semibold text-electric">
          {total ? `${progress}/${total}` : `${progress}%`}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, hsl(217 91% 60%) 0%, hsl(187 85% 53%) 100%)",
          }}
        />
      </div>
    </div>
  );
}
