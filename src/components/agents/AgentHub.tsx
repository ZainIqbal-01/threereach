import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { agentList, type AgentConfig } from "./agentRegistry";
import { StarAgent } from "@/components/StarAgent";
import { ArrowRight, Zap, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface AgentStatus {
  id: string;
  isWorking: boolean;
  lastAction: string;
  progress: number;
}

export function AgentHub() {
  const location = useLocation();
  const [statuses, setStatuses] = useState<AgentStatus[]>(
    agentList.map(a => ({
      id: a.id,
      isWorking: false,
      lastAction: a.statusMessages.idle,
      progress: Math.floor(Math.random() * 60) + 20,
    }))
  );

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
            i === randomIdx
              ? { ...s, isWorking: false, lastAction: agent.statusMessages.done, progress: Math.min(100, s.progress + Math.floor(Math.random() * 8) + 2) }
              : s
          )
        );
      }, 2500 + Math.random() * 2000);
    }, 5000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const workingCount = statuses.filter(s => s.isWorking).length;

  return (
    <div className="card-premium">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Your AI Agents</h3>
            <p className="text-[11px] text-muted-foreground">
              {workingCount > 0
                ? `${workingCount} agent${workingCount > 1 ? "s" : ""} actively working for you`
                : "All agents standing by — ready to work"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
            workingCount > 0
              ? "bg-[hsl(142,71%,92%)] text-[hsl(142,71%,30%)] border border-[hsl(142,71%,45%)/0.15]"
              : "bg-secondary text-muted-foreground"
          }`}>
            {workingCount > 0 ? `${workingCount} Active` : "Idle"}
          </span>
          <Link
            to="/dashboard/agents"
            className="text-[10px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
          >
            Command Center
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {agentList.map((agent, i) => {
          const status = statuses[i];
          const isActive = location.pathname === agent.href;

          return (
            <Link
              key={agent.id}
              to={agent.href}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg animate-slide-up stagger-${Math.min(i + 1, 4)} ${
                isActive
                  ? "border-primary/30 bg-primary/[0.03] shadow-sm"
                  : status.isWorking
                  ? "border-border/60 bg-card shadow-sm"
                  : "border-border/40 hover:border-primary/20 bg-card"
              }`}
              style={{ animationFillMode: "both" }}
            >
              {/* Top row: avatar + name + status */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative shrink-0">
                  <StarAgent
                    mood={status.isWorking ? agent.activeMood : agent.defaultMood}
                    size={36}
                    animate={true}
                  />
                  {status.isWorking && (
                    <div
                      className="absolute -inset-1 rounded-full border-2 border-dashed"
                      style={{
                        borderColor: `hsl(${agent.accentHue}, 80%, 60%)`,
                        animation: "spin 3s linear infinite",
                      }}
                    />
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-card border border-border/60 rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                    {agent.emoji}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-bold"
                      style={{ color: `hsl(${agent.accentHue}, 75%, 45%)` }}
                    >
                      {agent.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium bg-secondary px-1.5 py-0.5 rounded-md">
                      {agent.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground font-medium">{agent.module}</span>
                  <span className="text-[10px] font-semibold" style={{ color: `hsl(${agent.accentHue}, 70%, 45%)` }}>
                    {status.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${status.progress}%`,
                      background: `linear-gradient(90deg, hsl(${agent.accentHue}, 75%, 55%), hsl(${agent.accentHue}, 85%, 65%))`,
                    }}
                  />
                </div>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {status.isWorking ? (
                    <Loader2 className="h-3 w-3 animate-spin" style={{ color: `hsl(${agent.accentHue}, 80%, 55%)` }} />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 text-muted-foreground/50" />
                  )}
                  <span className={`text-[10px] truncate max-w-[140px] ${
                    status.isWorking ? "text-foreground font-medium" : "text-muted-foreground/70"
                  }`}>
                    {status.lastAction}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
