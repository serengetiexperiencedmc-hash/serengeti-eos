/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "./index.js";

describe("@sedmc/db", () => {
  it("lists schema and migration files", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.endsWith("schema.sql"))).toBe(true);
    expect(files.some((f) => f.includes("001_i1"))).toBe(true);
    expect(files.some((f) => f.includes("002_i2"))).toBe(true);
    expect(files.some((f) => f.includes("004_c1"))).toBe(true);
    expect(files.some((f) => f.includes("005_c1"))).toBe(true);
    expect(files.some((f) => f.includes("006_c1"))).toBe(true);
    expect(files.some((f) => f.includes("007_c1"))).toBe(true);
    expect(files.some((f) => f.includes("008_c1"))).toBe(true);
    expect(files.some((f) => f.includes("009_c1"))).toBe(true);
    expect(files.some((f) => f.includes("010_c1"))).toBe(true);
    expect(files.some((f) => f.includes("011_c1"))).toBe(true);
    expect(files.some((f) => f.includes("012_c1"))).toBe(true);
    expect(files.some((f) => f.includes("013_c1"))).toBe(true);
    expect(files.some((f) => f.includes("014_c4"))).toBe(true);
  });
});
