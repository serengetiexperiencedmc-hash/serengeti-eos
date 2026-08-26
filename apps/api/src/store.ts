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
  type SupHeatmapRollupSnapshot,
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
  type NotifDlqSlaDigestRecipient,
  type NotifDlqSlaDigestLastRun,
  type NotifDlqSlaDigestStaleAuditExportLastFilter,
  type NotifDlqSlaDigestStaleAuditExportLastPreset,
  type NotifDlqSlaDigestStaleAuditExportPreset,
  type NotifDlqSlaDigestStaleAuditExportPresetUsage,
  type NotifDlqSlaDigestStaleSuppression,
  type NotifDlqSlaDigestStaleSuppressionAudit,
  type NotifAllowlistDualDigestRecipient,
  type NotifAllowlistDualDigestLastRun,
  type NotifAllowlistDualDigestStaleAuditExportLastFilter,
  type NotifAllowlistDualDigestStaleAuditExportLastPreset,
  type NotifAllowlistDualDigestStaleAuditExportPreset,
  type NotifAllowlistDualDigestStaleAuditExportPresetUsage,
  type NotifAllowlistDualDigestStaleSuppression,
  type NotifAllowlistDualDigestStaleSuppressionAudit,
  type AiDraft,
  type AiRecommendLastRun,
  type AiRecommendStaleSuppression,
  type AiRecommendStaleSuppressionAudit,
  type AiRecommendStaleAuditExportLastFilter,
  type AiRecommendStaleAuditExportLastPreset,
  type AiRecommendStaleAuditExportPreset,
  type AiRecommendStaleAuditExportPresetUsage,
  type EmailTemplate,
  type NatsConsumerOffset,
  type HrEmployee,
  type HrEmployeeSkill,
  type HrLeaveRequest,
  type HrSkill,
  type CmdbCi,
  type CmdbRelationship,
  type ItsmTicket,
  type ItsmTicketCi,
  type OtelSpan,
  type SecurityAlert,
  type ErmRisk,
  type IaEngagement,
  type IaWorkpaper,
  type BcmBackupJob,
  type BcmRestoreProbe,
  type CrisisCase,
  type CrisisTimelineEntry,
  type ComplianceObligation,
  type PrivacyProcessingActivity,
  type PrivacyDsrCase,
  type GrcControl,
  type FindingRecord,
  type ControlTestCampaign,
  type RegulationControlMapping,
  type OperationalIssue,
  type CrisisDecision,
  type CrisisAction,
  type HrCertification,
  type ItsmChange,
  type ItsmProblem,
  type ItsmRelease,
  type ItAsset,
  type ItLicense,
  type PrivacyDpia,
  type KnowledgeDocument,
  type PamJitGrant,
  type PamSecretRef,
} from "@sedmc/kernel";
import { seedCrmCatalogues } from "./crm/collections.js";
import { seedDefaultHr } from "./hr/collections.js";
import { seedDefaultIt } from "./it/collections.js";
import { seedDefaultSoc } from "./security/collections.js";
import { seedDefaultPam } from "./pam/collections.js";
import { seedDefaultErm } from "./erm/collections.js";
import { seedDefaultKnowledge } from "./knowledge/collections.js";
import { seedDefaultAuditIa } from "./audit-ia/collections.js";
import { seedDefaultBcm } from "./bcm/collections.js";
import { seedDefaultCrisis } from "./crisis/collections.js";
import { seedDefaultCompliance } from "./compliance/collections.js";
import { seedDefaultPrivacy } from "./privacy/collections.js";
import { seedDefaultGrc } from "./grc/collections.js";
import { seedDefaultFindings } from "./findings/collections.js";
import { seedDefaultCampaigns } from "./control-tests/collections.js";
import { seedDefaultMappings } from "./mappings/collections.js";
import { seedDefaultOperationalIssues } from "./operational-issues/collections.js";
import { seedDefaultCrisisDecisions } from "./crisis-decisions/collections.js";
import { seedDefaultCrisisActions } from "./crisis-actions/collections.js";
import { seedDefaultHrCertifications } from "./hr-certifications/collections.js";
import { seedDefaultItsmChanges } from "./itsm-changes/collections.js";
import { seedDefaultItsmProblems } from "./itsm-problems/collections.js";
import { seedDefaultItsmReleases } from "./itsm-releases/collections.js";
import { seedDefaultItAssets } from "./it-assets/collections.js";
import { seedDefaultItLicenses } from "./it-licenses/collections.js";
import { seedDefaultPrivacyDpias } from "./privacy-dpias/collections.js";

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
  /** PG.27 — last heatmap supplier rollup snapshot per tenant. */
  supHeatmapRollupSnapshots: SupHeatmapRollupSnapshot[];
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
  hrEmployees: HrEmployee[];
  hrSkills: HrSkill[];
  hrEmployeeSkills: HrEmployeeSkill[];
  hrLeaveRequests: HrLeaveRequest[];
  cmdbCis: CmdbCi[];
  cmdbRelationships: CmdbRelationship[];
  itsmTickets: ItsmTicket[];
  itsmTicketCis: ItsmTicketCi[];
  otelSpans: OtelSpan[];
  securityAlerts: SecurityAlert[];
  pamSecretRefs: PamSecretRef[];
  pamJitGrants: PamJitGrant[];
  ermRisks: ErmRisk[];
  knowledgeDocuments: KnowledgeDocument[];
  iaEngagements: IaEngagement[];
  iaWorkpapers: IaWorkpaper[];
  bcmBackupJobs: BcmBackupJob[];
  bcmRestoreProbes: BcmRestoreProbe[];
  crisisCases: CrisisCase[];
  crisisTimelineEntries: CrisisTimelineEntry[];
  complianceObligations: ComplianceObligation[];
  privacyProcessingActivities: PrivacyProcessingActivity[];
  privacyDsrCases: PrivacyDsrCase[];
  privacyDpias: PrivacyDpia[];
  grcControls: GrcControl[];
  findingRecords: FindingRecord[];
  controlTestCampaigns: ControlTestCampaign[];
  mappingRecords: RegulationControlMapping[];
  operationalIssues: OperationalIssue[];
  crisisDecisions: CrisisDecision[];
  crisisActions: CrisisAction[];
  hrCertifications: HrCertification[];
  itsmChanges: ItsmChange[];
  itsmProblems: ItsmProblem[];
  itsmReleases: ItsmRelease[];
  itAssets: ItAsset[];
  itLicenses: ItLicense[];
  notifDismissals: NotifDismissal[];
  notifEmailOutbox: NotifEmailOutboxEntry[];
  notifEmailDeliveryEvents: NotifEmailDeliveryEvent[];
  notifEmailTemplates: Array<EmailTemplate & { tenantId: string }>;
  notifEmailSuppressions: NotifEmailSuppression[];
  notifEmailAllowlist: NotifEmailAllowlistEntry[];
  notifDlqSlaDigestRecipients: NotifDlqSlaDigestRecipient[];
  /** I4.19 — last DLQ SLA digest run per tenant. */
  notifDlqSlaDigestLastRuns: NotifDlqSlaDigestLastRun[];
  /** I4.24 — snooze/ack for stale DLQ SLA digest inbox. */
  notifDlqSlaDigestStaleSuppressions: NotifDlqSlaDigestStaleSuppression[];
  /** I4.26 — snooze/ack/clear audit for stale DLQ SLA digest. */
  notifDlqSlaDigestStaleSuppressionAudits: NotifDlqSlaDigestStaleSuppressionAudit[];
  /** I4.29 — last-used DLQ stale-audit export filter (persisted). */
  notifDlqSlaDigestStaleAuditExportLastFilters: NotifDlqSlaDigestStaleAuditExportLastFilter[];
  /** I4.31 — named tenant DLQ stale-audit export presets (persisted). */
  notifDlqSlaDigestStaleAuditExportPresets: NotifDlqSlaDigestStaleAuditExportPreset[];
  /** I4.33 — last-used DLQ stale-audit export preset (in-memory only). */
  notifDlqSlaDigestStaleAuditExportLastPresets: NotifDlqSlaDigestStaleAuditExportLastPreset[];
  /** I4.33 — DLQ stale-audit export preset usage rows (in-memory only). */
  notifDlqSlaDigestStaleAuditExportPresetUsages: NotifDlqSlaDigestStaleAuditExportPresetUsage[];
  /** I3.22 — allowlist dual-control digest ops aliases. */
  notifAllowlistDualDigestRecipients: NotifAllowlistDualDigestRecipient[];
  /** I3.23 — last allowlist dual-control digest run per tenant. */
  notifAllowlistDualDigestLastRuns: NotifAllowlistDualDigestLastRun[];
  /** I3.27 — snooze/ack for stale allowlist dual digest inbox. */
  notifAllowlistDualDigestStaleSuppressions: NotifAllowlistDualDigestStaleSuppression[];
  /** I3.29 / I3.30 — snooze/ack/clear audit for stale allowlist dual digest (persisted). */
  notifAllowlistDualDigestStaleSuppressionAudits: NotifAllowlistDualDigestStaleSuppressionAudit[];
  /** I3.32 — last-used allowlist stale-audit export filter (persisted). */
  notifAllowlistDualDigestStaleAuditExportLastFilters: NotifAllowlistDualDigestStaleAuditExportLastFilter[];
  /** I3.34 — named tenant allowlist stale-audit export presets (persisted). */
  notifAllowlistDualDigestStaleAuditExportPresets: NotifAllowlistDualDigestStaleAuditExportPreset[];
  /** I3.36 / I3.37 — last-used allowlist stale-audit export preset (persisted when dbPool set). */
  notifAllowlistDualDigestStaleAuditExportLastPresets: NotifAllowlistDualDigestStaleAuditExportLastPreset[];
  /** I3.36 / I3.37 — allowlist stale-audit export preset usage rows (persisted when dbPool set). */
  notifAllowlistDualDigestStaleAuditExportPresetUsages: NotifAllowlistDualDigestStaleAuditExportPresetUsage[];
  natsConsumerOffsets: NatsConsumerOffset[];
  /** I20.2 — unpublished AI drafts until human accept. */
  aiDrafts: AiDraft[];
  /** I20.9 — last recommend run per tenant + principal. */
  aiRecommendRuns: AiRecommendLastRun[];
  /** I20.12 — snooze/ack for stale recommend last-run banner. */
  aiRecommendStaleSuppressions: AiRecommendStaleSuppression[];
  /** I20.14 — snooze/ack/clear audit for stale recommend last-run. */
  aiRecommendStaleSuppressionAudits: AiRecommendStaleSuppressionAudit[];
  /** I20.17 — last-used stale-recommend audit export filter. */
  aiRecommendStaleAuditExportLastFilters: AiRecommendStaleAuditExportLastFilter[];
  /** I20.18 — named tenant stale-recommend audit export presets. */
  aiRecommendStaleAuditExportPresets: AiRecommendStaleAuditExportPreset[];
  /** I20.21 / I20.22 — last-used stale-recommend audit export preset (persisted). */
  aiRecommendStaleAuditExportLastPresets: AiRecommendStaleAuditExportLastPreset[];
  /** I20.21 / I20.22 — preset-apply usage audit (persisted). */
  aiRecommendStaleAuditExportPresetUsages: AiRecommendStaleAuditExportPresetUsage[];
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

const ISSUE_PERMS = ["ops:read:issue", "ops:write:issue"] as const;

const DECISION_PERMS = ["crisis:read:decision", "crisis:write:decision"] as const;

const ACTION_PERMS = ["crisis:read:action", "crisis:write:action"] as const;

const CERTIFICATION_PERMS = ["hr:read:certification", "hr:write:certification"] as const;
const CHANGE_PERMS = ["itsm:read:change", "itsm:write:change"] as const;
const PROBLEM_PERMS = ["itsm:read:problem", "itsm:write:problem"] as const;
const RELEASE_PERMS = ["itsm:read:release", "itsm:write:release"] as const;
const ASSET_PERMS = ["asset:read:register", "asset:write:register"] as const;
const LICENSE_PERMS = ["license:read:register", "license:write:register"] as const;
const DPIA_PERMS = ["privacy:read:dpia", "privacy:write:dpia"] as const;

const ANALYTICS_PERMS = ["analytics:read:commercial", "analytics:read:operations", "analytics:read:finance"] as const;

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

const HR_PERMS = [
  "hr:read:employee",
  "hr:write:employee",
  "hr:read:leave",
  "hr:write:leave",
  "hr:approve:leave",
  "hr:read:skill",
  "hr:write:skill",
] as const;

const HR_MEMBER_PERMS = [
  "hr:read:employee",
  "hr:write:employee",
  "hr:read:leave",
  "hr:write:leave",
  "hr:read:skill",
  "hr:write:skill",
] as const;

const HR_APPROVER_PERMS = [
  "hr:read:employee",
  "hr:read:leave",
  "hr:read:skill",
  "hr:approve:leave",
] as const;

const ITSM_PERMS = [
  "itsm:read:ticket",
  "itsm:write:ticket",
  "itsm:assign:ticket",
  "itsm:resolve:ticket",
  "itsm:close:ticket",
] as const;

const CMDB_PERMS = ["cmdb:read:ci", "cmdb:write:ci"] as const;

const OBS_PERMS = ["observability:read:map", "observability:read:signal"] as const;

const SECURITY_PERMS = [
  "security:read:alert",
  "security:ingest:alert",
  "security:write:alert",
  "security:write:case",
] as const;

const SECURITY_ANALYST_PERMS = [
  "security:read:alert",
  "security:write:alert",
  "security:write:case",
] as const;

const PAM_PERMS = [
  "pam:read:ref",
  "pam:write:ref",
  "pam:read:grant",
  "pam:write:grant",
  "pam:revoke:grant",
] as const;

const ERM_PERMS = ["erm:read:risk", "erm:write:risk"] as const;

const KNOWLEDGE_PERMS = ["knowledge:read:document", "knowledge:write:document"] as const;

const AUDIT_IA_PERMS = [
  "auditia:read:engagement",
  "auditia:write:engagement",
  "auditia:read:workpaper",
  "auditia:write:workpaper",
] as const;

const BCM_PERMS = ["bcm:read:job", "bcm:write:job", "bcm:read:probe", "bcm:write:probe"] as const;

const CRISIS_PERMS = [
  "crisis:read:case",
  "crisis:write:case",
  "crisis:read:timeline",
  "crisis:write:timeline",
] as const;

const COMPLIANCE_PERMS = ["compliance:read:obligation", "compliance:write:obligation"] as const;

const GRC_PERMS = ["grc:read:control", "grc:write:control"] as const;

const FINDINGS_PERMS = ["grc:read:finding", "grc:write:finding"] as const;

const CAMPAIGN_PERMS = ["grc:read:campaign", "grc:write:campaign"] as const;

const MAPPING_PERMS = ["grc:read:mapping", "grc:write:mapping"] as const;

const PRIVACY_PERMS = [
  "privacy:read:activity",
  "privacy:write:activity",
  "privacy:read:dsr",
  "privacy:write:dsr",
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
  hrMember: [...HR_MEMBER_PERMS],
  hrApprover: [...HR_APPROVER_PERMS],
  itAgent: [...ITSM_PERMS, ...CMDB_PERMS, ...OBS_PERMS],
  securityAnalyst: [...SECURITY_ANALYST_PERMS],
  riskMember: [...ERM_PERMS],
  auditMember: [...AUDIT_IA_PERMS],
  bcmMember: [...BCM_PERMS],
  crisisCommander: [...CRISIS_PERMS],
  complianceMember: [...COMPLIANCE_PERMS],
  dpo: [...PRIVACY_PERMS],
  grcControl: [...GRC_PERMS],
  grcFinding: [...FINDINGS_PERMS],
  grcCampaign: [...CAMPAIGN_PERMS],
  grcMapping: [...MAPPING_PERMS],
  opsIssue: [...ISSUE_PERMS],
  crisisDecision: [...DECISION_PERMS],
  crisisAction: [...ACTION_PERMS],
  hrCertification: [...CERTIFICATION_PERMS],
  itsmChange: [...CHANGE_PERMS],
  itsmProblem: [...PROBLEM_PERMS],
  itsmRelease: [...RELEASE_PERMS],
  itAsset: [...ASSET_PERMS],
  itLicense: [...LICENSE_PERMS],
  privacyDpia: [...DPIA_PERMS],
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
    ...ISSUE_PERMS,
    ...DECISION_PERMS,
    ...ACTION_PERMS,
    ...CERTIFICATION_PERMS,
    ...CHANGE_PERMS,
    ...PROBLEM_PERMS,
    ...RELEASE_PERMS,
    ...ASSET_PERMS,
    ...LICENSE_PERMS,
    ...DPIA_PERMS,
    ...ANALYTICS_PERMS,
    ...FINANCE_MODULE_PERMS,
    "finance:create:payment",
    "finance:read:payment",
    ...HR_PERMS,
    ...ITSM_PERMS,
    ...CMDB_PERMS,
    ...OBS_PERMS,
    ...SECURITY_PERMS,
    ...PAM_PERMS,
    ...ERM_PERMS,
    ...KNOWLEDGE_PERMS,
    ...AUDIT_IA_PERMS,
    ...BCM_PERMS,
    ...CRISIS_PERMS,
    ...COMPLIANCE_PERMS,
    ...PRIVACY_PERMS,
    ...GRC_PERMS,
    ...FINDINGS_PERMS,
    ...CAMPAIGN_PERMS,
    ...MAPPING_PERMS,
    ...NOTIFICATION_PERMS,
    "ai:read:recommend",
    "ai:write:draft",
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
    "ai:read:recommend",
    "ai:write:draft",
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
    roles: [
      "finance.approver",
      "hr.approver",
      "audit.member",
      "bcm.member",
      "crisis.commander",
      "compliance.member",
      "dpo",
      "grc.control",
      "grc.finding",
      "grc.campaign",
      "grc.mapping",
      "ops.issue",
      "crisis.decision",
      "crisis.action",
      "hr.certification",
      "itsm.change",
      "itsm.problem",
      "itsm.release",
      "it.asset",
      "it.license",
      "privacy.dpia",
    ],
    permissions: [
      ...PERMS.financeApprover,
      ...PERMS.hrApprover,
      ...PERMS.auditMember,
      ...PERMS.bcmMember,
      ...PERMS.crisisCommander,
      ...PERMS.complianceMember,
      ...PERMS.dpo,
      ...PERMS.grcControl,
      ...PERMS.grcFinding,
      ...PERMS.grcCampaign,
      ...PERMS.grcMapping,
      ...PERMS.opsIssue,
      ...PERMS.crisisDecision,
      ...PERMS.crisisAction,
      ...PERMS.hrCertification,
      ...PERMS.itsmChange,
      ...PERMS.itsmProblem,
      ...PERMS.itsmRelease,
      ...PERMS.itAsset,
      ...PERMS.itLicense,
      ...PERMS.privacyDpia,
    ],
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
      id: "role-hr-member",
      tenantId,
      key: "hr.member",
      name: "HR Member",
      permissionKeys: [...PERMS.hrMember],
    },
    {
      id: "role-hr-approver",
      tenantId,
      key: "hr.approver",
      name: "HR Approver",
      permissionKeys: [...PERMS.hrApprover],
    },
    {
      id: "role-it-agent",
      tenantId,
      key: "it.agent",
      name: "IT Agent",
      permissionKeys: [...PERMS.itAgent],
    },
    {
      id: "role-security-analyst",
      tenantId,
      key: "security.analyst",
      name: "Security Analyst",
      permissionKeys: [...PERMS.securityAnalyst],
    },
    {
      id: "role-risk-member",
      tenantId,
      key: "risk.member",
      name: "Risk Member",
      permissionKeys: [...PERMS.riskMember],
    },
    {
      id: "role-compliance-member",
      tenantId,
      key: "compliance.member",
      name: "Compliance Member",
      permissionKeys: [...PERMS.complianceMember],
    },
    {
      id: "role-dpo",
      tenantId,
      key: "dpo",
      name: "DPO",
      permissionKeys: [...PERMS.dpo],
    },
    {
      id: "role-grc-control",
      tenantId,
      key: "grc.control",
      name: "GRC Control",
      permissionKeys: [...PERMS.grcControl],
    },
    {
      id: "role-grc-finding",
      tenantId,
      key: "grc.finding",
      name: "GRC Finding",
      permissionKeys: [...PERMS.grcFinding],
    },
    {
      id: "role-grc-campaign",
      tenantId,
      key: "grc.campaign",
      name: "GRC Campaign",
      permissionKeys: [...PERMS.grcCampaign],
    },
    {
      id: "role-grc-mapping",
      tenantId,
      key: "grc.mapping",
      name: "GRC Mapping",
      permissionKeys: [...PERMS.grcMapping],
    },
    {
      id: "role-ops-issue",
      tenantId,
      key: "ops.issue",
      name: "Operations Issue",
      permissionKeys: [...PERMS.opsIssue],
    },
    {
      id: "role-crisis-decision",
      tenantId,
      key: "crisis.decision",
      name: "Crisis Decision",
      permissionKeys: [...PERMS.crisisDecision],
    },
    {
      id: "role-crisis-action",
      tenantId,
      key: "crisis.action",
      name: "Crisis Action",
      permissionKeys: [...PERMS.crisisAction],
    },
    {
      id: "role-hr-certification",
      tenantId,
      key: "hr.certification",
      name: "HR Certification",
      permissionKeys: [...PERMS.hrCertification],
    },
    {
      id: "role-itsm-change",
      tenantId,
      key: "itsm.change",
      name: "IT Change",
      permissionKeys: [...PERMS.itsmChange],
    },
    {
      id: "role-itsm-problem",
      tenantId,
      key: "itsm.problem",
      name: "IT Problem",
      permissionKeys: [...PERMS.itsmProblem],
    },
    {
      id: "role-itsm-release",
      tenantId,
      key: "itsm.release",
      name: "IT Release",
      permissionKeys: [...PERMS.itsmRelease],
    },
    {
      id: "role-it-asset",
      tenantId,
      key: "it.asset",
      name: "IT Asset",
      permissionKeys: [...PERMS.itAsset],
    },
    {
      id: "role-it-license",
      tenantId,
      key: "it.license",
      name: "IT License",
      permissionKeys: [...PERMS.itLicense],
    },
    {
      id: "role-privacy-dpia",
      tenantId,
      key: "privacy.dpia",
      name: "Privacy DPIA",
      permissionKeys: [...PERMS.privacyDpia],
    },
    {
      id: "role-audit-member",
      tenantId,
      key: "audit.member",
      name: "Audit Member",
      permissionKeys: [...PERMS.auditMember],
    },
    {
      id: "role-bcm-member",
      tenantId,
      key: "bcm.member",
      name: "BCM Member",
      permissionKeys: [...PERMS.bcmMember],
    },
    {
      id: "role-crisis-commander",
      tenantId,
      key: "crisis.commander",
      name: "Crisis Commander",
      permissionKeys: [...PERMS.crisisCommander],
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
        id: "grant-bob-hr",
        tenantId,
        principalId: bobId,
        roleKey: "hr.approver",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-audit",
        tenantId,
        principalId: bobId,
        roleKey: "audit.member",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-bcm",
        tenantId,
        principalId: bobId,
        roleKey: "bcm.member",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-crisis",
        tenantId,
        principalId: bobId,
        roleKey: "crisis.commander",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-compliance",
        tenantId,
        principalId: bobId,
        roleKey: "compliance.member",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-dpo",
        tenantId,
        principalId: bobId,
        roleKey: "dpo",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-grc",
        tenantId,
        principalId: bobId,
        roleKey: "grc.control",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-finding",
        tenantId,
        principalId: bobId,
        roleKey: "grc.finding",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-campaign",
        tenantId,
        principalId: bobId,
        roleKey: "grc.campaign",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-mapping",
        tenantId,
        principalId: bobId,
        roleKey: "grc.mapping",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-ops-issue",
        tenantId,
        principalId: bobId,
        roleKey: "ops.issue",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-crisis-decision",
        tenantId,
        principalId: bobId,
        roleKey: "crisis.decision",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-crisis-action",
        tenantId,
        principalId: bobId,
        roleKey: "crisis.action",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-hr-certification",
        tenantId,
        principalId: bobId,
        roleKey: "hr.certification",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-itsm-change",
        tenantId,
        principalId: bobId,
        roleKey: "itsm.change",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-itsm-problem",
        tenantId,
        principalId: bobId,
        roleKey: "itsm.problem",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-itsm-release",
        tenantId,
        principalId: bobId,
        roleKey: "itsm.release",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-it-asset",
        tenantId,
        principalId: bobId,
        roleKey: "it.asset",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-it-license",
        tenantId,
        principalId: bobId,
        roleKey: "it.license",
        grantedAt: new Date().toISOString(),
        grantedByPrincipalId: carolId,
      },
      {
        id: "grant-bob-privacy-dpia",
        tenantId,
        principalId: bobId,
        roleKey: "privacy.dpia",
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
      {
        key: "leave-write-approve",
        actionA: "hr:write:leave",
        actionB: "hr:approve:leave",
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
    supHeatmapRollupSnapshots: [],
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
    hrEmployees: [],
    hrSkills: [],
    hrEmployeeSkills: [],
    hrLeaveRequests: [],
    cmdbCis: [],
    cmdbRelationships: [],
    itsmTickets: [],
    itsmTicketCis: [],
    otelSpans: [],
    securityAlerts: [],
    pamSecretRefs: [],
    pamJitGrants: [],
    ermRisks: [],
    knowledgeDocuments: [],
    iaEngagements: [],
    iaWorkpapers: [],
    bcmBackupJobs: [],
    bcmRestoreProbes: [],
    crisisCases: [],
    crisisTimelineEntries: [],
    complianceObligations: [],
    privacyProcessingActivities: [],
    privacyDsrCases: [],
    privacyDpias: [],
    grcControls: [],
    findingRecords: [],
    controlTestCampaigns: [],
    mappingRecords: [],
    operationalIssues: [],
    crisisDecisions: [],
    crisisActions: [],
    hrCertifications: [],
    itsmChanges: [],
    itsmProblems: [],
    itsmReleases: [],
    itAssets: [],
    itLicenses: [],
    notifDismissals: [],
    notifEmailOutbox: [],
    notifEmailDeliveryEvents: [],
    notifEmailTemplates: [],
    notifEmailSuppressions: [],
    notifEmailAllowlist: [],
    notifDlqSlaDigestRecipients: [],
    notifDlqSlaDigestLastRuns: [],
    notifDlqSlaDigestStaleSuppressions: [],
    notifDlqSlaDigestStaleSuppressionAudits: [],
    notifDlqSlaDigestStaleAuditExportLastFilters: [],
    notifDlqSlaDigestStaleAuditExportPresets: [],
    notifDlqSlaDigestStaleAuditExportLastPresets: [],
    notifDlqSlaDigestStaleAuditExportPresetUsages: [],
    notifAllowlistDualDigestRecipients: [],
    notifAllowlistDualDigestLastRuns: [],
    notifAllowlistDualDigestStaleSuppressions: [],
    notifAllowlistDualDigestStaleSuppressionAudits: [],
    notifAllowlistDualDigestStaleAuditExportLastFilters: [],
    notifAllowlistDualDigestStaleAuditExportPresets: [],
    notifAllowlistDualDigestStaleAuditExportLastPresets: [],
    notifAllowlistDualDigestStaleAuditExportPresetUsages: [],
    natsConsumerOffsets: [],
    aiDrafts: [],
    aiRecommendRuns: [],
    aiRecommendStaleSuppressions: [],
    aiRecommendStaleSuppressionAudits: [],
    aiRecommendStaleAuditExportLastFilters: [],
    aiRecommendStaleAuditExportPresets: [],
    aiRecommendStaleAuditExportLastPresets: [],
    aiRecommendStaleAuditExportPresetUsages: [],
  };
  seedCrmCatalogues(store, tenantId);
  seedDefaultHr(store);
  seedDefaultIt(store);
  seedDefaultSoc(store);
  seedDefaultPam(store);
  seedDefaultErm(store);
  seedDefaultKnowledge(store);
  seedDefaultAuditIa(store);
  seedDefaultBcm(store);
  seedDefaultCrisis(store);
  seedDefaultCompliance(store);
  seedDefaultPrivacy(store);
  seedDefaultGrc(store);
  seedDefaultFindings(store);
  seedDefaultCampaigns(store);
  seedDefaultMappings(store);
  seedDefaultOperationalIssues(store);
  seedDefaultCrisisDecisions(store);
  seedDefaultCrisisActions(store);
  seedDefaultHrCertifications(store);
  seedDefaultItsmChanges(store);
  seedDefaultItsmProblems(store);
  seedDefaultItsmReleases(store);
  seedDefaultItAssets(store);
  seedDefaultItLicenses(store);
  seedDefaultPrivacyDpias(store);
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
