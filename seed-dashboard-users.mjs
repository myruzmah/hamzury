/**
 * HAMZURY — Seed Default Dashboard Users
 * 
 * Creates the 7 default login accounts for each dashboard role.
 * Default password = email address (e.g. cso@hamzury.com / cso@hamzury.com)
 * mustChangePassword = true (forces password change on first login)
 * 
 * Run: node seed-dashboard-users.mjs
 */

import { createHash } from "crypto";
import mysql from "mysql2/promise";

// ─── Password hashing (matches server/db.ts hashStaffPassword) ───────────────
function hashPassword(password) {
  return createHash("sha256").update(password + "hamzury_salt_2026").digest("hex");
}

// ─── Default users to seed ───────────────────────────────────────────────────
const DEFAULT_USERS = [
  {
    staffId: "DSH-001",
    name: "CSO Dashboard",
    email: "cso@hamzury.com",
    institutionalRole: "lead",
    dashboardRole: "cso",
    primaryDepartment: "CSO",
  },
  {
    staffId: "DSH-002",
    name: "CEO Dashboard",
    email: "ceo@hamzury.com",
    institutionalRole: "ceo",
    dashboardRole: "ceo",
    primaryDepartment: "Executive",
  },
  {
    staffId: "DSH-003",
    name: "Founder Dashboard",
    email: "founder@hamzury.com",
    institutionalRole: "founder",
    dashboardRole: "founder",
    primaryDepartment: "Founder",
  },
  {
    staffId: "DSH-004",
    name: "Finance Dashboard",
    email: "finance@hamzury.com",
    institutionalRole: "lead",
    dashboardRole: "finance",
    primaryDepartment: "Ledger",
  },
  {
    staffId: "DSH-005",
    name: "HR Dashboard",
    email: "hr@hamzury.com",
    institutionalRole: "lead",
    dashboardRole: "hr",
    primaryDepartment: "People",
  },
  {
    staffId: "DSH-006",
    name: "BizDev Dashboard",
    email: "bizdev@hamzury.com",
    institutionalRole: "lead",
    dashboardRole: "bizdev",
    primaryDepartment: "Growth",
  },
  {
    staffId: "DSH-007",
    name: "Staff Dashboard",
    email: "staff1@hamzury.com",
    institutionalRole: "staff",
    dashboardRole: "staff",
    primaryDepartment: "CSO",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  // Parse DATABASE_URL: mysql://user:pass@host:port/dbname?ssl=...
  const urlObj = new URL(dbUrl);
  const conn = await mysql.createConnection({
    host: urlObj.hostname,
    port: parseInt(urlObj.port) || 3306,
    user: urlObj.username,
    password: urlObj.password,
    database: urlObj.pathname.replace("/", ""),
    ssl: { rejectUnauthorized: true },
  });

  console.log("✅ Connected to database");

  for (const user of DEFAULT_USERS) {
    const passwordHash = hashPassword(user.email); // Default: email = password
    
    // Check if already exists
    const [existing] = await conn.execute(
      "SELECT staffId FROM staffMembers WHERE email = ? OR staffId = ? LIMIT 1",
      [user.email, user.staffId]
    );
    
    if (existing.length > 0) {
      // Update dashboardRole and ensure mustChangePassword is set
      await conn.execute(
        `UPDATE staffMembers SET 
          dashboardRole = ?,
          mustChangePassword = 1,
          updatedAt = NOW()
         WHERE email = ?`,
        [user.dashboardRole, user.email]
      );
      console.log(`⟳  Updated: ${user.email} (${user.dashboardRole})`);
    } else {
      // Insert new default user
      await conn.execute(
        `INSERT INTO staffMembers 
          (staffId, name, email, passwordHash, institutionalRole, dashboardRole, primaryDepartment, isActive, mustChangePassword, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())`,
        [
          user.staffId,
          user.name,
          user.email,
          passwordHash,
          user.institutionalRole,
          user.dashboardRole,
          user.primaryDepartment,
        ]
      );
      console.log(`✅ Created: ${user.email} → password: ${user.email} (mustChangePassword: true)`);
    }
  }

  await conn.end();
  console.log("\n🎉 Seed complete. Default credentials:");
  DEFAULT_USERS.forEach(u => {
    console.log(`   ${u.email.padEnd(30)} / ${u.email}`);
  });
  console.log("\n⚠️  All accounts require a password change on first login.");
}

main().catch(e => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
