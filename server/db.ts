import { and, desc, eq, gte, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  agents,
  auditTrail,
  checklistItems,
  clientIntake,
  ClientIntake,
  clients,
  communications,
  deliverables,
  founderNotes,
  InsertClient,
  InsertClientIntake,
  InsertTask,
  InsertUser,
  InsertWeeklyReport,
  InsertRidiImpact,
  referrals,
  affiliateApplications,
  ridiImpact,
  sopTemplates,
  staffMembers,
  taskFiles,
  leadReports,
  staffNotifications,
  taskLifecycle,
  tasks,
  users,
  weeklyReports,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod", "department", "staffId"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

// ─── Staff Members (institutional team) ──────────────────────────────────────
import { createHash } from "crypto";

export function hashStaffPassword(password: string): string {
  return createHash("sha256").update(password + "hamzury_salt_2026").digest("hex");
}

export async function getStaffMemberByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(staffMembers).where(eq(staffMembers.email, email)).limit(1);
  return result[0];
}

export async function getStaffMemberById(staffId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(staffMembers).where(eq(staffMembers.staffId, staffId)).limit(1);
  return result[0];
}

export async function getAllStaffMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staffMembers).where(eq(staffMembers.isActive, true)).orderBy(staffMembers.name);
}

export async function getStaffByDepartment(department: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staffMembers)
    .where(and(eq(staffMembers.primaryDepartment, department as any), eq(staffMembers.isActive, true)))
    .orderBy(staffMembers.name);
}

export async function updateStaffLastSignIn(staffId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(staffMembers).set({ lastSignedIn: new Date() }).where(eq(staffMembers.staffId, staffId));
}

// ─── Task Lifecycle ───────────────────────────────────────────────────────────
export async function createTaskLifecycle(data: {
  taskRef: string;
  title: string;
  clientRef?: string;
  clientName?: string;
  department: string;
  serviceType: string;
  assignedByStaffId?: string;
  assignedToStaffId: string;
  priority?: "normal" | "urgent";
  deadline?: Date;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(taskLifecycle).values({
    ...data,
    lifecycleStage: "pre",
    priority: data.priority ?? "normal",
  });
}

export async function getTasksByStaffId(staffId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskLifecycle)
    .where(eq(taskLifecycle.assignedToStaffId, staffId))
    .orderBy(desc(taskLifecycle.createdAt));
}

export async function getTasksAssignedByStaff(staffId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskLifecycle)
    .where(eq(taskLifecycle.assignedByStaffId, staffId))
    .orderBy(desc(taskLifecycle.createdAt));
}

export async function getAllTaskLifecycle() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskLifecycle).orderBy(desc(taskLifecycle.createdAt));
}

export async function getTasksByDepartment(department: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskLifecycle)
    .where(eq(taskLifecycle.department, department))
    .orderBy(desc(taskLifecycle.createdAt));
}

export async function getTasksForReview(department: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskLifecycle)
    .where(and(eq(taskLifecycle.department, department), eq(taskLifecycle.lifecycleStage, "review")))
    .orderBy(desc(taskLifecycle.createdAt));
}

export async function getTaskByRef(taskRef: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(taskLifecycle).where(eq(taskLifecycle.taskRef, taskRef)).limit(1);
  return result[0];
}

export async function advanceTaskStage(
  taskRef: string,
  stage: "pre" | "during" | "post" | "review" | "approved" | "rejected" | "closed",
  extra?: { reviewedByStaffId?: string; rejectionComment?: string }
) {
  const db = await getDb();
  if (!db) return;
  const set: Record<string, unknown> = {
    lifecycleStage: stage,
    updatedAt: new Date(),
  };
  if (stage === "approved" || stage === "rejected") {
    set.reviewedByStaffId = extra?.reviewedByStaffId;
    set.reviewedAt = new Date();
  }
  if (stage === "rejected" && extra?.rejectionComment) {
    set.rejectionComment = extra.rejectionComment;
  }
  if (stage === "closed") {
    set.closedAt = new Date();
  }
  await db.update(taskLifecycle).set(set).where(eq(taskLifecycle.taskRef, taskRef));
}

// ─── Checklist Items ──────────────────────────────────────────────────────────
export async function getChecklistForTask(taskRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(checklistItems)
    .where(eq(checklistItems.taskRef, taskRef))
    .orderBy(checklistItems.stage, checklistItems.stepOrder);
}

export async function createChecklistFromSOP(taskRef: string, department: string, serviceType: string) {
  const db = await getDb();
  if (!db) return;
  // Get SOP templates for this dept + service
  const templates = await db.select().from(sopTemplates)
    .where(and(eq(sopTemplates.department, department), eq(sopTemplates.serviceType, serviceType)))
    .orderBy(sopTemplates.stage, sopTemplates.stepOrder);

  if (templates.length === 0) {
    // Fallback: generic checklist
    const genericSteps = [
      { stage: "pre" as const, steps: ["Review task brief and confirm scope", "Confirm client requirements", "Prepare workspace and tools"] },
      { stage: "during" as const, steps: ["Execute work according to brief", "Document progress and decisions", "Conduct internal quality check"] },
      { stage: "post" as const, steps: ["Review final output against brief", "Submit to Lead for approval", "Update Central Master Tracker"] },
    ];
    for (const { stage, steps } of genericSteps) {
      for (let i = 0; i < steps.length; i++) {
        await db.insert(checklistItems).values({
          taskRef, stage, stepOrder: i + 1, stepText: steps[i], isRequired: true,
        });
      }
    }
    return;
  }

  for (const t of templates) {
    await db.insert(checklistItems).values({
      taskRef,
      stage: t.stage,
      stepOrder: t.stepOrder,
      stepText: t.stepText,
      isRequired: t.isRequired,
    });
  }
}

export async function tickChecklistItem(
  itemId: number,
  completed: boolean,
  staffId: string,
  staffName: string,
  taskRef: string,
  stepText: string,
  stage: "pre" | "during" | "post"
) {
  const db = await getDb();
  if (!db) return;
  await db.update(checklistItems)
    .set({ isCompleted: completed, completedAt: completed ? new Date() : null })
    .where(eq(checklistItems.id, itemId));

  // Write to audit trail
  await db.insert(auditTrail).values({
    taskRef,
    staffId,
    staffName,
    action: `${completed ? "Completed" : "Unchecked"}: ${stepText}`,
    stage,
  });
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────
export async function getAuditForTask(taskRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditTrail)
    .where(eq(auditTrail.taskRef, taskRef))
    .orderBy(desc(auditTrail.createdAt));
}

export async function addAuditEntry(entry: {
  taskRef: string;
  staffId: string;
  staffName: string;
  action: string;
  stage: "pre" | "during" | "post" | "system";
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditTrail).values(entry);
}

// ─── SOP Templates ────────────────────────────────────────────────────────────
export async function getSopTemplates(department?: string) {
  const db = await getDb();
  if (!db) return [];
  if (department) {
    return db.select().from(sopTemplates)
      .where(eq(sopTemplates.department, department))
      .orderBy(sopTemplates.serviceType, sopTemplates.stage, sopTemplates.stepOrder);
  }
  return db.select().from(sopTemplates).orderBy(sopTemplates.department, sopTemplates.serviceType, sopTemplates.stage, sopTemplates.stepOrder);
}

export async function getServiceTypesByDept(department: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ serviceType: sopTemplates.serviceType })
    .from(sopTemplates)
    .where(eq(sopTemplates.department, department));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const r of rows) {
    if (!seen.has(r.serviceType)) {
      seen.add(r.serviceType);
      result.push(r.serviceType);
    }
  }
  return result;
}

// ─── Founder Notes ────────────────────────────────────────────────────────────
export async function getFounderNotes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(founderNotes).orderBy(desc(founderNotes.updatedAt));
}

export async function createFounderNote(title: string, content: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(founderNotes).values({ title, content });
}

export async function updateFounderNote(id: number, title: string, content: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(founderNotes).set({ title, content, updatedAt: new Date() }).where(eq(founderNotes.id, id));
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export async function getClientByRef(clientRef: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.clientRef, clientRef)).limit(1);
  return result[0];
}

export async function getClientByToken(accessToken: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.accessToken, accessToken)).limit(1);
  return result[0];
}

export async function upsertClient(client: InsertClient) {
  const db = await getDb();
  if (!db) return;
  await db.insert(clients).values(client).onDuplicateKeyUpdate({
    set: {
      name: client.name,
      email: client.email,
      servicePackage: client.servicePackage,
      startDate: client.startDate,
      deadline: client.deadline,
      status: client.status,
      invoiceStatus: client.invoiceStatus,
      updatedAt: new Date(),
    },
  });
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).orderBy(clients.createdAt);
}

// ─── Tasks (legacy Google Sheets sync) ───────────────────────────────────────
export async function getTasksByAssignee(assignedTo: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.assignedTo, assignedTo));
}

export async function getTasksByClientRef(clientRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.clientRef, clientRef));
}

export async function getUpcomingTasks(assignedTo: string, days = 7) {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.assignedTo, assignedTo),
        gte(tasks.deadline, now),
        lte(tasks.deadline, future),
        or(eq(tasks.status, "Not Started"), eq(tasks.status, "In Progress"))
      )
    );
}

export async function updateTaskStatus(
  taskId: string,
  status: "Not Started" | "In Progress" | "Completed" | "On Hold" | "Cancelled"
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(tasks)
    .set({ status, updatedAt: new Date(), ...(status === "Completed" ? { completedDate: new Date() } : {}) })
    .where(eq(tasks.taskId, taskId));
}

export async function upsertTask(task: InsertTask) {
  const db = await getDb();
  if (!db) return;
  await db.insert(tasks).values(task).onDuplicateKeyUpdate({
    set: {
      clientName: task.clientName,
      description: task.description,
      assignedTo: task.assignedTo,
      department: task.department,
      deadline: task.deadline,
      qualityGatePassed: task.qualityGatePassed,
      updatedAt: new Date(),
    },
  });
}

export async function getAllTasks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).orderBy(tasks.deadline);
}

// ─── Deliverables ─────────────────────────────────────────────────────────────
export async function getDeliverablesByClientRef(clientRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(deliverables).where(eq(deliverables.clientRef, clientRef));
}

export async function getRecentDeliverablesByAssignee(assignedTo: string, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  const userTasks = await db
    .select({ taskId: tasks.taskId })
    .from(tasks)
    .where(eq(tasks.assignedTo, assignedTo))
    .limit(50);
  if (userTasks.length === 0) return [];
  const taskIds = userTasks.map((t) => t.taskId);
  return db
    .select()
    .from(deliverables)
    .where(or(...taskIds.map((id) => eq(deliverables.taskId, id))))
    .limit(limit);
}

// ─── Communications ───────────────────────────────────────────────────────────
export async function getCommunicationsByClientRef(clientRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(communications)
    .where(eq(communications.clientRef, clientRef))
    .orderBy(communications.createdAt);
}

// ─── Staff management (legacy users table) ────────────────────────────────────
export async function getAllStaff() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(or(eq(users.role, "staff"), eq(users.role, "admin"))).orderBy(users.name);
}

export async function upsertStaffUser(user: InsertUser): Promise<void> {
  return upsertUser(user);
}

export async function updateClientStatusDb(
  clientRef: string,
  status: "Inquiry" | "Proposal" | "Active" | "Delivery" | "Closed",
  invoiceStatus?: "Not Sent" | "Sent" | "Paid" | "Overdue"
) {
  const db = await getDb();
  if (!db) return;
  const set: Record<string, unknown> = { status, updatedAt: new Date() };
  if (invoiceStatus) set.invoiceStatus = invoiceStatus;
  await db.update(clients).set(set).where(eq(clients.clientRef, clientRef));
}

export async function addCommunication(clientRef: string, message: string, author: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(communications).values({ clientRef, message, author });
}

// ─── Agents & Referrals ─────────────────────────────────────────────────────────────
export async function getAllAgents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agents).orderBy(agents.name);
}

export async function createAgentRecord(agent: { agentId: string; name: string; email: string; phone?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(agents).values(agent).onDuplicateKeyUpdate({ set: { name: agent.name, phone: agent.phone } });
}

export async function getAgentByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agents).where(eq(agents.email, email)).limit(1);
  return result[0];
}

export async function getAgentByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agents).where(eq(agents.openId, openId)).limit(1);
  return result[0];
}

export async function getReferralsByAgent(agentId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referrals).where(eq(referrals.agentId, agentId)).orderBy(referrals.referralDate);
}

// ─── Weekly Reports (Friday CEO → Founder) ───────────────────────────────────
export async function submitWeeklyReport(data: InsertWeeklyReport) {
  const db = await getDb();
  if (!db) return;
  await db.insert(weeklyReports).values(data);
}

export async function getAllWeeklyReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(weeklyReports).orderBy(desc(weeklyReports.createdAt));
}

export async function getLatestWeeklyReport() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(weeklyReports).orderBy(desc(weeklyReports.createdAt)).limit(1);
  return result[0] ?? null;
}

export async function markReportReadByFounder(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(weeklyReports)
    .set({ isReadByFounder: true, readAt: new Date() })
    .where(eq(weeklyReports.id, id));
}

// ─── RIDI Impact ──────────────────────────────────────────────────────────────
export async function createRidiProgram(data: InsertRidiImpact) {
  const db = await getDb();
  if (!db) return;
  await db.insert(ridiImpact).values(data);
}

export async function getAllRidiPrograms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ridiImpact).orderBy(desc(ridiImpact.createdAt));
}

export async function updateRidiProgram(
  programRef: string,
  updates: Partial<InsertRidiImpact>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(ridiImpact).set(updates).where(eq(ridiImpact.programRef, programRef));
}

export async function getRidiTotals() {
  const db = await getDb();
  if (!db) return { totalBeneficiaries: 0, women: 0, youth: 0, men: 0, referrals: 0, programs: 0 };
  const programs = await db.select().from(ridiImpact);
  return {
    programs: programs.length,
    totalBeneficiaries: programs.reduce((s, p) => s + p.totalBeneficiaries, 0),
    women: programs.reduce((s, p) => s + p.women, 0),
    youth: programs.reduce((s, p) => s + p.youth, 0),
    men: programs.reduce((s, p) => s + p.men, 0),
    referrals: programs.reduce((s, p) => s + p.referralsToHamzury, 0),
  };
}

// ─── Client Intake Helpers ────────────────────────────────────────────────────

/** Generate a unique reference code like HMZ-2026-0042 */
export async function generateIntakeReference(): Promise<string> {
  const db = await getDb();
  const year = new Date().getFullYear();
  if (!db) return `HMZ-${year}-${String(Date.now()).slice(-4)}`;
  const rows = await db
    .select({ id: clientIntake.id })
    .from(clientIntake)
    .orderBy(desc(clientIntake.id))
    .limit(1);
  const nextNum = rows.length > 0 ? rows[0].id + 1 : 1;
  return `HMZ-${year}-${String(nextNum).padStart(4, "0")}`;
}

/** Create a new intake submission */
export async function createClientIntake(data: InsertClientIntake): Promise<ClientIntake> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clientIntake).values(data);
  const rows = await db
    .select()
    .from(clientIntake)
    .where(eq(clientIntake.referenceCode, data.referenceCode))
    .limit(1);
  return rows[0];
}

/** Look up an intake by reference code (for client status check) */
export async function getIntakeByReference(referenceCode: string): Promise<ClientIntake | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(clientIntake)
    .where(eq(clientIntake.referenceCode, referenceCode))
    .limit(1);
  return rows[0] ?? null;
}

/** Get all intakes for CSO lead queue, newest first */
export async function getAllIntakes(status?: string): Promise<ClientIntake[]> {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db
      .select()
      .from(clientIntake)
      .where(eq(clientIntake.status, status as ClientIntake["status"]))
      .orderBy(desc(clientIntake.createdAt));
  }
  return db.select().from(clientIntake).orderBy(desc(clientIntake.createdAt));
}

/** Update intake status and CSO notes */
export async function updateIntakeStatus(
  referenceCode: string,
  status: ClientIntake["status"],
  csoNotes?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(clientIntake)
    .set({ status, ...(csoNotes !== undefined ? { csoNotes } : {}), updatedAt: new Date() })
    .where(eq(clientIntake.referenceCode, referenceCode));
}

// ─── Task Files (deliverables uploaded by staff) ──────────────────────────────
export async function addTaskFile(data: {
  taskRef: string;
  uploadedByStaffId: string;
  uploadedByName: string;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  mimeType?: string;
  fileSizeBytes?: number;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(taskFiles).values(data);
}

export async function getTaskFiles(taskRef: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taskFiles).where(eq(taskFiles.taskRef, taskRef)).orderBy(taskFiles.createdAt);
}

// ─── Lead Reports ─────────────────────────────────────────────────────────────
export async function submitLeadReport(data: {
  reportRef: string;
  submittedByStaffId: string;
  submittedByName: string;
  department: string;
  weekEnding: Date;
  win1: string;
  win2: string;
  win3: string;
  blocker1: string;
  blocker2: string;
  keyInfo: string;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksOverdue: number;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(leadReports).values(data);
}

export async function getAllLeadReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leadReports).orderBy(desc(leadReports.createdAt));
}

export async function getLeadReportsByDept(department: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leadReports).where(eq(leadReports.department, department)).orderBy(desc(leadReports.createdAt));
}

export async function markLeadReportRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(leadReports).set({ isReadByFounder: true }).where(eq(leadReports.id, id));
}

// ─── Staff Notifications ──────────────────────────────────────────────────────
export async function createStaffNotification(data: {
  staffId: string;
  title: string;
  message: string;
  type: "task_assigned" | "task_approved" | "task_rejected" | "general";
  taskRef?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(staffNotifications).values(data);
}

export async function getStaffNotifications(staffId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staffNotifications)
    .where(eq(staffNotifications.staffId, staffId))
    .orderBy(desc(staffNotifications.createdAt))
    .limit(20);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(staffNotifications).set({ isRead: true }).where(eq(staffNotifications.id, id));
}

export async function markAllNotificationsRead(staffId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(staffNotifications).set({ isRead: true }).where(eq(staffNotifications.staffId, staffId));
}

// ─── Staff Password Change ────────────────────────────────────────────────────
export async function changeStaffPassword(staffId: string, newPasswordHash: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(staffMembers).set({ passwordHash: newPasswordHash }).where(eq(staffMembers.staffId, staffId));
}

// ─── RIDI Scholarship Applications ───────────────────────────────────────────
export async function createScholarshipApplication(data: {
  name: string; phone: string; state: string; lga: string;
  age: number; gender: "Male" | "Female" | "Other";
  areaOfInterest: string; story: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { ridiScholarshipApplications } = await import("../drizzle/schema");
  const applicationRef = `SCH-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(ridiScholarshipApplications).values({ applicationRef, ...data });
  return applicationRef;
}

export async function getAllScholarshipApplications() {
  const db = await getDb();
  if (!db) return [];
  const { ridiScholarshipApplications } = await import("../drizzle/schema");
  return db.select().from(ridiScholarshipApplications).orderBy(ridiScholarshipApplications.createdAt);
}

// ─── RIDI Donations ───────────────────────────────────────────────────────────
export async function createDonation(data: {
  name: string; email: string; amount: string; message?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { ridiDonations } = await import("../drizzle/schema");
  const donationRef = `DON-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(ridiDonations).values({ donationRef, ...data });
  return donationRef;
}

export async function getAllDonations() {
  const db = await getDb();
  if (!db) return [];
  const { ridiDonations } = await import("../drizzle/schema");
  return db.select().from(ridiDonations).orderBy(ridiDonations.createdAt);
}

// ─── Task Comments ────────────────────────────────────────────────────────────
export async function addTaskComment(data: {
  taskRef: string; authorStaffId: string; authorName: string;
  authorRole: string; message: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { taskComments } = await import("../drizzle/schema");
  const [result] = await db.insert(taskComments).values(data);
  return result;
}
export async function getTaskComments(taskRef: string) {
  const db = await getDb();
  if (!db) return [];
  const { taskComments } = await import("../drizzle/schema");
  return db.select().from(taskComments)
    .where(eq(taskComments.taskRef, taskRef))
    .orderBy(taskComments.createdAt);
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export async function createInvoice(data: {
  clientName: string; clientEmail?: string; clientRef?: string;
  taskRef?: string; description: string; amountNaira: number;
  dueDate?: Date; notes?: string; createdByStaffId: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { invoices } = await import("../drizzle/schema");
  const invoiceRef = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  const ridiAllocation = Math.floor(data.amountNaira * 0.1);
  await db.insert(invoices).values({ invoiceRef, ridiAllocation, ...data });
  return invoiceRef;
}
export async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  const { invoices } = await import("../drizzle/schema");
  return db.select().from(invoices).orderBy(desc(invoices.createdAt));
}
export async function updateInvoiceStatus(invoiceRef: string, status: "Draft"|"Sent"|"Paid"|"Overdue"|"Cancelled") {
  const db = await getDb();
  if (!db) return;
  const { invoices } = await import("../drizzle/schema");
  const paidAt = status === "Paid" ? new Date() : undefined;
  await db.update(invoices).set({ status, ...(paidAt ? { paidAt } : {}) }).where(eq(invoices.invoiceRef, invoiceRef));
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
export async function createExpense(data: {
  submittedByStaffId: string; submittedByName: string; department: string;
  description: string; amountNaira: number;
  category: "Operations"|"Travel"|"Equipment"|"Software"|"Training"|"Marketing"|"Other";
  receiptUrl?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { expenses } = await import("../drizzle/schema");
  const expenseRef = `EXP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  // Determine approval level by amount
  const approvalLevel = data.amountNaira <= 50000 ? "lead" : data.amountNaira <= 200000 ? "ceo" : "founder";
  await db.insert(expenses).values({ expenseRef, approvalLevel, ...data });
  return expenseRef;
}
export async function getAllExpenses(approvalLevel?: string) {
  const db = await getDb();
  if (!db) return [];
  const { expenses } = await import("../drizzle/schema");
  if (approvalLevel) {
    return db.select().from(expenses)
      .where(eq(expenses.approvalLevel, approvalLevel as any))
      .orderBy(desc(expenses.createdAt));
  }
  return db.select().from(expenses).orderBy(desc(expenses.createdAt));
}
export async function getExpensesByStaff(staffId: string) {
  const db = await getDb();
  if (!db) return [];
  const { expenses } = await import("../drizzle/schema");
  return db.select().from(expenses)
    .where(eq(expenses.submittedByStaffId, staffId))
    .orderBy(desc(expenses.createdAt));
}
export async function approveExpense(expenseRef: string, approvedByStaffId: string, approvedByName: string) {
  const db = await getDb();
  if (!db) return;
  const { expenses } = await import("../drizzle/schema");
  await db.update(expenses).set({
    status: "Approved", approvedByStaffId, approvedByName, approvedAt: new Date()
  }).where(eq(expenses.expenseRef, expenseRef));
}
export async function rejectExpense(expenseRef: string, approvedByStaffId: string, approvedByName: string, rejectionReason: string) {
  const db = await getDb();
  if (!db) return;
  const { expenses } = await import("../drizzle/schema");
  await db.update(expenses).set({
    status: "Rejected", approvedByStaffId, approvedByName, approvedAt: new Date(), rejectionReason
  }).where(eq(expenses.expenseRef, expenseRef));
}

// ─── UCC Forms ────────────────────────────────────────────────────────────────
export async function createUccForm(data: {
  businessName: string; contactName: string; contactEmail: string;
  contactPhone: string; industry: string; businessGoals: string;
  currentChallenges: string; targetAudience?: string;
  budgetRange: "Under ₦100k"|"₦100k–₦500k"|"₦500k–₦1m"|"₦1m–₦5m"|"Above ₦5m";
  timeline: "Urgent (under 2 weeks)"|"1 month"|"2–3 months"|"3–6 months"|"Flexible";
  preferredContact: "Email"|"WhatsApp"|"Phone"|"Any";
  additionalNotes?: string; csoLeadId?: string; intakeRef?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { uccForms } = await import("../drizzle/schema");
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const seq = Date.now().toString().slice(-4);
  const clientId = `${day}/${month}-${seq}`;
  await db.insert(uccForms).values({ clientId, ...data });
  return clientId;
}
export async function getAllUccForms() {
  const db = await getDb();
  if (!db) return [];
  const { uccForms } = await import("../drizzle/schema");
  return db.select().from(uccForms).orderBy(desc(uccForms.createdAt));
}
export async function updateUccStatus(clientId: string, status: "Submitted"|"Reviewed"|"Clarity Sent"|"Converted"|"Lost") {
  const db = await getDb();
  if (!db) return;
  const { uccForms } = await import("../drizzle/schema");
  await db.update(uccForms).set({ status }).where(eq(uccForms.clientId, clientId));
}

// ─── Innovation Hub Enrolments ────────────────────────────────────────────────
export async function createEnrolment(data: {
  participantName: string; participantEmail: string; participantPhone?: string;
  programmeType: "Executive Class"|"Young Innovators"|"Tech Bootcamp"|"Internship"|"Corporate Training"|"Robotics";
  cohort?: string; source?: "Direct"|"RIDI Scholarship"|"Corporate"|"Agent Referral"; notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { innovationEnrolments } = await import("../drizzle/schema");
  const enrolmentRef = `ENR-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(innovationEnrolments).values({ enrolmentRef, ...data });
  return enrolmentRef;
}
export async function getAllEnrolments() {
  const db = await getDb();
  if (!db) return [];
  const { innovationEnrolments } = await import("../drizzle/schema");
  return db.select().from(innovationEnrolments).orderBy(desc(innovationEnrolments.createdAt));
}
export async function updateEnrolmentStatus(enrolmentRef: string, status: "Applied"|"Shortlisted"|"Enrolled"|"Completed"|"Withdrawn") {
  const db = await getDb();
  if (!db) return;
  const { innovationEnrolments } = await import("../drizzle/schema");
  await db.update(innovationEnrolments).set({ status }).where(eq(innovationEnrolments.enrolmentRef, enrolmentRef));
}
export async function updateScholarshipStatus(applicationRef: string, status: "Pending"|"Shortlisted"|"Accepted"|"Declined") {
  const db = await getDb();
  if (!db) return;
  const { ridiScholarshipApplications } = await import("../drizzle/schema");
  await db.update(ridiScholarshipApplications).set({ status }).where(eq(ridiScholarshipApplications.applicationRef, applicationRef));
}
export async function updateDonationStatus(donationRef: string, status: "Pending"|"Confirmed") {
  const db = await getDb();
  if (!db) return;
  const { ridiDonations } = await import("../drizzle/schema");
  await db.update(ridiDonations).set({ status }).where(eq(ridiDonations.donationRef, donationRef));
}

// ─── Affiliate Helpers ────────────────────────────────────────────────────────
export async function createAffiliateApplication(data: {
  name: string; email: string; phone?: string; reason?: string;
}) {
  const db = await getDb();
  await db.insert(affiliateApplications).values({ ...data, status: "pending" });
}

export async function getAllAffiliateApplications() {
  const db = await getDb();
  return db.select().from(affiliateApplications).orderBy(desc(affiliateApplications.createdAt));
}

export async function updateAffiliateStatus(id: number, status: "approved" | "rejected", affiliateCode?: string) {
  const db = await getDb();
  await db.update(affiliateApplications).set({ status, affiliateCode }).where(eq(affiliateApplications.id, id));
}
