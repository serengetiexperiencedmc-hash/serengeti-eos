/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import {
  AI_RECOMMEND_AUTONOMY_CEILING,
  assertSafeAiRecommendations,
  createDevRulesRecommendProvider,
  isAllowedAiRecommendHref,
  sanitizeAiRecommendLastRun,
} from "./ai-recommend.js";

describe("I20.1 AI recommend port", () => {
  it("maps signals to recommend-only internal hrefs", () => {
    const provider = createDevRulesRecommendProvider();
    expect(provider.autonomyCeiling).toBe(AI_RECOMMEND_AUTONOMY_CEILING);
    const items = provider.recommend({
      tenantId: "t1",
      principalId: "p1",
      signals: [
        { kind: "crm_duplicate", count: 2 },
        { kind: "org_missing_owner", count: 1 },
      ],
    });
    expect(items).toHaveLength(2);
    expect(items.every((i) => i.autonomyLevel === 1)).toBe(true);
    expect(items.every((i) => isAllowedAiRecommendHref(i.href))).toBe(true);
    expect(items.map((i) => i.key)).toContain("crm.duplicate.review");
  });

  it("rejects write or external hrefs", () => {
    expect(() =>
      assertSafeAiRecommendations([
        {
          id: "x",
          key: "bad",
          title: "Bad",
          reason: "no",
          href: "/v1/crm/merges",
          autonomyLevel: 1,
          confidence: 1,
          evidence: [],
        },
      ]),
    ).toThrow("ai_recommend_href_rejected");
  });

  it("sanitizes last-run to keys only", () => {
    const view = sanitizeAiRecommendLastRun({
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      occurredAt: "2026-08-23T09:00:00.000Z",
      provider: "dev-rules",
      count: 1,
      keys: ["crm.duplicate.review"],
    });
    expect(view).toEqual({
      occurredAt: "2026-08-23T09:00:00.000Z",
      provider: "dev-rules",
      count: 1,
      keys: ["crm.duplicate.review"],
    });
    expect(view).not.toHaveProperty("tenantId");
    expect(view).not.toHaveProperty("principalId");
  });
});
