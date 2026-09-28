import { computeCostTotals, type CostLineCategory, type CostTotalsResult } from "./costing.js";
import type { Principal } from "./types.js";

/** H-203 authorized default markup on supplier cost. Not a client-facing figure. */
export const H203_DEFAULT_MARKUP_PERCENT = 25;

/**
 * H-203 authorized minimum gross margin.
 * Replaces the technical `marginFloorPercent ?? 20` default on the H-203 costing path.
 * Distinct from the legacy mixed 250k/20% Path B threshold, which remains non-authoritative.
 */
export const H203_APPROVED_MARGIN_FLOOR_PERCENT = 15;

/** Internal file fee incorporated into the client selling price. Not a client-facing line. */
export const H203_FILE_FEE_USD = 200;

export const H203_DEFAULT_DEPOSIT_PERCENT = 30;

export const H203_SAFARI_VEHICLE_MAX_PASSENGERS = 6;
export const H203_DRIVER_GUIDE_MAX_GUESTS = 6;
export const H203_TOUR_LEADER_MAX_VEHICLES = 10;
export const H203_TOUR_LEADER_MAX_GUESTS = 60;

export const H203_COMMERCIAL_RESPONSIBLE_ROLES = ["ceo_md", "commercial_director"] as const;
export type H203CommercialResponsibleRole = (typeof H203_COMMERCIAL_RESPONSIBLE_ROLES)[number];

export const H203_WON_LOST_OWNER = "consultant" as const;
export const H203_WON_LOST_RECORD = "opportunity" as const;

export const PROGRAMME_ROOM_TYPES = ["single", "twin", "double", "triple", "crew_staff", "other"] as const;
export type ProgrammeRoomType = (typeof PROGRAMME_ROOM_TYPES)[number];

export function isValidProgrammeRoomType(value: string): value is ProgrammeRoomType {
  return (PROGRAMME_ROOM_TYPES as readonly string[]).includes(value);
}

export type ProgrammePaymentMilestone = {
  code: string;
  label: string;
  percent: number;
};

export function defaultProgrammePaymentMilestones(): ProgrammePaymentMilestone[] {
  return [
    { code: "confirmation", label: "On confirmation", percent: 30 },
    { code: "days_before_arrival_90", label: "90 days before arrival", percent: 40 },
    { code: "days_before_arrival_30", label: "30 days before arrival", percent: 30 },
  ];
}

export function paymentMilestonesTotalPercent(milestones: readonly ProgrammePaymentMilestone[]): number {
  return Math.round(milestones.reduce((sum, m) => sum + m.percent, 0) * 100) / 100;
}

export function paymentMilestonesTotalOneHundred(milestones: readonly ProgrammePaymentMilestone[]): boolean {
  return paymentMilestonesTotalPercent(milestones) === 100;
}

/** nights = departure date − arrival date. Example: 10 June → 24 June = 14. */
export function programmeNightCount(arrivalDate?: string | null, departureDate?: string | null): number | undefined {
  if (!arrivalDate || !departureDate) return undefined;
  const arrival = Date.parse(`${arrivalDate}T00:00:00Z`);
  const departure = Date.parse(`${departureDate}T00:00:00Z`);
  if (Number.isNaN(arrival) || Number.isNaN(departure)) return undefined;
  return Math.round((departure - arrival) / 86_400_000);
}

export function requiredSafariVehicles(
  guestCount: number,
  maxPassengers = H203_SAFARI_VEHICLE_MAX_PASSENGERS,
): number {
  if (guestCount <= 0) return 0;
  return Math.ceil(guestCount / maxPassengers);
}

export type TaxInputMode = "none" | "rate" | "amount";

export type H203PriceCompositionInput = {
  lines: Array<{ category: CostLineCategory; lineTotal: number }>;
  currency: string;
  markupPercent?: number;
  sellPriceOverride?: number;
  paxCount?: number;
  fileFeeAmount?: number;
  taxMode?: TaxInputMode;
  taxRatePercent?: number;
  taxAmountEntered?: number;
};

export type H203PriceComposition = CostTotalsResult & {
  markupPercentApplied?: number;
  baseSellPrice: number;
  fileFeeAmount: number;
  fileFeeIncorporatedIntoPrice: boolean;
  taxMode: TaxInputMode;
  taxRatePercent?: number;
  taxAmount: number;
  clientSellingPrice: number;
  sellPriceSource: "sellPriceOverride" | "markupPercent" | "equalsSupplierCost";
  formula: "kernel.computeCostTotals";
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function resolveH203FileFeeAmount(currency: string, explicit?: number): number {
  if (explicit !== undefined) return roundMoney(explicit);
  if (currency.toUpperCase() === "USD") return H203_FILE_FEE_USD;
  return 0;
}

export function composeH203ClientPrice(input: H203PriceCompositionInput): H203PriceComposition {
  const markupPercent =
    input.sellPriceOverride === undefined
      ? (input.markupPercent ?? H203_DEFAULT_MARKUP_PERCENT)
      : input.markupPercent;
  const core = computeCostTotals({
    lines: input.lines,
    ...(markupPercent !== undefined ? { markupPercent } : {}),
    ...(input.sellPriceOverride !== undefined ? { sellPriceOverride: input.sellPriceOverride } : {}),
    ...(input.paxCount !== undefined ? { paxCount: input.paxCount } : {}),
  });

  const taxMode: TaxInputMode = input.taxMode ?? "none";
  let taxAmount = 0;
  if (taxMode === "amount" && input.taxAmountEntered !== undefined) {
    taxAmount = roundMoney(input.taxAmountEntered);
  } else if (taxMode === "rate" && input.taxRatePercent !== undefined) {
    taxAmount = roundMoney(core.sellPrice * (input.taxRatePercent / 100));
  }

  const fileFeeAmount = resolveH203FileFeeAmount(input.currency, input.fileFeeAmount);
  const overrideIsFinal = input.sellPriceOverride !== undefined;
  const fileFeeIncorporatedIntoPrice = !overrideIsFinal && fileFeeAmount > 0;
  const taxIncorporated = !overrideIsFinal && taxAmount > 0;
  const clientSellingPrice = overrideIsFinal
    ? core.sellPrice
    : roundMoney(core.sellPrice + fileFeeAmount + taxAmount);

  const grossProfit = roundMoney(clientSellingPrice - core.totalCost);
  const grossMarginPercent =
    clientSellingPrice > 0 ? Math.round((grossProfit / clientSellingPrice) * 10000) / 100 : 0;
  const perPerson =
    input.paxCount && input.paxCount > 0 ? roundMoney(clientSellingPrice / input.paxCount) : undefined;

  const sellPriceSource: H203PriceComposition["sellPriceSource"] =
    input.sellPriceOverride !== undefined
      ? "sellPriceOverride"
      : markupPercent !== undefined
        ? "markupPercent"
        : "equalsSupplierCost";

  const composition: H203PriceComposition = {
    ...core,
    baseSellPrice: core.sellPrice,
    fileFeeAmount,
    fileFeeIncorporatedIntoPrice,
    taxMode,
    taxAmount,
    clientSellingPrice,
    sellPrice: clientSellingPrice,
    marginAmount: grossProfit,
    marginPercent: grossMarginPercent,
    sellPriceSource,
    formula: "kernel.computeCostTotals",
  };
  if (markupPercent !== undefined) composition.markupPercentApplied = markupPercent;
  if (taxMode === "rate" && input.taxRatePercent !== undefined) composition.taxRatePercent = input.taxRatePercent;
  if (perPerson !== undefined) composition.perPerson = perPerson;
  if (!fileFeeIncorporatedIntoPrice && overrideIsFinal) {
    composition.fileFeeIncorporatedIntoPrice = false;
  }
  if (taxIncorporated) {
    /* tax already folded into clientSellingPrice */
  }
  return composition;
}

export function h203MarginMeetsApprovedFloor(
  grossMarginPercent: number,
  floorPercent = H203_APPROVED_MARGIN_FLOOR_PERCENT,
): boolean {
  return grossMarginPercent >= floorPercent;
}

export function principalMayAuthorizeMarginFloorException(principal: Principal): boolean {
  const roles = principal.roles.map((r) => r.toLowerCase());
  return (
    roles.includes("platform.admin") ||
    roles.includes("commercial_director") ||
    roles.includes("ceo_md")
  );
}

export const CLIENT_FACING_FORBIDDEN = [
  "supplierCost",
  "totalCost",
  "grossProfit",
  "grossMargin",
  "grossMarginPercent",
  "marginPercent",
  "marginAmount",
  "markupPercent",
  "markupPercentApplied",
  "markupValue",
  "fileFee",
  "fileFeeAmount",
  "commission",
  "baseSellPrice",
  "sellPriceSource",
  "taxAmount",
  "taxRatePercent",
  "taxMode",
  "fxRate",
  "fxCurrencyPair",
  "fxAsOfDate",
  "fxSourceReference",
  "marginFloorPercent",
  "marginMeetsFloor",
] as const;

export type ClientFacingCommercialView = {
  currency: string;
  clientSellingPrice: number;
};

export function toClientFacingCommercialView(input: {
  currency: string;
  clientSellingPrice: number;
}): ClientFacingCommercialView {
  return {
    currency: input.currency,
    clientSellingPrice: input.clientSellingPrice,
  };
}

export function clientFacingViewContainsInternalCommercial(view: Record<string, unknown>): boolean {
  return CLIENT_FACING_FORBIDDEN.some((key) => Object.prototype.hasOwnProperty.call(view, key));
}

export type PrgRoomingEntry = {
  id: string;
  tenantId: string;
  programmeId: string;
  roomType: ProgrammeRoomType;
  roomCount: number;
  occupancy?: number;
  complimentary?: boolean;
  supplementNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
