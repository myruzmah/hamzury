import { Link, useParams } from "wouter";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    content: "HAMZURY collects information you provide directly to us, including name, email address, phone number, and business details when you submit a contact form, request a diagnosis, or engage our services. We also collect usage data to improve our platform.",
  },
  {
    title: "How We Use Your Information",
    content: "We use your information to deliver services, communicate about your project, send relevant updates, and improve our platform. We do not sell or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "Data Security",
    content: "HAMZURY implements appropriate technical and organisational measures to protect your personal information. All data is stored securely and access is restricted to authorised personnel only.",
  },
  {
    title: "Client Portal Data",
    content: "Information accessed through the HAMZURY client portal is specific to your engagement and is not shared with other clients. Project data, deliverables, and communications are kept confidential.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies to maintain your session and ensure the platform functions correctly. We do not use tracking or advertising cookies.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at privacy@hamzury.com.",
  },
  {
    title: "Contact",
    content: "For privacy-related enquiries, contact our Data Protection Officer at privacy@hamzury.com or write to HAMZURY, Jos, Plateau State, Nigeria.",
  },
];

const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using HAMZURY's website, portals, or services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
  },
  {
    title: "Services",
    content: "HAMZURY provides business development, digital infrastructure, brand identity, compliance documentation, and training services. Specific terms for each engagement are set out in the Engagement Pack provided to each client.",
  },
  {
    title: "Client Obligations",
    content: "Clients are responsible for providing accurate information, timely feedback, and necessary access to complete the agreed scope of work. Delays caused by the client may affect delivery timelines.",
  },
  {
    title: "Intellectual Property",
    content: "All deliverables produced by HAMZURY become the property of the client upon full payment. HAMZURY retains the right to reference completed work in its portfolio unless otherwise agreed in writing.",
  },
  {
    title: "Payment Terms",
    content: "Payment terms are specified in each client's Engagement Pack. HAMZURY reserves the right to pause work on engagements where payment is overdue by more than 14 days.",
  },
  {
    title: "Confidentiality",
    content: "HAMZURY treats all client information as confidential. Staff and contractors are bound by confidentiality obligations. Clients should not share portal access credentials with unauthorised parties.",
  },
  {
    title: "Limitation of Liability",
    content: "HAMZURY's liability is limited to the value of the specific engagement in question. We are not liable for indirect, consequential, or incidental damages arising from the use of our services.",
  },
  {
    title: "Governing Law",
    content: "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through negotiation, and if necessary, through the courts of Nigeria.",
  },
];

export default function Legal() {
  const params = useParams<{ type: string }>();
  const type = params.type || "privacy";
  const isPrivacy = type === "privacy";

  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const updated = "March 2026";

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Home</Link>
        </div>
      </header>

      <section className="pt-32 pb-12 md:pt-40 md:pb-16" style={{ background: "var(--milk)" }}>
        <div className="container max-w-2xl">
          <span className="brand-rule" />
          <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>{title}</h1>
          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "white" }}>
        <div className="container max-w-2xl">
          <div className="flex gap-4 mb-12">
            <Link href="/legal/privacy" className={`text-xs font-semibold px-4 py-2 rounded-sm border transition-colors ${isPrivacy ? "border-transparent" : "border-border"}`} style={isPrivacy ? { background: "var(--brand)", color: "white" } : { color: "var(--charcoal)" }}>
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className={`text-xs font-semibold px-4 py-2 rounded-sm border transition-colors ${!isPrivacy ? "border-transparent" : "border-border"}`} style={!isPrivacy ? { background: "var(--brand)", color: "white" } : { color: "var(--charcoal)" }}>
              Terms of Service
            </Link>
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-base font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
                  {i + 1}. {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:info@hamzury.com" className="font-medium" style={{ color: "var(--brand)" }}>info@hamzury.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
