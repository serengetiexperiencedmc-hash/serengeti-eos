/// <reference types="vitest" />
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "./index.js";
import { migrateTargetRefuseReason } from "./migrate-guard.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

function readMigration(basename: string): string {
  return readFileSync(join(ROOT, basename), "utf8");
}

describe("H-136 Phase A personal-data domain/schema integrity (static; Dev/Test only)", () => {
  it("uses migration 125 as the Phase A drop file and lists 126 as the latest additive commercial migration", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/125_h135_phase1_personal_data_domain.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("A1: 023/029 guest+voucher cluster is dropped together by 125 before any leftover NOT NULL manifest_entry_id", () => {
    const create023 = readMigration("023_o2_ops_manifest.sql");
    const create029 = readMigration("029_o4_vouchers.sql");
    const drop = readMigration("125_h135_phase1_personal_data_domain.sql");
    expect(create023).toMatch(/guest_name TEXT NOT NULL/);
    expect(create023).toMatch(/dietary TEXT/);
    expect(create023).toMatch(/mobility TEXT/);
    expect(create029).toMatch(/manifest_entry_id UUID NOT NULL/);
    expect(create029).toMatch(/guest_name TEXT NOT NULL/);
    const voucherDrop = drop.indexOf("DROP TABLE IF EXISTS ops_vouchers");
    const entryDrop = drop.indexOf("DROP TABLE IF EXISTS ops_manifest_entries");
    const manifestDrop = drop.indexOf("DROP TABLE IF EXISTS ops_manifests");
    expect(voucherDrop).toBeGreaterThan(-1);
    expect(entryDrop).toBeGreaterThan(voucherDrop);
    expect(manifestDrop).toBeGreaterThan(entryDrop);
  });

  it("A2: 004 CRM contact FKs are dropped before crm_contacts; opportunities have no contact_id", () => {
    const crm = readMigration("004_c1_crm.sql");
    const opp = readMigration("015_c2_opportunity.sql");
    const drop = readMigration("125_h135_phase1_personal_data_domain.sql");
    expect(crm).toMatch(/REFERENCES crm_contacts/);
    expect(opp).not.toMatch(/contact_id/);
    expect(opp).toMatch(/CREATE TABLE IF NOT EXISTS opp_opportunities/);
    expect(opp).toMatch(/organization_id UUID NOT NULL/);
    const fkDrop = drop.indexOf("crm_relationships_from_contact_id_fkey");
    const tableDrop = drop.indexOf("DROP TABLE IF EXISTS crm_contacts");
    expect(fkDrop).toBeGreaterThan(-1);
    expect(tableDrop).toBeGreaterThan(fkDrop);
    expect(drop).toMatch(/DROP COLUMN IF EXISTS related_contact_id/);
  });

  it("A3/A4: HR employee FKs and supplier contacts are dropped; rates stay on sup_suppliers", () => {
    const hr = readMigration("081_i10_hr_core.sql");
    const cert = readMigration("100_h1_hr_certifications.sql");
    const supplier = readMigration("014_c4_supplier.sql");
    const drop = readMigration("125_h135_phase1_personal_data_domain.sql");
    expect(hr).toMatch(/REFERENCES hr_employees/);
    expect(cert).toMatch(/employee_id UUID NOT NULL/);
    expect(supplier).toMatch(/CREATE TABLE IF NOT EXISTS sup_contacts/);
    expect(supplier).toMatch(/CREATE TABLE IF NOT EXISTS sup_rates/);
    expect(supplier).toMatch(/supplier_id UUID NOT NULL REFERENCES sup_suppliers \(id\)/);
    expect(drop).toMatch(/DROP TABLE IF EXISTS hr_certifications/);
    expect(drop).toMatch(/DROP TABLE IF EXISTS hr_leave_requests/);
    expect(drop).toMatch(/DROP TABLE IF EXISTS hr_employees/);
    expect(drop).toMatch(/DROP TABLE IF EXISTS sup_contacts/);
    expect(drop).not.toMatch(/DROP TABLE IF EXISTS sup_suppliers/);
    expect(drop).not.toMatch(/DROP TABLE IF EXISTS sup_rates/);
  });

  it("A5: DSR subject_label and consent notes are dropped; processing-activity catalogue is not", () => {
    const dsr = readMigration("092_p1_privacy_ropa_dsr.sql");
    const consent = readMigration("110_p3_consent_records.sql");
    const drop = readMigration("125_h135_phase1_personal_data_domain.sql");
    expect(dsr).toMatch(/subject_label TEXT/);
    expect(consent).toMatch(/notes TEXT/);
    expect(drop).toMatch(/DROP COLUMN IF EXISTS subject_label/);
    expect(drop).toMatch(/ALTER TABLE IF EXISTS consent_records DROP COLUMN IF EXISTS notes/);
    expect(drop).not.toMatch(/DROP TABLE IF EXISTS privacy_processing_activities/);
  });

  it("does not drop commercial core, rate identity, bookings, principals, or tenants", () => {
    const drop = readMigration("125_h135_phase1_personal_data_domain.sql");
    const facts = readMigration("124_f2_dp01_commercial_facts.sql");
    expect(facts).toMatch(/CREATE TABLE IF NOT EXISTS f2_rate_identities/);
    for (const table of [
      "crm_organizations",
      "crm_accounts",
      "opp_opportunities",
      "sup_suppliers",
      "sup_rates",
      "principals",
      "tenants",
      "bkg_bookings",
      "f2_rate_identities",
      "f2_opportunity_facts",
      "privacy_processing_activities",
    ]) {
      expect(drop).not.toMatch(new RegExp(`DROP TABLE IF EXISTS ${table}`));
    }
    expect(drop).not.toMatch(/CREATE TABLE .*crm_contacts/i);
  });

  it("does not authorize migrate against preserved eos or eos_gateb", () => {
    expect(migrateTargetRefuseReason("postgres://eos:x@127.0.0.1:5432/eos")).toBe("h111_eos_124_only_preserved");
    expect(migrateTargetRefuseReason("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toBe(
      "eos_gateb_not_authorized",
    );
  });
});
