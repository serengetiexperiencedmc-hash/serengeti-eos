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

async function orgTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  return types.json().items[0].id as string;
}

async function confirmDuplicatePair(app: ReturnType<typeof buildServer>, token: string, typeId: string) {
  const first = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName: "Tag Merge Survivor Org Ltd", organizationTypeId: typeId },
  });
  const second = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName: "Different Tag Merge Org", tradingName: "Tag Merge Survivor Org", organizationTypeId: typeId },
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
    payload: { decision: "confirm", reason: "Confirmed duplicate" },
  });
  return {
    survivorId: first.json().organization.id as string,
    duplicateId: second.json().organization.id as string,
    candidateId,
    survivorVersion: first.json().organization.version as number,
    duplicateVersion: second.json().organization.version as number,
  };
}

describe("C1.8 CRM tags + external identifiers", () => {
  it("lists C1.8 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("011_c1_tags_external_identifiers"))).toBe(true);
  });

  describe("tags", () => {
    it("creates, retrieves, updates, and archives tags with normalized keys", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "MICE Partner", label: "MICE Partner" },
      });
      expect(created.statusCode).toBe(201);
      expect(created.json().tag.key).toBe("mice_partner");

      const duplicateKey = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "mice partner", label: "Duplicate" },
      });
      expect(duplicateKey.statusCode).toBe(409);
      expect(duplicateKey.json().reason).toBe("duplicate_tag_key");

      const tagId = created.json().tag.id as string;
      const version = created.json().tag.version as number;

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/tags/${tagId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": String(version) },
        payload: { label: "MICE Partner Label" },
      });
      expect(updated.statusCode).toBe(200);
      expect(updated.json().tag.label).toBe("MICE Partner Label");
      expect(updated.json().tag.version).toBe(version + 1);

      const stale = await app.inject({
        method: "PATCH",
        url: `/v1/crm/tags/${tagId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": String(version) },
        payload: { label: "Stale" },
      });
      expect(stale.statusCode).toBe(409);

      const archived = await app.inject({
        method: "POST",
        url: `/v1/crm/tags/${tagId}/archive`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(archived.statusCode).toBe(200);
      expect(archived.json().tag.archivedAt).toBeTruthy();

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items.some((t: { id: string }) => t.id === tagId)).toBe(false);

      const includeArchived = await app.inject({
        method: "GET",
        url: "/v1/crm/tags?includeArchived=true",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(includeArchived.json().items.some((t: { id: string }) => t.id === tagId)).toBe(true);
    });

    it("assigns and removes tags on entities with authorization", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
      const typeId = await orgTypeId(app, token);

      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Tagged Org Ltd", organizationTypeId: typeId, classification: "Restricted" },
      });
      const orgId = org.json().organization.id as string;

      const tag = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "strategic_account", label: "Strategic Account" },
      });
      const tagId = tag.json().tag.id as string;

      const deniedAssign = await app.inject({
        method: "POST",
        url: "/v1/crm/tag-assignments",
        headers: { authorization: `Bearer ${alice}` },
        payload: { tagId, entityType: "organization", entityId: orgId },
      });
      expect(deniedAssign.statusCode).toBe(403);

      const assigned = await app.inject({
        method: "POST",
        url: "/v1/crm/tag-assignments",
        headers: { authorization: `Bearer ${token}` },
        payload: { tagId, entityType: "organization", entityId: orgId },
      });
      expect(assigned.statusCode).toBe(201);
      const assignmentId = assigned.json().assignment.id as string;

      const duplicateAssign = await app.inject({
        method: "POST",
        url: "/v1/crm/tag-assignments",
        headers: { authorization: `Bearer ${token}` },
        payload: { tagId, entityType: "organization", entityId: orgId },
      });
      expect(duplicateAssign.statusCode).toBe(409);

      const listed = await app.inject({
        method: "GET",
        url: `/v1/crm/tag-assignments?entityType=organization&entityId=${orgId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items).toHaveLength(1);

      const removed = await app.inject({
        method: "DELETE",
        url: `/v1/crm/tag-assignments/${assignmentId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(removed.statusCode).toBe(200);
      expect(store.audit.some((a) => a.resourceType === "crm_entity_tag")).toBe(true);
    });

    it("enforces tenant isolation for tags", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "tenant_a_tag", label: "Tenant A Tag" },
      });
      const tagId = created.json().tag.id as string;

      const partner = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
      });
      const crossTenant = await app.inject({
        method: "GET",
        url: `/v1/crm/tags/${tagId}`,
        headers: { authorization: `Bearer ${partner.json().accessToken}` },
      });
      expect(crossTenant.statusCode).toBe(404);
    });
  });

  describe("external identifiers", () => {
    it("creates, retrieves, and looks up external identifiers", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "External ID Org Ltd", organizationTypeId: typeId },
      });
      const orgId = org.json().organization.id as string;

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgId, systemKey: "HubSpot", externalId: " HS-001 " },
      });
      expect(created.statusCode).toBe(201);
      expect(created.json().externalIdentifier.systemKey).toBe("hubspot");
      expect(created.json().externalIdentifier.externalId).toBe("HS-001");

      const extId = created.json().externalIdentifier.id as string;
      const fetched = await app.inject({
        method: "GET",
        url: `/v1/crm/external-identifiers/${extId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(fetched.statusCode).toBe(200);

      const lookup = await app.inject({
        method: "GET",
        url: "/v1/crm/external-identifiers/lookup/hubspot/HS-001",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(lookup.statusCode).toBe(200);
      expect(lookup.json().externalIdentifier.entityId).toBe(orgId);
    });

    it("rejects duplicate and cross-entity external identifier ownership", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Ext Owner A Ltd", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Ext Owner B Ltd", organizationTypeId: typeId },
      });
      const orgA = first.json().organization.id as string;
      const orgB = second.json().organization.id as string;

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgA, systemKey: "salesforce", externalId: "SF-100" },
      });

      const conflict = await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgB, systemKey: "salesforce", externalId: "SF-100" },
      });
      expect(conflict.statusCode).toBe(409);
      expect(conflict.json().reason).toBe("external_identifier_owned");

      const otherSystem = await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgB, systemKey: "legacy_crm", externalId: "SF-100" },
      });
      expect(otherSystem.statusCode).toBe(201);
    });

    it("hides restricted entities from external identifier lookup", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const alicePrincipal = store.principals.get("alice.finance@sedmc.local")!;
      alicePrincipal.permissions = [...alicePrincipal.permissions, "crm:read:organization"];
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
      const typeId = await orgTypeId(app, token);

      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Restricted Ext Org Ltd", organizationTypeId: typeId, classification: "Restricted" },
      });
      const orgId = org.json().organization.id as string;

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgId, systemKey: "event_platform", externalId: "EVT-99" },
      });

      const lookup = await app.inject({
        method: "GET",
        url: "/v1/crm/external-identifiers/lookup/event_platform/EVT-99",
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(lookup.statusCode).toBe(404);
    });

    it("deletes external identifiers with audit", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Delete Ext Org Ltd", organizationTypeId: typeId },
      });

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          entityType: "organization",
          entityId: org.json().organization.id,
          systemKey: "legacy_crm",
          externalId: "LEG-1",
        },
      });
      const extId = created.json().externalIdentifier.id as string;

      const removed = await app.inject({
        method: "DELETE",
        url: `/v1/crm/external-identifiers/${extId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(removed.statusCode).toBe(200);
      expect(store.crmExternalIdentifiers.some((e) => e.id === extId)).toBe(false);
      expect(store.audit.some((a) => a.resourceType === "crm_external_identifier")).toBe(true);
    });
  });

  describe("merge compatibility", () => {
    it("repoints non-conflicting external identifiers on organization merge", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const { survivorId, duplicateId, candidateId, survivorVersion, duplicateVersion } =
        await confirmDuplicatePair(app, token, typeId);

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: survivorId, systemKey: "hubspot", externalId: "HS-SURV" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: duplicateId, systemKey: "salesforce", externalId: "SF-DUP" },
      });

      const merged = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-ext-repoint" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Merge with external ids",
          expectedVersions: { [survivorId]: survivorVersion, [duplicateId]: duplicateVersion },
        },
      });
      expect(merged.statusCode).toBe(201);

      const survivorExtIds = store.crmExternalIdentifiers.filter(
        (e) => e.entityType === "organization" && e.entityId === survivorId,
      );
      expect(survivorExtIds.some((e) => e.systemKey === "hubspot" && e.externalId === "HS-SURV")).toBe(true);
      expect(survivorExtIds.some((e) => e.systemKey === "salesforce" && e.externalId === "SF-DUP")).toBe(true);
      expect(store.crmExternalIdentifiers.some((e) => e.entityId === duplicateId)).toBe(false);
    });

    it("rejects merge when external identifier would collide with a third record", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const { survivorId, duplicateId, candidateId, survivorVersion, duplicateVersion } =
        await confirmDuplicatePair(app, token, typeId);

      const third = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Third Ext Org Ltd", organizationTypeId: typeId },
      });
      const thirdId = third.json().organization.id as string;
      const carol = store.principals.get("carol.admin@sedmc.local")!;

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: thirdId, systemKey: "hubspot", externalId: "HS-COLLIDE" },
      });
      store.crmExternalIdentifiers.push({
        id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
        tenantId: carol.tenantId,
        entityType: "organization",
        entityId: duplicateId,
        systemKey: "hubspot",
        externalId: "HS-COLLIDE",
        createdAt: new Date().toISOString(),
        createdByPrincipalId: carol.id,
      });

      const merged = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-ext-conflict" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Should fail on external id conflict",
          expectedVersions: { [survivorId]: survivorVersion, [duplicateId]: duplicateVersion },
        },
      });
      expect(merged.statusCode).toBe(409);
      expect(merged.json().reason).toBe("external_identifier_conflict");
    });

    it("deduplicates identical external identifiers when merging", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const { survivorId, duplicateId, candidateId, survivorVersion, duplicateVersion } =
        await confirmDuplicatePair(app, token, typeId);

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: survivorId, systemKey: "hubspot", externalId: "HS-SAME" },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: duplicateId, systemKey: "hubspot", externalId: "HS-SAME" },
      });

      const merged = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-ext-dedupe" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Merge duplicate external ids",
          expectedVersions: { [survivorId]: survivorVersion, [duplicateId]: duplicateVersion },
        },
      });
      expect(merged.statusCode).toBe(201);
      const matches = store.crmExternalIdentifiers.filter(
        (e) => e.entityType === "organization" && e.systemKey === "hubspot" && e.externalId === "HS-SAME",
      );
      expect(matches).toHaveLength(1);
      expect(matches[0]?.entityId).toBe(survivorId);
    });
  });
});
