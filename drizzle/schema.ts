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
