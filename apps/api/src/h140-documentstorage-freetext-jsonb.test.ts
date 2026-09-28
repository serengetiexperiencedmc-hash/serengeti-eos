import { describe, expect, it, vi } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { PERSON_DOMAIN_REMOVED } from "../src/personal-data-phase1.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { createLogger } from "../src/observability.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const pdfB64 = Buffer.from("%PDF-1.4 h140").toString("base64");

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  return res.json().accessToken as string;
}

async function seedOrgRfp(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H140 Client Ltd,corporate,H140 Client,TZ"].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h140-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  const orgId = orgs.json().items[0].id as string;
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H140-${Date.now().toString().slice(-6)}`,
      title: "H140 Opportunity",
      organizationId: orgId,
      paxCount: 20,
    },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H140-${Date.now().toString().slice(-6)}`,
      opportunityId: oppId,
      title: "H140 RFP",
      paxCount: 20,
      destinations: "Serengeti",
      source: "email",
      notes: "Commercial intake notes",
    },
  });
  return { orgId, oppId, rfpId: rfp.json().rfp.id as string };
}

describe("H-140 DocumentStorage / free-text / JSONB content contract (Dev/Test)", () => {
  it("does not add migration 126 and keeps migration 125 last", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("rejects unauthenticated document upload", async () => {
    const app = buildServer({ store: seedStore("h140-doc-auth") });
    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/rfps/${"00000000-0000-4000-8000-000000000001"}/documents`,
          payload: { filename: "rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
        })
      ).statusCode,
    ).toBe(401);
  });

  it("accepts commercial RFP PDF and rejects person-domain metadata or identity filenames without persistence", async () => {
    const store = seedStore("h140-doc-upload");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const { rfpId } = await seedOrgRfp(app, token);

    const ok = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${token}` },
      payload: { filename: "client-rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
    });
    expect(ok.statusCode).toBe(201);
    expect(ok.json().document.filename).toBe("client-rfp.pdf");
    expect(store.commercialDocuments).toHaveLength(1);

    const withPersonKey = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        filename: "client-rfp-2.pdf",
        mimeType: "application/pdf",
        contentBase64: pdfB64,
        guestName: "Jane Planner",
      },
    });
    expect(withPersonKey.statusCode).toBe(400);
    expect(withPersonKey.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.commercialDocuments).toHaveLength(1);

    const identityName = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${token}` },
      payload: { filename: "passport-scan.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
    });
    expect(identityName.statusCode).toBe(400);
    expect(identityName.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.commercialDocuments).toHaveLength(1);
  });

  it("rejects person-domain keys on notes, RFP patch, and commercial facts without mutating records", async () => {
    const store = seedStore("h140-facts-notes");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const { orgId, oppId, rfpId } = await seedOrgRfp(app, token);
    const notesBefore = store.crmNotes.length;

    const commercialNote = await app.inject({
      method: "POST",
      url: "/v1/crm/notes",
      headers: { authorization: `Bearer ${token}` },
      payload: { body: "Prefers morning commercial calls", entityType: "organization", entityId: orgId },
    });
    expect(commercialNote.statusCode).toBe(201);

    const personNote = await app.inject({
      method: "POST",
      url: "/v1/crm/notes",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        body: "Commercial follow-up",
        entityType: "organization",
        entityId: orgId,
        givenName: "Jane",
      },
    });
    expect(personNote.statusCode).toBe(400);
    expect(personNote.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmNotes.length).toBe(notesBefore + 1);

    const rfpPatch = await app.inject({
      method: "PATCH",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { notes: "Updated commercial notes", guestName: "Jane" },
    });
    expect(rfpPatch.statusCode).toBe(400);
    expect(rfpPatch.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const facts = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${oppId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { qualificationStatus: "qualified", givenName: "Jane" },
    });
    expect(facts.statusCode).toBe(400);
    expect(facts.json().reason).toBe(PERSON_DOMAIN_REMOVED);
  });

  it("rejects person-domain keys on organization JSONB address, opportunity create, and RFP create without persistence", async () => {
    const store = seedStore("h140-create-jsonb");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const { orgId, oppId, rfpId } = await seedOrgRfp(app, token);
    const orgsBefore = store.crmOrganizations.length;
    const oppsBefore = store.oppOpportunities.length;
    const rfpsBefore = store.rfpRfps.length;
    const programmesBefore = store.prgProgrammes.length;

    const nestedAddress = await app.inject({
      method: "PATCH",
      url: `/v1/crm/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { address: { city: "Arusha", guestName: "Jane Planner" } },
    });
    expect(nestedAddress.statusCode).toBe(400);
    expect(nestedAddress.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmOrganizations.find((o) => o.id === orgId)?.address).toBeUndefined();

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;
    const createOrg = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        legalName: "H140 Person Key Org Ltd",
        organizationTypeId: typeId,
        givenName: "Jane",
      },
    });
    expect(createOrg.statusCode).toBe(400);
    expect(createOrg.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmOrganizations).toHaveLength(orgsBefore);

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: `OPP-H140K-${Date.now().toString().slice(-6)}`,
        title: "Must not persist person keys",
        organizationId: orgId,
        guestName: "Jane",
      },
    });
    expect(opp.statusCode).toBe(400);
    expect(opp.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.oppOpportunities).toHaveLength(oppsBefore);

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpCode: `RFP-H140K-${Date.now().toString().slice(-6)}`,
        opportunityId: oppId,
        title: "Must not persist person keys",
        givenName: "Jane",
      },
    });
    expect(rfp.statusCode).toBe(400);
    expect(rfp.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.rfpRfps).toHaveLength(rfpsBefore);

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId, title: "Must not persist person keys", guestName: "Jane" },
    });
    expect(programme.statusCode).toBe(400);
    expect(programme.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.prgProgrammes).toHaveLength(programmesBefore);
  });

  it("redacts csvContent, body, and contentBase64 when those keys are logged", () => {
    const lines: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0] ?? ""));
    });
    createLogger("info").info("probe", {
      csvContent: "givenName,familyName\nJane,Planner",
      body: "Do not log this note body",
      contentBase64: pdfB64,
      principalId: "p1",
    });
    spy.mockRestore();
    expect(lines[0]).toContain("[REDACTED]");
    expect(lines[0]).toContain("p1");
    expect(lines[0]).not.toContain("Jane,Planner");
    expect(lines[0]).not.toContain("Do not log this note body");
    expect(lines[0]).not.toContain(pdfB64);
  });
});
