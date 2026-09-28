# E1-D — Class B Dev/Test Implementation Authorization Request

> **`PREPARED — NOT GRANTED`**  
> **`CREATION OF THIS FILE IS NOT AUTHORIZATION`**  
> **`NO CLASS-B APPLICATION CODE CHANGED THIS STAGE`**  
> **`NO MIGRATION`** · **`NO PRODUCTION`** · **`NO PROVIDER/ARCHITECTURE SELECTION`**  
> **`E1-B = 9 / 2 / 1 ; 0 TRANSMISSIONS`**  
> **Class A remains `PASS WITH TEST-ENVIRONMENT EXCEPTION` (uncommitted). Not reopened.**

**Date:** 2026-09-17.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Verified against source**, not only prior E1-D classification.

A later competent human may grant **exactly** section D. Until then, engineers must **not** implement Class B.

---

## A. Purpose

This is a **Class-B Dev/Test authorization request**.

It reconciles the eight Class-B candidates with the current repository, E1-C human/gap registers, E1-D classification, Class-A audit, and the F1 `migrate()` / Gate-B database defect.

It does **not** grant implementation. It does **not** authorize Class C–F, UAT, Production, provider contact, or migrations.

---

## B. Candidate inventory

| # | Candidate | E1-D TECH ID | Current source fact |
| --- | --- | --- | --- |
| 1 | MFA | TECH-IDN-02 (policy also TECH-SEC-08 **D**, IdP TECH-IDN-01 **D**, HUM-05) | No `totp`/`mfa`/`2fa` in `apps/api`. `local-password-dev` exposes only `authenticatePassword`. `login()` issues JWT immediately after password verify (`app.ts`). Kernel `IdentityProvider` has no second-factor method |
| 2 | Helmet-as-dependency | TECH-SEC-06 | `apps/api/package.json` has no `helmet` / `@fastify/helmet`. Class A already emits CSP/XFO/nosniff/Referrer-Policy/Cache-Control/`X-EOS-DevTest` manually |
| 3 | `/ready` honesty | TECH-OBS-02 | `/health` always `ok` with `productionReady: false`. `/ready` probes `dbHealth` **or** `{ ok: true, mode: "memory" }`. `applicationReady = db.ok`. Event infra health included. **Not** Production-aware |
| 4 | CRM same-transaction outbox | TECH-PER-02 | `commitCrmWithOutbox` rolls back **memory** snapshot; `void persistCrmEntityAfterCommit(pool)` and `void persistOutboxInsert(pool)` are fire-and-forget **separate** pool calls. Commercial path uses `runDurableTx` + `insertDomainOutbox(client)` **same TX**. Outbox tables already exist |
| 5 | Kernel `DocumentStorage.delete` | TECH-PER-09; Gate C backlog item 7 (**not DDL**) | Kernel type `put`/`get` only. `LocalFsDocumentStorage.delete` exists. Service uses `storage?.delete` via cast. `supplier/contracts.ts` uses `instanceof LocalFsDocumentStorage` |
| 6 | Module SoR map / expansion | TECH-PER-11 | Dual-path **PG SoR** when `dbPool` set: opportunity, rfp, programme, costing, commercial-approval, commercial-document **metadata**. Bytes: LocalFs. CRM/supplier/notifications/AI/etc.: process-local Store authoritative with optional dual-write `void persist*` |
| 7 | Local NATS experiment | TECH-EVT-01 | Default `EOS_EVENT_TRANSPORT` → `in-memory-dev`. `nats-jetstream` already coded behind `EOS_NATS_URL`; stub throws `nats_not_configured`. ADR-0004 Dev in-memory; Production NATS pending ADR-0006 |
| 8 | Dev PostgreSQL pg_dump/restore harness | TECH-REC-01 | GB-14 `attachDurablePool` / `newProcessAgainstPool` — **no** `migrate()`, **no** dump. F1: `eos_gateb` has `tenants` and **empty** `schema_migrations` |

---

## C. Classification

Exactly one primary status per candidate.

| Candidate | Primary | Why | Migration? | Provider? | Human decision? |
| --- | --- | --- | --- | --- | --- |
| 1. MFA | **B2** | Privileged-MFA policy is TECH-SEC-08 **D** / HUM-08-adjacent; corporate IdP is HUM-05 / TECH-IDN-01 **D** / ADR-0013 OPEN. Dev TOTP would **change the login contract** (password → JWT). Persisted TOTP seeds would be **B3/E**. Production MFA remains **C/F**. `local-password-dev` can host a labelled experiment **only after** a human records that Dev step-up is allowed **without** selecting Production IdP | If PG TOTP store: **YES** | Production/hosted IdP **YES** later | **YES** — policy + current IdP fact |
| 2. Helmet | **B1** | Isolated npm add; no schema; no provider. **Not necessary:** Class A manual headers already satisfy Dev/Test TECH-SEC-03. Helmet would **change header-policy semantics** vs the audited Class A set and overlap CSP/XFO | No | No | Header-profile choice (weak); not blocking |
| 3. `/ready` | **B1** (Dev/Test honesty only) | Bounded contract below is isolated. **Production-aware `/ready` is B5** and is **not** this candidate’s grant | No | Production probes **YES** (excluded) | No for Dev contract |
| 4. CRM same-TX outbox | **B1** | Existing CRM + outbox tables; reuse `runDurableTx` / `insertOutboxEventOn(client)`. Must extend CRM upserts to accept `Queryable` (code, not new SQL). Does **not** make CRM PG SoR (that is expansion / TECH-PER-11) | **No new SQL** if limited to existing tables | No | No |
| 5. `DocumentStorage.delete` | **B1** | Kernel port completeness; LocalFs already implements; not Gate C DDL (backlog item 7). Does **not** select object-store provider. Does **not** close GAP-PER-03 Production adapter | No | Production adapter **C** (excluded) | No for Dev port |
| 6. SoR map / expansion | **B1** for **inventory only**; expansion **B6** | Inventory/tests document current map with no behavior change. **Expansion** (PG-authoritative CRM/supplier/notifications/etc.) is persist-architecture work, may lack tables (**B3**), and needs a Gate-B-style persist grant — **not** this HTTP/obs/recovery pack | Expansion: **maybe** | No for inventory | Scope of which modules (expansion) |
| 7. Local NATS | **B4** | JetStream is the **proposed Production** event product pending ADR-0006. A local `nats-server` experiment is not hosting-provider selection, but it **pre-selects the event-bus class** and changes durability vs authorized `in-memory-dev`. Not necessary now. Production NATS remains **C/F** | Offset tables already exist; no new SQL required for a local broker | **YES** (event-product / architecture) | Architecture / ADR-0006 |
| 8. pg_dump/restore harness | **B1** | Disposable **clone** dump/restore + GB-14 attach; **must not** DROP `eos_gateb`; **must not** `migrate()` as the recovery proof; **must not** claim Production RTO. F1 tracker emptiness would be **copied** if `eos_gateb` is dumped — tests must use migration-free reads | No new migration. Restore ≠ migrate | No | No for labelled Dev drill |

---

## D. Scope proposed for authorization

**Proposed future grant (not granted):** authorize isolated Dev/Test implementation of **only**:

1. **SoR inventory** — documentation + tests asserting the current map (no SoR behavior change).  
2. **Kernel `DocumentStorage.delete`** — add `delete` to the kernel port; keep LocalFs; replace `storage?.delete` casts; compensation tests. **Not** a Production object-store selection. **Not** Gate C SQL. **Does not close** Gate C remainder.  
3. **`/ready` Dev/Test honesty** — if `store.dbPool` is set **or** `dbHealth` is provided, `/ready` must probe and return **503** when the probe fails or is omitted while a pool is attached. If neither pool nor `dbHealth`, memory-mode `{ ok: true, mode: "memory" }` remains **honest** for process-local SoR. `productionReady` stays **false**. **Do not** implement Production-only readiness.  
4. **CRM same-TX outbox** — when `dbPool` is set, CRM entity persist + outbox insert (+ chained audit if already written in that path) occur in **one** `runDurableTx`. Memory-mode snapshot rollback remains. **Do not** promote CRM to PG SoR in this grant.  
5. **Dev pg_dump/restore harness** — `pg_dump`/`pg_restore` of a **disposable** Dev/Test database (or restore into a new disposable database). Prove Commercial read via GB-14 **without** `migrate()`. Labelled Dev/Test; **not** Production RTO/RPO. **Not** a fix of F1 by dropping Gate-B tables.

**Explicit implementation order after a future grant:** see [`adr-0006-e1-d-class-b-dev-test-implementation-plan.md`](adr-0006-e1-d-class-b-dev-test-implementation-plan.md).

---

## E. Explicit exclusions

- MFA / TOTP / login-contract change (B2; Production MFA C/F).  
- Helmet npm dependency (B1 but **unnecessary** after Class A; exclude unless a later grant **names** Helmet).  
- Production-aware `/ready` (B5).  
- SoR **expansion** (CRM/supplier/notifications/AI/etc. as PG-authoritative) (B6 / possible B3).  
- Local or Production NATS / JetStream (B4).  
- Class A reopen/rewrite (no audit factual defect found).  
- F1 repair by DROP/`schema_migrations` backfill/new migration.  
- New migration files; Migration 123 re-execution; Gate C remainder.  
- Provider/architecture/jurisdiction selection; provider contact.  
- Production/UAT credentials, data, deploy, TLS, DNS.  
- Redis/shared rate-limit store.  
- Closing CD-01, DocumentStorage Production adapter, ADR-0006, DP-0006, E1.

---

## F. Dependencies

```
HUM-05 current IdP fact + TECH-SEC-08 MFA policy  →  MFA (B2)  →  Production MFA (C/F)
TECH-IDN-01 / ADR-0013 IdP product               →  MFA (blocked as Production)

Class A manual headers (done)                    →  Helmet (B1, deferred as unnecessary)

store.dbPool / dbHealth contract                 →  /ready Dev/Test honesty (B1)
Hosting / Production topology                    →  Production /ready (B5)

Existing CRM + outbox tables + runDurableTx      →  CRM same-TX outbox (B1)
CRM same-TX                                      ↛  CRM PG SoR (excluded; B6 persist grant)
F1 migrate() tests                               ↛  required for CRM TX if tests use GB-14 / memory

LocalFs.delete already exists                    →  kernel DocumentStorage.delete (B1)
Gate C item 7 OPEN (not DDL)                     →  this B1 grant may close the *kernel port* item only
Object-store provider                            →  Production adapter (C; excluded)

SoR inventory (B1)                               →  informs expansion
Dedicated persist authorization + per-module schema → SoR expansion (B6 / B3)

ADR-0006 event-bus undecided                     →  local NATS (B4; excluded)
in-memory-dev (ADR-0004)                         →  remains authorized Dev transport

GB-14 harness + disposable DB                    →  pg_dump/restore (B1)
F1 empty schema_migrations on eos_gateb          →  dump of eos_gateb copies F1; restore proof must not call migrate()
CD-01 OPEN                                       →  recovery packaging order (not this grant)
```

**Independent (after grant):** kernel `delete`, `/ready` honesty, SoR inventory.  
**Sequential:** SoR inventory **before** any future expansion (expansion not in this grant); dump/restore **after** GB-14 discipline is specified (already exists). CRM TX independent of kernel `delete`.  
**Human-gated:** MFA.  
**Migration-gated:** MFA-if-PG-seeds; SoR expansion-if-missing-tables; **nothing in section D**.  
**Provider-gated:** NATS; Production `/ready`; Production MFA; object-store adapter.  
**Production-only:** Production `/ready`, Production dump/restore, Production MFA proof.

---

## G. Migration boundary

| Item | New SQL? | Gate C? |
| --- | --- | --- |
| Section D proposed scope | **NONE** | **NONE**. Item 7 is kernel/port, not DDL |
| MFA TOTP PG store | **YES if chosen** — **not** in this request | Would need separate E-class grant |
| SoR expansion | **Maybe** | Persist + possible Gate C |
| F1 `schema_migrations` backfill | Would be schema-tracker surgery — **not authorized**; not a new migration file, still **forbidden** here |
| Migration 123 | **Do not** create, modify, or re-execute | Consumed on disposable Gate-B only |

`main.ts` may still call `migrate()` of **existing** files on Dev startup when `EOS_DATABASE_URL` is set. That is **not** this request authorizing new files or UAT/Production migrate.

---

## H. Provider boundary

| Item | Provider? |
| --- | --- |
| Section D proposed scope | **NO** |
| Local NATS | Event-product / architecture (excluded) |
| MFA Production | Hosted IdP **C** after HUM-05 |
| Production `/ready` | Hosting topology |
| Object storage | **C** — not selected by kernel `delete` |

---

## I. Human decision boundary

Still required and **not** satisfied by this file:

- HUM-05 current corporate IdP fact; ADR-0013 Production IdP.  
- TECH-SEC-08 / privileged MFA policy (who must use MFA).  
- HUM-07 / CD-01 BCM sequence (recovery **packaging** order; dump/restore grant must not close CD-01).  
- HUM-08 Production ops RACI.  
- HUM-13 ADR-0006 / DP-0006 / E1.  
- HUM-15 PITR adopt/not-adopt.  
- Header-profile choice if Helmet is ever named (not proposed).

**No invented owners.** THOMAS NGULUMA remains Legal Counsel only.

---

## J. Test plan

Map to existing E1-D strategy IDs ([`adr-0006-e1-d-technical-remediation-test-strategy.md`](adr-0006-e1-d-technical-remediation-test-strategy.md)). All remain **NOT RUN** until a grant **and** implementation.

| Proposed item | Strategy IDs | Notes |
| --- | --- | --- |
| SoR inventory | TS-P-02 | Assert dual-path vs memory vs dual-write; no live `migrate()` required |
| Kernel `delete` | TS-F-02 | Metadata fail → bytes gone; LocalFs tmpdir |
| `/ready` honesty | TS-A-02 | 503 when pool set and probe fails/omitted; memory-ok when no pool |
| CRM same-TX | TS-I-05 | Rollback leaves no orphan outbox; prefer GB-14 / memory tests — **do not** depend on F1 files |
| pg_dump/restore | TS-R-01 | Disposable restore + read opportunity; **not** TS-R-03 |
| Regression | TS-G-01, TS-P-01, Class A 11, targeted 31 | Must still pass |
| Excluded MFA | TS-S-02 | Not in this grant |
| Full `npx vitest run` | — | **Must not** be claimed green while F1 remains |

---

## K. Rollback considerations

| Item | Rollback |
| --- | --- |
| SoR inventory | Delete inventory tests/docs; no schema |
| Kernel `delete` | Revert kernel type + callers to optional LocalFs delete; LocalFs method may remain |
| `/ready` | Restore memory-ok when `dbHealth` omitted even if `dbPool` set |
| CRM same-TX | Restore `void persistOutboxInsert` / `void persistCrmEntityAfterCommit`; no down-migration |
| pg_dump/restore harness | Remove harness scripts/tests; **do not** DROP Gate-B data as rollback |
| Helmet (if later named) | Remove dependency; Class A headers remain |
| MFA (excluded) | N/A |

No schema rollback because **no migration** is requested.

---

## L. Production boundary

**This request does not constitute Production authorization, UAT authorization, provider selection, architecture selection, E1 approval, or migration authorization.**

`productionReady` remains `false`. No Production credentials, data, DNS, TLS, or deploy.

---

## M. Authorization status

**`PREPARED — NOT GRANTED`**

No signature, approver, corporate instrument, or grant date is recorded. Class B implementation must not start until a later human grant names the section D items.
