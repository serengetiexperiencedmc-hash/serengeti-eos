import {
  authorize,
  canMutateCrisisDecision,
  canTransitionCrisisDecision,
  isValidCrisisDecisionStatus,
  newId,
  nextCrisisDecisionCode,
  type CrisisDecision,
  type CrisisDecisionStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureCrisisDecisionCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateCrisisDecision(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type CrisisDecisionView = {
  id: string;
  decisionCode: string;
  title: string;
  status: CrisisDecisionStatus;
  options?: string;
  chosenAction?: string;
  rationale?: string;
  authorityLabel?: string;
  crisisId: string;
  crisisCode?: string;
};

function resolveCrisisCode(store: Store, tenantId: string, crisisId: string): string | undefined {
  return store.crisisCases.find((row) => row.id === crisisId && row.tenantId === tenantId)?.crisisCode;
}

function sanitize(store: Store, row: CrisisDecision): CrisisDecisionView {
  const view: CrisisDecisionView = {
    id: row.id,
    decisionCode: row.decisionCode,
    title: row.title,
    status: row.status,
    crisisId: row.crisisId,
  };
  if (row.options) view.options = row.options;
  if (row.chosenAction) view.chosenAction = row.chosenAction;
  if (row.rationale) view.rationale = row.rationale;
  if (row.authorityLabel) view.authorityLabel = row.authorityLabel;
  const code = resolveCrisisCode(store, row.tenantId, row.crisisId);
  if (code) view.crisisCode = code;
  return view;
}

function resolveOpenCrisisId(
  store: Store,
  principal: Principal,
  crisisId: string | undefined,
):
  | { ok: true; crisisId: string }
  | { error: "invalid"; reason: "crisis_not_found" }
  | { error: "conflict"; reason: "case_closed" } {
  const trimmed = crisisId?.trim() ?? "";
  if (!trimmed) return { error: "invalid", reason: "crisis_not_found" };
  const row = store.crisisCases.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "crisis_not_found" };
  if (row.status === "closed") return { error: "conflict", reason: "case_closed" };
  return { ok: true, crisisId: trimmed };
}

export function getCrisisDecisionsHealth(store: Store, principal: Principal) {
  ensureCrisisDecisionCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:decision",
    action: "read:crisis_decisions_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.crisisDecisions.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "crisis-decisions",
    increment: "K1" as const,
    status: "ok" as const,
    decisions: items.length,
    recordedDecisions: items.filter((row) => row.status === "recorded").length,
  };
}

export function listCrisisDecisions(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; crisisId?: string },
) {
  ensureCrisisDecisionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:read:decision",
    action: "list:crisis_decision",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidCrisisDecisionStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const crisisId = query?.crisisId?.trim();
  const items = store.crisisDecisions
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !crisisId || row.crisisId === crisisId)
    .filter(
      (row) =>
        !q ||
        `${row.decisionCode} ${row.title} ${row.authorityLabel ?? ""} ${row.options ?? ""} ${row.chosenAction ?? ""} ${row.rationale ?? ""}`.toLowerCase().includes(
          q,
        ),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getCrisisDecision(store: Store, principal: Principal, id: string) {
  ensureCrisisDecisionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:read:decision",
    action: "get:crisis_decision",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.crisisDecisions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { decision: sanitize(store, row) };
}

export function createCrisisDecision(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    options?: string;
    chosenAction?: string;
    rationale?: string;
    authorityLabel?: string;
    crisisId?: string;
  },
) {
  ensureCrisisDecisionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:decision",
    action: "create:crisis_decision",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const options = input.options?.trim();
  if (options && options.length > TEXT_MAX) return { error: "invalid" as const, reason: "options_too_long" };
  const chosenAction = input.chosenAction?.trim();
  if (chosenAction && chosenAction.length > TEXT_MAX) {
    return { error: "invalid" as const, reason: "chosen_action_too_long" };
  }
  const rationale = input.rationale?.trim();
  if (rationale && rationale.length > TEXT_MAX) return { error: "invalid" as const, reason: "rationale_too_long" };
  const authorityLabel = input.authorityLabel?.trim();
  if (authorityLabel && authorityLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "authority_label_too_long" };
  }
  const crisis = resolveOpenCrisisId(store, principal, input.crisisId);
  if ("error" in crisis) return crisis;
  const now = new Date().toISOString();
  const row: CrisisDecision = {
    id: newId(),
    tenantId: principal.tenantId,
    decisionCode: nextCrisisDecisionCode(
      store.crisisDecisions.filter((item) => item.tenantId === principal.tenantId).map((item) => item.decisionCode),
    ),
    title,
    status: "recorded",
    crisisId: crisis.crisisId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (options) row.options = options;
  if (chosenAction) row.chosenAction = chosenAction;
  if (rationale) row.rationale = rationale;
  if (authorityLabel) row.authorityLabel = authorityLabel;
  store.crisisDecisions.push(row);
  return { decision: sanitize(store, row) };
}

export function patchCrisisDecision(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    options?: string;
    chosenAction?: string;
    rationale?: string;
    authorityLabel?: string;
  },
) {
  ensureCrisisDecisionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:decision",
    action: "patch:crisis_decision",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.crisisDecisions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "superseded") return { error: "conflict" as const, reason: "superseded" };
  const parent = resolveOpenCrisisId(store, principal, row.crisisId);
  if ("error" in parent) return parent;
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.options !== undefined) {
    const options = input.options.trim();
    if (options.length > TEXT_MAX) return { error: "invalid" as const, reason: "options_too_long" };
    if (options) row.options = options;
    else delete row.options;
  }
  if (input.chosenAction !== undefined) {
    const chosenAction = input.chosenAction.trim();
    if (chosenAction.length > TEXT_MAX) return { error: "invalid" as const, reason: "chosen_action_too_long" };
    if (chosenAction) row.chosenAction = chosenAction;
    else delete row.chosenAction;
  }
  if (input.rationale !== undefined) {
    const rationale = input.rationale.trim();
    if (rationale.length > TEXT_MAX) return { error: "invalid" as const, reason: "rationale_too_long" };
    if (rationale) row.rationale = rationale;
    else delete row.rationale;
  }
  if (input.authorityLabel !== undefined) {
    const authorityLabel = input.authorityLabel.trim();
    if (authorityLabel.length > LABEL_MAX) {
      return { error: "invalid" as const, reason: "authority_label_too_long" };
    }
    if (authorityLabel) row.authorityLabel = authorityLabel;
    else delete row.authorityLabel;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { decision: sanitize(store, row) };
}

export function supersedeCrisisDecision(store: Store, principal: Principal, id: string) {
  ensureCrisisDecisionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:decision",
    action: "transition:crisis_decision:supersede",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.crisisDecisions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const parent = resolveOpenCrisisId(store, principal, row.crisisId);
  if ("error" in parent) return parent;
  const next = canTransitionCrisisDecision(row.status, "supersede");
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { decision: sanitize(store, row) };
}
