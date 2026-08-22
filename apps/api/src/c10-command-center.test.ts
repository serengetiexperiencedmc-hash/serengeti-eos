import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { computeFinanceOutstanding, newId } from "@sedmc/kernel";
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

describe("C10 booking command center", () => {
  it("lists C10 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("030_c10_command_center"))).toBe(true);
  });

  it("computes finance outstanding", () => {
    expect(computeFinanceOutstanding(100000, 30000)).toBe(70000);
    expect(computeFinanceOutstanding(50000, 60000)).toBe(0);
  });

  it("returns aggregated command center snapshot", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const bookingId = newId();
    const now = new Date().toISOString();

    store.bkgBookings.push({
      id: bookingId,
      tenantId,
      bookingCode: "BKG-CC-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Command Center Test",
      status: "handover_pending",
      currency: "USD",
      sellPrice: 200000,
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
      tenantId,
      bookingId,
      taskKey: "deposit_invoice",
      label: "Deposit invoice",
      status: "complete",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    store.finInvoices.push({
      id: newId(),
      tenantId,
      invoiceCode: "INV-BKG-CC-001-DEP",
      bookingId,
      organizationId: newId(),
      invoiceType: "deposit",
      status: "issued",
      currency: "USD",
      amount: 60000,
      amountPaid: 60000,
      dueDate: "2026-09-01",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    store.opsManifests.push({
      id: newId(),
      tenantId,
      bookingId,
      programmeId: newId(),
      status: "published",
      version: 1,
      publishedAt: now,
      classification: "Internal",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const res = await app.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}/command-center`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.snapshot.handover.progressPercent).toBe(100);
    expect(body.snapshot.finance.paidTotal).toBe(60000);
    expect(body.snapshot.finance.outstandingTotal).toBe(140000);
    expect(body.snapshot.ops.manifestStatus).toBe("published");
    expect(body.invoices.length).toBe(1);
    expect(body.snapshot.timeline.some((t: { key: string; status: string }) => t.key === "confirmed" && t.status === "complete")).toBe(true);
  });
});
