import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineStep {
  day: number;
  label: string;
  status: "completed" | "active" | "upcoming";
  emoji: string;
}

const defaultSteps: TimelineStep[] = [
  { day: 1, label: "Profile Setup", status: "completed", emoji: "✅" },
  { day: 7, label: "Content Published", status: "completed", emoji: "✅" },
  { day: 14, label: "Distribution Active", status: "active", emoji: "🔄" },
  { day: 30, label: "AI Indexed", status: "upcoming", emoji: "🎯" },
];

export function ProgressTimeline({ steps = defaultSteps }: { steps?: TimelineStep[] }) {
  return (
    <div className="card-reach">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🗺️</span>
        <h3 className="text-sm font-bold text-muted-foreground">Your Visibility Journey</h3>
      </div>
      
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-border rounded-full" />
        <motion.div 
          className="absolute top-5 left-0 h-1 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
          initial={{ width: "0%" }}
          animate={{ width: "45%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-3 transition-all text-lg ${
                  step.status === "completed"
                    ? "bg-success border-success text-primary-foreground"
                    : step.status === "active"
                    ? "bg-electric border-electric text-primary-foreground animate-pulse-glow"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {step.status === "completed" ? "✅" : step.status === "active" ? "🔄" : "🔒"}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] font-bold text-muted-foreground">Day {step.day}</div>
                <div className={`text-xs font-bold mt-0.5 ${
                  step.status === "active" ? "text-electric" : step.status === "completed" ? "text-success" : "text-muted-foreground"
                }`}>
                  {step.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
