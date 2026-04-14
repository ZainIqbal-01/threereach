import { StarAgent } from "@/components/StarAgent";
import type { AgentConfig } from "./agentRegistry";
import type { StarMood } from "@/components/StarAgent";

interface AgentBadgeProps {
  agent: AgentConfig;
  mood?: StarMood;
  size?: number;
  showName?: boolean;
  showRole?: boolean;
  isWorking?: boolean;
  className?: string;
}

export function AgentBadge({
  agent,
  mood,
  size = 40,
  showName = true,
  showRole = true,
  isWorking = false,
  className = "",
}: AgentBadgeProps) {
  const currentMood = mood || (isWorking ? agent.activeMood : agent.defaultMood);
  const statusMsg = isWorking ? agent.statusMessages.working : agent.statusMessages.idle;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <StarAgent mood={currentMood} size={size} animate={true} />
        {/* Working indicator ring */}
        {isWorking && (
          <div
            className="absolute -inset-1 rounded-full border-2 border-dashed animate-spin"
            style={{
              borderColor: `hsl(${agent.accentHue}, 80%, 60%)`,
              animationDuration: "3s",
            }}
          />
        )}
        {/* Agent emoji badge */}
        <span
          className="absolute -bottom-1 -right-1 text-xs bg-card border border-border/60 rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
          style={{ fontSize: "10px" }}
        >
          {agent.emoji}
        </span>
      </div>
      {(showName || showRole) && (
        <div className="min-w-0">
          {showName && (
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-bold"
                style={{ color: `hsl(${agent.accentHue}, 80%, 50%)` }}
              >
                {agent.name}
              </span>
              {isWorking && (
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: `hsl(${agent.accentHue}, 80%, 60%)` }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: `hsl(${agent.accentHue}, 80%, 60%)` }}
                  />
                </span>
              )}
            </div>
          )}
          {showRole && (
            <p className="text-[10px] text-muted-foreground truncate">
              {statusMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
