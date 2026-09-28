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

describe("H-136 Phase 2 personal-data API/domain-surface (Dev/Test)", () => {
  it("keeps authentication on retired person APIs and commercial surfaces", async () => {
    const app = buildServer({ store: seedStore("h136-p2-auth") });
    await loginCarol(app);
    expect((await app.inject({ method: "GET", url: "/v1/crm/contacts" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/hr/employees" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/ops/vouchers" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/crm/organizations" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/bookings/health" })).statusCode).toBe(401);
  });

  it("retires person-domain reads and writes with person_domain_removed after authorize", async () => {
    const store = seedStore("h136-p2-person");
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

    const hrGet = await app.inject({ method: "GET", url: "/v1/hr/employees", headers });
    expect(hrGet.statusCode).toBe(400);
    expect(hrGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const leaveGet = await app.inject({ method: "GET", url: "/v1/hr/leave", headers });
    expect(leaveGet.statusCode).toBe(400);
    expect(leaveGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const certGet = await app.inject({ method: "GET", url: "/v1/hr/certifications", headers });
    expect(certGet.statusCode).toBe(400);
    expect(certGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const voucherGet = await app.inject({ method: "GET", url: "/v1/ops/vouchers", headers });
    expect(voucherGet.statusCode).toBe(400);
    expect(voucherGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const manifestGet = await app.inject({
      method: "GET",
      url: "/v1/ops/manifests/by-booking/11111111-1111-4111-8111-111111111111",
      headers,
    });
    expect(manifestGet.statusCode).toBe(400);
    expect(manifestGet.json().reason).toBe(PERSON_DOMAIN_REMOVED);

    const searchContactOnly = await app.inject({
      method: "GET",
      url: "/v1/crm/search?q=jane&types=contact",
      headers,
    });
    expect(searchContactOnly.statusCode).toBe(400);
    expect(searchContactOnly.json().reason).toBe(PERSON_DOMAIN_REMOVED);
  });

  it("does not return supplier individual contacts on the supplier company API", async () => {
    const store = seedStore("h136-p2-supplier");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H136P2-LODGE", legalName: "H136P2 Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const createdSupplier = store.supSuppliers.find((s) => s.id === supplierId);
    expect(createdSupplier).toBeDefined();
    store.supContacts.push({
      id: "11111111-1111-4111-8111-111111111111",
      tenantId: createdSupplier!.tenantId,
      supplierId,
      contactRole: "reservations",
      givenName: "MustNotReturn",
      familyName: "Person",
      email: "hidden@example.com",
      isPrimary: true,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: createdSupplier!.createdByPrincipalId,
      updatedByPrincipalId: createdSupplier!.updatedByPrincipalId,
    });

    const detail = await app.inject({ method: "GET", url: `/v1/suppliers/${supplierId}`, headers });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().contacts).toEqual([]);
    expect(JSON.stringify(detail.json())).not.toContain("MustNotReturn");
    expect(JSON.stringify(detail.json())).not.toContain("hidden@example.com");
    expect(detail.json().supplier.legalName).toBe("H136P2 Lodge");
  });

  it("does not persist or return DSR subject labels or consent notes", async () => {
    const app = buildServer({ store: seedStore("h136-p2-privacy") });
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

    const listed = await app.inject({ method: "GET", url: "/v1/privacy/dsrs", headers });
    expect(listed.statusCode).toBe(200);
    expect(JSON.stringify(listed.json())).not.toContain("Must not store");
    expect(listed.json().items[0].subjectLabel).toBeUndefined();

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

  it("preserves commercial org → account → opportunity → RFP → programme → costing → supplier/rate and bookings health", async () => {
    const app = buildServer({ store: seedStore("h136-p2-commercial") });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const types = await app.inject({ method: "GET", url: "/v1/crm/organization-types", headers });
    const organizationTypeId =
      types.json().items.find((t: { key: string }) => t.key === "mice_agency")?.id ?? types.json().items[0].id;

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers,
      payload: { legalName: "H136P2 Commercial Org Ltd", organizationTypeId },
    });
    expect(org.statusCode).toBe(201);
    const organizationId = org.json().organization.id as string;
    expect(org.json().organization.contactId).toBeUndefined();

    const account = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers,
      payload: { organizationId, accountName: "H136P2 Main Account" },
    });
    expect(account.statusCode).toBe(201);

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers,
      payload: { opportunityCode: "OPP-H136P2-001", title: "H136P2 Safari", organizationId, paxCount: 18 },
    });
    expect(opp.statusCode).toBe(201);
    expect(opp.json().opportunity.organizationId).toBe(organizationId);
    expect(opp.json().opportunity.paxCount).toBe(18);
    expect(opp.json().opportunity.contactId).toBeUndefined();
    const opportunityId = opp.json().opportunity.id as string;

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers,
      payload: { rfpCode: "RFP-H136P2-001", opportunityId, title: "H136P2 Safari", paxCount: 18 },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H136P2-RATE", legalName: "H136P2 Rate Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers,
      payload: {
        rfpId,
        title: "H136P2 Programme",
        days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Lodge", supplierId, supplierLabel: "H136P2 Rate Lodge" }] }],
      },
    });
    expect(programme.statusCode).toBe(201);

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers,
      payload: {
        programmeId: programme.json().programme.id,
        sellPrice: 40000,
        paxCount: 18,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 18000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);
    expect(sheet.json().sheet.paxCount).toBe(18);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers,
      payload: {
        rateCode: "DBL-H136P2",
        rateName: "Double",
        rateType: "per_room_per_night",
        amount: 190,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.rateCode).toBe("DBL-H136P2");
    expect(rate.json().rate.contactId).toBeUndefined();

    expect((await app.inject({ method: "GET", url: "/v1/bookings/health", headers })).statusCode).toBe(200);
  });
});
