# Serengeti Experience DMC — Enterprise Operating System (EOS)

**Status:** Actively developed enterprise platform foundation with Core Control Plane and Event Infrastructure in **Development/Test**. CRM, Supplier Management and MICE are **authorized in controlled increments**. **Not UAT-ready. Not Production-ready.**

This platform is a governed Enterprise Operating & Intelligence System for Serengeti Experience DMC. It is **not** a CRM mock-up, a dashboard pack, or a replacement for the existing MICE marketing collateral in the parent folder.

## What already existed

The parent workspace (`Branding MICE`) contains HTML/PDF MICE collateral only:

- Company credentials, capability decks, sample programmes, RFP/proposal templates
- Risk-management **collateral** (documents), not an operational GRC system
- No application runtime, database, IAM, APIs, or CI

Those assets are left untouched. Destination knowledge, programme patterns, and commercial language from collateral may later feed **Knowledge Management** after human verification. They are not source-of-truth operational data.

## How to read this repository

| Path | Purpose |
| --- | --- |
| [`docs/architecture/README.md`](docs/architecture/README.md) | Phase 0 blueprint index (30 deliverables) |
| [`docs/adr/`](docs/adr/) | Architecture Decision Register (human approval required) |
| [`docs/backlog/increments.md`](docs/backlog/increments.md) | Independently deployable increments |
| [`apps/api`](apps/api) | Foundation API (Increment 0) |
| [`apps/web`](apps/web) | Commercial workspace UI (Next.js — mock data) |
| [`packages/kernel`](packages/kernel) | Shared domain logic incl. C4 supplier import validation |
| [`packages/db`](packages/db) | PostgreSQL migrations (001–014) |
| [`docs/c4/import/`](docs/c4/import/) | Supplier CSV import templates (C4 migration) |
| [`infra/compose`](infra/compose) | Local Development stack |

## Non-negotiable operating principle

**Human authority + governed automation + AI assistance + complete auditability**

Recommendation ≠ Decision. AI cannot manufacture approval. Consequential actions require an explicit human approval gate.

## Status (human-approved)

| Gate | Status |
| --- | --- |
| Phase 0 architecture baseline | Approved for continued development |
| Increment 0 kernel | Approved for Development/Testing only |
| Increment 1 Admin Shell | **CLOSED** for Development/Testing |
| Increment 2 Workflow + Rules | **ACCEPTED** + hardened for Dev/Test — **not** Production |
| Increment 4 Outbox/Events | **ACCEPTED** + hardened for Dev/Test — **not** Production |
| CRM / Supplier / MICE (C1–C9) | **AUTHORIZED** — Dev/Test increments; **C1 preview before code** |
| C1 CRM Foundation | Preview **READY FOR REVIEW** — [c1-crm-preview.md](docs/architecture/c1-crm-preview.md) |
| C1 implementation | **AUTHORIZED — Dev/Test** (C1.11 gate remediation complete) |
| C4 Supplier schema | Migration **014** + kernel import validation — [c4-supplier-preview.md](docs/architecture/c4-supplier-preview.md) |
| Commercial UI | **Scaffold** — [apps/web](apps/web) (mock data, port 3001) |
| AI Agents | **BLOCKED** |
| UAT / Production | **NOT APPROVED** |

ADR-0006 (hosting), ADR-0012 (secrets), ADR-0013 (IdP) remain **OPEN**. See `docs/decisions/` and `docs/discovery/external-systems-register.md`.

Development bootstrap passwords are **environment-managed** (`EOS_BOOTSTRAP_*` via SecretsProvider). They must never be used in UAT/Production. See `.env.example`.

## Run (Development)

```bash
cd serengeti-eos
cp .env.example .env   # set EOS_BOOTSTRAP_* and EOS_TOKEN_SECRET
docker compose -f infra/compose/dev.yaml up -d
npm install
npm run migrate
npm test
npm run typecheck
cd apps/api && npm run dev
```

Unit/API tests use `TEST_BOOTSTRAP_SECRETS` (test-only, not production). Runtime uses env secrets.

PostgreSQL integration tests: start Compose Postgres, then:

```bash
$env:EOS_DATABASE_URL="postgres://eos:eos-dev-only@127.0.0.1:5432/eos"
$env:EOS_RUN_PG_TESTS="1"
npm test -w @sedmc/api
```
