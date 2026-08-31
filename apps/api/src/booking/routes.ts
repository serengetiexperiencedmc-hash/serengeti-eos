import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  completeHandoverTask,
  createBooking,
  getBookingByProposal,
  getBookingDetail,
  getBookingModuleHealth,
  listBookings,
} from "./booking.js";
import { getBookingCommandCenter } from "./command-center.js";

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

export function registerBookingRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/bookings/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBookingModuleHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/bookings", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; organizationId?: string };
    const result = listBookings(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/bookings", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createBooking(store, principal, req.body as Parameters<typeof createBooking>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/bookings/by-proposal/:proposalId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBookingByProposal(store, principal, (req.params as { proposalId: string }).proposalId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/bookings/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBookingDetail(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/bookings/:id/command-center", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBookingCommandCenter(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/bookings/:id/handover-tasks/:taskId/complete", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const params = req.params as { id: string; taskId: string };
    const result = completeHandoverTask(store, principal, params.id, params.taskId, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
