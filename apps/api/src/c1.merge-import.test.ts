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
    payload: { legalName: "Merge Survivor Org Ltd", organizationTypeId: typeId },
  });
  const second = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName: "Different Merge Org", tradingName: "Merge Survivor Org", organizationTypeId: typeId },
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

describe("C1.7 CRM controlled merge + bulk import", () => {
  it("lists C1.7 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("010_c1_merge_import"))).toBe(true);
  });

  describe("controlled merge", () => {
    it("merges confirmed organization duplicates and repoints dependents", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const { survivorId, duplicateId, candidateId, survivorVersion, duplicateVersion } =
        await confirmDuplicatePair(app, token, typeId);

      await app.inject({
        method: "POST",
        url: "/v1/crm/accounts",
        headers: { authorization: `Bearer ${token}` },
        payload: { organizationId: duplicateId, accountName: "Merge Test Account" },
      });

      const merged = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: {
          authorization: `Bearer ${token}`,
          "idempotency-key": "merge-org-1",
        },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Consolidate duplicate org records",
          fieldResolutions: { tradingName: "Merged Trading Name" },
          expectedVersions: { [survivorId]: survivorVersion, [duplicateId]: duplicateVersion },
        },
      });
      expect(merged.statusCode).toBe(201);
      expect(merged.json().merge.mergedIds).toContain(duplicateId);

      const survivor = store.crmOrganizations.find((o) => o.id === survivorId)!;
      const loser = store.crmOrganizations.find((o) => o.id === duplicateId)!;
      expect(loser.mergedIntoId).toBe(survivorId);
      expect(loser.archivedAt).toBeTruthy();
      expect(survivor.tradingName).toBe("Merged Trading Name");
      expect(store.crmAccounts.every((a) => a.organizationId === survivorId)).toBe(true);
      expect(store.audit.some((a) => a.resourceType === "crm_merge_record")).toBe(true);
    });

    it("rejects unconfirmed duplicate merge and unauthorized merge", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
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
        payload: { legalName: "Unconfirmed B", tradingName: "Unconfirmed A", organizationTypeId: typeId },
      });

      const unconfirmed = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-unconfirmed" },
        payload: {
          entityType: "organization",
          survivorId: first.json().organization.id,
          duplicateIds: [second.json().organization.id],
          reason: "Should fail",
        },
      });
      expect(unconfirmed.statusCode).toBe(409);

      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${alice}`, "idempotency-key": "merge-denied" },
        payload: {
          entityType: "organization",
          survivorId: first.json().organization.id,
          duplicateIds: [second.json().organization.id],
          reason: "No permission",
        },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("rejects stale versions and replays idempotent merge", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const pair = await confirmDuplicatePair(app, token, typeId);

      const stale = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-stale" },
        payload: {
          entityType: "organization",
          survivorId: pair.survivorId,
          duplicateIds: [pair.duplicateId],
          duplicateCandidateId: pair.candidateId,
          reason: "Stale",
          expectedVersions: { [pair.survivorId]: 99 },
        },
      });
      expect(stale.statusCode).toBe(409);

      const mergeBody = {
        entityType: "organization",
        survivorId: pair.survivorId,
        duplicateIds: [pair.duplicateId],
        duplicateCandidateId: pair.candidateId,
        reason: "Replay test",
        expectedVersions: { [pair.survivorId]: pair.survivorVersion, [pair.duplicateId]: pair.duplicateVersion },
      };
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-replay" },
        payload: mergeBody,
      });
      expect(first.statusCode).toBe(201);
      const replay = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "merge-replay" },
        payload: mergeBody,
      });
      expect(replay.statusCode).toBe(200);
      expect(replay.json().replay).toBe(true);
    });
  });

  describe("bulk import", () => {
    it("validates and executes organization CSV import in create-only mode", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);

      const csv = [
        "legalName,organizationTypeKey,tradingName,country",
        "Import Org Alpha,mice_agency,Alpha Trade,TZ",
        "Import Org Beta,mice_agency,Beta Trade,KE",
      ].join("\n");

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/imports",
        headers: { authorization: `Bearer ${token}` },
        payload: { sourceSystem: "test-csv", entityType: "organization", csv },
      });
      expect(created.statusCode).toBe(201);
      const batchId = created.json().batch.id;

      const validated = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/validate`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(validated.statusCode).toBe(200);
      expect(validated.json().batch.status).toBe("validated");
      expect(validated.json().batch.validCount).toBe(2);

      const executed = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/execute`,
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "import-exec-1" },
      });
      expect(executed.statusCode).toBe(200);
      expect(executed.json().batch.status).toBe("committed");
      expect(store.crmOrganizations.filter((o) => o.importBatchId === batchId)).toHaveLength(2);
    });

    it("rejects invalid rows, existing conflicts, and unauthorized import", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);
      const typeId = await orgTypeId(app, token);

      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Existing Import Org", organizationTypeId: typeId },
      });

      const csv = [
        "legalName,organizationTypeKey",
        "Existing Import Org,mice_agency",
      ].join("\n");
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/imports",
        headers: { authorization: `Bearer ${token}` },
        payload: { sourceSystem: "test-csv", entityType: "organization", csv },
      });
      const validated = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${created.json().batch.id}/validate`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(validated.json().batch.status).toBe("failed");
      expect(validated.json().batch.validationResults[0].errors).toContain("existing_record_conflict");

      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/imports",
        headers: { authorization: `Bearer ${alice}` },
        payload: {
          sourceSystem: "test",
          entityType: "organization",
          csv: "legalName,organizationTypeKey\nX,mice_agency",
        },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("requires idempotency key on execute and blocks execute before validate", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/imports",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          sourceSystem: "test",
          entityType: "contact",
          csv: "givenName,familyName\nImport,Person",
        },
      });
      const batchId = created.json().batch.id;

      const early = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/execute`,
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "early" },
      });
      expect(early.statusCode).toBe(409);

      await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/validate`,
        headers: { authorization: `Bearer ${token}` },
      });

      const noKey = await app.inject({
        method: "POST",
        url: `/v1/crm/imports/${batchId}/execute`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(noKey.statusCode).toBe(400);
    });
  });
});
