import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { agentList, type AgentConfig } from "./agentRegistry";
import { StarAgent } from "@/components/StarAgent";
import { ArrowRight, Zap } from "lucide-react";

interface AgentStatus {
  id: string;
  isWorking: boolean;
  lastAction: string;
}

export function AgentHub() {
  const location = useLocation();
  const [statuses, setStatuses] = useState<AgentStatus[]>(
    agentList.map(a => ({
      id: a.id,
      isWorking: false,
      lastAction: a.statusMessages.idle,
    }))
  );

  // Simulate agents periodically working
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * agentList.length);
      const agent = agentList[randomIdx];

      setStatuses(prev =>
        prev.map((s, i) =>
          i === randomIdx ? { ...s, isWorking: true, lastAction: agent.statusMessages.working } : s
        )
      );

      setTimeout(() => {
        setStatuses(prev =>
          prev.map((s, i) =>
            i === randomIdx ? { ...s, isWorking: false, lastAction: agent.statusMessages.done } : s
          )
        );
      }, 2500 + Math.random() * 2000);
    }, 5000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const workingCount = statuses.filter(s => s.isWorking).length;

  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Agent Hub</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {workingCount > 0 ? `${workingCount} active` : "All idle"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">{agentList.length} agents deployed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {agentList.map((agent, i) => {
          const status = statuses[i];
          const isActive = location.pathname === agent.href;

          return (
            <Link
              key={agent.id}
              to={agent.href}
              className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:shadow-md ${
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/40 hover:border-primary/20 bg-card"
              }`}
            >
              {/* Working ring */}
              <div className="relative shrink-0">
                <StarAgent
                  mood={status.isWorking ? agent.activeMood : agent.defaultMood}
                  size={32}
                  animate={true}
                />
                {status.isWorking && (
                  <div
                    className="absolute -inset-0.5 rounded-full border-2 border-dashed"
                    style={{
                      borderColor: `hsl(${agent.accentHue}, 80%, 60%)`,
                      animation: "spin 3s linear infinite",
                    }}
                  />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-card border border-border/60 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {agent.emoji}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold"
                    style={{ color: `hsl(${agent.accentHue}, 75%, 45%)` }}
                  >
                    {agent.name}
                  </span>
                  {status.isWorking && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: `hsl(${agent.accentHue}, 80%, 60%)` }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ backgroundColor: `hsl(${agent.accentHue}, 80%, 60%)` }}
                      />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{agent.role}</p>
                <p className="text-[9px] text-muted-foreground/70 truncate mt-0.5">
                  {status.lastAction}
                </p>
              </div>

              <ArrowRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-0.5 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
