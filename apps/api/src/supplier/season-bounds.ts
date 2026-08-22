import type { SupSeason } from "@sedmc/kernel";

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
