import { Link } from "wouter";
import { useState } from "react";
import { ArrowRight, ExternalLink, Lightbulb, Palette, Monitor, FileText, Menu, X } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const DEPARTMENTS = [
  {
    number: "01",
    id: "innovation-hub",
    icon: Lightbulb,
    name: "Innovation Hub",
    tagline: "Build capability. Not just knowledge.",
    description: "Training programmes, executive classes, and structured learning experiences that develop real, lasting capability — in individuals, teams, and communities.",
    problem: "You or your team need to develop skills that will actually change how you work and lead.",
    services: [
      "Executive Class",
      "Young Innovators (Robotics & STEM)",
      "Digital Skills Bootcamp",
      "Internship Programme",
      "Corporate Training",
    ],
    href: "/services/innovation-hub",
    external: null,
    stat: "5 programmes",
  },
  {
    number: "02",
    id: "studios",
    icon: Palette,
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
    stat: "5 services",
  },
  {
    number: "03",
    id: "systems",
    icon: Monitor,
    name: "Systems",
    tagline: "Stop running your business on manual processes.",
    description: "Websites, web applications, dashboards, automation systems, and AI workflows — built to replace the manual work that is slowing your business down. You own everything we build.",
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
    stat: "5 builds",
  },
  {
    number: "04",
    id: "bizdoc",
    icon: FileText,
    name: "Bizdoc",
    tagline: "Your business should be registered, compliant, protected.",
    description: "CAC registration, annual returns, tax filings, PENCOM compliance, industry licensing, and regulatory advisory — handled properly, from start to finish.",
    problem: "Your business is not registered, not compliant, or you are unsure what regulatory obligations apply to you.",
    services: [
      "CAC Business Registration",
      "Annual Returns Filing",
      "Tax Registration & Filing",
      "PENCOM Compliance",
      "Industry Licensing",
      "Compliance Advisory",
    ],
    href: "/services/bizdoc",
    external: "https://bizdoc.hamzury.com",
    stat: "6 services",
  },
];

const COMPARISON_ROWS = [
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
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="nav-link" style={{ color: BRAND, fontWeight: 600 }}>Services</Link>
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
              <Link href="/services" className="py-2.5 text-sm font-medium" style={{ color: BRAND }} onClick={() => setMobileOpen(false)}>Services</Link>
              <Link href="/ridi" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>RIDI</Link>
              <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Bizdoc</a>
              <Link href="/portal" className="py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Portal</Link>
              <Link href="/start" className="mt-3 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg text-white" style={{ background: BRAND }} onClick={() => setMobileOpen(false)}>Start a Project</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero — dark brand background matching department pages */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: BRAND }}>
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">Services</p>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
            Four departments.<br />One institution.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl">
            Each department is built around a specific problem that organisations face — and a clear, documented outcome that resolves it. Submit one brief and we route it to the right team.
          </p>
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div><p className="text-2xl font-light text-white">4</p><p className="text-xs text-white/50 mt-1">Departments</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">21+</p><p className="text-xs text-white/50 mt-1">Services</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">24h</p><p className="text-xs text-white/50 mt-1">Brief response</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">100%</p><p className="text-xs text-white/50 mt-1">Documented delivery</p></div>
          </div>
        </div>
      </section>

      {/* Department Cards */}
      <section className="py-20">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Departments</p>
          <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Select a department.</h2>
          <p className="text-sm text-muted-foreground mb-12 max-w-lg">Each department has its own team, its own services, and its own brief form. Click any card to explore what it delivers.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link key={dept.id} href={dept.href}>
                  <div className="bg-white border border-border rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: BRAND + "12", color: BRAND }}>
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-light text-muted-foreground">{dept.number}</span>
                    </div>

                    <h3 className="text-xl font-medium mb-1" style={{ color: "#1a1a1a" }}>{dept.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{dept.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{dept.description}</p>

                    <div className="mb-6">
                      <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#1a1a1a" }}>Services</p>
                      <ul className="space-y-1.5">
                        {dept.services.map((s) => (
                          <li key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: BRAND }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-border">
                      <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all" style={{ color: BRAND }}>
                        Explore {dept.name} <ArrowRight size={13} />
                      </div>
                      {dept.external && (
                        <a
                          href={dept.external}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Visit site <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem → Solution Comparison Table */}
      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Quick Reference</p>
          <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Which department solves your problem?</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-lg">Use this table to identify the right starting point. If your problem spans multiple departments, submit a brief and we will route it correctly.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground w-2/5">Your problem</th>
                  <th className="text-left py-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground w-1/5">Department</th>
                  <th className="text-left py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">What we do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-white transition-colors">
                    <td className="py-4 pr-6 text-muted-foreground leading-relaxed text-sm">{row.problem}</td>
                    <td className="py-4 pr-6">
                      <Link href={row.href}>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer" style={{ background: BRAND + "15", color: BRAND }}>{row.dept}</span>
                      </Link>
                    </td>
                    <td className="py-4">
                      <Link href={row.href} className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: "#1a1a1a" }}>
                        {row.action} <ArrowRight size={12} style={{ color: BRAND }} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Process</p>
          <h2 className="text-3xl font-light mb-12" style={{ color: "#1a1a1a" }}>How it works.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Submit your brief", description: "Tell us what you need at /start. Our intake form routes your brief to the right department automatically." },
              { step: "02", title: "We respond in 24 hours", description: "A named team member from the relevant department will review your brief and respond with a clear proposal." },
              { step: "03", title: "We build and deliver", description: "Work begins once the proposal is agreed. You receive regular updates and a documented delivery at the end." },
            ].map((p) => (
              <div key={p.step}>
                <p className="text-4xl font-light mb-4 opacity-20" style={{ color: BRAND }}>{p.step}</p>
                <h3 className="font-medium mb-3" style={{ color: "#1a1a1a" }}>{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA — dark brand */}
      <section className="py-20 border-t border-border grain-overlay" style={{ background: BRAND }}>
        <div className="container max-w-xl text-center">
          <span className="block w-8 h-px mx-auto mb-10 bg-white/30" />
          <h2 className="text-3xl font-light mb-4 text-white">
            Not sure which department you need?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            Submit your project brief and our team will route it to the right department and follow up within 24 hours.
          </p>
          <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-white" style={{ color: BRAND }}>
            Start a Project <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
            <p className="text-xs text-muted-foreground">Structure. Clarity. Calm authority.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/ridi" className="hover:text-foreground transition-colors">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Bizdoc</a>
            <Link href="/team" className="hover:text-foreground transition-colors">Team</Link>
            <Link href="/policies" className="hover:text-foreground transition-colors">Policies</Link>
            <Link href="/start" className="hover:text-foreground transition-colors">Start a Project</Link>
            <Link href="/track" className="hover:text-foreground transition-colors">Track Project</Link>
            <Link href="/portal" className="hover:text-foreground transition-colors">Partner Portal</Link>
            <Link href="/staff-login" className="hover:text-foreground transition-colors">Staff</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
