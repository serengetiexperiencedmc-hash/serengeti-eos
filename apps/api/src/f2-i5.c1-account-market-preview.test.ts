import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_MARKET_KEYS,
  COMMERCIAL_MARKET_LABELS,
  PCO_ACCOUNT_TYPE,
} from "@sedmc/kernel";
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

async function createOrg(app: ReturnType<typeof buildServer>, token: string, legalName: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  const organizationTypeId = types.json().items[0].id as string;
  const org = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName, organizationTypeId },
  });
  expect(org.statusCode).toBe(201);
  return org.json().organization.id as string;
}

async function createAccount(
  app: ReturnType<typeof buildServer>,
  token: string,
  organizationId: string,
  accountName: string,
  legacyMarket?: string,
) {
  const created = await app.inject({
    method: "POST",
    url: "/v1/crm/accounts",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      organizationId,
      accountName,
      ...(legacyMarket !== undefined ? { market: legacyMarket } : {}),
    },
  });
  expect(created.statusCode).toBe(201);
  return created.json().account as { id: string; market?: string; accountName: string };
}

async function putFacts(
  app: ReturnType<typeof buildServer>,
  token: string,
  accountId: string,
  payload: { accountType?: string; market?: string },
) {
  return app.inject({
    method: "PUT",
    url: `/v1/crm/accounts/${accountId}/commercial-facts`,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

async function getFacts(app: ReturnType<typeof buildServer>, token: string, accountId: string) {
  return app.inject({
    method: "GET",
    url: `/v1/crm/accounts/${accountId}/commercial-facts`,
    headers: { authorization: `Bearer ${token}` },
  });
}

describe("F2-I5 C1 account type and market (in-memory/preview)", () => {
  it("Test 1 — PCO is distinct from Event Agency", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "PCO Distinct Ltd");
    const account = await createAccount(app, token, orgId, "Cape Town PCO");

    const put = await putFacts(app, token, account.id, { accountType: PCO_ACCOUNT_TYPE });
    expect(put.statusCode).toBe(200);
    const facts = put.json().facts;
    expect(facts.accountType).toBe("pco");
    expect(facts.accountTypeLabel).toBe("PCO");
    expect(facts.isPco).toBe(true);
    expect(facts.accountType).not.toBe("event_agency");
    expect(facts.accountTypeLabel).not.toBe("Event Agency");
    expect(facts.pcoIsDistinctFromEventAgency).toBe(true);

    const eventAgency = await putFacts(app, token, account.id, { accountType: "event_agency" });
    expect(eventAgency.statusCode).toBe(200);
    expect(eventAgency.json().facts.accountType).toBe("event_agency");
    expect(eventAgency.json().facts.accountTypeLabel).toBe("Event Agency");
    expect(eventAgency.json().facts.isPco).toBe(false);

    const pcoAgain = await putFacts(app, token, account.id, { accountType: "PCO" });
    expect(pcoAgain.statusCode).toBe(200);
    expect(pcoAgain.json().facts.accountType).toBe("pco");
    expect(pcoAgain.json().facts.isPco).toBe(true);
    expect(pcoAgain.json().facts.accountType).not.toBe("event_agency");
  });

  it("Test 2 — PCO + South Africa are independently observable", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "PCO SA Ltd");
    const account = await createAccount(app, token, orgId, "Johannesburg PCO");

    const put = await putFacts(app, token, account.id, { accountType: "pco", market: "south_africa" });
    expect(put.statusCode).toBe(200);
    const facts = put.json().facts;
    expect(facts.accountType).toBe("pco");
    expect(facts.accountTypeLabel).toBe("PCO");
    expect(facts.market).toBe("south_africa");
    expect(facts.marketLabel).toBe("South Africa");
    expect(facts.accountTypeIndependentOfMarket).toBe(true);
    expect(facts.marketIndependentOfAccountType).toBe(true);

    const byLabel = await putFacts(app, token, account.id, { market: "South Africa" });
    expect(byLabel.statusCode).toBe(200);
    expect(byLabel.json().facts.market).toBe("south_africa");
    expect(byLabel.json().facts.accountType).toBe("pco");
  });

  it("Test 3 — same account type, different markets", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "PCO Multi-Market Ltd");
    const sa = await createAccount(app, token, orgId, "PCO South Africa desk");
    const uk = await createAccount(app, token, orgId, "PCO UK desk");

    expect((await putFacts(app, token, sa.id, { accountType: "pco", market: "south_africa" })).statusCode).toBe(200);
    expect((await putFacts(app, token, uk.id, { accountType: "pco", market: "united_kingdom" })).statusCode).toBe(200);

    const saFacts = (await getFacts(app, token, sa.id)).json().facts;
    const ukFacts = (await getFacts(app, token, uk.id)).json().facts;
    expect(saFacts.accountType).toBe("pco");
    expect(ukFacts.accountType).toBe("pco");
    expect(saFacts.market).toBe("south_africa");
    expect(ukFacts.market).toBe("united_kingdom");
    expect(ukFacts.marketLabel).toBe("United Kingdom");
    expect(saFacts.accountType).toBe(ukFacts.accountType);
    expect(saFacts.market).not.toBe(ukFacts.market);
  });

  it("Test 4 — same market, different account types", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "SA Mix Ltd");
    const pco = await createAccount(app, token, orgId, "SA PCO");
    const incentive = await createAccount(app, token, orgId, "SA Incentive House");

    expect((await putFacts(app, token, pco.id, { accountType: "pco", market: "south_africa" })).statusCode).toBe(200);
    expect(
      (await putFacts(app, token, incentive.id, { accountType: "incentive_house_agency", market: "south_africa" }))
        .statusCode,
    ).toBe(200);

    const pcoFacts = (await getFacts(app, token, pco.id)).json().facts;
    const incentiveFacts = (await getFacts(app, token, incentive.id)).json().facts;
    expect(pcoFacts.market).toBe("south_africa");
    expect(incentiveFacts.market).toBe("south_africa");
    expect(pcoFacts.accountType).toBe("pco");
    expect(incentiveFacts.accountType).toBe("incentive_house_agency");
    expect(incentiveFacts.accountTypeLabel).toBe(COMMERCIAL_ACCOUNT_TYPE_LABELS.incentive_house_agency);
    expect(pcoFacts.accountType).not.toBe(incentiveFacts.accountType);
  });

  it("Test 5 — all 15 approved markets are accepted", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "Market Catalogue Ltd");
    const account = await createAccount(app, token, orgId, "Catalogue Account");
    expect(COMMERCIAL_MARKET_KEYS).toHaveLength(15);

    for (const market of COMMERCIAL_MARKET_KEYS) {
      const put = await putFacts(app, token, account.id, { accountType: "pco", market });
      expect(put.statusCode).toBe(200);
      expect(put.json().facts.market).toBe(market);
      expect(put.json().facts.marketLabel).toBe(COMMERCIAL_MARKET_LABELS[market]);
      expect(put.json().facts.accountType).toBe("pco");
    }
  });

  it("Test 6 — unsupported market is rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "Invalid Market Ltd");
    const account = await createAccount(app, token, orgId, "Invalid Market Account", "Europe");

    const rejected = await putFacts(app, token, account.id, { market: "Kenya" });
    expect(rejected.statusCode).toBe(400);
    expect(rejected.json().reason).toBe("invalid_market");

    const europe = await putFacts(app, token, account.id, { market: "Europe" });
    expect(europe.statusCode).toBe(400);
    expect(europe.json().reason).toBe("invalid_market");

    const read = await getFacts(app, token, account.id);
    expect(read.statusCode).toBe(200);
    expect(read.json().facts.market).toBeUndefined();
    expect(read.json().facts.legacyCrmMarket).toBe("Europe");
    expect(read.json().facts.legacyCrmMarketAuthoritativeForF2).toBe(false);
  });

  it("Test 7 — unsupported buyer/account type is not a valid OR-03 value", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "Invalid Type Ltd");
    const account = await createAccount(app, token, orgId, "Legacy Type Account");

    for (const invalid of ["mice_agency", "incentive_house", "corporate", "Travel Company"]) {
      const rejected = await putFacts(app, token, account.id, { accountType: invalid });
      expect(rejected.statusCode).toBe(400);
      expect(rejected.json().reason).toBe("invalid_account_type");
    }

    const read = await getFacts(app, token, account.id);
    expect(read.statusCode).toBe(200);
    expect(read.json().facts.accountType).toBeUndefined();
    expect(read.json().facts.or03Authoritative).toBe(true);
  });

  it("Test 8 — existing C1 account create/read remains intact and C2 can observe C1", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await createOrg(app, token, "Existing C1 Ltd");
    const account = await createAccount(app, token, orgId, "Global Travel Account", "Europe");

    const legacyGet = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${account.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(legacyGet.statusCode).toBe(200);
    expect(legacyGet.json().account.accountName).toBe("Global Travel Account");
    expect(legacyGet.json().account.market).toBe("Europe");
    expect(legacyGet.json().account.accountType).toBeUndefined();

    const factsPut = await putFacts(app, token, account.id, { accountType: "pco", market: "south_africa" });
    expect(factsPut.statusCode).toBe(200);

    const afterLegacy = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${account.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(afterLegacy.json().account.market).toBe("Europe");

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-F2I5-0001",
        title: "C1 observed from C2",
        organizationId: orgId,
        accountId: account.id,
        programmeSummary: "Northern Circuit",
        paxCount: 20,
      },
    });
    expect(opp.statusCode).toBe(201);

    const oppFacts = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opp.json().opportunity.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(oppFacts.statusCode).toBe(200);
    expect(oppFacts.json().facts.qualificationStatus).toBe("not_yet_assessed");
    expect(oppFacts.json().facts.c1Account.linked).toBe(true);
    expect(oppFacts.json().facts.c1Account.accountId).toBe(account.id);
    expect(oppFacts.json().facts.c1Account.accountType).toBe("pco");
    expect(oppFacts.json().facts.c1Account.market).toBe("south_africa");
    expect(oppFacts.json().facts.primarySource).toBeUndefined();
  });
});
