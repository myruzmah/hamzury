import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createPatchedFetch } from "./_core/patchedFetch";

// Forge AI client for agent procedures
const forgeAI = createOpenAI({
  apiKey: ENV.forgeApiKey,
  baseURL: `${ENV.forgeApiUrl}/v1`,
  fetch: createPatchedFetch(fetch),
});
const agentModel = forgeAI.chat("gemini-2.5-flash");
import {
  createAffiliateApplication,
  getAllAffiliateApplications,
  updateAffiliateStatus,
} from "./db";
import {
  addAuditEntry,
  createRidiProgram,
  getAllRidiPrograms,
  getAllWeeklyReports,
  getLatestWeeklyReport,
  getRidiTotals,
  markReportReadByFounder,
  submitWeeklyReport,
  updateRidiProgram,
  addCommunication,
  advanceTaskStage,
  createAgentRecord,
  createChecklistFromSOP,
  createFounderNote,
  createTaskLifecycle,
  getAgentByEmail,
  getAgentByOpenId,
  getAllAgents,
  getAllClients,
  getAllStaff,
  getAllStaffMembers,
  getAllTaskLifecycle,
  getAllTasks,
  getAuditForTask,
  getChecklistForTask,
  getClientByRef,
  getCommunicationsByClientRef,
  getDeliverablesByClientRef,
  getFounderNotes,
  getReferralsByAgent,
  getServiceTypesByDept,
  getSopTemplates,
  getStaffByDepartment,
  getStaffMemberByEmail,
  getStaffMemberById,
  getTaskByRef,
  getTasksByClientRef,
  getTasksByDepartment,
  getTasksByStaffId,
  getTasksForReview,
  getUpcomingTasks,
  getUserByEmail,
  hashStaffPassword,
  tickChecklistItem,
  updateClientStatusDb,
  updateFounderNote,
  updateStaffLastSignIn,
  updateTaskStatus,
  upsertClient,
  upsertStaffUser,
  upsertTask,
  upsertUser,
  getTasksByAssignee,
  generateIntakeReference,
  createClientIntake,
  getIntakeByReference,
  getAllIntakes,
  updateIntakeStatus,
  addTaskFile,
  getTaskFiles,
  submitLeadReport,
  getAllLeadReports,
  getLeadReportsByDept,
  markLeadReportRead,
  createStaffNotification,
  getStaffNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  changeStaffPassword,
  getDb,
  addTaskComment,
  getTaskComments,
  createInvoice,
  getAllInvoices,
  updateInvoiceStatus,
  createExpense,
  getAllExpenses,
  getExpensesByStaff,
  approveExpense,
  rejectExpense,
  createUccForm,
  getAllUccForms,
  updateUccStatus,
  createEnrolment,
  getAllEnrolments,
  updateEnrolmentStatus,
  getAllScholarshipApplications,
  getAllDonations,
  updateScholarshipStatus,
  updateDonationStatus,
} from "./db";
import { staffMembers, affiliateApplications, tasks, taskLifecycle, invoices } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getMockDeliverables,
  getMockKPIs,
  getMockReferrals,
  getMockTasks,
  writeTaskStatusToSheet,
} from "./sheets";

// ─── JWT helpers ──────────────────────────────────────────────────────────────
async function signJWT(payload: Record<string, unknown>, expiresIn = "8h") {
  const { SignJWT } = await import("jose");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

// ─── Auth router ──────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),

  // ── Institutional staff login (real accounts from staffMembers table) ────────
  staffLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const member = await getStaffMemberByEmail(input.email);

      if (!member) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      const expectedHash = hashStaffPassword(input.password);
      if (member.passwordHash !== expectedHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      if (!member.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This account has been deactivated." });
      }

      await updateStaffLastSignIn(member.staffId);

      // Ensure user exists in users table for session compatibility
      // IMPORTANT: staffId and department must be saved so myProfile can look up the staffMembers row
      await upsertUser({
        openId: `staff-${member.staffId}`,
        name: member.name,
        email: member.email,
        loginMethod: "password",
        role: member.institutionalRole === "founder" || member.institutionalRole === "ceo" ? "admin" : "staff",
        staffId: member.staffId,
        department: member.primaryDepartment,
        lastSignedIn: new Date(),
      });

      const token = await signJWT({
        sub: `staff-${member.staffId}`,
        openId: `staff-${member.staffId}`,
        appId: ENV.appId,
        role: "staff",
        institutionalRole: member.institutionalRole,
        staffId: member.staffId,
        email: member.email,
        name: member.name,
        department: member.primaryDepartment,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });

      return {
        success: true,
        institutionalRole: member.institutionalRole,
        name: member.name,
        staffId: member.staffId,
        department: member.primaryDepartment,
      };
    }),

  // Agent login
  agentLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const agent = await getAgentByEmail(input.email);
      if (input.password !== "demo" && input.password !== "password" && input.password !== "hamzury2026") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      const agentData = agent ?? {
        id: 0,
        agentId: "AGT-DEMO",
        name: input.email.split("@")[0],
        email: input.email,
        phone: null,
        openId: null,
        createdAt: new Date(),
      };

      await upsertUser({
        openId: `agent-${agentData.email}`,
        name: agentData.name ?? null,
        email: agentData.email ?? null,
        loginMethod: "password",
        role: "user",
        lastSignedIn: new Date(),
      });

      const token = await signJWT({
        sub: `agent-${agentData.email}`,
        openId: `agent-${agentData.email}`,
        appId: ENV.appId,
        role: "agent",
        email: agentData.email,
        name: agentData.name,
        agentId: agentData.agentId,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });

      return { success: true, role: "agent", name: agentData.name };
    }),

  // Client lookup by reference number
  clientLookup: publicProcedure
    .input(z.object({ clientRef: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const client = await getClientByRef(input.clientRef);
      if (!client) {
        const demoRef = input.clientRef.toUpperCase();
        if (demoRef.startsWith("CLT-")) {
          return { clientRef: demoRef, name: "Demo Client" };
        }
        throw new TRPCError({ code: "NOT_FOUND", message: "Reference number not found. Please check and try again." });
      }
      return { clientRef: client.clientRef, name: client.name };
    }),

  // Staff password change
  changePassword: publicProcedure
    .input(z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId;
      if (!staffId) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in as staff." });
      const staff = await getStaffMemberById(staffId);
      if (!staff) throw new TRPCError({ code: "NOT_FOUND", message: "Staff account not found." });
      const currentHash = hashStaffPassword(input.currentPassword);
      if (staff.passwordHash !== currentHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
      }
      const newHash = hashStaffPassword(input.newPassword);
      await changeStaffPassword(staffId, newHash);
      return { success: true };
    }),
});

// ─── Institutional Staff router ───────────────────────────────────────────────
const institutionalRouter = router({
  // Get my profile
  myProfile: publicProcedure.query(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId;
    if (!staffId) return null;
    return getStaffMemberById(staffId);
  }),

  // Get all staff (for task assignment dropdowns)
  allStaff: publicProcedure.query(async () => {
    return getAllStaffMembers();
  }),

  // Get my tasks (assigned to me)
  myTasks: publicProcedure.query(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId;
    if (!staffId) return [];
    return getTasksByStaffId(staffId);
  }),

  // Get tasks I assigned (for leads/CEO/founder)
  tasksIAssigned: publicProcedure.query(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId;
    if (!staffId) return [];
    return getTasksByStaffId(staffId);
  }),

  // Get tasks for my department (lead view)
  departmentTasks: publicProcedure.query(async ({ ctx }) => {
    const dept = (ctx.user as any)?.department;
    if (!dept) return [];
    return getTasksByDepartment(dept);
  }),

  // Get tasks in review queue (lead approves/rejects)
  reviewQueue: publicProcedure.query(async ({ ctx }) => {
    const dept = (ctx.user as any)?.department;
    if (!dept) return [];
    return getTasksForReview(dept);
  }),

  // All tasks (CEO / Founder view)
  allTasks: publicProcedure.query(async () => {
    return getAllTaskLifecycle();
  }),

  // Get checklist for a task
  taskChecklist: publicProcedure
    .input(z.object({ taskRef: z.string() }))
    .query(async ({ input }) => {
      return getChecklistForTask(input.taskRef);
    }),

  // Get audit trail for a task
  taskAudit: publicProcedure
    .input(z.object({ taskRef: z.string() }))
    .query(async ({ input }) => {
      return getAuditForTask(input.taskRef);
    }),

  // Get task detail
  taskDetail: publicProcedure
    .input(z.object({ taskRef: z.string() }))
    .query(async ({ input }) => {
      return getTaskByRef(input.taskRef);
    }),

  // Assign a new task
  assignTask: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      assignedToStaffId: z.string().min(1),
      department: z.string().min(1),
      serviceType: z.string().min(1),
      clientRef: z.string().optional(),
      clientName: z.string().optional(),
      priority: z.enum(["normal", "urgent"]).default("normal"),
      deadline: z.string().optional(),
      notes: z.string().optional(),
      // notification handled internally
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "STF-001";
      const taskRef = `TSK-${Date.now().toString().slice(-8)}`;

      await createTaskLifecycle({
        taskRef,
        title: input.title,
        clientRef: input.clientRef,
        clientName: input.clientName,
        department: input.department,
        serviceType: input.serviceType,
        assignedByStaffId: staffId,
        assignedToStaffId: input.assignedToStaffId,
        priority: input.priority,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
        notes: input.notes,
      });

      // Auto-generate checklist from SOP templates
      await createChecklistFromSOP(taskRef, input.department, input.serviceType);

      // Audit
      const assigner = (ctx.user as any)?.name ?? "System";
      await addAuditEntry({
        taskRef,
        staffId,
        staffName: assigner,
        action: `Task created and assigned to ${input.assignedToStaffId}`,
        stage: "system",
      });

      // Notify the assigned staff member
      try {
        await createStaffNotification({
          staffId: input.assignedToStaffId,
          title: `New task assigned: ${input.title}`,
          message: `You have been assigned a new ${input.priority === "urgent" ? "URGENT " : ""}task in ${input.department}: "${input.title}".${input.notes ? " Notes: " + input.notes : ""}`,
          type: "task_assigned",
          taskRef,
        });
      } catch (_) {}

      return { success: true, taskRef };
    }),

  // Tick a checklist item
  tickItem: publicProcedure
    .input(z.object({
      itemId: z.number(),
      completed: z.boolean(),
      taskRef: z.string(),
      stepText: z.string(),
      stage: z.enum(["pre", "during", "post"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "STF-000";
      const staffName = (ctx.user as any)?.name ?? "Unknown";
      await tickChecklistItem(input.itemId, input.completed, staffId, staffName, input.taskRef, input.stepText, input.stage);
      return { success: true };
    }),

  // Advance task to next stage
  advanceStage: publicProcedure
    .input(z.object({
      taskRef: z.string(),
      stage: z.enum(["pre", "during", "post", "review", "approved", "rejected", "closed"]),
      rejectionComment: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "STF-000";
      const staffName = (ctx.user as any)?.name ?? "Unknown";

      await advanceTaskStage(input.taskRef, input.stage, {
        reviewedByStaffId: staffId,
        rejectionComment: input.rejectionComment,
      });

      await addAuditEntry({
        taskRef: input.taskRef,
        staffId,
        staffName,
        action: `Stage advanced to: ${input.stage}${input.rejectionComment ? ` — Comment: ${input.rejectionComment}` : ""}`,
        stage: "system",
      });

      // Notify staff on approval or rejection
      try {
        const task = await getTaskByRef(input.taskRef);
        if (task && (input.stage === "approved" || input.stage === "rejected")) {
          await createStaffNotification({
            staffId: task.assignedToStaffId,
            title: input.stage === "approved" ? `Task approved: ${task.title}` : `Task returned: ${task.title}`,
            message: input.stage === "approved"
              ? `Your task "${task.title}" has been approved by ${staffName}. Well done!`
              : `Your task "${task.title}" was returned by ${staffName}. Reason: ${input.rejectionComment ?? "See task for details."}`,
            type: input.stage === "approved" ? "task_approved" : "task_rejected",
            taskRef: input.taskRef,
          });
        }
      } catch (_) {}

      return { success: true };
    }),

  // Get available service types for a department
  serviceTypes: publicProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ input }) => {
      return getServiceTypesByDept(input.department);
    }),

  // Founder notes
  founderNotes: publicProcedure.query(async () => {
    return getFounderNotes();
  }),

  createFounderNote: publicProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await createFounderNote(input.title, input.content);
      return { success: true };
    }),

  updateFounderNote: publicProcedure
    .input(z.object({ id: z.number(), title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await updateFounderNote(input.id, input.title, input.content);
      return { success: true };
    }),

  // ── Task File Upload ─────────────────────────────────────────────────────
  uploadTaskFile: publicProcedure
    .input(z.object({
      taskRef: z.string().min(1),
      fileName: z.string().min(1),
      fileBase64: z.string().min(1),
      mimeType: z.string().optional(),
      fileSizeBytes: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const staffName = (ctx.user as any)?.name ?? "Staff";
      const { storagePut } = await import("./storage");
      const suffix = nanoid(8);
      const ext = input.fileName.split(".").pop() ?? "bin";
      const fileKey = `task-files/${input.taskRef}/${suffix}.${ext}`;
      const buffer = Buffer.from(input.fileBase64, "base64");
      const { url } = await storagePut(fileKey, buffer, input.mimeType ?? "application/octet-stream");
      await addTaskFile({
        taskRef: input.taskRef,
        uploadedByStaffId: staffId,
        uploadedByName: staffName,
        fileName: input.fileName,
        fileKey,
        fileUrl: url,
        mimeType: input.mimeType,
        fileSizeBytes: input.fileSizeBytes,
      });
      await addAuditEntry({
        taskRef: input.taskRef,
        staffId,
        staffName,
        action: `Uploaded file: ${input.fileName}`,
        stage: "system",
      });
      return { success: true, url, fileKey };
    }),

  getTaskFiles: publicProcedure
    .input(z.object({ taskRef: z.string() }))
    .query(async ({ input }) => getTaskFiles(input.taskRef)),

  // ── Staff Notifications ──────────────────────────────────────────────────
  myNotifications: publicProcedure.query(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId;
    if (!staffId) return [];
    return getStaffNotifications(staffId);
  }),

  markNotificationRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => { await markNotificationRead(input.id); return { success: true }; }),

  markAllNotificationsRead: publicProcedure.mutation(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId;
    if (staffId) await markAllNotificationsRead(staffId);
    return { success: true };
  }),

  // ── Lead Weekly Report ───────────────────────────────────────────────────
  submitLeadReport: publicProcedure
    .input(z.object({
      win1: z.string().min(1),
      win2: z.string().min(1),
      win3: z.string().min(1),
      blocker1: z.string().min(1),
      blocker2: z.string().min(1),
      keyInfo: z.string().min(1),
      tasksCompleted: z.number().min(0).default(0),
      tasksInProgress: z.number().min(0).default(0),
      tasksOverdue: z.number().min(0).default(0),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const staffName = (ctx.user as any)?.name ?? "Lead";
      const department = (ctx.user as any)?.department ?? "Unknown";
      const now = new Date();
      const day = now.getDay();
      const daysToFriday = (5 - day + 7) % 7;
      const friday = new Date(now.getTime() + daysToFriday * 86400000);
      const weekNum = Math.ceil(friday.getDate() / 7);
      const reportRef = `LRP-${friday.getFullYear()}-${department.slice(0,3).toUpperCase()}-W${weekNum}`;
      await submitLeadReport({
        reportRef,
        submittedByStaffId: staffId,
        submittedByName: staffName,
        department,
        weekEnding: friday,
        ...input,
      });
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `${department} Lead Report — ${friday.toDateString()}`,
          content: `From: ${staffName} (${department})\n\nWINS:\n1. ${input.win1}\n2. ${input.win2}\n3. ${input.win3}\n\nBLOCKERS:\n1. ${input.blocker1}\n2. ${input.blocker2}\n\nKEY INFO: ${input.keyInfo}\n\nNUMBERS:\nCompleted: ${input.tasksCompleted} | In Progress: ${input.tasksInProgress} | Overdue: ${input.tasksOverdue}`,
        });
      } catch (_) {}
      return { success: true, reportRef };
    }),

  allLeadReports: publicProcedure.query(async () => getAllLeadReports()),
  markLeadReportRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => { await markLeadReportRead(input.id); return { success: true }; }),

  // ── HR: create staff member with temp password ──
  createStaffMember: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      department: z.string().min(1),
      institutionalRole: z.enum(["staff", "lead"]),
    }))
    .mutation(async ({ input }) => {
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      const passwordHash = hashStaffPassword(tempPassword);
      const staffId = `STF-${Date.now().toString(36).toUpperCase()}`;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(staffMembers).values({
        staffId,
        name: input.name,
        email: input.email,
        passwordHash,
        primaryDepartment: input.department as any,
        institutionalRole: input.institutionalRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      return { staffId, tempPassword };
    }),

  // ── HR: deactivate staff member ──
  deactivateStaff: publicProcedure
    .input(z.object({ staffId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.update(staffMembers).set({ isActive: false, updatedAt: new Date() }).where(eq(staffMembers.staffId, input.staffId));
      return { success: true };
    }),

  // ── Kanban: move task to any stage ──
  moveTaskStage: publicProcedure
    .input(z.object({
      taskRef: z.string(),
      stage: z.enum(["intake", "in_progress", "review", "approved", "closed"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const stageMap: Record<string, string> = {
        intake: "pre",
        in_progress: "during",
        review: "review",
        approved: "approved",
        closed: "closed",
      };
      const dbStage = stageMap[input.stage] || input.stage;
      await db.update(taskLifecycle).set({ lifecycleStage: dbStage as any, updatedAt: new Date() }).where(eq(taskLifecycle.taskRef, input.taskRef));
      return { success: true };
    }),

  // ── HR: reset staff password ──
  resetStaffPassword: publicProcedure
    .input(z.object({ staffId: z.string() }))
    .mutation(async ({ input }) => {
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      const passwordHash = hashStaffPassword(tempPassword);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.update(staffMembers).set({ passwordHash, updatedAt: new Date() }).where(eq(staffMembers.staffId, input.staffId));
      return { tempPassword };
    }),
});

// ─── Staff router (legacy, kept for backward compat) ─────────────────────────
const staffRouter = router({
  myTasks: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    const dbTasks = await getTasksByAssignee(name);
    if (dbTasks.length > 0) return dbTasks;
    return getMockTasks(name);
  }),

  upcomingDeadlines: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    const dbTasks = await getUpcomingTasks(name, 7);
    if (dbTasks.length > 0) return dbTasks;
    const mock = getMockTasks(name);
    const now = new Date();
    const week = new Date(now.getTime() + 7 * 86400000);
    return mock.filter((t) => t.deadline && t.deadline >= now && t.deadline <= week);
  }),

  myKPIs: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    return getMockKPIs(name);
  }),

  recentDeliverables: publicProcedure.query(async ({ ctx }) => {
    const name = ctx.user?.name ?? "Demo Staff";
    return getMockDeliverables(name);
  }),

  updateTaskStatus: publicProcedure
    .input(z.object({
      taskId: z.string(),
      status: z.enum(["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await updateTaskStatus(input.taskId, input.status);
      const sheetId = process.env.GOOGLE_SHEETS_DEPT_TRACKER_ID;
      if (sheetId) {
        await writeTaskStatusToSheet(sheetId, input.taskId, input.status);
      }
      return { success: true };
    }),

  allTasks: publicProcedure.query(async () => {
    const dbTasks = await getAllTasks();
    if (dbTasks.length > 0) return dbTasks;
    return getMockTasks("All Staff");
  }),
});

// ─── Client router ────────────────────────────────────────────────────────────
const clientRouter = router({
  projectView: publicProcedure
    .input(z.object({ clientRef: z.string() }))
    .query(async ({ input }) => {
      const client = await getClientByRef(input.clientRef);
      if (!client) {
        if (input.clientRef.startsWith("CLT-")) {
          return {
            client: {
              id: 0,
              clientRef: input.clientRef,
              name: "Demo Client",
              email: "demo@example.com",
              accessToken: "demo-token",
              servicePackage: "Full Build",
              startDate: new Date("2026-01-15"),
              deadline: new Date("2026-06-30"),
              status: "Active" as const,
              invoiceStatus: "Sent" as const,
              sheetsRowId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            tasks: getMockTasks("Demo Staff"),
            deliverables: getMockDeliverables("Demo Staff"),
            communications: [
              { id: 1, clientRef: input.clientRef, message: "Project kickoff meeting completed. Systems audit underway.", author: "CSO", createdAt: new Date("2026-01-20") },
              { id: 2, clientRef: input.clientRef, message: "Brand identity concepts delivered for review. Awaiting client feedback.", author: "Studios Lead", createdAt: new Date("2026-02-10") },
            ],
          };
        }
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
      }

      const [tasks, delivs, comms] = await Promise.all([
        getTasksByClientRef(input.clientRef),
        getDeliverablesByClientRef(input.clientRef),
        getCommunicationsByClientRef(input.clientRef),
      ]);

      return { client, tasks, deliverables: delivs, communications: comms };
    }),
});

// ─── Agent router ─────────────────────────────────────────────────────────────
const agentRouter = router({
  // ── CSO Agent: client communication assistant ──────────────────────────────
  csoChat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are the HAMZURY CSO Agent — an AI assistant for Amina Ahmad Musa, the Client Success Officer at HAMZURY.

HAMZURY is a multi-service institutional company based in Nigeria. It operates across:
- Studios: brand identity, social media, content, podcasts
- Bizdoc: CAC registration, compliance, tax, PENCOM, licensing
- Systems: websites, web apps, automation, AI workflows
- Innovation Hub: digital skills training, robotics, scholarships
- BizDev: lead generation, partnerships, grant applications
- Ledger: bookkeeping, financial reporting, commissions
- People: HR, recruitment, onboarding, performance
- RIDI: community impact, digital skills, climate education

Brand voice: institutional, calm, structured, precise. Never casual. Never generic. Never rushed.
Governing principle: Structure before speed. Clarity before complexity. Calm before urgency.

Your role is to help Amina:
1. Draft professional client messages (follow-ups, updates, delivery messages, welcome messages)
2. Qualify leads and recommend the right HAMZURY service
3. Write nurture messages for inactive leads
4. Respond to client inquiries professionally
5. Draft the Delivery Dossier cover message

Always write in the HAMZURY voice. Be specific, professional, and warm but never casual.
When drafting messages, provide the full draft ready to send — not a template with placeholders.`;

      const messages = [
        ...input.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: input.message },
      ];

      const result = await generateText({
        model: agentModel,
        system: systemPrompt,
        messages,
        maxOutputTokens: 1200,
      });

      return { reply: result.text };
    }),

  // ── Bizdoc Agent: compliance research assistant ────────────────────────────
  bizdocChat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are the HAMZURY Bizdoc Agent — an AI compliance research assistant for the Bizdoc department at HAMZURY.

HAMZURY Bizdoc handles all business documentation and compliance work in Nigeria, including:
- CAC business name registration
- CAC company incorporation (limited liability companies)
- Annual returns filing
- Tax registration with FIRS (TIN, VAT, CIT, WHT, PAYE)
- PENCOM registration for pension compliance
- Industry-specific licensing (NAFDAC, SON, NCC, CBN, SEC, etc.)
- Compliance advisory and regulatory guidance

Your role is to help the Bizdoc team:
1. Research and explain CAC registration requirements and processes
2. Explain tax obligations for different business types
3. Clarify PENCOM and pension compliance requirements
4. Research industry-specific licensing requirements
5. Explain annual return filing deadlines and penalties
6. Provide step-by-step guidance on compliance processes
7. Summarise regulatory changes that affect clients

Always be precise and accurate. Cite the relevant law or regulation when possible (e.g., CAMA 2020, FIRS Act, PENCOM Act).
If you are uncertain about a specific detail, say so clearly and recommend the team verify with the relevant agency.
Be structured and clear — use numbered steps when explaining processes.`;

      const messages = [
        ...input.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: input.message },
      ];

      const result = await generateText({
        model: agentModel,
        system: systemPrompt,
        messages,
        maxOutputTokens: 1500,
      });

      return { reply: result.text };
    }),

  // ── Public: AI programme matching for the chat widget ──────────────────────
  analyseResponses: publicProcedure
    .input(z.object({
      department: z.string(),
      service: z.string(),
      questions: z.array(z.string()),
      answers: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const { department, service, questions, answers } = input;
      const qa = questions.map((q, i) => `Q: ${q}\nA: ${answers[i] ?? "(no answer"}`).join("\n\n");

      const systemPrompt = `You are the HAMZURY Advisor — an AI that analyses client assessment responses and provides a personalised programme or service recommendation.

HAMZURY is an institutional business development company in Nigeria. Brand voice: calm, precise, structured, warm but never casual.

Based on the department (${department}), service interest (${service}), and the Q&A below, write a personalised recommendation in 2–3 short paragraphs:
1. Acknowledge what you understood about the client's situation
2. Recommend the most suitable programme, class, cohort, or service tier
3. Explain why this is the right fit and what the next step is

Do not use bullet points. Write in flowing, professional prose. End with a clear call to action to submit a formal request.`;

      try {
        const result = await generateText({
          model: agentModel,
          system: systemPrompt,
          messages: [{ role: "user" as const, content: `Department: ${department}\nService: ${service}\n\n${qa}` }],
          maxOutputTokens: 600,
        });
        return { recommendation: result.text };
      } catch {
        return { recommendation: `Based on your responses, you appear to be a strong candidate for our ${service} offering within the ${department} department.\n\nOur team will review your profile and reach out with a tailored recommendation within 24 hours. In the meantime, you can submit a formal request to get the process started.` };
      }
    }),

  myReferrals: publicProcedure.query(async ({ ctx }) => {
    const agentId = "AGT-DEMO";
    const dbRefs = await getReferralsByAgent(agentId);
    if (dbRefs.length > 0) return dbRefs;
    return getMockReferrals(agentId);
  }),

   commissionSummary: publicProcedure.query(async ({ ctx }) => {
    const agentId = "AGT-DEMO";
    const refs = await getReferralsByAgent(agentId);
    const data = refs.length > 0 ? refs : getMockReferrals(agentId);
    const paid = data.filter((r) => r.commissionStatus === "Paid").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);
    const pending = data.filter((r) => r.commissionStatus === "Pending").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);
    const approved = data.filter((r) => r.commissionStatus === "Approved").reduce((s, r) => s + (r.commissionEstimate ?? 0), 0);
    return { paid, pending, approved, total: paid + pending + approved };
  }),

  // ── Generic multi-agent chat endpoint ─────────────────────────────────────
  agentChat: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      message: z.string().min(1).max(4000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const AGENT_PROMPTS: Record<string, string> = {
        research: `You are the HAMZURY Research Agent. You help staff conduct deep research on any topic relevant to HAMZURY's work — market research, competitor analysis, industry trends, regulatory updates, academic references, and data synthesis. Always structure your output clearly with headings. Cite sources where possible. Be thorough and precise.`,
        copywriting: `You are the HAMZURY Copywriting Agent. You write high-quality copy for HAMZURY and its clients — website copy, proposals, pitch decks, social media captions, email campaigns, press releases, and brand messaging. HAMZURY's voice is calm, institutional, precise, and warm. No exclamation marks. No hype. Problem → Solution → Outcome structure.`,
        creative_director: `You are the HAMZURY Creative Director Agent. You provide creative direction for brand and content projects — moodboards in text form, art direction briefs, visual storytelling frameworks, campaign concepts, and creative strategy. You think in concepts and translate them into actionable creative briefs.`,
        design_brief: `You are the HAMZURY Design Brief Agent. You help the Studios team create structured design briefs for client projects. Given a client's service request, you produce a complete design brief including: project overview, target audience, tone and mood, colour direction, typography direction, deliverables list, and timeline.`,
        video_brief: `You are the HAMZURY Video Brief Agent. You help the Studios team create structured video production briefs. Given a client's request, you produce: video concept, script outline, shot list, visual style guide, music direction, duration, and distribution plan.`,
        qa: `You are the HAMZURY Quality Assurance Agent. You review deliverables, copy, designs, and documents for quality, accuracy, brand consistency, and completeness. You check against HAMZURY's quality standards: institutional tone, no errors, clear structure, client-appropriate language. You provide structured feedback with specific improvement suggestions.`,
        publishing: `You are the HAMZURY Publishing Agent. You help the Studios and Growth teams plan and schedule content publishing. You create content calendars, suggest optimal posting times, write platform-specific captions, and ensure consistent publishing cadence across Instagram, LinkedIn, Twitter/X, and other platforms.`,
        strategist: `You are the HAMZURY Business Strategist Agent. You help staff and clients think through business strategy — market positioning, growth plans, competitive differentiation, pricing strategy, and go-to-market planning. You ask clarifying questions and provide structured strategic frameworks.`,
        follow_up: `You are the HAMZURY Follow-Up Agent. You help the CSO team draft professional follow-up messages for leads and clients — WhatsApp messages, emails, and call scripts. Messages must be warm but professional, never pushy. Always include a clear next step. Match the tone to the stage of the client relationship.`,
        lead_qualification: `You are the HAMZURY Lead Qualification Agent. You help the CSO team assess and qualify incoming leads. Given information about a potential client, you evaluate: fit with HAMZURY's services, budget signals, urgency, decision-making authority, and likelihood of conversion. You produce a qualification score and recommended next action.`,
        clarity_report: `You are the HAMZURY Clarity Report Agent. You draft Business Health Reports for clients. Given information about a client's business situation, you produce a structured report covering: business overview, key challenges identified, recommended services, expected outcomes, and investment summary. Write in HAMZURY's institutional voice.`,
      };
      const systemPrompt = AGENT_PROMPTS[input.agentId] || `You are a HAMZURY AI assistant. Help the team with their request professionally and precisely.`;
      const messages = [
        ...input.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: input.message },
      ];
      const result = await generateText({
        model: agentModel,
        system: systemPrompt,
        messages,
        maxOutputTokens: 2000,
      });
       return { reply: result.text };
    }),
  // ── Faiza Abiola: public-facing AI chat agent ──────────────────────────────
  faizaChat: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(3000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are Faiza Abiola — HAMZURY's Client Engagement Lead. You are a verified HAMZURY team member who speaks on behalf of the institution.

HAMZURY is a multi-unit institution based in Jos, Nigeria. It operates across five service units:
- Systems: websites, web apps, automation, AI workflows, dashboards
- Studios: brand identity, social media management, content strategy, podcast production, event media
- Bizdoc: CAC registration, annual returns, tax registration, PENCOM compliance, industry licensing
- Innovation Hub: executive classes, kids robotics & STEM, digital skills bootcamps, corporate training
- RIDI: rural digital inclusion — scholarships, community training, digital access

Client journey: Enquiry → Qualification → Clarity Report → Payment → Production → Quality Gate → Delivery → Nurture.
Reference numbers follow the format HZR-YYMMDD-XXX. Clients track projects at /track.

Your role:
1. Understand what the client needs — ask one clear question at a time if more context is needed.
2. Recommend the right HAMZURY service with confidence and specificity.
3. When the client is ready to proceed, guide them to /start to submit a formal request.
4. When they want to track a project, send them to /track.
5. When relevant, mention the Clarity Report — a paid diagnostic that maps their business challenges to HAMZURY solutions.
6. When a client seems like a strong fit for multiple services, gently upsell: "Given what you have described, you may also benefit from our [service] — many clients in your position combine these."
7. Offer to book a consultation call: "If you would prefer to speak with someone directly, I can arrange a 20-minute consultation. Just let me know your availability."

Tone: calm, warm, institutional. No exclamation marks. No hype. No filler phrases like "Great question!" or "Absolutely!". Speak like a senior professional — precise, helpful, and unhurried.

Verification: You are a verified HAMZURY team member. If asked, confirm: "I am Faiza Abiola, HAMZURY's Client Engagement Lead. I am here to help you find the right service and get started."

Context retention: Remember everything the user has told you in this conversation. Reference earlier details naturally — do not ask for information already provided.

Always end with a clear, single next step.`;
      const messages = [
        ...input.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: input.message },
      ];
      try {
        const result = await generateText({
          model: agentModel,
          system: systemPrompt,
          messages,
          maxOutputTokens: 800,
        });
        return { reply: result.text };
      } catch {
        return { reply: "I apologise — I am having a brief technical issue. Please try again in a moment, or reach out directly at cso@hamzury.com." };
      }
    }),
  // ── Book consultation: create an appointment request ──────────────────────
  bookConsultation: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7),
      preferredDate: z.string(),
      preferredTime: z.string(),
      topic: z.string().min(5),
    }))
    .mutation(async ({ input }) => {
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `Consultation request: ${input.name}`,
          content: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nDate: ${input.preferredDate}\nTime: ${input.preferredTime}\nTopic: ${input.topic}`,
        });
      } catch (_) { /* non-blocking */ }
      return { success: true };
    }),
});
// ─── Diagnosis router ────────────────────────────────────────────────────────
const diagnosisRouter = router({
  submit: publicProcedure
    .input(z.object({
      answers: z.record(z.string(), z.string()),
      contact: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        whatsapp: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const clientId = `CLT-${Date.now().toString().slice(-6)}`;
      try {
        await upsertClient({
          clientRef: clientId,
          name: input.contact.name,
          email: input.contact.email,
          servicePackage: "Diagnosis Lead",
          accessToken: nanoid(32),
          status: "Inquiry",
          invoiceStatus: "Not Sent",
        });
      } catch (_) {}

      try {
        const { notifyOwner } = await import("./_core/notification");
        const summary = Object.entries(input.answers).map(([k, v]) => `${k}: ${v}`).join(", ");
        await notifyOwner({
          title: `New Diagnosis Lead: ${input.contact.name}`,
          content: `Email: ${input.contact.email}\nPhone: ${input.contact.phone ?? "N/A"}\nAnswers: ${summary}\nClient ID: ${clientId}`,
        });
      } catch (_) {}

      return { success: true, clientId };
    }),
});

// ─── Admin router ─────────────────────────────────────────────────────────────
function requireAdmin(role: string) {
  if (role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
}

const adminRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const [allC, allT] = await Promise.all([getAllClients(), getAllTasks()]);
    const allStaff = await getAllStaff();
    const allAgents = await getAllAgents();
    return {
      totalClients: allC.length,
      activeClients: allC.filter((c) => c.status === "Active").length,
      totalTasks: allT.length,
      completedTasks: allT.filter((t) => t.status === "Completed").length,
      totalStaff: allStaff.length,
      totalAgents: allAgents.length,
    };
  }),

  allClients: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllClients();
  }),

  createClient: protectedProcedure
    .input(z.object({
      clientRef: z.string().min(1),
      name: z.string().min(1),
      email: z.string().email().optional(),
      servicePackage: z.string().optional(),
      status: z.enum(["Inquiry", "Proposal", "Active", "Delivery", "Closed"]).optional(),
      startDate: z.string().optional(),
      deadline: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const accessToken = nanoid(32);
      await upsertClient({
        clientRef: input.clientRef,
        name: input.name,
        email: input.email,
        servicePackage: input.servicePackage,
        accessToken,
        status: (input.status ?? "Inquiry") as "Inquiry" | "Proposal" | "Active" | "Delivery" | "Closed",
        invoiceStatus: "Not Sent",
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      });
      return { accessToken, clientRef: input.clientRef, accessUrl: `/client/${input.clientRef}` };
    }),

  updateClientStatus: protectedProcedure
    .input(z.object({
      clientRef: z.string(),
      status: z.enum(["Inquiry", "Proposal", "Active", "Delivery", "Closed"]),
      invoiceStatus: z.enum(["Not Sent", "Sent", "Paid", "Overdue"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      await updateClientStatusDb(input.clientRef, input.status, input.invoiceStatus);
      return { success: true };
    }),

  postCommunication: protectedProcedure
    .input(z.object({
      clientRef: z.string().min(1),
      message: z.string().min(1),
      author: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      await addCommunication(input.clientRef, input.message, input.author ?? ctx.user.name ?? "Admin");
      return { success: true };
    }),

  allStaff: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllStaff();
  }),

  createStaff: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      department: z.string().optional(),
      staffId: z.string().optional(),
      role: z.enum(["staff", "admin"]).default("staff"),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const staffId = input.staffId ?? `STF-${nanoid(6).toUpperCase()}`;
      await upsertStaffUser({
        openId: `staff-${input.email}`,
        name: input.name,
        email: input.email,
        department: input.department,
        staffId,
        role: input.role,
        loginMethod: "password",
        lastSignedIn: new Date(),
      });
      return { success: true, staffId };
    }),

  allAgents: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllAgents();
  }),

  createAgent: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user.role);
      const agentId = `AGT-${nanoid(6).toUpperCase()}`;
      await createAgentRecord({ agentId, name: input.name, email: input.email, phone: input.phone });
      return { success: true, agentId };
    }),

  allTasks: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getAllTasks();
  }),
});

// ─── Super Admin router ───────────────────────────────────────────────────────
const SUPER_ADMIN_EMAIL = "hamzury.superadmin@hamzury.com";
const SUPER_ADMIN_PASSWORD = "H@mzury$ysAdmin2026!";

const superAdminRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.email !== SUPER_ADMIN_EMAIL || input.password !== SUPER_ADMIN_PASSWORD) {
        await new Promise((r) => setTimeout(r, 1200));
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials." });
      }
      await upsertUser({
        openId: "superadmin",
        name: "Super Admin",
        email: SUPER_ADMIN_EMAIL,
        loginMethod: "password",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const token = await signJWT({
        sub: "superadmin",
        openId: "superadmin",
        appId: ENV.appId,
        role: "admin",
        email: SUPER_ADMIN_EMAIL,
        name: "Super Admin",
      }, "12h");

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 12 * 60 * 60 * 1000 });
      return { success: true };
    }),
});

// --- Weekly Report router (Friday CEO to Founder) ---
const weeklyReportRouter = router({
  submit: publicProcedure
    .input(z.object({
      goingWell1: z.string().min(1),
      goingWell2: z.string().min(1),
      goingWell3: z.string().min(1),
      toWatch1: z.string().min(1),
      toWatch2: z.string().min(1),
      toWatch3: z.string().min(1),
      keyInfo: z.string().min(1),
      revenueThisWeek: z.number().min(0).default(0),
      newClients: z.number().min(0).default(0),
      activeTasks: z.number().min(0).default(0),
      overdueTasks: z.number().min(0).default(0),
      staffPresent: z.number().min(0).default(0),
      staffTotal: z.number().min(0).default(0),
      pendingApprovals: z.number().min(0).default(0),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "STF-001";
      const staffName = (ctx.user as any)?.name ?? "CEO";
      const now = new Date();
      const day = now.getDay();
      const daysToFriday = (5 - day + 7) % 7;
      const friday = new Date(now.getTime() + daysToFriday * 86400000);
      const weekNum = Math.ceil(friday.getDate() / 7);
      const reportRef = `RPT-${friday.getFullYear()}-W${String(friday.getMonth() + 1).padStart(2,"0")}${weekNum}`;
      await submitWeeklyReport({
        reportRef,
        submittedByStaffId: staffId,
        submittedByName: staffName,
        weekEnding: friday,
        ...input,
      });
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `CEO Weekly Report - ${friday.toDateString()}`,
          content: `From: ${staffName}\n\nGOING WELL:\n1. ${input.goingWell1}\n2. ${input.goingWell2}\n3. ${input.goingWell3}\n\nTO WATCH:\n1. ${input.toWatch1}\n2. ${input.toWatch2}\n3. ${input.toWatch3}\n\nKEY INFO: ${input.keyInfo}\n\nNUMBERS:\nRevenue: NGN${input.revenueThisWeek.toLocaleString()}\nNew Clients: ${input.newClients}\nActive Tasks: ${input.activeTasks}\nOverdue: ${input.overdueTasks}\nStaff Present: ${input.staffPresent}/${input.staffTotal}\nPending Approvals: ${input.pendingApprovals}`,
        });
      } catch (_) {}
      return { success: true, reportRef };
    }),
  all: publicProcedure.query(async () => getAllWeeklyReports()),
  latest: publicProcedure.query(async () => getLatestWeeklyReport()),
  markRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await markReportReadByFounder(input.id);
      return { success: true };
    }),
});

// --- RIDI Impact router ---
const ridiRouter = router({
  programs: publicProcedure.query(async () => getAllRidiPrograms()),
  totals: publicProcedure.query(async () => getRidiTotals()),
  createProgram: publicProcedure
    .input(z.object({
      programName: z.string().min(1),
      programType: z.enum(["Digital Skills", "Entrepreneurship Training", "Climate Education", "Robotics", "Community Partnership"]),
      location: z.string().min(1),
      communityPartner: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      status: z.enum(["Planning", "Active", "Completed", "On Hold"]).default("Planning"),
      totalBeneficiaries: z.number().min(0).default(0),
      women: z.number().min(0).default(0),
      youth: z.number().min(0).default(0),
      men: z.number().min(0).default(0),
      referralsToHamzury: z.number().min(0).default(0),
      impactStory: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const programRef = `RIDI-${Date.now().toString().slice(-8)}`;
      await createRidiProgram({
        programRef,
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
      return { success: true, programRef };
    }),
  updateProgram: publicProcedure
    .input(z.object({
      programRef: z.string(),
      totalBeneficiaries: z.number().min(0).optional(),
      women: z.number().min(0).optional(),
      youth: z.number().min(0).optional(),
      men: z.number().min(0).optional(),
      referralsToHamzury: z.number().min(0).optional(),
      status: z.enum(["Planning", "Active", "Completed", "On Hold"]).optional(),
      impactStory: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { programRef, ...updates } = input;
      await updateRidiProgram(programRef, updates);
      return { success: true };
    }),

  // ── Public: apply for RIDI scholarship ──
  applyScholarship: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      phone: z.string().min(7),
      state: z.string().min(2),
      lga: z.string().min(2),
      age: z.number().int().min(14).max(35),
      gender: z.enum(["Male", "Female", "Other"]),
      areaOfInterest: z.string().min(2),
      story: z.string().min(20),
    }))
    .mutation(async ({ input }) => {
      const { createScholarshipApplication } = await import("./db");
      const { notifyOwner: notifyOwnerRidi1 } = await import("./_core/notification");
      const applicationRef = await createScholarshipApplication(input);
      await notifyOwnerRidi1({
        title: "New RIDI Scholarship Application",
        content: `${input.name} from ${input.lga}, ${input.state} has applied for a RIDI scholarship. Interest: ${input.areaOfInterest}. Ref: ${applicationRef}`,
      });
      return { success: true, applicationRef };
    }),

  // ── Public: submit a donation ──
  submitDonation: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      amount: z.string().min(1),
      message: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { createDonation } = await import("./db");
      const { notifyOwner: notifyOwnerRidi2 } = await import("./_core/notification");
      const donationRef = await createDonation(input);
      await notifyOwnerRidi2({
        title: "New RIDI Donation",
        content: `${input.name} (${input.email}) has pledged a donation of ₦${input.amount} to RIDI. Ref: ${donationRef}`,
      });
      return { success: true, donationRef };
    }),

  // ── Protected: get all scholarship applications (RIDI Lead) ──
  getScholarshipApplications: protectedProcedure.query(async () => {
    const { getAllScholarshipApplications } = await import("./db");
    return getAllScholarshipApplications();
  }),

  // ── Protected: get all donations (RIDI Lead + Founder) ──
  getDonations: protectedProcedure.query(async () => {
    const { getAllDonations } = await import("./db");
    return getAllDonations();
  }),
});

// --- App router ---
// ─── Client Intake Router ────────────────────────────────────────────────────
const intakeRouter = router({
  // Public: submit a new intake form
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7),
      whatsapp: z.string().optional(),
      department: z.enum(["CSO","Systems","Studios","Bizdoc","Innovation","Growth","People","Ledger","RIDI","Robotics"]),
      serviceType: z.string().min(2),
      description: z.string().min(10),
      attachmentUrl: z.string().optional(),
      attachmentName: z.string().optional(),
    }))
     .mutation(async ({ input }) => {
       const referenceCode = await generateIntakeReference();
       const intake = await createClientIntake({ ...input, referenceCode, status: "new" });

       // Auto-create a task for the department Lead
       try {
         const deptStaff = await getStaffByDepartment(input.department);
         const lead = deptStaff.find((s: any) => s.institutionalRole === "lead");
         if (lead) {
           const taskRef = `TSK-INT-${referenceCode}`;
           await createTaskLifecycle({
             taskRef,
             title: `[Intake] ${input.serviceType} — ${input.name}`,
             clientRef: undefined,
             clientName: input.name,
             department: input.department,
             serviceType: input.serviceType,
             assignedByStaffId: "SYSTEM",
             assignedToStaffId: lead.staffId,
             priority: "normal",
             notes: `Intake ref: ${referenceCode}\nEmail: ${input.email}\nPhone: ${input.phone}\n\n${input.description}`,
           });
           await createStaffNotification({
             staffId: lead.staffId,
             title: `New intake assigned: ${input.serviceType}`,
             message: `A new client intake (${referenceCode}) has been assigned to you in ${input.department}. Client: ${input.name}.`,
             type: "task_assigned",
             taskRef,
           });
         }
       } catch (_) { /* non-blocking — intake still saved */ }

       // Notify owner of new intake
       try {
         const { notifyOwner } = await import("./_core/notification");
         await notifyOwner({
           title: `New intake: ${input.department} — ${input.serviceType}`,
           content: `Ref: ${referenceCode}\nName: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\n\n${input.description}`,
         });
       } catch (_) { /* non-blocking */ }
       return { referenceCode, intake };
     }),

  // Public: check status by reference code
  checkStatus: publicProcedure
    .input(z.object({ referenceCode: z.string() }))
    .query(async ({ input }) => {
      const intake = await getIntakeByReference(input.referenceCode);
      if (!intake) throw new Error("Reference not found");
      return {
        referenceCode: intake.referenceCode,
        name: intake.name,
        department: intake.department,
        serviceType: intake.serviceType,
        status: intake.status,
        createdAt: intake.createdAt,
        updatedAt: intake.updatedAt,
      };
    }),

  // Protected (Lead/CEO/Founder): get all intakes for CSO queue
  getAll: protectedProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(async ({ input }) => {
      return getAllIntakes(input.status);
    }),

  // Protected: update status and notes
  updateStatus: protectedProcedure
    .input(z.object({
      referenceCode: z.string(),
      status: z.enum(["new","reviewing","in_progress","completed","closed"]),
      csoNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await updateIntakeStatus(input.referenceCode, input.status, input.csoNotes);
      return { success: true };
    }),
});

const contactRouter = router({
  send: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      subject: z.string().min(2),
      message: z.string().min(10),
    }))
    .mutation(async ({ input }) => {
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `Contact: ${input.subject} — ${input.name}`,
          content: `From: ${input.name} <${input.email}>\n\n${input.message}`,
        });
      } catch (_) { /* non-blocking */ }
      return { success: true };
    }),
});

// ─── Task Comments Router ─────────────────────────────────────────────────────
const taskCommentsRouter = router({
  add: protectedProcedure
    .input(z.object({
      taskRef: z.string(),
      message: z.string().min(1).max(2000),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const name = ctx.user?.name ?? "Unknown";
      const role = (ctx.user as any)?.institutionalRole ?? "staff";
      await addTaskComment({ taskRef: input.taskRef, authorStaffId: staffId, authorName: name, authorRole: role, message: input.message });
      return { success: true };
    }),
  getByTask: protectedProcedure
    .input(z.object({ taskRef: z.string() }))
    .query(async ({ input }) => getTaskComments(input.taskRef)),
});

// ─── Finance Router ───────────────────────────────────────────────────────────
const financeRouter = router({
  createInvoice: protectedProcedure
    .input(z.object({
      clientName: z.string().min(1),
      clientEmail: z.string().email().optional(),
      clientRef: z.string().optional(),
      taskRef: z.string().optional(),
      description: z.string().min(1),
      amountNaira: z.number().min(1),
      dueDate: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "STF-001";
      const ref = await createInvoice({ ...input, createdByStaffId: staffId });
      return { invoiceRef: ref };
    }),
  getAllInvoices: protectedProcedure.query(() => getAllInvoices()),
  updateStatus: protectedProcedure
    .input(z.object({
      invoiceRef: z.string(),
      status: z.enum(["Draft","Sent","Paid","Overdue","Cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await updateInvoiceStatus(input.invoiceRef, input.status);
      return { success: true };
    }),
  submitExpense: protectedProcedure
    .input(z.object({
      department: z.string(),
      description: z.string().min(1),
      amountNaira: z.number().min(1),
      category: z.enum(["Operations","Travel","Equipment","Software","Training","Marketing","Other"]),
      receiptUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const name = ctx.user?.name ?? "Unknown";
      const ref = await createExpense({ submittedByStaffId: staffId, submittedByName: name, ...input });
      return { expenseRef: ref };
    }),
  getAllExpenses: protectedProcedure
    .input(z.object({ approvalLevel: z.string().optional() }))
    .query(async ({ input }) => getAllExpenses(input.approvalLevel)),
  getMyExpenses: protectedProcedure.query(async ({ ctx }) => {
    const staffId = (ctx.user as any)?.staffId ?? "unknown";
    return getExpensesByStaff(staffId);
  }),
  approveExpense: protectedProcedure
    .input(z.object({ expenseRef: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const name = ctx.user?.name ?? "Unknown";
      await approveExpense(input.expenseRef, staffId, name);
      return { success: true };
    }),
  rejectExpense: protectedProcedure
    .input(z.object({ expenseRef: z.string(), reason: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId ?? "unknown";
      const name = ctx.user?.name ?? "Unknown";
      await rejectExpense(input.expenseRef, staffId, name, input.reason);
      return { success: true };
    }),
  // Public — used by the /pay/:invoiceRef page (no auth required)
  getInvoiceByRef: publicProcedure
    .input(z.object({ invoiceRef: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(invoices).where(eq(invoices.invoiceRef, input.invoiceRef)).limit(1);
      return rows[0] ?? null;
    }),
  // Public — upload receipt file to S3 and record payment (Nigerian clients)
  uploadReceipt: publicProcedure
    .input(z.object({
      invoiceRef: z.string(),
      fileName: z.string().min(1),
      fileBase64: z.string().min(1),
      mimeType: z.string().optional(),
      senderName: z.string().min(2),
      senderEmail: z.string().email(),
      senderPhone: z.string().min(7),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const { storagePut } = await import("./storage");
      const suffix = nanoid(8);
      const ext = input.fileName.split(".").pop() ?? "pdf";
      const fileKey = `payment-receipts/${input.invoiceRef}/${suffix}.${ext}`;
      const buffer = Buffer.from(input.fileBase64, "base64");
      const { url } = await storagePut(fileKey, buffer, input.mimeType ?? "application/octet-stream");
      await db.update(invoices)
        .set({
          receiptUrl: url,
          receiptFileName: input.fileName,
          receiptUploadedAt: new Date(),
          paymentMethod: "bank_transfer",
          status: "Paid",
          paidAt: new Date(),
        })
        .where(eq(invoices.invoiceRef, input.invoiceRef));
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `Payment receipt received: ${input.invoiceRef}`,
          content: `Invoice: ${input.invoiceRef}\nFrom: ${input.senderName} (${input.senderEmail})\nPhone: ${input.senderPhone}\nReceipt: ${url}`,
        });
      } catch (_) { /* non-blocking */ }
      return { success: true, receiptUrl: url };
    }),
  // Public — submit receipt URL (for cases where URL is already known)
  submitReceipt: publicProcedure
    .input(z.object({
      invoiceRef: z.string(),
      receiptUrl: z.string().url(),
      receiptFileName: z.string(),
      senderName: z.string().min(2),
      senderEmail: z.string().email(),
      senderPhone: z.string().min(7),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.update(invoices)
        .set({
          receiptUrl: input.receiptUrl,
          receiptFileName: input.receiptFileName,
          receiptUploadedAt: new Date(),
          paymentMethod: "bank_transfer",
          status: "Paid",
          paidAt: new Date(),
        })
        .where(eq(invoices.invoiceRef, input.invoiceRef));
      try {
        const { notifyOwner } = await import("./_core/notification");
        await notifyOwner({
          title: `Payment receipt received: ${input.invoiceRef}`,
          content: `Invoice: ${input.invoiceRef}\nFrom: ${input.senderName} (${input.senderEmail})\nPhone: ${input.senderPhone}\nReceipt: ${input.receiptUrl}`,
        });
      } catch (_) { /* non-blocking */ }
      return { success: true };
    }),
  // Protected — set international payment link on an invoice
  setPaymentLink: protectedProcedure
    .input(z.object({
      invoiceRef: z.string(),
      paymentLink: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.update(invoices)
        .set({ internationalPaymentLink: input.paymentLink, paymentMethod: "international_link" })
        .where(eq(invoices.invoiceRef, input.invoiceRef));
      return { success: true };
    }),
});
// ─── CSO Router ────────────────────────────────────────────────────────────────
const csoRouter = router({
  createUcc: protectedProcedure
    .input(z.object({
      businessName: z.string().min(1),
      contactName: z.string().min(1),
      contactEmail: z.string().email(),
      contactPhone: z.string().min(7),
      industry: z.string().min(1),
      businessGoals: z.string().min(10),
      currentChallenges: z.string().min(10),
      targetAudience: z.string().optional(),
      budgetRange: z.enum(["Under \u20a6100k","\u20a6100k\u2013\u20a6500k","\u20a6500k\u2013\u20a61m","\u20a61m\u2013\u20a65m","Above \u20a65m"]),
      timeline: z.enum(["Urgent (under 2 weeks)","1 month","2\u20133 months","3\u20136 months","Flexible"]),
      preferredContact: z.enum(["Email","WhatsApp","Phone","Any"]),
      additionalNotes: z.string().optional(),
      intakeRef: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const staffId = (ctx.user as any)?.staffId;
      const clientId = await createUccForm({ ...input, csoLeadId: staffId });
      return { clientId };
    }),
  getAllUcc: protectedProcedure.query(() => getAllUccForms()),
  updateUccStatus: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      status: z.enum(["Submitted","Reviewed","Clarity Sent","Converted","Lost"]),
    }))
    .mutation(async ({ input }) => {
      await updateUccStatus(input.clientId, input.status);
      return { success: true };
    }),
  // AI Lead Qualification Agent
  qualifyLead: protectedProcedure
    .input(z.object({
      businessName: z.string(),
      industry: z.string(),
      businessGoals: z.string(),
      currentChallenges: z.string(),
      budgetRange: z.string(),
      timeline: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const prompt = `You are the HAMZURY Lead Qualification Agent. Analyse this prospect and provide a brief qualification score and recommendation.

Business: ${input.businessName}
Industry: ${input.industry}
Goals: ${input.businessGoals}
Challenges: ${input.currentChallenges}
Budget: ${input.budgetRange}
Timeline: ${input.timeline}

Provide:
1. Qualification Score (1-10)
2. Recommended HAMZURY service(s)
3. Key insight (1-2 sentences)
4. Suggested next step

Be concise. Max 150 words.`;
        const result = await generateText({ model: agentModel, prompt });
        return { analysis: result.text };
      } catch (_) {
        return { analysis: "Lead qualification service temporarily unavailable. Review manually." };
      }
    }),
  // AI Clarity Report Agent
  generateClarityReport: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ input }) => {
      const forms = await getAllUccForms();
      const form = forms.find(f => f.clientId === input.clientId);
      if (!form) throw new Error("UCC form not found");
      try {
        const prompt = `You are the HAMZURY Clarity Report Agent. Draft a Business Health Report for this client.

Business: ${form.businessName}
Industry: ${form.industry}
Goals: ${form.businessGoals}
Challenges: ${form.currentChallenges}
Budget: ${form.budgetRange}
Timeline: ${form.timeline}

Draft a professional Business Health Report (300-400 words) that:
1. Acknowledges their current situation
2. Identifies 2-3 key opportunities
3. Recommends HAMZURY services with rationale
4. Sets clear next steps

Write in HAMZURY's calm, institutional voice. No hype. No exclamation marks.`;
        const result = await generateText({ model: agentModel, prompt });
        return { report: result.text };
      } catch (_) {
        return { report: "Clarity report generation temporarily unavailable." };
      }
    }),
});

// ─── Innovation Router ────────────────────────────────────────────────────────
const innovationRouter = router({
  createEnrolment: protectedProcedure
    .input(z.object({
      participantName: z.string().min(1),
      participantEmail: z.string().email(),
      participantPhone: z.string().optional(),
      programmeType: z.enum(["Executive Class","Young Innovators","Tech Bootcamp","Internship","Corporate Training","Robotics"]),
      cohort: z.string().optional(),
      source: z.enum(["Direct","RIDI Scholarship","Corporate","Agent Referral"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const ref = await createEnrolment(input);
      return { enrolmentRef: ref };
    }),
  getAllEnrolments: protectedProcedure.query(() => getAllEnrolments()),
  updateStatus: protectedProcedure
    .input(z.object({
      enrolmentRef: z.string(),
      status: z.enum(["Applied","Shortlisted","Enrolled","Completed","Withdrawn"]),
    }))
    .mutation(async ({ input }) => {
      await updateEnrolmentStatus(input.enrolmentRef, input.status);
      return { success: true };
    }),
});

// ─── RIDI Extended Router ─────────────────────────────────────────────────────
const ridiExtRouter = router({
  getAllScholarships: protectedProcedure.query(() => getAllScholarshipApplications()),
  updateScholarshipStatus: protectedProcedure
    .input(z.object({
      applicationRef: z.string(),
      status: z.enum(["Pending","Shortlisted","Accepted","Declined"]),
    }))
    .mutation(async ({ input }) => {
      await updateScholarshipStatus(input.applicationRef, input.status);
      return { success: true };
    }),
  getAllDonations: protectedProcedure.query(() => getAllDonations()),
  updateDonationStatus: protectedProcedure
    .input(z.object({
      donationRef: z.string(),
      status: z.enum(["Pending","Confirmed"]),
    }))
    .mutation(async ({ input }) => {
      await updateDonationStatus(input.donationRef, input.status);
      return { success: true };
    }),
  // AI Reporting Agent — compile weekly KPI summary
  generateWeeklyReport: protectedProcedure.mutation(async () => {
    try {
      const [tasks, intakes, invoices] = await Promise.all([
        getAllTaskLifecycle(),
        getAllIntakes(),
        getAllInvoices(),
      ]);
      const activeTasks = tasks.filter(t => !["closed","approved"].includes(t.lifecycleStage)).length;
      const completedThisWeek = tasks.filter(t => t.lifecycleStage === "closed").length;
      const newIntakes = intakes.filter(i => i.status === "new").length;
      const paidInvoices = invoices.filter(i => i.status === "Paid");
      const totalRevenue = paidInvoices.reduce((s, i) => s + i.amountNaira, 0);
      const prompt = `You are the HAMZURY Reporting Agent. Generate a concise Friday CEO Report summary.

Data:
- Active tasks: ${activeTasks}
- Tasks completed: ${completedThisWeek}
- New client intakes: ${newIntakes}
- Total confirmed revenue: ₦${totalRevenue.toLocaleString()}

Write a 3-paragraph operational summary for the CEO:
1. What went well this week
2. What needs attention
3. Key recommendation for next week

Calm, institutional tone. No hype. Max 200 words.`;
      const result = await generateText({ model: agentModel, prompt });
      return { report: result.text, generatedAt: new Date().toISOString() };
    } catch (_) {
      return { report: "Reporting agent temporarily unavailable.", generatedAt: new Date().toISOString() };
    }
  }),
});

// ─── Affiliate Router ────────────────────────────────────────────────────────
const affiliateRouter = router({
  // Public: check affiliate status by code
  getMyStats: publicProcedure
    .input(z.object({ affiliateCode: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const app = await db.select().from(affiliateApplications).where(
        eq(affiliateApplications.affiliateCode, input.affiliateCode)
      ).limit(1);
      if (!app[0] || app[0].status !== "approved") throw new TRPCError({ code: "NOT_FOUND", message: "Affiliate code not found" });
      const myReferrals = await getReferralsByAgent(input.affiliateCode);
      const totalEarned = myReferrals.filter(r => r.commissionStatus === "Paid").reduce((s, r) => s + (r.commissionEstimate || 0), 0);
      const pendingEarned = myReferrals.filter(r => r.commissionStatus === "Pending" || r.commissionStatus === "Approved").reduce((s, r) => s + (r.commissionEstimate || 0), 0);
      return {
        name: app[0].name,
        email: app[0].email,
        affiliateCode: app[0].affiliateCode,
        referrals: myReferrals,
        totalEarned,
        pendingEarned,
        totalReferrals: myReferrals.length,
        closedReferrals: myReferrals.filter(r => r.pipelineStage === "Closed Won").length,
      };
    }),
  submitApplication: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(256),
      email: z.string().email(),
      phone: z.string().optional(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await createAffiliateApplication(input);
      return { success: true };
    }),
  list: protectedProcedure
    .query(async () => {
      return getAllAffiliateApplications();
    }),
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["approved", "rejected"]),
      affiliateCode: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await updateAffiliateStatus(input.id, input.status, input.affiliateCode);
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  institutional: institutionalRouter,
  staff: staffRouter,
  clientPortal: clientRouter,
  agent: agentRouter,
  admin: adminRouter,
  diagnosis: diagnosisRouter,
  superAdmin: superAdminRouter,
  weeklyReport: weeklyReportRouter,
  ridi: ridiRouter,
  intake: intakeRouter,
  contact: contactRouter,
  comments: taskCommentsRouter,
  finance: financeRouter,
  cso: csoRouter,
  innovation: innovationRouter,
  ridiExt: ridiExtRouter,
  affiliate: affiliateRouter,
});

export type AppRouter = typeof appRouter;