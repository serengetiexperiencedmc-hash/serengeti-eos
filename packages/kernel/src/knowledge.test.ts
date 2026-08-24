import { describe, expect, it } from "vitest";
import { canTransitionDocument, isValidDocumentType, nextDocumentCode } from "./knowledge.js";

describe("I19 Knowledge kernel", () => {
  it("sequences document codes and accepts authorized types", () => {
    expect(nextDocumentCode([])).toBe("DOC-0001");
    expect(nextDocumentCode(["DOC-0001"])).toBe("DOC-0002");
    expect(isValidDocumentType("policy")).toBe(true);
    expect(isValidDocumentType("wiki")).toBe(false);
  });

  it("allows publish and retire and rejects illegal transitions", () => {
    expect(canTransitionDocument("draft", "publish")).toEqual({ allowed: true, next: "authoritative" });
    expect(canTransitionDocument("authoritative", "retire")).toEqual({ allowed: true, next: "retired" });
    expect(canTransitionDocument("draft", "retire")).toEqual({ allowed: true, next: "retired" });
    expect(canTransitionDocument("retired", "publish").allowed).toBe(false);
    expect(canTransitionDocument("authoritative", "publish").allowed).toBe(false);
  });
});
