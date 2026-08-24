export const MAPPING_STATUSES = ["draft", "active", "retired"] as const;
export type MappingStatus = (typeof MAPPING_STATUSES)[number];

export const MAPPING_STATUS_LABELS: Record<MappingStatus, string> = {
  draft: "Draft",
  active: "Active",
  retired: "Retired",
};

export function isValidMappingStatus(value: string): value is MappingStatus {
  return (MAPPING_STATUSES as readonly string[]).includes(value);
}

export function nextMappingCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^MAP-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `MAP-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateMapping(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionMapping(
  from: MappingStatus,
  action: "activate" | "retire",
): { allowed: true; next: MappingStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "activate" && from === "draft") return { allowed: true, next: "active" };
  if (action === "retire" && from === "active") return { allowed: true, next: "retired" };
  return { allowed: false, reason: "invalid_transition" };
}

export type RegulationControlMapping = {
  id: string;
  tenantId: string;
  mappingCode: string;
  title: string;
  status: MappingStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  controlId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
