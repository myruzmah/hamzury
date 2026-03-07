import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const impactStats = [
  { value: "10%", label: "Of every profit allocated to RIDI" },
  { value: "3", label: "Active rural programmes" },
  { value: "500+", label: "Beneficiaries reached" },
  { value: "2024", label: "Year RIDI was established" },
];

const programmes = [
  {
    title: "Rural Digital Literacy",
    description:
      "Equipping rural communities with foundational digital skills — from smartphone literacy to basic computing — enabling access to economic opportunity in an increasingly digital economy.",
  },
  {
    title: "Women in Enterprise",
    description:
      "Supporting women-led micro-businesses in underserved communities through structured mentorship, business documentation support, and access to micro-financing networks.",
  },
  {
    title: "Youth Skills Initiative",
    description:
      "Vocational and professional skills training for young people aged 16–25, with a focus on practical, market-relevant capabilities that translate directly into employment or self-employment.",
  },
];

export default function Ridi() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--brand)" }}
            >
              R
            </div>
            <span
              className="font-semibold text-xs tracking-widest uppercase hidden sm:block"
              style={{ color: "var(--brand)" }}
            >
              Raven &amp; Finch
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-36" style={{ background: "oklch(99% 0.003 160)" }}>
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--brand)" }}>
            Rural Impact &amp; Development Integration
          </p>
          <span className="brand-rule" />
          <h1
            className="text-3xl md:text-5xl font-semibold leading-tight mb-8"
            style={{ color: "var(--charcoal)", letterSpacing: "-0.03em" }}
          >
            Commerce with conscience.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            RIDI is the social commitment at the heart of Raven &amp; Finch. We believe that building great
            institutions is not enough — those institutions must also contribute to the communities around them.
            Ten percent of every profit we earn is allocated directly to rural impact programmes across Nigeria.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {impactStats.map((stat) => (
              <div key={stat.value} className="bg-white p-8 text-center">
                <p className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: "var(--brand)" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <div className="max-w-xl mb-16">
            <span className="brand-rule" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
              Active programmes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each programme is designed with clear outcomes, measurable impact, and long-term sustainability in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {programmes.map((p) => (
              <div key={p.title} className="bg-white p-10">
                <div className="w-8 h-0.5 mb-6" style={{ background: "var(--brand)" }} />
                <h3 className="text-base font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "var(--brand)" }}>
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Every engagement contributes.
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            When you work with Raven &amp; Finch, you are not only investing in your own institution — you are
            contributing to the development of communities that need it most.
          </p>
          <a
            href="mailto:info@ravenandfinch.com"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-sm bg-white transition-opacity hover:opacity-90"
            style={{ color: "var(--brand)" }}
          >
            Begin a conversation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© Raven &amp; Finch 2026. All rights reserved.</p>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Return to homepage
          </Link>
        </div>
      </footer>
    </div>
  );
}
