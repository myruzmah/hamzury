import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const DEPARTMENTS = [
  { code: "01", slug: "cso", name: "HAMZURY CSO", tagline: "Your First Conversation", desc: "The gateway to HAMZURY. Every client relationship begins with a structured intake, the right recommendation, and a clear engagement pack.", client: true },
  { code: "02", slug: "systems", name: "HAMZURY Systems", tagline: "Digital Infrastructure That Lasts", desc: "Business websites, CRM systems, AI workflows, and custom automation — built to institutional standard and maintained with rigour.", client: true },
  { code: "03", slug: "studios", name: "HAMZURY Studios", tagline: "Brands Built to Endure", desc: "Brand identity, content systems, and visual production that stand the test of time. Apple-level clean, properly branded, ready to frame.", client: true },
  { code: "04", slug: "bizdoc", name: "HAMZURY Bizdoc", tagline: "Building Businesses on Solid Foundations", desc: "CAC registration, tax compliance, PENCOM, SCUML, and all the documentation that makes your institution legally sound.", client: true },
  { code: "05", slug: "innovation", name: "HAMZURY Innovation", tagline: "Learn What Actually Works", desc: "Cohort-based training, self-paced courses, business bootcamps, and kids robotics — developing the next generation of African professionals.", client: true },
  { code: "06", slug: "growth", name: "HAMZURY Growth", tagline: "Partnerships That Matter", desc: "Strategic partnerships, grant applications, market research, and revenue channel development.", client: false },
  { code: "07", slug: "people", name: "HAMZURY People", tagline: "Where Talent Thrives", desc: "Recruitment, onboarding, performance management, and staff development — the human infrastructure behind everything.", client: false },
  { code: "08", slug: "ledger", name: "HAMZURY Ledger", tagline: "Clear Numbers, Calm Decisions", desc: "Invoicing, expense management, commission processing, and the 10% RIDI allocation — transparent and precise.", client: false },
  { code: "09", slug: "executive", name: "HAMZURY Executive", tagline: "Operational Excellence", desc: "Cross-departmental oversight, strategic alignment, and institutional governance from the CEO office.", client: false },
  { code: "10", slug: "founder", name: "HAMZURY Founder", tagline: "Vision That Outlasts", desc: "The founding vision, institutional philosophy, and long-term strategy that keeps HAMZURY true to its values.", client: false },
  { code: "11", slug: "ridi", name: "HAMZURY RIDI", tagline: "10% Profits, 100% Impact", desc: "The Rural Innovation & Digital Literacy Development Initiative — 10% of every profit structurally committed to rural education.", client: false },
];

export default function Services() {
  const clientFacing = DEPARTMENTS.filter((d) => d.client);
  const internal = DEPARTMENTS.filter((d) => !d.client);

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/ridi" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">RIDI</Link>
            <Link href="/contact" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link href="/portal" className="text-xs font-semibold px-4 py-2 rounded-sm" style={{ background: "var(--brand)", color: "white" }}>Portal</Link>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ background: "var(--milk)" }}>
        <div className="container max-w-2xl">
          <span className="brand-rule" />
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            What HAMZURY builds.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eleven departments. One institutional standard. Every service is documented, quality-gated, and delivered with the same rigour — regardless of the engagement size.
          </p>
        </div>
      </section>

      {/* Client-facing services */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-12">
            <span className="brand-rule" />
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>Client Services</h2>
            <p className="text-sm text-muted-foreground">Available to external clients and businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {clientFacing.map((dept) => (
              <Link key={dept.slug} href={`/department/${dept.slug}`} className="bg-white p-8 group hover:bg-gray-50 transition-colors block">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold tracking-widest" style={{ color: "var(--brand)" }}>{dept.code}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" style={{ color: "var(--brand)" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--charcoal)" }}>{dept.name}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: "var(--brand)" }}>{dept.tagline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{dept.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Internal departments */}
      <section className="section-padding border-t border-border" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="max-w-xl mb-12">
            <span className="brand-rule" />
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>Internal Departments</h2>
            <p className="text-sm text-muted-foreground">The infrastructure that makes everything else possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {internal.map((dept) => (
              <Link key={dept.slug} href={`/department/${dept.slug}`} className="bg-white p-8 group hover:bg-gray-50 transition-colors block">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold tracking-widest" style={{ color: "var(--brand)" }}>{dept.code}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" style={{ color: "var(--brand)" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--charcoal)" }}>{dept.name}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: "var(--brand)" }}>{dept.tagline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{dept.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border" style={{ background: "white" }}>
        <div className="container max-w-xl text-center">
          <span className="block w-10 h-0.5 mx-auto mb-6" style={{ background: "var(--brand)" }} />
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>Not sure where to start?</h2>
          <p className="text-sm text-muted-foreground mb-8">Take our free Business Health Diagnosis. We will recommend the right combination of services for your situation.</p>
          <a href="/diagnosis" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-sm" style={{ background: "var(--brand)", color: "white" }}>
            Free Business Diagnosis <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}
