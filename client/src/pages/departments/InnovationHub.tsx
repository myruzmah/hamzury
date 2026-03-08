import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  {
    id: "executive",
    name: "Executive Class",
    tagline: "Leadership for institution builders",
    description: "A structured programme for professionals who lead or are building organisations. Covers institutional management, decision-making under pressure, team architecture, and long-term strategic thinking. Not a seminar — a cohort experience.",
    outcomes: ["Institutional leadership frameworks", "Structured decision-making tools", "Peer network of serious professionals", "Personal leadership assessment and development plan"],
    who: "Business owners, senior managers, directors, and aspiring institutional leaders.",
  },
  {
    id: "kids",
    name: "Kids Robotics & STEM",
    tagline: "Technology education for the next generation",
    description: "A carefully designed programme for children aged 7–17. Builds logical thinking, problem-solving, and early technology fluency through robotics, coding, and project-based learning. Every cohort is small, structured, and supervised.",
    outcomes: ["Hands-on robotics and coding skills", "Logical thinking and problem decomposition", "Confidence in technology environments", "A completed project to show for every cohort"],
    who: "Children aged 7–17 whose parents want structured, serious technology education.",
  },
  {
    id: "digital-skills",
    name: "Digital Skills Bootcamp",
    tagline: "Practical technology for individuals and teams",
    description: "Focused, practical training in the digital tools that matter most for modern work. From basic digital literacy to social media management, data tools, design software, and AI productivity tools. Delivered in-person, online, or blended.",
    outcomes: ["Proficiency in relevant digital tools", "Immediate application to daily work", "Structured learning path with clear milestones", "Certificate of completion"],
    who: "Individuals, teams, and organisations that need to close a digital skills gap.",
  },
  {
    id: "internship",
    name: "Internship Programme",
    tagline: "Structured work experience at HAMZURY",
    description: "A competitive internship across HAMZURY departments — Studios, Systems, Bizdoc, CSO, and RIDI. Interns work on real projects under direct supervision. Not a placement programme — a structured capability development experience.",
    outcomes: ["Real project experience across HAMZURY departments", "Mentorship from department leads", "A professional portfolio of completed work", "Pathway to full-time consideration for outstanding interns"],
    who: "Students, recent graduates, and career changers who want structured, real-world experience.",
  },
  {
    id: "corporate",
    name: "Corporate Training",
    tagline: "Custom capability development for organisations",
    description: "Training programmes designed around your organisation's specific needs. We assess the gap, design the curriculum, and deliver it — in-person at your office, at our facility, or online. Covers leadership, digital skills, communication, and operational efficiency.",
    outcomes: ["Custom curriculum aligned to your organisational goals", "Measurable skill improvement across the team", "Post-training assessment and follow-up", "Scalable delivery for teams of any size"],
    who: "Organisations that need to develop their people in a structured, measurable way.",
  },
];

export default function InnovationHub() {
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
            <p className="label mb-4" style={{ color: "var(--brand)" }}>01 — Innovation Hub</p>
            <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
              Build capability.<br />Not just knowledge.
            </h1>
            <p className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg" style={{ color: "var(--body-text)" }}>
              Training programmes, executive classes, and structured learning experiences designed to develop real, lasting capability — in individuals, teams, and communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary">Apply for a Programme <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolment note */}
      <div className="border-y border-border py-5" style={{ background: "white" }}>
        <div className="container max-w-2xl">
          <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
            <span className="font-semibold" style={{ color: "var(--charcoal)" }}>HAMZURY Innovation Hub does not accept open enrolments.</span>{" "}
            Every participant is assessed before joining any programme. This protects the quality of the experience and the integrity of each cohort. Submit your application and our team will review your profile and respond within 48 hours.
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="mb-14">
            <span className="brand-rule" />
            <h2 style={{ color: "var(--charcoal)" }}>Our programmes.</h2>
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
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--charcoal)" }}>What you will gain</p>
                    <ul className="space-y-3">
                      {svc.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--brand)" }} />
                          <span className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>{o}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/start" className="inline-flex items-center gap-2 mt-8 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                      Apply for {svc.name} <ArrowRight size={12} />
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
            Ready to apply?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            Submit your application in under three minutes. Our team will review your profile and come back to you with a personal recommendation.
          </p>
          <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm text-sm font-semibold bg-white" style={{ color: "var(--brand)" }}>
            Submit Application <ArrowRight size={14} />
          </Link>
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
