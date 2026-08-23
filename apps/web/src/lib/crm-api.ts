import { eosFetch } from "./eos-client";

export type CrmOrganizationType = {
  id: string;
  key: string;
  label: string;
};

export type CrmOrganization = {
  id: string;
  legalName: string;
  tradingName?: string;
  organizationTypeId: string;
  country?: string;
  region?: string;
  status: string;
  ownerPrincipalId?: string;
  updatedAt: string;
};

export type CrmContact = {
  id: string;
  givenName: string;
  familyName: string;
  email?: string;
  jobTitle?: string;
  status: string;
  updatedAt: string;
};

export type CrmAccount = {
  id: string;
  organizationId: string;
  accountName: string;
  ownerPrincipalId: string;
  status: string;
  priority?: string;
  updatedAt: string;
};

export type CrmActivity = {
  id: string;
  activityType: string;
  subject: string;
  occurredAt: string;
  organizationId?: string;
  contactId?: string;
};

export type CrmTask = {
  id: string;
  title: string;
  status: string;
  dueAt?: string;
  relatedOrganizationId?: string;
};

export type CrmRelationship = {
  id: string;
  toOrganizationId?: string;
  fromContactId?: string;
};

export type CrmImportBatch = {
  id: string;
  sourceSystem: string;
  entityType: string;
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
};

export type CrmImportEntityType = "organization" | "contact";

export const CRM_IMPORT_ENTITY_OPTIONS: Array<{ value: CrmImportEntityType; label: string }> = [
  { value: "organization", label: "Organizations" },
  { value: "contact", label: "Contacts" },
];

export async function listOrganizationTypes(token: string) {
  return eosFetch<{ items: CrmOrganizationType[] }>("/v1/crm/organization-types", { token });
}

export async function listOrganizations(
  token: string,
  query: { status?: string; organizationTypeId?: string } = {},
) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.organizationTypeId) params.set("organizationTypeId", query.organizationTypeId);
  const qs = params.toString();
  return eosFetch<{ items: CrmOrganization[] }>(`/v1/crm/organizations${qs ? `?${qs}` : ""}`, { token });
}

export async function listContacts(
  token: string,
  query: { status?: string; organizationId?: string } = {},
) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.organizationId) params.set("organizationId", query.organizationId);
  const qs = params.toString();
  return eosFetch<{ items: CrmContact[] }>(`/v1/crm/contacts${qs ? `?${qs}` : ""}`, { token });
}

export async function listAccounts(token: string, query: { organizationId?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (query.organizationId) params.set("organizationId", query.organizationId);
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return eosFetch<{ items: CrmAccount[]; nextCursor?: string }>(`/v1/crm/accounts${qs ? `?${qs}` : ""}`, { token });
}

export async function listTasks(token: string, query: { limit?: number } = {}) {
  const params = new URLSearchParams();
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return eosFetch<{ items: CrmTask[]; nextCursor?: string }>(`/v1/crm/tasks${qs ? `?${qs}` : ""}`, { token });
}

export async function getTask(token: string, id: string) {
  return eosFetch<{ task: CrmTask }>(`/v1/crm/tasks/${id}`, { token });
}

export async function getActivity(token: string, id: string) {
  return eosFetch<{ activity: CrmActivity }>(`/v1/crm/activities/${id}`, { token });
}

export async function listActivities(token: string, query: { limit?: number; organizationId?: string } = {}) {
  const params = new URLSearchParams();
  if (query.limit) params.set("limit", String(query.limit));
  if (query.organizationId) params.set("organizationId", query.organizationId);
  const qs = params.toString();
  return eosFetch<{ items: CrmActivity[]; nextCursor?: string }>(`/v1/crm/activities${qs ? `?${qs}` : ""}`, { token });
}

export async function listRelationships(token: string) {
  return eosFetch<{ items: CrmRelationship[] }>("/v1/crm/relationships", { token });
}

export async function createCrmImportBatch(
  token: string,
  input: { sourceSystem: string; entityType: CrmImportEntityType; csv: string },
) {
  return eosFetch<{ batch: CrmImportBatch }>("/v1/crm/imports", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function validateCrmImportBatch(token: string, batchId: string) {
  return eosFetch<{ batch: CrmImportBatch }>(`/v1/crm/imports/${batchId}/validate`, {
    method: "POST",
    token,
  });
}

export async function executeCrmImportBatch(token: string, batchId: string, idempotencyKey: string) {
  return eosFetch<{ batch: CrmImportBatch; replay?: boolean }>(`/v1/crm/imports/${batchId}/execute`, {
    method: "POST",
    token,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function orgStatusVariant(status: string): "progress" | "review" | "draft" | "won" | "urgent" {
  switch (status) {
    case "Active":
    case "Engaged":
    case "Qualified":
      return "progress";
    case "Prospect":
      return "review";
    case "Dormant":
    case "Disqualified":
      return "draft";
    default:
      return "draft";
  }
}
