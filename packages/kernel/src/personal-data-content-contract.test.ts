import { describe, expect, it } from "vitest";
import { findPersonDomainObjectKeys, isPersonDomainDocumentFilename } from "./personal-data-content-contract.js";

describe("H-140 personal-data content contract", () => {
  it("finds retired person-domain object keys and ignores commercial keys", () => {
    expect(findPersonDomainObjectKeys({ accountType: "pco", market: "uk" })).toEqual([]);
    expect(findPersonDomainObjectKeys({ givenName: "Jane", familyName: "Planner" })).toEqual(
      expect.arrayContaining(["givenName", "familyName"]),
    );
    expect(findPersonDomainObjectKeys({ nested: { guestName: "x" } })).toEqual(["guestName"]);
  });

  it("does not treat string values as keys", () => {
    expect(findPersonDomainObjectKeys({ notes: "Call Jane the planner about the RFP" })).toEqual([]);
  });

  it("flags explicit identity-document filenames only", () => {
    expect(isPersonDomainDocumentFilename("client-rfp.pdf")).toBe(false);
    expect(isPersonDomainDocumentFilename("passport-scan.pdf")).toBe(true);
    expect(isPersonDomainDocumentFilename("guest-list.xlsx")).toBe(true);
  });
});
