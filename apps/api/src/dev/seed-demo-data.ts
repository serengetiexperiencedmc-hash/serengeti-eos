import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { FastifyInstance } from "fastify";
import { TEST_BOOTSTRAP_SECRETS, type Store } from "../app.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

export type DemoSeedSummary = {
  skipped: boolean;
  suppliers: number;
  supplierContacts: number;
  supplierRates: number;
  supplierContentBlocks: number;
  organizations: number;
  contacts: number;
  relationships: number;
  accounts: number;
  activities: number;
  opportunities: number;
  rfps: number;
  programmes: number;
  costSheets: number;
  approvalRequests: number;
  proposals: number;
  bookings: number;
};

async function loginBob(app: FastifyInstance): Promise<string> {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      email: "bob.approver@sedmc.local",
      password: TEST_BOOTSTRAP_SECRETS.bobPassword,
      tenantSlug: "sedmc",
    },
  });
  if (res.statusCode !== 200) {
    throw new Error(`login_failed:${res.statusCode}:${res.body}`);
  }
  return res.json().accessToken as string;
}

async function loginCarol(app: FastifyInstance): Promise<string> {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      email: "carol.admin@sedmc.local",
      password: TEST_BOOTSTRAP_SECRETS.carolPassword,
      tenantSlug: "sedmc",
    },
  });
  if (res.statusCode !== 200) {
    throw new Error(`login_failed:${res.statusCode}:${res.body}`);
  }
  return res.json().accessToken as string;
}

async function runImportBatch(
  app: FastifyInstance,
  token: string,
  basePath: "/v1/suppliers/imports" | "/v1/crm/imports",
  entityType: string,
  csv: string,
  idempotencyKey: string,
  sourceSystem = "demo-seed",
) {
  const headers = { authorization: `Bearer ${token}` };
  const created = await app.inject({
    method: "POST",
    url: basePath,
    headers,
    payload: { sourceSystem, entityType, csv },
  });
  if (created.statusCode !== 201) {
    throw new Error(`import_create_failed:${entityType}:${created.statusCode}:${created.body}`);
  }
  const batchId = created.json().batch.id as string;

  const validated = await app.inject({
    method: "POST",
    url: `${basePath}/${batchId}/validate`,
    headers,
  });
  if (validated.statusCode !== 200) {
    throw new Error(`import_validate_failed:${entityType}:${validated.statusCode}:${validated.body}`);
  }
  const batch = validated.json().batch as { status: string; validCount?: number; invalidCount?: number };
  if (batch.status !== "validated") {
    throw new Error(`import_validation_errors:${entityType}:${JSON.stringify(batch)}`);
  }

  const executed = await app.inject({
    method: "POST",
    url: `${basePath}/${batchId}/execute`,
    headers: { ...headers, "idempotency-key": idempotencyKey },
  });
  if (executed.statusCode !== 200) {
    throw new Error(`import_execute_failed:${entityType}:${executed.statusCode}:${executed.body}`);
  }
}

function readCsv(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf8");
}

export async function seedDemoCommercialData(
  app: FastifyInstance,
  store: Store,
): Promise<DemoSeedSummary> {
  const empty =
    store.supSuppliers.length === 0 &&
    store.crmOrganizations.length === 0 &&
    store.crmContacts.length === 0 &&
    store.oppOpportunities.length === 0;

  if (!empty) {
    return {
      skipped: true,
      suppliers: store.supSuppliers.length,
      supplierContacts: store.supContacts.length,
      supplierRates: store.supRates.length,
      supplierContentBlocks: store.supContentBlocks.length,
      organizations: store.crmOrganizations.length,
      contacts: store.crmContacts.length,
      relationships: store.crmRelationships.length,
      accounts: store.crmAccounts.length,
      activities: store.crmActivities.length,
      opportunities: store.oppOpportunities.length,
      rfps: store.rfpRfps.length,
      programmes: store.prgProgrammes.length,
      costSheets: store.costSheets.length,
      approvalRequests: store.comApprovalRequests.length,
      proposals: store.propProposals.length,
      bookings: store.bkgBookings.length,
    };
  }

  const token = await loginCarol(app);

  await runImportBatch(
    app,
    token,
    "/v1/suppliers/imports",
    "supplier",
    readCsv("docs/c4/import/suppliers.csv"),
    "demo-seed-suppliers",
  );
  await runImportBatch(
    app,
    token,
    "/v1/suppliers/imports",
    "supplier_contact",
    readCsv("docs/c4/import/supplier-contacts.csv"),
    "demo-seed-supplier-contacts",
  );
  await runImportBatch(
    app,
    token,
    "/v1/suppliers/imports",
    "supplier_rate",
    readCsv("docs/c4/import/supplier-rates.csv"),
    "demo-seed-supplier-rates",
  );
  await runImportBatch(
    app,
    token,
    "/v1/suppliers/imports",
    "supplier_content_block",
    readCsv("docs/c4/import/supplier-content-blocks.csv"),
    "demo-seed-supplier-content",
  );

  const crmOrganizationsCsv = [
    "legalName,organizationTypeKey,tradingName,country",
    "Global Incentives Ltd,incentive_house,Global Incentives,United Kingdom",
    "Summit Travel Group,mice_agency,Summit Travel Group,United States",
    "European Pharma AG,corporate,European Pharma,Germany",
  ].join("\n");

  await runImportBatch(
    app,
    token,
    "/v1/crm/imports",
    "organization",
    crmOrganizationsCsv,
    "demo-seed-crm-orgs",
  );

  const crmContactsCsv = [
    "givenName,familyName,email,telephone",
    "Amara,Okello,amara.okello@globalincentives.example.com,+442079460958",
    "James,Kato,james.kato@summittravel.example.com,+12125550100",
    "Sophie,Braun,sophie.braun@europeanpharma.example.de,+49301234567",
    "David,Mwangi,david.mwangi@globalincentives.example.com,+442079460959",
    "Elena,Rossi,elena.rossi@summittravel.example.com,+12125550101",
  ].join("\n");

  await runImportBatch(
    app,
    token,
    "/v1/crm/imports",
    "contact",
    crmContactsCsv,
    "demo-seed-crm-contacts",
  );

  const orgByName = new Map(store.crmOrganizations.map((o) => [o.legalName, o]));
  const contactByEmail = new Map(
    store.crmContacts.filter((c) => c.email).map((c) => [c.email!.toLowerCase(), c]),
  );
  const relTypeId = store.crmRelationshipTypes.find((t) => t.key === "employee_of")?.id;
  if (!relTypeId) throw new Error("missing_relationship_type:employee_of");

  const links: Array<{ email: string; orgName: string }> = [
    { email: "amara.okello@globalincentives.example.com", orgName: "Global Incentives Ltd" },
    { email: "david.mwangi@globalincentives.example.com", orgName: "Global Incentives Ltd" },
    { email: "james.kato@summittravel.example.com", orgName: "Summit Travel Group" },
    { email: "elena.rossi@summittravel.example.com", orgName: "Summit Travel Group" },
    { email: "sophie.braun@europeanpharma.example.de", orgName: "European Pharma AG" },
  ];

  const authHeaders = { authorization: `Bearer ${token}` };
  for (const link of links) {
    const contact = contactByEmail.get(link.email.toLowerCase());
    const org = orgByName.get(link.orgName);
    if (!contact || !org) continue;
    await app.inject({
      method: "POST",
      url: "/v1/crm/relationships",
      headers: authHeaders,
      payload: {
        relationshipTypeId: relTypeId,
        contactId: contact.id,
        organizationId: org.id,
        status: "Engaged",
      },
    });
  }

  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
  for (const org of store.crmOrganizations) {
    await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: authHeaders,
      payload: {
        organizationId: org.id,
        accountName: `${org.tradingName ?? org.legalName} — Main`,
        ownerPrincipalId: carolId,
        priority: "high",
      },
    });
  }

  const now = new Date();
  const activitySpecs: Array<{ orgName: string; subject: string; daysAgo: number; type: string }> = [
    { orgName: "Global Incentives Ltd", subject: "Safari incentive brief received", daysAgo: 0, type: "email" },
    { orgName: "Summit Travel Group", subject: "Proposal viewed by client", daysAgo: 1, type: "follow_up" },
    { orgName: "European Pharma AG", subject: "Medical conference RFP — initial call", daysAgo: 3, type: "sales_call" },
  ];

  for (const spec of activitySpecs) {
    const org = orgByName.get(spec.orgName);
    if (!org) continue;
    const occurred = new Date(now);
    occurred.setDate(occurred.getDate() - spec.daysAgo);
    await app.inject({
      method: "POST",
      url: "/v1/crm/activities",
      headers: authHeaders,
      payload: {
        activityType: spec.type,
        subject: spec.subject,
        occurredAt: occurred.toISOString(),
        organizationId: org.id,
        ownerPrincipalId: carolId,
      },
    });
  }

  const accountByOrg = new Map(store.crmAccounts.map((a) => [a.organizationId, a]));
  const opportunitySpecs: Array<{
    code: string;
    orgName: string;
    title: string;
    stage: string;
    programmeSummary: string;
    estimatedValue: number;
    paxCount: number;
  }> = [
    {
      code: "OPP-2026-EURO",
      orgName: "European Pharma AG",
      title: "Medical Conference",
      stage: "new_qualified",
      programmeSummary: "Medical Conference · 200 pax · Arusha",
      estimatedValue: 520000,
      paxCount: 200,
    },
    {
      code: "OPP-2026-SUMM",
      orgName: "Summit Travel Group",
      title: "Incentive Safari",
      stage: "proposal_sent",
      programmeSummary: "Incentive Safari · 80 pax",
      estimatedValue: 380000,
      paxCount: 80,
    },
    {
      code: "OPP-2026-GLOB",
      orgName: "Global Incentives Ltd",
      title: "Tanzania Safari Incentive",
      stage: "negotiation",
      programmeSummary: "Safari Incentive · 65 pax",
      estimatedValue: 285000,
      paxCount: 65,
    },
  ];

  const oppIds = new Map<string, string>();
  for (const spec of opportunitySpecs) {
    const org = orgByName.get(spec.orgName);
    if (!org) continue;
    const account = accountByOrg.get(org.id);
    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: authHeaders,
      payload: {
        opportunityCode: spec.code,
        title: spec.title,
        organizationId: org.id,
        ...(account ? { accountId: account.id } : {}),
        programmeSummary: spec.programmeSummary,
        estimatedValue: spec.estimatedValue,
        currency: "USD",
        paxCount: spec.paxCount,
        ownerPrincipalId: carolId,
      },
    });
    if (created.statusCode !== 201) {
      throw new Error(`opportunity_create_failed:${spec.code}:${created.statusCode}:${created.body}`);
    }
    const oppId = created.json().opportunity.id as string;
    oppIds.set(spec.orgName, oppId);

    const stagePath: Record<string, string[]> = {
      new_qualified: [],
      rfp_received: ["rfp_received"],
      proposal_sent: ["rfp_received", "proposal_sent"],
      negotiation: ["rfp_received", "proposal_sent", "negotiation"],
    };
    for (const stage of stagePath[spec.stage] ?? []) {
      const t = await app.inject({
        method: "POST",
        url: `/v1/pipeline/opportunities/${oppId}/transitions`,
        headers: authHeaders,
        payload: { toStage: stage },
      });
      if (t.statusCode !== 200) {
        throw new Error(`opportunity_transition_failed:${spec.code}:${stage}:${t.statusCode}:${t.body}`);
      }
    }
  }

  const globalOppId = oppIds.get("Global Incentives Ltd");
  if (globalOppId) {
    const slaDue = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    const rfpCreated = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: authHeaders,
      payload: {
        rfpCode: "RFP-2026-0847",
        opportunityId: globalOppId,
        title: "Global Incentives Ltd — Tanzania Safari Incentive",
        programmeType: "Incentive · Safari",
        paxCount: 65,
        travelDates: "15–22 Mar 2027",
        destinations: "Arusha, Serengeti, Ngorongoro",
        budgetMin: 250000,
        budgetMax: 300000,
        currency: "USD",
        requirementsText:
          "Requirements: 5-star accommodation, private charter Arusha–Seronera, gala dinner with MC/DJ, team-building activity, full AV for presentations, branded gifting.",
        slaDueAt: slaDue,
        assignedPrincipalId: carolId,
        initialVersionSummary: "Initial programme draft",
      },
    });
    if (rfpCreated.statusCode !== 201) {
      throw new Error(`rfp_create_failed:${rfpCreated.statusCode}:${rfpCreated.body}`);
    }
    const rfpId = rfpCreated.json().rfp.id as string;
    for (const stage of ["programme", "costing", "approval"] as const) {
      const t = await app.inject({
        method: "POST",
        url: `/v1/rfps/${rfpId}/transitions`,
        headers: authHeaders,
        payload: { toStage: stage },
      });
      if (t.statusCode !== 200) {
        throw new Error(`rfp_transition_failed:${stage}:${t.statusCode}:${t.body}`);
      }
    }
    await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/versions`,
      headers: authHeaders,
      payload: { summary: "Added gala dinner & AV" },
    });
    await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/versions`,
      headers: authHeaders,
      payload: { summary: "Updated lodge selection (Seronera)" },
    });

    const supplierByCode = new Map(store.supSuppliers.map((s) => [s.supplierCode, s]));
    const veh = supplierByCode.get("VEH-SEDMC-LC200");
    const lodge = supplierByCode.get("LOD-SERONERA-SOP");
    const balloon = supplierByCode.get("EXC-BALLOON-SRN");
    const av = supplierByCode.get("AVN-SOUND-ARU");

    const programmeCreated = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: authHeaders,
      payload: {
        rfpId,
        title: "Tanzania Safari Incentive — 8 Days",
        paxCount: 65,
        destinations: "Arusha, Serengeti, Ngorongoro",
        days: [
          {
            dayNumber: 1,
            title: "Day 1 · Sat 15 Mar — Arusha Arrival",
            location: "Arusha",
            items: [
              {
                startTime: "14:00",
                title: "Kilimanjaro Airport Transfer",
                supplierId: veh?.id,
                supplierLabel: "SEDMC Land Cruiser Fleet · 10 vehicles",
              },
              {
                startTime: "16:00",
                title: "Check-in & Welcome Briefing",
                description: "Arusha Coffee Lodge · 35 rooms",
              },
              {
                startTime: "19:00",
                title: "Welcome Dinner",
                description: "Boma dinner with traditional entertainment",
              },
            ],
          },
          {
            dayNumber: 3,
            title: "Day 3 · Mon 17 Mar — Serengeti",
            location: "Serengeti NP",
            items: [
              {
                startTime: "05:30",
                title: "Hot Air Balloon Safari",
                supplierId: balloon?.id,
                supplierLabel: "Serengeti Balloon Safaris · 65 pax",
              },
              {
                startTime: "12:00",
                title: "Game Drive & Bush Lunch",
                supplierId: veh?.id,
                supplierLabel: "SEDMC Land Cruiser Fleet",
              },
            ],
          },
          {
            dayNumber: 5,
            title: "Day 5 · Wed 19 Mar — Gala Evening",
            location: "Seronera",
            items: [
              {
                startTime: "18:00",
                title: "Gala Dinner & Awards",
                supplierId: lodge?.id,
                supplierLabel: "Seronera Safari Lodge · AV + DJ/MC",
                description: av ? "Arusha AV Solutions · full PA" : undefined,
              },
            ],
          },
        ],
      },
    });
    if (programmeCreated.statusCode !== 201) {
      throw new Error(`programme_create_failed:${programmeCreated.statusCode}:${programmeCreated.body}`);
    }
    const programmeId = programmeCreated.json().programme.id as string;

    const costSheetCreated = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: authHeaders,
      payload: {
        programmeId,
        sellPrice: 285000,
        paxCount: 65,
        marginFloorPercent: 20,
        lineItems: [
          { category: "accommodation", description: "Seronera + Arusha lodges", unitCost: 86400, supplierId: lodge?.id },
          { category: "transport", description: "SEDMC Land Cruiser fleet", unitCost: 32200, supplierId: veh?.id },
          { category: "activities", description: "Balloon safari + game drives", unitCost: 38935, supplierId: balloon?.id },
          { category: "av_events", description: "Gala dinner AV & entertainment", unitCost: 18500, supplierId: av?.id },
          { category: "park_fees_misc", description: "Park fees, misc & contingency", unitCost: 22365 },
        ],
      },
    });
    if (costSheetCreated.statusCode !== 201) {
      throw new Error(`cost_sheet_create_failed:${costSheetCreated.statusCode}:${costSheetCreated.body}`);
    }
    await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${costSheetCreated.json().sheet.id}/versions`,
      headers: authHeaders,
      payload: { summary: "Initial costing — margin 30.4%" },
    });

    const costSheetId = costSheetCreated.json().sheet.id as string;
    const approvalRequested = await app.inject({
      method: "POST",
      url: "/v1/commercial-approvals/request",
      headers: authHeaders,
      payload: { costSheetId },
    });
    if (approvalRequested.statusCode !== 201) {
      throw new Error(`approval_request_failed:${approvalRequested.statusCode}:${approvalRequested.body}`);
    }
    const approvalId = approvalRequested.json().request.id as string;

    const bobToken = await loginBob(app);
    const approved = await app.inject({
      method: "POST",
      url: `/v1/commercial-approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved", decisionNotes: "Margin 30.4% — approved for proposal generation" },
    });
    if (approved.statusCode !== 200) {
      throw new Error(`approval_decision_failed:${approved.statusCode}:${approved.body}`);
    }

    const proposalCreated = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: authHeaders,
      payload: { rfpId, title: "Global Incentives Ltd — Tanzania Safari Incentive Proposal" },
    });
    if (proposalCreated.statusCode !== 201) {
      throw new Error(`proposal_create_failed:${proposalCreated.statusCode}:${proposalCreated.body}`);
    }
    const proposalId = proposalCreated.json().proposal.id as string;

    await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: authHeaders,
      payload: { toStatus: "sent" },
    });

    await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: authHeaders,
      payload: { toStatus: "accepted" },
    });

    const bookingCreated = await app.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: authHeaders,
      payload: { proposalId },
    });
    if (bookingCreated.statusCode !== 201) {
      throw new Error(`booking_create_failed:${bookingCreated.statusCode}:${bookingCreated.body}`);
    }
    const bookingId = bookingCreated.json().booking.id as string;

    await app.inject({
      method: "POST",
      url: "/v1/ops/supplier-confirmations/generate",
      headers: authHeaders,
      payload: { bookingId },
    });

    const manifestRes = await app.inject({
      method: "POST",
      url: `/v1/ops/manifests/by-booking/${bookingId}`,
      headers: authHeaders,
    });
    const manifestId = manifestRes.json().manifest.id as string;
    const sampleGuests = [
      { guestName: "Alex Chen", dietary: "None" },
      { guestName: "Maria Santos", dietary: "Vegetarian" },
      { guestName: "James Okonkwo", rooming: "Twin" },
    ];
    for (const guest of sampleGuests) {
      await app.inject({
        method: "POST",
        url: `/v1/ops/manifests/${manifestId}/entries`,
        headers: authHeaders,
        payload: guest,
      });
    }
    await app.inject({
      method: "POST",
      url: `/v1/ops/manifests/${manifestId}/publish`,
      headers: authHeaders,
    });

    await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/generate",
      headers: authHeaders,
      payload: { bookingId },
    });
    await app.inject({
      method: "POST",
      url: "/v1/ops/vouchers/issue-all",
      headers: authHeaders,
      payload: { bookingId },
    });

    await app.inject({
      method: "PUT",
      url: `/v1/ops/briefs/by-booking/${bookingId}`,
      headers: authHeaders,
      payload: {
        content: "Global Incentives · 65 pax safari incentive. Lead: Carol. VIP arrivals Day 1 Kilimanjaro.",
      },
    });
    await app.inject({
      method: "POST",
      url: `/v1/ops/briefs/by-booking/${bookingId}/issue`,
      headers: authHeaders,
    });

    await app.inject({
      method: "POST",
      url: "/v1/ops/field-tasks",
      headers: authHeaders,
      payload: { bookingId, title: "Confirm balloon slot allocation" },
    });

    const deposit = await app.inject({
      method: "POST",
      url: "/v1/finance/invoices/deposit",
      headers: authHeaders,
      payload: { bookingId, depositPercent: 30 },
    });
    const invoiceId = deposit.json().invoice.id as string;
    await app.inject({
      method: "POST",
      url: `/v1/finance/invoices/${invoiceId}/issue`,
      headers: authHeaders,
    });
    await app.inject({
      method: "POST",
      url: `/v1/finance/invoices/${invoiceId}/payments`,
      headers: authHeaders,
      payload: { amount: 50000, paymentId: "PAY-DEMO-PARTIAL" },
    });

    const quote = await app.inject({
      method: "POST",
      url: "/v1/finance/quotes",
      headers: authHeaders,
      payload: { bookingId },
    });
    const quoteId = quote.json().quote.id as string;
    await app.inject({
      method: "POST",
      url: `/v1/finance/quotes/${quoteId}/send`,
      headers: authHeaders,
    });
  }

  return {
    skipped: false,
    suppliers: store.supSuppliers.length,
    supplierContacts: store.supContacts.length,
    supplierRates: store.supRates.length,
    supplierContentBlocks: store.supContentBlocks.length,
    organizations: store.crmOrganizations.length,
    contacts: store.crmContacts.length,
    relationships: store.crmRelationships.length,
    accounts: store.crmAccounts.length,
    activities: store.crmActivities.length,
    opportunities: store.oppOpportunities.length,
    rfps: store.rfpRfps.length,
    programmes: store.prgProgrammes.length,
    costSheets: store.costSheets.length,
    approvalRequests: store.comApprovalRequests.length,
    proposals: store.propProposals.length,
    bookings: store.bkgBookings.length,
  };
}
