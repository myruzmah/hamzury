/**
 * HAMZURY AI Network Hub — /os/ai-network
 * Research Repository, Content Engine Pipeline, Agent Governance Logs.
 * Staff-facing. Requires login.
 */
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen, Cpu, FileText, Search, Plus, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Loader2, Download, Eye,
  Zap, Shield, BarChart2, ArrowLeft
} from "lucide-react";

const BRAND = "#1B4D3E";

// ─── Research Repository ──────────────────────────────────────────────────────
interface ResearchEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  source: string;
  addedBy: string;
  addedAt: string;
  tags: string[];
}

const RESEARCH_CATEGORIES = ["Market Research", "Competitor Analysis", "Industry Trends", "Client Insights", "Regulatory", "Technology", "Finance", "Other"];

const MOCK_RESEARCH: ResearchEntry[] = [
  {
    id: "RES-001",
    title: "Nigerian SME Digital Adoption Report 2025",
    category: "Market Research",
    summary: "78% of Nigerian SMEs have not adopted any digital business management tools. Key barriers: cost, awareness, and trust. Opportunity for HAMZURY positioning.",
    source: "PwC Nigeria / NBS",
    addedBy: "Abdullahi Musa",
    addedAt: "2026-03-10",
    tags: ["SME", "digital", "Nigeria", "opportunity"],
  },
  {
    id: "RES-002",
    title: "CAC Registration Process Changes 2026",
    category: "Regulatory",
    summary: "CAC introduced online-only registration for all new businesses from January 2026. Processing time reduced from 14 days to 3 days. Affects Bizdoc service pricing.",
    source: "CAC Official Portal",
    addedBy: "Abdulrahim Murtala Hussain",
    addedAt: "2026-03-05",
    tags: ["CAC", "registration", "regulatory", "Bizdoc"],
  },
  {
    id: "RES-003",
    title: "Brand Identity Pricing Benchmark — West Africa",
    category: "Competitor Analysis",
    summary: "Average brand identity package in Lagos: ₦150k–₦500k. HAMZURY positioned at mid-to-premium. Key differentiator: institutional quality + delivery guarantee.",
    source: "Internal research",
    addedBy: "Maryam Ashir Lalo",
    addedAt: "2026-02-28",
    tags: ["pricing", "brand", "competitor", "Studios"],
  },
];

// ─── Content Engine ───────────────────────────────────────────────────────────
interface ContentItem {
  id: string;
  title: string;
  type: "blog" | "social" | "email" | "video_script" | "case_study";
  status: "draft" | "review" | "approved" | "published";
  assignedTo: string;
  platform: string;
  dueDate: string;
  aiGenerated: boolean;
}

const MOCK_CONTENT: ContentItem[] = [
  { id: "CNT-001", title: "5 Signs Your Business Needs a Brand Identity Overhaul", type: "blog", status: "approved", assignedTo: "Farida Muneer", platform: "Website Blog", dueDate: "2026-03-18", aiGenerated: true },
  { id: "CNT-002", title: "HAMZURY OS: How We Run a 14-Person Firm Without WhatsApp", type: "social", status: "review", assignedTo: "Maryam Ashir Lalo", platform: "LinkedIn", dueDate: "2026-03-20", aiGenerated: false },
  { id: "CNT-003", title: "Client Success: How Kano Farms 3x'd Their Brand Reach", type: "case_study", status: "draft", assignedTo: "Abubakar Bashir", platform: "Website", dueDate: "2026-03-25", aiGenerated: false },
  { id: "CNT-004", title: "Weekly Insight: Nigerian Business Compliance Checklist", type: "email", status: "published", assignedTo: "Abdulrahim Murtala Hussain", platform: "Email Newsletter", dueDate: "2026-03-15", aiGenerated: true },
];

const CONTENT_STATUS_COLOR: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  review: "bg-yellow-50 text-yellow-700",
  approved: "bg-blue-50 text-blue-700",
  published: "bg-green-50 text-green-700",
};

const CONTENT_TYPE_ICON: Record<string, string> = {
  blog: "📝",
  social: "📱",
  email: "📧",
  video_script: "🎬",
  case_study: "📊",
};

// ─── Agent Governance Logs ────────────────────────────────────────────────────
interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  input: string;
  output: string;
  humanApproved: boolean | null;
  approvedBy: string | null;
  timestamp: string;
  department: string;
}

const MOCK_LOGS: AgentLog[] = [
  {
    id: "LOG-001",
    agentName: "Lead Qualification Agent",
    action: "Qualify Lead",
    input: "Client inquiry from Kano Farms — brand identity + social media",
    output: "Score: 8/10. Recommended service: Brand Identity Package + Social Media Management. Suggested price range: ₦250k–₦400k.",
    humanApproved: true,
    approvedBy: "Amina Ibrahim Musa",
    timestamp: "2026-03-16T09:15:00Z",
    department: "CSO",
  },
  {
    id: "LOG-002",
    agentName: "Clarity Report Agent",
    action: "Draft Business Health Report",
    input: "Client: TechBridge Ltd. Services requested: Business Documentation + Compliance Filing.",
    output: "Draft Clarity Report generated — 4 pages. Key findings: CAC compliance gap, no formal employment contracts, no trademark registration.",
    humanApproved: null,
    approvedBy: null,
    timestamp: "2026-03-16T10:30:00Z",
    department: "Bizdoc",
  },
  {
    id: "LOG-003",
    agentName: "Reporting Agent",
    action: "Generate Weekly CEO Summary",
    input: "Week ending 2026-03-15. All department reports submitted.",
    output: "CEO Summary generated — 6 departments, 23 tasks completed, 4 urgent items, 2 client deliveries made. Revenue this week: ₦380,000.",
    humanApproved: true,
    approvedBy: "Idris Ibrahim",
    timestamp: "2026-03-15T17:00:00Z",
    department: "CEO",
  },
  {
    id: "LOG-004",
    agentName: "Copywriting Agent",
    action: "Draft Blog Post",
    input: "Topic: 5 Signs Your Business Needs a Brand Identity Overhaul. Tone: professional, calm, HAMZURY voice.",
    output: "800-word blog post drafted. Includes 3 client examples, 1 CTA, no exclamation marks. Ready for review.",
    humanApproved: true,
    approvedBy: "Maryam Ashir Lalo",
    timestamp: "2026-03-14T14:20:00Z",
    department: "Studios",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AINetwork() {
  const [activeTab, setActiveTab] = useState<"research" | "content" | "logs" | "automation">("research");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [researchForm, setResearchForm] = useState({ title: "", category: "Market Research", summary: "", source: "", tags: "" });
  const [research, setResearch] = useState<ResearchEntry[]>(MOCK_RESEARCH);
  const [logs] = useState<AgentLog[]>(MOCK_LOGS);

  const filteredResearch = research.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submitResearch = () => {
    if (!researchForm.title || !researchForm.summary || !researchForm.source) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const entry: ResearchEntry = {
      id: `RES-${String(research.length + 1).padStart(3, "0")}`,
      ...researchForm,
      tags: researchForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      addedBy: "Current User",
      addedAt: new Date().toISOString().split("T")[0],
    };
    setResearch(prev => [entry, ...prev]);
    setShowResearchForm(false);
    setResearchForm({ title: "", category: "Market Research", summary: "", source: "", tags: "" });
    toast.success("Research entry added to the library.");
  };

  const TABS = [
    { id: "research", label: "Research Library", icon: <BookOpen size={14} /> },
    { id: "content", label: "Content Engine", icon: <FileText size={14} /> },
    { id: "logs", label: "Agent Logs", icon: <Shield size={14} /> },
    { id: "automation", label: "Automations", icon: <Zap size={14} /> },
  ] as const;

  const AUTOMATION_LIST = [
    { name: "Friday Report Reminder", trigger: "Every Friday 4:00 PM", action: "Send notification to all leads: submit weekly report", status: "active", owner: "CEO" },
    { name: "Friday CEO Summary", trigger: "Every Friday 5:00 PM", action: "Reporting Agent compiles all submitted reports → sends summary to CEO", status: "active", owner: "CEO" },
    { name: "New Intake Notification", trigger: "New client intake submitted", action: "Notify CSO Lead + CEO", status: "active", owner: "CSO" },
    { name: "Task Overdue Alert", trigger: "Task deadline passed, status not closed", action: "Notify assigned staff + department lead", status: "active", owner: "Systems" },
    { name: "Quality Gate Reminder", trigger: "Task in review stage > 48 hours", action: "Notify lead: task awaiting review", status: "active", owner: "Systems" },
    { name: "New Affiliate Application", trigger: "Affiliate application submitted", action: "Notify CSO Lead + CEO", status: "active", owner: "CSO" },
    { name: "RIDI Donation Received", trigger: "Donation form submitted", action: "Notify RIDI Lead + Finance Lead", status: "active", owner: "RIDI" },
    { name: "Scholarship Application", trigger: "Scholarship application submitted", action: "Notify RIDI Lead for review", status: "active", owner: "RIDI" },
    { name: "Lead Qualification", trigger: "New chat inquiry received", action: "Lead Qualification Agent scores and categorises lead", status: "active", owner: "CSO" },
    { name: "Content Calendar Reminder", trigger: "Content due date - 2 days", action: "Notify assigned staff: content due soon", status: "planned", owner: "Studios" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center">
              <Cpu size={20} style={{ color: BRAND }} />
            </div>
            <div>
              <div className="text-base font-bold text-[#1B4D3E]">AI Network Hub</div>
              <div className="text-xs text-stone-400">Research · Content · Governance · Automation</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/os/ai" className="text-xs text-stone-400 hover:text-[#1B4D3E] transition-colors">
              ← AI Agents
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Research Entries", value: research.length, color: "#1B4D3E" },
            { label: "Content Items", value: MOCK_CONTENT.length, color: "#3b82f6" },
            { label: "Agent Actions (30d)", value: logs.length, color: "#8b5cf6" },
            { label: "Active Automations", value: AUTOMATION_LIST.filter(a => a.status === "active").length, color: "#10b981" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5">
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-stone-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-[#1B4D3E] shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Research Library */}
        {activeTab === "research" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research by title, tag, or category…"
                  className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4D3E] bg-white"
                />
              </div>
              <button onClick={() => setShowResearchForm(true)}
                className="bg-[#1B4D3E] text-white text-xs px-4 py-2.5 rounded-xl hover:bg-[#163d30] transition-colors flex items-center gap-1.5 shrink-0">
                <Plus size={13} /> Add Entry
              </button>
            </div>

            <div className="space-y-4">
              {filteredResearch.map((entry) => (
                <div key={entry.id} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-stone-900">{entry.title}</span>
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{entry.category}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed mb-2">{entry.summary}</p>
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span>Source: {entry.source}</span>
                        <span>·</span>
                        <span>Added by {entry.addedBy}</span>
                        <span>·</span>
                        <span>{entry.addedAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {entry.tags.map(tag => (
                          <span key={tag} className="text-xs bg-[#1B4D3E]/8 text-[#1B4D3E] px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-stone-300 shrink-0">{entry.id}</span>
                  </div>
                </div>
              ))}
              {filteredResearch.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                  <p className="text-stone-400 text-sm">No research entries match your search.</p>
                </div>
              )}
            </div>

            {/* Add Research Modal */}
            {showResearchForm && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-stone-900">Add Research Entry</h3>
                    <button onClick={() => setShowResearchForm(false)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Title *</label>
                      <input value={researchForm.title} onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                        placeholder="e.g. Nigerian SME Digital Adoption Report 2026"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Category</label>
                      <select value={researchForm.category} onChange={(e) => setResearchForm({ ...researchForm, category: e.target.value })}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white">
                        {RESEARCH_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Summary *</label>
                      <textarea value={researchForm.summary} onChange={(e) => setResearchForm({ ...researchForm, summary: e.target.value })}
                        placeholder="Key findings and relevance to HAMZURY"
                        rows={4}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E] resize-none" /></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Source *</label>
                      <input value={researchForm.source} onChange={(e) => setResearchForm({ ...researchForm, source: e.target.value })}
                        placeholder="e.g. PwC Nigeria, Internal research, CAC Portal"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <div><label className="text-xs font-medium text-stone-600 block mb-1">Tags (comma-separated)</label>
                      <input value={researchForm.tags} onChange={(e) => setResearchForm({ ...researchForm, tags: e.target.value })}
                        placeholder="e.g. SME, Nigeria, digital, opportunity"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4D3E]" /></div>
                    <button onClick={submitResearch}
                      className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#163d30] transition-colors mt-2">
                      Add to Research Library
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Engine */}
        {activeTab === "content" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Content Pipeline</h3>
                <p className="text-xs text-stone-400 mt-0.5">All content items across departments — blog, social, email, video scripts.</p>
              </div>
              <button onClick={() => toast("Feature coming soon — use the AI Agents tab to generate content.")}
                className="bg-[#1B4D3E] text-white text-xs px-4 py-2 rounded-xl hover:bg-[#163d30] transition-colors flex items-center gap-1.5">
                <Plus size={13} /> New Content
              </button>
            </div>

            {/* Pipeline columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["draft", "review", "approved", "published"] as const).map((status) => {
                const items = MOCK_CONTENT.filter(c => c.status === status);
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CONTENT_STATUS_COLOR[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="text-xs text-stone-400">{items.length}</span>
                    </div>
                    {items.map(item => (
                      <div key={item.id} className="bg-white rounded-xl border border-stone-100 p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-base">{CONTENT_TYPE_ICON[item.type]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-stone-900 leading-snug">{item.title}</div>
                            <div className="text-xs text-stone-400 mt-1">{item.platform}</div>
                            <div className="text-xs text-stone-400">Due {item.dueDate}</div>
                            {item.aiGenerated && (
                              <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full mt-1 inline-block">AI</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="bg-stone-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-stone-300">Empty</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agent Governance Logs */}
        {activeTab === "logs" && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-stone-900">Agent Governance Log</h3>
              <p className="text-xs text-stone-400 mt-0.5">Every AI agent action is logged here. Human approval is required before any output is used.</p>
            </div>
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-stone-900">{log.agentName}</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{log.action}</span>
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{log.department}</span>
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {new Date(log.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {log.humanApproved === true && (
                        <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle2 size={11} /> Approved by {log.approvedBy}
                        </span>
                      )}
                      {log.humanApproved === null && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                          <Clock size={11} /> Awaiting approval
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-stone-50 rounded-xl p-3">
                      <div className="text-xs font-medium text-stone-500 mb-1">Input</div>
                      <div className="text-xs text-stone-700 leading-relaxed">{log.input}</div>
                    </div>
                    <div className="bg-[#1B4D3E]/4 rounded-xl p-3">
                      <div className="text-xs font-medium text-[#1B4D3E] mb-1">Output</div>
                      <div className="text-xs text-stone-700 leading-relaxed">{log.output}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automations */}
        {activeTab === "automation" && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-stone-900">Automation Registry</h3>
              <p className="text-xs text-stone-400 mt-0.5">All active and planned automations in HAMZURY OS. Automations run silently — logs appear in the Agent Logs tab.</p>
            </div>
            <div className="space-y-3">
              {AUTOMATION_LIST.map((auto, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-stone-900">{auto.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${auto.status === "active" ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                          {auto.status}
                        </span>
                        <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{auto.owner}</span>
                      </div>
                      <div className="text-xs text-stone-500">
                        <span className="font-medium">Trigger:</span> {auto.trigger}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        <span className="font-medium">Action:</span> {auto.action}
                      </div>
                    </div>
                    <Zap size={14} className={auto.status === "active" ? "text-green-500 shrink-0" : "text-stone-300 shrink-0"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
