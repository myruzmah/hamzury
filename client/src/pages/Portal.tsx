import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

type PortalTab = "staff" | "client" | "agent";

const PORTALS: { id: PortalTab; label: string; welcome: string }[] = [
  { id: "staff", label: "Staff", welcome: "Your workspace for tasks and resources." },
  { id: "client", label: "Client", welcome: "Track your project and access deliverables." },
  { id: "agent", label: "Agent", welcome: "Monitor referrals and commissions." },
];

export default function Portal() {
  const [activeTab, setActiveTab] = useState<PortalTab>("staff");
  const [, navigate] = useLocation();
  const activePortal = PORTALS.find((p) => p.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel — brand ──────────────────────────────────────────────── */}
      <div
        className="hidden md:flex md:w-2/5 lg:w-1/3 flex-col justify-between p-12 grain-overlay"
        style={{ background: "var(--brand)" }}
      >
        <div>
          <Link href="/" className="flex items-center gap-3 mb-16">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-10 w-10 object-contain rounded-sm" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white/80">
              HAMZURY
            </span>
          </Link>

          <span className="block w-8 h-px bg-white/30 mb-8" />
          <p className="text-2xl font-light leading-snug text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            {activePortal.welcome}
          </p>
          <p className="text-sm text-white/50 font-light">
            Secure portal access.
          </p>
        </div>

        <div>
          <p className="text-xs text-white/30 mb-1">© HAMZURY {new Date().getFullYear()}</p>
          <p className="text-xs text-white/30">Structure. Clarity. Calm authority.</p>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden border-b border-border">
          <div className="container flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowLeft size={13} /> Back
            </Link>
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">

            {/* Back link — desktop */}
            <Link href="/" className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-10 transition-colors">
              <ArrowLeft size={12} /> Back to site
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <span className="brand-rule" />
              <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--charcoal)" }}>
                Portal Access
              </h1>
              <p className="text-xs text-muted-foreground">
                Select your access type to continue.
              </p>
            </div>

            {/* Tab selector */}
            <div className="flex gap-1 p-1 rounded-sm mb-8" style={{ background: "var(--muted)" }}>
              {PORTALS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className="flex-1 py-2 text-xs font-semibold rounded-sm transition-all"
                  style={{
                    background: activeTab === p.id ? "white" : "transparent",
                    color: activeTab === p.id ? "var(--charcoal)" : "var(--muted-text)",
                    boxShadow: activeTab === p.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Forms */}
            {activeTab === "staff" && (
              <StaffLoginForm onSuccess={() => navigate("/staff/dashboard")} />
            )}
            {activeTab === "client" && (
              <ClientAccessForm onSuccess={(ref) => navigate(`/client/${ref}`)} />
            )}
            {activeTab === "agent" && (
              <AgentLoginForm onSuccess={() => navigate("/agent/dashboard")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Staff Login Form ─────────────────────────────────────────────────────────
function StaffLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.staffLogin.useMutation({
    onSuccess: () => { toast.success("Welcome back."); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate({ email, password }); }} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="staff-email" className="label">Email address</Label>
        <Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@hamzury.com" required className="h-11 rounded-sm text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="staff-password" className="label">Password</Label>
        <Input id="staff-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" required className="h-11 rounded-sm text-sm" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-sm text-sm font-semibold mt-2"
        style={{ background: "var(--brand)" }} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing in…" : (
          <span className="flex items-center gap-2">Sign in <ArrowRight size={13} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-1">
        Forgot password?{" "}
        <a href="mailto:hr@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>hr@hamzury.com</a>
      </p>
    </form>
  );
}

// ─── Client Access Form ───────────────────────────────────────────────────────
function ClientAccessForm({ onSuccess }: { onSuccess: (ref: string) => void }) {
  const [ref, setRef] = useState("");

  const lookupMutation = trpc.auth.clientLookup.useMutation({
    onSuccess: (data) => { toast.success("Project found."); onSuccess(data.clientRef); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); lookupMutation.mutate({ clientRef: ref.toUpperCase().trim() }); }} className="space-y-4">
      <div className="p-3.5 rounded-sm text-xs text-muted-foreground leading-relaxed" style={{ background: "var(--brand-muted)" }}>
        Enter your client reference number (e.g. <strong className="text-foreground">CLT-001</strong>) provided by your CSO contact.
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="client-ref" className="label">Reference number</Label>
        <Input id="client-ref" type="text" value={ref} onChange={(e) => setRef(e.target.value)}
          placeholder="CLT-001" required className="h-11 rounded-sm text-sm font-mono uppercase" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-sm text-sm font-semibold mt-2"
        style={{ background: "var(--brand)" }} disabled={lookupMutation.isPending}>
        {lookupMutation.isPending ? "Looking up…" : (
          <span className="flex items-center gap-2">Access project <ArrowRight size={13} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-1">
        No reference?{" "}
        <a href="mailto:cso@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>Contact CSO</a>
      </p>
    </form>
  );
}

// ─── Agent Login Form ─────────────────────────────────────────────────────────
function AgentLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.agentLogin.useMutation({
    onSuccess: () => { toast.success("Welcome back."); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate({ email, password }); }} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="agent-email" className="label">Email address</Label>
        <Input id="agent-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required className="h-11 rounded-sm text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="agent-password" className="label">Password</Label>
        <Input id="agent-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" required className="h-11 rounded-sm text-sm" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-sm text-sm font-semibold mt-2"
        style={{ background: "var(--brand)" }} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing in…" : (
          <span className="flex items-center gap-2">Sign in <ArrowRight size={13} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-1">
        Not yet an agent?{" "}
        <a href="mailto:bizdev@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>Apply to partner</a>
      </p>
    </form>
  );
}
