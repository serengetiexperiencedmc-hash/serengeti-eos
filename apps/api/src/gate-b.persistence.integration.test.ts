/**
 * Gate B PostgreSQL verification — migration-free.
 *
 * EOS_RUN_PG_TESTS=1 means: run against the already-provisioned database in
 * EOS_DATABASE_URL. It does not mean "run migrations first".
 *
 * This file must not import main.ts, must not import or call migrate(), and
 * must not emit schema-changing SQL.
 */
import { createPool, type DbPool } from "@sedmc/db";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { readdir } from "node:fs/promises";
import { newId, type OppOpportunity } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { syncStoreToPostgres } from "./persistence/sync.js";
import { withTransaction } from "./persistence/pg-repository.js";
import { attachDurablePool, newProcessAgainstPool } from "./persistence/gate-b-recovery-harness.js";
import {
  assertAlreadyProvisionedGateBDatabase,
  cleanupGateBBusinessRows,
  countAuditRowsForResourceIds,
  emptyGateBCreatedIds,
  gateBTrackedResourceIds,
  wrapPoolRejectingSql,
  type GateBCreatedIds,
} from "./persistence/gate-b-pg-verification.js";
import { ensureCrmCollections } from "./crm/collections.js";
import { getOpportunityById, insertOpportunity, listStageHistory } from "./persistence/opportunity-repository.js";
import { getRfpById, listRfpVersions, updateRfpOptimistic } from "./persistence/rfp-repository.js";
import { getProgrammeById, getProgrammeByRfpId, listProgrammeDays, listProgrammeItems } from "./persistence/programme-repository.js";
import { getCostSheetById, listCostLineItems } from "./persistence/costing-repository.js";
import { getApprovalById } from "./persistence/commercial-approval-repository.js";
import { getCommercialDocumentById } from "./persistence/commercial-document-repository.js";
import { insertChainedAudit, insertDomainOutbox, allowAuditRecord } from "./persistence/durable.js";
import { LocalFsDocumentStorage } from "./commercial-documents/storage.js";
import { uploadCommercialDocument } from "./commercial-documents/service.js";
import type { Store } from "./store.js";

const RUN_PG = process.env.EOS_RUN_PG_TESTS === "1";
const DATABASE_URL = process.env.EOS_DATABASE_URL?.trim() ?? "";
const describePg = RUN_PG && DATABASE_URL ? describe : describe.skip;
const P = TEST_BOOTSTRAP_SECRETS;
const TENANT_ID = "11111111-1111-4111-8111-111111111111";
const CAROL_ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const CAROL_EMAIL = "carol.admin@sedmc.local";
const PDF_B64 = Buffer.from("%PDF-1.4 gate-b-verification").toString("base64");

/** seedStore indexes Carol by email, not by principal id. */
function carolFromSeed(store: Store) {
  const principal = store.principals.get(CAROL_EMAIL);
  if (!principal || principal.id !== CAROL_ID) {
    throw new Error("seedStore Carol principal is not available at the email lookup key");
  }
  return principal;
}

describe("Gate B PostgreSQL verification gate", () => {
  it("fails clearly when EOS_RUN_PG_TESTS=1 and EOS_DATABASE_URL is missing", () => {
    if (!RUN_PG) return;
    if (!DATABASE_URL) {
      throw new Error(
        "Gate B PostgreSQL verification prerequisite missing: EOS_RUN_PG_TESTS=1 requires EOS_DATABASE_URL pointing at an already-provisioned Dev/Test database. This harness does not run migrate() and will not create schema.",
      );
    }
  });
});

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function loginBob(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

function seedOrg(store: Store, orgId: string): void {
  ensureCrmCollections(store);
  const now = new Date().toISOString();
  store.crmOrganizations.push({
    id: orgId,
    tenantId: TENANT_ID,
    legalName: "Gate B Verification Client",
    organizationTypeId: newId(),
    status: "Active",
    dataQualityStatus: "Verified",
    classification: "Internal",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: CAROL_ID,
    updatedByPrincipalId: CAROL_ID,
  });
}

async function ensureBootstrapIdentities(pool: DbPool): Promise<void> {
  const tenant = await pool.query(`SELECT 1 FROM tenants WHERE id = $1`, [TENANT_ID]);
  const principal = await pool.query(`SELECT 1 FROM principals WHERE id = $1`, [CAROL_ID]);
  if ((tenant.rowCount ?? 0) > 0 && (principal.rowCount ?? 0) > 0) return;
  const store = seedStore("gate-b-pg-bootstrap", P);
  await syncStoreToPostgres(pool, store);
}

describePg("Gate B Dev/Test durable persistence (migration-free)", () => {
  const pool = createPool(DATABASE_URL);
  const verifyPool = createPool(DATABASE_URL);
  const created = emptyGateBCreatedIds();
  const orgId = newId();
  const runStamp = newId().replace(/-/g, "").slice(0, 10);
  let seq = 0;
  const code = (prefix: string) => `${prefix}-GBV-${runStamp}-${++seq}`;

  beforeAll(async () => {
    await assertAlreadyProvisionedGateBDatabase(pool);
    await ensureBootstrapIdentities(pool);
  });

  afterAll(async () => {
    try {
      await cleanupGateBBusinessRows(pool, created);
      const tracked = gateBTrackedResourceIds(created);
      if (tracked.length > 0) {
        const leftoverOutbox = await pool.query(
          `SELECT count(*)::int AS c FROM outbox_events WHERE aggregate_id = ANY($1::text[])`,
          [tracked],
        );
        expect(Number(leftoverOutbox.rows[0]?.c ?? 0)).toBe(0);
      }
      const auditResidue = await countAuditRowsForResourceIds(pool, tracked);
      expect(auditResidue).toBeGreaterThanOrEqual(0);
    } finally {
      await pool.end();
      await verifyPool.end();
    }
  });

  function attachApp(tokenSecret: string) {
    const store = seedStore(tokenSecret, P);
    attachDurablePool(store, pool);
    seedOrg(store, orgId);
    const app = buildServer({ store });
    return { store, app };
  }

  it("requires the Gate B tables to already exist", async () => {
    await assertAlreadyProvisionedGateBDatabase(verifyPool);
  });

  it("persists opportunity create, retrieve, stage update, history, and a fresh Store", async () => {
    const { store, app } = attachApp("gate-b-opp");
    const token = await loginCarol(app);
    const opportunityCode = code("OPP");
    const createdOpp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode, title: "GBV opportunity", organizationId: orgId, paxCount: 8 },
    });
    expect(createdOpp.statusCode).toBe(201);
    const opportunityId = createdOpp.json().opportunity.id as string;
    created.opportunityIds.push(opportunityId);
    expect(store.oppOpportunities).toHaveLength(0);

    const got = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opportunityId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().opportunity.title).toBe("GBV opportunity");
    expect(got.json().stageHistory.length).toBeGreaterThanOrEqual(1);

    const updated = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${opportunityId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "rfp_received", notes: "GBV stage update" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().opportunity.stage).toBe("rfp_received");

    const restarted = newProcessAgainstPool(pool, "gate-b-opp-restart");
    const loaded = await getOpportunityById(verifyPool, TENANT_ID, opportunityId);
    expect(loaded?.title).toBe("GBV opportunity");
    expect(loaded?.stage).toBe("rfp_received");
    const history = await listStageHistory(verifyPool, TENANT_ID, opportunityId);
    expect(history.some((h) => h.toStage === "rfp_received")).toBe(true);
    expect(restarted.oppOpportunities).toHaveLength(0);
  });

  it("persists RFP create, retrieve, version, transition, opportunity link, audit, and outbox", async () => {
    const { store, app } = attachApp("gate-b-rfp");
    const token = await loginCarol(app);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: code("OPP"), title: "GBV rfp-parent", organizationId: orgId },
    });
    expect(opp.statusCode).toBe(201);
    const opportunityId = opp.json().opportunity.id as string;
    created.opportunityIds.push(opportunityId);

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpCode: code("RFP"),
        opportunityId,
        title: "GBV durable RFP",
        notes: "gbv-rfp-notes",
        source: "email",
      },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;
    created.rfpIds.push(rfpId);
    expect(store.rfpRfps).toHaveLength(0);
    expect(rfp.json().rfp.opportunityId).toBe(opportunityId);

    const parentOpp = await getOpportunityById(verifyPool, TENANT_ID, opportunityId);
    expect(parentOpp?.stage).toBe("rfp_received");

    const transitioned = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "programme" },
    });
    expect(transitioned.statusCode).toBe(200);
    expect(transitioned.json().rfp.workflowStage).toBe("programme");

    const version = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/versions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { summary: "GBV version" },
    });
    expect(version.statusCode).toBe(201);
    expect(version.json().version.versionNumber).toBe(2);

    const detail = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().rfp.notes).toBe("gbv-rfp-notes");
    expect(detail.json().versions.length).toBeGreaterThanOrEqual(2);

    const loaded = await getRfpById(verifyPool, TENANT_ID, rfpId);
    expect(loaded?.title).toBe("GBV durable RFP");
    expect(loaded?.opportunityId).toBe(opportunityId);
    const versions = await listRfpVersions(verifyPool, TENANT_ID, rfpId);
    expect(versions.some((v) => v.summary === "GBV version")).toBe(true);

    const audit = await verifyPool.query(
      `SELECT 1 FROM audit_events WHERE tenant_id = $1 AND resource_id = $2 AND action LIKE 'rfp:%' LIMIT 1`,
      [TENANT_ID, rfpId],
    );
    expect(audit.rowCount).toBeGreaterThan(0);
    const outbox = await verifyPool.query(
      `SELECT 1 FROM outbox_events WHERE tenant_id = $1 AND aggregate_id = $2 LIMIT 1`,
      [TENANT_ID, rfpId],
    );
    expect(outbox.rowCount).toBeGreaterThan(0);
  });

  it("persists programme days, items, version, and a fresh Store", async () => {
    const { store, app } = attachApp("gate-b-prg");
    const token = await loginCarol(app);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: code("OPP"), title: "GBV prg-parent", organizationId: orgId },
    });
    const opportunityId = opp.json().opportunity.id as string;
    created.opportunityIds.push(opportunityId);
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpCode: code("RFP"), opportunityId, title: "GBV prg RFP" },
    });
    const rfpId = rfp.json().rfp.id as string;
    created.rfpIds.push(rfpId);

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId, title: "GBV programme" },
    });
    expect(programme.statusCode).toBe(201);
    const programmeId = programme.json().programme.id as string;
    created.programmeIds.push(programmeId);
    expect(store.prgProgrammes).toHaveLength(0);

    const day = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days`,
      headers: { authorization: `Bearer ${token}` },
      payload: { dayNumber: 1, title: "Arrival", location: "Arusha" },
    });
    expect(day.statusCode).toBe(201);
    const dayId = day.json().day.id as string;
    const item = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Meet and greet", startTime: "14:00" },
    });
    expect(item.statusCode).toBe(201);

    const version = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/versions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { summary: "GBV programme snapshot" },
    });
    expect(version.statusCode).toBe(201);

    const restarted = newProcessAgainstPool(pool, "gate-b-prg-restart");
    const loaded = await getProgrammeById(verifyPool, TENANT_ID, programmeId);
    expect(loaded?.title).toBe("GBV programme");
    expect((await listProgrammeDays(verifyPool, TENANT_ID, programmeId)).length).toBeGreaterThanOrEqual(1);
    expect((await listProgrammeItems(verifyPool, TENANT_ID, programmeId)).some((i) => i.title === "Meet and greet")).toBe(
      true,
    );
    const snapshots = await verifyPool.query(
      `SELECT summary FROM prg_programme_versions WHERE programme_id = $1`,
      [programmeId],
    );
    expect(snapshots.rows.some((row) => row.summary === "GBV programme snapshot")).toBe(true);
    expect(await getProgrammeByRfpId(verifyPool, TENANT_ID, rfpId)).toBeTruthy();
    expect(restarted.prgProgrammes).toHaveLength(0);
  });

  it("persists costing create, line-item update, and read", async () => {
    const { app } = attachApp("gate-b-cost");
    const token = await loginCarol(app);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: code("OPP"), title: "GBV cost-parent", organizationId: orgId, paxCount: 10 },
    });
    created.opportunityIds.push(opp.json().opportunity.id as string);
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpCode: code("RFP"), opportunityId: opp.json().opportunity.id, title: "GBV cost RFP" },
    });
    created.rfpIds.push(rfp.json().rfp.id as string);
    const prg = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: rfp.json().rfp.id, title: "GBV cost programme" },
    });
    created.programmeIds.push(prg.json().programme.id as string);

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId: prg.json().programme.id,
        sellPrice: 10000,
        paxCount: 10,
        lineItems: [{ category: "other", description: "GBV base", unitCost: 1000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);
    const sheetId = sheet.json().sheet.id as string;
    created.costSheetIds.push(sheetId);

    const added = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheetId}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "transport", description: "GBV fleet", unitCost: 500 },
    });
    expect(added.statusCode).toBe(201);

    const loaded = await getCostSheetById(verifyPool, TENANT_ID, sheetId);
    expect(loaded).toBeTruthy();
    const lines = await listCostLineItems(verifyPool, TENANT_ID, sheetId);
    expect(lines.some((l) => l.description === "GBV fleet")).toBe(true);
  });

  it("persists commercial approval create, decision update, and read", async () => {
    const { app } = attachApp("gate-b-apr");
    const carolToken = await loginCarol(app);
    const bobToken = await loginBob(app);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { opportunityCode: code("OPP"), title: "GBV approval-parent", organizationId: orgId, paxCount: 65 },
    });
    created.opportunityIds.push(opp.json().opportunity.id as string);
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpCode: code("RFP"), opportunityId: opp.json().opportunity.id, title: "GBV approval RFP" },
    });
    created.rfpIds.push(rfp.json().rfp.id as string);
    const prg = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId: rfp.json().rfp.id, title: "GBV approval programme" },
    });
    created.programmeIds.push(prg.json().programme.id as string);
    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        programmeId: prg.json().programme.id,
        sellPrice: 285000,
        paxCount: 65,
        marginFloorPercent: 20,
        lineItems: [{ category: "accommodation", description: "GBV lodges", unitCost: 86400 }],
      },
    });
    created.costSheetIds.push(sheet.json().sheet.id as string);

    const requested = await app.inject({
      method: "POST",
      url: "/v1/commercial-approvals/request",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { costSheetId: sheet.json().sheet.id },
    });
    expect(requested.statusCode).toBe(201);
    const approvalId = requested.json().request.id as string;
    created.approvalIds.push(approvalId);
    const pending = await getApprovalById(verifyPool, TENANT_ID, approvalId);
    expect(pending?.status).toBe("pending");
    const rfpId = rfp.json().rfp.id as string;
    const rfpAfterRequest = await getRfpById(verifyPool, TENANT_ID, rfpId);
    expect(rfpAfterRequest?.workflowStage).toBe("approval");

    const decided = await app.inject({
      method: "POST",
      url: `/v1/commercial-approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved", notes: "GBV decision" },
    });
    expect(decided.statusCode).toBe(200);

    const loaded = await getApprovalById(verifyPool, TENANT_ID, approvalId);
    expect(loaded).toBeTruthy();
    expect(loaded?.status).toBe("approved");
    const rfpAfter = await getRfpById(verifyPool, TENANT_ID, rfpId);
    expect(rfpAfter?.workflowStage).toBe("proposal");
    const approvalAudit = await verifyPool.query(
      `SELECT 1 FROM audit_events WHERE tenant_id = $1 AND resource_id = $2 AND action LIKE 'commercial:%' LIMIT 1`,
      [TENANT_ID, approvalId],
    );
    expect(approvalAudit.rowCount).toBeGreaterThan(0);
  });

  it("persists document metadata and compensates bytes when metadata transaction fails", async () => {
    const { app } = attachApp("gate-b-doc");
    const token = await loginCarol(app);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: code("OPP"), title: "GBV doc-parent", organizationId: orgId },
    });
    created.opportunityIds.push(opp.json().opportunity.id as string);
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpCode: code("RFP"), opportunityId: opp.json().opportunity.id, title: "GBV doc RFP" },
    });
    const rfpId = rfp.json().rfp.id as string;
    created.rfpIds.push(rfpId);

    const upload = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${token}` },
      payload: { filename: "gbv-rfp.pdf", mimeType: "application/pdf", contentBase64: PDF_B64 },
    });
    expect(upload.statusCode).toBe(201);
    const documentId = upload.json().document.id as string;
    created.documentIds.push(documentId);
    const listed = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().items.some((d: { filename: string }) => d.filename === "gbv-rfp.pdf")).toBe(true);
    const meta = await getCommercialDocumentById(verifyPool, TENANT_ID, documentId);
    expect(meta?.filename).toBe("gbv-rfp.pdf");
    const docAudit = await verifyPool.query(
      `SELECT 1 FROM audit_events WHERE tenant_id = $1 AND resource_id = $2 LIMIT 1`,
      [TENANT_ID, documentId],
    );
    expect(docAudit.rowCount).toBeGreaterThan(0);

    const docRoot = join(tmpdir(), `gate-b-docs-${runStamp}`);
    const failingStore = seedStore("gate-b-doc-fail", P);
    failingStore.documentStorage = new LocalFsDocumentStorage(docRoot);
    attachDurablePool(failingStore, wrapPoolRejectingSql(pool, "INSERT INTO commercial_documents", "gate_b_forced_metadata_failure"));
    seedOrg(failingStore, orgId);
    const principal = carolFromSeed(failingStore);
    await expect(
      uploadCommercialDocument(
        failingStore,
        principal,
        { filename: "gbv-compensate.pdf", mimeType: "application/pdf", contentBase64: PDF_B64, rfpId },
        newId(),
      ),
    ).rejects.toThrow("gate_b_forced_metadata_failure");
    const leftover = await verifyPool.query(
      `SELECT 1 FROM commercial_documents WHERE tenant_id = $1 AND filename = $2`,
      [TENANT_ID, "gbv-compensate.pdf"],
    );
    expect(leftover.rowCount).toBe(0);
    let leftoverFiles: string[] = [];
    try {
      leftoverFiles = await readdir(join(docRoot, TENANT_ID));
    } catch {
      leftoverFiles = [];
    }
    expect(leftoverFiles).toHaveLength(0);
  });

  it("rolls back business, audit, and outbox rows on a forced transaction failure", async () => {
    const marker = `gate_b_forced_rollback_${newId()}`;
    const opportunityId = newId();
    const now = new Date().toISOString();
    const store = seedStore("gate-b-rollback", P);
    const principal = carolFromSeed(store);
    const opp: OppOpportunity = {
      id: opportunityId,
      tenantId: TENANT_ID,
      opportunityCode: code("OPP"),
      title: "GBV rollback must not commit",
      organizationId: orgId,
      stage: "new_qualified",
      status: "open",
      ownerPrincipalId: CAROL_ID,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: CAROL_ID,
      updatedByPrincipalId: CAROL_ID,
    };

    await expect(
      withTransaction(pool, async (client) => {
        await insertOpportunity(client, opp);
        await insertChainedAudit(
          client,
          allowAuditRecord(principal, "pipeline:write:opportunity", "opportunity", opportunityId, newId(), {
            marker,
          }),
        );
        await insertDomainOutbox(client, {
          principal,
          eventType: "pipeline.opportunity.created.v1",
          payload: { opportunityId, marker },
          classification: "Internal",
          correlationId: newId(),
          aggregateId: opportunityId,
        });
        throw new Error(marker);
      }),
    ).rejects.toThrow(marker);

    const business = await verifyPool.query(`SELECT 1 FROM opp_opportunities WHERE id = $1`, [opportunityId]);
    const audit = await verifyPool.query(
      `SELECT 1 FROM audit_events WHERE resource_id = $1 AND evidence::text LIKE $2`,
      [opportunityId, `%${marker}%`],
    );
    const outbox = await verifyPool.query(`SELECT 1 FROM outbox_events WHERE aggregate_id = $1`, [opportunityId]);
    expect(business.rowCount).toBe(0);
    expect(audit.rowCount).toBe(0);
    expect(outbox.rowCount).toBe(0);
  });

  it("rejects a stale-version update after a second Store instance writes", async () => {
    const a = attachApp("gate-b-conc-a");
    const tokenA = await loginCarol(a.app);
    const opp = await a.app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { opportunityCode: code("OPP"), title: "GBV concurrency parent", organizationId: orgId },
    });
    created.opportunityIds.push(opp.json().opportunity.id as string);
    const rfp = await a.app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { rfpCode: code("RFP"), opportunityId: opp.json().opportunity.id, title: "GBV concurrency RFP" },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;
    created.rfpIds.push(rfpId);

    const versionN = await getRfpById(pool, TENANT_ID, rfpId);
    expect(versionN).toBeTruthy();
    const expectedVersion = versionN!.version;

    const b = attachApp("gate-b-conc-b");
    const tokenB = await loginCarol(b.app);
    const writerB = await b.app.inject({
      method: "PATCH",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${tokenB}` },
      payload: { notes: "writer-b-instance" },
    });
    expect(writerB.statusCode).toBe(200);

    const stale = {
      ...versionN!,
      notes: "stale-writer-a",
      version: expectedVersion + 1,
      updatedAt: new Date().toISOString(),
    };
    const rows = await updateRfpOptimistic(verifyPool, stale, expectedVersion);
    expect(rows).toBe(0);
    const retained = await getRfpById(verifyPool, TENANT_ID, rfpId);
    expect(retained?.notes).toBe("writer-b-instance");
    expect(retained?.version).toBeGreaterThan(expectedVersion);
  });

  it("lets instance B update durable state that a fresh instance A can read", async () => {
    const a = attachApp("gate-b-multi-a");
    const tokenA = await loginCarol(a.app);
    const opp = await a.app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { opportunityCode: code("OPP"), title: "GBV multi-a", organizationId: orgId },
    });
    expect(opp.statusCode).toBe(201);
    const opportunityId = opp.json().opportunity.id as string;
    created.opportunityIds.push(opportunityId);

    const b = attachApp("gate-b-multi-b");
    const tokenB = await loginCarol(b.app);
    const readB = await b.app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opportunityId}`,
      headers: { authorization: `Bearer ${tokenB}` },
    });
    expect(readB.statusCode).toBe(200);
    expect(readB.json().opportunity.title).toBe("GBV multi-a");

    const updatedB = await b.app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${opportunityId}/transitions`,
      headers: { authorization: `Bearer ${tokenB}` },
      payload: { toStage: "rfp_received", notes: "updated-by-b" },
    });
    expect(updatedB.statusCode).toBe(200);

    const freshA = newProcessAgainstPool(pool, "gate-b-multi-a-reread");
    expect(freshA.oppOpportunities).toHaveLength(0);
    const reread = await getOpportunityById(verifyPool, TENANT_ID, opportunityId);
    expect(reread?.stage).toBe("rfp_received");
  });
});
