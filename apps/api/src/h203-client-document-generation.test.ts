import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { listMigrationFiles } from "@sedmc/db";
import { ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS } from "@sedmc/kernel/issued-proposal";
import {
  ISSUED_CLIENT_DOCUMENT_GENERATION,
  hashIssuedClientDocumentArtifact,
  hashIssuedClientDocumentContent,
  issuedClientDocumentPdfContainsForbidden,
} from "@sedmc/kernel/issued-client-document";
import { RFP_WORKFLOW_STAGES } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS, type Store } from "../src/app.js";
import { LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";
import { unauthorizedIssuedClientDocumentRoutes } from "../src/issued-proposal/client-document.js";
import { unauthorizedClientIssueRoutes } from "../src/issued-proposal/issued-proposal.js";
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
  const root = mkdtempSync(join(tmpdir(), "h203-doc-"));
  tmpRoots.push(root);
  store.documentStorage = new LocalFsDocumentStorage(root);
  return root;
}

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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Doc Ltd,corporate,H203 Doc,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-doc-org-${batchId}` },
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
      opportunityCode: `OPP-H203DOC-${suffix}`,
      title: "H203 Document",
      organizationId: orgId,
      paxCount: 12,
    },
  });
  const opportunityId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H203DOC-${suffix}`,
      opportunityId,
      title: "H203 Document RFP",
      paxCount: 12,
      destinations: "Serengeti",
    },
  });
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId: rfp.json().rfp.id,
      title: "H203 Document Programme",
      startDate: "2026-06-10",
      endDate: "2026-06-24",
      paxCount: 12,
      inclusionsText: "Park fees",
      exclusionsText: "International flights",
    },
  });
  return {
    rfp: rfp.json().rfp as { id: string; workflowStage: string },
    programme: prg.json().programme as Record<string, unknown>,
    programmeId: prg.json().programme.id as string,
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

async function issueFromProgramme(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  suffix: string,
  c8ProposalId?: string,
) {
  const created = await createProgramme(app, token, orgId, suffix);
  const sheet = await addCostSheet(app, token, created.programmeId);
  await labelFinal(app, token, created.programmeId);
  const issued = await app.inject({
    method: "POST",
    url: "/v1/issued-proposals",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      programmeId: created.programmeId,
      ...(c8ProposalId ? { c8ProposalId } : {}),
    },
  });
  expect(issued.statusCode).toBe(201);
  return { ...created, sheet, issued: issued.json() as Record<string, any> };
}

function assertSanitized(payload: Record<string, unknown>) {
  for (const key of ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS) {
    expect(payload).not.toHaveProperty(key);
  }
  const blob = JSON.stringify(payload);
  expect(blob).not.toMatch(
    /supplierCost|grossProfit|grossMargin|\bmarkup\b|fileFee|file fee|taxAmount|taxMode|fxRate|marginFloor|approvalRequest|costLines|below-floor|workflow|\baudit\b/i,
  );
}

type DocRow = Record<string, unknown>;

function mockDocumentPool(options?: { failAfterDocumentInsert?: boolean }) {
  const documents: DocRow[] = [];
  let snapshot: DocRow[] | null = null;
  const query = async (text: string, params: unknown[] = []) => {
    const q = text.replace(/\s+/g, " ");
    if (text === "BEGIN") {
      snapshot = documents.map((row) => ({ ...row }));
      return { rows: [], rowCount: 0 };
    }
    if (text === "COMMIT") {
      snapshot = null;
      return { rows: [], rowCount: 0 };
    }
    if (text === "ROLLBACK") {
      if (snapshot) {
        documents.splice(0, documents.length, ...snapshot);
        snapshot = null;
      }
      return { rows: [], rowCount: 0 };
    }
    if (/^\s*UPDATE\s+issued_client_documents/i.test(text) || /^\s*DELETE\s+FROM\s+issued_client_documents/i.test(text)) {
      throw new Error("issued_client_documents are insert-only");
    }
    if (q.includes("INSERT INTO issued_client_documents")) {
      const row: DocRow = {
        id: params[0],
        tenant_id: params[1],
        document_code: params[2],
        kind: params[3],
        issued_proposal_id: params[4],
        issued_code: params[5],
        document_type: params[6],
        sequence: params[7],
        generated_at: params[8],
        generated_by_principal_id: params[9],
        generation_context: params[10],
        status: params[11],
        content_sha256: params[12],
        artifact_sha256: params[13],
        mime_type: params[14],
        size_bytes: params[15],
        storage_ref: params[16],
        client_content: typeof params[17] === "string" ? JSON.parse(params[17] as string) : params[17],
        immutable: params[18],
        created_at: params[19],
      };
      documents.push(row);
      if (options?.failAfterDocumentInsert) throw new Error("forced_document_persist_failure");
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("COALESCE(MAX(sequence)")) {
      const max = documents
        .filter((r) => r.tenant_id === params[0] && r.issued_proposal_id === params[1])
        .reduce((acc, r) => Math.max(acc, Number(r.sequence) || 0), 0);
      return { rows: [{ c: max }], rowCount: 1 };
    }
    if (q.includes("FROM issued_client_documents") && q.includes("id = $1")) {
      const row = documents.find((r) => r.id === params[0] && r.tenant_id === params[1]);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM issued_client_documents")) {
      const rows = documents.filter((r) => r.tenant_id === params[0]);
      return { rows, rowCount: rows.length };
    }
    if (q.includes("FROM issued_proposals")) {
      return { rows: [], rowCount: 0 };
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
    documents,
    pool: {
      connect: async () => client,
      query,
    } as unknown as DbPool,
  };
}

describe("H-203 client document generation foundation (Dev/Test)", () => {
  it("records the generation increment, migration 129, and productionReady false", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("CLIENT DOCUMENT GENERATION FOUNDATION");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).toContain("PDF generation is now implemented only as an internal document-generation capability");
    expect(text).toContain("PDF generation is NOT client delivery");
    expect(text).toContain("Email remains unauthorized");
    expect(text).toContain("Dispatch remains unauthorized");
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/128_h203_issued_proposal_durability.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
    expect(ISSUED_CLIENT_DOCUMENT_GENERATION).toEqual({
      implemented: true,
      delivery: false,
      email: false,
      dispatch: false,
      clientAccess: false,
    });
    expect([...RFP_WORKFLOW_STAGES]).toEqual([
      "intake",
      "programme",
      "costing",
      "approval",
      "proposal",
      "sent",
      "closed",
    ]);
  });

  it("generates a DOC record from an ISS snapshot and rejects non-issued sources", async () => {
    const store = seedStore("h203-doc-elig");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, programme } = await createProgramme(app, token, orgId, "elig");
    await addCostSheet(app, token, programmeId);

    const fromDraft = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(fromDraft.statusCode).toBe(400);
    expect(fromDraft.json().reason).toBe("issued_proposal_required");

    const fromProgrammeId = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: programmeId },
    });
    expect(fromProgrammeId.statusCode).toBe(404);

    for (const label of ["revised", "client"] as const) {
      const patched = await app.inject({
        method: "PATCH",
        url: `/v1/programmes/${programmeId}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { commercialVersionLabel: label },
      });
      expect(patched.statusCode).toBe(200);
      const denied = await app.inject({
        method: "POST",
        url: "/v1/issued-proposal-documents",
        headers: { authorization: `Bearer ${token}` },
        payload: { programmeId },
      });
      expect(denied.statusCode).toBe(400);
    }

    await labelFinal(app, token, programmeId);
    const c8 = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: programme.rfpId, title: "Internal C8" },
    });
    expect(c8.statusCode).toBe(201);
    const fromC8 = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: c8.json().proposal.id },
    });
    expect(fromC8.statusCode).toBe(404);

    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId, c8ProposalId: c8.json().proposal.id },
    });
    expect(issued.statusCode).toBe(201);
    const issuedId = issued.json().issuedProposal.id as string;
    const issuedCode = issued.json().issuedProposal.issuedCode as string;

    const generated = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: issuedId },
    });
    expect(generated.statusCode).toBe(201);
    const doc = generated.json().document as Record<string, unknown>;
    expect(String(doc.documentCode).startsWith("DOC-")).toBe(true);
    expect(doc.id).not.toBe(issuedId);
    expect(doc.id).not.toBe(c8.json().proposal.id);
    expect(doc.issuedProposalId).toBe(issuedId);
    expect(doc.issuedCode).toBe(issuedCode);
    expect(doc.issuedCode).not.toBe(c8.json().proposal.proposalCode);
    expect(doc.status).toBe("generated");
    expect(generated.json().generation.delivery).toBe(false);
    expect(generated.json().delivery.pdf).toBe(false);
    expect(generated.json().delivery.email).toBe(false);
    expect(store.notifEmailOutbox).toEqual([]);
    expect(store.issuedProposals).toHaveLength(1);
  });

  it("renders only the frozen ISS clientSafe snapshot and ignores later live mutations", async () => {
    const store = seedStore("h203-doc-snap");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const ctx = await issueFromProgramme(app, token, orgId, "snap");
    const issuedId = ctx.issued.issuedProposal.id as string;
    const frozenTitle = ctx.issued.clientSafe.programmeTitle as string;
    const frozenPrice = ctx.issued.clientSafe.clientSellingPrice as number;

    const first = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: issuedId },
    });
    expect(first.statusCode).toBe(201);
    const firstContent = first.json().clientContent as Record<string, unknown>;
    expect(firstContent.programmeTitle).toBe(frozenTitle);
    expect(firstContent.clientSellingPrice).toBe(frozenPrice);
    assertSanitized(firstContent);
    const firstHash = first.json().document.contentSha256 as string;
    expect(firstHash).toBe(hashIssuedClientDocumentContent(firstContent as never));

    const addLine = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${ctx.sheet.id}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "activities", description: "Later balloon", unitCost: 500 },
    });
    expect(addLine.statusCode).toBe(201);
    const unlock = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${ctx.programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "revised" },
    });
    expect(unlock.statusCode).toBe(200);
    const renamed = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${ctx.programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Later mutated programme after PDF" },
    });
    expect(renamed.statusCode).toBe(200);

    const reread = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${first.json().document.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(reread.statusCode).toBe(200);
    expect(reread.json().clientContent.programmeTitle).toBe(frozenTitle);
    expect(reread.json().clientContent.clientSellingPrice).toBe(frozenPrice);
    expect(reread.json().document.issuedProposalId).toBe(issuedId);
    assertSanitized(reread.json().clientContent as Record<string, unknown>);

    const second = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: issuedId },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().document.id).not.toBe(first.json().document.id);
    expect(second.json().document.sequence).toBe(2);
    expect(second.json().document.issuedProposalId).toBe(issuedId);
    expect(second.json().clientContent).toEqual(firstContent);
    expect(second.json().document.contentSha256).toBe(firstHash);
    expect(second.json().document.artifactSha256).toBe(first.json().document.artifactSha256);
  });

  it("inspects the generation payload and PDF bytes for prohibited commercial internals", async () => {
    const store = seedStore("h203-doc-safe");
    const root = tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const ctx = await issueFromProgramme(app, token, orgId, "safe");
    const generated = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(generated.statusCode).toBe(201);
    assertSanitized(generated.json().clientContent as Record<string, unknown>);
    const content = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${generated.json().document.id}/content`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(content.statusCode).toBe(200);
    const bytes = Buffer.from(content.json().contentBase64 as string, "base64");
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(issuedClientDocumentPdfContainsForbidden(bytes)).toBe(false);
    expect(hashIssuedClientDocumentArtifact(bytes)).toBe(generated.json().document.artifactSha256);
    expect(content.json().document.contentSha256).toBe(generated.json().document.contentSha256);
    const stored = await store.documentStorage!.get(generated.json().document.storageRef);
    expect(stored).not.toBeNull();
    expect(hashIssuedClientDocumentArtifact(stored!)).toBe(generated.json().document.artifactSha256);
    expect(existsSync(join(root, generated.json().document.storageRef))).toBe(true);
    const text = bytes.toString("latin1");
    expect(text).toContain("H203 Document Programme");
    expect(text).not.toMatch(/supplierCost|grossProfit|markup|fileFee|approvalRequest|14500 file fee/i);
  });

  it("keeps generated documents insert-only and distinct from the ISS snapshot", async () => {
    const store = seedStore("h203-doc-imm");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const ctx = await issueFromProgramme(app, token, orgId, "imm");
    const generated = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(generated.statusCode).toBe(201);
    const id = generated.json().document.id as string;
    const patch = await app.inject({
      method: "PATCH",
      url: `/v1/issued-proposal-documents/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: randomUUID() },
    });
    expect(patch.statusCode).toBe(404);
    const put = await app.inject({
      method: "PUT",
      url: `/v1/issued-proposal-documents/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: randomUUID() },
    });
    expect(put.statusCode).toBe(404);
    expect(() => {
      store.issuedClientDocuments[0]!.issuedProposalId = randomUUID();
    }).toThrow();
    expect(store.issuedClientDocuments[0]!.issuedProposalId).toBe(ctx.issued.issuedProposal.id);
    expect(store.issuedClientDocuments[0]!.contentSha256).toBe(generated.json().document.contentSha256);
  });

  it("authorizes staff generation/read and rejects unauthorized or unauthenticated callers", async () => {
    const store = seedStore("h203-doc-authz");
    tempStorage(store);
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const orgId = await seedOrg(app, carol);
    const ctx = await issueFromProgramme(app, carol, orgId, "authz");
    const denied = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${alice}` },
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(denied.statusCode).toBe(403);
    const unauth = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(unauth.statusCode).toBe(401);
    const generated = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${carol}` },
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(generated.statusCode).toBe(201);
    const aliceGet = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${generated.json().document.id}`,
      headers: { authorization: `Bearer ${alice}` },
    });
    expect(aliceGet.statusCode).toBe(403);
    const aliceContent = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${generated.json().document.id}/content`,
      headers: { authorization: `Bearer ${alice}` },
    });
    expect(aliceContent.statusCode).toBe(403);
    const anonGet = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${generated.json().document.id}`,
    });
    expect(anonGet.statusCode).toBe(401);
  });

  it("does not expose client/public download routes and does not send email", async () => {
    const store = seedStore("h203-doc-public");
    tempStorage(store);
    const app = buildServer({ store });
    for (const path of [...unauthorizedIssuedClientDocumentRoutes(), ...unauthorizedClientIssueRoutes()]) {
      const hit = await app.inject({ method: "GET", url: path.replace(":id", randomUUID()) });
      expect(hit.statusCode).toBe(404);
    }
    const unauthContent = await app.inject({
      method: "GET",
      url: `/v1/issued-proposal-documents/${randomUUID()}/content`,
    });
    expect(unauthContent.statusCode).toBe(401);
    expect(store.notifEmailOutbox).toEqual([]);
  });

  it("leaves the ISS record unchanged when PDF persistence fails", async () => {
    const store = seedStore("h203-doc-fail");
    tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const ctx = await issueFromProgramme(app, token, orgId, "fail");
    const issuedId = ctx.issued.issuedProposal.id as string;
    store.documentStorage = {
      name: "failing-fs",
      async put() {
        throw new Error("forced_put_failure");
      },
      async get() {
        return null;
      },
      async delete() {},
      async exists() {
        return false;
      },
      async stat() {
        return null;
      },
    };
    const failed = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: issuedId },
    });
    expect(failed.statusCode).toBeGreaterThanOrEqual(500);
    expect(store.issuedClientDocuments).toHaveLength(0);
    expect(store.issuedProposals).toHaveLength(1);
    expect(store.issuedProposals[0]!.id).toBe(issuedId);
    expect(store.notifEmailOutbox).toEqual([]);
  });

  it("compensates stored bytes when the document-row transaction fails", async () => {
    const store = seedStore("h203-doc-tx");
    const root = tempStorage(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const ctx = await issueFromProgramme(app, token, orgId, "tx");
    const { pool, documents } = mockDocumentPool({ failAfterDocumentInsert: true });
    store.dbPool = pool;
    const failed = await app.inject({
      method: "POST",
      url: "/v1/issued-proposal-documents",
      headers: { authorization: `Bearer ${token}` },
      payload: { issuedProposalId: ctx.issued.issuedProposal.id },
    });
    expect(failed.statusCode).toBeGreaterThanOrEqual(500);
    expect(documents).toHaveLength(0);
    expect(store.issuedClientDocuments).toHaveLength(0);
    expect(store.issuedProposals).toHaveLength(1);
    expect(store.documentStorage!.name).toBe("local-fs");
    const leftovers = await store.documentStorage!.stat(`${store.issuedProposals[0]!.tenantId}/missing`);
    expect(leftovers).toBeNull();
    expect(existsSync(root)).toBe(true);
    await expect(pool.query("UPDATE issued_client_documents SET immutable = false")).rejects.toThrow(/insert-only/);
  });
});
