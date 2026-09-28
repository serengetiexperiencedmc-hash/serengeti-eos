import { describe, expect, it } from "vitest";
import { generateProposal, getProposalDetail } from "../src/proposal/proposal.js";
import { seedStore } from "../src/app.js";
import { principalById, type Store } from "../src/store.js";
import type { DbPool } from "@sedmc/db";

const TENANT = "11111111-1111-4111-8111-111111111111";
const PARTNER_TENANT = "22222222-2222-4222-8222-222222222222";
const CAROL = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const RFP_ID = "a38b5c4a-e4d8-4965-9e4d-ad8b801d122d";
const PROGRAMME_ID = "b0204b18-911a-49ed-90bc-4c884eb42db8";
const SHEET_ID = "24c3a638-a1db-445e-9b91-ef7e5bff626f";
const APPROVAL_ID = "3f23e84e-f67f-41bf-81be-8eba113f1081";
const ORG_ID = "3cf88970-8a0a-4af2-bf9a-02a1e0947a7d";

function rfpRow(tenantId: string) {
  return {
    id: RFP_ID,
    tenant_id: tenantId,
    rfp_code: "UAT-RFP-001",
    opportunity_id: "e5c5358f-3354-4659-870d-60aa7319780a",
    organization_id: ORG_ID,
    title: "UAT synthetic RFP",
    workflow_stage: "approval",
    status: "active",
    current_version: 1,
    classification: "Internal",
    version: 1,
    created_at: "2026-09-22T09:54:37.247Z",
    updated_at: "2026-09-22T09:54:37.247Z",
    created_by_principal_id: CAROL,
    updated_by_principal_id: CAROL,
  };
}

function programmeRow(tenantId: string) {
  return {
    id: PROGRAMME_ID,
    tenant_id: tenantId,
    programme_code: "PRG-001",
    rfp_id: RFP_ID,
    opportunity_id: "e5c5358f-3354-4659-870d-60aa7319780a",
    organization_id: ORG_ID,
    title: "UAT programme",
    status: "active",
    day_count: 1,
    classification: "Internal",
    version: 1,
    created_at: "2026-09-22T09:54:37.247Z",
    updated_at: "2026-09-22T09:54:37.247Z",
    created_by_principal_id: CAROL,
    updated_by_principal_id: CAROL,
    destinations: "Serengeti",
  };
}

function sheetRow(tenantId: string) {
  return {
    id: SHEET_ID,
    tenant_id: tenantId,
    sheet_code: "CST-001",
    programme_id: PROGRAMME_ID,
    rfp_id: RFP_ID,
    opportunity_id: "e5c5358f-3354-4659-870d-60aa7319780a",
    organization_id: ORG_ID,
    status: "active",
    currency: "USD",
    margin_floor_percent: 0,
    total_cost: 1000,
    sell_price: 1200,
    margin_percent: 16.67,
    margin_amount: 200,
    current_version: 1,
    classification: "Internal",
    version: 1,
    pax_count: 12,
    created_at: "2026-09-22T09:54:37.247Z",
    updated_at: "2026-09-22T09:54:37.247Z",
    created_by_principal_id: CAROL,
    updated_by_principal_id: CAROL,
  };
}

function approvalRow(tenantId: string) {
  return {
    id: APPROVAL_ID,
    tenant_id: tenantId,
    request_code: "APR-001",
    cost_sheet_id: SHEET_ID,
    rfp_id: RFP_ID,
    programme_id: PROGRAMME_ID,
    organization_id: ORG_ID,
    status: "approved",
    gate_type: "margin_floor",
    gate_reason: "UAT",
    margin_percent: 16.67,
    margin_floor_percent: 0,
    total_cost: 1000,
    sell_price: 1200,
    currency: "USD",
    margin_meets_floor: true,
    requested_by_principal_id: CAROL,
    classification: "Internal",
    version: 1,
    created_at: "2026-09-22T09:54:37.247Z",
    updated_at: "2026-09-22T09:54:37.247Z",
  };
}

function mockMixedPool(options?: { rfpTenantId?: string }) {
  const rfpTenant = options?.rfpTenantId ?? TENANT;
  const proposals: Record<string, unknown>[] = [];
  const versions: Record<string, unknown>[] = [];
  const sql: string[] = [];

  const query = async (text: string, params: unknown[] = []) => {
    sql.push(text);
    const q = text.replace(/\s+/g, " ");
    if (text === "BEGIN" || text === "COMMIT" || text === "ROLLBACK") return { rows: [], rowCount: 0 };
    if (q.includes("FROM rfp_rfps") && q.includes("id = $1")) {
      const id = params[0];
      const tenantId = params[1];
      if (id === RFP_ID && tenantId === rfpTenant) return { rows: [rfpRow(rfpTenant)], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM prg_programmes") && q.includes("rfp_id")) {
      const tenantId = params[0];
      if (tenantId === rfpTenant) return { rows: [programmeRow(rfpTenant)], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM cost_sheets")) {
      const tenantId = params[0];
      if (tenantId === rfpTenant) return { rows: [sheetRow(rfpTenant)], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM com_approval_requests")) {
      const tenantId = params[0];
      if (tenantId === rfpTenant) return { rows: [approvalRow(rfpTenant)], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("INSERT INTO prop_proposals")) {
      const row = {
        id: params[0],
        tenant_id: params[1],
        proposal_code: params[2],
        rfp_id: params[3],
        programme_id: params[4],
        cost_sheet_id: params[5],
        approval_request_id: params[6],
        organization_id: params[7],
        title: params[8],
        status: params[9],
        currency: params[10],
        total_cost: params[11],
        sell_price: params[12],
        margin_percent: params[13],
        pax_count: params[14],
        programme_summary: params[15],
        itinerary_day_count: params[16],
        sent_at: params[17],
        client_viewed_at: params[18],
        current_version: params[19],
        classification: params[20],
        version: params[21],
        archived_at: params[22],
        created_at: params[23],
        updated_at: params[24],
        created_by_principal_id: params[25],
        updated_by_principal_id: params[26],
      };
      proposals.push(row);
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("INSERT INTO prop_proposal_versions")) {
      versions.push({
        id: params[0],
        tenant_id: params[1],
        proposal_id: params[2],
        version_number: params[3],
        summary: params[4],
        snapshot: params[5],
        created_at: params[6],
        created_by_principal_id: params[7],
      });
      return { rows: [], rowCount: 1 };
    }
    if (q.includes("FROM prop_proposals") && q.includes("id = $1")) {
      const row = proposals.find((p) => p.id === params[0] && p.tenant_id === params[1] && p.archived_at == null);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM prop_proposals") && q.includes("rfp_id")) {
      const row = proposals.find((p) => p.tenant_id === params[0] && p.rfp_id === params[1] && p.archived_at == null);
      return row ? { rows: [row], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM prop_proposals") && q.includes("proposal_code")) {
      const exists = proposals.some((p) => p.tenant_id === params[0] && p.proposal_code === params[1]);
      return exists ? { rows: [{ "?column?": 1 }], rowCount: 1 } : { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM prop_proposal_versions")) {
      const rows = versions.filter((v) => v.tenant_id === params[0] && v.proposal_id === params[1]);
      return { rows, rowCount: rows.length };
    }
    if (q.includes("FROM prg_days") || q.includes("FROM prg_items") || q.includes("FROM cost_line_items")) {
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("FROM audit_events") && q.includes("row_hash")) {
      return { rows: [], rowCount: 0 };
    }
    if (q.includes("INSERT INTO audit_events") || q.includes("INSERT INTO outbox_events")) {
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  };

  const client = { query, release() {} };
  return {
    sql,
    proposals,
    versions,
    pool: {
      connect: async () => client,
      query,
    } as unknown as DbPool,
  };
}

function attachPool(store: Store, pool: DbPool) {
  store.dbPool = pool;
  store.rfpRfps = [];
  store.prgProgrammes = [];
  store.costSheets = [];
  store.comApprovalRequests = [];
  store.propProposals = [];
  store.propProposalVersions = [];
}

describe("H-151 D-01 durable proposal generation", () => {
  it("generates from mixed-SQL RFP when store.rfpRfps is empty", async () => {
    const store = seedStore("h151-d01");
    const { pool, proposals } = mockMixedPool();
    attachPool(store, pool);
    const carol = principalById(store, CAROL)!;

    const result = await generateProposal(store, carol, { rfpId: RFP_ID, title: "UAT synthetic proposal" }, "h151-d01");
    expect(result).not.toHaveProperty("error");
    expect("proposal" in result && result.proposal.rfpId).toBe(RFP_ID);
    expect(proposals).toHaveLength(1);
    expect(proposals[0]?.rfp_id).toBe(RFP_ID);
    expect(proposals[0]?.tenant_id).toBe(TENANT);
    expect(store.rfpRfps).toHaveLength(0);
  });

  it("retrieves the persisted proposal after clearing in-memory collections", async () => {
    const store = seedStore("h151-d01-restart");
    const { pool, proposals } = mockMixedPool();
    attachPool(store, pool);
    const carol = principalById(store, CAROL)!;
    const created = await generateProposal(store, carol, { rfpId: RFP_ID, title: "UAT synthetic proposal" }, "h151-d01-r");
    expect("proposal" in created).toBe(true);
    const proposalId = "proposal" in created ? created.proposal.id : "";
    store.propProposals = [];
    store.propProposalVersions = [];
    const got = await getProposalDetail(store, carol, proposalId);
    expect(got).not.toHaveProperty("error");
    expect("proposal" in got && got.proposal.id).toBe(proposalId);
    expect(proposals).toHaveLength(1);
  });

  it("does not return another tenant's persisted RFP", async () => {
    const store = seedStore("h151-d01-tenant");
    const { pool } = mockMixedPool({ rfpTenantId: TENANT });
    attachPool(store, pool);
    const carol = principalById(store, CAROL)!;
    const foreign = { ...carol, tenantId: PARTNER_TENANT, id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd" };
    const result = await generateProposal(store, foreign, { rfpId: RFP_ID, title: "cross tenant" }, "h151-d01-t");
    expect(result).toEqual({ error: "not_found", reason: "rfp_not_found" });
  });

  it("rejects person-domain keys on generate (OD-09)", async () => {
    const store = seedStore("h151-d01-privacy");
    const { pool } = mockMixedPool();
    attachPool(store, pool);
    const carol = principalById(store, CAROL)!;
    const result = await generateProposal(
      store,
      carol,
      { rfpId: RFP_ID, title: "x", guestName: "Jane" } as { rfpId: string; title: string },
      "h151-d01-p",
    );
    expect(result).toMatchObject({ error: "invalid_request", reason: "person_domain_removed" });
  });
});
