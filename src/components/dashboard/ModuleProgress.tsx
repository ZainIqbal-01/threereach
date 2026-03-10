import { motion } from "framer-motion";

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
          <h4 className="text-sm font-bold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 font-semibold">{description}</p>
        </div>
        <span className="text-lg font-black text-electric">
          {total ? `${progress}/${total}` : `${progress}%`}
          {unit && <span className="text-xs text-muted-foreground ml-1 font-bold">{unit}</span>}
        </span>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
