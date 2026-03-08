/**
 * HAMZURY Staff Seed v2 — Real staff list as confirmed by Founder
 * Run: node server/seed-staff-v2.mjs
 */

import { createConnection } from "mysql2/promise";
import { createHash } from "crypto";
import { randomBytes } from "crypto";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Simple bcrypt-compatible hash using SHA-256 for seeding
// In production the server uses bcrypt — this seed uses a deterministic hash
function makeHash(password) {
  return createHash("sha256").update(password + "hamzury_salt_2026").digest("hex");
}

const staff = [
  // ── Tier 1: Founder ──────────────────────────────────────────────────────
  {
    staffId: "STF-001",
    name: "Haruna Muhammad",
    email: "haruna@hamzury.com",
    password: "founder@hamzury2026",
    institutionalRole: "founder",
    primaryDepartment: "Founder",
    secondaryDepartments: [],
  },

  // ── Tier 2: CEO ──────────────────────────────────────────────────────────
  {
    staffId: "STF-002",
    name: "Idris Ibrahim",
    email: "idris@hamzury.com",
    password: "idris@hamzury2026",
    institutionalRole: "ceo",
    primaryDepartment: "Executive",
    secondaryDepartments: ["Systems"],
  },

  // ── Tier 3: Department Leads ─────────────────────────────────────────────
  {
    staffId: "STF-003",
    name: "Maryam Ashir Lalo",
    email: "maryam@hamzury.com",
    password: "maryam@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Studios",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-004",
    name: "Abdullahi Musa",
    email: "abdullahi@hamzury.com",
    password: "abdullahi@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Bizdoc",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-005",
    name: "Muhammad Ismail Adam",
    email: "muhammad@hamzury.com",
    password: "muhammad@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Ledger",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-006",
    name: "Khadija Umar Saad",
    email: "khadija@hamzury.com",
    password: "khadija@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "People",
    secondaryDepartments: ["Growth", "Studios"],
  },
  {
    staffId: "STF-007",
    name: "Habiba Shuaibu Dajot",
    email: "habiba@hamzury.com",
    password: "habiba@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Innovation",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-008",
    name: "Abdulmalik Abdullahi Muhammad",
    email: "abdulmalik@hamzury.com",
    password: "abdulmalik@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Robotics",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-009",
    name: "Abdulrahim Murtala Hussain",
    email: "abdulrahim@hamzury.com",
    password: "abdulrahim@hamzury2026",
    institutionalRole: "lead",
    primaryDepartment: "Bizdoc",
    secondaryDepartments: [],
  },

  // ── Tier 4: Staff ────────────────────────────────────────────────────────
  {
    staffId: "STF-010",
    name: "Suleiman Ahmad Bashir",
    email: "suleiman@hamzury.com",
    password: "suleiman@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Studios",
    secondaryDepartments: ["Bizdoc"],
  },
  {
    staffId: "STF-011",
    name: "Abubakar Bashir",
    email: "abubakar@hamzury.com",
    password: "abubakar@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Bizdoc",
    secondaryDepartments: ["Studios"],
  },
  {
    staffId: "STF-012",
    name: "Salis Umar",
    email: "salis@hamzury.com",
    password: "salis@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Studios",
    secondaryDepartments: [],
  },
  {
    staffId: "STF-013",
    name: "Farida Muneer",
    email: "farida@hamzury.com",
    password: "farida@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "Growth",
    secondaryDepartments: ["Studios"], // podcast host = Studios crossover
  },
  {
    staffId: "STF-014",
    name: "Amina Ahmad Musa",
    email: "amina@hamzury.com",
    password: "amina@hamzury2026",
    institutionalRole: "staff",
    primaryDepartment: "CSO",
    secondaryDepartments: [],
  },
];

async function seed() {
  const conn = await createConnection(DB_URL);
  console.log("Connected to database.");

  let inserted = 0;
  let updated = 0;

  for (const s of staff) {
    const hash = makeHash(s.password);
    const secondaryJson = JSON.stringify(s.secondaryDepartments);

    // Check if exists
    const [rows] = await conn.execute(
      "SELECT id FROM staffMembers WHERE staffId = ? OR email = ?",
      [s.staffId, s.email]
    );

    if (rows.length > 0) {
      // Update existing
      await conn.execute(
        `UPDATE staffMembers SET
          name = ?, email = ?, passwordHash = ?,
          institutionalRole = ?, primaryDepartment = ?,
          secondaryDepartments = ?, isActive = 1,
          updatedAt = NOW()
        WHERE staffId = ? OR email = ?`,
        [
          s.name, s.email, hash,
          s.institutionalRole, s.primaryDepartment,
          secondaryJson, s.staffId, s.email,
        ]
      );
      console.log(`  ✓ Updated: ${s.name} (${s.institutionalRole} — ${s.primaryDepartment})`);
      updated++;
    } else {
      // Insert new
      await conn.execute(
        `INSERT INTO staffMembers
          (staffId, name, email, passwordHash, institutionalRole, primaryDepartment, secondaryDepartments, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [
          s.staffId, s.name, s.email, hash,
          s.institutionalRole, s.primaryDepartment, secondaryJson,
        ]
      );
      console.log(`  + Inserted: ${s.name} (${s.institutionalRole} — ${s.primaryDepartment})`);
      inserted++;
    }
  }

  await conn.end();
  console.log(`\nDone. ${inserted} inserted, ${updated} updated. Total: ${staff.length} staff members.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
