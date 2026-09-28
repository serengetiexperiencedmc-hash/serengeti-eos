/**
 * E1-D Class B NB1 — SoR inventory as data. Not a runtime SoR switch.
 * Expansion of additional modules to PostgreSQL SoR is excluded (B6).
 */
export const E1D_CLASS_B_SOR_INVENTORY = {
  kind: "inventory" as const,
  notExpansion: true,
  productionReady: false,
  postgresqlAuthoritativeWhenPoolSet: [
    "opportunity",
    "rfp",
    "programme",
    "costing",
    "commercial-approval",
    "commercial-document-metadata",
    "audit-events-when-pool-set",
  ],
  processLocalAuthoritative: [
    "crm",
    "supplier",
    "notifications",
    "document-bytes-via-localfs",
    "default-store-when-no-pool",
  ],
  dualWriteNotSoR: ["crm", "supplier"],
  documentBytes: "local-fs",
} as const;
