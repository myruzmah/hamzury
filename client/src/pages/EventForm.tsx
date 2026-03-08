import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

// This page is configurable — share the URL with the specific audience for each event or content piece.
// The event title and description can be passed as URL query params: /event?title=...&desc=...

function useEventConfig() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  return {
    title: params.get("title") || "HAMZURY Event Registration",
    description: params.get("desc") || "Complete the form below to register your interest. Our team will confirm your place and share all details before the event.",
    type: params.get("type") || "event", // "event" | "ticket" | "content" | "programme"
  };
}

export default function EventForm() {
  const config = useEventConfig();
  const [form, setForm] = useState({ name: "", email: "", phone: "", organisation: "", role: "", expectation: "", dietary: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => { setRef(data.referenceCode); setSubmitted(true); },
  });

  const canSubmit = !!(form.name && form.email && form.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: "Innovation",
      serviceType: config.title,
      description: `Organisation: ${form.organisation}\nRole: ${form.role}\nExpectation: ${form.expectation}\nDietary/Access needs: ${form.dietary}`,
    });
  };

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="text-center max-w-sm">
        <CheckCircle2 size={40} className="mx-auto mb-5" style={{ color: "var(--brand)" }} />
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--brand)" }}>Registration confirmed</h2>
        <p className="text-sm text-muted-foreground mb-2">Your reference number: <strong>{ref}</strong></p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">We have received your registration. Our team will be in touch with confirmation and event details.</p>
        <Link href="/" className="text-xs underline" style={{ color: "var(--brand)" }}>Return to HAMZURY</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: "#FAFAF8" }}>
      {/* Minimal header */}
      <header className="border-b border-border bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
        </div>
      </header>

      <main className="container max-w-lg py-16">
        {/* Event header */}
        <div className="mb-12">
          <span className="block w-8 h-px mb-8" style={{ background: "var(--brand)" }} />
          <h1 className="text-2xl font-light mb-4" style={{ color: "var(--brand)", letterSpacing: "-0.02em" }}>{config.title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-md">{config.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Full name <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email address <span className="text-red-400">*</span></label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">WhatsApp number <span className="text-red-400">*</span></label>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Organisation / Business name</label>
              <input
                type="text"
                placeholder="Where do you work or what do you run?"
                value={form.organisation}
                onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Your role or title</label>
              <input
                type="text"
                placeholder="e.g. Founder, Student, Manager"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">What do you hope to gain from this?</label>
              <textarea
                placeholder="Tell us what you are looking to learn, experience, or achieve"
                value={form.expectation}
                onChange={(e) => setForm((f) => ({ ...f, expectation: e.target.value }))}
                rows={3}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Any dietary or accessibility requirements?</label>
              <input
                type="text"
                placeholder="Leave blank if none"
                value={form.dietary}
                onChange={(e) => setForm((f) => ({ ...f, dietary: e.target.value }))}
                className="w-full border border-border rounded-sm px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!canSubmit || submitMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ background: "var(--brand)" }}
            >
              {submitMutation.isPending ? "Submitting…" : "Complete Registration"} <ArrowRight size={13} />
            </button>
            <p className="text-xs text-muted-foreground mt-3">No account required. We will confirm your place via WhatsApp or email.</p>
          </div>
        </form>
      </main>

      <footer className="border-t border-border py-8 mt-8" style={{ background: "white" }}>
        <div className="container">
          <p className="text-xs text-center" style={{ color: "var(--muted-text)" }}>© {new Date().getFullYear()} HAMZURY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
