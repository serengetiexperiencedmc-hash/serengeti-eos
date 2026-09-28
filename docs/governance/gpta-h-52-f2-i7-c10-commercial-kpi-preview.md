# GPTA-H-52 — F2-I7 C10 Commercial KPI Preview

> **`F2-I7 IMPLEMENTATION EVIDENCE — PREVIEW C10 KPI OBSERVATION`**  
> **`NOT UAT`** · **`NOT FULL C10 COMPLETION`** · **`NOT HISTORICAL KPI COMPLETENESS`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / KPI TABLES`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T19:14:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-51 historical bodies are **not rewritten**.

---

## Authorization

F2 remains authorized (H-44). F2-I1 through I6 remain completed.

---

## Exact KPI observation path

Additive:

`GET /v1/commercial/kpis/preview`

Registered on the existing commercial-facts routes. Mixed J3 `/v1/analytics/commercial/summary` was **not** modified (it still invents stage default values and is **not** F2-authoritative).

Durable SoR returns `f2_i7_in_memory_preview_only`.

Optional `from` / `to` query dates. No default reporting month is invented.

---

## Metrics

| Metric | Status | Notes |
| --- | --- | --- |
| RFP volume | **observed** | Count of preview RFPs |
| Qualified opportunities | **observed** | `qualificationStatus === qualified` only; `new_qualified` is not qualification |
| Conversion | **derived** when qualified set and booking outcomes exist; else **unavailable** | `non_cancelled_bookings_linked_to_qualified_opportunities / qualified_opportunities` |
| Revenue | **unavailable** | Costing / proposal / booking `sellPrice` are not revenue |
| Response time | **unavailable** | No complete `receivedAt` → response chain; `createdAt` is not treated as received |
| Pipeline value | **derived** from explicit `estimatedValue` only | No 250k/20% filter; `285000` is included, not used as a threshold |
| Repeat business | **observed** from explicit `primarySource = existing_client_repeat`; else **unavailable** | Not inferred from names |
| Profit per booking | **unavailable** | Costing margin is not profit per booking |

Provenance on every metric: `status`, `unit`, `observationPeriod`, `population`, `calculationMethod`, `sourceFacts`, `dataSufficiency`, `numericalTargetAuthorized: false`. Derived metrics include `formula`.

---

## Segmentation

Where C1/I2 facts exist: market, account type, SOURCE, CHANNEL. PCO remains PCO. Market independent of buyer type. SOURCE distinct from CHANNEL.

---

## Numerical targets / 250k

`NO NUMERICAL TARGET AUTHORIZED` preserved. Owner 25/3/~12% estimate **not** seeded. `DEFAULT_SELL_THRESHOLD_USD` **not** used as a KPI filter.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/kpis.ts` | **Created** |
| `apps/api/src/commercial-facts/routes.ts` | Additive GET `/v1/commercial/kpis/preview` |
| `apps/api/src/f2-i7.c10-commercial-kpi-preview.test.ts` | **Created** |

**Not changed:** `analytics/commercial.ts`, persist, schema, migrations, Gate B, finance, `server.ts`.

---

## Tests executed

```text
npx vitest run --maxWorkers=1 src/f2-i7.c10-commercial-kpi-preview.test.ts
```

**1 file, 12 tests passed.** Duration 7.41s.

```text
npx vitest run --maxWorkers=1 src/c10-command-center.test.ts src/c1.accounts-notes-tasks.test.ts src/f2-i2.commercial-facts.test.ts src/f2-i3.path-b-c7-preview.test.ts src/f2-i4.in-memory-generation-path-b.test.ts src/f2-i5.c1-account-market-preview.test.ts src/f2-i6.c4-supplier-rate-identity-preview.test.ts
```

**7 files, 45 tests passed.** Duration 23.73s.

Automated tests are **not** UAT.

---

## Remaining C10 residuals

* Mixed J3 analytics still invents pipeline values from stage defaults.
* Revenue and profit remain unavailable (finance not in I7).
* Response time remains unavailable until an explicit received/response timestamp chain exists.
* No historical KPI series.
* Booking command-center C10 (migration 030) is a different numbering family and was not rewritten.

---

## Next increment (from I7 evidence)

**F2-I8 — in-memory C3 RFP `receivedAt` / clarification observation on the commercial-facts sidecar**, additive, no mixed `rfp.ts` persist rewrite.

Rationale: I7 found response time blocked because preview RFP create does not populate `receivedAt` and I7 must not fabricate timestamps. Do not rewrite mixed J3 analytics in that increment.

---

## Governance status

```text
GPTA-H-52 STATUS = F2-I7 C10 COMMERCIAL KPI PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
F2-I6 = COMPLETED
F2-I7 = COMPLETED
SCOPE = C10 / IN-MEMORY KPI OBSERVATION / DEV-TEST ONLY

NUMERICAL TARGETS = NOT AUTHORIZED
250K / 20% = NOT USED AS KPI THRESHOLD
OWNER 25/3/12% ESTIMATE = NOT SEEDED
MIXED J3 ANALYTICS = NOT AUTHORITATIVE FOR F2

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
