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

describe("H-136 Phase A personal-data domain/schema (Dev/Test)", () => {
  it("lists Phase A migration 125 and not 126", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.includes("125_h135_phase1_personal_data_domain"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("keeps authentication and tenant isolation", async () => {
    const app = buildServer({ store: seedStore("h136-auth") });
    await loginCarol(app);
    expect((await app.inject({ method: "GET", url: "/v1/crm/organizations" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/v1/bookings/health" })).statusCode).toBe(401);
  });

  it("refuses A1–A4 person-domain writes after authorize", async () => {
    const app = buildServer({ store: seedStore("h136-person") });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crm/contacts",
          headers,
          payload: { givenName: "Jane", familyName: "Planner" },
        })
      ).json().reason,
    ).toBe(PERSON_DOMAIN_REMOVED);

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/hr/employees",
          headers,
          payload: { givenName: "David", familyName: "Mwangi" },
        })
      ).json().reason,
    ).toBe(PERSON_DOMAIN_REMOVED);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H136-LODGE", legalName: "H136 Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/suppliers/${supplier.json().supplier.id}/contacts`,
          headers,
          payload: { contactRole: "reservations", givenName: "Amina", familyName: "Mwangi" },
        })
      ).json().reason,
    ).toBe(PERSON_DOMAIN_REMOVED);

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/ops/vouchers/generate",
          headers,
          payload: { bookingId: "11111111-1111-4111-8111-111111111111" },
        })
      ).json().reason,
    ).toBe(PERSON_DOMAIN_REMOVED);
  });

  it("preserves commercial org → account → opportunity → RFP → programme → costing → supplier/rate without contact_id", async () => {
    const app = buildServer({ store: seedStore("h136-commercial") });
    const token = await loginCarol(app);
    const headers = { authorization: `Bearer ${token}` };

    const types = await app.inject({ method: "GET", url: "/v1/crm/organization-types", headers });
    const organizationTypeId =
      types.json().items.find((t: { key: string }) => t.key === "mice_agency")?.id ?? types.json().items[0].id;

    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers,
      payload: { legalName: "H136 Commercial Org Ltd", organizationTypeId },
    });
    expect(org.statusCode).toBe(201);
    const organizationId = org.json().organization.id as string;
    expect(org.json().organization.contactId).toBeUndefined();

    const account = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers,
      payload: { organizationId, accountName: "H136 Main Account" },
    });
    expect(account.statusCode).toBe(201);

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers,
      payload: { opportunityCode: "OPP-H136-001", title: "H136 Safari", organizationId, paxCount: 22 },
    });
    expect(opp.statusCode).toBe(201);
    expect(opp.json().opportunity.organizationId).toBe(organizationId);
    expect(opp.json().opportunity.paxCount).toBe(22);
    expect(opp.json().opportunity.contactId).toBeUndefined();
    const opportunityId = opp.json().opportunity.id as string;

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers,
      payload: { rfpCode: "RFP-H136-001", opportunityId, title: "H136 Safari", paxCount: 22 },
    });
    expect(rfp.statusCode).toBe(201);
    expect(rfp.json().rfp.contactId).toBeUndefined();
    const rfpId = rfp.json().rfp.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers,
      payload: { supplierCode: "H136-RATE", legalName: "H136 Rate Lodge", category: "accommodation", country: "TZ" },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers,
      payload: {
        rfpId,
        title: "H136 Programme",
        days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Lodge", supplierId, supplierLabel: "H136 Rate Lodge" }] }],
      },
    });
    expect(programme.statusCode).toBe(201);

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers,
      payload: {
        programmeId: programme.json().programme.id,
        sellPrice: 50000,
        paxCount: 22,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 20000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);
    expect(sheet.json().sheet.paxCount).toBe(22);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers,
      payload: {
        rateCode: "DBL-H136",
        rateName: "Double",
        rateType: "per_room_per_night",
        amount: 180,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.rateCode).toBe("DBL-H136");
    expect(rate.json().rate.contactId).toBeUndefined();
    expect(rate.json().rate.amount).toBe(180);

    const bookingsHealth = await app.inject({ method: "GET", url: "/v1/bookings/health", headers });
    expect(bookingsHealth.statusCode).toBe(200);
  });
});
