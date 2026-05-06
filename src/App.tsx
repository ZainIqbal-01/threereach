import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Onboarding from "./pages/Onboarding";
import Overview from "./pages/Overview";
import AIScan from "./pages/AIScan";
import BrandIntelligence from "./pages/BrandIntelligence";
import BuildFootprint from "./pages/BuildFootprint";
import Distribution from "./pages/Distribution";
import ProofTracking from "./pages/ProofTracking";
import Reports from "./pages/Reports";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import AgentCommandCenter from "./pages/AgentCommandCenter";
import Optimize from "./pages/Optimize";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component that checks if onboarding is complete
function ProtectedRoutes() {
  const isOnboarded = localStorage.getItem("onboardingComplete") === "true";
  
  if (!isOnboarded) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/agents" element={<AgentCommandCenter />} />
        <Route path="/scan" element={<AIScan />} />
        <Route path="/optimize" element={<Optimize />} />
        <Route path="/brand-intelligence" element={<BrandIntelligence />} />
        <Route path="/footprint" element={<BuildFootprint />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="/proof" element={<ProofTracking />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

// Onboarding route that redirects to dashboard if already onboarded
function OnboardingRoute() {
  const isOnboarded = localStorage.getItem("onboardingComplete") === "true";
  
  if (isOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Onboarding />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingRoute />} />
          <Route path="/dashboard/*" element={<ProtectedRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
