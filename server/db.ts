import { and, eq, gte, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  agents,
  clients,
  communications,
  deliverables,
  InsertClient,
  InsertTask,
  InsertUser,
  referrals,
  tasks,
  users,
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

// ─── Tasks ────────────────────────────────────────────────────────────────────
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
  // Get tasks assigned to this person, then get deliverables for those tasks
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

// ─── Staff management ─────────────────────────────────────────────────────────────
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
