import {
  authorize,
  canTransitionRisk,
  isValidRiskScore,
  isValidRiskStatus,
  newId,
  nextRiskCode,
  type ErmRisk,
  type Principal,
  type RiskStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureErmCollections } from "./collections.js";

const SUMMARY_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type ErmRiskView = {
  id: string;
  riskCode: string;
  title: string;
  likelihood: number;
  impact: number;
  status: RiskStatus;
  summary?: string;
  ownerLabel?: string;
};

function sanitize(risk: ErmRisk): ErmRiskView {
  const view: ErmRiskView = {
    id: risk.id,
    riskCode: risk.riskCode,
    title: risk.title,
    likelihood: risk.likelihood,
    impact: risk.impact,
    status: risk.status,
  };
  if (risk.summary) view.summary = risk.summary;
  if (risk.ownerLabel) view.ownerLabel = risk.ownerLabel;
  return view;
}

export function getErmHealth(store: Store, principal: Principal) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:read:risk", action: "read:erm_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const risks = store.ermRisks.filter((r) => r.tenantId === principal.tenantId);
  return {
    module: "erm",
    increment: "I15" as const,
    status: "ok" as const,
    risks: risks.length,
    openRisks: risks.filter((r) => r.status !== "closed").length,
  };
}

export function listRisks(store: Store, principal: Principal, query?: { q?: string; status?: string }) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:read:risk", action: "list:erm_risk" });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidRiskStatus(query.status)) return { error: "invalid" as const, reason: "invalid_status" };
  const q = query?.q?.trim().toLowerCase();
  const items = store.ermRisks
    .filter((r) => r.tenantId === principal.tenantId)
    .filter((r) => (query?.status ? r.status === query.status : true))
    .filter((r) => (q ? `${r.riskCode} ${r.title}`.toLowerCase().includes(q) : true))
    .map(sanitize);
  return { items };
}

export function getRisk(store: Store, principal: Principal, id: string) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:read:risk", action: "get:erm_risk" });
  if (decision.result === "deny") return deny(decision.reason);
  const risk = store.ermRisks.find((r) => r.id === id && r.tenantId === principal.tenantId);
  if (!risk) return { error: "not_found" as const };
  return { risk: sanitize(risk) };
}

export function createRisk(
  store: Store,
  principal: Principal,
  input: { title?: string; summary?: string; likelihood?: number; impact?: number; ownerLabel?: string },
) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:write:risk", action: "create:erm_risk" });
  if (decision.result === "deny") return deny(decision.reason);
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  const likelihood = input.likelihood ?? 3;
  const impact = input.impact ?? 3;
  if (!isValidRiskScore(likelihood) || !isValidRiskScore(impact)) {
    return { error: "invalid" as const, reason: "invalid_score" };
  }
  const summary = input.summary?.trim();
  if (summary && summary.length > SUMMARY_MAX) return { error: "invalid" as const, reason: "summary_too_long" };
  const ownerLabel = input.ownerLabel?.trim();
  const now = new Date().toISOString();
  const row: ErmRisk = {
    id: newId(),
    tenantId: principal.tenantId,
    riskCode: nextRiskCode(store.ermRisks.filter((r) => r.tenantId === principal.tenantId).map((r) => r.riskCode)),
    title,
    likelihood,
    impact,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (summary) row.summary = summary;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  store.ermRisks.push(row);
  return { risk: sanitize(row) };
}

export function patchRisk(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; summary?: string; likelihood?: number; impact?: number; ownerLabel?: string },
) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:write:risk", action: "patch:erm_risk" });
  if (decision.result === "deny") return deny(decision.reason);
  const risk = store.ermRisks.find((r) => r.id === id && r.tenantId === principal.tenantId);
  if (!risk) return { error: "not_found" as const };
  if (risk.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    risk.title = title;
  }
  if (input.summary !== undefined) {
    const summary = input.summary.trim();
    if (summary.length > SUMMARY_MAX) return { error: "invalid" as const, reason: "summary_too_long" };
    if (summary) risk.summary = summary;
    else delete risk.summary;
  }
  if (input.likelihood !== undefined) {
    if (!isValidRiskScore(input.likelihood)) return { error: "invalid" as const, reason: "invalid_score" };
    risk.likelihood = input.likelihood;
  }
  if (input.impact !== undefined) {
    if (!isValidRiskScore(input.impact)) return { error: "invalid" as const, reason: "invalid_score" };
    risk.impact = input.impact;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel) risk.ownerLabel = ownerLabel;
    else delete risk.ownerLabel;
  }
  risk.updatedAt = new Date().toISOString();
  risk.updatedByPrincipalId = principal.id;
  return { risk: sanitize(risk) };
}

export function transitionRisk(
  store: Store,
  principal: Principal,
  id: string,
  action: "mitigate" | "accept" | "close",
) {
  ensureErmCollections(store);
  const decision = authorize({ principal, permission: "erm:write:risk", action: `transition:erm_risk:${action}` });
  if (decision.result === "deny") return deny(decision.reason);
  const risk = store.ermRisks.find((r) => r.id === id && r.tenantId === principal.tenantId);
  if (!risk) return { error: "not_found" as const };
  const next = canTransitionRisk(risk.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  risk.status = next.next;
  risk.updatedAt = new Date().toISOString();
  risk.updatedByPrincipalId = principal.id;
  return { risk: sanitize(risk) };
}
