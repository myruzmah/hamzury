import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/ridi", label: "RIDI" },
  { href: "/affiliates", label: "Affiliates" },
  { href: "/portal", label: "Portal" },
];

const COMMISSION_STAGES = [
  { stage: "Lead Generation", pct: "12.5%", desc: "You refer a qualified lead. They make contact with HAMZURY." },
  { stage: "Conversion", pct: "12.5%", desc: "The lead converts to a paying client. Project begins." },
  { stage: "Execution (Staff)", pct: "40%", desc: "Distributed among the staff who execute the project." },
  { stage: "Department Lead", pct: "10%", desc: "The lead responsible for the department managing the project." },
  { stage: "Support (CEO/Finance/HR)", pct: "20%", desc: "Shared across operational support roles." },
  { stage: "Facilities", pct: "5%", desc: "Infrastructure and operational costs." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Apply", desc: "Submit your application. We review it within 48 hours." },
  { step: "02", title: "Get your link", desc: "You receive a unique referral link and code." },
  { step: "03", title: "Refer clients", desc: "Share your link. When someone starts a project through it, you are credited." },
  { step: "04", title: "Earn commissions", desc: "You earn 12.5% at lead stage and 12.5% at conversion. Paid after project delivery." },
];

export default function Affiliates() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);

  const applyMutation = trpc.affiliate.submitApplication.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setShowForm(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    applyMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-10 w-10 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: "var(--brand-muted)", color: "var(--brand)" }}>
              Affiliate Programme — Invite Only
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight mb-6">
              Earn by connecting<br />the right people to<br />the right institution.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              When you refer a client to HAMZURY and they start a project, you earn a commission at two stages — when they make contact, and when they pay. No cold selling. No pressure. Just introductions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {submitted ? (
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--brand)" }}>
                  <CheckCircle2 size={16} />
                  Application received. We will be in touch within 48 hours.
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Apply to join <ArrowRight size={14} />
                </button>
              )}
              <Link href="/ask" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5">
                Ask a question
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground mb-10">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="text-xs font-mono font-medium mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }}>{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{s.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission structure */}
        <section className="py-20 border-b border-border" style={{ background: "var(--brand-muted)" }}>
          <div className="container max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground mb-2">Commission structure</h2>
            <p className="text-sm text-muted-foreground mb-10">Every naira earned on a project is distributed across the people who made it happen.</p>
            <div className="space-y-3">
              {COMMISSION_STAGES.map((c) => (
                <div key={c.stage} className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-border">
                  <span className="text-lg font-bold flex-shrink-0 w-14" style={{ color: "var(--brand)" }}>{c.pct}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.stage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">Affiliate commissions (Lead Gen + Conversion = 25%) are paid after project delivery and full payment is confirmed. A 30-day cookie tracks referrals.</p>
          </div>
        </section>

        {/* Rules */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">What we expect</h2>
            <div className="space-y-4">
              {[
                "Refer people who genuinely need the service. Do not refer for the sake of commission.",
                "Do not make promises about pricing, timelines, or outcomes on HAMZURY's behalf.",
                "Affiliates are not sales agents. You introduce — HAMZURY qualifies and closes.",
                "Commissions are paid on completed, paid projects only.",
                "Affiliate status can be revoked for misrepresentation.",
              ].map((rule, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Apply to join</h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Full name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-brand/50 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-brand/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Phone number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-brand/50 transition-colors"
                    placeholder="+234..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Why do you want to join the affiliate programme?</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                    rows={3}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-brand/50 transition-colors resize-none"
                    placeholder="Tell us briefly..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {applyMutation.isPending ? "Submitting..." : "Submit application"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-xs text-muted-foreground">© 2026 HAMZURY. Built to last.</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/affiliate-terms", label: "Affiliate Terms" },
                { href: "/privacy", label: "Privacy" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="nav-link text-xs">{l.label}</Link>
              ))}
            </nav>
          </div>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav active="affiliates" />
    </div>
  );
}

// Shared mobile bottom nav component (inline for now)
function MobileBottomNav({ active }: { active?: string }) {
  const items = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/ask", label: "Search", icon: "🔍" },
    { href: "/track", label: "Track", icon: "📦" },
    { href: "/affiliates", label: "Affiliates", icon: "🤝" },
    { href: "/services", label: "Menu", icon: "☰" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex items-center justify-around h-14" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${active === item.label.toLowerCase() ? "font-semibold" : "text-muted-foreground"}`} style={active === item.label.toLowerCase() ? { color: "var(--brand)" } : {}}>
          <span className="text-base leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
