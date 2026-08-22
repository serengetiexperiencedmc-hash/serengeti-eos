import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { listMigrationFiles } from "@sedmc/db";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function createOrg(app: ReturnType<typeof buildServer>, token: string, legalName: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  const organizationTypeId = types.json().items[0].id;
  const org = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName, organizationTypeId },
  });
  return org.json().organization.id as string;
}

describe("C1.5 CRM accounts + notes + tasks", () => {
  it("lists C1.5 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("008_c1_accounts_notes_tasks"))).toBe(true);
  });

  describe("accounts", () => {
    it("creates, lists, updates, transitions, reassigns owner, and archives", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const orgId = await createOrg(app, token, "Account Org Ltd");

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: orgId, accountName: "Global Travel Account", market: "Europe", priority: "high" },
      });
      expect(created.statusCode).toBe(201);
      const account = created.json().account;
      expect(account.status).toBe("Prospect");
      expect(account.organizationId).toBe(orgId);

      const listed = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${orgId}/accounts`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items).toHaveLength(1);

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/accounts/${account.id}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { nextAction: "Schedule site visit" },
      });
      expect(updated.statusCode).toBe(200);

      const active = await app.inject({
        method: "POST",
        url: `/v1/crm/accounts/${account.id}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Active" },
      });
      expect(active.statusCode).toBe(200);

      const reassign = await app.inject({
        method: "POST",
        url: `/v1/crm/accounts/${account.id}/reassign-owner`,
        headers: { authorization: `Bearer ${token}` },
        payload: { ownerPrincipalId: account.ownerPrincipalId },
      });
      expect(reassign.statusCode).toBe(200);

      const archived = await app.inject({
        method: "POST",
        url: `/v1/crm/accounts/${account.id}/archive`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(archived.statusCode).toBe(200);

      expect(store.audit.some((a) => a.resourceType === "crm_account")).toBe(true);
    });

    it("rejects duplicate account name per organization", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const orgId = await createOrg(app, token, "Dup Account Org");
      await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: orgId, accountName: "Same Name" },
      });
      const dup = await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: orgId, accountName: "same name" },
      });
      expect(dup.statusCode).toBe(409);
    });

    it("denies unauthorized account access", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
      const orgId = await createOrg(app, token, "Auth Account Org");
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: orgId, accountName: "Secure Account" },
      });
      const denied = await app.inject({
        method: "GET",
        url: `/v1/crm/accounts/${created.json().account.id}`,
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(denied.statusCode).toBe(403);
    });
  });

  describe("notes", () => {
    it("creates, lists, updates, and archives notes on contact", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const orgId = await createOrg(app, token, "Note Org");
      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Note", familyName: "Person", email: "note.person@example.com" },
      });
      const contactId = contact.json().contact.id;

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: { body: "Prefers morning meetings", entityType: "contact", entityId: contactId },
      });
      expect(created.statusCode).toBe(201);

      const listed = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contactId}/notes`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items).toHaveLength(1);

      const noteId = created.json().note.id;
      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/notes/${noteId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { body: "Prefers morning video calls" },
      });
      expect(updated.statusCode).toBe(200);

      const archived = await app.inject({
        method: "POST",
        url: `/v1/crm/notes/${noteId}/archive`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(archived.statusCode).toBe(200);

      const orgNote = await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: { body: "Key MICE buyer", entityType: "organization", entityId: orgId },
      });
      expect(orgNote.statusCode).toBe(201);
    });

    it("rejects invalid entity reference", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const bad = await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          body: "Orphan note",
          entityType: "contact",
          entityId: "00000000-0000-4000-8000-000000009999",
        },
      });
      expect(bad.statusCode).toBe(400);
    });
  });

  describe("tasks", () => {
    it("creates, lists, updates, completes, and cancels tasks", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const orgId = await createOrg(app, token, "Task Org");

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: "Send proposal outline",
          description: "Follow up after discovery call",
          dueAt: "2026-09-01T12:00:00.000Z",
          priority: "high",
          relatedOrganizationId: orgId,
        },
      });
      expect(created.statusCode).toBe(201);
      const task = created.json().task;
      expect(task.status).toBe("Open");

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/tasks?status=Open",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items.some((t: { id: string }) => t.id === task.id)).toBe(true);

      const inProgress = await app.inject({
        method: "PATCH",
        url: `/v1/crm/tasks/${task.id}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { status: "InProgress" },
      });
      expect(inProgress.statusCode).toBe(200);

      const completed = await app.inject({
        method: "POST",
        url: `/v1/crm/tasks/${task.id}/complete`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(completed.statusCode).toBe(200);
      expect(completed.json().task.completedAt).toBeTruthy();

      const openTask = await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${token}` },
        payload: { title: "Cancel me", relatedOrganizationId: orgId },
      });
      const cancelled = await app.inject({
        method: "POST",
        url: `/v1/crm/tasks/${openTask.json().task.id}/cancel`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(cancelled.statusCode).toBe(200);

      expect(store.audit.some((a) => a.resourceType === "crm_task")).toBe(true);
    });

    it("rejects stale If-Match and unauthorized access", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
      const orgId = await createOrg(app, token, "Task Auth Org");
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${token}` },
        payload: { title: "Protected", relatedOrganizationId: orgId },
      });
      const taskId = created.json().task.id;

      const stale = await app.inject({
        method: "PATCH",
        url: `/v1/crm/tasks/${taskId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "99" },
        payload: { title: "Nope" },
      });
      expect(stale.statusCode).toBe(409);

      const denied = await app.inject({
        method: "GET",
        url: `/v1/crm/tasks/${taskId}`,
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(denied.statusCode).toBe(403);
    });
  });

  it("returns 404 for cross-tenant account reads and rejects stale account If-Match", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "Cross Tenant Account Org");
    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: { authorization: `Bearer ${token}` },
      payload: { organizationId: orgId, accountName: "Cross Tenant Account" },
    });
    const accountId = created.json().account.id;

    const stale = await app.inject({
      method: "PATCH",
      url: `/v1/crm/accounts/${accountId}`,
      headers: { authorization: `Bearer ${token}`, "if-match": "9" },
      payload: { nextAction: "Stale" },
    });
    expect(stale.statusCode).toBe(409);

    const partner = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const cross = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${accountId}`,
      headers: { authorization: `Bearer ${partner.json().accessToken}` },
    });
    expect(cross.statusCode).toBe(404);
  });
});
