import { createPool, migrate } from "./index.js";
import { migrateTargetRefuseReason } from "./migrate-guard.js";

const url = process.env.EOS_DATABASE_URL;
if (!url) {
  console.error("EOS_DATABASE_URL is required");
  process.exit(1);
}

const refused = migrateTargetRefuseReason(url);
if (refused) {
  console.error(
    JSON.stringify({
      ok: false,
      error: "migrate_target_refused",
      reason: refused,
      productionReady: false,
      note: "Do not run global migrate() against 124-only eos or eos_gateb. Use eos_h112_full.",
    }),
  );
  process.exit(1);
}

const pool = createPool(url);
try {
  const result = await migrate(pool);
  console.log(JSON.stringify({ ok: true, applied: result.applied, productionReady: false }));
} finally {
  await pool.end();
}
