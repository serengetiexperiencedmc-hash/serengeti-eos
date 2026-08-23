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

describe("I20.7 applied CRM href", () => {
  it("adds a CRM task href after accept", async () => {
    const store = seedStore("i207-task-href", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().draft.appliedHref).toBeUndefined();

    const accepted = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${created.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.statusCode).toBe(200);
    expect(accepted.json().increment).toBe("I20.20");
    const taskId = accepted.json().draft.appliedEntityId as string;
    expect(accepted.json().draft.appliedHref).toBe(`/commercial/crm?task=${taskId}`);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=accepted",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().items[0].appliedHref).toBe(`/commercial/crm?task=${taskId}`);
  });

  it("adds a CRM activity href after accept", async () => {
    const store = seedStore("i207-activity-href", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Href Travel", organizationTypeId: types.json().items[0].id },
    });
    await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: "Overdue href call",
        dueAt: "2020-01-01T00:00:00.000Z",
        relatedOrganizationId: org.json().organization.id,
      },
    });

    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "crm.task.overdue" },
    });
    const accepted = await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${created.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.statusCode).toBe(200);
    const activityId = accepted.json().draft.appliedEntityId as string;
    expect(accepted.json().draft.appliedEntityType).toBe("crm_activity");
    expect(accepted.json().draft.appliedHref).toBe(`/commercial/crm?activity=${activityId}`);
  });
});
