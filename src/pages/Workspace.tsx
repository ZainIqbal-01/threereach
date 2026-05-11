import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ConversationList } from "@/components/chat/ConversationList";
import { ModuleRail } from "@/components/workspace/ModuleRail";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";

export default function Workspace() {
  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      <ModuleRail />
      <div className="hidden md:flex w-56 bg-sidebar border-r border-sidebar-border flex-col">
        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="text-xs font-semibold text-sidebar-foreground">Three Reach</div>
          <div className="text-[10px] text-sidebar-muted">AI Visibility Workspace</div>
        </div>
        <ConversationList />
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={38} minSize={28} maxSize={55}>
          <ChatPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={62} minSize={45}>
          <WorkspaceTabs />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
