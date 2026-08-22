import { describe, expect, it } from "vitest";
import { CRM_EVENT_TYPES } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { emitCrmEvent } from "../src/crm/events.js";
import { buildServer } from "../src/server.js";
import { principalById } from "../src/store.js";

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

async function loginPartner(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
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

describe("C1.10 CRM security regression", () => {
  describe("tenant isolation (TI)", () => {
    it("TI-01: cross-tenant organization GET returns 404", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const partner = await loginPartner(app);
      const typeId = await orgTypeId(app, token);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "TI Org Ltd", organizationTypeId: typeId },
      });
      const cross = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${created.json().organization.id}`,
        headers: { authorization: `Bearer ${partner}` },
      });
      expect(cross.statusCode).toBe(404);
    });

    it("TI-02: cross-tenant search returns no foreign results", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const partner = await loginPartner(app);
      const typeId = await orgTypeId(app, token);
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Unique Tenant Search Org", organizationTypeId: typeId },
      });
      const search = await app.inject({
        method: "GET",
        url: "/v1/crm/search?q=Unique+Tenant+Search",
        headers: { authorization: `Bearer ${partner}` },
      });
      expect(search.statusCode).toBe(403);
    });

    it("TI-03: cross-tenant merge attempt returns 404", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const partner = await loginPartner(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Merge TI A", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Merge TI B", organizationTypeId: typeId },
      });
      const merge = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${partner}`, "idempotency-key": "ti-merge" },
        payload: {
          entityType: "organization",
          survivorId: first.json().organization.id,
          duplicateIds: [second.json().organization.id],
          reason: "Cross tenant",
        },
      });
      expect([403, 404]).toContain(merge.statusCode);
    });

    it("TI-04: cross-tenant duplicate queue is empty", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const partner = await loginPartner(app);
      const typeId = await orgTypeId(app, token);
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Dup Queue Org A", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Dup Queue Org B", tradingName: "Dup Queue Org A", organizationTypeId: typeId },
      });
      const cross = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${partner}` },
      });
      expect(cross.statusCode).toBe(403);
    });

    it("TI-05: cross-tenant audit read does not expose Tenant A CRM audit", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const partner = await loginPartner(app);
      const typeId = await orgTypeId(app, token);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Audit TI Org", organizationTypeId: typeId },
      });
      const orgId = created.json().organization.id as string;
      expect(store.audit.some((a) => a.resourceType === "crm_organization" && a.resourceId === orgId)).toBe(true);

      const crossAudit = await app.inject({
        method: "GET",
        url: "/v1/audit-events",
        headers: { authorization: `Bearer ${partner}` },
      });
      expect(crossAudit.statusCode).toBe(403);
    });
  });

  describe("authorization (AZ)", () => {
    it("AZ-01: user without crm:write cannot create organization", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const alice = await loginAlice(app);
      const carol = await loginCarol(app);
      const typeId = await orgTypeId(app, carol);
      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${alice}` },
        payload: { legalName: "Denied Org", organizationTypeId: typeId },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("AZ-02: user without crm:merge cannot merge", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const alice = await loginAlice(app);
      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${alice}`, "idempotency-key": "az-merge" },
        payload: {
          entityType: "organization",
          survivorId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          duplicateIds: ["bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"],
          reason: "Denied",
        },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("AZ-03: lower clearance cannot read restricted contact", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const carol = await loginCarol(app);
      const alicePrincipal = store.principals.get("alice.finance@sedmc.local")!;
      alicePrincipal.permissions = [...alicePrincipal.permissions, "crm:read:contact"];
      const alice = await loginAlice(app);
      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${carol}` },
        payload: {
          givenName: "Restricted",
          familyName: "Contact",
          email: "restricted.az@example.com",
          classification: "Restricted",
        },
      });
      const read = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contact.json().contact.id}`,
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(read.statusCode).toBe(403);
    });

    it("AZ-04: commercial user cannot reassign account owner", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const carol = await loginCarol(app);
      const alice = await loginAlice(app);
      const typeId = await orgTypeId(app, carol);
      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${carol}` },
        payload: { legalName: "Owner Reassign Org", organizationTypeId: typeId },
      });
      const account = await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${carol}` },
        payload: { accountName: "Owner Reassign Account", organizationId: org.json().organization.id },
      });
      expect(account.statusCode).toBe(201);
      const denied = await app.inject({
        method: "POST",
        url: `/v1/crm/accounts/${account.json().account.id}/reassign-owner`,
        headers: { authorization: `Bearer ${alice}` },
        payload: { ownerPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee" },
      });
      expect(denied.statusCode).toBe(403);
    });
  });

  describe("input validation (IN)", () => {
    it("IN-01: oversized legal name returns 400", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const oversized = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "A".repeat(300), organizationTypeId: typeId },
      });
      expect(oversized.statusCode).toBe(400);
    });

    it("IN-02: HTML/script in organization name is rejected", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const script = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "<script>alert(1)</script> Corp", organizationTypeId: typeId },
      });
      expect(script.statusCode).toBe(400);
    });

    it("IN-03: malformed UUID in path returns 400", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const bad = await app.inject({
        method: "GET",
        url: "/v1/crm/organizations/not-a-uuid",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(bad.statusCode).toBe(400);
    });

    it("IN-04: invalid lifecycle transition returns 409", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Invalid Transition Org", organizationTypeId: typeId },
      });
      const invalid = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.json().organization.id}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Active" },
      });
      expect(invalid.statusCode).toBe(409);
    });

    it("IN-05: invalid external system key rejected", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Ext Key Org", organizationTypeId: typeId },
      });
      const invalid = await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          entityType: "organization",
          entityId: org.json().organization.id,
          systemKey: "INVALID KEY!",
          externalId: "X-1",
        },
      });
      expect(invalid.statusCode).toBe(400);
    });
  });

  describe("merge & duplicate (MG)", () => {
    it("MG-01: unauthorized merge returns 403", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const alice = await loginAlice(app);
      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${alice}`, "idempotency-key": "mg-unauth" },
        payload: {
          entityType: "organization",
          survivorId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          duplicateIds: ["bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"],
          reason: "Denied",
        },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("MG-02: merge without confirmed duplicate returns 409", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Unconfirmed A", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Unconfirmed B", organizationTypeId: typeId },
      });
      const merge = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "mg-unconfirmed" },
        payload: {
          entityType: "organization",
          survivorId: first.json().organization.id,
          duplicateIds: [second.json().organization.id],
          reason: "No review",
        },
      });
      expect(merge.statusCode).toBe(409);
    });

    it("MG-03: merge audit contains survivor, losers, and reason", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Audit Merge Survivor", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Audit Merge Dup", tradingName: "Audit Merge Survivor", organizationTypeId: typeId },
      });
      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${token}` },
      });
      const candidateId = listed.json().items[0].id as string;
      await app.inject({
        method: "POST",
        url: `/v1/crm/duplicates/${candidateId}/review`,
        headers: { authorization: `Bearer ${token}` },
        payload: { decision: "confirm", reason: "Confirmed" },
      });
      const survivorId = first.json().organization.id as string;
      const duplicateId = second.json().organization.id as string;
      await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "mg-audit" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Documented merge reason",
          expectedVersions: {
            [survivorId]: first.json().organization.version,
            [duplicateId]: second.json().organization.version,
          },
        },
      });
      const mergeAudit = store.audit.find((a) => a.resourceType === "crm_merge_record");
      expect(mergeAudit).toBeTruthy();
      expect(mergeAudit!.newState).toMatchObject({
        survivorId,
        mergedIds: [duplicateId],
      });
    });

    it("MG-04: stale version merge returns 409", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Stale Merge Survivor", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Stale Merge Dup", tradingName: "Stale Merge Survivor", organizationTypeId: typeId },
      });
      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${token}` },
      });
      const candidateId = listed.json().items[0].id as string;
      await app.inject({
        method: "POST",
        url: `/v1/crm/duplicates/${candidateId}/review`,
        headers: { authorization: `Bearer ${token}` },
        payload: { decision: "confirm", reason: "Confirmed" },
      });
      const survivorId = first.json().organization.id as string;
      const duplicateId = second.json().organization.id as string;
      await app.inject({
        method: "PATCH",
        url: `/v1/crm/organizations/${survivorId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { tradingName: "Updated" },
      });
      const merge = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "mg-stale" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Stale version",
          expectedVersions: { [survivorId]: 1, [duplicateId]: 1 },
        },
      });
      expect(merge.statusCode).toBe(409);
    });
  });

  describe("events & audit (EV/AU)", () => {
    it("EV-01: organization create emits outbox event and audit", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const before = store.outboxEvents.length;
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Event Audit Org", organizationTypeId: typeId },
      });
      expect(store.outboxEvents.length).toBeGreaterThan(before);
      expect(store.outboxEvents.some((e) => e.eventType === CRM_EVENT_TYPES.ORGANIZATION_CREATED)).toBe(true);
      expect(store.audit.some((a) => a.resourceType === "crm_organization")).toBe(true);
    });

    it("EV-02: simulation mode blocks CRM event emission", () => {
      const store = seedStore("test-secret");
      const carol = principalById(store, "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
      const result = emitCrmEvent(store, carol, {
        eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
        entityType: "organization",
        entityId: "11111111-1111-4111-8111-111111111111",
        classification: "Internal",
        correlationId: "sim-test",
        payload: { organizationId: "11111111-1111-4111-8111-111111111111", status: "Prospect" },
        mode: "SIMULATION",
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("simulation_cannot_publish");
    });

    it("AU-01: denied action creates deny audit", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const alice = await loginAlice(app);
      const carol = await loginCarol(app);
      const typeId = await orgTypeId(app, carol);
      const before = store.audit.filter((a) => a.authorization === "deny").length;
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${alice}` },
        payload: { legalName: "Deny Audit Org", organizationTypeId: typeId },
      });
      expect(store.audit.filter((a) => a.authorization === "deny").length).toBeGreaterThan(before);
    });
  });

  describe("idempotency", () => {
    it("import execute replay is deterministic", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const types = await app.inject({
        method: "GET",
        url: "/v1/crm/organization-types",
        headers: { authorization: `Bearer ${token}` },
      });
      const typeKey = types.json().items[0].key as string;
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/imports",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          sourceSystem: "hardening_csv",
          entityType: "organization",
          csv: `legalName,organizationTypeKey\nImport Replay Org,${typeKey}\n`,
        },
      });
      const batchId = created.json().batch.id as string;
      await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/validate`,
        headers: { authorization: `Bearer ${token}` },
      });
      const orgCountBefore = store.crmOrganizations.length;
      const committedEventsBefore = store.outboxEvents.filter(
        (e) => e.eventType === CRM_EVENT_TYPES.IMPORT_COMMITTED,
      ).length;
      const first = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/execute`,
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "import-replay-key" },
      });
      expect(first.statusCode).toBe(200);
      const orgCountAfterFirst = store.crmOrganizations.length;
      const committedEventsAfterFirst = store.outboxEvents.filter(
        (e) => e.eventType === CRM_EVENT_TYPES.IMPORT_COMMITTED,
      ).length;
      expect(orgCountAfterFirst).toBe(orgCountBefore + 1);
      const replay = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/execute`,
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "import-replay-key" },
      });
      expect(replay.statusCode).toBe(200);
      expect(replay.json().replay).toBe(true);
      expect(store.crmOrganizations.length).toBe(orgCountAfterFirst);
      expect(
        store.outboxEvents.filter((e) => e.eventType === CRM_EVENT_TYPES.IMPORT_COMMITTED).length,
      ).toBe(committedEventsAfterFirst);
    });
  });

  describe("merge tag deduplication", () => {
    it("does not duplicate tag assignments when survivor already has tag", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Tag Dedup Survivor", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Tag Dedup Loser", tradingName: "Tag Dedup Survivor", organizationTypeId: typeId },
      });
      const survivorId = first.json().organization.id as string;
      const duplicateId = second.json().organization.id as string;
      const tag = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "dedup_tag", label: "Dedup Tag" },
      });
      const tagId = tag.json().tag.id as string;
      await app.inject({
        method: "POST",
        url: "/v1/crm/tag-assignments",
        headers: { authorization: `Bearer ${token}` },
        payload: { tagId, entityType: "organization", entityId: survivorId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/tag-assignments",
        headers: { authorization: `Bearer ${token}` },
        payload: { tagId, entityType: "organization", entityId: duplicateId },
      });
      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/duplicates?entityType=organization",
        headers: { authorization: `Bearer ${token}` },
      });
      const candidateId = listed.json().items[0].id as string;
      await app.inject({
        method: "POST",
        url: `/v1/crm/duplicates/${candidateId}/review`,
        headers: { authorization: `Bearer ${token}` },
        payload: { decision: "confirm", reason: "Confirmed" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "tag-dedup-merge" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Tag dedup test",
          expectedVersions: {
            [survivorId]: first.json().organization.version,
            [duplicateId]: second.json().organization.version,
          },
        },
      });
      const assignments = store.crmEntityTags.filter(
        (a) => a.tagId === tagId && a.entityType === "organization" && a.entityId === survivorId,
      );
      expect(assignments).toHaveLength(1);
    });
  });
});
