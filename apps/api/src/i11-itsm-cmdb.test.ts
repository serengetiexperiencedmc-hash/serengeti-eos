import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { IT_SEED } from "../src/it/collections.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const FOREIGN = "22222222-2222-4222-8222-222222222222";

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

describe("I11 ITSM and CMDB", () => {
  it("lists I11 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("082_i11_itsm_cmdb"))).toBe(true);
  });

  it("scopes health and catalogues to the tenant and enforces authorization", async () => {
    const store = seedStore("test-secret");
    store.cmdbCis.push({
      id: newId(),
      tenantId: FOREIGN,
      ciCode: "CI-9001",
      name: "Foreign App",
      ciClass: "application",
      lifecycle: "active",
      environment: "development",
      criticality: "low",
      classification: "Internal",
      sourceOfTruth: "manual",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/itsm/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/cmdb/health",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const itsmHealth = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itsmHealth.statusCode).toBe(200);
    expect(itsmHealth.json().increment).toBe("I11");
    expect(itsmHealth.json().tickets).toBe(1);
    assertNoSecrets(itsmHealth.json());

    const cmdbHealth = await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cmdbHealth.statusCode).toBe(200);
    expect(cmdbHealth.json().increment).toBe("I11");
    expect(cmdbHealth.json().cis).toBe(3);

    const cis = await app.inject({
      method: "GET",
      url: "/v1/cmdb/cis",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cis.json().items.map((c: { ciCode: string }) => c.ciCode)).toEqual(["CI-0001", "CI-0002", "CI-0003"]);
    assertNoSecrets(cis.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/cmdb/cis/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    const foreignCiId = store.cmdbCis.find((c) => c.tenantId === FOREIGN)?.id as string;
    const foreign = await app.inject({
      method: "GET",
      url: `/v1/cmdb/cis/${foreignCiId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(foreign.statusCode).toBe(404);
  });

  it("creates CIs and relationships", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");

    const invalid = await app.inject({
      method: "POST",
      url: "/v1/cmdb/cis",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "No class" },
    });
    expect(invalid.statusCode).toBe(400);

    const created = await app.inject({
      method: "POST",
      url: "/v1/cmdb/cis",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "NATS JetStream", ciClass: "technical_service", criticality: "high" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().ci.ciCode).toBe("CI-0004");
    assertNoSecrets(created.json());

    const dup = await app.inject({
      method: "POST",
      url: "/v1/cmdb/cis",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "nats jetstream", ciClass: "technical_service" },
    });
    expect(dup.statusCode).toBe(409);

    const rel = await app.inject({
      method: "POST",
      url: "/v1/cmdb/relationships",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { fromCiId: IT_SEED.apiCiId, toCiId: created.json().ci.id, relType: "connects_to" },
    });
    expect(rel.statusCode).toBe(201);
    expect(rel.json().relationship.relType).toBe("connects_to");

    const self = await app.inject({
      method: "POST",
      url: "/v1/cmdb/relationships",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { fromCiId: IT_SEED.apiCiId, toCiId: IT_SEED.apiCiId, relType: "depends_on" },
    });
    expect(self.statusCode).toBe(400);
  });

  it("runs ticket lifecycle, assignment, and CI links", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/itsm/tickets",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Nope", ticketType: "incident" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/itsm/tickets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Web session timeout", ticketType: "request", severity: "low" },
    });
    expect(created.statusCode).toBe(201);
    const ticketId = created.json().ticket.id as string;
    expect(created.json().ticket.ticketCode).toBe("TKT-0002");
    assertNoSecrets(created.json());

    const assignedOpen = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${IT_SEED.outageTicketId}/assign`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { assignedToEmail: "carol.admin@sedmc.local" },
    });
    expect(assignedOpen.statusCode).toBe(200);
    expect(assignedOpen.json().ticket.status).toBe("open");
    expect(assignedOpen.json().ticket.assignedToEmail).toBe("carol.admin@sedmc.local");
    assertNoSecrets(assignedOpen.json());

    const illegal = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(illegal.statusCode).toBe(409);

    const triaged = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/triage`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(triaged.json().ticket.status).toBe("triaged");

    const assigned = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/assign`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { assignedToEmail: "carol.admin@sedmc.local" },
    });
    expect(assigned.statusCode).toBe(200);
    expect(assigned.json().ticket.status).toBe("assigned");
    expect(assigned.json().ticket.assignedToEmail).toBe("carol.admin@sedmc.local");
    assertNoSecrets(assigned.json());

    await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/resolve`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    const closed = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${ticketId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().ticket.status).toBe("closed");

    const linked = await app.inject({
      method: "POST",
      url: `/v1/itsm/tickets/${IT_SEED.outageTicketId}/cis`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { ciId: IT_SEED.webCiId },
    });
    expect(linked.statusCode).toBe(200);
    expect((linked.json().cis as Array<{ ciId: string }>).some((c) => c.ciId === IT_SEED.webCiId)).toBe(true);

    const unlinked = await app.inject({
      method: "DELETE",
      url: `/v1/itsm/tickets/${IT_SEED.outageTicketId}/cis/${IT_SEED.webCiId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(
      (unlinked.json().cis as Array<{ ciId: string }>).some((c) => c.ciId === IT_SEED.webCiId),
    ).toBe(false);

    const missingTicket = await app.inject({
      method: "GET",
      url: `/v1/itsm/tickets/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missingTicket.statusCode).toBe(404);
  });
});
