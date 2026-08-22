import {
  authorize,
  clearanceAllows,
  normalizeSupplierCode,
  newId,
  SUPPLIER_CATEGORIES,
  SUPPLIER_EVENT_TYPES,
  SUPPLIER_STATUSES,
  type Classification,
  type Principal,
  type SupplierCategory,
  type SupSupplier,
  type SupSupplierStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";

const SUPPLIER_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;
const ISO_COUNTRY_PATTERN = /^[A-Z]{2}$/;
const ISO_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const CLASSIFICATIONS: Classification[] = [
  "Public",
  "Internal",
  "Confidential",
  "Restricted",
  "HighlyRestricted",
];

export function findSupplierByCode(store: Store, tenantId: string, supplierCode: string): SupSupplier | undefined {
  const normalized = normalizeSupplierCode(supplierCode);
  return store.supSuppliers.find(
    (s) => s.tenantId === tenantId && !s.archivedAt && s.supplierCode === normalized,
  );
}

function sanitizeSupplier(s: SupSupplier) {
  return {
    id: s.id,
    supplierCode: s.supplierCode,
    legalName: s.legalName,
    tradingName: s.tradingName,
    category: s.category,
    subcategory: s.subcategory,
    country: s.country,
    region: s.region,
    city: s.city,
    status: s.status,
    preferredPartner: s.preferredPartner,
    defaultCurrency: s.defaultCurrency,
    dataQualityStatus: s.dataQualityStatus,
    classification: s.classification,
    version: s.version,
    archivedAt: s.archivedAt,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export type SupplierListQuery = {
  category?: string;
  status?: string;
  country?: string;
  preferredPartner?: boolean;
  q?: string;
  archived?: boolean;
  limit?: number;
  offset?: number;
};

function filterSupplierRecords(store: Store, tenantId: string, query: SupplierListQuery): SupSupplier[] {
  let items = store.supSuppliers.filter((s) => {
    if (s.tenantId !== tenantId) return false;
    return query.archived ? Boolean(s.archivedAt) : !s.archivedAt;
  });

  if (query.category) items = items.filter((s) => s.category === query.category);
  if (query.status) items = items.filter((s) => s.status === query.status);
  if (query.country) items = items.filter((s) => s.country.toUpperCase() === query.country!.toUpperCase());
  if (query.preferredPartner !== undefined) {
    items = items.filter((s) => s.preferredPartner === query.preferredPartner);
  }
  if (query.q?.trim()) {
    const q = query.q.trim().toLowerCase();
    items = items.filter(
      (s) =>
        s.legalName.toLowerCase().includes(q) ||
        s.supplierCode.toLowerCase().includes(q) ||
        (s.tradingName?.toLowerCase().includes(q) ?? false),
    );
  }
  return items;
}

function facetCounts(values: string[]): Array<{ value: string; count: number }> {
  const map = new Map<string, number>();
  for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export function listSuppliers(store: Store, principal: Principal, query: SupplierListQuery = {}) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_supplier",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const filtered = filterSupplierRecords(store, principal.tenantId, query);
  const offset = query.offset && query.offset > 0 ? query.offset : 0;
  const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 500) : undefined;
  const page = limit === undefined ? filtered : filtered.slice(offset, offset + limit);

  return {
    items: page.map(sanitizeSupplier),
    total: filtered.length,
    increment: "PG.15" as const,
  };
}

export function getSupplierFacets(store: Store, principal: Principal, query: SupplierListQuery = {}) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_supplier_facets",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const base = { ...query };
  const forCategory = filterSupplierRecords(store, principal.tenantId, { ...base, category: undefined });
  const forStatus = filterSupplierRecords(store, principal.tenantId, { ...base, status: undefined });
  const forCountry = filterSupplierRecords(store, principal.tenantId, { ...base, country: undefined });
  const forPreferred = filterSupplierRecords(store, principal.tenantId, {
    ...base,
    preferredPartner: undefined,
  });
  const total = filterSupplierRecords(store, principal.tenantId, base).length;

  return {
    facets: {
      category: facetCounts(forCategory.map((s) => s.category)),
      status: facetCounts(forStatus.map((s) => s.status)),
      country: facetCounts(forCountry.map((s) => s.country)),
      preferredPartner: facetCounts(forPreferred.map((s) => (s.preferredPartner ? "true" : "false"))),
    },
    total,
    increment: "PG.15" as const,
  };
}

export function getSupplier(store: Store, principal: Principal, id: string) {
  ensureSupplierCollections(store);
  const supplier = store.supSuppliers.find((s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_supplier",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") return { error: "not_found" as const };

  const contacts = store.supContacts.filter((c) => c.supplierId === supplier.id && !c.archivedAt);
  const rates = store.supRates.filter((r) => r.supplierId === supplier.id && !r.archivedAt);
  const contentBlocks = store.supContentBlocks.filter((b) => b.supplierId === supplier.id && !b.archivedAt);

  return {
    supplier: sanitizeSupplier(supplier),
    contacts: contacts.map((c) => ({
      id: c.id,
      contactRole: c.contactRole,
      givenName: c.givenName,
      familyName: c.familyName,
      email: c.email,
      isPrimary: c.isPrimary,
    })),
    rates: rates.map((r) => ({
      id: r.id,
      rateCode: r.rateCode,
      rateName: r.rateName,
      amount: r.amount,
      currency: r.currency,
      validFrom: r.validFrom,
      validTo: r.validTo,
      ...(r.seasonLabel ? { seasonLabel: r.seasonLabel } : {}),
      status: r.status,
    })),
    contentBlocks: contentBlocks.map((b) => ({
      id: b.id,
      blockCode: b.blockCode,
      blockType: b.blockType,
      title: b.title,
      status: b.status,
    })),
  };
}

export type CreateSupplierInput = {
  supplierCode: string;
  legalName: string;
  tradingName?: string;
  category: string;
  subcategory?: string;
  country: string;
  region?: string;
  city?: string;
  address?: string;
  telephone?: string;
  email?: string;
  website?: string;
  status?: string;
  preferredPartner?: boolean;
  paymentTermsDays?: number;
  defaultCurrency?: string;
  taxRegistrationNumber?: string;
  contractRef?: string;
  notes?: string;
  classification?: string;
};

export type UpdateSupplierInput = {
  legalName?: string;
  tradingName?: string | null;
  category?: string;
  subcategory?: string | null;
  country?: string;
  region?: string | null;
  city?: string | null;
  address?: string | null;
  telephone?: string | null;
  email?: string | null;
  website?: string | null;
  status?: string;
  preferredPartner?: boolean;
  paymentTermsDays?: number | null;
  defaultCurrency?: string | null;
  taxRegistrationNumber?: string | null;
  contractRef?: string | null;
  notes?: string | null;
  classification?: string;
};

function parseClassification(value: string | undefined, fallback: Classification): Classification | { error: string } {
  if (value === undefined || value.trim() === "") return fallback;
  if (!(CLASSIFICATIONS as string[]).includes(value)) return { error: "invalid_classification" };
  return value as Classification;
}

function validateCreateInput(input: CreateSupplierInput):
  | {
      ok: true;
      code: string;
      category: SupplierCategory;
      status: SupSupplierStatus;
      country: string;
      classification: Classification;
    }
  | { ok: false; reason: string } {
  const code = normalizeSupplierCode(input.supplierCode ?? "");
  if (!SUPPLIER_CODE_PATTERN.test(code)) return { ok: false, reason: "invalid_supplier_code" };
  if (!input.legalName?.trim()) return { ok: false, reason: "legal_name_required" };
  if (!(SUPPLIER_CATEGORIES as readonly string[]).includes(input.category)) {
    return { ok: false, reason: "invalid_category" };
  }
  const country = (input.country ?? "").trim().toUpperCase();
  if (!ISO_COUNTRY_PATTERN.test(country)) return { ok: false, reason: "invalid_country" };
  const status = (input.status?.trim() || "pending_review") as string;
  if (!(SUPPLIER_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, reason: "invalid_status" };
  }
  if (input.defaultCurrency && !ISO_CURRENCY_PATTERN.test(input.defaultCurrency.trim().toUpperCase())) {
    return { ok: false, reason: "invalid_currency" };
  }
  const classification = parseClassification(input.classification, "Confidential");
  if (typeof classification === "object" && "error" in classification) {
    return { ok: false, reason: classification.error };
  }
  return {
    ok: true,
    code,
    category: input.category as SupplierCategory,
    status: status as SupSupplierStatus,
    country,
    classification,
  };
}

export function createSupplier(
  store: Store,
  principal: Principal,
  input: CreateSupplierInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);

  const validated = validateCreateInput(input);
  if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "write:sup_supplier",
    resource: {
      tenantId: principal.tenantId,
      type: "supplier",
      id: "new",
      classification: validated.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!clearanceAllows(principal.classificationClearance, validated.classification)) {
    return { error: "forbidden" as const, reason: "classification_denied" };
  }

  if (findSupplierByCode(store, principal.tenantId, validated.code)) {
    return { error: "conflict" as const, reason: "supplier_code_exists" };
  }

  const now = new Date().toISOString();
  const supplier: SupSupplier = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierCode: validated.code,
    legalName: input.legalName.trim(),
    ...(input.tradingName?.trim() ? { tradingName: input.tradingName.trim() } : {}),
    category: validated.category,
    ...(input.subcategory?.trim() ? { subcategory: input.subcategory.trim() } : {}),
    country: validated.country,
    ...(input.region?.trim() ? { region: input.region.trim() } : {}),
    ...(input.city?.trim() ? { city: input.city.trim() } : {}),
    ...(input.address?.trim() ? { address: input.address.trim() } : {}),
    ...(input.telephone?.trim() ? { telephone: input.telephone.trim() } : {}),
    ...(input.email?.trim() ? { email: input.email.trim() } : {}),
    ...(input.website?.trim() ? { website: input.website.trim() } : {}),
    status: validated.status,
    preferredPartner: input.preferredPartner ?? false,
    ...(input.paymentTermsDays !== undefined ? { paymentTermsDays: input.paymentTermsDays } : {}),
    ...(input.defaultCurrency?.trim()
      ? { defaultCurrency: input.defaultCurrency.trim().toUpperCase() }
      : {}),
    ...(input.taxRegistrationNumber?.trim()
      ? { taxRegistrationNumber: input.taxRegistrationNumber.trim() }
      : {}),
    ...(input.contractRef?.trim() ? { contractRef: input.contractRef.trim() } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    dataQualityStatus: "Unverified",
    classification: validated.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.supSuppliers.push(supplier);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", supplier.id, correlationId, {
    supplierCode: supplier.supplierCode,
    status: supplier.status,
    eventType: SUPPLIER_EVENT_TYPES.SUPPLIER_CREATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier", supplier.id);

  return { supplier: sanitizeSupplier(supplier) };
}

export function updateSupplier(
  store: Store,
  principal: Principal,
  id: string,
  input: UpdateSupplierInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const supplier = store.supSuppliers.find((s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt);
  if (!supplier) return { error: "not_found" as const };

  const nextClassification =
    input.classification !== undefined
      ? parseClassification(input.classification, supplier.classification)
      : supplier.classification;
  if (typeof nextClassification === "object" && "error" in nextClassification) {
    return { error: "invalid_request" as const, reason: nextClassification.error };
  }

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "write:sup_supplier",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: nextClassification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!clearanceAllows(principal.classificationClearance, nextClassification)) {
    return { error: "forbidden" as const, reason: "classification_denied" };
  }

  if (input.legalName !== undefined) {
    if (!input.legalName.trim()) return { error: "invalid_request" as const, reason: "legal_name_required" };
    supplier.legalName = input.legalName.trim();
  }
  if (input.tradingName !== undefined) {
    if (input.tradingName === null || input.tradingName.trim() === "") delete supplier.tradingName;
    else supplier.tradingName = input.tradingName.trim();
  }
  if (input.category !== undefined) {
    if (!(SUPPLIER_CATEGORIES as readonly string[]).includes(input.category)) {
      return { error: "invalid_request" as const, reason: "invalid_category" };
    }
    supplier.category = input.category as SupplierCategory;
  }
  if (input.subcategory !== undefined) {
    if (input.subcategory === null || input.subcategory.trim() === "") delete supplier.subcategory;
    else supplier.subcategory = input.subcategory.trim();
  }
  if (input.country !== undefined) {
    const country = input.country.trim().toUpperCase();
    if (!ISO_COUNTRY_PATTERN.test(country)) return { error: "invalid_request" as const, reason: "invalid_country" };
    supplier.country = country;
  }
  if (input.region !== undefined) {
    if (input.region === null || input.region.trim() === "") delete supplier.region;
    else supplier.region = input.region.trim();
  }
  if (input.city !== undefined) {
    if (input.city === null || input.city.trim() === "") delete supplier.city;
    else supplier.city = input.city.trim();
  }
  if (input.address !== undefined) {
    if (input.address === null || input.address.trim() === "") delete supplier.address;
    else supplier.address = input.address.trim();
  }
  if (input.telephone !== undefined) {
    if (input.telephone === null || input.telephone.trim() === "") delete supplier.telephone;
    else supplier.telephone = input.telephone.trim();
  }
  if (input.email !== undefined) {
    if (input.email === null || input.email.trim() === "") delete supplier.email;
    else supplier.email = input.email.trim();
  }
  if (input.website !== undefined) {
    if (input.website === null || input.website.trim() === "") delete supplier.website;
    else supplier.website = input.website.trim();
  }
  if (input.status !== undefined) {
    if (!(SUPPLIER_STATUSES as readonly string[]).includes(input.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    supplier.status = input.status as SupSupplierStatus;
  }
  if (input.preferredPartner !== undefined) supplier.preferredPartner = input.preferredPartner;
  if (input.paymentTermsDays !== undefined) {
    if (input.paymentTermsDays === null) delete supplier.paymentTermsDays;
    else supplier.paymentTermsDays = input.paymentTermsDays;
  }
  if (input.defaultCurrency !== undefined) {
    if (input.defaultCurrency === null || input.defaultCurrency.trim() === "") {
      delete supplier.defaultCurrency;
    } else {
      const currency = input.defaultCurrency.trim().toUpperCase();
      if (!ISO_CURRENCY_PATTERN.test(currency)) {
        return { error: "invalid_request" as const, reason: "invalid_currency" };
      }
      supplier.defaultCurrency = currency;
    }
  }
  if (input.taxRegistrationNumber !== undefined) {
    if (input.taxRegistrationNumber === null || input.taxRegistrationNumber.trim() === "") {
      delete supplier.taxRegistrationNumber;
    } else supplier.taxRegistrationNumber = input.taxRegistrationNumber.trim();
  }
  if (input.contractRef !== undefined) {
    if (input.contractRef === null || input.contractRef.trim() === "") delete supplier.contractRef;
    else supplier.contractRef = input.contractRef.trim();
  }
  if (input.notes !== undefined) {
    if (input.notes === null || input.notes.trim() === "") delete supplier.notes;
    else supplier.notes = input.notes.trim();
  }
  supplier.classification = nextClassification;
  supplier.version += 1;
  supplier.updatedAt = new Date().toISOString();
  supplier.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", supplier.id, correlationId, {
    supplierCode: supplier.supplierCode,
    status: supplier.status,
    version: supplier.version,
    eventType: SUPPLIER_EVENT_TYPES.SUPPLIER_UPDATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier", supplier.id);

  return { supplier: sanitizeSupplier(supplier) };
}

export function archiveSupplier(store: Store, principal: Principal, id: string, correlationId: string) {
  ensureSupplierCollections(store);
  const supplier = store.supSuppliers.find((s) => s.id === id && s.tenantId === principal.tenantId && !s.archivedAt);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "archive:sup_supplier",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(
      store,
      principal,
      "supplier:write:supplier",
      "sup_supplier",
      correlationId,
      decision.reason,
      id,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  supplier.archivedAt = now;
  supplier.status = "inactive";
  supplier.dataQualityStatus = "Archived";
  supplier.version += 1;
  supplier.updatedAt = now;
  supplier.updatedByPrincipalId = principal.id;

  let cascadedContacts = 0;
  let cascadedRates = 0;
  let cascadedContentBlocks = 0;

  for (const contact of store.supContacts) {
    if (contact.supplierId !== supplier.id || contact.tenantId !== principal.tenantId || contact.archivedAt) continue;
    contact.archivedAt = now;
    contact.version += 1;
    contact.updatedAt = now;
    contact.updatedByPrincipalId = principal.id;
    cascadedContacts += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_contact", contact.id);
  }
  for (const rate of store.supRates) {
    if (rate.supplierId !== supplier.id || rate.tenantId !== principal.tenantId || rate.archivedAt) continue;
    rate.archivedAt = now;
    rate.version += 1;
    rate.updatedAt = now;
    rate.updatedByPrincipalId = principal.id;
    cascadedRates += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  }
  for (const block of store.supContentBlocks) {
    if (block.supplierId !== supplier.id || block.tenantId !== principal.tenantId || block.archivedAt) continue;
    block.archivedAt = now;
    block.version += 1;
    block.updatedAt = now;
    block.updatedByPrincipalId = principal.id;
    cascadedContentBlocks += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_content_block", block.id);
  }

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", supplier.id, correlationId, {
    supplierCode: supplier.supplierCode,
    eventType: SUPPLIER_EVENT_TYPES.SUPPLIER_ARCHIVED,
    cascadedContacts,
    cascadedRates,
    cascadedContentBlocks,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier", supplier.id);

  return {
    supplier: sanitizeSupplier(supplier),
    cascaded: {
      contacts: cascadedContacts,
      rates: cascadedRates,
      contentBlocks: cascadedContentBlocks,
    },
  };
}

export function restoreSupplier(store: Store, principal: Principal, id: string, correlationId: string) {
  ensureSupplierCollections(store);
  const supplier = store.supSuppliers.find((s) => s.id === id && s.tenantId === principal.tenantId && s.archivedAt);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "restore:sup_supplier",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(
      store,
      principal,
      "supplier:write:supplier",
      "sup_supplier",
      correlationId,
      decision.reason,
      id,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (findSupplierByCode(store, principal.tenantId, supplier.supplierCode)) {
    return { error: "conflict" as const, reason: "supplier_code_exists" };
  }

  const archivedAt = supplier.archivedAt;
  const now = new Date().toISOString();
  delete supplier.archivedAt;
  supplier.status = "draft";
  supplier.dataQualityStatus = "NeedsReview";
  supplier.version += 1;
  supplier.updatedAt = now;
  supplier.updatedByPrincipalId = principal.id;

  let restoredContacts = 0;
  let restoredRates = 0;
  let restoredContentBlocks = 0;

  for (const contact of store.supContacts) {
    if (contact.supplierId !== supplier.id || contact.tenantId !== principal.tenantId || !contact.archivedAt) continue;
    if (archivedAt && contact.archivedAt !== archivedAt) continue;
    delete contact.archivedAt;
    contact.version += 1;
    contact.updatedAt = now;
    contact.updatedByPrincipalId = principal.id;
    restoredContacts += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_contact", contact.id);
  }
  for (const rate of store.supRates) {
    if (rate.supplierId !== supplier.id || rate.tenantId !== principal.tenantId || !rate.archivedAt) continue;
    if (archivedAt && rate.archivedAt !== archivedAt) continue;
    delete rate.archivedAt;
    rate.version += 1;
    rate.updatedAt = now;
    rate.updatedByPrincipalId = principal.id;
    restoredRates += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_rate", rate.id);
  }
  for (const block of store.supContentBlocks) {
    if (block.supplierId !== supplier.id || block.tenantId !== principal.tenantId || !block.archivedAt) continue;
    if (archivedAt && block.archivedAt !== archivedAt) continue;
    delete block.archivedAt;
    block.version += 1;
    block.updatedAt = now;
    block.updatedByPrincipalId = principal.id;
    restoredContentBlocks += 1;
    void persistSupEntityAfterCommit(store.dbPool, store, "supplier_content_block", block.id);
  }

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_supplier", supplier.id, correlationId, {
    supplierCode: supplier.supplierCode,
    eventType: SUPPLIER_EVENT_TYPES.SUPPLIER_RESTORED,
    restoredContacts,
    restoredRates,
    restoredContentBlocks,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier", supplier.id);

  return {
    supplier: sanitizeSupplier(supplier),
    restored: {
      contacts: restoredContacts,
      rates: restoredRates,
      contentBlocks: restoredContentBlocks,
    },
  };
}

export function getSupplierModuleHealth(store: Store) {
  ensureSupplierCollections(store);
  return {
    module: "supplier",
    status: "ok" as const,
    increment: "PG.15",
    suppliers: store.supSuppliers.filter((s) => !s.archivedAt).length,
    archivedSuppliers: store.supSuppliers.filter((s) => Boolean(s.archivedAt)).length,
    importBatches: store.supImportBatches.length,
    contacts: store.supContacts.filter((c) => !c.archivedAt).length,
    rates: store.supRates.filter((r) => !r.archivedAt).length,
    contentBlocks: store.supContentBlocks.filter((b) => !b.archivedAt).length,
  };
}

export function listSupplierCategories() {
  return {
    items: [...SUPPLIER_CATEGORIES],
  };
}
