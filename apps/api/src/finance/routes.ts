import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  acceptQuote,
  applyApprovedInvoicePayment,
  autoCreateFinalInvoice,
  createDepositInvoice,
  createFinalInvoice,
  createProgressInvoice,
  createQuoteFromBooking,
  decideApproval,
  getFinalInvoiceEligibility,
  getFinanceModuleHealth,
  issueInvoice,
  listInvoices,
  listPaymentRequests,
  listQuotes,
  listReconciliations,
  recordInvoicePayment,
  requestInvoicePayment,
  resolveReconciliation,
  sendQuote,
} from "./finance.js";
import { getBookingFinancialControl, listFinanceControl } from "./control.js";

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

export function registerFinanceRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/finance/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getFinanceModuleHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/control", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listFinanceControl(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/quotes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string };
    const result = listQuotes(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/quotes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createQuoteFromBooking(store, principal, req.body as Parameters<typeof createQuoteFromBooking>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/finance/quotes/:id/send", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = sendQuote(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/quotes/:id/accept", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = acceptQuote(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/invoices", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { bookingId?: string; status?: string };
    const result = listInvoices(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/invoices/deposit", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createDepositInvoice(store, principal, req.body as Parameters<typeof createDepositInvoice>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/finance/invoices/progress", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createProgressInvoice(store, principal, req.body as Parameters<typeof createProgressInvoice>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/finance/invoices/final", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = createFinalInvoice(store, principal, req.body as Parameters<typeof createFinalInvoice>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/finance/invoices/final/auto", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = autoCreateFinalInvoice(store, principal, req.body as Parameters<typeof autoCreateFinalInvoice>[2], getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/finance/bookings/:bookingId/final-invoice-eligibility", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getFinalInvoiceEligibility(store, principal, (req.params as { bookingId: string }).bookingId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/bookings/:bookingId/control", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getBookingFinancialControl(store, principal, (req.params as { bookingId: string }).bookingId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/payment-requests", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listPaymentRequests(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/invoices/:id/issue", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = issueInvoice(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/finance/reconciliations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; bookingId?: string };
    const result = listReconciliations(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/invoices/:id/payments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = req.body as { amount: number; paymentId: string };
    const result = recordInvoicePayment(store, principal, (req.params as { id: string }).id, body, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/invoices/:id/payment-requests", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = req.body as { amount: number; beneficiary: string };
    const result = requestInvoicePayment(store, principal, (req.params as { id: string }).id, body, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/finance/invoices/:id/apply-payment", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = applyApprovedInvoicePayment(store, principal, (req.params as { id: string }).id, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/payments/:approvalId/approve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = decideApproval(store, principal, (req.params as { approvalId: string }).approvalId, "approved", getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/finance/reconciliations/:id/resolve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { notes } = req.body as { notes: string };
    const result = resolveReconciliation(store, principal, (req.params as { id: string }).id, notes, getCorrelationId(req));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}

