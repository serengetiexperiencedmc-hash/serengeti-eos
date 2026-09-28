import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listMigrationFiles } from "@sedmc/db";
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

async function createOrg(app: ReturnType<typeof buildServer>, token: string, legalName: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  const organizationTypeId = types.json().items[0].id as string;
  const org = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName, organizationTypeId },
  });
  expect(org.statusCode).toBe(201);
  return org.json().organization.id as string;
}

describe("H-145 Owner-authorized structural keys (Dev/Test)", () => {
  it("does not create migration 126 and leaves 010/014 CHECKs in place", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
    const sql010 = readFileSync(join(repoRoot, "packages/db/migrations/010_c1_merge_import.sql"), "utf8");
    expect(sql010).toContain("entity_type IN ('organization', 'contact')");
    const sql014 = readFileSync(join(repoRoot, "packages/db/migrations/014_c4_supplier.sql"), "utf8");
    expect(sql014).toMatch(/entity_type IN \(\s*'supplier', 'supplier_contact', 'supplier_rate', 'supplier_content_block'/);
  });

  it("keeps commercial task and supplier writes while rejecting person-domain object keys", async () => {
    const store = seedStore("h145-keys");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "H145 Commercial Org Ltd");

    const commercialTask = await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Send commercial proposal outline", relatedOrganizationId: orgId },
    });
    expect(commercialTask.statusCode).toBe(201);
    const taskId = commercialTask.json().task.id as string;
    expect(store.crmTasks).toHaveLength(1);

    const personTask = await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Must not persist person keys", guestName: "Jane Planner" },
    });
    expect(personTask.statusCode).toBe(400);
    expect(personTask.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmTasks).toHaveLength(1);

    const personPatch = await app.inject({
      method: "PATCH",
      url: `/v1/crm/tasks/${taskId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Still commercial", givenName: "Jane" },
    });
    expect(personPatch.statusCode).toBe(400);
    expect(personPatch.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmTasks.find((t) => t.id === taskId)?.title).toBe("Send commercial proposal outline");

    const commercialSupplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "H145-LODGE-01",
        legalName: "H145 Lodge Ltd",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(commercialSupplier.statusCode).toBe(201);
    expect(store.supSuppliers).toHaveLength(1);

    const personSupplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "H145-LODGE-02",
        legalName: "H145 Lodge Two Ltd",
        category: "accommodation",
        country: "TZ",
        givenName: "Jane",
      },
    });
    expect(personSupplier.statusCode).toBe(400);
    expect(personSupplier.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.supSuppliers).toHaveLength(1);
  });

  it("keeps commercial organization import and retired person imports fail-closed", async () => {
    const store = seedStore("h145-import");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "organization",
        csv: "legalName,organizationTypeKey\nH145 Import House,mice_agency",
      },
    });
    expect(org.statusCode).toBe(201);
    expect(store.crmImportBatches).toHaveLength(1);
    expect(store.crmImportBatches[0]?.csvContent).toContain("H145 Import House");

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
    expect(store.crmImportBatches).toHaveLength(1);

    const aiDraft = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "overdue_task", guestName: "Jane Planner" },
    });
    expect(aiDraft.statusCode).toBe(400);
    expect(aiDraft.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.aiDrafts).toHaveLength(0);
  });
});
