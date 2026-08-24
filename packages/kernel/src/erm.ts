export const RISK_STATUSES = ["open", "mitigating", "accepted", "closed"] as const;
export type RiskStatus = (typeof RISK_STATUSES)[number];

export const RISK_STATUS_LABELS: Record<RiskStatus, string> = {
  open: "Open",
  mitigating: "Mitigating",
  accepted: "Accepted",
  closed: "Closed",
};

export function isValidRiskStatus(value: string): value is RiskStatus {
  return (RISK_STATUSES as readonly string[]).includes(value);
}

export function isValidRiskScore(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function nextRiskCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^RSK-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `RSK-${String(max + 1).padStart(4, "0")}`;
}

export function canTransitionRisk(
  from: RiskStatus,
  action: "mitigate" | "accept" | "close",
): { allowed: true; next: RiskStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "mitigate" && from === "open") return { allowed: true, next: "mitigating" };
  if (action === "accept" && (from === "open" || from === "mitigating")) {
    return { allowed: true, next: "accepted" };
  }
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export type ErmRisk = {
  id: string;
  tenantId: string;
  riskCode: string;
  title: string;
  summary?: string;
  likelihood: number;
  impact: number;
  status: RiskStatus;
  ownerLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
