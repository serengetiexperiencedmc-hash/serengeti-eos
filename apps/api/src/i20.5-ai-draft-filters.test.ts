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

describe("I20.5 AI draft list filters", () => {
  it("rejects unknown filters", async () => {
    const store = seedStore("i205-invalid", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const badStatus = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=applied",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(badStatus.statusCode).toBe(400);
    expect(badStatus.json().reason).toBe("invalid_status");

    const badType = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?artefactType=crm_merge",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(badType.statusCode).toBe(400);
    expect(badType.json().reason).toBe("invalid_artefact_type");
  });

  it("filters by artefact type and status", async () => {
    const store = seedStore("i205-filters", TEST_BOOTSTRAP_SECRETS);
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
      payload: { legalName: "Filter Travel", organizationTypeId: types.json().items[0].id },
    });
    await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: "Overdue call",
        dueAt: "2020-01-01T00:00:00.000Z",
        relatedOrganizationId: org.json().organization.id,
      },
    });

    const activityDraft = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "crm.task.overdue" },
    });
    const taskDraft = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(activityDraft.statusCode).toBe(201);
    expect(taskDraft.statusCode).toBe(201);

    await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${taskDraft.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });

    const activities = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?artefactType=crm_activity",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(activities.statusCode).toBe(200);
    expect(activities.json().increment).toBe("I20.20");
    expect(activities.json().filters.artefactType).toBe("crm_activity");
    expect(activities.json().items).toHaveLength(1);
    expect(activities.json().items[0].artefactType).toBe("crm_activity");

    const accepted = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=accepted",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.json().items).toHaveLength(1);
    expect(accepted.json().items[0].status).toBe("accepted");
    expect(accepted.json().items[0].artefactType).toBe("crm_task");

    const pendingTasks = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=pending&artefactType=crm_activity",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(pendingTasks.json().items).toHaveLength(1);
    expect(pendingTasks.json().items[0].id).toBe(activityDraft.json().draft.id);
  });
});
