import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";

/**
 * Gates protected routes so brand-new users land on the onboarding screen first.
 * Once the user has completed onboarding, they can access the rest of the app.
 */
export function RequireOnboarding({ children }: { children: ReactNode }) {
  const { profile, loading } = useBusinessProfile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  const isOnboardingRoute = location.pathname.endsWith("/onboarding");

  // New user — force onboarding
  if (!profile.onboardingComplete && !isOnboardingRoute) {
    return <Navigate to="/dashboard/onboarding" replace />;
  }

  // Already onboarded — don't let them go back to onboarding
  if (profile.onboardingComplete && isOnboardingRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
