import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";

interface Section { heading: string; body: string; }

function LegalPage({ title, lastUpdated, sections }: { title: string; lastUpdated: string; sections: Section[] }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-9 w-9 object-contain rounded-sm" />
            <span className="font-semibold text-xs tracking-[0.18em] uppercase hidden sm:block" style={{ color: "var(--brand)" }}>HAMZURY</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </header>
      <main className="pt-16 pb-20">
        <div className="container max-w-2xl py-16">
          <p className="text-xs text-muted-foreground mb-3">Last updated: {lastUpdated}</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-10">{title}</h1>
          <div className="space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-sm font-semibold text-foreground mb-2">{s.heading}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Questions? Email <a href="mailto:legal@hamzury.com" className="underline underline-offset-2" style={{ color: "var(--brand)" }}>legal@hamzury.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="March 2026"
      sections={[
        { heading: "1. Who we are", body: "HAMZURY is a multi-unit institution registered in Nigeria. We operate hamzuryos.biz and related subdomains. This policy explains how we collect, use, and protect your personal data." },
        { heading: "2. What we collect", body: "We collect information you provide directly — your name, email address, phone number, and business details when you submit an inquiry, create an account, or contact us.\n\nWe also collect usage data automatically — pages visited, time on site, device type, and browser — through standard web analytics." },
        { heading: "3. How we use your data", body: "We use your data to:\n- Respond to your enquiries and deliver services\n- Send project updates and operational communications\n- Improve our platform and services\n- Comply with legal obligations\n\nWe do not sell your data to third parties." },
        { heading: "4. Data storage", body: "Your data is stored on secure servers. We retain client records for 7 years as required by Nigerian financial regulations. You may request deletion of non-financial data at any time." },
        { heading: "5. Your rights", body: "You have the right to access, correct, or delete your personal data. To exercise these rights, email legal@hamzury.com. We will respond within 10 working days." },
        { heading: "6. Cookies", body: "We use session cookies for authentication and analytics cookies to understand how our platform is used. You can disable analytics cookies in your browser settings." },
        { heading: "7. Changes to this policy", body: "We may update this policy periodically. Material changes will be communicated via email to registered users." },
      ]}
    />
  );
}

// ─── Terms of Service ─────────────────────────────────────────────────────────
export function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="March 2026"
      sections={[
        { heading: "1. Acceptance", body: "By using HAMZURY's platform or engaging our services, you agree to these terms. If you do not agree, do not use our services." },
        { heading: "2. Services", body: "HAMZURY provides business registration, compliance, brand, content, digital systems, and training services. Specific deliverables, timelines, and pricing are agreed in writing before each engagement." },
        { heading: "3. Payment", body: "Payment terms are stated in your engagement agreement. HAMZURY requires a deposit before commencing work. Final payment is due before delivery of final files or outputs." },
        { heading: "4. Intellectual property", body: "Upon full payment, clients own all deliverables created specifically for them. HAMZURY retains the right to display work in its portfolio unless otherwise agreed in writing." },
        { heading: "5. Quality gate", body: "All deliverables pass an internal quality review before delivery. Clients have one round of revisions included in the standard engagement. Additional revisions are billed separately." },
        { heading: "6. Limitation of liability", body: "HAMZURY's liability is limited to the value of the engagement in which the issue arose. We are not liable for indirect, consequential, or incidental damages." },
        { heading: "7. Governing law", body: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be resolved in the courts of Plateau State." },
      ]}
    />
  );
}

// ─── Refund Policy ────────────────────────────────────────────────────────────
export function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="March 2026"
      sections={[
        { heading: "1. Deposits", body: "Deposits are non-refundable once work has commenced. If HAMZURY has not yet started work, a full deposit refund will be issued within 5 working days of a written cancellation request." },
        { heading: "2. Mid-project cancellations", body: "If a client cancels after work has commenced, HAMZURY will invoice for work completed to date at the agreed rate. Any amount paid above that will be refunded." },
        { heading: "3. Dissatisfaction", body: "If you are not satisfied with a deliverable, raise the issue within 5 working days of delivery. HAMZURY will review the concern and offer a revision or, in exceptional cases, a partial refund." },
        { heading: "4. Government filing fees", body: "Fees paid to government agencies (CAC, FIRS, PENCOM, etc.) on your behalf are non-refundable regardless of outcome. HAMZURY is not responsible for government delays or rejections." },
        { heading: "5. Training programmes", body: "Enrolment fees are non-refundable after the programme start date. Transfers to a future cohort are permitted with 48 hours notice." },
        { heading: "6. How to request a refund", body: "Email accounts@hamzury.com with your reference number and reason. We will respond within 3 working days." },
      ]}
    />
  );
}

// ─── Cookie Policy ────────────────────────────────────────────────────────────
export function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="March 2026"
      sections={[
        { heading: "What are cookies?", body: "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it." },
        { heading: "Cookies we use", body: "Session cookies: Required for login and authentication. These are deleted when you close your browser.\n\nAnalytics cookies: Used to understand how visitors use our platform. We use privacy-respecting analytics that do not track you across other sites.\n\nPreference cookies: Store your language and display preferences." },
        { heading: "Managing cookies", body: "You can control cookies through your browser settings. Disabling session cookies will prevent you from logging in. Disabling analytics cookies will not affect your ability to use the platform." },
        { heading: "Third-party cookies", body: "We do not use advertising or social media tracking cookies. Our payment processor (Paystack) may set cookies during payment flows — see Paystack's privacy policy for details." },
      ]}
    />
  );
}

// ─── Affiliate Terms ──────────────────────────────────────────────────────────
export function AffiliateTerms() {
  return (
    <LegalPage
      title="Affiliate Programme Terms"
      lastUpdated="March 2026"
      sections={[
        { heading: "1. Eligibility", body: "The HAMZURY Affiliate Programme is invite-only. Participation requires an approved application. HAMZURY reserves the right to accept or decline applications without explanation." },
        { heading: "2. Commission structure", body: "Affiliates earn 12.5% of the project value at lead stage (when a referred contact makes contact with HAMZURY) and 12.5% at conversion stage (when the referred client makes their first payment).\n\nTotal affiliate commission: 25% of project value, split across two stages." },
        { heading: "3. Tracking", body: "Referrals are tracked via your unique affiliate link. A 30-day cookie attributes the referral to you. If a client uses your link and starts a project within 30 days, you are credited." },
        { heading: "4. Payment", body: "Commissions are paid within 14 days of project delivery and full client payment. Payments are made via bank transfer to your registered account." },
        { heading: "5. Prohibited conduct", body: "You may not:\n- Make false or misleading claims about HAMZURY's services\n- Offer discounts or incentives on HAMZURY's behalf\n- Refer yourself or related parties to earn commissions\n- Use paid advertising to promote your affiliate link without written approval" },
        { heading: "6. Termination", body: "HAMZURY may terminate your affiliate status at any time for violation of these terms. Earned commissions on completed projects will still be paid." },
        { heading: "7. Governing law", body: "These terms are governed by the laws of the Federal Republic of Nigeria." },
      ]}
    />
  );
}
