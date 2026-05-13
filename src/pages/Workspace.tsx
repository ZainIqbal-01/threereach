import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { MarketingNav } from "@/components/workspace/MarketingNav";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";

export default function Workspace() {
  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      <MarketingNav />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={34} minSize={24} maxSize={50}>
          <ChatPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={66} minSize={45}>
          <WorkspaceTabs />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
