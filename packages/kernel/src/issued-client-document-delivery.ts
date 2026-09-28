import { newId, sha256 } from "./crypto.js";
import {
  ISSUED_CLIENT_DOCUMENT_GENERATION,
  assertIssuedClientDocumentPayloadSanitized,
  hashIssuedClientDocumentArtifact,
  hashIssuedClientDocumentContent,
  issuedClientDocumentIdentityDistinct,
  issuedClientDocumentPdfContainsForbidden,
  type IssuedClientDocument,
} from "./issued-client-document.js";
import {
  ISSUED_PROPOSAL_DELIVERY,
  ISSUING_ENTITY_SEDMC,
  clientIssueApprovalAuthority,
  principalMayAuthorizeClientIssue,
  type ClientIssueApprovalAuthority,
  type IssuedProposal,
} from "./issued-proposal.js";
import type { Principal } from "./types.js";

/** Dev/Test mock delivery only. Real email/SMTP/Production send remain unauthorized. */
export const ISSUED_CLIENT_DOCUMENT_DELIVERY = {
  implemented: true,
  mockProvider: true,
  realEmail: false,
  smtp: false,
  dispatch: false,
  clientAccess: false,
  production: false,
} as const;

export const ISSUED_CLIENT_DOCUMENT_DELIVERY_KIND = "issued_client_document_delivery" as const;
export const ISSUED_CLIENT_DOCUMENT_DELIVERY_ATTEMPT_KIND = "issued_client_document_delivery_attempt" as const;
export const ISSUED_CLIENT_DOCUMENT_DELIVERY_TEMPLATE_VERSION = "h203-del-v1" as const;

export const DEVTEST_DELIVERY_SENDER_CONFIG_KEY = "h203.devtest.organizational_sender" as const;

/** Organizational mock sender. Not an employee mailbox. `.invalid` cannot route on the public Internet. */
export const DEVTEST_DELIVERY_SENDER = {
  key: DEVTEST_DELIVERY_SENDER_CONFIG_KEY,
  kind: "organizational" as const,
  organizationName: ISSUING_ENTITY_SEDMC,
  mode: "devtest-mock" as const,
  address: "noreply@sedmc.invalid",
  productionConfigured: false as const,
};

export type DevTestDeliverySender = typeof DEVTEST_DELIVERY_SENDER;

export const ISSUED_CLIENT_DOCUMENT_DELIVERY_STATES = [
  "requested",
  "authorized",
  "queued",
  "accepted_by_provider",
  "failed",
  "cancelled",
] as const;

export type IssuedClientDocumentDeliveryState = (typeof ISSUED_CLIENT_DOCUMENT_DELIVERY_STATES)[number];

const INTERNAL_RECIPIENT_DOMAINS = ["sedmc.local"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORBIDDEN_TEMPLATE_PATTERNS = [
  /supplierCost/i,
  /grossProfit/i,
  /grossMargin/i,
  /\bmarkup\b/i,
  /fileFee/i,
  /file fee/i,
  /taxAmount/i,
  /taxMode/i,
  /fxRate/i,
  /marginFloor/i,
  /approvalRequest/i,
  /costLines/i,
  /internalSnapshot/i,
  /workflow/i,
  /\baudit\b/i,
];

export type IssuedClientDocumentDeliveryEligibilityError =
  | "document_required"
  | "issued_proposal_required"
  | "issued_proposal_invalid"
  | "artifact_missing"
  | "artifact_hash_mismatch"
  | "content_hash_mismatch"
  | "document_not_client_safe"
  | "recipient_not_confirmed"
  | "recipient_invalid"
  | "recipient_unrelated"
  | "recipient_internal_not_authorized"
  | "b2_authorization_required"
  | "document_superseded"
  | "issued_proposal_superseded"
  | "tenant_mismatch"
  | "cc_not_authorized"
  | "bcc_not_authorized"
  | "multiple_recipients_not_authorized"
  | "production_delivery_not_authorized"
  | "real_email_not_authorized";

export type IssuedClientDocumentDelivery = {
  id: string;
  deliveryCode: string;
  kind: typeof ISSUED_CLIENT_DOCUMENT_DELIVERY_KIND;
  tenantId: string;
  issuedClientDocumentId: string;
  documentCode: string;
  issuedProposalId: string;
  issuedCode: string;
  programmeId: string;
  relatedOrganizationId: string;
  recipientEmail: string;
  recipientConfirmed: true;
  senderKey: typeof DEVTEST_DELIVERY_SENDER_CONFIG_KEY;
  senderOrganizationName: typeof ISSUING_ENTITY_SEDMC;
  senderAddress: typeof DEVTEST_DELIVERY_SENDER.address;
  senderMode: typeof DEVTEST_DELIVERY_SENDER.mode;
  authorizationPrincipalId: string;
  authorizationAuthority: ClientIssueApprovalAuthority;
  authorizedAt: string;
  contentSha256: string;
  artifactSha256: string;
  idempotencyKey: string;
  templateVersion: typeof ISSUED_CLIENT_DOCUMENT_DELIVERY_TEMPLATE_VERSION;
  authorizeSupersededDocument: boolean;
  state: "queued";
  immutable: true;
  createdAt: string;
};

export type IssuedClientDocumentDeliveryAttempt = {
  id: string;
  attemptCode: string;
  kind: typeof ISSUED_CLIENT_DOCUMENT_DELIVERY_ATTEMPT_KIND;
  tenantId: string;
  deliveryId: string;
  deliveryCode: string;
  issuedClientDocumentId: string;
  issuedProposalId: string;
  recipientEmail: string;
  contentSha256: string;
  artifactSha256: string;
  attemptNumber: number;
  requestedAt: string;
  result: "accepted_by_provider" | "failed" | "cancelled";
  recipientDelivered: false;
  failureReason?: string;
  providerName: "devtest-mock";
  providerReference?: string;
  actorPrincipalId: string;
  immutable: true;
  createdAt: string;
};

export type IssuedClientDocumentDeliveryMessage = {
  templateVersion: typeof ISSUED_CLIENT_DOCUMENT_DELIVERY_TEMPLATE_VERSION;
  fromOrganization: typeof ISSUING_ENTITY_SEDMC;
  fromAddress: typeof DEVTEST_DELIVERY_SENDER.address;
  to: string;
  subject: string;
  body: string;
  attachmentFileName: string;
};

export type MockDeliveryProviderBehavior = "accept" | "reject" | "timeout";

export type MockDeliveryProviderResult =
  | {
      status: "accepted_by_provider";
      providerName: "devtest-mock";
      providerReference: string;
      recipientDelivered: false;
    }
  | {
      status: "failed";
      providerName: "devtest-mock";
      failureReason: "provider_rejected" | "provider_timeout";
      recipientDelivered: false;
    };

export type IssuedClientDocumentDeliveryProvider = {
  name: "devtest-mock";
  contactsInternet: false;
  contactsSmtp: false;
  usesProductionCredentials: false;
  recipientDeliveredMeansMailbox: false;
  send(input: {
    pdfBytes: Uint8Array;
    message: IssuedClientDocumentDeliveryMessage;
    artifactSha256: string;
  }): Promise<MockDeliveryProviderResult>;
};

export function buildIssuedClientDocumentDeliveryCode(): string {
  return `DEL-${newId()}`;
}

export function buildIssuedClientDocumentDeliveryAttemptCode(): string {
  return `DLA-${newId()}`;
}

export function normalizeDeliveryRecipientEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function deliveryIdempotencyKey(input: {
  tenantId: string;
  documentId: string;
  recipientEmail: string;
  clientIdempotencyKey?: string;
}): string {
  const recipient = normalizeDeliveryRecipientEmail(input.recipientEmail);
  const authorization = (input.clientIdempotencyKey ?? "b2-default").trim() || "b2-default";
  return sha256(`${input.tenantId}|${input.documentId}|${recipient}|${authorization}`);
}

export function issuedClientDocumentDeliveryIdentityDistinct(input: {
  deliveryId: string;
  deliveryCode: string;
  attemptId?: string;
  attemptCode?: string;
  documentId: string;
  documentCode: string;
  issuedProposalId: string;
  issuedCode: string;
  rfpId?: string;
  c8ProposalId?: string;
}): boolean {
  const ids = [input.deliveryId, input.documentId, input.issuedProposalId];
  if (input.attemptId) ids.push(input.attemptId);
  if (input.rfpId) ids.push(input.rfpId);
  if (input.c8ProposalId) ids.push(input.c8ProposalId);
  if (new Set(ids).size !== ids.length) return false;
  if (!input.deliveryCode.startsWith("DEL-")) return false;
  if (input.attemptCode && !input.attemptCode.startsWith("DLA-")) return false;
  return issuedClientDocumentIdentityDistinct({
    documentId: input.documentId,
    documentCode: input.documentCode,
    issuedProposalId: input.issuedProposalId,
    issuedCode: input.issuedCode,
    ...(input.c8ProposalId ? { c8ProposalId: input.c8ProposalId } : {}),
  });
}

export function recipientLooksLikeEmail(email: string): boolean {
  return EMAIL_PATTERN.test(normalizeDeliveryRecipientEmail(email));
}

export function recipientIsInternalSedmcAddress(email: string): boolean {
  const normalized = normalizeDeliveryRecipientEmail(email);
  const domain = normalized.split("@")[1] ?? "";
  return INTERNAL_RECIPIENT_DOMAINS.includes(domain);
}

export function recipientIsRelatedToCommercialFile(input: {
  relatedOrganizationId: string;
  programmeOrganizationId: string;
  tenantId: string;
  programmeTenantId: string;
}): boolean {
  return (
    input.relatedOrganizationId.length > 0 &&
    input.relatedOrganizationId === input.programmeOrganizationId &&
    input.tenantId === input.programmeTenantId
  );
}

export function isIssuedProposalSupersededForSend(
  issued: IssuedProposal,
  programmeIssued: IssuedProposal[],
): boolean {
  return programmeIssued.some(
    (other) =>
      other.tenantId === issued.tenantId &&
      other.programmeId === issued.programmeId &&
      other.issuedAt > issued.issuedAt,
  );
}

export function isIssuedClientDocumentSupersededForSend(
  document: IssuedClientDocument,
  siblings: IssuedClientDocument[],
): boolean {
  return siblings.some(
    (other) =>
      other.tenantId === document.tenantId &&
      other.issuedProposalId === document.issuedProposalId &&
      other.sequence > document.sequence,
  );
}

export function composeIssuedClientDocumentDeliveryMessage(input: {
  document: IssuedClientDocument;
  recipientEmail: string;
  sender?: DevTestDeliverySender;
}): IssuedClientDocumentDeliveryMessage {
  assertIssuedClientDocumentPayloadSanitized(input.document.clientContent);
  const sender = input.sender ?? DEVTEST_DELIVERY_SENDER;
  const payload = input.document.clientContent;
  const dates =
    payload.startDate || payload.endDate
      ? `${payload.startDate ?? ""} – ${payload.endDate ?? ""}`.trim()
      : "dates as on the attached proposal";
  const body = [
    `${sender.organizationName} is providing the attached client proposal for your records.`,
    `Programme: ${payload.programmeTitle}`,
    `Dates: ${dates}`,
    `Document reference: ${input.document.documentCode}`,
    `Issued reference: ${payload.issuedCode}`,
    `Client selling price: ${payload.clientSellingPrice} ${payload.currency}`,
    "This message is an internal Dev/Test mock. It is not recipient mailbox delivery.",
  ].join("\n");
  const message: IssuedClientDocumentDeliveryMessage = {
    templateVersion: ISSUED_CLIENT_DOCUMENT_DELIVERY_TEMPLATE_VERSION,
    fromOrganization: sender.organizationName,
    fromAddress: sender.address,
    to: normalizeDeliveryRecipientEmail(input.recipientEmail),
    subject: `${sender.organizationName} proposal ${input.document.documentCode}`,
    body,
    attachmentFileName: `${input.document.documentCode}.pdf`,
  };
  assertDeliveryMessageSanitized(message);
  return message;
}

export function assertDeliveryMessageSanitized(message: IssuedClientDocumentDeliveryMessage): void {
  const blob = `${message.subject}\n${message.body}\n${message.attachmentFileName}`;
  for (const pattern of FORBIDDEN_TEMPLATE_PATTERNS) {
    if (pattern.test(blob)) throw new Error("delivery_template_forbidden");
  }
}

export function evaluateIssuedClientDocumentDeliveryEligibility(input: {
  document?: IssuedClientDocument;
  issued?: IssuedProposal;
  programmeOrganizationId?: string;
  programmeTenantId?: string;
  pdfBytes?: Uint8Array | null;
  principal: Principal;
  recipientEmail?: string;
  recipientConfirmed?: boolean;
  relatedOrganizationId?: string;
  cc?: unknown;
  bcc?: unknown;
  additionalTo?: unknown;
  authorizeSupersededDocument?: boolean;
  programmeIssued?: IssuedProposal[];
  siblingDocuments?: IssuedClientDocument[];
  productionLike?: boolean;
}): { ok: true } | { ok: false; error: IssuedClientDocumentDeliveryEligibilityError } {
  if (input.productionLike) return { ok: false, error: "production_delivery_not_authorized" };
  if (ISSUED_PROPOSAL_DELIVERY.email || ISSUED_CLIENT_DOCUMENT_GENERATION.email) {
    return { ok: false, error: "real_email_not_authorized" };
  }
  if (!principalMayAuthorizeClientIssue(input.principal) || !clientIssueApprovalAuthority(input.principal)) {
    return { ok: false, error: "b2_authorization_required" };
  }
  if (input.cc !== undefined && input.cc !== null && input.cc !== false) {
    return { ok: false, error: "cc_not_authorized" };
  }
  if (input.bcc !== undefined && input.bcc !== null && input.bcc !== false) {
    return { ok: false, error: "bcc_not_authorized" };
  }
  if (input.additionalTo !== undefined && input.additionalTo !== null) {
    return { ok: false, error: "multiple_recipients_not_authorized" };
  }
  if (!input.document) return { ok: false, error: "document_required" };
  if (!input.issued) return { ok: false, error: "issued_proposal_required" };
  if (input.document.tenantId !== input.principal.tenantId || input.issued.tenantId !== input.principal.tenantId) {
    return { ok: false, error: "tenant_mismatch" };
  }
  if (input.document.issuedProposalId !== input.issued.id || input.issued.kind !== "issued_proposal") {
    return { ok: false, error: "issued_proposal_invalid" };
  }
  if (!input.issued.issuedCode.startsWith("ISS-") || !input.document.documentCode.startsWith("DOC-")) {
    return { ok: false, error: "issued_proposal_invalid" };
  }
  if (input.recipientConfirmed !== true) return { ok: false, error: "recipient_not_confirmed" };
  if (!input.recipientEmail || !recipientLooksLikeEmail(input.recipientEmail)) {
    return { ok: false, error: "recipient_invalid" };
  }
  if (recipientIsInternalSedmcAddress(input.recipientEmail)) {
    return { ok: false, error: "recipient_internal_not_authorized" };
  }
  if (
    !input.relatedOrganizationId ||
    !input.programmeOrganizationId ||
    !input.programmeTenantId ||
    !recipientIsRelatedToCommercialFile({
      relatedOrganizationId: input.relatedOrganizationId,
      programmeOrganizationId: input.programmeOrganizationId,
      tenantId: input.principal.tenantId,
      programmeTenantId: input.programmeTenantId,
    })
  ) {
    return { ok: false, error: "recipient_unrelated" };
  }
  try {
    assertIssuedClientDocumentPayloadSanitized(input.document.clientContent);
  } catch {
    return { ok: false, error: "document_not_client_safe" };
  }
  if (hashIssuedClientDocumentContent(input.document.clientContent) !== input.document.contentSha256) {
    return { ok: false, error: "content_hash_mismatch" };
  }
  if (input.pdfBytes == null) return { ok: false, error: "artifact_missing" };
  if (input.pdfBytes.byteLength === 0) return { ok: false, error: "artifact_missing" };
  if (hashIssuedClientDocumentArtifact(input.pdfBytes) !== input.document.artifactSha256) {
    return { ok: false, error: "artifact_hash_mismatch" };
  }
  if (issuedClientDocumentPdfContainsForbidden(input.pdfBytes)) {
    return { ok: false, error: "document_not_client_safe" };
  }
  const namedOlder = input.authorizeSupersededDocument === true;
  if (!namedOlder && input.programmeIssued && isIssuedProposalSupersededForSend(input.issued, input.programmeIssued)) {
    return { ok: false, error: "issued_proposal_superseded" };
  }
  if (
    !namedOlder &&
    input.siblingDocuments &&
    isIssuedClientDocumentSupersededForSend(input.document, input.siblingDocuments)
  ) {
    return { ok: false, error: "document_superseded" };
  }
  return { ok: true };
}

export function createIssuedClientDocumentDelivery(input: {
  document: IssuedClientDocument;
  issued: IssuedProposal;
  principal: Principal;
  recipientEmail: string;
  relatedOrganizationId: string;
  clientIdempotencyKey?: string;
  authorizeSupersededDocument?: boolean;
  authorizedAt?: string;
}): IssuedClientDocumentDelivery | { error: IssuedClientDocumentDeliveryEligibilityError } {
  const authority = clientIssueApprovalAuthority(input.principal);
  if (!authority) return { error: "b2_authorization_required" };
  const now = input.authorizedAt ?? new Date().toISOString();
  const id = newId();
  const record: IssuedClientDocumentDelivery = {
    id,
    deliveryCode: buildIssuedClientDocumentDeliveryCode(),
    kind: ISSUED_CLIENT_DOCUMENT_DELIVERY_KIND,
    tenantId: input.document.tenantId,
    issuedClientDocumentId: input.document.id,
    documentCode: input.document.documentCode,
    issuedProposalId: input.issued.id,
    issuedCode: input.issued.issuedCode,
    programmeId: input.issued.programmeId,
    relatedOrganizationId: input.relatedOrganizationId,
    recipientEmail: normalizeDeliveryRecipientEmail(input.recipientEmail),
    recipientConfirmed: true,
    senderKey: DEVTEST_DELIVERY_SENDER.key,
    senderOrganizationName: DEVTEST_DELIVERY_SENDER.organizationName,
    senderAddress: DEVTEST_DELIVERY_SENDER.address,
    senderMode: DEVTEST_DELIVERY_SENDER.mode,
    authorizationPrincipalId: input.principal.id,
    authorizationAuthority: authority,
    authorizedAt: now,
    contentSha256: input.document.contentSha256,
    artifactSha256: input.document.artifactSha256,
    idempotencyKey: deliveryIdempotencyKey({
      tenantId: input.document.tenantId,
      documentId: input.document.id,
      recipientEmail: input.recipientEmail,
      ...(input.clientIdempotencyKey !== undefined ? { clientIdempotencyKey: input.clientIdempotencyKey } : {}),
    }),
    templateVersion: ISSUED_CLIENT_DOCUMENT_DELIVERY_TEMPLATE_VERSION,
    authorizeSupersededDocument: input.authorizeSupersededDocument === true,
    state: "queued",
    immutable: true,
    createdAt: now,
  };
  if (
    !issuedClientDocumentDeliveryIdentityDistinct({
      deliveryId: record.id,
      deliveryCode: record.deliveryCode,
      documentId: record.issuedClientDocumentId,
      documentCode: record.documentCode,
      issuedProposalId: record.issuedProposalId,
      issuedCode: record.issuedCode,
      rfpId: input.issued.rfpId,
      ...(input.issued.c8ProposalId ? { c8ProposalId: input.issued.c8ProposalId } : {}),
    })
  ) {
    throw new Error("issued_client_document_delivery_identity_collision");
  }
  Object.freeze(record);
  return record;
}

export function createIssuedClientDocumentDeliveryAttempt(input: {
  delivery: IssuedClientDocumentDelivery;
  document: IssuedClientDocument;
  principal: Principal;
  attemptNumber: number;
  result: IssuedClientDocumentDeliveryAttempt["result"];
  requestedAt?: string;
  failureReason?: string;
  providerReference?: string;
}): IssuedClientDocumentDeliveryAttempt {
  const now = input.requestedAt ?? new Date().toISOString();
  const id = newId();
  const record: IssuedClientDocumentDeliveryAttempt = {
    id,
    attemptCode: buildIssuedClientDocumentDeliveryAttemptCode(),
    kind: ISSUED_CLIENT_DOCUMENT_DELIVERY_ATTEMPT_KIND,
    tenantId: input.delivery.tenantId,
    deliveryId: input.delivery.id,
    deliveryCode: input.delivery.deliveryCode,
    issuedClientDocumentId: input.delivery.issuedClientDocumentId,
    issuedProposalId: input.delivery.issuedProposalId,
    recipientEmail: input.delivery.recipientEmail,
    contentSha256: input.document.contentSha256,
    artifactSha256: input.document.artifactSha256,
    attemptNumber: input.attemptNumber,
    requestedAt: now,
    result: input.result,
    recipientDelivered: false,
    providerName: "devtest-mock",
    actorPrincipalId: input.principal.id,
    immutable: true,
    createdAt: now,
  };
  if (input.failureReason !== undefined) record.failureReason = input.failureReason;
  if (input.providerReference !== undefined) record.providerReference = input.providerReference;
  Object.freeze(record);
  return record;
}

export function deriveIssuedClientDocumentDeliveryState(
  delivery: IssuedClientDocumentDelivery,
  attempts: IssuedClientDocumentDeliveryAttempt[],
): IssuedClientDocumentDeliveryState {
  const ordered = [...attempts]
    .filter((a) => a.deliveryId === delivery.id)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);
  if (ordered.some((a) => a.result === "accepted_by_provider")) return "accepted_by_provider";
  const latest = ordered[ordered.length - 1];
  if (!latest) return "queued";
  if (latest.result === "cancelled") return "cancelled";
  return "failed";
}

export function createDevTestMockDeliveryProvider(
  behavior: MockDeliveryProviderBehavior = "accept",
): IssuedClientDocumentDeliveryProvider {
  return {
    name: "devtest-mock",
    contactsInternet: false,
    contactsSmtp: false,
    usesProductionCredentials: false,
    recipientDeliveredMeansMailbox: false,
    async send(input) {
      if (hashIssuedClientDocumentArtifact(input.pdfBytes) !== input.artifactSha256) {
        return { status: "failed", providerName: "devtest-mock", failureReason: "provider_rejected", recipientDelivered: false };
      }
      if (behavior === "reject") {
        return { status: "failed", providerName: "devtest-mock", failureReason: "provider_rejected", recipientDelivered: false };
      }
      if (behavior === "timeout") {
        return { status: "failed", providerName: "devtest-mock", failureReason: "provider_timeout", recipientDelivered: false };
      }
      return {
        status: "accepted_by_provider",
        providerName: "devtest-mock",
        providerReference: `mock-devtest-${sha256(input.artifactSha256).slice(0, 16)}`,
        recipientDelivered: false,
      };
    },
  };
}
