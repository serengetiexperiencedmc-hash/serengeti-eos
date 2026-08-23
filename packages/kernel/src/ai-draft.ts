/** I20.3 — typed draft artefacts stay unpublished until a human accepts. Autonomy 2. */

export const AI_DRAFT_AUTONOMY_LEVEL = 2 as const;

export const AI_DRAFT_ARTEFACT_TYPES = ["crm_task", "crm_activity"] as const;
export type AiDraftArtefactType = (typeof AI_DRAFT_ARTEFACT_TYPES)[number];

export const AI_DRAFT_STATUSES = ["pending", "accepted", "discarded"] as const;
export type AiDraftStatus = (typeof AI_DRAFT_STATUSES)[number];

export const AI_DRAFTABLE_RECOMMENDATION_KEYS = [
  "crm.duplicate.review",
  "crm.task.overdue",
  "crm.organization.missing_owner",
  "events.dlq_digest.stale",
  "notifications.allowlist_digest.stale",
] as const;
export type AiDraftableRecommendationKey = (typeof AI_DRAFTABLE_RECOMMENDATION_KEYS)[number];

export type AiDraft = {
  id: string;
  tenantId: string;
  recommendationKey: AiDraftableRecommendationKey;
  artefactType: AiDraftArtefactType;
  title: string;
  body: string;
  status: AiDraftStatus;
  autonomyLevel: typeof AI_DRAFT_AUTONOMY_LEVEL;
  createdAt: string;
  createdByPrincipalId: string;
  acceptedAt?: string;
  acceptedByPrincipalId?: string;
  discardedAt?: string;
  discardedByPrincipalId?: string;
  appliedEntityType?: AiDraftArtefactType;
  appliedEntityId?: string;
  relatedOrganizationId?: string;
  relatedContactId?: string;
};

export function isDraftableRecommendationKey(key: string): key is AiDraftableRecommendationKey {
  return (AI_DRAFTABLE_RECOMMENDATION_KEYS as readonly string[]).includes(key);
}

export function artefactTypeForRecommendation(key: AiDraftableRecommendationKey): AiDraftArtefactType {
  return key === "crm.task.overdue" ? "crm_activity" : "crm_task";
}

export function buildAiDraftArtefact(input: {
  recommendationKey: string;
  title: string;
  reason: string;
}): { artefactType: AiDraftArtefactType; title: string; body: string } | { error: "unknown_recommendation_key" } {
  if (!isDraftableRecommendationKey(input.recommendationKey)) {
    return { error: "unknown_recommendation_key" };
  }
  const artefactType = artefactTypeForRecommendation(input.recommendationKey);
  const title =
    artefactType === "crm_activity"
      ? `Log follow-up: ${input.title}`.slice(0, 200)
      : `Follow up: ${input.title}`.slice(0, 200);
  return {
    artefactType,
    title,
    body: [
      input.reason,
      "",
      artefactType === "crm_activity"
        ? "Drafted as a CRM activity (I20.3). Not applied until a human accepts."
        : "Drafted as a CRM task (I20.3). Not applied until a human accepts.",
      "This draft does not merge, email, assign an owner, or approve anything.",
    ].join("\n"),
  };
}
