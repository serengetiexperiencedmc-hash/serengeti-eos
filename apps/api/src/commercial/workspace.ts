import {
  RFP_WORKFLOW_STAGES,
  type Principal,
} from "@sedmc/kernel";
import {
  listProposalPreparationGaps,
  proposalPreparationReadiness,
  PROPOSAL_PREPARATION_KIND,
} from "@sedmc/kernel/proposal-preparation";
import { toClientFacingCommercialView } from "@sedmc/kernel/h203-commercial-policy";
import type { Store } from "../store.js";
import { getCostSheetByProgramme } from "../costing/sheet.js";
import { isMixedSqlDurable } from "../persistence/durable.js";
import { listProgrammeVersions } from "../persistence/programme-repository.js";
import { getProgrammeByRfp } from "../programme/programme.js";
import { getProposalByRfp } from "../proposal/proposal.js";
import { getRfp } from "../rfp/rfp.js";

function workflow(current: string) {
  return {
    stages: [...RFP_WORKFLOW_STAGES],
    current,
    wonLostRecord: "opportunity" as const,
  };
}

async function loadNumericVersions(store: Store, tenantId: string, programmeId: string) {
  if (isMixedSqlDurable(store)) {
    return listProgrammeVersions(store.dbPool, tenantId, programmeId);
  }
  return (store.prgProgrammeVersions ?? [])
    .filter((v) => v.programmeId === programmeId && v.tenantId === tenantId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
}

export async function getRfpCommercialWorkspace(store: Store, principal: Principal, rfpId: string) {
  const prepared = await assembleProposalPreparation(store, principal, rfpId);
  if ("error" in prepared) return prepared;
  return {
    rfp: prepared.rfp,
    versions: prepared.rfpVersions,
    programme: prepared.programme
      ? {
          id: prepared.programme.id,
          programmeCode: prepared.programme.programmeCode,
          title: prepared.programme.title,
          status: prepared.programme.status,
          commercialVersionLabel: prepared.programme.commercialVersionLabel,
          dayCount: prepared.programme.dayCount,
          paxCount: prepared.programme.paxCount,
          destinations: prepared.programme.destinations,
        }
      : null,
    financialSummary: prepared.financialSummary,
    proposalPreparation: {
      kind: prepared.kind,
      readiness: prepared.readiness,
      clientIssued: false,
      unresolvedRequiredCount: prepared.unresolved.filter((g) => g.requiredForClientRelease).length,
      existingProposalStatus: prepared.existingProposal?.status ?? null,
    },
    rfpWorkflow: prepared.rfpWorkflow,
  };
}

export async function getRfpProposalPreparation(store: Store, principal: Principal, rfpId: string) {
  return assembleProposalPreparation(store, principal, rfpId);
}

async function assembleProposalPreparation(store: Store, principal: Principal, rfpId: string) {
  const rfpResult = await getRfp(store, principal, rfpId);
  if ("error" in rfpResult) return rfpResult;

  const programmeResult = await getProgrammeByRfp(store, principal, rfpId);
  const programmeDetail = "error" in programmeResult ? null : programmeResult;

  let financialSummary = null;
  let sellPriceSource: "sellPriceOverride" | "markupPercent" | "equalsSupplierCost" | undefined;
  let costingStatus: string | null = null;
  if (programmeDetail) {
    const costing = await getCostSheetByProgramme(store, principal, programmeDetail.programme.id);
    if (!("error" in costing) && costing.sheet.financialSummary) {
      financialSummary = costing.sheet.financialSummary;
      sellPriceSource = costing.sheet.financialSummary.sellPriceSource;
      costingStatus = costing.sheet.financialSummary.financialStatus;
    }
  }

  const numericVersions = programmeDetail
    ? await loadNumericVersions(store, principal.tenantId, programmeDetail.programme.id)
    : [];
  const latestNumeric = numericVersions[0]
    ? {
        versionNumber: numericVersions[0].versionNumber,
        summary: numericVersions[0].summary,
        snapshot: numericVersions[0].snapshot,
        createdAt: numericVersions[0].createdAt,
      }
    : null;

  const proposalResult = await getProposalByRfp(store, principal, rfpId);
  const existingProposal =
    "error" in proposalResult
      ? null
      : {
          id: proposalResult.proposal.id,
          proposalCode: proposalResult.proposal.proposalCode,
          status: proposalResult.proposal.status,
        };

  const unresolved = listProposalPreparationGaps({
    hasProgramme: Boolean(programmeDetail),
    hasCostSheet: Boolean(financialSummary),
    ...(sellPriceSource ? { sellPriceSource } : {}),
    hasRecordedNumericVersion: numericVersions.length > 0,
  });
  const readiness = proposalPreparationReadiness(unresolved);

  return {
    kind: PROPOSAL_PREPARATION_KIND,
    clientIssued: false,
    readiness,
    unresolved,
    rfp: rfpResult.rfp,
    rfpVersions: rfpResult.versions,
    rfpWorkflow: workflow(rfpResult.rfp.workflowStage),
    programme: programmeDetail
      ? {
          id: programmeDetail.programme.id,
          programmeCode: programmeDetail.programme.programmeCode,
          title: programmeDetail.programme.title,
          status: programmeDetail.programme.status,
          commercialVersionLabel: programmeDetail.programme.commercialVersionLabel ?? "draft",
          dayCount: programmeDetail.programme.dayCount,
          paxCount: programmeDetail.programme.paxCount,
          destinations: programmeDetail.programme.destinations,
          startDate: programmeDetail.programme.startDate,
          endDate: programmeDetail.programme.endDate,
          opportunityId: programmeDetail.programme.opportunityId,
          organizationId: programmeDetail.programme.organizationId,
          rfpId: programmeDetail.programme.rfpId,
        }
      : null,
    days: programmeDetail?.days ?? [],
    latestNumericProgrammeVersion: latestNumeric,
    financialSummary,
    clientFacing: financialSummary
      ? toClientFacingCommercialView({
          currency: financialSummary.currency,
          clientSellingPrice: financialSummary.clientSellingPrice,
        })
      : null,
    costingStatus,
    financialFormula: financialSummary?.formula ?? null,
    existingProposal,
    sourceOfTruth: {
      requirements: "rfp",
      itinerary: "programme",
      costing: "cost_sheet",
      wonLost: "opportunity",
      financialTotals: "kernel.computeCostTotals",
      commercialResponsibility: "ceo_md+commercial_director",
      wonLostOwner: "consultant",
    },
  };
}
