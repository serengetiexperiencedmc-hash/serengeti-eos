import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

const SUPPLIER_CSV_HEADER =
  "supplierCode,legalName,category,country,status,tradingName,preferredPartner,defaultCurrency";

describe("C4 supplier import API", () => {
  it("lists C4 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("014_c4_supplier"))).toBe(true);
  });

  it("validates and executes supplier master CSV import", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const csv = [
      SUPPLIER_CSV_HEADER,
      "LOD-SERONERA-SOP,Seronera Safari Lodge Ltd,accommodation,TZ,active,Seronera Safari Lodge,true,USD",
      "VEH-SEDMC-LC200,SEDMC Land Cruiser Fleet,vehicle_hire,TZ,active,,false,USD",
    ].join("\n");

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "pilot-migration", entityType: "supplier", csv },
    });
    expect(created.statusCode).toBe(201);
    const batchId = created.json().batch.id;

    const validated = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.statusCode).toBe(200);
    expect(validated.json().batch.status).toBe("validated");
    expect(validated.json().batch.validCount).toBe(2);

    const executed = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "sup-import-1" },
    });
    expect(executed.statusCode).toBe(200);
    expect(executed.json().batch.status).toBe("committed");
    expect(store.supSuppliers.filter((s) => s.importBatchId === batchId)).toHaveLength(2);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/suppliers?category=accommodation",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items).toHaveLength(1);
    expect(listed.json().items[0].supplierCode).toBe("LOD-SERONERA-SOP");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/suppliers/${store.supSuppliers[0]!.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().supplier.legalName).toBe("Seronera Safari Lodge Ltd");
  });

  it("imports contacts and rates after suppliers exist", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const supplierCsv = [
      SUPPLIER_CSV_HEADER,
      "LOD-SERONERA-SOP,Seronera Safari Lodge Ltd,accommodation,TZ,active,,false,USD",
    ].join("\n");

    const supBatch = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "test", entityType: "supplier", csv: supplierCsv },
    });
    const supBatchId = supBatch.json().batch.id;
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${supBatchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${supBatchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "sup-master-1" },
    });

    const contactCsv = [
      "supplierCode,contactRole,givenName,familyName,email,isPrimary",
      "LOD-SERONERA-SOP,reservations,Anna,Mwanga,anna@example.co.tz,true",
    ].join("\n");

    const contactBatch = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "test", entityType: "supplier_contact", csv: contactCsv },
    });
    const contactBatchId = contactBatch.json().batch.id;
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${contactBatchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    const contactExec = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${contactBatchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "sup-contact-1" },
    });
    expect(contactExec.statusCode).toBe(200);
    expect(store.supContacts).toHaveLength(1);

    const rateCsv = [
      "supplierCode,rateCode,rateName,rateType,amount,currency,validFrom,validTo,status",
      "LOD-SERONERA-SOP,DBL-HIGH-2025,Double Room High Season,per_room_per_night,450.00,USD,2025-07-01,2025-10-31,active",
    ].join("\n");

    const rateBatch = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "test", entityType: "supplier_rate", csv: rateCsv },
    });
    const rateBatchId = rateBatch.json().batch.id;
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${rateBatchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    const rateExec = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${rateBatchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "sup-rate-1" },
    });
    expect(rateExec.statusCode).toBe(200);
    expect(store.supRates).toHaveLength(1);

    const supplierId = store.supSuppliers[0]!.id;
    const detail = await app.inject({
      method: "GET",
      url: `/v1/suppliers/${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.json().contacts).toHaveLength(1);
    expect(detail.json().rates).toHaveLength(1);
  });

  it("rejects child import when supplier missing and duplicate suppliers", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const alice = await loginAlice(app);

    const contactCsv = [
      "supplierCode,contactRole,givenName,familyName",
      "MISSING-SUP,reservations,Jane,Doe",
    ].join("\n");
    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "test", entityType: "supplier_contact", csv: contactCsv },
    });
    const validated = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${created.json().batch.id}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.json().batch.status).toBe("failed");
    expect(validated.json().batch.validationResults[0].errors).toContain("supplier_not_found");

    const denied = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${alice}` },
      payload: {
        sourceSystem: "test",
        entityType: "supplier",
        csv: `${SUPPLIER_CSV_HEADER}\nX-1,Test,accommodation,TZ,active,,false,USD`,
      },
    });
    expect(denied.statusCode).toBe(403);
  });

  it("requires idempotency key and blocks execute before validate", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        sourceSystem: "test",
        entityType: "supplier",
        csv: `${SUPPLIER_CSV_HEADER}\nX-2,Test Lodge,accommodation,TZ,active,,false,USD`,
      },
    });
    const batchId = created.json().batch.id;

    const early = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "early" },
    });
    expect(early.statusCode).toBe(409);

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });

    const noKey = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(noKey.statusCode).toBe(400);
  });
});
