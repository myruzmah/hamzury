import { Link } from "wouter";
import { ArrowRight, MapPin, Users, Globe, Zap } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const DEPARTMENTS = [
  {
    code: "01",
    slug: "cso",
    name: "HAMZURY CSO",
    tagline: "Your First Conversation",
    description:
      "The gateway to HAMZURY. Our Client Services Office qualifies every lead, recommends the right package, and ensures every client engagement begins with clarity and calm.",
  },
  {
    code: "02",
    slug: "systems",
    name: "HAMZURY Systems",
    tagline: "Digital Infrastructure That Lasts",
    description:
      "Websites, CRMs, AI workflows, dashboards, and automation systems. We build the digital backbone your institution runs on — and we maintain it with the same rigour we built it with.",
  },
  {
    code: "03",
    slug: "studios",
    name: "HAMZURY Studios",
    tagline: "Brands Built to Endure",
    description:
      "Brand identity, visual production, social media systems, and faceless content channels. Every asset is built to the HAMZURY quality standard: clean, properly branded, and ready to frame.",
  },
  {
    code: "04",
    slug: "bizdoc",
    name: "HAMZURY Bizdoc",
    tagline: "Building Businesses on Solid Foundations",
    description:
      "CAC incorporation, annual returns, tax registration, PENCOM setup, and regulatory licensing. We handle the documentation that makes your institution legally sound and operationally credible.",
  },
  {
    code: "05",
    slug: "innovation",
    name: "HAMZURY Innovation",
    tagline: "Learn What Actually Works",
    description:
      "Training programs, bootcamps, and cohort-based education. Learn what actually works. Create with integrity. Build systems that dominate.",
  },
  {
    code: "06",
    slug: "growth",
    name: "HAMZURY Growth",
    tagline: "Partnerships That Matter",
    description:
      "Strategic partnerships, market research, grant applications, and revenue development. We build relationships that open doors and create lasting institutional value.",
  },
  {
    code: "07",
    slug: "people",
    name: "HAMZURY People",
    tagline: "Where Talent Thrives",
    description:
      "Recruitment, onboarding, performance management, and staff development. We build the human infrastructure that makes every other department possible.",
  },
  {
    code: "08",
    slug: "ledger",
    name: "HAMZURY Ledger",
    tagline: "Clear Numbers, Calm Decisions",
    description:
      "Financial management, invoicing, expense tracking, commission processing, and RIDI allocation. Transparent, precise, and always calm.",
  },
  {
    code: "09",
    slug: "executive",
    name: "HAMZURY Executive",
    tagline: "Operational Excellence",
    description:
      "Cross-departmental oversight, strategic alignment, and institutional governance. The CEO office ensures every department operates at its highest standard.",
  },
  {
    code: "10",
    slug: "founder",
    name: "HAMZURY Founder",
    tagline: "Vision That Outlasts",
    description:
      "The founding vision, institutional philosophy, and long-term strategy. Muhammad Hamzury's office sets the direction and holds the institution to its highest standards.",
  },
  {
    code: "11",
    slug: "ridi",
    name: "HAMZURY RIDI",
    tagline: "10% Profits, 100% Impact",
    description:
      "The Rural Innovation & Digital Literacy Development Initiative. 10% of every profit funds rural education, digital literacy, and community development programmes.",
  },
];

const STATS = [
  { value: "11", label: "Departments" },
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
            <img
              src={HAMZURY_LOGO}
              alt="HAMZURY"
              className="h-8 w-8 object-contain rounded-sm"
            />
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
              { label: "Services", href: "/services" },
              { label: "Diagnosis", href: "/diagnosis" },
              { label: "RIDI", href: "/ridi" },
              { label: "Contact", href: "/contact" },
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
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(oklch(85% 0.01 160 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(85% 0.01 160 / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl">
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
              Build an institution
              <br />
              <span style={{ color: "var(--brand)" }}>that lasts.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-xl">
              HAMZURY is a premium business solutions institution — not a startup finding itself.
              We operate with the calm precision of Apple, the analytical rigour of McKinsey,
              and the cultural authority of the strongest African institutions.
            </p>

            <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-xl">
              Structure. Clarity. Calm Authority.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/diagnosis"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-colors"
                style={{ background: "var(--brand)", color: "white" }}
              >
                Check Your Business Health
                <ArrowRight size={14} />
              </a>
              <a
                href="/services"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border border-border transition-colors hover:border-primary/40"
                style={{ color: "var(--charcoal)" }}
              >
                Our Services
              </a>
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

      {/* ── Diagnosis CTA ────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-border" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <span className="block w-10 h-0.5 mx-auto mb-6" style={{ background: "var(--brand)" }} />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Free Business Assessment
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Check your business health.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
              Answer 5 questions. Receive a personalised Business Health Report — generated by AI,
              informed by HAMZURY's CLARITY REPORT framework — delivered to your email and WhatsApp.
            </p>
            <a
              href="/diagnosis"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-sm"
              style={{ background: "var(--brand)", color: "white" }}
            >
              Start the Diagnosis <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── All 11 Departments ────────────────────────────────────────────── */}
      <section id="services" className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-14">
            <span className="brand-rule" />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              What We Build
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Eleven departments.
              <br />
              One institution.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every department at HAMZURY is a completely standalone service provider —
              operating like its own premium company within the institution, bound by shared
              standards and a single source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.code}
                href={`/department/${dept.slug}`}
                className="bg-white p-8 group hover:bg-milk transition-colors block"
              >
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="text-xs font-mono font-semibold tracking-widest"
                    style={{ color: "var(--brand)" }}
                  >
                    {dept.code}
                  </span>
                  <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3
                  className="text-base font-semibold mb-1"
                  style={{ color: "var(--charcoal)" }}
                >
                  {dept.name}
                </h3>
                <p className="text-xs font-medium mb-3" style={{ color: "var(--brand)" }}>
                  {dept.tagline}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dept.description}
                </p>
              </Link>
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
      <section className="section-padding" style={{ background: "var(--brand)" }}>
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
              { step: "03", label: "Department Dispatch", desc: "Tasks auto-assigned to all relevant departments" },
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
                <img
                  src={HAMZURY_LOGO}
                  alt="HAMZURY"
                  className="h-7 w-7 object-contain rounded-sm"
                />
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
                {["CSO", "Systems", "Studios", "Bizdoc", "Innovation Hub", "Growth"].map((s) => (
                  <p key={s} className="text-muted-foreground mb-1.5">{s}</p>
                ))}
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-muted-foreground mb-3">Institution</p>
                {[
                  { label: "RIDI Programme", href: "/ridi" },
                  { label: "Diagnosis Tool", href: "/diagnosis" },
                  { label: "Staff Portal", href: "/portal" },
                  { label: "Client Access", href: "/portal" },
                  { label: "Agent Portal", href: "/portal" },
                  { label: "Privacy Policy", href: "/privacy" },
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
                <a href="mailto:info@hamzury.com" className="text-muted-foreground hover:text-foreground transition-colors block mb-1.5">
                  info@hamzury.com
                </a>
                <a href="mailto:innovation@hamzury.com" className="text-muted-foreground hover:text-foreground transition-colors block">
                  innovation@hamzury.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © HAMZURY 2026. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <span>RIDI Soul · 10% Profits to Rural Impact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp Widget ───────────────────────────────────────────────── */}
      <a
        href="https://wa.me/2348000000000?text=Hello%20HAMZURY%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
