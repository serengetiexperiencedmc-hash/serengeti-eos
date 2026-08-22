import { describe, expect, it } from "vitest";
import { assessFinalInvoiceEligibility } from "./finance-final-invoice.js";

describe("final invoice eligibility", () => {
  it("requires deposit and progress paid before auto final", () => {
    const none = assessFinalInvoiceEligibility(100000, []);
    expect(none.eligible).toBe(false);
    expect(none.reason).toBe("deposit_missing");

    const depositOnly = assessFinalInvoiceEligibility(100000, [
      { invoiceType: "deposit", status: "paid", amount: 30000 },
    ]);
    expect(depositOnly.eligible).toBe(false);
    expect(depositOnly.reason).toBe("progress_missing");

    const unpaidProgress = assessFinalInvoiceEligibility(100000, [
      { invoiceType: "deposit", status: "paid", amount: 30000 },
      { invoiceType: "progress", status: "issued", amount: 40000 },
    ]);
    expect(unpaidProgress.eligible).toBe(false);
    expect(unpaidProgress.reason).toBe("progress_not_paid");

    const ready = assessFinalInvoiceEligibility(100000, [
      { invoiceType: "deposit", status: "paid", amount: 30000 },
      { invoiceType: "progress", status: "paid", amount: 40000 },
    ]);
    expect(ready.eligible).toBe(true);
    expect(ready.remainingAmount).toBe(30000);
  });
});
