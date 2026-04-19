import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface TimelineStep {
  day: number;
  label: string;
  status: "completed" | "active" | "upcoming";
}

const defaultSteps: TimelineStep[] = [
  { day: 1, label: "Profile Setup", status: "completed" },
  { day: 7, label: "Content Published", status: "completed" },
  { day: 14, label: "Distribution Active", status: "active" },
  { day: 30, label: "AI Indexed", status: "upcoming" },
];

export function ProgressTimeline({ steps = defaultSteps }: { steps?: TimelineStep[] }) {
  const activeIndex = steps.findIndex((s) => s.status === "active");
  const targetPercent =
    activeIndex >= 0 ? ((activeIndex + 0.5) / steps.length) * 100 : 100;

  // Animate the fill bar from 0 → target on mount
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setTimeout(() => setFill(targetPercent), 80),
    );
    return () => cancelAnimationFrame(id as unknown as number);
  }, [targetPercent]);

  return (
    <div className="card-reach h-full flex flex-col justify-center">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-8">
        Visibility Progress
      </p>

      <div className="relative px-4">
        {/* Track */}
        <div className="absolute top-[14px] left-4 right-4 h-[3px] bg-secondary rounded-full" />
        {/* Animated fill */}
        <div
          className="absolute top-[14px] left-4 h-[3px] rounded-full overflow-hidden progress-shimmer transition-all duration-1000 ease-out"
          style={{
            width: `calc(${fill}% - 0px)`,
            background:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
            boxShadow: "0 0 12px hsl(var(--primary) / 0.35)",
          }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative">
                {/* Soft halo for the active node */}
                {step.status === "active" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -m-2 rounded-full halo-pulse"
                    style={{
                      background:
                        "radial-gradient(circle, hsl(var(--primary) / 0.45) 0%, transparent 70%)",
                    }}
                  />
                )}
                <div
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 ${
                    step.status === "completed"
                      ? "bg-accent border-accent text-primary-foreground"
                      : step.status === "active"
                        ? "bg-primary border-primary text-primary-foreground shadow-glow"
                        : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{step.day}</span>
                  )}
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] font-medium text-muted-foreground">
                  Day {step.day}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 ${
                    step.status === "active" ? "text-primary" : "text-foreground"
                  }`}
                >
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
