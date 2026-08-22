import { describe, expect, it } from "vitest";
import {
  buildProposalCode,
  canGenerateProposal,
  canTransitionProposalStatus,
} from "./proposal.js";

describe("proposal kernel", () => {
  it("builds proposal code from RFP code", () => {
    expect(buildProposalCode("RFP-2026-0847")).toBe("PROP-2026-0847");
  });

  it("requires approved commercial approval to generate", () => {
    expect(canGenerateProposal({ hasProgramme: true, hasCostSheet: true, approvalStatus: "pending" }).allowed).toBe(
      false,
    );
    expect(canGenerateProposal({ hasProgramme: true, hasCostSheet: true, approvalStatus: "approved" }).allowed).toBe(
      true,
    );
  });

  it("allows approved to sent and sent to accepted", () => {
    expect(canTransitionProposalStatus("approved", "sent")).toBe(true);
    expect(canTransitionProposalStatus("sent", "accepted")).toBe(true);
    expect(canTransitionProposalStatus("accepted", "sent")).toBe(false);
  });
});
