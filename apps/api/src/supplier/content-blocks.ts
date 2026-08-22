import {
  authorize,
  newId,
  SUPPLIER_CONTENT_BLOCK_STATUSES,
  SUPPLIER_CONTENT_BLOCK_TYPES,
  type Principal,
  type SupContentBlock,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";

const BLOCK_CODE_PATTERN = /^[A-Z0-9_-]{2,48}$/;

function sanitizeBlock(b: SupContentBlock) {
  return {
    id: b.id,
    supplierId: b.supplierId,
    blockCode: b.blockCode,
    blockType: b.blockType,
    title: b.title,
    body: b.body,
    language: b.language,
    isDefault: b.isDefault,
    status: b.status,
    version: b.version,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
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
    denySupplierAudit(
      store,
      principal,
      "supplier:write:supplier",
      "sup_content_block",
      correlationId,
      decision.reason,
      supplierId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return { supplier };
}

export type CreateContentBlockInput = {
  blockCode: string;
  blockType: string;
  body: string;
  title?: string;
  language?: string;
  isDefault?: boolean;
  status?: string;
};

export type UpdateContentBlockInput = {
  blockType?: string;
  body?: string;
  title?: string | null;
  language?: string;
  isDefault?: boolean;
  status?: string;
};

export function createSupplierContentBlock(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: CreateContentBlockInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_content_block");
  if ("error" in auth) return auth;

  const blockCode = (input.blockCode ?? "").trim().toUpperCase();
  if (!BLOCK_CODE_PATTERN.test(blockCode)) return { error: "invalid_request" as const, reason: "invalid_block_code" };
  if (!(SUPPLIER_CONTENT_BLOCK_TYPES as readonly string[]).includes(input.blockType)) {
    return { error: "invalid_request" as const, reason: "invalid_block_type" };
  }
  if (!input.body?.trim()) return { error: "invalid_request" as const, reason: "body_required" };
  const status = input.status?.trim() || "draft";
  if (!(SUPPLIER_CONTENT_BLOCK_STATUSES as readonly string[]).includes(status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  const duplicate = store.supContentBlocks.some(
    (b) =>
      b.tenantId === principal.tenantId && b.supplierId === supplierId && !b.archivedAt && b.blockCode === blockCode,
  );
  if (duplicate) return { error: "conflict" as const, reason: "block_code_exists" };

  const now = new Date().toISOString();
  const block: SupContentBlock = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    blockCode,
    blockType: input.blockType,
    ...(input.title?.trim() ? { title: input.title.trim() } : {}),
    body: input.body.trim(),
    language: input.language?.trim() || "en",
    isDefault: input.isDefault ?? false,
    status,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  if (block.isDefault) {
    for (const b of store.supContentBlocks) {
      if (b.supplierId === supplierId && b.blockType === block.blockType && !b.archivedAt) b.isDefault = false;
    }
  }

  store.supContentBlocks.push(block);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_content_block", block.id, correlationId, {
    supplierId,
    blockCode: block.blockCode,
    eventType: "supplier.content_block.created.v1",
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_content_block", block.id);
  return { contentBlock: sanitizeBlock(block) };
}

export function updateSupplierContentBlock(
  store: Store,
  principal: Principal,
  supplierId: string,
  blockId: string,
  input: UpdateContentBlockInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_content_block");
  if ("error" in auth) return auth;

  const block = store.supContentBlocks.find(
    (b) => b.id === blockId && b.supplierId === supplierId && b.tenantId === principal.tenantId && !b.archivedAt,
  );
  if (!block) return { error: "not_found" as const };

  if (input.blockType !== undefined) {
    if (!(SUPPLIER_CONTENT_BLOCK_TYPES as readonly string[]).includes(input.blockType)) {
      return { error: "invalid_request" as const, reason: "invalid_block_type" };
    }
    block.blockType = input.blockType;
  }
  if (input.body !== undefined) {
    if (!input.body.trim()) return { error: "invalid_request" as const, reason: "body_required" };
    block.body = input.body.trim();
  }
  if (input.title !== undefined) {
    if (input.title === null || input.title.trim() === "") delete block.title;
    else block.title = input.title.trim();
  }
  if (input.language !== undefined) block.language = input.language.trim() || "en";
  if (input.status !== undefined) {
    if (!(SUPPLIER_CONTENT_BLOCK_STATUSES as readonly string[]).includes(input.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    block.status = input.status;
  }
  if (input.isDefault !== undefined) {
    block.isDefault = input.isDefault;
    if (block.isDefault) {
      for (const b of store.supContentBlocks) {
        if (b.id !== block.id && b.supplierId === supplierId && b.blockType === block.blockType && !b.archivedAt) {
          b.isDefault = false;
        }
      }
    }
  }

  block.version += 1;
  block.updatedAt = new Date().toISOString();
  block.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_content_block", block.id, correlationId, {
    supplierId,
    version: block.version,
    eventType: "supplier.content_block.updated.v1",
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_content_block", block.id);
  return { contentBlock: sanitizeBlock(block) };
}

export function archiveSupplierContentBlock(
  store: Store,
  principal: Principal,
  supplierId: string,
  blockId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "archive:sup_content_block");
  if ("error" in auth) return auth;

  const block = store.supContentBlocks.find(
    (b) => b.id === blockId && b.supplierId === supplierId && b.tenantId === principal.tenantId && !b.archivedAt,
  );
  if (!block) return { error: "not_found" as const };

  block.archivedAt = new Date().toISOString();
  block.version += 1;
  block.updatedAt = block.archivedAt;
  block.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_content_block", block.id, correlationId, {
    supplierId,
    eventType: "supplier.content_block.archived.v1",
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_content_block", block.id);
  return { contentBlock: sanitizeBlock(block) };
}
