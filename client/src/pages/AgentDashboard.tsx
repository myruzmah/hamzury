import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Users,
  DollarSign,
  BookOpen,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Copy,
  CheckCheck,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type PipelineStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";

const STAGE_STYLES: Record<PipelineStage, string> = {
  "Lead": "bg-gray-100 text-gray-600",
  "Qualified": "bg-blue-50 text-blue-700",
  "Proposal": "bg-purple-50 text-purple-700",
  "Negotiation": "bg-yellow-50 text-yellow-700",
  "Closed Won": "bg-green-50 text-green-700",
  "Closed Lost": "bg-red-50 text-red-600",
};

const COMMISSION_STYLES: Record<string, string> = {
  "Pending": "bg-yellow-50 text-yellow-700",
  "Approved": "bg-blue-50 text-blue-700",
  "Paid": "bg-green-50 text-green-700",
};

const navItems = [
  { id: "referrals", label: "My Referrals", icon: <Users size={16} /> },
  { id: "commissions", label: "Commission Summary", icon: <DollarSign size={16} /> },
  { id: "resources", label: "Resources", icon: <BookOpen size={16} /> },
];

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function AgentDashboard() {
  const [activeSection, setActiveSection] = useState("referrals");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { toast.success("Signed out."); navigate("/portal"); },
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
        style={{ background: "oklch(98.5% 0.005 160)" }}
      >
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--brand)" }}>
              R
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              Raven &amp; Finch
            </span>
          </Link>
          <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-3" style={{ background: "var(--brand)" }}>
            A
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>Agent</p>
          <p className="text-xs text-muted-foreground">Referral Partner</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors text-left"
              style={{
                background: activeSection === item.id ? "var(--brand-muted)" : "transparent",
                color: activeSection === item.id ? "var(--brand)" : "var(--muted-text)",
                fontWeight: activeSection === item.id ? 500 : 400,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-border flex items-center px-6 gap-4">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} className="text-muted-foreground" />
          </button>
          <h1 className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
            {navItems.find((n) => n.id === activeSection)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">Agent Portal</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "var(--brand)" }}>
              A
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {activeSection === "referrals" && <ReferralsSection />}
          {activeSection === "commissions" && <CommissionsSection />}
          {activeSection === "resources" && <ResourcesSection />}
        </div>
      </main>
    </div>
  );
}

// ─── Referrals Section ────────────────────────────────────────────────────────
function ReferralsSection() {
  const { data: referrals, isLoading } = trpc.agent.myReferrals.useQuery();

  if (isLoading) return <SectionSkeleton />;

  return (
    <div>
      <SectionHeader title="My Referrals" subtitle="All clients referred by you and their current pipeline status." />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {["Client", "Date Referred", "Pipeline Stage", "Commission Est.", "Status"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals?.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-medium text-xs" style={{ color: "var(--charcoal)" }}>{r.clientName}</p>
                  {r.clientEmail && <p className="text-xs text-muted-foreground">{r.clientEmail}</p>}
                </td>
                <td className="py-3.5 px-4 text-xs text-muted-foreground">{formatDate(r.referralDate)}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${STAGE_STYLES[r.pipelineStage as PipelineStage]}`}>
                    {r.pipelineStage}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                  {r.commissionEstimate ? formatCurrency(r.commissionEstimate) : "TBD"}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${COMMISSION_STYLES[r.commissionStatus]}`}>
                    {r.commissionStatus}
                  </span>
                </td>
              </tr>
            ))}
            {(!referrals || referrals.length === 0) && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  No referrals yet. Use your referral link to start earning.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Commissions Section ──────────────────────────────────────────────────────
function CommissionsSection() {
  const { data: summary, isLoading } = trpc.agent.commissionSummary.useQuery();

  if (isLoading) return <SectionSkeleton />;

  const cards = [
    { label: "Total Earned (Paid)", value: summary?.paid ?? 0, color: "var(--brand)" },
    { label: "Approved (Pending Payment)", value: summary?.approved ?? 0, color: "oklch(45% 0.1 240)" },
    { label: "Pending Approval", value: summary?.pending ?? 0, color: "oklch(45% 0.1 80)" },
  ];

  return (
    <div>
      <SectionHeader title="Commission Summary" subtitle="Your earnings overview for all referrals." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="luxury-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{c.label}</p>
            <p className="text-2xl font-semibold" style={{ color: c.color }}>
              {formatCurrency(c.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="p-5 rounded-sm border border-border text-sm text-muted-foreground" style={{ background: "var(--brand-muted)" }}>
        Commission payments are processed monthly. For queries, contact{" "}
        <a href="mailto:finance@ravenandfinch.com" className="underline" style={{ color: "var(--brand)" }}>
          finance@ravenandfinch.com
        </a>
      </div>
    </div>
  );
}

// ─── Resources Section ────────────────────────────────────────────────────────
function ResourcesSection() {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/portal?ref=AGT-DEMO`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied.");
    setTimeout(() => setCopied(false), 2000);
  };

  const resources = [
    { title: "Agent Handbook", description: "Complete guide to the referral programme, commission structure, and onboarding process.", href: "#" },
    { title: "Brand Assets", description: "Approved logos, banners, and marketing materials for use in your referral activities.", href: "#" },
    { title: "Service Overview Deck", description: "A presentation-ready overview of Raven & Finch services for prospective clients.", href: "#" },
    { title: "Commission Rate Card", description: "Current commission rates by service package and deal size.", href: "#" },
  ];

  return (
    <div>
      <SectionHeader title="Resources" subtitle="Marketing materials and tools to support your referral activities." />

      {/* Referral link */}
      <div className="luxury-card mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-sm font-mono truncate">{referralLink}</code>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-sm transition-colors"
            style={{ background: "var(--brand)", color: "white" }}
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Resource links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.href}
            className="p-6 rounded-sm border border-border hover:border-primary/40 transition-colors group"
            onClick={(e) => { e.preventDefault(); toast.info("Resource coming soon."); }}
          >
            <p className="text-sm font-medium mb-1 group-hover:text-primary transition-colors" style={{ color: "var(--charcoal)" }}>
              {r.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="brand-rule" />
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-muted rounded" />
      <div className="h-4 w-72 bg-muted rounded" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-muted rounded" />)}
      </div>
    </div>
  );
}
