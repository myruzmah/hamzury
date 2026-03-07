import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users (staff, agents, admins via OAuth) ────────────────────────────────
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

// ─── Clients (external, token-based access) ──────────────────────────────────
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  clientRef: varchar("clientRef", { length: 32 }).notNull().unique(), // e.g. CLT-001
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  accessToken: varchar("accessToken", { length: 128 }).notNull().unique(),
  servicePackage: varchar("servicePackage", { length: 128 }),
  startDate: timestamp("startDate"),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["Inquiry", "Proposal", "Active", "Delivery", "Closed"]).default("Inquiry").notNull(),
  invoiceStatus: mysqlEnum("invoiceStatus", ["Not Sent", "Sent", "Paid", "Overdue"]).default("Not Sent").notNull(),
  sheetsRowId: varchar("sheetsRowId", { length: 64 }), // reference to Google Sheets row
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ─── Tasks (synced from Google Sheets) ───────────────────────────────────────
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 32 }).notNull().unique(), // e.g. TSK-2026-031
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
  agentId: varchar("agentId", { length: 32 }).notNull().unique(), // e.g. AGT-001
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  openId: varchar("openId", { length: 64 }).unique(), // linked to users table if they log in
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
  commissionEstimate: int("commissionEstimate").default(0), // in minor currency units (kobo/cents)
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
