import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const FEATURED_DEPTS = [
  { code: "01", slug: "cso", name: "CSO", tagline: "Client gateway", desc: "Receives every inquiry and manages the client relationship from intake to delivery." },
  { code: "02", slug: "systems", name: "Systems", tagline: "Digital infrastructure", desc: "Builds websites, dashboards, automation, and operational technology." },
  { code: "03", slug: "studios", name: "Studios", tagline: "Brand architecture", desc: "Creates identity systems, content structures, and visual assets." },
  { code: "04", slug: "bizdoc", name: "Bizdoc", tagline: "Regulatory structure", desc: "Handles business registration, filings, and compliance documentation." },
  { code: "05", slug: "innovation", name: "Innovation", tagline: "Capability development", desc: "Designs structured training and practical learning programs." },
];

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/ridi", label: "RIDI" },
  { href: "/diagnosis", label: "Diagnosis" },
  { href: "/contact", label: "Contact" },
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
              href="/portal"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-sm"
              style={{ background: "var(--brand)", color: "white" }}
            >
              Portal
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
                href="/portal"
                className="mt-3 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm"
                style={{ background: "var(--brand)", color: "white" }}
                onClick={() => setMobileOpen(false)}
              >
                Portal Login
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
            {/* Eyebrow */}
            <p className="label mb-8" style={{ color: "var(--brand)" }}>
              HAMZURY — Institutional Business Development
            </p>

            {/* Headline */}
            <h1
              className="display mb-6"
              style={{ color: "var(--charcoal)" }}
            >
              Build institutions<br />that last.
            </h1>

            {/* Supporting sentence */}
            <p
              className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--body-text)" }}
            >
              HAMZURY designs the systems, brands, and legal foundations
              organizations rely on to operate with structure and clarity.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/diagnosis" className="btn-primary">
                Free Business Diagnosis <ArrowRight size={14} />
              </Link>
              <Link href="/services" className="btn-ghost">
                Our Services
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

      {/* ── Featured Services ──────────────────────────────────────────────── */}
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
              All 11 departments <ArrowRight size={12} />
            </Link>
          </div>

          {/* 5 featured departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {FEATURED_DEPTS.map((dept, i) => (
              <Link
                key={dept.slug}
                href={`/department/${dept.slug}`}
                className="group bg-white p-8 md:p-10 hover:bg-gray-50 transition-colors block"
                style={i === 4 ? { gridColumn: "span 1" } : {}}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="label" style={{ color: "var(--brand)" }}>
                    {dept.code}
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform"
                    style={{ color: "var(--brand)" }}
                  />
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--charcoal)" }}>
                  HAMZURY {dept.name}
                </h3>
                <p className="text-xs font-medium mb-4" style={{ color: "var(--muted-text)" }}>
                  {dept.tagline}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                  {dept.desc}
                </p>
              </Link>
            ))}

            {/* View all card */}
            <Link
              href="/services"
              className="group bg-white p-8 md:p-10 border-l-0 flex flex-col justify-between hover:bg-gray-50 transition-colors"
              style={{ minHeight: "200px" }}
            >
              <span className="label" style={{ color: "var(--muted-text)" }}>
                06 – 11
              </span>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--charcoal)" }}>
                  Growth, People, Ledger,<br />Executive, Founder, RIDI
                </p>
                <p className="flex items-center gap-2 text-xs font-semibold mt-4" style={{ color: "var(--brand)" }}>
                  View all departments <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── RIDI Statement ─────────────────────────────────────────────────── */}
      <section
        className="section-padding grain-overlay"
        style={{ background: "var(--brand)" }}
      >
        <div className="container max-w-2xl">
          <span className="block w-8 h-px bg-white/40 mb-10" />
          <p className="label mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            RIDI — Rural Innovation & Digital Literacy Development
          </p>
          <p
            className="text-xl md:text-2xl font-light leading-relaxed mb-4"
            style={{ color: "white", letterSpacing: "-0.015em" }}
          >
            Ten percent of profits support rural development.
          </p>
          <p className="text-sm font-light leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
            Programs focus on education and economic opportunity.
          </p>
          <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.7)" }}>
            Impact is tracked and reported.
          </p>
          <Link
            href="/ridi"
            className="inline-flex items-center gap-2 mt-10 text-xs font-semibold"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Learn about RIDI <ArrowRight size={12} />
          </Link>
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
                HAMZURY is an institutional business development firm in Nigeria.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                Departments operate as independent service providers within one system.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
                The institution builds organizations designed to last.
              </p>
              <div className="pt-4">
                <Link href="/contact" className="btn-ghost text-xs">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Diagnosis CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border" style={{ background: "var(--milk)" }}>
        <div className="container max-w-xl text-center">
          <span className="block w-8 h-px mx-auto mb-10" style={{ background: "var(--brand)" }} />
          <h2 className="text-2xl font-light mb-4" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            Not sure where to start?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: "var(--body-text)" }}>
            Answer five questions. Receive a personalised Business Health Report within minutes.
          </p>
          <Link href="/diagnosis" className="btn-primary">
            Free Business Diagnosis <ArrowRight size={14} />
          </Link>
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
                { href: "/ridi", label: "RIDI" },
                { href: "/diagnosis", label: "Diagnosis" },
                { href: "/contact", label: "Contact" },
                { href: "/portal", label: "Portal" },
                { href: "/legal/privacy", label: "Privacy" },
                { href: "/legal/terms", label: "Terms" },
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
