import { useWorkspace } from "@/hooks/useWorkspace";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Overview = lazy(() => import("@/pages/Overview"));
const AIScan = lazy(() => import("@/pages/AIScan"));
const BrandIntelligence = lazy(() => import("@/pages/BrandIntelligence"));
const BuildFootprint = lazy(() => import("@/pages/BuildFootprint"));
const Distribution = lazy(() => import("@/pages/Distribution"));
const ProofTracking = lazy(() => import("@/pages/ProofTracking"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));
const Billing = lazy(() => import("@/pages/Billing"));
const AgentCommandCenter = lazy(() => import("@/pages/AgentCommandCenter"));
const Optimize = lazy(() => import("@/pages/Optimize"));

const MAP: Record<string, React.LazyExoticComponent<any>> = {
  overview: Overview,
  scan: AIScan,
  brand: BrandIntelligence,
  optimize: Optimize,
  distribution: Distribution,
  agents: AgentCommandCenter,
  footprint: BuildFootprint,
  proof: ProofTracking,
  reports: Reports,
  settings: Settings,
  billing: Billing,
};

export function PreviewRouter() {
  const { module } = useWorkspace();
  const Cmp = MAP[module] ?? Overview;
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    }>
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <Cmp />
      </div>
    </Suspense>
  );
}
