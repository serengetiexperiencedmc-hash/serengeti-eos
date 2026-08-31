import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  approveLeave,
  assignEmployeeSkill,
  cancelLeave,
  createEmployee,
  createLeave,
  createSkill,
  getEmployee,
  getHrModuleHealth,
  listEmployees,
  listLeave,
  listSkills,
  patchEmployee,
  patchSkill,
  rejectLeave,
  removeEmployeeSkill,
  submitLeave,
} from "./hr.js";

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  switch (result.error) {
    case "forbidden":
      return reply.code(403).send(result);
    case "not_found":
      return reply.code(404).send(result);
    case "conflict":
      return reply.code(409).send(result);
    default:
      return reply.code(400).send(result);
  }
}

export function registerHrRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/hr/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getHrModuleHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/hr/employees", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { q?: string; status?: string };
    const result = listEmployees(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/employees", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createEmployee(
      store,
      principal,
      (req.body ?? {}) as Parameters<typeof createEmployee>[2],
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/hr/employees/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getEmployee(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/hr/employees/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchEmployee(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchEmployee>[3],
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/employees/:id/skills", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = assignEmployeeSkill(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as { skillId?: string; proficiency?: string },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.delete("/v1/hr/employees/:id/skills/:skillId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const params = req.params as { id: string; skillId: string };
    const result = removeEmployeeSkill(store, principal, params.id, params.skillId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/hr/skills", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listSkills(store, principal, req.query as { q?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/skills", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createSkill(
      store,
      principal,
      (req.body ?? {}) as { name?: string; category?: string },
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.patch("/v1/hr/skills/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = patchSkill(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as { name?: string; category?: string | null },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/hr/leave", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listLeave(store, principal, req.query as { employeeId?: string; status?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/leave", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createLeave(
      store,
      principal,
      (req.body ?? {}) as Parameters<typeof createLeave>[2],
      getCorrelationId(req),
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/hr/leave/:id/submit", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = submitLeave(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/leave/:id/approve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = approveLeave(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/leave/:id/reject", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = rejectLeave(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/hr/leave/:id/cancel", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = cancelLeave(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
