import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type LogLevel = "debug" | "info" | "warn" | "error";

const REDACT_KEYS = new Set([
  "password",
  "passwordHash",
  "accessToken",
  "token",
  "authorization",
  "secret",
  "EOS_TOKEN_SECRET",
  "EOS_BOOTSTRAP_ALICE_PASSWORD",
  "EOS_BOOTSTRAP_BOB_PASSWORD",
  "EOS_BOOTSTRAP_CAROL_PASSWORD",
  "EOS_BOOTSTRAP_PARTNER_PASSWORD",
]);

function redact(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(redact);
  if (typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = REDACT_KEYS.has(k) || k.toLowerCase().includes("password") ? "[REDACTED]" : redact(v);
  }
  return out;
}

export type Logger = {
  child(bindings: Record<string, unknown>): Logger;
  debug(msg: string, fields?: Record<string, unknown>): void;
  info(msg: string, fields?: Record<string, unknown>): void;
  warn(msg: string, fields?: Record<string, unknown>): void;
  error(msg: string, fields?: Record<string, unknown>): void;
};

export function createLogger(level: LogLevel = "info", bindings: Record<string, unknown> = {}): Logger {
  const rank: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
  const min = rank[level] ?? 20;
  const write = (lvl: LogLevel, msg: string, fields?: Record<string, unknown>) => {
    if (rank[lvl] < min) return;
    const line = {
      ts: new Date().toISOString(),
      level: lvl,
      msg,
      service: "sedmc-eos-api",
      productionReady: false,
      ...bindings,
      ...(fields ? (redact(fields) as Record<string, unknown>) : {}),
    };
    const sink = lvl === "error" ? console.error : console.log;
    sink(JSON.stringify(line));
  };
  return {
    child(extra) {
      return createLogger(level, { ...bindings, ...extra });
    },
    debug: (msg, fields) => write("debug", msg, fields),
    info: (msg, fields) => write("info", msg, fields),
    warn: (msg, fields) => write("warn", msg, fields),
    error: (msg, fields) => write("error", msg, fields),
  };
}

export function registerObservability(app: FastifyInstance, logger: Logger): void {
  app.addHook("onRequest", async (req) => {
    const correlationId = String(req.headers["x-correlation-id"] ?? crypto.randomUUID());
    const requestId = crypto.randomUUID();
    (req as FastifyRequest & { correlationId: string; requestId: string; eosLog: Logger }).correlationId =
      correlationId;
    (req as FastifyRequest & { correlationId: string; requestId: string; eosLog: Logger }).requestId = requestId;
    (req as FastifyRequest & { correlationId: string; requestId: string; eosLog: Logger }).eosLog = logger.child({
      correlationId,
      requestId,
      method: req.method,
      path: req.url,
    });
  });

  app.addHook("onResponse", async (req, reply) => {
    const r = req as FastifyRequest & { eosLog?: Logger; correlationId?: string };
    r.eosLog?.info("request_completed", {
      statusCode: reply.statusCode,
      correlationId: r.correlationId,
    });
  });

  app.addHook("onError", async (req, _reply, error) => {
    const r = req as FastifyRequest & { eosLog?: Logger };
    r.eosLog?.error("request_error", { err: error.message });
  });
}

export function getRequestLog(req: FastifyRequest): Logger {
  return (req as FastifyRequest & { eosLog?: Logger }).eosLog ?? createLogger();
}

export function getCorrelationId(req: FastifyRequest): string {
  return (
    (req as FastifyRequest & { correlationId?: string }).correlationId ??
    String(req.headers["x-correlation-id"] ?? crypto.randomUUID())
  );
}

export function setCorrelationHeader(reply: FastifyReply, correlationId: string): void {
  reply.header("x-correlation-id", correlationId);
}
