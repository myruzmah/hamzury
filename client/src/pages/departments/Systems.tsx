import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2, Globe, LayoutDashboard, Cpu, Zap, Database } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const SERVICES = [
  {
    id: "website",
    icon: Globe,
    name: "Business Website",
    tagline: "A professional presence that converts",
    description: "A business website built to communicate credibility, answer the right questions, and convert visitors into enquiries. Not a template — a custom build designed around your business, your audience, and your goals.",
    outcomes: ["Custom design aligned to your brand", "Mobile-first, fast-loading build", "Contact and enquiry forms", "SEO-ready structure", "Content management capability"],
    youOwn: ["Full source code", "Hosting access and credentials", "Domain ownership", "Admin access to CMS", "Documentation for your team"],
    who: "Businesses that need a professional website that works as hard as they do.",
    questions: [
      { q: "Does your business currently have a website?", type: "select" as const, options: ["No website yet", "Yes, needs a rebuild", "Yes, needs improvements only"] },
      { q: "What is the primary goal of this website?", type: "select" as const, options: ["Generate enquiries", "Build credibility", "Sell products", "Provide information", "All of the above"] },
      { q: "Who is your target audience?", type: "textarea" as const },
      { q: "Do you have existing brand assets (logo, colours, fonts)?", type: "select" as const, options: ["Yes, full brand guidelines", "Yes, partial assets", "No, starting fresh"] },
    ],
  },
  {
    id: "web-app",
    icon: LayoutDashboard,
    name: "Web Application",
    tagline: "A platform built around your workflow",
    description: "A custom web application designed to solve a specific operational problem. Whether you need a client portal, a booking system, a marketplace, or an internal tool — we design, build, and deliver it.",
    outcomes: ["Custom feature set designed around your workflow", "User authentication and role management", "Database design and management", "API integrations with existing tools", "Ongoing maintenance and support"],
    youOwn: ["Full source code", "Database access and schema", "All API credentials and integrations", "Deployment infrastructure", "Technical documentation"],
    who: "Businesses with a specific operational problem that off-the-shelf software cannot solve.",
    questions: [
      { q: "What problem does this application need to solve?", type: "textarea" as const },
      { q: "Who will use this application?", type: "select" as const, options: ["Internal staff only", "Clients only", "Both staff and clients", "General public"] },
      { q: "Do you have any existing systems this needs to integrate with?", type: "textarea" as const },
      { q: "What does success look like for this project?", type: "textarea" as const },
    ],
  },
  {
    id: "dashboard",
    icon: Database,
    name: "Staff or Client Dashboard",
    tagline: "Visibility and control in one place",
    description: "A structured internal dashboard for your team or a client-facing portal for your customers. Centralises information, reduces back-and-forth, and gives everyone the visibility they need to do their job well.",
    outcomes: ["Custom dashboard design and build", "Role-based access control", "Real-time data display", "Document and deliverable management", "Notification and alert system"],
    youOwn: ["Full dashboard source code", "User management system", "Data export capability", "Admin controls", "Deployment and hosting access"],
    who: "Businesses that need to give their team or clients structured access to information and progress.",
    questions: [
      { q: "Who is the primary user of this dashboard?", type: "select" as const, options: ["Internal staff", "External clients", "Both"] },
      { q: "What information needs to be visible on the dashboard?", type: "textarea" as const },
      { q: "What actions should users be able to take from the dashboard?", type: "textarea" as const },
      { q: "Do you have an existing system this should pull data from?", type: "select" as const, options: ["Yes, existing system", "No, starting fresh", "Partially — some data exists"] },
    ],
  },
  {
    id: "automation",
    icon: Zap,
    name: "Automation & AI Workflow",
    tagline: "Eliminate the work that should not be manual",
    description: "Intelligent systems that automate repetitive processes, reduce manual errors, and free your team to focus on work that requires human judgment. From simple workflow automation to AI-powered decision support.",
    outcomes: ["Process audit and automation opportunity mapping", "Custom automation build", "AI integration where relevant", "Testing and quality assurance", "Team training and handover documentation"],
    youOwn: ["Automation scripts and workflows", "AI model configuration", "API keys and integration access", "Process documentation", "Training materials for your team"],
    who: "Businesses spending significant time on repetitive, manual processes that could be automated.",
    questions: [
      { q: "What process do you want to automate?", type: "textarea" as const },
      { q: "How much time does your team currently spend on this process per week?", type: "select" as const, options: ["Under 2 hours", "2–5 hours", "5–10 hours", "Over 10 hours"] },
      { q: "What tools or software are currently involved in this process?", type: "textarea" as const },
      { q: "What would the ideal automated version look like?", type: "textarea" as const },
    ],
  },
  {
    id: "crm",
    icon: Cpu,
    name: "CRM System",
    tagline: "A structured pipeline for every relationship",
    description: "A customer relationship management system designed around how your business actually works. Track leads, manage client relationships, automate follow-ups, and generate the reports that help you make better decisions.",
    outcomes: ["Custom CRM configuration or build", "Lead and client pipeline management", "Automated follow-up sequences", "Team collaboration features", "Reporting and analytics dashboard"],
    youOwn: ["Full CRM access and admin rights", "Data export in standard formats", "Workflow automation rules", "User management controls", "Integration documentation"],
    who: "Businesses managing clients and leads in WhatsApp, spreadsheets, or memory — and ready to do it properly.",
    questions: [
      { q: "How do you currently manage your leads and clients?", type: "select" as const, options: ["WhatsApp / phone only", "Spreadsheets", "Basic software (Trello, Notion)", "Existing CRM (needs replacing)", "No system at all"] },
      { q: "How many active leads or clients do you manage at any time?", type: "select" as const, options: ["Under 20", "20–50", "50–200", "Over 200"] },
      { q: "What is the most important thing a CRM should help you do?", type: "select" as const, options: ["Track leads", "Manage follow-ups", "Collaborate as a team", "Generate reports", "All of the above"] },
      { q: "How many team members will use this system?", type: "select" as const, options: ["Just me", "2–5 people", "6–15 people", "Over 15"] },
    ],
  },
];

const BUILD_PROCESS = [
  {
    step: "01",
    title: "Brief & Discovery",
    description: "We start with your brief and ask the questions that reveal what you actually need — not just what you asked for. We map the problem, the users, the constraints, and the outcome.",
  },
  {
    step: "02",
    title: "Design & Architecture",
    description: "We design the structure before we write a single line of code. Database schema, user flows, interface wireframes, and technical architecture — all reviewed and approved before build begins.",
  },
  {
    step: "03",
    title: "Build & Deliver",
    description: "We build in structured sprints with regular check-ins. You see progress at every stage. When we deliver, you receive the product, the documentation, and everything you need to own it independently.",
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
      department: "Systems",
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
            <p className="text-xs text-muted-foreground">Systems</p>
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

export default function Systems() {
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
            <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">Systems</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              Stop running your business<br />on manual processes.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              Manual processes are not a workflow. They are a ceiling. Systems builds the digital infrastructure that removes that ceiling — and you own everything we build.
            </p>
            <button
              onClick={() => {
                const content = ["HAMZURY SYSTEMS — Department Overview","","SERVICES","1. Business Website","2. Web Application","3. Staff or Client Dashboard","4. Automation & AI Workflow","5. CRM System","","WHAT YOU OWN AT THE END","Full source code, database access, all credentials, hosting access, documentation.","","HOW TO WORK WITH US","Visit hamzuryos.biz/start → Select Systems → Choose service → Complete brief","We respond within the hour.","","info@hamzury.com | hamzuryos.biz"].join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "HAMZURY-Systems-Overview.txt"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded border text-xs border-white/20 hover:border-white/50 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >↓ Download Systems Overview</button>
          </div>
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div><p className="text-2xl font-light text-white">5</p><p className="text-xs text-white/50 mt-1">Build services</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">100%</p><p className="text-xs text-white/50 mt-1">Client ownership</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">24h</p><p className="text-xs text-white/50 mt-1">Brief response time</p></div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      {!activeService && (
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Services</p>
            <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Select a service to begin.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">Each service has its own focused brief form. Click any card to open a set of questions specific to what you need built.</p>
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
                    <p className="text-xs text-muted-foreground mb-4">{svc.tagline}</p>
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

      {/* How We Build */}
      {!activeService && (
        <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Process</p>
            <h2 className="text-3xl font-light mb-12" style={{ color: "#1a1a1a" }}>How we build.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {BUILD_PROCESS.map((p) => (
                <div key={p.step} className="relative">
                  <p className="text-4xl font-light mb-4 opacity-20" style={{ color: BRAND }}>{p.step}</p>
                  <h3 className="font-medium mb-3" style={{ color: "#1a1a1a" }}>{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What You Own */}
      {!activeService && (
        <section className="py-20 border-t border-border">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Ownership</p>
            <h2 className="text-3xl font-light mb-4" style={{ color: "#1a1a1a" }}>What you own at the end.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">Every project we deliver comes with full ownership transfer. You are not renting access to something we built — you own it outright.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: BRAND + "12", color: BRAND }}>
                        <Icon size={14} />
                      </div>
                      <h3 className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{svc.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {svc.youOwn.map((item) => (
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
