/**
 * HAMZURY — Chat with Faiza Abiola
 * Full-page ChatGPT-style interface with context retention, upsells, appointment booking
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Send, Loader2, CheckCircle2, BadgeCheck,
  Calendar, X, ChevronRight, RotateCcw
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";
const FAIZA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663394820206/i9aHLqTuJkXG4gxXzw9582/faiza-abiola-avatar-Ta4Rok5pF5JFA2GwGA3kdr.webp";
const BRAND = "#1B4D3E";

type Msg = {
  id: number;
  from: "faiza" | "user";
  text: string;
  typing?: boolean;
};

const SUGGESTED_PROMPTS = [
  "I need a website for my business",
  "How do I register my company with CAC?",
  "I want to build a brand identity",
  "Tell me about the Innovation Hub",
  "What is the Clarity Report?",
  "I want to book a consultation",
];

const WELCOME_MSG: Msg = {
  id: 0,
  from: "faiza",
  text: "Hello, I am Faiza Abiola — HAMZURY's Client Engagement Lead. I am here to help you find the right service and get started.\n\nWhat can I help you with today?",
};

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  topic: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "", email: "", phone: "", preferredDate: "", preferredTime: "", topic: "",
  });
  const [bookingDone, setBookingDone] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const msgIdRef = useRef(1);

  const chatMutation = trpc.agent.faizaChat.useMutation();
  const bookMutation = trpc.agent.bookConsultation.useMutation({
    onSuccess: () => {
      setBookingDone(true);
      toast.success("Consultation request sent. Faiza will confirm your slot within 24 hours.");
    },
    onError: (e) => toast.error(e.message),
  });

  const buildHistory = () =>
    messages
      .filter((m) => !m.typing && m.id > 0)
      .map((m) => ({
        role: m.from === "faiza" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput("");

    const userMsg: Msg = { id: msgIdRef.current++, from: "user", text: msg };
    const typingMsg: Msg = { id: msgIdRef.current++, from: "faiza", text: "", typing: true };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setIsLoading(true);

    try {
      const history = buildHistory();
      const result = await chatMutation.mutateAsync({ message: msg, history });
      setMessages((prev) =>
        prev.map((m) =>
          m.typing ? { ...m, text: result.reply, typing: false } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.typing
            ? { ...m, text: "I apologise — I encountered a brief issue. Please try again.", typing: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MSG]);
    setInput("");
    msgIdRef.current = 1;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookMutation.mutate(bookingForm);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-white/96 backdrop-blur-sm z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-4 bg-border" />
            <Link href="/" className="flex items-center gap-2">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <img src={FAIZA_AVATAR} alt="Faiza Abiola" className="h-8 w-8 rounded-full object-cover border border-border" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">Faiza Abiola</span>
                <BadgeCheck size={14} style={{ color: BRAND }} />
              </div>
              <p className="text-xs text-muted-foreground">Client Engagement Lead · HAMZURY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBooking(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-sm border border-border hover:bg-muted transition-colors"
            >
              <Calendar size={13} /> Book a call
            </button>
            <button onClick={resetChat} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="New conversation">
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.from === "faiza" ? (
                <div className="flex-shrink-0 relative">
                  <img src={FAIZA_AVATAR} alt="Faiza" className="h-8 w-8 rounded-full object-cover border border-border" />
                  <BadgeCheck size={12} className="absolute -bottom-0.5 -right-0.5" style={{ color: BRAND, background: "white", borderRadius: "50%" }} />
                </div>
              ) : (
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: BRAND }}>
                  You
                </div>
              )}
              <div className={`max-w-[75%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {msg.from === "faiza" && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-foreground">Faiza Abiola</span>
                    <BadgeCheck size={11} style={{ color: BRAND }} />
                    <span className="text-xs text-muted-foreground">· HAMZURY Verified</span>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.from === "user" ? "text-white rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}
                  style={msg.from === "user" ? { background: BRAND } : {}}
                >
                  {msg.typing ? (
                    <div className="flex items-center gap-1 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}
                </div>
                {msg.from === "faiza" && !msg.typing && msg.id === 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-border bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
            <button
              onClick={() => setShowBooking(true)}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              <Calendar size={12} /> Book a consultation
            </button>
            <button
              onClick={() => sendMessage("I am ready to start a project")}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              <ChevronRight size={12} /> Start a project
            </button>
            <button
              onClick={() => sendMessage("What is the Clarity Report and how much does it cost?")}
              disabled={isLoading}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              Clarity Report
            </button>
          </div>
          <div className="flex items-end gap-2 border border-border rounded-2xl px-4 py-3 focus-within:border-foreground/30 transition-colors bg-white">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Faiza anything about HAMZURY's services…"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent leading-relaxed"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: input.trim() && !isLoading ? BRAND : "#e5e7eb" }}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Send size={13} style={{ color: input.trim() ? "white" : "#9ca3af" }} />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Faiza is an AI agent. For urgent matters, email{" "}
            <a href="mailto:cso@hamzury.com" className="underline hover:text-foreground">cso@hamzury.com</a>
          </p>
        </div>
      </div>

      {/* Booking modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Book a consultation</h3>
                <p className="text-xs text-muted-foreground mt-0.5">20-minute call with a HAMZURY specialist</p>
              </div>
              <button onClick={() => setShowBooking(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            {bookingDone ? (
              <div className="text-center py-8">
                <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: BRAND }} />
                <p className="font-semibold text-foreground mb-2">Request received.</p>
                <p className="text-sm text-muted-foreground">Faiza will confirm your slot within 24 hours. Check your email for details.</p>
                <button
                  onClick={() => { setShowBooking(false); setBookingDone(false); }}
                  className="mt-6 text-sm font-medium underline"
                  style={{ color: BRAND }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Full name</label>
                  <input required value={bookingForm.name} onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                  <input required type="email" value={bookingForm.email} onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Phone number</label>
                  <input required value={bookingForm.phone} onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" placeholder="+234 800 000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Preferred date</label>
                    <input required type="date" value={bookingForm.preferredDate} onChange={(e) => setBookingForm((f) => ({ ...f, preferredDate: e.target.value }))}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Preferred time</label>
                    <select required value={bookingForm.preferredTime} onChange={(e) => setBookingForm((f) => ({ ...f, preferredTime: e.target.value }))}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors bg-white">
                      <option value="">Select</option>
                      {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">What would you like to discuss?</label>
                  <textarea required value={bookingForm.topic} onChange={(e) => setBookingForm((f) => ({ ...f, topic: e.target.value }))}
                    rows={3} className="w-full text-sm border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors resize-none"
                    placeholder="Brief description of your project or questions…" />
                </div>
                <button type="submit" disabled={bookMutation.isPending}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: BRAND }}>
                  {bookMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : null}
                  Request consultation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
