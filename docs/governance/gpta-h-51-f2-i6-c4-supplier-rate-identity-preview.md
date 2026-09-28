# GPTA-H-51 — F2-I6 C4 Supplier-Rate Identity Preview

> **`F2-I6 IMPLEMENTATION EVIDENCE — PREVIEW C4 OR-08`**  
> **`NOT UAT`** · **`NOT FULL C4/C5 COMPLETION`** · **`NOT SUPPLIER INTEGRATION`** · **`NOT FX INTEGRATION`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / PERSISTENCE REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T19:01:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-50 historical bodies are **not rewritten**.

---

## Authorization

F2 remains authorized (H-44). F2-I1 through I5 remain completed.

Makes the I1 OR-08 supplier-rate identity contract observable on the preview costing/rate path.

---

## Exact C4 preview path changed

Mixed `POST /v1/suppliers/:id/rates` and mixed `costing/sheet.ts` were **not** edited.

OR-08 identity is additive on the commercial-facts sidecar:

* `GET/PUT /v1/suppliers/:supplierId/rates/:rateId/commercial-facts`
* `GET /v1/costing/sheets/:id/rate-identities`
* in-memory `f2FactsMemory(store).rates`

Durable SoR returns `f2_i6_in_memory_preview_only`.

---

## OR-08 identity

Reusable identity includes: supplier/source, source class, OR-08 rate type, original currency, season/validity, received (`sourceDate`), verified, expiry, version identity, item/service identity (`rateCode` / `itemIdentity`). Amount is explicitly not identity.

Source classes (I1 keys, H-27 labels):

1. `direct_supplier_contract`
2. `supplier_contracted_rate_sheet`
3. `written_supplier_quotation`
4. `trade_partner_net_agreement`
5. `public_benchmark`

Rate types: Negotiated / Contracted, Trade / Net, Public, Promotional, Quoted / Ad hoc.

`per_room_per_night` remains the legacy **unit** type and is **not** an OR-08 rate type.

---

## Season / validity

Explicit `validFrom` / `validTo` plus optional `seasonLabel`. No global season calendar. Validity state at a supplied `at` date: `current` | `future` | `expired`.

---

## Version

Multiple `versionIdentity` values on the same rate are stored side by side. Duplicate version identity returns `409` / `version_identity_exists`.

---

## Snapshot linkage

Preview observation snapshot: `cost-sheet:{id}:v{currentVersion}` on `GET /v1/costing/sheets/:id/rate-identities`.  
`CostSheetVersion.snapshot` was **not** modified (residual). No durable snapshot.

---

## Overlap / conflict

Overlapping identities remain distinguishable. No automatic winner. Mixed `preferredInConflict` is **not** F1-C-03 resolution (`preferredInConflictAuthoritativeForF2 = false`). F1-C-03 remains a residual.

---

## FX / supplier engagement

FX provider **not** implemented. Original currency preserved. No supplier contact, email, WhatsApp, extranet, or procurement.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/rate-identity.ts` | **Created** |
| `apps/api/src/commercial-facts/memory.ts` | Additive `rates` map |
| `apps/api/src/commercial-facts/routes.ts` | Additive rate-identity and costing observation routes |
| `apps/api/src/f2-i6.c4-supplier-rate-identity-preview.test.ts` | **Created** |

**Not changed:** `supplier/rates.ts`, `costing/sheet.ts`, persist, schema, migrations, Gate B, `evaluateCommercialApprovalGate`, `server.ts`.

---

## Tests executed

Narrow I6:

```text
npx vitest run --maxWorkers=1 src/f2-i6.c4-supplier-rate-identity-preview.test.ts
```

**1 file, 9 tests passed.** Duration 6.68s.

Regression (serial, to avoid worker OOM):

```text
npx vitest run --maxWorkers=1 src/c6.costing.test.ts src/pg9-supplier-contact-rate.test.ts src/f2-i2.commercial-facts.test.ts src/f2-i3.path-b-c7-preview.test.ts src/f2-i4.in-memory-generation-path-b.test.ts src/f2-i5.c1-account-market-preview.test.ts
```

**6 files, 30 tests passed.** Duration 19.72s.

Automated tests are **not** UAT.

---

## Remaining residuals

* `CostSheetVersion.snapshot` does not store OR-08 facts.
* F1-C-03 overlap resolution is not implemented.
* Legacy `SUPPLIER_RATE_TYPES` remain unit types (`per_room_per_night`, …).
* Mixed `preferredInConflict` remains.
* Durable supplier-rate identity is not implemented.
* Mixed 250k/20% gate remains.
* C10 KPI pack remains unused on preview.

---

## Next increment (from I6 evidence)

**F2-I7 — in-memory C10 commercial KPI observation** on the preview path, additive, no persist/schema.

Rationale: C4 OR-08 identity is now observable. Writing OR-08 into mixed `CostSheetVersion.snapshot` would require the costing persist rewrite I6 refused. The remaining unused C-spine capability from H-50 is C10 KPI.

---

## Governance status

```text
GPTA-H-51 STATUS = F2-I6 C4 SUPPLIER-RATE IDENTITY PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
F2-I6 = COMPLETED
SCOPE = C4 / IN-MEMORY COSTING PREVIEW / DEV-TEST ONLY

OR-08 SOURCE / TYPE / CURRENCY / VALIDITY / VERSION = PREVIEW OBSERVABLE
SNAPSHOT = IN-MEMORY COSTING OBSERVATION ONLY
COST SHEET VERSION SNAPSHOT = NOT MODIFIED
FX PROVIDER = NOT IMPLEMENTED
SUPPLIER ENGAGEMENT = NOT PERFORMED
OVERLAP WINNER = NOT INVENTED

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
