import { Link } from "wouter";
import { ArrowLeft, BookOpen, Users, Zap, TrendingUp } from "lucide-react";

const IMPACT_STATS = [
  { value: "4", label: "Cohorts per year" },
  { value: "100+", label: "Trainees per cohort" },
  { value: "400+", label: "Lives changed annually" },
  { value: "40", label: "Active interns at any time" },
  { value: "3 wks", label: "Training duration" },
  { value: "10%", label: "Of HAMZURY net profits" },
];

const PROGRAMMES = [
  {
    icon: <BookOpen size={18} />,
    title: "Jos Digital Rise Bootcamp",
    description:
      "A 3-week intensive programme training rural and peri-urban youth in digital skills — from content creation to AI tools. Participants are fully scholarshipped by HAMZURY through the RIDI allocation. Top performers convert directly to HAMZURY interns.",
    partner: "RIDLDI (Rural Innovation & Digital Literacy Development Initiative)",
  },
  {
    icon: <Users size={18} />,
    title: "Multi-Language Content Creator Pipeline",
    description:
      "Graduates of the bootcamp are trained as multi-language content creators — producing content in English, Hausa, and other local languages. They join HAMZURY's Studios department as interns and, where performance justifies, as permanent staff.",
    partner: "HAMZURY Studios",
  },
  {
    icon: <Zap size={18} />,
    title: "Starlink Infrastructure Programme",
    description:
      "HAMZURY provides Starlink satellite internet infrastructure to bootcamp locations, ensuring rural participants have the same connectivity as urban counterparts. This is HAMZURY's direct operational contribution to each cohort.",
    partner: "HAMZURY Systems",
  },
  {
    icon: <TrendingUp size={18} />,
    title: "Intern-to-Staff Conversion Track",
    description:
      "The most powerful part of the RIDI pipeline: trained interns who demonstrate excellence are converted to full HAMZURY staff. This is the institution's single most powerful competitive advantage — a self-renewing talent pipeline rooted in impact.",
    partner: "HAMZURY HR",
  },
];

export default function Ridi() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--brand)" }}
            >
              <span className="text-xs font-bold">H</span>
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} />
            Back to home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32" style={{ background: "var(--brand)" }}>
        <div className="container max-w-3xl">
          <span className="block w-10 h-0.5 bg-white/40 mb-8" />
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
            RIDI · Rural Innovation &amp; Digital Literacy Development Initiative
          </p>
          <h1
            className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Ten percent of profits<br />support rural development.
          </h1>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl mb-2">
            Programs focus on education and economic opportunity.
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            Impact is tracked and reported.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
            {IMPACT_STATS.map((s) => (
              <div key={s.label} className="bg-white px-6 py-8 text-center">
                <p className="text-2xl font-semibold mb-1" style={{ color: "var(--brand)" }}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What RIDI is */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container max-w-3xl">
          <span className="brand-rule" />
          <h2 className="text-2xl md:text-3xl font-light mb-6" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            What RIDI is.
          </h2>
          <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
            <p>
              The signed MOU between RIDLDI (Rural Innovation &amp; Digital Literacy Development
              Initiative) and HAMZURY Innovation Hub (January 2026) establishes this
              relationship: RIDLDI provides mandate and funding for programs like the Jos
              Digital Rise Bootcamp; HAMZURY provides Starlink infrastructure, facilitators,
              and curriculum. Both entities operate as independent legal entities, serving each
              other at the highest professional standard.
            </p>
            <p>
              The NGO scholarship pipeline is structured as follows: NGO scholarship → 3-week
              training → intern → multi-language content creator → HAMZURY staff. With 4
              cohorts per year and 100 trainees per cohort, HAMZURY trains 400 people annually
              and maintains 40 active interns at any given time.
            </p>
            <p>
              This is HAMZURY's single most powerful competitive advantage. It is not charity.
              It is a self-renewing talent pipeline rooted in genuine impact — and it is
              structurally funded by the institution's own success.
            </p>
          </div>
        </div>
      </section>

      {/* How Finance handles it */}
      <section className="section-padding" style={{ background: "var(--milk)" }}>
        <div className="container max-w-3xl">
          <span className="brand-rule" />
          <h2 className="text-2xl md:text-3xl font-light mb-8" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            How the allocation works.
          </h2>
          <div className="space-y-4">
            {[
              "At the end of every month, Finance calculates net profit from the revenue and expense report.",
              "10% of net profit is earmarked for RIDI programs — this is non-negotiable and structural.",
              "Finance creates a RIDI Transfer Record (Google Doc) stored in 08_FINANCE, noting the amount, date, and program it supports.",
              "The CEO reviews and approves. The Founder is notified directly.",
              "The Innovation Hub is briefed on the funded program scope for the following month.",
              "The record is reported to the RIDLDI board and published in HAMZURY's internal impact log.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-5 p-5 bg-white rounded-sm border border-border">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: "var(--brand)" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-12">
            <span className="brand-rule" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Active Programmes
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each programme is funded by the RIDI allocation and executed through HAMZURY's
              department structure — with the same quality standards applied to external client work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMMES.map((p) => (
              <div key={p.title} className="luxury-card">
                <div
                  className="w-9 h-9 rounded-sm flex items-center justify-center mb-5"
                  style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
                >
                  {p.icon}
                </div>
                <h3 className="text-base font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                <p className="text-xs font-medium" style={{ color: "var(--brand)" }}>
                  Delivered by: {p.partner}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soul statement */}
      <section className="section-padding border-t border-border" style={{ background: "var(--brand)" }}>
        <div className="container max-w-2xl text-center">
          <span className="block w-10 h-0.5 bg-white/40 mx-auto mb-8" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            HAMZURY does not need to become something different to grow.
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-8">
            It only needs more people doing the same excellent thing, in the same excellent way.
            The RIDI soul is not a programme we run — it is who we are.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/30 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
            Return to HAMZURY
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © HAMZURY 2026 · RIDI Soul · 10% Profits to Rural Impact
          </p>
          <p className="text-xs text-muted-foreground">
            Structure · Clarity · Calm Authority
          </p>
        </div>
      </footer>
    </div>
  );
}
