/**
 * Explicit GPTA-H-88 invocation for the 124-only Dev/Test apply mechanism.
 *
 * Default: inspect / fail-closed decision only. Does not connect for writes.
 * --execute is a later-authorization path and is NOT granted by GPTA-H-88 implementation.
 */
import { decideF2Dp01Apply124, redactDatabaseUrl } from "./f2-dp01-apply-124.js";

const executeRequested = process.argv.includes("--execute");
const url = process.env.EOS_DATABASE_URL;
const decision = decideF2Dp01Apply124({
  ...(typeof url === "string" && url.length > 0 ? { connectionString: url } : {}),
  env: process.env,
});

const report = {
  mechanism: "f2-dp01-apply-124",
  authorizationNote:
    "This CLI does not itself authorize applying migration 124. A separate execution authorization is required before --execute.",
  executeRequested,
  redactedUrl: redactDatabaseUrl(url),
  decision,
  applied: false,
  calledMigrate: false,
};

if (executeRequested) {
  console.error(
    JSON.stringify({
      ...report,
      refused: true,
      reason:
        "GPTA-H-88 implementation does not authorize --execute. Separate execution authorization is required before migration 124 may be applied.",
    }),
  );
  process.exit(2);
}

console.log(JSON.stringify(report));
process.exit(decision.allow ? 0 : 1);
