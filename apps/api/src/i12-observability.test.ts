import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { IT_SEED } from "../src/it/collections.js";
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

describe("I12 Observability", () => {
  it("lists I12 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("083_i12_observability"))).toBe(true);
  });

  it("enforces auth and scopes the map to tenant CMDB depends_on", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/observability/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/observability/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/observability/map",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/observability/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I12");
    expect(health.json().nodes).toBe(3);
    expect(health.json().edges).toBe(2);
    assertNoSecrets(health.json());

    const map = await app.inject({
      method: "GET",
      url: "/v1/observability/map",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(map.statusCode).toBe(200);
    const nodes = map.json().nodes as Array<{ ciId: string; ciCode: string; status: string; probe?: string }>;
    expect(nodes.map((n) => n.ciCode).sort()).toEqual(["CI-0001", "CI-0002", "CI-0003"]);
    expect(map.json().edges).toEqual(
      expect.arrayContaining([
        { fromCiId: IT_SEED.webCiId, toCiId: IT_SEED.apiCiId, relType: "depends_on" },
        { fromCiId: IT_SEED.apiCiId, toCiId: IT_SEED.dbCiId, relType: "depends_on" },
      ]),
    );
    const oltp = nodes.find((n) => n.ciCode === "CI-0003");
    expect(oltp?.probe).toBe("oltp");
    expect(oltp?.status).toBe("ok");
    assertNoSecrets(map.json());
  });

  it("records tenant traces and hides secrets", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    await app.inject({
      method: "GET",
      url: "/v1/observability/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${partnerToken}` },
    });

    const traces = await app.inject({
      method: "GET",
      url: "/v1/observability/traces",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(traces.statusCode).toBe(200);
    const items = traces.json().items as Array<{ name: string; traceId: string }>;
    expect(items.some((s) => s.name.includes("/v1/observability/health"))).toBe(true);
    expect(JSON.stringify(traces.json())).not.toContain("/v1/cmdb/health");
    expect(items[0]?.traceId).toMatch(/^[a-f0-9]{32}$/);
    assertNoSecrets(traces.json());

    const badLimit = await app.inject({
      method: "GET",
      url: "/v1/observability/traces?limit=nope",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(badLimit.statusCode).toBe(400);
  });

  it("marks OLTP unavailable and degrades dependents when dbHealth fails", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({
      store,
      dbHealth: async () => ({ ok: false, error: "down" }),
    });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const map = await app.inject({
      method: "GET",
      url: "/v1/observability/map",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    const byCode = Object.fromEntries(
      (map.json().nodes as Array<{ ciCode: string; status: string }>).map((n) => [n.ciCode, n.status]),
    );
    expect(byCode["CI-0003"]).toBe("unavailable");
    expect(byCode["CI-0002"]).toBe("degraded");
    expect(byCode["CI-0001"]).toBe("degraded");
  });
});
