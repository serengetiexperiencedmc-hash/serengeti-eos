/**
 * Canonical @sedmc/web production build.
 * Applies a rehearsal-proven Node heap so Next.js page-data workers do not
 * depend on an undocumented operator NODE_OPTIONS workaround.
 * Forces NODE_ENV=production so a polluted Dev/Test shell cannot break prerender.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HEAP_FLAG = "--max-old-space-size=8192";
const existing = process.env.NODE_OPTIONS ?? "";
if (!/\b--max-old-space-size\b/.test(existing)) {
  process.env.NODE_OPTIONS = existing.trim() ? `${existing.trim()} ${HEAP_FLAG}` : HEAP_FLAG;
}
process.env.NODE_ENV = "production";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = join(webRoot, "../../node_modules/next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: webRoot,
  env: process.env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});
