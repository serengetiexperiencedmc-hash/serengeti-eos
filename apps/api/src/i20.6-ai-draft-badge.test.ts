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

describe("I20.6 AI draft pending count", () => {
  it("returns pendingCount independent of list filters", async () => {
    const store = seedStore("i206-badge", TEST_BOOTSTRAP_SECRETS);
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
      payload: { legalName: "Badge Travel", organizationTypeId: types.json().items[0].id },
    });
    await app.inject({
      method: "POST",
      url: "/v1/crm/tasks",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: "Overdue badge call",
        dueAt: "2020-01-01T00:00:00.000Z",
        relatedOrganizationId: org.json().organization.id,
      },
    });

    const first = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    const second = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "crm.task.overdue" },
    });
    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(201);

    await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${second.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });

    const pending = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=pending",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(pending.statusCode).toBe(200);
    expect(pending.json().increment).toBe("I20.13");
    expect(pending.json().pendingCount).toBe(1);
    expect(pending.json().items).toHaveLength(1);

    const accepted = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts?status=accepted",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accepted.json().items).toHaveLength(1);
    expect(accepted.json().pendingCount).toBe(1);

    const all = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(all.json().items.length).toBeGreaterThanOrEqual(2);
    expect(all.json().pendingCount).toBe(1);
  });
});
