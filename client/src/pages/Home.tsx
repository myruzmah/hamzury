import { useState } from "react";
import { Link } from "wouter";
import MobileBottomNav from "@/components/MobileBottomNav";
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
    external: false,
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Chat",
    desc: "Tell us what you need — in the chat or via the intake form.",
  },
  {
    step: "02",
    title: "Ticket",
    desc: "We create a project ticket, assign a lead, and confirm scope.",
  },
  {
    step: "03",
    title: "Execute",
    desc: "Work begins. Your lead manages the process end to end.",
  },
  {
    step: "04",
    title: "Track",
    desc: "Follow progress in real time with your reference code.",
  },
  {
    step: "05",
    title: "Deliver",
    desc: "Reviewed, approved, and handed over with full documentation.",
  },
];

// Nav links: Our Services, RIDI, About Us, Portal
const NAV_LINKS: { href: string; label: string; portal?: boolean }[] = [
  { href: "/services", label: "Our Services" },
  { href: "/ridi", label: "RIDI" },
  { href: "/about", label: "About Us" },
  { href: "/portal", label: "Portal", portal: true },
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
              l.portal ? (
                <Link key={l.href} href={l.href} className="nav-link"
                  style={{ border: "1.5px solid #1B4D3E", borderRadius: "4px", padding: "4px 12px", color: "#1B4D3E", fontWeight: 600 }}>
                  {l.label}
                </Link>
              ) : (
                <Link key={l.href} href={l.href} className="nav-link">
                  {l.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile hamburger only — no Start a Project button in header */}
          <button
            className="md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
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
              className="text-base md:text-lg font-light leading-relaxed mb-4 max-w-lg"
              style={{ color: "var(--body-text)" }}
            >
              HAMZURY designs the systems, brands, and legal foundations
              organisations rely on to operate with structure and clarity.
            </p>
            <p className="text-xs mb-10 max-w-lg" style={{ color: "var(--muted-text)" }}>
              Trusted by founders, executives, and institutional leaders across Nigeria building for the long term.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary">
                Start your project <ArrowRight size={14} />
              </Link>
              <Link href="/track" className="btn-ghost">
                See how it works
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

      {/* ── Our Services ───────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div className="max-w-sm">
              <span className="brand-rule" />
              <h2 style={{ color: "var(--charcoal)" }}>Our services.</h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-2 text-xs font-semibold self-start md:self-auto"
              style={{ color: "var(--brand)" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {/* 4 service cards — 2x2 grid */}
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
                  <p className="text-xs font-medium mb-3 italic" style={{ color: "var(--muted-text)" }}>
                    {svc.problem}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                    {svc.outcome}
                  </p>

                </>
              );
              const deptHref = svc.slug === "innovation" ? "/services/innovation-hub" : svc.slug === "studios" ? "/services/studios" : svc.slug === "systems" ? "/services/systems" : "/services/bizdoc";
              return (
                <Link
                  key={svc.slug}
                  href={deptHref}
                  className="group bg-white p-8 md:p-10 hover:bg-gray-50 transition-colors block"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works: compact strip ─────────────────────────────────────── */}
      <section className="border-y border-border py-10" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-0">
            {/* Label */}
            <div className="md:w-40 shrink-0">
              <p className="label" style={{ color: "var(--brand)" }}>How it works</p>
            </div>
            {/* Steps */}
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
              {JOURNEY_STEPS.map((s, i) => (
                <div key={s.step} className="flex items-center gap-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: "var(--brand)", color: "white" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                      {s.title}
                    </span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <ArrowRight size={11} className="mx-3 shrink-0 hidden sm:block" style={{ color: "var(--muted-text)" }} />
                  )}
                </div>
              ))}
            </div>
            {/* CTA */}
            <div className="md:ml-8 shrink-0">
              <Link
                href="/start"
                className="inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "var(--brand)" }}
              >
                Begin <ArrowRight size={11} />
              </Link>
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
                { href: "/services", label: "Our Services" },
                { href: "/ridi", label: "RIDI" },
                { href: "/about", label: "About Us" },
                { href: "/team", label: "Team" },
                { href: "/contact", label: "Contact" },
                { href: "/start", label: "Start your project" },
                { href: "/track", label: "Track Project" },
                { href: "/portal", label: "Partner Portal" },
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
              © 2026 HAMZURY. Built to last.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {[{href:"/privacy",label:"Privacy"},{href:"/terms",label:"Terms"},{href:"/affiliate-terms",label:"Affiliate Terms"},{href:"/careers",label:"Careers"},{href:"/press",label:"Press"},{href:"/contact",label:"Contact"}].map(l=>(
                <Link key={l.href} href={l.href} className="text-xs hover:underline" style={{ color: "var(--muted-text)" }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
