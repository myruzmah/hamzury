/**
 * HAMZURY Staff Seed Script
 * Run: node server/seed-staff.mjs
 * Seeds all 10 real staff members + SOP templates for all 11 departments
 */

import { createConnection } from "mysql2/promise";
import { createHash } from "crypto";
import { readFileSync } from "fs";

// Simple password hash using SHA-256 (matches our auth logic)
function hashPassword(password) {
  return createHash("sha256").update(password + "hamzury_salt_2026").digest("hex");
}

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Parse MySQL URL
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

// ─── STAFF MEMBERS ────────────────────────────────────────────────────────────
// Institutional Hierarchy:
// Founder: Haruna Muhammad (the user)
// CEO + Systems Lead: Idris Ibrahim
// Leads: Aisha Musa (Studios), Fatima Yusuf (Bizdoc), Ahmad Lawal (Growth/BizDev)
//        Maryam Sani (People/HR), Umar Abdullahi (Ledger/Finance)
//        Ibrahim Hassan (Innovation Hub), Zainab Umar (RIDI)
// Staff: Suleiman Ahmad Bashir (Studios + Bizdoc compliance)
//        Abubakar Bashir (Studios designer)

const staffMembers = [
  {
    staffId: "STF-001",
    name: "Haruna Muhammad",
    email: "haruna@hamzury.com",
    password: "founder@hamzury2026",
    institutionalRole: "founder",
    primaryDepartment: "Founder",
    secondaryDepartments: JSON.stringify(["CSO", "Executive", "RIDI"]),
  },
  {
    staffId: "STF-002",
    name: "Idris Ibrahim",
    email: "idris@hamzury.com",
    password: "idris@hamzury2026",
    institutionalRole: "ceo",
    primaryDepartment: "Systems",
    secondaryDepartments: JSON.stringify(["Executive", "CSO"]),
  },
  {
    staffId: "STF-003",
    name: "Aisha Musa",
    email: "aisha@hamzury.com",
    password: "aisha@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Studios",
    secondaryDepartments: JSON.stringify(["Growth"]),
  },
  {
    staffId: "STF-004",
    name: "Fatima Yusuf",
    email: "fatima@hamzury.com",
    password: "fatima@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Bizdoc",
    secondaryDepartments: JSON.stringify(["CSO"]),
  },
  {
    staffId: "STF-005",
    name: "Ahmad Lawal",
    email: "ahmad@hamzury.com",
    password: "ahmad@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Growth",
    secondaryDepartments: JSON.stringify(["CSO", "Innovation"]),
  },
  {
    staffId: "STF-006",
    name: "Maryam Sani",
    email: "maryam@hamzury.com",
    password: "maryam@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "People",
    secondaryDepartments: JSON.stringify(["Executive"]),
  },
  {
    staffId: "STF-007",
    name: "Umar Abdullahi",
    email: "umar@hamzury.com",
    password: "umar@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Ledger",
    secondaryDepartments: JSON.stringify(["Executive"]),
  },
  {
    staffId: "STF-008",
    name: "Ibrahim Hassan",
    email: "ibrahim@hamzury.com",
    password: "ibrahim@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Innovation",
    secondaryDepartments: JSON.stringify(["Robotics", "Systems"]),
  },
  {
    staffId: "STF-009",
    name: "Zainab Umar",
    email: "zainab@hamzury.com",
    password: "zainab@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "RIDI",
    secondaryDepartments: JSON.stringify(["People", "Growth"]),
  },
  {
    staffId: "STF-010",
    name: "Suleiman Ahmad Bashir",
    email: "suleiman@hamzury.com",
    password: "suleiman@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Studios",
    secondaryDepartments: JSON.stringify(["Bizdoc"]),
  },
  {
    staffId: "STF-011",
    name: "Abubakar Bashir",
    email: "abubakar@hamzury.com",
    password: "abubakar@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Studios",
    secondaryDepartments: JSON.stringify([]),
  },
];

console.log("Seeding staff members...");
for (const s of staffMembers) {
  const hash = hashPassword(s.password);
  await conn.execute(
    `INSERT INTO staffMembers (staffId, name, email, passwordHash, institutionalRole, primaryDepartment, secondaryDepartments, isActive)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       passwordHash = VALUES(passwordHash),
       institutionalRole = VALUES(institutionalRole),
       primaryDepartment = VALUES(primaryDepartment),
       secondaryDepartments = VALUES(secondaryDepartments),
       isActive = 1`,
    [s.staffId, s.name, s.email, hash, s.institutionalRole, s.primaryDepartment, s.secondaryDepartments]
  );
  console.log(`  ✓ ${s.name} (${s.staffId}) — ${s.institutionalRole} @ ${s.primaryDepartment}`);
}

// ─── SOP TEMPLATES ────────────────────────────────────────────────────────────
const sopData = [
  // BIZDOC — Business Registration
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
    "Keep client informed of progress at each milestone",
  ]},
  { dept: "Bizdoc", service: "Business Registration", stage: "post", steps: [
    "Confirm certificate has been received and is accurate",
    "Deliver certified copies to client with explanation of next steps",
    "Update client record in Central Master Tracker",
    "File all documents in the client's digital folder",
    "Request client feedback and close the task",
  ]},

  // STUDIOS — Brand Identity
  { dept: "Studios", service: "Brand Identity Design", stage: "pre", steps: [
    "Complete brand discovery questionnaire with client",
    "Research client's industry, competitors, and target audience",
    "Define brand personality, tone, and visual direction",
    "Confirm deliverables list: logo, palette, typography, brand guide",
    "Set revision rounds and timeline expectations with client",
  ]},
  { dept: "Studios", service: "Brand Identity Design", stage: "during", steps: [
    "Develop 3 initial concept directions for client review",
    "Present concepts with rationale — do not present without context",
    "Incorporate client feedback within agreed revision scope",
    "Ensure all assets are designed at correct resolution and format",
    "Conduct internal quality review before client presentation",
  ]},
  { dept: "Studios", service: "Brand Identity Design", stage: "post", steps: [
    "Package all final files in correct formats (AI, PNG, PDF, SVG)",
    "Deliver brand guide document with usage rules",
    "Upload all assets to client's designated Google Drive folder",
    "Update project status in Central Master Tracker",
    "Request testimonial or feedback from client",
  ]},

  // GROWTH — Business Development
  { dept: "Growth", service: "Business Development Strategy", stage: "pre", steps: [
    "Conduct initial business audit and market positioning review",
    "Define growth objectives and KPIs with client",
    "Identify target markets and ideal customer profile",
    "Review existing sales pipeline and conversion data",
  ]},
  { dept: "Growth", service: "Business Development Strategy", stage: "during", steps: [
    "Develop go-to-market strategy document",
    "Create partnership and channel development plan",
    "Build revenue model projections with assumptions clearly stated",
    "Present strategy to client for alignment and approval",
  ]},
  { dept: "Growth", service: "Business Development Strategy", stage: "post", steps: [
    "Deliver final strategy document and implementation roadmap",
    "Set 30/60/90 day review checkpoints with client",
    "Update project record in Central Master Tracker",
    "Archive all working documents in client folder",
  ]},

  // SYSTEMS — Process Design
  { dept: "Systems", service: "Process Design & Automation", stage: "pre", steps: [
    "Map existing processes and identify inefficiencies",
    "Define scope of automation and integration requirements",
    "Confirm technology stack and tool availability",
    "Set delivery milestones and testing protocol",
  ]},
  { dept: "Systems", service: "Process Design & Automation", stage: "during", steps: [
    "Design new process flows with clear documentation",
    "Build and test automation workflows in staging environment",
    "Conduct user acceptance testing with client team",
    "Document all system configurations and credentials securely",
  ]},
  { dept: "Systems", service: "Process Design & Automation", stage: "post", steps: [
    "Deploy to production with rollback plan in place",
    "Train client team on new processes and tools",
    "Provide 30-day post-deployment support window",
    "Update project record and archive documentation",
  ]},

  // PEOPLE — HR Consulting
  { dept: "People", service: "HR Consulting", stage: "pre", steps: [
    "Conduct HR audit: policies, contracts, org chart, compliance",
    "Identify gaps in HR infrastructure",
    "Define scope: recruitment, policy design, training, or culture",
    "Confirm deliverables and timeline with client",
  ]},
  { dept: "People", service: "HR Consulting", stage: "during", steps: [
    "Develop HR policies and procedures tailored to client context",
    "Design job descriptions and competency frameworks",
    "Facilitate training sessions or workshops as agreed",
    "Review and improve onboarding and offboarding processes",
  ]},
  { dept: "People", service: "HR Consulting", stage: "post", steps: [
    "Deliver final HR documentation package",
    "Ensure client team understands and can implement all policies",
    "Update project record in Central Master Tracker",
    "Schedule 90-day follow-up review",
  ]},

  // LEDGER — Financial Consulting
  { dept: "Ledger", service: "Financial Consulting", stage: "pre", steps: [
    "Collect and review client's financial statements (last 12 months)",
    "Identify key financial health indicators and red flags",
    "Define scope: bookkeeping, forecasting, tax planning, or audit prep",
    "Confirm data access and confidentiality protocols",
  ]},
  { dept: "Ledger", service: "Financial Consulting", stage: "during", steps: [
    "Reconcile accounts and correct any discrepancies",
    "Build financial models and projections as agreed",
    "Prepare tax documentation or audit-ready reports",
    "Present findings and recommendations to client leadership",
  ]},
  { dept: "Ledger", service: "Financial Consulting", stage: "post", steps: [
    "Deliver final financial reports and models",
    "Ensure client understands key metrics and action items",
    "Update project record in Central Master Tracker",
    "Archive all financial documents securely",
  ]},

  // INNOVATION HUB
  { dept: "Innovation", service: "Innovation Consulting", stage: "pre", steps: [
    "Conduct innovation readiness assessment with client",
    "Map current product/service portfolio and identify gaps",
    "Define innovation challenge and success criteria",
    "Assemble cross-functional team if required",
  ]},
  { dept: "Innovation", service: "Innovation Consulting", stage: "during", steps: [
    "Facilitate ideation workshops and design thinking sessions",
    "Prototype and test selected concepts",
    "Develop business case for top innovation opportunities",
    "Present findings and recommendations to client",
  ]},
  { dept: "Innovation", service: "Innovation Consulting", stage: "post", steps: [
    "Deliver innovation roadmap and implementation plan",
    "Identify quick wins and long-term initiatives",
    "Update project record in Central Master Tracker",
    "Schedule quarterly review to track progress",
  ]},

  // RIDI
  { dept: "RIDI", service: "Rural Impact Initiative", stage: "pre", steps: [
    "Identify target community and assess needs",
    "Define impact objectives and measurable outcomes",
    "Confirm budget allocation (10% profit pool) and timeline",
    "Engage community leaders and stakeholders",
  ]},
  { dept: "RIDI", service: "Rural Impact Initiative", stage: "during", steps: [
    "Execute initiative according to approved plan",
    "Document all activities with photos and written records",
    "Track beneficiary numbers and impact metrics",
    "Report progress to Founder weekly",
  ]},
  { dept: "RIDI", service: "Rural Impact Initiative", stage: "post", steps: [
    "Compile impact report with data and testimonials",
    "Publish summary to HAMZURY public communications",
    "Update RIDI tracker in Central Master Tracker",
    "Plan next initiative cycle",
  ]},
];

console.log("Seeding SOP templates...");
for (const entry of sopData) {
  for (let i = 0; i < entry.steps.length; i++) {
    await conn.execute(
      `INSERT INTO sopTemplates (department, serviceType, stage, stepOrder, stepText, isRequired)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE stepText = VALUES(stepText)`,
      [entry.dept, entry.service, entry.stage, i + 1, entry.steps[i]]
    );
  }
  console.log(`  ✓ ${entry.dept} — ${entry.service} (${entry.stage})`);
}

await conn.end();
console.log("\n✅ Seed complete. All staff members and SOP templates are in the database.");
console.log("\n📋 Staff Credentials:");
for (const s of staffMembers) {
  console.log(`  ${s.staffId} | ${s.name.padEnd(25)} | ${s.email.padEnd(30)} | ${s.password}`);
}
