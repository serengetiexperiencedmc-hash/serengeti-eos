import { describe, expect, it } from "vitest";
import { rewriteTrailingSlashPathname } from "./lib/trailing-slash";

describe("trailing-slash preview rewrite", () => {
  it("rewrites /commercial/ to /commercial", () => {
    expect(rewriteTrailingSlashPathname("/commercial/")).toBe("/commercial");
  });

  it("rewrites nested trailing slashes", () => {
    expect(rewriteTrailingSlashPathname("/commercial/crm/")).toBe("/commercial/crm");
  });

  it("leaves canonical paths unchanged", () => {
    expect(rewriteTrailingSlashPathname("/commercial")).toBeNull();
    expect(rewriteTrailingSlashPathname("/")).toBeNull();
  });

  it("URL pathname assignment drops the trailing slash", () => {
    const dest = new URL("http://127.0.0.1:3001/commercial/");
    dest.pathname = rewriteTrailingSlashPathname(dest.pathname) ?? dest.pathname;
    expect(dest.pathname).toBe("/commercial");
    expect(dest.href).toBe("http://127.0.0.1:3001/commercial");
  });
});
