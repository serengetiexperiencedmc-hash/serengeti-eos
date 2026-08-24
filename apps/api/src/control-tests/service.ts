import {
  authorize,
  canMutateCampaign,
  canTransitionCampaign,
  isValidCampaignStatus,
  newId,
  nextCampaignCode,
  type ControlTestCampaign,
  type CampaignStatus,
  type Principal,
} from "@sedmc/kernel";
import { ensureGrcCollections } from "../grc/collections.js";
import type { Store } from "../store.js";
import { ensureCampaignCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const DESCRIPTION_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateCampaign(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type CampaignView = {
  id: string;
  campaignCode: string;
  title: string;
  status: CampaignStatus;
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

function sanitize(store: Store, row: ControlTestCampaign): CampaignView {
  const view: CampaignView = {
    id: row.id,
    campaignCode: row.campaignCode,
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

export function getCampaignsHealth(store: Store, principal: Principal) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:campaign",
    action: "read:campaigns_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.controlTestCampaigns.filter((c) => c.tenantId === principal.tenantId);
  return {
    module: "control-tests",
    increment: "G4" as const,
    status: "ok" as const,
    campaigns: items.length,
    openCampaigns: items.filter((c) => c.status !== "closed").length,
  };
}

export function listCampaigns(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:campaign",
    action: "list:campaign",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidCampaignStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.controlTestCampaigns
    .filter((c) => c.tenantId === principal.tenantId)
    .filter((c) => !query?.status || c.status === query.status)
    .filter(
      (c) =>
        !q ||
        `${c.campaignCode} ${c.title} ${c.ownerLabel ?? ""} ${c.description ?? ""}`.toLowerCase().includes(q),
    )
    .map((c) => sanitize(store, c));
  return { items };
}

export function getCampaign(store: Store, principal: Principal, id: string) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:read:campaign",
    action: "get:campaign",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.controlTestCampaigns.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { campaign: sanitize(store, row) };
}

export function createCampaign(
  store: Store,
  principal: Principal,
  input: { title?: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:campaign",
    action: "create:campaign",
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
  const row: ControlTestCampaign = {
    id: newId(),
    tenantId: principal.tenantId,
    campaignCode: nextCampaignCode(
      store.controlTestCampaigns
        .filter((c) => c.tenantId === principal.tenantId)
        .map((c) => c.campaignCode),
    ),
    title,
    status: "planned",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (description) row.description = description;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  if (control.controlId) row.controlId = control.controlId;
  store.controlTestCampaigns.push(row);
  return { campaign: sanitize(store, row) };
}

export function patchCampaign(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:campaign",
    action: "patch:campaign",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.controlTestCampaigns.find((c) => c.id === id && c.tenantId === principal.tenantId);
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
  return { campaign: sanitize(store, row) };
}

export function transitionCampaign(
  store: Store,
  principal: Principal,
  id: string,
  action: "start" | "close",
) {
  ensureCampaignCollections(store);
  const decision = authorize({
    principal,
    permission: "grc:write:campaign",
    action: `transition:campaign:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.controlTestCampaigns.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionCampaign(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { campaign: sanitize(store, row) };
}
