import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-203-commercial-core-programme-rfp-finance-development.md",
);

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Client Ltd,corporate,H203 Client,UK"].join("\n");
  const created = await app.inject({
    method: "POST",
    url: "/v1/crm/imports",
    headers: { authorization: `Bearer ${token}` },
    payload: { sourceSystem: "test", entityType: "organization", csv },
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createLinkedRfp(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  suffix = "001",
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H203-${suffix}`,
      title: "H203 Incentive",
      organizationId: orgId,
      paxCount: 24,
    },
  });
  const opportunityId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H203-${suffix}`,
      opportunityId,
      title: "H203 Serengeti Incentive",
      paxCount: 24,
      destinations: "Serengeti",
      requirementsText: "Keep original RFP requirements intact.",
      budgetMin: 100000,
      budgetMax: 140000,
      currency: "USD",
    },
  });
  return rfp.json().rfp as { id: string; requirementsText: string; workflowStage: string };
}

describe("H-203 commercial core Programme/RFP/Finance", () => {
  it("records infrastructure HOLD and commercial software priority", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("PRODUCTION INFRASTRUCTURE IMPLEMENTATION = HOLD");
    expect(text).toContain("SOFTWARE DEVELOPMENT PRIORITY = APPROVED");
    expect(text).toContain("Programme / RFP / Finance");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).toContain("Production infrastructure untouched: YES");
    expect(text).toContain("Production deployment: NONE");
    expect(text).toContain("internal working draft");
    const prepPage = join(
      dirname(fileURLToPath(import.meta.url)),
      "../../web/src/app/commercial/rfps/[id]/proposal-preparation/page.tsx",
    );
    expect(existsSync(prepPage)).toBe(true);
  });

  it("lists migration 126 and 127 as additive H-203 commercial files", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/126_h203_commercial_core_programme_rfp_finance.sql"))).toBe(
      true,
    );
    expect(files.some((file) => file.endsWith("migrations/127_h203_authorized_commercial_policy.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/128_h203_issued_proposal_durability.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/130_h203_issued_client_document_delivery.sql"))).toBe(true);
  });

  it("runs the RFP → Programme → components → costing → financial summary slice", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const rfp = await createLinkedRfp(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpId: rfp.id,
        title: "H203 Programme",
        startDate: "2026-06-01",
        endDate: "2026-06-08",
        days: [
          {
            dayNumber: 1,
            title: "Arrival",
            location: "Arusha",
            calendarDate: "2026-06-01",
            description: "Airport day",
            items: [{ title: "Airport transfer", itemType: "transport", startTime: "14:00" }],
          },
        ],
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().programme.rfpId).toBe(rfp.id);
    expect(created.json().programme.commercialVersionLabel).toBe("draft");
    const programmeId = created.json().programme.id as string;

    const day = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days`,
      headers: { authorization: `Bearer ${token}` },
      payload: { dayNumber: 2, title: "Serengeti", location: "Seronera", calendarDate: "2026-06-02" },
    });
    expect(day.statusCode).toBe(201);
    const dayId = day.json().day.id as string;

    const item = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Game drive", itemType: "excursion", quantity: 1, unit: "vehicle" },
    });
    expect(item.statusCode).toBe(201);
    expect(item.json().item.itemType).toBe("excursion");
    const itemId = item.json().item.id as string;

    const reorder = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}/items/${itemId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { sortOrder: 2 },
    });
    expect(reorder.statusCode).toBe(200);
    expect(reorder.json().item.sortOrder).toBe(2);

    const rfpAfter = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(rfpAfter.json().rfp.requirementsText).toBe("Keep original RFP requirements intact.");

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId, sellPrice: 15000, paxCount: 24 },
    });
    expect(sheet.statusCode).toBe(201);
    const sheetId = sheet.json().sheet.id as string;

    const negative = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheetId}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "transport", description: "Bad line", unitCost: -10 },
    });
    expect(negative.statusCode).toBe(400);
    expect(negative.json().reason).toBe("invalid_unit_cost");

    const line = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheetId}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        category: "transport",
        description: "Game drive vehicle",
        unitCost: 10000,
        quantity: 1,
        programmeItemId: itemId,
      },
    });
    expect(line.statusCode).toBe(201);
    expect(line.json().line.programmeItemId).toBe(itemId);
    expect(line.json().sheet.totalCost).toBe(10000);
    expect(line.json().sheet.sellPrice).toBe(15000);
    expect(line.json().sheet.financialSummary.supplierCost).toBe(10000);
    expect(line.json().sheet.financialSummary.clientSellingPrice).toBe(15000);
    expect(line.json().sheet.financialSummary.grossProfit).toBe(5000);

    const summary = await app.inject({
      method: "GET",
      url: `/v1/costing/sheets/by-programme/${programmeId}/summary`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(summary.statusCode).toBe(200);
    expect(summary.json().financialSummary.formula).toBe("kernel.computeCostTotals");
    expect(summary.json().financialSummary.clientSellingPrice).not.toBe(
      summary.json().financialSummary.supplierCost,
    );

    const workspace = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-workspace`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(workspace.statusCode).toBe(200);
    expect(workspace.json().programme.id).toBe(programmeId);
    expect(workspace.json().financialSummary.supplierCost).toBe(10000);
    expect(workspace.json().rfpWorkflow.wonLostRecord).toBe("opportunity");
    expect(workspace.json().rfpWorkflow.stages).not.toContain("won");
    expect(workspace.json().proposalPreparation.kind).toBe("internal_working_draft");
    expect(workspace.json().proposalPreparation.clientIssued).toBe(false);

    const prep = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/proposal-preparation`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(prep.statusCode).toBe(200);
    const body = prep.json();
    expect(body.kind).toBe("internal_working_draft");
    expect(body.clientIssued).toBe(false);
    expect(body.readiness).toBe("internal_working_draft");
    expect(body.programme.id).toBe(programmeId);
    expect(body.programme.commercialVersionLabel).toBe("draft");
    expect(body.days.map((d: { title: string }) => d.title)).toEqual(expect.arrayContaining(["Arrival", "Serengeti"]));
    expect(
      body.days.flatMap((d: { items: Array<{ title: string; itemType?: string }> }) => d.items).some(
        (i: { title: string; itemType?: string }) => i.title === "Game drive" && i.itemType === "excursion",
      ),
    ).toBe(true);
    expect(body.financialSummary.supplierCost).toBe(summary.json().financialSummary.supplierCost);
    expect(body.financialSummary.clientSellingPrice).toBe(summary.json().financialSummary.clientSellingPrice);
    expect(body.financialSummary.grossProfit).toBe(summary.json().financialSummary.grossProfit);
    expect(body.financialSummary.grossMarginPercent).toBe(summary.json().financialSummary.grossMarginPercent);
    expect(body.financialFormula).toBe("kernel.computeCostTotals");
    expect(body.financialSummary.formula).toBe("kernel.computeCostTotals");
    expect(body.costingStatus).toBe(summary.json().financialSummary.financialStatus);
    expect(body.rfp.requirementsText).toBe("Keep original RFP requirements intact.");
    expect(body.sourceOfTruth.wonLost).toBe("opportunity");
    expect(body.sourceOfTruth.financialTotals).toBe("kernel.computeCostTotals");
    expect(body.rfpWorkflow.stages).not.toContain("proposal_draft");
    expect(body.rfpWorkflow.stages).not.toContain("proposal_final");
    expect(body.rfpWorkflow.stages).not.toContain("won");
    expect(body.unresolved.map((g: { code: string }) => g.code)).toEqual(
      expect.arrayContaining([
        "tax_is_manual_input",
        "file_fee_internal_only",
        "client_issued_proposal_not_generated",
      ]),
    );
    expect(body.unresolved.map((g: { code: string }) => g.code)).not.toContain("programme_missing");
    expect(JSON.stringify(body.unresolved)).not.toMatch(/20%/);

    const labelled = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "final" },
    });
    expect(labelled.statusCode).toBe(200);
    expect(labelled.json().programme.commercialVersionLabel).toBe("final");

    const locked = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days`,
      headers: { authorization: `Bearer ${token}` },
      payload: { dayNumber: 3, title: "Should not write" },
    });
    expect(locked.statusCode).toBe(409);
    expect(locked.json().reason).toBe("programme_version_locked");

    const prepAfterLock = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/proposal-preparation`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(prepAfterLock.statusCode).toBe(200);
    expect(prepAfterLock.json().programme.commercialVersionLabel).toBe("final");
    expect(prepAfterLock.json().latestNumericProgrammeVersion.versionNumber).toBeGreaterThan(0);
    expect(prepAfterLock.json().financialSummary.clientSellingPrice).toBe(15000);

    const unlock = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "revised" },
    });
    expect(unlock.statusCode).toBe(200);
    expect(unlock.json().programme.commercialVersionLabel).toBe("revised");

    const invalidDates = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { startDate: "2026-06-10", endDate: "2026-06-01" },
    });
    expect(invalidDates.statusCode).toBe(400);
    expect(invalidDates.json().reason).toBe("invalid_date_range");
    const afterInvalidDates = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(afterInvalidDates.json().programme.startDate).toBe("2026-06-01");
    expect(afterInvalidDates.json().programme.endDate).toBe("2026-06-08");
  });

  it("loads incomplete proposal preparation when the RFP has no programme", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const rfp = await createLinkedRfp(app, token, orgId, "002");

    const prep = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/proposal-preparation`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(prep.statusCode).toBe(200);
    expect(prep.json().readiness).toBe("incomplete");
    expect(prep.json().programme).toBeNull();
    expect(prep.json().financialSummary).toBeNull();
    expect(prep.json().days).toEqual([]);
    expect(prep.json().unresolved.map((g: { code: string }) => g.code)).toEqual(
      expect.arrayContaining(["programme_missing", "cost_sheet_missing", "tax_is_manual_input"]),
    );
    expect(prep.json().rfpWorkflow.wonLostRecord).toBe("opportunity");
  });

  it("surfaces missing cost sheet instead of inventing financials", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const rfp = await createLinkedRfp(app, token, orgId, "003");

    const created = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: rfp.id, title: "H203 No Cost Sheet" },
    });
    expect(created.statusCode).toBe(201);

    const prep = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/proposal-preparation`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(prep.statusCode).toBe(200);
    expect(prep.json().readiness).toBe("incomplete");
    expect(prep.json().programme.programmeCode).toBe(created.json().programme.programmeCode);
    expect(prep.json().financialSummary).toBeNull();
    expect(prep.json().costingStatus).toBeNull();
    expect(prep.json().unresolved.map((g: { code: string }) => g.code)).toContain("cost_sheet_missing");
    expect(prep.json().unresolved.map((g: { code: string }) => g.code)).not.toContain("programme_missing");
  });
});
