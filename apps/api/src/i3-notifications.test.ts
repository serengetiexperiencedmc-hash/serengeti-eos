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

describe("I3 notifications API", () => {
  it("lists I3 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("028_i3_notifications"))).toBe(true);
  });

  it("returns live notifications and supports dismiss", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const now = new Date().toISOString();
    const bookingId = newId();
    const recId = newId();
    const conflictId = newId();

    store.rfpRfps.push({
      id: newId(),
      tenantId,
      rfpCode: "RFP-NOTIF-001",
      opportunityId: newId(),
      organizationId: newId(),
      title: "At-risk RFP",
      workflowStage: "costing",
      status: "active",
      currency: "USD",
      slaStatus: "at_risk",
      slaDueAt: now,
      currentVersion: 1,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.finReconciliations.push({
      id: recId,
      tenantId,
      bookingId,
      invoiceId: newId(),
      status: "exception",
      expectedAmount: 85500,
      receivedAmount: 50000,
      variance: 35500,
      currency: "USD",
      matchedPaymentIds: [],
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.opsSyncConflicts.push({
      id: conflictId,
      tenantId,
      sessionId: newId(),
      bookingId,
      entityType: "field_task",
      entityId: newId(),
      serverVersion: 2,
      clientVersion: 1,
      serverPayload: { status: "pending" },
      clientPayload: { status: "complete" },
      createdAt: now,
      updatedAt: now,
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items.length).toBeGreaterThanOrEqual(3);

    const key = listed.json().items[0].key as string;
    const dismissed = await app.inject({
      method: "POST",
      url: `/v1/notifications/${encodeURIComponent(key)}/dismiss`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dismissed.statusCode).toBe(200);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/unread-count",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().unreadCount).toBe(listed.json().items.length - 1);
  });
});
