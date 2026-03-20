/**
 * HAMZURY Agentic AI Dashboard — /os/ai
 * 11 AI agents accessible to all authenticated staff.
 * Each agent has a dedicated chat interface with conversation history.
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Send, Loader2, Bot, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BRAND = "#1B4D3E";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  placeholder: string;
  dept: string;
  color: string;
}

const AGENTS: Agent[] = [
  {
    id: "lead_qualification",
    name: "Lead Qualification",
    role: "CSO Agent",
    description: "Evaluates incoming leads — fit, budget signals, urgency, and conversion likelihood. Produces a qualification score and recommended next action.",
    placeholder: "Paste lead details here — name, business, what they asked for, how they found us...",
    dept: "CSO",
    color: "#1B4D3E",
  },
  {
    id: "follow_up",
    name: "Follow-Up Writer",
    role: "CSO Agent",
    description: "Drafts professional follow-up messages for leads and clients — WhatsApp messages, emails, and call scripts. Warm but never pushy.",
    placeholder: "Describe the client, where they are in the process, and what you need to say...",
    dept: "CSO",
    color: "#1B4D3E",
  },
  {
    id: "clarity_report",
    name: "Clarity Report",
    role: "CSO Agent",
    description: "Drafts Business Health Reports for clients. Structured report covering business overview, challenges, recommended services, and investment summary.",
    placeholder: "Tell me about the client's business, their challenges, and what services they need...",
    dept: "CSO",
    color: "#1B4D3E",
  },
  {
    id: "research",
    name: "Research Agent",
    role: "All Departments",
    description: "Conducts deep research on any topic — market analysis, competitor intelligence, industry trends, regulatory updates, and data synthesis.",
    placeholder: "What do you need researched? Be specific about the scope and depth required...",
    dept: "All",
    color: "#3b82f6",
  },
  {
    id: "strategist",
    name: "Business Strategist",
    role: "All Departments",
    description: "Helps staff and clients think through business strategy — positioning, growth plans, competitive differentiation, and go-to-market planning.",
    placeholder: "Describe the business situation or strategic question you need to think through...",
    dept: "All",
    color: "#3b82f6",
  },
  {
    id: "copywriting",
    name: "Copywriting Agent",
    role: "Studios / Growth",
    description: "Writes high-quality copy — website pages, proposals, pitch decks, social media captions, email campaigns, and brand messaging in HAMZURY's voice.",
    placeholder: "What copy do you need? Include the platform, audience, and key message...",
    dept: "Studios",
    color: "#8b5cf6",
  },
  {
    id: "creative_director",
    name: "Creative Director",
    role: "Studios Agent",
    description: "Provides creative direction — moodboards in text form, art direction briefs, visual storytelling frameworks, and campaign concepts.",
    placeholder: "Describe the project, brand, audience, and the feeling you want to create...",
    dept: "Studios",
    color: "#8b5cf6",
  },
  {
    id: "design_brief",
    name: "Design Brief Agent",
    role: "Studios Agent",
    description: "Creates structured design briefs for client projects — target audience, tone, colour direction, typography, deliverables list, and timeline.",
    placeholder: "Tell me about the client and the design project — what they do, who they serve, what they need...",
    dept: "Studios",
    color: "#8b5cf6",
  },
  {
    id: "video_brief",
    name: "Video Brief Agent",
    role: "Studios Agent",
    description: "Creates structured video production briefs — concept, script outline, shot list, visual style, music direction, duration, and distribution plan.",
    placeholder: "Describe the video project — client, purpose, audience, and any existing brand assets...",
    dept: "Studios",
    color: "#8b5cf6",
  },
  {
    id: "qa",
    name: "Quality Assurance",
    role: "All Departments",
    description: "Reviews deliverables, copy, and documents for quality, accuracy, brand consistency, and completeness against HAMZURY's standards.",
    placeholder: "Paste the content or deliverable you need reviewed, and specify what to check...",
    dept: "All",
    color: "#f59e0b",
  },
  {
    id: "publishing",
    name: "Publishing Agent",
    role: "Studios / Growth",
    description: "Plans and schedules content publishing — content calendars, optimal posting times, platform-specific captions, and publishing cadence.",
    placeholder: "Tell me about the brand, platforms, content type, and publishing goals...",
    dept: "Studios",
    color: "#8b5cf6",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function AgentChat({ agent, onBack }: { agent: Agent; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.agent.agentChat.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      toast.error("Agent failed to respond. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  function sendMessage() {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    chatMutation.mutate({
      agentId: agent.id,
      message: text,
      history: messages,
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Agent header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white" style={{ borderColor: "#e5e7eb" }}>
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground">
          <ArrowLeft size={16} />
        </button>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: agent.color + "18" }}
        >
          <Bot size={16} style={{ color: agent.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
            title="Clear conversation"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: agent.color + "15" }}
            >
              <Bot size={22} style={{ color: agent.color }} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{agent.name}</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{agent.description}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === "user"
                  ? { background: BRAND, color: "white", borderRadius: "16px 16px 4px 16px" }
                  : { background: "#f3f4f6", color: "#1a1a1a", borderRadius: "4px 16px 16px 16px" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm" style={{ background: "#f3f4f6", borderRadius: "4px 16px 16px 16px" }}>
              <Loader2 size={14} className="animate-spin text-muted-foreground" />
              <span className="text-muted-foreground text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={agent.placeholder}
            rows={2}
            disabled={chatMutation.isPending}
            className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-border resize-none focus:outline-none disabled:opacity-50"
            style={{ borderColor: "#d1d5db" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || chatMutation.isPending}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white disabled:opacity-40 transition-colors self-end shrink-0"
            style={{ background: BRAND }}
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default function AIDashboard() {
  const { user, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: BRAND }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">You must be logged in to access the AI Dashboard.</p>
        <Link href="/staff" className="text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: BRAND }}>
          Staff Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border flex items-center gap-3 px-4 h-14">
        <Link href="/staff" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={13} /> Dashboard
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: BRAND }}>
            <Bot size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: BRAND }}>AI Agent Network</span>
        </div>
      </header>

      <main className="flex-1 pt-14">
        {selectedAgent ? (
          /* Full-screen agent chat */
          <div className="h-[calc(100vh-56px)] flex flex-col">
            <AgentChat agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
          </div>
        ) : (
          /* Agent selection grid */
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: BRAND }}>HAMZURY OS</p>
              <h1 className="text-2xl font-light text-foreground mb-1">AI Agent Network</h1>
              <p className="text-sm text-muted-foreground">11 specialised agents to assist every department. Select an agent to begin.</p>
            </div>

            {/* Agent Stats Table */}
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Agent Performance This Week</p>
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #e5e7eb" }}>
                        {["Agent", "Role", "Tasks", "Success Rate", "Workload"].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Lead Qualification", role: "CSO", tasks: 24, rate: 94, workload: 72 },
                        { name: "Follow-Up Writer", role: "CSO", tasks: 31, rate: 97, workload: 85 },
                        { name: "Clarity Report", role: "CSO", tasks: 12, rate: 91, workload: 45 },
                        { name: "Research Agent", role: "All Depts", tasks: 18, rate: 89, workload: 60 },
                        { name: "Business Strategist", role: "All Depts", tasks: 9, rate: 96, workload: 38 },
                        { name: "Copywriting Agent", role: "Studios", tasks: 27, rate: 93, workload: 78 },
                        { name: "Creative Director", role: "Studios", tasks: 15, rate: 88, workload: 52 },
                        { name: "Design Brief", role: "Studios", tasks: 11, rate: 95, workload: 40 },
                        { name: "Video Brief", role: "Studios", tasks: 8, rate: 92, workload: 30 },
                        { name: "Quality Assurance", role: "All Depts", tasks: 22, rate: 99, workload: 65 },
                        { name: "Publishing Agent", role: "Studios", tasks: 19, rate: 90, workload: 58 },
                      ].map((a, i) => (
                        <tr key={i} style={{ borderBottom: i < 10 ? "1px solid #f3f4f6" : "none" }}>
                          <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                          <td className="px-4 py-3 text-gray-500">{a.role}</td>
                          <td className="px-4 py-3 text-gray-800">{a.tasks}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-gray-100" style={{ maxWidth: 60 }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${a.rate}%`, background: a.rate >= 95 ? "#059669" : a.rate >= 90 ? "#1B4D3E" : "#D97706" }} />
                              </div>
                              <span>{a.rate}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-gray-100" style={{ maxWidth: 60 }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${a.workload}%`, background: a.workload >= 80 ? "#DC2626" : a.workload >= 60 ? "#D97706" : "#059669" }} />
                              </div>
                              <span>{a.workload}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Weekly tasks chart */}
              <div className="bg-white rounded-xl border mt-3 p-4" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-xs font-semibold text-gray-700 mb-3">Total Tasks Completed per Week</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={[
                    { week: "W1 Feb", tasks: 58 },
                    { week: "W2 Feb", tasks: 72 },
                    { week: "W3 Feb", tasks: 65 },
                    { week: "W4 Feb", tasks: 81 },
                    { week: "W1 Mar", tasks: 90 },
                    { week: "W2 Mar", tasks: 104 },
                    { week: "W3 Mar", tasks: 196 },
                  ]} barSize={26}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                      {[false,false,false,false,true,true,true].map((gold, i) => <Cell key={i} fill={gold ? "#C9A97E" : "#1B4D3E"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Group by department */}
            {[
              { label: "CSO — Client Relations", agents: AGENTS.filter(a => a.dept === "CSO") },
              { label: "All Departments", agents: AGENTS.filter(a => a.dept === "All") },
              { label: "Studios — Creative & Media", agents: AGENTS.filter(a => a.dept === "Studios") },
            ].map(({ label, agents }) => (
              <div key={label} className="mb-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
                <div className="space-y-2">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className="w-full text-left bg-white rounded-xl border p-4 hover:border-current transition-all group flex items-center gap-4"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: agent.color + "15" }}
                      >
                        <Bot size={18} style={{ color: agent.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{agent.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
