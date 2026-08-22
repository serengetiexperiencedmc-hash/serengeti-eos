import type { DbPool } from "@sedmc/db";
import {
  chainAudit,
  hashPassword,
  type BusinessRule,
  type BusinessRuleVersion,
  type ChainedAuditRecord,
  type ConfigVersion,
  type CostCenterRecord,
  type GroupRecord,
  type LocationRecord,
  type OrgUnitRecord,
  type RoleGrant,
  type RoleRecord,
  type SessionRecord,
  type SodRule,
  type StoredPrincipal,
  type WorkflowDefinition,
  type WorkflowInstance,
  type WorkflowTask,
  type WorkflowVersion,
  type OutboxRecord,
  type DeadLetterRecord,
  type EventCatalogueEntry,
  type ProcessedEventKey,
  type EnterpriseEventEnvelope,
  type ReplayRequest,
  type EventOperationsMetrics,
  type CrmActivityType,
  type CrmOrganizationType,
  type CrmRelationshipType,
  type CrmOrganization,
  type CrmOrganizationUnit,
  type CrmContact,
  type CrmRelationship,
  type CrmAccount,
  type CrmActivity,
  type CrmNote,
  type CrmTask,
  type CrmTag,
  type CrmEntityTag,
  type CrmExternalIdentifier,
  type CrmDuplicateCandidate,
  type CrmMergeRecord,
  type CrmImportBatch,
  type SupContact,
  type SupContentBlock,
  type SupImportBatch,
  type SupRate,
  type SupSeason,
  type SupSupplier,
  type OppOpportunity,
  type OppStageHistory,
  type RfpRecord,
  type RfpVersion,
  type PrgProgramme,
  type PrgDay,
  type PrgItem,
  type CostSheet,
  type CostLineItem,
  type CostSheetVersion,
  type ComApprovalRequest,
  type PropProposal,
  type PropProposalVersion,
  type BkgBooking,
  type BkgHandoverTask,
  type OpsSupplierConfirmation,
  type OpsManifest,
  type OpsManifestEntry,
  type OpsAssignment,
  type OpsFieldTask,
  type OpsBrief,
  type FinInvoice,
  type FinQuote,
  type FinReconciliation,
  type OpsFieldSyncSession,
  type OpsSyncConflict,
  type OpsVoucher,
  type NotifDismissal,
  type NotifEmailOutboxEntry,
  type NotifEmailDeliveryEvent,
  type NotifEmailSuppression,
  type NotifEmailAllowlistEntry,
  type EmailTemplate,
  type NatsConsumerOffset,
} from "@sedmc/kernel";
import { seedCrmCatalogues } from "./crm/collections.js";

export type Payment = {
  id: string;
  tenantId: string;
  amount: number;
  currency: string;
  beneficiary: string;
  status: "pending_approval" | "approved" | "rejected";
  createdBy: string;
};

export type Store = {
  tenants: Map<string, { id: string; slug: string; name: string }>;
  organisations: Map<string, { id: string; tenantId: string; name: string; legalName?: string }>;
  principals: Map<string, StoredPrincipal>;
  orgUnits: OrgUnitRecord[];
  locations: LocationRecord[];
  costCenters: CostCenterRecord[];
  groups: GroupRecord[];
  roles: RoleRecord[];
  roleGrants: RoleGrant[];
  payments: Map<string, Payment>;
  approvals: Map<
    string,
    {
      id: string;
      tenantId: string;
      actionClass: string;
      resourceType: string;
      resourceId: string;
      status: "pending" | "approved" | "rejected" | "escalated" | "expired";
      requestedByPrincipalId: string;
    }
  >;
  audit: ChainedAuditRecord[];
  actions: Array<{ principalId: string; action: string; objectId: string }>;
  configVersions: ConfigVersion[];
  sodRules: SodRule[];
  sessions: SessionRecord[];
  tokenSecret: string;
  workflowDefinitions: WorkflowDefinition[];
  workflowVersions: WorkflowVersion[];
  workflowInstances: WorkflowInstance[];
  workflowTasks: WorkflowTask[];
  businessRules: BusinessRule[];
  businessRuleVersions: BusinessRuleVersion[];
  outboxEvents: OutboxRecord[];
  deadLetters: DeadLetterRecord[];
  processedEvents: ProcessedEventKey[];
  eventCatalogue: EventCatalogueEntry[];
  /** In-memory stand-in for NATS JetStream delivered messages — NOT production transport */
  publishedBus: EnterpriseEventEnvelope[];
  replayRequests: ReplayRequest[];
  eventMetrics: EventOperationsMetrics;
  /** Active dev transport kind recorded for health/readiness */
  eventTransportKind: "in-memory-dev" | "nats-jetstream";
  eventTransport?: import("@sedmc/kernel").EventTransport;
  aggregateSequences: Map<string, number>;
  crmOrganizationTypes: CrmOrganizationType[];
  crmRelationshipTypes: CrmRelationshipType[];
  crmActivityTypes: CrmActivityType[];
  crmOrganizations: CrmOrganization[];
  crmOrganizationUnits: CrmOrganizationUnit[];
  crmContacts: CrmContact[];
  crmRelationships: CrmRelationship[];
  crmAccounts: CrmAccount[];
  crmActivities: CrmActivity[];
  crmNotes: CrmNote[];
  crmTasks: CrmTask[];
  crmTags: CrmTag[];
  crmEntityTags: CrmEntityTag[];
  crmExternalIdentifiers: CrmExternalIdentifier[];
  crmDuplicateCandidates: CrmDuplicateCandidate[];
  crmMergeRecords: CrmMergeRecord[];
  crmImportBatches: CrmImportBatch[];
  crmMergeIdempotency: Record<string, string>;
  crmImportExecuteIdempotency: Record<string, string>;
  supImportBatches: SupImportBatch[];
  supSuppliers: SupSupplier[];
  supContacts: SupContact[];
  supRates: SupRate[];
  /** PG.17 — named season catalogue. */
  supSeasons: SupSeason[];
  supContentBlocks: SupContentBlock[];
  supImportExecuteIdempotency: Record<string, string>;
  oppOpportunities: OppOpportunity[];
  oppStageHistory: OppStageHistory[];
  rfpRfps: RfpRecord[];
  rfpVersions: RfpVersion[];
  prgProgrammes: PrgProgramme[];
  prgDays: PrgDay[];
  prgItems: PrgItem[];
  costSheets: CostSheet[];
  costLineItems: CostLineItem[];
  costSheetVersions: CostSheetVersion[];
  comApprovalRequests: ComApprovalRequest[];
  propProposals: PropProposal[];
  propProposalVersions: PropProposalVersion[];
  bkgBookings: BkgBooking[];
  bkgHandoverTasks: BkgHandoverTask[];
  opsSupplierConfirmations: OpsSupplierConfirmation[];
  opsManifests: OpsManifest[];
  opsManifestEntries: OpsManifestEntry[];
  opsAssignments: OpsAssignment[];
  opsFieldTasks: OpsFieldTask[];
  opsBriefs: OpsBrief[];
  finInvoices: FinInvoice[];
  finReconciliations: FinReconciliation[];
  finQuotes: FinQuote[];
  finPaymentLinks: Array<{ invoiceId: string; paymentId: string; approvalId: string; amount: number }>;
  opsFieldSyncSessions: OpsFieldSyncSession[];
  opsSyncConflicts: OpsSyncConflict[];
  opsVouchers: OpsVoucher[];
  notifDismissals: NotifDismissal[];
  notifEmailOutbox: NotifEmailOutboxEntry[];
  notifEmailDeliveryEvents: NotifEmailDeliveryEvent[];
  notifEmailTemplates: Array<EmailTemplate & { tenantId: string }>;
  notifEmailSuppressions: NotifEmailSuppression[];
  notifEmailAllowlist: NotifEmailAllowlistEntry[];
  natsConsumerOffsets: NatsConsumerOffset[];
  /** Optional PostgreSQL pool for dual-write persistence (PG.1+) */
  dbPool?: DbPool;
};

const CRM_PERMS = [
  "crm:read:tag",
  "crm:write:tag",
  "crm:read:organization",
  "crm:write:organization",
  "crm:transition:organization",
  "crm:archive:organization",
  "crm:read:contact",
  "crm:write:contact",
  "crm:read:relationship",
  "crm:write:relationship",
  "crm:read:account",
  "crm:write:account",
  "crm:reassign:account_owner",
  "crm:read:activity",
  "crm:write:activity",
  "crm:read:task",
  "crm:write:task",
  "crm:read:duplicate",
  "crm:review:duplicate",
  "crm:merge:record",
  "crm:export:crm",
  "crm:import:bulk",
  "crm:admin:organization_type",
  "crm:admin:relationship_type",
] as const;

const SUPPLIER_PERMS = [
  "supplier:read:supplier",
  "supplier:write:supplier",
  "supplier:import:bulk",
] as const;

const PIPELINE_PERMS = [
  "pipeline:read:opportunity",
  "pipeline:write:opportunity",
  "pipeline:transition:stage",
] as const;

const RFP_PERMS = [
  "rfp:read:rfp",
  "rfp:write:rfp",
  "rfp:transition:stage",
  "rfp:write:version",
] as const;

const PROGRAMME_PERMS = [
  "programme:read:programme",
  "programme:write:programme",
  "programme:write:day",
  "programme:write:item",
] as const;

const COSTING_PERMS = [
  "costing:read:sheet",
  "costing:write:sheet",
  "costing:write:line_item",
  "costing:write:version",
] as const;

const COMMERCIAL_APPROVAL_PERMS = [
  "commercial:read:approval",
  "commercial:request:approval",
  "commercial:decide:approval",
] as const;

const PROPOSAL_PERMS = [
  "proposal:read:proposal",
  "proposal:write:proposal",
  "proposal:transition:status",
  "proposal:write:version",
] as const;

const BOOKING_PERMS = [
  "booking:read:booking",
  "booking:read:command_center",
  "booking:write:booking",
  "booking:complete:handover",
] as const;

const OPS_PERMS = [
  "ops:read:operations",
  "ops:write:operations",
  "ops:confirm:supplier",
  "ops:write:manifest",
  "ops:publish:manifest",
] as const;

const ANALYTICS_PERMS = ["analytics:read:commercial", "analytics:read:operations"] as const;

const NOTIFICATION_PERMS = [
  "notification:read:inbox",
  "notification:write:inbox",
  "notification:read:email_outbox",
  "notification:dispatch:email",
] as const;

const FINANCE_MODULE_PERMS = [
  "finance:read:invoice",
  "finance:write:invoice",
  "finance:read:reconciliation",
  "finance:reconcile:booking",
] as const;

const PERMS = {
  financeMember: [
    "finance:create:payment",
    "finance:approve:payment",
    "finance:read:payment",
    ...FINANCE_MODULE_PERMS,
    "org:read:unit",
    "identity:read:self",
    ...NOTIFICATION_PERMS,
  ],
  financeApprover: [
    "finance:approve:payment",
    "finance:read:payment",
    ...FINANCE_MODULE_PERMS,
    "org:read:unit",
    "identity:read:self",
    "audit:read:event",
    "audit:verify:chain",
    "config:read:item",
    "config:approve:item",
    "workflow:approve:task",
    "workflow:execute:instance",
    "rules:approve:rule",
    "rules:simulate:rule",
    "commercial:read:approval",
    "commercial:decide:approval",
  ],
  platformAdmin: [
    "org:read:unit",
    "org:write:unit",
    "org:write:location",
    "org:write:cost_center",
    "org:write:team",
    "identity:read:self",
    "identity:read:principal",
    "identity:write:principal",
    "identity:suspend:principal",
    "identity:grant:role",
    "authz:read:role",
    "authz:write:role",
    "authz:write:sod",
    "config:read:item",
    "config:write:item",
    "session:revoke:principal",
    "session:read:principal",
    "audit:read:event",
    "audit:verify:chain",
    "workflow:read:definition",
    "workflow:write:definition",
    "workflow:publish:definition",
    "workflow:execute:instance",
    "rules:write:rule",
    "rules:simulate:rule",
    "events:publish:outbox",
    "events:consume:outbox",
    "events:replay:outbox",
    "events:read:operations",
    "events:read:dlq",
    "events:register:catalogue",
    ...CRM_PERMS,
    ...SUPPLIER_PERMS,
    ...PIPELINE_PERMS,
    ...RFP_PERMS,
    ...PROGRAMME_PERMS,
    ...COSTING_PERMS,
    ...COMMERCIAL_APPROVAL_PERMS,
    ...PROPOSAL_PERMS,
    ...BOOKING_PERMS,
    ...OPS_PERMS,
    ...ANALYTICS_PERMS,
    ...FINANCE_MODULE_PERMS,
    "finance:create:payment",
    "finance:read:payment",
    ...NOTIFICATION_PERMS,
  ],
  commercialManager: [
    "org:read:unit",
    "identity:read:self",
    "audit:read:event",
    "crm:read:organization",
    "crm:write:organization",
    "crm:transition:organization",
    "crm:read:contact",
    "crm:write:contact",
    "crm:read:relationship",
    "crm:write:relationship",
    "crm:read:account",
    "crm:write:account",
    "crm:reassign:account_owner",
    "crm:read:activity",
    "crm:write:activity",
    "crm:read:task",
    "crm:write:task",
    "crm:read:duplicate",
    "crm:review:duplicate",
    "supplier:read:supplier",
    "supplier:write:supplier",
    "supplier:import:bulk",
    ...PIPELINE_PERMS,
    ...RFP_PERMS,
    ...PROGRAMME_PERMS,
    ...COSTING_PERMS,
    "commercial:read:approval",
    "commercial:request:approval",
    ...PROPOSAL_PERMS,
    ...BOOKING_PERMS,
    ...OPS_PERMS,
    ...ANALYTICS_PERMS,
    ...FINANCE_MODULE_PERMS,
    "finance:create:payment",
    "finance:read:payment",
    ...NOTIFICATION_PERMS,
  ],
};

export type BootstrapSecrets = {
  alicePassword: string;
  bobPassword: string;
  carolPassword: string;
  partnerPassword: string;
};

/** Test-only defaults. Runtime/dev must supply via SecretsProvider / env — never UAT/Prod. */
export const TEST_BOOTSTRAP_SECRETS: BootstrapSecrets = {
  alicePassword: "test-alice-not-for-prod",
  bobPassword: "test-bob-not-for-prod",
  carolPassword: "test-carol-not-for-prod",
  partnerPassword: "test-partner-not-for-prod",
};

export function bootstrapSecretsFromEnv(get: (ref: string) => string | undefined): BootstrapSecrets {
  const required = (ref: string): string => {
    const value = get(ref);
    if (!value) {
      throw new Error(`Missing development bootstrap secret ref ${ref}. See .env.example.`);
    }
    return value;
  };
  return {
    alicePassword: required("EOS_BOOTSTRAP_ALICE_PASSWORD"),
    bobPassword: required("EOS_BOOTSTRAP_BOB_PASSWORD"),
    carolPassword: required("EOS_BOOTSTRAP_CAROL_PASSWORD"),
    partnerPassword: required("EOS_BOOTSTRAP_PARTNER_PASSWORD"),
  };
}

export function seedStore(
  tokenSecret: string,
  bootstrap: BootstrapSecrets = TEST_BOOTSTRAP_SECRETS,
): Store {
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const partnerId = "22222222-2222-4222-8222-222222222222";
  const orgId = "44444444-4444-4444-8444-444444444444";
  const financeUnit = "33333333-3333-4333-8333-333333333333";
  const locArusha = "55555555-5555-4555-8555-555555555555";
  const ccOps = "66666666-6666-4666-8666-666666666666";
  const aliceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const bobId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const agentId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const partnerUser = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
  const observerId = "ffffffff-ffff-4fff-8fff-ffffffffffff";

  const alice: StoredPrincipal = {
    id: aliceId,
    tenantId,
    actorType: "Human",
    email: "alice.finance@sedmc.local",
    displayName: "Alice Finance",
    status: "active",
    orgUnitId: financeUnit,
    classificationClearance: "Confidential",
    roles: ["finance.member"],
    permissions: [...PERMS.financeMember],
    passwordHash: hashPassword(bootstrap.alicePassword),
    attributes: { department: "finance" },
  };
  const bob: StoredPrincipal = {
    id: bobId,
    tenantId,
    actorType: "Human",
    email: "bob.approver@sedmc.local",
    displayName: "Bob Approver",
    status: "active",
    orgUnitId: financeUnit,
    classificationClearance: "Confidential",
    roles: ["finance.approver"],
    permissions: [...PERMS.financeApprover],
    passwordHash: hashPassword(bootstrap.bobPassword),
    attributes: { department: "finance" },
  };
  const carol: StoredPrincipal = {
    id: carolId,
    tenantId,
    actorType: "Human",
    email: "carol.admin@sedmc.local",
    displayName: "Carol Admin",
    status: "active",
    orgUnitId: financeUnit,
    classificationClearance: "Restricted",
    roles: ["platform.admin"],
    permissions: [...PERMS.platformAdmin],
    passwordHash: hashPassword(bootstrap.carolPassword),
    attributes: { department: "it" },
  };
  const platformObserver: StoredPrincipal = {
    id: observerId,
    tenantId,
    actorType: "Service",
    displayName: "Platform Observer",
    status: "active",
    classificationClearance: "Restricted",
    roles: ["platform.observer"],
    permissions: ["events:consume:outbox", "events:read:operations", "events:read:dlq"],
    attributes: { service: "platform-observer" },
  };
  const agent: StoredPrincipal = {
    id: agentId,
    tenantId,
    actorType: "AiAgent",
    displayName: "Finance assistant",
    status: "active",
    classificationClearance: "Internal",
    roles: ["ai.agent"],
    permissions: ["finance:read:payment"],
    attributes: { purpose: "assist_finance_drafts" },
  };

  const partner: StoredPrincipal = {
    id: partnerUser,
    tenantId: partnerId,
    actorType: "Human",
    email: "partner@external.local",
    displayName: "Partner User",
    status: "active",
    classificationClearance: "Internal",
    roles: ["partner.member"],
    permissions: ["finance:read:payment", "identity:read:self"],
    passwordHash: hashPassword(bootstrap.partnerPassword),
  };

  const roles: RoleRecord[] = [
    {
      id: "role-finance-member",
      tenantId,
      key: "finance.member",
      name: "Finance Member",
      permissionKeys: [...PERMS.financeMember],
    },
    {
      id: "role-finance-approver",
      tenantId,
      key: "finance.approver",
      name: "Finance Approver",
      permissionKeys: [...PERMS.financeApprover],
    },
    {
      id: "role-platform-admin",
      tenantId,
      key: "platform.admin",
      name: "Platform Admin",
      permissionKeys: [...PERMS.platformAdmin],
    },
    {
      id: "role-commercial-manager",
      tenantId,
      key: "commercial.manager",
      name: "Commercial Manager",
      permissionKeys: [...PERMS.commercialManager],
    },
    {
      id: "role-ai-agent",
      tenantId,
      key: "ai.agent",
      name: "AI Agent",
      permissionKeys: ["finance:read:payment"],
    },
    {
      id: "role-platform-observer",
      tenantId,
      key: "platform.observer",
      name: "Platform Observer",
      permissionKeys: ["events:consume:outbox", "events:read:operations", "events:read:dlq"],
    },
  ];

  const store: Store = {
    tenants: new Map([
      [tenantId, { id: tenantId, slug: "sedmc", name: "Serengeti Experience DMC" }],
      [partnerId, { id: partnerId, slug: "partner-demo", name: "Demo Partner Tenant" }],
    ]),
    organisations: new Map([
      [orgId, { id: orgId, tenantId, name: "Serengeti Experience DMC", legalName: "Serengeti Experience DMC Ltd" }],
    ]),
    principals: new Map([
      [alice.email!, alice],
      [bob.email!, bob],
      [carol.email!, carol],
      [platformObserver.id, platformObserver],
      [partner.email!, partner],
      [agent.id, agent],
    ]),
    orgUnits: [
      {
        id: financeUnit,
        tenantId,
        organisationId: orgId,
        code: "FIN",
        name: "Finance",
        departmentKey: "finance",
        unitType: "department",
        locationId: locArusha,
        costCenterId: ccOps,
      },
    ],
    locations: [
      {
        id: locArusha,
        tenantId,
        code: "ARU",
        name: "Arusha HQ",
        countryCode: "TZ",
        city: "Arusha",
      },
    ],
    costCenters: [{ id: ccOps, tenantId, code: "CC-OPS", name: "Operations" }],
    groups: [],
    roles,
    roleGrants: [
      {
        id: "grant-alice",
        tenantId,
        principalId: aliceId,
        roleKey: "finance.member",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob",
        tenantId,
        principalId: bobId,
        roleKey: "finance.approver",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-carol",
        tenantId,
        principalId: carolId,
        roleKey: "platform.admin",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
    ],
    payments: new Map(),
    approvals: new Map(),
    audit: [],
    actions: [],
    configVersions: [
      {
        id: "cfg-v1",
        tenantId,
        key: "approval.payment.dual_control",
        version: 1,
        value: { enabled: true },
        status: "approved",
        createdByPrincipalId: carolId,
        createdAt: new Date().toISOString(),
        approvedByPrincipalId: bobId,
        approvedAt: new Date().toISOString(),
        effectiveFrom: new Date().toISOString(),
      },
    ],
    sodRules: [
      {
        key: "payment-create-approve",
        actionA: "finance:create:payment",
        actionB: "finance:approve:payment",
        sameObject: true,
      },
      {
        key: "config-write-approve",
        actionA: "config:write:item",
        actionB: "config:approve:item",
        sameObject: true,
      },
      {
        key: "rules-write-approve",
        actionA: "rules:write:rule",
        actionB: "rules:approve:rule",
        sameObject: true,
      },
      {
        key: "workflow-start-approve",
        actionA: "workflow:execute:instance",
        actionB: "workflow:approve:task",
        sameObject: true,
      },
    ],
    sessions: [],
    tokenSecret,
    workflowDefinitions: [],
    workflowVersions: [],
    workflowInstances: [],
    workflowTasks: [],
    businessRules: [],
    businessRuleVersions: [],
    outboxEvents: [],
    deadLetters: [],
    processedEvents: [],
    eventCatalogue: [
      {
        eventType: "platform.ping.v1",
        owner: "platform",
        purpose: "I4 infrastructure self-test; not a business domain event",
        schemaVersion: 1,
        classification: "Internal",
        producer: "serengeti-eos-api",
        consumers: ["platform-observer"],
        retentionDays: 30,
        compatibility: "backward",
        lifecycle: "active",
        orderingKey: "none",
        requiredFields: [{ name: "ping", type: "boolean" }],
        optionalFields: [{ name: "n", type: "number" }],
        forbiddenPayloadKeys: ["email", "phone", "passport"],
        maxPayloadBytes: 4096,
        sensitiveDataPolicy: "reference_only",
      },
    ],
    publishedBus: [],
    replayRequests: [],
    eventMetrics: {
      eventsCommitted: 0,
      eventsPublished: 0,
      publisherFailures: 0,
      consumerFailures: 0,
      retries: 0,
      dlqCount: 0,
      replays: 0,
      schemaErrors: 0,
      authorizationFailures: 0,
    },
    eventTransportKind: "in-memory-dev",
    aggregateSequences: new Map(),
    crmOrganizationTypes: [],
    crmRelationshipTypes: [],
    crmActivityTypes: [],
    crmOrganizations: [],
    crmOrganizationUnits: [],
    crmContacts: [],
    crmRelationships: [],
    crmAccounts: [],
    crmActivities: [],
    crmNotes: [],
    crmTasks: [],
    crmTags: [],
    crmEntityTags: [],
    crmExternalIdentifiers: [],
    crmDuplicateCandidates: [],
    crmMergeRecords: [],
    crmImportBatches: [],
    crmMergeIdempotency: {},
    crmImportExecuteIdempotency: {},
    supImportBatches: [],
    supSuppliers: [],
    supContacts: [],
    supRates: [],
    supSeasons: [],
    supContentBlocks: [],
    supImportExecuteIdempotency: {},
    oppOpportunities: [],
    oppStageHistory: [],
    rfpRfps: [],
    rfpVersions: [],
    prgProgrammes: [],
    prgDays: [],
    prgItems: [],
    costSheets: [],
    costLineItems: [],
    costSheetVersions: [],
    comApprovalRequests: [],
    propProposals: [],
    propProposalVersions: [],
    bkgBookings: [],
    bkgHandoverTasks: [],
    opsSupplierConfirmations: [],
    opsManifests: [],
    opsManifestEntries: [],
    opsAssignments: [],
    opsFieldTasks: [],
    opsBriefs: [],
    finInvoices: [],
    finReconciliations: [],
    finQuotes: [],
    finPaymentLinks: [],
    opsFieldSyncSessions: [],
    opsSyncConflicts: [],
    opsVouchers: [],
    notifDismissals: [],
    notifEmailOutbox: [],
    notifEmailDeliveryEvents: [],
    notifEmailTemplates: [],
    notifEmailSuppressions: [],
    notifEmailAllowlist: [],
    natsConsumerOffsets: [],
  };
  seedCrmCatalogues(store, tenantId);
  return store;
}

export function principalById(store: Store, id: string): StoredPrincipal | undefined {
  for (const p of store.principals.values()) {
    if (p.id === id) return p;
  }
  return undefined;
}

export function allPrincipals(store: Store): StoredPrincipal[] {
  const seen = new Set<string>();
  const out: StoredPrincipal[] = [];
  for (const p of store.principals.values()) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export function recordAudit(
  store: Store,
  record: Omit<ChainedAuditRecord, "prevHash" | "rowHash">,
): ChainedAuditRecord {
  const prev = [...store.audit].reverse().find((event) => event.tenantId === record.tenantId)?.rowHash;
  const chained = chainAudit(record, prev);
  store.audit.push(chained);
  return chained;
}

export function rebuildPrincipalPermissions(store: Store, principal: StoredPrincipal): void {
  const grants = store.roleGrants.filter(
    (g) =>
      g.principalId === principal.id &&
      g.tenantId === principal.tenantId &&
      (!g.expiresAt || new Date(g.expiresAt).getTime() > Date.now()),
  );
  const roleKeys = [...new Set(grants.map((g) => g.roleKey))];
  const permissions = new Set<string>();
  for (const key of roleKeys) {
    const role = store.roles.find((r) => r.tenantId === principal.tenantId && r.key === key);
    if (!role) continue;
    for (const perm of role.permissionKeys) permissions.add(perm);
  }
  principal.roles = roleKeys;
  principal.permissions = [...permissions];
}
