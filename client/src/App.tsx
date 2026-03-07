import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import WhatsAppWidget from "./components/WhatsAppWidget";

// Public pages
import Home from "./pages/Home";
import Ridi from "./pages/Ridi";
import Portal from "./pages/Portal";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Department from "./pages/Department";
import Diagnosis from "./pages/Diagnosis";

// Authenticated dashboards
import StaffDashboard from "./pages/StaffDashboard";
import ClientView from "./pages/ClientView";
import AgentDashboard from "./pages/AgentDashboard";

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
          <WhatsAppWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
