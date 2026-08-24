import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
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

describe("J3 finance analytics", () => {
  it("lists J3 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("080_j3_finance_analytics"))).toBe(true);
  });

  it("rolls finance KPIs from bookings and cost sheets with date filter", async () => {
    const store = seedStore("test-secret");
    const now = new Date().toISOString();
    const programmeId = newId();
    const rfpId = newId();
    const inRangeId = newId();
    const outRangeId = newId();

    store.bkgBookings.push(
      {
        id: inRangeId,
        tenantId: TENANT,
        bookingCode: "BKG-J3-IN",
        proposalId: newId(),
        rfpId,
        programmeId,
        opportunityId: newId(),
        organizationId: newId(),
        title: "In range",
        status: "confirmed",
        currency: "USD",
        sellPrice: 100000,
        confirmedAt: "2026-06-15T10:00:00.000Z",
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
      {
        id: outRangeId,
        tenantId: TENANT,
        bookingCode: "BKG-J3-OUT",
        proposalId: newId(),
        rfpId: newId(),
        programmeId: newId(),
        opportunityId: newId(),
        organizationId: newId(),
        title: "Out of range",
        status: "confirmed",
        currency: "USD",
        sellPrice: 50000,
        confirmedAt: "2025-01-15T10:00:00.000Z",
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
      {
        id: newId(),
        tenantId: FOREIGN,
        bookingCode: "BKG-J3-FOREIGN",
        proposalId: newId(),
        rfpId: newId(),
        programmeId: newId(),
        opportunityId: newId(),
        organizationId: newId(),
        title: "Foreign",
        status: "confirmed",
        currency: "USD",
        sellPrice: 800000,
        confirmedAt: "2026-06-15T10:00:00.000Z",
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
    );

    store.costSheets.push({
      id: newId(),
      tenantId: TENANT,
      sheetCode: "CST-J3",
      programmeId,
      rfpId,
      opportunityId: newId(),
      organizationId: newId(),
      status: "active",
      currency: "USD",
      marginFloorPercent: 20,
      totalCost: 70000,
      marginPercent: 30,
      marginAmount: 30000,
      currentVersion: 1,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.finInvoices.push({
      id: newId(),
      tenantId: TENANT,
      invoiceCode: "INV-J3",
      bookingId: inRangeId,
      organizationId: newId(),
      invoiceType: "deposit",
      status: "issued",
      currency: "USD",
      amount: 30000,
      amountPaid: 0,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const carolToken = await loginCarol(app);

    const unauth = await app.inject({ method: "GET", url: "/v1/analytics/health" });
    expect(unauth.statusCode).toBe(401);

    const health = await app.inject({
      method: "GET",
      url: "/v1/analytics/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("J3");
    expect(health.json().bookings).toBe(2);

    const all = await app.inject({
      method: "GET",
      url: "/v1/analytics/finance/summary",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(all.statusCode).toBe(200);
    expect(all.json().summary.bookingCount).toBe(2);
    expect(all.json().summary.clientRevenue).toBe(150000);
    expect(all.json().summary).not.toHaveProperty("tenantId");

    const ranged = await app.inject({
      method: "GET",
      url: "/v1/analytics/finance/summary?from=2026-01-01&to=2026-12-31",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(ranged.statusCode).toBe(200);
    expect(ranged.json().summary.bookingCount).toBe(1);
    expect(ranged.json().summary.clientRevenue).toBe(100000);
    expect(ranged.json().summary.supplierCost).toBe(70000);
    expect(ranged.json().summary.marginPercent).toBe(30);
    expect(ranged.json().summary.outstandingInvoiceCount).toBe(1);
    expect(ranged.json().summary.from).toBe("2026-01-01");

    const invalid = await app.inject({
      method: "GET",
      url: "/v1/analytics/finance/summary?from=not-a-date",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(invalid.statusCode).toBe(400);

    const aliceToken = await loginAlice(app);
    const denied = await app.inject({
      method: "GET",
      url: "/v1/analytics/finance/summary",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(denied.statusCode).toBe(403);
    const deniedHealth = await app.inject({
      method: "GET",
      url: "/v1/analytics/health",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(deniedHealth.statusCode).toBe(403);
  });
});
