import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { Loader2 } from "lucide-react";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-7 w-7 text-primary animate-spin" />
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return <Navigate to={user ? "/dashboard" : "/auth"} replace />;
}

/**
 * Decides what an authenticated user should see:
 *  - If profile is still loading → spinner
 *  - If onboarding NOT complete → standalone full-screen Onboarding (no sidebar/topbar)
 *  - Otherwise → the full Dashboard with AppLayout
 */
function AuthenticatedShell() {
  const { profile, loading } = useBusinessProfile();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  // Brand-new user: take their data first, no dashboard chrome.
  if (!profile.onboardingComplete) {
    // Allow only the onboarding route; anything else redirects there.
    if (location.pathname !== "/dashboard/onboarding") {
      return <Navigate to="/dashboard/onboarding" replace />;
    }
    return (
      <ErrorBoundary>
        <Onboarding />
      </ErrorBoundary>
    );
  }

  // Onboarded users should never see the standalone onboarding page again.
  if (location.pathname === "/dashboard/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/agents" element={<AgentCommandCenter />} />
          <Route path="/scan" element={<AIScan />} />
          <Route path="/brand-intelligence" element={<BrandIntelligence />} />
          <Route path="/footprint" element={<BuildFootprint />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/proof" element={<ProofTracking />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </AppLayout>
  );
}

function ProtectedRoutes() {
  return (
    <RequireAuth>
      <AuthenticatedShell />
    </RequireAuth>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard/*" element={<ProtectedRoutes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
