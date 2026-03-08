import { Link } from "wouter";
import { ArrowRight, ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="nav-link" style={{ color: "var(--brand)" }}>Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link">Bizdoc</a>
            <Link href="/portal" className="nav-link">Portal</Link>
          </nav>
          <button className="md:hidden p-2 rounded-sm text-muted-foreground" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container py-4 flex flex-col gap-1">
              <Link href="/services" className="py-2.5 text-sm font-medium" style={{ color: "var(--brand)" }} onClick={() => setMobileOpen(false)}>Services</Link>
              <Link href="/ridi" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>RIDI</Link>
              <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Bizdoc</a>
              <Link href="/portal" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Portal</Link>
              <Link href="/start" className="mt-3 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm" style={{ background: "var(--brand)", color: "white" }} onClick={() => setMobileOpen(false)}>Start a Project</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--milk)" }}>
        <div className="container max-w-3xl">
          <span className="brand-rule" />
          <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
            Our services.
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-xl" style={{ color: "var(--body-text)" }}>
            Four departments. Each one built around a specific problem that organisations face — and a clear, documented outcome that resolves it.
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

      {/* Comparison Table */}
      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--brand)" }}>Quick Reference</p>
          <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Which department solves your problem?</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-lg">Use this table to identify the right starting point. If your problem spans multiple departments, submit a brief and we will route it correctly.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground w-1/3">Your problem</th>
                  <th className="text-left py-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground w-1/4">Department</th>
                  <th className="text-left py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">What we do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { problem: "My team lacks the skills to lead or operate effectively", dept: "Innovation Hub", action: "Executive Class or Corporate Training", href: "/services/innovation-hub" },
                  { problem: "My children need structured technology education", dept: "Innovation Hub", action: "Young Innovators programme", href: "/services/innovation-hub" },
                  { problem: "I want to learn to code or build digital products", dept: "Innovation Hub", action: "Tech Bootcamp", href: "/services/innovation-hub" },
                  { problem: "My brand does not reflect the quality of my work", dept: "Studios", action: "Brand Identity system", href: "/services/studios" },
                  { problem: "My social media is inconsistent or non-existent", dept: "Studios", action: "Social Media Management", href: "/services/studios" },
                  { problem: "I want to start a podcast but not manage production", dept: "Studios", action: "Podcast Production", href: "/services/studios" },
                  { problem: "I need a professional website that converts visitors", dept: "Systems", action: "Business Website build", href: "/services/systems" },
                  { problem: "I need a custom platform or internal tool built", dept: "Systems", action: "Web Application or Dashboard", href: "/services/systems" },
                  { problem: "My team spends too much time on manual processes", dept: "Systems", action: "Automation & AI Workflow", href: "/services/systems" },
                  { problem: "I manage clients and leads in WhatsApp or spreadsheets", dept: "Systems", action: "CRM System", href: "/services/systems" },
                  { problem: "My business is not registered or not compliant", dept: "Bizdoc", action: "CAC Registration or Compliance Advisory", href: "/services/bizdoc" },
                  { problem: "I have not filed annual returns or tax obligations", dept: "Bizdoc", action: "Annual Returns & Tax Filing", href: "/services/bizdoc" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white transition-colors">
                    <td className="py-4 pr-6 text-muted-foreground leading-relaxed">{row.problem}</td>
                    <td className="py-4 pr-6">
                      <Link href={row.href} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "var(--brand)" + "15", color: "var(--brand)" }}>{row.dept}</Link>
                    </td>
                    <td className="py-4">
                      <Link href={row.href} className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: "#1a1a1a" }}>
                        {row.action} <ArrowRight size={12} style={{ color: "var(--brand)" }} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="nav-link text-xs">Home</Link>
            <Link href="/ridi" className="nav-link text-xs">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link text-xs">Bizdoc</a>
            <Link href="/start" className="nav-link text-xs">Start a Project</Link>
            <Link href="/track" className="nav-link text-xs">Track Project</Link>
            <Link href="/portal" className="nav-link text-xs">Partner Portal</Link>
            <Link href="/staff-login" className="nav-link text-xs">Staff</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
