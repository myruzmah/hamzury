import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2, Palette, MessageSquare, Mic, Camera, BarChart2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const SERVICES = [
  {
    id: "brand-identity",
    icon: Palette,
    name: "Brand Identity",
    tagline: "A visual system that commands respect",
    description: "A complete brand identity — logo, colour system, typography, visual language, and brand guidelines. Built to work at every scale. Not a logo alone — a coherent identity system your team can apply consistently.",
    outcomes: ["Primary and secondary logo suite", "Colour palette with usage rules", "Typography system", "Brand guidelines document", "Application examples (letterhead, cards, social)"],
    who: "Businesses launching, rebranding, or whose current identity no longer reflects their quality.",
    questions: [
      { q: "What stage is your business at?", type: "select" as const, options: ["New launch", "Rebranding", "Scaling up", "Established, needs refresh"] },
      { q: "What does your current brand communicate — and what should it communicate instead?", type: "textarea" as const },
      { q: "Who is your primary audience?", type: "textarea" as const },
      { q: "Are there any brands (not necessarily in your industry) whose visual identity you admire?", type: "textarea" as const },
    ],
    pastWork: [
      { label: "Kano Feeds Ltd — Brand Identity", type: "Brand" },
      { label: "Zaria Cooperative — Visual System", type: "Brand" },
      { label: "Northern Agri Group — Rebrand", type: "Brand" },
    ],
  },
  {
    id: "social-media",
    icon: BarChart2,
    name: "Social Media Management",
    tagline: "Consistent presence that builds authority",
    description: "End-to-end management of your social media presence. Strategy, content creation, scheduling, engagement, and monthly reporting.",
    outcomes: ["Monthly content calendar", "On-brand graphics and captions", "Consistent posting schedule", "Engagement management", "Monthly performance report"],
    who: "Businesses that need a consistent, professional social media presence without managing it internally.",
    questions: [
      { q: "Which platforms do you currently use or want to be active on?", type: "select" as const, options: ["Instagram only", "LinkedIn only", "Instagram + LinkedIn", "All major platforms", "Not sure yet"] },
      { q: "How would you describe your current social media presence?", type: "select" as const, options: ["Non-existent", "Inconsistent", "Active but not strategic", "Active and growing"] },
      { q: "What is the primary goal of your social media presence?", type: "select" as const, options: ["Brand awareness", "Lead generation", "Client retention", "Thought leadership", "Community building"] },
      { q: "Do you have existing brand assets (logo, colours, fonts)?", type: "select" as const, options: ["Yes, full brand guidelines", "Yes, partial assets", "No, starting fresh"] },
    ],
    pastWork: [
      { label: "Arewa Capital Partners — LinkedIn", type: "Social" },
      { label: "Kaduna Tech Hub — Instagram", type: "Social" },
      { label: "Nexus Consulting — Multi-platform", type: "Social" },
    ],
  },
  {
    id: "content-strategy",
    icon: MessageSquare,
    name: "Content Strategy",
    tagline: "A message that converts, not just communicates",
    description: "A structured content framework that defines what you say, how you say it, and where you say it. Covers brand voice, audience definition, platform strategy, and a content architecture your team can execute consistently.",
    outcomes: ["Brand voice and tone guide", "Audience definition and messaging matrix", "Platform-specific content strategy", "Content pillars and themes", "90-day content roadmap"],
    who: "Businesses whose content is inconsistent, unclear, or not generating the results they need.",
    questions: [
      { q: "What is the core message your business currently struggles to communicate?", type: "textarea" as const },
      { q: "Who makes the decision to work with you — and what do they need to hear?", type: "textarea" as const },
      { q: "What content does your team currently produce, if any?", type: "select" as const, options: ["Nothing yet", "Occasional posts", "Regular but inconsistent", "Consistent but not strategic"] },
      { q: "What outcome would signal that this strategy is working?", type: "textarea" as const },
    ],
    pastWork: [
      { label: "Meridian Advisory — Content Framework", type: "Strategy" },
      { label: "Sahel Ventures — Brand Voice", type: "Strategy" },
      { label: "Pinnacle Group — 90-Day Roadmap", type: "Strategy" },
    ],
  },
  {
    id: "podcast",
    icon: Mic,
    name: "Podcast Production",
    tagline: "A professional audio presence",
    description: "Full podcast production — concept development, recording setup guidance, editing, mixing, and distribution to all major platforms.",
    outcomes: ["Podcast concept and format development", "Professional audio editing and mixing", "Episode artwork and branding", "Distribution to Spotify, Apple Podcasts, and more", "Episode show notes and transcripts"],
    who: "Professionals, business owners, and organisations that want a podcast but not the production burden.",
    questions: [
      { q: "Do you have a podcast concept in mind, or do you need help developing one?", type: "select" as const, options: ["I have a clear concept", "I have a rough idea", "I need help developing the concept"] },
      { q: "What is the intended audience for this podcast?", type: "textarea" as const },
      { q: "How frequently do you intend to publish?", type: "select" as const, options: ["Weekly", "Bi-weekly", "Monthly", "Not sure yet"] },
      { q: "Do you have recording equipment, or do you need guidance on setup?", type: "select" as const, options: ["Yes, I have equipment", "I have basic equipment", "I need setup guidance"] },
    ],
    pastWork: [
      { label: "The Founders Table — Podcast Series", type: "Podcast" },
      { label: "Northern Business Review — Audio", type: "Podcast" },
      { label: "Arewa Insight — Weekly Show", type: "Podcast" },
    ],
  },
  {
    id: "event-media",
    icon: Camera,
    name: "Event Media Coverage",
    tagline: "Every important moment, captured properly",
    description: "Professional photography and video coverage for corporate events, product launches, training sessions, and brand activations. Delivered with post-event content ready for immediate use.",
    outcomes: ["Professional event photography", "Highlight video reel", "Post-event social media content package", "Edited footage for internal or public use", "Fast turnaround — content ready within 48 hours"],
    who: "Organisations hosting events that deserve to be documented and shared at a professional standard.",
    questions: [
      { q: "What type of event are you planning?", type: "select" as const, options: ["Conference or summit", "Product launch", "Corporate training", "Award ceremony", "Brand activation", "Other"] },
      { q: "What is the expected number of attendees?", type: "select" as const, options: ["Under 50", "50–150", "150–500", "Over 500"] },
      { q: "What do you need the content for?", type: "select" as const, options: ["Internal records only", "Social media", "Press and media", "All of the above"] },
      { q: "What is the event date and location?", type: "text" as const },
    ],
    pastWork: [
      { label: "Kaduna Investment Summit 2024", type: "Event" },
      { label: "HAMZURY Annual Gala", type: "Event" },
      { label: "Nexus Product Launch", type: "Event" },
    ],
  },
];

type ServiceQuestion = { q: string; type: "text" | "textarea" | "select"; options?: string[] };

function ServiceBriefForm({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitIntake = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const questions: ServiceQuestion[] = service.questions;
  const totalSteps = questions.length + 1;

  const canAdvance = step < questions.length ? !!answers[step] : !!(name && email && phone && business);

  function handleSubmit() {
    const notes = questions.map((q, i) => `${q.q}: ${answers[i] || "—"}`).join("\n");
    submitIntake.mutate({
      name,
      email,
      phone,
      department: "Studios",
      serviceType: service.name,
      description: `Business: ${business}\n\n${notes}`,
    });
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: BRAND }} />
        <h3 className="text-xl font-light mb-2" style={{ color: "#1a1a1a" }}>Brief received.</h3>
        <p className="text-sm text-muted-foreground mb-1">Reference: <strong>{ref}</strong></p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">
          Our team will review your brief and respond within the hour. Expect a clear proposal shortly after.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link href="/track" className="text-xs underline" style={{ color: BRAND }}>Track your project →</Link>
          <button onClick={onClose} className="text-xs text-muted-foreground underline">Close</button>
        </div>
      </div>
    );
  }

  const q = step < questions.length ? questions[step] : null;
  const Icon = service.icon;

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BRAND + "15", color: BRAND }}>
            <Icon size={16} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Studios</p>
            <h3 className="font-medium text-sm" style={{ color: "#1a1a1a" }}>{service.name} — Brief</h3>
          </div>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </div>

      <div className="flex gap-1 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-all" style={{ background: i <= step ? BRAND : "#e5e7eb" }} />
        ))}
      </div>

      {q ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Question {step + 1} of {questions.length}</p>
          <p className="text-lg font-light mb-6" style={{ color: "#1a1a1a" }}>{q.q}</p>
          {q.type === "select" ? (
            <div className="space-y-2">
              {q.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers(a => ({ ...a, [step]: opt }))}
                  className="w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all"
                  style={{
                    borderColor: answers[step] === opt ? BRAND : "#e5e7eb",
                    background: answers[step] === opt ? BRAND + "08" : "white",
                    color: answers[step] === opt ? BRAND : "#374151",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : q.type === "textarea" ? (
            <textarea
              className="w-full border border-border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none"
              style={{ minHeight: 100 }}
              placeholder="Your answer..."
              value={answers[step] || ""}
              onChange={(e) => setAnswers(a => ({ ...a, [step]: e.target.value }))}
            />
          ) : (
            <input
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none"
              placeholder="Your answer..."
              value={answers[step] || ""}
              onChange={(e) => setAnswers(a => ({ ...a, [step]: e.target.value }))}
            />
          )}
        </div>
      ) : (
        <div>
          <p className="text-lg font-light mb-2" style={{ color: "#1a1a1a" }}>Your details.</p>
          <p className="text-sm text-muted-foreground mb-6">We will respond within 24 hours with a clear proposal.</p>
          <div className="space-y-3">
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="Business name and industry" value={business} onChange={e => setBusiness(e.target.value)} />
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="WhatsApp number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={12} /> Back
          </button>
        ) : <span />}
        {step < totalSteps - 1 ? (
          <button
            onClick={() => canAdvance && setStep(s => s + 1)}
            disabled={!canAdvance}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: BRAND }}
          >
            Continue <ArrowRight size={13} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance || submitIntake.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: BRAND }}
          >
            {submitIntake.isPending ? "Submitting…" : "Submit Brief"} <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Studios() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const selected = SERVICES.find(s => s.id === activeService);

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
            <Link href="/services" className="nav-link">Our Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/portal" className="nav-link" style={{ border: "1.5px solid #1B4D3E", borderRadius: "4px", padding: "4px 12px", color: "#1B4D3E", fontWeight: 600 }}>Portal</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: BRAND }}>
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={12} /> All Services
          </Link>
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">Studios</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              We build the presence<br />that earns trust.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              Most businesses look smaller than they are. Studios fixes that. Brand identity, content, social media, podcast, and event media — built to the standard your work deserves.
            </p>
            <button
              onClick={() => {
                const content = ["HAMZURY STUDIOS — Department Overview","","SERVICES","1. Brand Identity Design","2. Social Media Management","3. Content Strategy","4. Podcast Production","5. Event Media Coverage","","HOW TO WORK WITH US","Visit hamzuryos.biz/start → Select Studios → Choose service → Complete brief","We respond within the hour.","","info@hamzury.com | hamzuryos.biz"].join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "HAMZURY-Studios-Overview.txt"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded border text-xs border-white/20 hover:border-white/50 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >↓ Download Studios Overview</button>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      {!activeService && (
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Services</p>
            <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Select a service to begin.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">Each service has its own brief form. Click any card to open a focused set of questions — no generic contact forms.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="bg-white border border-border rounded-lg p-7 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setActiveService(svc.id)}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: BRAND + "12", color: BRAND }}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ color: "#1a1a1a" }}>{svc.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{svc.tagline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">{svc.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all" style={{ color: BRAND }}>
                      Submit your brief <ArrowRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Brief Form */}
      {activeService && selected && (
        <section className="py-10 border-t border-border">
          <div className="container">
            <ServiceBriefForm service={selected} onClose={() => setActiveService(null)} />
          </div>
        </section>
      )}

      {/* What our clients receive */}
      {!activeService && (
        <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Outcomes</p>
            <h2 className="text-3xl font-light mb-12" style={{ color: "#1a1a1a" }}>What our clients receive.</h2>
            <div className="space-y-10">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.id} className="grid md:grid-cols-4 gap-6 pb-10 border-b border-border last:border-0 last:pb-0">
                    <div className="md:col-span-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BRAND + "12", color: BRAND }}>
                          <Icon size={15} />
                        </div>
                        <h3 className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{svc.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{svc.who}</p>
                    </div>
                    <div className="md:col-span-2">
                      <ul className="space-y-2">
                        {svc.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND }} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Selected work</p>
                      <div className="space-y-2">
                        {svc.pastWork.map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded flex items-center justify-center text-xs" style={{ background: BRAND + "10", color: BRAND }}>
                              {w.type[0]}
                            </div>
                            <p className="text-xs text-muted-foreground">{w.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
            <p className="text-xs text-muted-foreground">Structure. Clarity. Calm authority.</p>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link href="/ridi" className="hover:text-foreground transition-colors">RIDI</Link>
            <Link href="/team" className="hover:text-foreground transition-colors">Team</Link>
            <Link href="/policies" className="hover:text-foreground transition-colors">Policies</Link>
            <Link href="/track" className="hover:text-foreground transition-colors">Track Project</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
