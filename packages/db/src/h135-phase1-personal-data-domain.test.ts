/// <reference types="vitest" />
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "./index.js";
import { migrateTargetRefuseReason } from "./migrate-guard.js";

const FILENAME = "125_h135_phase1_personal_data_domain.sql";

function migrationSource(): string {
  return readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "migrations", FILENAME), "utf8");
}

describe("H-135 Phase 1 personal-data domain migration (static; Dev/Test only)", () => {
  it("is the next sequential file after 124 and is listed by listMigrationFiles", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith(`migrations/${FILENAME}`))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/126_h203_commercial_core_programme_rfp_finance.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/127_h203_authorized_commercial_policy.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("drops the authorized person-data tables/columns and not the commercial core", () => {
    const sql = migrationSource();
    expect(sql).toMatch(/DROP TABLE IF EXISTS ops_vouchers/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS ops_manifest_entries/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS ops_manifests/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS crm_contacts/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS sup_contacts/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS hr_employees/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS hr_leave_requests/);
    expect(sql).toMatch(/DROP TABLE IF EXISTS hr_certifications/);
    expect(sql).toMatch(/DROP COLUMN IF EXISTS subject_label/);
    expect(sql).toMatch(/DROP COLUMN IF EXISTS notes/);
    expect(sql).toMatch(/DROP COLUMN IF EXISTS related_contact_id/);
    expect(sql).toMatch(/DROP COLUMN IF EXISTS from_contact_id/);
    expect(sql).toMatch(/guest_name/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS crm_organizations/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS crm_accounts/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS opp_opportunities/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS sup_suppliers/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS sup_rates/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS principals/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS tenants/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS bkg_bookings/);
    expect(sql).not.toMatch(/DROP TABLE IF EXISTS privacy_processing_activities/);
    expect(sql).not.toMatch(/CREATE TABLE .*crm_contacts/i);
    expect(sql).not.toMatch(/CREATE TABLE .*sup_contacts/i);
  });

  it("does not authorize migrate against preserved eos or eos_gateb", () => {
    expect(migrateTargetRefuseReason("postgres://eos:x@127.0.0.1:5432/eos")).toBe("h111_eos_124_only_preserved");
    expect(migrateTargetRefuseReason("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toBe(
      "eos_gateb_not_authorized",
    );
  });
});
