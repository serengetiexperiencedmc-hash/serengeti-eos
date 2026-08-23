import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.3 typed AI draft artefacts", () => {
  it("drafts a CRM activity for overdue tasks and applies it only after human accept", async () => {
    const store = seedStore("i203-activity", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;
    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Summit Travel Group", organizationTypeId: typeId },
    });
    expect(org.statusCode).toBe(201);
    const task = await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: "Call Summit Travel",
        dueAt: "2020-01-01T00:00:00.000Z",
        priority: "high",
        relatedOrganizationId: org.json().organization.id,
      },
    });
    expect(task.statusCode).toBe(201);

    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "crm.task.overdue" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().increment).toBe("I20.8");
    expect(created.json().draft.artefactType).toBe("crm_activity");
    expect(created.json().draft.title).toMatch(/^Log follow-up:/);
    const draftId = created.json().draft.id as string;
    const activityCountBefore = store.crmActivities.filter((a) => a.subject.startsWith("Log follow-up:")).length;
    expect(activityCountBefore).toBe(0);

    const accepted = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${draftId}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.statusCode).toBe(200);
    expect(accepted.json().draft.status).toBe("accepted");
    expect(accepted.json().draft.appliedEntityType).toBe("crm_activity");
    expect(accepted.json().activity.id).toBeTruthy();
    expect(accepted.json().task).toBeUndefined();
    expect(store.crmActivities.some((a) => a.id === accepted.json().activity.id)).toBe(true);
    expect(store.crmTasks.filter((t) => t.title.startsWith("Log follow-up:")).length).toBe(0);
  });

  it("keeps stale-digest drafts as CRM tasks", async () => {
    const store = seedStore("i203-task", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().draft.artefactType).toBe("crm_task");
  });
});
