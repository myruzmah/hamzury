import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { generateInvoicePDF, generateDossierPDF } from "@/lib/generatePDF";

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}
function statusColor(s: string) {
  const m: Record<string, string> = {
    Draft: "bg-stone-100 text-stone-500",
    Sent: "bg-blue-100 text-blue-700",
    Paid: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-600",
    Cancelled: "bg-stone-100 text-stone-400",
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-600",
  };
  return m[s] ?? "bg-stone-100 text-stone-600";
}

// ─── Create Invoice Modal ─────────────────────────────────────────────────────
function InvoiceModal({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ clientName: "", clientEmail: "", description: "", amountNaira: "", notes: "" });
  const mut = trpc.finance.createInvoice.useMutation({
    onSuccess: (d) => {
      toast.success(`Ref: ${d.invoiceRef}`);
      utils.finance.getAllInvoices.invalidate();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Create Invoice</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-light">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate({ ...form, amountNaira: Number(form.amountNaira) }); }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Client Name</label>
            <input required className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Client Email</label>
            <input type="email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Description</label>
            <textarea required rows={2} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Amount (₦)</label>
            <input required type="number" min="1" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.amountNaira} onChange={e => setForm(f => ({ ...f, amountNaira: e.target.value }))} />
            {form.amountNaira && (
              <p className="text-xs text-emerald-600 mt-1">RIDI allocation (10%): {naira(Math.floor(Number(form.amountNaira) * 0.1))}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">Notes</label>
            <input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mut.isPending}
              className="flex-1 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {mut.isPending ? "Creating…" : "Create Invoice"}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reject Expense Modal ─────────────────────────────────────────────────────
function RejectModal({ expenseRef, onClose }: { expenseRef: string; onClose: () => void }) {
  const utils = trpc.useUtils();
  const [reason, setReason] = useState("");
  const mut = trpc.finance.rejectExpense.useMutation({
    onSuccess: () => { utils.finance.getAllExpenses.invalidate(); onClose(); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-900">Reject Expense</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-light">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <textarea required rows={3} placeholder="Reason for rejection…"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            value={reason} onChange={e => setReason(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => reason && mut.mutate({ expenseRef, reason })} disabled={!reason || mut.isPending}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
              {mut.isPending ? "Rejecting…" : "Reject"}
            </button>
            <button onClick={onClose}
              className="px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Finance Dashboard ───────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [tab, setTab] = useState<"invoices" | "expenses" | "ridi" | "commissions">("invoices");
  const [showInvoice, setShowInvoice] = useState(false);
  const [rejectRef, setRejectRef] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const invoicesQ = trpc.finance.getAllInvoices.useQuery();
  const expensesQ = trpc.finance.getAllExpenses.useQuery({ approvalLevel: undefined });

  const updateInvoiceMut = trpc.finance.updateStatus.useMutation({
    onSuccess: () => utils.finance.getAllInvoices.invalidate(),
  });
  const approveExpenseMut = trpc.finance.approveExpense.useMutation({
    onSuccess: () => utils.finance.getAllExpenses.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const invoices = invoicesQ.data ?? [];
  const expenses = expensesQ.data ?? [];

  // Finance summary
  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amountNaira, 0);
  const totalRidi = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.ridiAllocation, 0);
  const outstanding = invoices.filter(i => i.status === "Sent" || i.status === "Overdue").reduce((s, i) => s + i.amountNaira, 0);
  const pendingExpenses = expenses.filter(e => e.status === "Pending");
  const leadExpenses = pendingExpenses.filter(e => e.approvalLevel === "lead");

  const tabs = [
    { id: "invoices", label: "Invoices" },
    { id: "expenses", label: `Expense Approvals${leadExpenses.length > 0 ? ` (${leadExpenses.length})` : ""}` },
    { id: "ridi", label: "RIDI Allocation" },
    { id: "commissions", label: "Commissions" },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#1B4D3E]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-[#1B4D3E] leading-tight">Finance &amp; Ledger</div>
            <p className="text-xs text-stone-400 mt-0.5">Muhammad Ismail Adam · Finance Lead</p>
          </div>
        </div>
        <button onClick={() => setShowInvoice(true)}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
          + New Invoice
        </button>
      </div>

      {/* KPI Strip */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (Paid)", value: naira(totalRevenue), highlight: true },
          { label: "Outstanding", value: naira(outstanding) },
          { label: "RIDI Allocation (10%)", value: naira(totalRidi), highlight: true },
          { label: "Pending Expenses", value: pendingExpenses.length },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border px-4 py-3 ${k.highlight ? "bg-emerald-50 border-emerald-100" : "bg-white border-stone-100"}`}>
            <div className={`text-xl font-bold ${k.highlight ? "text-emerald-700" : "text-stone-900"}`}>{k.value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b border-stone-100">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Invoices Tab */}
        {tab === "invoices" && (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{inv.invoiceRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(inv.status)}`}>{inv.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{inv.clientName}</p>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{inv.description}</p>
                    <p className="text-xs text-stone-400">Created {fmt(inv.createdAt)}{inv.paidAt ? ` · Paid ${fmt(inv.paidAt)}` : ""}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button
                        onClick={() => generateInvoicePDF({ invoiceRef: inv.invoiceRef, clientName: inv.clientName, description: inv.description, amountNaira: inv.amountNaira, status: inv.status, issuedAt: inv.createdAt, paidAt: inv.paidAt })}
                        className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                        ↓ Invoice PDF
                      </button>
                      <button
                        onClick={() => generateDossierPDF({ clientName: inv.clientName, projectRef: inv.invoiceRef, service: inv.description, department: "HAMZURY", deliverables: [{ title: inv.description, description: "As agreed in the project brief." }], completedDate: inv.paidAt ?? inv.createdAt, leadName: "Department Lead", founderNote: "Thank you for choosing HAMZURY. We are committed to building institutions that last." })}
                        className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                        📄 Delivery Dossier
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-stone-900">{naira(inv.amountNaira)}</p>
                    <p className="text-xs text-emerald-600">RIDI: {naira(inv.ridiAllocation)}</p>
                    <select
                      value={inv.status}
                      onChange={e => updateInvoiceMut.mutate({ invoiceRef: inv.invoiceRef, status: e.target.value as any })}
                      className="mt-1 text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900">
                      {["Draft","Sent","Paid","Overdue","Cancelled"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🧾</div>
                <p className="text-sm">No invoices yet. Create one using the button above.</p>
              </div>
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {tab === "expenses" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <strong>Approval authority:</strong> You (Finance Lead) approve expenses up to ₦50,000. CEO approves ₦50k–₦200k. Founder approves above ₦200k.
            </div>
            {expenses.map(e => (
              <div key={e.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-stone-400">{e.expenseRef}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}>{e.status}</span>
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{e.approvalLevel} level</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{e.description}</p>
                    <p className="text-xs text-stone-400">{e.submittedByName} · {e.department} · {e.category} · {fmt(e.createdAt)}</p>
                    {e.rejectionReason && <p className="text-xs text-red-500 mt-1">Rejected: {e.rejectionReason}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-stone-900">{naira(e.amountNaira)}</p>
                    {e.status === "Pending" && e.approvalLevel === "lead" && (
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => approveExpenseMut.mutate({ expenseRef: e.expenseRef })}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => setRejectRef(e.expenseRef)}
                          className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">💸</div>
                <p className="text-sm">No expenses submitted yet.</p>
              </div>
            )}
          </div>
        )}

        {/* RIDI Allocation Tab */}
        {tab === "ridi" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-emerald-800 mb-1">RIDI Fund Summary</p>
              <p className="text-3xl font-bold text-emerald-700">{naira(totalRidi)}</p>
              <p className="text-xs text-emerald-600 mt-1">10% of all confirmed revenue · {invoices.filter(i => i.status === "Paid").length} paid invoices</p>
            </div>
            <div className="space-y-2">
              {invoices.filter(i => i.status === "Paid").map(inv => (
                <div key={inv.id} className="bg-white rounded-xl border border-stone-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{inv.clientName}</p>
                    <p className="text-xs text-stone-400">{inv.invoiceRef} · Paid {fmt(inv.paidAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-400">Invoice: {naira(inv.amountNaira)}</p>
                    <p className="text-sm font-bold text-emerald-700">RIDI: {naira(inv.ridiAllocation)}</p>
                  </div>
                </div>
              ))}
            </div>
            {invoices.filter(i => i.status === "Paid").length === 0 && (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-sm">No paid invoices yet. RIDI allocation will appear here once payments are confirmed.</p>
              </div>
            )}
          </div>
        )}

        {/* Commissions Tab */}
        {tab === "commissions" && (
          <div className="text-center py-16 text-stone-400">
            <div className="text-4xl mb-3">🤝</div>
            <p className="text-sm font-medium text-stone-600">Agent Commission Tracker</p>
            <p className="text-xs mt-1">Commission records will appear here once agent referrals are confirmed and invoices are paid.</p>
          </div>
        )}
      </div>

      {showInvoice && <InvoiceModal onClose={() => setShowInvoice(false)} />}
      {rejectRef && <RejectModal expenseRef={rejectRef} onClose={() => setRejectRef(null)} />}
    </div>
  );
}
