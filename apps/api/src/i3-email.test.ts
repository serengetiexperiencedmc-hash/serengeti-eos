import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.1 email notification adapter", () => {
  it("lists I3.1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("032_i3_email_outbox"))).toBe(true);
  });

  it("dispatches urgent/warning notifications to dev outbox", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const now = new Date().toISOString();

    store.rfpRfps.push({
      id: newId(),
      tenantId,
      rfpCode: "RFP-EMAIL-001",
      opportunityId: newId(),
      organizationId: newId(),
      title: "Breached RFP for email",
      workflowStage: "costing",
      status: "active",
      currency: "USD",
      slaStatus: "breached",
      slaDueAt: now,
      currentVersion: 1,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().adapter).toBe("dev-outbox");

    const dispatch = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-digest",
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(dispatch.statusCode).toBe(200);
    expect(dispatch.json().dispatched.length).toBeGreaterThanOrEqual(1);

    const outbox = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/outbox",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(outbox.statusCode).toBe(200);
    expect(outbox.json().items.length).toBeGreaterThanOrEqual(1);
    expect(outbox.json().items[0].to).toBe("carol.admin@sedmc.local");

    const redispatch = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-digest",
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(redispatch.statusCode).toBe(200);
    expect(redispatch.json().skipped.length).toBeGreaterThanOrEqual(1);
  });
});
