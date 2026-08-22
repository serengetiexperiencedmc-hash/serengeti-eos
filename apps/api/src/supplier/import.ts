import {
  authorize,
  clearanceAllows,
  isAllowedSupplierImportHeader,
  isValidSupplierImportEntityType,
  newId,
  parseCsv,
  requiredSupplierImportHeaders,
  SUPPLIER_EVENT_TYPES,
  supplierImportRowDuplicateKey,
  validateSupplierImportRowByEntityType,
  type Principal,
  type SupImportBatch,
  type SupImportRowResult,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { findSupplierByCode } from "./supplier.js";

function importExecuteKey(tenantId: string, batchId: string, key: string): string {
  return `${tenantId}:${batchId}:${key}`;
}

function findBatch(store: Store, tenantId: string, batchId: string): SupImportBatch | undefined {
  const batch = store.supImportBatches.find((b) => b.id === batchId);
  if (!batch || batch.tenantId !== tenantId) return undefined;
  return batch;
}

export type CreateSupplierImportInput = {
  sourceSystem: string;
  entityType: string;
  csv: string;
  mode?: "create_only" | "upsert";
};

function sanitizeBatch(batch: SupImportBatch) {
  return {
    id: batch.id,
    sourceSystem: batch.sourceSystem,
    entityType: batch.entityType,
    mode: batch.mode,
    status: batch.status,
    rowCount: batch.rowCount,
    validCount: batch.validCount,
    invalidCount: batch.invalidCount,
    committedCount: batch.committedCount,
    validationResults: batch.validationResults,
    createdAt: batch.createdAt,
    validatedAt: batch.validatedAt,
    committedAt: batch.committedAt,
    createdByPrincipalId: batch.createdByPrincipalId,
    committedByPrincipalId: batch.committedByPrincipalId,
  };
}

export function createSupplierImportBatch(
  store: Store,
  principal: Principal,
  input: CreateSupplierImportInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);

  const decision = authorize({
    principal,
    permission: "supplier:import:bulk",
    action: "create:sup_import_batch",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidSupplierImportEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }
  const sourceSystem = input.sourceSystem?.trim();
  if (!sourceSystem) return { error: "invalid_request" as const, reason: "source_system_required" };
  if (!input.csv?.trim()) return { error: "invalid_request" as const, reason: "csv_required" };

  const parsed = parseCsv(input.csv);
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };

  for (const header of requiredSupplierImportHeaders(input.entityType)) {
    if (!parsed.headers.includes(header)) {
      return { error: "invalid_request" as const, reason: `missing_required_column:${header}` };
    }
  }

  const unsupported = parsed.headers.filter((h) => !isAllowedSupplierImportHeader(input.entityType, h));
  if (unsupported.length > 0) {
    return { error: "invalid_request" as const, reason: "unsupported_column" };
  }

  const batch: SupImportBatch = {
    id: newId(),
    tenantId: principal.tenantId,
    sourceSystem,
    entityType: input.entityType,
    mode: input.mode ?? "create_only",
    status: "pending",
    rowCount: parsed.rows.length,
    csvContent: input.csv,
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };

  store.supImportBatches.push(batch);
  allowSupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", batch.id, correlationId, {
    id: batch.id,
    entityType: batch.entityType,
    rowCount: batch.rowCount,
    sourceSystem: batch.sourceSystem,
  });

  return { batch: sanitizeBatch(batch) };
}

function validateBatchRows(store: Store, batch: SupImportBatch): SupImportRowResult[] {
  const parsed = parseCsv(batch.csvContent);
  if ("error" in parsed) return [];

  const results: SupImportRowResult[] = [];
  const seenKeys = new Set<string>();

  for (let i = 0; i < parsed.rows.length; i++) {
    const rowNumber = i + 1;
    const row = parsed.rows[i]!;
    const validated = validateSupplierImportRowByEntityType(batch.entityType, row);
    if ("errors" in validated) {
      results.push({ rowNumber, status: "invalid", errors: validated.errors });
      continue;
    }

    const dupKey = supplierImportRowDuplicateKey(batch.entityType, validated);
    if (seenKeys.has(dupKey)) {
      results.push({ rowNumber, status: "invalid", errors: ["duplicate_row_in_import"] });
      continue;
    }
    seenKeys.add(dupKey);

    const conflict = existingRecordConflict(store, batch, validated);
    if (conflict) {
      results.push({ rowNumber, status: "invalid", errors: [conflict] });
      continue;
    }

    const missingRef = missingSupplierReference(store, batch, validated);
    if (missingRef) {
      results.push({ rowNumber, status: "invalid", errors: [missingRef] });
      continue;
    }

    results.push({ rowNumber, status: "valid" });
  }

  return results;
}

function existingRecordConflict(
  store: Store,
  batch: SupImportBatch,
  row: ReturnType<typeof validateSupplierImportRowByEntityType>,
): string | undefined {
  if ("errors" in row) return undefined;

  if (batch.entityType === "supplier") {
    const supplierRow = row as { supplierCode: string };
    const exists = store.supSuppliers.some(
      (s) =>
        s.tenantId === batch.tenantId &&
        !s.archivedAt &&
        s.supplierCode === supplierRow.supplierCode,
    );
    if (exists) return "existing_record_conflict";
    return undefined;
  }

  if (batch.entityType === "supplier_contact") {
    const contactRow = row as { supplierCode: string; contactRole: string; givenName: string; familyName: string };
    const supplier = findSupplierByCode(store, batch.tenantId, contactRow.supplierCode);
    if (!supplier) return undefined;
    const exists = store.supContacts.some(
      (c) =>
        c.tenantId === batch.tenantId &&
        !c.archivedAt &&
        c.supplierId === supplier.id &&
        c.contactRole === contactRow.contactRole &&
        c.givenName === contactRow.givenName &&
        c.familyName === contactRow.familyName,
    );
    if (exists) return "existing_record_conflict";
    return undefined;
  }

  if (batch.entityType === "supplier_rate") {
    const rateRow = row as { supplierCode: string; rateCode: string };
    const supplier = findSupplierByCode(store, batch.tenantId, rateRow.supplierCode);
    if (!supplier) return undefined;
    const exists = store.supRates.some(
      (r) =>
        r.tenantId === batch.tenantId &&
        !r.archivedAt &&
        r.supplierId === supplier.id &&
        r.rateCode === rateRow.rateCode,
    );
    if (exists) return "existing_record_conflict";
    return undefined;
  }

  const blockRow = row as { supplierCode: string; blockCode: string };
  const supplier = findSupplierByCode(store, batch.tenantId, blockRow.supplierCode);
  if (!supplier) return undefined;
  const exists = store.supContentBlocks.some(
    (b) =>
      b.tenantId === batch.tenantId &&
      !b.archivedAt &&
      b.supplierId === supplier.id &&
      b.blockCode === blockRow.blockCode,
  );
  if (exists) return "existing_record_conflict";
}

function missingSupplierReference(
  store: Store,
  batch: SupImportBatch,
  row: ReturnType<typeof validateSupplierImportRowByEntityType>,
): string | undefined {
  if (batch.entityType === "supplier") return undefined;
  if ("errors" in row) return undefined;
  const supplierCode = (row as { supplierCode: string }).supplierCode;
  const supplier = findSupplierByCode(store, batch.tenantId, supplierCode);
  if (!supplier) return "supplier_not_found";
  return undefined;
}

export function validateSupplierImportBatch(
  store: Store,
  principal: Principal,
  batchId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:import:bulk",
    action: "validate:sup_import_batch",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", correlationId, decision.reason, batchId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (batch.status === "committed") return { error: "conflict" as const, reason: "import_already_committed" };

  const validationResults = validateBatchRows(store, batch);
  batch.validationResults = validationResults;
  batch.validCount = validationResults.filter((r) => r.status === "valid").length;
  batch.invalidCount = validationResults.filter((r) => r.status === "invalid").length;
  batch.validatedAt = new Date().toISOString();
  batch.status = batch.invalidCount === 0 ? "validated" : "failed";

  allowSupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", batch.id, correlationId, {
    status: batch.status,
    validCount: batch.validCount,
    invalidCount: batch.invalidCount,
  });

  return { batch: sanitizeBatch(batch) };
}

export function getSupplierImportBatch(store: Store, principal: Principal, batchId: string) {
  ensureSupplierCollections(store);
  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:import:bulk",
    action: "read:sup_import_batch",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { batch: sanitizeBatch(batch) };
}

export function executeSupplierImportBatch(
  store: Store,
  principal: Principal,
  batchId: string,
  correlationId: string,
  idempotencyKey?: string,
) {
  ensureSupplierCollections(store);

  if (!idempotencyKey?.trim()) {
    return { error: "invalid_request" as const, reason: "idempotency_key_required" };
  }

  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const idemKey = importExecuteKey(principal.tenantId, batchId, idempotencyKey.trim());
  const existing = store.supImportExecuteIdempotency[idemKey];
  if (existing === "committed" && batch.status === "committed") {
    return { batch: sanitizeBatch(batch), replay: true as const };
  }
  if (existing && batch.status !== "committed") {
    return { error: "conflict" as const, reason: "idempotency_key_reuse" };
  }

  const decision = authorize({
    principal,
    permission: "supplier:import:bulk",
    action: "commit:sup_import_batch",
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", correlationId, decision.reason, batchId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (batch.status !== "validated") {
    return { error: "conflict" as const, reason: "import_not_validated" };
  }

  const parsed = parseCsv(batch.csvContent);
  if ("error" in parsed) {
    batch.status = "failed";
    return { error: "invalid_request" as const, reason: parsed.error };
  }

  const validationResults = validateBatchRows(store, batch);
  if (validationResults.some((r) => r.status === "invalid")) {
    batch.status = "failed";
    batch.validationResults = validationResults;
    return { error: "conflict" as const, reason: "validation_failed_at_commit" };
  }

  const now = new Date().toISOString();
  const committedResults: SupImportRowResult[] = [];
  const createdIds: string[] = [];

  try {
    for (let i = 0; i < parsed.rows.length; i++) {
      const rowNumber = i + 1;
      const row = parsed.rows[i]!;
      const validated = validateSupplierImportRowByEntityType(batch.entityType, row);
      if ("errors" in validated) throw new Error("validation_failed");

      const entityId = commitImportRow(store, principal, batch, validated, now);
      createdIds.push(entityId);
      committedResults.push({ rowNumber, status: "committed", entityId });
    }

    batch.status = "committed";
    batch.committedCount = committedResults.length;
    batch.validationResults = committedResults;
    batch.committedAt = now;
    batch.committedByPrincipalId = principal.id;
    batch.executeIdempotencyKey = idempotencyKey.trim();
    store.supImportExecuteIdempotency[idemKey] = "committed";

    allowSupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", batch.id, correlationId, {
      status: batch.status,
      committedCount: batch.committedCount,
      eventType: SUPPLIER_EVENT_TYPES.IMPORT_COMMITTED,
    });

    return { batch: sanitizeBatch(batch) };
  } catch {
    rollbackCreatedRows(store, batch, createdIds);
    batch.status = "failed";
    allowSupplierAudit(store, principal, "supplier:import:bulk", "sup_import_batch", batch.id, correlationId, {
      status: batch.status,
      reason: "import_commit_failed",
      eventType: SUPPLIER_EVENT_TYPES.IMPORT_FAILED,
    });
    return { error: "conflict" as const, reason: "import_commit_failed" };
  }
}

function commitImportRow(
  store: Store,
  principal: Principal,
  batch: SupImportBatch,
  validated: Exclude<ReturnType<typeof validateSupplierImportRowByEntityType>, { errors: string[] }>,
  now: string,
): string {
  if (batch.entityType === "supplier") {
    const row = validated as import("@sedmc/kernel").SupplierImportRow;
    if (!clearanceAllows(principal.classificationClearance, row.classification ?? "Confidential")) {
      throw new Error("classification_denied");
    }
    const supplier = {
      id: newId(),
      tenantId: batch.tenantId,
      supplierCode: row.supplierCode,
      legalName: row.legalName,
      ...(row.tradingName !== undefined ? { tradingName: row.tradingName } : {}),
      category: row.category,
      ...(row.subcategory !== undefined ? { subcategory: row.subcategory } : {}),
      country: row.country,
      ...(row.region !== undefined ? { region: row.region } : {}),
      ...(row.city !== undefined ? { city: row.city } : {}),
      ...(row.address !== undefined ? { address: row.address } : {}),
      ...(row.latitude !== undefined ? { latitude: row.latitude } : {}),
      ...(row.longitude !== undefined ? { longitude: row.longitude } : {}),
      ...(row.telephone !== undefined ? { telephone: row.telephone } : {}),
      ...(row.email !== undefined ? { email: row.email } : {}),
      ...(row.website !== undefined ? { website: row.website } : {}),
      status: row.status,
      preferredPartner: row.preferredPartner ?? false,
      ...(row.paymentTermsDays !== undefined ? { paymentTermsDays: row.paymentTermsDays } : {}),
      ...(row.defaultCurrency !== undefined ? { defaultCurrency: row.defaultCurrency } : {}),
      ...(row.taxRegistrationNumber !== undefined ? { taxRegistrationNumber: row.taxRegistrationNumber } : {}),
      ...(row.contractRef !== undefined ? { contractRef: row.contractRef } : {}),
      ...(row.contractValidFrom !== undefined ? { contractValidFrom: row.contractValidFrom } : {}),
      ...(row.contractValidTo !== undefined ? { contractValidTo: row.contractValidTo } : {}),
      ...(row.notes !== undefined ? { notes: row.notes } : {}),
      dataQualityStatus: "Unverified" as const,
      classification: row.classification ?? "Confidential",
      sourceSystem: batch.sourceSystem,
      ...(row.sourceRecordId !== undefined ? { sourceRecordId: row.sourceRecordId } : {}),
      importBatchId: batch.id,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.supSuppliers.push(supplier);
    return supplier.id;
  }

  const supplierCode = (validated as { supplierCode: string }).supplierCode;
  const supplier = findSupplierByCode(store, batch.tenantId, supplierCode);
  if (!supplier) throw new Error("supplier_not_found");

  if (batch.entityType === "supplier_contact") {
    const row = validated as import("@sedmc/kernel").SupplierContactImportRow;
    const contact = {
      id: newId(),
      tenantId: batch.tenantId,
      supplierId: supplier.id,
      contactRole: row.contactRole,
      givenName: row.givenName,
      familyName: row.familyName,
      ...(row.email !== undefined ? { email: row.email } : {}),
      ...(row.telephone !== undefined ? { telephone: row.telephone } : {}),
      ...(row.whatsapp !== undefined ? { whatsapp: row.whatsapp } : {}),
      isPrimary: row.isPrimary ?? false,
      ...(row.notes !== undefined ? { notes: row.notes } : {}),
      importBatchId: batch.id,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.supContacts.push(contact);
    return contact.id;
  }

  if (batch.entityType === "supplier_rate") {
    const row = validated as import("@sedmc/kernel").SupplierRateImportRow;
    const rate = {
      id: newId(),
      tenantId: batch.tenantId,
      supplierId: supplier.id,
      rateCode: row.rateCode,
      rateName: row.rateName,
      rateType: row.rateType,
      ...(row.unitDescription !== undefined ? { unitDescription: row.unitDescription } : {}),
      amount: row.amount,
      currency: row.currency,
      validFrom: row.validFrom,
      validTo: row.validTo,
      ...(row.seasonLabel !== undefined ? { seasonLabel: row.seasonLabel } : {}),
      ...(row.minPax !== undefined ? { minPax: row.minPax } : {}),
      ...(row.maxPax !== undefined ? { maxPax: row.maxPax } : {}),
      ...(row.minNights !== undefined ? { minNights: row.minNights } : {}),
      ...(row.commissionPercent !== undefined ? { commissionPercent: row.commissionPercent } : {}),
      includesTax: row.includesTax ?? false,
      ...(row.taxPercent !== undefined ? { taxPercent: row.taxPercent } : {}),
      ...(row.cancellationPolicyRef !== undefined ? { cancellationPolicyRef: row.cancellationPolicyRef } : {}),
      ...(row.notes !== undefined ? { notes: row.notes } : {}),
      status: row.status,
      importBatchId: batch.id,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.supRates.push(rate);
    return rate.id;
  }

  const row = validated as import("@sedmc/kernel").SupplierContentBlockImportRow;
  const block = {
    id: newId(),
    tenantId: batch.tenantId,
    supplierId: supplier.id,
    blockCode: row.blockCode,
    blockType: row.blockType,
    ...(row.title !== undefined ? { title: row.title } : {}),
    body: row.body,
    language: row.language ?? "en",
    ...(row.assetFilename !== undefined ? { assetFilename: row.assetFilename } : {}),
    ...(row.assetAltText !== undefined ? { assetAltText: row.assetAltText } : {}),
    ...(row.tags !== undefined ? { tags: row.tags } : {}),
    isDefault: row.isDefault ?? false,
    status: row.status,
    importBatchId: batch.id,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.supContentBlocks.push(block);
  return block.id;
}

function rollbackCreatedRows(store: Store, batch: SupImportBatch, createdIds: string[]): void {
  if (batch.entityType === "supplier") {
    store.supSuppliers = store.supSuppliers.filter((s) => !createdIds.includes(s.id));
    return;
  }
  if (batch.entityType === "supplier_contact") {
    store.supContacts = store.supContacts.filter((c) => !createdIds.includes(c.id));
    return;
  }
  if (batch.entityType === "supplier_rate") {
    store.supRates = store.supRates.filter((r) => !createdIds.includes(r.id));
    return;
  }
  store.supContentBlocks = store.supContentBlocks.filter((b) => !createdIds.includes(b.id));
}
