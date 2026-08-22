# ADR-0002 — Modular monolith first

- Status: **proposed** (Increment 0 implements this)
- Date: 2026-08-21

## Context

The prompt asks for many bounded contexts. A distributed mesh on day one is unoperable for a DMC-scale team and weakens auditability.

## Decision

Ship a TypeScript modular monolith with strict module ports, PostgreSQL, outbox events. Extract services only with SLO/isolation evidence.

Increment 0 HTTP stack: **Fastify** (small trusted kernel). NestJS remains optional if the team wants a standard DI framework later; it is not required to satisfy modularity.

## Consequences

In-process calls are faster and transactional. Teams must still forbid cross-module table access.
