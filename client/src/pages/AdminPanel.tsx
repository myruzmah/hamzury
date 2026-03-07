import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import {
  Users,
  Briefcase,
  UserCheck,
  MessageSquare,
  BarChart2,
  LogOut,
  Plus,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  X,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: "green" | "amber" | "red" | "gray" | "blue" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${map[color]}`}>
      {label}
    </span>
  );
}

function statusColor(status: string): "green" | "amber" | "red" | "gray" | "blue" {
  if (status === "Active" || status === "Paid" || status === "Completed") return "green";
  if (status === "Proposal" || status === "In Progress" || status === "Sent") return "blue";
  if (status === "Delivery") return "amber";
  if (status === "Closed" || status === "Cancelled") return "gray";
  if (status === "Overdue") return "red";
  return "gray";
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--brand)" }}>
            {title}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--brand)] transition-shadow";

// ─── Overview Stats ───────────────────────────────────────────────────────────
function OverviewStats() {
  const { data, isLoading } = trpc.admin.stats.useQuery();
  if (isLoading) return <div className="h-24 animate-pulse bg-gray-50 rounded-sm" />;
  if (!data) return null;

  const cards = [
    { label: "Total Clients", value: data.totalClients, sub: `${data.activeClients} active`, icon: Briefcase, color: "var(--brand)" },
    { label: "Total Tasks", value: data.totalTasks, sub: `${data.completedTasks} completed`, icon: CheckCircle2, color: "#059669" },
    { label: "Staff Members", value: data.totalStaff, sub: "registered", icon: Users, color: "#2563EB" },
    { label: "Agents", value: data.totalAgents, sub: "referral partners", icon: UserCheck, color: "#7C3AED" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</span>
            <c.icon size={14} style={{ color: c.color }} />
          </div>
          <p className="text-2xl font-light" style={{ color: "var(--charcoal)" }}>{c.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Clients Tab ──────────────────────────────────────────────────────────────
function ClientsTab() {
  const utils = trpc.useUtils();
  const { data: clients, isLoading } = trpc.admin.allClients.useQuery();
  const createClient = trpc.admin.createClient.useMutation({
    onSuccess: () => { utils.admin.allClients.invalidate(); utils.admin.stats.invalidate(); },
  });
  const updateStatus = trpc.admin.updateClientStatus.useMutation({
    onSuccess: () => utils.admin.allClients.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ clientRef: "", name: "", email: "", servicePackage: "", status: "Inquiry" as const });
  const [createdToken, setCreatedToken] = useState<{ clientRef: string; accessUrl: string; accessToken: string } | null>(null);
  const [commModal, setCommModal] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newClient.clientRef || !newClient.name) { toast.error("Reference and name are required."); return; }
    try {
      const res = await createClient.mutateAsync(newClient);
      setCreatedToken({ clientRef: res.clientRef, accessUrl: res.accessUrl, accessToken: res.accessToken });
      setShowForm(false);
      setNewClient({ clientRef: "", name: "", email: "", servicePackage: "", status: "Inquiry" });
      toast.success("Client created.");
    } catch { toast.error("Failed to create client."); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard."));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--charcoal)" }}>Clients</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={12} /> Add Client
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-50 rounded-sm" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Reference", "Client Name", "Package", "Status", "Invoice", "Actions"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(!clients || clients.length === 0) ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No clients yet. Add your first client above.</td></tr>
              ) : clients.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{c.clientRef}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: "var(--charcoal)" }}>{c.name}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{c.servicePackage ?? "—"}</td>
                  <td className="py-3 px-3">
                    <select
                      value={c.status}
                      onChange={(e) => {
                        const s = e.target.value as "Inquiry" | "Proposal" | "Active" | "Delivery" | "Closed";
                        updateStatus.mutate({ clientRef: c.clientRef, status: s });
                      }}
                      className="text-xs border border-border rounded px-1.5 py-0.5 bg-white focus:outline-none"
                    >
                      {["Inquiry", "Proposal", "Active", "Delivery", "Closed"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-3"><Badge label={c.invoiceStatus} color={statusColor(c.invoiceStatus)} /></td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/client/${c.clientRef}`)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        title="Copy client URL"
                      >
                        <Copy size={11} /> URL
                      </button>
                      <button
                        onClick={() => setCommModal(c.clientRef)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        title="Post communication"
                      >
                        <MessageSquare size={11} /> Note
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Client Modal */}
      {showForm && (
        <Modal title="New Client" onClose={() => setShowForm(false)}>
          <FormField label="Reference Number (e.g. CLT-001)">
            <input className={inputCls} value={newClient.clientRef} onChange={(e) => setNewClient({ ...newClient, clientRef: e.target.value })} placeholder="CLT-001" />
          </FormField>
          <FormField label="Client Name">
            <input className={inputCls} value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="Full name or company" />
          </FormField>
          <FormField label="Email (optional)">
            <input className={inputCls} type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="client@example.com" />
          </FormField>
          <FormField label="Service Package (optional)">
            <input className={inputCls} value={newClient.servicePackage} onChange={(e) => setNewClient({ ...newClient, servicePackage: e.target.value })} placeholder="e.g. Business Registration" />
          </FormField>
          <FormField label="Initial Status">
            <select className={inputCls} value={newClient.status} onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setNewClient((prev) => ({ ...prev, status: e.target.value as any }));
            }}>
              {["Inquiry", "Proposal", "Active", "Delivery", "Closed"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreate} disabled={createClient.isPending} className="flex-1 py-2 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "var(--brand)" }}>
              {createClient.isPending ? "Creating..." : "Create Client"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Access URL Modal */}
      {createdToken && (
        <Modal title="Client Access Created" onClose={() => setCreatedToken(null)}>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-sm p-3">
              <p className="text-xs text-green-700 font-medium mb-1">Client created successfully.</p>
              <p className="text-xs text-green-600">Share the access URL below with your client. They can access their project view without a password.</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Client Access URL</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-sm px-3 py-2">
                <span className="text-xs font-mono text-foreground flex-1 truncate">
                  {window.location.origin}/client/{createdToken.clientRef}
                </span>
                <button onClick={() => copyToClipboard(`${window.location.origin}/client/${createdToken.clientRef}`)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy size={13} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Reference Number</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-sm px-3 py-2">
                <span className="text-xs font-mono text-foreground flex-1">{createdToken.clientRef}</span>
                <button onClick={() => copyToClipboard(createdToken.clientRef)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy size={13} />
                </button>
              </div>
            </div>
            <button onClick={() => setCreatedToken(null)} className="w-full py-2 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90" style={{ background: "var(--brand)" }}>
              Done
            </button>
          </div>
        </Modal>
      )}

      {/* Post Communication Modal */}
      {commModal && <CommunicationModal clientRef={commModal} onClose={() => setCommModal(null)} />}
    </div>
  );
}

// ─── Communication Modal ──────────────────────────────────────────────────────
function CommunicationModal({ clientRef, onClose }: { clientRef: string; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const postComm = trpc.admin.postCommunication.useMutation({
    onSuccess: () => { toast.success("Note posted to client view."); onClose(); },
    onError: () => toast.error("Failed to post note."),
  });

  return (
    <Modal title={`Post Note — ${clientRef}`} onClose={onClose}>
      <FormField label="Author (optional)">
        <input className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. CSO Team" />
      </FormField>
      <FormField label="Message">
        <textarea
          className={`${inputCls} min-h-[100px] resize-none`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write an update for the client..."
        />
      </FormField>
      <div className="flex gap-2">
        <button
          onClick={() => postComm.mutate({ clientRef, message, author: author || undefined })}
          disabled={!message.trim() || postComm.isPending}
          className="flex-1 py-2 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--brand)" }}
        >
          {postComm.isPending ? "Posting..." : "Post Note"}
        </button>
        <button onClick={onClose} className="px-4 py-2 text-xs border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </div>
    </Modal>
  );
}

// ─── Staff Tab ────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "HAMZURY CSO", "HAMZURY Systems", "HAMZURY Studios", "HAMZURY Bizdoc",
  "HAMZURY Innovation", "HAMZURY Growth", "HAMZURY People", "HAMZURY Ledger",
  "HAMZURY Executive", "HAMZURY Founder", "HAMZURY RIDI",
];

function StaffTab() {
  const utils = trpc.useUtils();
  const { data: staff, isLoading } = trpc.admin.allStaff.useQuery();
  const createStaff = trpc.admin.createStaff.useMutation({
    onSuccess: () => { utils.admin.allStaff.invalidate(); utils.admin.stats.invalidate(); toast.success("Staff member added."); setShowForm(false); setNewStaff({ name: "", email: "", department: "", role: "staff" }); },
    onError: () => toast.error("Failed to add staff member."),
  });

  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", department: "", role: "staff" as "staff" | "admin" });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--charcoal)" }}>Staff</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={12} /> Add Staff
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-50 rounded-sm" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Department", "Role", "Staff ID", "Last Sign In"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(!staff || staff.length === 0) ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No staff members yet. Add your first team member above.</td></tr>
              ) : staff.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 font-medium" style={{ color: "var(--charcoal)" }}>{s.name ?? "—"}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{s.email ?? "—"}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">{s.department ?? "—"}</td>
                  <td className="py-3 px-3"><Badge label={s.role} color={s.role === "admin" ? "blue" : "gray"} /></td>
                  <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{s.staffId ?? "—"}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">{new Date(s.lastSignedIn).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title="Add Staff Member" onClose={() => setShowForm(false)}>
          <FormField label="Full Name">
            <input className={inputCls} value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="Full name" />
          </FormField>
          <FormField label="Email Address">
            <input className={inputCls} type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="name@hamzury.com" />
          </FormField>
          <FormField label="Department">
            <select className={inputCls} value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Role">
            <select className={inputCls} value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as "staff" | "admin" })}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-4">
            <p className="text-xs text-amber-700">
              Staff members log in at <strong>/portal</strong> using their email and the shared password <strong>hamzury2026</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createStaff.mutate(newStaff)}
              disabled={!newStaff.name || !newStaff.email || createStaff.isPending}
              className="flex-1 py-2 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--brand)" }}
            >
              {createStaff.isPending ? "Adding..." : "Add Staff Member"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────
function AgentsTab() {
  const utils = trpc.useUtils();
  const { data: agentList, isLoading } = trpc.admin.allAgents.useQuery();
  const createAgent = trpc.admin.createAgent.useMutation({
    onSuccess: (res) => {
      utils.admin.allAgents.invalidate();
      utils.admin.stats.invalidate();
      toast.success(`Agent created. ID: ${res.agentId}`);
      setShowForm(false);
      setNewAgent({ name: "", email: "", phone: "" });
    },
    onError: () => toast.error("Failed to create agent."),
  });

  const [showForm, setShowForm] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--charcoal)" }}>Agents</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={12} /> Add Agent
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-50 rounded-sm" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Agent ID", "Name", "Email", "Phone", "Registered"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(!agentList || agentList.length === 0) ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No agents registered yet.</td></tr>
              ) : agentList.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{a.agentId}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: "var(--charcoal)" }}>{a.name}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{a.email}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{a.phone ?? "—"}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title="Register Agent" onClose={() => setShowForm(false)}>
          <FormField label="Full Name">
            <input className={inputCls} value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} placeholder="Full name" />
          </FormField>
          <FormField label="Email Address">
            <input className={inputCls} type="email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} placeholder="agent@example.com" />
          </FormField>
          <FormField label="Phone (optional)">
            <input className={inputCls} value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} placeholder="+234..." />
          </FormField>
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mb-4">
            <p className="text-xs text-blue-700">
              Agents log in at <strong>/portal</strong> using their registered email and password <strong>hamzury2026</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createAgent.mutate(newAgent)}
              disabled={!newAgent.name || !newAgent.email || createAgent.isPending}
              className="flex-1 py-2 text-xs font-semibold text-white rounded-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--brand)" }}
            >
              {createAgent.isPending ? "Registering..." : "Register Agent"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────
function TasksTab() {
  const { data: tasks, isLoading } = trpc.admin.allTasks.useQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--charcoal)" }}>All Tasks</h2>
        <span className="text-xs text-muted-foreground">{tasks?.length ?? 0} tasks</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-50 rounded-sm" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Task ID", "Client", "Description", "Assigned To", "Deadline", "Status"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(!tasks || tasks.length === 0) ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No tasks yet. Tasks sync from Google Sheets or are created by staff.</td></tr>
              ) : tasks.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{t.taskId}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">{t.clientRef ?? "—"}</td>
                  <td className="py-3 px-3 text-xs max-w-[200px] truncate" style={{ color: "var(--charcoal)" }}>{t.description ?? "—"}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">{t.assignedTo ?? "—"}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">
                    {t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-3"><Badge label={t.status} color={statusColor(t.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "clients", label: "Clients", icon: Briefcase },
  { id: "staff", label: "Staff", icon: Users },
  { id: "agents", label: "Agents", icon: UserCheck },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
];

export default function AdminPanel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/portal") });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--milk)" }}>
        <div className="w-5 h-5 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--milk)" }}>
        <div className="text-center max-w-sm px-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <h1 className="text-lg font-light mb-2" style={{ color: "var(--charcoal)" }}>Access Restricted</h1>
          <p className="text-sm text-muted-foreground mb-6">This panel is for administrators only.</p>
          <Link href="/portal" className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>
            Return to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--milk)" }}>
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://cdn.manus.im/uploads/hamzury-logo.jpeg" alt="HAMZURY" className="h-7 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4 px-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-xs font-medium mb-0.5 transition-colors text-left ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
              }`}
              style={activeTab === tab.id ? { background: "var(--brand)" } : {}}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium truncate" style={{ color: "var(--charcoal)" }}>{user.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email ?? ""}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-sm hover:bg-gray-50 transition-colors"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-light" style={{ color: "var(--charcoal)" }}>
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === "overview" && "Platform health at a glance."}
              {activeTab === "clients" && "Manage client records and access URLs."}
              {activeTab === "staff" && "Register and manage team members."}
              {activeTab === "agents" && "Register referral partners."}
              {activeTab === "tasks" && "View all tasks across the platform."}
            </p>
          </div>

          {/* Tab content */}
          {activeTab === "overview" && (
            <>
              <OverviewStats />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-border rounded-sm p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Add a new client", tab: "clients", icon: Briefcase },
                      { label: "Register a staff member", tab: "staff", icon: Users },
                      { label: "Register an agent", tab: "agents", icon: UserCheck },
                      { label: "View all tasks", tab: "tasks", icon: CheckCircle2 },
                    ].map((a) => (
                      <button
                        key={a.tab}
                        onClick={() => setActiveTab(a.tab)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-sm border border-border hover:border-[var(--brand)] transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <a.icon size={13} className="text-muted-foreground group-hover:text-[var(--brand)] transition-colors" />
                          <span className="text-xs text-foreground">{a.label}</span>
                        </div>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-border rounded-sm p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Platform Links</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Staff Dashboard", href: "/staff/dashboard" },
                      { label: "Portal Login", href: "/portal" },
                      { label: "Public Homepage", href: "/" },
                      { label: "RIDI Page", href: "/ridi" },
                    ].map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center justify-between px-3 py-2.5 rounded-sm border border-border hover:border-[var(--brand)] transition-colors group"
                      >
                        <span className="text-xs text-foreground">{l.label}</span>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "clients" && <ClientsTab />}
          {activeTab === "staff" && <StaffTab />}
          {activeTab === "agents" && <AgentsTab />}
          {activeTab === "tasks" && <TasksTab />}
        </div>
      </main>
    </div>
  );
}
