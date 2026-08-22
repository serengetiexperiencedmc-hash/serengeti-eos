import { describe, expect, it } from "vitest";
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

describe("J2 operations analytics API", () => {
  it("returns operations summary rollups", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const bookingId = newId();
    const now = new Date().toISOString();

    store.bkgBookings.push({
      id: bookingId,
      tenantId,
      bookingCode: "BKG-J2-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "J2 Analytics Booking",
      status: "handover_pending",
      currency: "USD",
      sellPrice: 100000,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.bkgHandoverTasks.push(
      {
        id: newId(),
        tenantId,
        bookingId,
        taskKey: "supplier_confirm",
        label: "Supplier confirmations",
        status: "complete",
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: newId(),
        tenantId,
        bookingId,
        taskKey: "guest_vouchers",
        label: "Guest vouchers",
        status: "pending",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
    );

    store.opsSupplierConfirmations.push({
      id: newId(),
      tenantId,
      bookingId,
      supplierId: newId(),
      supplierName: "Test Lodge",
      status: "requested",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.opsVouchers.push({
      id: newId(),
      tenantId,
      bookingId,
      manifestEntryId: newId(),
      voucherCode: "VCH-J2-001-001",
      voucherType: "guest_activity",
      guestName: "Guest One",
      status: "draft",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.opsFieldTasks.push({
      id: newId(),
      tenantId,
      bookingId,
      title: "Confirm transfers",
      status: "pending",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const summaryRes = await app.inject({
      method: "GET",
      url: "/v1/analytics/operations/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(summaryRes.statusCode).toBe(200);
    const summary = summaryRes.json().summary;
    expect(summary.activeBookings).toBeGreaterThanOrEqual(1);
    expect(summary.supplierConfirmationsPending).toBeGreaterThanOrEqual(1);
    expect(summary.vouchersDraft).toBeGreaterThanOrEqual(1);
    expect(summary.fieldTasksOpen).toBeGreaterThanOrEqual(1);
    expect(summary.handoverTasksPending).toBeGreaterThanOrEqual(1);

    const bookingsRes = await app.inject({
      method: "GET",
      url: "/v1/analytics/operations/bookings",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bookingsRes.statusCode).toBe(200);
    const item = bookingsRes.json().items.find((b: { bookingId: string }) => b.bookingId === bookingId);
    expect(item).toBeDefined();
    expect(item.handoverProgressPercent).toBe(50);
    expect(item.supplierConfirmationsPending).toBe(1);
    expect(item.vouchersDraft).toBe(1);
    expect(item.fieldTasksOpen).toBe(1);
  });
});
