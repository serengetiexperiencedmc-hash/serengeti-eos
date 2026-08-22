import { describe, expect, it } from "vitest";
import {
  buildCrmEventCatalogue,
  CRM_EVENT_TYPES,
  isCrmEventType,
  validateEnvelopeSchema,
  buildEnvelope,
} from "@sedmc/kernel";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { emitCrmEvent } from "../src/crm/events.js";

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

function crmEvents(store: ReturnType<typeof seedStore>): string[] {
  return store.outboxEvents.filter((e) => e.eventType.startsWith("crm.")).map((e) => e.eventType);
}

describe("C1.9 CRM domain events", () => {
  it("lists C1.9 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("012_c1_events"))).toBe(true);
  });

  describe("event contract", () => {
    it("registers all CRM event types in catalogue", () => {
      const catalogue = buildCrmEventCatalogue();
      expect(catalogue.length).toBe(Object.keys(CRM_EVENT_TYPES).length);
      for (const entry of catalogue) {
        expect(isCrmEventType(entry.eventType)).toBe(true);
        expect(entry.lifecycle).toBe("active");
        expect(entry.producer).toBe("serengeti-eos-crm");
      }
    });

    it("rejects invalid and unknown event payloads", () => {
      const entry = buildCrmEventCatalogue().find((e) => e.eventType === CRM_EVENT_TYPES.NOTE_CREATED)!;
      const schema = {
        eventType: entry.eventType,
        schemaVersion: entry.schemaVersion,
        owner: entry.owner,
        purpose: entry.purpose,
        producer: entry.producer,
        consumers: entry.consumers,
        classification: entry.classification,
        retentionDays: entry.retentionDays,
        compatibility: entry.compatibility,
        lifecycle: entry.lifecycle,
        orderingKey: entry.orderingKey ?? "none",
        requiredFields: (entry.requiredFields ?? []).map((f) => ({
          name: f.name,
          type: f.type as "string",
        })),
        optionalFields: [],
        forbiddenPayloadKeys: entry.forbiddenPayloadKeys ?? [],
        maxPayloadBytes: entry.maxPayloadBytes ?? 8192,
        sensitiveDataPolicy: "reference_only" as const,
      };
      const bad = buildEnvelope({
        eventType: entry.eventType,
        tenantId: "11111111-1111-4111-8111-111111111111",
        producer: entry.producer,
        correlationId: "test",
        classification: "Confidential",
        payload: { entityType: "note", entityId: "n1", noteId: "n1", body: "secret" },
        schemaVersion: 1,
      });
      expect(validateEnvelopeSchema(schema, bad).ok).toBe(false);
    });
  });

  describe("creation events", () => {
    it("emits events for organization, contact, tag, and external identifier creation", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Event Org Ltd", organizationTypeId: typeId },
      });
      const orgId = store.crmOrganizations.at(-1)!.id;

      await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Event", familyName: "Person", email: "event.person@example.com" },
      });

      await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${token}` },
        payload: { key: "event_tag", label: "Event Tag" },
      });

      await app.inject({
        method: "POST",
        url: "/v1/crm/external-identifiers",
        headers: { authorization: `Bearer ${token}` },
        payload: { entityType: "organization", entityId: orgId, systemKey: "legacy_crm", externalId: "EVT-1" },
      });

      const events = crmEvents(store);
      expect(events).toContain(CRM_EVENT_TYPES.ORGANIZATION_CREATED);
      expect(events).toContain(CRM_EVENT_TYPES.CONTACT_CREATED);
      expect(events).toContain(CRM_EVENT_TYPES.TAG_CREATED);
      expect(events).toContain(CRM_EVENT_TYPES.EXTERNAL_IDENTIFIER_CREATED);
      expect(events.some((t) => t.includes("email"))).toBe(false);
    });
  });

  describe("lifecycle events", () => {
    it("emits archive and task completion events", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Archive Event Org", organizationTypeId: typeId },
      });
      const orgId = org.json().organization.id as string;

      await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Engaged" },
      });
      await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Qualified" },
      });
      await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Active" },
      });
      await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/archive`,
        headers: { authorization: `Bearer ${token}` },
      });

      const task = await app.inject({
        method: "POST",
        url: "/v1/crm/tasks",
        headers: { authorization: `Bearer ${token}` },
        payload: { title: "Complete me", relatedOrganizationId: orgId },
      });
      await app.inject({
        method: "POST",
        url: `/v1/crm/tasks/${task.json().task.id}/complete`,
        headers: { authorization: `Bearer ${token}` },
      });

      const events = crmEvents(store);
      expect(events).toContain(CRM_EVENT_TYPES.ORGANIZATION_ARCHIVED);
      expect(events).toContain(CRM_EVENT_TYPES.TASK_COMPLETED);
    });
  });

  describe("merge events", () => {
    it("emits crm.record.merged.v1 on successful organization merge", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);

      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Merge Event Survivor Ltd", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Other Merge Org", tradingName: "Merge Event Survivor", organizationTypeId: typeId },
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
      const duplicateId = store.crmOrganizations.find((o) => o.id !== survivorId && !o.mergedIntoId)!.id;
      const beforeCount = crmEvents(store).filter((t) => t === CRM_EVENT_TYPES.RECORD_MERGED).length;

      const merged = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "event-merge-1" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          duplicateCandidateId: candidateId,
          reason: "Merge for event test",
          expectedVersions: {
            [survivorId]: first.json().organization.version,
            [duplicateId]: store.crmOrganizations.find((o) => o.id === duplicateId)!.version,
          },
        },
      });
      expect(merged.statusCode).toBe(201);

      const afterEvents = crmEvents(store);
      expect(afterEvents.filter((t) => t === CRM_EVENT_TYPES.RECORD_MERGED).length).toBe(beforeCount + 1);
      expect(afterEvents).toContain(CRM_EVENT_TYPES.ORGANIZATION_MERGED);

      const replay = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "event-merge-1" },
        payload: {
          entityType: "organization",
          survivorId,
          duplicateIds: [duplicateId],
          reason: "Replay",
        },
      });
      expect(replay.statusCode).toBe(200);
      expect(crmEvents(store).filter((t) => t === CRM_EVENT_TYPES.RECORD_MERGED).length).toBe(beforeCount + 1);
    });

    it("does not emit merge event when merge fails", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Fail Merge A", organizationTypeId: typeId },
      });
      const second = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Fail Merge B", organizationTypeId: typeId },
      });
      const before = crmEvents(store).filter((t) => t === CRM_EVENT_TYPES.RECORD_MERGED).length;
      const failed = await app.inject({
        method: "POST",
        url: "/v1/crm/merges",
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "fail-merge" },
        payload: {
          entityType: "organization",
          survivorId: first.json().organization.id,
          duplicateIds: [second.json().organization.id],
          reason: "Not confirmed",
        },
      });
      expect(failed.statusCode).toBe(409);
      expect(crmEvents(store).filter((t) => t === CRM_EVENT_TYPES.RECORD_MERGED).length).toBe(before);
    });
  });

  describe("import events", () => {
    it("emits import created, validated, and committed events", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
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
          sourceSystem: "test_csv",
          entityType: "organization",
          csv: `legalName,organizationTypeKey\nImport Event Org,${typeKey}\n`,
        },
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
        headers: { authorization: `Bearer ${token}`, "idempotency-key": "import-exec-1" },
      });

      const events = crmEvents(store);
      expect(events).toContain(CRM_EVENT_TYPES.IMPORT_CREATED);
      expect(events).toContain(CRM_EVENT_TYPES.IMPORT_VALIDATED);
      expect(events).toContain(CRM_EVENT_TYPES.IMPORT_COMMITTED);
    });
  });

  describe("security", () => {
    it("does not emit events for unauthorized mutations", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const alice = await loginAlice(app);
      const before = store.outboxEvents.length;
      const denied = await app.inject({
        method: "POST",
        url: "/v1/crm/tags",
        headers: { authorization: `Bearer ${alice}` },
        payload: { key: "denied_tag", label: "Denied" },
      });
      expect(denied.statusCode).toBe(403);
      expect(store.outboxEvents.length).toBe(before);
    });

    it("note event payload does not include body text", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      const org = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Note Event Org", organizationTypeId: typeId },
      });
      await app.inject({
        method: "POST",
        url: "/v1/crm/notes",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          body: "Highly confidential note body",
          entityType: "organization",
          entityId: org.json().organization.id,
        },
      });
      const noteEvent = store.outboxEvents.find((e) => e.eventType === CRM_EVENT_TYPES.NOTE_CREATED);
      expect(noteEvent).toBeTruthy();
      expect(noteEvent!.envelope.payload.body).toBeUndefined();
      expect(noteEvent!.envelope.payload).toHaveProperty("noteId");
    });

    it("lists tenant-scoped CRM outbox events via dev endpoint", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const typeId = await orgTypeId(app, token);
      await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Dev Outbox Org", organizationTypeId: typeId },
      });
      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/dev/outbox-events",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(200);
      expect(listed.json().items.some((e: { eventType: string }) => e.eventType.startsWith("crm."))).toBe(true);
    });
  });
});
