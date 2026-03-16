/**
 * HAMZURY Affiliate Dashboard
 * Affiliates enter their code to view their referrals, commissions, and pipeline.
 */
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Copy, TrendingUp, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const BRAND = "#1B4D3E";
const MILK = "#FDF5E6";

const STAGE_COLOR: Record<string, string> = {
  Lead: "#6b7280",
  Qualified: "#3b82f6",
  Proposal: "#f59e0b",
  Negotiation: "#8b5cf6",
  "Closed Won": "#10b981",
  "Closed Lost": "#ef4444",
};

const COMMISSION_COLOR: Record<string, string> = {
  Pending: "#f59e0b",
  Approved: "#3b82f6",
  Paid: "#10b981",
};

export default function AffiliateDashboard() {
  const [codeInput, setCodeInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeCode, setActiveCode] = useState("");

  const { data, isLoading, error } = trpc.affiliate.getMyStats.useQuery(
    { affiliateCode: activeCode },
    { enabled: submitted && activeCode.length > 0 }
  );

  function handleSubmit() {
    if (!codeInput.trim()) return;
    setActiveCode(codeInput.trim().toUpperCase());
    setSubmitted(true);
  }

  const referralLink = activeCode
    ? `https://hamzury.com/start?ref=${activeCode}`
    : "";

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: MILK }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white" style={{ borderColor: "#e5e7eb" }}>
        <Link href="/">
          <span className="font-semibold text-sm tracking-[0.15em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
        </Link>
        <Link href="/affiliates" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={12} /> Affiliate Programme
        </Link>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {!submitted || (!data && !isLoading) ? (
            /* Login with affiliate code */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND }}>
                Affiliate Portal
              </p>
              <h1 className="text-3xl font-light mb-2" style={{ color: "#1a1a1a" }}>
                Your referral dashboard.
              </h1>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Enter your affiliate code to view your referrals, commissions, and pipeline performance.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="e.g. AFF-HAMZURY-001"
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-border bg-white font-mono tracking-wider focus:outline-none"
                  style={{ borderColor: "#d1d5db" }}
                />
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: BRAND }}
                >
                  View Dashboard
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg border text-sm" style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                  <AlertCircle size={14} />
                  Affiliate code not found. Please check and try again.
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-5">
                Not yet an affiliate?{" "}
                <Link href="/affiliates" className="underline" style={{ color: BRAND }}>Apply here</Link>
              </p>
            </div>

          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: BRAND }} />
              <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </div>

          ) : data ? (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-5">

              {/* Welcome header */}
              <div className="rounded-xl p-5 text-white" style={{ background: BRAND }}>
                <p className="text-xs font-medium tracking-widest uppercase text-white/60 mb-1">Affiliate Dashboard</p>
                <h2 className="text-xl font-light">{data.name}</h2>
                <p className="text-sm text-white/70 mt-0.5">{data.email}</p>
                <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-xs text-white/70 font-mono">{referralLink}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(referralLink); toast.success("Referral link copied"); }}
                    className="ml-auto text-white/70 hover:text-white transition-colors"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Referrals", value: data.totalReferrals, icon: Users, color: "#3b82f6" },
                  { label: "Closed Won", value: data.closedReferrals, icon: CheckCircle2, color: "#10b981" },
                  { label: "Earned (Paid)", value: `₦${(data.totalEarned || 0).toLocaleString()}`, icon: TrendingUp, color: BRAND },
                  { label: "Pending", value: `₦${(data.pendingEarned || 0).toLocaleString()}`, icon: Clock, color: "#f59e0b" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-xl border p-4" style={{ borderColor: "#e5e7eb" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} style={{ color }} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: "#1a1a1a" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Referrals table */}
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "#e5e7eb" }}>
                  <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>Your Referrals</p>
                </div>
                {data.referrals.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-muted-foreground">No referrals yet. Share your link to get started.</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(referralLink); toast.success("Referral link copied"); }}
                      className="mt-3 text-xs font-medium px-4 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                      style={{ color: BRAND }}
                    >
                      Copy referral link
                    </button>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "#f3f4f6" }}>
                    {data.referrals.map((r) => (
                      <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{r.clientName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.referralDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: (STAGE_COLOR[r.pipelineStage] || "#6b7280") + "18", color: STAGE_COLOR[r.pipelineStage] || "#6b7280" }}
                          >
                            {r.pipelineStage}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: (COMMISSION_COLOR[r.commissionStatus] || "#6b7280") + "18", color: COMMISSION_COLOR[r.commissionStatus] || "#6b7280" }}
                          >
                            {r.commissionStatus}
                          </span>
                          {r.commissionEstimate ? (
                            <span className="text-xs font-mono text-muted-foreground">₦{r.commissionEstimate.toLocaleString()}</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* How commissions work */}
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-3 text-muted-foreground">How Commissions Work</p>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p>You earn a commission when a client you referred completes a paid engagement with HAMZURY.</p>
                  <p>Commission rates vary by service. Your HAMZURY contact will confirm the rate for each closed deal.</p>
                  <p>Commissions are paid monthly to your registered bank account after the client's payment clears.</p>
                </div>
                <a
                  href="mailto:affiliates@hamzury.com"
                  className="inline-block mt-3 text-xs font-medium"
                  style={{ color: BRAND }}
                >
                  Contact affiliates@hamzury.com for questions
                </a>
              </div>

              <button
                onClick={() => { setSubmitted(false); setActiveCode(""); setCodeInput(""); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
