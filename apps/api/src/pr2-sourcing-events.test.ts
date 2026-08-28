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

function assertCatalogueOnly(body: unknown) {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain("procurementId");
  expect(raw).not.toContain("supplierId");
  expect(raw).not.toContain("lineItems");
  expect(raw).not.toContain("amount");
  expect(raw).not.toContain("currency");
  expect(raw).not.toContain("invoiceId");
  expect(raw).not.toContain("bookingId");
  expect(raw).not.toContain("rateCardId");
  expect(raw).not.toContain("rfq");
  expect(raw).not.toContain("tender");
  expect(raw).not.toContain("auction");
  expect(raw).not.toContain("\"kind\"");
  expect(raw).not.toContain("PRC-");
  expect(raw).not.toContain("PR2-");
}

describe("PR2 SourcingEvent Catalogue", () => {
  it("lists PR2 additive migration after committed 117_pr1 and not PQL 109–115", () => {
    expect(listMigrationFiles().some((f) => f.includes("118_pr2_sourcing_event_records"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("117_pr1_procurement_records"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("118_pql"))).toBe(false);
  });

  it("enforces auth and tenant isolation without broadening PR1, C4, or I8 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/sourcing-events/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/sourcing-events/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/sourcing-events",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/sourcing-events/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("PR2");
    expect(health.json().module).toBe("sourcing-event-register");
    expect(health.json().records).toBe(0);
    expect(health.json().openRecords).toBe(0);
    assertNoSecrets(health.json());

    const pr1Health = await app.inject({
      method: "GET",
      url: "/v1/procurement/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(pr1Health.statusCode).toBe(200);
    expect(pr1Health.json().increment).toBe("PR1");
    expect(pr1Health.json().module).toBe("procurement-catalogue");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/sourcing-events/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "sourcingEvent.register")?.permissionKeys).toEqual([
      "sourcingEvent:read:register",
      "sourcingEvent:write:register",
    ]);
    for (const key of [
      "finance.approver",
      "finance.member",
      "commercial.manager",
      "dataset.register",
      "erm.kri",
      "procure.catalogue",
    ]) {
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain("sourcingEvent:read:register");
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain(
        "sourcingEvent:write:register",
      );
    }
    expect("sourcingEventRecords" in store).toBe(true);
    expect("procurementRecords" in store).toBe(true);
  });

  it("runs sourcing-event-register lifecycle with SE- codes and no engine surfaces", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/sourcing-events",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();

    const now = new Date().toISOString();
    const foreignId = "97979797-9797-4979-8979-979797979798";
    store.sourcingEventRecords.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      code: "SE-9999",
      title: "Other tenant catalogue row",
      status: "open",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/sourcing-events/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/sourcing-events/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const procurementSnapshot = JSON.stringify(store.procurementRecords);
    const suppliersSnapshot = JSON.stringify(store.supSuppliers);
    const invoicesSnapshot = JSON.stringify(store.finInvoices);

    const created = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Catalogue row exists",
        notes: "Register row only — not a sourcing process",
        ownerLabel: "Head of Procurement (Dev/Test)",
        status: "retired",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().sourcingEvent.code).toBe("SE-0001");
    expect(created.json().sourcingEvent.status).toBe("open");
    expect(created.json().sourcingEvent.title).toBe("Catalogue row exists");
    expect(created.json().sourcingEvent.ownerLabel).toBe("Head of Procurement (Dev/Test)");
    expect(created.json().sourcingEvent.supplierId).toBeUndefined();
    expect(created.json().sourcingEvent.procurementId).toBeUndefined();
    expect(created.json().record).toBeUndefined();
    assertNoSecrets(created.json());
    assertCatalogueOnly(created.json());
    const id = created.json().sourcingEvent.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Second catalogue row" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().sourcingEvent.code).toBe("SE-0002");
    const secondId = second.json().sourcingEvent.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "retired" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);
    expect(listed.json().items[0].code).toBe("SE-0002");

    const filtered = await app.inject({
      method: "GET",
      url: "/v1/sourcing-events?q=Second&status=open",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(filtered.json().items).toHaveLength(1);
    expect(filtered.json().items[0].id).toBe(secondId);

    const got = await app.inject({
      method: "GET",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().sourcingEvent.code).toBe("SE-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Catalogue row exists — register only" },
    });
    expect(patched.json().sourcingEvent.title).toBe("Catalogue row exists — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "awarded" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const retired = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "retired" },
    });
    expect(retired.json().sourcingEvent.status).toBe("retired");

    const patchRetired = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchRetired.statusCode).toBe(409);
    expect(patchRetired.json().reason).toBe("retired");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/sourcing-events/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("retired");

    for (const path of ["rfq", "tender", "bid", "score", "auction", "award", "discover", "source", "select"]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/sourcing-events/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
      expect(
        (
          await app.inject({
            method: "GET",
            url: `/v1/sourcing-events/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/procurement/rfq",
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.procurementRecords)).toBe(procurementSnapshot);
    expect(JSON.stringify(store.supSuppliers)).toBe(suppliersSnapshot);
    expect(JSON.stringify(store.finInvoices)).toBe(invoicesSnapshot);

    const pr1After = await app.inject({
      method: "GET",
      url: "/v1/procurement/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(pr1After.json().increment).toBe("PR1");

    const healthAfter = await app.inject({
      method: "GET",
      url: "/v1/sourcing-events/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(healthAfter.json().increment).toBe("PR2");
    expect(healthAfter.json().records).toBe(2);
    expect(healthAfter.json().openRecords).toBe(1);

    expect(secondId).toBeTruthy();
  });
});
