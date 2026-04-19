import { useState } from "react";
import { toast } from "sonner";
import { agentList, agents, type AgentMission } from "@/components/agents/agentRegistry";
import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import { FleetStatusBar } from "@/components/agents/FleetStatusBar";
import { AgentControlCard } from "@/components/agents/AgentControlCard";
import { LiveActivityStream } from "@/components/agents/LiveActivityStream";
import { MissionQueue } from "@/components/agents/MissionQueue";
import { AgentDetailDrawer } from "@/components/agents/AgentDetailDrawer";

export default function AgentCommandCenter() {
  const { runtimes, activity, completedToday, stats, deploy, setStatus, deployAll, pauseAll } = useAgentSimulation();
  const [drawerAgentId, setDrawerAgentId] = useState<string | null>(null);

  const handleToggle = (agentId: string, active: boolean) => {
    setStatus(agentId, active ? "active" : "paused");
    toast.success(`${agents[agentId].name} ${active ? "deployed" : "paused"}`);
  };

  const handleDeployMission = (agentId: string, missionId: string) => {
    const agent = agents[agentId];
    const mission = agent.missions.find(m => m.id === missionId);
    if (!mission) return;
    deploy(agentId, mission);
    toast.success(`${agent.name}: ${mission.label}`, { description: mission.description });
  };

  const handleCustomDeploy = (agentId: string, label: string) => {
    const agent = agents[agentId];
    const custom: AgentMission = {
      id: `${agentId}-custom-${Date.now()}`,
      label,
      description: "Custom operator command",
      durationSec: 30,
    };
    deploy(agentId, custom);
    toast.success(`${agent.name}: ${label}`);
  };

  const handleDeployAll = () => {
    deployAll();
    toast.success("Fleet deployed", { description: "All 7 agents are now active" });
  };

  const handlePauseAll = () => {
    pauseAll();
    toast.message("Fleet paused", { description: "All agents standing by" });
  };

  const drawerAgent = drawerAgentId ? agents[drawerAgentId] : null;
  const drawerRuntime = drawerAgentId ? runtimes[drawerAgentId] : null;

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 mesh-bg min-h-screen">
      <div className="animate-slide-up">
        <FleetStatusBar
          active={stats.active}
          idle={stats.idle}
          paused={stats.paused}
          tasksToday={stats.tasksToday}
          queueDepth={stats.queueDepth}
          total={agentList.length}
          onDeployAll={handleDeployAll}
          onPauseAll={handlePauseAll}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5 min-w-0">
          {/* Agent grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agentList.map((agent, i) => (
              <div
                key={agent.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <AgentControlCard
                  agent={agent}
                  runtime={runtimes[agent.id]}
                  onToggle={active => handleToggle(agent.id, active)}
                  onDeployMission={mid => handleDeployMission(agent.id, mid)}
                  onOpenDetail={() => setDrawerAgentId(agent.id)}
                />
              </div>
            ))}
          </div>

          {/* Mission queue */}
          <div className="animate-slide-up" style={{ animationDelay: "420ms", animationFillMode: "both" }}>
            <MissionQueue runtimes={runtimes} completed={completedToday} />
          </div>
        </div>

        {/* Live activity rail */}
        <div className="xl:sticky xl:top-4 xl:self-start animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "both" }}>
          <LiveActivityStream events={activity} />
        </div>
      </div>

      <AgentDetailDrawer
        agent={drawerAgent}
        runtime={drawerRuntime}
        activity={activity}
        open={drawerAgentId !== null}
        onOpenChange={open => !open && setDrawerAgentId(null)}
        onCustomDeploy={label => drawerAgentId && handleCustomDeploy(drawerAgentId, label)}
      />
    </div>
  );
}
