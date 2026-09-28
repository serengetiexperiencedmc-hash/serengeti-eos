import { createHash } from "node:crypto";
import { canonicalJson, newId, sha256 } from "./crypto.js";
import {
  ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS,
  ISSUED_PROPOSAL_DELIVERY,
  issuedClientSafeContainsForbidden,
  pickIssuedClientSafe,
  type IssuedClientSafeRepresentation,
  type IssuedProposal,
} from "./issued-proposal.js";
import type { Principal } from "./types.js";

/** Internal client-document generation from an ISS snapshot. Not delivery. */
export const ISSUED_CLIENT_DOCUMENT_KIND = "issued_client_pdf" as const;
export const ISSUED_CLIENT_DOCUMENT_TYPE = "client_proposal_pdf" as const;
export const ISSUED_CLIENT_DOCUMENT_STATUS = "generated" as const;
export const ISSUED_CLIENT_DOCUMENT_MIME = "application/pdf" as const;
export const ISSUED_CLIENT_DOCUMENT_GENERATION_CONTEXT = "internal_document_generation" as const;

export const ISSUED_CLIENT_DOCUMENT_GENERATION = {
  implemented: true,
  delivery: false,
  email: false,
  dispatch: false,
  clientAccess: false,
} as const;

export type IssuedClientDocumentPayload = IssuedClientSafeRepresentation & {
  issuedCode: string;
};

export type IssuedClientDocument = {
  id: string;
  documentCode: string;
  kind: typeof ISSUED_CLIENT_DOCUMENT_KIND;
  tenantId: string;
  issuedProposalId: string;
  issuedCode: string;
  documentType: typeof ISSUED_CLIENT_DOCUMENT_TYPE;
  sequence: number;
  generatedAt: string;
  generatedByPrincipalId: string;
  generationContext: typeof ISSUED_CLIENT_DOCUMENT_GENERATION_CONTEXT;
  status: typeof ISSUED_CLIENT_DOCUMENT_STATUS;
  contentSha256: string;
  artifactSha256: string;
  mimeType: typeof ISSUED_CLIENT_DOCUMENT_MIME;
  sizeBytes: number;
  storageRef: string;
  clientContent: IssuedClientDocumentPayload;
  immutable: true;
  createdAt: string;
};

const FORBIDDEN_CONTENT_PATTERNS = [
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
  /costLineItems/i,
  /internalSnapshot/i,
  /workflow/i,
  /\baudit\b/i,
];

export function buildIssuedClientDocumentCode(): string {
  return `DOC-${newId()}`;
}

export function issuedClientDocumentIdentityDistinct(input: {
  documentId: string;
  documentCode: string;
  issuedProposalId: string;
  issuedCode: string;
  c8ProposalId?: string;
}): boolean {
  if (input.documentId === input.issuedProposalId) return false;
  if (input.documentCode === input.issuedCode) return false;
  if (input.c8ProposalId && (input.documentId === input.c8ProposalId || input.issuedProposalId === input.c8ProposalId)) {
    return false;
  }
  return input.documentCode.startsWith("DOC-") && input.issuedCode.startsWith("ISS-");
}

export function composeIssuedClientDocumentPayload(issued: IssuedProposal): IssuedClientDocumentPayload {
  const clientSafe = pickIssuedClientSafe(issued.clientSafe as unknown as Record<string, unknown>);
  if (issuedClientSafeContainsForbidden(clientSafe as unknown as Record<string, unknown>)) {
    throw new Error("issued_client_safe_contains_forbidden");
  }
  const payload: IssuedClientDocumentPayload = {
    ...clientSafe,
    issuedCode: issued.issuedCode,
  };
  assertIssuedClientDocumentPayloadSanitized(payload);
  return payload;
}

export function hashIssuedClientDocumentContent(payload: IssuedClientDocumentPayload): string {
  return sha256(canonicalJson(payload));
}

export function hashIssuedClientDocumentArtifact(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function assertIssuedClientDocumentPayloadSanitized(payload: unknown): void {
  if (!payload || typeof payload !== "object") throw new Error("issued_client_document_payload_invalid");
  const record = payload as Record<string, unknown>;
  if (issuedClientSafeContainsForbidden(record)) {
    throw new Error("issued_client_document_payload_forbidden");
  }
  for (const key of ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      throw new Error("issued_client_document_payload_forbidden");
    }
  }
  const blob = JSON.stringify(payload);
  for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
    if (pattern.test(blob)) throw new Error("issued_client_document_payload_forbidden");
  }
}

export function issuedClientDocumentPdfContainsForbidden(pdfBytes: Uint8Array): boolean {
  const text = Buffer.from(pdfBytes).toString("latin1");
  return FORBIDDEN_CONTENT_PATTERNS.some((pattern) => pattern.test(text));
}

function toWinAnsi(value: string): string {
  return [...value].map((ch) => (ch.charCodeAt(0) < 128 ? ch : "?")).join("");
}

function pdfEscape(value: string): string {
  return toWinAnsi(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function payloadLines(payload: IssuedClientDocumentPayload): string[] {
  const lines = [
    payload.issuingEntity,
    "Client proposal",
    `Issued reference: ${payload.issuedCode}`,
    `Programme: ${payload.programmeTitle} (${payload.programmeCode})`,
  ];
  if (payload.startDate || payload.endDate) {
    lines.push(`Dates: ${payload.startDate ?? ""} - ${payload.endDate ?? ""}`.trim());
  }
  if (payload.nights !== undefined) lines.push(`Nights: ${payload.nights}`);
  if (payload.paxCount !== undefined) lines.push(`Pax: ${payload.paxCount}`);
  if (payload.destinations) lines.push(`Destination: ${payload.destinations}`);
  lines.push(`Currency: ${payload.currency}`);
  lines.push(`Client selling price: ${payload.clientSellingPrice} ${payload.currency}`);
  if (payload.depositPercent !== undefined) lines.push(`Deposit: ${payload.depositPercent}%`);
  if (payload.paymentMilestones?.length) {
    lines.push("Payment schedule:");
    for (const milestone of payload.paymentMilestones) {
      lines.push(`  ${milestone.label}: ${milestone.percent}%`);
    }
  }
  if (payload.inclusionsText) lines.push(`Inclusions: ${payload.inclusionsText}`);
  if (payload.exclusionsText) lines.push(`Exclusions: ${payload.exclusionsText}`);
  if (payload.itinerary.length) {
    lines.push("Itinerary:");
    for (const day of payload.itinerary) {
      const loc = day.location ? ` (${day.location})` : "";
      const date = day.calendarDate ? ` ${day.calendarDate}` : "";
      lines.push(`Day ${day.dayNumber}: ${day.title}${loc}${date}`);
      for (const item of day.items) {
        lines.push(`  - ${item.title}`);
      }
    }
  }
  return lines;
}

function wrapLine(line: string, max = 90): string[] {
  if (line.length <= max) return [line];
  const out: string[] = [];
  let rest = line;
  while (rest.length > max) {
    out.push(rest.slice(0, max));
    rest = rest.slice(max);
  }
  if (rest.length) out.push(rest);
  return out;
}

/** Deterministic PDF from the frozen client payload only. No generation timestamp in the content stream. */
export function renderIssuedClientDocumentPdf(payload: IssuedClientDocumentPayload): Uint8Array {
  assertIssuedClientDocumentPayloadSanitized(payload);
  const lines = payloadLines(payload).flatMap((line) => wrapLine(line));
  const pages: string[][] = [];
  const perPage = 48;
  for (let i = 0; i < lines.length; i += perPage) {
    pages.push(lines.slice(i, i + perPage));
  }
  if (pages.length === 0) pages.push([payload.issuingEntity]);

  const objects: string[] = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
  const pageIds = pages.map((_, idx) => 3 + idx * 2);
  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(`2 0 obj << /Type /Pages /Kids [${kids}] /Count ${pages.length} >> endobj\n`);
  const fontId = 3 + pages.length * 2;
  pages.forEach((pageLines, idx) => {
    const pageId = 3 + idx * 2;
    const contentId = pageId + 1;
    const ops = pageLines
      .map((line, lineIdx) => {
        const prefix = lineIdx === 0 ? "BT /F1 11 Tf 50 760 Td " : "0 -14 Td ";
        return `${prefix}(${pdfEscape(line)}) Tj`;
      })
      .join("\n");
    const stream = `${ops}\nET\n`;
    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >> endobj\n`,
    );
    objects.push(`${contentId} 0 obj << /Length ${Buffer.byteLength(stream, "latin1")} >> stream\n${stream}endstream\nendobj\n`);
  });
  objects.push(`${fontId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n`);

  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(body, "latin1"));
    body += obj;
  }
  const xrefStart = Buffer.byteLength(body, "latin1");
  const count = objects.length + 1;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += xref;
  body += `trailer << /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  const bytes = Buffer.from(body, "latin1");
  if (issuedClientDocumentPdfContainsForbidden(bytes)) {
    throw new Error("issued_client_document_pdf_forbidden");
  }
  return bytes;
}

export function createIssuedClientDocument(input: {
  tenantId: string;
  issued: IssuedProposal;
  generatedBy: Principal;
  sequence: number;
  pdfBytes: Uint8Array;
  generatedAt?: string;
}): IssuedClientDocument | { error: "issued_proposal_required" } {
  if (input.issued.kind !== "issued_proposal" || !input.issued.issuedCode.startsWith("ISS-")) {
    return { error: "issued_proposal_required" };
  }
  const clientContent = composeIssuedClientDocumentPayload(input.issued);
  const now = input.generatedAt ?? new Date().toISOString();
  const id = newId();
  const documentCode = buildIssuedClientDocumentCode();
  const record: IssuedClientDocument = {
    id,
    documentCode,
    kind: ISSUED_CLIENT_DOCUMENT_KIND,
    tenantId: input.tenantId,
    issuedProposalId: input.issued.id,
    issuedCode: input.issued.issuedCode,
    documentType: ISSUED_CLIENT_DOCUMENT_TYPE,
    sequence: input.sequence,
    generatedAt: now,
    generatedByPrincipalId: input.generatedBy.id,
    generationContext: ISSUED_CLIENT_DOCUMENT_GENERATION_CONTEXT,
    status: ISSUED_CLIENT_DOCUMENT_STATUS,
    contentSha256: hashIssuedClientDocumentContent(clientContent),
    artifactSha256: hashIssuedClientDocumentArtifact(input.pdfBytes),
    mimeType: ISSUED_CLIENT_DOCUMENT_MIME,
    sizeBytes: input.pdfBytes.byteLength,
    storageRef: `${input.tenantId}/${id}`,
    clientContent,
    immutable: true,
    createdAt: now,
  };
  if (
    !issuedClientDocumentIdentityDistinct({
      documentId: record.id,
      documentCode: record.documentCode,
      issuedProposalId: record.issuedProposalId,
      issuedCode: record.issuedCode,
      ...(input.issued.c8ProposalId ? { c8ProposalId: input.issued.c8ProposalId } : {}),
    })
  ) {
    throw new Error("issued_client_document_identity_collision");
  }
  Object.freeze(record);
  Object.freeze(record.clientContent);
  return record;
}

export function issuedClientDocumentDeliveryUnauthorized(): typeof ISSUED_PROPOSAL_DELIVERY {
  return ISSUED_PROPOSAL_DELIVERY;
}
