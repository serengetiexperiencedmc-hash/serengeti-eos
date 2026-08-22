# ADR-0003 — PostgreSQL as system of record

- Status: **proposed**
- Date: 2026-08-21

## Decision

PostgreSQL 16 is the OLTP system of record. Analytics may later use a lakehouse. Redis and search indexes are projections.

## Consequences

Strong constraints, proven backup tooling, operational familiarity. Not a graph-native or search-native store (projections handle those).
