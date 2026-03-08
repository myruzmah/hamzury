import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Menu, X, CheckCircle2 } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  {
    code: "01",
    slug: "innovation",
    name: "Innovation Hub",
    problem: "Your people lack the skills your organisation needs to grow.",
    outcome: "Structured training programs — executive, youth, and digital — that build lasting capability from the inside out.",
    external: false,
  },
  {
    code: "02",
    slug: "studios",
    name: "Studios",
    problem: "Your brand does not reflect the quality of what you actually do.",
    outcome: "Identity systems, content strategy, social media management, and media production built to institutional standard.",
    external: false,
  },
  {
    code: "03",
    slug: "systems",
    name: "Systems",
    problem: "Your operations run on manual processes that slow everything down.",
    outcome: "Business websites, web applications, automation workflows, and AI-powered systems that make your organisation run without friction.",
    external: false,
  },
  {
    code: "04",
    slug: "bizdoc",
    name: "Bizdoc",
    problem: "Your business is not properly registered, compliant, or legally protected.",
    outcome: "CAC registration, annual returns, tax filings, PENCOM compliance, and full regulatory advisory — done correctly, on time.",
    external: true,
    externalUrl: "https://bizdoc.hamzury.com",
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Enquire",
    desc: "Tell us what you need. No account required. Takes under three minutes.",
  },
  {
    step: "02",
    title: "Brief",
    desc: "We review your submission and send you a structured project brief for confirmation.",
  },
  {
    step: "03",
    title: "Match",
    desc: "Your project is assigned to the right department and team lead.",
  },
  {
    step: "04",
    title: "Build",
    desc: "Work begins. You track progress in real time using your reference code.",
  },
  {
    step: "05",
    title: "Deliver",
    desc: "Your deliverable is reviewed, approved, and handed over — with documentation.",
  },
];

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/portal", label: "Portal" },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={HAMZURY_LOGO}
              alt="HAMZURY"
              className="h-10 w-10 object-contain rounded-sm"
            />
            <span
              className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block"
              style={{ color: "var(--brand)" }}
            >
              HAMZURY
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/start"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-sm"
              style={{ background: "var(--brand)", color: "white" }}
            >
              Start a Project
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/start"
                className="mt-3 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm"
                style={{ background: "var(--brand)", color: "white" }}
                onClick={() => setMobileOpen(false)}
              >
                Start a Project
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="grain-overlay pt-36 pb-28 md:pt-48 md:pb-36"
        style={{ background: "var(--milk)" }}
      >
        <div className="container">
          <div className="max-w-2xl">
            <p className="label mb-8" style={{ color: "var(--brand)" }}>
              HAMZURY — Institutional Business Development
            </p>
            <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
              Build institutions<br />that last.
            </h1>
            <p
              className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--body-text)" }}
            >
              HAMZURY designs the systems, brands, and legal foundations
              organisations rely on to operate with structure and clarity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary">
                Start a Project <ArrowRight size={14} />
              </Link>
              <Link href="/track" className="btn-ghost">
                Track My Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tagline strip ──────────────────────────────────────────────────── */}
      <div className="border-y border-border py-4" style={{ background: "white" }}>
        <div className="container">
          <p className="label text-center" style={{ color: "var(--muted-text)" }}>
            Structure. &nbsp;&nbsp; Clarity. &nbsp;&nbsp; Calm authority.
          </p>
        </div>
      </div>

      {/* ── What We Build ──────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div className="max-w-sm">
              <span className="brand-rule" />
              <h2 style={{ color: "var(--charcoal)" }}>What we build.</h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-2 text-xs font-semibold self-start md:self-auto"
              style={{ color: "var(--brand)" }}
            >
              All services <ArrowRight size={12} />
            </Link>
          </div>

          {/* 4 service cards — 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {SERVICES.map((svc) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <span className="label" style={{ color: "var(--brand)" }}>{svc.code}</span>
                    <ArrowRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform"
                      style={{ color: "var(--brand)" }}
                    />
                  </div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
                    {svc.name}
                  </h3>
                  {/* Problem statement */}
                  <p className="text-xs font-medium mb-3 italic" style={{ color: "var(--muted-text)" }}>
                    {svc.problem}
                  </p>
                  {/* Outcome */}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                    {svc.outcome}
                  </p>
                  {svc.external && (
                    <p className="mt-4 text-xs font-semibold flex items-center gap-1" style={{ color: "var(--brand)" }}>
                      Visit Bizdoc <ArrowRight size={11} />
                    </p>
                  )}
                </>
              );
              return svc.external ? (
                <a
                  key={svc.slug}
                  href={svc.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-8 md:p-10 hover:bg-gray-50 transition-colors block"
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={svc.slug}
                  href={`/department/${svc.slug}`}
                  className="group bg-white p-8 md:p-10 hover:bg-gray-50 transition-colors block"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5-Step Client Journey ──────────────────────────────────────────── */}
      <section
        className="section-padding grain-overlay"
        style={{ background: "var(--brand)" }}
      >
        <div className="container">
          <div className="max-w-sm mb-14">
            <span className="block w-8 h-px bg-white/30 mb-10" />
            <p className="label mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              How it works
            </p>
            <h2 className="text-2xl md:text-3xl font-light" style={{ color: "white", letterSpacing: "-0.02em" }}>
              From enquiry<br />to delivery.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10">
            {JOURNEY_STEPS.map((s, i) => (
              <div
                key={s.step}
                className="p-6 md:p-8"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)" }}
              >
                <p className="label mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {s.step}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "white" }}>
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-sm"
              style={{ background: "white", color: "var(--brand)" }}
            >
              Begin your project <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
            <div>
              <span className="brand-rule" />
              <h2 className="mb-6" style={{ color: "var(--charcoal)" }}>
                About HAMZURY.
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                HAMZURY is an institutional business development firm operating across Nigeria.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                Four departments — Innovation Hub, Studios, Systems, and Bizdoc — operate as independent service providers within one coordinated institution.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                Every engagement is structured, documented, and delivered to a standard that outlasts the project.
              </p>
              <div className="pt-4">
                <Link href="/services" className="btn-ghost text-xs">
                  Explore our services <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12" style={{ background: "white" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--charcoal)" }}>
                  HAMZURY
                </p>
                <p className="text-xs" style={{ color: "var(--muted-text)" }}>
                  Structure. Clarity. Calm authority.
                </p>
              </div>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/services", label: "Services" },
                { href: "/start", label: "Start a Project" },
                { href: "/track", label: "Track Project" },
                { href: "/portal", label: "Partner Portal" },
                { href: "/legal/privacy", label: "Privacy" },
                { href: "/legal/terms", label: "Terms" },
                { href: "/staff-login", label: "Staff" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="nav-link text-xs">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--muted-text)" }}>
              © {new Date().getFullYear()} HAMZURY. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                { label: "info@hamzury.com", href: "mailto:info@hamzury.com" },
                { label: "innovation@hamzury.com", href: "mailto:innovation@hamzury.com" },
              ].map((e) => (
                <a key={e.href} href={e.href} className="text-xs hover:underline" style={{ color: "var(--muted-text)" }}>
                  {e.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
