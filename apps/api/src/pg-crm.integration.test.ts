import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { createAccount } from "../src/crm/account.js";
import { createContact } from "../src/crm/contact.js";
import { createNote } from "../src/crm/note.js";
import { createOrganization } from "../src/crm/organization.js";
import { createRelationship } from "../src/crm/relationship.js";
import { createTag } from "../src/crm/tag.js";
import { createTask } from "../src/crm/task.js";
import {
  countCrmAccounts,
  countCrmMergeRecords,
  countCrmNotes,
  countCrmOrganizations,
  countCrmRelationships,
  countCrmTags,
  countCrmTasks,
} from "../src/persistence/pg-repository.js";
import { syncStoreToPostgres } from "../src/persistence/sync.js";
import { allPrincipals } from "../src/store.js";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describePg("PG.3 CRM dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists organizations when dbPool is set", async () => {
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);

    const store = seedStore("pg-crm-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const types = store.crmOrganizationTypes.filter((t) => t.tenantId === tenantId);
    expect(types.length).toBeGreaterThan(0);

    const before = await countCrmOrganizations(pool, tenantId);
    const result = createOrganization(
      store,
      principal,
      { legalName: "PG.3 Persistence Org", organizationTypeId: types[0]!.id },
      "pg-crm-test",
    );
    expect("organization" in result).toBe(true);

    await new Promise((r) => setTimeout(r, 50));
    const after = await countCrmOrganizations(pool, tenantId);
    expect(after).toBeGreaterThan(before);
  });
});

describePg("PG.3.1 CRM accounts + notes dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists accounts when dbPool is set", async () => {
    await migrate(pool);
    const store = seedStore("pg-crm31-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const typeId = store.crmOrganizationTypes.find((t) => t.tenantId === tenantId)!.id;
    const org = createOrganization(
      store,
      principal,
      { legalName: "PG.3.1 Account Org", organizationTypeId: typeId },
      "pg31-account-org",
    );
    expect("organization" in org).toBe(true);
    await new Promise((r) => setTimeout(r, 50));

    const before = await countCrmAccounts(pool, tenantId);
    const account = createAccount(
      store,
      principal,
      { organizationId: org.organization.id, accountName: "PG.3.1 Test Account" },
      "pg31-account",
    );
    expect("account" in account).toBe(true);

    await new Promise((r) => setTimeout(r, 50));
    const after = await countCrmAccounts(pool, tenantId);
    expect(after).toBeGreaterThan(before);
  });

  it("persists notes when dbPool is set", async () => {
    await migrate(pool);
    const store = seedStore("pg-crm31-note-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const typeId = store.crmOrganizationTypes.find((t) => t.tenantId === tenantId)!.id;
    const org = createOrganization(
      store,
      principal,
      { legalName: "PG.3.1 Note Org", organizationTypeId: typeId },
      "pg31-note-org",
    );
    expect("organization" in org).toBe(true);
    await new Promise((r) => setTimeout(r, 50));

    const before = await countCrmNotes(pool, tenantId);
    const note = createNote(
      store,
      principal,
      { entityType: "organization", entityId: org.organization.id, body: "PG.3.1 persistence note" },
      "pg31-note",
    );
    expect("note" in note).toBe(true);

    await new Promise((r) => setTimeout(r, 50));
    const after = await countCrmNotes(pool, tenantId);
    expect(after).toBeGreaterThan(before);
  });
});

describePg("PG.3.2 CRM merge dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";

  afterAll(async () => {
    await pool.end();
  });

  async function loginCarol(app: ReturnType<typeof buildServer>) {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    return res.json().accessToken as string;
  }

  it("persists merge records with survivor and duplicate org updates", async () => {
    await migrate(pool);
    const store = seedStore("pg-crm32-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);
    const app = buildServer({ store, dbHealth: () => checkDatabaseHealth(pool) });
    const token = await loginCarol(app);

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;

    const first = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "PG.3.2 Merge Survivor", organizationTypeId: typeId },
    });
    const second = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "PG.3.2 Merge Dup", tradingName: "PG.3.2 Merge Survivor", organizationTypeId: typeId },
    });
    await new Promise((r) => setTimeout(r, 50));

    const listed = await app.inject({
      method: "GET",
      url: "/v1/crm/duplicates?entityType=organization",
      headers: { authorization: `Bearer ${token}` },
    });
    const candidateId = listed.json().items[0].id as string;
    await app.inject({
      method: "POST",
      url: `/v1/crm/duplicates/${candidateId}/review`,
      headers: { authorization: `Bearer ${token}` },
      payload: { decision: "confirm", reason: "PG.3.2 test" },
    });

    const survivorId = first.json().organization.id as string;
    const duplicateId = second.json().organization.id as string;
    const before = await countCrmMergeRecords(pool, tenantId);

    await app.inject({
      method: "POST",
      url: "/v1/crm/merges",
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "pg32-merge" },
      payload: {
        entityType: "organization",
        survivorId,
        duplicateIds: [duplicateId],
        duplicateCandidateId: candidateId,
        reason: "PG.3.2 persistence test",
        expectedVersions: {
          [survivorId]: first.json().organization.version,
          [duplicateId]: second.json().organization.version,
        },
      },
    });

    await new Promise((r) => setTimeout(r, 50));
    const after = await countCrmMergeRecords(pool, tenantId);
    expect(after).toBeGreaterThan(before);

    const dupRow = await pool.query(`SELECT merged_into_id FROM crm_organizations WHERE id = $1`, [duplicateId]);
    expect(dupRow.rows[0]?.merged_into_id).toBe(survivorId);
  });
});

describePg("PG.3+ CRM relationships, tasks, tags dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists relationships, tasks, and tags when dbPool is set", async () => {
    await migrate(pool);
    const store = seedStore("pg-crm3plus-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const typeId = store.crmOrganizationTypes.find((t) => t.tenantId === tenantId)!.id;
    const relTypeId = store.crmRelationshipTypes.find((t) => t.tenantId === tenantId)!.id;

    const org = createOrganization(
      store,
      principal,
      { legalName: "PG.3+ Rel Org", organizationTypeId: typeId },
      "pg3plus-org",
    );
    expect("organization" in org).toBe(true);
    await new Promise((r) => setTimeout(r, 50));

    const contact = createContact(
      store,
      principal,
      { givenName: "PG", familyName: "RelContact" },
      "pg3plus-contact",
    );
    expect("contact" in contact).toBe(true);
    await new Promise((r) => setTimeout(r, 50));

    const relBefore = await countCrmRelationships(pool, tenantId);
    const relationship = createRelationship(
      store,
      principal,
      {
        relationshipTypeId: relTypeId,
        contactId: contact.contact.id,
        organizationId: org.organization.id,
      },
      "pg3plus-rel",
    );
    expect("relationship" in relationship).toBe(true);
    await new Promise((r) => setTimeout(r, 50));
    expect(await countCrmRelationships(pool, tenantId)).toBeGreaterThan(relBefore);

    const taskBefore = await countCrmTasks(pool, tenantId);
    const task = createTask(
      store,
      principal,
      { title: "PG.3+ follow-up", relatedOrganizationId: org.organization.id },
      "pg3plus-task",
    );
    expect("task" in task).toBe(true);
    await new Promise((r) => setTimeout(r, 50));
    expect(await countCrmTasks(pool, tenantId)).toBeGreaterThan(taskBefore);

    const tagBefore = await countCrmTags(pool, tenantId);
    const tag = createTag(store, principal, { key: "pg3plus", label: "PG.3+ Tag" }, "pg3plus-tag");
    expect("tag" in tag).toBe(true);
    await new Promise((r) => setTimeout(r, 50));
    expect(await countCrmTags(pool, tenantId)).toBeGreaterThan(tagBefore);
  });
});
