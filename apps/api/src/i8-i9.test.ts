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

describe("I8 finance API", () => {
  it("lists I8 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("025_i8_finance"))).toBe(true);
  });

  it("creates deposit invoice and reconciliation on issue", async () => {
    const store = seedStore("test-secret");
    const bookingId = newId();
    const now = new Date().toISOString();
    store.bkgBookings.push({
      id: bookingId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingCode: "BKG-FIN-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Test Booking",
      status: "confirmed",
      currency: "USD",
      sellPrice: 285000,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });
    store.bkgHandoverTasks.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingId,
      taskKey: "deposit_invoice",
      label: "Deposit invoice",
      status: "pending",
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/deposit",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(created.statusCode).toBe(201);
    const invoiceId = created.json().invoice.id as string;

    const issued = await app.inject({
      method: "POST",
      url: `/v1/finance/invoices/${invoiceId}/issue`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(issued.statusCode).toBe(200);
    expect(issued.json().reconciliation.status).toBe("open");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    const depositTask = detail.json().handoverTasks.find((t: { taskKey: string }) => t.taskKey === "deposit_invoice");
    expect(depositTask?.status).toBe("complete");
  });
});

describe("I8 finance extensions", () => {
  it("lists I8 quotes migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("027_i8_quotes"))).toBe(true);
  });

  it("creates quote, progress and final invoices", async () => {
    const store = seedStore("test-secret");
    const bookingId = newId();
    const now = new Date().toISOString();
    store.bkgBookings.push({
      id: bookingId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingCode: "BKG-FIN-EXT",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Finance Extension Booking",
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

    const quote = await app.inject({
      method: "POST",
      url: "/v1/finance/quotes",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(quote.statusCode).toBe(201);

    const progress = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/progress",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId, progressPercent: 40 },
    });
    expect(progress.statusCode).toBe(201);

    const deposit = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/deposit",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId, depositPercent: 30 },
    });
    expect(deposit.statusCode).toBe(201);

    const finalInv = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/final",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(finalInv.statusCode).toBe(201);
    expect(finalInv.json().invoice.amount).toBe(30000);
  });
});

describe("I9 field sync API", () => {
  it("lists I9 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("026_i9_field_sync"))).toBe(true);
  });

  it("pulls bundle and detects stale push conflict", async () => {
    const store = seedStore("test-secret");
    const bookingId = newId();
    const taskId = newId();
    const now = new Date().toISOString();
    store.bkgBookings.push({
      id: bookingId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingCode: "BKG-SYNC-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Sync Booking",
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
    store.opsFieldTasks.push({
      id: taskId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      bookingId,
      title: "Check radios",
      status: "pending",
      classification: "Internal",
      version: 2,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const pulled = await app.inject({
      method: "POST",
      url: "/v1/ops/sync/pull",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId, deviceId: "dev-tablet-1" },
    });
    expect(pulled.statusCode).toBe(200);
    const sessionId = pulled.json().session.id as string;

    const pushed = await app.inject({
      method: "POST",
      url: "/v1/ops/sync/push",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sessionId,
        deltas: [{ entityType: "field_task", entityId: taskId, clientVersion: 1, payload: { status: "complete" } }],
      },
    });
    expect(pushed.statusCode).toBe(200);
    expect(pushed.json().conflicts.length).toBe(1);
  });
});
