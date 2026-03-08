import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, RotateCcw, Receipt, Shield, BadgeCheck, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const SERVICES = [
  {
    id: "cac-reg",
    icon: Building2,
    name: "CAC Business Registration",
    tagline: "Your business, properly registered",
    description: "Complete business registration with the Corporate Affairs Commission — business name, private limited company, or incorporated trustee. We handle the entire process, from name availability check to certificate collection.",
    outcomes: ["Business name availability check", "CAC registration — business name or company incorporation", "Certificate of registration", "Memorandum and Articles of Association (where applicable)", "Post-registration guidance"],
    youReceive: ["Certificate of Incorporation or Business Name Certificate", "Memorandum and Articles of Association", "CAC portal access credentials", "Post-registration compliance checklist", "Guidance on next steps"],
    who: "Entrepreneurs and businesses that are not yet registered, or need to formalise an existing operation.",
    questions: [
      { q: "What type of business entity do you want to register?", type: "select" as const, options: ["Business Name", "Private Limited Company (Ltd)", "Incorporated Trustee (NGO/Foundation)", "Not sure — need guidance"] },
      { q: "Do you have a preferred business name?", type: "textarea" as const },
      { q: "What does your business do?", type: "textarea" as const },
      { q: "How urgently do you need this completed?", type: "select" as const, options: ["Within 1 week", "Within 2 weeks", "Within a month", "No specific deadline"] },
    ],
  },
  {
    id: "annual-returns",
    icon: RotateCcw,
    name: "Annual Returns Filing",
    tagline: "Stay compliant, every year",
    description: "Statutory annual returns filing with the CAC — on time, every time. We handle the documentation, submission, and confirmation so your business remains in good standing with the regulator.",
    outcomes: ["Annual returns preparation and filing", "Penalty avoidance through timely submission", "Confirmation of filing", "Multi-year catch-up for outstanding returns"],
    youReceive: ["CAC filing confirmation receipt", "Updated compliance status on CAC portal", "Filing records for your archive", "Reminder for next filing cycle"],
    who: "Registered businesses that need to file annual returns — whether current or with outstanding years.",
    questions: [
      { q: "Is your business currently registered with the CAC?", type: "select" as const, options: ["Yes — Business Name", "Yes — Private Limited Company", "Yes — Incorporated Trustee", "Not sure"] },
      { q: "How many years of annual returns are outstanding?", type: "select" as const, options: ["Current year only", "1–2 years outstanding", "3–5 years outstanding", "More than 5 years"] },
      { q: "What is your CAC registration number (if known)?", type: "textarea" as const },
      { q: "How urgently do you need this filed?", type: "select" as const, options: ["Immediately", "Within 2 weeks", "Within a month", "No specific deadline"] },
    ],
  },
  {
    id: "tax-reg",
    icon: Receipt,
    name: "Tax Registration",
    tagline: "Registered with the right authorities",
    description: "Tax Identification Number (TIN), VAT registration, and corporate income tax registration with FIRS or the relevant State Internal Revenue Service. We handle the paperwork and follow up until your certificates are issued.",
    outcomes: ["TIN registration with FIRS", "VAT registration", "Corporate income tax registration", "State-level tax registration where applicable", "Tax compliance guidance"],
    youReceive: ["Tax Identification Number (TIN)", "VAT registration certificate (if applicable)", "FIRS or SIRS registration confirmation", "Tax compliance obligations summary"],
    who: "Businesses that need to register for tax or are unsure which tax obligations apply to them.",
    questions: [
      { q: "What type of tax registration do you need?", type: "select" as const, options: ["TIN only", "VAT registration", "Corporate income tax", "All of the above", "Not sure — need assessment"] },
      { q: "Is your business currently registered with the CAC?", type: "select" as const, options: ["Yes", "No — need CAC registration too", "Not sure"] },
      { q: "What state is your business based in?", type: "textarea" as const },
      { q: "What is your annual revenue (approximate)?", type: "select" as const, options: ["Under ₦25 million", "₦25m – ₦100m", "Over ₦100m", "Prefer not to say"] },
    ],
  },
  {
    id: "pencom",
    icon: Shield,
    name: "PENCOM Compliance",
    tagline: "Pension obligations handled properly",
    description: "Pension Fund Administrator (PFA) registration and ongoing PENCOM compliance for businesses with 3 or more employees. We manage the registration process and ensure your business meets its statutory pension obligations.",
    outcomes: ["PFA selection and registration", "Employee pension account setup", "Monthly remittance process setup", "PENCOM compliance certificate", "Ongoing compliance support"],
    youReceive: ["PENCOM compliance certificate", "Employee RSA pin numbers", "Monthly remittance process documentation", "Employer PENCOM portal access"],
    who: "Businesses with 3 or more employees that are not yet registered with a Pension Fund Administrator.",
    questions: [
      { q: "How many employees does your business currently have?", type: "select" as const, options: ["3–10 employees", "11–50 employees", "51–200 employees", "Over 200 employees"] },
      { q: "Are any of your employees already registered with a PFA?", type: "select" as const, options: ["No — none are registered", "Some are registered", "All are registered — need compliance review"] },
      { q: "Do you have a preferred Pension Fund Administrator?", type: "select" as const, options: ["Yes — we have a preference", "No — please recommend one", "Not sure what a PFA is"] },
      { q: "How urgently do you need this resolved?", type: "select" as const, options: ["Immediately", "Within 2 weeks", "Within a month", "No specific deadline"] },
    ],
  },
  {
    id: "licensing",
    icon: BadgeCheck,
    name: "Industry Licensing",
    tagline: "The permits your sector requires",
    description: "Sector-specific regulatory permits and approvals — NAFDAC, NCC, CBN, SEC, SON, and other regulatory bodies. We identify the exact licences your business needs, prepare the applications, and manage the process to approval.",
    outcomes: ["Regulatory requirement assessment", "Licence application preparation", "Submission and follow-up management", "Approval and certificate collection", "Renewal management"],
    youReceive: ["Regulatory licence or permit certificate", "Application records and correspondence", "Renewal schedule and reminders", "Compliance obligations summary for your sector"],
    who: "Businesses in regulated industries that need sector-specific permits to operate legally.",
    questions: [
      { q: "What industry or sector does your business operate in?", type: "textarea" as const },
      { q: "Which regulatory body do you need a licence from?", type: "select" as const, options: ["NAFDAC", "NCC", "CBN", "SEC", "SON", "NESREA", "Not sure — need assessment", "Other"] },
      { q: "Do you already have any existing licences or permits?", type: "select" as const, options: ["Yes — need renewal or additional licences", "No — starting fresh", "Not sure what licences I need"] },
      { q: "How urgently do you need this?", type: "select" as const, options: ["Immediately", "Within a month", "Within 3 months", "No specific deadline"] },
    ],
  },
  {
    id: "compliance-advisory",
    icon: BookOpen,
    name: "Compliance Advisory",
    tagline: "Know your obligations before they become problems",
    description: "Ongoing regulatory guidance for businesses that want to stay ahead of compliance requirements. We review your current compliance posture, identify gaps, and provide a structured plan to address them.",
    outcomes: ["Compliance audit and gap analysis", "Regulatory obligation mapping", "Structured compliance improvement plan", "Ongoing advisory retainer (monthly or quarterly)", "Regulatory change monitoring"],
    youReceive: ["Written compliance audit report", "Regulatory obligation register", "Structured remediation plan", "Ongoing advisory access (if retainer engaged)"],
    who: "Businesses that want to understand and manage their regulatory obligations proactively.",
    questions: [
      { q: "What is the nature of your compliance concern?", type: "select" as const, options: ["I don't know what I'm not compliant with", "I know there are gaps — need a plan", "I want ongoing advisory support", "Preparing for audit or regulatory inspection"] },
      { q: "What industry does your business operate in?", type: "textarea" as const },
      { q: "How many employees does your business have?", type: "select" as const, options: ["1–10", "11–50", "51–200", "Over 200"] },
      { q: "Have you ever received a regulatory query or penalty?", type: "select" as const, options: ["Yes — need to resolve it", "No — want to stay ahead", "Not sure"] },
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
      department: "Bizdoc",
      serviceType: service.name,
      description: `Business: ${business}\n\n${notes}`,
    });
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: BRAND }} />
        <h3 className="text-xl font-light mb-2" style={{ color: "#1a1a1a" }}>Request received.</h3>
        <p className="text-sm text-muted-foreground mb-1">Reference: <strong>{ref}</strong></p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">
          Our compliance team will review your request and respond within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link href="/track" className="text-xs underline" style={{ color: BRAND }}>Track your request →</Link>
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
            <p className="text-xs text-muted-foreground">Bizdoc</p>
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
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="Business name and type" value={business} onChange={e => setBusiness(e.target.value)} />
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
            {submitIntake.isPending ? "Submitting…" : "Submit Request"} <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Bizdoc() {
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
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <Link href="/services/bizdoc" className="nav-link" style={{ color: BRAND, fontWeight: 600 }}>Bizdoc</Link>
            <Link href="/portal" className="nav-link">Portal</Link>
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
            <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">04 — Bizdoc</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              Your business should be<br />registered, compliant,<br />protected.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              CAC registration, annual returns, tax filings, PENCOM compliance, industry licensing, and regulatory advisory — handled properly, from start to finish.
            </p>
          </div>
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div><p className="text-2xl font-light text-white">6</p><p className="text-xs text-white/50 mt-1">Compliance services</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">24h</p><p className="text-xs text-white/50 mt-1">Brief response time</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">100%</p><p className="text-xs text-white/50 mt-1">Documented delivery</p></div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      {!activeService && (
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Services</p>
            <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Select a service to begin.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">Each service has its own focused brief form. Click any card to open a set of questions specific to what you need handled.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="bg-white border border-border rounded-xl p-7 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setActiveService(svc.id)}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: BRAND + "12", color: BRAND }}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ color: "#1a1a1a" }}>{svc.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{svc.tagline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">{svc.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all" style={{ color: BRAND }}>
                      Submit your request <ArrowRight size={13} />
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

      {/* What You Receive */}
      {!activeService && (
        <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Deliverables</p>
            <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>What you receive.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">Every Bizdoc engagement delivers documented, official outputs. You receive the certificates, records, and access credentials — not just confirmation that something was done.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.id} className="border border-border rounded-xl p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: BRAND + "12", color: BRAND }}>
                        <Icon size={14} />
                      </div>
                      <h3 className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{svc.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {svc.youReceive.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: BRAND }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {!activeService && (
        <section className="py-20 border-t border-border">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Process</p>
            <h2 className="text-3xl font-light mb-12" style={{ color: "#1a1a1a" }}>How we handle it.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Submit your brief", description: "Select the service you need and answer a short set of questions specific to your situation. We review every brief within 24 hours." },
                { step: "02", title: "We prepare and submit", description: "Our compliance team prepares all required documentation, submits to the relevant authority, and manages the follow-up process on your behalf." },
                { step: "03", title: "You receive the outcome", description: "When approval is granted, you receive the official certificate or confirmation, plus all records and credentials in a documented handover." },
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
            <Link href="/track" className="hover:text-foreground transition-colors">Track Request</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
