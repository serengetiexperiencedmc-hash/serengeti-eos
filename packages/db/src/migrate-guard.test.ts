/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { migrateTargetRefuseReason } from "./migrate-guard.js";

describe("H-112 migrate target guard", () => {
  it("refuses the validated 124-only eos catalog", () => {
    expect(migrateTargetRefuseReason("postgres://eos:eos-dev-only@127.0.0.1:5432/eos")).toBe(
      "h111_eos_124_only_preserved",
    );
  });

  it("refuses eos_gateb", () => {
    expect(migrateTargetRefuseReason("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toBe(
      "eos_gateb_not_authorized",
    );
  });

  it("allows the isolated H-112 full-schema catalog", () => {
    expect(migrateTargetRefuseReason("postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full")).toBeUndefined();
    expect(migrateTargetRefuseReason("postgres://eos:eos-dev-only@127.0.0.1:5432/eos_h112_full")).toBeUndefined();
  });
});
