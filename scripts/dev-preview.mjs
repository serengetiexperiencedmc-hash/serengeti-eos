import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const apiEnv = {
  ...process.env,
  EOS_BOOTSTRAP_ALICE_PASSWORD: process.env.EOS_BOOTSTRAP_ALICE_PASSWORD ?? "test-alice-not-for-prod",
  EOS_BOOTSTRAP_BOB_PASSWORD: process.env.EOS_BOOTSTRAP_BOB_PASSWORD ?? "test-bob-not-for-prod",
  EOS_BOOTSTRAP_CAROL_PASSWORD: process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod",
  EOS_BOOTSTRAP_PARTNER_PASSWORD: process.env.EOS_BOOTSTRAP_PARTNER_PASSWORD ?? "test-partner-not-for-prod",
  EOS_SEED_DEMO: "true",
};

function start(label, args, env = process.env) {
  const child = spawn(npm, args, { cwd: root, env, stdio: "inherit", shell: true });
  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[${label}] stopped (${signal})`);
    } else if (code && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
    }
    process.exit(code ?? 0);
  });
  return child;
}

console.log("Serengeti EOS commercial preview");
console.log("  API  → http://127.0.0.1:8080");
console.log("  UI   → http://127.0.0.1:3001/commercial");
console.log("  Dev login: carol.admin@sedmc.local / test-carol-not-for-prod");
console.log("");

start("api", ["run", "dev", "-w", "@sedmc/api"], apiEnv);
start("web", ["run", "dev", "-w", "@sedmc/web"]);
