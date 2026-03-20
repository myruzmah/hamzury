/**
 * HAMZURY About Us Page
 * Route: /about
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";
const BRAND = "#1B4D3E";

const NAV_LINKS = [
  { href: "/services", label: "Our Services" },
  { href: "/ridi", label: "RIDI" },
  { href: "/about", label: "About Us" },
  { href: "/portal", label: "Portal", portal: true },
];

const PILLARS = [
  {
    number: "01",
    title: "Structure first.",
    body: "Every engagement begins with a clear scope, a named lead, and a documented process. We do not start work we cannot finish well.",
  },
  {
    number: "02",
    title: "Quality is non-negotiable.",
    body: "Nothing leaves HAMZURY without passing a review. We built a quality gate into the workflow because we take our name seriously.",
  },
  {
    number: "03",
    title: "Calm authority.",
    body: "We do not operate on urgency and noise. We plan, communicate clearly, and deliver on time — because that is what institutions do.",
  },
  {
    number: "04",
    title: "Impact is structural.",
    body: "Ten percent of every naira earned goes directly to RIDI — our social impact arm. This is not a policy. It is a founding principle.",
  },
];

const UNITS = [
  { name: "Systems", desc: "Digital infrastructure, web applications, AI workflows, and automation systems." },
  { name: "Studios", desc: "Brand identity, content production, social media management, and event media." },
  { name: "Bizdoc", desc: "CAC registration, compliance advisory, tax filing, and PENCOM documentation." },
  { name: "Innovation Hub", desc: "Executive training, robotics, digital skills, and the HALS learning platform." },
  { name: "RIDI", desc: "Rural digital inclusion — scholarships, community training, and talent conversion." },
];

export default function About() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navigation ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-10 w-10 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              l.portal ? (
                <Link key={l.href} href={l.href} className="nav-link"
                  style={{ border: `1.5px solid ${BRAND}`, borderRadius: "4px", padding: "4px 12px", color: BRAND, fontWeight: 600 }}>
                  {l.label}
                </Link>
              ) : (
                <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
              )
            ))}
          </nav>
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="py-20 md:py-28 border-b border-border" style={{ background: BRAND }}>
          <div className="container max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-8 opacity-70 hover:opacity-100 transition-opacity" style={{ color: "white" }}>
              <ArrowLeft size={13} /> Back to Home
            </Link>
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>About HAMZURY</p>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-6" style={{ color: "white" }}>
              We build institutions<br />that build others.
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
              HAMZURY is a multi-unit institution based in Jos, Nigeria. We help organisations register, grow, operate, and communicate — with structure, clarity, and calm authority.
            </p>
          </div>
        </section>

        {/* ── Origin ── */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <span className="brand-rule" />
                <h2 className="text-2xl font-semibold mb-0" style={{ color: "var(--charcoal)" }}>
                  Why HAMZURY exists.
                </h2>
              </div>
              <div className="space-y-5">
                <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                  Most organisations outgrow their structure before they realise it. The systems that got them here are the same ones slowing them down. The brand that launched the business no longer reflects what the business has become. The compliance documentation is scattered, incomplete, or missing entirely.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                  HAMZURY was founded to solve this. We work with founders, executives, and institutional leaders who are building for the long term — people who understand that the difference between a business and an institution is the quality of its systems.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                  Every project is documented, assigned a lead, and reviewed before delivery. Every engagement is built to outlast the project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="py-20 border-b border-border" style={{ background: "var(--milk)" }}>
          <div className="container max-w-4xl">
            <p className="label mb-10" style={{ color: BRAND }}>How we operate</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {PILLARS.map((p) => (
                <div key={p.number} className="bg-white rounded-sm p-7 border border-border">
                  <p className="text-xs font-bold mb-3" style={{ color: BRAND }}>{p.number}</p>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--charcoal)" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Units ── */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <span className="brand-rule" />
                <h2 className="text-2xl font-semibold" style={{ color: "var(--charcoal)" }}>Our service units.</h2>
                <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--body-text)" }}>
                  Each unit operates as a focused practice with its own lead, SOPs, and quality standards. Together, they form a complete institutional operating capability.
                </p>
              </div>
              <div className="space-y-5">
                {UNITS.map((u) => (
                  <div key={u.name} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--charcoal)" }}>{u.name}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--body-text)" }}>{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── RIDI ── */}
        <section className="py-20 border-b border-border" style={{ background: BRAND }}>
          <div className="container max-w-3xl text-center">
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Social Impact</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: "white" }}>
              RIDI — Rural Inclusion & Digital Impact.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
              Ten percent of every naira HAMZURY earns is directed to RIDI programmes — digital skills training, rural scholarships, and community education. This is structural, not optional. The best performers convert directly to HAMZURY staff, creating a self-renewing talent pipeline rooted in impact.
            </p>
            <Link href="/ridi" className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "white" }}>
              Learn about RIDI <ArrowRight size={11} />
            </Link>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="container max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Ready to build something that lasts?
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              Tell us what you are building. We will structure it, assign the right lead, and deliver with documentation.
            </p>
            <Link href="/start" className="btn-primary">
              Start your project <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-xs" style={{ color: "var(--muted-text)" }}>© 2026 HAMZURY. Built to last.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/affiliate-terms", label: "Affiliate Terms" },
              { href: "/careers", label: "Careers" },
              { href: "/press", label: "Press" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-xs hover:underline" style={{ color: "var(--muted-text)" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
