import {
  authorize,
  isSupplierRateSourceClass,
  isSupplierRateTypeKey,
  isSupplierRateValidityCurrent,
  newId,
  SUPPLIER_RATE_SOURCE_CLASSES,
  SUPPLIER_RATE_TYPE_KEYS,
  SUPPLIER_RATE_TYPE_LABELS,
  type Principal,
  type SupRate,
  type SupplierRateSourceClass,
  type SupplierRateTypeKey,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { lookupRate, lookupSupplier } from "./entity-lookup.js";
import { type F2RateIdentity } from "./memory.js";
import { f2Dp01DurablePreviewBlock, f2FactsPersistenceMeta, readRateIdentities, writeRateIdentity } from "./persist.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i6_in_memory_preview_only" };
const ISO_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const SUPPLIER_RATE_SOURCE_CLASS_LABELS: Record<SupplierRateSourceClass, string> = {
  direct_supplier_contract: "Direct supplier contract/agreement",
  supplier_contracted_rate_sheet: "Supplier-issued contracted rate sheet",
  written_supplier_quotation: "Written supplier quotation",
  trade_partner_net_agreement: "Approved trade/net rate",
  public_benchmark: "Public benchmark, only where explicitly approved",
};

function resolveSourceClass(value: string): SupplierRateSourceClass | undefined {
  if (isSupplierRateSourceClass(value)) return value;
  return SUPPLIER_RATE_SOURCE_CLASSES.find((key) => SUPPLIER_RATE_SOURCE_CLASS_LABELS[key] === value);
}

function resolveRateType(value: string): SupplierRateTypeKey | undefined {
  if (isSupplierRateTypeKey(value)) return value;
  return SUPPLIER_RATE_TYPE_KEYS.find((key) => SUPPLIER_RATE_TYPE_LABELS[key] === value);
}

function datePrefix(iso: string): string {
  return iso.slice(0, 10);
}

export function rateValidityState(
  facts: Pick<F2RateIdentity, "validFrom" | "validTo">,
  atIso: string,
): "current" | "future" | "expired" {
  const at = datePrefix(atIso);
  if (at < facts.validFrom) return "future";
  if (at > facts.validTo) return "expired";
  return "current";
}

export function rateIdentityView(
  identity: F2RateIdentity,
  rate: SupRate,
  supplier: { id: string; supplierCode: string; legalName: string },
  atIso: string,
  snapshotIdentity?: string,
) {
  return {
    identityId: identity.identityId,
    rateId: identity.rateId,
    supplierId: supplier.id,
    supplierCode: supplier.supplierCode,
    supplierLegalName: supplier.legalName,
    itemIdentity: identity.itemIdentity ?? rate.rateCode,
    rateCode: rate.rateCode,
    rateName: rate.rateName,
    versionIdentity: identity.versionIdentity,
    sourceClass: identity.sourceClass,
    sourceClassLabel: SUPPLIER_RATE_SOURCE_CLASS_LABELS[identity.sourceClass],
    rateType: identity.rateType,
    rateTypeLabel: SUPPLIER_RATE_TYPE_LABELS[identity.rateType],
    originalCurrency: identity.originalCurrency,
    seasonLabel: identity.seasonLabel,
    seasonId: identity.seasonId,
    validFrom: identity.validFrom,
    validTo: identity.validTo,
    sourceDate: identity.sourceDate,
    verificationDate: identity.verificationDate,
    expiry: identity.expiry,
    currentlyValid: isSupplierRateValidityCurrent(identity, datePrefix(atIso)),
    validityState: rateValidityState(identity, atIso),
    snapshotIdentity,
    amountIsNotIdentity: true as const,
    legacyAmount: rate.amount,
    legacyUnitRateType: rate.rateType,
    legacyUnitRateTypeAuthoritativeForF2: false as const,
    legacyCurrency: rate.currency,
    legacyCurrencyAuthoritativeForF2: false as const,
    fxProviderImplemented: false as const,
    overlapWinnerInvented: false as const,
    preferredInConflictAuthoritativeForF2: false as const,
    inferredFromWebsite: false as const,
    or08Authoritative: true as const,
  };
}

export async function getRateCommercialFacts(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  atIso?: string,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const supplier = await lookupSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };
  const rate = await lookupRate(store, principal.tenantId, supplierId, rateId);
  if (!rate) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "supplier:read:supplier",
    action: "read:sup_rate",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const at = atIso ?? new Date().toISOString();
  const identities = (await readRateIdentities(store, principal.tenantId, rateId)).map((identity) =>
    rateIdentityView(identity, rate, supplier, at),
  );
  return {
    identities,
    overlapResolution: "none" as const,
    preferredInConflictAuthoritativeForF2: false as const,
    fxProviderImplemented: false as const,
    persistence: f2FactsPersistenceMeta(store, identities.length > 0),
  };
}

export type PutRateIdentityInput = {
  versionIdentity: number;
  sourceClass: string;
  rateType: string;
  originalCurrency: string;
  validFrom: string;
  validTo: string;
  seasonLabel?: string;
  seasonId?: string;
  sourceDate?: string;
  verificationDate?: string;
  expiry?: string;
  itemIdentity?: string;
};

export async function putRateCommercialFacts(
  store: Store,
  principal: Principal,
  supplierId: string,
  rateId: string,
  input: PutRateIdentityInput,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const supplier = await lookupSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };
  const rate = await lookupRate(store, principal.tenantId, supplierId, rateId);
  if (!rate) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action: "write:sup_rate",
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  if (typeof input.versionIdentity !== "number" || !Number.isInteger(input.versionIdentity) || input.versionIdentity < 1) {
    return { error: "invalid_request" as const, reason: "invalid_version_identity" };
  }
  const sourceClass = typeof input.sourceClass === "string" ? resolveSourceClass(input.sourceClass.trim()) : undefined;
  if (!sourceClass) return { error: "invalid_request" as const, reason: "invalid_source_class" };
  const rateType = typeof input.rateType === "string" ? resolveRateType(input.rateType.trim()) : undefined;
  if (!rateType) return { error: "invalid_request" as const, reason: "invalid_or08_rate_type" };
  const originalCurrency = (input.originalCurrency ?? "").trim().toUpperCase();
  if (!ISO_CURRENCY_PATTERN.test(originalCurrency)) {
    return { error: "invalid_request" as const, reason: "invalid_original_currency" };
  }
  if (!ISO_DATE_PATTERN.test(input.validFrom ?? "") || !ISO_DATE_PATTERN.test(input.validTo ?? "")) {
    return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
  }
  if (input.validFrom > input.validTo) return { error: "invalid_request" as const, reason: "invalid_validity_dates" };
  for (const [field, value] of [
    ["sourceDate", input.sourceDate],
    ["verificationDate", input.verificationDate],
    ["expiry", input.expiry],
  ] as const) {
    if (value !== undefined && value !== "" && !ISO_DATE_PATTERN.test(value)) {
      return { error: "invalid_request" as const, reason: `invalid_${field}` };
    }
  }

  const existing = await readRateIdentities(store, rate.tenantId, rateId);
  if (existing.some((row) => row.versionIdentity === input.versionIdentity)) {
    return { error: "conflict" as const, reason: "version_identity_exists" };
  }

  const now = new Date().toISOString();
  const identity: F2RateIdentity = {
    identityId: newId(),
    rateId: rate.id,
    tenantId: rate.tenantId,
    supplierId: supplier.id,
    versionIdentity: input.versionIdentity,
    sourceClass,
    rateType,
    originalCurrency,
    validFrom: input.validFrom,
    validTo: input.validTo,
    ...(input.seasonLabel?.trim() ? { seasonLabel: input.seasonLabel.trim() } : {}),
    ...(input.seasonId?.trim() ? { seasonId: input.seasonId.trim() } : {}),
    ...(input.sourceDate && ISO_DATE_PATTERN.test(input.sourceDate) ? { sourceDate: input.sourceDate } : {}),
    ...(input.verificationDate && ISO_DATE_PATTERN.test(input.verificationDate)
      ? { verificationDate: input.verificationDate }
      : {}),
    ...(input.expiry && ISO_DATE_PATTERN.test(input.expiry) ? { expiry: input.expiry } : {}),
    itemIdentity: input.itemIdentity?.trim() || rate.rateCode,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  await writeRateIdentity(store, rateId, [...existing, identity], identity);
  const listed = await getRateCommercialFacts(store, principal, supplierId, rateId, now);
  if ("error" in listed) return listed;
  return { identity: rateIdentityView(identity, rate, supplier, now), ...listed };
}

export async function getCostSheetRateIdentities(store: Store, principal: Principal, sheetId: string, atIso?: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const sheet = store.costSheets.find((s) => s.id === sheetId && s.tenantId === principal.tenantId && !s.archivedAt);
  if (!sheet) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "costing:read:sheet",
    action: "read:cost_sheet",
    resource: {
      tenantId: sheet.tenantId,
      type: "cost_sheet",
      id: sheet.id,
      classification: sheet.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const at = atIso ?? new Date().toISOString();
  const snapshotIdentity = `cost-sheet:${sheet.id}:v${sheet.currentVersion}`;
  const lines = store.costLineItems.filter((l) => l.costSheetId === sheet.id && l.tenantId === principal.tenantId);
  const rateIds = [
    ...new Set(lines.map((l) => l.supplierRateId).filter((id): id is string => Boolean(id))),
  ];
  const identitiesByRate = new Map<string, F2RateIdentity[]>();
  for (const id of rateIds) {
    identitiesByRate.set(id, await readRateIdentities(store, principal.tenantId, id));
  }
  const consumed = lines.map((line) => {
    if (!line.supplierRateId) {
      return {
        lineId: line.id,
        supplierRateId: undefined,
        or08Authoritative: false as const,
        identities: [] as ReturnType<typeof rateIdentityView>[],
      };
    }
    const rate = store.supRates.find((r) => r.id === line.supplierRateId && r.tenantId === principal.tenantId);
    const supplier = rate
      ? store.supSuppliers.find((s) => s.id === rate.supplierId && s.tenantId === principal.tenantId)
      : undefined;
    const identities = rate && supplier
      ? (identitiesByRate.get(rate.id) ?? []).map((identity) =>
          rateIdentityView(identity, rate, supplier, at, snapshotIdentity),
        )
      : [];
    return {
      lineId: line.id,
      supplierRateId: line.supplierRateId,
      or08Authoritative: identities.length > 0,
      identities,
    };
  });

  return {
    costSheetId: sheet.id,
    snapshotIdentity,
    costSheetVersionSnapshotModified: false as const,
    fxProviderImplemented: false as const,
    overlapResolution: "none" as const,
    lines: consumed,
  };
}
