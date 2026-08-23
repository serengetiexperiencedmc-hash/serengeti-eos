/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import {
  normalizeSupplierCode,
  parseCsv,
  supplierImportRowDuplicateKey,
  validateSupplierContactImportRow,
  validateSupplierContentBlockImportRow,
  validateSupplierImportRow,
  validateSupplierRateImportRow,
  validateSupplierSeasonImportRow,
} from "./supplier-import.js";

describe("supplier-import", () => {
  it("normalizes supplier codes to uppercase", () => {
    expect(normalizeSupplierCode("lod-seronera-sop")).toBe("LOD-SERONERA-SOP");
  });

  it("validates a supplier master row", () => {
    const result = validateSupplierImportRow({
      supplierCode: "lod-seronera-sop",
      legalName: "Seronera Safari Lodge Ltd",
      category: "accommodation",
      country: "TZ",
      status: "active",
    });
    expect(result).toMatchObject({
      supplierCode: "LOD-SERONERA-SOP",
      legalName: "Seronera Safari Lodge Ltd",
      category: "accommodation",
      country: "TZ",
      status: "active",
      classification: "Confidential",
    });
  });

  it("rejects invalid supplier category", () => {
    const result = validateSupplierImportRow({
      supplierCode: "X",
      legalName: "Test",
      category: "hotels",
      country: "TZ",
      status: "active",
    });
    expect(result).toEqual({ errors: ["invalid_supplierCode", "invalid_category"] });
  });

  it("validates supplier contact row", () => {
    const result = validateSupplierContactImportRow({
      supplierCode: "LOD-SERONERA-SOP",
      contactRole: "reservations",
      givenName: "Anna",
      familyName: "Mwanga",
      isPrimary: "true",
    });
    expect(result).toMatchObject({
      supplierCode: "LOD-SERONERA-SOP",
      contactRole: "reservations",
      isPrimary: true,
    });
  });

  it("validates supplier rate row and date order", () => {
    const result = validateSupplierRateImportRow({
      supplierCode: "LOD-SERONERA-SOP",
      rateCode: "DBL-HIGH-2025",
      rateName: "Double Room - High Season",
      rateType: "per_room_per_night",
      amount: "450.00",
      currency: "USD",
      validFrom: "2025-07-01",
      validTo: "2025-10-31",
      status: "active",
    });
    expect(result).toMatchObject({ amount: 450, currency: "USD" });

    const badDates = validateSupplierRateImportRow({
      supplierCode: "LOD-SERONERA-SOP",
      rateCode: "BAD",
      rateName: "Bad",
      rateType: "flat_fee",
      amount: "100",
      currency: "USD",
      validFrom: "2025-12-01",
      validTo: "2025-01-01",
      status: "active",
    });
    expect(badDates).toEqual({ errors: ["validTo_before_validFrom"] });
  });

  it("parses content block tags from pipe-separated string", () => {
    const result = validateSupplierContentBlockImportRow({
      supplierCode: "LOD-SERONERA-SOP",
      blockCode: "DESC-OVERVIEW",
      blockType: "description",
      body: "Nestled in the heart of the Serengeti.",
      tags: "safari|luxury|serengeti",
      status: "approved",
    });
    expect(result).toMatchObject({
      tags: ["safari", "luxury", "serengeti"],
      status: "approved",
    });
  });

  it("detects duplicate keys within import batch", () => {
    const row = validateSupplierImportRow({
      supplierCode: "LOD-SERONERA-SOP",
      legalName: "Seronera Safari Lodge Ltd",
      category: "accommodation",
      country: "TZ",
      status: "active",
    });
    if ("errors" in row) throw new Error("expected valid row");
    const key = supplierImportRowDuplicateKey("supplier", row);
    expect(key).toBe("LOD-SERONERA-SOP");
  });

  it("validates a season catalogue row and rejects inverted dates", () => {
    const result = validateSupplierSeasonImportRow({
      seasonCode: "high-2029",
      label: "High Season 2029",
      validFrom: "2029-07-01",
      validTo: "2029-10-31",
    });
    expect(result).toMatchObject({
      seasonCode: "HIGH-2029",
      label: "High Season 2029",
      validFrom: "2029-07-01",
      validTo: "2029-10-31",
    });

    const badDates = validateSupplierSeasonImportRow({
      seasonCode: "HIGH-2029",
      label: "High Season 2029",
      validFrom: "2029-12-01",
      validTo: "2029-01-01",
    });
    expect(badDates).toEqual({ errors: ["validTo_before_validFrom"] });
  });

  it("parses sample suppliers csv header", () => {
    const csv = `supplierCode,legalName,category,country,status
LOD-SERONERA-SOP,Seronera Safari Lodge Ltd,accommodation,TZ,active`;
    const parsed = parseCsv(csv);
    expect("error" in parsed).toBe(false);
    if ("error" in parsed) return;
    expect(parsed.headers).toContain("supplierCode");
    expect(parsed.rows).toHaveLength(1);
  });
});
