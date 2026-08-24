import {
  authorize,
  isValidCiClass,
  isValidCiCriticality,
  isValidCiEnvironment,
  isValidCiLifecycle,
  isValidCiRelType,
  newId,
  nextCiCode,
  type CiClass,
  type CiCriticality,
  type CiEnvironment,
  type CiLifecycle,
  type CiRelType,
  type CmdbCi,
  type CmdbRelationship,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItCollections } from "./collections.js";

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function findCi(store: Store, tenantId: string, id: string) {
  return store.cmdbCis.find((c) => c.id === id && c.tenantId === tenantId);
}

export type CmdbCiView = {
  id: string;
  ciCode: string;
  name: string;
  ciClass: CiClass;
  lifecycle: CiLifecycle;
  environment: CiEnvironment;
  criticality: CiCriticality;
  classification: string;
  sourceOfTruth: "manual";
  relatedTicketCount: number;
  ownerName?: string;
  custodianName?: string;
  rtoMinutes?: number;
  rpoMinutes?: number;
};

export type CmdbRelationshipView = {
  id: string;
  fromCiId: string;
  fromCiCode: string;
  fromName: string;
  toCiId: string;
  toCiCode: string;
  toName: string;
  relType: CiRelType;
};

function relatedTicketCount(store: Store, ciId: string, tenantId: string) {
  return store.itsmTicketCis.filter((l) => l.ciId === ciId && l.tenantId === tenantId).length;
}

function sanitizeCi(store: Store, ci: CmdbCi): CmdbCiView {
  const view: CmdbCiView = {
    id: ci.id,
    ciCode: ci.ciCode,
    name: ci.name,
    ciClass: ci.ciClass,
    lifecycle: ci.lifecycle,
    environment: ci.environment,
    criticality: ci.criticality,
    classification: ci.classification,
    sourceOfTruth: "manual",
    relatedTicketCount: relatedTicketCount(store, ci.id, ci.tenantId),
  };
  if (ci.ownerName) view.ownerName = ci.ownerName;
  if (ci.custodianName) view.custodianName = ci.custodianName;
  if (ci.rtoMinutes != null) view.rtoMinutes = ci.rtoMinutes;
  if (ci.rpoMinutes != null) view.rpoMinutes = ci.rpoMinutes;
  return view;
}

function sanitizeRel(store: Store, rel: CmdbRelationship): CmdbRelationshipView {
  const from = findCi(store, rel.tenantId, rel.fromCiId);
  const to = findCi(store, rel.tenantId, rel.toCiId);
  return {
    id: rel.id,
    fromCiId: rel.fromCiId,
    fromCiCode: from?.ciCode ?? "",
    fromName: from?.name ?? "",
    toCiId: rel.toCiId,
    toCiCode: to?.ciCode ?? "",
    toName: to?.name ?? "",
    relType: rel.relType,
  };
}

export function getCmdbModuleHealth(store: Store, principal: Principal) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:read:ci", action: "read:cmdb_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const tenantId = principal.tenantId;
  return {
    module: "cmdb",
    increment: "I11" as const,
    status: "ok" as const,
    cis: store.cmdbCis.filter((c) => c.tenantId === tenantId).length,
    relationships: store.cmdbRelationships.filter((r) => r.tenantId === tenantId).length,
  };
}

export function listCis(
  store: Store,
  principal: Principal,
  query?: { q?: string; ciClass?: string; lifecycle?: string },
) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:read:ci", action: "read:cmdb_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.ciClass && !isValidCiClass(query.ciClass)) {
    return { error: "invalid_request" as const, reason: "invalid_ci_class" };
  }
  if (query?.lifecycle && !isValidCiLifecycle(query.lifecycle)) {
    return { error: "invalid_request" as const, reason: "invalid_lifecycle" };
  }
  let items = store.cmdbCis.filter((c) => c.tenantId === principal.tenantId);
  if (query?.ciClass) items = items.filter((c) => c.ciClass === query.ciClass);
  if (query?.lifecycle) items = items.filter((c) => c.lifecycle === query.lifecycle);
  const q = query?.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((c) => `${c.ciCode} ${c.name} ${c.ciClass}`.toLowerCase().includes(q));
  }
  items = [...items].sort((a, b) => a.ciCode.localeCompare(b.ciCode));
  return { items: items.map((c) => sanitizeCi(store, c)) };
}

export function getCi(store: Store, principal: Principal, id: string) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:read:ci", action: "read:cmdb_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  const ci = findCi(store, principal.tenantId, id);
  if (!ci) return { error: "not_found" as const, reason: "ci_not_found" };
  const relationships = store.cmdbRelationships
    .filter((r) => r.tenantId === principal.tenantId && (r.fromCiId === ci.id || r.toCiId === ci.id))
    .map((r) => sanitizeRel(store, r));
  const tickets = store.itsmTicketCis
    .filter((l) => l.ciId === ci.id && l.tenantId === principal.tenantId)
    .map((l) => {
      const ticket = store.itsmTickets.find((t) => t.id === l.ticketId && t.tenantId === principal.tenantId);
      return {
        ticketId: l.ticketId,
        ticketCode: ticket?.ticketCode ?? "",
        title: ticket?.title ?? "",
        status: ticket?.status ?? "open",
      };
    });
  return { ci: sanitizeCi(store, ci), relationships, tickets };
}

export type CreateCiInput = {
  name?: string;
  ciClass?: string;
  lifecycle?: string;
  environment?: string;
  criticality?: string;
  classification?: string;
  ownerName?: string;
  custodianName?: string;
  rtoMinutes?: number;
  rpoMinutes?: number;
};

export function createCi(store: Store, principal: Principal, input: CreateCiInput) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:write:ci", action: "write:cmdb_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  const name = input.name?.trim();
  if (!name) return { error: "invalid_request" as const, reason: "name_required" };
  if (!input.ciClass || !isValidCiClass(input.ciClass)) {
    return { error: "invalid_request" as const, reason: "invalid_ci_class" };
  }
  if (input.lifecycle && !isValidCiLifecycle(input.lifecycle)) {
    return { error: "invalid_request" as const, reason: "invalid_lifecycle" };
  }
  if (input.environment && !isValidCiEnvironment(input.environment)) {
    return { error: "invalid_request" as const, reason: "invalid_environment" };
  }
  if (input.criticality && !isValidCiCriticality(input.criticality)) {
    return { error: "invalid_request" as const, reason: "invalid_criticality" };
  }
  const tenantCis = store.cmdbCis.filter((c) => c.tenantId === principal.tenantId);
  if (tenantCis.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return { error: "conflict" as const, reason: "duplicate_ci_name" };
  }
  const now = new Date().toISOString();
  const ci: CmdbCi = {
    id: newId(),
    tenantId: principal.tenantId,
    ciCode: nextCiCode(tenantCis.map((c) => c.ciCode)),
    name,
    ciClass: input.ciClass,
    lifecycle: input.lifecycle && isValidCiLifecycle(input.lifecycle) ? input.lifecycle : "planned",
    environment: input.environment && isValidCiEnvironment(input.environment) ? input.environment : "development",
    criticality: input.criticality && isValidCiCriticality(input.criticality) ? input.criticality : "medium",
    classification: input.classification?.trim() || "Internal",
    sourceOfTruth: "manual",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const ownerName = input.ownerName?.trim();
  if (ownerName) ci.ownerName = ownerName;
  const custodianName = input.custodianName?.trim();
  if (custodianName) ci.custodianName = custodianName;
  if (typeof input.rtoMinutes === "number" && input.rtoMinutes >= 0) ci.rtoMinutes = input.rtoMinutes;
  if (typeof input.rpoMinutes === "number" && input.rpoMinutes >= 0) ci.rpoMinutes = input.rpoMinutes;
  store.cmdbCis.push(ci);
  return { ci: sanitizeCi(store, ci) };
}

export type PatchCiInput = {
  name?: string;
  lifecycle?: string;
  environment?: string;
  criticality?: string;
  classification?: string;
  ownerName?: string | null;
  custodianName?: string | null;
  rtoMinutes?: number | null;
  rpoMinutes?: number | null;
};

export function patchCi(store: Store, principal: Principal, id: string, input: PatchCiInput) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:write:ci", action: "write:cmdb_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  const ci = findCi(store, principal.tenantId, id);
  if (!ci) return { error: "not_found" as const, reason: "ci_not_found" };
  if (input.lifecycle && !isValidCiLifecycle(input.lifecycle)) {
    return { error: "invalid_request" as const, reason: "invalid_lifecycle" };
  }
  if (input.environment && !isValidCiEnvironment(input.environment)) {
    return { error: "invalid_request" as const, reason: "invalid_environment" };
  }
  if (input.criticality && !isValidCiCriticality(input.criticality)) {
    return { error: "invalid_request" as const, reason: "invalid_criticality" };
  }
  if (typeof input.name === "string") {
    const name = input.name.trim();
    if (!name) return { error: "invalid_request" as const, reason: "name_required" };
    const dup = store.cmdbCis.some(
      (c) => c.tenantId === principal.tenantId && c.id !== ci.id && c.name.toLowerCase() === name.toLowerCase(),
    );
    if (dup) return { error: "conflict" as const, reason: "duplicate_ci_name" };
    ci.name = name;
  }
  if (input.lifecycle && isValidCiLifecycle(input.lifecycle)) ci.lifecycle = input.lifecycle;
  if (input.environment && isValidCiEnvironment(input.environment)) ci.environment = input.environment;
  if (input.criticality && isValidCiCriticality(input.criticality)) ci.criticality = input.criticality;
  if (typeof input.classification === "string" && input.classification.trim()) {
    ci.classification = input.classification.trim();
  }
  if (input.ownerName === null) delete ci.ownerName;
  else if (typeof input.ownerName === "string") {
    const ownerName = input.ownerName.trim();
    if (ownerName) ci.ownerName = ownerName;
    else delete ci.ownerName;
  }
  if (input.custodianName === null) delete ci.custodianName;
  else if (typeof input.custodianName === "string") {
    const custodianName = input.custodianName.trim();
    if (custodianName) ci.custodianName = custodianName;
    else delete ci.custodianName;
  }
  if (input.rtoMinutes === null) delete ci.rtoMinutes;
  else if (typeof input.rtoMinutes === "number" && input.rtoMinutes >= 0) ci.rtoMinutes = input.rtoMinutes;
  if (input.rpoMinutes === null) delete ci.rpoMinutes;
  else if (typeof input.rpoMinutes === "number" && input.rpoMinutes >= 0) ci.rpoMinutes = input.rpoMinutes;
  ci.updatedAt = new Date().toISOString();
  ci.updatedByPrincipalId = principal.id;
  return { ci: sanitizeCi(store, ci) };
}

export function listRelationships(store: Store, principal: Principal, query?: { ciId?: string }) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:read:ci", action: "read:cmdb_relationship" });
  if (decision.result === "deny") return deny(decision.reason);
  let items = store.cmdbRelationships.filter((r) => r.tenantId === principal.tenantId);
  if (query?.ciId) items = items.filter((r) => r.fromCiId === query.ciId || r.toCiId === query.ciId);
  return { items: items.map((r) => sanitizeRel(store, r)) };
}

export function createRelationship(
  store: Store,
  principal: Principal,
  input: { fromCiId?: string; toCiId?: string; relType?: string },
) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:write:ci", action: "write:cmdb_relationship" });
  if (decision.result === "deny") return deny(decision.reason);
  if (!input.fromCiId || !input.toCiId) return { error: "invalid_request" as const, reason: "ci_ids_required" };
  if (input.fromCiId === input.toCiId) return { error: "invalid_request" as const, reason: "self_relationship" };
  if (!input.relType || !isValidCiRelType(input.relType)) {
    return { error: "invalid_request" as const, reason: "invalid_rel_type" };
  }
  const from = findCi(store, principal.tenantId, input.fromCiId);
  const to = findCi(store, principal.tenantId, input.toCiId);
  if (!from || !to) return { error: "not_found" as const, reason: "ci_not_found" };
  const dup = store.cmdbRelationships.some(
    (r) =>
      r.tenantId === principal.tenantId &&
      r.fromCiId === from.id &&
      r.toCiId === to.id &&
      r.relType === input.relType,
  );
  if (dup) return { error: "conflict" as const, reason: "duplicate_relationship" };
  const rel: CmdbRelationship = {
    id: newId(),
    tenantId: principal.tenantId,
    fromCiId: from.id,
    toCiId: to.id,
    relType: input.relType,
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  store.cmdbRelationships.push(rel);
  return { relationship: sanitizeRel(store, rel) };
}

export function deleteRelationship(store: Store, principal: Principal, id: string) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "cmdb:write:ci", action: "write:cmdb_relationship" });
  if (decision.result === "deny") return deny(decision.reason);
  const idx = store.cmdbRelationships.findIndex((r) => r.id === id && r.tenantId === principal.tenantId);
  if (idx < 0) return { error: "not_found" as const, reason: "relationship_not_found" };
  store.cmdbRelationships.splice(idx, 1);
  return { ok: true as const };
}
