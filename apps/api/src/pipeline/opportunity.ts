import {
  authorize,
  canTransitionOpportunityStage,
  isValidOpportunityStage,
  newId,
  OPPORTUNITY_STAGE_LABELS,
  OPPORTUNITY_STAGES,
  PIPELINE_EVENT_TYPES,
  type OppOpportunity,
  type OppStageHistory,
  type OpportunityStage,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowPipelineAudit, denyPipelineAudit } from "./audit.js";
import { ensurePipelineCollections } from "./collections.js";
import {
  allowAuditRecord,
  denyAuditRecord,
  insertChainedAudit,
  insertDomainOutbox,
  isMixedSqlDurable,
  isUniqueViolation,
  OptimisticConcurrencyError,
  persistDenyAudit,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";
import {
  countOpportunities,
  getOpportunityById,
  insertOpportunity,
  insertOpportunityStageHistory,
  listOpportunitiesByTenant,
  listStageHistory,
  opportunityCodeExists,
  updateOpportunityOptimistic,
} from "../persistence/opportunity-repository.js";

function sanitize(o: OppOpportunity) {
  return {
    id: o.id,
    opportunityCode: o.opportunityCode,
    title: o.title,
    organizationId: o.organizationId,
    accountId: o.accountId,
    stage: o.stage,
    status: o.status,
    programmeSummary: o.programmeSummary,
    estimatedValue: o.estimatedValue,
    currency: o.currency,
    paxCount: o.paxCount,
    expectedCloseDate: o.expectedCloseDate,
    ownerPrincipalId: o.ownerPrincipalId,
    classification: o.classification,
    version: o.version,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function sanitizeHistory(h: {
  id: string;
  opportunityId: string;
  fromStage?: OpportunityStage;
  toStage: OpportunityStage;
  changedAt: string;
  notes?: string;
}) {
  return {
    id: h.id,
    opportunityId: h.opportunityId,
    toStage: h.toStage,
    changedAt: h.changedAt,
    ...(h.fromStage !== undefined ? { fromStage: h.fromStage } : {}),
    ...(h.notes !== undefined ? { notes: h.notes } : {}),
  };
}

function findOpportunityMemory(store: Store, tenantId: string, id: string): OppOpportunity | undefined {
  return store.oppOpportunities.find((x) => x.id === id && x.tenantId === tenantId && !x.archivedAt);
}

async function loadOpportunity(store: Store, tenantId: string, id: string): Promise<OppOpportunity | undefined> {
  if (isMixedSqlDurable(store)) return getOpportunityById(store.dbPool, tenantId, id);
  ensurePipelineCollections(store);
  return findOpportunityMemory(store, tenantId, id);
}

export async function getPipelineModuleHealth(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const opportunities = isMixedSqlDurable(store)
    ? await countOpportunities(store.dbPool, principal.tenantId)
    : store.oppOpportunities.filter((o) => o.tenantId === principal.tenantId && !o.archivedAt).length;
  return {
    module: "pipeline",
    increment: "C2",
    status: "ok" as const,
    opportunities,
  };
}

export function listPipelineStages(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: OPPORTUNITY_STAGES.filter((s) => s !== "lost").map((stage) => ({
      key: stage,
      label: OPPORTUNITY_STAGE_LABELS[stage],
    })),
  };
}

export async function listOpportunities(
  store: Store,
  principal: Principal,
  query?: { stage?: string; organizationId?: string; status?: string },
) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if (query?.stage && !isValidOpportunityStage(query.stage)) {
    return { error: "invalid_request" as const, reason: "invalid_stage" };
  }

  const items = isMixedSqlDurable(store)
    ? await listOpportunitiesByTenant(store.dbPool, principal.tenantId, query)
    : store.oppOpportunities
        .filter((o) => o.tenantId === principal.tenantId && !o.archivedAt)
        .filter((o) => (query?.stage ? o.stage === query.stage : true))
        .filter((o) => (query?.organizationId ? o.organizationId === query.organizationId : true))
        .filter((o) => (query?.status ? o.status === query.status : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitize) };
}

export async function getPipelineBoard(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const all = isMixedSqlDurable(store)
    ? await listOpportunitiesByTenant(store.dbPool, principal.tenantId)
    : store.oppOpportunities.filter((o) => o.tenantId === principal.tenantId && !o.archivedAt);

  const columns = OPPORTUNITY_STAGES.filter((s) => s !== "lost").map((stage) => {
    const cards = all.filter((o) => o.stage === stage);
    return {
      stage,
      label: OPPORTUNITY_STAGE_LABELS[stage],
      count: cards.length,
      items: cards.map(sanitize),
    };
  });
  return { columns };
}

export async function getOpportunity(store: Store, principal: Principal, id: string) {
  ensurePipelineCollections(store);
  const opp = await loadOpportunity(store, principal.tenantId, id);
  if (!opp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
    resource: { tenantId: opp.tenantId, type: "opportunity", id: opp.id, classification: opp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const history = isMixedSqlDurable(store)
    ? await listStageHistory(store.dbPool, principal.tenantId, id)
    : store.oppStageHistory
        .filter((h) => h.opportunityId === id && h.tenantId === principal.tenantId)
        .sort((a, b) => b.changedAt.localeCompare(a.changedAt));

  return { opportunity: sanitize(opp), stageHistory: history.map(sanitizeHistory) };
}

export type CreateOpportunityInput = {
  opportunityCode: string;
  title: string;
  organizationId: string;
  accountId?: string;
  programmeSummary?: string;
  estimatedValue?: number;
  currency?: string;
  paxCount?: number;
  expectedCloseDate?: string;
  ownerPrincipalId?: string;
};

export async function createOpportunity(
  store: Store,
  principal: Principal,
  input: CreateOpportunityInput,
  correlationId: string,
) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:write:opportunity",
    action: "create:opp_opportunity",
  });
  if (decision.result === "deny") {
    if (isMixedSqlDurable(store)) {
      await persistDenyAudit(
        store,
        denyAuditRecord(principal, "pipeline:write:opportunity", "opp_opportunity", correlationId, decision.reason),
      );
    } else {
      denyPipelineAudit(store, principal, "pipeline:write:opportunity", "opp_opportunity", correlationId, decision.reason);
    }
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const org = store.crmOrganizations.find(
    (o) => o.id === input.organizationId && o.tenantId === principal.tenantId && !o.archivedAt,
  );
  if (!org) return { error: "invalid_request" as const, reason: "invalid_organization" };

  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };

  const code = input.opportunityCode?.trim();
  if (!code) return { error: "invalid_request" as const, reason: "opportunity_code_required" };

  if (isMixedSqlDurable(store)) {
    const exists = await opportunityCodeExists(store.dbPool, principal.tenantId, code);
    if (exists) return { error: "conflict" as const, reason: "duplicate_opportunity_code" };
  } else if (store.oppOpportunities.some((o) => o.tenantId === principal.tenantId && o.opportunityCode === code)) {
    return { error: "conflict" as const, reason: "duplicate_opportunity_code" };
  }

  const now = new Date().toISOString();
  const opp: OppOpportunity = {
    id: newId(),
    tenantId: principal.tenantId,
    opportunityCode: code,
    title,
    organizationId: input.organizationId,
    ...(input.accountId !== undefined ? { accountId: input.accountId } : {}),
    stage: "new_qualified",
    status: "open",
    ...(input.programmeSummary !== undefined ? { programmeSummary: input.programmeSummary } : {}),
    ...(input.estimatedValue !== undefined ? { estimatedValue: input.estimatedValue } : {}),
    ...(input.currency !== undefined ? { currency: input.currency } : {}),
    ...(input.paxCount !== undefined ? { paxCount: input.paxCount } : {}),
    ...(input.expectedCloseDate !== undefined ? { expectedCloseDate: input.expectedCloseDate } : {}),
    ownerPrincipalId: input.ownerPrincipalId ?? principal.id,
    classification: org.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const history: OppStageHistory = {
    id: newId(),
    tenantId: principal.tenantId,
    opportunityId: opp.id,
    toStage: "new_qualified",
    changedAt: now,
    changedByPrincipalId: principal.id,
  };

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertOpportunity(client, opp);
        await insertOpportunityStageHistory(client, history);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "pipeline:write:opportunity",
            "opp_opportunity",
            opp.id,
            correlationId,
            sanitize(opp),
          ),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PIPELINE_EVENT_TYPES.OPPORTUNITY_CREATED,
          payload: { opportunityId: opp.id, opportunityCode: opp.opportunityCode, stage: opp.stage },
          classification: opp.classification,
          correlationId,
          aggregateId: opp.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_opportunity_code" };
      throw error;
    }
    return { opportunity: sanitize(opp) };
  }

  store.oppOpportunities.push(opp);
  store.oppStageHistory.push(history);
  allowPipelineAudit(store, principal, "pipeline:write:opportunity", "opp_opportunity", opp.id, correlationId, sanitize(opp));
  return { opportunity: sanitize(opp) };
}

export async function transitionOpportunityStage(
  store: Store,
  principal: Principal,
  id: string,
  toStage: string,
  correlationId: string,
  notes?: string,
) {
  ensurePipelineCollections(store);
  const opp = await loadOpportunity(store, principal.tenantId, id);
  if (!opp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "pipeline:transition:stage",
    action: "transition:opp_opportunity",
    resource: { tenantId: opp.tenantId, type: "opportunity", id: opp.id, classification: opp.classification },
  });
  if (decision.result === "deny") {
    if (isMixedSqlDurable(store)) {
      await persistDenyAudit(
        store,
        denyAuditRecord(principal, "pipeline:transition:stage", "opp_opportunity", correlationId, decision.reason, id),
      );
    } else {
      denyPipelineAudit(store, principal, "pipeline:transition:stage", "opp_opportunity", correlationId, decision.reason, id);
    }
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidOpportunityStage(toStage)) {
    return { error: "invalid_request" as const, reason: "invalid_stage" };
  }
  if (!canTransitionOpportunityStage(opp.stage, toStage)) {
    return { error: "conflict" as const, reason: "invalid_stage_transition" };
  }

  const now = new Date().toISOString();
  const fromStage = opp.stage;
  const expectedVersion = opp.version;
  opp.stage = toStage;
  opp.updatedAt = now;
  opp.updatedByPrincipalId = principal.id;
  opp.version += 1;
  if (toStage === "won") opp.status = "won";
  if (toStage === "lost") opp.status = "lost";

  const history: OppStageHistory = {
    id: newId(),
    tenantId: principal.tenantId,
    opportunityId: opp.id,
    fromStage,
    toStage,
    changedAt: now,
    changedByPrincipalId: principal.id,
    ...(notes !== undefined ? { notes } : {}),
  };

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateOpportunityOptimistic(client, opp, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("opportunity");
        await insertOpportunityStageHistory(client, history);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "pipeline:transition:stage", "opp_opportunity", opp.id, correlationId, {
            fromStage,
            toStage,
          }),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PIPELINE_EVENT_TYPES.STAGE_CHANGED,
          payload: { opportunityId: opp.id, fromStage, toStage },
          classification: opp.classification,
          correlationId,
          aggregateId: opp.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) {
        return { error: "conflict" as const, reason: "stale_version" };
      }
      throw error;
    }
    return { opportunity: sanitize(opp) };
  }

  store.oppStageHistory.push(history);
  allowPipelineAudit(store, principal, "pipeline:transition:stage", "opp_opportunity", opp.id, correlationId, {
    fromStage,
    toStage,
  });
  return { opportunity: sanitize(opp) };
}

/** Durable path used by RFP create when an opportunity must advance in the same transaction. */
export async function persistOpportunityStageAdvanceInTx(
  client: Parameters<typeof insertOpportunityStageHistory>[0],
  opp: OppOpportunity,
  history: OppStageHistory,
  expectedVersion: number,
): Promise<void> {
  const updated = await updateOpportunityOptimistic(client, opp, expectedVersion);
  if (updated === 0) throw new OptimisticConcurrencyError("opportunity");
  await insertOpportunityStageHistory(client, history);
}
