import {
  authorize,
  newId,
  SUPPLIER_EVENT_TYPES,
  SUPPLIER_RATE_STATUSES,
  SUPPLIER_RATE_TYPES,
  type Principal,
  type SupRate,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";

const ISO_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const RATE_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;

function sanitizeRate(r: SupRate) {
  return {
    id: r.id,
    supplierId: r.supplierId,
    rateCode: r.rateCode,
    rateName: r.rateName,
    rateType: r.rateType,
    unitDescription: r.unitDescription,
    amount: r.amount,
    currency: r.currency,
    validFrom: r.validFrom,
    validTo: r.validTo,
    seasonLabel: r.seasonLabel,
    includesTax: r.includesTax,
    taxPercent: r.taxPercent,
    status: r.status,
    version: r.version,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function findSupplier(store: Store, tenantId: string, supplierId: string) {
  return store.supSuppliers.find((s) => s.id === supplierId && s.tenantId === tenantId && !s.archivedAt);
}

function authorizeWrite(store: Store, principal: Principal, supplierId: string, correlationId: string, action: string) {
  const supplier = findSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action,
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", correlationId, decision.reason, supplierId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return { supplier };
}

export type CreateRateInput = {
  rateCode: string;
  rateName: string;
  rateType: string;
  amount: number;
  currency: string;
  validFrom: string;
  validTo: string;
  unitDescription?: string;
  seasonLabel?: string;
  includesTax?: boolean;
  taxPercent?: number;
  status?: string;
  notes?: string;
};

export type UpdateRateInput = {
  rateName?: string;
  rateType?: string;
  amount?: number;
  currency?: string;
  validFrom?: string;
  validTo?: string;
  unitDescription?: string | null;
  seasonLabel?: string | null;
  includesTax?: boolean;
  taxPercent?: number | null;
  status?: string;
  notes?: string | null;
};

export function createSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: CreateRateInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_rate");
  if ("error" in auth) return auth;

  const rateCode = (input.rateCode ?? "").trim().toUpperCase();
  if (!RATE_CODE_PATTERN.test(rateCode)) return { error: "invalid_request" as const, reason: "invalid_rate_code" };
  if (!input.rateName?.trim()) return { error: "invalid_request" as const, reason: "rate_name_required" };
  if (!(SUPPLIER_RATE_TYPES as readonly string[]).includes(input.rateType)) {
    return { error: "invalid_request" as const, reason: "invalid_rate_type" };
  }
  if (typeof input.amount !== "number" || Number.isNaN(input.amount) || input.amount < 0) {
    return { error: "invalid_request" as const, reason: "invalid_amount" };
  }
  const currency = (input.currency ?? "").trim().toUpperCase();
  if (!ISO_CURRENCY_PATTERN.test(currency)) return { error: "invalid_request" as const, reason: "invalid_currency" };
  if (!ISO_DATE_PATTERN.test(input.validFrom ?? "") || !ISO_DATE_PATTERN.test(input.validTo ?? "")) {
    return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
  }
  const status = input.status?.trim() || "draft";
  if (!(SUPPLIER_RATE_STATUSES as readonly string[]).includes(status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  const duplicate = store.supRates.some(
    (r) => r.tenantId === principal.tenantId && r.supplierId === supplierId && !r.archivedAt && r.rateCode === rateCode,
  );
  if (duplicate) return { error: "conflict" as const, reason: "rate_code_exists" };

  const now = new Date().toISOString();
  const rate: SupRate = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    rateCode,
    rateName: input.rateName.trim(),
    rateType: input.rateType,
    ...(input.unitDescription?.trim() ? { unitDescription: input.unitDescription.trim() } : {}),
    amount: input.amount,
    currency,
    validFrom: input.validFrom,
    validTo: input.validTo,
    ...(input.seasonLabel?.trim() ? { seasonLabel: input.seasonLabel.trim() } : {}),
    includesTax: input.includesTax ?? false,
    ...(input.taxPercent !== undefined ? { taxPercent: input.taxPercent } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    status,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.supRates.push(rate);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    rateCode: rate.rateCode,
    eventType: SUPPLIER_EVENT_TYPES.RATE_CREATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}

export function updateSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  input: UpdateRateInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_rate");
  if ("error" in auth) return auth;

  const rate = store.supRates.find(
    (r) => r.id === rateId && r.supplierId === supplierId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rate) return { error: "not_found" as const };

  if (input.rateName !== undefined) {
    if (!input.rateName.trim()) return { error: "invalid_request" as const, reason: "rate_name_required" };
    rate.rateName = input.rateName.trim();
  }
  if (input.rateType !== undefined) {
    if (!(SUPPLIER_RATE_TYPES as readonly string[]).includes(input.rateType)) {
      return { error: "invalid_request" as const, reason: "invalid_rate_type" };
    }
    rate.rateType = input.rateType;
  }
  if (input.amount !== undefined) {
    if (Number.isNaN(input.amount) || input.amount < 0) {
      return { error: "invalid_request" as const, reason: "invalid_amount" };
    }
    rate.amount = input.amount;
  }
  if (input.currency !== undefined) {
    const currency = input.currency.trim().toUpperCase();
    if (!ISO_CURRENCY_PATTERN.test(currency)) return { error: "invalid_request" as const, reason: "invalid_currency" };
    rate.currency = currency;
  }
  if (input.validFrom !== undefined) {
    if (!ISO_DATE_PATTERN.test(input.validFrom)) return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
    rate.validFrom = input.validFrom;
  }
  if (input.validTo !== undefined) {
    if (!ISO_DATE_PATTERN.test(input.validTo)) return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
    rate.validTo = input.validTo;
  }
  if (input.unitDescription !== undefined) {
    if (input.unitDescription === null || input.unitDescription.trim() === "") delete rate.unitDescription;
    else rate.unitDescription = input.unitDescription.trim();
  }
  if (input.seasonLabel !== undefined) {
    if (input.seasonLabel === null || input.seasonLabel.trim() === "") delete rate.seasonLabel;
    else rate.seasonLabel = input.seasonLabel.trim();
  }
  if (input.includesTax !== undefined) rate.includesTax = input.includesTax;
  if (input.taxPercent !== undefined) {
    if (input.taxPercent === null) delete rate.taxPercent;
    else rate.taxPercent = input.taxPercent;
  }
  if (input.status !== undefined) {
    if (!(SUPPLIER_RATE_STATUSES as readonly string[]).includes(input.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    rate.status = input.status;
  }
  if (input.notes !== undefined) {
    if (input.notes === null || input.notes.trim() === "") delete rate.notes;
    else rate.notes = input.notes.trim();
  }

  rate.version += 1;
  rate.updatedAt = new Date().toISOString();
  rate.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    version: rate.version,
    eventType: SUPPLIER_EVENT_TYPES.RATE_UPDATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}

export function archiveSupplierRate(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "archive:sup_rate");
  if ("error" in auth) return auth;

  const rate = store.supRates.find(
    (r) => r.id === rateId && r.supplierId === supplierId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rate) return { error: "not_found" as const };

  rate.archivedAt = new Date().toISOString();
  rate.version += 1;
  rate.updatedAt = rate.archivedAt;
  rate.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_rate", rate.id, correlationId, {
    supplierId,
    eventType: SUPPLIER_EVENT_TYPES.RATE_ARCHIVED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  return { rate: sanitizeRate(rate) };
}
