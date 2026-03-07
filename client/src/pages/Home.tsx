import { Link } from "wouter";
import { ArrowRight, MapPin, Users, Globe, Zap } from "lucide-react";

const SERVICES = [
  {
    code: "01",
    name: "Systems",
    tagline: "Digital Infrastructure",
    description:
      "Websites, CRMs, AI workflows, dashboards, and automation systems. We build the digital backbone your institution runs on — and we maintain it with the same rigour we built it with.",
  },
  {
    code: "02",
    name: "Studios",
    tagline: "Brand & Content",
    description:
      "Brand identity, visual production, social media systems, podcast production, and faceless content channels. Every asset is built to the HAMZURY quality standard: Apple-level clean, properly branded, and ready to frame.",
  },
  {
    code: "03",
    name: "Bizdoc",
    tagline: "Compliance & Registration",
    description:
      "CAC incorporation, annual returns, tax registration, PENCOM setup, and regulatory licensing. We handle the documentation that makes your institution legally sound and operationally credible.",
  },
  {
    code: "04",
    name: "Innovation Hub",
    tagline: "Training & Development",
    description:
      "Training programs, bootcamps, and cohort-based education. We scholarship 100+ people per cohort, train them in 3 weeks, and convert them into interns and multi-language content creators.",
  },
];

const STATS = [
  { value: "30+", label: "Staff" },
  { value: "2", label: "Locations — Jos & Abuja" },
  { value: "100+", label: "Trained per cohort" },
  { value: "10%", label: "Profits to RIDI" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center text-white text-sm font-bold tracking-tight"
              style={{ background: "var(--brand)" }}
            >
              H
            </div>
            <div>
              <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>
                HAMZURY
              </span>
              <span className="hidden sm:block text-xs text-muted-foreground tracking-wider" style={{ marginTop: "-2px" }}>
                Institutional Operating System
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Services", href: "#services" },
              { label: "RIDI", href: "/ridi" },
              { label: "Portal", href: "/portal" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-medium tracking-wider uppercase transition-colors text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/portal"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-sm transition-colors"
            style={{ background: "var(--brand)", color: "white" }}
          >
            Enter Portal
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden"
        style={{ background: "var(--milk)" }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(oklch(85% 0.01 160 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(85% 0.01 160 / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl">
            {/* Location badge */}
            <div className="flex items-center gap-2 mb-8">
              <MapPin size={12} style={{ color: "var(--brand)" }} />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                Jos HQ · Abuja Operations · Africa-First
              </span>
            </div>

            <span className="brand-rule" />

            <h1
              className="text-4xl md:text-6xl font-semibold mb-6 leading-tight"
              style={{ color: "var(--charcoal)", letterSpacing: "-0.03em" }}
            >
              Structure.
              <br />
              Clarity.
              <br />
              <span style={{ color: "var(--brand)" }}>Calm Authority.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-xl">
              HAMZURY is a premium business solutions institution — not a startup finding itself.
              We operate with the calm precision of Apple, the analytical rigour of McKinsey,
              and the cultural authority of the strongest African institutions.
            </p>

            <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-xl">
              From the first WhatsApp message to the final Delivery Dossier, every step is
              designed, every handoff is documented, and every department knows exactly what it owns.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#services"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-colors"
                style={{ background: "var(--brand)", color: "white" }}
              >
                Our Services
                <ArrowRight size={14} />
              </a>
              <Link
                href="/portal"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border border-border transition-colors hover:border-primary/40"
                style={{ color: "var(--charcoal)" }}
              >
                Access Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-border py-8" style={{ background: "white" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-8 py-6 text-center">
                <p className="text-2xl font-semibold mb-1" style={{ color: "var(--brand)" }}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-14">
            <span className="brand-rule" />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              What We Build
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Four departments.
              <br />
              One institution.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every department at HAMZURY is a completely standalone service provider —
              operating like its own premium company within the institution, bound by shared
              standards and a single source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {SERVICES.map((svc) => (
              <div
                key={svc.code}
                className="bg-white p-10 group hover:bg-milk transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-xs font-mono font-semibold tracking-widest"
                    style={{ color: "var(--brand)" }}
                  >
                    {svc.code}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {svc.tagline}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--charcoal)" }}
                >
                  {svc.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operating Philosophy ─────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="brand-rule" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                How We Operate
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ color: "var(--charcoal)" }}>
                The Standalone
                <br />
                Client-Service Model
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The most important decision HAMZURY has made is this: every department is a
                standalone service provider, and every other department is its client. This is
                not a metaphor — it is the operating law of the institution.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                If it is not in the Central Master Tracker, it does not exist. No verbal
                agreements. No loose tasks. Every input, output, and handoff is documented —
                making everything traceable, measurable, and scalable.
              </p>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--brand)" }}
              >
                Access your portal <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Zap size={16} />,
                  title: "Structure",
                  body: "Every input, output, and handoff is documented. No verbal agreements. No loose tasks.",
                },
                {
                  icon: <Globe size={16} />,
                  title: "Clarity",
                  body: "Every department knows exactly what it owns, what it delivers, and who receives it.",
                },
                {
                  icon: <Users size={16} />,
                  title: "Calm Authority",
                  body: "HAMZURY does not rush, scramble, or improvise. It moves deliberately and delivers consistently.",
                },
              ].map((p) => (
                <div key={p.title} className="luxury-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-7 h-7 rounded-sm flex items-center justify-center"
                      style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
                    >
                      {p.icon}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                      {p.title}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RIDI Soul Statement ───────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "var(--brand)" }}
      >
        <div className="container max-w-3xl text-center">
          <span className="block w-10 h-0.5 bg-white/40 mx-auto mb-8" />
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
            The RIDI Soul
          </p>
          <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6 leading-tight">
            10% of every profit
            <br />
            goes to rural impact.
          </h2>
          <p className="text-sm text-white/75 leading-relaxed mb-8 max-w-xl mx-auto">
            HAMZURY is bound by the RIDI (Rural Innovation &amp; Digital Literacy Development
            Initiative) soul principle. This is not a donation — it is a structural commitment
            embedded in our Finance department's monthly rituals and reported to the Founder.
            4 cohorts per year. 100 trainees each. 400 lives changed annually.
          </p>
          <Link
            href="/ridi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/30 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors"
          >
            Learn about RIDI <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Client Journey Preview ────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-12">
            <span className="brand-rule" />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              The Client Experience
            </p>
            <h2 className="text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              From first message
              <br />
              to final delivery.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every client engagement follows a documented 12-step journey — from the first
              WhatsApp message through requirements collection, department dispatch, quality
              gate, and final Delivery Dossier with a Founder's note.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {[
              { step: "01", label: "Lead Intake", desc: "WhatsApp automation qualifies and logs the lead" },
              { step: "02", label: "Package & Invoice", desc: "CSO recommends the right service package" },
              { step: "03", label: "Department Dispatch", desc: "Placeholder tasks auto-assigned to all departments" },
              { step: "04", label: "Delivery Dossier", desc: "Quality-gated output with Founder's personal note" },
            ].map((s) => (
              <div key={s.step} className="bg-white p-8">
                <span
                  className="text-xs font-mono font-semibold tracking-widest mb-4 block"
                  style={{ color: "var(--brand)" }}
                >
                  {s.step}
                </span>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--charcoal)" }}>
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--brand)" }}
                >
                  H
                </div>
                <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
                  HAMZURY
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Africa's Institutional Backbone. Headquartered in Jos, Nigeria.
                Operational presence in Abuja.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Structure · Clarity · Calm Authority
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
              <div>
                <p className="font-semibold uppercase tracking-wider text-muted-foreground mb-3">Services</p>
                {["Systems", "Studios", "Bizdoc", "Innovation Hub"].map((s) => (
                  <p key={s} className="text-muted-foreground mb-1.5">{s}</p>
                ))}
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-muted-foreground mb-3">Institution</p>
                {[
                  { label: "RIDI Programme", href: "/ridi" },
                  { label: "Staff Portal", href: "/portal" },
                  { label: "Client Access", href: "/portal" },
                  { label: "Agent Portal", href: "/portal" },
                ].map((l) => (
                  <p key={l.label} className="mb-1.5">
                    <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </p>
                ))}
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</p>
                <p className="text-muted-foreground mb-1.5">Jos, Nigeria (HQ)</p>
                <p className="text-muted-foreground mb-1.5">Abuja, Nigeria</p>
                <a
                  href="mailto:info@hamzury.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@hamzury.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © HAMZURY 2026. Bootstrap Edition. Confidential — Internal Use.
            </p>
            <p className="text-xs text-muted-foreground">
              RIDI Soul · 10% Profits to Rural Impact
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
