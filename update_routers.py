import re

content = open('server/routers.ts').read()

# Add new db imports
old_import = "import {\n  addAuditEntry,"
new_import = """import {
  addAuditEntry,
  createRidiProgram,
  getAllRidiPrograms,
  getAllWeeklyReports,
  getLatestWeeklyReport,
  getRidiTotals,
  markReportReadByFounder,
  submitWeeklyReport,
  updateRidiProgram,"""

content = content.replace(old_import, new_import, 1)

# Find the app router section and replace it
old_app_marker = "export const appRouter = router({"
idx = content.find(old_app_marker)
if idx == -1:
    print("ERROR: appRouter not found")
    exit(1)

# Find the comment line before appRouter
comment_start = content.rfind("// ", 0, idx)
# Find the end of the appRouter block
end_idx = content.find("export type AppRouter = typeof appRouter;", idx)
end_idx += len("export type AppRouter = typeof appRouter;")

new_routers = """// --- Weekly Report router (Friday CEO to Founder) ---
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
          content: `From: ${staffName}\\n\\nGOING WELL:\\n1. ${input.goingWell1}\\n2. ${input.goingWell2}\\n3. ${input.goingWell3}\\n\\nTO WATCH:\\n1. ${input.toWatch1}\\n2. ${input.toWatch2}\\n3. ${input.toWatch3}\\n\\nKEY INFO: ${input.keyInfo}\\n\\nNUMBERS:\\nRevenue: NGN${input.revenueThisWeek.toLocaleString()}\\nNew Clients: ${input.newClients}\\nActive Tasks: ${input.activeTasks}\\nOverdue: ${input.overdueTasks}\\nStaff Present: ${input.staffPresent}/${input.staffTotal}\\nPending Approvals: ${input.pendingApprovals}`,
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

export type AppRouter = typeof appRouter;"""

# Replace from comment_start to end_idx
content = content[:comment_start] + new_routers
open('server/routers.ts', 'w').write(content)
print("SUCCESS: routers.ts updated")
