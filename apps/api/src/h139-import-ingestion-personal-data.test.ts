import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listMigrationFiles } from "@sedmc/db";
import {
  CRM_IMPORT_ENTITY_TYPES,
  isRetiredCrmImportEntityType,
  isRetiredSupplierImportEntityType,
  isValidImportEntityType,
  isValidSupplierImportEntityType,
  SUPPLIER_IMPORT_ENTITY_TYPES,
} from "@sedmc/kernel";
import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { PERSON_DOMAIN_REMOVED } from "../src/personal-data-phase1.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

function leftoverActor(store: ReturnType<typeof seedStore>) {
  const tenantId = [...store.tenants.values()][0]!.id;
  const principalId = [...store.principals.values()][0]!.id;
  return { tenantId, principalId };
}

describe("H-139 actual import/ingestion personal-data remediation (Dev/Test)", () => {
  it("does not add migration 126 and keeps migration 125 last", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("keeps supported import unions free of person-domain entity types", () => {
    expect([...CRM_IMPORT_ENTITY_TYPES]).toEqual(["organization"]);
    expect([...SUPPLIER_IMPORT_ENTITY_TYPES]).not.toContain("supplier_contact");
    expect(isValidImportEntityType("contact")).toBe(false);
    expect(isRetiredCrmImportEntityType("contact")).toBe(true);
    expect(isValidSupplierImportEntityType("supplier_contact")).toBe(false);
    expect(isRetiredSupplierImportEntityType("supplier_contact")).toBe(true);
    expect(isValidSupplierImportEntityType("supplier")).toBe(true);
    expect(isValidSupplierImportEntityType("supplier_rate")).toBe(true);
  });

  it("rejects unauthenticated retired and retained import creates", async () => {
    const app = buildServer({ store: seedStore("h139-import-auth") });
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crm/imports",
          payload: { sourceSystem: "test", entityType: "contact", csv: "givenName,familyName\nA,B" },
        })
      ).statusCode,
    ).toBe(401);
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/suppliers/imports",
          payload: {
            sourceSystem: "test",
            entityType: "supplier_contact",
            csv: "supplierCode,contactRole,givenName,familyName\nX,reservations,A,B",
          },
        })
      ).statusCode,
    ).toBe(401);
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crm/imports",
          payload: { sourceSystem: "test", entityType: "organization", csv: "legalName,organizationTypeKey\nX,mice_agency" },
        })
      ).statusCode,
    ).toBe(401);
  });

  it("rejects CRM contact create, preview, and leftover execute with no persistence", async () => {
    const store = seedStore("h139-crm-contact-import");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "contact",
        csv: "givenName,familyName,email\nJane,Planner,jane@example.com",
      },
    });
    expect(created.statusCode).toBe(400);
    expect(created.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(created.json().batch).toBeUndefined();
    expect(store.crmImportBatches).toHaveLength(0);
    expect(store.crmContacts).toHaveLength(0);

    const { tenantId, principalId } = leftoverActor(store);
    const leftoverId = "h139-leftover-crm-contact";
    store.crmImportBatches.push({
      id: leftoverId,
      tenantId,
      sourceSystem: "legacy",
      entityType: "contact",
      mode: "create_only",
      status: "validated",
      rowCount: 1,
      csvContent: "givenName,familyName,email\nJane,Planner,jane@example.com",
      createdAt: new Date().toISOString(),
      createdByPrincipalId: principalId,
    });

    const preview = await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${leftoverId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preview.statusCode).toBe(400);
    expect(preview.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmImportBatches.find((b) => b.id === leftoverId)?.status).toBe("validated");

    const executed = await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${leftoverId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "h139-contact-exec" },
    });
    expect(executed.statusCode).toBe(400);
    expect(executed.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmImportBatches.find((b) => b.id === leftoverId)?.status).toBe("validated");
    expect(store.crmContacts).toHaveLength(0);
  });

  it("rejects supplier_contact create, preview, and leftover execute with no persistence", async () => {
    const store = seedStore("h139-sup-contact-import");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "supplier_contact",
        csv: "supplierCode,contactRole,givenName,familyName\nLOD-1,reservations,Anna,Mwanga",
      },
    });
    expect(created.statusCode).toBe(400);
    expect(created.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(created.json().batch).toBeUndefined();
    expect(store.supImportBatches.some((b) => b.entityType === "supplier_contact")).toBe(false);
    expect(store.supContacts).toHaveLength(0);

    const { tenantId, principalId } = leftoverActor(store);
    const leftoverId = "h139-leftover-sup-contact";
    store.supImportBatches.push({
      id: leftoverId,
      tenantId,
      sourceSystem: "legacy",
      entityType: "supplier_contact",
      mode: "create_only",
      status: "validated",
      rowCount: 1,
      csvContent: "supplierCode,contactRole,givenName,familyName\nLOD-1,reservations,Anna,Mwanga",
      createdAt: new Date().toISOString(),
      createdByPrincipalId: principalId,
    });

    const preview = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${leftoverId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preview.statusCode).toBe(400);
    expect(preview.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.supImportBatches.find((b) => b.id === leftoverId)?.status).toBe("validated");

    const executed = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${leftoverId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "h139-sup-contact-exec" },
    });
    expect(executed.statusCode).toBe(400);
    expect(executed.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.supImportBatches.find((b) => b.id === leftoverId)?.status).not.toBe("committed");
    expect(store.supContacts).toHaveLength(0);
  });

  it("does not expose an import-preset registry for retired person-domain types", () => {
    const schema = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../../../docs/c4/import/supplier-import-schema.json"),
      "utf8",
    );
    expect(schema).not.toMatch(/"const": "supplier_contact"/);
    expect(schema).toContain("supplier_contact is retired");
    expect(isValidImportEntityType("contact")).toBe(false);
    expect(isValidSupplierImportEntityType("supplier_contact")).toBe(false);
  });

  it("still imports organizations as a retained commercial entity", async () => {
    const store = seedStore("h139-org-import");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "organization",
        csv: "legalName,organizationTypeKey\nH139 Import House,mice_agency",
      },
    });
    expect(created.statusCode).toBe(201);
    const batchId = created.json().batch.id as string;
    expect(store.crmImportBatches[0]?.entityType).toBe("organization");

    const validated = await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.statusCode).toBe(200);
    expect(validated.json().batch.status).toBe("validated");

    const executed = await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "h139-org-1" },
    });
    expect(executed.statusCode).toBe(200);
    expect(executed.json().batch.status).toBe("committed");
    expect(store.crmOrganizations.some((o) => o.legalName === "H139 Import House")).toBe(true);
    expect(store.crmContacts).toHaveLength(0);
  });
});
