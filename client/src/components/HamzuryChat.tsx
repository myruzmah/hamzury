/**
 * HAMZURY Advisor Widget
 * Four public departments. Outcome-first. Apple-style. No friction.
 */
import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "welcome" | "innovation" | "studios" | "systems" | "bizdoc" | "general" | "luxury-gate" | "questions" | "analysing" | "result";

// ─── Department entry cards ───────────────────────────────────────────────────
const DEPT_CARDS = [
  {
    id: "innovation" as Screen,
    label: "Innovation Hub",
    icon: "◎",
    problem: "You want to build capability — in yourself, your team, or your community.",
    outcome: "Training programmes, executive classes, kids STEM & digital skills bootcamps.",
  },
  {
    id: "studios" as Screen,
    label: "Studios",
    icon: "✦",
    problem: "Your brand does not reflect the quality of what you actually do.",
    outcome: "Brand identity, content strategy, social media management & podcast production.",
  },
  {
    id: "systems" as Screen,
    label: "Systems",
    icon: "⬡",
    problem: "Your business runs on manual processes that slow everything down.",
    outcome: "Websites, dashboards, automation systems & AI-powered business workflows.",
  },
  {
    id: "bizdoc" as Screen,
    label: "Bizdoc",
    icon: "◈",
    problem: "Your business is not properly registered, compliant, or protected.",
    outcome: "CAC registration, tax filings, PENCOM compliance & regulatory advisory.",
  },
  {
    id: "general" as Screen,
    label: "I am not sure where to start",
    icon: "→",
    problem: "You know something needs to change but you are not sure which direction.",
    outcome: "Answer a few questions and we will identify exactly what you need.",
  },
];

// ─── Services per department ──────────────────────────────────────────────────
const SERVICES: Record<string, { id: string; label: string; result: string }[]> = {
  innovation: [
    { id: "executive", label: "Executive Class", result: "Leadership capacity and institutional management skills for professionals." },
    { id: "kids", label: "Kids Robotics & STEM", result: "Structured technology education for children aged 7–17." },
    { id: "digital-skills", label: "Digital Skills Bootcamp", result: "Practical technology training for individuals and teams." },
    { id: "internship", label: "Internship Programme", result: "Structured work experience across HAMZURY departments." },
    { id: "corporate", label: "Corporate Training", result: "Custom capability development designed around your organisation." },
  ],
  studios: [
    { id: "brand-identity", label: "Brand Identity", result: "A complete visual identity — logo, colour system, typography, and brand guidelines." },
    { id: "social-media", label: "Social Media Management", result: "Consistent, on-brand content that builds audience and drives enquiries." },
    { id: "content-strategy", label: "Content Strategy", result: "A clear messaging framework that tells the right story to the right people." },
    { id: "podcast", label: "Podcast Production", result: "A professional podcast — recorded, edited, and distributed." },
    { id: "event-media", label: "Event Media Coverage", result: "Photography, video, and post-event content that captures the moment." },
  ],
  systems: [
    { id: "website", label: "Business Website", result: "A professional website that builds credibility and converts visitors." },
    { id: "web-app", label: "Web Application", result: "A custom platform built around your workflow and your users." },
    { id: "dashboard", label: "Staff or Client Dashboard", result: "An internal management system or client-facing portal." },
    { id: "automation", label: "Automation & AI Workflow", result: "Intelligent systems that reduce manual work and eliminate bottlenecks." },
    { id: "crm", label: "CRM System", result: "A structured pipeline for managing clients, leads, and relationships." },
  ],
  bizdoc: [
    { id: "cac-reg", label: "CAC Business Registration", result: "A properly registered business — name or company incorporation." },
    { id: "annual-returns", label: "Annual Returns Filing", result: "Statutory compliance with CAC — on time, every time." },
    { id: "tax-reg", label: "Tax Registration", result: "TIN, VAT, and corporate tax registration with FIRS or LIRS." },
    { id: "pencom", label: "PENCOM Compliance", result: "Pension fund registration and ongoing compliance." },
    { id: "licensing", label: "Industry Licensing", result: "Sector-specific permits and regulatory approvals." },
    { id: "compliance-advisory", label: "Compliance Advisory", result: "Ongoing regulatory guidance so your business stays protected." },
  ],
};

// ─── Question sets ────────────────────────────────────────────────────────────
const QUESTIONS: Record<string, { q: string; options?: string[]; type?: "text" }[]> = {
  executive: [
    { q: "What is your current professional role?", options: ["Business Owner / Founder", "Senior Manager / Director", "Mid-level Professional", "Aspiring Leader"] },
    { q: "What is your primary goal for this programme?", options: ["Build leadership capacity", "Improve how I run my organisation", "Expand my professional network", "Gain a structured credential"] },
    { q: "How many years of professional experience do you have?", options: ["Less than 3 years", "3–7 years", "8–15 years", "Over 15 years"] },
    { q: "What format works best for you?", options: ["In-person intensive", "Weekend sessions", "Online cohort", "Hybrid (online + in-person)"] },
    { q: "What industry or sector do you work in?", type: "text" },
  ],
  kids: [
    { q: "How old is the child?", options: ["7–9 years", "10–12 years", "13–15 years", "16–17 years"] },
    { q: "What is the child's current interest in technology?", options: ["Very curious, always asking questions", "Some interest, needs encouragement", "Just starting to explore", "No prior exposure yet"] },
    { q: "What outcome matters most to you?", options: ["Build logical thinking and problem-solving", "Prepare early for a technology career", "Develop creativity through building", "A structured, productive after-school activity"] },
    { q: "What schedule works for your family?", options: ["Weekday afternoon sessions", "Saturday programme", "School holiday bootcamp", "Online sessions"] },
  ],
  "digital-skills": [
    { q: "Who is this training for?", options: ["Myself as an individual", "My team (2–10 people)", "My organisation (10+ people)", "A community group"] },
    { q: "What is the current skill level?", options: ["Complete beginner", "Basic digital literacy", "Intermediate user", "Advanced, needs specialisation"] },
    { q: "Which area is most relevant?", options: ["General digital literacy", "Social media and content creation", "Data and spreadsheets", "Design tools", "AI tools and automation"] },
    { q: "What is your preferred learning format?", options: ["In-person classroom", "Online live sessions", "Self-paced online", "Blended learning"] },
  ],
  internship: [
    { q: "What is your current status?", options: ["Undergraduate student", "Recent graduate (within 2 years)", "Career changer", "Post-graduate student"] },
    { q: "Which area of work interests you most?", options: ["Creative and brand work (Studios)", "Technology and systems (Systems)", "Business compliance and documentation (Bizdoc)", "Training and education (Innovation Hub)", "Client relations and communication (CSO)", "Community impact (RIDI)"] },
    { q: "What skills do you most want to develop?", options: ["Creative and design skills", "Technical and coding skills", "Business and operations skills", "Communication and client management"] },
    { q: "How long are you available?", options: ["1 month", "3 months", "6 months", "Flexible"] },
  ],
  corporate: [
    { q: "How large is your organisation?", options: ["1–10 people", "11–50 people", "51–200 people", "Over 200 people"] },
    { q: "What is the primary training need?", options: ["Leadership and management development", "Digital skills and technology adoption", "Communication and presentation", "Operational efficiency and process improvement", "Custom programme design"] },
    { q: "How soon do you need this?", options: ["Within 1 month", "Within 3 months", "Planning for next quarter", "Exploring options"] },
    { q: "What format works for your team?", options: ["On-site at our office", "At HAMZURY facility", "Online live sessions", "Blended approach"] },
  ],
  "brand-identity": [
    { q: "What stage is your business at?", options: ["Just starting — pre-launch", "Early stage — under 2 years", "Established — 2–5 years", "Rebranding an existing business"] },
    { q: "What do you need most?", options: ["Full brand identity from scratch", "Logo redesign only", "Brand guidelines document", "Complete brand system including voice and messaging"] },
    { q: "What industry are you in?", type: "text" },
    { q: "Do you have existing brand assets?", options: ["No, starting from scratch", "Yes, but they need a complete overhaul", "Yes, just need refinement and consistency"] },
  ],
  "social-media": [
    { q: "Which platforms matter most to your audience?", options: ["Instagram and Facebook", "LinkedIn", "Twitter / X", "TikTok", "All major platforms"] },
    { q: "What is your current posting situation?", options: ["We do not post regularly", "1–2 times per week", "3–5 times per week", "Daily but inconsistently"] },
    { q: "What is your primary goal?", options: ["Build brand awareness", "Generate leads and enquiries", "Establish thought leadership", "Grow community engagement"] },
    { q: "Do you have existing brand guidelines?", options: ["Yes, fully documented", "Partial guidelines exist", "No, we need brand work first"] },
  ],
  "content-strategy": [
    { q: "What is the main gap in your current content?", options: ["We have no content strategy at all", "We post but it does not convert", "Our message is unclear or inconsistent", "We do not know what to say or how to say it"] },
    { q: "Who is your primary audience?", options: ["Business owners and decision-makers", "Young professionals", "Students and graduates", "General consumers", "Corporate organisations"] },
    { q: "What platforms are most important to you?", options: ["LinkedIn", "Instagram", "Website and blog", "Email newsletters", "Multiple platforms"] },
  ],
  podcast: [
    { q: "What type of podcast are you creating?", options: ["Business and professional insight", "Educational and training content", "Community and social impact", "Personal brand and thought leadership"] },
    { q: "What stage are you at?", options: ["Just an idea — need full setup and direction", "Have a concept — need production support", "Already recording — need editing and distribution"] },
    { q: "How often do you plan to publish?", options: ["Weekly", "Bi-weekly", "Monthly", "Not decided yet"] },
  ],
  "event-media": [
    { q: "What type of event is this?", options: ["Corporate conference or summit", "Product launch or brand activation", "Training or workshop", "Community or social event", "Personal or family event"] },
    { q: "What deliverables do you need?", options: ["Photography only", "Video coverage only", "Both photography and video", "Photography, video, and post-event content package"] },
    { q: "When is the event?", options: ["Within 2 weeks", "Within a month", "1–3 months away", "More than 3 months away"] },
  ],
  website: [
    { q: "What type of website do you need?", options: ["Business or corporate website", "Portfolio or showcase site", "E-commerce store", "Landing page for a specific campaign"] },
    { q: "Do you have existing branding?", options: ["Yes, full brand guidelines", "Yes, logo only", "No, we need branding as well"] },
    { q: "What matters most to you?", options: ["Professional credibility and trust", "Lead generation and conversions", "Client self-service features", "Speed and simplicity"] },
    { q: "What is your timeline?", options: ["As soon as possible — under 4 weeks", "1–2 months", "3+ months", "Flexible"] },
  ],
  "web-app": [
    { q: "What problem does this application need to solve?", type: "text" },
    { q: "Who are the primary users?", options: ["Internal staff only", "Clients and customers", "Both staff and clients", "The general public"] },
    { q: "Is there an existing system to replace or integrate with?", options: ["Yes, replacing an existing system", "Yes, needs to integrate with other tools", "No, building from scratch"] },
    { q: "What is your timeline?", options: ["Under 6 weeks", "2–3 months", "3–6 months", "Flexible"] },
  ],
  dashboard: [
    { q: "Who will use this dashboard?", options: ["Internal staff only", "Clients and customers", "Both staff and clients"] },
    { q: "What is the primary function?", options: ["Track project or task progress", "Manage clients and relationships", "Monitor data and analytics", "Manage documents and deliverables"] },
    { q: "Do you have an existing system this needs to connect to?", options: ["Yes", "No, starting fresh"] },
  ],
  automation: [
    { q: "What process do you want to automate?", type: "text" },
    { q: "How much time does this process currently take per week?", options: ["Less than 2 hours", "2–5 hours", "5–10 hours", "Over 10 hours"] },
    { q: "What tools do you currently use?", options: ["Google Workspace (Docs, Sheets, Gmail)", "Microsoft 365", "WhatsApp and manual processes", "A mix of different tools", "No specific tools yet"] },
  ],
  crm: [
    { q: "What is your current client management situation?", options: ["Everything is in WhatsApp and memory", "We use spreadsheets", "We have a basic system but it is not working", "We have nothing at all"] },
    { q: "How many active clients or leads do you manage?", options: ["Under 20", "20–100", "100–500", "Over 500"] },
    { q: "What is most important to you in a CRM?", options: ["Tracking where each client is in the process", "Automating follow-ups and reminders", "Generating reports and insights", "Team collaboration on client accounts"] },
  ],
  "cac-reg": [
    { q: "What type of registration do you need?", options: ["Business Name (sole proprietor or partnership)", "Private Limited Company (Ltd)", "Incorporated Trustee (NGO or Foundation)", "Not sure — I need guidance"] },
    { q: "Have you chosen a business name?", options: ["Yes, I have a preferred name ready", "I have a few options to check availability", "No, I need help deciding"] },
    { q: "Do you have a registered address in Nigeria?", options: ["Yes", "No, I need guidance on this"] },
    { q: "How soon do you need this completed?", options: ["Urgently — within 2 weeks", "Within a month", "No specific deadline"] },
  ],
  "annual-returns": [
    { q: "What type of entity are you filing for?", options: ["Business Name", "Private Limited Company", "Incorporated Trustee (NGO)", "Not sure"] },
    { q: "How many years of returns are outstanding?", options: ["Current year only", "1–2 years outstanding", "3 or more years outstanding", "Not sure"] },
    { q: "Do you have your CAC registration documents available?", options: ["Yes, all documents are available", "Some documents are available", "No, I need help locating them"] },
  ],
  "tax-reg": [
    { q: "What type of tax registration do you need?", options: ["TIN — Tax Identification Number", "VAT Registration", "Corporate Income Tax", "All of the above"] },
    { q: "Is your business already registered with CAC?", options: ["Yes", "No, I need CAC registration first", "Not sure"] },
    { q: "Which state is your business based in?", type: "text" },
  ],
  pencom: [
    { q: "How many employees does your business have?", options: ["1–4 employees", "5–15 employees", "16–50 employees", "Over 50 employees"] },
    { q: "Are you currently making pension contributions for your staff?", options: ["Yes, but not formally registered", "No, we have not started", "Not sure what is required"] },
  ],
  licensing: [
    { q: "What industry does your business operate in?", options: ["Food and beverages (NAFDAC)", "Telecommunications (NCC)", "Financial services (CBN / SEC)", "Healthcare and pharmaceuticals", "Manufacturing and standards (SON)", "Other regulated industry"] },
    { q: "What stage are you at with licensing?", options: ["Just starting — need full guidance", "Have some documents — need to complete the process", "Renewal of an existing licence"] },
  ],
  "compliance-advisory": [
    { q: "What is your primary compliance concern?", options: ["I do not know what regulations apply to my business", "I have received a regulatory notice or query", "I want to review and improve our compliance posture", "I am preparing for investment or acquisition due diligence"] },
    { q: "How long has your business been operating?", options: ["Less than 1 year", "1–3 years", "3–7 years", "Over 7 years"] },
    { q: "What industry are you in?", type: "text" },
  ],
  general: [
    { q: "What best describes your situation right now?", options: ["I am starting a new business", "I have a business but need more structure", "I want to grow or scale what I have built", "I need compliance or legal help", "I need a stronger digital presence", "I want to train myself or my team"] },
    { q: "What is the biggest challenge you are facing?", options: ["I do not know where to start", "My systems and processes are not working", "My brand does not reflect my quality", "I am not compliant with regulations", "I cannot find or keep the right clients", "My team does not have the skills we need"] },
    { q: "How long has your business been operating?", options: ["Not yet started", "Less than 1 year", "1–3 years", "3–7 years", "Over 7 years"] },
    { q: "What is your primary goal in the next 6 months?", options: ["Launch and get my first clients", "Formalise and register properly", "Build a brand that stands out", "Grow revenue significantly", "Build a capable and structured team"] },
  ],
};

// ─── Luxury gate message ──────────────────────────────────────────────────────
const LUXURY_MSG = [
  "At HAMZURY Innovation Hub, we do not accept open enrolments.",
  "Every participant is carefully assessed before joining any programme. This is not a barrier — it is how we protect the quality of your experience and the integrity of our cohorts.",
  "The few minutes you spend answering these questions allow our team to understand your goals, your background, and which programme is the right fit for you. We will review your responses and come back to you with a personal recommendation.",
  "Please continue — your answers matter.",
];

const INNOVATION_LUXURY_IDS = new Set(["executive", "kids", "digital-skills", "internship", "corporate"]);

function getDeptName(screen: Screen): string {
  const map: Partial<Record<Screen, string>> = {
    innovation: "Innovation Hub", studios: "Studios",
    systems: "Systems", bizdoc: "Bizdoc", general: "General",
  };
  return map[screen] ?? "General";
}

export default function HamzuryChat() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activeDept, setActiveDept] = useState<Screen>("welcome");
  const [selectedService, setSelectedService] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [showLuxury, setShowLuxury] = useState(false);
  const [result, setResult] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const analyseMutation = trpc.agent.analyseResponses.useMutation({
    onSuccess: (data) => { setResult(data.recommendation); setScreen("result"); },
    onError: () => {
      setResult(`Based on your responses, our team will review your profile and reach out with a personalised recommendation within 24 hours.\n\nIn the meantime, you can submit a formal request to begin the process.`);
      setScreen("result");
    },
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [screen, currentQ, showLuxury]);

  const reset = () => {
    setScreen("welcome"); setActiveDept("welcome"); setSelectedService("");
    setCurrentQ(0); setAnswers([]); setTextInput(""); setShowLuxury(false); setResult("");
  };

  const goToDept = (dept: Screen) => {
    setActiveDept(dept); setScreen(dept);
    setSelectedService(""); setCurrentQ(0); setAnswers([]); setShowLuxury(false);
  };

  const handleServiceSelect = (svcId: string) => {
    setSelectedService(svcId);
    if (activeDept === "innovation" && INNOVATION_LUXURY_IDS.has(svcId)) {
      setShowLuxury(true);
    } else {
      setCurrentQ(0); setAnswers([]); setScreen("questions");
    }
  };

  const getQuestions = () => QUESTIONS[selectedService] ?? QUESTIONS["general"];

  const handleAnswer = (answer: string) => {
    const qs = getQuestions();
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQ + 1 < qs.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setScreen("analysing");
      analyseMutation.mutate({
        department: getDeptName(activeDept),
        service: selectedService || "general",
        answers: newAnswers,
        questions: qs.map((q) => q.q),
      });
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    handleAnswer(textInput.trim());
    setTextInput("");
  };

  const qs = getQuestions();
  const currentQuestion = qs[currentQ];
  const deptServices = SERVICES[activeDept as string] ?? [];
  const isServiceScreen = ["innovation", "studios", "systems", "bizdoc"].includes(screen) && !showLuxury;

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ background: "#1B4D3E" }}
        aria-label="Open HAMZURY advisor"
      >
        {open ? (
          <X size={20} color="white" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
            <path d="M8 10.5c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2-1.5 3.5-3.5 4v1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="18.5" r="0.8" fill="white" />
          </svg>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ background: "#FAFAF8", width: "min(380px, calc(100vw - 2rem))", maxHeight: "82vh", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ background: "#1B4D3E" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">HAMZURY Advisor</p>
                <p className="text-white/50 text-xs mt-0.5">Always available</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3" style={{ minHeight: 0 }}>

            {/* ── Welcome ── */}
            {screen === "welcome" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-800">Welcome to HAMZURY.</p>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    Tell me what you are trying to build or solve. I will guide you to the right service.
                  </p>
                </div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-1">What describes your situation?</p>
                <div className="space-y-2">
                  {DEPT_CARDS.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => goToDept(card.id)}
                      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-base mt-0.5 shrink-0 opacity-60">{card.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">{card.label}</p>
                          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{card.problem}</p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 shrink-0 mt-1 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Department service list ── */}
            {isServiceScreen && (
              <div className="space-y-3">
                <button onClick={reset} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-800">{getDeptName(screen)}</p>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">Select the outcome you are looking for.</p>
                </div>
                <div className="space-y-2">
                  {deptServices.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => handleServiceSelect(svc.id)}
                      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800">{svc.label}</p>
                        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{svc.result}</p>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 shrink-0 mt-1 transition-colors" />
                    </button>
                  ))}
                  <a
                    href={`/departments/${screen}`}
                    className="w-full text-left bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-600">Learn more about {getDeptName(screen)}</p>
                      <p className="text-xs text-stone-400 mt-0.5">View the full department page</p>
                    </div>
                    <ChevronRight size={14} className="text-stone-300 shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* ── General Business Checkup ── */}
            {screen === "general" && (
              <div className="space-y-3">
                <button onClick={reset} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-800">Business Checkup</p>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Answer four questions. Our advisor will identify exactly what you need and recommend the right service.
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedService("general"); setCurrentQ(0); setAnswers([]); setScreen("questions"); }}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-semibold text-stone-800">Begin the checkup</span>
                  <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                </button>
              </div>
            )}

            {/* ── Luxury gate ── */}
            {showLuxury && (
              <div className="space-y-4">
                <button onClick={() => { setShowLuxury(false); }} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="w-6 h-px mb-4" style={{ background: "#1B4D3E" }} />
                  {LUXURY_MSG.map((para, i) => (
                    <p key={i} className={`text-sm leading-relaxed ${i === 0 ? "font-semibold text-stone-800" : "text-stone-500"} ${i > 0 ? "mt-3" : ""}`}>
                      {para}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => { setShowLuxury(false); setCurrentQ(0); setAnswers([]); setScreen("questions"); }}
                  className="w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#1B4D3E" }}
                >
                  Continue — answer the questions
                </button>
              </div>
            )}

            {/* ── Questions ── */}
            {screen === "questions" && currentQuestion && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ background: "#1B4D3E", width: `${(currentQ / qs.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{currentQ + 1} / {qs.length}</span>
                </div>
                {answers.map((ans, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="bg-stone-50 rounded-2xl rounded-tl-sm px-3 py-2.5">
                      <p className="text-xs text-stone-400 leading-relaxed">{qs[i].q}</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm px-3 py-2.5 max-w-[80%]" style={{ background: "#1B4D3E" }}>
                        <p className="text-xs text-white">{ans}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-sm font-medium text-stone-800 leading-relaxed">{currentQuestion.q}</p>
                </div>
                {currentQuestion.type === "text" ? (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                      placeholder="Type your answer…"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                    />
                    <button onClick={handleTextSubmit} disabled={!textInput.trim()} className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 shrink-0" style={{ background: "#1B4D3E" }}>
                      →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentQuestion.options?.map((opt) => (
                      <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left bg-white border border-stone-100 rounded-2xl px-4 py-3 text-sm text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-all">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Analysing ── */}
            {screen === "analysing" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: "#1B4D3E" }} />
                <p className="text-sm font-semibold text-stone-800">Reviewing your responses…</p>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">Our advisor is identifying the best match for your situation.</p>
              </div>
            )}

            {/* ── Result ── */}
            {screen === "result" && result && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="w-6 h-px mb-4" style={{ background: "#1B4D3E" }} />
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#1B4D3E" }}>Your recommendation</p>
                  {result.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-sm leading-relaxed text-stone-700 ${i > 0 ? "mt-3" : ""}`}>{para}</p>
                  ))}
                </div>
                <a href="/start" className="block w-full rounded-2xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90" style={{ background: "#1B4D3E" }}>
                  Start a Project →
                </a>
                <button onClick={reset} className="w-full text-xs text-stone-400 hover:text-stone-600 transition-colors py-1">
                  Start over
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t shrink-0 text-center" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-xs text-stone-400">
              HAMZURY &middot;{" "}
              <a href="/start" className="underline" style={{ color: "#1B4D3E" }}>Start a project</a>
              {" "}&middot;{" "}
              <a href="/track" className="underline" style={{ color: "#1B4D3E" }}>Track project</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
