import { Link } from "wouter";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  {
    id: "cac-reg",
    name: "CAC Business Registration",
    tagline: "Your business, properly registered",
    description: "Complete business registration with the Corporate Affairs Commission — business name, private limited company, or incorporated trustee. We handle the entire process, from name availability check to certificate collection.",
    outcomes: ["Business name availability check", "CAC registration — business name or company incorporation", "Certificate of registration", "Memorandum and Articles of Association (where applicable)", "Post-registration guidance"],
    who: "Entrepreneurs and businesses that are not yet registered, or need to formalise an existing operation.",
  },
  {
    id: "annual-returns",
    name: "Annual Returns Filing",
    tagline: "Stay compliant, every year",
    description: "Statutory annual returns filing with the CAC — on time, every time. We handle the documentation, submission, and confirmation so your business remains in good standing with the regulator.",
    outcomes: ["Annual returns preparation and filing", "Penalty avoidance through timely submission", "Confirmation of filing", "Multi-year catch-up for outstanding returns"],
    who: "Registered businesses that need to file annual returns — whether current or with outstanding years.",
  },
  {
    id: "tax-reg",
    name: "Tax Registration",
    tagline: "Registered with the right authorities",
    description: "Tax Identification Number (TIN), VAT registration, and corporate income tax registration with FIRS or the relevant State Internal Revenue Service. We handle the paperwork and follow up until your certificates are issued.",
    outcomes: ["TIN registration with FIRS", "VAT registration", "Corporate income tax registration", "State-level tax registration where applicable", "Tax compliance guidance"],
    who: "Businesses that need to register for tax or are unsure which tax obligations apply to them.",
  },
  {
    id: "pencom",
    name: "PENCOM Compliance",
    tagline: "Pension obligations handled properly",
    description: "Pension Fund Administrator (PFA) registration and ongoing PENCOM compliance for businesses with 3 or more employees. We manage the registration process and ensure your business meets its statutory pension obligations.",
    outcomes: ["PFA selection and registration", "Employee pension account setup", "Monthly remittance process setup", "PENCOM compliance certificate", "Ongoing compliance support"],
    who: "Businesses with 3 or more employees that are not yet registered with a Pension Fund Administrator.",
  },
  {
    id: "licensing",
    name: "Industry Licensing",
    tagline: "The permits your sector requires",
    description: "Sector-specific regulatory permits and approvals — NAFDAC, NCC, CBN, SEC, SON, and other regulatory bodies. We identify the exact licences your business needs, prepare the applications, and manage the process to approval.",
    outcomes: ["Regulatory requirement assessment", "Licence application preparation", "Submission and follow-up management", "Approval and certificate collection", "Renewal management"],
    who: "Businesses in regulated industries that need sector-specific permits to operate legally.",
  },
  {
    id: "compliance-advisory",
    name: "Compliance Advisory",
    tagline: "Know your obligations before they become problems",
    description: "Ongoing regulatory guidance for businesses that want to stay ahead of compliance requirements. We review your current compliance posture, identify gaps, and provide a structured plan to address them.",
    outcomes: ["Compliance audit and gap analysis", "Regulatory obligation mapping", "Structured compliance improvement plan", "Ongoing advisory retainer (monthly or quarterly)", "Regulatory change monitoring"],
    who: "Businesses that want to understand and manage their regulatory obligations proactively.",
  },
];

export default function Bizdoc() {
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
            <Link href="/services" className="nav-link text-sm hidden md:block">Services</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link text-sm hidden md:flex items-center gap-1">
              Bizdoc Site <ExternalLink size={11} />
            </a>
            <Link href="/start" className="btn-primary text-xs px-4 py-2">Start a Project</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--milk)" }}>
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-70 transition-opacity" style={{ color: "var(--brand)" }}>
            <ArrowLeft size={12} /> All Services
          </Link>
          <div className="max-w-2xl">
            <p className="label mb-4" style={{ color: "var(--brand)" }}>04 — Bizdoc</p>
            <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
              Your business should be<br />registered, compliant, protected.
            </h1>
            <p className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg" style={{ color: "var(--body-text)" }}>
              CAC registration, annual returns, tax filings, PENCOM compliance, industry licensing, and regulatory advisory — handled properly, from start to finish.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary">Start a Project <ArrowRight size={14} /></Link>
              <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2">
                Visit Bizdoc Site <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <div className="border-y border-border py-5" style={{ background: "white" }}>
        <div className="container max-w-2xl">
          <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
            <span className="font-semibold" style={{ color: "var(--charcoal)" }}>Bizdoc operates as a dedicated compliance and documentation service.</span>{" "}
            It has its own platform at{" "}
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--brand)" }}>bizdoc.hamzury.com</a>
            {" "}and is part of the HAMZURY institutional structure. You can start a project here or directly through the Bizdoc platform.
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="mb-14">
            <span className="brand-rule" />
            <h2 style={{ color: "var(--charcoal)" }}>What we handle.</h2>
          </div>
          <div className="space-y-px bg-border">
            {SERVICES.map((svc, i) => (
              <div key={svc.id} className="bg-white p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <p className="label mb-3" style={{ color: "var(--brand)" }}>0{i + 1}</p>
                    <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--charcoal)" }}>{svc.name}</h3>
                    <p className="text-xs font-medium mb-5" style={{ color: "var(--muted-text)" }}>{svc.tagline}</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--body-text)" }}>{svc.description}</p>
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-text)" }}>Who this is for</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>{svc.who}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--charcoal)" }}>What we deliver</p>
                    <ul className="space-y-3">
                      {svc.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--brand)" }} />
                          <span className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>{o}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/start" className="inline-flex items-center gap-2 mt-8 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                      Start {svc.name} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border grain-overlay" style={{ background: "var(--brand)" }}>
        <div className="container max-w-xl text-center">
          <span className="block w-8 h-px mx-auto mb-10 bg-white/40" />
          <h2 className="text-2xl font-light mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
            Ready to get compliant?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            Submit your request in under three minutes. No account required. Our compliance team will follow up within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm text-sm font-semibold bg-white" style={{ color: "var(--brand)" }}>
              Start a Project <ArrowRight size={14} />
            </Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors">
              Visit Bizdoc Site <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10" style={{ background: "white" }}>
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--muted-text)" }}>© {new Date().getFullYear()} HAMZURY. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="nav-link text-xs">Home</Link>
            <Link href="/services" className="nav-link text-xs">Services</Link>
            <Link href="/start" className="nav-link text-xs">Start a Project</Link>
            <Link href="/portal" className="nav-link text-xs">Partner Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
