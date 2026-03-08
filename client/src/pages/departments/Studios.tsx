import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  {
    id: "brand-identity",
    name: "Brand Identity",
    tagline: "A visual system that commands respect",
    description: "A complete brand identity — logo, colour system, typography, visual language, and brand guidelines. Built to work at every scale, from a business card to a billboard. Not a logo alone — a coherent identity system your team can apply consistently.",
    outcomes: ["Primary and secondary logo suite", "Colour palette with usage rules", "Typography system", "Brand guidelines document", "Application examples (letterhead, cards, social)"],
    who: "Businesses launching, rebranding, or whose current identity no longer reflects their quality.",
  },
  {
    id: "social-media",
    name: "Social Media Management",
    tagline: "Consistent presence that builds authority",
    description: "End-to-end management of your social media presence. Strategy, content creation, scheduling, engagement, and monthly reporting. We manage the platforms so you can focus on the business.",
    outcomes: ["Monthly content calendar", "On-brand graphics and captions", "Consistent posting schedule", "Engagement management", "Monthly performance report"],
    who: "Businesses that need a consistent, professional social media presence without managing it internally.",
  },
  {
    id: "content-strategy",
    name: "Content Strategy",
    tagline: "A message that converts, not just communicates",
    description: "A structured content framework that defines what you say, how you say it, and where you say it. Covers brand voice, audience definition, platform strategy, and a content architecture your team can execute consistently.",
    outcomes: ["Brand voice and tone guide", "Audience definition and messaging matrix", "Platform-specific content strategy", "Content pillars and themes", "90-day content roadmap"],
    who: "Businesses whose content is inconsistent, unclear, or not generating the results they need.",
  },
  {
    id: "podcast",
    name: "Podcast Production",
    tagline: "A professional audio presence",
    description: "Full podcast production — concept development, recording setup guidance, editing, mixing, and distribution to all major platforms. Whether you are starting from scratch or already recording, we handle the production so the content sounds as good as it should.",
    outcomes: ["Podcast concept and format development", "Professional audio editing and mixing", "Episode artwork and branding", "Distribution to Spotify, Apple Podcasts, and more", "Episode show notes and transcripts"],
    who: "Professionals, business owners, and organisations that want a podcast but not the production burden.",
  },
  {
    id: "event-media",
    name: "Event Media Coverage",
    tagline: "Every important moment, captured properly",
    description: "Professional photography and video coverage for corporate events, product launches, training sessions, and brand activations. Delivered with post-event content — highlight reels, recap posts, and edited footage — ready for immediate use.",
    outcomes: ["Professional event photography", "Highlight video reel", "Post-event social media content package", "Edited footage for internal or public use", "Fast turnaround — content ready within 48 hours"],
    who: "Organisations hosting events that deserve to be documented and shared at a professional standard.",
  },
];

export default function Studios() {
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
            <p className="label mb-4" style={{ color: "var(--brand)" }}>02 — Studios</p>
            <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
              Your brand should reflect<br />what you actually do.
            </h1>
            <p className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg" style={{ color: "var(--body-text)" }}>
              Brand identity, content strategy, social media management, podcast production, and event media coverage — built to institutional standard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary">Start a Project <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="mb-14">
            <span className="brand-rule" />
            <h2 style={{ color: "var(--charcoal)" }}>What we build.</h2>
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
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--charcoal)" }}>What you will receive</p>
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
            Ready to build your brand?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto text-white/70">
            Submit your project brief in under three minutes. No account required. You will receive a reference code and our team will follow up within 24 hours.
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
            <Link href="/services" className="nav-link text-xs">Services</Link>
            <Link href="/start" className="nav-link text-xs">Start a Project</Link>
            <Link href="/portal" className="nav-link text-xs">Partner Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
