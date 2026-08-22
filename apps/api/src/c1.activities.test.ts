import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { listMigrationFiles } from "@sedmc/db";

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

async function setupOrgContact(app: ReturnType<typeof buildServer>, token: string) {
  const orgTypes = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  const organizationTypeId = orgTypes.json().items.find((t: { key: string }) => t.key === "mice_agency").id;
  const org = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName: "Activity Org Ltd", organizationTypeId },
  });
  const contact = await app.inject({
    method: "POST",
    url: "/v1/crm/contacts",
    headers: { authorization: `Bearer ${token}` },
    payload: { givenName: "Activity", familyName: "Contact", email: "activity.contact@example.com" },
  });
  return {
    orgId: org.json().organization.id as string,
    contactId: contact.json().contact.id as string,
  };
}

describe("C1.4 CRM activities + interaction history", () => {
  it("lists C1.4 migration", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("007_c1_activities"))).toBe(true);
  });

  it("seeds activity types catalogue", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/activity-types",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(types.statusCode).toBe(200);
    expect(types.json().items.some((t: { key: string }) => t.key === "meeting")).toBe(true);
  });

  it("creates, retrieves, updates, and archives an activity", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const { orgId, contactId } = await setupOrgContact(app, token);

    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "meeting",
        subject: "Initial discovery call",
        occurredAt: "2026-08-20T10:00:00.000Z",
        contactId,
        organizationId: orgId,
        outcome: "Positive interest",
        notes: "Discussed Tanzania incentive options",
      },
    });
    expect(created.statusCode).toBe(201);
    const activity = created.json().activity;
    expect(activity.version).toBe(1);
    expect(activity.occurredAt).toBe("2026-08-20T10:00:00.000Z");

    const fetched = await app.inject({
      method: "GET",
      url: `/v1/crm/activities/${activity.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(fetched.statusCode).toBe(200);

    const updated = await app.inject({
      method: "PATCH",
      url: `/v1/crm/activities/${activity.id}`,
      headers: { authorization: `Bearer ${token}`, "if-match": "1" },
      payload: { subject: "Initial discovery meeting" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().activity.version).toBe(2);

    const archived = await app.inject({
      method: "POST",
      url: `/v1/crm/activities/${activity.id}/archive`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);
    expect(archived.json().activity.archivedAt).toBeTruthy();

    expect(store.audit.some((a) => a.resourceType === "crm_activity" && a.resourceId === activity.id)).toBe(true);
  });

  it("validates required fields and references", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);

    const noAssoc = await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "meeting",
        subject: "Orphan",
        occurredAt: "2026-08-20T10:00:00.000Z",
      },
    });
    expect(noAssoc.statusCode).toBe(400);
    expect(noAssoc.json().reason).toBe("association_required");

    const badType = await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "not_a_type",
        subject: "Bad",
        occurredAt: "2026-08-20T10:00:00.000Z",
        organizationId: "00000000-0000-4000-8000-000000000099",
      },
    });
    expect(badType.statusCode).toBe(400);
    expect(badType.json().reason).toBe("invalid_activity_type");
  });

  it("lists activity history by contact and organization with chronological ordering", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const { orgId, contactId } = await setupOrgContact(app, token);

    for (const [idx, day] of ["18", "19", "20"].entries()) {
      await app.inject({
        method: "POST",
        url: "/v1/crm/activities",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          activityType: "telephone",
          subject: `Call ${idx}`,
          occurredAt: `2026-08-${day}T12:00:00.000Z`,
          contactId,
          organizationId: orgId,
        },
      });
    }

    const byContact = await app.inject({
      method: "GET",
      url: `/v1/crm/contacts/${contactId}/activities`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byContact.statusCode).toBe(200);
    expect(byContact.json().items).toHaveLength(3);
    expect(byContact.json().items[0].subject).toBe("Call 2");

    const page = await app.inject({
      method: "GET",
      url: `/v1/crm/organizations/${orgId}/activities?limit=2`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(page.json().items).toHaveLength(2);
    expect(page.json().nextCursor).toBeTruthy();
  });

  it("associates activity with relationship and unit", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const { orgId, contactId } = await setupOrgContact(app, token);

    const unit = await app.inject({
      method: "POST",
      url: `/v1/crm/organizations/${orgId}/units`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Events", unitType: "department" },
    });
    const relTypes = await app.inject({
      method: "GET",
      url: "/v1/crm/relationship-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const relTypeId = relTypes.json().items.find((t: { key: string }) => t.key === "employee_of").id;
    const rel = await app.inject({
      method: "POST",
      url: "/v1/crm/relationships",
      headers: { authorization: `Bearer ${token}` },
      payload: { relationshipTypeId: relTypeId, contactId, organizationId: orgId },
    });

    const activity = await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "site_inspection",
        subject: "Venue walkthrough",
        occurredAt: "2026-08-21T09:00:00.000Z",
        relationshipId: rel.json().relationship.id,
        organizationUnitId: unit.json().unit.id,
      },
    });
    expect(activity.statusCode).toBe(201);
    expect(activity.json().activity.relationshipId).toBe(rel.json().relationship.id);

    const byRel = await app.inject({
      method: "GET",
      url: `/v1/crm/relationships/${rel.json().relationship.id}/activities`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byRel.json().items).toHaveLength(1);
  });

  it("rejects stale If-Match, unauthorized access, and cross-tenant reads", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const alice = await loginAlice(app);
    const { orgId, contactId } = await setupOrgContact(app, token);

    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "email",
        subject: "Follow-up",
        occurredAt: "2026-08-20T08:00:00.000Z",
        contactId,
        organizationId: orgId,
      },
    });
    const activityId = created.json().activity.id;

    const stale = await app.inject({
      method: "PATCH",
      url: `/v1/crm/activities/${activityId}`,
      headers: { authorization: `Bearer ${token}`, "if-match": "5" },
      payload: { notes: "x" },
    });
    expect(stale.statusCode).toBe(409);

    const denied = await app.inject({
      method: "GET",
      url: `/v1/crm/activities/${activityId}`,
      headers: { authorization: `Bearer ${alice}` },
    });
    expect(denied.statusCode).toBe(403);

    const partner = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const cross = await app.inject({
      method: "GET",
      url: `/v1/crm/activities/${activityId}`,
      headers: { authorization: `Bearer ${partner.json().accessToken}` },
    });
    expect(cross.statusCode).toBe(404);
  });

  it("filters activities by type and date range", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const token = await loginCarol(app);
    const { orgId } = await setupOrgContact(app, token);

    await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "meeting",
        subject: "A",
        occurredAt: "2026-08-01T10:00:00.000Z",
        organizationId: orgId,
      },
    });
    await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        activityType: "telephone",
        subject: "B",
        occurredAt: "2026-08-15T10:00:00.000Z",
        organizationId: orgId,
      },
    });

    const filtered = await app.inject({
      method: "GET",
      url: "/v1/crm/activities?activityType=telephone&occurredFrom=2026-08-10T00:00:00.000Z",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(filtered.json().items).toHaveLength(1);
    expect(filtered.json().items[0].subject).toBe("B");
  });
});
