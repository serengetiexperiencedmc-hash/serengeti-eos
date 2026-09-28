# GPTA-H-53 — F2-I8 C3 RFP Timestamp and Clarification Preview

> **`F2-I8 IMPLEMENTATION EVIDENCE — PREVIEW C3 RECEIPT AND CLARIFICATION OBSERVATION`**  
> **`NOT UAT`** · **`NOT FULL C3 COMPLETION`** · **`NOT FULL C10 COMPLETION`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / MIXED RFP PERSISTENCE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T20:25:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-52 historical bodies are **not rewritten**.

---

## Repository state

### Before this increment

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | Pre-existing Class A/B and F2-I1–I7 uncommitted work **preserved** |
| Mixed `apps/api/src/rfp/rfp.ts` | **DIRTY** (not rewritten) |
| Mixed `apps/api/src/analytics/commercial.ts` | **not modified** |
| F2 | **AUTHORIZED** (H-44, C1–C10 Dev/Test only) |
| F2-I7 | **COMPLETED** |

### After this increment

HEAD, branch, and empty index are **unchanged**. No staging, commit, or push. Mixed RFP persistence, schema, migrations, Gate B, and J3 analytics remain untouched. Additive F2 sidecar files and this record are uncommitted.

---

## Authorization and scope

F2 remains authorized only under GPTA-H-44 (C1–C10 Dev/Test). This record executes **F2-I8 only**.

| In scope | Out of scope |
| --- | --- |
| Additive in-memory/preview C3 observation on the commercial-facts sidecar | Mixed RFP persist rewrite |
| Explicit `receivedAt` | Deriving receipt from `createdAt`, DB insert, API request time, clarification, proposal, or email metadata |
| Explicit clarification event timestamps | Mailbox / automatic email ingestion / communication sync |
| Evidence-based provenance | Full C3 workflow redesign |
| Preview-only response-time readiness | Claiming full response-time unless the timestamp chain exists |
| Existing `GET`/`PUT /v1/rfps/:id/commercial-facts` | New route family, C11+, finance, numerical targets, 250k/20% |

No additional authorization was required. No stop condition was reached.

---

## Receipt timestamp semantics

`receivedAt` is an **explicit business fact** on the preview sidecar.

* Accepted only when a caller supplies a full ISO-8601 datetime (`YYYY-MM-DDTHH:MM:SS[.sss]Z` or offset).
* Stored with `receivedAtProvenance = explicit_business_fact`.
* Optional `receivedAtNote` is observation metadata, not a timestamp source.
* **Not** copied from `rfp.createdAt`.
* **Not** copied from mixed `RfpRecord.receivedAt` (preview `POST /v1/rfps` still defaults that mixed field to `now`; that value is **not** F2-authoritative).
* Date-only strings and unparsable values are rejected (`invalid_receivedAt`).
* A later different `receivedAt` is rejected (`receivedAt_already_observed`). The same value is idempotent.
* Absence remains absence. Tests and seed data do **not** invent a receipt time to make KPIs available.

View flags:

* `receivedAtStatus`: `observed` or `unavailable`
* `createdAtUsedAsReceivedAt`: always `false`
* `legacyRfpRecordReceivedAtAuthoritativeForF2`: always `false`

---

## Clarification observation semantics

Clarification **status** remains the I2 field (`not_started` / `started` / `completed` / `not_applicable`) and is **independent** of timestamps.

Clarification **events** are append-only sidecar observations:

| Field | Rule |
| --- | --- |
| `eventType` | `requested` or `answered` only |
| `eventAt` | Explicit ISO datetime; not inferred |
| `provenance` | `explicit_business_fact` |
| `note` | Optional |

Changing `clarificationStatus` to `started` does **not** synthesize an event or timestamp. An event without `eventAt` is rejected (`invalid_clarification_timestamp`). No mailbox, direction catalogue, or actor business rule was added. No clarification workflow engine was introduced.

Optional `firstResponseAt` is accepted only as an explicit sidecar fact (`explicit_business_fact`). `proposal.sentAt` is **not** used as first response.

---

## Provenance and validation

| Kind | Meaning |
| --- | --- |
| **Observed** | Explicit sidecar timestamp (`receivedAt`, `firstResponseAt`, clarification `eventAt`) |
| **Derived** | KPI `response_time` only when every RFP in the preview set has both explicit `receivedAt` and `firstResponseAt` |
| **Unavailable** | Missing explicit fact; including mixed `createdAt` / mixed default `receivedAt` / proposal send time |

ISO validation requires a datetime instant. Request time is not designated as receipt time.

---

## API behavior

Existing routes (no new family):

* `GET /v1/rfps/:id/commercial-facts`
* `PUT /v1/rfps/:id/commercial-facts`

Additive PUT fields: `receivedAt`, `receivedAtNote`, `firstResponseAt`, `clarificationEvent`.

I2 SOURCE / CHANNEL / `clarificationStatus` remain compatible. RFP existence and authorization follow existing sidecar behavior.

---

## Durable-store boundary

When `store.dbPool` is set, RFP commercial-facts GET/PUT return **409** `f2_i8_in_memory_preview_only`.

Opportunity commercial-facts remain `f2_i2_in_memory_preview_only`. KPI preview remains `f2_i7_in_memory_preview_only`.

The sidecar is **not** durable and **not** operationally authoritative.

---

## Response-time measurement status

| Element | Status |
| --- | --- |
| RFP `receivedAt` (sidecar, explicit) | **Observed** when PUT; else **unavailable** |
| First SEDMC response timestamp | **Observed** only if explicit `firstResponseAt`; else **unavailable** |
| Clarification requested / answered | **Observed** only if explicit events |
| Proposal sent as first response | **Not used** |
| KPI `response_time` | **Derived** only when the explicit received→first-response chain exists for the whole preview RFP set; otherwise **unavailable** |
| Full C3 SLA / historical reconstruction | **Unavailable** |

**Increment classification:** **partially ready**. Receipt and clarification observation exist. Full response-time measurement is **not** claimed unless the explicit first-response timestamp is also present. `createdAt` is never a substitute for `receivedAt`.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/memory.ts` | Additive `receivedAt`, provenance, `firstResponseAt`, `clarificationEvents` |
| `apps/api/src/commercial-facts/service.ts` | ISO validation, conflict, append-only events, RFP durable reason `f2_i8_in_memory_preview_only` |
| `apps/api/src/commercial-facts/kpis.ts` | Response-time derived **only** from explicit sidecar chain; otherwise unchanged unavailable reason |
| `apps/api/src/f2-i8.c3-rfp-timestamp-clarification-preview.test.ts` | **Created** |
| `docs/governance/gpta-h-53-f2-i8-c3-rfp-timestamp-clarification-preview.md` | This record |
| `docs/governance/gpta-h-19-owner-business-rules-resolution.md` | Additive H-53 pointer only |
| `docs/governance/adr-0006-e1-next-action-dependency-register.md` | Additive §92 only |
| `docs/governance/adr-0006-e1-c-parallel-work-register.md` | Additive H-53 row only |

### Files deliberately not changed

* `apps/api/src/rfp/rfp.ts` (mixed / dirty)
* `apps/api/src/analytics/commercial.ts` (mixed J3)
* `apps/api/src/commercial-facts/routes.ts` (existing RFP facts routes reused)
* Persistence, schema, migrations, `eos_gateb`, Gate B harnesses
* `server.ts`, Class A/B application diffs, finance / revenue / profit code
* Kernel C3 workflow types beyond reuse of existing clarification statuses

---

## Tests and exact results

Automated tests are **not** UAT.

```text
npx vitest run --maxWorkers=1 src/f2-i8.c3-rfp-timestamp-clarification-preview.test.ts
```

**1 file, 10 tests passed.** Duration 7.64s.

```text
npx vitest run --maxWorkers=1 src/f2-i2.commercial-facts.test.ts src/f2-i3.path-b-c7-preview.test.ts src/f2-i4.in-memory-generation-path-b.test.ts src/f2-i5.c1-account-market-preview.test.ts src/f2-i6.c4-supplier-rate-identity-preview.test.ts src/f2-i7.c10-commercial-kpi-preview.test.ts
```

**6 files, 44 tests passed.** Duration 21.96s.

Covered: explicit `receivedAt`; missing `receivedAt` not synthesized; `createdAt` / mixed default `receivedAt` not treated as F2 receipt; invalid timestamps rejected; explicit clarification event; status change does not infer timestamps; I2 SOURCE/CHANNEL/status compatibility and `receivedAt` conflict; durable `f2_i8_in_memory_preview_only`; KPI response-time **unavailable** without `firstResponseAt`; provenance observed/derived/unavailable. I2 and I7 behavior remained intact. Mixed J3 analytics was not executed or modified.

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

* Full C3 clarification **workflow** is not implemented (observation only).
* Mixed `POST /v1/rfps` still defaults `RfpRecord.receivedAt` to `now`; F2 ignores that field.
* Mailbox / email ingestion remains unauthorized.
* Response-time KPI remains **unavailable** unless both sidecar timestamps are explicit for the whole preview RFP set.
* Revenue, profit, historical KPI series, and numerical targets remain out of scope.
* Mixed J3 analytics still invents stage default values and is **not** F2-authoritative.
* C5 programme and C9 booking commercial-facts observation were not added in I8.

---

## Next increment (from I8 evidence)

**F2-I9 — remaining C-spine preview residuals (C5 programme and/or C9 booking observation)** on the in-memory sidecar, additive, no mixed persist rewrite. **Not executed in this record.**

---

## Residuals

1. C3 remains **partial**: receipt and clarification timestamps can be observed; the operational clarification process is not redesigned.
2. C10 remains **partial**: response time is **partially ready** (observation path exists) and **unavailable** as a KPI without `firstResponseAt`.
3. Mixed RFP `receivedAt ?? now` is a pre-existing persist behavior; stopping to rewrite it was **not** required because the sidecar does not treat it as F2 receipt.
4. No durable SoR write path.
5. No UAT, production, commit, or push.

---

## Governance status

```text
GPTA-H-53 STATUS = F2-I8 C3 RFP TIMESTAMP AND CLARIFICATION PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
F2-I6 = COMPLETED
F2-I7 = COMPLETED
F2-I8 = COMPLETED
SCOPE = C3 / IN-MEMORY RECEIPT AND CLARIFICATION OBSERVATION / DEV-TEST ONLY

RESPONSE-TIME MEASUREMENT = PARTIALLY READY
  RECEIVED AT = OBSERVED WHEN EXPLICIT ELSE UNAVAILABLE
  CLARIFICATION EVENTS = OBSERVED WHEN EXPLICIT ELSE UNAVAILABLE
  FIRST RESPONSE = OBSERVED WHEN EXPLICIT ELSE UNAVAILABLE
  KPI RESPONSE TIME = DERIVED ONLY WITH COMPLETE EXPLICIT CHAIN ELSE UNAVAILABLE
CREATEDAT USED AS RECEIVEDAT = NO
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
