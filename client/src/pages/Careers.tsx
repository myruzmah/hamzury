import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const OPENINGS = [
  {
    title: "Brand Identity Designer",
    dept: "Studios",
    type: "Full-time",
    location: "Jos, Nigeria",
    desc: "You will lead visual identity projects — logos, brand systems, and guidelines — for clients across industries. You think in systems, not just aesthetics.",
  },
  {
    title: "Business Development Associate",
    dept: "Bizdev",
    type: "Full-time",
    location: "Jos, Nigeria",
    desc: "You will manage the client pipeline — from first contact to signed engagement. You are organised, calm under pressure, and genuinely interested in what clients are building.",
  },
  {
    title: "Compliance Documentation Officer",
    dept: "Bizdoc",
    type: "Full-time",
    location: "Jos, Nigeria",
    desc: "You will handle CAC filings, tax registrations, annual returns, and PENCOM compliance for clients. Accuracy and timeliness are non-negotiable.",
  },
  {
    title: "Innovation Programme Coordinator",
    dept: "Innovation Hub",
    type: "Full-time",
    location: "Jos, Nigeria",
    desc: "You will coordinate training cohorts, manage enrolments, and ensure every programme runs on schedule. You are detail-oriented and good with people.",
  },
];

const VALUES = [
  { title: "System first", desc: "We build processes, not personalities. Every role has a clear scope and a clear output." },
  { title: "Quality gate", desc: "Nothing leaves HAMZURY without passing a quality review. We take that seriously." },
  { title: "Calm operations", desc: "We do not run on urgency and noise. We plan, execute, and communicate clearly." },
  { title: "AI-assisted", desc: "We use AI to reduce repetitive work. You will work with tools that make your job easier." },
];

export default function Careers() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-10 w-10 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <Link href="/" className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20">
        {/* Hero */}
        <section className="py-20 border-b border-border">
          <div className="container max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: "var(--brand-muted)", color: "var(--brand)" }}>
              Careers at HAMZURY
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight mb-6">
              Build the institution<br />that builds others.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              HAMZURY is a multi-unit institution based in Jos. We help organisations register, grow, and operate. We are looking for people who take their craft seriously and want to work in a structured, calm environment.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 border-b border-border" style={{ background: "var(--brand-muted)" }}>
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-8">How we work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title}>
                  <p className="text-sm font-semibold text-foreground mb-1">{v.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="py-16 border-b border-border">
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-8">Open positions</h2>
            <div className="space-y-4">
              {OPENINGS.map((job) => (
                <div key={job.title} className="border border-border rounded-xl p-5 hover:border-brand/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{job.dept}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{job.type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{job.location}</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:careers@hamzury.com?subject=Application: ${job.title}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ color: "var(--brand)" }}
                    >
                      Apply <ArrowRight size={12} />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{job.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* No open roles CTA */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Do not see your role?</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              We occasionally hire for roles not listed here. If you believe you can contribute to HAMZURY, send a brief introduction and your portfolio or CV to <a href="mailto:careers@hamzury.com" className="underline underline-offset-2" style={{ color: "var(--brand)" }}>careers@hamzury.com</a>.
            </p>
            <p className="text-xs text-muted-foreground">We review every application. We respond to shortlisted candidates within 7 working days.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
