import { useParams } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Circle, FileText, ExternalLink, MessageSquare, Receipt } from "lucide-react";
import { trpc } from "@/lib/trpc";

type ProjectStatus = "Inquiry" | "Proposal" | "Active" | "Delivery" | "Closed";

const STAGES: { key: ProjectStatus; label: string; description: string }[] = [
  { key: "Inquiry", label: "Inquiry", description: "Initial consultation and scope discussion" },
  { key: "Proposal", label: "Proposal", description: "Detailed proposal and agreement" },
  { key: "Active", label: "Active", description: "Work in progress across departments" },
  { key: "Delivery", label: "Delivery", description: "Final deliverables and handover" },
  { key: "Closed", label: "Closed", description: "Project complete and archived" },
];

const INVOICE_LABELS: Record<string, string> = {
  "Not Sent": "Invoice not yet issued",
  "Sent": "Invoice issued — awaiting payment",
  "Paid": "Payment received",
  "Overdue": "Payment overdue",
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ClientView() {
  const params = useParams<{ id: string }>();
  const clientRef = params.id ?? "";

  const { data, isLoading, error } = trpc.client.projectView.useQuery({ clientRef });

  if (isLoading) return <ClientViewSkeleton />;
  if (error || !data) return <ClientViewError message={error?.message ?? "Project not found."} />;

  const { client, tasks, deliverables, communications } = data;
  const stageIndex = STAGES.findIndex((s) => s.key === client.status);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--brand)" }}
            >
              R
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              Raven &amp; Finch
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{client.clientRef}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24" style={{ background: "oklch(99% 0.003 160)" }}>
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-muted-foreground">
            Project Dashboard
          </p>
          <span className="brand-rule" />
          <h1 className="text-2xl md:text-4xl font-semibold mb-3" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
            {client.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            A personal update on your project with Raven &amp; Finch.
          </p>
        </div>
      </section>

      <div className="container max-w-3xl py-12 space-y-12">
        {/* Project Overview */}
        <section>
          <SectionLabel>Project Overview</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {[
              { label: "Service Package", value: client.servicePackage ?? "—" },
              { label: "Start Date", value: formatDate(client.startDate) },
              { label: "Deadline", value: formatDate(client.deadline) },
              { label: "Current Status", value: client.status },
            ].map((item) => (
              <div key={item.label} className="bg-white p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Timeline */}
        <section>
          <SectionLabel>Progress</SectionLabel>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
            <div className="space-y-0">
              {STAGES.map((stage, i) => {
                const done = i < stageIndex;
                const current = i === stageIndex;
                return (
                  <div key={stage.key} className="flex items-start gap-5 py-4 relative">
                    <div className="relative z-10 flex-shrink-0">
                      {done ? (
                        <CheckCircle2 size={20} style={{ color: "var(--brand)" }} className="bg-white" />
                      ) : current ? (
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: "var(--brand)", background: "white" }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ background: "var(--brand)" }} />
                        </div>
                      ) : (
                        <Circle size={20} className="text-muted-foreground/30 bg-white" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className="text-sm font-medium"
                        style={{ color: done || current ? "var(--charcoal)" : "var(--muted-text)" }}
                      >
                        {stage.label}
                        {current && (
                          <span
                            className="ml-2 text-xs px-1.5 py-0.5 rounded-sm font-semibold"
                            style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
                          >
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section>
          <SectionLabel>Deliverables</SectionLabel>
          {deliverables.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">No deliverables yet. We will update this section as work is completed.</p>
          ) : (
            <div className="space-y-3">
              {deliverables.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-5 rounded-sm border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: "var(--brand-muted)" }}>
                      <FileText size={16} style={{ color: "var(--brand)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>{d.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(d.uploadedAt)}</p>
                    </div>
                  </div>
                  {d.driveUrl && (
                    <a
                      href={d.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      Download <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Communications */}
        <section>
          <SectionLabel>Communications</SectionLabel>
          {communications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">No updates yet.</p>
          ) : (
            <div className="space-y-4">
              {communications.map((c) => (
                <div key={c.id} className="p-5 rounded-sm border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "var(--brand)" }}>
                      {(c.author ?? "R")[0]}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--charcoal)" }}>{c.author ?? "Raven & Finch"}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Invoice Status */}
        <section>
          <SectionLabel>Invoice Status</SectionLabel>
          <div className="p-6 rounded-sm border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: "var(--brand-muted)" }}>
              <Receipt size={18} style={{ color: "var(--brand)" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>
                {INVOICE_LABELS[client.invoiceStatus] ?? client.invoiceStatus}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                For billing enquiries, contact{" "}
                <a href="mailto:finance@ravenandfinch.com" className="underline" style={{ color: "var(--brand)" }}>
                  finance@ravenandfinch.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container max-w-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© Raven &amp; Finch 2026. Confidential project dashboard.</p>
          <a href="mailto:info@ravenandfinch.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            info@ravenandfinch.com
          </a>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <span className="brand-rule" />
      <h2 className="text-base font-semibold" style={{ color: "var(--charcoal)" }}>{children}</h2>
    </div>
  );
}

function ClientViewSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-16 border-b border-border" />
      <div className="py-24" style={{ background: "oklch(99% 0.003 160)" }}>
        <div className="container max-w-3xl space-y-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-64 bg-muted rounded" />
        </div>
      </div>
      <div className="container max-w-3xl py-12 space-y-8">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted rounded" />)}
      </div>
    </div>
  );
}

function ClientViewError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center max-w-sm">
        <span className="brand-rule mx-auto" />
        <h1 className="text-xl font-semibold mb-3" style={{ color: "var(--charcoal)" }}>Project not found</h1>
        <p className="text-sm text-muted-foreground mb-8">{message}</p>
        <Link href="/portal" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
          Return to portal
        </Link>
      </div>
    </div>
  );
}
