import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId, requiresOpsAttention } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const TENANT = "11111111-1111-4111-8111-111111111111";
const FOREIGN = "22222222-2222-4222-8222-222222222222";

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

function seedBooking(
  store: ReturnType<typeof seedStore>,
  overrides: { id?: string; tenantId?: string; bookingCode?: string; title?: string; status?: "confirmed" | "handover_pending" | "handed_over" },
) {
  const now = new Date().toISOString();
  const id = overrides.id ?? newId();
  store.bkgBookings.push({
    id,
    tenantId: overrides.tenantId ?? TENANT,
    bookingCode: overrides.bookingCode ?? "BKG-O5-001",
    proposalId: newId(),
    rfpId: newId(),
    programmeId: newId(),
    opportunityId: newId(),
    organizationId: newId(),
    title: overrides.title ?? "O5 Workbench Booking",
    status: overrides.status ?? "handover_pending",
    currency: "USD",
    sellPrice: 150000,
    confirmedAt: now,
    classification: "Internal",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  });
  return id;
}

describe("O5 operations workbench", () => {
  it("lists O5 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("078_o5_operations_workbench"))).toBe(true);
  });

  it("flags attention from pending ops signals", () => {
    expect(
      requiresOpsAttention({
        pendingHandoverTasks: 1,
        supplierConfirmationsPending: 0,
        vouchersDraft: 0,
        fieldTasksOpen: 0,
        syncConflicts: 0,
      }),
    ).toBe(true);
    expect(
      requiresOpsAttention({
        pendingHandoverTasks: 0,
        supplierConfirmationsPending: 0,
        vouchersDraft: 0,
        fieldTasksOpen: 0,
        syncConflicts: 0,
      }),
    ).toBe(false);
  });

  it("scopes health and workbench to the tenant and enforces authorization", async () => {
    const store = seedStore("test-secret");
    const now = new Date().toISOString();
    const attentionId = seedBooking(store, { bookingCode: "BKG-O5-ATTN", title: "Needs Work" });
    const clearId = seedBooking(store, {
      bookingCode: "BKG-O5-CLEAR",
      title: "All Clear",
      status: "handed_over",
    });
    seedBooking(store, {
      tenantId: FOREIGN,
      bookingCode: "BKG-O5-FOREIGN",
      title: "Other Tenant",
    });

    store.bkgHandoverTasks.push({
      id: newId(),
      tenantId: TENANT,
      bookingId: attentionId,
      taskKey: "supplier_confirm",
      label: "Supplier confirmations",
      status: "pending",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
    store.bkgHandoverTasks.push({
      id: newId(),
      tenantId: TENANT,
      bookingId: clearId,
      taskKey: "supplier_confirm",
      label: "Supplier confirmations",
      status: "complete",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
    store.opsSupplierConfirmations.push({
      id: newId(),
      tenantId: FOREIGN,
      bookingId: newId(),
      programmeId: newId(),
      supplierId: newId(),
      label: "Foreign lodge",
      status: "requested",
      requestedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const carolToken = await loginCarol(app);

    const unauth = await app.inject({ method: "GET", url: "/v1/ops/health" });
    expect(unauth.statusCode).toBe(401);

    const health = await app.inject({
      method: "GET",
      url: "/v1/ops/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("O5");
    expect(health.json().workbench).toBe(2);
    expect(health.json().supplierConfirmations).toBe(0);
    expect(health.json()).not.toHaveProperty("tenantId");

    const workbench = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(workbench.statusCode).toBe(200);
    const items = workbench.json().items as Array<{
      bookingId: string;
      bookingCode: string;
      attentionRequired: boolean;
      tenantId?: string;
    }>;
    expect(items).toHaveLength(2);
    expect(items.some((i) => i.bookingCode === "BKG-O5-FOREIGN")).toBe(false);
    expect(items.find((i) => i.bookingId === attentionId)?.attentionRequired).toBe(true);
    expect(items.find((i) => i.bookingId === clearId)?.attentionRequired).toBe(false);
    expect(items[0]).not.toHaveProperty("tenantId");

    const attentionOnly = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench?attention=true",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(attentionOnly.json().items).toHaveLength(1);
    expect(attentionOnly.json().items[0].bookingCode).toBe("BKG-O5-ATTN");

    const search = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench?q=CLEAR",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(search.json().items).toHaveLength(1);
    expect(search.json().items[0].bookingCode).toBe("BKG-O5-CLEAR");

    const aliceToken = await loginAlice(app);
    const deniedHealth = await app.inject({
      method: "GET",
      url: "/v1/ops/health",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(deniedHealth.statusCode).toBe(403);
    const deniedWorkbench = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(deniedWorkbench.statusCode).toBe(403);

    const partnerLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const partnerToken = partnerLogin.json().accessToken as string;
    const partnerWorkbench = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench",
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(partnerWorkbench.statusCode).toBe(403);
  });
});
