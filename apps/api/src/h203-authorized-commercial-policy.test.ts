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

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "H203 Policy Ltd,corporate,H203 Policy,UK"].join(
    "\n",
  );
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `h203-pol-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createProgramme(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  suffix: string,
  extra: Record<string, unknown> = {},
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: `OPP-H203P-${suffix}`,
      title: "H203 Policy",
      organizationId: orgId,
      paxCount: 12,
    },
  });
  const opportunityId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-H203P-${suffix}`,
      opportunityId,
      title: "H203 Policy RFP",
      paxCount: 12,
      destinations: "Serengeti",
    },
  });
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId: rfp.json().rfp.id,
      title: "H203 Policy Programme",
      startDate: "2026-06-10",
      endDate: "2026-06-24",
      paxCount: 12,
      ...extra,
    },
  });
  return {
    opportunityId,
    rfp: rfp.json().rfp as { id: string; workflowStage: string },
    programme: prg.json().programme as Record<string, unknown>,
    programmeId: prg.json().programme.id as string,
  };
}

describe("H-203 authorized commercial policy (Dev/Test)", () => {
  it("records authorized policy and productionReady = false", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("25% default markup");
    expect(text).toContain("15% gross margin");
    expect(text).toContain("US$200 file fee");
    expect(text).toContain("client remains editable");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).toContain("CLIENT-FACING COMMERCIAL CONFIDENTIALITY");
  });

  it("lists Dev/Test migration 128 after 127 and not 129", () => {
    const files = listMigrationFiles().map((file) => file.replace(/\\/g, "/"));
    expect(files.some((file) => file.endsWith("migrations/126_h203_commercial_core_programme_rfp_finance.sql"))).toBe(
      true,
    );
    expect(files.some((file) => file.endsWith("migrations/127_h203_authorized_commercial_policy.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/128_h203_issued_proposal_durability.sql"))).toBe(true);
    expect(files.some((file) => file.endsWith("migrations/129_h203_issued_client_document.sql"))).toBe(true);
    expect(files[files.length - 1] ?? "").toContain("130_h203_issued_client_document_delivery");
    expect(files.some((file) => /\/131_/.test(file))).toBe(false);
  });

  it("applies 25% markup, ~20% GM before fee, incorporates $200 fee, and sanitizes clientFacing", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, rfp } = await createProgramme(app, token, orgId, "001");

    const created = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
      },
    });
    expect(created.statusCode).toBe(201);
    const sheet = created.json().sheet as Record<string, unknown>;
    expect(sheet.markupPercent).toBe(25);
    expect(sheet.marginFloorPercent).toBe(15);
    expect(sheet.totalCost).toBe(1000);
    expect(sheet.fileFeeAmount).toBe(200);
    expect(sheet.clientSellingPrice).toBe(1450);
    expect(sheet.marginPercent).toBeCloseTo(31.03, 1);
    expect((sheet.financialSummary as { markupPercentApplied?: number }).markupPercentApplied).toBe(25);
    expect((sheet.financialSummary as { fileFeeAmount?: number }).fileFeeAmount).toBe(200);
    expect(sheet.clientFacing).toEqual({ currency: "USD", clientSellingPrice: 1450 });
    expect(sheet.clientFacing).not.toHaveProperty("totalCost");
    expect(sheet.clientFacing).not.toHaveProperty("fileFeeAmount");
    expect(sheet.clientFacing).not.toHaveProperty("marginPercent");
    expect(sheet.clientFacing).not.toHaveProperty("grossProfit");
    expect(JSON.stringify(sheet.clientFacing)).not.toMatch(/file fee/i);

    const coreOnlyMargin = (1250 - 1000) / 1250;
    expect(coreOnlyMargin).toBeCloseTo(0.2, 4);

    const workspace = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/proposal-preparation`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(workspace.statusCode).toBe(200);
    expect(workspace.json().clientFacing).toEqual({ currency: "USD", clientSellingPrice: 1450 });
    expect(workspace.json().financialSummary.supplierCost).toBe(1000);
    expect(workspace.json().financialSummary.fileFeeAmount).toBe(200);
    expect(workspace.json().sourceOfTruth.wonLost).toBe("opportunity");
    expect(workspace.json().sourceOfTruth.wonLostOwner).toBe("consultant");
    expect(workspace.json().sourceOfTruth.commercialResponsibility).toBe("ceo_md+commercial_director");
    expect(workspace.json().rfpWorkflow.stages).toEqual([
      "intake",
      "programme",
      "costing",
      "approval",
      "proposal",
      "sent",
      "closed",
    ]);
  });

  it("keeps a manual selling-price override as the final client price", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "002");

    const created = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        sellPrice: 1600,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().sheet.clientSellingPrice).toBe(1600);
    expect(created.json().sheet.fileFeeAmount).toBe(200);
    expect(created.json().sheet.financialSummary.sellPriceSource).toBe("sellPriceOverride");
    expect(created.json().sheet.clientFacing.clientSellingPrice).toBe(1600);
  });

  it("rejects sell-at-cost as below the authorized 15% floor and records an explicit exception", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "003");

    const rejected = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        sellPrice: 1000,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
      },
    });
    expect(rejected.statusCode).toBe(400);
    expect(rejected.json().reason).toBe("margin_below_authorized_floor");

    const allowed = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        sellPrice: 1000,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
        marginFloorExceptionReason: "Owner-authorized below-floor exception for this test file",
      },
    });
    expect(allowed.statusCode).toBe(201);
    expect(allowed.json().sheet.marginPercent).toBe(0);
    expect(allowed.json().sheet.marginFloorExceptionReason).toMatch(/Owner-authorized/);
    expect(allowed.json().sheet.marginFloorPercent).toBe(15);
  });

  it("does not invent a statutory tax rate or fetch FX", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "004");

    const none = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        taxMode: "none",
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
        fxCurrencyPair: "USD/TZS",
        fxRate: 2500,
        fxAsOfDate: "2026-06-01",
        fxSourceReference: "manual commercial input",
      },
    });
    expect(none.statusCode).toBe(201);
    expect(none.json().sheet.taxMode).toBe("none");
    expect(none.json().sheet.taxAmount).toBe(0);
    expect(none.json().sheet.fxCurrencyPair).toBe("USD/TZS");
    expect(none.json().sheet.fxRate).toBe(2500);
    expect(none.json().sheet.fxAsOfDate).toBe("2026-06-01");
    expect(none.json().sheet.fxSourceReference).toBe("manual commercial input");
    expect(none.json().sheet.clientFacing).not.toHaveProperty("fxRate");
    expect(none.json().sheet.clientFacing).not.toHaveProperty("taxAmount");
  });

  it("keeps client label editable, final locked, 30% deposit, 30/40/30 milestones, date nights, and explicit rooming", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId, programme, rfp } = await createProgramme(app, token, orgId, "005");

    expect(programme.depositPercent).toBe(30);
    expect(programme.paymentMilestones).toEqual([
      { code: "confirmation", label: "On confirmation", percent: 30 },
      { code: "days_before_arrival_90", label: "90 days before arrival", percent: 40 },
      { code: "days_before_arrival_30", label: "30 days before arrival", percent: 30 },
    ]);
    expect(programme.nightCount).toBe(14);
    expect(programme.safariVehicleMaxPassengers).toBe(6);
    expect(programme.requiredVehicles).toBe(2);
    expect(programme.driverGuideMaxGuests).toBe(6);
    expect(programme.commercialResponsibility).toEqual({
      commercialRoles: ["ceo_md", "commercial_director"],
      wonLostOwner: "consultant",
      wonLostRecord: "opportunity",
    });

    const clientLabel = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "client" },
    });
    expect(clientLabel.statusCode).toBe(200);
    expect(clientLabel.json().programme.commercialVersionLabel).toBe("client");

    const stillEditable = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        inclusionsText: "Park fees as entered",
        exclusionsText: "International flights as entered",
        depositPercent: 40,
        paymentMilestones: [
          { code: "confirmation", label: "On confirmation", percent: 40 },
          { code: "days_before_arrival_30", label: "30 days before arrival", percent: 60 },
        ],
      },
    });
    expect(stillEditable.statusCode).toBe(200);
    expect(stillEditable.json().programme.inclusionsText).toBe("Park fees as entered");
    expect(stillEditable.json().programme.depositPercent).toBe(40);
    expect(stillEditable.json().programme.paymentMilestones.map((m: { percent: number }) => m.percent)).toEqual([
      40, 60,
    ]);

    const badMilestones = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        paymentMilestones: [{ code: "confirmation", label: "On confirmation", percent: 50 }],
      },
    });
    expect(badMilestones.statusCode).toBe(400);

    const rooming = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/rooming`,
      headers: { authorization: `Bearer ${token}` },
      payload: { roomType: "twin", roomCount: 4, occupancy: 2 },
    });
    expect(rooming.statusCode).toBe(201);
    expect(rooming.json().rooming).toEqual(
      expect.arrayContaining([expect.objectContaining({ roomType: "twin", roomCount: 4, occupancy: 2 })]),
    );

    const dates = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { startDate: "2026-06-01", endDate: "2026-06-10" },
    });
    expect(dates.statusCode).toBe(200);
    expect(dates.json().programme.nightCount).toBe(9);

    const invalid = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { startDate: "2026-06-10", endDate: "2026-06-01" },
    });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().reason).toBe("invalid_date_range");
    const afterInvalid = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(afterInvalid.statusCode).toBe(200);
    expect(afterInvalid.json().programme.startDate).toBe("2026-06-01");
    expect(afterInvalid.json().programme.endDate).toBe("2026-06-10");
    expect(afterInvalid.json().programme.nightCount).toBe(9);

    const silentNights = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { nightCountOverride: 99 },
    });
    expect(silentNights.statusCode).toBe(400);

    const finalLabel = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { commercialVersionLabel: "final" },
    });
    expect(finalLabel.statusCode).toBe(200);

    const locked = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/rooming`,
      headers: { authorization: `Bearer ${token}` },
      payload: { roomType: "single", roomCount: 1 },
    });
    expect(locked.statusCode).toBe(409);
    expect(locked.json().reason).toBe("programme_version_locked");

    const rfpGet = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(["intake", "programme", "costing", "approval", "proposal", "sent", "closed"]).toContain(
      rfpGet.json().rfp.workflowStage,
    );
    expect(rfpGet.json().rfp).not.toHaveProperty("wonLost");
  });

  it("does not let finance.member authorize a below-floor exception", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await loginCarol(app);
    const alice = await loginAlice(app);
    expect(alice.length).toBeGreaterThan(8);
    const orgId = await seedOrg(app, carol);
    const { programmeId } = await createProgramme(app, carol, orgId, "006");

    const denied = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${alice}` },
      payload: {
        programmeId,
        sellPrice: 1000,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 1000 }],
        marginFloorExceptionReason: "Alice cannot authorize this",
      },
    });
    expect([403, 400]).toContain(denied.statusCode);
  });

  it("rejects invalid date PATCH without mutating in-memory programme state", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "007");

    const before = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.statusCode).toBe(200);
    const original = before.json().programme as {
      title: string;
      startDate: string;
      endDate: string;
      nightCount: number;
      version: number;
      inclusionsText?: string;
    };
    expect(original.startDate).toBe("2026-06-10");
    expect(original.endDate).toBe("2026-06-24");
    expect(original.nightCount).toBe(14);

    const rejected = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        startDate: "2026-07-01",
        endDate: "2026-06-01",
        title: "Must not persist",
        inclusionsText: "Must not persist",
      },
    });
    expect(rejected.statusCode).toBe(400);
    expect(rejected.json().reason).toBe("invalid_date_range");

    const after = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.statusCode).toBe(200);
    expect(after.json().programme.title).toBe(original.title);
    expect(after.json().programme.startDate).toBe("2026-06-10");
    expect(after.json().programme.endDate).toBe("2026-06-24");
    expect(after.json().programme.nightCount).toBe(14);
    expect(after.json().programme.version).toBe(original.version);
    expect(after.json().programme.inclusionsText).toBeUndefined();

    const memory = store.prgProgrammes.find((p) => p.id === programmeId);
    expect(memory?.title).toBe(original.title);
    expect(memory?.startDate).toBe("2026-06-10");
    expect(memory?.endDate).toBe("2026-06-24");
    expect(memory?.version).toBe(original.version);
    expect(memory?.inclusionsText).toBeUndefined();
  });

  it("derives one-night and same-day night counts without inventing a same-day exception", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "008");

    const oneNight = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { startDate: "2026-06-10", endDate: "2026-06-11" },
    });
    expect(oneNight.statusCode).toBe(200);
    expect(oneNight.json().programme.nightCount).toBe(1);

    const sameDay = await app.inject({
      method: "PATCH",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { startDate: "2026-06-10", endDate: "2026-06-10" },
    });
    expect(sameDay.statusCode).toBe(200);
    expect(sameDay.json().programme.nightCount).toBe(0);
  });

  it("defaults 100 cost to 125 base sell (~20% GM) and 325 client price with USD file fee", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token);
    const { programmeId } = await createProgramme(app, token, orgId, "009");

    const created = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        lineItems: [{ category: "transport", description: "Transfer", unitCost: 100 }],
      },
    });
    expect(created.statusCode).toBe(201);
    const sheet = created.json().sheet as Record<string, unknown>;
    expect(sheet.totalCost).toBe(100);
    expect(sheet.markupPercent).toBe(25);
    const summary = sheet.financialSummary as { markupPercentApplied?: number; fileFeeAmount?: number };
    expect(summary.markupPercentApplied).toBe(25);
    expect((125 - 100) / 125).toBeCloseTo(0.2, 4);
    expect(sheet.clientSellingPrice).toBe(325);
    expect(sheet.fileFeeAmount).toBe(200);
    expect(sheet.clientFacing).toEqual({ currency: "USD", clientSellingPrice: 325 });
    expect(JSON.stringify(sheet.clientFacing)).not.toMatch(/markup|margin|fileFee|supplier|tax|fx/i);
  });
});
