import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portal from "./pages/Portal";
import Ridi from "./pages/Ridi";
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

      {/* Authenticated portals */}
      <Route path="/dashboard/staff" component={StaffDashboard} />
      <Route path="/dashboard/agent" component={AgentDashboard} />

      {/* Client project view (unique URL) */}
      <Route path="/client/:id" component={ClientView} />

      {/* Legacy portal login routes */}
      <Route path="/login/staff">
        {() => { window.location.replace("/portal"); return null; }}
      </Route>
      <Route path="/login/agent">
        {() => { window.location.replace("/portal"); return null; }}
      </Route>
      <Route path="/login/client">
        {() => { window.location.replace("/portal"); return null; }}
      </Route>

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
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
