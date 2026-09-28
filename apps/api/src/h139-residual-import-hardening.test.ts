import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listMigrationFiles } from "@sedmc/db";
import * as kernel from "@sedmc/kernel";
import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { PERSON_DOMAIN_REMOVED } from "../src/personal-data-phase1.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../..");

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

describe("H-139 residual import hardening (Dev/Test)", () => {
  it("leaves the historical supplier_contact CHECK in migration 014 and does not create 126", () => {
    const sql014 = readFileSync(join(repoRoot, "packages/db/migrations/014_c4_supplier.sql"), "utf8");
    expect(sql014).toMatch(/entity_type IN \(\s*'supplier', 'supplier_contact', 'supplier_rate', 'supplier_content_block'/);
    const sql010 = readFileSync(join(repoRoot, "packages/db/migrations/010_c1_merge_import.sql"), "utf8");
    expect(sql010).toContain("entity_type IN ('organization', 'contact')");
    const sql125 = readFileSync(
      join(repoRoot, "packages/db/migrations/125_h135_phase1_personal_data_domain.sql"),
      "utf8",
    );
    expect(sql125).toContain("sup_import_batches.entity_type CHECK still lists supplier_contact");
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("does not wire supplier-contacts.csv into seed or kernel parsers", () => {
    const seed = readFileSync(join(repoRoot, "apps/api/src/dev/seed-demo-data.ts"), "utf8");
    expect(seed).not.toContain("supplier-contacts.csv");
    const sample = readFileSync(join(repoRoot, "docs/c4/import/supplier-contacts.csv"), "utf8");
    expect(sample).toMatch(/RETIRED H-139/);
    expect(kernel).not.toHaveProperty("validateContactImportRow");
    expect(kernel).not.toHaveProperty("validateSupplierContactImportRow");
    expect(kernel).not.toHaveProperty("ContactImportRow");
  });

  it("does not persist csv_content for retired person imports while organization import still stores CSV", async () => {
    const store = seedStore("h139-residual-csv");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const contact = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "contact",
        csv: "givenName,familyName\nJane,Planner",
      },
    });
    expect(contact.statusCode).toBe(400);
    expect(contact.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmImportBatches).toHaveLength(0);

    const supplierContact = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "supplier_contact",
        csv: readFileSync(join(repoRoot, "docs/c4/import/supplier-contacts.csv"), "utf8"),
      },
    });
    expect(supplierContact.statusCode).toBe(400);
    expect(supplierContact.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.supImportBatches).toHaveLength(0);

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "organization",
        csv: "legalName,organizationTypeKey\nH139 Residual House,mice_agency",
      },
    });
    expect(org.statusCode).toBe(201);
    expect(store.crmImportBatches).toHaveLength(1);
    expect(store.crmImportBatches[0]?.csvContent).toContain("H139 Residual House");
    expect(store.crmContacts).toHaveLength(0);
  });
});
