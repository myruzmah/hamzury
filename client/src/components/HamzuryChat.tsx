/**
 * HAMZURY Advisor — WhatsApp-style conversational widget
 * Compact. Human. Intelligent. No friction.
 */
import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, ChevronRight, ArrowLeft, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "welcome"
  | "innovation" | "studios" | "systems" | "bizdoc" | "general"
  | "luxury-gate" | "questions" | "analysing" | "result";

type ChatMsg = {
  id: number;
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
  isTyping?: boolean;
};

// ─── Department cards ─────────────────────────────────────────────────────────
const DEPT_CARDS = [
  { id: "innovation" as Screen, label: "Innovation Hub", sub: "Training, executive classes, kids STEM & digital skills" },
  { id: "studios" as Screen,    label: "Studios",        sub: "Brand identity, content, social media & podcast" },
  { id: "systems" as Screen,    label: "Systems",        sub: "Websites, web apps, automation & AI workflows" },
  { id: "bizdoc" as Screen,     label: "Bizdoc",         sub: "CAC registration, tax, PENCOM & compliance" },
  { id: "general" as Screen,    label: "Not sure where to start", sub: "Answer a few questions — we will identify what you need" },
];

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES: Record<string, { id: string; label: string; sub: string }[]> = {
  innovation: [
    { id: "executive",     label: "Executive Class",          sub: "Leadership and institutional management for professionals" },
    { id: "kids",          label: "Kids Robotics & STEM",     sub: "Structured technology education for children aged 7–17" },
    { id: "digital-skills",label: "Digital Skills Bootcamp",  sub: "Practical technology training for individuals and teams" },
    { id: "internship",    label: "Internship Programme",     sub: "Structured work experience across HAMZURY departments" },
    { id: "corporate",     label: "Corporate Training",       sub: "Custom capability development for your organisation" },
  ],
  studios: [
    { id: "brand-identity",  label: "Brand Identity",          sub: "Logo, colour system, typography and brand guidelines" },
    { id: "social-media",    label: "Social Media Management", sub: "Consistent, on-brand content that builds audience" },
    { id: "content-strategy",label: "Content Strategy",        sub: "A clear messaging framework for the right audience" },
    { id: "podcast",         label: "Podcast Production",      sub: "Recorded, edited and distributed professionally" },
    { id: "event-media",     label: "Event Media Coverage",    sub: "Photography, video and post-event content" },
  ],
  systems: [
    { id: "website",    label: "Business Website",         sub: "Professional site that builds credibility and converts" },
    { id: "web-app",    label: "Web Application",          sub: "Custom platform built around your workflow" },
    { id: "dashboard",  label: "Staff or Client Dashboard",sub: "Internal management system or client-facing portal" },
    { id: "automation", label: "Automation & AI Workflow", sub: "Intelligent systems that reduce manual work" },
    { id: "crm",        label: "CRM System",               sub: "Structured pipeline for clients, leads and relationships" },
  ],
  bizdoc: [
    { id: "cac-reg",            label: "CAC Business Registration", sub: "Business name or company incorporation" },
    { id: "annual-returns",     label: "Annual Returns Filing",     sub: "Statutory compliance with CAC — on time" },
    { id: "tax-reg",            label: "Tax Registration",          sub: "TIN, VAT and corporate tax with FIRS or LIRS" },
    { id: "pencom",             label: "PENCOM Compliance",         sub: "Pension fund registration and ongoing compliance" },
    { id: "licensing",          label: "Industry Licensing",        sub: "Sector-specific permits and regulatory approvals" },
    { id: "compliance-advisory",label: "Compliance Advisory",       sub: "Ongoing regulatory guidance for your business" },
  ],
};

// ─── Questions ────────────────────────────────────────────────────────────────
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
    { q: "Which area of work interests you most?", options: ["Creative and brand work", "Technology and systems", "Business compliance and documentation", "Training and education", "Client relations and communication"] },
    { q: "What skills do you most want to develop?", options: ["Creative and design skills", "Technical and coding skills", "Business and operations skills", "Communication and client management"] },
    { q: "How long are you available?", options: ["1 month", "3 months", "6 months", "Flexible"] },
  ],
  corporate: [
    { q: "How large is your organisation?", options: ["1–10 people", "11–50 people", "51–200 people", "Over 200 people"] },
    { q: "What is the primary training need?", options: ["Leadership and management development", "Digital skills and technology adoption", "Communication and presentation", "Operational efficiency and process improvement"] },
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
    { q: "What type of event is this?", options: ["Corporate conference or summit", "Product launch or brand activation", "Training or workshop", "Community or social event"] },
    { q: "When is the event?", options: ["Within 2 weeks", "Within a month", "1–3 months away", "More than 3 months away"] },
    { q: "What do you need most?", options: ["Photography only", "Video coverage only", "Both photography and video", "Full post-event content package"] },
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
    { q: "What tools do you currently use?", options: ["Google Workspace", "Microsoft 365", "WhatsApp and manual processes", "A mix of different tools", "No specific tools yet"] },
  ],
  crm: [
    { q: "What is your current client management situation?", options: ["Everything is in WhatsApp and memory", "We use spreadsheets", "We have a basic system but it is not working", "We have nothing at all"] },
    { q: "How many active clients or leads do you manage?", options: ["Under 20", "20–100", "100–500", "Over 500"] },
    { q: "What is most important to you in a CRM?", options: ["Tracking where each client is in the process", "Automating follow-ups and reminders", "Generating reports and insights", "Team collaboration on client accounts"] },
  ],
  "cac-reg": [
    { q: "What type of registration do you need?", options: ["Business Name (sole proprietor or partnership)", "Private Limited Company (Ltd)", "Incorporated Trustee (NGO or Foundation)", "Not sure — I need guidance"] },
    { q: "Have you chosen a business name?", options: ["Yes, I have a preferred name ready", "I have a few options to check availability", "No, I need help deciding"] },
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

const INNOVATION_LUXURY = new Set(["executive", "kids", "digital-skills", "internship", "corporate"]);

const LUXURY_PARAS = [
  "At HAMZURY Innovation Hub, we do not accept open enrolments.",
  "Every participant is carefully assessed before joining any programme. This is how we protect the quality of your experience and the integrity of our cohorts.",
  "The few questions ahead allow our team to understand your goals and background. We will review your responses and come back with a personal recommendation.",
  "Please continue — your answers matter.",
];

function getDeptLabel(screen: Screen): string {
  const m: Partial<Record<Screen, string>> = {
    innovation: "Innovation Hub", studios: "Studios",
    systems: "Systems", bizdoc: "Bizdoc", general: "General",
  };
  return m[screen] ?? "HAMZURY";
}

let msgId = 0;
function mk(from: ChatMsg["from"], text: string, options?: { label: string; value: string }[]): ChatMsg {
  return { id: ++msgId, from, text, options };
}

export default function HamzuryChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activeDept, setActiveDept] = useState<Screen>("welcome");
  const [selectedSvc, setSelectedSvc] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [luxuryShown, setLuxuryShown] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const analyseMutation = trpc.agent.analyseResponses.useMutation({
    onSuccess: (data) => {
      setMsgs((prev) => [
        ...prev,
        mk("bot", data.recommendation),
        mk("bot", "Ready to move forward?", [
          { label: "Start a Project →", value: "start" },
          { label: "Ask another question", value: "reset" },
        ]),
      ]);
      setScreen("result");
    },
    onError: () => {
      setMsgs((prev) => [
        ...prev,
        mk("bot", "Based on your responses, our team will review your profile and reach out with a personalised recommendation within 24 hours."),
        mk("bot", "What would you like to do next?", [
          { label: "Start a Project →", value: "start" },
          { label: "Start over", value: "reset" },
        ]),
      ]);
      setScreen("result");
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Initialise on open
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([
        mk("bot", "Hello. I am the HAMZURY advisor.\n\nWhat are you trying to build or solve?", DEPT_CARDS.map((d) => ({ label: d.label, value: d.id }))),
      ]);
      setScreen("welcome");
    }
  }, [open]);

  const pushBot = (text: string, options?: { label: string; value: string }[]) => {
    setMsgs((prev) => [...prev, mk("bot", text, options)]);
  };

  const pushUser = (text: string) => {
    setMsgs((prev) => [...prev, mk("user", text)]);
  };

  const disableOptions = (id: number) => {
    setOptionsDisabled((prev) => new Set([...prev, id]));
  };

  const reset = () => {
    msgId = 0;
    setMsgs([
      mk("bot", "What else can I help you with?", DEPT_CARDS.map((d) => ({ label: d.label, value: d.id }))),
    ]);
    setScreen("welcome");
    setActiveDept("welcome");
    setSelectedSvc("");
    setCurrentQ(0);
    setAnswers([]);
    setTextInput("");
    setLuxuryShown(false);
    setOptionsDisabled(new Set());
  };

  const handleOption = (msgId: number, label: string, value: string) => {
    disableOptions(msgId);
    pushUser(label);

    // Navigation options
    if (value === "start") { window.location.href = "/start"; return; }
    if (value === "reset") { reset(); return; }
    if (value === "learn-more") { window.location.href = `/department/${activeDept}`; return; }

    // Department selection
    if (screen === "welcome") {
      const dept = value as Screen;
      setActiveDept(dept);
      setScreen(dept);
      const svcs = SERVICES[dept];
      if (svcs) {
        pushBot(
          `${getDeptLabel(dept)} — select the outcome you are looking for.`,
          [
            ...svcs.map((s) => ({ label: s.label, value: s.id })),
            { label: `Learn more about ${getDeptLabel(dept)}`, value: "learn-more" },
          ]
        );
      } else {
        // General
        setSelectedSvc("general");
        setCurrentQ(0);
        setAnswers([]);
        setScreen("questions");
        const qs = QUESTIONS["general"];
        pushBot(qs[0].q, qs[0].options?.map((o) => ({ label: o, value: o })));
      }
      return;
    }

    // Service selection
    if (["innovation", "studios", "systems", "bizdoc"].includes(screen)) {
      setSelectedSvc(value);
      if (screen === "innovation" && INNOVATION_LUXURY.has(value)) {
        setLuxuryShown(true);
        setScreen("luxury-gate");
        LUXURY_PARAS.forEach((p, i) => {
          setTimeout(() => {
            if (i < LUXURY_PARAS.length - 1) {
              pushBot(p);
            } else {
              pushBot(p, [{ label: "Continue — answer the questions", value: "begin-questions" }]);
            }
          }, i * 600);
        });
      } else {
        setCurrentQ(0);
        setAnswers([]);
        setScreen("questions");
        const qs = QUESTIONS[value] ?? QUESTIONS["general"];
        pushBot(qs[0].q, qs[0].options?.map((o) => ({ label: o, value: o })));
      }
      return;
    }

    // Luxury gate — begin questions
    if (screen === "luxury-gate" && value === "begin-questions") {
      setScreen("questions");
      setCurrentQ(0);
      setAnswers([]);
      const qs = QUESTIONS[selectedSvc] ?? QUESTIONS["general"];
      pushBot(qs[0].q, qs[0].options?.map((o) => ({ label: o, value: o })));
      return;
    }

    // Question answers (option type)
    if (screen === "questions") {
      processAnswer(value);
      return;
    }
  };

  const processAnswer = (answer: string) => {
    const qs = QUESTIONS[selectedSvc] ?? QUESTIONS["general"];
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    const next = currentQ + 1;

    if (next < qs.length) {
      setCurrentQ(next);
      const nextQ = qs[next];
      pushBot(nextQ.q, nextQ.options?.map((o) => ({ label: o, value: o })));
    } else {
      setScreen("analysing");
      pushBot("Reviewing your responses…");
      analyseMutation.mutate({
        department: getDeptLabel(activeDept),
        service: selectedSvc,
        answers: newAnswers,
        questions: qs.map((q) => q.q),
      });
    }
  };

  const handleTextSend = () => {
    const text = textInput.trim();
    if (!text) return;
    setTextInput("");
    pushUser(text);
    if (screen === "questions") {
      processAnswer(text);
    }
  };

  const qs = QUESTIONS[selectedSvc] ?? QUESTIONS["general"];
  const currentQuestion = qs[currentQ];
  const showTextInput = screen === "questions" && currentQuestion?.type === "text";

  return (
    <>
      {/* ── Floating bubble ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{ background: "#1B4D3E" }}
          aria-label="Open HAMZURY advisor"
        >
          <MessageCircle size={22} color="white" />
        </button>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "min(370px, calc(100vw - 24px))",
            height: "min(600px, calc(100vh - 80px))",
            background: "#ECE5DD",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "#1B4D3E" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              >
                H
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">HAMZURY Advisor</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Always available
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={16} color="white" />
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" style={{ minHeight: 0 }}>
            {msgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  {/* Bubble */}
                  <div
                    className="px-3.5 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed"
                    style={{
                      background: msg.from === "user" ? "#1B4D3E" : "white",
                      color: msg.from === "user" ? "white" : "#1C1C1C",
                      borderBottomRightRadius: msg.from === "user" ? "4px" : undefined,
                      borderBottomLeftRadius: msg.from === "bot" ? "4px" : undefined,
                      whiteSpace: "pre-wrap",
                      fontSize: "13px",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Options */}
                  {msg.options && !optionsDisabled.has(msg.id) && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOption(msg.id, opt.label, opt.value)}
                          className="flex items-center justify-between w-full text-left bg-white rounded-xl px-3.5 py-2.5 shadow-sm hover:bg-gray-50 transition-colors"
                          style={{ fontSize: "12.5px", color: "#1B4D3E", fontWeight: 500 }}
                        >
                          {opt.label}
                          <ChevronRight size={12} className="shrink-0 ml-2 opacity-50" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator when analysing */}
            {screen === "analysing" && analyseMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Text input (only for open-ended questions) ── */}
          {showTextInput && (
            <div
              className="flex items-center gap-2 px-3 py-3 shrink-0"
              style={{ background: "#F0EBE1", borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
                placeholder="Type your answer…"
                className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm outline-none shadow-sm"
                style={{ color: "#1C1C1C", fontSize: "13px" }}
                autoFocus
              />
              <button
                onClick={handleTextSend}
                disabled={!textInput.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
                style={{ background: "#1B4D3E" }}
                aria-label="Send"
              >
                <Send size={14} color="white" />
              </button>
            </div>
          )}

          {/* ── Footer ── */}
          <div
            className="px-4 py-2 shrink-0 text-center"
            style={{ background: "#F0EBE1", borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-xs" style={{ color: "#999", fontSize: "11px" }}>
              HAMZURY &middot;{" "}
              <a href="/start" style={{ color: "#1B4D3E" }} className="underline">Start a project</a>
              {" "}&middot;{" "}
              <a href="/track" style={{ color: "#1B4D3E" }} className="underline">Track project</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
