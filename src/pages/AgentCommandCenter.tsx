import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, CalendarClock, GitBranch, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { agentList, agents, type AgentMission } from "@/components/agents/agentRegistry";
import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import { useAgentSchedules } from "@/hooks/useAgentSchedules";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";
import { useRealAgentRunner } from "@/hooks/useRealAgentRunner";
import { FleetStatusBar } from "@/components/agents/FleetStatusBar";
import { AgentControlCard } from "@/components/agents/AgentControlCard";
import { LiveActivityStream } from "@/components/agents/LiveActivityStream";
import { MissionQueue } from "@/components/agents/MissionQueue";
import { AgentDetailDrawer } from "@/components/agents/AgentDetailDrawer";
import { AgentScheduler } from "@/components/agents/AgentScheduler";
import { WorkflowBuilder } from "@/components/agents/WorkflowBuilder";
import { FleetAnalytics } from "@/components/agents/FleetAnalytics";
import { SEO } from "@/components/SEO";

export default function AgentCommandCenter() {
  const { runtimes, activity, completedToday, stats, deploy, setStatus, deployAll, pauseAll } = useAgentSimulation();
  const [drawerAgentId, setDrawerAgentId] = useState<string | null>(null);

  // Schedules: trigger a deploy when a schedule fires
  const { schedules, addSchedule, removeSchedule, toggleSchedule, upcomingRuns } = useAgentSchedules({
    onTrigger: (agentId, mission) => {
      deploy(agentId, mission);
      toast.message(`⏰ Scheduled: ${agents[agentId].name}`, { description: mission.label });
    },
  });

  // Workflows: chain agents
  const workflows = useAgentWorkflows({
    onTrigger: (agentId, mission, ruleId) => {
      deploy(agentId, mission);
      toast.message(`⚡ Workflow → ${agents[agentId].name}`, { description: mission.label });
    },
  });

  // Watch activity for "complete" events and feed them into workflows
  const lastSeenEventId = useRef<string | null>(null);
  useEffect(() => {
    // Process newest-first list — find any new "complete" events since last tick
    const fresh: typeof activity = [];
    for (const e of activity) {
      if (e.id === lastSeenEventId.current) break;
      fresh.push(e);
    }
    if (activity[0]) lastSeenEventId.current = activity[0].id;
    // Fire in chronological order (oldest first)
    for (let i = fresh.length - 1; i >= 0; i--) {
      const e = fresh[i];
      if (e.type !== "complete") continue;
      // Extract mission label from message ("Mission label → result")
      const label = e.message.split(" → ")[0];
      const agent = agents[e.agentId];
      const mission = agent?.missions.find(m => m.label === label);
      workflows.handleMissionComplete(e.agentId, mission?.id ?? "any");
    }
  }, [activity, workflows]);

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

      <Tabs defaultValue="ops" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto p-1">
          <TabsTrigger value="ops" className="text-[12px] gap-1.5 py-2">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Operations</span>
            <span className="sm:hidden">Ops</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-[12px] gap-1.5 py-2">
            <CalendarClock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Scheduling</span>
            <span className="sm:hidden">Sched.</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="text-[12px] gap-1.5 py-2">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Workflows</span>
            <span className="sm:hidden">Flows</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-[12px] gap-1.5 py-2">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ops" className="mt-5 focus-visible:outline-none">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
            <div className="space-y-5 min-w-0">
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
              <div className="animate-slide-up" style={{ animationDelay: "420ms", animationFillMode: "both" }}>
                <MissionQueue runtimes={runtimes} completed={completedToday} />
              </div>
            </div>
            <div
              className="xl:sticky xl:top-4 xl:self-start animate-slide-up"
              style={{ animationDelay: "180ms", animationFillMode: "both" }}
            >
              <LiveActivityStream events={activity} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-5 focus-visible:outline-none animate-slide-up">
          <div className="max-w-4xl">
            <AgentScheduler
              schedules={schedules}
              upcomingRuns={upcomingRuns}
              onAdd={(a, m, c) => {
                addSchedule(a, m, c);
                toast.success("Schedule added", {
                  description: `${agents[a].name} will run automatically.`,
                });
              }}
              onRemove={id => {
                removeSchedule(id);
                toast.message("Schedule removed");
              }}
              onToggle={toggleSchedule}
            />
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="mt-5 focus-visible:outline-none animate-slide-up">
          <div className="max-w-4xl">
            <WorkflowBuilder
              rules={workflows.rules}
              onAdd={r => {
                workflows.addRule(r);
                toast.success("Workflow rule added", {
                  description: `${agents[r.triggerAgentId].name} → ${agents[r.thenAgentId].name}`,
                });
              }}
              onRemove={id => {
                workflows.removeRule(id);
                toast.message("Rule removed");
              }}
              onToggle={workflows.toggleRule}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-5 focus-visible:outline-none animate-slide-up">
          <FleetAnalytics runtimes={runtimes} />
        </TabsContent>
      </Tabs>

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
