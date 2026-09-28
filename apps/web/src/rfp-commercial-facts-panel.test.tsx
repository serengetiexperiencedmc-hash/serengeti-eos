import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RfpCommercialFactsPanel } from "./components/commercial/RfpCommercialFactsPanel";
import {
  buildRfpFactsPutPayload,
  commercialFactsCanWrite,
  COMMERCIAL_CHANNEL_LABELS,
  COMMERCIAL_SOURCE_LABELS,
  draftFromRfpFacts,
  emptyRfpFactsDraft,
  mapCommercialFactsPutFailure,
  persistenceCaption,
  type RfpCommercialFacts,
  type RfpFactsDraft,
} from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const facts: RfpCommercialFacts = {
  rfpId: "rfp-1",
  workflowStage: "intake",
  secondarySources: [],
  clarificationStatus: "not_started",
  clarificationEvents: [],
  sourceDistinctFromChannel: true,
  legacyCollapsedSourceAuthoritativeForF2: false,
  receivedAtStatus: "unavailable",
  firstResponseAtStatus: "unavailable",
  createdAtUsedAsReceivedAt: false,
};

function render(props: Partial<ComponentProps<typeof RfpCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(RfpCommercialFactsPanel, {
      facts: null,
      pathB: null,
      draft: emptyRfpFactsDraft(),
      onDraftChange: () => undefined,
      onSave: () => undefined,
      ...props,
    }),
  );
}

describe("H-111 Day 3 RFP F2 commercial-facts UI", () => {
  it("renders RFP detail facts without fabricating SOURCE, CHANNEL, or timestamps", () => {
    const html = render({
      facts,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("F2 RFP facts");
    expect(html).toContain("not recorded");
    expect(html).toContain("No F2 RFP facts recorded yet");
    expect(html).not.toContain("Save F2 RFP facts");
  });

  it("renders SOURCE from the kernel catalogue, not CHANNEL", () => {
    const html = render({
      facts: { ...facts, primarySource: "referral", channel: "email" },
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain(COMMERCIAL_SOURCE_LABELS.referral);
    expect(html).toContain("Primary source (origin)");
    expect(html).not.toContain("walk_in");
  });

  it("renders CHANNEL from the kernel catalogue, distinct from SOURCE", () => {
    const html = render({
      facts: { ...facts, primarySource: "website_organic", channel: "whatsapp" },
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain(COMMERCIAL_CHANNEL_LABELS.whatsapp);
    expect(html).toContain("Channel (intake path)");
    expect(html).toContain(COMMERCIAL_SOURCE_LABELS.website_organic);
  });

  it("renders timestamps as not recorded when unavailable and as ISO when observed", () => {
    const missing = render({
      facts,
      persistence: { recorded: false, mode: "in_memory_preview", mixedSqlDurable: false },
    });
    expect(missing).toContain("not recorded");
    expect(missing).not.toContain("2026-09-10T08:00:00.000Z");

    const observed = render({
      facts: {
        ...facts,
        receivedAt: "2026-09-10T08:00:00.000Z",
        receivedAtStatus: "observed",
        firstResponseAt: "2026-09-10T10:00:00.000Z",
        firstResponseAtStatus: "observed",
      },
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(observed).toContain("2026-09-10T08:00:00.000Z");
    expect(observed).toContain("2026-09-10T10:00:00.000Z");
    expect(observed).toContain("immutable once observed");
  });

  it("authorized edit exposes SOURCE and CHANNEL selects and save", () => {
    const html = render({
      facts,
      canWrite: true,
      draft: { ...emptyRfpFactsDraft(), primarySource: "referral", channel: "email" },
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Save F2 RFP facts");
    expect(html).toContain('value="referral"');
    expect(html).toContain('value="email"');
    expect(html).toContain("Do not copy one into the other");
  });

  it("unauthorized edit is blocked", () => {
    const html = render({ unauthorized: true });
    expect(html).toContain("Not authorized to read RFP commercial facts");
    expect(html).not.toContain("Save F2 RFP facts");
    expect(html).not.toContain("Primary source (origin)");
  });

  it("partial update payload preserves other fields and never copies SOURCE into CHANNEL", () => {
    const current: RfpCommercialFacts = {
      ...facts,
      primarySource: "referral",
      channel: "email",
      receivedAt: "2026-09-10T08:00:00.000Z",
    };
    const draft: RfpFactsDraft = {
      ...draftFromRfpFacts(current),
      clarificationStatus: "started",
    };
    const built = buildRfpFactsPutPayload(draft, current);
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.payload.primarySource).toBeUndefined();
    expect(built.payload.channel).toBeUndefined();
    expect(built.payload.receivedAt).toBeUndefined();
    expect(built.payload.firstResponseAt).toBeUndefined();
    expect(built.payload.clarificationStatus).toBe("started");

    const sourceOnly = buildRfpFactsPutPayload(
      { ...emptyRfpFactsDraft(), primarySource: "referral" },
      facts,
    );
    expect(sourceOnly).toEqual({ ok: false, error: "primary_source_and_channel_required" });

    const channelAsSource = buildRfpFactsPutPayload(
      { ...emptyRfpFactsDraft(), primarySource: "email", channel: "email" },
      facts,
    );
    expect(channelAsSource).toEqual({ ok: false, error: "invalid_primary_source" });
  });

  it("unavailable facts are not fabricated and Path B stays display-only", () => {
    const html = render({
      facts,
      pathB: null,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("unavailable");
    expect(html).not.toContain("display only");
    expect(html).not.toContain("first response recorded automatically");
    expect(html).not.toMatch(/250000|revenue|profit/);
  });

  it("persistence status is represented on the panel", () => {
    const html = render({
      facts,
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("F2 facts recorded");
    expect(html).toContain("mixed SQL not durable");
    expect(
      persistenceCaption({ recorded: false, mode: "in_memory_preview", mixedSqlDurable: false }),
    ).toContain("in-memory preview");
  });
});

describe("H-111 Day 5 D5-S1 RFP read/write security UI", () => {
  it("keeps GET 403 masking: facts and editor stay hidden", () => {
    const html = render({ unauthorized: true, error: "Not authorized to read RFP commercial facts." });
    expect(html).toContain("Not authorized to read RFP commercial facts");
    expect(html).not.toContain("Primary source (origin)");
    expect(html).not.toContain("Save F2 RFP facts");
    expect(html).not.toContain("Channel (intake path)");
  });

  it("keeps PUT 403 as an explicit unauthorized update, not success", () => {
    const html = render({
      facts,
      canWrite: false,
      error: "Not authorized to update RFP commercial facts.",
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Not authorized to update RFP commercial facts.");
    expect(html).toContain("Primary source (origin)");
    expect(html).not.toContain("Save F2 RFP facts");
    expect(html).not.toMatch(/saved|save succeeded|updated successfully/i);
  });

  it("does not regress authorized editing", () => {
    const html = render({
      facts,
      canWrite: true,
      draft: { ...emptyRfpFactsDraft(), primarySource: "referral", channel: "email" },
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Save F2 RFP facts");
    expect(html).toContain("Primary source");
    expect(html).toContain("Channel");
  });

  it("maps RFP PUT 403 to the established unauthorized-update copy", () => {
    const mapped = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "rfp");
    expect(mapped.writeForbidden).toBe(true);
    expect(mapped.message).toBe("Not authorized to update RFP commercial facts.");
    expect(
      commercialFactsCanWrite({
        hasToken: true,
        factsLoaded: true,
        unauthorizedRead: false,
        writeForbidden: true,
      }),
    ).toBe(false);
  });
});
