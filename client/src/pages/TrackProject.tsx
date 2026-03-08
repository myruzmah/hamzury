/**
 * HAMZURY Project Tracker
 * Client enters their reference code and sees their project status.
 * No login required.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useSearch } from "wouter";
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  new: {
    label: "Received",
    color: "#1B4D3E",
    icon: <CheckCircle2 size={20} />,
    description: "Your request has been received and is in our queue. Our team will review it shortly.",
  },
  reviewing: {
    label: "Under Review",
    color: "#e67e22",
    icon: <Clock size={20} />,
    description: "Our team is reviewing your request and will reach out to confirm details before proceeding.",
  },
  in_progress: {
    label: "In Progress",
    color: "#1B4D3E",
    icon: <ArrowRight size={20} />,
    description: "Your project is actively being worked on. We will notify you when it is ready for review.",
  },
  completed: {
    label: "Completed",
    color: "#1B4D3E",
    icon: <CheckCircle2 size={20} />,
    description: "Your project has been completed. Please check your email for the delivery.",
  },
  closed: {
    label: "Closed",
    color: "#7a6e5f",
    icon: <CheckCircle2 size={20} />,
    description: "This project has been closed and archived.",
  },
};

const DEPT_LABELS: Record<string, string> = {
  Studios: "Studios — Creative & Media",
  Bizdoc: "Bizdoc — Business Documentation",
  Systems: "Systems — Technology",
  Innovation: "Innovation Hub",
  Growth: "Growth — Business Development",
  People: "People — HR",
  Ledger: "Ledger — Finance",
  RIDI: "RIDI — Community Impact",
  Robotics: "Robotics",
  CSO: "General Enquiry",
};

export default function TrackProject() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const prefilled = params.get("ref") ?? "";

  const [refInput, setRefInput] = useState(prefilled);
  const [submitted, setSubmitted] = useState(!!prefilled);

  const { data, isLoading, error, refetch } = trpc.intake.checkStatus.useQuery(
    { referenceCode: refInput.trim().toUpperCase() },
    { enabled: submitted && refInput.trim().length > 0 }
  );

  useEffect(() => {
    if (prefilled) setSubmitted(true);
  }, [prefilled]);

  const statusConfig = data ? STATUS_CONFIG[data.status] ?? STATUS_CONFIG.new : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FDF5E6" }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#d4c9b0" }}>
        <Link href="/">
          <span className="font-semibold text-sm tracking-wide" style={{ color: "#1B4D3E" }}>HAMZURY</span>
        </Link>
        <Link href="/start">
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Start a new request</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {!submitted || (!data && !isLoading) ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#1B4D3E" }}>
                Project Tracker
              </p>
              <h1 className="text-2xl font-light mb-2" style={{ color: "#333333" }}>
                Track your project.
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the reference code you received when you submitted your request.
              </p>
              <div className="flex gap-2 mb-4">
                <Input
                  value={refInput}
                  onChange={e => setRefInput(e.target.value.toUpperCase())}
                  placeholder="HMZ-2026-0001"
                  className="font-mono tracking-widest"
                  style={{ background: "white", borderColor: "#d4c9b0" }}
                  onKeyDown={e => { if (e.key === "Enter") setSubmitted(true); }}
                />
                <Button
                  onClick={() => setSubmitted(true)}
                  style={{ background: "#1B4D3E", color: "white" }}
                >
                  Track
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded border text-sm" style={{ borderColor: "#c0392b", background: "#fff5f5", color: "#c0392b" }}>
                  <AlertCircle size={14} />
                  Reference code not found. Please check and try again.
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Don't have a reference code?{" "}
                <Link href="/start">
                  <span className="underline cursor-pointer" style={{ color: "#1B4D3E" }}>Submit a new request</span>
                </Link>
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#1B4D3E" }} />
              <p className="text-sm text-muted-foreground">Looking up your project…</p>
            </div>
          ) : data ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="rounded border overflow-hidden" style={{ borderColor: "#d4c9b0", background: "white" }}>
                {/* Status header */}
                <div className="px-6 py-5" style={{ background: "#1B4D3E" }}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">Reference</p>
                  <p className="text-xl font-light tracking-widest text-white">{data.referenceCode}</p>
                </div>

                {/* Status badge */}
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "#d4c9b0" }}>
                  <div style={{ color: statusConfig?.color }}>{statusConfig?.icon}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: statusConfig?.color }}>{statusConfig?.label}</p>
                    <p className="text-xs text-muted-foreground">{statusConfig?.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="divide-y" style={{ borderColor: "#d4c9b0" }}>
                  {[
                    { label: "Name", value: data.name },
                    { label: "Department", value: DEPT_LABELS[data.department] ?? data.department },
                    { label: "Service", value: data.serviceType },
                    { label: "Submitted", value: new Date(data.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Last Updated", value: new Date(data.updatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex px-6 py-3 gap-4">
                      <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                      <span className="text-sm" style={{ color: "#333333" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSubmitted(false); setRefInput(""); }}
                    style={{ borderColor: "#d4c9b0" }}
                  >
                    Track another
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => refetch()}
                    style={{ background: "#1B4D3E", color: "white" }}
                  >
                    Refresh status
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Questions? Contact us at{" "}
                <a href="mailto:hello@hamzury.com" style={{ color: "#1B4D3E" }}>hello@hamzury.com</a>
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
