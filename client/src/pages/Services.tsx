import { Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const DEPARTMENTS = [
  {
    number: "01",
    id: "innovation-hub",
    name: "Innovation Hub",
    tagline: "Build capability. Not just knowledge.",
    description: "Training programmes, executive classes, and structured learning experiences that develop real, lasting capability — in individuals, teams, and communities.",
    problem: "You or your team need to develop skills that will actually change how you work and lead.",
    services: [
      "Executive Class",
      "Kids Robotics & STEM",
      "Digital Skills Bootcamp",
      "Internship Programme",
      "Corporate Training",
    ],
    href: "/services/innovation-hub",
    external: null,
  },
  {
    number: "02",
    id: "studios",
    name: "Studios",
    tagline: "Your brand should reflect what you actually do.",
    description: "Brand identity, content strategy, social media management, podcast production, and event media coverage — built to institutional standard.",
    problem: "Your brand does not communicate the quality of your work, or you have no consistent presence.",
    services: [
      "Brand Identity",
      "Social Media Management",
      "Content Strategy",
      "Podcast Production",
      "Event Media Coverage",
    ],
    href: "/services/studios",
    external: null,
  },
  {
    number: "03",
    id: "systems",
    name: "Systems",
    tagline: "Stop running your business on manual processes.",
    description: "Websites, web applications, dashboards, automation systems, and AI workflows — built to replace the manual work that is slowing your business down.",
    problem: "Your business is growing but your systems, tools, and processes have not kept up.",
    services: [
      "Business Website",
      "Web Application",
      "Staff or Client Dashboard",
      "Automation & AI Workflow",
      "CRM System",
    ],
    href: "/services/systems",
    external: null,
  },
  {
    number: "04",
    id: "bizdoc",
    name: "Bizdoc",
    tagline: "Your business should be registered, compliant, protected.",
    description: "CAC registration, annual returns, tax filings, PENCOM compliance, industry licensing, and regulatory advisory — handled properly, from start to finish.",
    problem: "Your business is not registered, not compliant, or you are unsure what regulatory obligations apply to you.",
    services: [
      "CAC Business Registration",
      "Annual Returns Filing",
      "Tax Registration",
      "PENCOM Compliance",
      "Industry Licensing",
      "Compliance Advisory",
    ],
    href: "/services/bizdoc",
    external: "https://bizdoc.hamzury.com",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/ridi" className="nav-link text-sm hidden md:block">RIDI</Link>
            <Link href="/start" className="btn-primary text-xs px-4 py-2">Start a Project</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--milk)" }}>
        <div className="container max-w-3xl">
          <span className="brand-rule" />
          <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
            What HAMZURY builds.
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-xl" style={{ color: "var(--body-text)" }}>
            Four departments. Each one focused on a specific problem that businesses face. Each one built to deliver a clear, measurable outcome.
          </p>
        </div>
      </section>

      {/* Department list */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="space-y-0 divide-y divide-border">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.id} className="py-14 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  {/* Left: number + name */}
                  <div className="md:col-span-3">
                    <p className="label mb-3" style={{ color: "var(--brand)" }}>{dept.number}</p>
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--charcoal)" }}>{dept.name}</h2>
                    <p className="text-sm font-medium leading-snug" style={{ color: "var(--muted-text)" }}>{dept.tagline}</p>
                  </div>

                  {/* Middle: description + problem */}
                  <div className="md:col-span-5">
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--body-text)" }}>{dept.description}</p>
                    <div className="p-4 rounded-sm border border-border" style={{ background: "var(--milk)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--charcoal)" }}>The problem it solves</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>{dept.problem}</p>
                    </div>
                  </div>

                  {/* Right: services + CTA */}
                  <div className="md:col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--charcoal)" }}>Services</p>
                    <ul className="space-y-2 mb-8">
                      {dept.services.map((s) => (
                        <li key={s} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--brand)" }} />
                          <span className="text-sm" style={{ color: "var(--body-text)" }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-3">
                      <Link href={dept.href} className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                        View {dept.name} <ArrowRight size={12} />
                      </Link>
                      {dept.external && (
                        <a href={dept.external} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--muted-text)" }}>
                          Visit {dept.name} site <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-border grain-overlay" style={{ background: "var(--brand)" }}>
        <div className="container max-w-xl text-center">
          <span className="block w-8 h-px mx-auto mb-10 bg-white/40" />
          <h2 className="text-2xl font-light mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            Not sure which department you need?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            Submit your project brief and our team will route it to the right department and follow up within 24 hours.
          </p>
          <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm text-sm font-semibold bg-white" style={{ color: "var(--brand)" }}>
            Start a Project <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10" style={{ background: "white" }}>
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--muted-text)" }}>© {new Date().getFullYear()} HAMZURY. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="nav-link text-xs">Home</Link>
            <Link href="/start" className="nav-link text-xs">Start a Project</Link>
            <Link href="/track" className="nav-link text-xs">Track Project</Link>
            <Link href="/portal" className="nav-link text-xs">Partner Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
