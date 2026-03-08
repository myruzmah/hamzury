/**
 * HAMZURY CSO Agent
 * AI assistant for Amina Ahmad Musa (CSO Lead)
 * Helps draft client messages, qualify leads, and manage client communication
 */
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Draft a follow-up message for a client who submitted an inquiry 2 days ago",
  "Write a project update message for a client whose brand identity is in progress",
  "Draft a welcome message for a new client who just registered for CAC services",
  "Help me respond to a client asking about the timeline for their website",
  "Write a delivery message to send with a completed brand identity package",
  "Draft a nurture message for a lead who went quiet after the initial inquiry",
];

export function CSOAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Amina. I am your CSO assistant. I can help you draft client messages, qualify leads, write follow-ups, and manage client communication in the HAMZURY voice.\n\nWhat would you like help with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.agent.csoChat.useMutation({
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
        style={{ background: "var(--brand)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Sparkles size={16} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">CSO Agent</p>
            <p className="text-xs text-white opacity-70">Client communication assistant</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} color="white" />
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
                      msg.role === "assistant" ? "var(--brand)" : "var(--charcoal)",
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
                  style={{ background: "var(--brand)" }}
                >
                  <Bot size={13} color="white" />
                </div>
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--brand)" }} />
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
                    borderColor: "var(--brand)",
                    color: "var(--brand)",
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
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the CSO agent to draft a message, qualify a lead, or suggest a response..."
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
              style={{ background: "var(--brand)" }}
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
