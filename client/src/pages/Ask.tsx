import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Send, ArrowRight, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const SUGGESTED_QUESTIONS = [
  "How do I register a business in Nigeria?",
  "What does HAMZURY Studios offer?",
  "How long does CAC registration take?",
  "What is the Innovation Hub?",
  "How do I track my project?",
  "What is RIDI?",
];

export default function Ask() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "hamzury-ask",
    transport: new DefaultChatTransport({ api: "/api/ask" }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const canSend = status === "ready" || status === "error";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const submit = () => {
    const text = input.trim();
    if (!text || !canSend) return;
    sendMessage({ text });
    setInput("");
    inputRef.current?.focus();
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 pt-16 pb-36 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Page title */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "var(--brand-muted)", color: "var(--brand)" }}>
              Knowledge Assistant
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Ask HAMZURY anything.</h1>
            <p className="text-sm text-muted-foreground mt-2">Services, processes, timelines, pricing — we will answer clearly.</p>
          </div>

          {/* Welcome message when no messages yet */}
          {showSuggestions && (
            <div className="flex justify-start mb-6">
              <div className="w-7 h-7 rounded-full flex-shrink-0 mr-3 mt-0.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--brand)" }}>
                H
              </div>
              <div className="bg-gray-50 border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-foreground max-w-[80%]">
                What would you like to know about HAMZURY? You can ask about our services, how we work, pricing, timelines, or anything else.
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((m) => {
              const textContent = m.parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");
              return (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 mr-3 mt-0.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--brand)" }}>
                      H
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-gray-50 text-foreground rounded-bl-sm border border-border"
                    }`}
                    style={m.role === "user" ? { background: "var(--brand)" } : {}}
                  >
                    {textContent}
                    {/* Conversion CTAs */}
                    {m.role === "assistant" && textContent.toLowerCase().includes("/start") && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <Link href="/start" className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--brand)" }}>
                          Start your project <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                    {m.role === "assistant" && textContent.toLowerCase().includes("/track") && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <Link href="/track" className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--brand)" }}>
                          Track your project <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                    {m.role === "assistant" && textContent.toLowerCase().includes("/affiliates") && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <Link href="/affiliates" className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--brand)" }}>
                          Learn about affiliates <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--brand)" }}>
                  H
                </div>
                <div className="bg-gray-50 border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 size={14} className="animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {showSuggestions && (
            <div className="mt-8">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Common questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-border hover:bg-gray-50 transition-all text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input bar — fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
        {/* Mobile bottom nav spacer */}
        <div className="md:hidden h-14" />
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Ask about services, timelines, pricing..."
            className="flex-1 text-sm bg-gray-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-brand/50 transition-all placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            onClick={submit}
            disabled={isLoading || !input.trim() || !canSend}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: "var(--brand)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
