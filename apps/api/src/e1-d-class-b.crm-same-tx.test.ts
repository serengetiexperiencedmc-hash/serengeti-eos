import { describe, expect, it } from "vitest";
import { CRM_EVENT_TYPES } from "@sedmc/kernel";
import { seedStore } from "../src/app.js";
import { commitCrmWithOutbox, ensureCrmEventCatalogue } from "../src/crm/events.js";
import { allowCrmAudit } from "../src/crm/audit.js";
import { principalById, type Store } from "../src/store.js";

function mockPool(failWhen: (sql: string) => boolean): {
  pool: NonNullable<Store["dbPool"]>;
  sql: string[];
} {
  const sql: string[] = [];
  const query = async (text: string) => {
    sql.push(text);
    if (failWhen(text)) throw new Error("outbox_write_failed");
    return { rows: [], rowCount: 0 };
  };
  const client = {
    query,
    release() {},
  };
  return {
    sql,
    pool: {
      connect: async () => client,
      query,
    } as NonNullable<Store["dbPool"]>,
  };
}

function mutateOrg(store: Store, carol: NonNullable<ReturnType<typeof principalById>>) {
  store.crmOrganizations.push({
    id: "11111111-1111-4111-8111-111111111111",
    tenantId: carol.tenantId,
    legalName: "Class B TX Org",
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
  allowCrmAudit(
    store,
    carol,
    "crm:write:organization",
    "crm_organization",
    "11111111-1111-4111-8111-111111111111",
    "e1d-b4",
    { legalName: "Class B TX Org" },
  );
}

describe("E1-D Class B CRM same-transaction outbox", () => {
  it("commits CRM entity SQL and outbox insert in one transaction on success", async () => {
    const store = seedStore("crm-tx-ok");
    ensureCrmEventCatalogue(store);
    const carol = principalById(store, "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
    const { pool, sql } = mockPool(() => false);
    store.dbPool = pool;
    const result = await commitCrmWithOutbox(store, carol, {
      eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
      entityType: "organization",
      entityId: "11111111-1111-4111-8111-111111111111",
      classification: "Internal",
      correlationId: "e1d-b4",
      payload: {
        organizationId: "11111111-1111-4111-8111-111111111111",
        status: "Prospect",
        legalName: "Class B TX Org",
      },
      mutate: () => mutateOrg(store, carol),
    });
    expect(result.ok).toBe(true);
    expect(sql.some((s) => s === "BEGIN")).toBe(true);
    expect(sql.some((s) => s === "COMMIT")).toBe(true);
    expect(sql.some((s) => s.includes("INSERT INTO outbox_events"))).toBe(true);
    expect(sql.some((s) => s.includes("INSERT INTO crm_organizations"))).toBe(true);
    expect(sql.some((s) => s.includes("INSERT INTO audit_events"))).toBe(true);
    expect(store.outboxEvents.some((e) => e.eventType === CRM_EVENT_TYPES.ORGANIZATION_CREATED)).toBe(true);
  });

  it("rolls back memory and issues ROLLBACK when outbox insert fails", async () => {
    const store = seedStore("crm-tx-fail");
    ensureCrmEventCatalogue(store);
    const carol = principalById(store, "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
    const orgBefore = store.crmOrganizations.length;
    const outboxBefore = store.outboxEvents.length;
    const { pool, sql } = mockPool((text) => text.includes("INSERT INTO outbox_events"));
    store.dbPool = pool;
    const result = await commitCrmWithOutbox(store, carol, {
      eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
      entityType: "organization",
      entityId: "11111111-1111-4111-8111-111111111111",
      classification: "Internal",
      correlationId: "e1d-b4-fail",
      payload: {
        organizationId: "11111111-1111-4111-8111-111111111111",
        status: "Prospect",
        legalName: "Class B TX Org",
      },
      mutate: () => mutateOrg(store, carol),
    });
    expect(result.ok).toBe(false);
    expect(sql.some((s) => s === "ROLLBACK")).toBe(true);
    expect(sql.some((s) => s === "COMMIT")).toBe(false);
    expect(store.crmOrganizations.length).toBe(orgBefore);
    expect(store.outboxEvents.length).toBe(outboxBefore);
  });

  it("does not start a durable transaction when mutate throws", async () => {
    const store = seedStore("crm-tx-mutate-fail");
    ensureCrmEventCatalogue(store);
    const carol = principalById(store, "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
    const { pool, sql } = mockPool(() => false);
    store.dbPool = pool;
    const result = await commitCrmWithOutbox(store, carol, {
      eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
      entityType: "organization",
      entityId: "11111111-1111-4111-8111-111111111111",
      classification: "Internal",
      correlationId: "e1d-b4-mutate",
      payload: {
        organizationId: "11111111-1111-4111-8111-111111111111",
        status: "Prospect",
        legalName: "Class B TX Org",
      },
      mutate: () => {
        throw new Error("mutation_failed");
      },
    });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toBe("mutation_failed");
    expect(sql).toEqual([]);
  });
});
