import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateDeploymentConfig } from "./deployment-config.js";
import { PRODUCTION_DEPENDENCY_CONTRACT } from "./production-dependency-contract.js";
import {
  COMPILED_API_ENTRYPOINT,
  PRODUCTION_DEPLOYMENT_CONTRACT,
  productionLikeListenBindForbiddenReason,
  repositoryHasProductionContainerManifest,
} from "./production-deployment-package.js";
import { shouldApplyStartupMigrations, shouldSyncStoreToPostgresOnStartup } from "./persistence/startup-migrations.js";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(apiRoot, "../..");

describe("H-192 Production dependency decision and evidence closure gate", () => {
  it("records the governance register without selecting products or inventing hostnames", () => {
    const artefact = join(
      repoRoot,
      "docs/governance/h-192-production-dependency-decision-and-evidence-closure-gate.md",
    );
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-192 STATUS = COMPLETE");
    expect(text).toContain("Production NOT READY");
    expect(text).toContain("Production implementation NOT AUTHORIZED");
    expect(text).toContain("Requests sent:                NONE");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("africa-south1 Johannesburg");
    expect(text).toContain("europe-west1 Belgium");
    expect(text).not.toMatch(/projects\/[a-z][a-z0-9-]{4,}/);
  });

  it("keeps H-190/H-191 unselected products and the H-191 listen/migrate boundary", () => {
    expect(PRODUCTION_DEPENDENCY_CONTRACT.some((row) => row.id === "identity" && row.status === "fail-closed-unselected")).toBe(
      true,
    );
    expect(PRODUCTION_DEPLOYMENT_CONTRACT.find((row) => row.id === "container")?.remainingExternalInput).toMatch(/UNSELECTED/);
    expect(COMPILED_API_ENTRYPOINT).toBe("node dist/main.js");
    expect(repositoryHasProductionContainerManifest(repoRoot)).toBe(false);
    expect(productionLikeListenBindForbiddenReason({ EOS_ENV: "production" })).toMatch(/EOS_LISTEN_HOST/);
    expect(shouldApplyStartupMigrations("postgres://eos@db.example.invalid/eos_x", { EOS_ENV: "uat" }).apply).toBe(false);
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "production" }).apply).toBe(false);
    const envExample = readFileSync(join(repoRoot, ".env.example"), "utf8");
    expect(envExample).not.toMatch(/googleapis\.com/);
    expect(envExample).toMatch(/Production hostname is UNSELECTED/);
    const missing = validateDeploymentConfig({ EOS_ENV: "production", NODE_ENV: "production" });
    expect(missing.productionReady).toBe(false);
    expect(missing.fatal.some((f) => f.includes("EOS_LISTEN_HOST"))).toBe(true);
    expect(missing.fatal.some((f) => f.includes("local-password") || f.includes("IdP"))).toBe(true);
  });
});
