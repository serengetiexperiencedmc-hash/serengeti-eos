/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import {
  AI_RECOMMEND_AUTONOMY_CEILING,
  assertSafeAiRecommendations,
  createDevRulesRecommendProvider,
  aiRecommendLastRunFreshness,
  filterAiRecommendLastRunKeys,
  formatAiRecommendLastRunCsv,
  isAiRecommendStaleSuppressed,
  isAllowedAiRecommendHref,
  filterAiRecommendStaleSuppressionAudits,
  formatAiRecommendStaleSuppressionAuditCsv,
  parseAiRecommendStaleAuditExportFilter,
  sanitizeAiRecommendStaleAuditExportLastFilter,
  sanitizeAiRecommendLastRun,
  sanitizeAiRecommendStaleSuppression,
  sanitizeAiRecommendStaleSuppressionAudit,
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

  it("filters and formats last-run keys", () => {
    const keys = ["crm.duplicate.review", "crm.task.overdue", "events.dlq_digest.stale"];
    expect(filterAiRecommendLastRunKeys(keys, "crm.")).toEqual(["crm.duplicate.review", "crm.task.overdue"]);
    expect(filterAiRecommendLastRunKeys(keys, "events.dlq_digest.stale")).toEqual(["events.dlq_digest.stale"]);
    expect(formatAiRecommendLastRunCsv({
      occurredAt: "2026-08-23T09:00:00.000Z",
      provider: "dev-rules",
      count: 3,
      keys: ["crm.task.overdue"],
      stale: false,
      neverRun: false,
      ageHours: 0.1,
      thresholdHours: 26,
    })).toContain("stale,neverRun,ageHours,thresholdHours");
    expect(aiRecommendLastRunFreshness(undefined).neverRun).toBe(true);
    expect(aiRecommendLastRunFreshness(undefined).stale).toBe(true);
    const stale = aiRecommendLastRunFreshness(new Date(Date.now() - 30 * 3_600_000).toISOString());
    expect(stale.neverRun).toBe(false);
    expect(stale.stale).toBe(true);
  });

  it("treats ack and active snooze as suppressed", () => {
    const now = Date.parse("2026-08-23T12:00:00.000Z");
    expect(isAiRecommendStaleSuppressed(undefined)).toBe(false);
    expect(
      isAiRecommendStaleSuppressed(
        {
          tenantId: "t1",
          principalId: "p1",
          snoozedUntil: "2026-08-23T11:00:00.000Z",
          updatedAt: "2026-08-23T10:00:00.000Z",
          updatedByPrincipalId: "p1",
        },
        now,
      ),
    ).toBe(false);
    expect(
      isAiRecommendStaleSuppressed(
        {
          tenantId: "t1",
          principalId: "p1",
          snoozedUntil: "2026-08-23T13:00:00.000Z",
          updatedAt: "2026-08-23T10:00:00.000Z",
          updatedByPrincipalId: "p1",
        },
        now,
      ),
    ).toBe(true);
    const acked = sanitizeAiRecommendStaleSuppression({
      tenantId: "t1",
      principalId: "p1",
      acknowledgedAt: "2026-08-23T10:00:00.000Z",
      updatedAt: "2026-08-23T10:00:00.000Z",
      updatedByPrincipalId: "p1",
    });
    expect(acked.acknowledgedAt).toBe("2026-08-23T10:00:00.000Z");
    expect(acked).not.toHaveProperty("tenantId");
    expect(isAiRecommendStaleSuppressed({
      tenantId: "t1",
      principalId: "p1",
      acknowledgedAt: "2026-08-23T10:00:00.000Z",
      updatedAt: "2026-08-23T10:00:00.000Z",
      updatedByPrincipalId: "p1",
    })).toBe(true);
  });

  it("sanitizes stale suppression audit and formats CSV", () => {
    const view = sanitizeAiRecommendStaleSuppressionAudit({
      id: "a1",
      tenantId: "t1",
      principalId: "p1",
      action: "snooze",
      snoozedUntil: "2026-08-24T10:00:00.000Z",
      createdAt: "2026-08-23T10:00:00.000Z",
      createdByPrincipalId: "p1",
    });
    expect(view.action).toBe("snooze");
    expect(view).not.toHaveProperty("tenantId");
    expect(formatAiRecommendStaleSuppressionAuditCsv([view])).toContain(
      "action,snoozedUntil,acknowledgedAt,createdAt,createdByPrincipalId",
    );
    expect(formatAiRecommendStaleSuppressionAuditCsv([view])).toContain("snooze");
  });

  it("filters stale audit by action and createdAt window", () => {
    expect(parseAiRecommendStaleAuditExportFilter({ action: "merge" })).toEqual({ error: "invalid_action" });
    expect(parseAiRecommendStaleAuditExportFilter({ since: "not-a-date" })).toEqual({ error: "invalid_window" });
    expect(
      parseAiRecommendStaleAuditExportFilter({
        since: "2026-08-24T00:00:00.000Z",
        until: "2026-08-23T00:00:00.000Z",
      }),
    ).toEqual({ error: "invalid_window" });
    const parsed = parseAiRecommendStaleAuditExportFilter({
      action: "ack",
      since: "2026-08-23T10:00:00.000Z",
    });
    expect("error" in parsed).toBe(false);
    const rows = [
      { action: "snooze", createdAt: "2026-08-23T09:00:00.000Z" },
      { action: "ack", createdAt: "2026-08-23T11:00:00.000Z" },
      { action: "ack", createdAt: "2026-08-23T08:00:00.000Z" },
      { action: "cleared", createdAt: "2026-08-23T12:00:00.000Z" },
    ];
    expect(
      filterAiRecommendStaleSuppressionAudits(rows, parsed as Extract<typeof parsed, { action: unknown }>),
    ).toEqual([{ action: "ack", createdAt: "2026-08-23T11:00:00.000Z" }]);
  });

  it("sanitizes last-used audit export filter", () => {
    const view = sanitizeAiRecommendStaleAuditExportLastFilter({
      tenantId: "t1",
      principalId: "p1",
      action: "snooze",
      since: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T12:00:00.000Z",
    });
    expect(view.action).toBe("snooze");
    expect(view.since).toBe("2026-08-23T00:00:00.000Z");
    expect(view).not.toHaveProperty("tenantId");
  });
});
