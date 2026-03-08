import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

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
    description: "Focused, practical training in the digital tools that matter most for modern work. From basic digital literacy to social media management, data tools, design software, and AI productivity tools.",
    outcomes: ["Proficiency in relevant digital tools", "Immediate application to daily work", "Structured learning path with clear milestones", "Certificate of completion"],
    who: "Individuals, teams, and organisations that need to close a digital skills gap.",
  },
  {
    id: "internship",
    name: "Internship Programme",
    tagline: "Structured work experience at HAMZURY",
    description: "A competitive internship across HAMZURY departments. Interns work on real projects under direct supervision. Not a placement programme — a structured capability development experience.",
    outcomes: ["Real project experience across HAMZURY departments", "Mentorship from department leads", "A professional portfolio of completed work", "Pathway to full-time consideration for outstanding interns"],
    who: "Students, recent graduates, and career changers who want structured, real-world experience.",
  },
  {
    id: "corporate",
    name: "Corporate Training",
    tagline: "Custom capability development for organisations",
    description: "Training programmes designed around your organisation's specific needs. We assess the gap, design the curriculum, and deliver it — in-person, at our facility, or online.",
    outcomes: ["Custom curriculum aligned to your organisational goals", "Measurable skill improvement across the team", "Post-training assessment and follow-up", "Scalable delivery for teams of any size"],
    who: "Organisations that need to develop their people in a structured, measurable way.",
  },
];

function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ programme: "", name: "", email: "", phone: "", role: "", goal: "", timeline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const STEPS = [
    {
      title: "Which programme are you applying for?",
      field: "programme" as const,
      options: SERVICES.map((s) => s.name),
    },
    {
      title: "Tell us about yourself",
      fields: [
        { key: "name" as const, label: "Full name", type: "text", placeholder: "Your full name" },
        { key: "email" as const, label: "Email address", type: "email", placeholder: "your@email.com" },
        { key: "phone" as const, label: "WhatsApp number", type: "tel", placeholder: "+234 800 000 0000" },
      ],
    },
    {
      title: "A few more details",
      fields: [
        { key: "role" as const, label: "Your current role or status", type: "text", placeholder: "e.g. Business Owner, Student, Manager" },
        { key: "goal" as const, label: "What do you want to achieve from this programme?", type: "text", placeholder: "Be specific — this helps us assess your fit" },
        { key: "timeline" as const, label: "When are you looking to start?", type: "text", placeholder: "e.g. Next cohort, Within 3 months" },
      ],
    },
  ];

  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: "var(--brand)" }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand)" }}>Application received</h3>
        <p className="text-sm text-muted-foreground mb-1">Your reference: <strong>{ref}</strong></p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">
          Our team will review your application and reach out within 48 hours with a personal response.
        </p>
        <Link href="/track" className="inline-block mt-6 text-xs underline" style={{ color: "var(--brand)" }}>Track your application →</Link>
      </div>
    );
  }

  const currentStep = STEPS[step];

  const canProceed = () => {
    if (step === 0) return !!form.programme;
    if (step === 1) return !!(form.name && form.email && form.phone);
    if (step === 2) return !!(form.role && form.goal);
    return false;
  };

  const handleSubmit = () => {
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: "Innovation",
      serviceType: form.programme,
      description: `Role: ${form.role}\n\nGoal: ${form.goal}\n\nTimeline: ${form.timeline}`,
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full transition-all" style={{ background: i <= step ? "var(--brand)" : "#E5E7EB" }} />
        ))}
      </div>

      <h3 className="text-base font-semibold mb-5" style={{ color: "var(--brand)" }}>{currentStep.title}</h3>

      {step === 0 && (
        <div className="space-y-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setForm((f) => ({ ...f, programme: s.name }))}
              className="w-full text-left px-4 py-3.5 rounded-sm border text-sm transition-all"
              style={{
                borderColor: form.programme === s.name ? "var(--brand)" : "#E5E7EB",
                background: form.programme === s.name ? "rgba(27,77,62,0.04)" : "white",
                color: form.programme === s.name ? "var(--brand)" : "#374151",
                fontWeight: form.programme === s.name ? 600 : 400,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {(step === 1 || step === 2) && "fields" in currentStep && (
        <div className="space-y-4">
          {currentStep.fields!.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1"
                style={{ "--tw-ring-color": "var(--brand)" } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={12} /> Back
          </button>
        ) : <span />}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ background: "var(--brand)" }}
          >
            Continue <ArrowRight size={13} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || submitMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ background: "var(--brand)" }}
          >
            {submitMutation.isPending ? "Submitting…" : "Submit Application"} <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

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
            <Link href="/services" className="nav-link text-xs hidden sm:block">Services</Link>
            <Link href="/start" className="px-4 py-2 rounded-sm text-xs font-semibold text-white" style={{ background: "var(--brand)" }}>Start a Project</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 grain-overlay" style={{ background: "var(--brand)" }}>
        <div className="container max-w-3xl">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={12} /> All Services
          </Link>
          <span className="block w-8 h-px mb-8" style={{ background: "rgba(255,255,255,0.3)" }} />
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Innovation Hub
          </h1>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            Training, education, and capability development. For children learning technology, professionals building institutions, teams closing skills gaps, and organisations investing in their people.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <span className="block w-8 h-px mb-12" style={{ background: "var(--brand)" }} />
          <h2 className="text-xl font-light mb-12" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>What we offer</h2>
          <div className="space-y-12">
            {SERVICES.map((svc) => (
              <div key={svc.id} className="grid md:grid-cols-3 gap-8 pb-12 border-b border-border last:border-0 last:pb-0">
                <div className="md:col-span-1">
                  <h3 className="text-base font-semibold mb-1" style={{ color: "var(--brand)" }}>{svc.name}</h3>
                  <p className="text-xs text-muted-foreground">{svc.tagline}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm leading-relaxed text-foreground mb-4">{svc.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand)" }}>Outcomes</p>
                  <ul className="space-y-1.5 mb-4">
                    {svc.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--brand)" }} />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground italic">{svc.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 border-t border-border" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-2xl">
          <span className="block w-8 h-px mb-10" style={{ background: "var(--brand)" }} />
          <h2 className="text-xl font-light mb-3" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>Apply for a programme</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
            We do not accept open enrolments. Every applicant is reviewed before joining a cohort. This keeps the quality of every programme consistent.
          </p>
          <ApplicationForm />
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
