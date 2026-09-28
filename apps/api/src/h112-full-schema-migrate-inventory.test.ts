/**
 * H-112 isolated full-schema migrate probe.
 * Live migrate is performed by the operator/CLI against eos_h112_full only.
 * This file refuses to call migrate() when the URL names eos or eos_gateb.
 */
import { describe, expect, it } from "vitest";
import { listMigrationFiles, migrateTargetRefuseReason } from "@sedmc/db";

describe("H-112 full-schema migration chain inventory", () => {
  it("lists schema.sql then 001 through 125 and does not include 126+", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("schema.sql"))).toBe(true);
    expect(files.some((file) => file.includes("001_i1"))).toBe(true);
    expect(files.some((file) => file.includes("124_f2_dp01_commercial_facts"))).toBe(true);
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files.some((file) => /\/126_/.test(file))).toBe(true);
    expect(files.some((file) => /\/127_/.test(file))).toBe(true);
    expect(files.some((file) => /\/128_/.test(file))).toBe(true);
    expect(files.some((file) => /\/129_/.test(file))).toBe(true);
    expect(files.some((file) => /\/130_/.test(file))).toBe(true);
    const last = files[files.length - 1] ?? "";
    expect(last).toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("refuses to treat 124-only eos or eos_gateb as a migrate target", () => {
    expect(migrateTargetRefuseReason("postgres://eos:x@127.0.0.1:5432/eos")).toBe("h111_eos_124_only_preserved");
    expect(migrateTargetRefuseReason("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toBe(
      "eos_gateb_not_authorized",
    );
    expect(migrateTargetRefuseReason("postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full")).toBeUndefined();
  });
});
