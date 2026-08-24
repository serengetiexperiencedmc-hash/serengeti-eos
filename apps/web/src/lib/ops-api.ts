import { eosFetch } from "./eos-client";

export type SupplierConfirmation = {
  id: string;
  bookingId: string;
  programmeId: string;
  supplierId: string;
  programmeItemId?: string;
  label: string;
  status: "requested" | "confirmed" | "declined";
  supplierReference?: string;
  notes?: string;
  requestedAt: string;
  respondedAt?: string;
};

export type ManifestEntry = {
  id: string;
  manifestId: string;
  guestName: string;
  email?: string;
  rooming?: string;
  dietary?: string;
  mobility?: string;
  flightReference?: string;
  sortOrder: number;
};

export type ManifestDetail = {
  manifest: { id: string; bookingId: string; programmeId: string; status: string; version: number; publishedAt?: string };
  entries: ManifestEntry[];
};

export type OpsAssignment = {
  id: string;
  bookingId: string;
  programmeId: string;
  principalId: string;
  role: string;
  status: string;
  notes?: string;
};

export type OpsFieldTask = {
  id: string;
  bookingId: string;
  assignmentId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
  completedAt?: string;
};

export type OpsBrief = {
  id: string;
  bookingId: string;
  programmeId: string;
  content: string;
  issuedAt?: string;
};

export async function listSupplierConfirmations(token: string, bookingId: string) {
  return eosFetch<{ items: SupplierConfirmation[] }>(`/v1/ops/supplier-confirmations?bookingId=${bookingId}`, { token });
}

export async function generateSupplierConfirmations(token: string, bookingId: string) {
  return eosFetch<{ items: SupplierConfirmation[] }>("/v1/ops/supplier-confirmations/generate", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function confirmSupplier(token: string, id: string, supplierReference?: string) {
  return eosFetch<{ confirmation: SupplierConfirmation }>(`/v1/ops/supplier-confirmations/${id}/confirm`, {
    token,
    method: "POST",
    body: JSON.stringify({ supplierReference }),
  });
}

export async function getManifestByBooking(token: string, bookingId: string) {
  return eosFetch<ManifestDetail>(`/v1/ops/manifests/by-booking/${bookingId}`, { token });
}

export async function createManifest(token: string, bookingId: string) {
  return eosFetch<ManifestDetail>(`/v1/ops/manifests/by-booking/${bookingId}`, { token, method: "POST", body: "{}" });
}

export async function addManifestEntry(token: string, manifestId: string, entry: Omit<ManifestEntry, "id" | "manifestId" | "sortOrder"> & { sortOrder?: number }) {
  return eosFetch<{ entry: ManifestEntry }>(`/v1/ops/manifests/${manifestId}/entries`, {
    token,
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export async function publishManifest(token: string, manifestId: string) {
  return eosFetch<ManifestDetail>(`/v1/ops/manifests/${manifestId}/publish`, { token, method: "POST", body: "{}" });
}

export async function listAssignments(token: string, bookingId: string) {
  return eosFetch<{ items: OpsAssignment[] }>(`/v1/ops/assignments?bookingId=${bookingId}`, { token });
}

export async function createAssignment(token: string, body: { bookingId: string; principalId: string; role: string; notes?: string }) {
  return eosFetch<{ assignment: OpsAssignment }>("/v1/ops/assignments", { token, method: "POST", body: JSON.stringify(body) });
}

export async function listFieldTasks(token: string, bookingId: string) {
  return eosFetch<{ items: OpsFieldTask[] }>(`/v1/ops/field-tasks?bookingId=${bookingId}`, { token });
}

export async function createFieldTask(token: string, body: { bookingId: string; title: string; description?: string; dueDate?: string }) {
  return eosFetch<{ task: OpsFieldTask }>("/v1/ops/field-tasks", { token, method: "POST", body: JSON.stringify(body) });
}

export async function completeFieldTask(token: string, taskId: string) {
  return eosFetch<{ task: OpsFieldTask }>(`/v1/ops/field-tasks/${taskId}/complete`, { token, method: "POST", body: "{}" });
}

export async function getBrief(token: string, bookingId: string) {
  return eosFetch<{ brief: OpsBrief }>(`/v1/ops/briefs/by-booking/${bookingId}`, { token });
}

export async function saveBrief(token: string, bookingId: string, content: string) {
  return eosFetch<{ brief: OpsBrief }>(`/v1/ops/briefs/by-booking/${bookingId}`, {
    token,
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function issueBrief(token: string, bookingId: string) {
  return eosFetch<{ brief: OpsBrief }>(`/v1/ops/briefs/by-booking/${bookingId}/issue`, { token, method: "POST", body: "{}" });
}

export type OpsVoucher = {
  id: string;
  bookingId: string;
  manifestEntryId: string;
  voucherCode: string;
  voucherType: string;
  guestName: string;
  supplierLabel?: string;
  status: string;
  issuedAt?: string;
  notes?: string;
};

export async function listVouchers(token: string, bookingId: string) {
  return eosFetch<{ items: OpsVoucher[] }>(`/v1/ops/vouchers?bookingId=${bookingId}`, { token });
}

export async function generateVouchers(token: string, bookingId: string) {
  return eosFetch<{ items: OpsVoucher[] }>("/v1/ops/vouchers/generate", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function issueVoucher(token: string, voucherId: string) {
  return eosFetch<{ voucher: OpsVoucher }>(`/v1/ops/vouchers/${voucherId}/issue`, { token, method: "POST", body: "{}" });
}

export async function issueAllVouchers(token: string, bookingId: string) {
  return eosFetch<{ items: OpsVoucher[] }>("/v1/ops/vouchers/issue-all", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export type OpsWorkbenchItem = {
  bookingId: string;
  bookingCode: string;
  title: string;
  organizationId: string;
  status: string;
  handoverProgressPercent: number;
  pendingHandoverTasks: number;
  supplierConfirmationsPending: number;
  manifestStatus?: string;
  vouchersDraft: number;
  fieldTasksOpen: number;
  syncConflicts: number;
  attentionRequired: boolean;
  paxCount?: number;
  travelDates?: string;
};

export async function listOpsWorkbench(
  token: string,
  query?: { attention?: boolean; status?: string; q?: string },
) {
  const params = new URLSearchParams();
  if (query?.attention) params.set("attention", "true");
  if (query?.status) params.set("status", query.status);
  if (query?.q) params.set("q", query.q);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{ items: OpsWorkbenchItem[] }>(`/v1/ops/workbench${suffix}`, { token });
}
