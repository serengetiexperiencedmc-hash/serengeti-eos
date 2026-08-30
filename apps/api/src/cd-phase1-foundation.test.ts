import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { DocumentStorageCollisionError, LocalFsDocumentStorage } from "../src/commercial-documents/storage.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenantSlug: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  return res.json().accessToken as string;
}

async function seedOrgAndRfp(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "CD Client Ltd,corporate,CD Client,TZ"].join("\n");
  const created = await app.inject({
    method: "POST",
    url: "/v1/crm/imports",
    headers: { authorization: `Bearer ${token}` },
    payload: { sourceSystem: "test", entityType: "organization", csv },
  });
  const batchId = created.json().batch.id as string;
  await app.inject({
    method: "POST",
    url: `/v1/crm/imports/${batchId}/validate`,
    headers: { authorization: `Bearer ${token}` },
  });
  await app.inject({
    method: "POST",
    url: `/v1/crm/imports/${batchId}/execute`,
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `cd-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  const orgId = orgs.json().items[0].id as string;
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-CD-${Date.now().toString().slice(-6)}`,
      title: "CD Phase 1 Opportunity",
      organizationId: orgId,
      paxCount: 20,
    },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-CD-${Date.now().toString().slice(-6)}`,
      opportunityId: oppId,
      title: "CD Phase 1 RFP",
      paxCount: 20,
      destinations: "Serengeti",
      source: "email",
      notes: "Intake notes",
    },
  });
  return { orgId, rfpId: rfp.json().rfp.id as string, rfp: rfp.json().rfp };
}

describe("CD Phase 1 commercial foundation", () => {
  it("lists additive migrations 119–122 after 118 and never PQL 109–115", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("118_pr2_sourcing_event_records"))).toBe(true);
    expect(files.some((f) => f.includes("119_cd_commercial_documents"))).toBe(true);
    expect(files.some((f) => f.includes("120_cd_supplier_contracts"))).toBe(true);
    expect(files.some((f) => f.includes("121_cd_hotel_profiles"))).toBe(true);
    expect(files.some((f) => f.includes("122_cd_programme_item_extensions"))).toBe(true);
    expect(files.some((f) => f.includes("109_pql"))).toBe(false);
    expect(files.some((f) => f.includes("115_pql"))).toBe(false);
  });

  it("uploads RFP document with tenant isolation and mime validation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partner = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");
    const { rfpId } = await seedOrgAndRfp(app, carol);

    const pdfB64 = Buffer.from("%PDF-1.4 cd-phase1").toString("base64");
    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/rfps/${rfpId}/documents`,
          headers: { authorization: `Bearer ${alice}` },
          payload: { filename: "rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
        })
      ).statusCode,
    ).toBe(403);

    const badMime = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { filename: "x.exe", mimeType: "application/x-msdownload", contentBase64: pdfB64 },
    });
    expect(badMime.statusCode).toBe(400);
    expect(badMime.json().reason).toBe("mime_not_allowed");

    const ok = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { filename: "client-rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
    });
    expect(ok.statusCode).toBe(201);
    expect(ok.json().document.filename).toBe("client-rfp.pdf");
    expect(ok.json().document.rfpId).toBe(rfpId);
    expect(JSON.stringify(ok.json())).not.toContain("tenantId");

    const list = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/documents`,
      headers: { authorization: `Bearer ${carol}` },
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().items).toHaveLength(1);

    const content = await app.inject({
      method: "GET",
      url: `/v1/commercial-documents/${ok.json().document.id}/content`,
      headers: { authorization: `Bearer ${carol}` },
    });
    expect(content.statusCode).toBe(200);
    expect(Buffer.from(content.json().contentBase64, "base64").toString("utf8")).toContain("%PDF");

    expect(
      (
        await app.inject({
          method: "GET",
          url: `/v1/rfps/${rfpId}/documents`,
          headers: { authorization: `Bearer ${partner}` },
        })
      ).statusCode,
    ).toBe(403);
  });

  it("patches RFP fields and creates typed programme items with versions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const { rfpId } = await seedOrgAndRfp(app, carol);

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { notes: "Updated brief notes", source: "advisor", destinations: "Serengeti, Ngorongoro" },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.json().rfp.notes).toBe("Updated brief notes");
    expect(patched.json().rfp.source).toBe("advisor");

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        rfpId,
        title: "CD Programme",
        days: [{ dayNumber: 1, title: "Arrival", calendarDate: "2026-09-01" }],
      },
    });
    expect(programme.statusCode).toBe(201);
    const programmeId = programme.json().programme.id as string;
    const dayId = programme.json().days[0].id as string;

    const item = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        title: "Lodge night",
        itemType: "accommodation",
        quantity: 10,
        unit: "room_night",
        visibility: "both",
      },
    });
    expect(item.statusCode).toBe(201);
    expect(item.json().item.itemType).toBe("accommodation");
    expect(item.json().item.quantity).toBe(10);

    const itemPatch = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}/items/${item.json().item.id}`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { sortOrder: 0, notes: "Twin rooms preferred" },
    });
    expect(itemPatch.statusCode).toBe(200);
    expect(itemPatch.json().item.notes).toBe("Twin rooms preferred");

    const version = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/versions`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { summary: "Baseline itinerary" },
    });
    expect(version.statusCode).toBe(201);
    expect(version.json().version.snapshot.itemCount).toBe(1);

    const second = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${carol}` },
      payload: { rfpId, title: "Duplicate programme" },
    });
    expect(second.statusCode).toBe(409);
    expect(second.json().reason).toBe("programme_exists_for_rfp");
  });

  it("creates hotel profile, contract versions, and rates linked to contracts", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        supplierCode: "HTL-CD-001",
        legalName: "Serengeti View Lodge",
        category: "accommodation",
        country: "TZ",
        city: "Seronera",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const hotel = await app.inject({
      method: "PUT",
      url: `/v1/suppliers/${supplierId}/hotel-profile`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        propertyName: "Serengeti View Lodge",
        starRating: 4,
        roomCategories: ["Standard Twin", "Family"],
        mealPlans: ["BB", "FB"],
        destinationLabel: "Serengeti",
      },
    });
    expect(hotel.statusCode).toBe(200);
    expect(hotel.json().hotelProfile.roomCategories).toContain("Standard Twin");

    const contract = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contracts`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        contractRef: "CTR-2026-001",
        contractType: "rate_agreement",
        status: "active",
        effectiveFrom: "2026-01-01",
        effectiveTo: "2026-12-31",
        currency: "USD",
      },
    });
    expect(contract.statusCode).toBe(201);
    const contractId = contract.json().contract.id as string;

    const pdfB64 = Buffer.from("%PDF-1.4 contract").toString("base64");
    const doc = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contracts/${contractId}/documents`,
      headers: { authorization: `Bearer ${carol}` },
      payload: { filename: "contract.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
    });
    expect(doc.statusCode).toBe(201);
    expect(doc.json().version.versionNumber).toBe(2);
    expect(doc.json().document.kind).toBe("contract");

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        rateCode: "DBL-BB",
        rateName: "Double BB",
        rateType: "per_room_per_night",
        amount: 350,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-10-31",
        status: "active",
        contractId,
        occupancy: "double",
        mealPlan: "BB",
        blackoutNotes: "Christmas week",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.contractId).toBe(contractId);
    expect(rate.json().rate.mealPlan).toBe("BB");
  });

  it("preserves PR1 and PR2 catalogue surfaces", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const bob = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");

    const pr1 = await app.inject({
      method: "POST",
      url: "/v1/procurement",
      headers: { authorization: `Bearer ${bob}` },
      payload: { title: `PR1 regression ${newId().slice(0, 8)}` },
    });
    expect(pr1.statusCode).toBe(201);
    expect(pr1.json().record.procurementCode).toMatch(/^PRC-/);

    const pr2 = await app.inject({
      method: "POST",
      url: "/v1/sourcing-events",
      headers: { authorization: `Bearer ${bob}` },
      payload: { title: `PR2 regression ${newId().slice(0, 8)}` },
    });
    expect(pr2.statusCode).toBe(201);
    expect(pr2.json().sourcingEvent.code).toMatch(/^SE-/);
    expect(JSON.stringify(pr2.json())).not.toContain("supplierId");
  });

  it("links programme item to supplier rate and builds costing line with supplierRateId", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const { rfpId } = await seedOrgAndRfp(app, carol);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        supplierCode: "HTL-CD-002",
        legalName: "Cost Link Lodge",
        category: "accommodation",
        country: "KE",
      },
    });
    const supplierId = supplier.json().supplier.id as string;
    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        rateCode: "SGL-BB",
        rateName: "Single BB",
        rateType: "per_room_per_night",
        amount: 200,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    const rateId = rate.json().rate.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${carol}` },
      payload: { rfpId, title: "Cost Link Programme", days: [{ dayNumber: 1, title: "Day 1" }] },
    });
    const programmeId = programme.json().programme.id as string;
    const dayId = programme.json().days[0].id as string;
    await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        title: "Lodge",
        itemType: "accommodation",
        supplierId,
        supplierRateId: rateId,
        quantity: 5,
        unit: "room_night",
      },
    });

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${carol}` },
      payload: {
        programmeId,
        currency: "USD",
        markupPercent: 25,
        lineItems: [
          {
            category: "accommodation",
            description: "Lodge nights from rate",
            quantity: 5,
            unitCost: 200,
            supplierId,
            supplierRateId: rateId,
          },
        ],
      },
    });
    expect(sheet.statusCode).toBe(201);
    expect(sheet.json().sheet.totalCost).toBe(1000);
    expect(sheet.json().lineItems[0].lineTotal).toBe(1000);
  });

  it("rejects exclusive filesystem put when storageRef already exists", async () => {
    const root = join(tmpdir(), `eos-cd-phase1-put-${newId()}`);
    const storage = new LocalFsDocumentStorage(root);
    const tenantId = newId();
    const documentId = newId();
    const first = await storage.put({
      tenantId,
      documentId,
      bytes: Buffer.from("one"),
      mimeType: "application/pdf",
    });
    expect(first.storageRef).toBe(`${tenantId}/${documentId}`);
    await expect(
      storage.put({
        tenantId,
        documentId,
        bytes: Buffer.from("two"),
        mimeType: "application/pdf",
      }),
    ).rejects.toBeInstanceOf(DocumentStorageCollisionError);
    const kept = await storage.get(first.storageRef);
    expect(kept?.toString()).toBe("one");
  });
});
