import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CRM_IMPORT_ENTITY_OPTIONS, CRM_PAGE_TABS } from "./lib/crm-api";
import { navItems } from "./lib/mock-data";
import { OPS_BOOKING_TABS } from "./lib/ops-api";
import { IMPORT_ENTITY_OPTIONS } from "./lib/suppliers-api";
import HrPage from "./app/commercial/hr/page";
import HrCertificationsPage from "./app/commercial/hr/certifications/page";

const src = (...parts: string[]) => readFileSync(path.join(__dirname, ...parts), "utf8");

function navHrefs(): string[] {
  return navItems.flatMap((section) => section.items.map((item) => item.href));
}

describe("H-138 Phase C personal-data UI", () => {
  it("removes HR navigation and keeps commercial CRM/supplier/ops/privacy routes", () => {
    const hrefs = navHrefs();
    expect(navItems.some((section) => section.section === "People")).toBe(false);
    expect(hrefs).not.toContain("/commercial/hr");
    expect(hrefs).not.toContain("/commercial/hr/certifications");
    expect(hrefs).toContain("/commercial");
    expect(hrefs).toContain("/commercial/crm");
    expect(hrefs).toContain("/commercial/pipeline");
    expect(hrefs).toContain("/commercial/rfps");
    expect(hrefs).toContain("/commercial/programme");
    expect(hrefs).toContain("/commercial/proposals");
    expect(hrefs).toContain("/commercial/suppliers");
    expect(hrefs).toContain("/commercial/bookings");
    expect(hrefs).toContain("/commercial/operations");
    expect(hrefs).toContain("/commercial/privacy");
    expect(hrefs).toContain("/commercial/dsr");
    expect(hrefs).toContain("/commercial/consents");
  });

  it("does not offer CRM person-contact UI while keeping commercial CRM tabs", () => {
    expect([...CRM_PAGE_TABS]).toEqual(["Organizations", "Accounts", "Activities", "Tasks"]);
    expect(CRM_IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toEqual(["organization"]);
    const crmPage = src("app", "commercial", "crm", "page.tsx");
    expect(crmPage).not.toMatch(/listContacts/);
    expect(crmPage).not.toMatch(/activeTab === "Contacts"/);
    expect(crmPage).toMatch(/listOrganizations/);
    expect(crmPage).toMatch(/listAccounts/);
  });

  it("retires HR employee/leave/skills/certification UI without touching auth helpers", () => {
    const hr = renderToStaticMarkup(createElement(HrPage));
    const certs = renderToStaticMarkup(createElement(HrCertificationsPage));
    expect(hr).toContain("retired");
    expect(hr).not.toContain("Create employee");
    expect(hr).not.toContain("Leave type");
    expect(certs).toContain("retired");
    expect(certs).not.toContain("employeeId");
    const session = src("lib", "eos-session.ts");
    expect(session).toContain("sedmc.eos.accessToken");
    expect(session).toContain("/v1/auth/login");
    expect(src("app", "commercial", "hr", "page.tsx")).not.toMatch(/listEmployees/);
    expect(src("app", "commercial", "hr", "certifications", "page.tsx")).not.toMatch(/listHrCertifications/);
  });

  it("retires supplier individual-contact UI while keeping company/rate import options", () => {
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).not.toContain("supplier_contact");
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toContain("supplier");
    expect(IMPORT_ENTITY_OPTIONS.map((opt) => opt.value)).toContain("supplier_rate");
    const suppliers = src("app", "commercial", "suppliers", "page.tsx");
    expect(suppliers).not.toMatch(/createSupplierContact/);
    expect(suppliers).not.toMatch(/\+ Contact/);
    expect(suppliers).toMatch(/createSupplierRate/);
  });

  it("retires guest/manifest/voucher UI while keeping supplier and field ops tabs", () => {
    expect([...OPS_BOOKING_TABS]).toEqual(["suppliers", "field"]);
    const opsBooking = src("app", "commercial", "operations", "[bookingId]", "page.tsx");
    expect(opsBooking).not.toMatch(/Guest Manifest/);
    expect(opsBooking).not.toMatch(/Guest Vouchers/);
    expect(opsBooking).not.toMatch(/addManifestEntry/);
    expect(opsBooking).not.toMatch(/generateVouchers/);
    expect(opsBooking).toMatch(/listSupplierConfirmations/);
    expect(opsBooking).toMatch(/listFieldTasks/);
    const dashboard = src("app", "commercial", "page.tsx");
    expect(dashboard).not.toMatch(/Draft Vouchers/);
    expect(dashboard).not.toMatch(/manifestGuestCount/);
  });

  it("removes DSR subjectLabel and consent person-identifying notes from UI and client types", () => {
    expect(src("app", "commercial", "dsr", "page.tsx")).not.toMatch(/subjectLabel/);
    expect(src("lib", "privacy-api.ts")).not.toMatch(/subjectLabel/);
    expect(src("app", "commercial", "consents", "page.tsx")).not.toMatch(/\bnotes\b/);
    expect(src("lib", "consent-register-api.ts")).not.toMatch(/\bnotes\b/);
    expect(src("app", "commercial", "privacy", "page.tsx")).toMatch(/listProcessingActivities/);
  });

  it("does not introduce browser-side person-data persistence", () => {
    const session = src("lib", "eos-session.ts");
    expect(session).toMatch(/sedmc\.eos\.accessToken/);
    expect(session).toMatch(/sedmc\.eos\.email/);
    expect(session).not.toMatch(/guest|crm_contact|employee|supplier_contact/i);
    const fieldCache = src("lib", "field-offline-cache.ts");
    expect(fieldCache).toMatch(/sedmc-field-cache:/);
    expect(fieldCache).not.toMatch(/guestName|crmContact|hrEmployee|supplierContact/);
    const sync = src("lib", "field-sync-api.ts");
    expect(sync).toMatch(/fieldTasks/);
    expect(sync).not.toMatch(/guestName|manifest_entry/);
  });
});
