import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, User, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type PortalTab = "staff" | "client" | "agent";

export default function Portal() {
  const [activeTab, setActiveTab] = useState<PortalTab>("staff");
  const [, navigate] = useLocation();

  const portals: { id: PortalTab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: "staff", label: "Staff", icon: <User size={16} />, description: "Internal team members" },
    { id: "client", label: "Client", icon: <Briefcase size={16} />, description: "Project stakeholders" },
    { id: "agent", label: "Agent", icon: <Users size={16} />, description: "Referral partners" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft size={14} />
            Back to site
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--brand)" }}
            >
              H
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase hidden sm:block" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <span className="brand-rule" />
            <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>
              Portal Access
            </h1>
            <p className="text-sm text-muted-foreground">
              Select your access type and sign in to your workspace.
            </p>
          </div>

          {/* Tab selector */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {portals.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-sm border text-center transition-all"
                style={{
                  borderColor: activeTab === p.id ? "var(--brand)" : "var(--border)",
                  background: activeTab === p.id ? "var(--brand-muted)" : "white",
                  color: activeTab === p.id ? "var(--brand)" : "var(--muted-text)",
                }}
              >
                {p.icon}
                <span className="text-xs font-semibold">{p.label}</span>
                <span className="text-xs opacity-70 hidden sm:block">{p.description}</span>
              </button>
            ))}
          </div>

          {/* Login forms */}
          {activeTab === "staff" && <StaffLoginForm onSuccess={() => navigate("/dashboard/staff")} />}
          {activeTab === "client" && <ClientAccessForm onSuccess={(ref) => navigate(`/client/${ref}`)} />}
          {activeTab === "agent" && <AgentLoginForm onSuccess={() => navigate("/dashboard/agent")} />}
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          © HAMZURY 2026 &nbsp;·&nbsp; Secure portal access &nbsp;·&nbsp; Structure · Clarity · Calm Authority
        </p>
      </footer>
    </div>
  );
}

// ─── Staff Login Form ─────────────────────────────────────────────────────────
function StaffLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.staffLogin.useMutation({
    onSuccess: () => {
      toast.success("Welcome back.");
      onSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="staff-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Email address
        </Label>
        <Input
          id="staff-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@hamzury.com"
          required
          className="h-11 rounded-sm border-border focus:border-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="staff-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Password
        </Label>
        <Input
          id="staff-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="h-11 rounded-sm border-border focus:border-primary"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 rounded-sm text-sm font-medium"
        style={{ background: "var(--brand)" }}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in…" : (
          <span className="flex items-center gap-2">Sign in to Staff Portal <ArrowRight size={14} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-2">
        Forgot your password? Contact{" "}
        <a href="mailto:hr@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>
          hr@hamzury.com
        </a>
      </p>
    </form>
  );
}

// ─── Client Access Form ───────────────────────────────────────────────────────
function ClientAccessForm({ onSuccess }: { onSuccess: (ref: string) => void }) {
  const [ref, setRef] = useState("");

  const lookupMutation = trpc.auth.clientLookup.useMutation({
    onSuccess: (data) => {
      toast.success("Project found. Redirecting…");
      onSuccess(data.clientRef);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupMutation.mutate({ clientRef: ref.toUpperCase().trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 rounded-sm text-sm text-muted-foreground" style={{ background: "var(--brand-muted)" }}>
        Enter your HAMZURY client reference number (e.g. <strong>CLT-001</strong>) provided by your CSO contact to access your project dashboard.
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="client-ref" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reference number
        </Label>
        <Input
          id="client-ref"
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="CLT-001"
          required
          className="h-11 rounded-sm border-border focus:border-primary font-mono uppercase"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 rounded-sm text-sm font-medium"
        style={{ background: "var(--brand)" }}
        disabled={lookupMutation.isPending}
      >
        {lookupMutation.isPending ? "Looking up…" : (
          <span className="flex items-center gap-2">Access my project <ArrowRight size={14} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-2">
        Don't have a reference number?{" "}
        <a href="mailto:cso@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>
          Contact CSO
        </a>
      </p>
    </form>
  );
}

// ─── Agent Login Form ─────────────────────────────────────────────────────────
function AgentLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.agentLogin.useMutation({
    onSuccess: () => {
      toast.success("Welcome back.");
      onSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="agent-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Email address
        </Label>
        <Input
          id="agent-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="h-11 rounded-sm border-border focus:border-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="agent-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Password
        </Label>
        <Input
          id="agent-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="h-11 rounded-sm border-border focus:border-primary"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 rounded-sm text-sm font-medium"
        style={{ background: "var(--brand)" }}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in…" : (
          <span className="flex items-center gap-2">Sign in to Agent Portal <ArrowRight size={14} /></span>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-2">
        Not yet an agent?{" "}
        <a href="mailto:bizdev@hamzury.com" className="underline" style={{ color: "var(--brand)" }}>
          Apply to partner
        </a>
      </p>
    </form>
  );
}
