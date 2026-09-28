# GPTA-H-54 — F2-I9 C3 Explicit First-Response Preview

> **`F2-I9 IMPLEMENTATION EVIDENCE — PREVIEW C3 FIRST-RESPONSE OBSERVATION`**  
> **`NOT UAT`** · **`NOT FULL C3 COMPLETION`** · **`NOT FULL C10 COMPLETION`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / MIXED RFP PERSISTENCE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T21:13:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-53 historical bodies are **not rewritten**.

---

## Repository state

### Before this increment

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | Pre-existing Class A/B and F2-I1–I8 uncommitted work **preserved** |
| Mixed `apps/api/src/rfp/rfp.ts` | **DIRTY** (not rewritten) |
| Mixed J3 analytics | **not modified** |
| F2 | **AUTHORIZED** (H-44, C1–C10 Dev/Test only) |
| F2-I8 | **COMPLETED** |

Inspection found that I8 already accepted sidecar `firstResponseAt` with provenance `explicit_business_fact`, ISO datetime validation, conflict-on-different-value, and idempotent same-value resubmission. I7 already derived KPI `response_time` only when every preview RFP had both timestamps. I9 therefore **did not invent a second observation field**. It made first-response a first-class tested observation, rejected negative intervals at PUT, and stopped the KPI from presenting a subset as the complete population.

### After this increment

HEAD, branch, and empty index are **unchanged**. No staging, commit, or push.

---

## Authorization and numbering

F2 remains authorized only under GPTA-H-44.

H-53 recorded a residual next increment of **F2-I9 C5 programme / C9 booking**. This Owner-commissioned record **reassigns F2-I9** to explicit first-response observation. H-53 is **not rewritten**. C5/C9 remain unexecuted residuals and are recommended as **F2-I10**.

No stop condition was reached. No additional authorization was required.

---

## Scope

| In scope | Out of scope |
| --- | --- |
| Explicit `firstResponseAt` on existing `GET`/`PUT /v1/rfps/:id/commercial-facts` | New route family |
| Provenance `explicit_business_fact` (I8 convention) | Inferring first response from `createdAt`, receipt, clarification, proposal create/send, API time, or mixed RFP defaults |
| Conflict / idempotent conventions already used for `receivedAt` | Mailbox / email / WhatsApp ingestion |
| KPI derived only for a complete preview RFP population | Historical reconstruction |
| Negative-interval rejection at PUT | Mixed `rfp.ts`, J3 analytics, persist, schema, Gate B |

---

## First-response semantics

`firstResponseAt` is an **explicit business fact** on the preview sidecar.

* Accepted only as a full ISO-8601 datetime.
* Provenance is **`explicit_business_fact`** (same token as I8 `receivedAt`).
* Date-only and unparsable values → `400 invalid_firstResponseAt`.
* Missing remains **unavailable**. Not copied from `createdAt`, sidecar `receivedAt`, clarification `eventAt`, mixed `RfpRecord.receivedAt`, or `proposal.sentAt`.
* Same value resubmitted → **idempotent 200**.
* Different value → **409 `firstResponseAt_already_observed`**.
* When both `receivedAt` and `firstResponseAt` are present on the resulting record, a negative or non-finite interval → **400 `negative_response_interval`**. Zero-length intervals are allowed. This is timestamp-consistency validation, not a new commercial workflow rule.

View flags remain `createdAtUsedAsFirstResponse: false`, `receivedAtUsedAsFirstResponse: false`, `proposalSentAtUsedAsFirstResponse: false`.

Durable RFP commercial-facts GET/PUT remain **409 `f2_i8_in_memory_preview_only`** (same endpoint as I8; no split durable reason).

---

## KPI integration status

Preview `GET /v1/commercial/kpis/preview` `response_time`:

| Condition | Status |
| --- | --- |
| Every RFP in the preview set has explicit `receivedAt` and `firstResponseAt` and a non-negative interval | **derived** (mean milliseconds) |
| Any RFP in that set lacks either timestamp | **unavailable** (`insufficient_timestamps_no_complete_received_to_response_chain`); incomplete RFPs are **retained** in `population: preview_tenant_rfps` |
| All RFPs have both timestamps but a negative interval remains | **unavailable** (`negative_response_interval`) — PUT also rejects this |

Incomplete RFPs are **not** dropped so that a mean of the complete subset can be presented as the population result. Mixed completeness uses `dataSufficiency: partial` and status **unavailable**.

Metric provenance continues to include status, value (when derived), unit, observation period, population, calculation method, source facts, data sufficiency, and `numericalTargetAuthorized: false`.

**Response-time capability classification:** **derived** when the complete explicit chain exists for the defined preview population; otherwise **unavailable**. I9 as a whole is **partially ready** for operational C10 (preview-only, no historical series, no mailbox evidence).

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/service.ts` | First-response substitution flags; `negative_response_interval` on PUT |
| `apps/api/src/commercial-facts/kpis.ts` | Complete-population derivation; do not drop incomplete RFPs |
| `apps/api/src/f2-i9.c3-first-response-preview.test.ts` | **Created** |
| `docs/governance/gpta-h-54-f2-i9-c3-first-response-preview.md` | This record |
| `docs/governance/gpta-h-19-owner-business-rules-resolution.md` | Additive H-54 pointer only |
| `docs/governance/adr-0006-e1-next-action-dependency-register.md` | Additive §93 only |
| `docs/governance/adr-0006-e1-c-parallel-work-register.md` | Additive H-54 row only |

### Files deliberately not changed

* `apps/api/src/rfp/rfp.ts`
* `apps/api/src/analytics/commercial.ts`
* `apps/api/src/commercial-facts/routes.ts` (existing RFP facts routes reused)
* `apps/api/src/commercial-facts/memory.ts` (`firstResponseAt` already present from I8)
* Persistence, schema, migrations, `eos_gateb`, Gate B
* Production infrastructure

---

## Tests and exact results

Automated tests are **not** UAT.

```text
npx vitest run --maxWorkers=1 src/f2-i9.c3-first-response-preview.test.ts
```

**1 file, 9 tests passed.** Duration 7.77s.

```text
npx vitest run --maxWorkers=1 src/f2-i8.c3-rfp-timestamp-clarification-preview.test.ts src/f2-i7.c10-commercial-kpi-preview.test.ts src/f2-i2.commercial-facts.test.ts
```

**3 files, 26 tests passed.** Duration 12.88s.

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT | **NOT PERFORMED** |
| Persistence / schema / migration | **NOT MODIFIED** / **NOT CREATED OR EXECUTED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

## Remaining C3 and C10 limitations

* First response is a **preview sidecar observation**, not mailbox evidence.
* Mixed `POST /v1/rfps` still defaults `RfpRecord.receivedAt` to `now`; still non-authoritative for F2.
* Full C3 clarification workflow is not implemented.
* Response-time KPI is **derived** only for a complete explicit preview population; it is not a historical SLA series.
* Revenue, profit, numerical targets, and 250k/20% remain out of scope.
* C5 programme and C9 booking commercial-facts observation remain unexecuted.

---

## Next increment

**F2-I10 — remaining C-spine preview residuals (C5 programme and/or C9 booking observation).** Not executed in this record.

---

## Governance status

```text
GPTA-H-54 STATUS = F2-I9 C3 FIRST-RESPONSE PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
F2-I6 = COMPLETED
F2-I7 = COMPLETED
F2-I8 = COMPLETED
F2-I9 = COMPLETED
SCOPE = C3 / IN-MEMORY FIRST-RESPONSE OBSERVATION / DEV-TEST ONLY

RESPONSE-TIME MEASUREMENT = DERIVED WHEN COMPLETE EXPLICIT PREVIEW POPULATION EXISTS ELSE UNAVAILABLE
FIRST RESPONSE = OBSERVED WHEN EXPLICIT ELSE UNAVAILABLE
CREATEDAT / RECEIVEDAT / PROPOSAL SENT USED AS FIRST RESPONSE = NO
MIXED J3 ANALYTICS = NOT AUTHORITATIVE FOR F2

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
GATE B = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
