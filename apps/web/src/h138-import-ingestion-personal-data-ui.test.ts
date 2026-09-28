import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CRM_IMPORT_ENTITY_OPTIONS } from "./lib/crm-api";
import { IMPORT_ENTITY_OPTIONS } from "./lib/suppliers-api";

const src = (...parts: string[]) => readFileSync(path.join(__dirname, ...parts), "utf8");

describe("H-138 import/ingestion personal-data UI", () => {
  it("does not offer contact or supplier_contact as import entity types", () => {
    expect(CRM_IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toEqual(["organization"]);
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).not.toContain("supplier_contact");
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toContain("supplier");
  });

  it("does not expose a query or hard-coded supported contact import path in import modals", () => {
    const crmModal = src("components", "commercial", "CrmImportModal.tsx");
    expect(crmModal).not.toMatch(/entityType=contact/);
    expect(crmModal).not.toMatch(/searchParams.*contact/);
    expect(crmModal).toMatch(/organization/);
    const supModal = src("components", "commercial", "SupplierImportModal.tsx");
    expect(supModal).not.toMatch(/supplier_contact/);
    expect(supModal).not.toMatch(/then contacts/);
  });
});
