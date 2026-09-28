import { authorize, type Principal, type PrgProgramme, type RfpRecord } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { type F2ProgrammeFacts } from "./memory.js";
import { f2Dp01DurablePreviewBlock, f2FactsPersistenceMeta, readProgrammeFacts, writeProgrammeFacts } from "./persist.js";
import { lookupProgramme, lookupRfp } from "./entity-lookup.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i10_in_memory_preview_only" };

function traceStatus(input: { rfp: boolean; costing: boolean; proposal: boolean }) {
  if (input.rfp && input.costing && input.proposal) return "rfp_programme_costing_proposal_observed" as const;
  if (input.rfp && input.costing) return "partial_costing_observed" as const;
  if (input.rfp) return "partial_rfp_observed" as const;
  return "unavailable" as const;
}

function traceCompleteness(input: { rfp: boolean; costing: boolean; proposal: boolean }) {
  if (input.rfp && input.costing && input.proposal) return "complete" as const;
  if (input.rfp || input.costing || input.proposal) return "partial" as const;
  return "unavailable" as const;
}

export function programmeFactsView(
  store: Store,
  programme: PrgProgramme,
  facts?: F2ProgrammeFacts,
  durableRfp?: RfpRecord,
) {
  const rfp =
    durableRfp ??
    store.rfpRfps.find((r) => r.id === programme.rfpId && r.tenantId === programme.tenantId && !r.archivedAt);
  const tenantSheets = (store.costSheets ?? []).filter((s) => s.tenantId === programme.tenantId && !s.archivedAt);
  const onTraceSheets = tenantSheets.filter(
    (s) => s.programmeId === programme.id && s.rfpId === programme.rfpId,
  );
  const unsupportedSheets = tenantSheets.filter(
    (s) => s.programmeId === programme.id && s.rfpId !== programme.rfpId,
  );
  const onTraceSheetIds = new Set(onTraceSheets.map((s) => s.id));
  const tenantProposals = (store.propProposals ?? []).filter((p) => p.tenantId === programme.tenantId && !p.archivedAt);
  const onTraceProposals = tenantProposals.filter(
    (p) => p.programmeId === programme.id && p.rfpId === programme.rfpId && onTraceSheetIds.has(p.costSheetId),
  );
  const unsupportedProposals = tenantProposals.filter((p) => {
    if (p.programmeId !== programme.id) return false;
    return p.rfpId !== programme.rfpId || !onTraceSheetIds.has(p.costSheetId);
  });
  const recordedVersions = (store.prgProgrammeVersions ?? [])
    .filter((v) => v.programmeId === programme.id && v.tenantId === programme.tenantId)
    .map((v) => v.versionNumber);
  const rfpObserved = Boolean(rfp);
  const costingObserved = onTraceSheets.length > 0;
  const proposalObserved = onTraceProposals.length > 0;
  const versionObserved = facts?.observedClientFacingVersionNumber !== undefined;
  const completeness = traceCompleteness({ rfp: rfpObserved, costing: costingObserved, proposal: proposalObserved });
  return {
    programmeId: programme.id,
    programmeCode: programme.programmeCode,
    rfpId: programme.rfpId,
    opportunityId: programme.opportunityId,
    organizationId: programme.organizationId,
    rfpObserved,
    rfpStatus: rfpObserved ? ("observed" as const) : ("unavailable" as const),
    costingReferencesProgramme: costingObserved,
    costingStatus: costingObserved ? ("observed" as const) : ("unavailable" as const),
    proposalReferencesProgramme: proposalObserved,
    proposalStatus: proposalObserved ? ("observed" as const) : ("unavailable" as const),
    costSheetIds: onTraceSheets.map((s) => s.id),
    proposalIds: onTraceProposals.map((p) => p.id),
    costingIdentities: onTraceSheets.map((s) => ({
      costSheetId: s.id,
      sheetCode: s.sheetCode,
      rfpId: s.rfpId,
      programmeId: s.programmeId,
      relationship: "explicit_mixed_foreign_key" as const,
      relationshipSource: "costSheet.programmeId+costSheet.rfpId",
    })),
    proposalIdentities: onTraceProposals.map((p) => ({
      proposalId: p.id,
      proposalCode: p.proposalCode,
      rfpId: p.rfpId,
      programmeId: p.programmeId,
      costSheetId: p.costSheetId,
      relationship: "explicit_mixed_foreign_key" as const,
      relationshipSource: "proposal.rfpId+proposal.programmeId+proposal.costSheetId",
    })),
    unsupportedCostSheetIds: unsupportedSheets.map((s) => s.id),
    unsupportedProposalIds: unsupportedProposals.map((p) => p.id),
    mixedProgrammeVersion: programme.version,
    recordedClientFacingVersionNumbers: recordedVersions,
    observedClientFacingVersionNumber: facts?.observedClientFacingVersionNumber,
    observedClientFacingVersionProvenance: facts?.observedClientFacingVersionProvenance,
    observedClientFacingVersionStatus: versionObserved ? ("observed" as const) : ("unavailable" as const),
    note: facts?.note,
    officeDocumentIsNotIdentity: true as const,
    mixedProgrammeDatesUsedAsCommercialConsistency: false as const,
    itemCostingConsistencyValidated: false as const,
    sellPriceTreatedAsRevenue: false as const,
    costingTotalTreatedAsRevenue: false as const,
    inferredFromName: false as const,
    inferredFromDate: false as const,
    inferredFromAmount: false as const,
    inferredFromCreationOrder: false as const,
    relationshipProvenance: "explicit_mixed_foreign_key" as const,
    dataSufficiency: completeness === "complete" ? ("sufficient" as const) : completeness === "partial" ? ("partial" as const) : ("insufficient" as const),
    trace: {
      rfpObserved,
      costingObserved,
      proposalObserved,
      status: traceStatus({ rfp: rfpObserved, costing: costingObserved, proposal: proposalObserved }),
      completeness,
      relationshipKind: "explicit_mixed_foreign_key" as const,
    },
  };
}

export async function getProgrammeCommercialFacts(store: Store, principal: Principal, programmeId: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const programme = await lookupProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "programme:read:programme",
    action: "read:prg_programme",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const stored = await readProgrammeFacts(store, programme.tenantId, programmeId);
  const rfp = await lookupRfp(store, programme.tenantId, programme.rfpId);
  return {
    facts: programmeFactsView(store, programme, stored, rfp),
    persistence: f2FactsPersistenceMeta(store, Boolean(stored)),
  };
}

export type PutProgrammeFactsInput = {
  note?: string;
  observedClientFacingVersionNumber?: number;
  /** Rejected unless equal to the path id — never used as a write target. */
  programmeId?: string;
  id?: string;
  tenantId?: string;
};

export async function putProgrammeCommercialFacts(
  store: Store,
  principal: Principal,
  programmeId: string,
  input: PutProgrammeFactsInput,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const programme = await lookupProgramme(store, principal.tenantId, programmeId);
  if (!programme) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "programme:write:programme",
    action: "update:prg_programme",
    resource: {
      tenantId: programme.tenantId,
      type: "programme",
      id: programme.id,
      classification: programme.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  if (input.programmeId !== undefined && input.programmeId !== programmeId) {
    return { error: "conflict" as const, reason: "programmeId_immutable" };
  }
  if (input.id !== undefined && input.id !== programmeId) {
    return { error: "conflict" as const, reason: "programmeId_immutable" };
  }
  if (input.tenantId !== undefined && input.tenantId !== programme.tenantId) {
    return { error: "conflict" as const, reason: "tenantId_immutable" };
  }

  const now = new Date().toISOString();
  const current = await readProgrammeFacts(store, programme.tenantId, programmeId);
  let note = current?.note;
  let observedClientFacingVersionNumber = current?.observedClientFacingVersionNumber;
  let observedClientFacingVersionProvenance = current?.observedClientFacingVersionProvenance;

  if (input.note !== undefined) note = input.note;

  if (input.observedClientFacingVersionNumber !== undefined) {
    if (
      typeof input.observedClientFacingVersionNumber !== "number" ||
      !Number.isInteger(input.observedClientFacingVersionNumber)
    ) {
      return { error: "invalid_request" as const, reason: "invalid_programme_version" };
    }
    const recorded = (store.prgProgrammeVersions ?? []).some(
      (v) =>
        v.programmeId === programme.id &&
        v.tenantId === programme.tenantId &&
        v.versionNumber === input.observedClientFacingVersionNumber,
    );
    if (!recorded) return { error: "invalid_request" as const, reason: "programme_version_not_recorded" };
    if (
      current?.observedClientFacingVersionNumber !== undefined &&
      current.observedClientFacingVersionNumber !== input.observedClientFacingVersionNumber
    ) {
      return { error: "conflict" as const, reason: "programme_version_already_observed" };
    }
    observedClientFacingVersionNumber = input.observedClientFacingVersionNumber;
    observedClientFacingVersionProvenance = "explicit_business_fact";
  }

  const next: F2ProgrammeFacts = {
    programmeId: programme.id,
    tenantId: programme.tenantId,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  if (note !== undefined) next.note = note;
  if (observedClientFacingVersionNumber !== undefined) {
    next.observedClientFacingVersionNumber = observedClientFacingVersionNumber;
    if (observedClientFacingVersionProvenance) {
      next.observedClientFacingVersionProvenance = observedClientFacingVersionProvenance;
    }
  }
  try {
    await writeProgrammeFacts(store, next);
  } catch {
    return { error: "conflict" as const, reason: "f2_sidecar_persist_failed" };
  }
  return {
    facts: programmeFactsView(store, programme, next, await lookupRfp(store, programme.tenantId, programme.rfpId)),
    persistence: f2FactsPersistenceMeta(store, true),
  };
}
