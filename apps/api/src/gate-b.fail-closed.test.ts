import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { ensureCrmCollections } from "../src/crm/collections.js";
import { OptimisticConcurrencyError, isUniqueViolation } from "../src/persistence/durable.js";
import type { Store } from "../src/store.js";

const P = TEST_BOOTSTRAP_SECRETS;

function seedOrg(store: Store): string {
  ensureCrmCollections(store);
  const id = newId();
  const now = new Date().toISOString();
  store.crmOrganizations.push({
    id,
    tenantId: "11111111-1111-4111-8111-111111111111",
    legalName: "Gate B Client Ltd",
    organizationTypeId: newId(),
    status: "Active",
    dataQualityStatus: "Verified",
    classification: "Internal",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  });
  return id;
}

describe("GB-01/07/08 durable helpers", () => {
  it("classifies unique-violation and stale-version errors", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
    expect(isUniqueViolation(new Error("nope"))).toBe(false);
    const stale = new OptimisticConcurrencyError("rfp");
    expect(stale.code).toBe("stale_version");
  });
});

describe("GB-13 fail-closed persistence", () => {
  it("fails the API request when the durable pool cannot connect", async () => {
    const store = seedStore("gate-b-fail-closed", P);
    const orgId = seedOrg(store);
    store.dbPool = {
      connect: async () => {
        throw new Error("db_unreachable");
      },
      query: async () => {
        throw new Error("db_unreachable");
      },
    } as Store["dbPool"];

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;
    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-FAIL",
        title: "Must not persist",
        organizationId: orgId,
      },
    });
    expect(created.statusCode).toBeGreaterThanOrEqual(500);
    expect(store.oppOpportunities).toHaveLength(0);
  });
});
