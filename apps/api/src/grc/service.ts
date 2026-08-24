import {
  authorize,
  canMutateControl,
  canTransitionControl,
  isValidControlStatus,
  newId,
  nextControlCode,
  type ControlStatus,
  type GrcControl,
  type Principal,
} from "@sedmc/kernel";
import { ensureComplianceCollections } from "../compliance/collections.js";
import type { Store } from "../store.js";
import { ensureGrcCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const DESCRIPTION_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateControl(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type GrcControlView = {
  id: string;
  controlCode: string;
  title: string;
  status: ControlStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  obligationCode?: string;
};

function resolveObligationCode(store: Store, tenantId: string, obligationId?: string): string | undefined {
  if (!obligationId) return undefined;
  ensureComplianceCollections(store);
  return store.complianceObligations.find((o) => o.id === obligationId && o.tenantId === tenantId)
    ?.obligationCode;
}

function sanitize(store: Store, row: GrcControl): GrcControlView {
  const view: GrcControlView = {
    id: row.id,
    controlCode: row.controlCode,
    title: row.title,
    status: row.status,
  };
  if (row.description) view.description = row.description;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  if (row.obligationId) {
    view.obligationId = row.obligationId;
    const code = resolveObligationCode(store, row.tenantId, row.obligationId);
    if (code) view.obligationCode = code;
  }
  return view;
}

function resolveObligationId(
  store: Store,
  principal: Principal,
  obligationId: string | undefined,
): { ok: true; obligationId?: string } | { error: "invalid"; reason: "obligation_not_found" } {
  if (obligationId === undefined) return { ok: true };
  const trimmed = obligationId.trim();
  if (!trimmed) return { ok: true };
  ensureComplianceCollections(store);
  const row = store.complianceObligations.find(
    (o) => o.id === trimmed && o.tenantId === principal.tenantId,
  );
  if (!row) return { error: "invalid", reason: "obligation_not_found" };
  return { ok: true, obligationId: trimmed };
}

export function getGrcHealth(store: Store, principal: Principal) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:control",
    action: "read:grc_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.grcControls.filter((c) => c.tenantId === principal.tenantId);
  return {
    module: "grc",
    increment: "G2" as const,
    status: "ok" as const,
    controls: items.length,
    openControls: items.filter((c) => c.status !== "retired").length,
  };
}

export function listControls(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:control",
    action: "list:grc_control",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidControlStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.grcControls
    .filter((c) => c.tenantId === principal.tenantId)
    .filter((c) => !query?.status || c.status === query.status)
    .filter(
      (c) =>
        !q ||
        `${c.controlCode} ${c.title} ${c.ownerLabel ?? ""} ${c.description ?? ""}`.toLowerCase().includes(q),
    )
    .map((c) => sanitize(store, c));
  return { items };
}

export function getControl(store: Store, principal: Principal, id: string) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:control",
    action: "get:grc_control",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.grcControls.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { control: sanitize(store, row) };
}

export function createControl(
  store: Store,
  principal: Principal,
  input: { title?: string; description?: string; ownerLabel?: string; obligationId?: string },
) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:control",
    action: "create:grc_control",
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
  const obligation = resolveObligationId(store, principal, input.obligationId);
  if ("error" in obligation) return obligation;
  const now = new Date().toISOString();
  const row: GrcControl = {
    id: newId(),
    tenantId: principal.tenantId,
    controlCode: nextControlCode(
      store.grcControls.filter((c) => c.tenantId === principal.tenantId).map((c) => c.controlCode),
    ),
    title,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (description) row.description = description;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  if (obligation.obligationId) row.obligationId = obligation.obligationId;
  store.grcControls.push(row);
  return { control: sanitize(store, row) };
}

export function patchControl(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; description?: string; ownerLabel?: string; obligationId?: string },
) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:control",
    action: "patch:grc_control",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.grcControls.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "retired") return { error: "conflict" as const, reason: "retired" };
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
  if (input.obligationId !== undefined) {
    const obligation = resolveObligationId(store, principal, input.obligationId);
    if ("error" in obligation) return obligation;
    if (obligation.obligationId) row.obligationId = obligation.obligationId;
    else delete row.obligationId;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { control: sanitize(store, row) };
}

export function transitionControl(
  store: Store,
  principal: Principal,
  id: string,
  action: "activate" | "retire",
) {
  ensureGrcCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:control",
    action: `transition:grc_control:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.grcControls.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionControl(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { control: sanitize(store, row) };
}
