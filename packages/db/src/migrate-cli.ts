import { createPool, migrate } from "./index.js";

const url = process.env.EOS_DATABASE_URL;
if (!url) {
  console.error("EOS_DATABASE_URL is required");
  process.exit(1);
}

const pool = createPool(url);
try {
  const result = await migrate(pool);
  console.log(JSON.stringify({ ok: true, applied: result.applied, productionReady: false }));
} finally {
  await pool.end();
}
