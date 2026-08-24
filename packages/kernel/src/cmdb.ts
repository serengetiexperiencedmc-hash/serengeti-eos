export const CI_CLASSES = [
  "business_service",
  "technical_service",
  "application",
  "database",
  "host_cluster",
  "network_zone",
  "endpoint",
  "integration",
  "knowledge_source",
  "ai_system",
] as const;
export type CiClass = (typeof CI_CLASSES)[number];

export const CI_LIFECYCLES = ["planned", "active", "maintenance", "retired"] as const;
export type CiLifecycle = (typeof CI_LIFECYCLES)[number];

export const CI_CRITICALITIES = ["low", "medium", "high", "critical"] as const;
export type CiCriticality = (typeof CI_CRITICALITIES)[number];

export const CI_ENVIRONMENTS = ["development", "test", "staging", "production"] as const;
export type CiEnvironment = (typeof CI_ENVIRONMENTS)[number];

export const CI_REL_TYPES = [
  "runs_on",
  "depends_on",
  "connects_to",
  "backed_up_by",
  "monitored_by",
  "owned_by",
  "provides",
] as const;
export type CiRelType = (typeof CI_REL_TYPES)[number];

export const CI_CLASS_LABELS: Record<CiClass, string> = {
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

export const CI_LIFECYCLE_LABELS: Record<CiLifecycle, string> = {
  planned: "Planned",
  active: "Active",
  maintenance: "Maintenance",
  retired: "Retired",
};

export function isValidCiClass(value: string): value is CiClass {
  return (CI_CLASSES as readonly string[]).includes(value);
}

export function isValidCiLifecycle(value: string): value is CiLifecycle {
  return (CI_LIFECYCLES as readonly string[]).includes(value);
}

export function isValidCiCriticality(value: string): value is CiCriticality {
  return (CI_CRITICALITIES as readonly string[]).includes(value);
}

export function isValidCiEnvironment(value: string): value is CiEnvironment {
  return (CI_ENVIRONMENTS as readonly string[]).includes(value);
}

export function isValidCiRelType(value: string): value is CiRelType {
  return (CI_REL_TYPES as readonly string[]).includes(value);
}

export function nextCiCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CI-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CI-${String(max + 1).padStart(4, "0")}`;
}

export type CmdbCi = {
  id: string;
  tenantId: string;
  ciCode: string;
  name: string;
  ciClass: CiClass;
  lifecycle: CiLifecycle;
  environment: CiEnvironment;
  criticality: CiCriticality;
  classification: string;
  sourceOfTruth: "manual";
  ownerName?: string;
  custodianName?: string;
  rtoMinutes?: number;
  rpoMinutes?: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CmdbRelationship = {
  id: string;
  tenantId: string;
  fromCiId: string;
  toCiId: string;
  relType: CiRelType;
  createdAt: string;
  createdByPrincipalId: string;
};
