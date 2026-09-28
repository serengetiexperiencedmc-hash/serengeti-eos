import { describe, expect, it } from "vitest";
import { CRM_IMPORT_ENTITY_OPTIONS, CRM_PAGE_TABS } from "./lib/crm-api";
import { navItems } from "./lib/mock-data";
import { IMPORT_ENTITY_OPTIONS } from "./lib/suppliers-api";

describe("H-137 Phase 3 personal-data UI", () => {
  it("removes HR person-data navigation", () => {
    const hrefs = navItems.flatMap((section) => section.items.map((item) => item.href));
    expect(navItems.some((section) => section.section === "People")).toBe(false);
    expect(hrefs).not.toContain("/commercial/hr");
    expect(hrefs).not.toContain("/commercial/hr/certifications");
  });

  it("keeps commercial CRM, supplier, operations, and privacy catalogue navigation", () => {
    const hrefs = navItems.flatMap((section) => section.items.map((item) => item.href));
    expect(hrefs).toContain("/commercial/crm");
    expect(hrefs).toContain("/commercial/suppliers");
    expect(hrefs).toContain("/commercial/operations");
    expect(hrefs).toContain("/commercial/privacy");
    expect(hrefs).toContain("/commercial/dsr");
    expect(hrefs).toContain("/commercial/consents");
  });

  it("retires CRM Contacts tab and contact-import entity option", () => {
    expect([...CRM_PAGE_TABS]).toEqual(["Organizations", "Accounts", "Activities", "Tasks"]);
    expect(CRM_IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toEqual(["organization"]);
  });

  it("does not present supplier individual-contact import as a UI option", () => {
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).not.toContain("supplier_contact");
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toContain("supplier");
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toContain("supplier_rate");
  });
});
