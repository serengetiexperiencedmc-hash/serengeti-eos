import { describe, expect, it } from "vitest";
import {
  canonicalDuplicatePair,
  CRM_DUPLICATE_SCORE_THRESHOLD,
  scoreContactDuplicatePair,
  scoreOrganizationDuplicatePair,
} from "@sedmc/kernel";
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

async function orgTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  return types.json().items[0].id as string;
}

describe("C1.6 CRM search + duplicate detection", () => {
  it("lists C1.6 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("009_c1_search_duplicates"))).toBe(true);
  });

  describe("search", () => {
    it("finds organizations, contacts, and accounts with deterministic ranking", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Serengeti Safari Co Ltd", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Serengeti", familyName: "Planner", email: "planner@serengeti.example" },
      });
      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Account Host Org", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: org.json().organization.id, accountName: "Serengeti Premium Account" },
      });

      const search = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=serengeti&types=organization&types=contact&types=account",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(search.statusCode).toBe(200);
      const items = search.json().items as Array<{ entityType: string; displayLabel: string }>;
      expect(items.length).toBeGreaterThanOrEqual(3);
      expect(items.some((i) => i.entityType === "organization")).toBe(true);
      expect(items.some((i) => i.entityType === "contact")).toBe(true);
      expect(items.some((i) => i.entityType === "account")).toBe(true);
      expect(search.json().total).toBeUndefined();
    });

    it("rejects empty or too-short queries and paginates deterministically", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      for (let i = 0; i < 3; i++) {
        await app.inject({
          method: "POST",
          url: "/v1/crm/organizations",
          headers: { authorization: `Bearer ${token}` },
          payload: { legalName: `Paginate Org ${i}`, organizationTypeId: typeId },
        });
      }

      const bad = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=a",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(bad.statusCode).toBe(400);

      const page1 = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=paginate&types=organization&limit=2",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(page1.statusCode).toBe(200);
      expect(page1.json().items).toHaveLength(2);
      expect(page1.json().nextCursor).toBeTruthy();

      const page2 = await app.inject({
        method: "GET",
        url: `/v1/crm/search?q=paginate&types=organization&limit=2&cursor=${page1.json().nextCursor}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(page2.json().items).toHaveLength(1);
    });

    it("denies search when principal lacks entity read permissions", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const alice = await loginAlice(app);
      const denied = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=test",
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("C1.11: finds tasks with types=task, deterministic ranking, and classification filtering", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const carol = await loginCarol(app);
      const alicePrincipal = store.principals.get("alice.finance@sedmc.local")!;
      alicePrincipal.permissions = [...alicePrincipal.permissions, "crm:read:task"];
      const alice = await loginAlice(app);

      await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${carol}` },
        payload: { title: "PrefixTaskFollowUp", description: "contains marker xyz" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${carol}` },
        payload: { title: "ExactTaskFollowUp", description: "other" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${carol}` },
        payload: { title: "Restricted Task Hidden", classification: "Restricted" },
      });

      const exact = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=ExactTaskFollowUp&types=task",
        headers: { authorization: `Bearer ${carol}` },
      });
      expect(exact.statusCode).toBe(200);
      expect(exact.json().items).toHaveLength(1);
      expect(exact.json().items[0].entityType).toBe("task");
      expect(exact.json().items[0].displayLabel).toBe("ExactTaskFollowUp");

      const prefix = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=PrefixTask&types=task",
        headers: { authorization: `Bearer ${carol}` },
      });
      expect(prefix.statusCode).toBe(200);
      expect(prefix.json().items.some((i: { displayLabel: string }) => i.displayLabel === "PrefixTaskFollowUp")).toBe(
        true,
      );

      const contains = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=marker&types=task",
        headers: { authorization: `Bearer ${carol}` },
      });
      expect(contains.statusCode).toBe(200);
      expect(contains.json().items.some((i: { matchedField: string }) => i.matchedField === "description")).toBe(true);

      const restricted = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=Restricted+Task&types=task",
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(restricted.statusCode).toBe(200);
      expect(restricted.json().items).toHaveLength(0);
    });
  });

  describe("organization duplicate detection", () => {
    it("scores exact normalized legal names and trading-name cross matches", () => {
      const exact = scoreOrganizationDuplicatePair(
        { legalName: "Acme Corporation Ltd" },
        { legalName: "ACME CORPORATION LLC" },
      );
      expect(exact?.score).toBeGreaterThanOrEqual(CRM_DUPLICATE_SCORE_THRESHOLD);
      expect(exact?.matchReason).toBe("normalized_legal_name_exact");

      const trading = scoreOrganizationDuplicatePair(
        { legalName: "Global Ventures Inc", tradingName: "Safari Experts" },
        { legalName: "Safari Experts", tradingName: "Other Label" },
      );
      expect(trading?.score).toBeGreaterThanOrEqual(CRM_DUPLICATE_SCORE_THRESHOLD);
    });

    it("registers duplicate candidates on create without auto-merge", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Domain Travel Ltd", domain: "domain-travel.example", organizationTypeId: typeId },
      });
      expect(first.statusCode).toBe(201);

      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          legalName: "Unrelated Legal Name GmbH",
          tradingName: "Domain Travel",
          organizationTypeId: typeId,
        },
      });
      expect(second.statusCode).toBe(201);
      expect(store.crmOrganizations).toHaveLength(2);

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(200);
      expect(listed.json().items.length).toBeGreaterThanOrEqual(1);
      expect(listed.json().items[0].status).toBe("PotentialDuplicate");
    });
  });

  describe("contact duplicate detection", () => {
    it("detects phone duplicates but not same-name different org alone", () => {
      const phone = scoreContactDuplicatePair(
        { givenName: "Jane", familyName: "Doe", telephone: "+255712345678", organizationIds: ["org-a"] },
        { givenName: "Jane", familyName: "Doe", mobile: "+255-712-345-678", organizationIds: ["org-b"] },
      );
      expect(phone?.score).toBeGreaterThanOrEqual(CRM_DUPLICATE_SCORE_THRESHOLD);

      const nameOnly = scoreContactDuplicatePair(
        { givenName: "John", familyName: "Smith", organizationIds: ["org-a"] },
        { givenName: "John", familyName: "Smith", organizationIds: ["org-b"] },
      );
      expect(nameOnly).toBeNull();
    });

    it("registers phone duplicate candidates on create", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);

      await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Phone", familyName: "One", telephone: "+255712345678" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Phone", familyName: "Two", mobile: "+255-712-345-678" },
      });

      expect(store.crmDuplicateCandidates.some((c) => c.entityType === "contact")).toBe(true);
    });
  });

  describe("duplicate review", () => {
    it("confirms and dismisses candidates with audit", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Review Org Alpha", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Other Beta", tradingName: "Review Org Alpha", organizationTypeId: typeId },
      });

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates",
        headers: { authorization: `Bearer ${token}` },
      });
      const candidateId = listed.json().items[0].id;

      const confirm = await app.inject({
        method: "POST",
        url: `/v1/crm/duplicates/${candidateId}/review`,
        headers: { authorization: `Bearer ${token}` },
        payload: { decision: "confirm", reason: "Same trading identity" },
      });
      expect(confirm.statusCode).toBe(200);
      expect(confirm.json().candidate.status).toBe("ConfirmedDuplicate");

      const [a, b] = canonicalDuplicatePair(
        listed.json().items[0].entityIdA,
        listed.json().items[0].entityIdB,
      );
      store.crmDuplicateCandidates.push({
        id: "00000000-0000-4000-8000-00000000d001",
        tenantId: store.tenants.values().next().value!.id,
        entityType: "organization",
        entityIdA: a,
        entityIdB: b,
        score: 90,
        status: "PotentialDuplicate",
        detectedAt: new Date().toISOString(),
      });
      const reject = await app.inject({
        method: "POST",
        url: "/v1/crm/duplicates/00000000-0000-4000-8000-00000000d001/review",
        headers: { authorization: `Bearer ${token}` },
        payload: { decision: "reject", reason: "Different entities" },
      });
      expect(reject.statusCode).toBe(200);
      expect(reject.json().candidate.status).toBe("NotDuplicate");
      expect(store.audit.some((a) => a.resourceType === "crm_duplicate_candidate")).toBe(true);
    });

    it("returns 404 for cross-tenant duplicate reads", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Cross Dup Org", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Other", tradingName: "Cross Dup Org", organizationTypeId: typeId },
      });
      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates",
        headers: { authorization: `Bearer ${token}` },
      });
      const candidateId = listed.json().items[0].id;

      const partner = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
      });
      const cross = await app.inject({
        method: "GET",
        url: `/v1/crm/duplicates/${candidateId}`,
        headers: { authorization: `Bearer ${partner.json().accessToken}` },
      });
      expect(cross.statusCode).toBe(404);
    });
  });

  describe("C1.5 regression — note isolation", () => {
    it("returns 404 for cross-tenant contact note list and hides restricted notes from lower clearance", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Note Regression Org", organizationTypeId: typeId },
      });
      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          givenName: "Restricted",
          familyName: "Contact",
          email: "restricted.contact@example.com",
          classification: "Restricted",
        },
      });
      const contactId = contact.json().contact.id;
      await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: { body: "Restricted commercial note", entityType: "contact", entityId: contactId },
      });

      const partner = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
      });
      const crossList = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contactId}/notes`,
        headers: { authorization: `Bearer ${partner.json().accessToken}` },
      });
      expect(crossList.statusCode).toBe(404);

      const openContact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Open", familyName: "Contact", email: "open.contact@example.com" },
      });
      const openId = openContact.json().contact.id;
      await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: { body: "Internal note", entityType: "contact", entityId: openId },
      });

      const search = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=restricted&types=contact",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(search.json().items.some((i: { entityId: string }) => i.entityId === contactId)).toBe(true);
      expect(search.json().total).toBeUndefined();
    });
  });
});
