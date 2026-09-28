import { describe, expect, it } from "vitest";
import { newId } from "./crypto.js";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import type { Principal } from "./types.js";
import type { PrgProgramme } from "./programme.js";
import { ISSUED_PROPOSAL_DELIVERY, createIssuedProposal } from "./issued-proposal.js";
import {
  ISSUED_CLIENT_DOCUMENT_GENERATION,
  assertIssuedClientDocumentPayloadSanitized,
  composeIssuedClientDocumentPayload,
  createIssuedClientDocument,
  hashIssuedClientDocumentArtifact,
  hashIssuedClientDocumentContent,
  issuedClientDocumentIdentityDistinct,
  issuedClientDocumentPdfContainsForbidden,
  renderIssuedClientDocumentPdf,
} from "./issued-client-document.js";

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

function programme(): PrgProgramme {
  const now = "2026-06-01T00:00:00.000Z";
  return {
    id: newId(),
    tenantId: "t1",
    programmeCode: "PRG-DOC-1",
    rfpId: newId(),
    opportunityId: newId(),
    organizationId: newId(),
    title: "Document itinerary",
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

describe("H-203 issued client document kernel (Dev/Test)", () => {
  it("composes a sanitized payload only from the issued clientSafe snapshot", () => {
    const issuer = principal(["platform.admin"]);
    const prg = programme();
    const created = createIssuedProposal({
      tenantId: "t1",
      programme: prg,
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 1450,
      issuedBy: issuer,
      approvalAuthority: "platform.admin",
      c8ProposalId: newId(),
    });
    expect("error" in created).toBe(false);
    if ("error" in created) return;
    const payload = composeIssuedClientDocumentPayload(created);
    expect(payload.issuedCode).toBe(created.issuedCode);
    expect(payload.programmeTitle).toBe("Document itinerary");
    expect(payload.clientSellingPrice).toBe(1450);
    expect(payload).not.toHaveProperty("supplierCost");
    expect(payload).not.toHaveProperty("approvalRequestId");
    assertIssuedClientDocumentPayloadSanitized(payload);
    prg.title = "Later live title";
    expect(payload.programmeTitle).toBe("Document itinerary");
  });

  it("rejects a payload that includes prohibited commercial internals", () => {
    expect(() =>
      assertIssuedClientDocumentPayloadSanitized({
        issuingEntity: "Serengeti Experience DMC",
        issuedCode: "ISS-x",
        programmeCode: "PRG",
        programmeTitle: "T",
        commercialVersionLabel: "final",
        itinerary: [],
        currency: "USD",
        clientSellingPrice: 100,
        supplierCost: 50,
      }),
    ).toThrow(/forbidden/);
  });

  it("renders a deterministic PDF from the payload and keeps DOC distinct from ISS and C8", () => {
    const c8Id = newId();
    const created = createIssuedProposal({
      tenantId: "t1",
      programme: programme(),
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 1450,
      issuedBy: principal(["platform.admin"]),
      approvalAuthority: "platform.admin",
      c8ProposalId: c8Id,
    });
    if ("error" in created) throw new Error("expected issued");
    const payload = composeIssuedClientDocumentPayload(created);
    const pdfA = renderIssuedClientDocumentPdf(payload);
    const pdfB = renderIssuedClientDocumentPdf(payload);
    expect(Buffer.from(pdfA).equals(Buffer.from(pdfB))).toBe(true);
    expect(hashIssuedClientDocumentArtifact(pdfA)).toBe(hashIssuedClientDocumentArtifact(pdfB));
    expect(hashIssuedClientDocumentContent(payload)).toHaveLength(64);
    expect(issuedClientDocumentPdfContainsForbidden(pdfA)).toBe(false);
    const text = Buffer.from(pdfA).toString("latin1");
    expect(text).toContain("Document itinerary");
    expect(text).toContain("1450");
    expect(text).not.toMatch(/supplierCost|grossProfit|markup|fileFee|approvalRequest/i);
    const doc = createIssuedClientDocument({
      tenantId: "t1",
      issued: created,
      generatedBy: principal(["platform.admin"]),
      sequence: 1,
      pdfBytes: pdfA,
    });
    if ("error" in doc) throw new Error("expected document");
    expect(doc.documentCode.startsWith("DOC-")).toBe(true);
    expect(
      issuedClientDocumentIdentityDistinct({
        documentId: doc.id,
        documentCode: doc.documentCode,
        issuedProposalId: created.id,
        issuedCode: created.issuedCode,
        c8ProposalId: c8Id,
      }),
    ).toBe(true);
    expect(doc.contentSha256).toBe(hashIssuedClientDocumentContent(payload));
    expect(doc.artifactSha256).toBe(hashIssuedClientDocumentArtifact(pdfA));
  });

  it("does not treat PDF generation as delivery and does not add RFP stages", () => {
    expect(ISSUED_PROPOSAL_DELIVERY).toEqual({
      implemented: false,
      pdf: false,
      email: false,
      dispatch: false,
      clientAccess: false,
    });
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
});
