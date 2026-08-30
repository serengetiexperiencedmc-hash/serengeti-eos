import { describe, expect, it } from "vitest";
import {
  canMutateCommercialDocument,
  isAllowedCommercialMime,
  isValidCommercialDocumentKind,
  COMMERCIAL_DOC_MAX_BYTES,
} from "./commercial-document.js";
import {
  canMutateSupplierContract,
  isValidProgrammeItemType,
  isValidSupContractStatus,
  isValidSupContractType,
} from "./supplier-contract.js";

describe("CD Phase 1 commercial document kernel", () => {
  it("allows humans and denies AI actors", () => {
    expect(canMutateCommercialDocument("Human").allowed).toBe(true);
    expect(canMutateCommercialDocument("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
  });

  it("validates kinds and mime allowlist", () => {
    expect(isValidCommercialDocumentKind("rfp")).toBe(true);
    expect(isValidCommercialDocumentKind("brief")).toBe(false);
    expect(isAllowedCommercialMime("application/pdf")).toBe(true);
    expect(isAllowedCommercialMime("application/x-msdownload")).toBe(false);
    expect(COMMERCIAL_DOC_MAX_BYTES).toBe(10 * 1024 * 1024);
  });
});

describe("CD Phase 1 supplier contract kernel", () => {
  it("validates contract and programme item enums", () => {
    expect(isValidSupContractType("rate_agreement")).toBe(true);
    expect(isValidSupContractStatus("active")).toBe(true);
    expect(isValidProgrammeItemType("accommodation")).toBe(true);
    expect(isValidProgrammeItemType("spa")).toBe(false);
    expect(canMutateSupplierContract("Service").allowed).toBe(false);
  });
});
