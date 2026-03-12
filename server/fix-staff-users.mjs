/**
 * One-time fix: update users table rows for staff accounts
 * to have the correct staffId and department from the staffMembers table.
 * This fixes the "Studios" default bug on all lead dashboards.
 */
import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
try {
  const envPath = resolve(__dirname, "../.env");
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const conn = await createConnection(dbUrl);

// Get all staff members
const [staffRows] = await conn.query(
  "SELECT staffId, email, primaryDepartment, institutionalRole FROM staffMembers WHERE isActive = 1"
);

console.log(`Found ${staffRows.length} active staff members`);

let updated = 0;
for (const staff of staffRows) {
  const openId = `staff-${staff.staffId}`;
  const [result] = await conn.query(
    "UPDATE users SET staffId = ?, department = ? WHERE openId = ? OR email = ?",
    [staff.staffId, staff.primaryDepartment, openId, staff.email]
  );
  if (result.affectedRows > 0) {
    console.log(`  ✓ Fixed: ${staff.email} → staffId=${staff.staffId}, dept=${staff.primaryDepartment}`);
    updated++;
  } else {
    console.log(`  - No user row found for: ${staff.email} (openId: ${openId})`);
  }
}

console.log(`\nDone. Updated ${updated} user rows.`);
await conn.end();
