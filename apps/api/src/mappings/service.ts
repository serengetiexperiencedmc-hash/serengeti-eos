import {
  authorize,
  canMutateMapping,
  canTransitionMapping,
  isValidMappingStatus,
  newId,
  nextMappingCode,
  type MappingStatus,
  type Principal,
  type RegulationControlMapping,
} from "@sedmc/kernel";
import { ensureComplianceCollections } from "../compliance/collections.js";
import { ensureGrcCollections } from "../grc/collections.js";
import type { Store } from "../store.js";
import { ensureMappingCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const DESCRIPTION_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateMapping(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type MappingView = {
  id: string;
  mappingCode: string;
  title: string;
  status: MappingStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  obligationCode?: string;
  controlId?: string;
  controlCode?: string;
};

function resolveObligationCode(store: Store, tenantId: string, obligationId?: string): string | undefined {
  if (!obligationId) return undefined;
  ensureComplianceCollections(store);
  return store.complianceObligations.find((o) => o.id === obligationId && o.tenantId === tenantId)
    ?.obligationCode;
}

function resolveControlCode(store: Store, tenantId: string, controlId?: string): string | undefined {
  if (!controlId) return undefined;
  ensureGrcCollections(store);
  return store.grcControls.find((c) => c.id === controlId && c.tenantId === tenantId)?.controlCode;
}

function sanitize(store: Store, row: RegulationControlMapping): MappingView {
  const view: MappingView = {
    id: row.id,
    mappingCode: row.mappingCode,
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
  if (row.controlId) {
    view.controlId = row.controlId;
    const code = resolveControlCode(store, row.tenantId, row.controlId);
    if (code) view.controlCode = code;
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

export function getMappingsHealth(store: Store, principal: Principal) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:mapping",
    action: "read:mappings_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.mappingRecords.filter((m) => m.tenantId === principal.tenantId);
  return {
    module: "mappings",
    increment: "G5" as const,
    status: "ok" as const,
    mappings: items.length,
    openMappings: items.filter((m) => m.status !== "retired").length,
  };
}

export function listMappings(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:mapping",
    action: "list:mapping",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidMappingStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.mappingRecords
    .filter((m) => m.tenantId === principal.tenantId)
    .filter((m) => !query?.status || m.status === query.status)
    .filter(
      (m) =>
        !q ||
        `${m.mappingCode} ${m.title} ${m.ownerLabel ?? ""} ${m.description ?? ""}`.toLowerCase().includes(q),
    )
    .map((m) => sanitize(store, m));
  return { items };
}

export function getMapping(store: Store, principal: Principal, id: string) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:mapping",
    action: "get:mapping",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.mappingRecords.find((m) => m.id === id && m.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { mapping: sanitize(store, row) };
}

export function createMapping(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    description?: string;
    ownerLabel?: string;
    obligationId?: string;
    controlId?: string;
  },
) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:mapping",
    action: "create:mapping",
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
  const control = resolveControlId(store, principal, input.controlId);
  if ("error" in control) return control;
  const now = new Date().toISOString();
  const row: RegulationControlMapping = {
    id: newId(),
    tenantId: principal.tenantId,
    mappingCode: nextMappingCode(
      store.mappingRecords.filter((m) => m.tenantId === principal.tenantId).map((m) => m.mappingCode),
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
  if (control.controlId) row.controlId = control.controlId;
  store.mappingRecords.push(row);
  return { mapping: sanitize(store, row) };
}

export function patchMapping(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    description?: string;
    ownerLabel?: string;
    obligationId?: string;
    controlId?: string;
  },
) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:mapping",
    action: "patch:mapping",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.mappingRecords.find((m) => m.id === id && m.tenantId === principal.tenantId);
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
  if (input.controlId !== undefined) {
    const control = resolveControlId(store, principal, input.controlId);
    if ("error" in control) return control;
    if (control.controlId) row.controlId = control.controlId;
    else delete row.controlId;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { mapping: sanitize(store, row) };
}

export function transitionMapping(
  store: Store,
  principal: Principal,
  id: string,
  action: "activate" | "retire",
) {
  ensureMappingCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:mapping",
    action: `transition:mapping:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.mappingRecords.find((m) => m.id === id && m.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionMapping(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { mapping: sanitize(store, row) };
}
