/**
 * HAMZURY Demo Task Seed Script v2
 * Seeds one realistic demonstration task per department
 * Uses correct schema column names from drizzle/schema.ts
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Get staff by email → { id, staffId, institutionalRole, primaryDepartment }
const [staffRows] = await db.execute(
  "SELECT id, staffId, email, institutionalRole, primaryDepartment FROM staffMembers"
);
const staff = {};
for (const s of staffRows) {
  staff[s.email] = s;
}

const idris    = staff["idris@hamzury.com"];
const maryam   = staff["maryam@hamzury.com"];
const abdullahi= staff["abdullahi@hamzury.com"];
const muhammad = staff["muhammad@hamzury.com"];
const khadija  = staff["khadija@hamzury.com"];
const habiba   = staff["habiba@hamzury.com"];
const suleiman = staff["suleiman@hamzury.com"];
const abubakar = staff["abubakar@hamzury.com"];
const farida   = staff["farida@hamzury.com"];

const now = new Date();
const day = 86400000;

// Helper: generate a task ref
let taskCounter = 1;
function nextRef() {
  return `TSK-2026-${String(taskCounter++).padStart(3, "0")}`;
}

const DEMO_TASKS = [
  {
    ref: nextRef(),
    title: "Brand Identity Package — Kano Fresh Foods",
    notes: "Full brand identity design for a food distribution company. Includes logo, colour palette, typography, and brand guidelines PDF.",
    department: "Studios",
    serviceType: "Brand Identity Design",
    priority: "urgent",
    assignedToStaffId: suleiman?.staffId,
    assignedByStaffId: maryam?.staffId,
    lifecycleStage: "during",
    deadline: new Date(Date.now() + 5 * day),
    clientName: "Kano Fresh Foods",
    checklist: [
      { stage: "pre",    text: "Receive client brief and brand questionnaire from CSO",             done: true  },
      { stage: "pre",    text: "Research client industry, competitors, and target audience",         done: true  },
      { stage: "pre",    text: "Prepare mood board and style direction for Lead review",             done: false },
      { stage: "during", text: "Design 3 logo concepts for client review",                          done: false },
      { stage: "during", text: "Develop selected concept into full brand identity system",           done: false },
      { stage: "during", text: "Create brand guidelines PDF",                                       done: false },
      { stage: "post",   text: "Lead quality review of all brand assets",                           done: false },
      { stage: "post",   text: "Package all files in correct formats (AI, PNG, PDF)",               done: false },
      { stage: "post",   text: "Submit to CSO for client delivery",                                 done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "CAC Business Name Registration — Zaria Agro Ltd",
    notes: "Business name registration with the Corporate Affairs Commission for a new agricultural company.",
    department: "Bizdoc",
    serviceType: "CAC Business Name Registration",
    priority: "urgent",
    assignedToStaffId: abubakar?.staffId,
    assignedByStaffId: abdullahi?.staffId,
    lifecycleStage: "pre",
    deadline: new Date(Date.now() + 7 * day),
    clientName: "Zaria Agro Ltd",
    checklist: [
      { stage: "pre",    text: "Collect client identification documents from CSO",                  done: false },
      { stage: "pre",    text: "Conduct name availability search on CAC portal",                    done: false },
      { stage: "pre",    text: "Confirm name availability with client via CSO",                     done: false },
      { stage: "during", text: "Complete CAC online registration form",                             done: false },
      { stage: "during", text: "Upload all required documents to CAC portal",                       done: false },
      { stage: "during", text: "Make payment and obtain payment receipt",                           done: false },
      { stage: "post",   text: "Download and verify registration certificate",                      done: false },
      { stage: "post",   text: "Lead quality review of all documents",                              done: false },
      { stage: "post",   text: "Submit certificate to CSO for client delivery",                     done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "Business Website — Kaduna Logistics Hub",
    notes: "5-page business website for a logistics company. Includes homepage, services, about, contact, and tracking page.",
    department: "Systems",
    serviceType: "Business Website",
    priority: "normal",
    assignedToStaffId: idris?.staffId,
    assignedByStaffId: idris?.staffId,
    lifecycleStage: "pre",
    deadline: new Date(Date.now() + 14 * day),
    clientName: "Kaduna Logistics Hub",
    checklist: [
      { stage: "pre",    text: "Receive website brief and content from CSO",                        done: false },
      { stage: "pre",    text: "Create sitemap and page structure for Lead review",                 done: false },
      { stage: "pre",    text: "Set up development environment and repository",                     done: false },
      { stage: "during", text: "Build homepage with hero, services, and CTA sections",              done: false },
      { stage: "during", text: "Build services, about, and contact pages",                          done: false },
      { stage: "during", text: "Integrate contact form and test all links",                         done: false },
      { stage: "post",   text: "Cross-browser and mobile responsiveness testing",                   done: false },
      { stage: "post",   text: "Lead quality review and sign-off",                                  done: false },
      { stage: "post",   text: "Deploy to production and submit to CSO",                            done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "Digital Skills Cohort 3 — Preparation",
    notes: "Prepare curriculum, materials, and scholarship selection for the third digital skills cohort.",
    department: "Innovation",
    serviceType: "Digital Skills Training",
    priority: "normal",
    assignedToStaffId: habiba?.staffId,
    assignedByStaffId: idris?.staffId,
    lifecycleStage: "pre",
    deadline: new Date(Date.now() + 10 * day),
    clientName: "HAMZURY Internal",
    checklist: [
      { stage: "pre",    text: "Review feedback from Cohort 2 and identify improvements",           done: false },
      { stage: "pre",    text: "Finalise Cohort 3 curriculum and learning objectives",              done: false },
      { stage: "pre",    text: "Open scholarship applications and set selection criteria",          done: false },
      { stage: "during", text: "Review and shortlist scholarship applications",                     done: false },
      { stage: "during", text: "Prepare all training materials and slides",                         done: false },
      { stage: "during", text: "Confirm venue, dates, and facilitators",                            done: false },
      { stage: "post",   text: "Announce selected scholars and send acceptance letters",            done: false },
      { stage: "post",   text: "Submit cohort plan to CEO for approval",                            done: false },
      { stage: "post",   text: "Publish cohort announcement on HAMZURY channels",                  done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "Monthly Financial Report — February 2026",
    notes: "Prepare and submit the February 2026 financial report including revenue, expenses, commissions, and RIDI allocation.",
    department: "Ledger",
    serviceType: "Financial Reporting",
    priority: "urgent",
    assignedToStaffId: muhammad?.staffId,
    assignedByStaffId: idris?.staffId,
    lifecycleStage: "during",
    deadline: new Date(Date.now() + 2 * day),
    clientName: "HAMZURY Internal",
    checklist: [
      { stage: "pre",    text: "Collect all revenue records for February 2026",                     done: true  },
      { stage: "pre",    text: "Collect all expense claims and receipts",                           done: true  },
      { stage: "pre",    text: "Reconcile all transactions with bank records",                      done: false },
      { stage: "during", text: "Calculate total revenue, expenses, and net profit",                 done: false },
      { stage: "during", text: "Calculate 10% RIDI allocation from net profit",                     done: false },
      { stage: "during", text: "Calculate and process agent commissions",                           done: false },
      { stage: "post",   text: "Prepare formatted financial report PDF",                            done: false },
      { stage: "post",   text: "Submit report to CEO for review",                                   done: false },
      { stage: "post",   text: "Process RIDI allocation transfer",                                  done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "Staff Recruitment — Systems Intern",
    notes: "Recruit one Systems intern from the Innovation Hub Cohort 2 graduates.",
    department: "People",
    serviceType: "Recruitment",
    priority: "normal",
    assignedToStaffId: khadija?.staffId,
    assignedByStaffId: idris?.staffId,
    lifecycleStage: "pre",
    deadline: new Date(Date.now() + 14 * day),
    clientName: "HAMZURY Internal",
    checklist: [
      { stage: "pre",    text: "Review Cohort 2 graduate performance records",                      done: false },
      { stage: "pre",    text: "Shortlist top 3 candidates for Systems internship",                 done: false },
      { stage: "pre",    text: "Prepare internship offer letter template",                          done: false },
      { stage: "during", text: "Conduct brief interview with shortlisted candidates",               done: false },
      { stage: "during", text: "Select final candidate and prepare offer",                          done: false },
      { stage: "during", text: "Send offer letter and collect acceptance",                          done: false },
      { stage: "post",   text: "Prepare onboarding document for new intern",                        done: false },
      { stage: "post",   text: "Submit to CEO for approval",                                        done: false },
      { stage: "post",   text: "Complete onboarding and assign to Systems Lead",                    done: false },
    ],
  },
  {
    ref: nextRef(),
    title: "HAMZURY Podcast — Episode 4: Business Registration in Nigeria",
    notes: "Record and produce Episode 4 of the HAMZURY podcast. Topic: A step-by-step guide to CAC registration.",
    department: "Studios",
    serviceType: "Podcast Production",
    priority: "normal",
    assignedToStaffId: farida?.staffId,
    assignedByStaffId: maryam?.staffId,
    lifecycleStage: "pre",
    deadline: new Date(Date.now() + 7 * day),
    clientName: "HAMZURY Internal",
    checklist: [
      { stage: "pre",    text: "Research topic and prepare episode script",                         done: false },
      { stage: "pre",    text: "Brief Abdullahi Musa (Bizdoc Lead) as guest expert",                done: false },
      { stage: "pre",    text: "Prepare recording environment and equipment",                       done: false },
      { stage: "during", text: "Record episode with guest",                                         done: false },
      { stage: "during", text: "Edit audio and add intro/outro",                                    done: false },
      { stage: "during", text: "Design episode artwork",                                            done: false },
      { stage: "post",   text: "Lead quality review of audio and artwork",                          done: false },
      { stage: "post",   text: "Upload to podcast platform",                                        done: false },
      { stage: "post",   text: "Publish social media announcement",                                 done: false },
    ],
  },
];

let taskCount = 0;
let checklistCount = 0;

for (const task of DEMO_TASKS) {
  if (!task.assignedToStaffId) {
    console.log(`⚠ Skipping "${task.title}" — assignee staffId not found`);
    continue;
  }

  // Insert task into taskLifecycle
  await db.execute(
    `INSERT INTO taskLifecycle 
     (taskRef, title, clientName, department, serviceType, assignedByStaffId, assignedToStaffId, lifecycleStage, priority, deadline, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.ref,
      task.title,
      task.clientName,
      task.department,
      task.serviceType,
      task.assignedByStaffId || idris?.staffId,
      task.assignedToStaffId,
      task.lifecycleStage,
      task.priority,
      task.deadline,
      task.notes,
      now,
    ]
  );

  taskCount++;

  // Insert checklist items using taskRef
  for (let i = 0; i < task.checklist.length; i++) {
    const item = task.checklist[i];
    await db.execute(
      `INSERT INTO checklistItems (taskRef, stage, stepOrder, stepText, isCompleted, completedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        task.ref,
        item.stage,
        i + 1,
        item.text,
        item.done ? 1 : 0,
        item.done ? new Date(Date.now() - Math.floor(Math.random() * 3600000)) : null,
      ]
    );
    checklistCount++;
  }

  console.log(`✓ [${task.ref}] "${task.title}" → ${task.checklist.length} checklist items`);
}

await db.end();
console.log(`\n✅ Seeded ${taskCount} demo tasks with ${checklistCount} checklist items`);
