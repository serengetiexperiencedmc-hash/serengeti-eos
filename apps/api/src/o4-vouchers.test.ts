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

describe("O4 guest vouchers API", () => {
  it("lists O4 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("029_o4_vouchers"))).toBe(true);
  });

  it("generates vouchers from published manifest and completes handover", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const bookingId = newId();
    const manifestId = newId();
    const entryId = newId();
    const now = new Date().toISOString();

    store.bkgBookings.push({
      id: bookingId,
      tenantId,
      bookingCode: "BKG-VCH-001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Voucher Test Booking",
      status: "handover_pending",
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

    store.bkgHandoverTasks.push({
      id: newId(),
      tenantId,
      bookingId,
      taskKey: "guest_vouchers",
      label: "Guest vouchers issued",
      status: "pending",
      sortOrder: 4,
      createdAt: now,
      updatedAt: now,
    });

    store.opsManifests.push({
      id: manifestId,
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

    store.opsManifestEntries.push({
      id: entryId,
      tenantId,
      manifestId,
      guestName: "Jane Guest",
      dietary: "Vegetarian",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const generated = await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/generate",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(generated.statusCode).toBe(201);
    expect(generated.json().items.length).toBe(1);

    const issued = await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/issue-all",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(issued.statusCode).toBe(200);
    expect(issued.json().items[0].status).toBe("issued");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    const voucherTask = detail.json().handoverTasks.find((t: { taskKey: string }) => t.taskKey === "guest_vouchers");
    expect(voucherTask?.status).toBe("complete");
  });
});
