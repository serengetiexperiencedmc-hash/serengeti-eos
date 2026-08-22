import { authorize, type Principal, type SupSupplier } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureSupplierCollections } from "./collections.js";

export function findSupplierByCode(store: Store, tenantId: string, supplierCode: string): SupSupplier | undefined {
  const normalized = supplierCode.trim().toUpperCase();
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
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export function listSuppliers(
  store: Store,
  principal: Principal,
  query: { category?: string; status?: string; q?: string },
) {
  ensureSupplierCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_supplier",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  let items = store.supSuppliers.filter((s) => s.tenantId === principal.tenantId && !s.archivedAt);

  if (query.category) {
    items = items.filter((s) => s.category === query.category);
  }
  if (query.status) {
    items = items.filter((s) => s.status === query.status);
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

  return { items: items.map(sanitizeSupplier) };
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

export function getSupplierModuleHealth(store: Store) {
  ensureSupplierCollections(store);
  return {
    module: "supplier",
    status: "ok" as const,
    suppliers: store.supSuppliers.length,
    importBatches: store.supImportBatches.length,
  };
}

export function listSupplierCategories() {
  return {
    items: [
      "accommodation",
      "vehicle_hire",
      "excursion",
      "av_entertainment",
      "decor",
      "catering",
      "venue",
      "guide_staff",
      "air_charter",
      "miscellaneous",
    ],
  };
}
