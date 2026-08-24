import { eosFetch } from "./eos-client";

export type ItsmTicket = {
  id: string;
  ticketCode: string;
  title: string;
  ticketType: "incident" | "request";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "triaged" | "assigned" | "in_progress" | "resolved" | "closed" | "cancelled";
  ciCount: number;
  description?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  environment?: string;
};

export type ItsmTicketCi = {
  ciId: string;
  ciCode: string;
  name: string;
  ciClass: string;
};

export type CmdbCi = {
  id: string;
  ciCode: string;
  name: string;
  ciClass: string;
  lifecycle: "planned" | "active" | "maintenance" | "retired";
  environment: string;
  criticality: string;
  classification: string;
  sourceOfTruth: "manual";
  relatedTicketCount: number;
  ownerName?: string;
  custodianName?: string;
  rtoMinutes?: number;
  rpoMinutes?: number;
};

export type CmdbRelationship = {
  id: string;
  fromCiId: string;
  fromCiCode: string;
  fromName: string;
  toCiId: string;
  toCiCode: string;
  toName: string;
  relType: string;
};

export const TICKET_STATUS_LABELS: Record<ItsmTicket["status"], string> = {
  open: "Open",
  triaged: "Triaged",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const CI_CLASS_LABELS: Record<string, string> = {
  business_service: "Business service",
  technical_service: "Technical service",
  application: "Application",
  database: "Database",
  host_cluster: "Host / cluster",
  network_zone: "Network zone",
  endpoint: "Endpoint",
  integration: "Integration",
  knowledge_source: "Knowledge source",
  ai_system: "AI system",
};

export async function getItsmHealth(token: string) {
  return eosFetch<{ increment: string; tickets: number; openTickets: number }>("/v1/itsm/health", { token });
}

export async function listTickets(token: string) {
  return eosFetch<{ items: ItsmTicket[] }>("/v1/itsm/tickets", { token });
}

export async function getTicket(token: string, id: string) {
  return eosFetch<{ ticket: ItsmTicket; cis: ItsmTicketCi[] }>(`/v1/itsm/tickets/${id}`, { token });
}

export async function createTicket(
  token: string,
  input: { title: string; ticketType: ItsmTicket["ticketType"]; severity?: ItsmTicket["severity"]; description?: string },
) {
  return eosFetch<{ ticket: ItsmTicket }>("/v1/itsm/tickets", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function ticketAction(token: string, id: string, action: "triage" | "start" | "resolve" | "close" | "cancel") {
  return eosFetch<{ ticket: ItsmTicket }>(`/v1/itsm/tickets/${id}/${action}`, { token, method: "POST", body: "{}" });
}

export async function assignTicket(token: string, id: string, assignedToEmail: string) {
  return eosFetch<{ ticket: ItsmTicket }>(`/v1/itsm/tickets/${id}/assign`, {
    token,
    method: "POST",
    body: JSON.stringify({ assignedToEmail }),
  });
}

export async function linkTicketCi(token: string, ticketId: string, ciId: string) {
  return eosFetch<{ ticket: ItsmTicket; cis: ItsmTicketCi[] }>(`/v1/itsm/tickets/${ticketId}/cis`, {
    token,
    method: "POST",
    body: JSON.stringify({ ciId }),
  });
}

export async function unlinkTicketCi(token: string, ticketId: string, ciId: string) {
  return eosFetch<{ ticket: ItsmTicket; cis: ItsmTicketCi[] }>(`/v1/itsm/tickets/${ticketId}/cis/${ciId}`, {
    token,
    method: "DELETE",
  });
}

export async function getCmdbHealth(token: string) {
  return eosFetch<{ increment: string; cis: number; relationships: number }>("/v1/cmdb/health", { token });
}

export async function listCis(token: string) {
  return eosFetch<{ items: CmdbCi[] }>("/v1/cmdb/cis", { token });
}

export async function getCi(token: string, id: string) {
  return eosFetch<{
    ci: CmdbCi;
    relationships: CmdbRelationship[];
    tickets: Array<{ ticketId: string; ticketCode: string; title: string; status: string }>;
  }>(`/v1/cmdb/cis/${id}`, { token });
}

export async function createCi(
  token: string,
  input: { name: string; ciClass: string; lifecycle?: string; criticality?: string; ownerName?: string },
) {
  return eosFetch<{ ci: CmdbCi }>("/v1/cmdb/cis", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchCi(token: string, id: string, input: { lifecycle?: CmdbCi["lifecycle"]; ownerName?: string }) {
  return eosFetch<{ ci: CmdbCi }>(`/v1/cmdb/cis/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function createRelationship(
  token: string,
  input: { fromCiId: string; toCiId: string; relType: string },
) {
  return eosFetch<{ relationship: CmdbRelationship }>("/v1/cmdb/relationships", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteRelationship(token: string, id: string) {
  return eosFetch<{ ok: boolean }>(`/v1/cmdb/relationships/${id}`, { token, method: "DELETE" });
}
