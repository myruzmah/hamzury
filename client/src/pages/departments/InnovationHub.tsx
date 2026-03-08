import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle2, Calendar, Users, Award, BookOpen, Cpu, Zap, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const programmes = [
  {
    id: "executive",
    icon: Award,
    title: "Executive Class",
    tag: "Leadership & Strategy",
    outcome: "Senior professionals who lead with clarity, communicate with authority, and build organisations that outlast them.",
    duration: "12 weeks",
    format: "In-person cohort",
    seats: "12 per cohort",
    questions: [
      { q: "What is your current leadership role?", type: "text" as const },
      { q: "What is the primary challenge you want to resolve through this programme?", type: "textarea" as const },
      { q: "How many years of management experience do you have?", type: "select" as const, options: ["Under 2 years", "2–5 years", "5–10 years", "Over 10 years"] },
      { q: "What outcome would make this investment worthwhile for you?", type: "textarea" as const },
    ],
  },
  {
    id: "kids",
    icon: Zap,
    title: "Young Innovators",
    tag: "Ages 10–17",
    outcome: "Young people who think in systems, build with technology, and approach problems with structured creativity.",
    duration: "8 weeks",
    format: "Weekend cohort",
    seats: "20 per cohort",
    questions: [
      { q: "How old is the applicant?", type: "select" as const, options: ["10–12", "13–15", "16–17"] },
      { q: "What subjects or activities does the applicant enjoy most?", type: "textarea" as const },
      { q: "Has the applicant had any prior exposure to coding, robotics, or design?", type: "select" as const, options: ["None", "Some self-learning", "School programme", "Previous bootcamp"] },
      { q: "What do you hope the applicant gains from this programme?", type: "textarea" as const },
    ],
  },
  {
    id: "bootcamp",
    icon: Cpu,
    title: "Tech Bootcamp",
    tag: "Intensive Skills",
    outcome: "Practitioners who can build, deploy, and maintain digital products — ready for employment or independent work.",
    duration: "6 weeks",
    format: "Full-time intensive",
    seats: "15 per cohort",
    questions: [
      { q: "Which track interests you most?", type: "select" as const, options: ["Web Development", "AI & Automation", "Robotics & Hardware", "Data & Analytics"] },
      { q: "What is your current technical background?", type: "select" as const, options: ["Complete beginner", "Some self-learning", "Formal training", "Working professional"] },
      { q: "What do you intend to do after completing the bootcamp?", type: "textarea" as const },
      { q: "Are you available full-time for 6 weeks?", type: "select" as const, options: ["Yes, fully available", "Partially available", "Need flexible schedule"] },
    ],
  },
  {
    id: "digital",
    icon: Globe,
    title: "Digital Skills",
    tag: "Community Programme",
    outcome: "Community members equipped with practical digital tools — from productivity software to online business basics.",
    duration: "4 weeks",
    format: "Hybrid",
    seats: "30 per cohort",
    questions: [
      { q: "What is your current level of digital literacy?", type: "select" as const, options: ["Very basic (phone only)", "Moderate (can use a computer)", "Comfortable (uses office tools)", "Advanced"] },
      { q: "What do you primarily want to use digital skills for?", type: "select" as const, options: ["Employment", "Business", "Education", "Personal use"] },
      { q: "Do you have access to a laptop or computer?", type: "select" as const, options: ["Yes, my own", "Shared access", "No access currently"] },
    ],
  },
];

const cohortGallery = [
  { label: "Executive Class — Cohort 01", year: "2024", count: "12 graduates" },
  { label: "Young Innovators — Cohort 01", year: "2024", count: "18 participants" },
  { label: "Tech Bootcamp — Cohort 01", year: "2024", count: "14 graduates" },
  { label: "Digital Skills — Cohort 01", year: "2025", count: "28 participants" },
  { label: "Executive Class — Cohort 02", year: "2025", count: "12 graduates" },
  { label: "Young Innovators — Cohort 02", year: "2025", count: "20 participants" },
];

const hackathonTeams = [
  { name: "Team Nexus", project: "AI-powered crop disease detection", award: "Best Innovation" },
  { name: "Team Clarity", project: "Offline-first school management system", award: "Best Impact" },
  { name: "Team Forge", project: "Automated SME payroll tool", award: "Best Technical Build" },
  { name: "Team Roots", project: "Community water quality monitor", award: "Best Sustainability" },
];

type ProgrammeQuestion = { q: string; type: "text" | "textarea" | "select"; options?: string[] };

function ProgrammeForm({ programme, onClose }: { programme: typeof programmes[0]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitIntake = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const questions: ProgrammeQuestion[] = programme.questions;
  const totalSteps = questions.length + 1; // +1 for contact details

  const canAdvance = step < questions.length ? !!answers[step] : !!(name && email && phone);

  function handleSubmit() {
    const notes = questions.map((q, i) => `${q.q}: ${answers[i] || "—"}`).join("\n");
    submitIntake.mutate({
      name,
      email,
      phone,
      department: "Innovation",
      serviceType: programme.title,
      description: notes,
    });
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={36} className="mx-auto mb-4" style={{ color: BRAND }} />
        <h3 className="text-xl font-light mb-2" style={{ color: "#1a1a1a" }}>Application received.</h3>
        <p className="text-sm text-muted-foreground mb-1">Reference: <strong>{ref}</strong></p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mt-3">
          We will review your application and reach out within the hour to confirm your placement or next steps.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link href="/track" className="text-xs underline" style={{ color: BRAND }}>Track your application →</Link>
          <button onClick={onClose} className="text-xs text-muted-foreground underline">Close</button>
        </div>
      </div>
    );
  }

  const q = step < questions.length ? questions[step] : null;

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-muted-foreground">{programme.tag}</p>
          <h3 className="font-medium" style={{ color: "#1a1a1a" }}>{programme.title} — Application</h3>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </div>

      {/* Progress bar */}
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
          <p className="text-lg font-light mb-2" style={{ color: "#1a1a1a" }}>Your contact details.</p>
          <p className="text-sm text-muted-foreground mb-6">We will reach out within the hour.</p>
          <div className="space-y-3">
            <input className="w-full border border-border rounded-lg px-4 py-3 text-sm" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
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
            {submitIntake.isPending ? "Submitting…" : "Submit Application"} <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function InnovationHub() {
  const [activeProgramme, setActiveProgramme] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const selected = programmes.find(p => p.id === activeProgramme);

  return (
    <div className="min-h-screen font-sans bg-white">

      {/* Next Cohort Banner */}
      {!bannerDismissed && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 text-xs text-white" style={{ background: BRAND }}>
          <span className="flex items-center gap-2">
            <Calendar size={12} />
            <span>Next cohort applications open — <strong>Executive Class &amp; Young Innovators · April 2026</strong></span>
          </span>
          <button onClick={() => setBannerDismissed(true)} className="opacity-60 hover:opacity-100 transition-opacity ml-4">✕</button>
        </div>
      )}

      {/* Nav */}
      <header className={`fixed left-0 right-0 z-40 bg-white/96 backdrop-blur-sm border-b border-border ${bannerDismissed ? "top-0" : "top-8"}`}>
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
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
      <section className={`${bannerDismissed ? "pt-28" : "pt-36"} pb-20 grain-overlay`} style={{ background: BRAND }}>
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs mb-8 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={12} /> All Services
          </Link>
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.2em] uppercase mb-4 text-white/50">Innovation Hub</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              We train the people<br />who build what&apos;s next.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              Skills, entrepreneurship, robotics, and technology training — for executives, young people, and practitioners. The Academy that builds the people who build the future.
            </p>
            <button
              onClick={() => {
                const content = ["HAMZURY INNOVATION HUB — Department Overview","","PROGRAMMES","1. Executive Class — Leadership & Strategy (12 weeks, in-person)","2. Young Innovators — Ages 10–17 (8 weeks, weekend cohort)","3. Tech Bootcamp — Intensive Skills (6 weeks, full-time)","4. Digital Skills — Community Programme (4 weeks, hybrid)","","ALSO UNDER INNOVATION HUB","- HALS — HAMZURY Academy Learning System (online LMS)","- Hackathon — Annual innovation competition","- Ventures — Startup support and incubation","- Alumni Network","","HOW TO APPLY","Visit hamzuryos.biz/start → Select Innovation Hub → Choose programme → Complete brief","We respond within the hour.","","info@hamzury.com | hamzuryos.biz"].join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "HAMZURY-InnovationHub-Overview.txt"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded border text-xs border-white/20 hover:border-white/50 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >↓ Download Innovation Hub Overview</button>
          </div>
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div><p className="text-2xl font-light text-white">6+</p><p className="text-xs text-white/50 mt-1">Cohorts completed</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">140+</p><p className="text-xs text-white/50 mt-1">Participants trained</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div><p className="text-2xl font-light text-white">4</p><p className="text-xs text-white/50 mt-1">Active programmes</p></div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      {!activeProgramme && (
        <section className="py-20">
          <div className="container">
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Programmes</p>
            <h2 className="text-3xl font-light mb-3" style={{ color: "#1a1a1a" }}>Choose your path.</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-lg">We do not offer open enrolment. Every participant goes through a brief assessment so we can confirm the right programme, cohort, and timing.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {programmes.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.id} className="bg-white border border-border rounded-lg p-8 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: BRAND + "15", color: BRAND }}>
                        <Icon size={20} />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{p.tag}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-3" style={{ color: "#1a1a1a" }}>{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{p.outcome}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                      <span>{p.duration}</span><span>·</span><span>{p.format}</span><span>·</span><span>{p.seats}</span>
                    </div>
                    <button
                      onClick={() => setActiveProgramme(p.id)}
                      className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                      style={{ color: BRAND }}
                    >
                      Apply for this programme <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Application Form */}
      {activeProgramme && selected && (
        <section className="py-10 border-t border-border">
          <div className="container">
            <ProgrammeForm programme={selected} onClose={() => setActiveProgramme(null)} />
          </div>
        </section>
      )}

      {/* Past Cohorts Gallery */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Alumni</p>
          <h2 className="text-3xl font-light mb-12" style={{ color: "#1a1a1a" }}>Past cohorts.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cohortGallery.map((c, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <div className="h-36 flex items-center justify-center" style={{ background: i % 2 === 0 ? BRAND + "18" : BRAND + "0c" }}>
                  <div className="text-center">
                    <Users size={24} style={{ color: BRAND }} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs text-muted-foreground">Photo coming soon</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.year} · {c.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon */}
      <section className="py-20 border-t border-border" style={{ background: BRAND }}>
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase mb-2 text-white/50">HAMZURY Hackathon</p>
          <h2 className="text-3xl font-light mb-12 text-white">Teams that built something real.</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {hackathonTeams.map((t, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-white">{t.name}</h3>
                  <span className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/60">{t.award}</span>
                </div>
                <p className="text-sm text-white/60">{t.project}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Guide Download */}
      <section className="py-16 border-t border-border">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>Resources</p>
            <h3 className="text-2xl font-light" style={{ color: "#1a1a1a" }}>Read before you apply.</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">Download the Innovation Hub Programme Guide for full details on each programme, admission criteria, and what participants receive.</p>
          </div>
          <a href="/portal" className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white whitespace-nowrap" style={{ background: BRAND }}>
            <BookOpen size={15} /> Download Programme Guide
          </a>
        </div>
      </section>

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
