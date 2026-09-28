import { authorize, type IssuedClientDocument, type IssuedProposal, type Principal } from "@sedmc/kernel";
import {
  ISSUED_CLIENT_DOCUMENT_DELIVERY,
  composeIssuedClientDocumentDeliveryMessage,
  createDevTestMockDeliveryProvider,
  createIssuedClientDocumentDelivery,
  createIssuedClientDocumentDeliveryAttempt,
  deliveryIdempotencyKey,
  deriveIssuedClientDocumentDeliveryState,
  evaluateIssuedClientDocumentDeliveryEligibility,
  normalizeDeliveryRecipientEmail,
  type IssuedClientDocumentDelivery,
  type IssuedClientDocumentDeliveryAttempt,
  type IssuedClientDocumentDeliveryProvider,
} from "@sedmc/kernel/issued-client-document-delivery";
import { ISSUED_PROPOSAL_DELIVERY } from "@sedmc/kernel/issued-proposal";
import { isProductionLikeEnv } from "../devtest-token-secret.js";
import type { Store } from "../store.js";
import { recordAudit } from "../store.js";
import {
  allowAuditRecord,
  insertChainedAudit,
  isMixedSqlDurable,
  isUniqueViolation,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import {
  getIssuedClientDocumentById,
  listIssuedClientDocumentsByTenant,
} from "../persistence/issued-client-document-repository.js";
import {
  getIssuedClientDocumentDeliveryByDocumentRecipient,
  getIssuedClientDocumentDeliveryById,
  getIssuedClientDocumentDeliveryByIdempotency,
  insertIssuedClientDocumentDelivery,
  insertIssuedClientDocumentDeliveryAttempt,
  listIssuedClientDocumentDeliveriesByTenant,
  listIssuedClientDocumentDeliveryAttempts,
  nextIssuedClientDocumentDeliveryAttemptNumber,
} from "../persistence/issued-client-document-delivery-repository.js";
import { listIssuedProposalsByTenant } from "../persistence/issued-proposal-repository.js";
import { getProgrammeById } from "../persistence/programme-repository.js";
import { ensureIssuedProposalCollections } from "./collections.js";
import { loadIssuedProposalRecord } from "./issued-proposal.js";

function ensureDocumentStorage(store: Store): void {
  if (!store.documentStorage) {
    throw new Error("document_storage_required");
  }
}

function ensureDeliveryProvider(store: Store): IssuedClientDocumentDeliveryProvider {
  if (!store.devTestDocumentDeliveryProvider) {
    store.devTestDocumentDeliveryProvider = createDevTestMockDeliveryProvider("accept");
  }
  return store.devTestDocumentDeliveryProvider;
}

function denyDeliveryAudit(
  store: Store,
  principal: Principal,
  action: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType: "issued_client_document_delivery",
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  });
}

async function loadDocument(store: Store, tenantId: string, id: string): Promise<IssuedClientDocument | undefined> {
  ensureIssuedProposalCollections(store);
  if (isMixedSqlDurable(store)) {
    const persisted = await getIssuedClientDocumentById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  return store.issuedClientDocuments.find((d) => d.id === id && d.tenantId === tenantId);
}

async function loadProgramme(store: Store, tenantId: string, programmeId: string) {
  if (isMixedSqlDurable(store)) {
    const persisted = await getProgrammeById(store.dbPool, tenantId, programmeId);
    if (persisted) return persisted;
  }
  return store.prgProgrammes.find((p) => p.id === programmeId && p.tenantId === tenantId && !p.archivedAt);
}

async function loadProgrammeIssued(store: Store, tenantId: string, programmeId: string): Promise<IssuedProposal[]> {
  if (isMixedSqlDurable(store)) {
    return listIssuedProposalsByTenant(store.dbPool, tenantId, { programmeId });
  }
  return store.issuedProposals.filter((i) => i.tenantId === tenantId && i.programmeId === programmeId);
}

async function loadSiblingDocuments(
  store: Store,
  tenantId: string,
  issuedProposalId: string,
): Promise<IssuedClientDocument[]> {
  if (isMixedSqlDurable(store)) {
    return listIssuedClientDocumentsByTenant(store.dbPool, tenantId, { issuedProposalId });
  }
  return store.issuedClientDocuments.filter((d) => d.tenantId === tenantId && d.issuedProposalId === issuedProposalId);
}

async function loadDelivery(store: Store, tenantId: string, id: string): Promise<IssuedClientDocumentDelivery | undefined> {
  ensureIssuedProposalCollections(store);
  if (isMixedSqlDurable(store)) {
    const persisted = await getIssuedClientDocumentDeliveryById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  return store.issuedClientDocumentDeliveries.find((d) => d.id === id && d.tenantId === tenantId);
}

async function loadAttempts(
  store: Store,
  tenantId: string,
  deliveryId: string,
): Promise<IssuedClientDocumentDeliveryAttempt[]> {
  if (isMixedSqlDurable(store)) {
    return listIssuedClientDocumentDeliveryAttempts(store.dbPool, tenantId, deliveryId);
  }
  return store.issuedClientDocumentDeliveryAttempts
    .filter((a) => a.tenantId === tenantId && a.deliveryId === deliveryId)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);
}

async function findExistingDelivery(
  store: Store,
  tenantId: string,
  documentId: string,
  recipientEmail: string,
  idempotencyKey: string,
): Promise<IssuedClientDocumentDelivery | undefined> {
  if (isMixedSqlDurable(store)) {
    const byKey = await getIssuedClientDocumentDeliveryByIdempotency(store.dbPool, tenantId, idempotencyKey);
    if (byKey) return byKey;
    return getIssuedClientDocumentDeliveryByDocumentRecipient(store.dbPool, tenantId, documentId, recipientEmail);
  }
  return store.issuedClientDocumentDeliveries.find(
    (d) =>
      d.tenantId === tenantId &&
      (d.idempotencyKey === idempotencyKey ||
        (d.issuedClientDocumentId === documentId && d.recipientEmail === recipientEmail)),
  );
}

function sanitizeDelivery(delivery: IssuedClientDocumentDelivery, attempts: IssuedClientDocumentDeliveryAttempt[]) {
  return {
    delivery: {
      id: delivery.id,
      deliveryCode: delivery.deliveryCode,
      kind: delivery.kind,
      issuedClientDocumentId: delivery.issuedClientDocumentId,
      documentCode: delivery.documentCode,
      issuedProposalId: delivery.issuedProposalId,
      issuedCode: delivery.issuedCode,
      programmeId: delivery.programmeId,
      relatedOrganizationId: delivery.relatedOrganizationId,
      recipientEmail: delivery.recipientEmail,
      recipientConfirmed: true as const,
      sender: {
        key: delivery.senderKey,
        organizationName: delivery.senderOrganizationName,
        address: delivery.senderAddress,
        mode: delivery.senderMode,
        productionConfigured: false as const,
      },
      authorizationPrincipalId: delivery.authorizationPrincipalId,
      authorizationAuthority: delivery.authorizationAuthority,
      authorizedAt: delivery.authorizedAt,
      contentSha256: delivery.contentSha256,
      artifactSha256: delivery.artifactSha256,
      idempotencyKey: delivery.idempotencyKey,
      templateVersion: delivery.templateVersion,
      authorizeSupersededDocument: delivery.authorizeSupersededDocument,
      state: deriveIssuedClientDocumentDeliveryState(delivery, attempts),
      immutable: true as const,
      createdAt: delivery.createdAt,
    },
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      attemptCode: attempt.attemptCode,
      attemptNumber: attempt.attemptNumber,
      result: attempt.result,
      recipientDelivered: false as const,
      ...(attempt.failureReason !== undefined ? { failureReason: attempt.failureReason } : {}),
      providerName: attempt.providerName,
      ...(attempt.providerReference !== undefined ? { providerReference: attempt.providerReference } : {}),
      requestedAt: attempt.requestedAt,
      contentSha256: attempt.contentSha256,
      artifactSha256: attempt.artifactSha256,
    })),
    generationDelivery: ISSUED_CLIENT_DOCUMENT_DELIVERY,
    deliveryFlags: ISSUED_PROPOSAL_DELIVERY,
  };
}

async function persistDelivery(store: Store, principal: Principal, record: IssuedClientDocumentDelivery, correlationId: string) {
  if (isMixedSqlDurable(store)) {
    const committed = await runDurableTx(store, async (client) => {
      await insertIssuedClientDocumentDelivery(client, record);
      const audit = await insertChainedAudit(
        client,
        allowAuditRecord(
          principal,
          "authorize:issued_client_document_delivery",
          "issued_client_document_delivery",
          record.id,
          correlationId,
          {
            deliveryCode: record.deliveryCode,
            issuedClientDocumentId: record.issuedClientDocumentId,
            issuedProposalId: record.issuedProposalId,
            artifactSha256: record.artifactSha256,
          },
        ),
      );
      return { audit };
    });
    rememberPostCommit(store, committed.audit);
  } else {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "authorize:issued_client_document_delivery",
      resourceType: "issued_client_document_delivery",
      resourceId: record.id,
      correlationId,
      authorization: "allow",
      evidence: { deliveryCode: record.deliveryCode },
    });
  }
  store.issuedClientDocumentDeliveries.push(record);
}

async function persistAttempt(
  store: Store,
  principal: Principal,
  attempt: IssuedClientDocumentDeliveryAttempt,
  correlationId: string,
) {
  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertIssuedClientDocumentDeliveryAttempt(client, attempt);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "attempt:issued_client_document_delivery",
            "issued_client_document_delivery_attempt",
            attempt.id,
            correlationId,
            {
              deliveryId: attempt.deliveryId,
              result: attempt.result,
              recipientDelivered: false,
            },
          ),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_attempt" };
      throw error;
    }
  } else {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "attempt:issued_client_document_delivery",
      resourceType: "issued_client_document_delivery_attempt",
      resourceId: attempt.id,
      correlationId,
      authorization: "allow",
      evidence: { result: attempt.result, recipientDelivered: false },
    });
  }
  store.issuedClientDocumentDeliveryAttempts.push(attempt);
  return { ok: true as const };
}

async function eligibilityContext(
  store: Store,
  principal: Principal,
  document: IssuedClientDocument,
  issued: IssuedProposal,
  input: {
    recipientEmail?: string;
    recipientConfirmed?: boolean;
    relatedOrganizationId?: string;
    cc?: unknown;
    bcc?: unknown;
    additionalTo?: unknown;
    authorizeSupersededDocument?: boolean;
  },
) {
  const programme = await loadProgramme(store, principal.tenantId, issued.programmeId);
  ensureDocumentStorage(store);
  const pdfBytes = await store.documentStorage!.get(document.storageRef);
  return evaluateIssuedClientDocumentDeliveryEligibility({
    document,
    issued,
    programmeOrganizationId: programme?.organizationId,
    programmeTenantId: programme?.tenantId,
    pdfBytes: pdfBytes ?? null,
    principal,
    recipientEmail: input.recipientEmail,
    recipientConfirmed: input.recipientConfirmed,
    relatedOrganizationId: input.relatedOrganizationId,
    cc: input.cc,
    bcc: input.bcc,
    additionalTo: input.additionalTo,
    authorizeSupersededDocument: input.authorizeSupersededDocument,
    programmeIssued: await loadProgrammeIssued(store, principal.tenantId, issued.programmeId),
    siblingDocuments: await loadSiblingDocuments(store, principal.tenantId, issued.id),
    productionLike: isProductionLikeEnv(),
  });
}

export function listIssuedClientDocumentDeliveryRoutes(): string[] {
  return [
    "/v1/issued-proposal-document-deliveries",
    "/v1/issued-proposal-document-deliveries/:id",
    "/v1/issued-proposal-document-deliveries/:id/attempts",
  ];
}

export function unauthorizedIssuedClientDocumentDeliveryRoutes(): string[] {
  return [
    "/v1/client/issued-proposal-document-deliveries",
    "/v1/public/issued-proposal-document-deliveries",
    "/v1/issued-proposal-document-deliveries/:id/download",
    "/v1/issued-proposal-document-deliveries/:id/pdf",
    "/portal/issued-proposal-document-deliveries/:id",
  ];
}

export async function authorizeIssuedClientDocumentDelivery(
  store: Store,
  principal: Principal,
  input: {
    issuedClientDocumentId?: string;
    recipientEmail?: string;
    recipientConfirmed?: boolean;
    relatedOrganizationId?: string;
    clientIdempotencyKey?: string;
    authorizeSupersededDocument?: boolean;
    execute?: boolean;
    cc?: unknown;
    bcc?: unknown;
    additionalTo?: unknown;
  },
  correlationId: string,
) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:write:proposal",
    action: "authorize:issued_client_document_delivery",
  });
  if (decision.result === "deny") {
    denyDeliveryAudit(store, principal, "authorize:issued_client_document_delivery", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!input.issuedClientDocumentId) {
    return { error: "invalid_request" as const, reason: "document_required" };
  }
  const document = await loadDocument(store, principal.tenantId, input.issuedClientDocumentId);
  if (!document) return { error: "not_found" as const, reason: "document_required" };
  const issued = await loadIssuedProposalRecord(store, principal.tenantId, document.issuedProposalId);
  if (!issued) return { error: "not_found" as const, reason: "issued_proposal_required" };

  const eligibility = await eligibilityContext(store, principal, document, issued, input);
  if (!eligibility.ok) {
    denyDeliveryAudit(
      store,
      principal,
      "authorize:issued_client_document_delivery",
      correlationId,
      eligibility.error,
      document.id,
    );
    if (eligibility.error === "b2_authorization_required") {
      return { error: "forbidden" as const, reason: eligibility.error };
    }
    if (eligibility.error === "tenant_mismatch") {
      return { error: "not_found" as const };
    }
    return { error: "invalid_request" as const, reason: eligibility.error };
  }

  const recipientEmail = normalizeDeliveryRecipientEmail(input.recipientEmail!);
  const idempotencyKey = deliveryIdempotencyKey({
    tenantId: principal.tenantId,
    documentId: document.id,
    recipientEmail,
    ...(input.clientIdempotencyKey !== undefined ? { clientIdempotencyKey: input.clientIdempotencyKey } : {}),
  });
  const existing = await findExistingDelivery(store, principal.tenantId, document.id, recipientEmail, idempotencyKey);
  if (existing) {
    const attempts = await loadAttempts(store, principal.tenantId, existing.id);
    if (input.execute === true && deriveIssuedClientDocumentDeliveryState(existing, attempts) !== "accepted_by_provider") {
      const executed = await executeIssuedClientDocumentDeliveryAttempt(store, principal, existing.id, correlationId);
      if ("error" in executed) return executed;
      return executed;
    }
    return sanitizeDelivery(existing, attempts);
  }

  const created = createIssuedClientDocumentDelivery({
    document,
    issued,
    principal,
    recipientEmail,
    relatedOrganizationId: input.relatedOrganizationId!,
    ...(input.clientIdempotencyKey !== undefined ? { clientIdempotencyKey: input.clientIdempotencyKey } : {}),
    ...(input.authorizeSupersededDocument !== undefined
      ? { authorizeSupersededDocument: input.authorizeSupersededDocument }
      : {}),
  });
  if ("error" in created) return { error: "invalid_request" as const, reason: created.error };

  try {
    await persistDelivery(store, principal, created, correlationId);
  } catch (error) {
    if (isUniqueViolation(error)) {
      const replay = await findExistingDelivery(store, principal.tenantId, document.id, recipientEmail, idempotencyKey);
      if (replay) return sanitizeDelivery(replay, await loadAttempts(store, principal.tenantId, replay.id));
      return { error: "conflict" as const, reason: "idempotency_collision" };
    }
    throw error;
  }

  if (input.execute === true) {
    return executeIssuedClientDocumentDeliveryAttempt(store, principal, created.id, correlationId);
  }
  return sanitizeDelivery(created, []);
}

export async function executeIssuedClientDocumentDeliveryAttempt(
  store: Store,
  principal: Principal,
  deliveryId: string,
  correlationId: string,
) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:write:proposal",
    action: "attempt:issued_client_document_delivery",
  });
  if (decision.result === "deny") {
    denyDeliveryAudit(store, principal, "attempt:issued_client_document_delivery", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const delivery = await loadDelivery(store, principal.tenantId, deliveryId);
  if (!delivery) return { error: "not_found" as const };
  const document = await loadDocument(store, principal.tenantId, delivery.issuedClientDocumentId);
  if (!document) return { error: "not_found" as const, reason: "document_required" };
  const issued = await loadIssuedProposalRecord(store, principal.tenantId, delivery.issuedProposalId);
  if (!issued) return { error: "not_found" as const, reason: "issued_proposal_required" };

  const attempts = await loadAttempts(store, principal.tenantId, delivery.id);
  if (deriveIssuedClientDocumentDeliveryState(delivery, attempts) === "accepted_by_provider") {
    return sanitizeDelivery(delivery, attempts);
  }

  const eligibility = await eligibilityContext(store, principal, document, issued, {
    recipientEmail: delivery.recipientEmail,
    recipientConfirmed: true,
    relatedOrganizationId: delivery.relatedOrganizationId,
    authorizeSupersededDocument: delivery.authorizeSupersededDocument,
  });
  if (!eligibility.ok) {
    const cancelled = createIssuedClientDocumentDeliveryAttempt({
      delivery,
      document,
      principal,
      attemptNumber: isMixedSqlDurable(store)
        ? await nextIssuedClientDocumentDeliveryAttemptNumber(store.dbPool, principal.tenantId, delivery.id)
        : attempts.length + 1,
      result: "cancelled",
      failureReason: eligibility.error,
    });
    const persisted = await persistAttempt(store, principal, cancelled, correlationId);
    if ("error" in persisted) return persisted;
    return sanitizeDelivery(delivery, [...attempts, cancelled]);
  }

  ensureDocumentStorage(store);
  const pdfBytes = await store.documentStorage!.get(document.storageRef);
  if (!pdfBytes) return { error: "invalid_request" as const, reason: "artifact_missing" };
  const provider = ensureDeliveryProvider(store);
  const providerResult = await provider.send({
    pdfBytes,
    message: composeIssuedClientDocumentDeliveryMessage({
      document,
      recipientEmail: delivery.recipientEmail,
    }),
    artifactSha256: document.artifactSha256,
  });
  const attemptNumber = isMixedSqlDurable(store)
    ? await nextIssuedClientDocumentDeliveryAttemptNumber(store.dbPool, principal.tenantId, delivery.id)
    : attempts.length + 1;
  const attempt = createIssuedClientDocumentDeliveryAttempt({
    delivery,
    document,
    principal,
    attemptNumber,
    result: providerResult.status === "accepted_by_provider" ? "accepted_by_provider" : "failed",
    ...(providerResult.status === "failed" ? { failureReason: providerResult.failureReason } : {}),
    ...("providerReference" in providerResult && providerResult.providerReference
      ? { providerReference: providerResult.providerReference }
      : {}),
  });
  const persisted = await persistAttempt(store, principal, attempt, correlationId);
  if ("error" in persisted) return persisted;
  return sanitizeDelivery(delivery, [...attempts, attempt]);
}

export async function listIssuedClientDocumentDeliveries(store: Store, principal: Principal) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_client_document_delivery",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const items = isMixedSqlDurable(store)
    ? await listIssuedClientDocumentDeliveriesByTenant(store.dbPool, principal.tenantId)
    : store.issuedClientDocumentDeliveries.filter((d) => d.tenantId === principal.tenantId);
  const serialized = [];
  for (const delivery of items) {
    serialized.push(sanitizeDelivery(delivery, await loadAttempts(store, principal.tenantId, delivery.id)));
  }
  return { items: serialized };
}

export async function getIssuedClientDocumentDelivery(store: Store, principal: Principal, id: string) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_client_document_delivery",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const delivery = await loadDelivery(store, principal.tenantId, id);
  if (!delivery) return { error: "not_found" as const };
  return sanitizeDelivery(delivery, await loadAttempts(store, principal.tenantId, delivery.id));
}
