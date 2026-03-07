import { Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";

const services = [
  {
    id: "systems",
    name: "Systems",
    description:
      "End-to-end operational architecture — processes, SOPs, and infrastructure that make your business run without you.",
  },
  {
    id: "studios",
    name: "Studios",
    description:
      "Brand identity, visual communication, and design systems built for institutions that intend to last.",
  },
  {
    id: "bizdoc",
    name: "Bizdoc",
    description:
      "Business documentation, proposals, and strategic frameworks that communicate authority and precision.",
  },
  {
    id: "innovation",
    name: "Innovation Hub",
    description:
      "Research-led product development and emerging-technology integration for organisations ready to lead.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center text-white text-xs font-bold tracking-widest"
              style={{ background: "var(--brand)" }}
            >
              R&F
            </div>
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              Raven &amp; Finch
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#ridi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              RIDI
            </a>
            <Link
              href="/portal"
              className="text-sm px-4 py-2 rounded-sm border font-medium transition-colors"
              style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
            >
              Portal
            </Link>
          </nav>
          {/* Mobile portal link */}
          <Link href="/portal" className="md:hidden text-sm font-medium" style={{ color: "var(--brand)" }}>
            Portal
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="py-32 md:py-48" style={{ background: "oklch(99% 0.003 160)" }}>
        <div className="container max-w-4xl">
          <span className="brand-rule" />
          <h1
            className="text-4xl md:text-6xl font-semibold leading-tight mb-6"
            style={{ color: "var(--charcoal)", letterSpacing: "-0.03em" }}
          >
            Build an institution
            <br />
            that lasts.
          </h1>
          <p
            className="text-lg md:text-xl font-light mb-4 tracking-widest uppercase"
            style={{ color: "var(--brand)", letterSpacing: "0.15em" }}
          >
            Structure. Clarity. Calm Authority.
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mt-8">
            Raven &amp; Finch is a premium business acceleration firm and institutional design studio. We partner with
            founders and organisations to build the systems, identity, and documentation that transform ambitious
            ventures into enduring institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <a
              href="mailto:info@ravenandfinch.com"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-sm transition-opacity hover:opacity-90"
              style={{ background: "var(--brand)" }}
            >
              Begin a conversation
              <ArrowRight size={14} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-sm border transition-colors hover:bg-muted"
              style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────── */}
      <section id="services" className="py-24 md:py-32 bg-white">
        <div className="container">
          <div className="max-w-xl mb-16">
            <span className="brand-rule" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Four disciplines. One institution.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each department operates with precision and purpose, delivering work that is structured, clear, and built
              to endure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white p-10 group cursor-default"
              >
                <div
                  className="w-0 h-0.5 group-hover:w-8 transition-all duration-300 mb-6"
                  style={{ background: "var(--brand)" }}
                />
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
                  {s.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIDI Statement ─────────────────────────────────────────────── */}
      <section id="ridi" className="py-24 md:py-32" style={{ background: "var(--brand)" }}>
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-6">Our Commitment</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-snug">
            10% of profits fund rural impact programmes.
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            Through the RIDI initiative — Rural Impact &amp; Development Integration — every engagement with Raven &amp;
            Finch directly contributes to sustainable programmes in underserved communities across Nigeria.
          </p>
          <Link
            href="/ridi"
            className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/40 hover:border-white transition-colors pb-0.5"
          >
            Learn about RIDI
            <ExternalLink size={12} />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "var(--brand)" }}
              >
                R
              </div>
              <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
                Raven &amp; Finch
              </span>
            </div>
            <p className="text-xs text-muted-foreground">© Raven &amp; Finch 2026. All rights reserved.</p>
            <a
              href="mailto:info@ravenandfinch.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 block"
            >
              info@ravenandfinch.com
            </a>
          </div>
          <nav className="flex flex-wrap gap-6">
            <Link href="/ridi" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              RIDI
            </Link>
            <Link href="/portal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Staff Portal
            </Link>
            <Link href="/portal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Client Access
            </Link>
            <Link href="/portal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Agent Portal
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
