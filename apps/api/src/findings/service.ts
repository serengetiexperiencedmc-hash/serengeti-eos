import {
  authorize,
  canMutateFinding,
  canTransitionFinding,
  isValidFindingStatus,
  newId,
  nextFindingCode,
  type FindingRecord,
  type FindingStatus,
  type Principal,
} from "@sedmc/kernel";
import { ensureGrcCollections } from "../grc/collections.js";
import type { Store } from "../store.js";
import { ensureFindingsCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const DESCRIPTION_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateFinding(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type FindingView = {
  id: string;
  findingCode: string;
  title: string;
  status: FindingStatus;
  description?: string;
  ownerLabel?: string;
  controlId?: string;
  controlCode?: string;
};

function resolveControlCode(store: Store, tenantId: string, controlId?: string): string | undefined {
  if (!controlId) return undefined;
  ensureGrcCollections(store);
  return store.grcControls.find((c) => c.id === controlId && c.tenantId === tenantId)?.controlCode;
}

function sanitize(store: Store, row: FindingRecord): FindingView {
  const view: FindingView = {
    id: row.id,
    findingCode: row.findingCode,
    title: row.title,
    status: row.status,
  };
  if (row.description) view.description = row.description;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  if (row.controlId) {
    view.controlId = row.controlId;
    const code = resolveControlCode(store, row.tenantId, row.controlId);
    if (code) view.controlCode = code;
  }
  return view;
}

function resolveControlId(
  store: Store,
  principal: Principal,
  controlId: string | undefined,
): { ok: true; controlId?: string } | { error: "invalid"; reason: "control_not_found" } {
  if (controlId === undefined) return { ok: true };
  const trimmed = controlId.trim();
  if (!trimmed) return { ok: true };
  ensureGrcCollections(store);
  const row = store.grcControls.find((c) => c.id === trimmed && c.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "control_not_found" };
  return { ok: true, controlId: trimmed };
}

export function getFindingsHealth(store: Store, principal: Principal) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:finding",
    action: "read:findings_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.findingRecords.filter((f) => f.tenantId === principal.tenantId);
  return {
    module: "findings",
    increment: "G3" as const,
    status: "ok" as const,
    findings: items.length,
    openFindings: items.filter((f) => f.status !== "closed").length,
  };
}

export function listFindings(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:finding",
    action: "list:finding",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidFindingStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.findingRecords
    .filter((f) => f.tenantId === principal.tenantId)
    .filter((f) => !query?.status || f.status === query.status)
    .filter(
      (f) =>
        !q ||
        `${f.findingCode} ${f.title} ${f.ownerLabel ?? ""} ${f.description ?? ""}`.toLowerCase().includes(q),
    )
    .map((f) => sanitize(store, f));
  return { items };
}

export function getFinding(store: Store, principal: Principal, id: string) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:finding",
    action: "get:finding",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.findingRecords.find((f) => f.id === id && f.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { finding: sanitize(store, row) };
}

export function createFinding(
  store: Store,
  principal: Principal,
  input: { title?: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:finding",
    action: "create:finding",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const description = input.description?.trim();
  if (description && description.length > DESCRIPTION_MAX) {
    return { error: "invalid" as const, reason: "description_too_long" };
  }
  const ownerLabel = input.ownerLabel?.trim();
  if (ownerLabel && ownerLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "owner_label_too_long" };
  }
  const control = resolveControlId(store, principal, input.controlId);
  if ("error" in control) return control;
  const now = new Date().toISOString();
  const row: FindingRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    findingCode: nextFindingCode(
      store.findingRecords.filter((f) => f.tenantId === principal.tenantId).map((f) => f.findingCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (description) row.description = description;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  if (control.controlId) row.controlId = control.controlId;
  store.findingRecords.push(row);
  return { finding: sanitize(store, row) };
}

export function patchFinding(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:finding",
    action: "patch:finding",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.findingRecords.find((f) => f.id === id && f.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.description !== undefined) {
    const description = input.description.trim();
    if (description.length > DESCRIPTION_MAX) {
      return { error: "invalid" as const, reason: "description_too_long" };
    }
    if (description) row.description = description;
    else delete row.description;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel.length > LABEL_MAX) return { error: "invalid" as const, reason: "owner_label_too_long" };
    if (ownerLabel) row.ownerLabel = ownerLabel;
    else delete row.ownerLabel;
  }
  if (input.controlId !== undefined) {
    const control = resolveControlId(store, principal, input.controlId);
    if ("error" in control) return control;
    if (control.controlId) row.controlId = control.controlId;
    else delete row.controlId;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { finding: sanitize(store, row) };
}

export function transitionFinding(
  store: Store,
  principal: Principal,
  id: string,
  action: "start" | "close",
) {
  ensureFindingsCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:finding",
    action: `transition:finding:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.findingRecords.find((f) => f.id === id && f.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionFinding(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { finding: sanitize(store, row) };
}
