import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { listMigrationFiles } from "@sedmc/db";
import { ISSUED_PROPOSAL_DELIVERY } from "@sedmc/kernel/issued-proposal";
import { ISSUED_CLIENT_DOCUMENT_DELIVERY } from "@sedmc/kernel/issued-client-document-delivery";
import { RFP_WORKFLOW_STAGES } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS, type Store } from "../src/app.js";
import { LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";
import { unauthorizedIssuedClientDocumentDeliveryRoutes } from "../src/issued-proposal/delivery.js";
import { createDevTestMockDeliveryProvider } from "@sedmc/kernel/issued-client-document-delivery";
import { buildServer } from "../src/server.js";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-203-commercial-core-programme-rfp-finance-development.md",
);

const P = TEST_BOOTSTRAP_SECRETS;
const tmpRoots: string[] = [];

afterEach(() => {
  while (tmpRoots.length) {
    const root = tmpRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

function tempStorage(store: Store) {
  const root = mkdtempSync(join(tmpdir(), "h203-del-"));
  tmpRoots.push(root);
  store.documentStorage = new LocalFsDocumentStorage(root);
  return root;
}

async function login(app: ReturnType<typeof buildServer>, email: string, password: string, tenantSlug = "sedmc") {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

async function seedOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Del Ltd,corporate,H203 Del,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-del-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createProgramme(app: ReturnType<typeof buildServer>, token: string, orgId: string, suffix: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H203DEL-${suffix}`,
      title: "H203 Delivery",
      organizationId: orgId,
      paxCount: 8,
    },
  });
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H203DEL-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "H203 Delivery RFP",
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
      title: "H203 Delivery Programme",
      startDate: "2026-06-10",
      endDate: "2026-06-24",
      paxCount: 8,
      inclusionsText: "Park fees",
      exclusionsText: "International flights",
    },
  });
  return {
    orgId,
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

async function generateDoc(app: ReturnType<typeof buildServer>, token: string, orgId: string, suffix: string) {
  const created = await createProgramme(app, token, orgId, suffix);
  await addCostSheet(app, token, created.programmeId);
  await labelFinal(app, token, created.programmeId);
  const issued = await app.inject({
    method: "POST",
    url: "/v1/issued-proposals",
    headers: { authorization: `Bearer ${token}` },
    payload: { programmeId: created.programmeId },
  });
  expect(issued.statusCode).toBe(201);
  const doc = await app.inject({
    method: "POST",
    url: "/v1/issued-proposal-documents",
    headers: { authorization: `Bearer ${token}` },
    payload: { issuedProposalId: issued.json().issuedProposal.id },
  });
  expect(doc.statusCode).toBe(201);
  return {
    ...created,
    issued: issued.json().issuedProposal as { id: string; issuedCode: string; programmeId: string },
    document: doc.json().document as { id: string; documentCode: string; artifactSha256: string; storageRef: string },
  };
}

function deliveryPayload(documentId: string, orgId: string, extra: Record<string, unknown> = {}) {
  return {
    issuedClientDocumentId: documentId,
    recipientEmail: "accounts@h203-client.test",
    recipientConfirmed: true,
    relatedOrganizationId: orgId,
    ...extra,
  };
}

type DeliveryRow = Record<string, unknown>;

function mockDeliveryPool(options?: { failAfterAttemptInsert?: boolean }) {
  const deliveries: DeliveryRow[] = [];
  const attempts: DeliveryRow[] = [];
  let snapshotD: DeliveryRow[] | null = null;
  let snapshotA: DeliveryRow[] | null = null;
  const query = async (text: string, params: unknown[] = []) => {
    const q = text.replace(/\s+/g, " ");
    if (text === "BEGIN") {
      snapshotD = deliveries.map((row) => ({ ...row }));
      snapshotA = attempts.map((row) => ({ ...row }));
      return { rows: [], rowCount: 0 };
    }
    if (text === "COMMIT") {
      snapshotD = null;
      snapshotA = null;
      return { rows: [], rowCount: 0 };
    }
    if (text === "ROLLBACK") {
      if (snapshotD) deliveries.splice(0, deliveries.length, ...snapshotD);
      if (snapshotA) attempts.splice(0, attempts.length, ...snapshotA);
      snapshotD = null;
      snapshotA = null;
      return { rows: [], rowCount: 0 };
    }
    if (/UPDATE\s+issued_client_document_deliver/i.test(text) || /DELETE\s+FROM\s+issued_client_document_deliver/i.test(text)) {
      throw new Error("issued_client_document_deliveries are insert-only");
    }
    if (q.includes("INSERT INTO issued_client_document_deliveries")) {
      deliveries.push({
        id: params[0],
        tenant_id: params[1],
        delivery_code: params[2],
        kind: params[3],
        issued_client_document_id: params[4],
        document_code: params[5],
        issued_proposal_id: params[6],
        issued_code: params[7],
        programme_id: params[8],
        related_organization_id: params[9],
        recipient_email: params[10],
        recipient_confirmed: params[11],
        sender_key: params[12],
        sender_organization_name: params[13],
        sender_address: params[14],
        sender_mode: params[15],
        authorization_principal_id: params[16],
        authorization_authority: params[17],
        authorized_at: params[18],
        content_sha256: params[19],
        artifact_sha256: params[20],
        idempotency_key: params[21],
        template_version: params[22],
        authorize_superseded_document: params[23],
        state: params[24],
        immutable: params[25],
        created_at: params[26],
      });
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("INSERT INTO issued_client_document_delivery_attempts")) {
      if (options?.failAfterAttemptInsert) throw new Error("forced_delivery_attempt_persist_failure");
      attempts.push({
        id: params[0],
        tenant_id: params[1],
        attempt_code: params[2],
        kind: params[3],
        delivery_id: params[4],
        delivery_code: params[5],
        issued_client_document_id: params[6],
        issued_proposal_id: params[7],
        recipient_email: params[8],
        content_sha256: params[9],
        artifact_sha256: params[10],
        attempt_number: params[11],
        requested_at: params[12],
        result: params[13],
        recipient_delivered: params[14],
        failure_reason: params[15],
        provider_name: params[16],
        provider_reference: params[17],
        actor_principal_id: params[18],
        immutable: params[19],
        created_at: params[20],
      });
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("FROM issued_client_document_deliveries") && q.includes("idempotency_key")) {
      const row = deliveries.find((r) => r.tenant_id === params[0] && r.idempotency_key === params[1]);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM issued_client_document_deliveries") && q.includes("recipient_email")) {
      const row = deliveries.find(
        (r) => r.tenant_id === params[0] && r.issued_client_document_id === params[1] && r.recipient_email === params[2],
      );
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM issued_client_document_deliveries") && q.includes("id = $1")) {
      const row = deliveries.find((r) => r.id === params[0] && r.tenant_id === params[1]);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM issued_client_document_deliveries")) {
      return { rows: deliveries.filter((r) => r.tenant_id === params[0]), rowCount: deliveries.length };
    }
    if (q.includes("COALESCE(MAX(attempt_number)")) {
      const max = attempts
        .filter((r) => r.tenant_id === params[0] && r.delivery_id === params[1])
        .reduce((acc, r) => Math.max(acc, Number(r.attempt_number) || 0), 0);
      return { rows: [{ c: max }], rowCount: 1 };
    }
    if (q.includes("FROM issued_client_document_delivery_attempts")) {
      const rows = attempts.filter((r) => r.tenant_id === params[0] && r.delivery_id === params[1]);
      return { rows, rowCount: rows.length };
    }
    if (q.includes("INSERT INTO audit_events") || q.includes("FROM audit_events")) {
      return { rows: [], rowCount: 0 };
    }
    return { rows: [], rowCount: 0 };
  };
  const client = { query, release() {} };
  return {
    deliveries,
    attempts,
    pool: { connect: async () => client, query } as unknown as DbPool,
  };
}

describe("H-203 client document delivery foundation (Dev/Test mock only)", () => {
  it("records the delivery increment, migration 130, and production flags closed", () => {
    expect(existsSync(artefact)).toBe(true);
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/130_h203_issued_client_document_delivery.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
    expect(ISSUED_PROPOSAL_DELIVERY).toEqual({
      implemented: false,
      pdf: false,
      email: false,
      dispatch: false,
      clientAccess: false,
    });
    expect(ISSUED_CLIENT_DOCUMENT_DELIVERY.realEmail).toBe(false);
    expect(ISSUED_CLIENT_DOCUMENT_DELIVERY.production).toBe(false);
    expect([...RFP_WORKFLOW_STAGES].includes("delivered" as never)).toBe(false);
    for (const route of unauthorizedIssuedClientDocumentDeliveryRoutes()) {
      expect(route.startsWith("/v1/client") || route.startsWith("/v1/public") || route.startsWith("/portal") || route.includes("download") || route.includes("pdf")).toBe(
        true,
      );
    }
  });

  it("authorizes a queued DEL and mock-accepts a DLA without claiming mailbox delivery", async () => {
    const store = seedStore("h203-del-ok");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, token);
    const seeded = await generateDoc(app, token, orgId, "ok");

    const unauthorized = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      payload: deliveryPayload(seeded.document.id, orgId),
    });
    expect(unauthorized.statusCode).toBe(401);
    expect(JSON.stringify(unauthorized.json())).not.toContain(seeded.document.id);

    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const forbidden = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${alice}` },
      payload: deliveryPayload(seeded.document.id, orgId, { execute: true }),
    });
    expect(forbidden.statusCode).toBe(403);
    expect(JSON.stringify(forbidden.json())).not.toContain("accounts@h203-client.test");

    const invalid = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId, { recipientEmail: "not-an-email" }),
    });
    expect(invalid.statusCode).toBe(400);

    const unrelated = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, randomUUID()),
    });
    expect(unrelated.statusCode).toBe(400);
    expect(unrelated.json().reason).toBe("recipient_unrelated");

    const internal = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId, { recipientEmail: "carol.admin@sedmc.local" }),
    });
    expect(internal.statusCode).toBe(400);

    const queued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId),
    });
    expect(queued.statusCode).toBe(201);
    expect(queued.json().delivery.deliveryCode.startsWith("DEL-")).toBe(true);
    expect(queued.json().delivery.state).toBe("queued");
    expect(queued.json().delivery.sender.address).toBe("noreply@sedmc.invalid");

    const replay = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId),
    });
    expect(replay.statusCode).toBe(201);
    expect(replay.json().delivery.id).toBe(queued.json().delivery.id);

    const app2 = buildServer({ store });
    const token2 = await login(app2, "carol.admin@sedmc.local", P.carolPassword);
    const afterRestart = await app2.inject({
      method: "GET",
      url: `/v1/issued-proposal-document-deliveries/${queued.json().delivery.id}`,
      headers: { authorization: `Bearer ${token2}` },
    });
    expect(afterRestart.statusCode).toBe(200);
    expect(afterRestart.json().delivery.state).toBe("queued");

    const attempted = await app2.inject({
      method: "POST",
      url: `/v1/issued-proposal-document-deliveries/${queued.json().delivery.id}/attempts`,
      headers: { authorization: `Bearer ${token2}` },
    });
    expect(attempted.statusCode).toBe(201);
    expect(attempted.json().delivery.state).toBe("accepted_by_provider");
    expect(attempted.json().attempts[0].attemptCode.startsWith("DLA-")).toBe(true);
    expect(attempted.json().attempts[0].recipientDelivered).toBe(false);
    expect(attempted.json().deliveryFlags.email).toBe(false);

    const partner = await login(app2, "partner@external.local", P.partnerPassword, "partner-demo");
    const tenantDenied = await app2.inject({
      method: "GET",
      url: `/v1/issued-proposal-document-deliveries/${queued.json().delivery.id}`,
      headers: { authorization: `Bearer ${partner}` },
    });
    expect(tenantDenied.statusCode).toBe(403);
    expect(JSON.stringify(tenantDenied.json())).not.toContain(queued.json().delivery.deliveryCode);

    const clientRoute = await app2.inject({
      method: "GET",
      url: `/v1/client/issued-proposal-document-deliveries/${queued.json().delivery.id}`,
      headers: { authorization: `Bearer ${token2}` },
    });
    expect(clientRoute.statusCode).toBe(404);
  });

  it("rejects missing DOC, hash mismatch, provider failure, recipient change, and S2 supersession", async () => {
    const store = seedStore("h203-del-fail");
    const root = tempStorage(store);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, token);
    const seeded = await generateDoc(app, token, orgId, "fail");

    const missing = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(randomUUID(), orgId),
    });
    expect(missing.statusCode).toBe(404);

    writeFileSync(join(root, seeded.document.storageRef), Buffer.from("%PDF-1.4 tampered-hash"));
    const mismatch = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId),
    });
    expect(mismatch.statusCode).toBe(400);
    expect(mismatch.json().reason).toBe("artifact_hash_mismatch");

    const store2 = seedStore("h203-del-fail2");
    tempStorage(store2);
    const appB = buildServer({ store: store2 });
    const tokenB = await login(appB, "carol.admin@sedmc.local", P.carolPassword);
    const orgB = await seedOrg(appB, tokenB);
    const seededB = await generateDoc(appB, tokenB, orgB, "fail2");
    store2.devTestDocumentDeliveryProvider = createDevTestMockDeliveryProvider("reject");
    const rejected = await appB.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${tokenB}` },
      payload: deliveryPayload(seededB.document.id, orgB, { execute: true }),
    });
    expect(rejected.statusCode).toBe(201);
    expect(rejected.json().delivery.state).toBe("failed");
    expect(rejected.json().attempts[0].recipientDelivered).toBe(false);

    const changedRecipient = await appB.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${tokenB}` },
      payload: deliveryPayload(seededB.document.id, orgB, { recipientEmail: "other@h203-client.test" }),
    });
    expect(changedRecipient.statusCode).toBe(201);
    expect(changedRecipient.json().delivery.id).not.toBe(rejected.json().delivery.id);

    const laterIss = await appB.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${tokenB}` },
      payload: { programmeId: seededB.issued.programmeId },
    });
    expect(laterIss.statusCode).toBe(201);
    const stale = await appB.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${tokenB}` },
      payload: deliveryPayload(seededB.document.id, orgB, { recipientEmail: "stale@h203-client.test" }),
    });
    expect(stale.statusCode).toBe(400);
    expect(stale.json().reason).toBe("issued_proposal_superseded");
  });

  it("does not record accepted DLA when attempt persistence fails", async () => {
    const store = seedStore("h203-del-tx");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, token);
    const seeded = await generateDoc(app, token, orgId, "tx");
    const queued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-document-deliveries",
      headers: { authorization: `Bearer ${token}` },
      payload: deliveryPayload(seeded.document.id, orgId),
    });
    expect(queued.statusCode).toBe(201);
    const mocked = mockDeliveryPool({ failAfterAttemptInsert: true });
    store.dbPool = mocked.pool;
    const before = store.issuedClientDocumentDeliveryAttempts.length;
    const failed = await app.inject({
      method: "POST",
      url: `/v1/issued-proposal-document-deliveries/${queued.json().delivery.id}/attempts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(failed.statusCode).toBeGreaterThanOrEqual(500);
    expect(store.issuedClientDocumentDeliveryAttempts.length).toBe(before);
  });
});
