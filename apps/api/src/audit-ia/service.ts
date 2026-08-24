import {
  authorize,
  canCloseEngagement,
  canFinalizeWorkpaper,
  canTransitionEngagement,
  isValidEngagementStatus,
  newId,
  nextEngagementCode,
  nextWorkpaperCode,
  type EngagementStatus,
  type IaEngagement,
  type IaWorkpaper,
  type Principal,
  type WorkpaperStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureAuditIaCollections } from "./collections.js";

const TEXT_MAX = 2000;
const BODY_MAX = 20_000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type IaEngagementView = {
  id: string;
  engagementCode: string;
  title: string;
  status: EngagementStatus;
  workpaperCount: number;
  draftWorkpaperCount: number;
  objective?: string;
  ownerLabel?: string;
};

export type IaWorkpaperView = {
  id: string;
  workpaperCode: string;
  engagementId: string;
  engagementCode: string;
  title: string;
  status: WorkpaperStatus;
  body?: string;
};

function draftCount(store: Store, engagementId: string, tenantId: string): number {
  return store.iaWorkpapers.filter(
    (w) => w.tenantId === tenantId && w.engagementId === engagementId && w.status === "draft",
  ).length;
}

function sanitizeEngagement(store: Store, engagement: IaEngagement): IaEngagementView {
  const papers = store.iaWorkpapers.filter(
    (w) => w.tenantId === engagement.tenantId && w.engagementId === engagement.id,
  );
  const view: IaEngagementView = {
    id: engagement.id,
    engagementCode: engagement.engagementCode,
    title: engagement.title,
    status: engagement.status,
    workpaperCount: papers.length,
    draftWorkpaperCount: papers.filter((w) => w.status === "draft").length,
  };
  if (engagement.objective) view.objective = engagement.objective;
  if (engagement.ownerLabel) view.ownerLabel = engagement.ownerLabel;
  return view;
}

function sanitizeWorkpaper(store: Store, paper: IaWorkpaper): IaWorkpaperView | { error: "not_found" } {
  const engagement = store.iaEngagements.find(
    (e) => e.id === paper.engagementId && e.tenantId === paper.tenantId,
  );
  if (!engagement) return { error: "not_found" };
  const view: IaWorkpaperView = {
    id: paper.id,
    workpaperCode: paper.workpaperCode,
    engagementId: paper.engagementId,
    engagementCode: engagement.engagementCode,
    title: paper.title,
    status: paper.status,
  };
  if (paper.body) view.body = paper.body;
  return view;
}

export function getAuditIaHealth(store: Store, principal: Principal) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:read:engagement",
    action: "read:audit_ia_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagements = store.iaEngagements.filter((e) => e.tenantId === principal.tenantId);
  const workpapers = store.iaWorkpapers.filter((w) => w.tenantId === principal.tenantId);
  return {
    module: "audit-ia",
    increment: "I16" as const,
    status: "ok" as const,
    engagements: engagements.length,
    openEngagements: engagements.filter((e) => e.status !== "closed").length,
    workpapers: workpapers.length,
    draftWorkpapers: workpapers.filter((w) => w.status === "draft").length,
  };
}

export function listEngagements(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:read:engagement",
    action: "list:ia_engagement",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidEngagementStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase();
  const items = store.iaEngagements
    .filter((e) => e.tenantId === principal.tenantId)
    .filter((e) => (query?.status ? e.status === query.status : true))
    .filter((e) => (q ? `${e.engagementCode} ${e.title}`.toLowerCase().includes(q) : true))
    .map((e) => sanitizeEngagement(store, e));
  return { items };
}

export function getEngagement(store: Store, principal: Principal, id: string) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:read:engagement",
    action: "get:ia_engagement",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagement = store.iaEngagements.find((e) => e.id === id && e.tenantId === principal.tenantId);
  if (!engagement) return { error: "not_found" as const };
  return { engagement: sanitizeEngagement(store, engagement) };
}

export function createEngagement(
  store: Store,
  principal: Principal,
  input: { title?: string; objective?: string; ownerLabel?: string },
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:engagement",
    action: "create:ia_engagement",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  const objective = input.objective?.trim();
  if (objective && objective.length > TEXT_MAX) return { error: "invalid" as const, reason: "objective_too_long" };
  const ownerLabel = input.ownerLabel?.trim();
  const now = new Date().toISOString();
  const row: IaEngagement = {
    id: newId(),
    tenantId: principal.tenantId,
    engagementCode: nextEngagementCode(
      store.iaEngagements.filter((e) => e.tenantId === principal.tenantId).map((e) => e.engagementCode),
    ),
    title,
    status: "planned",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (objective) row.objective = objective;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  store.iaEngagements.push(row);
  return { engagement: sanitizeEngagement(store, row) };
}

export function patchEngagement(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; objective?: string; ownerLabel?: string },
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:engagement",
    action: "patch:ia_engagement",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagement = store.iaEngagements.find((e) => e.id === id && e.tenantId === principal.tenantId);
  if (!engagement) return { error: "not_found" as const };
  if (engagement.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    engagement.title = title;
  }
  if (input.objective !== undefined) {
    const objective = input.objective.trim();
    if (objective.length > TEXT_MAX) return { error: "invalid" as const, reason: "objective_too_long" };
    if (objective) engagement.objective = objective;
    else delete engagement.objective;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel) engagement.ownerLabel = ownerLabel;
    else delete engagement.ownerLabel;
  }
  engagement.updatedAt = new Date().toISOString();
  engagement.updatedByPrincipalId = principal.id;
  return { engagement: sanitizeEngagement(store, engagement) };
}

export function transitionEngagement(
  store: Store,
  principal: Principal,
  id: string,
  action: "start" | "close",
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:engagement",
    action: `transition:ia_engagement:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagement = store.iaEngagements.find((e) => e.id === id && e.tenantId === principal.tenantId);
  if (!engagement) return { error: "not_found" as const };
  const next = canTransitionEngagement(engagement.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  if (action === "close") {
    const closeCheck = canCloseEngagement(draftCount(store, engagement.id, principal.tenantId));
    if (!closeCheck.allowed) return { error: "conflict" as const, reason: closeCheck.reason };
  }
  engagement.status = next.next;
  engagement.updatedAt = new Date().toISOString();
  engagement.updatedByPrincipalId = principal.id;
  return { engagement: sanitizeEngagement(store, engagement) };
}

export function listWorkpapers(store: Store, principal: Principal, engagementId: string) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:read:workpaper",
    action: "list:ia_workpaper",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagement = store.iaEngagements.find(
    (e) => e.id === engagementId && e.tenantId === principal.tenantId,
  );
  if (!engagement) return { error: "not_found" as const };
  const items = store.iaWorkpapers
    .filter((w) => w.tenantId === principal.tenantId && w.engagementId === engagementId)
    .map((w) => sanitizeWorkpaper(store, w))
    .filter((row): row is IaWorkpaperView => !("error" in row));
  return { items };
}

export function getWorkpaper(store: Store, principal: Principal, id: string) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:read:workpaper",
    action: "get:ia_workpaper",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const paper = store.iaWorkpapers.find((w) => w.id === id && w.tenantId === principal.tenantId);
  if (!paper) return { error: "not_found" as const };
  const view = sanitizeWorkpaper(store, paper);
  if ("error" in view) return view;
  return { workpaper: view };
}

export function createWorkpaper(
  store: Store,
  principal: Principal,
  engagementId: string,
  input: { title?: string; body?: string },
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:workpaper",
    action: "create:ia_workpaper",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const engagement = store.iaEngagements.find(
    (e) => e.id === engagementId && e.tenantId === principal.tenantId,
  );
  if (!engagement) return { error: "not_found" as const };
  if (engagement.status === "closed") return { error: "conflict" as const, reason: "closed" };
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  const body = input.body?.trim();
  if (body && body.length > BODY_MAX) return { error: "invalid" as const, reason: "body_too_long" };
  const now = new Date().toISOString();
  const row: IaWorkpaper = {
    id: newId(),
    tenantId: principal.tenantId,
    engagementId: engagement.id,
    workpaperCode: nextWorkpaperCode(
      store.iaWorkpapers.filter((w) => w.tenantId === principal.tenantId).map((w) => w.workpaperCode),
    ),
    title,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (body) row.body = body;
  store.iaWorkpapers.push(row);
  const view = sanitizeWorkpaper(store, row);
  if ("error" in view) return view;
  return { workpaper: view };
}

export function patchWorkpaper(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; body?: string },
) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:workpaper",
    action: "patch:ia_workpaper",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const paper = store.iaWorkpapers.find((w) => w.id === id && w.tenantId === principal.tenantId);
  if (!paper) return { error: "not_found" as const };
  if (paper.status !== "draft") return { error: "conflict" as const, reason: "not_draft" };
  const engagement = store.iaEngagements.find(
    (e) => e.id === paper.engagementId && e.tenantId === principal.tenantId,
  );
  if (!engagement) return { error: "not_found" as const };
  if (engagement.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    paper.title = title;
  }
  if (input.body !== undefined) {
    const body = input.body.trim();
    if (body.length > BODY_MAX) return { error: "invalid" as const, reason: "body_too_long" };
    if (body) paper.body = body;
    else delete paper.body;
  }
  paper.updatedAt = new Date().toISOString();
  paper.updatedByPrincipalId = principal.id;
  const view = sanitizeWorkpaper(store, paper);
  if ("error" in view) return view;
  return { workpaper: view };
}

export function finalizeWorkpaper(store: Store, principal: Principal, id: string) {
  ensureAuditIaCollections(store);
  const decision = authorize({
    principal,
    permission: "auditia:write:workpaper",
    action: "finalize:ia_workpaper",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const paper = store.iaWorkpapers.find((w) => w.id === id && w.tenantId === principal.tenantId);
  if (!paper) return { error: "not_found" as const };
  if (paper.status !== "draft") return { error: "conflict" as const, reason: "not_draft" };
  const sod = canFinalizeWorkpaper(paper.createdByPrincipalId, principal.id);
  if (!sod.allowed) return deny(sod.reason);
  paper.status = "finalized";
  paper.updatedAt = new Date().toISOString();
  paper.updatedByPrincipalId = principal.id;
  const view = sanitizeWorkpaper(store, paper);
  if ("error" in view) return view;
  return { workpaper: view };
}
