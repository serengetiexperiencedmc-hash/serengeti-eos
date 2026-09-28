import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS, ISSUED_PROPOSAL_DELIVERY } from "@sedmc/kernel/issued-proposal";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { unauthorizedClientIssueRoutes } from "../src/issued-proposal/issued-proposal.js";
import { buildServer } from "../src/server.js";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-203-commercial-core-programme-rfp-finance-development.md",
);

const P = TEST_BOOTSTRAP_SECRETS;

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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Issue Ltd,corporate,H203 Issue,UK"].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-iss-org-${batchId}` },
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
  extra: Record<string, unknown> = {},
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H203I-${suffix}`,
      title: "H203 Issue",
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
      rfpCode: `RFP-H203I-${suffix}`,
      opportunityId,
      title: "H203 Issue RFP",
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
      title: "H203 Issue Programme",
      startDate: "2026-06-10",
      endDate: "2026-06-24",
      paxCount: 12,
      inclusionsText: "Park fees",
      exclusionsText: "International flights",
      ...extra,
    },
  });
  return {
    rfp: rfp.json().rfp as { id: string; workflowStage: string },
    programme: prg.json().programme as Record<string, unknown>,
    programmeId: prg.json().programme.id as string,
  };
}

async function addCostSheet(
  app: ReturnType<typeof buildServer>,
  token: string,
  programmeId: string,
) {
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
  expect(labelled.json().programme.commercialVersionLabel).toBe("final");
}

function addAuthorityPrincipal(
  store: ReturnType<typeof seedStore>,
  email: string,
  roles: string[],
) {
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) throw new Error("carol missing");
  const clone = {
    ...carol,
    id: randomUUID(),
    email,
    displayName: email,
    roles: [...roles],
    permissions: [...carol.permissions],
  };
  store.principals.set(clone.id, clone);
}

function assertNoInternalLeak(clientSafe: Record<string, unknown>) {
  for (const key of ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS) {
    expect(clientSafe).not.toHaveProperty(key);
  }
  const blob = JSON.stringify(clientSafe);
  expect(blob).not.toMatch(/supplierCost|grossProfit|grossMargin|markup|fileFee|file fee|taxAmount|fxRate|approvalRequest/i);
}

describe("H-203 client-issue foundation (Dev/Test)", () => {
  it("records authorization scope and keeps productionReady false; durability uses migration 128", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("CLIENT-ISSUE FOUNDATION");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).toContain("PDF/email/dispatch/client access remain unauthorized");
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/128_h203_issued_proposal_durability.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
  });

  it("rejects issuance from draft, revised, and client programmes", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);

    for (const [suffix, label] of [
      ["d", "draft"],
      ["r", "revised"],
      ["c", "client"],
    ] as const) {
      const { programmeId } = await createProgramme(app, token, orgId, suffix);
      await addCostSheet(app, token, programmeId);
      if (label !== "draft") {
        const patched = await app.inject({
          method: "PATCH",
          url: `/v1/programmes/${programmeId}`,
          headers: { authorization: `Bearer ${token}` },
          payload: { commercialVersionLabel: label },
        });
        expect(patched.statusCode).toBe(200);
      }
      const issued = await app.inject({
        method: "POST",
        url: "/v1/issued-proposals",
        headers: { authorization: `Bearer ${token}` },
        payload: { programmeId },
      });
      expect(issued.statusCode).toBe(409);
      expect(issued.json().reason).toBe("programme_not_final");
    }
  });

  it("issues from a final programme with CEO/MD or Commercial Director (or platform.admin stand-in) approval", async () => {
    const store = seedStore("test-secret");
    addAuthorityPrincipal(store, "ceo.md@sedmc.local", ["ceo_md"]);
    addAuthorityPrincipal(store, "cdirector@sedmc.local", ["commercial_director"]);
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const ceo = await login(app, "ceo.md@sedmc.local", P.carolPassword);
    const cd = await login(app, "cdirector@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, carol);

    const first = await createProgramme(app, carol, orgId, "final-carol");
    await addCostSheet(app, carol, first.programmeId);
    await labelFinal(app, carol, first.programmeId);
    const carolIssue = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${carol}` },
      payload: { programmeId: first.programmeId },
    });
    expect(carolIssue.statusCode).toBe(201);
    expect(carolIssue.json().issuedProposal.approvalAuthority).toBe("platform.admin");
    expect(carolIssue.json().issuedProposal.immutable).toBe(true);
    expect(carolIssue.json().clientSafe.commercialVersionLabel).toBe("final");
    expect(carolIssue.json().delivery).toEqual(ISSUED_PROPOSAL_DELIVERY);

    const second = await createProgramme(app, carol, orgId, "final-ceo");
    await addCostSheet(app, carol, second.programmeId);
    await labelFinal(app, carol, second.programmeId);
    const ceoIssue = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${ceo}` },
      payload: { programmeId: second.programmeId },
    });
    expect(ceoIssue.statusCode).toBe(201);
    expect(ceoIssue.json().issuedProposal.approvalAuthority).toBe("ceo_md");

    const third = await createProgramme(app, carol, orgId, "final-cd");
    await addCostSheet(app, carol, third.programmeId);
    await labelFinal(app, carol, third.programmeId);
    const cdIssue = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${cd}` },
      payload: { programmeId: third.programmeId },
    });
    expect(cdIssue.statusCode).toBe(201);
    expect(cdIssue.json().issuedProposal.approvalAuthority).toBe("commercial_director");
  });

  it("prevents issuance without authorized commercial approval", async () => {
    const store = seedStore("test-secret");
    addAuthorityPrincipal(store, "staff.noauth@sedmc.local", ["finance.member"]);
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const staff = await login(app, "staff.noauth@sedmc.local", P.carolPassword);
    const orgId = await seedOrg(app, carol);
    const { programmeId } = await createProgramme(app, carol, orgId, "noauth");
    await addCostSheet(app, carol, programmeId);
    await labelFinal(app, carol, programmeId);

    const denied = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${staff}` },
      payload: { programmeId },
    });
    expect(denied.statusCode).toBe(403);
    expect(denied.json().reason).toBe("commercial_issue_approval_required");
  });

  it("uses a distinct issued identity from C8 and does not treat C8 sent as delivery", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, rfp } = await createProgramme(app, token, orgId, "c8");
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);

    const c8 = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: rfp.id, title: "Internal C8" },
    });
    expect(c8.statusCode).toBe(201);
    const c8Id = c8.json().proposal.id as string;
    expect(c8.json().proposal.status).toBe("approved");

    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId, c8ProposalId: c8Id },
    });
    expect(issued.statusCode).toBe(201);
    const issuedId = issued.json().issuedProposal.id as string;
    expect(issuedId).not.toBe(c8Id);
    expect(issued.json().issuedProposal.issuedCode).not.toBe(c8.json().proposal.proposalCode);
    expect(issued.json().issuedProposal.c8ProposalId).toBe(c8Id);
    expect(issued.json().clientSafe).not.toHaveProperty("c8ProposalId");

    const sent = await app.inject({
      method: "POST",
      url: `/v1/proposals/${c8Id}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStatus: "sent" },
    });
    expect(sent.statusCode).toBe(200);
    expect(sent.json().proposal.status).toBe("sent");
    expect(sent.json().proposal.sentAt).toBeTruthy();
    expect(sent.json().proposal).not.toHaveProperty("emailSent");
    expect(sent.json().proposal).not.toHaveProperty("deliveredAt");
    expect(store.notifEmailOutbox).toEqual([]);

    const listed = await app.inject({
      method: "GET",
      url: `/v1/issued-proposals?programmeId=${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items).toHaveLength(1);
    expect(listed.json().items[0].delivery.email).toBe(false);
    expect(listed.json().items[0].delivery.dispatch).toBe(false);
  });

  it("freezes the issued snapshot so later programme/costing changes do not mutate it", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "freeze");
    const sheet = await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);

    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(issued.statusCode).toBe(201);
    const issuedId = issued.json().issuedProposal.id as string;
    const frozenPrice = issued.json().clientSafe.clientSellingPrice as number;
    const frozenTitle = issued.json().clientSafe.programmeTitle as string;
    expect(frozenPrice).toBe(1450);

    const stored = store.issuedProposals[0];
    expect(stored).toBeTruthy();
    expect(() => {
      (stored!.clientSafe as { clientSellingPrice: number }).clientSellingPrice = 9;
    }).toThrow();

    const addLine = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheet.id}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "activities", description: "Later balloon", unitCost: 500 },
    });
    expect(addLine.statusCode).toBe(201);

    const unlock = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "revised" },
    });
    expect(unlock.statusCode).toBe(200);
    const renamed = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Later mutated programme" },
    });
    expect(renamed.statusCode).toBe(200);

    const again = await app.inject({
      method: "GET",
      url: `/v1/issued-proposals/${issuedId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(again.statusCode).toBe(200);
    expect(again.json().clientSafe.clientSellingPrice).toBe(frozenPrice);
    expect(again.json().clientSafe.programmeTitle).toBe(frozenTitle);

    const costing = await app.inject({
      method: "GET",
      url: `/v1/costing/sheets/${sheet.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(costing.statusCode).toBe(200);
    expect(costing.json().sheet.clientSellingPrice).toBeGreaterThan(frozenPrice);
    expect(costing.json().sheet.totalCost).toBe(1500);
  });

  it("exposes only client-safe fields and keeps internals on the costing/programme records", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "safe");
    await addCostSheet(app, token, programmeId);
    const notes = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        inclusionsText: "Park fees",
        exclusionsText: "International flights",
      },
    });
    expect(notes.statusCode).toBe(200);
    await labelFinal(app, token, programmeId);

    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(issued.statusCode).toBe(201);
    const clientSafe = issued.json().clientSafe as Record<string, unknown>;
    const allowed = new Set([
      "issuingEntity",
      "programmeCode",
      "programmeTitle",
      "commercialVersionLabel",
      "programmeVersionNumber",
      "startDate",
      "endDate",
      "nights",
      "paxCount",
      "destinations",
      "inclusionsText",
      "exclusionsText",
      "depositPercent",
      "paymentMilestones",
      "itinerary",
      "currency",
      "clientSellingPrice",
    ]);
    for (const key of Object.keys(clientSafe)) {
      expect(allowed.has(key)).toBe(true);
    }
    expect(clientSafe.currency).toBe("USD");
    expect(clientSafe.clientSellingPrice).toBe(1450);
    expect(clientSafe.commercialVersionLabel).toBe("final");
    expect(clientSafe.issuingEntity).toBe("Serengeti Experience DMC");
    expect(clientSafe.inclusionsText).toBe("Park fees");
    expect(clientSafe.exclusionsText).toBe("International flights");
    assertNoInternalLeak(clientSafe);
    expect(issued.json().issuedProposal).not.toHaveProperty("tenantId");
    expect(clientSafe).not.toHaveProperty("approvalAuthority");
    expect(clientSafe).not.toHaveProperty("issuedByPrincipalId");

    const sheet = await app.inject({
      method: "GET",
      url: `/v1/costing/sheets/by-programme/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(sheet.statusCode).toBe(200);
    expect(sheet.json().sheet.totalCost).toBe(1000);
    expect(sheet.json().sheet.fileFeeAmount).toBe(200);
    expect(sheet.json().sheet.marginPercent).toBeGreaterThan(0);
  });

  it("does not introduce client GET/download routes and requires authentication for staff GET", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "authz");
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    const issuedId = issued.json().issuedProposal.id as string;

    const unauth = await app.inject({ method: "GET", url: `/v1/issued-proposals/${issuedId}` });
    expect(unauth.statusCode).toBe(401);

    for (const url of unauthorizedClientIssueRoutes()) {
      const path = url.includes(":id") ? url.replace(":id", issuedId) : url;
      const res = await app.inject({ method: "GET", url: path });
      expect(res.statusCode).toBe(404);
    }

    const health = await app.inject({ method: "GET", url: "/health" });
    expect(health.statusCode).toBe(200);
    expect(health.json().productionReady).toBe(false);
  });

  it("permits same-day programmes with nights = 0", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, programme } = await createProgramme(app, token, orgId, "sameday", {
      startDate: "2026-06-10",
      endDate: "2026-06-10",
    });
    expect(programme.nightCount).toBe(0);
    await addCostSheet(app, token, programmeId);
    await labelFinal(app, token, programmeId);
    const issued = await app.inject({
      method: "POST",
      url: "/v1/issued-proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId },
    });
    expect(issued.statusCode).toBe(201);
    expect(issued.json().clientSafe.nights).toBe(0);
    expect(issued.json().clientSafe.startDate).toBe("2026-06-10");
    expect(issued.json().clientSafe.endDate).toBe("2026-06-10");
  });
});
