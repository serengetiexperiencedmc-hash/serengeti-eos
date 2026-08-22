import { describe, expect, it } from "vitest";
import { CRM_EVENT_TYPES } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { commitCrmWithOutbox, ensureCrmEventCatalogue } from "../src/crm/events.js";
import { allowCrmAudit } from "../src/crm/audit.js";
import { buildServer } from "../src/server.js";
import { principalById } from "../src/store.js";

describe("C1.11 CRM event atomicity", () => {
  it("rolls back organization mutation when outbox write fails", () => {
    const store = seedStore("atomicity-test");
    ensureCrmEventCatalogue(store);
    const carol = principalById(store, "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
    const orgCountBefore = store.crmOrganizations.length;
    const outboxBefore = store.outboxEvents.length;
    const auditBefore = store.audit.length;

    const result = commitCrmWithOutbox(store, carol, {
      eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
      entityType: "organization",
      entityId: "11111111-1111-4111-8111-111111111111",
      classification: "Internal",
      correlationId: "atomicity-fail",
      payload: {
        organizationId: "11111111-1111-4111-8111-111111111111",
        status: "Prospect",
        legalName: "Atomic Fail Org",
      },
      simulateOutboxWriteFailure: true,
      mutate: () => {
        store.crmOrganizations.push({
          id: "11111111-1111-4111-8111-111111111111",
          tenantId: carol.tenantId,
          legalName: "Atomic Fail Org",
          organizationTypeId: store.crmOrganizationTypes[0]!.id,
          status: "Prospect",
          dataQualityStatus: "Unverified",
          classification: "Internal",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByPrincipalId: carol.id,
          updatedByPrincipalId: carol.id,
        });
        allowCrmAudit(store, carol, "crm:write:organization", "crm_organization", "11111111-1111-4111-8111-111111111111", "atomicity-fail", {
          legalName: "Atomic Fail Org",
        });
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("outbox_write_failed");
    expect(store.crmOrganizations.length).toBe(orgCountBefore);
    expect(store.outboxEvents.length).toBe(outboxBefore);
    expect(store.audit.length).toBe(auditBefore);
  });

  it("persists organization and outbox together on success", async () => {
    const store = seedStore("atomicity-test", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken as string;
    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;
    const outboxBefore = store.outboxEvents.length;

    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Atomic Success Org", organizationTypeId: typeId },
    });
    expect(created.statusCode).toBe(201);
    expect(store.outboxEvents.length).toBeGreaterThan(outboxBefore);
    expect(
      store.outboxEvents.some((e) => e.eventType === CRM_EVENT_TYPES.ORGANIZATION_CREATED),
    ).toBe(true);
  });

  it("idempotent merge replay does not duplicate outbox events", async () => {
    const store = seedStore("atomicity-test", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken as string;
    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;

    const first = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Idempotent Merge A", organizationTypeId: typeId },
    });
    const second = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "Idempotent Merge B", tradingName: "Idempotent Merge A", organizationTypeId: typeId },
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
    const mergedEventsBefore = store.outboxEvents.filter((e) => e.eventType === CRM_EVENT_TYPES.RECORD_MERGED).length;

    await app.inject({
      method: "POST",
      url: "/v1/crm/merges",
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "atomic-merge-replay" },
      payload: {
        entityType: "organization",
        survivorId,
        duplicateIds: [duplicateId],
        duplicateCandidateId: candidateId,
        reason: "Atomic replay test",
        expectedVersions: {
          [survivorId]: first.json().organization.version,
          [duplicateId]: second.json().organization.version,
        },
      },
    });
    const afterFirst = store.outboxEvents.filter((e) => e.eventType === CRM_EVENT_TYPES.RECORD_MERGED).length;
    expect(afterFirst).toBe(mergedEventsBefore + 1);

    await app.inject({
      method: "POST",
      url: "/v1/crm/merges",
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "atomic-merge-replay" },
      payload: {
        entityType: "organization",
        survivorId,
        duplicateIds: [duplicateId],
        duplicateCandidateId: candidateId,
        reason: "Atomic replay test",
      },
    });
    expect(store.outboxEvents.filter((e) => e.eventType === CRM_EVENT_TYPES.RECORD_MERGED).length).toBe(afterFirst);
  });
});
