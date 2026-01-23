import { Check } from "lucide-react";

interface TimelineStep {
  day: number;
  label: string;
  status: "completed" | "active" | "upcoming";
}

interface ProgressTimelineProps {
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  { day: 1, label: "Profile Setup", status: "completed" },
  { day: 7, label: "Content Published", status: "completed" },
  { day: 14, label: "Distribution Active", status: "active" },
  { day: 30, label: "AI Indexed", status: "upcoming" },
];

export function ProgressTimeline({ steps = defaultSteps }: ProgressTimelineProps) {
  return (
    <div className="card-reach">
      <h3 className="text-sm font-medium text-muted-foreground mb-6">Visibility Progress</h3>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-electric to-cyan transition-all duration-500"
          style={{ width: "45%" }}
        />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  step.status === "completed"
                    ? "bg-cyan border-cyan text-primary-foreground"
                    : step.status === "active"
                    ? "bg-electric border-electric text-primary-foreground animate-pulse-glow"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{step.day}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <div className="text-xs font-medium text-muted-foreground">Day {step.day}</div>
                <div className={`text-sm font-medium mt-0.5 ${
                  step.status === "active" ? "text-electric" : "text-navy"
                }`}>
                  {step.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
