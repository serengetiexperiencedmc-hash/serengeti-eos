import { seedStore } from "../src/app.js";
import { seedDemoCommercialData } from "../src/dev/seed-demo-data.js";
import { buildServer } from "../src/server.js";

const store = seedStore(process.env.EOS_TOKEN_SECRET ?? "dev-only-change-me");
const app = buildServer({ store });

const summary = await seedDemoCommercialData(app, store);

if (summary.skipped) {
  console.log("Demo seed skipped — data already present:");
} else {
  console.log("Demo seed completed:");
}

console.log(JSON.stringify(summary, null, 2));
