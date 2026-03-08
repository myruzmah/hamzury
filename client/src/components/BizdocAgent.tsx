/**
 * HAMZURY Bizdoc Agent
 * AI assistant for Bizdoc Leads (Abdullahi Musa & Abdulrahim Murtala Hussain)
 * Helps with compliance research, CAC requirements, regulatory guidance
 */
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp, Scale } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "What documents are required for CAC business name registration in Nigeria?",
  "What is the process for converting a business name to a limited liability company?",
  "Explain the PENCOM registration requirements for a new company",
  "What are the annual return filing deadlines for a limited liability company?",
  "What taxes must a new SME register for with FIRS?",
  "What is the process for obtaining an NAFDAC registration number?",
];

export function BizdocAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello. I am your Bizdoc compliance research assistant. I can help you research CAC requirements, regulatory processes, tax obligations, PENCOM rules, and any other compliance question relevant to your client work.\n\nWhat would you like to research?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.agent.bizdocChat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, timestamp: new Date() },
      ]);
      setIsLoading(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    chatMutation.mutate({
      message: text.trim(),
      history: messages.map((m) => ({ role: m.role, content: m.content })),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "white" }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:opacity-80 transition-opacity"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Scale size={16} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Bizdoc Agent</p>
            <p className="text-xs text-white opacity-70">Compliance research assistant</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown size={16} color="white" />
        ) : (
          <ChevronDown size={16} color="white" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Messages */}
          <div
            className="overflow-y-auto p-4 space-y-4"
            style={{ height: "340px", background: "var(--milk)" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      msg.role === "assistant" ? "var(--charcoal)" : "var(--brand)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={13} color="white" />
                  ) : (
                    <User size={13} color="white" />
                  )}
                </div>
                <div
                  className="max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === "assistant" ? "white" : "var(--brand)",
                    color:
                      msg.role === "assistant" ? "var(--charcoal)" : "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--charcoal)" }}
                >
                  <Bot size={13} color="white" />
                </div>
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--charcoal)" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
              {SUGGESTED_PROMPTS.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 rounded-full border hover:opacity-80 transition-opacity"
                  style={{
                    borderColor: "var(--charcoal)",
                    color: "var(--charcoal)",
                    background: "transparent",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="flex items-end gap-2 px-4 py-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about CAC requirements, tax obligations, PENCOM, licensing, or any compliance question..."
              rows={2}
              className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                color: "var(--charcoal)",
                background: "white",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
              style={{ background: "var(--charcoal)" }}
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
