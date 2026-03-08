import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SERVICES = [
  {
    id: "website",
    name: "Business Website",
    tagline: "A professional presence that converts",
    description: "A business website built to communicate credibility, answer the right questions, and convert visitors into enquiries. Not a template — a custom build designed around your business, your audience, and your goals.",
    outcomes: ["Custom design aligned to your brand", "Mobile-first, fast-loading build", "Contact and enquiry forms", "SEO-ready structure", "Content management capability"],
    who: "Businesses that need a professional website that works as hard as they do.",
  },
  {
    id: "web-app",
    name: "Web Application",
    tagline: "A platform built around your workflow",
    description: "A custom web application designed to solve a specific operational problem. Whether you need a client portal, a booking system, a marketplace, or an internal tool — we design, build, and deliver it.",
    outcomes: ["Custom feature set designed around your workflow", "User authentication and role management", "Database design and management", "API integrations with existing tools", "Ongoing maintenance and support"],
    who: "Businesses with a specific operational problem that off-the-shelf software cannot solve.",
  },
  {
    id: "dashboard",
    name: "Staff or Client Dashboard",
    tagline: "Visibility and control in one place",
    description: "A structured internal dashboard for your team or a client-facing portal for your customers. Centralises information, reduces back-and-forth, and gives everyone the visibility they need to do their job well.",
    outcomes: ["Custom dashboard design and build", "Role-based access control", "Real-time data display", "Document and deliverable management", "Notification and alert system"],
    who: "Businesses that need to give their team or clients structured access to information and progress.",
  },
  {
    id: "automation",
    name: "Automation & AI Workflow",
    tagline: "Eliminate the work that should not be manual",
    description: "Intelligent systems that automate repetitive processes, reduce manual errors, and free your team to focus on work that requires human judgment. From simple workflow automation to AI-powered decision support.",
    outcomes: ["Process audit and automation opportunity mapping", "Custom automation build", "AI integration where relevant", "Testing and quality assurance", "Team training and handover documentation"],
    who: "Businesses spending significant time on repetitive, manual processes that could be automated.",
  },
  {
    id: "crm",
    name: "CRM System",
    tagline: "A structured pipeline for every relationship",
    description: "A customer relationship management system designed around how your business actually works. Track leads, manage client relationships, automate follow-ups, and generate the reports that help you make better decisions.",
    outcomes: ["Custom CRM configuration or build", "Lead and client pipeline management", "Automated follow-up sequences", "Team collaboration features", "Reporting and analytics dashboard"],
    who: "Businesses managing clients and leads in WhatsApp, spreadsheets, or memory — and ready to do it properly.",
  },
];

function ProjectBriefForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ service: "", name: "", email: "", phone: "", business: "", problem: "", existing: "", timeline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const STEPS = [
    { title: "What do you need built?", options: SERVICES.map((s) => s.name) },
    { title: "About your business", fields: [{ key: "name" as const, label: "Your name", type: "text", placeholder: "Full name" }, { key: "email" as const, label: "Email address", type: "email", placeholder: "your@email.com" }, { key: "phone" as const, label: "WhatsApp number", type: "tel", placeholder: "+234 800 000 0000" }, { key: "business" as const, label: "Business name and industry", type: "text", placeholder: "e.g. Kano Feeds Ltd — food manufacturing" }] },
    { title: "About the project", fields: [{ key: "problem" as const, label: "What problem does this need to solve?", type: "text", placeholder: "Describe the situation as clearly as possible" }, { key: "existing" as const, label: "What do you currently use (if anything)?", type: "text", placeholder: "e.g. WhatsApp, Excel, a specific software" }, { key: "timeline" as const, label: "When do you need this delivered?", type: "text", placeholder: "e.g. Within 2 months, by end of Q2" }] },
  ];

  if (submitted) return (
    <div className="text-center py-10">
      <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: "var(--brand)" }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand)" }}>Brief received</h3>
      <p className="text-sm text-muted-foreground mb-1">Your reference: <strong>{ref}</strong></p>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">Our team will review your brief and respond within 24 hours with a clear proposal.</p>
      <Link href="/track" className="inline-block mt-6 text-xs underline" style={{ color: "var(--brand)" }}>Track your project →</Link>
    </div>
  );

  const currentStep = STEPS[step];
  const canProceed = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!(form.name && form.email && form.phone && form.business);
    if (step === 2) return !!form.problem;
    return false;
  };

  const handleSubmit = () => {
    submitMutation.mutate({ name: form.name, email: form.email, phone: form.phone, department: "Systems", serviceType: form.service, description: `Business: ${form.business}\n\nProblem: ${form.problem}\n\nExisting tools: ${form.existing}\n\nTimeline: ${form.timeline}` });
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

export default function Systems() {
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
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <a href="https://bizdoc.hamzury.com" target="_blank" rel="noopener noreferrer" className="nav-link">Bizdoc</a>
            <Link href="/portal" className="nav-link">Portal</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--milk)" }}>
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-70 transition-opacity" style={{ color: "var(--brand)" }}>
            <ArrowLeft size={12} /> All Services
          </Link>
          <div className="max-w-2xl">
            <p className="label mb-4" style={{ color: "var(--brand)" }}>03 — Systems</p>
            <h1 className="display mb-6" style={{ color: "var(--charcoal)" }}>
              Stop running your business<br />on manual processes.
            </h1>
            <p className="text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg" style={{ color: "var(--body-text)" }}>
              Websites, web applications, dashboards, automation systems, and AI workflows — built to replace the manual work that is slowing your business down.
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

      {/* Inline Brief Form */}
      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-2xl">
          <span className="block w-8 h-px mb-10" style={{ background: "var(--brand)" }} />
          <h2 className="text-xl font-light mb-3" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>Submit a project brief</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">Tell us what you need built. Our team will review your brief and respond within 24 hours with a clear proposal and timeline.</p>
          <ProjectBriefForm />
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
