import { listMigrationFiles } from "@sedmc/db";
import {
  CRM_IMPORT_ENTITY_TYPES,
  isRetiredCrmImportEntityType,
  isRetiredSupplierImportEntityType,
  isValidImportEntityType,
  isValidSupplierImportEntityType,
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

describe("H-138 import/ingestion personal-data remediation (Dev/Test)", () => {
  it("does not add migration 126 and keeps migration 125 last", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("does not accept contact or supplier_contact as import entity types", () => {
    expect([...CRM_IMPORT_ENTITY_TYPES]).toEqual(["organization"]);
    expect(isValidImportEntityType("contact")).toBe(false);
    expect(isRetiredCrmImportEntityType("contact")).toBe(true);
    expect(isValidSupplierImportEntityType("supplier_contact")).toBe(false);
    expect(isRetiredSupplierImportEntityType("supplier_contact")).toBe(true);
    expect(isValidSupplierImportEntityType("supplier")).toBe(true);
  });

  it("rejects unauthenticated CRM and supplier import creates", async () => {
    const app = buildServer({ store: seedStore("h138-import-auth") });
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
          payload: { sourceSystem: "test", entityType: "supplier_contact", csv: "supplierCode,contactRole,givenName,familyName\nX,reservations,A,B" },
        })
      ).statusCode,
    ).toBe(401);
  });

  it("rejects CRM contact import create without persisting a batch or person rows", async () => {
    const store = seedStore("h138-crm-contact-import");
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
  });

  it("rejects supplier_contact import create without persisting a batch or person rows", async () => {
    const store = seedStore("h138-sup-contact-import");
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
    expect(store.supImportBatches).toHaveLength(0);
    expect(store.supContacts).toHaveLength(0);
  });

  it("still imports organizations as a retained commercial entity", async () => {
    const store = seedStore("h138-org-import");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "organization",
        csv: "legalName,organizationTypeKey\nH138 Import House,mice_agency",
      },
    });
    expect(created.statusCode).toBe(201);
    const batchId = created.json().batch.id as string;
    expect(store.crmImportBatches).toHaveLength(1);
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
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "h138-org-1" },
    });
    expect(executed.statusCode).toBe(200);
    expect(executed.json().batch.status).toBe("committed");
    expect(store.crmOrganizations.some((o) => o.legalName === "H138 Import House")).toBe(true);
    expect(store.crmContacts).toHaveLength(0);
  });
});
