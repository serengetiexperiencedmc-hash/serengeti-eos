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
  return res.json().accessToken as string;
}

describe("H-137 Phase B personal-data API/domain-surface (Dev/Test)", () => {
  it("does not add migration 126 and keeps Phase A migration 125 last", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("keeps authentication on retired person APIs and commercial surfaces", async () => {
    const app = buildServer({ store: seedStore("h137-auth") });
    await loginCarol(app);
    expect((await app.inject({ method: "GET", url: "/v1/crm/contacts" })).statusCode).toBe(401);
    expect((await app.inject({ method: "POST", url: "/v1/crm/contacts" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/hr/employees" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/hr/leave" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/ops/vouchers" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/crm/organizations" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/bookings/health" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/proposals/health" })).statusCode).toBe(401);
  });

  it("retires CRM/HR/manifest/voucher person APIs without persisting person records", async () => {
    const store = seedStore("h137-person");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const contactGet = await app.inject({ method: "GET", url: "/v1/crm/contacts", headers });
    expect(contactGet.statusCode).toBe(400);
    expect(contactGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(contactGet.json().items).toBeUndefined();

    const contactPost = await app.inject({
      method: "POST",
      url: "/v1/crm/contacts",
      headers,
      payload: { givenName: "Jane", familyName: "Planner", email: "jane@example.com" },
    });
    expect(contactPost.statusCode).toBe(400);
    expect(contactPost.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.crmContacts).toHaveLength(0);

    const nested = await app.inject({
      method: "GET",
      url: "/v1/crm/contacts/11111111-1111-4111-8111-111111111111/notes",
      headers,
    });
    expect(nested.statusCode).toBe(400);
    expect(nested.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const hrGet = await app.inject({ method: "GET", url: "/v1/hr/employees", headers });
    expect(hrGet.statusCode).toBe(400);
    expect(hrGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    const hrPost = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers,
      payload: { givenName: "David", familyName: "Mwangi" },
    });
    expect(hrPost.statusCode).toBe(400);
    expect(hrPost.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.hrEmployees).toHaveLength(0);

    const leaveGet = await app.inject({ method: "GET", url: "/v1/hr/leave", headers });
    expect(leaveGet.statusCode).toBe(400);
    expect(leaveGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const voucherGet = await app.inject({ method: "GET", url: "/v1/ops/vouchers", headers });
    expect(voucherGet.statusCode).toBe(400);
    expect(voucherGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    const voucherPost = await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/generate",
      headers,
      payload: { bookingId: "11111111-1111-4111-8111-111111111111" },
    });
    expect(voucherPost.statusCode).toBe(400);
    expect(voucherPost.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.opsVouchers).toHaveLength(0);

    const manifestGet = await app.inject({
      method: "GET",
      url: "/v1/ops/manifests/by-booking/11111111-1111-4111-8111-111111111111",
      headers,
    });
    expect(manifestGet.statusCode).toBe(400);
    expect(manifestGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);
  });

  it("retires supplier individual-contact APIs while keeping supplier company and rates", async () => {
    const store = seedStore("h137-supplier");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H137-LODGE", legalName: "H137 Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const contact = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contacts`,
      headers,
      payload: { contactRole: "reservations", givenName: "Amina", familyName: "Mwangi" },
    });
    expect(contact.statusCode).toBe(400);
    expect(contact.json().reason).toBe(PERSON_DOMAIN_REMOVED);
    expect(store.supContacts).toHaveLength(0);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers,
      payload: {
        rateCode: "DBL-H137",
        rateName: "Double",
        rateType: "per_room_per_night",
        amount: 175,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.rateCode).toBe("DBL-H137");
    expect(rate.json().rate.contactId).toBeUndefined();

    const detail = await app.inject({ method: "GET", url: `/v1/suppliers/${supplierId}`, headers });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().contacts).toEqual([]);
    expect(detail.json().supplier.legalName).toBe("H137 Lodge");
  });

  it("does not persist DSR subject labels or consent notes", async () => {
    const app = buildServer({ store: seedStore("h137-privacy") });
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

  it("preserves commercial org → account → opportunity → RFP → programme → costing → supplier/rate plus proposals and document list auth", async () => {
    const app = buildServer({ store: seedStore("h137-commercial") });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const types = await app.inject({ method: "GET", url: "/v1/crm/organization-types", headers });
    const organizationTypeId =
      types.json().items.find((t: { key: string }) => t.key === "mice_agency")?.id ?? types.json().items[0].id;

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers,
      payload: { legalName: "H137 Commercial Org Ltd", organizationTypeId },
    });
    expect(org.statusCode).toBe(201);
    const organizationId = org.json().organization.id as string;
    expect(org.json().organization.contactId).toBeUndefined();

    const account = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers,
      payload: { organizationId, accountName: "H137 Main Account" },
    });
    expect(account.statusCode).toBe(201);

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers,
      payload: { opportunityCode: "OPP-H137-001", title: "H137 Safari", organizationId, paxCount: 16 },
    });
    expect(opp.statusCode).toBe(201);
    expect(opp.json().opportunity.paxCount).toBe(16);
    expect(opp.json().opportunity.contactId).toBeUndefined();
    const opportunityId = opp.json().opportunity.id as string;

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers,
      payload: { rfpCode: "RFP-H137-001", opportunityId, title: "H137 Safari", paxCount: 16 },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;

    const docs = await app.inject({ method: "GET", url: `/v1/rfps/${rfpId}/documents`, headers });
    expect(docs.statusCode).toBe(200);
    expect(Array.isArray(docs.json().items)).toBe(true);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H137-RATE", legalName: "H137 Rate Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers,
      payload: {
        rfpId,
        title: "H137 Programme",
        days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Lodge", supplierId, supplierLabel: "H137 Rate Lodge" }] }],
      },
    });
    expect(programme.statusCode).toBe(201);

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers,
      payload: {
        programmeId: programme.json().programme.id,
        sellPrice: 36000,
        paxCount: 16,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 16000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers,
      payload: {
        rateCode: "DBL-H137-R",
        rateName: "Double",
        rateType: "per_room_per_night",
        amount: 165,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.contactId).toBeUndefined();

    expect((await app.inject({ method: "GET", url: "/v1/bookings/health", headers })).statusCode).toBe(200);
    expect((await app.inject({ method: "GET", url: "/v1/proposals/health", headers })).statusCode).toBe(200);
  });
});
