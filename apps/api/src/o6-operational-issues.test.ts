import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenantSlug: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  return res.json().accessToken as string;
}

function assertNoSecrets(body: unknown) {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain("tenantId");
  expect(raw).not.toContain("principalId");
}

describe("O6 operational issues register", () => {
  it("lists O6 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("097_o6_operational_issues"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/ops/issues/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/ops/issues/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/ops/issues",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/ops/issues/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("O6");
    expect(health.json().issues).toBe(0);
    assertNoSecrets(health.json());

    const opsHealth = await app.inject({
      method: "GET",
      url: "/v1/ops/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(opsHealth.statusCode).toBe(200);
    expect(opsHealth.json().increment).toBe("O5");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/ops/issues/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "ops.issue")?.permissionKeys).toEqual([
      "ops:read:issue",
      "ops:write:issue",
    ]);
    expect(store.roles.find((r) => r.key === "commercial.manager")?.permissionKeys).not.toContain(
      "ops:read:issue",
    );
    expect(store.roles.find((r) => r.key === "grc.mapping")?.permissionKeys).not.toContain(
      "ops:read:issue",
    );
    expect(store.roles.find((r) => r.key === "grc.finding")?.permissionKeys).not.toContain(
      "ops:write:issue",
    );
    expect(store.roles.find((r) => r.key === "compliance.member")?.permissionKeys).not.toContain(
      "ops:read:issue",
    );
  });

  it("runs issue lifecycle with human-only mutate, booking reference, and no C9/O5/C10 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/ops/issues",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register", bookingId: newId() },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   ", bookingId: newId() },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingBooking = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "No booking" },
    });
    expect(missingBooking.statusCode).toBe(400);
    expect(missingBooking.json().reason).toBe("booking_not_found");

    const unknownBooking = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown booking", bookingId: newId() },
    });
    expect(unknownBooking.statusCode).toBe(400);
    expect(unknownBooking.json().reason).toBe("booking_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignBookingId = "85858585-8585-4858-8858-858585858585";
    store.bkgBookings.push({
      id: foreignBookingId,
      tenantId: partnerTenant!.id,
      bookingCode: "BKG-9999",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Other tenant booking",
      status: "cancelled",
      currency: "USD",
      sellPrice: 0,
      confirmedAt: new Date().toISOString(),
      classification: "Internal",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossBooking = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant booking", bookingId: foreignBookingId },
    });
    expect(crossBooking.statusCode).toBe(400);
    expect(crossBooking.json().reason).toBe("booking_not_found");

    const foreignId = "86868686-8686-4868-8868-868686868686";
    store.operationalIssues.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      issueCode: "ISS-9999",
      title: "Other tenant issue",
      status: "open",
      bookingId: foreignBookingId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/ops/issues/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/ops/issues/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const tenantId = [...store.tenants.values()].find((t) => t.slug === "sedmc")!.id;
    const now = new Date().toISOString();
    const cancelledId = newId();
    store.bkgBookings.push({
      id: cancelledId,
      tenantId,
      bookingCode: "BKG-ISS-0001",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Sample Dev/Test booking (O6)",
      status: "cancelled",
      currency: "USD",
      sellPrice: 0,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });
    const confirmedId = newId();
    store.bkgBookings.push({
      id: confirmedId,
      tenantId,
      bookingCode: "BKG-ISS-LIVE",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: newId(),
      organizationId: newId(),
      title: "Confirmed booking for O6 mutation check",
      status: "confirmed",
      currency: "USD",
      sellPrice: 0,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const workbenchBefore = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(workbenchBefore.statusCode).toBe(200);
    const workbenchCount = (workbenchBefore.json().items as unknown[]).length;
    const commandBefore = await app.inject({
      method: "GET",
      url: `/v1/bookings/${confirmedId}/command-center`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(commandBefore.statusCode).toBe(200);
    const handoverBefore = commandBefore.json().snapshot.handover.progressPercent as number;

    const created = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Supplier delay (Dev/Test)",
        description: "Register row only — not an autonomous ops engine",
        ownerLabel: "Operations lead",
        bookingId: cancelledId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().issue.issueCode).toBe("ISS-0001");
    expect(created.json().issue.status).toBe("open");
    expect(created.json().issue.bookingId).toBe(cancelledId);
    expect(created.json().issue.bookingCode).toBe("BKG-ISS-0001");
    assertNoSecrets(created.json());
    expect(store.bkgBookings.find((b) => b.id === cancelledId)?.status).toBe("cancelled");
    const id = created.json().issue.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register", bookingId: cancelledId },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/ops/issues/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Supplier delay — register only" },
    });
    expect(patched.json().issue.title).toBe("Supplier delay — register only");

    const started = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${id}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(started.json().issue.status).toBe("in_progress");

    const startAgain = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${id}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(startAgain.statusCode).toBe(409);
    expect(startAgain.json().reason).toBe("invalid_transition");

    const closed = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${id}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().issue.status).toBe("closed");

    const patchClosed = await app.inject({
      method: "PATCH",
      url: `/v1/ops/issues/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchClosed.statusCode).toBe(409);
    expect(patchClosed.json().reason).toBe("closed");

    const closeAgain = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${id}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closeAgain.statusCode).toBe(409);
    expect(closeAgain.json().reason).toBe("invalid_transition");

    const createdOnConfirmed = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Confirmed booking issue", bookingId: confirmedId },
    });
    expect(createdOnConfirmed.statusCode).toBe(201);
    const confirmedIssueId = createdOnConfirmed.json().issue.id as string;
    const startedConfirmed = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${confirmedIssueId}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(startedConfirmed.json().issue.status).toBe("in_progress");
    const closedConfirmed = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${confirmedIssueId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closedConfirmed.json().issue.status).toBe("closed");

    expect(store.bkgBookings.find((b) => b.id === confirmedId)?.status).toBe("confirmed");
    const workbenchAfter = await app.inject({
      method: "GET",
      url: "/v1/ops/workbench",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect((workbenchAfter.json().items as unknown[]).length).toBe(workbenchCount);
    const commandAfter = await app.inject({
      method: "GET",
      url: `/v1/bookings/${confirmedId}/command-center`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(commandAfter.json().snapshot.handover.progressPercent).toBe(handoverBefore);

    const closeFromOpen = await app.inject({
      method: "POST",
      url: "/v1/ops/issues",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Close from open", bookingId: cancelledId },
    });
    expect(closeFromOpen.statusCode).toBe(201);
    const closeFromOpenId = closeFromOpen.json().issue.id as string;
    const closedOpen = await app.inject({
      method: "POST",
      url: `/v1/ops/issues/${closeFromOpenId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closedOpen.json().issue.status).toBe("closed");
    expect(store.bkgBookings.find((b) => b.id === cancelledId)?.status).toBe("cancelled");

    expect("operationalIssues" in store).toBe(true);
    expect("grcTests" in store).toBe(false);
    expect("grcMappings" in store).toBe(false);
    expect("sampleRecords" in store).toBe(false);
  });
});
