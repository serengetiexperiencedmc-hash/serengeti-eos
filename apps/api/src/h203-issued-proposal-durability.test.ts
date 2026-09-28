import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { listMigrationFiles } from "@sedmc/db";
import { ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS, ISSUED_PROPOSAL_DELIVERY } from "@sedmc/kernel/issued-proposal";
import { seedStore, TEST_BOOTSTRAP_SECRETS, type Store } from "../src/app.js";
import { unauthorizedClientIssueRoutes } from "../src/issued-proposal/issued-proposal.js";
import { insertIssuedProposal } from "../src/persistence/issued-proposal-repository.js";
import { newProcessAgainstPool } from "../src/persistence/gate-b-recovery-harness.js";
import { buildServer } from "../src/server.js";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-203-commercial-core-programme-rfp-finance-development.md",
);

const P = TEST_BOOTSTRAP_SECRETS;
const CAROL = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

async function login(app: ReturnType<typeof buildServer>, email: string, password: string) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

async function loginCarol(app: ReturnType<typeof buildServer>) {
  return login(app, "carol.admin@sedmc.local", P.carolPassword);
}

async function seedOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Durable Ltd,corporate,H203 Durable,UK"].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-dur-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createProgramme(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  suffix: string,
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H203D-${suffix}`,
      title: "H203 Durable",
      organizationId: orgId,
      paxCount: 8,
    },
  });
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H203D-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "H203 Durable RFP",
      paxCount: 8,
      destinations: "Serengeti",
    },
  });
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId: rfp.json().rfp.id,
      title: "H203 Durable Programme",
      startDate: "2026-06-10",
      endDate: "2026-06-24",
      paxCount: 8,
      inclusionsText: "Park fees",
      exclusionsText: "International flights",
    },
  });
  return {
    rfp: rfp.json().rfp as { id: string },
    programmeId: prg.json().programme.id as string,
    programme: prg.json().programme as { id: string; rfpId: string; organizationId: string },
  };
}

async function addCostSheet(app: ReturnType<typeof buildServer>, token: string, programmeId: string) {
  const created = await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      programmeId,
      lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
    },
  });
  expect(created.statusCode).toBe(201);
  return created.json().sheet as { id: string; clientSellingPrice: number };
}

async function labelFinal(app: ReturnType<typeof buildServer>, token: string, programmeId: string) {
  const labelled = await app.inject({
    method: "PATCH",
    url: `/v1/programmes/${programmeId}`,
    headers: { authorization: `Bearer ${token}` },
    payload: { commercialVersionLabel: "final" },
  });
  expect(labelled.statusCode).toBe(200);
}

function attachPool(store: Store, pool: DbPool) {
  store.dbPool = pool;
}

function detachPool(store: Store) {
  delete store.dbPool;
}

function addStaffWithoutIssue(store: Store, email: string, roles: string[], permissions: string[]) {
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) throw new Error("carol missing");
  const clone = {
    ...carol,
    id: randomUUID(),
    email,
    displayName: email,
    roles: [...roles],
    permissions: [...permissions],
  };
  store.principals.set(clone.id, clone);
  store.principals.set(clone.email, clone);
}

type IssuedRow = Record<string, unknown>;

function mockIssuedPool(options?: { failAfterIssuedInsert?: boolean }) {
  const issued: IssuedRow[] = [];
  const sql: string[] = [];
  let snapshot: IssuedRow[] | null = null;

  const query = async (text: string, params: unknown[] = []) => {
    sql.push(text);
    const q = text.replace(/\s+/g, " ");
    if (text === "BEGIN") {
      snapshot = issued.map((row) => ({ ...row }));
      return { rows: [], rowCount: 0 };
    }
    if (text === "COMMIT") {
      snapshot = null;
      return { rows: [], rowCount: 0 };
    }
    if (text === "ROLLBACK") {
      if (snapshot) {
        issued.splice(0, issued.length, ...snapshot);
        snapshot = null;
      }
      return { rows: [], rowCount: 0 };
    }
    if (/^\s*UPDATE\s+issued_proposals/i.test(text) || /^\s*DELETE\s+FROM\s+issued_proposals/i.test(text)) {
      throw new Error("issued_proposals are insert-only");
    }
    if (q.includes("INSERT INTO issued_proposals")) {
      const duplicate = issued.some((row) => row.tenant_id === params[1] && row.issued_code === params[2]);
      if (duplicate) {
        const error = Object.assign(new Error("duplicate issued_code"), {
          code: "23505",
          constraint: "issued_proposals_tenant_id_issued_code_key",
        });
        throw error;
      }
      const row: IssuedRow = {
        id: params[0],
        tenant_id: params[1],
        issued_code: params[2],
        kind: params[3],
        programme_id: params[4],
        rfp_id: params[5],
        c8_proposal_id: params[6],
        programme_commercial_version_label: params[7],
        programme_version_number: params[8],
        programme_version_id: params[9],
        issued_by_principal_id: params[10],
        approval_authority: params[11],
        approval_request_id: params[12],
        issued_at: params[13],
        approval_recorded_at: params[14],
        client_safe: typeof params[15] === "string" ? JSON.parse(params[15] as string) : params[15],
        immutable: params[16],
        created_at: params[17],
      };
      issued.push(row);
      if (options?.failAfterIssuedInsert) throw new Error("forced_audit_failure");
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("FROM issued_proposals") && q.includes("id = $1")) {
      const row = issued.find((r) => r.id === params[0] && r.tenant_id === params[1]);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM issued_proposals") && q.includes("issued_code")) {
      const exists = issued.some((r) => r.tenant_id === params[0] && r.issued_code === params[1]);
      return exists ? { rows: [{ "?column?": 1 }], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("COUNT(*)") && q.includes("FROM issued_proposals")) {
      const count = issued.filter((r) => r.tenant_id === params[0]).length;
      return { rows: [{ c: count }], rowCount: 1 };
    }
    if (q.includes("FROM issued_proposals")) {
      const rows = issued
        .filter((r) => r.tenant_id === params[0])
        .filter((r) => (params.length > 1 && q.includes("programme_id") ? r.programme_id === params[1] : true))
        .sort((a, b) => String(b.issued_at).localeCompare(String(a.issued_at)));
      return { rows, rowCount: rows.length };
    }
    if (q.includes("FROM audit_events") && q.includes("row_hash")) {
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("INSERT INTO audit_events")) {
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  };

  const client = { query, release() {} };
  return {
    sql,
    issued,
    pool: {
      connect: async () => client,
      query,
    } as unknown as DbPool,
  };
}

describe("H-203 issued-proposal durability (Dev/Test)", () => {
  it("records Dev/Test migration 128 and keeps productionReady false", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).toContain("PDF/email/dispatch/client access remain unauthorized");
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/128_h203_issued_proposal_durability.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("persists a successful issuance and retrieves it after a simulated process restart", async () => {
    const store = seedStore("h203-durable");
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "ok");
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    attachPool(store, pool);

    const created = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(created.statusCode).toBe(201);
    expect(issued).toHaveLength(1);
    const issuedId = created.json().issuedProposal.id as string;
    const issuedCode = created.json().issuedProposal.issuedCode as string;
    const snapshot = created.json().clientSafe as Record<string, unknown>;
    expect(issuedCode.startsWith("ISS-")).toBe(true);
    expect(created.json().issuedProposal.immutable).toBe(true);
    expect(created.json().issuedProposal.approvalAuthority).toBe("platform.admin");
    expect(created.json().delivery).toEqual(ISSUED_PROPOSAL_DELIVERY);

    const restarted = newProcessAgainstPool(pool, "h203-durable-restart");
    expect(restarted.issuedProposals).toHaveLength(0);
    const restartedApp = buildServer({ store: restarted });
    const restartedToken = await loginCarol(restartedApp);
    const reread = await restartedApp.inject({
      method: "GET",
      url: `/v1/issued-proposals/${issuedId}`,
      headers: { authorization: `Bearer ${restartedToken}` },
    });
    expect(reread.statusCode).toBe(200);
    expect(reread.json().issuedProposal.id).toBe(issuedId);
    expect(reread.json().issuedProposal.issuedCode).toBe(issuedCode);
    expect(reread.json().clientSafe).toEqual(snapshot);
    expect(reread.json().clientSafe.clientSellingPrice).toBe(1450);
  });

  it("rejects a non-final programme without writing an issued row", async () => {
    const store = seedStore("h203-durable-draft");
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "draft");
    await addCostSheet(app, token, programmeId);
    attachPool(store, pool);

    const rejected = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(rejected.statusCode).toBe(409);
    expect(rejected.json().reason).toBe("programme_not_final");
    expect(issued).toHaveLength(0);
    expect(store.issuedProposals).toHaveLength(0);
  });

  it("rejects an unauthorized issuer without writing an issued row", async () => {
    const store = seedStore("h203-durable-unauth");
    addStaffWithoutIssue(store, "staff.noauth@sedmc.local", ["finance.member"], [
      ...([...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")?.permissions ?? []),
    ]);
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const staff = await login(app, "staff.noauth@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, carol);
    const { programmeId } = await createProgramme(app, carol, orgId, "unauth");
    await addCostSheet(app, carol, programmeId);
    await labelFinal(app, carol, programmeId);
    attachPool(store, pool);

    const denied = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${staff}` },
      payload: { programmeId },
    });
    expect(denied.statusCode).toBe(403);
    expect(issued).toHaveLength(0);
    expect(store.issuedProposals).toHaveLength(0);
  });

  it("enforces durable issued-code uniqueness", async () => {
    const { pool, issued } = mockIssuedPool();
    const client = { query: pool.query.bind(pool) };
    const base = {
      id: randomUUID(),
      issuedCode: "ISS-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      kind: "issued_proposal" as const,
      tenantId: "11111111-1111-4111-8111-111111111111",
      programmeId: randomUUID(),
      rfpId: randomUUID(),
      programmeCommercialVersionLabel: "final" as const,
      clientSafe: {
        issuingEntity: "Serengeti Experience DMC" as const,
        programmeCode: "PRG-DUP",
        programmeTitle: "Dup",
        commercialVersionLabel: "final" as const,
        itinerary: [],
        currency: "USD",
        clientSellingPrice: 1450,
      },
      issuedAt: "2026-09-27T12:00:00.000Z",
      issuedByPrincipalId: CAROL,
      approvalAuthority: "platform.admin" as const,
      approvalRecordedAt: "2026-09-27T12:00:00.000Z",
      immutable: true as const,
      createdAt: "2026-09-27T12:00:00.000Z",
    };
    await insertIssuedProposal(client, base);
    await expect(insertIssuedProposal(client, { ...base, id: randomUUID() })).rejects.toMatchObject({
      code: "23505",
    });
    expect(issued).toHaveLength(1);
  });

  it("links an approved C7 request when one exists and keeps it off clientSafe", async () => {
    const store = seedStore("h203-durable-apr");
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, programme } = await createProgramme(app, token, orgId, "apr");
    const sheet = await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    const now = new Date().toISOString();
    const approvalId = randomUUID();
    store.comApprovalRequests.push({
      id: approvalId,
      tenantId: "11111111-1111-4111-8111-111111111111",
      requestCode: "APR-H203D",
      costSheetId: sheet.id,
      rfpId: programme.rfpId,
      programmeId,
      organizationId: programme.organizationId,
      status: "approved",
      gateType: "standard_review",
      gateReason: "Durable UAT",
      marginPercent: 31,
      marginFloorPercent: 15,
      totalCost: 1000,
      sellPrice: 1450,
      currency: "USD",
      marginMeetsFloor: true,
      requestedByPrincipalId: CAROL,
      decidedByPrincipalId: CAROL,
      decidedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    attachPool(store, pool);

    const created = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().issuedProposal.approvalRequestId).toBe(approvalId);
    expect(created.json().clientSafe).not.toHaveProperty("approvalRequestId");
    expect(issued[0]?.approval_request_id).toBe(approvalId);
  });

  it("keeps the persisted snapshot unchanged after programme and costing mutations and rejects UPDATE/DELETE", async () => {
    const store = seedStore("h203-durable-immut");
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "immut");
    const sheet = await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    attachPool(store, pool);

    const created = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(created.statusCode).toBe(201);
    const issuedId = created.json().issuedProposal.id as string;
    const frozen = created.json().clientSafe as Record<string, unknown>;

    detachPool(store);
    const addLine = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheet.id}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "activities", description: "Later balloon", unitCost: 500 },
    });
    expect(addLine.statusCode).toBe(201);
    expect(addLine.json().sheet.clientSellingPrice).toBeGreaterThan(frozen.clientSellingPrice as number);

    await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "revised" },
    });
    await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Later mutated durable programme" },
    });

    store.issuedProposals = [];
    attachPool(store, pool);
    const reread = await app.inject({
      method: "GET",
      url: `/v1/issued-proposals/${issuedId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(reread.statusCode).toBe(200);
    expect(reread.json().clientSafe).toEqual(frozen);
    expect(reread.json().issuedProposal.programmeCommercialVersionLabel).toBe("final");

    await expect(pool.query("UPDATE issued_proposals SET immutable = false")).rejects.toThrow(
      /insert-only/,
    );
    await expect(pool.query("DELETE FROM issued_proposals")).rejects.toThrow(/insert-only/);
    expect(issued).toHaveLength(1);
    expect(issued[0]?.client_safe).toEqual(frozen);
  });

  it("lets authorized staff inspect the record and denies staff without proposal:read", async () => {
    const store = seedStore("h203-durable-authz");
    addStaffWithoutIssue(store, "reader.denied@sedmc.local", ["finance.member"], []);
    const { pool } = mockIssuedPool();
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const denied = await login(app, "reader.denied@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, carol);
    const { programmeId } = await createProgramme(app, carol, orgId, "authz");
    await addCostSheet(app, carol, programmeId);
    await labelFinal(app, carol, programmeId);
    attachPool(store, pool);
    const created = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${carol}` },
      payload: { programmeId },
    });
    expect(created.statusCode).toBe(201);
    const issuedId = created.json().issuedProposal.id as string;

    const ok = await app.inject({
      method: "GET",
      url: `/v1/issued-proposals/${issuedId}`,
      headers: { authorization: `Bearer ${carol}` },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().issuedProposal.issuedByPrincipalId).toBe(CAROL);

    const forbidden = await app.inject({
      method: "GET",
      url: `/v1/issued-proposals/${issuedId}`,
      headers: { authorization: `Bearer ${denied}` },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("does not expose public, client, download, or pdf retrieval", async () => {
    const store = seedStore("h203-durable-public");
    const app = buildServer({ store });
    for (const path of unauthorizedClientIssueRoutes()) {
      const hit = await app.inject({ method: "GET", url: path.replace(":id", randomUUID()) });
      expect(hit.statusCode).toBe(404);
    }
    const unauth = await app.inject({ method: "GET", url: "/v1/issued-proposals" });
    expect(unauth.statusCode).toBe(401);
  });

  it("rolls back so a failed issuance leaves no orphaned issued identity", async () => {
    const store = seedStore("h203-durable-orphan");
    const { pool, issued } = mockIssuedPool({ failAfterIssuedInsert: true });
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "orphan");
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    attachPool(store, pool);

    const failed = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(failed.statusCode).toBeGreaterThanOrEqual(500);
    expect(issued).toHaveLength(0);
    expect(store.issuedProposals).toHaveLength(0);
  });

  it("does not copy forbidden commercial internals into the persisted client-safe JSON", async () => {
    const store = seedStore("h203-durable-sanitize");
    const { pool, issued } = mockIssuedPool();
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "safe");
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    attachPool(store, pool);
    const created = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(created.statusCode).toBe(201);
    const persisted = issued[0]?.client_safe as Record<string, unknown>;
    for (const key of ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS) {
      expect(persisted).not.toHaveProperty(key);
    }
    expect(created.json().clientSafe).not.toHaveProperty("approvalRequestId");
  });
});