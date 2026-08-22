import type { SupRate, SupSeason } from "@sedmc/kernel";

export type SeasonBoundsError = "rate_outside_season_dates" | "rate_outside_season_months";

function monthInSeason(month: number, monthFrom?: number, monthTo?: number): boolean {
  if (monthFrom === undefined && monthTo === undefined) return true;
  const from = monthFrom ?? monthTo!;
  const to = monthTo ?? monthFrom!;
  if (from <= to) return month >= from && month <= to;
  return month >= from || month <= to; // wrap (e.g. Nov–Feb)
}

function* monthsInRange(validFrom: string, validTo: string): Generator<number> {
  const start = new Date(`${validFrom}T00:00:00Z`);
  const end = new Date(`${validTo}T00:00:00Z`);
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const endMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
  while (cursor <= endMonth) {
    yield cursor.getUTCMonth() + 1;
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
}

/**
 * PG.19 — when a rate is linked to a catalogue season, enforce date and/or month bounds.
 * Seasons with neither dates nor months pass. Free-text seasonLabel alone is not checked here.
 */
export function assertRateWithinSeason(
  rate: { validFrom: string; validTo: string },
  season: Pick<SupSeason, "validFrom" | "validTo" | "monthFrom" | "monthTo">,
): { ok: true } | { ok: false; error: SeasonBoundsError } {
  const hasDates = Boolean(season.validFrom || season.validTo);
  const hasMonths = season.monthFrom !== undefined || season.monthTo !== undefined;
  if (!hasDates && !hasMonths) return { ok: true };

  if (hasDates) {
    if (season.validFrom && rate.validFrom < season.validFrom) {
      return { ok: false, error: "rate_outside_season_dates" };
    }
    if (season.validTo && rate.validTo > season.validTo) {
      return { ok: false, error: "rate_outside_season_dates" };
    }
  }

  if (hasMonths) {
    for (const month of monthsInRange(rate.validFrom, rate.validTo)) {
      if (!monthInSeason(month, season.monthFrom, season.monthTo)) {
        return { ok: false, error: "rate_outside_season_months" };
      }
    }
  }

  return { ok: true };
}

export type LinkedRateOutsideBounds = {
  id: string;
  supplierId: string;
  rateCode: string;
  validFrom: string;
  validTo: string;
  reason: SeasonBoundsError;
};

/** PG.20 — list non-archived rates linked to a season that fall outside proposed bounds. */
export function findLinkedRatesOutsideSeasonBounds(
  rates: readonly SupRate[],
  season: Pick<SupSeason, "validFrom" | "validTo" | "monthFrom" | "monthTo">,
  opts: { tenantId: string; seasonId: string },
): LinkedRateOutsideBounds[] {
  const outside: LinkedRateOutsideBounds[] = [];
  for (const rate of rates) {
    if (rate.tenantId !== opts.tenantId || rate.archivedAt) continue;
    if (rate.seasonId !== opts.seasonId) continue;
    const check = assertRateWithinSeason(
      { validFrom: rate.validFrom, validTo: rate.validTo },
      season,
    );
    if (!check.ok) {
      outside.push({
        id: rate.id,
        supplierId: rate.supplierId,
        rateCode: rate.rateCode,
        validFrom: rate.validFrom,
        validTo: rate.validTo,
        reason: check.error,
      });
    }
  }
  return outside;
}

export function buildSeasonShrinkImpact(
  rates: readonly SupRate[],
  season: Pick<SupSeason, "id" | "validFrom" | "validTo" | "monthFrom" | "monthTo">,
  tenantId: string,
) {
  const linkedRateCount = rates.filter(
    (r) => r.tenantId === tenantId && !r.archivedAt && r.seasonId === season.id,
  ).length;
  const ratesOutsideBounds = findLinkedRatesOutsideSeasonBounds(rates, season, {
    tenantId,
    seasonId: season.id,
  });
  return {
    linkedRateCount,
    outsideCount: ratesOutsideBounds.length,
    ratesOutsideBounds,
    warning: ratesOutsideBounds.length > 0 ? ("season_shrink_affects_rates" as const) : null,
  };
}

export type ExpandBackfillCandidate = {
  id: string;
  supplierId: string;
  rateCode: string;
  validFrom: string;
  validTo: string;
  seasonLabel?: string;
};

/**
 * PG.22 — unlinked (no seasonId) rates that fit proposed/expanded season bounds.
 * Suggests candidates for backfill after a season expand.
 */
export function findUnlinkedRatesFittingSeason(
  rates: readonly SupRate[],
  season: Pick<SupSeason, "validFrom" | "validTo" | "monthFrom" | "monthTo">,
  opts: { tenantId: string },
): ExpandBackfillCandidate[] {
  const hasBounds =
    Boolean(season.validFrom || season.validTo) ||
    season.monthFrom !== undefined ||
    season.monthTo !== undefined;
  if (!hasBounds) return [];

  const candidates: ExpandBackfillCandidate[] = [];
  for (const rate of rates) {
    if (rate.tenantId !== opts.tenantId || rate.archivedAt) continue;
    if (rate.seasonId) continue;
    const check = assertRateWithinSeason(
      { validFrom: rate.validFrom, validTo: rate.validTo },
      season,
    );
    if (!check.ok) continue;
    candidates.push({
      id: rate.id,
      supplierId: rate.supplierId,
      rateCode: rate.rateCode,
      validFrom: rate.validFrom,
      validTo: rate.validTo,
      ...(rate.seasonLabel ? { seasonLabel: rate.seasonLabel } : {}),
    });
  }
  return candidates;
}

export function buildSeasonExpandBackfill(
  rates: readonly SupRate[],
  season: Pick<SupSeason, "id" | "validFrom" | "validTo" | "monthFrom" | "monthTo">,
  tenantId: string,
) {
  const suggestions = findUnlinkedRatesFittingSeason(rates, season, { tenantId });
  return {
    suggestionCount: suggestions.length,
    suggestions,
    hint: suggestions.length > 0 ? ("season_expand_backfill_available" as const) : null,
  };
}
