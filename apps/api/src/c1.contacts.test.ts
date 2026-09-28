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
    it("refuses person-contact writes after authorize and lists none", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const alice = await loginAlice(app);

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
      expect(created.statusCode).toBe(400);
      expect(created.json().reason).toBe("person_domain_removed");

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/contacts?status=Active",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(400);
      expect(listed.json().reason).toBe("person_domain_removed");

      const fetched = await app.inject({
        method: "GET",
        url: "/v1/crm/contacts/11111111-1111-4111-8111-111111111111",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(fetched.statusCode).toBe(400);
      expect(fetched.json().reason).toBe("person_domain_removed");

      const denied = await app.inject({
        method: "GET",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${alice}` },
      });
      expect(denied.statusCode).toBe(403);
    });
  });

  describe("relationships", () => {
    it("refuses contact-organization relationships after person-domain removal", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const org = await createTestOrg(app, token, "Rel Org Ltd");
      const relTypeId = await employeeOfTypeId(app, token);

      const contact = await app.inject({
        method: "POST",
        url: "/v1/crm/contacts",
        headers: { authorization: `Bearer ${token}` },
        payload: { givenName: "Rel", familyName: "Contact", email: "rel.contact@example.com" },
      });
      expect(contact.statusCode).toBe(400);
      expect(contact.json().reason).toBe("person_domain_removed");

      const rel = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          contactId: "11111111-1111-4111-8111-111111111111",
          organizationId: org.id,
        },
      });
      expect(rel.statusCode).toBe(400);
      expect(rel.json().reason).toBe("person_domain_removed");

      const contactsForOrg = await app.inject({
        method: "GET",
        url: `/v1/crm/contacts?organizationId=${org.id}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(contactsForOrg.statusCode).toBe(400);
      expect(contactsForOrg.json().reason).toBe("person_domain_removed");
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

    it("rejects contact relationship payloads as person_domain_removed", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const orgA = await createTestOrg(app, token, "Org A");
      const relTypeId = await employeeOfTypeId(app, token);

      const withContact = await app.inject({
        method: "POST",
        url: "/v1/crm/relationships",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          relationshipTypeId: relTypeId,
          contactId: "11111111-1111-4111-8111-111111111111",
          organizationId: orgA.id,
        },
      });
      expect(withContact.statusCode).toBe(400);
      expect(withContact.json().reason).toBe("person_domain_removed");
    });

    it("updates and transitions org-org relationships with version checks", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const parent = await createTestOrg(app, token, "Transition Parent");
      const child = await createTestOrg(app, token, "Transition Child");
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
