import {
  authorize,
  canMutateSupplierContract,
  isValidSupContractStatus,
  isValidSupContractType,
  newId,
  type Principal,
  type SupContract,
  type SupContractVersion,
  type SupHotelProfile,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCdAudit, denyCdAudit } from "../commercial-documents/audit.js";
import { ensureSupplierContractCollections } from "../commercial-documents/collections.js";
import { uploadCommercialDocument } from "../commercial-documents/service.js";
import { LocalFsDocumentStorage } from "../commercial-documents/storage.js";

function sanitizeContract(c: SupContract) {
  return {
    id: c.id,
    supplierId: c.supplierId,
    contractRef: c.contractRef,
    contractType: c.contractType,
    status: c.status,
    effectiveFrom: c.effectiveFrom,
    effectiveTo: c.effectiveTo,
    currency: c.currency,
    notes: c.notes,
    currentVersion: c.currentVersion,
    classification: c.classification,
    version: c.version,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

function sanitizeVersion(v: SupContractVersion) {
  return {
    id: v.id,
    contractId: v.contractId,
    versionNumber: v.versionNumber,
    summary: v.summary,
    ...(v.documentId ? { documentId: v.documentId } : {}),
    createdAt: v.createdAt,
    createdByPrincipalId: v.createdByPrincipalId,
  };
}

function sanitizeHotel(h: SupHotelProfile) {
  return {
    id: h.id,
    supplierId: h.supplierId,
    propertyName: h.propertyName,
    starRating: h.starRating,
    roomCategories: h.roomCategories,
    mealPlans: h.mealPlans,
    destinationLabel: h.destinationLabel,
    latitude: h.latitude,
    longitude: h.longitude,
    notes: h.notes,
    status: h.status,
    version: h.version,
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
  };
}

function findSupplier(store: Store, tenantId: string, supplierId: string) {
  return store.supSuppliers.find((s) => s.id === supplierId && s.tenantId === tenantId && !s.archivedAt);
}

export type CreateContractInput = {
  contractRef: string;
  contractType?: string;
  status?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  currency?: string;
  notes?: string;
  initialVersionSummary?: string;
};

export function createSupplierContract(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: CreateContractInput,
  correlationId: string,
) {
  ensureSupplierContractCollections(store);
  const human = canMutateSupplierContract(principal.actorType);
  if (!human.allowed) {
    denyCdAudit(store, principal, "supplier:write:contract", "sup_contract", correlationId, human.reason);
    return { error: "forbidden" as const, reason: human.reason };
  }
  const decision = authorize({
    principal,
    permission: "supplier:write:contract",
    action: "create:sup_contract",
  });
  if (decision.result === "deny") {
    denyCdAudit(store, principal, "supplier:write:contract", "sup_contract", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const supplier = findSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };

  const contractRef = input.contractRef?.trim();
  if (!contractRef) return { error: "invalid" as const, reason: "contract_ref_required" };
  const contractType = input.contractType ?? "rate_agreement";
  if (!isValidSupContractType(contractType)) return { error: "invalid" as const, reason: "invalid_contract_type" };
  const status = input.status ?? "draft";
  if (!isValidSupContractStatus(status)) return { error: "invalid" as const, reason: "invalid_status" };
  if (
    store.supContracts.some(
      (c) => c.tenantId === principal.tenantId && c.supplierId === supplierId && c.contractRef === contractRef && !c.archivedAt,
    )
  ) {
    return { error: "conflict" as const, reason: "duplicate_contract_ref" };
  }

  const now = new Date().toISOString();
  const contract: SupContract = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    contractRef,
    contractType,
    status,
    ...(input.effectiveFrom ? { effectiveFrom: input.effectiveFrom } : {}),
    ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
    ...(input.currency ? { currency: input.currency } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    currentVersion: 1,
    classification: supplier.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const version: SupContractVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    contractId: contract.id,
    versionNumber: 1,
    summary: input.initialVersionSummary?.trim() || "Initial contract version",
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  store.supContracts.push(contract);
  store.supContractVersions.push(version);
  allowCdAudit(store, principal, "supplier:write:contract", "sup_contract", contract.id, correlationId, sanitizeContract(contract));
  return { contract: sanitizeContract(contract), version: sanitizeVersion(version) };
}

export function listSupplierContracts(store: Store, principal: Principal, supplierId: string) {
  ensureSupplierContractCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:contract",
    action: "list:sup_contract",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!findSupplier(store, principal.tenantId, supplierId)) return { error: "not_found" as const };
  const items = store.supContracts
    .filter((c) => c.tenantId === principal.tenantId && c.supplierId === supplierId && !c.archivedAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map(sanitizeContract);
  return { items };
}

export function getSupplierContract(store: Store, principal: Principal, supplierId: string, contractId: string) {
  ensureSupplierContractCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:contract",
    action: "get:sup_contract",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const contract = store.supContracts.find(
    (c) => c.id === contractId && c.supplierId === supplierId && c.tenantId === principal.tenantId && !c.archivedAt,
  );
  if (!contract) return { error: "not_found" as const };
  const versions = store.supContractVersions
    .filter((v) => v.contractId === contract.id && v.tenantId === principal.tenantId)
    .sort((a, b) => b.versionNumber - a.versionNumber)
    .map(sanitizeVersion);
  return { contract: sanitizeContract(contract), versions };
}

export function createContractVersion(
  store: Store,
  principal: Principal,
  supplierId: string,
  contractId: string,
  input: { summary: string; documentId?: string },
  correlationId: string,
) {
  ensureSupplierContractCollections(store);
  const human = canMutateSupplierContract(principal.actorType);
  if (!human.allowed) {
    denyCdAudit(store, principal, "supplier:write:contract", "sup_contract_version", correlationId, human.reason);
    return { error: "forbidden" as const, reason: human.reason };
  }
  const decision = authorize({
    principal,
    permission: "supplier:write:contract",
    action: "create:sup_contract_version",
  });
  if (decision.result === "deny") {
    denyCdAudit(store, principal, "supplier:write:contract", "sup_contract_version", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const contract = store.supContracts.find(
    (c) => c.id === contractId && c.supplierId === supplierId && c.tenantId === principal.tenantId && !c.archivedAt,
  );
  if (!contract) return { error: "not_found" as const };
  const summary = input.summary?.trim();
  if (!summary) return { error: "invalid" as const, reason: "summary_required" };
  if (input.documentId) {
    const doc = store.commercialDocuments.find(
      (d) => d.id === input.documentId && d.tenantId === principal.tenantId && d.status === "active",
    );
    if (!doc) return { error: "invalid" as const, reason: "invalid_document" };
  }
  const now = new Date().toISOString();
  const versionNumber = contract.currentVersion + 1;
  const version: SupContractVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    contractId: contract.id,
    versionNumber,
    summary,
    ...(input.documentId ? { documentId: input.documentId } : {}),
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  store.supContractVersions.push(version);
  contract.currentVersion = versionNumber;
  contract.updatedAt = now;
  contract.updatedByPrincipalId = principal.id;
  contract.version += 1;
  allowCdAudit(store, principal, "supplier:write:contract", "sup_contract_version", version.id, correlationId, sanitizeVersion(version));
  return { version: sanitizeVersion(version), contract: sanitizeContract(contract) };
}

export async function attachContractDocument(
  store: Store,
  principal: Principal,
  supplierId: string,
  contractId: string,
  input: { filename: string; mimeType: string; contentBase64: string },
  correlationId: string,
) {
  const contract = store.supContracts.find(
    (c) => c.id === contractId && c.supplierId === supplierId && c.tenantId === principal.tenantId && !c.archivedAt,
  );
  if (!contract) return { error: "not_found" as const };
  const uploaded = await uploadCommercialDocument(
    store,
    principal,
    {
      ...input,
      kind: "contract",
      supplierId,
      contractId,
    },
    correlationId,
  );
  if ("error" in uploaded) return uploaded;
  const versioned = createContractVersion(
    store,
    principal,
    supplierId,
    contractId,
    { summary: `Document ${input.filename}`, documentId: uploaded.document.id },
    correlationId,
  );
  if ("error" in versioned) {
    const idx = store.commercialDocuments.findIndex(
      (d) => d.id === uploaded.document.id && d.tenantId === principal.tenantId,
    );
    if (idx >= 0) {
      const orphan = store.commercialDocuments[idx];
      store.commercialDocuments.splice(idx, 1);
      const storage = store.documentStorage;
      if (orphan && storage instanceof LocalFsDocumentStorage) {
        await storage.delete(orphan.storageRef);
      }
    }
    return versioned;
  }
  return { document: uploaded.document, ...versioned };
}

export type UpsertHotelProfileInput = {
  propertyName?: string;
  starRating?: number;
  roomCategories?: string[];
  mealPlans?: string[];
  destinationLabel?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status?: "active" | "inactive";
};

export function upsertHotelProfile(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: UpsertHotelProfileInput,
  correlationId: string,
) {
  ensureSupplierContractCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "upsert:sup_hotel_profile",
  });
  if (decision.result === "deny") {
    denyCdAudit(store, principal, "supplier:write:supplier", "sup_hotel_profile", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const supplier = findSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };
  if (supplier.category !== "accommodation") {
    return { error: "invalid" as const, reason: "supplier_not_accommodation" };
  }
  if (input.starRating !== undefined && (input.starRating < 1 || input.starRating > 5)) {
    return { error: "invalid" as const, reason: "invalid_star_rating" };
  }

  const now = new Date().toISOString();
  const existing = store.supHotelProfiles.find(
    (h) => h.tenantId === principal.tenantId && h.supplierId === supplierId,
  );
  if (existing) {
    if (input.propertyName !== undefined) {
      const propertyName = input.propertyName.trim();
      if (propertyName) existing.propertyName = propertyName;
      else delete existing.propertyName;
    }
    if (input.starRating !== undefined) existing.starRating = input.starRating;
    if (input.roomCategories !== undefined) existing.roomCategories = input.roomCategories.map((s) => s.trim()).filter(Boolean);
    if (input.mealPlans !== undefined) existing.mealPlans = input.mealPlans.map((s) => s.trim()).filter(Boolean);
    if (input.destinationLabel !== undefined) {
      const destinationLabel = input.destinationLabel.trim();
      if (destinationLabel) existing.destinationLabel = destinationLabel;
      else delete existing.destinationLabel;
    }
    if (input.latitude !== undefined) existing.latitude = input.latitude;
    if (input.longitude !== undefined) existing.longitude = input.longitude;
    if (input.notes !== undefined) {
      const notes = input.notes.trim();
      if (notes) existing.notes = notes;
      else delete existing.notes;
    }
    if (input.status !== undefined) existing.status = input.status;
    existing.updatedAt = now;
    existing.updatedByPrincipalId = principal.id;
    existing.version += 1;
    allowCdAudit(store, principal, "supplier:write:supplier", "sup_hotel_profile", existing.id, correlationId, sanitizeHotel(existing));
    return { hotelProfile: sanitizeHotel(existing) };
  }

  const profile: SupHotelProfile = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    ...(input.propertyName ? { propertyName: input.propertyName.trim() } : { propertyName: supplier.tradingName ?? supplier.legalName }),
    ...(input.starRating !== undefined ? { starRating: input.starRating } : {}),
    roomCategories: (input.roomCategories ?? []).map((s) => s.trim()).filter(Boolean),
    mealPlans: (input.mealPlans ?? []).map((s) => s.trim()).filter(Boolean),
    ...(input.destinationLabel ? { destinationLabel: input.destinationLabel.trim() } : {}),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.notes ? { notes: input.notes.trim() } : {}),
    status: input.status ?? "active",
    classification: supplier.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.supHotelProfiles.push(profile);
  allowCdAudit(store, principal, "supplier:write:supplier", "sup_hotel_profile", profile.id, correlationId, sanitizeHotel(profile));
  return { hotelProfile: sanitizeHotel(profile) };
}

export function getHotelProfile(store: Store, principal: Principal, supplierId: string) {
  ensureSupplierContractCollections(store);
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "get:sup_hotel_profile",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!findSupplier(store, principal.tenantId, supplierId)) return { error: "not_found" as const };
  const profile = store.supHotelProfiles.find(
    (h) => h.tenantId === principal.tenantId && h.supplierId === supplierId,
  );
  if (!profile) return { error: "not_found" as const, reason: "hotel_profile_absent" };
  return { hotelProfile: sanitizeHotel(profile) };
}
