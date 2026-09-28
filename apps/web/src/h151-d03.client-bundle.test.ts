import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findPersonDomainObjectKeys } from "@sedmc/kernel/personal-data-content-contract";

const here = dirname(fileURLToPath(import.meta.url));

describe("H-151 D-03 client-safe person-domain import", () => {
  it("field-offline-cache does not import the Node kernel barrel", () => {
    const source = readFileSync(join(here, "lib/field-offline-cache.ts"), "utf8");
    expect(source).toContain('@sedmc/kernel/personal-data-content-contract');
    expect(source).toContain('@sedmc/kernel/field-cache-crypto');
    expect(source).not.toMatch(/from ["']@sedmc\/kernel["']/);
  });

  it("person-domain helper works without pulling node:crypto into this module", () => {
    expect(findPersonDomainObjectKeys({ title: "Commercial" })).toEqual([]);
    expect(findPersonDomainObjectKeys({ guestName: "Jane" })).toEqual(["guestName"]);
  });
});
