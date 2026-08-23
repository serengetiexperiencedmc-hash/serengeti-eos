/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { AI_DRAFT_AUTONOMY_LEVEL, buildAiDraftArtefact, isDraftableRecommendationKey } from "./ai-draft.js";

describe("I20.3 AI draft artefacts", () => {
  it("builds a crm_task draft from a known recommendation", () => {
    const artefact = buildAiDraftArtefact({
      recommendationKey: "crm.duplicate.review",
      title: "Review possible duplicate CRM records",
      reason: "2 candidate pairs need a human review.",
    });
    expect("error" in artefact).toBe(false);
    if ("error" in artefact) return;
    expect(artefact.artefactType).toBe("crm_task");
    expect(artefact.title).toContain("Follow up");
    expect(artefact.body).toContain("Not applied until a human accepts");
    expect(AI_DRAFT_AUTONOMY_LEVEL).toBe(2);
  });

  it("builds a crm_activity draft for overdue tasks", () => {
    const artefact = buildAiDraftArtefact({
      recommendationKey: "crm.task.overdue",
      title: "Complete overdue CRM tasks",
      reason: "1 open task is past due.",
    });
    expect("error" in artefact).toBe(false);
    if ("error" in artefact) return;
    expect(artefact.artefactType).toBe("crm_activity");
    expect(artefact.title).toContain("Log follow-up");
    expect(artefact.body).toContain("CRM activity");
  });

  it("rejects unknown recommendation keys", () => {
    expect(isDraftableRecommendationKey("crm.merge.execute")).toBe(false);
    expect(
      buildAiDraftArtefact({
        recommendationKey: "crm.merge.execute",
        title: "Merge",
        reason: "no",
      }),
    ).toEqual({ error: "unknown_recommendation_key" });
  });
});
