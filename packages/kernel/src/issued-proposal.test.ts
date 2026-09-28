import { describe, expect, it } from "vitest";
import { newId } from "./crypto.js";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import { PROPOSAL_STATUSES } from "./proposal.js";
import { programmeNightCount } from "./h203-commercial-policy.js";
import type { Principal } from "./types.js";
import type { PrgDay, PrgItem, PrgProgramme } from "./programme.js";
import {
  ISSUED_PROPOSAL_DELIVERY,
  ISSUED_PROPOSAL_KIND,
  ISSUING_ENTITY_SEDMC,
  buildIssuedClientSafeRepresentation,
  clientIssueApprovalAuthority,
  createIssuedProposal,
  issuedClientSafeContainsForbidden,
  issuedIdentityDistinctFromC8,
  pickIssuedClientSafe,
  principalMayAuthorizeClientIssue,
  programmeEligibleForClientIssue,
} from "./issued-proposal.js";

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

function programme(label: PrgProgramme["commercialVersionLabel"]): PrgProgramme {
  const now = "2026-06-01T00:00:00.000Z";
  return {
    id: newId(),
    tenantId: "t1",
    programmeCode: "PRG-ISSUE-1",
    rfpId: newId(),
    opportunityId: newId(),
    organizationId: newId(),
    title: "Issued itinerary",
    status: "draft",
    dayCount: 1,
    startDate: "2026-06-10",
    endDate: "2026-06-24",
    paxCount: 8,
    destinations: "Serengeti",
    inclusionsText: "Park fees",
    exclusionsText: "Flights",
    depositPercent: 30,
    commercialVersionLabel: label,
    classification: "Confidential",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "p1",
    updatedByPrincipalId: "p1",
  };
}

function day(programmeId: string): PrgDay {
  const now = "2026-06-01T00:00:00.000Z";
  return {
    id: newId(),
    tenantId: "t1",
    programmeId,
    dayNumber: 1,
    title: "Arrival",
    location: "Arusha",
    calendarDate: "2026-06-10",
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  };
}

function item(programmeId: string, dayId: string, visibility?: PrgItem["visibility"]): PrgItem {
  const now = "2026-06-01T00:00:00.000Z";
  const row: PrgItem = {
    id: newId(),
    tenantId: "t1",
    programmeId,
    dayId,
    sortOrder: 1,
    title: "Transfer",
    description: "Airport to lodge",
    supplierId: "sup-internal",
    supplierRateId: "rate-internal",
    itemType: "transport",
    createdAt: now,
    updatedAt: now,
  };
  if (visibility !== undefined) row.visibility = visibility;
  return row;
}

describe("H-203 issued proposal kernel (Dev/Test)", () => {
  it("rejects non-final programme labels and accepts final", () => {
    expect(programmeEligibleForClientIssue("draft")).toEqual({ allowed: false, reason: "programme_not_final" });
    expect(programmeEligibleForClientIssue("revised")).toEqual({ allowed: false, reason: "programme_not_final" });
    expect(programmeEligibleForClientIssue("client")).toEqual({ allowed: false, reason: "programme_not_final" });
    expect(programmeEligibleForClientIssue(undefined)).toEqual({ allowed: false, reason: "programme_not_final" });
    expect(programmeEligibleForClientIssue("final")).toEqual({ allowed: true });
  });

  it("requires CEO/MD, Commercial Director, or platform.admin Dev/Test stand-in", () => {
    expect(principalMayAuthorizeClientIssue(principal(["finance.member"]))).toBe(false);
    expect(clientIssueApprovalAuthority(principal(["finance.member"]))).toBeUndefined();
    expect(principalMayAuthorizeClientIssue(principal(["ceo_md"]))).toBe(true);
    expect(clientIssueApprovalAuthority(principal(["ceo_md"]))).toBe("ceo_md");
    expect(principalMayAuthorizeClientIssue(principal(["commercial_director"]))).toBe(true);
    expect(clientIssueApprovalAuthority(principal(["commercial_director"]))).toBe("commercial_director");
    expect(principalMayAuthorizeClientIssue(principal(["platform.admin"]))).toBe(true);
    expect(clientIssueApprovalAuthority(principal(["platform.admin"]))).toBe("platform.admin");
  });

  it("creates a distinct immutable issued identity with a client-safe snapshot", () => {
    const prg = programme("final");
    const d = day(prg.id);
    const clientItem = item(prg.id, d.id, "client");
    const internalItem = item(prg.id, d.id, "internal");
    internalItem.title = "Supplier cost line";
    const c8Id = newId();
    const issuer = principal(["ceo_md"]);
    const created = createIssuedProposal({
      tenantId: "t1",
      programme: prg,
      days: [d],
      items: [clientItem, internalItem],
      currency: "USD",
      clientSellingPrice: 1450,
      issuedBy: issuer,
      approvalAuthority: "ceo_md",
      programmeVersionNumber: 1,
      c8ProposalId: c8Id,
    });
    expect("error" in created).toBe(false);
    if ("error" in created) return;
    expect(created.kind).toBe(ISSUED_PROPOSAL_KIND);
    expect(created.id).not.toBe(c8Id);
    expect(created.issuedCode.startsWith("ISS-")).toBe(true);
    expect(issuedIdentityDistinctFromC8(created.id, c8Id)).toBe(true);
    expect(created.immutable).toBe(true);
    expect(created.clientSafe.issuingEntity).toBe(ISSUING_ENTITY_SEDMC);
    expect(created.clientSafe.clientSellingPrice).toBe(1450);
    expect(created.clientSafe.currency).toBe("USD");
    expect(created.clientSafe.nights).toBe(14);
    expect(created.clientSafe.itinerary[0]?.items.map((i) => i.title)).toEqual(["Transfer"]);
    expect(JSON.stringify(created.clientSafe)).not.toMatch(/sup-internal|rate-internal|Supplier cost line/);
    expect(issuedClientSafeContainsForbidden(created.clientSafe as unknown as Record<string, unknown>)).toBe(false);
    expect(() => {
      (created.clientSafe as { clientSellingPrice: number }).clientSellingPrice = 1;
    }).toThrow();
    prg.title = "Mutated later";
    expect(created.clientSafe.programmeTitle).toBe("Issued itinerary");
  });

  it("does not issue without authorized commercial approval or from a non-final programme", () => {
    const issuer = principal(["finance.member"]);
    const denied = createIssuedProposal({
      tenantId: "t1",
      programme: programme("final"),
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 1450,
      issuedBy: issuer,
      approvalAuthority: "ceo_md",
    });
    expect(denied).toEqual({ error: "commercial_issue_approval_required" });

    const notFinal = createIssuedProposal({
      tenantId: "t1",
      programme: programme("draft"),
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 1450,
      issuedBy: principal(["commercial_director"]),
      approvalAuthority: "commercial_director",
    });
    expect(notFinal).toEqual({ error: "programme_not_final" });
  });

  it("strips forbidden commercial internals from the client-safe representation", () => {
    const leaked = pickIssuedClientSafe({
      issuingEntity: ISSUING_ENTITY_SEDMC,
      programmeCode: "PRG-X",
      programmeTitle: "X",
      commercialVersionLabel: "final",
      itinerary: [],
      currency: "USD",
      clientSellingPrice: 2000,
      supplierCost: 1000,
      totalCost: 1000,
      grossProfit: 800,
      grossMargin: 0.4,
      markupPercent: 25,
      fileFeeAmount: 200,
      taxAmount: 50,
      fxRate: 2500,
      approvalRequestId: "apr-1",
      costLines: [{ total: 1 }],
      snapshot: { totalCost: 1 },
      marginFloorExceptionReason: "secret",
    });
    expect(leaked).toEqual({
      issuingEntity: ISSUING_ENTITY_SEDMC,
      programmeCode: "PRG-X",
      programmeTitle: "X",
      commercialVersionLabel: "final",
      itinerary: [],
      currency: "USD",
      clientSellingPrice: 2000,
    });
    expect(issuedClientSafeContainsForbidden(leaked as unknown as Record<string, unknown>)).toBe(false);
    expect(issuedClientSafeContainsForbidden({ clientSellingPrice: 1, supplierCost: 9 })).toBe(true);
  });

  it("permits same-day programmes with nights = 0", () => {
    expect(programmeNightCount("2026-06-10", "2026-06-10")).toBe(0);
    const prg = programme("final");
    prg.startDate = "2026-06-10";
    prg.endDate = "2026-06-10";
    const view = buildIssuedClientSafeRepresentation({
      programme: prg,
      days: [],
      items: [],
      currency: "USD",
      clientSellingPrice: 1450,
    });
    expect(view.nights).toBe(0);
  });

  it("does not add RFP stages or treat C8 sent as delivery", () => {
    expect([...RFP_WORKFLOW_STAGES]).toEqual([
      "intake",
      "programme",
      "costing",
      "approval",
      "proposal",
      "sent",
      "closed",
    ]);
    expect(PROPOSAL_STATUSES).toContain("sent");
    expect(ISSUED_PROPOSAL_DELIVERY).toEqual({
      implemented: false,
      pdf: false,
      email: false,
      dispatch: false,
      clientAccess: false,
    });
  });
});
