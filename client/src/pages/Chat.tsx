/**
 * HAMZURY Chat Conversion Engine — Full Page
 * Department decision trees → qualification → reference generation → intake saved
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Send, Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

type Dept = "Innovation" | "Studios" | "Systems" | "Bizdoc";
type Stage = "welcome" | "dept" | "service" | "questions" | "contact" | "submitting" | "done";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
  isTyping?: boolean;
}

const DEPT_OPTIONS = [
  { label: "Innovation Hub", value: "Innovation", sub: "Training, executive classes, kids STEM & digital skills" },
  { label: "Studios", value: "Studios", sub: "Brand identity, content, social media & podcast" },
  { label: "Systems", value: "Systems", sub: "Websites, web apps, automation & AI workflows" },
  { label: "Bizdoc", value: "Bizdoc", sub: "CAC registration, tax, PENCOM & compliance" },
  { label: "Not sure — help me decide", value: "general", sub: "Answer a few questions and we will identify what you need" },
];

const SERVICES: Record<string, { label: string; value: string }[]> = {
  Innovation: [
    { label: "Executive Class", value: "Executive Class" },
    { label: "Kids Robotics & STEM", value: "Kids Robotics & STEM" },
    { label: "Digital Skills Bootcamp", value: "Digital Skills Bootcamp" },
    { label: "Internship Programme", value: "Internship Programme" },
    { label: "Corporate Training", value: "Corporate Training" },
  ],
  Studios: [
    { label: "Brand Identity", value: "Brand Identity" },
    { label: "Social Media Management", value: "Social Media Management" },
    { label: "Content Strategy", value: "Content Strategy" },
    { label: "Podcast Production", value: "Podcast Production" },
    { label: "Event Media Coverage", value: "Event Media Coverage" },
  ],
  Systems: [
    { label: "Business Website", value: "Business Website" },
    { label: "Web Application", value: "Web Application" },
    { label: "Staff or Client Dashboard", value: "Staff or Client Dashboard" },
    { label: "Automation & AI Workflow", value: "Automation & AI Workflow" },
    { label: "CRM System", value: "CRM System" },
  ],
  Bizdoc: [
    { label: "CAC Business Registration", value: "CAC Business Registration" },
    { label: "Annual Returns Filing", value: "Annual Returns Filing" },
    { label: "Tax Registration", value: "Tax Registration" },
    { label: "PENCOM Compliance", value: "PENCOM Compliance" },
    { label: "Industry Licensing", value: "Industry Licensing" },
  ],
};

const QUESTIONS: Record<string, { q: string; options?: string[] }[]> = {
  "Executive Class": [
    { q: "How many people will attend?", options: ["Just me", "2–5 people", "6–15 people", "16+ people"] },
    { q: "What is your primary focus area?", options: ["Leadership and decision-making", "Financial management", "Strategic planning", "Communication and influence"] },
    { q: "When do you need this?", options: ["Within 1 month", "Within 3 months", "Within 6 months", "Just exploring"] },
  ],
  "Kids Robotics & STEM": [
    { q: "How old is the child?", options: ["7–10 years", "11–14 years", "15–17 years"] },
    { q: "What is their current experience level?", options: ["Complete beginner", "Some exposure", "Intermediate"] },
    { q: "What schedule works?", options: ["Weekday afternoons", "Saturdays", "School holiday bootcamp", "Online sessions"] },
  ],
  "Digital Skills Bootcamp": [
    { q: "Who is this for?", options: ["Myself", "My team (2–10)", "My organisation (10+)", "A community group"] },
    { q: "Which area is most relevant?", options: ["General digital literacy", "Social media and content", "Data and spreadsheets", "Design tools", "AI tools and automation"] },
    { q: "Preferred learning format?", options: ["In-person", "Online live", "Self-paced online", "Blended"] },
  ],
  "Brand Identity": [
    { q: "What stage is your business at?", options: ["Pre-launch", "Early stage (under 2 years)", "Established (2–5 years)", "Rebranding"] },
    { q: "What do you need most?", options: ["Full brand identity from scratch", "Logo redesign only", "Brand guidelines document", "Complete brand system"] },
    { q: "Do you have existing brand assets?", options: ["No, starting from scratch", "Yes, needs a complete overhaul", "Yes, just needs refinement"] },
  ],
  "Social Media Management": [
    { q: "Which platforms matter most?", options: ["Instagram and Facebook", "LinkedIn", "Twitter / X", "TikTok", "All major platforms"] },
    { q: "What is your primary goal?", options: ["Build brand awareness", "Generate leads", "Establish thought leadership", "Grow community engagement"] },
    { q: "What is your current posting situation?", options: ["We do not post regularly", "1–2 times per week", "3–5 times per week", "Daily but inconsistently"] },
  ],
  "Business Website": [
    { q: "What type of website do you need?", options: ["Simple informational site", "Portfolio or showcase", "E-commerce", "Lead generation site"] },
    { q: "Do you have existing branding?", options: ["Yes, full brand guidelines", "Yes, basic logo and colours", "No, needs to be created"] },
    { q: "When do you need this live?", options: ["Within 1 month", "Within 3 months", "No fixed deadline"] },
  ],
  "CAC Business Registration": [
    { q: "What type of entity?", options: ["Business name (sole proprietorship)", "Limited liability company (Ltd)", "Incorporated trustee (NGO/association)", "Not sure — need guidance"] },
    { q: "Do you have a name in mind?", options: ["Yes, I have a name ready", "I have options but need to check availability", "No, I need help deciding"] },
    { q: "How soon do you need this?", options: ["Urgently (within 2 weeks)", "Within 1 month", "Within 3 months", "Just planning ahead"] },
  ],
};

const DEFAULT_QUESTIONS = [
  { q: "What is the main challenge you are trying to solve?", options: ["Building or growing a business", "Getting compliant with regulations", "Improving my brand and visibility", "Developing skills or training my team"] },
  { q: "What is your timeline?", options: ["I need this urgently", "Within 3 months", "Planning for later this year", "Just exploring options"] },
];

let _msgId = 0;
function makeMsg(from: "bot" | "user", text: string, options?: { label: string; value: string }[]): Msg {
  return { id: ++_msgId, from, text, options };
}

export default function Chat() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [msgs, setMsgs] = useState<Msg[]>([
    makeMsg("bot", "Welcome to HAMZURY. I am your institutional advisor. What would you like help with today?", DEPT_OPTIONS.map(d => ({ label: d.label, value: d.value }))),
  ]);
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", description: "" });
  const [referenceCode, setReferenceCode] = useState("");
  const [textInput, setTextInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => {
      setReferenceCode(data.referenceCode);
      setStage("done");
      addMsg(makeMsg("bot", `Your enquiry has been received. Your reference number is **${data.referenceCode}**. A HAMZURY advisor will contact you within 24 hours.`));
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
      setStage("contact");
    },
  });

  function addMsg(msg: Msg) {
    setMsgs(prev => [...prev, msg]);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function handleOption(value: string, label: string) {
    addMsg(makeMsg("user", label));

    if (stage === "welcome" || stage === "dept") {
      if (value === "general") {
        setSelectedDept(null);
        setStage("questions");
        setTimeout(() => addMsg(makeMsg("bot", DEFAULT_QUESTIONS[0].q, DEFAULT_QUESTIONS[0].options?.map(o => ({ label: o, value: o })))), 400);
      } else {
        const dept = value as Dept;
        setSelectedDept(dept);
        setStage("service");
        setTimeout(() => addMsg(makeMsg("bot", `Great. Which ${dept} service are you interested in?`, SERVICES[dept].map(s => ({ label: s.label, value: s.value })))), 400);
      }
      return;
    }

    if (stage === "service") {
      setSelectedService(value);
      setStage("questions");
      const qs = QUESTIONS[value] || DEFAULT_QUESTIONS;
      setTimeout(() => addMsg(makeMsg("bot", qs[0].q, qs[0].options?.map(o => ({ label: o, value: o })))), 400);
      setQIndex(0);
      return;
    }

    if (stage === "questions") {
      const qs = selectedService ? (QUESTIONS[selectedService] || DEFAULT_QUESTIONS) : DEFAULT_QUESTIONS;
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      const next = qIndex + 1;
      if (next < qs.length) {
        setQIndex(next);
        setTimeout(() => addMsg(makeMsg("bot", qs[next].q, qs[next].options?.map(o => ({ label: o, value: o })))), 400);
      } else {
        setStage("contact");
        setTimeout(() => addMsg(makeMsg("bot", "Thank you. To complete your enquiry, I need a few contact details. What is your full name?")), 400);
      }
      return;
    }
  }

  function handleContactSubmit() {
    if (!contact.name || !contact.email || !contact.phone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }
    setStage("submitting");
    addMsg(makeMsg("user", `${contact.name} · ${contact.email} · ${contact.phone}`));
    addMsg(makeMsg("bot", "Processing your enquiry..."));

    const deptMap: Record<string, "CSO" | "Systems" | "Studios" | "Bizdoc" | "Innovation"> = {
      Innovation: "Innovation",
      Studios: "Studios",
      Systems: "Systems",
      Bizdoc: "Bizdoc",
    };

    submitMutation.mutate({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      department: deptMap[selectedDept || ""] || "CSO",
      serviceType: selectedService || "General Enquiry",
      description: contact.description || answers.join(" | ") || "Submitted via chat",
    });
  }

  function handleTextSend() {
    if (!textInput.trim()) return;
    const val = textInput.trim();
    setTextInput("");

    if (stage === "contact") {
      if (!contact.name) {
        setContact(c => ({ ...c, name: val }));
        addMsg(makeMsg("user", val));
        setTimeout(() => addMsg(makeMsg("bot", "What is your email address?")), 300);
        return;
      }
      if (!contact.email) {
        setContact(c => ({ ...c, email: val }));
        addMsg(makeMsg("user", val));
        setTimeout(() => addMsg(makeMsg("bot", "What is your phone number?")), 300);
        return;
      }
      if (!contact.phone) {
        setContact(c => ({ ...c, phone: val }));
        addMsg(makeMsg("user", val));
        setTimeout(() => addMsg(makeMsg("bot", "Briefly describe what you need (optional — press Enter to skip).")), 300);
        return;
      }
      setContact(c => ({ ...c, description: val }));
      addMsg(makeMsg("user", val));
      setTimeout(() => handleContactSubmit(), 300);
    }
  }

  const currentQs = selectedService ? (QUESTIONS[selectedService] || DEFAULT_QUESTIONS) : DEFAULT_QUESTIONS;
  const isLastQ = stage === "questions" && qIndex === currentQs.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border flex items-center gap-3 px-4 h-14">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
        </Link>
        <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--brand)" }}>HAMZURY Advisor</p>
          <p className="text-xs text-muted-foreground">Online · Typically replies instantly</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pt-14 pb-28 px-4">
        <div className="max-w-xl mx-auto space-y-4 py-6">
          {msgs.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%]">
                {msg.from === "bot" && (
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                    style={{ background: "var(--brand-muted)", color: "var(--brand-dark, #0f3d22)" }}
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                  />
                )}
                {msg.from === "user" && (
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed"
                    style={{ background: "var(--brand)" }}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleOption(opt.value, opt.label)}
                        disabled={stage === "submitting" || stage === "done"}
                        className="text-left text-sm px-4 py-2.5 rounded-xl border border-border hover:border-current transition-colors disabled:opacity-40"
                        style={{ color: "var(--brand)" }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Done state */}
          {stage === "done" && referenceCode && (
            <div className="rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2" style={{ color: "var(--brand)" }}>
                <CheckCircle2 size={18} />
                <span className="text-sm font-semibold">Enquiry submitted</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Your reference number</p>
                  <p className="text-base font-mono font-semibold text-foreground">{referenceCode}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(referenceCode); toast.success("Copied"); }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Save this reference number. Use it to track your project at <Link href="/track" className="underline underline-offset-2" style={{ color: "var(--brand)" }}>/track</Link>.</p>
              <div className="flex gap-2">
                <Link href="/track" className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                  <ExternalLink size={12} /> Track project
                </Link>
                <Link href="/" className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                  Back to home
                </Link>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar */}
      {(stage === "contact" || stage === "submitting") && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
              placeholder={
                !contact.name ? "Your full name..." :
                !contact.email ? "Your email address..." :
                !contact.phone ? "Your phone number..." :
                "Brief description (optional)..."
              }
              disabled={stage === "submitting"}
              className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-current transition-colors disabled:opacity-50"
              style={{ "--tw-ring-color": "var(--brand)" } as React.CSSProperties}
              autoFocus
            />
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || stage === "submitting"}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-white disabled:opacity-40 transition-colors flex-shrink-0"
              style={{ background: "var(--brand)" }}
            >
              {stage === "submitting" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
