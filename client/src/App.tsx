import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HamzuryChat from "./components/HamzuryChat";

// Public pages
import Home from "./pages/Home";
import Ridi from "./pages/Ridi";
import Portal from "./pages/Portal";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Department from "./pages/Department";
import Diagnosis from "./pages/Diagnosis";
import Policies from "./pages/Policies";
import Team from "./pages/Team";

// Authenticated dashboards
import StaffDashboard from "./pages/StaffDashboard";
import ClientView from "./pages/ClientView";
import AgentDashboard from "./pages/AgentDashboard";
import AdminPanel from "./pages/AdminPanel";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import StaffLogin from "./pages/StaffLogin";

// Frictionless client intake
import ClientIntake from "./pages/ClientIntake";
import TrackProject from "./pages/TrackProject";
import EventForm from "./pages/EventForm";

// Department pages
import InnovationHub from "./pages/departments/InnovationHub";
import Studios from "./pages/departments/Studios";
import Systems from "./pages/departments/Systems";
import Bizdoc from "./pages/departments/Bizdoc";

// Institutional dashboards
import CEODashboard from "./pages/ceo-dashboard";
import FounderDashboard from "./pages/founder-dashboard";
import LeadDashboard from "./pages/lead-dashboard";
import MyTasksDashboard from "./pages/staff/my-tasks";

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/ridi" component={Ridi} />
      <Route path="/portal" component={Portal} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/diagnosis" component={Diagnosis} />
      <Route path="/department/:slug" component={Department} />
      <Route path="/legal/:type" component={Legal} />

      {/* Authenticated portals */}
      <Route path="/staff" component={StaffDashboard} />
      <Route path="/staff/dashboard" component={StaffDashboard} />
      <Route path="/client/:clientRef" component={ClientView} />
      <Route path="/agent" component={AgentDashboard} />
      <Route path="/agent/dashboard" component={AgentDashboard} />

      {/* Admin */}
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/:tab" component={AdminPanel} />
      <Route path="/staff/dashboard/admin" component={AdminPanel} />

      {/* Secret super admin login — not linked anywhere on the public site */}
      <Route path="/hq-access-9f3k2" component={SuperAdminLogin} />

      {/* Staff institutional login */}
      <Route path="/staff-login" component={StaffLogin} />

      {/* Institutional dashboards — secret paths, not linked publicly */}
      <Route path="/ceo-access-7x9m4" component={CEODashboard} />
      <Route path="/founder-access-k8p1q" component={FounderDashboard} />
      <Route path="/lead-dashboard" component={LeadDashboard} />
      <Route path="/my-tasks" component={MyTasksDashboard} />

      {/* Department pages */}
      <Route path="/services/innovation-hub" component={InnovationHub} />
      <Route path="/services/studios" component={Studios} />
      <Route path="/services/systems" component={Systems} />
      <Route path="/services/bizdoc" component={Bizdoc} />

      {/* Frictionless client intake — no login required */}
      <Route path="/start" component={ClientIntake} />
      <Route path="/track" component={TrackProject} />
      <Route path="/event" component={EventForm} />

      {/* Public institutional pages */}
      <Route path="/policies" component={Policies} />
      <Route path="/team" component={Team} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <HamzuryChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
