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

describe("I8.3 finance automation", () => {
  it("lists I8.3 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("033_i8_final_invoice"))).toBe(true);
  });

  it("auto-creates final invoice when deposit and progress are paid", async () => {
    const store = seedStore("test-secret");
    const bookingId = newId();
    const now = new Date().toISOString();
    store.bkgBookings.push({
      id: bookingId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingCode: "BKG-I83-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "I8.3 Booking",
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
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    for (const type of ["deposit", "progress"] as const) {
      const created = await app.inject({
        method: "POST",
        url: type === "deposit" ? "/v1/finance/invoices/deposit" : "/v1/finance/invoices/progress",
        headers: { authorization: `Bearer ${token}` },
        payload: { bookingId },
      });
      const invoiceId = created.json().invoice.id as string;
      await app.inject({
        method: "POST",
        url: `/v1/finance/invoices/${invoiceId}/issue`,
        headers: { authorization: `Bearer ${token}` },
      });
      await app.inject({
        method: "POST",
        url: `/v1/finance/invoices/${invoiceId}/payments`,
        headers: { authorization: `Bearer ${token}` },
        payload: { amount: created.json().invoice.amount, paymentId: newId() },
      });
    }

    const eligibility = await app.inject({
      method: "GET",
      url: `/v1/finance/bookings/${bookingId}/final-invoice-eligibility`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(eligibility.statusCode).toBe(200);
    expect(eligibility.json().eligible).toBe(true);
    expect(eligibility.json().remainingAmount).toBe(30000);

    const auto = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/final/auto",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(auto.statusCode).toBe(201);
    expect(auto.json().invoice.amount).toBe(30000);
    expect(auto.json().invoice.invoiceType).toBe("final");
  });

  it("lists pending payment requests", async () => {
    const store = seedStore("test-secret");
    const bookingId = newId();
    const now = new Date().toISOString();
    store.bkgBookings.push({
      id: bookingId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingCode: "BKG-PAY-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Payment Request Booking",
      status: "confirmed",
      currency: "USD",
      sellPrice: 50000,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const deposit = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/deposit",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    const invoiceId = deposit.json().invoice.id as string;
    await app.inject({
      method: "POST",
      url: `/v1/finance/invoices/${invoiceId}/issue`,
      headers: { authorization: `Bearer ${token}` },
    });
    await app.inject({
      method: "POST",
      url: `/v1/finance/invoices/${invoiceId}/payment-requests`,
      headers: { authorization: `Bearer ${token}` },
      payload: { amount: deposit.json().invoice.amount, beneficiary: "Client bank" },
    });

    const listed = await app.inject({
      method: "GET",
      url: "/v1/finance/payment-requests",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items.length).toBeGreaterThanOrEqual(1);
    expect(listed.json().items[0].status).toBe("pending_approval");
  });
});
