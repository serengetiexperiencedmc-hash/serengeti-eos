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
  expect(raw).not.toMatch(/sourcingEvent/i);
  expect(raw).not.toContain("lineItems");
  expect(raw).not.toContain("amount");
  expect(raw).not.toContain("currency");
  expect(raw).not.toContain("invoiceId");
  expect(raw).not.toContain("bookingId");
  expect(raw).not.toContain("rateCardId");
  expect(raw).not.toContain("approvalTaskId");
  expect(raw).not.toContain("\"kind\"");
}

describe("PR1 Procurement Catalogue", () => {
  it("lists PR1 additive migration after committed 111_dg1", () => {
    expect(listMigrationFiles().some((f) => f.includes("117_pr1_procurement_records"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("111_dg1_dataset_records"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("116_ite1_it_endpoints"))).toBe(false);
  });

  it("enforces auth and tenant isolation without broadening C4 or I8 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/procurement/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/procurement/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/procurement",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/procurement/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("PR1");
    expect(health.json().module).toBe("procurement-catalogue");
    expect(health.json().records).toBe(0);
    expect(health.json().openRecords).toBe(0);
    assertNoSecrets(health.json());

    const c4Health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(c4Health.statusCode).toBe(200);
    expect(c4Health.json().increment).toBe("PG.21");
    expect(c4Health.json().module).toBe("supplier");

    const i8Health = await app.inject({
      method: "GET",
      url: "/v1/finance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i8Health.statusCode).toBe(200);
    expect(i8Health.json().increment).toBe("I8.4");
    expect(i8Health.json().module).toBe("finance");

    const dg1Health = await app.inject({
      method: "GET",
      url: "/v1/datasets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(dg1Health.statusCode).toBe(200);
    expect(dg1Health.json().increment).toBe("DG1");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/procurement/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "procure.catalogue")?.permissionKeys).toEqual([
      "procure:read:record",
      "procure:write:record",
    ]);
    for (const key of [
      "finance.approver",
      "finance.member",
      "commercial.manager",
      "dataset.register",
      "erm.kri",
    ]) {
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain("procure:read:record");
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain("procure:write:record");
    }
    expect("procurementRecords" in store).toBe(true);
  });

  it("runs procurement-catalogue lifecycle with optional C4 reference and no engine surfaces", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/procurement",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const sedmcTenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(sedmcTenant).toBeDefined();
    expect(partnerTenant).toBeDefined();

    const now = new Date().toISOString();
    const supplierId = "a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1";
    const foreignSupplierId = "b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b2b2";
    store.supSuppliers.push({
      id: supplierId,
      tenantId: sedmcTenant!.id,
      supplierCode: "SUP-PR1-001",
      legalName: "Serengeti Lodge Ltd",
      category: "accommodation",
      country: "TZ",
      status: "active",
      preferredPartner: false,
      dataQualityStatus: "Verified",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });
    store.supSuppliers.push({
      id: foreignSupplierId,
      tenantId: partnerTenant!.id,
      supplierCode: "SUP-PR1-X",
      legalName: "Other tenant lodge",
      category: "accommodation",
      country: "KE",
      status: "active",
      preferredPartner: false,
      dataQualityStatus: "Verified",
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    const foreignId = "97979797-9797-4979-8979-979797979799";
    store.procurementRecords.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      procurementCode: "PRC-9999",
      title: "Other tenant catalogue row",
      status: "open",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/procurement/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/procurement/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const suppliersSnapshot = JSON.stringify(store.supSuppliers);
    const invoicesSnapshot = JSON.stringify(store.finInvoices);
    const bookingsSnapshot = JSON.stringify(store.bkgBookings);
    const datasetsSnapshot = JSON.stringify(store.datasetRecords);

    const created = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Catalogue row exists",
        notes: "Register row only — not a purchasing engine",
        ownerLabel: "Head of Procurement (Dev/Test)",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().record.procurementCode).toBe("PRC-0001");
    expect(created.json().record.status).toBe("open");
    expect(created.json().record.title).toBe("Catalogue row exists");
    expect(created.json().record.ownerLabel).toBe("Head of Procurement (Dev/Test)");
    expect(created.json().record.supplierId).toBeUndefined();
    expect(created.json().record.kind).toBeUndefined();
    expect(created.json().record.amount).toBeUndefined();
    assertNoSecrets(created.json());
    assertCatalogueOnly(created.json());
    const id = created.json().record.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Second catalogue row" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().record.procurementCode).toBe("PRC-0002");
    const secondId = second.json().record.id as string;

    const missingSupplier = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Missing supplier", supplierId: newId() },
    });
    expect(missingSupplier.statusCode).toBe(400);
    expect(missingSupplier.json().reason).toBe("supplier_not_found");

    const wrongTenantSupplier = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Wrong tenant supplier", supplierId: foreignSupplierId },
    });
    expect(wrongTenantSupplier.statusCode).toBe(400);
    expect(wrongTenantSupplier.json().reason).toBe("supplier_not_found");

    const linked = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Linked to existing C4 supplier",
        supplierId,
      },
    });
    expect(linked.statusCode).toBe(201);
    expect(linked.json().record.procurementCode).toBe("PRC-0003");
    expect(linked.json().record.supplierId).toBe(supplierId);
    expect(linked.json().record.supplierCode).toBe("SUP-PR1-001");
    const linkedId = linked.json().record.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);
    expect(listed.json().items[0].procurementCode).toBe("PRC-0003");

    const got = await app.inject({
      method: "GET",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().record.procurementCode).toBe("PRC-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Catalogue row exists — register only" },
    });
    expect(patched.json().record.title).toBe("Catalogue row exists — register only");

    const cleared = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${linkedId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { supplierId: null },
    });
    expect(cleared.statusCode).toBe(200);
    expect(cleared.json().record.supplierId).toBeUndefined();
    expect(cleared.json().record.supplierCode).toBeUndefined();

    const reLinked = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${linkedId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { supplierId },
    });
    expect(reLinked.json().record.supplierId).toBe(supplierId);

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "approved" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().record.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/procurement/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("cancelled");

    for (const path of [
      "source",
      "tender",
      "score",
      "approve",
      "order",
      "receive",
      "match",
      "invoice",
      "pay",
      "book",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/procurement/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
      expect(
        (
          await app.inject({
            method: "GET",
            url: `/v1/procurement/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/suppliers/${supplierId}/purchase-orders`,
          headers: { authorization: `Bearer ${carolToken}` },
          payload: { title: "must not exist" },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/finance/purchase-orders",
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.supSuppliers)).toBe(suppliersSnapshot);
    expect(JSON.stringify(store.finInvoices)).toBe(invoicesSnapshot);
    expect(JSON.stringify(store.bkgBookings)).toBe(bookingsSnapshot);
    expect(JSON.stringify(store.datasetRecords)).toBe(datasetsSnapshot);

    const c4After = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(c4After.json().increment).toBe("PG.21");

    const i8After = await app.inject({
      method: "GET",
      url: "/v1/finance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i8After.json().increment).toBe("I8.4");

    const healthAfter = await app.inject({
      method: "GET",
      url: "/v1/procurement/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(healthAfter.json().increment).toBe("PR1");
    expect(healthAfter.json().records).toBe(3);
    expect(healthAfter.json().openRecords).toBe(2);

    expect(secondId).toBeTruthy();
  });
});
