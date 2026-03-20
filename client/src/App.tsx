import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HamzuryChat from "./components/HamzuryChat";
import { ProtectedDashboardRoute } from "./components/ProtectedDashboardRoute";

// ─── Public pages ─────────────────────────────────────────────────────────────
import Home from "./pages/Home";
import About from "./pages/About";
import Ask from "@/pages/Ask";
import PayInvoice from "@/pages/PayInvoice";
import Chat from "./pages/Chat";
import Affiliates from "./pages/Affiliates";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AIDashboard from "./pages/AIDashboard";
import FacilitiesDashboard from "./pages/FacilitiesDashboard";
import AINetwork from "./pages/AINetwork";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import { PrivacyPolicy, TermsOfService, RefundPolicy, CookiePolicy, AffiliateTerms } from "./pages/LegalPage";
import Ridi from "./pages/Ridi";
import Portal from "./pages/Portal";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Department from "./pages/Department";
import Diagnosis from "./pages/Diagnosis";
import Policies from "./pages/Policies";
import Team from "./pages/Team";
import ClientIntake from "./pages/ClientIntake";
import TrackProject from "./pages/TrackProject";
import EventForm from "./pages/EventForm";

// ─── Department pages ─────────────────────────────────────────────────────────
import InnovationHub from "./pages/departments/InnovationHub";
import Studios from "./pages/departments/Studios";
import Systems from "./pages/departments/Systems";
import Bizdoc from "./pages/departments/Bizdoc";

// ─── Subdomain redirect pages ─────────────────────────────────────────────────
import { BizdocRedirect, SystemiseRedirect, SkillsRedirect } from "./pages/SubdomainRedirect";

// ─── Legacy staff/agent/admin portals ────────────────────────────────────────
import StaffDashboard from "./pages/StaffDashboard";
import ClientView from "./pages/ClientView";
import AgentDashboard from "./pages/AgentDashboard";
import AdminPanel from "./pages/AdminPanel";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import StaffLogin from "./pages/StaffLogin";

// ─── New dashboard login pages ────────────────────────────────────────────────
import CSOLogin from "./pages/cso/CSOLogin";
import CEOLogin from "./pages/ceo/CEOLogin";
import FounderLogin from "./pages/founder/FounderLogin";
import FinanceLogin from "./pages/finance/FinanceLogin";
import HRLogin from "./pages/hr/HRLogin";
import BizDevLogin from "./pages/bizdev/BizDevLogin";

// ─── Dashboard pages ──────────────────────────────────────────────────────────
import CSODashboardNew from "./pages/cso/CSODashboard";
import CEODashboard from "./pages/ceo-dashboard";
import FounderDashboard from "./pages/founder-dashboard";
import LeadDashboard from "./pages/lead-dashboard";
import MyTasksDashboard from "./pages/staff/my-tasks";
import CSODashboard from "./pages/cso-dashboard";
import FinanceDashboard from "./pages/finance-dashboard";
import RidiDashboard from "./pages/ridi-dashboard";
import InnovationDashboard from "./pages/innovation-dashboard";

// ─── Router ───────────────────────────────────────────────────────────────────

function Router() {
  return (
    <Switch>

      {/* ── Public pages ──────────────────────────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/track" component={TrackProject} />
      <Route path="/start" component={ClientIntake} />
      <Route path="/affiliates" component={Affiliates} />
      <Route path="/ridi" component={Ridi} />
      <Route path="/portal" component={Portal} />
      <Route path="/contact" component={Contact} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/policies" component={Policies} />
      <Route path="/team" component={Team} />
      <Route path="/ask" component={Ask} />
      <Route path="/chat" component={Chat} />
      <Route path="/event" component={EventForm} />
      <Route path="/pay/:invoiceRef" component={PayInvoice} />
      <Route path="/diagnosis" component={Diagnosis} />
      <Route path="/department/:slug" component={Department} />
      <Route path="/legal/:type" component={Legal} />

      {/* ── Legal pages ───────────────────────────────────────────────── */}
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/refunds" component={RefundPolicy} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/affiliate-terms" component={AffiliateTerms} />

      {/* ── Department pages ──────────────────────────────────────────── */}
      <Route path="/services/innovation-hub" component={InnovationHub} />
      <Route path="/services/studios" component={Studios} />
      <Route path="/services/systems" component={Systems} />
      <Route path="/services/bizdoc" component={Bizdoc} />

      {/* ── Subdomain redirects ───────────────────────────────────────── */}
      <Route path="/bizdoc" component={BizdocRedirect} />
      <Route path="/systemise" component={SystemiseRedirect} />
      <Route path="/skills" component={SkillsRedirect} />

      {/* ── OS / Internal tools ───────────────────────────────────────── */}
      <Route path="/os/ai" component={AIDashboard} />
      <Route path="/os/facilities" component={FacilitiesDashboard} />
      <Route path="/os/ai-network" component={AINetwork} />

      {/* ── Affiliate portal ──────────────────────────────────────────── */}
      <Route path="/affiliate/dashboard" component={AffiliateDashboard} />

      {/* ── New dashboard login pages ─────────────────────────────────── */}
      <Route path="/cso/login" component={CSOLogin} />
      <Route path="/ceo/login" component={CEOLogin} />
      <Route path="/founder/login" component={FounderLogin} />
      <Route path="/finance/login" component={FinanceLogin} />
      <Route path="/hr/login" component={HRLogin} />
      <Route path="/bizdev/login" component={BizDevLogin} />

      {/* ── Protected dashboard routes ────────────────────────────────── */}
      <Route path="/cso/dashboard">
        {() => (
          <ProtectedDashboardRoute role="cso">
            <CSODashboardNew />
          </ProtectedDashboardRoute>
        )}
      </Route>
      <Route path="/ceo/dashboard">
        {() => (
          <ProtectedDashboardRoute role="ceo">
            <CEODashboard />
          </ProtectedDashboardRoute>
        )}
      </Route>
      <Route path="/founder/dashboard">
        {() => (
          <ProtectedDashboardRoute role="founder">
            <FounderDashboard />
          </ProtectedDashboardRoute>
        )}
      </Route>
      <Route path="/finance/dashboard">
        {() => (
          <ProtectedDashboardRoute role="finance">
            <FinanceDashboard />
          </ProtectedDashboardRoute>
        )}
      </Route>

      {/* ── Legacy secret paths (preserved for backward compatibility) ── */}
      <Route path="/ceo-access-7x9m4" component={CEODashboard} />
      <Route path="/founder-access-k8p1q" component={FounderDashboard} />
      <Route path="/lead-dashboard" component={LeadDashboard} />
      <Route path="/my-tasks" component={MyTasksDashboard} />
      <Route path="/cso-dashboard" component={CSODashboard} />
      <Route path="/finance-dashboard" component={FinanceDashboard} />
      <Route path="/ridi-dashboard" component={RidiDashboard} />
      <Route path="/innovation-dashboard" component={InnovationDashboard} />

      {/* ── Legacy staff/agent/admin portals ─────────────────────────── */}
      <Route path="/staff" component={StaffDashboard} />
      <Route path="/staff/dashboard" component={StaffDashboard} />
      <Route path="/client/:clientRef" component={ClientView} />
      <Route path="/agent" component={AgentDashboard} />
      <Route path="/agent/dashboard" component={AgentDashboard} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/:tab" component={AdminPanel} />
      <Route path="/staff/dashboard/admin" component={AdminPanel} />
      <Route path="/hq-access-9f3k2" component={SuperAdminLogin} />
      <Route path="/staff-login" component={StaffLogin} />

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

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
