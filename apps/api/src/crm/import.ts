import {
  authorize,
  clearanceAllows,
  CRM_EVENT_TYPES,
  importRowDuplicateKey,
  isValidImportEntityType,
  newId,
  normalizeOrganizationName,
  parseCsv,
  validateContactImportRow,
  validateOrganizationImportRow,
  type CrmImportBatch,
  type CrmImportRowResult,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections, seedCrmCatalogues } from "./collections.js";
import { registerDuplicateCandidatesForContact, registerDuplicateCandidatesForOrganization } from "./duplicate.js";
import { commitCrmWithOutbox, emitCrmEvent } from "./events.js";

function importExecuteKey(tenantId: string, batchId: string, key: string): string {
  return `${tenantId}:${batchId}:${key}`;
}

function findBatch(store: Store, tenantId: string, batchId: string): CrmImportBatch | undefined {
  const batch = store.crmImportBatches.find((b) => b.id === batchId);
  if (!batch || batch.tenantId !== tenantId) return undefined;
  return batch;
}

export type CreateImportInput = {
  sourceSystem: string;
  entityType: string;
  csv: string;
};

export function createImportBatch(store: Store, principal: Principal, input: CreateImportInput, correlationId: string) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  const decision = authorize({
    principal,
    permission: "crm:import:bulk",
    action: "create:crm_import_batch",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidImportEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }
  const sourceSystem = input.sourceSystem?.trim();
  if (!sourceSystem) return { error: "invalid_request" as const, reason: "source_system_required" };
  if (!input.csv?.trim()) return { error: "invalid_request" as const, reason: "csv_required" };

  const parsed = parseCsv(input.csv);
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };

  const requiredHeaders =
    input.entityType === "organization"
      ? ["legalName", "organizationTypeKey"]
      : ["givenName", "familyName"];
  for (const header of requiredHeaders) {
    if (!parsed.headers.includes(header)) {
      return { error: "invalid_request" as const, reason: `missing_required_column:${header}` };
    }
  }

  const unsupported = parsed.headers.filter((h) => !allowedImportHeaders(input.entityType, h));
  if (unsupported.length > 0) {
    return { error: "invalid_request" as const, reason: "unsupported_column" };
  }

  const batch: CrmImportBatch = {
    id: newId(),
    tenantId: principal.tenantId,
    sourceSystem,
    entityType: input.entityType,
    mode: "create_only",
    status: "pending",
    rowCount: parsed.rows.length,
    csvContent: input.csv,
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.IMPORT_CREATED,
    entityType: "import",
    entityId: batch.id,
    classification: "Internal",
    correlationId,
    payload: {
      importBatchId: batch.id,
      entityType: batch.entityType,
      rowCount: batch.rowCount,
      sourceSystem: batch.sourceSystem,
    },
    mutate: () => {
      store.crmImportBatches.push(batch);
      allowCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", batch.id, correlationId, {
        id: batch.id,
        entityType: batch.entityType,
        rowCount: batch.rowCount,
        sourceSystem: batch.sourceSystem,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { batch: sanitizeBatch(batch) };
}

function allowedImportHeaders(entityType: string, header: string): boolean {
  const org = ["legalName", "organizationTypeKey", "tradingName", "country", "classification", "sourceRecordId"];
  const contact = ["givenName", "familyName", "email", "telephone", "classification", "sourceRecordId"];
  return entityType === "organization" ? org.includes(header) : contact.includes(header);
}

function sanitizeBatch(batch: CrmImportBatch) {
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

function validateBatchRows(store: Store, batch: CrmImportBatch): CrmImportRowResult[] {
  const parsed = parseCsv(batch.csvContent);
  if ("error" in parsed) return [];

  const results: CrmImportRowResult[] = [];
  const seenKeys = new Set<string>();

  for (let i = 0; i < parsed.rows.length; i++) {
    const rowNumber = i + 1;
    const row = parsed.rows[i]!;
    if (batch.entityType === "organization") {
      const validated = validateOrganizationImportRow(row);
      if ("errors" in validated) {
        results.push({ rowNumber, status: "invalid", errors: validated.errors });
        continue;
      }
      const type = store.crmOrganizationTypes.find(
        (t) => t.tenantId === batch.tenantId && t.key === validated.organizationTypeKey && t.active,
      );
      if (!type) {
        results.push({ rowNumber, status: "invalid", errors: ["invalid_organization_type_key"] });
        continue;
      }
      const dupKey = importRowDuplicateKey("organization", validated);
      if (seenKeys.has(dupKey)) {
        results.push({ rowNumber, status: "invalid", errors: ["duplicate_row_in_import"] });
        continue;
      }
      seenKeys.add(dupKey);
      const exists = store.crmOrganizations.some(
        (o) =>
          o.tenantId === batch.tenantId &&
          !o.archivedAt &&
          !o.mergedIntoId &&
          normalizeOrganizationName(o.legalName) === normalizeOrganizationName(validated.legalName),
      );
      if (exists) {
        results.push({ rowNumber, status: "invalid", errors: ["existing_record_conflict"] });
        continue;
      }
      results.push({ rowNumber, status: "valid" });
      continue;
    }

    const validated = validateContactImportRow(row);
    if ("errors" in validated) {
      results.push({ rowNumber, status: "invalid", errors: validated.errors });
      continue;
    }
    const dupKey = importRowDuplicateKey("contact", validated);
    if (seenKeys.has(dupKey)) {
      results.push({ rowNumber, status: "invalid", errors: ["duplicate_row_in_import"] });
      continue;
    }
    seenKeys.add(dupKey);
    if (validated.email) {
      const exists = store.crmContacts.some(
        (c) =>
          c.tenantId === batch.tenantId &&
          !c.archivedAt &&
          !c.mergedIntoId &&
          c.email !== undefined &&
          c.email === validated.email,
      );
      if (exists) {
        results.push({ rowNumber, status: "invalid", errors: ["existing_record_conflict"] });
        continue;
      }
    }
    results.push({ rowNumber, status: "valid" });
  }

  return results;
}

export function validateImportBatch(store: Store, principal: Principal, batchId: string, correlationId: string) {
  ensureCrmCollections(store);
  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:import:bulk",
    action: "validate:crm_import_batch",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", correlationId, decision.reason, batchId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (batch.status === "committed") return { error: "conflict" as const, reason: "import_already_committed" };

  const validationResults = validateBatchRows(store, batch);
  batch.validationResults = validationResults;
  batch.validCount = validationResults.filter((r) => r.status === "valid").length;
  batch.invalidCount = validationResults.filter((r) => r.status === "invalid").length;
  batch.validatedAt = new Date().toISOString();
  batch.status = batch.invalidCount === 0 ? "validated" : "failed";

  if (batch.status === "validated") {
    const committed = commitCrmWithOutbox(store, principal, {
      eventType: CRM_EVENT_TYPES.IMPORT_VALIDATED,
      entityType: "import",
      entityId: batch.id,
      classification: "Internal",
      correlationId,
      payload: {
        importBatchId: batch.id,
        validCount: batch.validCount ?? 0,
        invalidCount: batch.invalidCount ?? 0,
      },
      mutate: () => {
        allowCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", batch.id, correlationId, {
          status: batch.status,
          validCount: batch.validCount,
          invalidCount: batch.invalidCount,
        });
      },
    });
    if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  } else {
    allowCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", batch.id, correlationId, {
      status: batch.status,
      validCount: batch.validCount,
      invalidCount: batch.invalidCount,
    });
    emitCrmEvent(store, principal, {
      eventType: CRM_EVENT_TYPES.IMPORT_FAILED,
      entityType: "import",
      entityId: batch.id,
      classification: "Internal",
      correlationId,
      payload: {
        importBatchId: batch.id,
        reason: "validation_failed",
      },
    });
  }

  return { batch: sanitizeBatch(batch) };
}

export function getImportBatch(store: Store, principal: Principal, batchId: string) {
  ensureCrmCollections(store);
  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:import:bulk",
    action: "read:crm_import_batch",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { batch: sanitizeBatch(batch) };
}

export function executeImportBatch(
  store: Store,
  principal: Principal,
  batchId: string,
  correlationId: string,
  idempotencyKey?: string,
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  if (!idempotencyKey?.trim()) {
    return { error: "invalid_request" as const, reason: "idempotency_key_required" };
  }

  const batch = findBatch(store, principal.tenantId, batchId);
  if (!batch) return { error: "not_found" as const };

  const idemKey = importExecuteKey(principal.tenantId, batchId, idempotencyKey.trim());
  const existing = store.crmImportExecuteIdempotency[idemKey];
  if (existing === "committed" && batch.status === "committed") {
    return { batch: sanitizeBatch(batch), replay: true as const };
  }
  if (existing && batch.status !== "committed") {
    return { error: "conflict" as const, reason: "idempotency_key_reuse" };
  }

  const decision = authorize({
    principal,
    permission: "crm:import:bulk",
    action: "commit:crm_import_batch",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", correlationId, decision.reason, batchId);
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
  const committedResults: CrmImportRowResult[] = [];
  const createdOrganizationIds: string[] = [];
  const createdContactIds: string[] = [];
  const duplicateCandidatesBefore = store.crmDuplicateCandidates.length;
  const outboxEventsBefore = store.outboxEvents.length;

  try {
    for (let i = 0; i < parsed.rows.length; i++) {
      const rowNumber = i + 1;
      const row = parsed.rows[i]!;

      if (batch.entityType === "organization") {
        const validated = validateOrganizationImportRow(row);
        if ("errors" in validated) throw new Error("validation_failed");
        const orgType = store.crmOrganizationTypes.find(
          (t) => t.tenantId === batch.tenantId && t.key === validated.organizationTypeKey && t.active,
        );
        if (!orgType) throw new Error("validation_failed");
        if (!clearanceAllows(principal.classificationClearance, validated.classification ?? "Internal")) {
          throw new Error("classification_denied");
        }

        const organization = {
          id: newId(),
          tenantId: batch.tenantId,
          legalName: validated.legalName,
          ...(validated.tradingName !== undefined ? { tradingName: validated.tradingName } : {}),
          organizationTypeId: orgType.id,
          ...(validated.country !== undefined ? { country: validated.country } : {}),
          status: "Prospect" as const,
          dataQualityStatus: "Unverified" as const,
          classification: validated.classification ?? "Internal",
          sourceSystem: batch.sourceSystem,
          ...(validated.sourceRecordId !== undefined ? { sourceRecordId: validated.sourceRecordId } : {}),
          importBatchId: batch.id,
          version: 1,
          createdAt: now,
          updatedAt: now,
          createdByPrincipalId: principal.id,
          updatedByPrincipalId: principal.id,
        };
        store.crmOrganizations.push(organization);
        createdOrganizationIds.push(organization.id);
        registerDuplicateCandidatesForOrganization(store, batch.tenantId, organization.id, {
          principal,
          correlationId,
        });
        committedResults.push({ rowNumber, status: "committed", entityId: organization.id });
        continue;
      }

      const validated = validateContactImportRow(row);
      if ("errors" in validated) throw new Error("validation_failed");
      if (!clearanceAllows(principal.classificationClearance, validated.classification ?? "Confidential")) {
        throw new Error("classification_denied");
      }

      const contact = {
        id: newId(),
        tenantId: batch.tenantId,
        givenName: validated.givenName,
        familyName: validated.familyName,
        ...(validated.email !== undefined ? { email: validated.email } : {}),
        ...(validated.telephone !== undefined ? { telephone: validated.telephone } : {}),
        status: "Active" as const,
        dataQualityStatus: "Unverified" as const,
        classification: validated.classification ?? "Confidential",
        source: batch.sourceSystem,
        version: 1,
        createdAt: now,
        updatedAt: now,
        createdByPrincipalId: principal.id,
        updatedByPrincipalId: principal.id,
      };
      store.crmContacts.push(contact);
      createdContactIds.push(contact.id);
      registerDuplicateCandidatesForContact(store, batch.tenantId, contact.id, {
        principal,
        correlationId,
      });
      committedResults.push({ rowNumber, status: "committed", entityId: contact.id });
    }

    batch.status = "committed";
    batch.committedCount = committedResults.length;
    batch.validationResults = committedResults;
    batch.committedAt = now;
    batch.committedByPrincipalId = principal.id;
    batch.executeIdempotencyKey = idempotencyKey.trim();
    store.crmImportExecuteIdempotency[idemKey] = "committed";

    const committed = commitCrmWithOutbox(store, principal, {
      eventType: CRM_EVENT_TYPES.IMPORT_COMMITTED,
      entityType: "import",
      entityId: batch.id,
      classification: "Internal",
      correlationId,
      payload: {
        importBatchId: batch.id,
        committedCount: batch.committedCount ?? 0,
      },
      mutate: () => {
        allowCrmAudit(store, principal, "crm:import:bulk", "crm_import_batch", batch.id, correlationId, {
          status: batch.status,
          committedCount: batch.committedCount,
        });
      },
    });
    if (!committed.ok) throw new Error("import_commit_failed");
    return { batch: sanitizeBatch(batch) };
  } catch {
    store.crmOrganizations = store.crmOrganizations.filter((o) => !createdOrganizationIds.includes(o.id));
    store.crmContacts = store.crmContacts.filter((c) => !createdContactIds.includes(c.id));
    store.crmDuplicateCandidates.splice(duplicateCandidatesBefore);
    store.outboxEvents.length = outboxEventsBefore;
    batch.status = "failed";
    emitCrmEvent(store, principal, {
      eventType: CRM_EVENT_TYPES.IMPORT_FAILED,
      entityType: "import",
      entityId: batch.id,
      classification: "Internal",
      correlationId,
      payload: {
        importBatchId: batch.id,
        reason: "import_commit_failed",
      },
    });
    return { error: "conflict" as const, reason: "import_commit_failed" };
  }
}
