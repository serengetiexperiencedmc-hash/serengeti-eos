import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { FIELD_CACHE_ENCRYPTION_ALG, FIELD_CACHE_POLICY_VERSION } from "@sedmc/kernel";
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

describe("I9.2 encrypted field cache policy", () => {
  it("lists I9.2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("031_i9_encrypted_cache"))).toBe(true);
  });

  it("returns policy v2 with encryption requirements", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const res = await app.inject({
      method: "GET",
      url: "/v1/ops/sync/policy",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const policy = res.json().policy;
    expect(policy.policyVersion).toBe(FIELD_CACHE_POLICY_VERSION);
    expect(policy.cacheEncryption).toBe(FIELD_CACHE_ENCRYPTION_ALG);
    expect(policy.requireEncryptedCache).toBe(true);
  });

  it("includes principalId in pull session for cache key derivation", async () => {
    const store = seedStore("test-secret");
    const tenantId = "11111111-1111-4111-8111-111111111111";
    const bookingId = "22222222-2222-4222-8222-222222222222";
    const now = new Date().toISOString();

    store.bkgBookings.push({
      id: bookingId,
      tenantId,
      bookingCode: "BKG-ENC-001",
      proposalId: "33333333-3333-4333-8333-333333333333",
      rfpId: "44444444-4444-4444-8444-444444444444",
      programmeId: "55555555-5555-4555-8555-555555555555",
      opportunityId: "66666666-6666-4666-8666-666666666666",
      organizationId: "77777777-7777-4777-8777-777777777777",
      title: "Encrypted Cache Test",
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

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const res = await app.inject({
      method: "POST",
      url: "/v1/ops/sync/pull",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId, deviceId: "dev-test-001" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().session.principalId).toBe("eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee");
  });
});
