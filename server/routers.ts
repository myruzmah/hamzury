import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
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
} from "./db";
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
      await upsertUser({
        openId: `staff-${member.staffId}`,
        name: member.name,
        email: member.email,
        loginMethod: "password",
        role: member.institutionalRole === "founder" || member.institutionalRole === "ceo" ? "admin" : "staff",
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
});

// --- App router ---
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
});

export type AppRouter = typeof appRouter;