import { Link, useParams } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const HAMZURY_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/UGIofUkgHcsfIMTK.jpeg?Expires=1804459560&Signature=sJWFbdQfR0PJyz8Q34s7l5Gh460aa5HNntGM1jyEMDWRKgZcovB5uHJDf1wjbDMfaB9icn797Hgg23PB4SFu4YIDtMs~vMFisP4uswkStBEow1~0qVmoFC7jAwlUk-h-DtvZjj6kRhVdq~YQM3uziYatUpOOub7jU2gz5CHObDxikiF7rXgYbIphCC9wcYL4w2mzxBlUCzgzVgYZ4lF9m~BmqQAuE5m1UKfxspWuoNDl2HrRLhW6WnLvC7IR1mKcYKFVo~WXQrnhVLnCe6rVkGK8ckluILIBCC0MD2T0Ii1YwksrSxNxy1HFza8ausArBaOYF5OZA0TbAHdetulPdg__&Key-Pair-Id=K2HSFNDJXOU9YS";
const BIZDOC_LOGO = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663394820206/RGNlzQAENKbNJjzR.png?Expires=1804459560&Signature=g8xsLM8ak2thrC6JINhITjHEIzknpjOA5prRqTkcSF1rC~7pSR4r3PhbQF~qz5CJj5TqLh96kJ5mMMXnTzIEoxYsg0nsnH35RW09zVNffJNXm47GzKYr6RruaFy2PTJ~qCLoofd4dT5T5menUZ9OkynCFyJseHDP~QAd2DFOxU1pNf7F1S8r90E7YHpZTeM8BMJyrcfREf4DvbbZekBRIIuSTiqgz2Ut2qvVwMXQUjxI3X9-BkNKx-DDIytOsmeryuirMGseFzpHuGmDUbaMpu0ZcQMOQf8QqS4bgHpCl~puiaB7PrvD26wmjhbYlgLrzLFXdy0PWja93EGfPnyPLA__&Key-Pair-Id=K2HSFNDJXOU9YS";

type DeptInfo = {
  code: string;
  name: string;
  tagline: string;
  description: string;
  philosophy?: string;
  services: { title: string; desc: string }[];
  contact?: string;
  showBizdocLogo?: boolean;
  clientFacing?: boolean;
};

const DEPARTMENTS: Record<string, DeptInfo> = {
  cso: {
    code: "01",
    name: "HAMZURY CSO",
    tagline: "Client gateway",
    description:
      "Receives every inquiry and manages the client relationship from intake to delivery.",
    services: [
      { title: "Lead Intake & Qualification", desc: "Every inquiry is received, logged, and assessed against HAMZURY's service offerings." },
      { title: "Package Recommendation", desc: "CSO recommends the right combination of departments based on the client's needs and budget." },
      { title: "Engagement Pack Delivery", desc: "Clients receive a formal Engagement Pack with scope, timeline, and investment summary." },
      { title: "Client Onboarding", desc: "Smooth handoff to the relevant departments with full context and documented expectations." },
      { title: "Progress Snapshots", desc: "Regular updates to clients throughout the engagement lifecycle." },
      { title: "Delivery Dossier", desc: "Final delivery package with all outputs, quality sign-offs, and Founder's note." },
    ],
    contact: "cso@hamzury.com",
    clientFacing: true,
  },
  systems: {
    code: "02",
    name: "HAMZURY Systems",
    tagline: "Digital infrastructure",
    description:
      "Builds websites, dashboards, automation, and operational technology.",
    services: [
      { title: "Business Websites", desc: "Clean, fast, professionally designed websites that reflect institutional quality." },
      { title: "CRM Systems", desc: "Custom CRM setups on Airtable, Notion, or bespoke platforms configured for your workflow." },
      { title: "Automation Workflows", desc: "n8n, Zapier, and custom automation that eliminates repetitive tasks." },
      { title: "AI Integration", desc: "AI-powered tools, chatbots, and intelligent workflows built into your operations." },
      { title: "Dashboards & Analytics", desc: "Real-time operational dashboards connected to your data sources." },
      { title: "System Maintenance", desc: "Ongoing support, updates, and monitoring for all digital infrastructure." },
    ],
    contact: "systems@hamzury.com",
    clientFacing: true,
  },
  studios: {
    code: "03",
    name: "HAMZURY Studios",
    tagline: "Brand architecture",
    description:
      "Creates identity systems, content structures, and visual assets.",
    services: [
      { title: "Brand Identity", desc: "Logo, colour palette, typography, and brand guidelines that reflect institutional quality." },
      { title: "Social Media Systems", desc: "Content calendars, templates, and production workflows for consistent brand presence." },
      { title: "Visual Production", desc: "Photography direction, graphic design, and visual assets for all channels." },
      { title: "Faceless Content Channels", desc: "Script-to-video production for YouTube, TikTok, and other platforms." },
      { title: "Brand Guide PDF", desc: "Comprehensive brand documentation for consistent application across all touchpoints." },
      { title: "Social Media Templates", desc: "Editable Canva templates designed to your brand standards." },
    ],
    contact: "studios@hamzury.com",
    clientFacing: true,
  },
  bizdoc: {
    code: "04",
    name: "HAMZURY Bizdoc",
    tagline: "Regulatory structure",
    description:
      "Handles business registration, filings, and compliance documentation.",
    showBizdocLogo: true,
    services: [
      { title: "CAC Business Registration", desc: "Business name and company incorporation with the Corporate Affairs Commission." },
      { title: "Annual Returns Filing", desc: "Timely annual returns to keep your registration current and compliant." },
      { title: "Tax Registration (FIRS/LIRS)", desc: "TIN registration, VAT setup, and tax compliance documentation." },
      { title: "PENCOM Setup", desc: "Pension fund administration registration and compliance." },
      { title: "SCUML Registration", desc: "Special Control Unit Against Money Laundering compliance registration." },
      { title: "Contract Generation", desc: "Professional contracts, NDAs, and service agreements from vetted templates." },
    ],
    contact: "bizdoc@hamzury.com",
    clientFacing: true,
  },
  innovation: {
    code: "05",
    name: "HAMZURY Innovation",
    tagline: "Capability development",
    description:
      "Designs structured training and practical learning programs.",
    services: [
      { title: "Cohort-Based Training", desc: "Structured 3-week cohorts covering digital skills, business systems, and professional development." },
      { title: "Self-Paced Courses", desc: "On-demand learning modules accessible anytime, anywhere." },
      { title: "Business Bootcamps", desc: "Intensive programmes for entrepreneurs and business owners." },
      { title: "Kids Robotics Programme", desc: "STEM education and robotics kits for young learners." },
      { title: "Scholarship Programme", desc: "100+ scholarships per cohort for deserving candidates from underserved communities." },
      { title: "Intern Conversion", desc: "Top cohort graduates are offered internship placements within HAMZURY departments." },
    ],
    contact: "innovation@hamzury.com",
    clientFacing: true,
  },
  growth: {
    code: "06",
    name: "HAMZURY Growth",
    tagline: "Strategic partnerships",
    description:
      "Leads partnerships, research, and institutional growth initiatives.",
    services: [
      { title: "Partnership Development", desc: "Identifying, approaching, and formalising strategic partnerships." },
      { title: "Grant Applications", desc: "Research, writing, and submission of grant applications to relevant funders." },
      { title: "Market Research", desc: "Industry analysis and market intelligence reports." },
      { title: "Revenue Strategy", desc: "New revenue channel identification and development." },
      { title: "Agent Network", desc: "Management of HAMZURY's referral agent network." },
      { title: "QA Oversight", desc: "Quality assurance review of all client deliverables before final delivery." },
    ],
    contact: "growth@hamzury.com",
  },
  people: {
    code: "07",
    name: "HAMZURY People",
    tagline: "Talent systems",
    description:
      "Manages hiring, training, and staff performance.",
    services: [
      { title: "Recruitment & Hiring", desc: "Job descriptions, interview processes, and offer management." },
      { title: "Onboarding", desc: "Structured onboarding programme for every new staff member." },
      { title: "Performance Management", desc: "Quarterly reviews, KPI tracking, and development planning." },
      { title: "Leave Management", desc: "Leave requests, approvals, and absence tracking." },
      { title: "Staff Development", desc: "Training assignments, skill development, and career progression." },
      { title: "Staff of the Month", desc: "Recognition programme for outstanding performance." },
    ],
    contact: "people@hamzury.com",
  },
  ledger: {
    code: "08",
    name: "HAMZURY Ledger",
    tagline: "Financial clarity",
    description:
      "Tracks revenue, budgets, and financial compliance.",
    services: [
      { title: "Invoicing & Collections", desc: "Professional invoices, payment tracking, and collections management." },
      { title: "Expense Management", desc: "Expense claims, approvals, and budget tracking." },
      { title: "Commission Processing", desc: "Agent commission calculations and payment processing." },
      { title: "RIDI Allocation", desc: "Monthly calculation and transfer of 10% profit to RIDI programme." },
      { title: "Financial Reporting", desc: "Monthly financial reports and quarterly statements." },
      { title: "Budget vs Actuals", desc: "Real-time budget tracking and variance analysis." },
    ],
    contact: "finance@hamzury.com",
  },
  executive: {
    code: "09",
    name: "HAMZURY Executive",
    tagline: "Operational leadership",
    description:
      "Aligns departments, monitors performance, and resolves escalations.",
    services: [
      { title: "Department Health Monitoring", desc: "Real-time visibility into every department's performance metrics." },
      { title: "Approvals Management", desc: "Expense approvals (₦50k–₦200k), escalations, and strategic decisions." },
      { title: "Weekly Founder Reports", desc: "Auto-generated weekly reports summarising institutional performance." },
      { title: "Risk Register", desc: "Tracking and resolution of all institutional risk flags." },
      { title: "Revenue Oversight", desc: "Monthly targets vs actuals and pipeline management." },
      { title: "1:1 Department Meetings", desc: "Regular structured meetings with each department lead." },
    ],
    contact: "ceo@hamzury.com",
  },
  founder: {
    code: "10",
    name: "HAMZURY Founder",
    tagline: "Strategic oversight",
    description:
      "Sets vision and approves major institutional decisions.",
    services: [
      { title: "Institutional Vision", desc: "Long-term strategic direction and institutional philosophy." },
      { title: "Major Approvals", desc: "Final approval authority for decisions above ₦200,000." },
      { title: "Governance", desc: "Institutional governance, charter oversight, and policy ratification." },
      { title: "Founder's Notes", desc: "Personal notes included in every client Delivery Dossier." },
      { title: "Succession Planning", desc: "Long-term leadership development and succession strategy." },
      { title: "RIDI Oversight", desc: "Direct oversight of the RIDI programme and its impact." },
    ],
    contact: "founder@hamzury.com",
  },
  ridi: {
    code: "11",
    name: "HAMZURY RIDI",
    tagline: "Profit to impact",
    description:
      "Ten percent of profits fund rural development programs.",
    services: [
      { title: "Digital Literacy Training", desc: "Free digital skills training for rural community members." },
      { title: "Scholarship Programme", desc: "Full scholarships for deserving candidates from underserved communities." },
      { title: "Community Profiles", desc: "Research and documentation of community needs and impact." },
      { title: "Impact Reporting", desc: "Annual impact reports shared with the Founder and public." },
      { title: "Beneficiary Stories", desc: "Documenting the human stories behind the numbers." },
      { title: "Donor Relations", desc: "Reporting to donors and grant funders on programme outcomes." },
    ],
    contact: "ridi@hamzury.com",
  },
};

export default function Department() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const dept = DEPARTMENTS[slug];

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--milk)" }}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Department not found.</p>
          <Link href="/" className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={HAMZURY_LOGO} alt="HAMZURY" className="h-8 w-8 object-contain rounded-sm" />
            <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: "var(--brand)" }}>
              HAMZURY
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ background: "var(--milk)" }}>
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono font-semibold tracking-widest" style={{ color: "var(--brand)" }}>
                {dept.code}
              </span>
              <span className="w-8 h-px" style={{ background: "var(--brand)" }} />
              <Link href="/services" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                All Departments
              </Link>
            </div>

            {dept.showBizdocLogo && (
              <img src={BIZDOC_LOGO} alt="BizDoc Consult" className="h-16 mb-6 object-contain" />
            )}

            <span className="brand-rule" />
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: "var(--charcoal)", letterSpacing: "-0.02em" }}>
              {dept.name}
            </h1>
            <p className="text-base font-medium mb-6" style={{ color: "var(--brand)" }}>
              {dept.tagline}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {dept.description}
            </p>

            {dept.philosophy && (
              <blockquote className="mt-8 pl-4 border-l-2 text-sm italic text-muted-foreground leading-relaxed" style={{ borderColor: "var(--brand)" }}>
                "{dept.philosophy}"
              </blockquote>
            )}

            {dept.clientFacing && (
              <div className="flex gap-4 mt-8">
                <a
                  href="/diagnosis"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
                  style={{ background: "var(--brand)", color: "white" }}
                >
                  Get Started <ArrowRight size={14} />
                </a>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border border-border"
                  style={{ color: "var(--charcoal)" }}
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container">
          <div className="max-w-xl mb-12">
            <span className="brand-rule" />
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--charcoal)" }}>
              What we deliver
            </h2>
            <p className="text-sm text-muted-foreground">
              Every service is documented, quality-gated, and delivered to institutional standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {dept.services.map((svc, i) => (
              <div key={i} className="bg-white p-8">
                <span className="text-xs font-mono font-semibold tracking-widest mb-4 block" style={{ color: "var(--brand)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--charcoal)" }}>
                  {svc.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 border-t border-border" style={{ background: "var(--milk)" }}>
        <div className="container max-w-2xl text-center">
          <span className="block w-10 h-0.5 mx-auto mb-6" style={{ background: "var(--brand)" }} />
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--charcoal)" }}>
            Ready to work with {dept.name}?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Contact us at{" "}
            <a href={`mailto:${dept.contact}`} className="font-medium" style={{ color: "var(--brand)" }}>
              {dept.contact}
            </a>{" "}
            or start with a free business health diagnosis.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/diagnosis"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
              style={{ background: "var(--brand)", color: "white" }}
            >
              Free Diagnosis <ArrowRight size={14} />
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border border-border"
              style={{ color: "var(--charcoal)" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
