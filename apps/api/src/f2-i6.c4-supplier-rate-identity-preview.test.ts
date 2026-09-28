import { describe, expect, it } from "vitest";
import {
  SUPPLIER_RATE_SOURCE_CLASSES,
  SUPPLIER_RATE_TYPE_KEYS,
  SUPPLIER_RATE_TYPE_LABELS,
} from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { SUPPLIER_RATE_SOURCE_CLASS_LABELS } from "../src/commercial-facts/rate-identity.js";

const P = TEST_BOOTSTRAP_SECRETS;
const AT = "2026-09-18";

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function createSupplier(app: ReturnType<typeof buildServer>, token: string, supplierCode: string) {
  const created = await app.inject({
    method: "POST",
    url: "/v1/suppliers",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      supplierCode,
      legalName: `${supplierCode} Lodge`,
      category: "accommodation",
      country: "TZ",
      defaultCurrency: "TZS",
    },
  });
  expect(created.statusCode).toBe(201);
  return created.json().supplier as { id: string; supplierCode: string; legalName: string };
}

async function createRate(
  app: ReturnType<typeof buildServer>,
  token: string,
  supplierId: string,
  input: { rateCode: string; amount?: number; currency?: string; validFrom?: string; validTo?: string; seasonLabel?: string },
) {
  const created = await app.inject({
    method: "POST",
    url: `/v1/suppliers/${supplierId}/rates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rateCode: input.rateCode,
      rateName: input.rateCode,
      rateType: "per_room_per_night",
      amount: input.amount ?? 250,
      currency: input.currency ?? "USD",
      validFrom: input.validFrom ?? "2026-01-01",
      validTo: input.validTo ?? "2026-12-31",
      status: "active",
      ...(input.seasonLabel ? { seasonLabel: input.seasonLabel } : {}),
    },
  });
  expect(created.statusCode).toBe(201);
  return created.json().rate as {
    id: string;
    rateCode: string;
    rateType: string;
    amount: number;
    currency: string;
    preferredInConflict?: boolean;
  };
}

function identityPayload(overrides: Record<string, unknown> = {}) {
  return {
    versionIdentity: 1,
    sourceClass: "direct_supplier_contract",
    rateType: "negotiated_contracted",
    originalCurrency: "TZS",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    seasonLabel: "High",
    sourceDate: "2025-11-02",
    verificationDate: "2026-01-15",
    expiry: "2026-12-31",
    itemIdentity: "SGL-BB",
    ...overrides,
  };
}

async function putIdentity(
  app: ReturnType<typeof buildServer>,
  token: string,
  supplierId: string,
  rateId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: "PUT",
    url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

async function getIdentity(
  app: ReturnType<typeof buildServer>,
  token: string,
  supplierId: string,
  rateId: string,
) {
  return app.inject({
    method: "GET",
    url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts?at=${AT}`,
    headers: { authorization: `Bearer ${token}` },
  });
}

async function seedProgramme(app: ReturnType<typeof buildServer>, token: string) {
  const csv = [
    "legalName,organizationTypeKey,tradingName,country",
    "F2 I6 Client Ltd,corporate,F2 I6,United Kingdom",
  ].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i6-org-${batchId}` },
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
    payload: { opportunityCode: "OPP-F2I6-0001", title: "Rate identity safari", organizationId: orgId, paxCount: 20 },
  });
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: "RFP-F2I6-0001", opportunityId: opp.json().opportunity.id, title: "Rate identity RFP", paxCount: 20 },
  });
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpId: rfp.json().rfp.id, title: "Rate identity programme" },
  });
  return prg.json().programme.id as string;
}

describe("F2-I6 C4 supplier-rate identity (in-memory/preview)", () => {
  it("Test 1 — complete rate identity is observable", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-01");
    const rate = await createRate(app, token, supplier.id, { rateCode: "SGL-BB", currency: "USD", amount: 250 });

    const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload());
    expect(put.statusCode).toBe(200);
    const identity = put.json().identity;
    expect(identity.supplierId).toBe(supplier.id);
    expect(identity.supplierCode).toBe("F2I6-SUP-01");
    expect(identity.sourceClass).toBe("direct_supplier_contract");
    expect(identity.sourceClassLabel).toBe(SUPPLIER_RATE_SOURCE_CLASS_LABELS.direct_supplier_contract);
    expect(identity.rateType).toBe("negotiated_contracted");
    expect(identity.rateTypeLabel).toBe("Negotiated / Contracted");
    expect(identity.originalCurrency).toBe("TZS");
    expect(identity.seasonLabel).toBe("High");
    expect(identity.validFrom).toBe("2026-01-01");
    expect(identity.validTo).toBe("2026-12-31");
    expect(identity.sourceDate).toBe("2025-11-02");
    expect(identity.verificationDate).toBe("2026-01-15");
    expect(identity.expiry).toBe("2026-12-31");
    expect(identity.versionIdentity).toBe(1);
    expect(identity.itemIdentity).toBe("SGL-BB");
    expect(identity.amountIsNotIdentity).toBe(true);
    expect(identity.fxProviderImplemented).toBe(false);
    expect(identity.legacyAmount).toBe(250);
  });

  it("Test 2 — five approved source classes remain distinct", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-02");
    expect(SUPPLIER_RATE_SOURCE_CLASSES).toHaveLength(5);

    const seen: string[] = [];
    for (const [index, sourceClass] of SUPPLIER_RATE_SOURCE_CLASSES.entries()) {
      const rate = await createRate(app, token, supplier.id, { rateCode: `SRC-${index + 1}` });
      const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ sourceClass, versionIdentity: 1 }));
      expect(put.statusCode).toBe(200);
      expect(put.json().identity.sourceClass).toBe(sourceClass);
      seen.push(put.json().identity.sourceClass);
    }
    expect(new Set(seen).size).toBe(5);

    const website = await createRate(app, token, supplier.id, { rateCode: "SRC-WEB" });
    const rejected = await putIdentity(app, token, supplier.id, website.id, identityPayload({ sourceClass: "website" }));
    expect(rejected.statusCode).toBe(400);
    expect(rejected.json().reason).toBe("invalid_source_class");
  });

  it("Test 3 — five approved rate types remain distinct", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-03");

    for (const [index, rateType] of SUPPLIER_RATE_TYPE_KEYS.entries()) {
      const rate = await createRate(app, token, supplier.id, { rateCode: `TYP-${index + 1}` });
      const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ rateType, versionIdentity: 1 }));
      expect(put.statusCode).toBe(200);
      expect(put.json().identity.rateType).toBe(rateType);
      expect(put.json().identity.rateTypeLabel).toBe(SUPPLIER_RATE_TYPE_LABELS[rateType]);
    }

    const unitType = await createRate(app, token, supplier.id, { rateCode: "TYP-LEGACY" });
    const rejected = await putIdentity(
      app,
      token,
      supplier.id,
      unitType.id,
      identityPayload({ rateType: "per_room_per_night" }),
    );
    expect(rejected.statusCode).toBe(400);
    expect(rejected.json().reason).toBe("invalid_or08_rate_type");
  });

  it("Test 4 — original currency is preserved without an FX provider", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-04");
    const rate = await createRate(app, token, supplier.id, { rateCode: "TZS-SGL", currency: "TZS", amount: 650000 });
    const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ originalCurrency: "TZS" }));
    expect(put.statusCode).toBe(200);
    expect(put.json().identity.originalCurrency).toBe("TZS");
    expect(put.json().identity.fxProviderImplemented).toBe(false);
    expect(put.json().identity.legacyCurrency).toBe("TZS");
    expect(put.json().identity.legacyCurrencyAuthoritativeForF2).toBe(false);
  });

  it("Test 5 — current, future, and expired validity states are preserved", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-05");

    const current = await createRate(app, token, supplier.id, {
      rateCode: "CUR",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
    });
    const future = await createRate(app, token, supplier.id, {
      rateCode: "FUT",
      validFrom: "2027-01-01",
      validTo: "2027-12-31",
    });
    const expired = await createRate(app, token, supplier.id, {
      rateCode: "EXP",
      validFrom: "2025-01-01",
      validTo: "2025-06-30",
    });

    expect(
      (await putIdentity(app, token, supplier.id, current.id, identityPayload({ validFrom: "2026-01-01", validTo: "2026-12-31" })))
        .statusCode,
    ).toBe(200);
    expect(
      (
        await putIdentity(app, token, supplier.id, future.id, identityPayload({ validFrom: "2027-01-01", validTo: "2027-12-31" }))
      ).statusCode,
    ).toBe(200);
    expect(
      (
        await putIdentity(app, token, supplier.id, expired.id, identityPayload({ validFrom: "2025-01-01", validTo: "2025-06-30" }))
      ).statusCode,
    ).toBe(200);

    expect((await getIdentity(app, token, supplier.id, current.id)).json().identities[0].validityState).toBe("current");
    expect((await getIdentity(app, token, supplier.id, future.id)).json().identities[0].validityState).toBe("future");
    expect((await getIdentity(app, token, supplier.id, expired.id)).json().identities[0].validityState).toBe("expired");
    expect((await getIdentity(app, token, supplier.id, current.id)).json().identities[0].currentlyValid).toBe(true);
    expect((await getIdentity(app, token, supplier.id, future.id)).json().identities[0].currentlyValid).toBe(false);
    expect((await getIdentity(app, token, supplier.id, expired.id)).json().identities[0].currentlyValid).toBe(false);
  });

  it("Test 6 — version identities remain distinguishable and are not overwritten", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-06");
    const rate = await createRate(app, token, supplier.id, { rateCode: "VER-SGL" });

    const v1 = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ versionIdentity: 1, originalCurrency: "TZS" }));
    const v2 = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ versionIdentity: 2, originalCurrency: "EUR" }));
    expect(v1.statusCode).toBe(200);
    expect(v2.statusCode).toBe(200);

    const duplicate = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ versionIdentity: 1 }));
    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json().reason).toBe("version_identity_exists");

    const listed = await getIdentity(app, token, supplier.id, rate.id);
    expect(listed.json().identities).toHaveLength(2);
    expect(listed.json().identities.map((row: { versionIdentity: number }) => row.versionIdentity)).toEqual([1, 2]);
    expect(listed.json().identities[0].originalCurrency).toBe("TZS");
    expect(listed.json().identities[1].originalCurrency).toBe("EUR");
  });

  it("Test 7 — overlapping identities remain distinguishable with no invented winner", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-07");
    const dbl = await createRate(app, token, supplier.id, {
      rateCode: "HIGH-DBL",
      seasonLabel: "High",
      validFrom: "2026-06-01",
      validTo: "2026-10-31",
    });
    const sgl = await createRate(app, token, supplier.id, {
      rateCode: "HIGH-SGL",
      seasonLabel: "High",
      validFrom: "2026-06-01",
      validTo: "2026-10-31",
    });

    await putIdentity(
      app,
      token,
      supplier.id,
      dbl.id,
      identityPayload({ itemIdentity: "HIGH-DBL", validFrom: "2026-06-01", validTo: "2026-10-31" }),
    );
    await putIdentity(
      app,
      token,
      supplier.id,
      sgl.id,
      identityPayload({
        itemIdentity: "HIGH-SGL",
        validFrom: "2026-06-01",
        validTo: "2026-10-31",
        rateType: "trade_net",
      }),
    );

    const dblFacts = await getIdentity(app, token, supplier.id, dbl.id);
    const sglFacts = await getIdentity(app, token, supplier.id, sgl.id);
    expect(dblFacts.json().identities[0].identityId).not.toBe(sglFacts.json().identities[0].identityId);
    expect(dblFacts.json().identities[0].itemIdentity).toBe("HIGH-DBL");
    expect(sglFacts.json().identities[0].itemIdentity).toBe("HIGH-SGL");
    expect(dblFacts.json().overlapResolution).toBe("none");
    expect(sglFacts.json().overlapResolution).toBe("none");
    expect(dblFacts.json().preferredInConflictAuthoritativeForF2).toBe(false);
    expect(dblFacts.json().identities[0].overlapWinnerInvented).toBe(false);
  });

  it("Test 8 — costing consumption observes the in-memory snapshot identity", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const programmeId = await seedProgramme(app, token);
    const supplier = await createSupplier(app, token, "F2I6-SUP-08");
    const rate = await createRate(app, token, supplier.id, { rateCode: "CST-SGL", amount: 200, currency: "USD" });
    expect((await putIdentity(app, token, supplier.id, rate.id, identityPayload({ itemIdentity: "CST-SGL" }))).statusCode).toBe(
      200,
    );

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
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
            supplierId: supplier.id,
            supplierRateId: rate.id,
          },
        ],
      },
    });
    expect(sheet.statusCode).toBe(201);
    const sheetId = sheet.json().sheet.id as string;

    const observed = await app.inject({
      method: "GET",
      url: `/v1/costing/sheets/${sheetId}/rate-identities?at=${AT}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(observed.statusCode).toBe(200);
    expect(observed.json().costSheetVersionSnapshotModified).toBe(false);
    expect(observed.json().fxProviderImplemented).toBe(false);
    expect(observed.json().snapshotIdentity).toBe(`cost-sheet:${sheetId}:v${sheet.json().sheet.currentVersion}`);
    expect(observed.json().lines[0].supplierRateId).toBe(rate.id);
    expect(observed.json().lines[0].or08Authoritative).toBe(true);
    expect(observed.json().lines[0].identities[0].sourceClass).toBe("direct_supplier_contract");
    expect(observed.json().lines[0].identities[0].originalCurrency).toBe("TZS");
    expect(observed.json().lines[0].identities[0].snapshotIdentity).toBe(observed.json().snapshotIdentity);
  });

  it("Test 9 — legacy unit rate type remains non-authoritative for OR-08", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "F2I6-SUP-09");
    const rate = await createRate(app, token, supplier.id, { rateCode: "LEG-SGL", amount: 220, currency: "USD" });
    expect(rate.rateType).toBe("per_room_per_night");

    const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload());
    expect(put.statusCode).toBe(200);
    expect(put.json().identity.rateType).toBe("negotiated_contracted");
    expect(put.json().identity.legacyUnitRateType).toBe("per_room_per_night");
    expect(put.json().identity.legacyUnitRateTypeAuthoritativeForF2).toBe(false);

    const after = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/${supplier.id}/rates/${rate.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { notes: "legacy unit type must remain" },
    });
    expect(after.statusCode).toBe(200);
    expect(after.json().rate.rateType).toBe("per_room_per_night");
    expect(after.json().rate.amount).toBe(220);
  });
});
