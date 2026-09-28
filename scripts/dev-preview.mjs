import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const API_HOST = "127.0.0.1";
const API_PORT = Number(process.env.EOS_PORT ?? 8080);
const WEB_PORT = 3001;
const API_ORIGIN = `http://${API_HOST}:${API_PORT}`;
const WEB_ORIGIN = `http://127.0.0.1:${WEB_PORT}`;

const apiEnv = {
  ...process.env,
  NODE_ENV: "development",
  EOS_ENV: "development",
  EOS_BOOTSTRAP_ALICE_PASSWORD: process.env.EOS_BOOTSTRAP_ALICE_PASSWORD ?? "test-alice-not-for-prod",
  EOS_BOOTSTRAP_BOB_PASSWORD: process.env.EOS_BOOTSTRAP_BOB_PASSWORD ?? "test-bob-not-for-prod",
  EOS_BOOTSTRAP_CAROL_PASSWORD: process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod",
  EOS_BOOTSTRAP_PARTNER_PASSWORD: process.env.EOS_BOOTSTRAP_PARTNER_PASSWORD ?? "test-partner-not-for-prod",
  EOS_SEED_DEMO: "true",
};

// Local commercial preview is in-memory unless explicitly opted in. A leftover
// EOS_DATABASE_URL from other Dev/Test work would otherwise migrate/hydrate a
// different database and make the documented carol credentials fail.
if (process.env.EOS_PREVIEW_USE_DATABASE !== "1") {
  delete apiEnv.EOS_DATABASE_URL;
}

// Leftover EOS_API_URL from isolated UAT (e.g. :18117) would make Dev sign-in
// 502 while the preview API on 8080 is healthy. Pin the web proxy to this preview.
const webEnv = {
  ...process.env,
  EOS_API_URL: API_ORIGIN,
};
delete webEnv.EOS_WEB_DIST_DIR;

const children = [];
let shuttingDown = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      resolve(err.code === "EADDRINUSE");
    });
    server.once("listening", () => {
      server.close(() => resolve(false));
    });
    server.listen(port);
  });
}

async function fetchOk(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForApi(maxMs = 60_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (await fetchOk(`${API_ORIGIN}/health`)) return true;
    await sleep(500);
  }
  return false;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
    }
  }
  setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGKILL");
      }
    }
    process.exit(code);
  }, 3000);
}

function start(label, args, env = process.env) {
  const child = spawn(npm, args, {
    cwd: root,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal === "SIGTERM" || signal === "SIGINT") return;
    if (code && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });

  return child;
}

async function resolveService(label, port, probe) {
  if (await probe()) {
    console.log(`[${label}] reusing existing server on port ${port}`);
    return { start: false };
  }

  if (await isPortInUse(port)) {
    console.error(
      `[${label}] port ${port} is in use but ${label === "web" ? "/commercial is not healthy (expected HTTP 200)" : "the health probe failed"}.`,
    );
    console.error(`        Stop the process on port ${port} and re-run dev:preview.`);
    return { start: false, failed: true };
  }

  return { start: true };
}

async function main() {
  console.log("Serengeti EOS commercial preview");
  console.log(`  API  → ${API_ORIGIN}`);
  console.log(`  UI   → ${WEB_ORIGIN}/commercial`);
  console.log("  Dev login: carol.admin@sedmc.local / test-carol-not-for-prod");
  console.log(
    apiEnv.EOS_DATABASE_URL
      ? "  Persistence: PostgreSQL (EOS_PREVIEW_USE_DATABASE=1)"
      : "  Persistence: in-memory (set EOS_PREVIEW_USE_DATABASE=1 to keep EOS_DATABASE_URL)",
  );
  console.log("");

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));

  const api = await resolveService("api", API_PORT, () => fetchOk(`${API_ORIGIN}/health`));
  if (api.failed) process.exit(1);

  const web = await resolveService("web", WEB_PORT, async () => {
    const pageOk = (await fetchOk(`${WEB_ORIGIN}/commercial`)) || (await fetchOk(`${WEB_ORIGIN}/commercial/`));
    if (!pageOk) return false;
    try {
      const res = await fetch(`${WEB_ORIGIN}/eos-api/health`);
      if (!res.ok) return false;
      const json = await res.json();
      return json?.status === "ok";
    } catch {
      return false;
    }
  });
  if (web.failed) process.exit(1);

  if (!api.start && !web.start) {
    console.log("\nBoth servers already running. Open the UI URL above.");
    return;
  }

  if (api.start) {
    start("api", ["run", "dev", "-w", "@sedmc/api"], apiEnv);
    process.stdout.write("[api] waiting for /health");
    const ready = await waitForApi();
    console.log(ready ? " ✓" : " ✗");
    if (!ready) {
      console.error("[api] timed out waiting for /health — check logs above.");
      shutdown(1);
      return;
    }
  }

  if (web.start) {
    start("web", ["run", "dev", "-w", "@sedmc/web"], webEnv);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
