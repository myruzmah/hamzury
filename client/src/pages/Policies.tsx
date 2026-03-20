import { useState } from "react";
import { Link } from "wouter";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const BRAND = "#1B4D3E";

const policies = [
  {
    id: "privacy",
    title: "Privacy Policy",
    effective: "1 January 2025",
    sections: [
      {
        heading: "What we collect",
        body: "When you submit a brief, application, or enquiry through this website, we collect the information you provide — including your name, email address, phone number, and the details of your request. We do not collect data passively beyond standard server logs.",
      },
      {
        heading: "How we use it",
        body: "We use the information you provide solely to respond to your enquiry, manage your project, and communicate with you about your engagement with HAMZURY. We do not sell, share, or transfer your personal information to third parties for marketing purposes.",
      },
      {
        heading: "How long we keep it",
        body: "We retain client and enquiry records for a period of five years from the date of last contact. After this period, records are securely deleted unless there is a legal or contractual obligation to retain them.",
      },
      {
        heading: "Your rights",
        body: "You have the right to request access to the information we hold about you, to request correction of inaccurate information, and to request deletion of your records where there is no overriding legal basis for retention. To exercise any of these rights, contact us directly.",
      },
      {
        heading: "Security",
        body: "We take reasonable technical and organisational measures to protect the information we hold. Our systems are access-controlled, and client data is handled only by authorised staff.",
      },
      {
        heading: "Contact",
        body: "For any privacy-related enquiries, contact HAMZURY directly through the channels listed on this website.",
      },
    ],
  },
  {
    id: "terms",
    title: "Terms of Engagement",
    effective: "1 January 2025",
    sections: [
      {
        heading: "Scope of engagement",
        body: "These terms govern the relationship between HAMZURY and any individual or organisation that engages our services. By submitting a brief, signing a proposal, or making a payment, you agree to these terms.",
      },
      {
        heading: "Proposals and agreements",
        body: "All engagements are governed by a written proposal or service agreement issued by HAMZURY. The scope, deliverables, timeline, and fees are defined in that document. Verbal agreements are not binding.",
      },
      {
        heading: "Payment",
        body: "Payment terms are specified in each proposal. Standard terms require a deposit before work begins, with the balance due on delivery or at agreed milestones. HAMZURY reserves the right to pause or suspend work if payment obligations are not met.",
      },
      {
        heading: "Client responsibilities",
        body: "Clients are responsible for providing accurate information, timely feedback, and access to materials required to complete the engagement. Delays caused by the client may affect agreed timelines without penalty to HAMZURY.",
      },
      {
        heading: "Intellectual property",
        body: "Upon full payment, clients receive full ownership of deliverables produced specifically for them. HAMZURY retains the right to reference completed work in its portfolio unless otherwise agreed in writing.",
      },
      {
        heading: "Confidentiality",
        body: "HAMZURY treats all client information as confidential. We do not disclose client details, project specifics, or business information to third parties without explicit consent, except where required by law.",
      },
      {
        heading: "Limitation of liability",
        body: "HAMZURY's liability in connection with any engagement is limited to the total fees paid for that engagement. We are not liable for indirect, consequential, or speculative losses.",
      },
      {
        heading: "Governing law",
        body: "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through negotiation in the first instance, and through appropriate legal channels if negotiation fails.",
      },
    ],
  },
  {
    id: "refund",
    title: "Refund Policy",
    effective: "1 January 2025",
    sections: [
      {
        heading: "General principle",
        body: "HAMZURY delivers structured, professional services. Our refund policy reflects the nature of knowledge work — once time, expertise, and resources have been committed to a project, they cannot be fully recovered.",
      },
      {
        heading: "Deposits",
        body: "Deposits paid to initiate an engagement are non-refundable. They cover the cost of discovery, planning, and resource allocation that begins immediately upon engagement confirmation.",
      },
      {
        heading: "Milestone payments",
        body: "Payments made at or after project milestones are non-refundable, as they correspond to work already completed and delivered.",
      },
      {
        heading: "Cancellation before work begins",
        body: "If a client cancels an engagement before any substantive work has begun — and before a deposit has been processed — no charge will apply. Cancellations must be communicated in writing.",
      },
      {
        heading: "Disputes",
        body: "If you believe a deliverable does not meet the agreed specification, raise the concern in writing within 7 days of delivery. HAMZURY will review the concern and, where valid, commit to remediation at no additional cost. Refunds are not issued for subjective dissatisfaction with work that meets the agreed brief.",
      },
      {
        heading: "Exceptions",
        body: "In exceptional circumstances — including HAMZURY's failure to deliver due to our own default — a partial or full refund may be considered at the discretion of HAMZURY leadership. Such decisions are made case by case.",
      },
    ],
  },
];

export default function Policies() {
  const [active, setActive] = useState("privacy");
  const current = policies.find(p => p.id === active)!;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: BRAND }}>HAMZURY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="nav-link">Our Services</Link>
            <Link href="/ridi" className="nav-link">RIDI</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/portal" className="nav-link" style={{ border: "1.5px solid #1B4D3E", borderRadius: "4px", padding: "4px 12px", color: "#1B4D3E", fontWeight: 600 }}>Portal</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-border">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back to Home
          </Link>
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: BRAND }}>Legal</p>
          <h1 className="text-4xl font-light mb-4" style={{ color: "#1a1a1a" }}>Policies</h1>
          <p className="text-sm text-muted-foreground max-w-lg">HAMZURY operates with institutional standards. Our policies are written to be clear, not to obscure.</p>
        </div>
      </section>

      {/* Policy Tabs + Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-12">

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-1 sticky top-24">
                {policies.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
                    style={{
                      background: active === p.id ? BRAND + "0c" : "transparent",
                      color: active === p.id ? BRAND : "#6b7280",
                      fontWeight: active === p.id ? 500 : 400,
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-light mb-2" style={{ color: "#1a1a1a" }}>{current.title}</h2>
                <p className="text-xs text-muted-foreground">Effective: {current.effective}</p>
              </div>
              <div className="space-y-8">
                {current.sections.map((s, i) => (
                  <div key={i} className="pb-8 border-b border-border last:border-0 last:pb-0">
                    <h3 className="text-sm font-medium mb-3" style={{ color: "#1a1a1a" }}>{s.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-7 w-7 object-contain rounded-sm" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: BRAND }}>HAMZURY</span>
            </Link>
            <p className="text-xs text-muted-foreground">Structure. Clarity. Calm authority.</p>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link href="/team" className="hover:text-foreground transition-colors">Team</Link>
            <Link href="/track" className="hover:text-foreground transition-colors">Track Project</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
