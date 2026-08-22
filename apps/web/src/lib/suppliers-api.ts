import { eosFetch } from "./eos-client";

export type SupplierSummary = {
  id: string;
  supplierCode: string;
  legalName: string;
  tradingName?: string;
  category: string;
  subcategory?: string;
  country: string;
  region?: string;
  city?: string;
  status: string;
  preferredPartner: boolean;
  defaultCurrency?: string;
  dataQualityStatus: string;
  archivedAt?: string;
};

export type SupplierDetail = {
  supplier: SupplierSummary;
  contacts: Array<{
    id: string;
    contactRole: string;
    givenName: string;
    familyName: string;
    email?: string;
    isPrimary: boolean;
  }>;
  rates: Array<{
    id: string;
    rateCode: string;
    rateName: string;
    amount: number;
    currency: string;
    validFrom: string;
    validTo: string;
    seasonLabel?: string;
    status: string;
  }>;
  contentBlocks: Array<{
    id: string;
    blockCode: string;
    blockType: string;
    title?: string;
    status: string;
  }>;
};

export type ImportBatch = {
  id: string;
  sourceSystem: string;
  entityType: string;
  mode: string;
  status: string;
  rowCount: number;
  validCount?: number;
  invalidCount?: number;
  committedCount?: number;
  validationResults?: Array<{
    rowNumber: number;
    status: string;
    errors?: string[];
    entityId?: string;
  }>;
  createdAt: string;
  validatedAt?: string;
  committedAt?: string;
};

export type SupplierImportEntityType =
  | "supplier"
  | "supplier_contact"
  | "supplier_rate"
  | "supplier_content_block";

export const IMPORT_ENTITY_OPTIONS: Array<{ value: SupplierImportEntityType; label: string }> = [
  { value: "supplier", label: "Suppliers (master)" },
  { value: "supplier_contact", label: "Contacts" },
  { value: "supplier_rate", label: "Rate cards" },
  { value: "supplier_content_block", label: "Content blocks" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  accommodation: "Accommodation",
  vehicle_hire: "Vehicle Hire",
  excursion: "Excursions",
  av_entertainment: "AV & Entertainment",
  decor: "Décor",
  catering: "Catering",
  venue: "Venue",
  guide_staff: "Guide & Staff",
  air_charter: "Air Charter",
  miscellaneous: "Miscellaneous",
};

export function formatCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, " ");
}

export async function listSuppliers(
  token: string,
  query: {
    category?: string;
    status?: string;
    country?: string;
    preferredPartner?: boolean;
    q?: string;
    archived?: boolean;
    limit?: number;
    offset?: number;
  } = {},
): Promise<{ items: SupplierSummary[]; total?: number; increment?: string }> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);
  if (query.country) params.set("country", query.country);
  if (query.preferredPartner === true) params.set("preferredPartner", "1");
  if (query.preferredPartner === false) params.set("preferredPartner", "0");
  if (query.q) params.set("q", query.q);
  if (query.archived) params.set("archived", "1");
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));
  const qs = params.toString();
  return eosFetch(`/v1/suppliers${qs ? `?${qs}` : ""}`, { token });
}

export type SupplierFacets = {
  category: Array<{ value: string; count: number }>;
  status: Array<{ value: string; count: number }>;
  country: Array<{ value: string; count: number }>;
  preferredPartner: Array<{ value: string; count: number }>;
};

export async function getSupplierFacets(
  token: string,
  query: {
    category?: string;
    status?: string;
    country?: string;
    preferredPartner?: boolean;
    q?: string;
    archived?: boolean;
  } = {},
) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);
  if (query.country) params.set("country", query.country);
  if (query.preferredPartner === true) params.set("preferredPartner", "1");
  if (query.preferredPartner === false) params.set("preferredPartner", "0");
  if (query.q) params.set("q", query.q);
  if (query.archived) params.set("archived", "1");
  const qs = params.toString();
  return eosFetch<{ facets: SupplierFacets; total: number; increment: string }>(
    `/v1/suppliers/facets${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function getSupplier(token: string, id: string): Promise<SupplierDetail> {
  return eosFetch(`/v1/suppliers/${id}`, { token });
}

export async function createImportBatch(
  token: string,
  input: { sourceSystem: string; entityType: SupplierImportEntityType; csv: string; mode?: string },
): Promise<{ batch: ImportBatch }> {
  return eosFetch("/v1/suppliers/imports", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function validateImportBatch(
  token: string,
  batchId: string,
): Promise<{ batch: ImportBatch }> {
  return eosFetch(`/v1/suppliers/imports/${batchId}/validate`, {
    method: "POST",
    token,
  });
}

export async function executeImportBatch(
  token: string,
  batchId: string,
  idempotencyKey: string,
): Promise<{ batch: ImportBatch; replay?: boolean }> {
  return eosFetch(`/v1/suppliers/imports/${batchId}/execute`, {
    method: "POST",
    token,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export async function createSupplier(
  token: string,
  input: {
    supplierCode: string;
    legalName: string;
    tradingName?: string;
    category: string;
    country: string;
    region?: string;
    city?: string;
    status?: string;
    preferredPartner?: boolean;
    defaultCurrency?: string;
    notes?: string;
  },
): Promise<{ supplier: SupplierSummary }> {
  return eosFetch("/v1/suppliers", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function updateSupplier(
  token: string,
  id: string,
  input: {
    legalName?: string;
    tradingName?: string | null;
    category?: string;
    country?: string;
    region?: string | null;
    city?: string | null;
    status?: string;
    preferredPartner?: boolean;
    defaultCurrency?: string | null;
    notes?: string | null;
  },
): Promise<{ supplier: SupplierSummary }> {
  return eosFetch(`/v1/suppliers/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export async function archiveSupplier(token: string, id: string) {
  return eosFetch<{
    supplier: SupplierSummary;
    cascaded: { contacts: number; rates: number; contentBlocks: number };
  }>(`/v1/suppliers/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreSupplier(token: string, id: string) {
  return eosFetch<{
    supplier: SupplierSummary;
    restored: { contacts: number; rates: number; contentBlocks: number };
  }>(`/v1/suppliers/${id}/restore`, {
    method: "POST",
    token,
    body: "{}",
  });
}

export async function createSupplierContact(
  token: string,
  supplierId: string,
  input: {
    contactRole: string;
    givenName: string;
    familyName: string;
    email?: string;
    telephone?: string;
    isPrimary?: boolean;
  },
) {
  return eosFetch<{ contact: SupplierDetail["contacts"][number] }>(`/v1/suppliers/${supplierId}/contacts`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function archiveSupplierContact(token: string, supplierId: string, contactId: string) {
  return eosFetch(`/v1/suppliers/${supplierId}/contacts/${contactId}`, {
    method: "DELETE",
    token,
  });
}

export async function createSupplierRate(
  token: string,
  supplierId: string,
  input: {
    rateCode: string;
    rateName: string;
    rateType: string;
    amount: number;
    currency: string;
    validFrom: string;
    validTo: string;
    seasonLabel?: string;
    status?: string;
  },
) {
  return eosFetch<{ rate: SupplierDetail["rates"][number] }>(`/v1/suppliers/${supplierId}/rates`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function archiveSupplierRate(token: string, supplierId: string, rateId: string) {
  return eosFetch(`/v1/suppliers/${supplierId}/rates/${rateId}`, {
    method: "DELETE",
    token,
  });
}

export async function createSupplierContentBlock(
  token: string,
  supplierId: string,
  input: {
    blockCode: string;
    blockType: string;
    body: string;
    title?: string;
    language?: string;
    isDefault?: boolean;
    status?: string;
  },
) {
  return eosFetch<{ contentBlock: SupplierDetail["contentBlocks"][number] }>(
    `/v1/suppliers/${supplierId}/content-blocks`,
    {
      method: "POST",
      token,
      body: JSON.stringify(input),
    },
  );
}

export async function archiveSupplierContentBlock(token: string, supplierId: string, blockId: string) {
  return eosFetch(`/v1/suppliers/${supplierId}/content-blocks/${blockId}`, {
    method: "DELETE",
    token,
  });
}

export async function getSupplierRateCalendar(
  token: string,
  query: { from: string; to: string; supplierId?: string; seasonLabel?: string },
) {
  const params = new URLSearchParams({ from: query.from, to: query.to });
  if (query.supplierId) params.set("supplierId", query.supplierId);
  if (query.seasonLabel) params.set("seasonLabel", query.seasonLabel);
  return eosFetch<{
    from: string;
    to: string;
    items: SupplierDetail["rates"];
    seasons: Array<{ label: string; count: number; rates: SupplierDetail["rates"] }>;
    months: Array<{ month: string; count: number; rates: SupplierDetail["rates"] }>;
    conflicts: Array<{
      supplierId: string;
      rateType: string;
      overlapFrom: string;
      overlapTo: string;
      a: SupplierDetail["rates"][number];
      b: SupplierDetail["rates"][number];
    }>;
    increment: string;
  }>(`/v1/suppliers/rates/calendar?${params.toString()}`, { token });
}

export async function getSupplierRateConflicts(
  token: string,
  query: { supplierId?: string; from?: string; to?: string } = {},
) {
  const params = new URLSearchParams();
  if (query.supplierId) params.set("supplierId", query.supplierId);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  const qs = params.toString();
  return eosFetch<{
    conflicts: Array<{
      supplierId: string;
      rateType: string;
      overlapFrom: string;
      overlapTo: string;
      a: SupplierDetail["rates"][number] & { rateCode: string; rateName: string };
      b: SupplierDetail["rates"][number] & { rateCode: string; rateName: string };
    }>;
    count: number;
    increment: string;
  }>(`/v1/suppliers/rates/conflicts${qs ? `?${qs}` : ""}`, { token });
}

export async function checkSupplierApiHealth(token: string): Promise<{ module: string; status: string; suppliers: number }> {
  return eosFetch("/v1/suppliers/health", { token });
}
