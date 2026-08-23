/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import {
  AI_DRAFT_AUTONOMY_LEVEL,
  appliedCrmHref,
  buildAiDraftArtefact,
  isAiDraftArtefactType,
  isAiDraftStatus,
  isDraftableRecommendationKey,
} from "./ai-draft.js";

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

  it("accepts only known draft filters", () => {
    expect(isAiDraftStatus("pending")).toBe(true);
    expect(isAiDraftStatus("accepted")).toBe(true);
    expect(isAiDraftStatus("applied")).toBe(false);
    expect(isAiDraftArtefactType("crm_task")).toBe(true);
    expect(isAiDraftArtefactType("crm_activity")).toBe(true);
    expect(isAiDraftArtefactType("crm_merge")).toBe(false);
  });

  it("builds CRM deep-links only for applied task or activity ids", () => {
    expect(appliedCrmHref("crm_task", "11111111-1111-4111-8111-111111111111")).toBe(
      "/commercial/crm?task=11111111-1111-4111-8111-111111111111",
    );
    expect(appliedCrmHref("crm_activity", "22222222-2222-4222-8222-222222222222")).toBe(
      "/commercial/crm?activity=22222222-2222-4222-8222-222222222222",
    );
    expect(appliedCrmHref("crm_task", "/commercial/notifications")).toBeUndefined();
    expect(appliedCrmHref(undefined, "11111111-1111-4111-8111-111111111111")).toBeUndefined();
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
