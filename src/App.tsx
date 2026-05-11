import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Workspace from "./pages/Workspace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedWorkspace() {
  const isOnboarded = localStorage.getItem("onboardingComplete") === "true";
  if (!isOnboarded) return <Navigate to="/" replace />;
  return <Workspace />;
}

function OnboardingRoute() {
  const isOnboarded = localStorage.getItem("onboardingComplete") === "true";
  if (isOnboarded) return <Navigate to="/dashboard" replace />;
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
          <Route path="/dashboard/*" element={<ProtectedWorkspace />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
