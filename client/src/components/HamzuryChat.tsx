/**
 * HAMZURY Internal AI Chat Widget
 * Brand-trained guided conversation. No login. No friction.
 */
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  options?: ChatOption[];
}

interface ChatOption {
  label: string;
  value: string;
  action: "next" | "navigate";
  href?: string;
}

type NodeId = string;
interface Node { message: string; options?: ChatOption[] }

const TREE: Record<NodeId, Node> = {
  start: {
    message: "Hello. I am the HAMZURY assistant.\n\nHow can I help you today?",
    options: [
      { label: "I want to start a project", value: "start_project", action: "next" },
      { label: "I want to learn about your services", value: "services", action: "next" },
      { label: "I already have a reference code", value: "track", action: "next" },
      { label: "I have a general question", value: "general", action: "next" },
    ],
  },
  start_project: {
    message: "Which area best describes what you need?",
    options: [
      { label: "Business registration or compliance", value: "dept_bizdoc", action: "next" },
      { label: "Brand identity, design, or content", value: "dept_studios", action: "next" },
      { label: "Website, app, or technology", value: "dept_systems", action: "next" },
      { label: "Training, education, or skills", value: "dept_innovation", action: "next" },
      { label: "Finance, bookkeeping, or payroll", value: "dept_ledger", action: "next" },
      { label: "Something else", value: "dept_other", action: "next" },
    ],
  },
  dept_bizdoc: {
    message: "Our Bizdoc team handles CAC registration, annual returns, tax, PENCOM, licensing, and compliance advisory.\n\nWould you like to submit a formal request?",
    options: [
      { label: "Yes, start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Tell me more about Bizdoc", value: "info_bizdoc", action: "next" },
    ],
  },
  dept_studios: {
    message: "Our Studios team handles brand identity, social media management, content strategy, podcast production, and event media coverage.\n\nWould you like to submit a formal request?",
    options: [
      { label: "Yes, start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Tell me more about Studios", value: "info_studios", action: "next" },
    ],
  },
  dept_systems: {
    message: "Our Systems team builds websites, web applications, dashboards, automation systems, and AI-powered workflows.\n\nWould you like to submit a formal request?",
    options: [
      { label: "Yes, start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Tell me more about Systems", value: "info_systems", action: "next" },
    ],
  },
  dept_innovation: {
    message: "Our Innovation Hub offers executive training, robotics education, digital skills programmes, and internship opportunities.\n\nWould you like to submit a formal request?",
    options: [
      { label: "Yes, start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Tell me more about Innovation Hub", value: "info_innovation", action: "next" },
    ],
  },
  dept_ledger: {
    message: "Our Ledger team handles bookkeeping, financial reporting, commission processing, payroll, and expense management.\n\nWould you like to submit a formal request?",
    options: [
      { label: "Yes, start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Tell me more about Ledger", value: "info_ledger", action: "next" },
    ],
  },
  dept_other: {
    message: "No problem. You can submit a general enquiry and our Client Success team will direct you to the right department.",
    options: [
      { label: "Submit a general enquiry", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to start", value: "start", action: "next" },
    ],
  },
  info_bizdoc: {
    message: "HAMZURY Bizdoc handles:\n\n- CAC Business Name Registration\n- CAC Company Incorporation\n- Annual Returns Filing\n- Tax Registration (FIRS / LIRS)\n- PENCOM Registration\n- Industry Licensing\n- Compliance Advisory\n- Trademark Registration",
    options: [
      { label: "Start my Bizdoc request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to services", value: "services", action: "next" },
    ],
  },
  info_studios: {
    message: "HAMZURY Studios handles:\n\n- Brand Identity Design\n- Social Media Management\n- Content Strategy\n- Podcast Production\n- Event Media Coverage\n- Faceless Channel Creation",
    options: [
      { label: "Start my Studios request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to services", value: "services", action: "next" },
    ],
  },
  info_systems: {
    message: "HAMZURY Systems builds:\n\n- Business Websites\n- Web Applications\n- Client Dashboards\n- Automation Systems\n- AI-Powered Workflows\n- CRM Systems",
    options: [
      { label: "Start my Systems request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to services", value: "services", action: "next" },
    ],
  },
  info_innovation: {
    message: "HAMZURY Innovation Hub offers:\n\n- Executive Leadership Training\n- Robotics Education\n- Digital Skills Programmes\n- Internship Opportunities\n- Professional Development Workshops",
    options: [
      { label: "Start my Innovation request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to services", value: "services", action: "next" },
    ],
  },
  info_ledger: {
    message: "HAMZURY Ledger handles:\n\n- Bookkeeping\n- Financial Reporting\n- Commission Processing\n- Payroll\n- Expense Management",
    options: [
      { label: "Start my Ledger request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to services", value: "services", action: "next" },
    ],
  },
  services: {
    message: "HAMZURY operates across 9 departments:\n\n- Bizdoc: Business documentation and compliance\n- Studios: Creative and media services\n- Systems: Technology and digital solutions\n- Innovation Hub: Training and education\n- Growth: Business development\n- Ledger: Finance and accounting\n- People: Human resources\n- RIDI: Community impact\n- Robotics: Technology education\n\nWhich area interests you?",
    options: [
      { label: "Bizdoc", value: "info_bizdoc", action: "next" },
      { label: "Studios", value: "info_studios", action: "next" },
      { label: "Systems", value: "info_systems", action: "next" },
      { label: "Innovation Hub", value: "info_innovation", action: "next" },
      { label: "Ledger", value: "info_ledger", action: "next" },
      { label: "Start a request now", value: "/start", action: "navigate", href: "/start" },
    ],
  },
  track: {
    message: "To track your project you will need your reference code. It looks like: HMZ-2026-0001.\n\nClick below to go to the project tracker.",
    options: [
      { label: "Go to Project Tracker", value: "/track", action: "navigate", href: "/track" },
      { label: "I do not have a reference code", value: "no_ref", action: "next" },
    ],
  },
  no_ref: {
    message: "If you have not submitted a request yet, you can start one now and receive a reference code immediately.\n\nIf you submitted a request but did not receive a code, contact us at hello@hamzury.com.",
    options: [
      { label: "Start a new request", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to start", value: "start", action: "next" },
    ],
  },
  general: {
    message: "What would you like to know about HAMZURY?",
    options: [
      { label: "What services do you offer?", value: "services", action: "next" },
      { label: "How does the process work?", value: "process", action: "next" },
      { label: "How do I get started?", value: "start_project", action: "next" },
    ],
  },
  process: {
    message: "Here is how working with HAMZURY works:\n\n1. Submit a request through our intake form\n2. Receive a reference code immediately\n3. Our team reviews your request within 24 hours\n4. We assign the right team and begin work\n5. You track progress with your reference code\n6. We deliver and close the project\n\nNo login required.",
    options: [
      { label: "Start my request now", value: "/start", action: "navigate", href: "/start" },
      { label: "Back to start", value: "start", action: "next" },
    ],
  },
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function HamzuryChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasOpened, setHasOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
      setTimeout(() => {
        setMessages([{ id: uid(), role: "assistant", content: TREE.start.message, options: TREE.start.options }]);
      }, 200);
    }
  }, [open, hasOpened]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleOption(opt: ChatOption) {
    setMessages(prev => [...prev, { id: uid(), role: "user", content: opt.label }]);
    if (opt.action === "navigate") {
      setTimeout(() => setOpen(false), 300);
      return;
    }
    const nextNode = TREE[opt.value];
    if (nextNode) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: uid(), role: "assistant", content: nextNode.message, options: nextNode.options }]);
      }, 350);
    }
  }

  function fmt(text: string) {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105"
        style={{ background: "#1B4D3E" }}
        aria-label="Chat with HAMZURY"
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "#FDF5E6", border: "1px solid #d4c9b0", maxHeight: "72vh" }}
        >
          <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: "#1B4D3E" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#FDF5E6", color: "#1B4D3E" }}>H</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">HAMZURY Assistant</p>
              <p className="text-xs text-white/60">Always available</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/60 hover:text-white shrink-0">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[88%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                    style={msg.role === "user"
                      ? { background: "#1B4D3E", color: "white", borderBottomRightRadius: 4 }
                      : { background: "white", color: "#333333", border: "1px solid #d4c9b0", borderBottomLeftRadius: 4 }
                    }
                  >
                    {fmt(msg.content)}
                  </div>
                </div>
                {msg.role === "assistant" && msg.options && (
                  <div className="mt-2 space-y-1.5 pl-0">
                    {msg.options.map(opt =>
                      opt.action === "navigate" && opt.href ? (
                        <Link key={opt.value} href={opt.href}>
                          <button
                            onClick={() => handleOption(opt)}
                            className="w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors hover:border-[#1B4D3E]"
                            style={{ borderColor: "#1B4D3E", background: "white", color: "#1B4D3E" }}
                          >
                            <span>{opt.label}</span>
                            <ArrowRight size={11} />
                          </button>
                        </Link>
                      ) : (
                        <button
                          key={opt.value}
                          onClick={() => handleOption(opt)}
                          className="w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors hover:border-[#1B4D3E] hover:bg-white"
                          style={{ borderColor: "#d4c9b0", background: "white", color: "#333333" }}
                        >
                          <span>{opt.label}</span>
                          <ChevronRight size={11} className="text-muted-foreground" />
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-2 border-t shrink-0 text-center" style={{ borderColor: "#d4c9b0" }}>
            <p className="text-xs text-muted-foreground">
              HAMZURY &middot;{" "}
              <Link href="/start"><span className="underline cursor-pointer" style={{ color: "#1B4D3E" }}>Start a project</span></Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
