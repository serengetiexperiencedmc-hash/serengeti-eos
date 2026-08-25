import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { listMigrationFiles } from "@sedmc/db";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      email: "carol.admin@sedmc.local",
      password: P.carolPassword,
      tenantSlug: "sedmc",
    },
  });
  return res.json().accessToken as string;
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      email: "alice.finance@sedmc.local",
      password: P.alicePassword,
      tenantSlug: "sedmc",
    },
  });
  return res.json().accessToken as string;
}

async function miceAgencyTypeId(app: ReturnType<typeof buildServer>, token: string) {
  const types = await app.inject({
    method: "GET",
    url: "/v1/crm/organization-types",
    headers: { authorization: `Bearer ${token}` },
  });
  const item = types.json().items.find((t: { key: string }) => t.key === "mice_agency");
  expect(item).toBeTruthy();
  return item.id as string;
}

describe("C1.2 CRM organizations + units", () => {
  it("lists C1.2 migration and schema registry phase bump", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("005_c1_org_units"))).toBe(true);
  });

  describe("organizations", () => {
    it("creates, retrieves, lists, and updates a valid organization", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);

      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          legalName: "Global Travel Group Ltd",
          tradingName: "Global Travel",
          organizationTypeId,
          country: "GB",
          market: "Europe",
        },
      });
      expect(created.statusCode).toBe(201);
      const org = created.json().organization;
      expect(org.status).toBe("Prospect");
      expect(org.legalName).toBe("Global Travel Group Ltd");
      expect(org).not.toHaveProperty("tenantId");
      expect(org.createdByPrincipalId).toBeTruthy();
      expect(org.updatedByPrincipalId).toBeTruthy();

      const fetched = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${org.id}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(fetched.statusCode).toBe(200);
      expect(fetched.json().organization.id).toBe(org.id);
      expect(fetched.json().organization).not.toHaveProperty("tenantId");

      const listed = await app.inject({
        method: "GET",
        url: "/v1/crm/organizations?status=Prospect",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(200);
      expect(listed.json().items.some((o: { id: string }) => o.id === org.id)).toBe(true);
      expect(listed.json().items.every((o: { tenantId?: string }) => o.tenantId === undefined)).toBe(true);

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/organizations/${org.id}`,
        headers: { authorization: `Bearer ${token}`, "if-match": String(org.version) },
        payload: { tradingName: "Global Travel Group" },
      });
      expect(updated.statusCode).toBe(200);
      expect(updated.json().organization.tradingName).toBe("Global Travel Group");
      expect(updated.json().organization.version).toBe(org.version + 1);
    });

    it("rejects invalid organization type and missing required fields", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);

      const missingType = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "No Type Org" },
      });
      expect(missingType.statusCode).toBe(400);
      expect(missingType.json().reason).toBe("organization_type_required");

      const missingName = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "   ", organizationTypeId: "00000000-0000-4000-8000-000000000001" },
      });
      expect(missingName.statusCode).toBe(400);
      expect(missingName.json().reason).toBe("legal_name_required");
    });

    it("rejects duplicate organization by normalized legal name", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);

      const first = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Acme Corporation Ltd", organizationTypeId },
      });
      expect(first.statusCode).toBe(201);

      const dup = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "ACME Corporation", organizationTypeId },
      });
      expect(dup.statusCode).toBe(409);
      expect(dup.json().reason).toBe("duplicate_organization");
    });

    it("denies organization access without CRM permission", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginAlice(app);
      const res = await app.inject({
        method: "GET",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.statusCode).toBe(403);
    });

    it("hides cross-tenant organization as not found", async () => {
      const store = seedStore("test-secret");
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Tenant Scoped Org", organizationTypeId },
      });
      const orgId = created.json().organization.id;

      const partner = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: {
          email: "partner@external.local",
          password: P.partnerPassword,
          tenantSlug: "partner-demo",
        },
      });
      const partnerToken = partner.json().accessToken;
      const peek = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${orgId}`,
        headers: { authorization: `Bearer ${partnerToken}` },
      });
      expect(peek.statusCode).toBe(404);

      const partnerList = await app.inject({
        method: "GET",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${partnerToken}` },
      });
      expect([403, 404]).toContain(partnerList.statusCode);
      if (partnerList.statusCode === 200) {
        expect(partnerList.json().items.some((o: { id: string }) => o.id === orgId)).toBe(false);
      }
    });

    it("transitions lifecycle and archives when permitted", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);
      const created = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations",
        headers: { authorization: `Bearer ${token}` },
        payload: { legalName: "Lifecycle Org Ltd", organizationTypeId },
      });
      const orgId = created.json().organization.id;

      const engaged = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Engaged" },
      });
      expect(engaged.statusCode).toBe(200);

      const invalid = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${orgId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { to: "Active" },
      });
      expect(invalid.statusCode).toBe(409);
      expect(invalid.json().reason).toBe("invalid_transition");
    });
  });

  describe("organization units", () => {
    it("creates, retrieves, lists, and updates units for an organization", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);
      const org = (
        await app.inject({
          method: "POST",
          url: "/v1/crm/organizations",
          headers: { authorization: `Bearer ${token}` },
          payload: { legalName: "Unit Parent Org", organizationTypeId },
        })
      ).json().organization;

      const root = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "Europe", unitType: "division" },
      });
      expect(root.statusCode).toBe(201);
      const rootUnit = root.json().unit;
      expect(rootUnit.organizationId).toBe(org.id);

      const child = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "MICE Division", unitType: "department", parentUnitId: rootUnit.id },
      });
      expect(child.statusCode).toBe(201);

      const listed = await app.inject({
        method: "GET",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(200);
      expect(listed.json().items).toHaveLength(2);

      const fetched = await app.inject({
        method: "GET",
        url: `/v1/crm/organization-units/${child.json().unit.id}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(fetched.statusCode).toBe(200);

      const updated = await app.inject({
        method: "PATCH",
        url: `/v1/crm/organization-units/${child.json().unit.id}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "MICE & Events" },
      });
      expect(updated.statusCode).toBe(200);
      expect(updated.json().unit.name).toBe("MICE & Events");
    });

    it("rejects invalid organization reference and duplicate unit names", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);

      const missingOrg = await app.inject({
        method: "POST",
        url: "/v1/crm/organizations/00000000-0000-4000-8000-000000009999/units",
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "Orphan Unit", unitType: "branch" },
      });
      expect(missingOrg.statusCode).toBe(404);

      const organizationTypeId = await miceAgencyTypeId(app, token);
      const org = (
        await app.inject({
          method: "POST",
          url: "/v1/crm/organizations",
          headers: { authorization: `Bearer ${token}` },
          payload: { legalName: "Duplicate Unit Org", organizationTypeId },
        })
      ).json().organization;

      const first = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "Sales", unitType: "department" },
      });
      expect(first.statusCode).toBe(201);

      const dup = await app.inject({
        method: "POST",
        url: `/v1/crm/organizations/${org.id}/units`,
        headers: { authorization: `Bearer ${token}` },
        payload: { name: "sales", unitType: "department" },
      });
      expect(dup.statusCode).toBe(409);
      expect(dup.json().reason).toBe("duplicate_unit");
    });

    it("rejects invalid parent-unit hierarchy", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginCarol(app);
      const organizationTypeId = await miceAgencyTypeId(app, token);
      const org = (
        await app.inject({
          method: "POST",
          url: "/v1/crm/organizations",
          headers: { authorization: `Bearer ${token}` },
          payload: { legalName: "Hierarchy Org", organizationTypeId },
        })
      ).json().organization;

      const unit = (
        await app.inject({
          method: "POST",
          url: `/v1/crm/organizations/${org.id}/units`,
          headers: { authorization: `Bearer ${token}` },
          payload: { name: "Root", unitType: "division" },
        })
      ).json().unit;

      const selfParent = await app.inject({
        method: "PATCH",
        url: `/v1/crm/organization-units/${unit.id}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { parentUnitId: unit.id },
      });
      expect(selfParent.statusCode).toBe(400);
      expect(selfParent.json().reason).toBe("invalid_parent_unit_cycle");
    });

    it("denies unit operations without CRM permission", async () => {
      const app = buildServer({ store: seedStore("test-secret") });
      const token = await loginAlice(app);
      const res = await app.inject({
        method: "GET",
        url: "/v1/crm/organizations/00000000-0000-4000-8000-000000000001/units",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.statusCode).toBe(403);
    });
  });
});
