import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { lookupRate, lookupSupplier } from "./commercial-facts/entity-lookup.js";

describe("H-114 mixed-SQL rate parent lookup", () => {
  it("reads supplier and rate from mixed SQL when process-local collections are empty", async () => {
    const store = seedStore("h114-lookup", TEST_BOOTSTRAP_SECRETS);
    const tenantId = [...store.tenants.values()][0]!.id;
    const now = "2026-09-21T15:00:00.000Z";
    const supplierId = "77777777-7777-4777-8777-777777777777";
    const rateId = "88888888-8888-4888-8888-888888888888";
    store.supSuppliers = [];
    store.supRates = [];
    store.dbPool = {
      query: async (sql: string) => {
        if (sql.includes("FROM sup_suppliers")) {
          return {
            rows: [
              {
                id: supplierId,
                tenant_id: tenantId,
                supplier_code: "H114-SUP",
                legal_name: "H114 Lodge",
                category: "accommodation",
                country: "TZ",
                status: "active",
                preferred_partner: false,
                data_quality_status: "complete",
                classification: "Internal",
                version: 1,
                created_at: now,
                updated_at: now,
                created_by_principal_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
                updated_by_principal_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
              },
            ],
          };
        }
        if (sql.includes("FROM sup_rates")) {
          return {
            rows: [
              {
                id: rateId,
                tenant_id: tenantId,
                supplier_id: supplierId,
                rate_code: "H114-SGL",
                rate_name: "H114-SGL",
                rate_type: "per_room_per_night",
                amount: 250,
                currency: "USD",
                valid_from: "2026-01-01",
                valid_to: "2026-12-31",
                includes_tax: false,
                status: "active",
                version: 1,
                created_at: now,
                updated_at: now,
                created_by_principal_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
                updated_by_principal_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
              },
            ],
          };
        }
        throw new Error(`unexpected sql: ${sql}`);
      },
    } as never;

    expect(await lookupSupplier(store, tenantId, supplierId)).toMatchObject({
      id: supplierId,
      supplierCode: "H114-SUP",
    });
    expect(await lookupRate(store, tenantId, supplierId, rateId)).toMatchObject({
      id: rateId,
      rateType: "per_room_per_night",
      amount: 250,
      currency: "USD",
    });
  });

  it("keeps bounded sidecar-only lookups on process-local mixed C4 collections", async () => {
    const store = seedStore("h114-lookup-bounded", TEST_BOOTSTRAP_SECRETS);
    const tenantId = [...store.tenants.values()][0]!.id;
    const now = "2026-09-21T15:00:00.000Z";
    const supplierId = "99999999-9999-4999-8999-999999999999";
    const rateId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01";
    store.f2Dp01BoundedSidecarOnly = true;
    store.dbPool = {
      query: async () => {
        throw new Error("bounded sidecar-only must not query mixed SQL");
      },
    } as never;
    store.supSuppliers = [
      {
        id: supplierId,
        tenantId,
        supplierCode: "BND-SUP",
        legalName: "bounded supplier",
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
      },
    ];
    store.supRates = [
      {
        id: rateId,
        tenantId,
        supplierId,
        rateCode: "BND-SGL",
        rateName: "BND-SGL",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        includesTax: false,
        status: "active",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
    ];

    expect(await lookupSupplier(store, tenantId, supplierId)).toMatchObject({ supplierCode: "BND-SUP" });
    expect(await lookupRate(store, tenantId, supplierId, rateId)).toMatchObject({ rateCode: "BND-SGL" });
  });
});
