import { describe, expect, it } from "vitest";
import { newId } from "./crypto.js";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import type { Principal } from "./types.js";
import type { PrgProgramme } from "./programme.js";
import { ISSUED_PROPOSAL_DELIVERY, createIssuedProposal } from "./issued-proposal.js";
import {
  createIssuedClientDocument,
  composeIssuedClientDocumentPayload,
  renderIssuedClientDocumentPdf,
} from "./issued-client-document.js";
import {
  DEVTEST_DELIVERY_SENDER,
  ISSUED_CLIENT_DOCUMENT_DELIVERY,
  composeIssuedClientDocumentDeliveryMessage,
  createDevTestMockDeliveryProvider,
  createIssuedClientDocumentDelivery,
  createIssuedClientDocumentDeliveryAttempt,
  deliveryIdempotencyKey,
  deriveIssuedClientDocumentDeliveryState,
  evaluateIssuedClientDocumentDeliveryEligibility,
  issuedClientDocumentDeliveryIdentityDistinct,
} from "./issued-client-document-delivery.js";

function principal(roles: string[]): Principal {
  return {
    id: newId(),
    tenantId: "t1",
    actorType: "Human",
    displayName: "Test",
    status: "active",
    classificationClearance: "Restricted",
    roles,
    permissions: ["proposal:write:proposal"],
  };
}

function programme(orgId = "org-1"): PrgProgramme {
  const now = "2026-06-01T00:00:00.000Z";
  return {
    id: newId(),
    tenantId: "t1",
    programmeCode: "PRG-DEL-1",
    rfpId: newId(),
    opportunityId: newId(),
    organizationId: orgId,
    title: "Delivery itinerary",
    status: "draft",
    dayCount: 1,
    startDate: "2026-06-10",
    endDate: "2026-06-24",
    paxCount: 8,
    destinations: "Serengeti",
    inclusionsText: "Park fees",
    exclusionsText: "Flights",
    depositPercent: 30,
    commercialVersionLabel: "final",
    classification: "Confidential",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "p1",
    updatedByPrincipalId: "p1",
  };
}

function issueAndDoc(orgId = "org-1") {
  const issuer = principal(["platform.admin"]);
  const prg = programme(orgId);
  const issued = createIssuedProposal({
    tenantId: "t1",
    programme: prg,
    days: [],
    items: [],
    currency: "USD",
    clientSellingPrice: 14500,
    issuedBy: issuer,
    approvalAuthority: "platform.admin",
    c8ProposalId: newId(),
  });
  if ("error" in issued) throw new Error("expected issued");
  const pdf = renderIssuedClientDocumentPdf(composeIssuedClientDocumentPayload(issued));
  const doc = createIssuedClientDocument({
    tenantId: "t1",
    issued,
    generatedBy: issuer,
    sequence: 1,
    pdfBytes: pdf,
  });
  if ("error" in doc) throw new Error("expected document");
  return { issuer, prg, issued, pdf, doc };
}

describe("H-203 issued client document delivery kernel (Dev/Test mock only)", () => {
  it("keeps real delivery flags closed and does not add RFP stages", () => {
    expect(ISSUED_PROPOSAL_DELIVERY.email).toBe(false);
    expect(ISSUED_PROPOSAL_DELIVERY.dispatch).toBe(false);
    expect(ISSUED_PROPOSAL_DELIVERY.clientAccess).toBe(false);
    expect(ISSUED_CLIENT_DOCUMENT_DELIVERY).toEqual({
      implemented: true,
      mockProvider: true,
      realEmail: false,
      smtp: false,
      dispatch: false,
      clientAccess: false,
      production: false,
    });
    expect(DEVTEST_DELIVERY_SENDER.kind).toBe("organizational");
    expect(DEVTEST_DELIVERY_SENDER.address).toContain(".invalid");
    expect(DEVTEST_DELIVERY_SENDER.productionConfigured).toBe(false);
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

  it("creates a distinct DEL identity and a client-safe template without internals", () => {
    const { issuer, issued, pdf, doc } = issueAndDoc();
    const eligibility = evaluateIssuedClientDocumentDeliveryEligibility({
      document: doc,
      issued,
      programmeOrganizationId: "org-1",
      programmeTenantId: "t1",
      pdfBytes: pdf,
      principal: issuer,
      recipientEmail: "accounts@h203-client.test",
      recipientConfirmed: true,
      relatedOrganizationId: "org-1",
    });
    expect(eligibility).toEqual({ ok: true });
    const delivery = createIssuedClientDocumentDelivery({
      document: doc,
      issued,
      principal: issuer,
      recipientEmail: "accounts@h203-client.test",
      relatedOrganizationId: "org-1",
    });
    if ("error" in delivery) throw new Error(delivery.error);
    expect(delivery.deliveryCode.startsWith("DEL-")).toBe(true);
    expect(delivery.state).toBe("queued");
    expect(
      issuedClientDocumentDeliveryIdentityDistinct({
        deliveryId: delivery.id,
        deliveryCode: delivery.deliveryCode,
        documentId: doc.id,
        documentCode: doc.documentCode,
        issuedProposalId: issued.id,
        issuedCode: issued.issuedCode,
        rfpId: issued.rfpId,
        c8ProposalId: issued.c8ProposalId,
      }),
    ).toBe(true);
    const message = composeIssuedClientDocumentDeliveryMessage({
      document: doc,
      recipientEmail: delivery.recipientEmail,
    });
    expect(message.body).toContain("Delivery itinerary");
    expect(message.body).toContain("14500");
    expect(message.body).toContain(doc.documentCode);
    expect(message.body).not.toMatch(/supplierCost|grossProfit|markup|fileFee|approvalRequest/i);
  });

  it("rejects invalid, internal, unconfirmed, and unrelated recipients", () => {
    const { issuer, issued, pdf, doc } = issueAndDoc();
    const base = {
      document: doc,
      issued,
      programmeOrganizationId: "org-1",
      programmeTenantId: "t1",
      pdfBytes: pdf,
      principal: issuer,
      recipientEmail: "accounts@h203-client.test",
      recipientConfirmed: true,
      relatedOrganizationId: "org-1",
    };
    expect(evaluateIssuedClientDocumentDeliveryEligibility({ ...base, recipientConfirmed: false }).ok).toBe(false);
    expect(evaluateIssuedClientDocumentDeliveryEligibility({ ...base, recipientEmail: "not-an-email" }).ok).toBe(false);
    expect(
      evaluateIssuedClientDocumentDeliveryEligibility({ ...base, recipientEmail: "carol.admin@sedmc.local" }).ok,
    ).toBe(false);
    expect(evaluateIssuedClientDocumentDeliveryEligibility({ ...base, relatedOrganizationId: "other-org" }).ok).toBe(
      false,
    );
    expect(evaluateIssuedClientDocumentDeliveryEligibility({ ...base, cc: "copy@example.test" }).ok).toBe(false);
    expect(evaluateIssuedClientDocumentDeliveryEligibility({ ...base, principal: principal(["finance.member"]) }).ok).toBe(
      false,
    );
  });

  it("enforces S2 supersession unless the older DOC is explicitly named", () => {
    const first = issueAndDoc();
    const laterIssued = createIssuedProposal({
      tenantId: "t1",
      programme: { ...programme(), id: first.issued.programmeId, organizationId: "org-1" },
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 15000,
      issuedBy: first.issuer,
      approvalAuthority: "platform.admin",
      issuedAt: "2099-01-01T00:00:00.000Z",
    });
    if ("error" in laterIssued) throw new Error("expected later issued");
    const blocked = evaluateIssuedClientDocumentDeliveryEligibility({
      document: first.doc,
      issued: first.issued,
      programmeOrganizationId: "org-1",
      programmeTenantId: "t1",
      pdfBytes: first.pdf,
      principal: first.issuer,
      recipientEmail: "accounts@h203-client.test",
      recipientConfirmed: true,
      relatedOrganizationId: "org-1",
      programmeIssued: [first.issued, laterIssued],
    });
    expect(blocked).toEqual({ ok: false, error: "issued_proposal_superseded" });
    const named = evaluateIssuedClientDocumentDeliveryEligibility({
      document: first.doc,
      issued: first.issued,
      programmeOrganizationId: "org-1",
      programmeTenantId: "t1",
      pdfBytes: first.pdf,
      principal: first.issuer,
      recipientEmail: "accounts@h203-client.test",
      recipientConfirmed: true,
      relatedOrganizationId: "org-1",
      programmeIssued: [first.issued, laterIssued],
      authorizeSupersededDocument: true,
    });
    expect(named).toEqual({ ok: true });
  });

  it("hashes artifact mismatches and missing bytes fail closed", () => {
    const { issuer, issued, pdf, doc } = issueAndDoc();
    expect(
      evaluateIssuedClientDocumentDeliveryEligibility({
        document: doc,
        issued,
        programmeOrganizationId: "org-1",
        programmeTenantId: "t1",
        pdfBytes: new Uint8Array([1, 2, 3]),
        principal: issuer,
        recipientEmail: "accounts@h203-client.test",
        recipientConfirmed: true,
        relatedOrganizationId: "org-1",
      }),
    ).toEqual({ ok: false, error: "artifact_hash_mismatch" });
    expect(
      evaluateIssuedClientDocumentDeliveryEligibility({
        document: doc,
        issued,
        programmeOrganizationId: "org-1",
        programmeTenantId: "t1",
        pdfBytes: null,
        principal: issuer,
        recipientEmail: "accounts@h203-client.test",
        recipientConfirmed: true,
        relatedOrganizationId: "org-1",
      }),
    ).toEqual({ ok: false, error: "artifact_missing" });
    expect(pdf.byteLength).toBeGreaterThan(20);
  });

  it("uses durable idempotency keys and mock provider acceptance is not mailbox delivery", async () => {
    const a = deliveryIdempotencyKey({
      tenantId: "t1",
      documentId: "doc-1",
      recipientEmail: "A@H203-client.test",
    });
    const b = deliveryIdempotencyKey({
      tenantId: "t1",
      documentId: "doc-1",
      recipientEmail: "a@h203-client.test",
    });
    const c = deliveryIdempotencyKey({
      tenantId: "t1",
      documentId: "doc-1",
      recipientEmail: "other@h203-client.test",
    });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    const { issuer, issued, pdf, doc } = issueAndDoc();
    const delivery = createIssuedClientDocumentDelivery({
      document: doc,
      issued,
      principal: issuer,
      recipientEmail: "accounts@h203-client.test",
      relatedOrganizationId: "org-1",
    });
    if ("error" in delivery) throw new Error(delivery.error);
    const accept = createDevTestMockDeliveryProvider("accept");
    const accepted = await accept.send({
      pdfBytes: pdf,
      message: composeIssuedClientDocumentDeliveryMessage({ document: doc, recipientEmail: delivery.recipientEmail }),
      artifactSha256: doc.artifactSha256,
    });
    expect(accepted.status).toBe("accepted_by_provider");
    expect(accepted.recipientDelivered).toBe(false);
    expect(accept.contactsSmtp).toBe(false);
    const reject = await createDevTestMockDeliveryProvider("reject").send({
      pdfBytes: pdf,
      message: composeIssuedClientDocumentDeliveryMessage({ document: doc, recipientEmail: delivery.recipientEmail }),
      artifactSha256: doc.artifactSha256,
    });
    expect(reject.status).toBe("failed");
    const attempt = createIssuedClientDocumentDeliveryAttempt({
      delivery,
      document: doc,
      principal: issuer,
      attemptNumber: 1,
      result: "failed",
      failureReason: "provider_rejected",
    });
    expect(attempt.attemptCode.startsWith("DLA-")).toBe(true);
    expect(deriveIssuedClientDocumentDeliveryState(delivery, [attempt])).toBe("failed");
    const ok = createIssuedClientDocumentDeliveryAttempt({
      delivery,
      document: doc,
      principal: issuer,
      attemptNumber: 2,
      result: "accepted_by_provider",
      providerReference: "mock-devtest-x",
    });
    expect(deriveIssuedClientDocumentDeliveryState(delivery, [attempt, ok])).toBe("accepted_by_provider");
    expect(ok.recipientDelivered).toBe(false);
  });
});
