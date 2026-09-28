import { listMigrationFiles } from "@sedmc/db";
import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { PERSON_DOMAIN_REMOVED } from "../src/personal-data-phase1.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  expect(res.statusCode).toBe(200);
  expect(res.json().accessToken).toBeTruthy();
  return res.json().accessToken as string;
}

describe("H-135 Phase 1 personal-data domain/schema (Dev/Test)", () => {
  it("lists migration 125 after 124", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
  });

  it("keeps operator authentication intact", async () => {
    const app = buildServer({ store: seedStore("h135-auth") });
    const token = await loginCarol(app);
    expect(token.length).toBeGreaterThan(8);
    const unauth = await app.inject({ method: "GET", url: "/v1/crm/organizations" });
    expect(unauth.statusCode).toBe(401);
  });

  it("refuses guest/manifest/voucher, CRM contact, HR, and supplier-contact writes after authorize", async () => {
    const store = seedStore("h135-person");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const contact = await app.inject({
      method: "POST",
      url: "/v1/crm/contacts",
      headers,
      payload: { givenName: "Jane", familyName: "Planner", email: "jane@example.com" },
    });
    expect(contact.statusCode).toBe(400);
    expect(contact.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    const listed = await app.inject({ method: "GET", url: "/v1/crm/contacts", headers });
    expect(listed.statusCode).toBe(400);
    expect(listed.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const employee = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers,
      payload: { givenName: "David", familyName: "Mwangi" },
    });
    expect(employee.statusCode).toBe(400);
    expect(employee.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    const employees = await app.inject({ method: "GET", url: "/v1/hr/employees", headers });
    expect(employees.statusCode).toBe(400);
    expect(employees.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: {
        supplierCode: "H135-LODGE",
        legalName: "H135 Lodge Ltd",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;
    const supplierContact = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contacts`,
      headers,
      payload: { contactRole: "reservations", givenName: "Amina", familyName: "Mwangi" },
    });
    expect(supplierContact.statusCode).toBe(400);
    expect(supplierContact.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const manifest = await app.inject({
      method: "POST",
      url: "/v1/ops/manifests/by-booking/11111111-1111-4111-8111-111111111111",
      headers,
    });
    expect(manifest.statusCode).toBe(400);
    expect(manifest.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const vouchers = await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/generate",
      headers,
      payload: { bookingId: "11111111-1111-4111-8111-111111111111" },
    });
    expect(vouchers.statusCode).toBe(400);
    expect(vouchers.json().reason).toBe(PERSON_DOMAIN_REMOVED);
  });

  it("preserves the commercial organization → account → opportunity → programme → RFP → supplier/rate path", async () => {
    const store = seedStore("h135-commercial");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const types = await app.inject({ method: "GET", url: "/v1/crm/organization-types", headers });
    const organizationTypeId = types.json().items.find((t: { key: string }) => t.key === "mice_agency")?.id
      ?? types.json().items[0].id;

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers,
      payload: { legalName: "H135 Commercial Org Ltd", organizationTypeId },
    });
    expect(org.statusCode).toBe(201);
    const organizationId = org.json().organization.id as string;

    const account = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers,
      payload: { organizationId, accountName: "H135 Main Account" },
    });
    expect(account.statusCode).toBe(201);

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers,
      payload: { opportunityCode: "OPP-H135-001", title: "H135 Safari", organizationId, paxCount: 40 },
    });
    expect(opp.statusCode).toBe(201);
    const opportunityId = opp.json().opportunity.id as string;

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers,
      payload: { rfpCode: "RFP-H135-001", opportunityId, title: "H135 Safari", paxCount: 40 },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: {
        supplierCode: "H135-RATE",
        legalName: "H135 Rate Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers,
      payload: {
        rfpId,
        title: "H135 Programme",
        days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Lodge", supplierId, supplierLabel: "H135 Rate Lodge" }] }],
      },
    });
    expect(programme.statusCode).toBe(201);
    const programmeId = programme.json().programme.id as string;

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers,
      payload: {
        programmeId,
        sellPrice: 100000,
        paxCount: 40,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 40000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers,
      payload: {
        rateCode: "DBL-H135",
        rateName: "Double",
        rateType: "per_room_per_night",
        amount: 300,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.amount).toBe(300);
  });

  it("does not persist DSR subject labels or consent notes", async () => {
    const app = buildServer({ store: seedStore("h135-dsr") });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const dsr = await app.inject({
      method: "POST",
      url: "/v1/privacy/dsrs",
      headers,
      payload: { requestType: "access", subjectLabel: "Must not store", note: "Case only" },
    });
    expect(dsr.statusCode).toBe(201);
    expect(dsr.json().dsr.subjectLabel).toBeUndefined();
    expect(JSON.stringify(dsr.json())).not.toContain("Must not store");

    const consent = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers,
      payload: { title: "Catalogue row", notes: "Must not store consent notes" },
    });
    expect(consent.statusCode).toBe(201);
    expect(consent.json().consent.notes).toBeUndefined();
    expect(JSON.stringify(consent.json())).not.toContain("Must not store consent notes");
  });
});
