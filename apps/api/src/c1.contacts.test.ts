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

async function miceAgencyTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  return types.json().items.find((t: { key: string }) => t.key === "mice_agency").id as string;
}

async function employeeOfTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/relationship-types",
    headers: { authorization: `Bearer ${token}` },
  });
  return types.json().items.find((t: { key: string }) => t.key === "employee_of").id as string;
}

async function createTestOrg(app: ReturnType<typeof buildServer>, token: string, legalName: string) {
  const organizationTypeId = await miceAgencyTypeId(app, token);
  const res = await app.inject({
    method: "POST",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
    payload: { legalName, organizationTypeId },
  });
  return res.json().organization as { id: string };
}

describe("C1.3 CRM contacts + relationships", () => {
  it("lists C1.3 migration", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("006_c1_contacts_relationships"))).toBe(true);
  });

  describe("contacts", () => {
    it("creates, retrieves, lists, updates, and archives a contact", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          givenName: "Jane",
          familyName: "Planner",
          email: "jane.planner@example.com",
          jobTitle: "MICE Manager",
        },
      });
      expect(created.statusCode).toBe(201);
      const contact = created.json().contact;
      expect(contact.status).toBe("Active");
      expect(contact.version).toBe(1);
      expect(contact).not.toHaveProperty("tenantId");
      expect(contact.createdByPrincipalId).toBeTruthy();
      expect(contact.updatedByPrincipalId).toBeTruthy();

      const fetched = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contact.id}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(fetched.statusCode).toBe(200);
      expect(fetched.json().contact).not.toHaveProperty("tenantId");

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/contacts?status=Active",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items.some((c: { id: string }) => c.id === contact.id)).toBe(true);
      expect(listed.json().items.every((c: { tenantId?: string }) => c.tenantId === undefined)).toBe(true);

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/contacts/${contact.id}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { jobTitle: "Senior MICE Manager", status: "Inactive" },
      });
      expect(updated.statusCode).toBe(200);
      expect(updated.json().contact.status).toBe("Inactive");
      expect(updated.json().contact.version).toBe(2);

      const archived = await app.inject({
        method: "POST",
        url: `/v1/crm/contacts/${contact.id}/archive`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(archived.statusCode).toBe(200);
      expect(archived.json().contact.status).toBe("Archived");

      expect(store.audit.some((a) => a.resourceType === "crm_contact" && a.resourceId === contact.id)).toBe(true);
    });

    it("validates required fields, email, phone, and duplicates", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);

      const missing = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Only" },
      });
      expect(missing.statusCode).toBe(400);
      expect(missing.json().reason).toBe("family_name_required");

      const badEmail = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Bad", familyName: "Email", email: "not-an-email" },
      });
      expect(badEmail.statusCode).toBe(400);
      expect(badEmail.json().reason).toBe("invalid_email");

      const badPhone = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Bad", familyName: "Phone", telephone: "abc!!!" },
      });
      expect(badPhone.statusCode).toBe(400);
      expect(badPhone.json().reason).toBe("invalid_telephone");

      await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Dup", familyName: "Test", email: "dup@example.com" },
      });
      const dup = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Other", familyName: "Person", email: "DUP@example.com" },
      });
      expect(dup.statusCode).toBe(409);
      expect(dup.json().reason).toBe("duplicate_contact_email");
    });

    it("rejects stale If-Match and denies unauthorized access", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Ver", familyName: "Sion", email: "version@example.com" },
      });
      const contactId = created.json().contact.id;

      const stale = await app.inject({
        method: "PATCH",
        url: `/v1/crm/contacts/${contactId}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "99" },
        payload: { jobTitle: "X" },
      });
      expect(stale.statusCode).toBe(409);
      expect(stale.json().reason).toBe("version_mismatch");

      const denied = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contactId}`,
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(denied.statusCode).toBe(403);
    });

    it("returns 404 for cross-tenant contact reads", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Cross", familyName: "Tenant", email: "cross@example.com" },
      });
      const contactId = created.json().contact.id;

      const partner = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
      });
      const peek = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contactId}`,
        headers: { authorization: `Bearer ${partner.json().accessToken}` },
      });
      expect(peek.statusCode).toBe(404);

      const partnerList = await app.inject({
        method: "GET",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${partner.json().accessToken}` },
      });
      expect([403, 404]).toContain(partnerList.statusCode);
      if (partnerList.statusCode === 200) {
        expect(partnerList.json().items.some((c: { id: string }) => c.id === contactId)).toBe(false);
      }
    });
  });

  describe("relationships", () => {
    it("creates contact-organization and contact-unit relationships", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const org = await createTestOrg(app, token, "Rel Org Ltd");
      const relTypeId = await employeeOfTypeId(app, token);

      const unit = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "MICE Team", unitType: "department" },
      });
      const unitId = unit.json().unit.id;

      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Rel", familyName: "Contact", email: "rel.contact@example.com" },
      });
      const contactId = contact.json().contact.id;

      const rel = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          contactId,
          organizationId: org.id,
          organizationUnitId: unitId,
        },
      });
      expect(rel.statusCode).toBe(201);
      expect(rel.json().relationship.organizationUnitId).toBe(unitId);

      const byContact = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts/${contactId}/relationships`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(byContact.statusCode).toBe(200);
      expect(byContact.json().items).toHaveLength(1);

      const byOrg = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${org.id}/relationships`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(byOrg.statusCode).toBe(200);
      expect(byOrg.json().items).toHaveLength(1);

      const contactsForOrg = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts?organizationId=${org.id}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(contactsForOrg.json().items).toHaveLength(1);
    });

    it("creates org-org relationships and validates endpoints", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const parent = await createTestOrg(app, token, "Parent Org");
      const child = await createTestOrg(app, token, "Child Org");
      const types = await app.inject({
        method: "GET",
        url: "/v1/crm/relationship-types",
        headers: { authorization: `Bearer ${token}` },
      });
      const relTypeId = types.json().items.find((t: { key: string }) => t.key === "subsidiary_of").id;

      const rel = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          fromOrganizationId: child.id,
          toOrganizationId: parent.id,
        },
      });
      expect(rel.statusCode).toBe(201);

      const invalid = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: { relationshipTypeId: relTypeId, contactId: "x", organizationId: "y" },
      });
      expect(invalid.statusCode).toBe(400);
    });

    it("rejects invalid references, duplicate relationships, and bad unit scope", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const orgA = await createTestOrg(app, token, "Org A");
      const orgB = await createTestOrg(app, token, "Org B");
      const relTypeId = await employeeOfTypeId(app, token);

      const unitOnB = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgB.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "Team B", unitType: "department" },
      });

      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Ref", familyName: "Test", email: "ref.test@example.com" },
      });
      const contactId = contact.json().contact.id;

      const wrongUnit = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          contactId,
          organizationId: orgA.id,
          organizationUnitId: unitOnB.json().unit.id,
        },
      });
      expect(wrongUnit.statusCode).toBe(400);
      expect(wrongUnit.json().reason).toBe("invalid_organization_unit");

      const ok = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: { relationshipTypeId: relTypeId, contactId, organizationId: orgA.id },
      });
      expect(ok.statusCode).toBe(201);

      const dup = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: { relationshipTypeId: relTypeId, contactId, organizationId: orgA.id },
      });
      expect(dup.statusCode).toBe(409);
      expect(dup.json().reason).toBe("duplicate_relationship");
    });

    it("updates and transitions relationships with version checks", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const org = await createTestOrg(app, token, "Transition Org");
      const relTypeId = await employeeOfTypeId(app, token);
      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Trans", familyName: "Contact", email: "trans@example.com" },
      });
      const rel = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          contactId: contact.json().contact.id,
          organizationId: org.id,
        },
      });
      const relationship = rel.json().relationship;

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/relationships/${relationship.id}`,
        headers: { authorization: `Bearer ${token}`, "if-match": "1" },
        payload: { notes: "Key account contact" },
      });
      expect(updated.statusCode).toBe(200);
      expect(updated.json().relationship.notes).toBe("Key account contact");

      const transition = await app.inject({
        method: "POST",
        url: `/v1/crm/relationships/${relationship.id}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Identified" },
      });
      expect(transition.statusCode).toBe(200);

      const invalidTransition = await app.inject({
        method: "POST",
        url: `/v1/crm/relationships/${relationship.id}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Partner" },
      });
      expect(invalidTransition.statusCode).toBe(409);
    });

    it("denies relationship access without permission", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const alice = await loginAlice(app);
      const res = await app.inject({
        method: "GET",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(res.statusCode).toBe(403);
    });
  });
});
