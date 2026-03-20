/**
 * HAMZURY ProtectedDashboardRoute
 * ════════════════════════════════
 * Wraps a dashboard page component.
 * If the user is not authenticated for the given role,
 * they are redirected to /[role]/login.
 *
 * Usage in App.tsx:
 *   <Route path="/cso/dashboard">
 *     {() => <ProtectedDashboardRoute role="cso"><CSODashboard /></ProtectedDashboardRoute>}
 *   </Route>
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { DashboardRole } from "@/components/DashboardShell";
import { getDashboardSession } from "@/lib/dashboardAuth";

interface ProtectedDashboardRouteProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function ProtectedDashboardRoute({
  role,
  children,
}: ProtectedDashboardRouteProps) {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getDashboardSession(role);
    if (!session) {
      setLocation(`/${role}/login`);
    } else {
      setAllowed(true);
    }
    setChecked(true);
  }, [role, setLocation]);

  if (!checked) {
    // Minimal loading state — avoids flash of content
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0A1F1C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
