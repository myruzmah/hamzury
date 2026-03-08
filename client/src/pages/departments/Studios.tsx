import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  { id: "brand-identity", name: "Brand Identity", tagline: "A visual system that commands respect", description: "A complete brand identity — logo, colour system, typography, visual language, and brand guidelines. Built to work at every scale. Not a logo alone — a coherent identity system your team can apply consistently.", outcomes: ["Primary and secondary logo suite", "Colour palette with usage rules", "Typography system", "Brand guidelines document", "Application examples (letterhead, cards, social)"], who: "Businesses launching, rebranding, or whose current identity no longer reflects their quality." },
  { id: "social-media", name: "Social Media Management", tagline: "Consistent presence that builds authority", description: "End-to-end management of your social media presence. Strategy, content creation, scheduling, engagement, and monthly reporting.", outcomes: ["Monthly content calendar", "On-brand graphics and captions", "Consistent posting schedule", "Engagement management", "Monthly performance report"], who: "Businesses that need a consistent, professional social media presence without managing it internally." },
  { id: "content-strategy", name: "Content Strategy", tagline: "A message that converts, not just communicates", description: "A structured content framework that defines what you say, how you say it, and where you say it. Covers brand voice, audience definition, platform strategy, and a content architecture your team can execute consistently.", outcomes: ["Brand voice and tone guide", "Audience definition and messaging matrix", "Platform-specific content strategy", "Content pillars and themes", "90-day content roadmap"], who: "Businesses whose content is inconsistent, unclear, or not generating the results they need." },
  { id: "podcast", name: "Podcast Production", tagline: "A professional audio presence", description: "Full podcast production — concept development, recording setup guidance, editing, mixing, and distribution to all major platforms.", outcomes: ["Podcast concept and format development", "Professional audio editing and mixing", "Episode artwork and branding", "Distribution to Spotify, Apple Podcasts, and more", "Episode show notes and transcripts"], who: "Professionals, business owners, and organisations that want a podcast but not the production burden." },
  { id: "event-media", name: "Event Media Coverage", tagline: "Every important moment, captured properly", description: "Professional photography and video coverage for corporate events, product launches, training sessions, and brand activations. Delivered with post-event content ready for immediate use.", outcomes: ["Professional event photography", "Highlight video reel", "Post-event social media content package", "Edited footage for internal or public use", "Fast turnaround — content ready within 48 hours"], who: "Organisations hosting events that deserve to be documented and shared at a professional standard." },
];

function BriefForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ service: "", name: "", email: "", phone: "", business: "", challenge: "", timeline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const STEPS = [
    { title: "What do you need?", field: "service" as const, options: SERVICES.map((s) => s.name) },
    { title: "Tell us about your business", fields: [{ key: "name" as const, label: "Your name", type: "text", placeholder: "Full name" }, { key: "email" as const, label: "Email address", type: "email", placeholder: "your@email.com" }, { key: "phone" as const, label: "WhatsApp number", type: "tel", placeholder: "+234 800 000 0000" }, { key: "business" as const, label: "Business name and industry", type: "text", placeholder: "e.g. Kano Feeds Ltd — food manufacturing" }] },
    { title: "A few more details", fields: [{ key: "challenge" as const, label: "What is the core problem you need solved?", type: "text", placeholder: "Be specific — the more detail, the better our brief" }, { key: "timeline" as const, label: "When do you need this completed?", type: "text", placeholder: "e.g. Within 6 weeks, by end of April" }] },
  ];

  if (submitted) return (
    <div className="text-center py-10">
      <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: "var(--brand)" }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand)" }}>Brief received</h3>
      <p className="text-sm text-muted-foreground mb-1">Your reference: <strong>{ref}</strong></p>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">Our team will review your brief and respond within 24 hours.</p>
      <Link href="/track" className="inline-block mt-6 text-xs underline" style={{ color: "var(--brand)" }}>Track your project →</Link>
    </div>
  );

  const currentStep = STEPS[step];
  const canProceed = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!(form.name && form.email && form.phone && form.business);
    if (step === 2) return !!form.challenge;
    return false;
  };

  const handleSubmit = () => {
    submitMutation.mutate({ name: form.name, email: form.email, phone: form.phone, department: "Studios", serviceType: form.service, description: `Business: ${form.business}\n\nChallenge: ${form.challenge}\n\nTimeline: ${form.timeline}` });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex gap-1.5 mb-8">{STEPS.map((_, i) => (<div key={i} className="flex-1 h-0.5 rounded-full transition-all" style={{ background: i <= step ? "var(--brand)" : "#E5E7EB" }} />))}</div>
      <h3 className="text-base font-semibold mb-5" style={{ color: "var(--brand)" }}>{currentStep.title}</h3>
      {step === 0 && (<div className="space-y-2">{SERVICES.map((s) => (<button key={s.id} onClick={() => setForm((f) => ({ ...f, service: s.name }))} className="w-full text-left px-4 py-3.5 rounded-sm border text-sm transition-all" style={{ borderColor: form.service === s.name ? "var(--brand)" : "#E5E7EB", background: form.service === s.name ? "rgba(27,77,62,0.04)" : "white", color: form.service === s.name ? "var(--brand)" : "#374151", fontWeight: form.service === s.name ? 600 : 400 }}>{s.name}</button>))}</div>)}
      {(step === 1 || step === 2) && "fields" in currentStep && (<div className="space-y-4">{currentStep.fields!.map((field) => (<div key={field.key}><label className="block text-xs font-medium mb-1.5 text-muted-foreground">{field.label}</label><input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))} className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1" /></div>))}</div>)}
      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (<button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={12} /> Back</button>) : <span />}
        {step < STEPS.length - 1 ? (<button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold text-white disabled:opacity-40" style={{ background: "var(--brand)" }}>Continue <ArrowRight size={13} /></button>) : (<button onClick={handleSubmit} disabled={!canProceed() || submitMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold text-white disabled:opacity-40" style={{ background: "var(--brand)" }}>{submitMutation.isPending ? "Submitting…" : "Submit Brief"} <ArrowRight size={13} /></button>)}
      </div>
    </div>
  );
}

export default function Studios() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link">Bizdoc</a>
            <Link href="/portal" className="nav-link">Portal</Link>
          </nav>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--brand)" }}>
        <div className="container max-w-3xl">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}><ArrowLeft size={12} /> All Services</Link>
          <span className="block w-8 h-px mb-8" style={{ background: "rgba(255,255,255,0.3)" }} />
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>Studios</h1>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>Brand identity, content strategy, social media management, podcast production, and event media coverage. We build the visual and narrative presence that makes your business credible before anyone speaks to you.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl">
          <span className="block w-8 h-px mb-12" style={{ background: "var(--brand)" }} />
          <h2 className="text-xl font-light mb-12" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>What we offer</h2>
          <div className="space-y-12">
            {SERVICES.map((svc) => (
              <div key={svc.id} className="grid md:grid-cols-3 gap-8 pb-12 border-b border-border last:border-0 last:pb-0">
                <div className="md:col-span-1"><h3 className="text-base font-semibold mb-1" style={{ color: "var(--brand)" }}>{svc.name}</h3><p className="text-xs text-muted-foreground">{svc.tagline}</p></div>
                <div className="md:col-span-2">
                  <p className="text-sm leading-relaxed text-foreground mb-4">{svc.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand)" }}>Outcomes</p>
                  <ul className="space-y-1.5 mb-4">{svc.outcomes.map((o) => (<li key={o} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--brand)" }} />{o}</li>))}</ul>
                  <p className="text-xs text-muted-foreground italic">{svc.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-2xl">
          <span className="block w-8 h-px mb-10" style={{ background: "var(--brand)" }} />
          <h2 className="text-xl font-light mb-3" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>Submit a brief</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">Tell us what you need. Our team will review your brief and come back with a clear proposal within 24 hours.</p>
          <BriefForm />
        </div>
      </section>

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
