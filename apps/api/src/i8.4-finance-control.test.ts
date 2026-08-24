import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { computeMarginAmount, computeMarginPercent, newId } from "@sedmc/kernel";
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

describe("I8.4 booking financial control", () => {
  it("lists I8.4 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("079_i84_booking_financial_control"))).toBe(true);
  });

  it("computes margin from revenue and supplier cost", () => {
    expect(computeMarginAmount(100000, 70000)).toBe(30000);
    expect(computeMarginPercent(100000, 70000)).toBe(30);
    expect(computeMarginPercent(0, 10)).toBe(0);
  });

  it("scopes finance health and control to the tenant", async () => {
    const store = seedStore("test-secret");
    const now = new Date().toISOString();
    const programmeId = newId();
    const rfpId = newId();
    const bookingId = newId();
    const foreignId = newId();

    store.bkgBookings.push(
      {
        id: bookingId,
        tenantId: TENANT,
        bookingCode: "BKG-I84-001",
        proposalId: newId(),
        rfpId,
        programmeId,
        opportunityId: newId(),
        organizationId: newId(),
        title: "I8.4 Control Booking",
        status: "confirmed",
        currency: "USD",
        sellPrice: 100000,
        confirmedAt: now,
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
      {
        id: foreignId,
        tenantId: FOREIGN,
        bookingCode: "BKG-I84-FOREIGN",
        proposalId: newId(),
        rfpId: newId(),
        programmeId: newId(),
        opportunityId: newId(),
        organizationId: newId(),
        title: "Foreign Finance Booking",
        status: "confirmed",
        currency: "USD",
        sellPrice: 999999,
        confirmedAt: now,
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
      sheetCode: "CST-I84",
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
      invoiceCode: "INV-DEP-I84-001",
      bookingId,
      organizationId: newId(),
      invoiceType: "deposit",
      status: "partially_paid",
      currency: "USD",
      amount: 30000,
      amountPaid: 10000,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });
    store.finInvoices.push({
      id: newId(),
      tenantId: FOREIGN,
      invoiceCode: "INV-FOREIGN",
      bookingId: foreignId,
      organizationId: newId(),
      invoiceType: "deposit",
      status: "issued",
      currency: "USD",
      amount: 1,
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

    const unauth = await app.inject({ method: "GET", url: "/v1/finance/health" });
    expect(unauth.statusCode).toBe(401);

    const health = await app.inject({
      method: "GET",
      url: "/v1/finance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I8.4");
    expect(health.json().invoices).toBe(1);
    expect(health.json().bookings).toBe(1);

    const list = await app.inject({
      method: "GET",
      url: "/v1/finance/control",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().items).toHaveLength(1);
    const item = list.json().items[0];
    expect(item.bookingCode).toBe("BKG-I84-001");
    expect(item.clientRevenue).toBe(100000);
    expect(item.supplierCost).toBe(70000);
    expect(item.marginAmount).toBe(30000);
    expect(item.marginPercent).toBe(30);
    expect(item.paidTotal).toBe(10000);
    expect(item.outstandingTotal).toBe(90000);
    expect(item.depositStatus).toBe("partially_paid");
    expect(item).not.toHaveProperty("tenantId");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/finance/bookings/${bookingId}/control`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().control.bookingId).toBe(bookingId);

    const foreign = await app.inject({
      method: "GET",
      url: `/v1/finance/bookings/${foreignId}/control`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(foreign.statusCode).toBe(404);

    const aliceToken = await loginAlice(app);
    const aliceList = await app.inject({
      method: "GET",
      url: "/v1/finance/control",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(aliceList.statusCode).toBe(200);
    expect(aliceList.json().items).toHaveLength(1);

    const partnerLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const partnerToken = partnerLogin.json().accessToken as string;
    const partnerDenied = await app.inject({
      method: "GET",
      url: "/v1/finance/control",
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(partnerDenied.statusCode).toBe(403);
  });
});
