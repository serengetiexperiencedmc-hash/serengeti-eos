import { describe, expect, it } from "vitest";
import {
  SUPPLIER_RATE_SOURCE_CLASSES,
  SUPPLIER_RATE_TYPE_KEYS,
} from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { hydrateF2CommercialFacts } from "../src/commercial-facts/persist.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";

const P = TEST_BOOTSTRAP_SECRETS;
const AT = "2026-09-21";

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
  rateCode: string,
) {
  const created = await app.inject({
    method: "POST",
    url: `/v1/suppliers/${supplierId}/rates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rateCode,
      rateName: rateCode,
      rateType: "per_room_per_night",
      amount: 250,
      currency: "USD",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      status: "active",
    },
  });
  expect(created.statusCode).toBe(201);
  return created.json().rate as {
    id: string;
    rateCode: string;
    rateType: string;
    amount: number;
    currency: string;
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
    itemIdentity: "SGL-BB",
    ...overrides,
  };
}

function putIdentity(
  app: ReturnType<typeof buildServer>,
  token: string | undefined,
  supplierId: string,
  rateId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: "PUT",
    url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
    headers: token ? { authorization: `Bearer ${token}` } : {},
    payload,
  });
}

function getIdentity(
  app: ReturnType<typeof buildServer>,
  token: string | undefined,
  supplierId: string,
  rateId: string,
) {
  return app.inject({
    method: "GET",
    url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts?at=${AT}`,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

describe("H-114 bounded rate identity overlay", () => {
  it("accepts a valid overlay identity and keeps amount, FX, and winner out of identity", async () => {
    const store = seedStore("h114-identity");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-01");
    const rate = await createRate(app, token, supplier.id, "H114-SGL");

    const put = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ amount: 999, preferredInConflict: true, fxRate: 1.1 }),
    );
    expect(put.statusCode).toBe(200);
    const identity = put.json().identity;
    expect(identity.sourceClass).toBe("direct_supplier_contract");
    expect(identity.rateType).toBe("negotiated_contracted");
    expect(identity.originalCurrency).toBe("TZS");
    expect(identity.validFrom).toBe("2026-01-01");
    expect(identity.validTo).toBe("2026-12-31");
    expect(identity.supplierId).toBe(supplier.id);
    expect(identity.supplierCode).toBe(supplier.supplierCode);
    expect(identity.identityId).not.toBe(supplier.id);
    expect(identity.itemIdentity).not.toBe(supplier.supplierCode);
    expect(identity.amountIsNotIdentity).toBe(true);
    expect(identity.legacyAmount).toBe(250);
    expect(identity.legacyCurrency).toBe("USD");
    expect(identity.legacyCurrencyAuthoritativeForF2).toBe(false);
    expect(identity.legacyUnitRateType).toBe("per_room_per_night");
    expect(identity.legacyUnitRateTypeAuthoritativeForF2).toBe(false);
    expect(identity.fxProviderImplemented).toBe(false);
    expect(identity.overlapWinnerInvented).toBe(false);
    expect(identity.preferredInConflictAuthoritativeForF2).toBe(false);
    expect(identity).not.toHaveProperty("amount");
    expect(put.json().overlapResolution).toBe("none");
    expect(put.json().fxProviderImplemented).toBe(false);
    expect(put.json()).not.toHaveProperty("freezeOnSend");
    expect(rate.rateType).toBe("per_room_per_night");
    expect(rate.amount).toBe(250);
  });

  it("accepts all five source classes and all five OR-08 types", async () => {
    const store = seedStore("h114-catalogues");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-CAT");
    const sourceRate = await createRate(app, token, supplier.id, "H114-SRC");
    const typeRate = await createRate(app, token, supplier.id, "H114-TYP");

    for (const [index, sourceClass] of SUPPLIER_RATE_SOURCE_CLASSES.entries()) {
      const put = await putIdentity(
        app,
        token,
        supplier.id,
        sourceRate.id,
        identityPayload({ versionIdentity: index + 1, sourceClass }),
      );
      expect(put.statusCode).toBe(200);
      expect(put.json().identity.sourceClass).toBe(sourceClass);
    }

    for (const [index, rateType] of SUPPLIER_RATE_TYPE_KEYS.entries()) {
      const put = await putIdentity(
        app,
        token,
        supplier.id,
        typeRate.id,
        identityPayload({ versionIdentity: index + 1, rateType }),
      );
      expect(put.statusCode).toBe(200);
      expect(put.json().identity.rateType).toBe(rateType);
    }
  });

  it("rejects invalid identity combinations without inventing replacement catalogues", async () => {
    const store = seedStore("h114-invalid");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-INV");
    const rate = await createRate(app, token, supplier.id, "H114-INV");

    const badSource = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ sourceClass: "website_inferred" }),
    );
    expect(badSource.statusCode).toBe(400);
    expect(badSource.json().reason).toBe("invalid_source_class");
    const badType = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ rateType: "per_room_per_night" }),
    );
    expect(badType.statusCode).toBe(400);
    expect(badType.json().reason).toBe("invalid_or08_rate_type");
    const badCurrency = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ originalCurrency: "TZ" }),
    );
    expect(badCurrency.statusCode).toBe(400);
    expect(badCurrency.json().reason).toBe("invalid_original_currency");
    const badDates = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ validFrom: "2026-12-31", validTo: "2026-01-01" }),
    );
    expect(badDates.statusCode).toBe(400);
    expect(badDates.json().reason).toBe("invalid_validity_dates");
  });

  it("keeps versionIdentity append-only and returns 409 for duplicates", async () => {
    const store = seedStore("h114-version");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-VER");
    const rate = await createRate(app, token, supplier.id, "H114-VER");

    const first = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ versionIdentity: 1 }));
    const second = await putIdentity(
      app,
      token,
      supplier.id,
      rate.id,
      identityPayload({ versionIdentity: 2, originalCurrency: "EUR" }),
    );
    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);

    const duplicate = await putIdentity(app, token, supplier.id, rate.id, identityPayload({ versionIdentity: 1 }));
    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json().reason).toBe("version_identity_exists");

    const listed = await getIdentity(app, token, supplier.id, rate.id);
    expect(listed.json().identities).toHaveLength(2);
    expect(listed.json().identities.map((row: { versionIdentity: number }) => row.versionIdentity)).toEqual([1, 2]);
    expect(listed.json().identities[0].originalCurrency).toBe("TZS");
    expect(listed.json().identities[1].originalCurrency).toBe("EUR");
  });

  it("persists overlay to the F2 sidecar and hydrates after memory clear", async () => {
    const store = seedStore("h114-persist");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-PER");
    const rate = await createRate(app, token, supplier.id, "H114-PER");
    store.dbPool = createF2Dp01MemoryPool();

    const put = await putIdentity(app, token, supplier.id, rate.id, identityPayload());
    expect(put.statusCode).toBe(200);
    expect(put.json().persistence.mode).toBe("f2_dp01_sidecar");
    expect(put.json().persistence.recorded).toBe(true);

    f2FactsMemory(store).rates.clear();
    const afterClear = await getIdentity(app, token, supplier.id, rate.id);
    expect(afterClear.statusCode).toBe(200);
    expect(afterClear.json().identities).toHaveLength(1);
    expect(afterClear.json().identities[0].originalCurrency).toBe("TZS");

    f2FactsMemory(store).rates.clear();
    const hydrated = await hydrateF2CommercialFacts(store.dbPool, store);
    expect(hydrated.rates).toBe(1);
    const afterHydrate = await getIdentity(app, token, supplier.id, rate.id);
    expect(afterHydrate.statusCode).toBe(200);
    expect(afterHydrate.json().identities[0].versionIdentity).toBe(1);
    expect(afterHydrate.json().identities[0].legacyAmount).toBe(250);
    expect(store.supRates.find((row) => row.id === rate.id)?.rateType).toBe("per_room_per_night");
  });

  it("rejects unauthenticated and unauthorized overlay access", async () => {
    const store = seedStore("h114-authz");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const supplier = await createSupplier(app, token, "H114-SUP-AUTH");
    const rate = await createRate(app, token, supplier.id, "H114-AUTH");

    const unauthGet = await getIdentity(app, undefined, supplier.id, rate.id);
    expect(unauthGet.statusCode).toBe(401);
    const unauthPut = await putIdentity(app, undefined, supplier.id, rate.id, identityPayload());
    expect(unauthPut.statusCode).toBe(401);

    const alice = await loginAlice(app);
    const forbiddenGet = await getIdentity(app, alice, supplier.id, rate.id);
    expect(forbiddenGet.statusCode).toBe(403);
    const forbiddenPut = await putIdentity(app, alice, supplier.id, rate.id, identityPayload());
    expect(forbiddenPut.statusCode).toBe(403);
  });
});
