import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenantSlug = "sedmc",
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  return res.json().accessToken as string;
}

describe("I20.1 AI recommend (read-only)", () => {
  it("requires authentication and ai:read:recommend", async () => {
    const store = seedStore("i201-auth", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });

    const anon = await app.inject({ method: "GET", url: "/v1/ai/recommendations" });
    expect(anon.statusCode).toBe(401);

    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${alice}` },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("returns recommend-only items from live tenant signals", async () => {
    const store = seedStore("i201-recs", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;
    await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Domain Travel Ltd", domain: "domain-travel.example", organizationTypeId: typeId },
    });
    await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        legalName: "Unrelated Legal Name GmbH",
        tradingName: "Domain Travel",
        organizationTypeId: typeId,
      },
    });

    const res = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().increment).toBe("I20.3");
    expect(res.json().provider).toBe("dev-rules");
    expect(res.json().autonomyCeiling).toBe(1);
    const keys = res.json().items.map((i: { key: string }) => i.key);
    expect(keys).toContain("crm.duplicate.review");
    expect(res.json().items.every((i: { autonomyLevel: number }) => i.autonomyLevel === 1)).toBe(true);
    expect(res.json().items.every((i: { href: string }) => i.href.startsWith("/commercial/"))).toBe(true);
    expect(res.json().items.every((i: { href: string }) => !i.href.includes("/v1/"))).toBe(true);
  });
});
