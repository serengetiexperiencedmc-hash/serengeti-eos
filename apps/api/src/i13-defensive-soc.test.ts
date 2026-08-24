import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { IT_SEED } from "../src/it/collections.js";
import { SOC_SEED } from "../src/security/collections.js";
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

describe("I13 Defensive SOC", () => {
  it("lists I13 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("084_i13_defensive_soc"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/security/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/security/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/security/alerts",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/security/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I13");
    expect(health.json().alerts).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/security/alerts/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("ingests idempotently and opens an I11 incident case", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/security/alerts",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Nope" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/security/alerts",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Suspicious login burst",
        severity: "high",
        externalId: "dev-1",
        ciId: IT_SEED.apiCiId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().alert.alertCode).toBe("ALT-0002");
    expect(created.json().alert.source).toBe("devtest.webhook");
    assertNoSecrets(created.json());

    const again = await app.inject({
      method: "POST",
      url: "/v1/security/alerts",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Suspicious login burst", externalId: "dev-1" },
    });
    expect(again.statusCode).toBe(200);
    expect(again.json().alert.id).toBe(created.json().alert.id);

    const foreignCi = await app.inject({
      method: "POST",
      url: "/v1/security/alerts",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Bad CI", ciId: newId() },
    });
    expect(foreignCi.statusCode).toBe(404);

    const opened = await app.inject({
      method: "POST",
      url: `/v1/security/alerts/${created.json().alert.id}/case`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(opened.statusCode).toBe(200);
    expect(opened.json().ticket.ticketType).toBe("incident");
    expect(opened.json().ticket.ticketCode).toBe("TKT-0002");
    expect(opened.json().alert.ticketId).toBe(opened.json().ticket.id);
    expect(opened.json().alert.status).toBe("acknowledged");
    assertNoSecrets(opened.json());

    const ticket = await app.inject({
      method: "GET",
      url: `/v1/itsm/tickets/${opened.json().ticket.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(ticket.json().cis.some((c: { ciId: string }) => c.ciId === IT_SEED.apiCiId)).toBe(true);

    const duplicateCase = await app.inject({
      method: "POST",
      url: `/v1/security/alerts/${created.json().alert.id}/case`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(duplicateCase.statusCode).toBe(409);

    const closedSeed = await app.inject({
      method: "POST",
      url: `/v1/security/alerts/${SOC_SEED.sampleAlertId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closedSeed.json().alert.status).toBe("closed");
    const ackClosed = await app.inject({
      method: "POST",
      url: `/v1/security/alerts/${SOC_SEED.sampleAlertId}/acknowledge`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(ackClosed.statusCode).toBe(409);
  });
});
