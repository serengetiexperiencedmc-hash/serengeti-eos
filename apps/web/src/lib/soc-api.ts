import { eosFetch } from "./eos-client";

export type SocAlert = {
  id: string;
  alertCode: string;
  source: "devtest.webhook";
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "acknowledged" | "closed";
  summary?: string;
  externalId?: string;
  ciId?: string;
  ticketId?: string;
  ticketCode?: string;
};

export const ALERT_STATUS_LABELS: Record<SocAlert["status"], string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  closed: "Closed",
};

export async function getSocHealth(token: string) {
  return eosFetch<{ increment: string; alerts: number; openAlerts: number; cases: number }>(
    "/v1/security/health",
    { token },
  );
}

export async function listSocAlerts(token: string) {
  return eosFetch<{ items: SocAlert[] }>("/v1/security/alerts", { token });
}

export async function ingestSocAlert(
  token: string,
  input: { title: string; severity?: SocAlert["severity"]; summary?: string },
) {
  return eosFetch<{ alert: SocAlert }>("/v1/security/alerts", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function acknowledgeSocAlert(token: string, id: string) {
  return eosFetch<{ alert: SocAlert }>(`/v1/security/alerts/${id}/acknowledge`, { token, method: "POST", body: "{}" });
}

export async function closeSocAlert(token: string, id: string) {
  return eosFetch<{ alert: SocAlert }>(`/v1/security/alerts/${id}/close`, { token, method: "POST", body: "{}" });
}

export async function openSocCase(token: string, id: string) {
  return eosFetch<{ alert: SocAlert; ticket: { id: string; ticketCode: string } }>(
    `/v1/security/alerts/${id}/case`,
    { token, method: "POST", body: "{}" },
  );
}
