import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { lookupOpportunity, lookupProgramme, lookupRfp } from "./commercial-facts/entity-lookup.js";

describe("H-112 mixed-SQL commercial-facts entity lookup", () => {
  it("reads opportunity/RFP/programme from mixed SQL when process-local collections are empty", async () => {
    const store = seedStore("h112-lookup", TEST_BOOTSTRAP_SECRETS);
    const tenantId = [...store.tenants.values()][0]!.id;
    const now = "2026-09-21T15:00:00.000Z";
    const opportunityId = "11111111-1111-4111-8111-111111111111";
    const rfpId = "22222222-2222-4222-8222-222222222222";
    const programmeId = "33333333-3333-4333-8333-333333333333";
    store.oppOpportunities = [];
    store.rfpRfps = [];
    store.prgProgrammes = [];
    store.dbPool = {
      query: async (sql: string) => {
        if (sql.includes("FROM opp_opportunities")) {
          return {
            rows: [
              {
                id: opportunityId,
                tenant_id: tenantId,
                opportunity_code: "H112-OPP",
                title: "lookup opportunity",
                organization_id: "44444444-4444-4444-8444-444444444444",
                stage: "new_qualified",
                status: "open",
                owner_principal_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
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
        if (sql.includes("FROM rfp_rfps")) {
          return {
            rows: [
              {
                id: rfpId,
                tenant_id: tenantId,
                rfp_code: "H112-RFP",
                opportunity_id: opportunityId,
                organization_id: "44444444-4444-4444-8444-444444444444",
                title: "lookup rfp",
                workflow_stage: "intake",
                status: "active",
                current_version: 1,
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
        if (sql.includes("FROM prg_programmes")) {
          return {
            rows: [
              {
                id: programmeId,
                tenant_id: tenantId,
                programme_code: "H112-PRG",
                rfp_id: rfpId,
                opportunity_id: opportunityId,
                organization_id: "44444444-4444-4444-8444-444444444444",
                title: "lookup programme",
                status: "draft",
                day_count: 0,
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
        throw new Error(`unexpected sql: ${sql}`);
      },
    } as never;

    expect(await lookupOpportunity(store, tenantId, opportunityId)).toMatchObject({ id: opportunityId, title: "lookup opportunity" });
    expect(await lookupRfp(store, tenantId, rfpId)).toMatchObject({ id: rfpId, title: "lookup rfp" });
    expect(await lookupProgramme(store, tenantId, programmeId)).toMatchObject({ id: programmeId, title: "lookup programme" });
  });

  it("keeps bounded sidecar-only lookups on process-local collections", async () => {
    const store = seedStore("h112-lookup-bounded", TEST_BOOTSTRAP_SECRETS);
    const tenantId = [...store.tenants.values()][0]!.id;
    const now = "2026-09-21T15:00:00.000Z";
    const opportunityId = "55555555-5555-4555-8555-555555555555";
    store.f2Dp01BoundedSidecarOnly = true;
    store.dbPool = {
      query: async () => {
        throw new Error("bounded sidecar-only must not query mixed SQL");
      },
    } as never;
    store.oppOpportunities = [
      {
        id: opportunityId,
        tenantId,
        opportunityCode: "BND-OPP",
        title: "bounded memory opportunity",
        organizationId: "66666666-6666-4666-8666-666666666666",
        stage: "new_qualified",
        status: "open",
        ownerPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        classification: "Internal",
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      },
    ];
    expect(await lookupOpportunity(store, tenantId, opportunityId)).toMatchObject({
      id: opportunityId,
      title: "bounded memory opportunity",
    });
  });
});
