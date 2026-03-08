/**
 * HAMZURY Expanded SOP Seed Script
 * Seeds all department service types with full Pre / During / Post checklists
 * Run: node server/seed-sop-expanded.mjs
 */

import { createConnection } from "mysql2/promise";
import { createHash } from "crypto";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const url = new URL(DB_URL.replace("mysql://", "http://"));
const [user, password] = url.username
  ? [decodeURIComponent(url.username), decodeURIComponent(url.password)]
  : ["root", ""];
const sslParam = url.searchParams.get("ssl");

const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user,
  password,
  database: url.pathname.slice(1),
  ssl: sslParam ? JSON.parse(decodeURIComponent(sslParam)) : undefined,
});

console.log("Connected to database.");

// ─── SOP DATA ─────────────────────────────────────────────────────────────────
// Format: { dept, service, stage: "pre"|"during"|"post", steps: string[] }
const sopData = [

  // ═══════════════════════════════════════════════════════════════════════
  // CSO — Client Strategy Office
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "CSO", service: "Client Onboarding", stage: "pre", steps: [
    "Receive initial inquiry and log client details in the system",
    "Send welcome message and schedule clarity review session",
    "Prepare clarity review questionnaire tailored to client's business type",
    "Research client's industry and identify key needs before the session",
  ]},
  { dept: "CSO", service: "Client Onboarding", stage: "during", steps: [
    "Conduct clarity review session — listen first, speak second",
    "Document client's goals, challenges, and expectations clearly",
    "Recommend the most suitable HAMZURY service package",
    "Present the Engagement Framework and explain the process step by step",
    "Issue invoice and confirm payment terms",
  ]},
  { dept: "CSO", service: "Client Onboarding", stage: "post", steps: [
    "Confirm payment received and send official receipt",
    "Create client record in the system with all details",
    "Dispatch work brief to the relevant department(s)",
    "Send client a welcome message with timeline and next steps",
    "Add client to the nurture list for ongoing relationship management",
  ]},

  { dept: "CSO", service: "Clarity Review", stage: "pre", steps: [
    "Review client's previous communications and any documents shared",
    "Prepare structured questions covering business model, goals, and pain points",
    "Confirm session time and send reminder to client",
  ]},
  { dept: "CSO", service: "Clarity Review", stage: "during", steps: [
    "Open session with a calm, unhurried introduction",
    "Ask structured questions and take detailed notes",
    "Identify the core problem the client needs solved",
    "Summarise findings back to client to confirm understanding",
  ]},
  { dept: "CSO", service: "Clarity Review", stage: "post", steps: [
    "Prepare Structured Perspective document from session notes",
    "Send document to client within 24 hours of session",
    "Follow up to confirm client has reviewed and understood the document",
    "Update client status in the system",
  ]},

  { dept: "CSO", service: "Delivery & Handoff", stage: "pre", steps: [
    "Confirm all deliverables from the relevant department are complete",
    "Review quality of all materials before sending to client",
    "Prepare Delivery Dossier with all files, links, and instructions",
  ]},
  { dept: "CSO", service: "Delivery & Handoff", stage: "during", steps: [
    "Send Delivery Dossier to client with a clear, calm cover message",
    "Walk client through what was delivered and how to use it",
    "Answer any questions the client has about the deliverables",
  ]},
  { dept: "CSO", service: "Delivery & Handoff", stage: "post", steps: [
    "Confirm client has received and reviewed all deliverables",
    "Request client feedback or testimonial",
    "Update project status to 'Delivered' in the system",
    "Move client to nurture list and schedule 30-day check-in",
    "Prepare Founder Note summarising the project outcome",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // BIZDOC — Business Compliance
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Bizdoc", service: "Business Registration", stage: "pre", steps: [
    "Confirm client has provided all required identification documents",
    "Verify business name availability on CAC portal",
    "Confirm service type: Sole Proprietorship, Partnership, or Limited Liability",
    "Prepare and review all registration forms before submission",
    "Confirm client has signed all consent and authorization forms",
  ]},
  { dept: "Bizdoc", service: "Business Registration", stage: "during", steps: [
    "Submit application on CAC portal with all required documents",
    "Track application status and document submission confirmation",
    "Respond promptly to any CAC queries or additional document requests",
    "Keep CSO informed of progress at each milestone",
  ]},
  { dept: "Bizdoc", service: "Business Registration", stage: "post", steps: [
    "Confirm certificate has been received and is accurate",
    "Deliver certified copies to CSO for client handoff",
    "Update client record in the system",
    "File all documents in the client's digital folder",
    "Notify CSO that task is complete and ready for delivery",
  ]},

  { dept: "Bizdoc", service: "Company Incorporation", stage: "pre", steps: [
    "Confirm client's choice of company type (Ltd, PLC, etc.)",
    "Collect all director and shareholder details with valid IDs",
    "Verify proposed company name availability on CAC portal",
    "Prepare Memorandum and Articles of Association draft",
    "Confirm share structure and confirm with client before filing",
  ]},
  { dept: "Bizdoc", service: "Company Incorporation", stage: "during", steps: [
    "Submit incorporation application on CAC portal",
    "Upload all required documents (MEMART, director forms, share details)",
    "Track CAC processing and respond to any queries within 24 hours",
    "Obtain Certificate of Incorporation and all statutory documents",
  ]},
  { dept: "Bizdoc", service: "Company Incorporation", stage: "post", steps: [
    "Verify all incorporation documents are accurate and complete",
    "Prepare a compliance summary for the client (what they have, what comes next)",
    "Deliver all documents to CSO for client handoff",
    "Update client record and file all documents",
    "Notify CSO that task is complete",
  ]},

  { dept: "Bizdoc", service: "Annual Returns Filing", stage: "pre", steps: [
    "Identify all clients with annual returns due in the next 30 days",
    "Send reminder to CSO to notify clients of upcoming deadline",
    "Collect any updated company information from client",
    "Prepare annual return forms with current company details",
  ]},
  { dept: "Bizdoc", service: "Annual Returns Filing", stage: "during", steps: [
    "File annual returns on CAC portal before the deadline",
    "Pay any applicable filing fees and obtain payment confirmation",
    "Track submission and obtain acknowledgement from CAC",
  ]},
  { dept: "Bizdoc", service: "Annual Returns Filing", stage: "post", steps: [
    "Confirm filing is accepted and obtain official confirmation",
    "Update client compliance calendar with next due date",
    "Notify CSO that filing is complete for client communication",
    "File all documents in client's digital folder",
  ]},

  { dept: "Bizdoc", service: "Tax Registration (FIRS/State)", stage: "pre", steps: [
    "Confirm which tax types apply: TIN, VAT, WHT, CIT, PAYE",
    "Collect all required documents: CAC certificate, ID, utility bill",
    "Confirm client's business address and contact details are current",
  ]},
  { dept: "Bizdoc", service: "Tax Registration (FIRS/State)", stage: "during", steps: [
    "Submit TIN application and all supporting documents",
    "Register for applicable tax types on FIRS portal",
    "Register with State Internal Revenue Service for PAYE if applicable",
    "Track application and respond to any queries",
  ]},
  { dept: "Bizdoc", service: "Tax Registration (FIRS/State)", stage: "post", steps: [
    "Obtain TIN certificate and all registration confirmations",
    "Prepare tax compliance summary for client",
    "Notify CSO with all documents for client delivery",
    "Update client record with tax registration details",
  ]},

  { dept: "Bizdoc", service: "PENCOM Registration", stage: "pre", steps: [
    "Confirm client has at least 3 employees (PENCOM requirement)",
    "Collect employee details: names, dates of birth, NIN numbers",
    "Identify a licensed Pension Fund Administrator (PFA) for the client",
  ]},
  { dept: "Bizdoc", service: "PENCOM Registration", stage: "during", steps: [
    "Register employer with PENCOM portal",
    "Register each employee with the chosen PFA",
    "Obtain Retirement Savings Account (RSA) pins for all employees",
    "Set up contribution schedule with the client",
  ]},
  { dept: "Bizdoc", service: "PENCOM Registration", stage: "post", steps: [
    "Confirm all RSA pins have been issued and are correct",
    "Prepare PENCOM compliance guide for the client",
    "Notify CSO with all documents for client delivery",
    "Update client record with PENCOM details",
  ]},

  { dept: "Bizdoc", service: "Industry Licensing", stage: "pre", steps: [
    "Identify the specific regulatory body for the client's industry",
    "Confirm all pre-licensing requirements (training, premises, equipment)",
    "Collect all required documents for the licensing application",
    "Prepare application forms and supporting documentation",
  ]},
  { dept: "Bizdoc", service: "Industry Licensing", stage: "during", steps: [
    "Submit licensing application to the relevant regulatory body",
    "Pay all applicable fees and obtain payment receipts",
    "Track application status and respond to any inspection or query requests",
    "Coordinate any required premises inspections with the client",
  ]},
  { dept: "Bizdoc", service: "Industry Licensing", stage: "post", steps: [
    "Obtain license certificate and confirm it is accurate",
    "Prepare license compliance calendar (renewal dates, reporting obligations)",
    "Notify CSO with all documents for client delivery",
    "Update client record with license details and renewal date",
  ]},

  { dept: "Bizdoc", service: "Compliance Advisory", stage: "pre", steps: [
    "Review client's current compliance status across all applicable regulations",
    "Identify gaps, risks, and upcoming deadlines",
    "Prepare compliance audit report with findings and recommendations",
  ]},
  { dept: "Bizdoc", service: "Compliance Advisory", stage: "during", steps: [
    "Present compliance audit findings to CSO for client communication",
    "Develop a compliance action plan with clear timelines",
    "Prioritise critical compliance gaps that pose immediate risk",
  ]},
  { dept: "Bizdoc", service: "Compliance Advisory", stage: "post", steps: [
    "Deliver compliance action plan to CSO for client handoff",
    "Schedule follow-up review to check implementation progress",
    "Update client record with compliance status",
    "Add client to compliance calendar for proactive monitoring",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // STUDIOS — Brand & Content
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Studios", service: "Brand Identity Design", stage: "pre", steps: [
    "Complete brand discovery questionnaire with client (via CSO)",
    "Research client's industry, competitors, and target audience",
    "Define brand personality, tone, and visual direction",
    "Confirm deliverables: logo, colour palette, typography, brand guide",
    "Set revision rounds and timeline with CSO",
  ]},
  { dept: "Studios", service: "Brand Identity Design", stage: "during", steps: [
    "Develop 3 initial concept directions for client review",
    "Present concepts with rationale — never without context",
    "Incorporate client feedback within agreed revision scope",
    "Ensure all assets are designed at correct resolution and format",
    "Conduct internal quality review before sending to CSO",
  ]},
  { dept: "Studios", service: "Brand Identity Design", stage: "post", steps: [
    "Package all final files in correct formats (AI, PNG, PDF, SVG)",
    "Deliver brand guide document with usage rules",
    "Upload all assets to client's designated folder",
    "Update task status in the system",
    "Notify CSO that deliverables are ready for client handoff",
  ]},

  { dept: "Studios", service: "Social Media Management", stage: "pre", steps: [
    "Receive content brief from CSO with client's goals and audience",
    "Audit client's existing social media presence and performance",
    "Develop monthly content calendar with themes, formats, and posting schedule",
    "Confirm content calendar with CSO before production begins",
  ]},
  { dept: "Studios", service: "Social Media Management", stage: "during", steps: [
    "Produce all content assets (graphics, captions, videos) per the calendar",
    "Review all content for brand consistency before scheduling",
    "Schedule content using approved tools",
    "Monitor performance and engagement daily",
    "Flag any comments or messages that require CSO response",
  ]},
  { dept: "Studios", service: "Social Media Management", stage: "post", steps: [
    "Prepare monthly performance report (reach, engagement, growth)",
    "Review what worked and what did not — adjust next month's strategy",
    "Send performance report to CSO for client communication",
    "Update content calendar for next month based on insights",
  ]},

  { dept: "Studios", service: "Content Strategy", stage: "pre", steps: [
    "Conduct content audit of client's existing materials",
    "Define content pillars aligned with client's brand and goals",
    "Identify key platforms, formats, and posting frequency",
    "Map content to the client's customer journey",
  ]},
  { dept: "Studios", service: "Content Strategy", stage: "during", steps: [
    "Develop full content strategy document with pillars, formats, and calendar",
    "Create sample content pieces for each pillar to illustrate the strategy",
    "Present strategy to CSO for client review and approval",
    "Incorporate feedback and finalise the strategy",
  ]},
  { dept: "Studios", service: "Content Strategy", stage: "post", steps: [
    "Deliver final content strategy document to CSO",
    "Brief client's team (via CSO) on how to implement the strategy",
    "Set 30-day review checkpoint to assess implementation",
    "Update task status in the system",
  ]},

  { dept: "Studios", service: "Podcast Production", stage: "pre", steps: [
    "Define podcast concept, format, episode structure, and target audience",
    "Set up recording environment and confirm equipment quality",
    "Prepare episode script or talking points",
    "Record test episode and review audio quality",
  ]},
  { dept: "Studios", service: "Podcast Production", stage: "during", steps: [
    "Record episode with clean audio — no background noise",
    "Edit audio: remove filler words, balance levels, add intro/outro music",
    "Create episode artwork and show notes",
    "Review final episode before publishing",
  ]},
  { dept: "Studios", service: "Podcast Production", stage: "post", steps: [
    "Publish episode to all agreed platforms (Spotify, Apple, etc.)",
    "Share episode on social media with branded graphics",
    "Track episode performance (downloads, listens, shares)",
    "Notify CSO when episode is live",
  ]},

  { dept: "Studios", service: "Video Production", stage: "pre", steps: [
    "Define video brief: purpose, audience, key message, length, format",
    "Write script and get approval from CSO before filming",
    "Plan shoot: location, equipment, talent, props",
    "Conduct equipment check and test recording",
  ]},
  { dept: "Studios", service: "Video Production", stage: "during", steps: [
    "Film all required footage following the approved script",
    "Capture B-roll and supporting visuals",
    "Edit video: cuts, transitions, captions, music, colour grade",
    "Conduct internal quality review before sending to CSO",
  ]},
  { dept: "Studios", service: "Video Production", stage: "post", steps: [
    "Export video in correct format and resolution for each platform",
    "Deliver final video files to CSO for client handoff",
    "Archive project files in the client's folder",
    "Update task status in the system",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // SYSTEMS — Digital Infrastructure
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Systems", service: "Business Website", stage: "pre", steps: [
    "Conduct discovery session with CSO to understand client's goals and brand",
    "Define site structure: pages, navigation, key content sections",
    "Confirm tech stack and hosting requirements",
    "Prepare wireframes or sitemap for client approval (via CSO)",
    "Confirm all brand assets (logo, colours, fonts) are available",
  ]},
  { dept: "Systems", service: "Business Website", stage: "during", steps: [
    "Build website following approved wireframes and brand guidelines",
    "Implement all pages with correct content, images, and functionality",
    "Set up contact forms, SEO basics, and analytics",
    "Test on desktop, tablet, and mobile — fix all layout issues",
    "Conduct internal quality review before presenting to CSO",
  ]},
  { dept: "Systems", service: "Business Website", stage: "post", steps: [
    "Deploy website to production hosting",
    "Test all links, forms, and functionality on live site",
    "Prepare handover document with login credentials and maintenance guide",
    "Deliver to CSO for client handoff",
    "Update task status in the system",
  ]},

  { dept: "Systems", service: "Web Application", stage: "pre", steps: [
    "Define application scope, user roles, and core features with CSO",
    "Create technical specification document",
    "Design database schema and system architecture",
    "Set up development environment and version control",
    "Confirm timeline and milestone plan",
  ]},
  { dept: "Systems", service: "Web Application", stage: "during", steps: [
    "Build backend: database, API, authentication, business logic",
    "Build frontend: UI components, user flows, responsive design",
    "Write automated tests for all critical functions",
    "Conduct user acceptance testing with CSO acting as client proxy",
    "Fix all bugs identified during testing",
  ]},
  { dept: "Systems", service: "Web Application", stage: "post", steps: [
    "Deploy to production with rollback plan in place",
    "Prepare technical documentation and user guide",
    "Deliver to CSO for client handoff",
    "Provide 30-day post-deployment support",
    "Update task status in the system",
  ]},

  { dept: "Systems", service: "Automation System", stage: "pre", steps: [
    "Map existing manual processes and identify automation opportunities",
    "Define automation scope and expected outcomes",
    "Confirm tools and integrations required (Zapier, Make, custom API, etc.)",
    "Set up test environment for automation development",
  ]},
  { dept: "Systems", service: "Automation System", stage: "during", steps: [
    "Build automation workflows in staging environment",
    "Test each workflow with real data — verify outputs are correct",
    "Document all automation flows with clear diagrams",
    "Conduct user acceptance testing with CSO",
  ]},
  { dept: "Systems", service: "Automation System", stage: "post", steps: [
    "Deploy automations to production",
    "Monitor for 48 hours to confirm stable operation",
    "Train client team (via CSO) on how to use and maintain automations",
    "Deliver documentation to CSO for client handoff",
    "Update task status in the system",
  ]},

  { dept: "Systems", service: "CRM System Setup", stage: "pre", steps: [
    "Define CRM requirements: pipeline stages, contact fields, user roles",
    "Select appropriate CRM platform based on client's needs and budget",
    "Map existing client data for migration",
    "Prepare data migration plan",
  ]},
  { dept: "Systems", service: "CRM System Setup", stage: "during", steps: [
    "Configure CRM with custom fields, pipelines, and automation rules",
    "Migrate existing client data into the CRM",
    "Set up user accounts and access permissions",
    "Test all CRM functions with sample data",
  ]},
  { dept: "Systems", service: "CRM System Setup", stage: "post", steps: [
    "Deliver configured CRM with all data migrated",
    "Prepare user guide and training materials",
    "Train client team (via CSO) on CRM usage",
    "Deliver to CSO for client handoff",
    "Update task status in the system",
  ]},

  { dept: "Systems", service: "AI Workflow Integration", stage: "pre", steps: [
    "Define AI use case: what problem it solves, what data it uses",
    "Confirm AI tools and APIs to be integrated",
    "Design workflow architecture and data flow",
    "Set up development environment and API access",
  ]},
  { dept: "Systems", service: "AI Workflow Integration", stage: "during", steps: [
    "Build AI integration following the approved architecture",
    "Test with real data — verify accuracy and reliability",
    "Implement error handling and fallback mechanisms",
    "Document the AI workflow clearly",
  ]},
  { dept: "Systems", service: "AI Workflow Integration", stage: "post", steps: [
    "Deploy to production and monitor initial performance",
    "Prepare user guide for client team",
    "Deliver to CSO for client handoff",
    "Update task status in the system",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // INNOVATION HUB — Training & Education
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Innovation", service: "Executive Training Program", stage: "pre", steps: [
    "Define training objectives, target audience, and expected outcomes",
    "Develop curriculum outline and session plan",
    "Prepare all training materials: slides, workbooks, exercises",
    "Confirm venue, equipment, and logistics",
    "Send pre-training survey to participants to assess baseline knowledge",
  ]},
  { dept: "Innovation", service: "Executive Training Program", stage: "during", steps: [
    "Deliver training sessions following the approved curriculum",
    "Facilitate discussions and practical exercises",
    "Collect attendance and participation records",
    "Adjust pace and depth based on participant engagement",
  ]},
  { dept: "Innovation", service: "Executive Training Program", stage: "post", steps: [
    "Administer post-training assessment to measure learning",
    "Issue certificates of participation to all attendees",
    "Prepare training impact report (attendance, assessment scores, feedback)",
    "Deliver report to CSO for client communication",
    "Update cohort records in the system",
  ]},

  { dept: "Innovation", service: "Robotics Training (Children)", stage: "pre", steps: [
    "Define age group, skill level, and learning objectives",
    "Prepare curriculum: robotics concepts, hands-on projects, safety rules",
    "Confirm equipment availability: kits, computers, tools",
    "Confirm venue and parental consent forms",
  ]},
  { dept: "Innovation", service: "Robotics Training (Children)", stage: "during", steps: [
    "Deliver sessions following the curriculum with age-appropriate language",
    "Supervise hands-on activities and ensure safety at all times",
    "Track each child's progress and engagement",
    "Celebrate wins and encourage curiosity",
  ]},
  { dept: "Innovation", service: "Robotics Training (Children)", stage: "post", steps: [
    "Conduct final project showcase for parents/guardians",
    "Issue certificates of completion",
    "Prepare cohort report with individual progress notes",
    "Deliver report to CSO and update cohort records",
  ]},

  { dept: "Innovation", service: "Digital Skills Training", stage: "pre", steps: [
    "Assess participants' current digital skills level",
    "Define curriculum: tools, platforms, and practical skills to cover",
    "Prepare training materials and practical exercises",
    "Confirm access to computers and internet for all participants",
  ]},
  { dept: "Innovation", service: "Digital Skills Training", stage: "during", steps: [
    "Deliver training with hands-on practice for every concept taught",
    "Ensure every participant completes each practical exercise",
    "Track attendance and progress daily",
    "Provide individual support to participants who are struggling",
  ]},
  { dept: "Innovation", service: "Digital Skills Training", stage: "post", steps: [
    "Conduct final assessment to verify skills acquired",
    "Issue certificates of completion",
    "Prepare cohort impact report",
    "Refer high-potential participants to RIDI or HR for further opportunities",
    "Update cohort records in the system",
  ]},

  { dept: "Innovation", service: "Internship Program", stage: "pre", steps: [
    "Define internship roles, departments, and duration",
    "Develop internship curriculum and learning objectives",
    "Screen and select candidates in coordination with HR",
    "Prepare onboarding materials and assign mentors",
  ]},
  { dept: "Innovation", service: "Internship Program", stage: "during", steps: [
    "Onboard interns with orientation on HAMZURY culture and systems",
    "Assign real tasks under mentor supervision",
    "Conduct weekly check-ins to track progress and address challenges",
    "Provide structured feedback at the midpoint review",
  ]},
  { dept: "Innovation", service: "Internship Program", stage: "post", steps: [
    "Conduct final performance review with mentor and intern",
    "Issue certificate of internship completion",
    "Prepare intern performance report for HR records",
    "Identify high performers for potential staff roles",
    "Update internship records in the system",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // BIZDEV — Business Development
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Growth", service: "Lead Generation Campaign", stage: "pre", steps: [
    "Define target audience: industry, size, location, decision-maker profile",
    "Select lead generation channels: LinkedIn, referrals, events, cold outreach",
    "Prepare outreach messaging and value proposition",
    "Set campaign goals: number of leads, conversion rate targets",
  ]},
  { dept: "Growth", service: "Lead Generation Campaign", stage: "during", steps: [
    "Execute outreach across selected channels",
    "Track all responses and log qualified leads in the system",
    "Follow up with interested prospects within 24 hours",
    "Hand qualified leads to CSO for onboarding",
  ]},
  { dept: "Growth", service: "Lead Generation Campaign", stage: "post", steps: [
    "Prepare campaign performance report (leads generated, conversion rate)",
    "Review what worked and what did not — adjust for next campaign",
    "Update lead records in the system",
    "Report results to CEO",
  ]},

  { dept: "Growth", service: "Partnership Development", stage: "pre", steps: [
    "Identify potential partners aligned with HAMZURY's mission and services",
    "Research each partner: their work, values, audience, and goals",
    "Prepare partnership proposal with clear mutual benefits",
    "Get CEO approval before approaching any strategic partner",
  ]},
  { dept: "Growth", service: "Partnership Development", stage: "during", steps: [
    "Initiate contact with potential partner through a warm, professional message",
    "Schedule and conduct partnership discussion meeting",
    "Negotiate terms and document agreed scope of partnership",
    "Prepare partnership agreement for Founder/CEO review",
  ]},
  { dept: "Growth", service: "Partnership Development", stage: "post", steps: [
    "Finalise and sign partnership agreement",
    "Brief relevant departments on the new partnership",
    "Set up tracking for partnership outcomes",
    "Report partnership to CEO and Founder",
  ]},

  { dept: "Growth", service: "Grant Application", stage: "pre", steps: [
    "Identify grant opportunities aligned with HAMZURY's work (especially RIDI)",
    "Review grant requirements, eligibility criteria, and deadlines",
    "Gather supporting data: impact numbers, financial records, team profiles",
    "Prepare draft application narrative",
  ]},
  { dept: "Growth", service: "Grant Application", stage: "during", steps: [
    "Write full grant application following the funder's guidelines",
    "Compile all required attachments: financial statements, registration documents, impact reports",
    "Review application for accuracy and completeness",
    "Submit application before the deadline and obtain confirmation",
  ]},
  { dept: "Growth", service: "Grant Application", stage: "post", steps: [
    "Track application status and respond to any funder queries",
    "Notify CEO and Founder of outcome when received",
    "If successful: prepare grant management plan",
    "If unsuccessful: document lessons learned for future applications",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // FINANCE (LEDGER)
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "Ledger", service: "Monthly Bookkeeping", stage: "pre", steps: [
    "Collect all income records: invoices issued, payments received",
    "Collect all expense records: receipts, bank statements, supplier invoices",
    "Confirm all transactions are documented with supporting evidence",
  ]},
  { dept: "Ledger", service: "Monthly Bookkeeping", stage: "during", steps: [
    "Categorise all income and expenses in the accounting system",
    "Reconcile bank statements against recorded transactions",
    "Identify and resolve any discrepancies",
    "Calculate commission payments due to agents",
  ]},
  { dept: "Ledger", service: "Monthly Bookkeeping", stage: "post", steps: [
    "Prepare monthly financial summary (revenue, expenses, net position)",
    "Process commission payments to agents",
    "Present financial summary to CEO",
    "File all financial records securely",
    "Flag any unusual expenses or revenue patterns to CEO",
  ]},

  { dept: "Ledger", service: "Financial Reporting", stage: "pre", steps: [
    "Confirm reporting period and format required",
    "Gather all financial data for the period",
    "Review previous period's report for comparison baseline",
  ]},
  { dept: "Ledger", service: "Financial Reporting", stage: "during", steps: [
    "Prepare Profit & Loss statement",
    "Prepare Balance Sheet",
    "Prepare Cash Flow statement",
    "Add commentary explaining key movements and trends",
  ]},
  { dept: "Ledger", service: "Financial Reporting", stage: "post", steps: [
    "Review report for accuracy before presenting",
    "Present report to CEO and Founder",
    "Archive report in financial records",
    "Identify any action items from the report findings",
  ]},

  { dept: "Ledger", service: "Commission Processing", stage: "pre", steps: [
    "Receive confirmed referral list from CSO",
    "Verify each referral: client paid, service delivered, agent eligible",
    "Calculate commission amounts based on agreed commission structure",
  ]},
  { dept: "Ledger", service: "Commission Processing", stage: "during", steps: [
    "Prepare commission payment schedule",
    "Process payments to each eligible agent",
    "Obtain payment confirmations for all transactions",
  ]},
  { dept: "Ledger", service: "Commission Processing", stage: "post", steps: [
    "Send commission statements to each agent",
    "Update commission records in the system",
    "Report total commissions paid to CEO",
    "File all payment records",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // HR — PEOPLE
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "People", service: "Staff Recruitment", stage: "pre", steps: [
    "Receive hiring request from department lead with role description",
    "Prepare job description and candidate profile",
    "Post vacancy on appropriate channels",
    "Screen applications and shortlist candidates",
  ]},
  { dept: "People", service: "Staff Recruitment", stage: "during", steps: [
    "Conduct first-round interviews with shortlisted candidates",
    "Coordinate second-round interviews with the relevant department lead",
    "Check references for final candidate",
    "Prepare offer letter with role, terms, and start date",
  ]},
  { dept: "People", service: "Staff Recruitment", stage: "post", steps: [
    "Send offer letter and confirm acceptance",
    "Prepare onboarding schedule for new staff member",
    "Notify all departments of new hire and start date",
    "Update staff records in the system",
  ]},

  { dept: "People", service: "Staff Onboarding", stage: "pre", steps: [
    "Prepare onboarding pack: welcome letter, HAMZURY OS overview, department guide",
    "Set up system access: email, platform accounts, dashboard login",
    "Assign a buddy or mentor from the relevant department",
    "Schedule orientation sessions for the first week",
  ]},
  { dept: "People", service: "Staff Onboarding", stage: "during", steps: [
    "Conduct orientation: HAMZURY values, culture, systems, and expectations",
    "Walk new staff through their dashboard and tools",
    "Introduce new staff to all department leads",
    "Assign first tasks with clear guidance and support",
  ]},
  { dept: "People", service: "Staff Onboarding", stage: "post", steps: [
    "Conduct 30-day check-in with new staff member",
    "Gather feedback on onboarding experience",
    "Update staff record with onboarding completion",
    "Report to CEO on new hire's integration progress",
  ]},

  { dept: "People", service: "Performance Review", stage: "pre", steps: [
    "Notify all department leads of upcoming review cycle",
    "Distribute self-assessment forms to all staff",
    "Collect performance data: task completion rates, attendance, KPIs",
    "Prepare review templates for department leads",
  ]},
  { dept: "People", service: "Performance Review", stage: "during", steps: [
    "Facilitate one-on-one review meetings between leads and their staff",
    "Compile all review results and identify patterns",
    "Identify high performers for recognition",
    "Identify staff who need additional support or training",
  ]},
  { dept: "People", service: "Performance Review", stage: "post", steps: [
    "Prepare performance review summary report for CEO",
    "Communicate outcomes to each staff member",
    "Set development goals for the next review period",
    "Update staff records with review outcomes",
    "Recommend Staff of the Month to CEO based on results",
  ]},

  // ═══════════════════════════════════════════════════════════════════════
  // RIDI — Rural Innovation Development Initiative
  // ═══════════════════════════════════════════════════════════════════════
  { dept: "RIDI", service: "Digital Skills Program", stage: "pre", steps: [
    "Identify target community and confirm partnership with local leaders",
    "Assess participants' current digital skills level",
    "Prepare curriculum: basic computer use, internet, digital tools",
    "Confirm venue, equipment, and power supply",
    "Register all participants and obtain consent",
  ]},
  { dept: "RIDI", service: "Digital Skills Program", stage: "during", steps: [
    "Deliver training sessions with hands-on practice for every concept",
    "Track attendance and participation daily",
    "Provide individual support to participants who are struggling",
    "Collect stories and quotes from participants for impact reporting",
  ]},
  { dept: "RIDI", service: "Digital Skills Program", stage: "post", steps: [
    "Conduct final assessment to verify skills acquired",
    "Issue certificates of completion",
    "Update beneficiary records with outcomes",
    "Refer high-potential participants to Innovation Hub",
    "Prepare impact report for CEO and Founder",
  ]},

  { dept: "RIDI", service: "Entrepreneurship Training", stage: "pre", steps: [
    "Identify target community and confirm partnership with local leaders",
    "Assess participants' business ideas and current knowledge",
    "Prepare curriculum: business planning, financial basics, market access",
    "Confirm venue and training materials",
  ]},
  { dept: "RIDI", service: "Entrepreneurship Training", stage: "during", steps: [
    "Deliver training sessions with practical exercises",
    "Facilitate business plan development for each participant",
    "Connect participants with relevant HAMZURY services where appropriate",
    "Track attendance and collect impact stories",
  ]},
  { dept: "RIDI", service: "Entrepreneurship Training", stage: "post", steps: [
    "Review business plans developed during the program",
    "Issue certificates of completion",
    "Refer participants needing Bizdoc or CSO services to the relevant department",
    "Update beneficiary records and prepare impact report",
  ]},

  { dept: "RIDI", service: "Climate Education Program", stage: "pre", steps: [
    "Identify target community and confirm partnership with local leaders",
    "Develop curriculum: climate change basics, local impact, adaptation strategies",
    "Prepare materials in accessible language (local language if needed)",
    "Confirm venue and logistics",
  ]},
  { dept: "RIDI", service: "Climate Education Program", stage: "during", steps: [
    "Deliver sessions with community-relevant examples and discussions",
    "Facilitate practical exercises on adaptation and resilience",
    "Track attendance and collect participant feedback",
    "Document community-specific climate challenges for reporting",
  ]},
  { dept: "RIDI", service: "Climate Education Program", stage: "post", steps: [
    "Issue certificates of participation",
    "Prepare impact report with attendance, feedback, and key insights",
    "Share program outcomes with BizDev for grant applications",
    "Update beneficiary records and report to CEO and Founder",
  ]},
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
console.log("Seeding expanded SOP templates...");
let count = 0;

for (const s of sopData) {
  // Delete existing steps for this dept/service/stage to avoid duplicates
  await conn.execute(
    `DELETE FROM sopTemplates WHERE department = ? AND serviceType = ? AND stage = ?`,
    [s.dept, s.service, s.stage]
  );
  // Insert each step individually with stepOrder
  for (let i = 0; i < s.steps.length; i++) {
    await conn.execute(
      `INSERT INTO sopTemplates (department, serviceType, stage, stepOrder, stepText, isRequired)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [s.dept, s.service, s.stage, i + 1, s.steps[i]]
    );
  }
  console.log(`  ✓ ${s.dept} — ${s.service} (${s.stage}) — ${s.steps.length} steps`);
  count++;
}

console.log(`\n✅ Expanded SOP seed complete. ${count} service/stage combinations inserted.`);
await conn.end();
