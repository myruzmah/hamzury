import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users (OAuth + portal login) ────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "staff", "agent"]).default("user").notNull(),
  department: varchar("department", { length: 128 }),
  staffId: varchar("staffId", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Staff Members (institutional team) ──────────────────────────────────────
// Separate from OAuth users — represents the real HAMZURY team
export const staffMembers = mysqlTable("staffMembers", {
  id: int("id").autoincrement().primaryKey(),
  staffId: varchar("staffId", { length: 32 }).notNull().unique(), // e.g. STF-001
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  // Institutional role in the hierarchy
  institutionalRole: mysqlEnum("institutionalRole", [
    "founder",   // Strategic oversight — you
    "ceo",       // Operational command — Idris Ibrahim
    "lead",      // Department head — manages a team
    "staff",     // Individual contributor
  ]).default("staff").notNull(),
  // Primary department (they can receive tasks from any dept)
  primaryDepartment: mysqlEnum("primaryDepartment", [
    "CSO",
    "Systems",
    "Studios",
    "Bizdoc",
    "Innovation",
    "Growth",
    "People",
    "Ledger",
    "Executive",
    "Founder",
    "RIDI",
    "Robotics",
  ]).notNull(),
  // Secondary departments (cross-functional capability)
  secondaryDepartments: text("secondaryDepartments"), // JSON array of dept names
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type StaffMember = typeof staffMembers.$inferSelect;
export type InsertStaffMember = typeof staffMembers.$inferInsert;

// ─── SOP Templates (per department + service type) ───────────────────────────
export const sopTemplates = mysqlTable("sopTemplates", {
  id: int("id").autoincrement().primaryKey(),
  department: varchar("department", { length: 128 }).notNull(),
  serviceType: varchar("serviceType", { length: 256 }).notNull(), // e.g. "Business Registration"
  stage: mysqlEnum("stage", ["pre", "during", "post"]).notNull(),
  stepOrder: int("stepOrder").notNull(),
  stepText: text("stepText").notNull(),
  isRequired: boolean("isRequired").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SopTemplate = typeof sopTemplates.$inferSelect;

// ─── Task Lifecycle (full institutional task) ─────────────────────────────────
export const taskLifecycle = mysqlTable("taskLifecycle", {
  id: int("id").autoincrement().primaryKey(),
  taskRef: varchar("taskRef", { length: 32 }).notNull().unique(), // e.g. TSK-2026-001
  title: varchar("title", { length: 512 }).notNull(),
  clientRef: varchar("clientRef", { length: 32 }), // links to clients table
  clientName: varchar("clientName", { length: 256 }),
  // Department this task belongs to
  department: varchar("department", { length: 128 }).notNull(),
  serviceType: varchar("serviceType", { length: 256 }).notNull(),
  // Assignment chain
  assignedByStaffId: varchar("assignedByStaffId", { length: 32 }), // who created/assigned it
  assignedToStaffId: varchar("assignedToStaffId", { length: 32 }).notNull(), // who does the work
  // Lifecycle stage
  lifecycleStage: mysqlEnum("lifecycleStage", [
    "pre",      // Pre-Task checklist
    "during",   // During-Task checklist
    "post",     // Post-Task checklist
    "review",   // Submitted to Lead for approval
    "approved", // Lead approved — delivered
    "rejected", // Lead sent back with comment
    "closed",   // Fully complete
  ]).default("pre").notNull(),
  priority: mysqlEnum("priority", ["normal", "urgent"]).default("normal").notNull(),
  deadline: timestamp("deadline"),
  notes: text("notes"), // brief or instructions from assigner
  rejectionComment: text("rejectionComment"), // Lead's feedback if rejected
  // Approval chain
  reviewedByStaffId: varchar("reviewedByStaffId", { length: 32 }), // Lead who approved/rejected
  reviewedAt: timestamp("reviewedAt"),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaskLifecycle = typeof taskLifecycle.$inferSelect;
export type InsertTaskLifecycle = typeof taskLifecycle.$inferInsert;

// ─── Checklist Items (per task, per stage) ────────────────────────────────────
export const checklistItems = mysqlTable("checklistItems", {
  id: int("id").autoincrement().primaryKey(),
  taskRef: varchar("taskRef", { length: 32 }).notNull(), // links to taskLifecycle
  stage: mysqlEnum("stage", ["pre", "during", "post"]).notNull(),
  stepOrder: int("stepOrder").notNull(),
  stepText: text("stepText").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  isRequired: boolean("isRequired").default(true).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChecklistItem = typeof checklistItems.$inferSelect;

// ─── Audit Trail (every action, timestamped) ─────────────────────────────────
export const auditTrail = mysqlTable("auditTrail", {
  id: int("id").autoincrement().primaryKey(),
  taskRef: varchar("taskRef", { length: 32 }).notNull(),
  staffId: varchar("staffId", { length: 32 }).notNull(),
  staffName: varchar("staffName", { length: 256 }).notNull(),
  action: varchar("action", { length: 512 }).notNull(), // e.g. "Ticked: Client documents received"
  stage: mysqlEnum("stage", ["pre", "during", "post", "system"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditEntry = typeof auditTrail.$inferSelect;

// ─── Founder Private Notes ────────────────────────────────────────────────────
export const founderNotes = mysqlTable("founderNotes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content").notNull(),
  isPrivate: boolean("isPrivate").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FounderNote = typeof founderNotes.$inferSelect;

// ─── Clients (external, token-based access) ──────────────────────────────────
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  clientRef: varchar("clientRef", { length: 32 }).notNull().unique(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  accessToken: varchar("accessToken", { length: 128 }).notNull().unique(),
  servicePackage: varchar("servicePackage", { length: 128 }),
  startDate: timestamp("startDate"),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["Inquiry", "Proposal", "Active", "Delivery", "Closed"]).default("Inquiry").notNull(),
  invoiceStatus: mysqlEnum("invoiceStatus", ["Not Sent", "Sent", "Paid", "Overdue"]).default("Not Sent").notNull(),
  sheetsRowId: varchar("sheetsRowId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ─── Tasks (synced from Google Sheets) ───────────────────────────────────────
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 32 }).notNull().unique(),
  clientRef: varchar("clientRef", { length: 32 }),
  clientName: text("clientName"),
  servicePackage: varchar("servicePackage", { length: 128 }),
  description: text("description"),
  assignedTo: varchar("assignedTo", { length: 128 }),
  department: varchar("department", { length: 128 }),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]).default("Not Started").notNull(),
  qualityGatePassed: boolean("qualityGatePassed").default(false),
  receivedDate: timestamp("receivedDate"),
  completedDate: timestamp("completedDate"),
  sheetsRowId: varchar("sheetsRowId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ─── Deliverables ─────────────────────────────────────────────────────────────
export const deliverables = mysqlTable("deliverables", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 32 }),
  clientRef: varchar("clientRef", { length: 32 }),
  title: text("title").notNull(),
  driveFileId: varchar("driveFileId", { length: 256 }),
  driveUrl: text("driveUrl"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Deliverable = typeof deliverables.$inferSelect;

// ─── Communications Log ───────────────────────────────────────────────────────
export const communications = mysqlTable("communications", {
  id: int("id").autoincrement().primaryKey(),
  clientRef: varchar("clientRef", { length: 32 }).notNull(),
  message: text("message").notNull(),
  author: varchar("author", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Communication = typeof communications.$inferSelect;

// ─── Agents & Referrals ───────────────────────────────────────────────────────
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 32 }).notNull().unique(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  openId: varchar("openId", { length: 64 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 32 }).notNull(),
  clientName: text("clientName").notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  referralDate: timestamp("referralDate").defaultNow().notNull(),
  pipelineStage: mysqlEnum("pipelineStage", ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]).default("Lead").notNull(),
  commissionEstimate: int("commissionEstimate").default(0),
  commissionStatus: mysqlEnum("commissionStatus", ["Pending", "Approved", "Paid"]).default("Pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;

// ─── Google Sheets Sync Log ───────────────────────────────────────────────────
export const sheetsSyncLog = mysqlTable("sheetsSyncLog", {
  id: int("id").autoincrement().primaryKey(),
  sheetName: varchar("sheetName", { length: 128 }).notNull(),
  lastSyncedAt: timestamp("lastSyncedAt").defaultNow().notNull(),
  rowsSynced: int("rowsSynced").default(0),
  status: mysqlEnum("status", ["success", "error"]).default("success").notNull(),
  errorMessage: text("errorMessage"),
});



// ─── Weekly CEO Report (Friday report to Founder) ────────────────────────────
export const weeklyReports = mysqlTable("weeklyReports", {
  id: int("id").autoincrement().primaryKey(),
  reportRef: varchar("reportRef", { length: 32 }).notNull().unique(),
  submittedByStaffId: varchar("submittedByStaffId", { length: 32 }).notNull(),
  submittedByName: varchar("submittedByName", { length: 256 }).notNull(),
  weekEnding: timestamp("weekEnding").notNull(),
  goingWell1: text("goingWell1").notNull(),
  goingWell2: text("goingWell2").notNull(),
  goingWell3: text("goingWell3").notNull(),
  toWatch1: text("toWatch1").notNull(),
  toWatch2: text("toWatch2").notNull(),
  toWatch3: text("toWatch3").notNull(),
  keyInfo: text("keyInfo").notNull(),
  revenueThisWeek: int("revenueThisWeek").default(0).notNull(),
  newClients: int("newClients").default(0).notNull(),
  activeTasks: int("activeTasks").default(0).notNull(),
  overdueTasks: int("overdueTasks").default(0).notNull(),
  staffPresent: int("staffPresent").default(0).notNull(),
  staffTotal: int("staffTotal").default(0).notNull(),
  pendingApprovals: int("pendingApprovals").default(0).notNull(),
  isReadByFounder: boolean("isReadByFounder").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeeklyReport = typeof weeklyReports.$inferSelect;
export type InsertWeeklyReport = typeof weeklyReports.$inferInsert;

// ─── RIDI Impact Records ──────────────────────────────────────────────────────
export const ridiImpact = mysqlTable("ridiImpact", {
  id: int("id").autoincrement().primaryKey(),
  programRef: varchar("programRef", { length: 32 }).notNull().unique(),
  programName: varchar("programName", { length: 256 }).notNull(),
  programType: mysqlEnum("programType", [
    "Digital Skills",
    "Entrepreneurship Training",
    "Climate Education",
    "Robotics",
    "Community Partnership",
  ]).notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  communityPartner: varchar("communityPartner", { length: 256 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["Planning", "Active", "Completed", "On Hold"]).default("Planning").notNull(),
  totalBeneficiaries: int("totalBeneficiaries").default(0).notNull(),
  women: int("women").default(0).notNull(),
  youth: int("youth").default(0).notNull(),
  men: int("men").default(0).notNull(),
  referralsToHamzury: int("referralsToHamzury").default(0).notNull(),
  impactStory: text("impactStory"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RidiImpact = typeof ridiImpact.$inferSelect;
export type InsertRidiImpact = typeof ridiImpact.$inferInsert;

// ─── Client Intake (frictionless no-login submissions) ───────────────────────
export const clientIntake = mysqlTable("clientIntake", {
  id: int("id").autoincrement().primaryKey(),
  referenceCode: varchar("referenceCode", { length: 16 }).notNull().unique(), // e.g. HMZ-2026-0001
  // Contact info
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  // Service request
  department: mysqlEnum("department", [
    "CSO", "Systems", "Studios", "Bizdoc", "Innovation",
    "Growth", "People", "Ledger", "RIDI", "Robotics",
  ]).notNull(),
  serviceType: varchar("serviceType", { length: 256 }).notNull(),
  description: text("description").notNull(),
  // Optional file attachment (S3 URL)
  attachmentUrl: text("attachmentUrl"),
  attachmentName: varchar("attachmentName", { length: 256 }),
  // Status lifecycle
  status: mysqlEnum("status", [
    "new",        // just submitted
    "reviewing",  // CSO has seen it
    "in_progress",// task created and assigned
    "completed",  // delivered
    "closed",     // archived
  ]).default("new").notNull(),
  // Internal notes (CSO only)
  csoNotes: text("csoNotes"),
  assignedTaskId: int("assignedTaskId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ClientIntake = typeof clientIntake.$inferSelect;
export type InsertClientIntake = typeof clientIntake.$inferInsert;

// ─── Task Files (deliverables uploaded by staff) ─────────────────────────────────────
export const taskFiles = mysqlTable("taskFiles", {
  id: int("id").autoincrement().primaryKey(),
  taskRef: varchar("taskRef", { length: 32 }).notNull(),
  uploadedByStaffId: varchar("uploadedByStaffId", { length: 32 }).notNull(),
  uploadedByName: varchar("uploadedByName", { length: 256 }).notNull(),
  fileName: varchar("fileName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSizeBytes: int("fileSizeBytes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TaskFile = typeof taskFiles.$inferSelect;

// ─── Lead Department Weekly Reports ──────────────────────────────────────────────
export const leadReports = mysqlTable("leadReports", {
  id: int("id").autoincrement().primaryKey(),
  reportRef: varchar("reportRef", { length: 32 }).notNull().unique(),
  submittedByStaffId: varchar("submittedByStaffId", { length: 32 }).notNull(),
  submittedByName: varchar("submittedByName", { length: 256 }).notNull(),
  department: varchar("department", { length: 128 }).notNull(),
  weekEnding: timestamp("weekEnding").notNull(),
  win1: text("win1").notNull(),
  win2: text("win2").notNull(),
  win3: text("win3").notNull(),
  blocker1: text("blocker1").notNull(),
  blocker2: text("blocker2").notNull(),
  keyInfo: text("keyInfo").notNull(),
  tasksCompleted: int("tasksCompleted").default(0).notNull(),
  tasksInProgress: int("tasksInProgress").default(0).notNull(),
  tasksOverdue: int("tasksOverdue").default(0).notNull(),
  isReadByFounder: boolean("isReadByFounder").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type LeadReport = typeof leadReports.$inferSelect;

// ─── Staff Notifications ──────────────────────────────────────────────────────────────────
export const staffNotifications = mysqlTable("staffNotifications", {
  id: int("id").autoincrement().primaryKey(),
  staffId: varchar("staffId", { length: 32 }).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["task_assigned", "task_approved", "task_rejected", "general"]).default("general").notNull(),
  taskRef: varchar("taskRef", { length: 32 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StaffNotification = typeof staffNotifications.$inferSelect;

// ─── RIDI Scholarship Applications ───────────────────────────────────────────
export const ridiScholarshipApplications = mysqlTable("ridiScholarshipApplications", {
  id: int("id").autoincrement().primaryKey(),
  applicationRef: varchar("applicationRef", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  state: varchar("state", { length: 128 }).notNull(),
  lga: varchar("lga", { length: 128 }).notNull(),
  age: int("age").notNull(),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]).notNull(),
  areaOfInterest: varchar("areaOfInterest", { length: 256 }).notNull(),
  story: text("story").notNull(),
  status: mysqlEnum("status", ["Pending", "Shortlisted", "Accepted", "Declined"]).default("Pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RidiScholarshipApplication = typeof ridiScholarshipApplications.$inferSelect;

// ─── RIDI Donations ───────────────────────────────────────────────────────────
export const ridiDonations = mysqlTable("ridiDonations", {
  id: int("id").autoincrement().primaryKey(),
  donationRef: varchar("donationRef", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  amount: varchar("amount", { length: 64 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["Pending", "Confirmed"]).default("Pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RidiDonation = typeof ridiDonations.$inferSelect;

// ─── Task Comments (replaces WhatsApp for task communication) ─────────────────
export const taskComments = mysqlTable("taskComments", {
  id: int("id").autoincrement().primaryKey(),
  taskRef: varchar("taskRef", { length: 32 }).notNull(),
  authorStaffId: varchar("authorStaffId", { length: 32 }).notNull(),
  authorName: varchar("authorName", { length: 256 }).notNull(),
  authorRole: varchar("authorRole", { length: 64 }).notNull(), // founder/ceo/lead/staff
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TaskComment = typeof taskComments.$inferSelect;

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceRef: varchar("invoiceRef", { length: 32 }).notNull().unique(), // e.g. INV-2026-001
  clientRef: varchar("clientRef", { length: 32 }),
  clientName: varchar("clientName", { length: 256 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  taskRef: varchar("taskRef", { length: 32 }),
  description: text("description").notNull(),
  amountNaira: int("amountNaira").notNull().default(0),
  ridiAllocation: int("ridiAllocation").notNull().default(0), // 10% of amountNaira
  status: mysqlEnum("status", ["Draft", "Sent", "Paid", "Overdue", "Cancelled"]).default("Draft").notNull(),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  createdByStaffId: varchar("createdByStaffId", { length: 32 }).notNull(),
  notes: text("notes"),
  paystackRef: varchar("paystackRef", { length: 128 }), // Paystack payment reference
  paystackUrl: text("paystackUrl"), // Paystack payment link URL
  // Payment method fields
  receiptUrl: text("receiptUrl"), // S3 URL of uploaded bank transfer receipt
  receiptFileName: varchar("receiptFileName", { length: 256 }), // Original file name
  receiptUploadedAt: timestamp("receiptUploadedAt"), // When receipt was uploaded
  internationalPaymentLink: text("internationalPaymentLink"), // External payment link for international clients
  paymentMethod: mysqlEnum("paymentMethod", ["bank_transfer", "international_link", "paystack"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ─── Expenses (with tiered approval chain) ────────────────────────────────────
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  expenseRef: varchar("expenseRef", { length: 32 }).notNull().unique(), // e.g. EXP-2026-001
  submittedByStaffId: varchar("submittedByStaffId", { length: 32 }).notNull(),
  submittedByName: varchar("submittedByName", { length: 256 }).notNull(),
  department: varchar("department", { length: 128 }).notNull(),
  description: text("description").notNull(),
  amountNaira: int("amountNaira").notNull(),
  category: mysqlEnum("category", ["Operations", "Travel", "Equipment", "Software", "Training", "Marketing", "Other"]).default("Operations").notNull(),
  // Approval chain — determined by amount
  // ≤50k: Lead approves, 50k-200k: CEO approves, >200k: Founder approves
  approvalLevel: mysqlEnum("approvalLevel", ["lead", "ceo", "founder"]).notNull(),
  status: mysqlEnum("status", ["Pending", "Approved", "Rejected"]).default("Pending").notNull(),
  approvedByStaffId: varchar("approvedByStaffId", { length: 32 }),
  approvedByName: varchar("approvedByName", { length: 256 }),
  approvedAt: timestamp("approvedAt"),
  rejectionReason: text("rejectionReason"),
  receiptUrl: text("receiptUrl"), // S3 URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

// ─── UCC Forms (Understanding Client Context — qualification form) ────────────
export const uccForms = mysqlTable("uccForms", {
  id: int("id").autoincrement().primaryKey(),
  clientId: varchar("clientId", { length: 32 }).notNull().unique(), // format: DD/MM-sequential
  intakeRef: varchar("intakeRef", { length: 32 }), // links to clientIntake
  // Contact
  businessName: varchar("businessName", { length: 256 }).notNull(),
  contactName: varchar("contactName", { length: 256 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 32 }).notNull(),
  // Business context
  industry: varchar("industry", { length: 256 }).notNull(),
  businessGoals: text("businessGoals").notNull(),
  currentChallenges: text("currentChallenges").notNull(),
  targetAudience: text("targetAudience"),
  // Scope
  budgetRange: mysqlEnum("budgetRange", [
    "Under ₦100k", "₦100k–₦500k", "₦500k–₦1m", "₦1m–₦5m", "Above ₦5m"
  ]).notNull(),
  timeline: mysqlEnum("timeline", [
    "Urgent (under 2 weeks)", "1 month", "2–3 months", "3–6 months", "Flexible"
  ]).notNull(),
  preferredContact: mysqlEnum("preferredContact", ["Email", "WhatsApp", "Phone", "Any"]).default("WhatsApp").notNull(),
  additionalNotes: text("additionalNotes"),
  // CSO internal
  csoLeadId: varchar("csoLeadId", { length: 32 }),
  status: mysqlEnum("status", ["Submitted", "Reviewed", "Clarity Sent", "Converted", "Lost"]).default("Submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UccForm = typeof uccForms.$inferSelect;
export type InsertUccForm = typeof uccForms.$inferInsert;

// ─── Innovation Hub Enrolments ────────────────────────────────────────────────
export const innovationEnrolments = mysqlTable("innovationEnrolments", {
  id: int("id").autoincrement().primaryKey(),
  enrolmentRef: varchar("enrolmentRef", { length: 32 }).notNull().unique(),
  participantName: varchar("participantName", { length: 256 }).notNull(),
  participantEmail: varchar("participantEmail", { length: 320 }).notNull(),
  participantPhone: varchar("participantPhone", { length: 32 }),
  programmeType: mysqlEnum("programmeType", [
    "Executive Class", "Young Innovators", "Tech Bootcamp",
    "Internship", "Corporate Training", "Robotics"
  ]).notNull(),
  cohort: varchar("cohort", { length: 64 }), // e.g. "Cohort 1 — March 2026"
  status: mysqlEnum("status", ["Applied", "Shortlisted", "Enrolled", "Completed", "Withdrawn"]).default("Applied").notNull(),
  source: mysqlEnum("source", ["Direct", "RIDI Scholarship", "Corporate", "Agent Referral"]).default("Direct").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type InnovationEnrolment = typeof innovationEnrolments.$inferSelect;
export type InsertInnovationEnrolment = typeof innovationEnrolments.$inferInsert;

// ─── Affiliate Applications ───────────────────────────────────────────────────
export const affiliateApplications = mysqlTable("affiliateApplications", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  affiliateCode: varchar("affiliateCode", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateApplication = typeof affiliateApplications.$inferSelect;
