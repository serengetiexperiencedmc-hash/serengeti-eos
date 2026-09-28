import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { runF2Dp01BoundedDevtestApiStartup } from "../src/commercial-facts/bounded-startup.js";
import { isDurableSoR, isMixedSqlDurable } from "../src/persistence/durable.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";

function recordingPool() {
  const sql: string[] = [];
  const query = (async (text: string) => {
    sql.push(String(text));
    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];
  return {
    sql,
    pool: {
      query,
      connect: async () => ({ query, release() {} }),
      options: { connectionString: APPROVED_URL },
    } as unknown as DbPool,
  };
}

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("H-111 Day 2 — bounded sidecar-only mixed SQL fail-closed", () => {
  it("keeps F2 sidecar durable while refusing mixed C-spine SQL", async () => {
    const store = seedStore("h111-sidecar-only");
    const recorded = recordingPool();
    await runF2Dp01BoundedDevtestApiStartup({ store, pool: recorded.pool });
    expect(isDurableSoR(store)).toBe(true);
    expect(isMixedSqlDurable(store)).toBe(false);
    expect(store.f2Dp01BoundedSidecarOnly).toBe(true);
  });

  it("creates and lists opportunities from memory without querying opp_ tables", async () => {
    const store = seedStore("h111-sidecar-opp");
    const recorded = recordingPool();
    await runF2Dp01BoundedDevtestApiStartup({ store, pool: recorded.pool });
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const csv = ["legalName,organizationTypeKey,tradingName,country", "Day2 Client Ltd,corporate,Day2,United Kingdom"].join(
      "\n",
    );
    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "test", entityType: "organization", csv },
    });
    const batchId = created.json().batch.id as string;
    await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    await app.inject({
      method: "POST",
      url: `/v1/crm/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": `d2-org-${batchId}` },
    });
    const orgs = await app.inject({
      method: "GET",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(orgs.statusCode).toBe(200);
    const orgId = orgs.json().items[0].id as string;

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-D2-0001",
        title: "Day 2 bounded opportunity",
        organizationId: orgId,
      },
    });
    expect(opp.statusCode).toBe(201);
    const opportunityId = opp.json().opportunity.id as string;

    const board = await app.inject({
      method: "GET",
      url: "/v1/pipeline/board",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(board.statusCode).toBe(200);
    expect(JSON.stringify(board.json())).toContain(opportunityId);

    const facts = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(facts.statusCode).toBe(200);
    expect(facts.json().persistence.recorded).toBe(false);
    expect(facts.json().persistence.mode).toBe("f2_dp01_sidecar");
    expect(facts.json().persistence.mixedSqlDurable).toBe(false);
    expect(facts.json().facts.qualificationStatus).toBe("not_yet_assessed");
    expect(facts.json().facts.newQualifiedStageIsNotQualification).toBe(true);

    const forbidden = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
    });
    expect(forbidden.statusCode).toBe(401);

    const joined = recorded.sql.join("\n").toLowerCase();
    expect(joined).not.toMatch(/opp_opportunities/);
    expect(joined).not.toContain("schema_migrations");
    expect(joined).not.toMatch(/insert into tenants/);
  });

  it("does not invent 250k/20% as an F2 rule on the sidecar path", async () => {
    const store = seedStore("h111-sidecar-cpr");
    const recorded = recordingPool();
    await runF2Dp01BoundedDevtestApiStartup({ store, pool: recorded.pool });
    expect(isMixedSqlDurable(store)).toBe(false);
    expect(JSON.stringify({ mixedSqlDurable: isMixedSqlDurable(store) })).not.toMatch(/250000|250_000|20%/);
  });
});
