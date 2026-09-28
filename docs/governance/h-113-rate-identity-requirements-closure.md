# H-113 — Rate identity requirements closure

> **`H-113 RATE IDENTITY REQUIREMENTS CLOSURE`**  
> **`NO IMPLEMENTATION`** · **`NO SCHEMA CHANGE`** · **`NO MIGRATION`** · **`NO DATABASE ALTERATION`**  
> **`NO UI`** · **`NO COMMIT`** · **`NO PUSH`**  
> **`NOT UAT`** · **`NOT PRODUCTION`** · **`NOT H-81`** · **`NOT H-80 EXIT`** · **`NOT EOS ADOPTION`**  
> **`NOT H-114`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T18:50:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** Owner/POA H-113 grant (requirements closure only).  
**Prior classifications:** H-111 `RATE IDENTITY = STOPPED`. H-112 P1-10 **GOVERNANCE-GATED**.

```text
H-113 RATE IDENTITY — PARTIALLY DEFINED
IMPLEMENTATION = NOT PERFORMED
RATE IDENTITY OPERATOR COMPLETION = NOT AUTHORIZED BY THIS RECORD
```

This action does **not** implement rate identity. It does **not** lift the H-111/H-112 stop. It does **not** invent overlap winners, FX, revenue, profit, booking facts, or KPI history.

---

## 1. Executive finding

OR-08 **identity catalogues** and an **F2 overlay preview contract** already exist and are frozen (F2-I1 / F2-I6). A sidecar table `f2_rate_identities` and GET/PUT APIs exist. Mixed C4 `sup_rates` is a **separate, legacy/compatibility** rate row (amount, unit type, `preferredInConflict`).

That is **not** sufficient to complete operator rate identity without a new governance decision.

Material business semantics remain explicitly open in H-26, residual in H-51, and required-but-unresolved in H-29 for **live proposal/costing use**: overlap **resolution**, freeze-on-send / `CostSheetVersion.snapshot`, expired-rate behaviour on a live proposal, public-rate approval for sale, and FX treatment. H-111 Day 2 **stopped** rate-identity UI because mixed supplier SQL would be required; H-112 reaffirmed **GOVERNANCE-GATED**. H-72 forbids modifying the supplier-rate system from the commercial-process finding that no quotation was inspected.

**Supplier identity ≠ rate identity.** A supplier owns rates. A mixed `SupRate` row is not an OR-08 identity record. Amount is not identity. Mixed unit `rateType` (`per_room_per_night`, …) is not an OR-08 rate type.

**Classification: PARTIALLY DEFINED** — not implementation-ready, not a blank governance slate.

---

## 2. Sources inspected

Governance / requirements (read, not rewritten):

- H-24 OR-08 owner blanks; H-26 §8 OR-08 closure + remaining design detail; H-27 AC-R; H-29 D4 C4 remediation; H-34 C4 structured data
- H-44 / H-46 F2-I1 `SupplierRateIdentityFacts`; H-51 F2-I6 preview evidence; H-55 / H-57 / H-58 residuals
- H-71 / H-72 OR-08 **NOT AVAILABLE** (no quotation); H-72-FND-09 **do not modify supplier-rate system**
- H-74 / H-75 provenance as operating practice; H-82 G-06-B identifier trace ≠ cost-line freeze
- H-83 / H-84 freeze-on-send **not** authorized; H-85 rates map persist as OR-08 identity already specified
- H-91 / H-92 sidecar write evidence; H-111 Days 1–7 (STOP); H-112 completion report (GOVERNANCE-GATED)

Code / schema / tests (read-only):

- `packages/kernel/src/commercial-contract.ts` (OR-08 catalogues)
- `packages/kernel/src/supplier.ts` (`SupRate`; comment that OR-08 lives on `SupplierRateIdentityFacts`)
- `packages/kernel/src/supplier-import.ts` (legacy unit `SUPPLIER_RATE_TYPES`)
- `apps/api/src/commercial-facts/rate-identity.ts`, `memory.ts`, `routes.ts`, `persist.ts`
- `apps/api/src/persistence/f2-commercial-facts-repository.ts`
- `apps/api/src/supplier/rates.ts` (mixed C4)
- `apps/api/src/f2-i6.c4-supplier-rate-identity-preview.test.ts`
- `packages/db/migrations/014_c4_supplier.sql`, `017`/`018` `supplier_rate_id`, `124_f2_dp01_commercial_facts.sql`
- `apps/web`: **no** rate-identity commercial-facts UI

H-112 bounded (`127.0.0.1:5432/eos`) and full-schema (`127.0.0.1:5435/eos_h112_full`) catalogs were **not** queried or altered.

---

## 3. Existing rate-related architecture

Three layers coexist. None of the latter two may be promoted to OR-08 SoR without a new grant.

| Layer | What it is | Authoritative for OR-08 identity? |
| --- | --- | --- |
| **F2-I1 catalogues** | Five source classes; five OR-08 types; `SupplierRateIdentityFacts`; validity helper; **no FX, no persistence** in the kernel comment | **Yes** (catalogues / identity fields) |
| **F2-I6 overlay** | GET/PUT `/v1/suppliers/:supplierId/rates/:rateId/commercial-facts`; GET `/v1/costing/sheets/:id/rate-identities`; in-memory + F2-DP-01 sidecar `f2_rate_identities` | **Preview / sidecar identity overlay only.** H-51: durable mixed persist **not** rewritten; overlap winner **not** invented; costing version snapshot **not** modified |
| **Mixed C4 `SupRate` / `sup_rates`** | Amount, unit type, mixed `currency`, `validFrom`/`validTo`, `seasonLabel`/`seasonId`, `preferredInConflict`, `contractId`, occupancy/meal plan, status draft/active/expired/superseded | **Legacy / C4 operational row.** Unit type and `preferredInConflict` are **explicitly non-authoritative for F2** |

Costing lines may reference `supplierRateId` (mixed FK). Programme items may reference `supplier_rate_id`. That is **consumption of a mixed rate id**, not OR-08 identity.

PG.14–PG.19 (calendar, conflicts, prefer, seasons, import, bounds) are mixed C4 engineering previews. They are **not** the F2 identity contract.

Hotel profiles (`121_cd_hotel_profiles.sql`) are not rate identity.

---

## 4. Rate identity requirement matrix

| Requirement | Existing authoritative source | Defined? | Evidence | Implementation impact | Governance status |
| --- | --- | ---: | --- | --- | --- |
| 1. Unique rate | Mixed: `UNIQUE (tenant_id, supplier_id, rate_code)` on `sup_rates`. Overlay: `UNIQUE (tenant_id, rate_id, version_identity)` on `f2_rate_identities`. I6: amount is not identity | **Partial** | `014_c4_supplier.sql`; `124_…sql`; H-51 “amount is explicitly not identity” | Two uniqueness schemes. Must not merge them without a decision | Overlay uniqueness specified; **whether mixed row = unique commercial rate** vs overlay version is **not** unified |
| 2. Entity that owns the rate | H-29: Commercial/Operations supplier-management maintains; Sales flags. Overlay `supplierId` required | **Yes** (owner function). **Partial** (which principal role in software) | H-29 D4 Ownership; `F2RateIdentity.supplierId` | Authz currently `supplier:read/write:supplier` on the **supplier** resource | Owner **function** defined; RBAC split Sales vs supplier-management **not** encoded as a new rule here |
| 3. Supplier identity | Mixed `sup_suppliers`; overlay copies `supplierId`, `supplierCode`, `legalName` onto the view | **Yes** as link | H-29 Retain; I6 view | Identity of the **rate** is not the supplier code | Distinct from rate identity — **preserve** |
| 4. Property/hotel identity | Not in I1 `SupplierRateIdentityFacts`. Mixed optional occupancy/meal plan only | **No** (not an OR-08 element) | I1 type; `SupRate.occupancy`/`mealPlan` CD Phase 1 | Do not invent hotel as identity | **Not required by frozen I1.** Separate decision if property identity is later wanted |
| 5. Destination/location identity | Not in I1 | **No** | I1; content-block type `location` is not a rate | Do not invent | **Undefined / out of I1** |
| 6. Room/product/service identity | I6 `itemIdentity` defaults to mixed `rateCode` | **Partial** | H-51; PUT `itemIdentity?` | Code/name exist; room type catalogue does not | **Item key exists; product taxonomy not defined** |
| 7. Contract/season identity | Source class includes contract/rate-sheet/quotation. Optional `seasonLabel` / `seasonId`. Mixed `contractId` CD Phase 1 | **Partial** | I1; H-26 “no universal SEDMC calendar”; H-51 no global season calendar | Season label optional. Contract row optional mixed field | Season **applicability dates** defined; **supplier-specific season catalogue vs overlay `seasonId` not unified**. Mixed `contractId` **not** OR-08 |
| 8. Currency | Original supplier currency preserved; ISO 4217 on overlay PUT; mixed `currency` non-authoritative for F2 | **Yes** for identity. **No** for conversion | H-26; H-29; I1; I6 `originalCurrency` vs `legacyCurrencyAuthoritativeForF2=false` | I6 tests TZS overlay vs USD mixed amount — divergence is allowed | **Identity currency defined. FX undefined** (must not invent) |
| 9. Validity period | `validFrom` / `validTo`; state `current` \| `future` \| `expired` at a supplied `at` | **Yes** for observation | I1 helper; I6 `rateValidityState` | Expired ≠ silently current **as observation**. Live-proposal **use** of expired rates is a **separate** H-26/H-29 residual | Observation **defined**. Live-use **undefined** |
| 10. Source of rate | Five I1 classes (H-27 labels on preview) | **Yes** | I1 `SUPPLIER_RATE_SOURCE_CLASSES`; H-51 | Must not add a sixth class | **Catalogues frozen** |
| 11. Cost vs sell price | Amount is not identity. `sellPrice ≠ revenue`. Costing margin ≠ profit | **Yes** as prohibition | I6 `amountIsNotIdentity`; H-112 invariants | Overlay must not store sell/revenue/profit | **Do not implement amounts as identity** |
| 12. Mutable vs snapshot-based | I6: versions stored **side by side**; duplicate `versionIdentity` → 409. H-51 snapshot = `cost-sheet:{id}:v{currentVersion}` observation only. `CostSheetVersion.snapshot` **not** modified. G-06-B / H-84: freeze-on-send **not** authorized | **Partial** | H-51; H-29 versioning; H-84 | SQL `ON CONFLICT … DO UPDATE` could overwrite a version if PUT were bypassed; application PUT refuses duplicates | **Append-only overlay versions specified. Live costing/proposal snapshot not specified** |
| 13. Historical versions survive | H-29: must not overwrite so reconstruction is destroyed. I6 keeps prior `versionIdentity` rows | **Partial** | H-26 listed versioning/history as design detail; I6 later specified append | Sidecar unique key is version-scoped | Overlay **preview** preserves versions. **Proposal-grade reconstruction** still residual (H-29 Absent / H-58 NOT READY) |
| 14. Globally unique vs scoped | Overlay `identityId` UUID; uniqueness `(tenant_id, rate_id, version_identity)`. Mixed rate UUID + `(tenant, supplier, rate_code)` | **Yes** as scoped | `124` UNIQUE; `014` UNIQUE | Not a global natural key | **Tenant-scoped** |
| 15. Duplicate rates permitted | Mixed: duplicate `rate_code` per supplier refused. Overlay: overlapping identities distinguishable; no automatic winner | **Partial** | `supplier/rates.ts` duplicate; H-51 overlap | Overlap **identification** yes; **permission to keep overlaps live** vs must-resolve is H-29 remediate | **Duplicates of code: mixed no. Overlapping validity: identifiable, not resolved** |
| 16. Reuse across programmes/opportunities | Costing/programme FKs to mixed `supplier_rate_id`. I6 observes identities per consumed id | **Yes** as mixed FK reuse. **No** as OR-08 snapshot per use | `018_c6_costing.sql`; I6 GET sheet identities | Reuse of rate **id** exists. Per-use identity freeze does not | **Reuse of mixed id exists; per-proposal identity copy undefined** |
| 17. Durable in PostgreSQL | H-85 authorized sidecar map `rates`. `f2_rate_identities` on 124 and on full-schema chain. Mixed `sup_rates` on 014 (full-schema only) | **Yes** for sidecar overlay. **Bounded `eos` has sidecar tables, not mixed C4** | H-85; 124; H-91 write of six maps | Completing operator UI against bounded `eos` still cannot use mixed C4 SoR | Sidecar **authorized**. Mixed C4 durable on `eos` **forbidden** (H-112 separation). Full-schema mixed C4 **schema exists**; I6 did **not** authorize mixed persist rewrite |
| 18. API | GET/PUT rate commercial-facts; GET costing rate-identities | **Yes** (preview) | `commercial-facts/routes.ts`; H-51 | PUT currently requires a **process-local** `SupRate` (`findRate` on `store.supRates`) | API **exists**. Mixed-SQL lookup (H-112 class) **not** specified for rates |
| 19. Operator UI | H-111 Day 1: identity fields on existing pages. Day 2: **do not start** if mixed supplier SQL required. No web module found | **No UI.** Authority **stopped** | Day 1 matrix; Day 2 rec. 4; `apps/web` grep empty | Implementing UI now would lift H-111/H-112 stop | **GOVERNANCE-GATED** |
| 20. Authentication / authorization | Unauthenticated denied by route principal. `supplier:read:supplier` / `supplier:write:supplier`; costing observe `costing:read:sheet` | **Yes** at supplier/sheet grain | `rate-identity.ts` | Object = supplier or cost sheet, not a separate rate permission | **Existing supplier/costing authz.** No new permission invented |
| 21. Audit / history | Overlay `updatedAt` / `updatedByPrincipalId`. Mixed rate `version` integer + audit chain on C4 writes | **Partial** | `F2RateIdentity`; C4 rates module | Overlay is not the mixed audit chain | **Who last wrote overlay: yes. Full reconstruction audit: residual** |
| 22. Legacy conflict with intended contract | Mixed unit types ≠ OR-08 types. Mixed `currency`/`amount` ≠ overlay identity. `preferredInConflict` ≠ F1-C-03. Silent `active` after expiry (H-28/H-34) | **Yes, documented conflict** | Kernel comments; I6 `legacy*AuthoritativeForF2=false`; H-51 residuals | Must not promote mixed fields | **Conflict acknowledged; mixed retained non-authoritative for F2** |

---

## 5. Authoritative vs legacy semantics

**Authoritative for OR-08 identity (do not thaw I1):**

- Five source classes; five OR-08 rate types and labels
- Original currency (identity); no FX provider
- `validFrom` / `validTo`; optional season label; no global SEDMC season calendar
- `versionIdentity` append; duplicate version 409 at the overlay PUT
- Amount is not identity; sell price is not revenue; margin is not profit
- Overlap: **no invented winner** (`overlapResolution: "none"`)
- Public is distinguishable; **sale approval is not implemented**
- F2 overlay does not rewrite mixed `SupRate`

**Legacy / compatibility / exploratory (do not promote):**

- `SUPPLIER_RATE_TYPES` unit enum on `sup_rates.rate_type`
- Mixed `amount`, `currency`, `preferredInConflict`, `status`, occupancy, meal plan, `contractId`
- PG.14–PG.19 conflict/prefer/season tooling
- I6 in-memory-only 409 `f2_i6_in_memory_preview_only` when durable persist is **disabled** (Gate B / Production-like)
- Cost-sheet observation string `cost-sheet:{id}:v{n}` (not `CostSheetVersion.snapshot`)
- Supplier import CSV / Excel-shaped rows
- Hotel profile tables

**Supplier vs rate:** supplier code/legal name identify the **counterparty**. Rate identity identifies a **versioned sourced offering** attached to a mixed rate id. Do not collapse them.

---

## 6. Unresolved decisions

These are **not** filled with assumptions:

1. **Lift or reaffirm the H-111/H-112 STOP** for any operator rate-identity increment (UI and/or mixed-SQL lookup).
2. **Live-use overlap resolution (F1-C-03 / H-29):** identifiable today; **resolved before live proposal** is required by H-29 and **explicitly not invented** by I6.
3. **Snapshot payload for a sent costing/proposal:** H-29/H-27/H-34 require rate-version facts on the commercial snapshot; H-51 left `CostSheetVersion.snapshot` unmodified; H-83/H-84 freeze-on-send **not** authorized (G-06-B is identifier trace only).
4. **Expired rate on a live proposal:** observation of `expired` exists; reconfirmation-before-commitment behaviour is **not** an authorized software rule beyond H-29 prose.
5. **Public rate approved for sale:** I1 distinguishes `public`; H-26/H-29 require explicit approval for client proposals — **no software fact** for that approval.
6. **FX:** original currency retained. Conversion basis/date **if converted** is H-29; **no FX product**. Must not invent FX.
7. **SoR when mixed `SupRate` and F2 overlay diverge** (I6 already allows TZS overlay vs USD mixed). Which store an operator “corrects,” and whether mixed persist may be rewritten, is **not** granted (I6: mixed persist files not modified).
8. **Whether overlay identity may exist without a mixed `SupRate` row** — current PUT `findRate` requires the mixed row in process-local Store.
9. **Hotel / destination / room taxonomy** as identity — **not** in I1; inventing them is forbidden.
10. **H-72:** commercial-process finding is not a software grant; “do not modify supplier-rate system” remains controlling for that track.

H-26 §8 still names design detail for versioning, history, overlap, supplier seasons, FX, expired-in-proposal, and public-for-sale. I6 closed **preview observation** of versioning/history/overlap-**identification**/seasons-as-label. It did **not** close 2–6 above.

---

## 7. Security / authorization implications

Existing overlay routes require a session principal and `authorize()` on the supplier (read/write) or cost sheet (read). Unauthenticated access is 401 via the shared route guard. Identifier immutability patterns used on Account/RFP facts are **not** specified on rate PUT (`rateId` comes from the path; body has `versionIdentity`, not a conflicting id field).

No new permission, no weakening, and no Production IdP change is implied. Implementation later must not bypass `authorize()` or use `as any`.

Bounded vs full-schema: persist decision already refuses Production-like env and `eos_gateb`. That must remain.

---

## 8. Persistence implications

- **Bounded `eos`:** F2 sidecar `f2_rate_identities` only. Mixed `sup_rates` **must not** be created there (H-112). Overlay PUT still looks up `store.supRates` — process-local, not 124-only SQL.
- **Full-schema `eos_h112_full`:** both `sup_rates` and `f2_rate_identities` exist after 001→124. I6 did **not** switch C4 writes to mixed SQL SoR. Completing a live mixed path would repeat the H-112 Store-vs-PG lookup class unless a later grant authorizes it.
- Sidecar upsert can **overwrite** a version payload on `(tenant_id, rate_id, version_identity)` even though HTTP PUT returns 409 for duplicates. Historical immutability is an **application** rule, not a DB forbid-update rule.
- No new migration is justified until the contract in §6 is decided. **This action creates none.**

---

## 9. API implications

Existing:

- `GET/PUT /v1/suppliers/:supplierId/rates/:rateId/commercial-facts`
- `GET /v1/costing/sheets/:id/rate-identities`

These are **preview overlay** APIs. They are not a complete live-proposal rate SoR. Mixed `POST /v1/suppliers/:id/rates` remains the C4 amount/unit API and was **not** edited in I6.

A later implementation-ready spec would reuse these routes **only** for the overlay fields already listed in `PutRateIdentityInput`. Extending them with hotel, FX, winner, or sell price would be a new grant.

---

## 10. UI implications

No commercial-facts rate panel exists. Supplier C4 UI (if present for amount/unit rates) is **not** OR-08 identity UI.

H-111 authorized “identity fields only” on existing pages, then **stopped** that workstream. H-113 does **not** add UI.

---

## 11. Migration implications

None in this action.

A future overlay-only increment on already-applied 124 / full-schema 124 would **not** need a new migration if it only uses `f2_rate_identities`. A freeze-on-send snapshot, F1-C-03 winner table, public-for-sale flag, or hotel identity **would** need a later authorized migration — **after** those rules exist. Do not apply anything to `eos` or `eos_h112_full` for this closure.

---

## 12. Test implications

Existing `f2-i6.c4-supplier-rate-identity-preview.test.ts` (9 tests) remains the overlay contract suite. Do not weaken it. Do not add live mixed-SQL rate tests in this action.

If a later grant lifts the stop for overlay UI only, tests would need: 401, authz, version 409, SOURCE-class/type catalogues, `amountIsNotIdentity`, no FX, bounded sidecar-only vs full-schema lookup (once specified). Overlap-winner and snapshot tests **must not** be written until those rules are governed.

---

## 13. Exact implementation boundary (not authorized to build)

**Not implementation-ready.** If a later grant selected **overlay-only observation + append-only versions on an existing mixed rate id**, the boundary would be:

- Canonical identity: `(tenantId, supplierId, rateId, versionIdentity)` plus I1 fields on `SupplierRateIdentityFacts` / `F2RateIdentity`
- Immutable: catalogues; `rateId` path; prior `versionIdentity` rows (application 409)
- Mutable: none on a written version (undefined correction path — would need a grant)
- Persist: sidecar `f2_rate_identities` only; no mixed C4 rewrite; no freeze schema
- API: existing GET/PUT overlay and costing observation
- UI: optional fields on an existing supplier/rate page — **only after lifting STOP**
- Uniqueness: sidecar unique; mixed `rate_code` unique remains C4
- Lifecycle: append versions; validity **observed** at `at`; no auto-winner
- Authz: existing supplier/costing permissions
- Tests: overlay + 401/409; no FX; no revenue
- Migration: none if overlay-only
- Validation: full-schema only if mixed `SupRate` SoR lookup is also granted; bounded `eos` only with process-local mixed rates

That boundary is **descriptive of I6**, not a grant to implement UI or mixed-SQL SoR.

---

## 14. Exact governance questions (minimum next decision)

A single Owner/POA decision record should answer:

1. Remain **STOPPED**, or authorize a **narrow overlay-only** increment (UI and/or full-schema mixed-rate lookup) **without** live-proposal freeze, winner, FX, or public-for-sale?
2. If live proposal use is in scope: how is overlap **resolved** (or is H-29 “resolved before use” deferred as Path D / F1-C-03)?
3. Must a sent costing/proposal **copy** OR-08 facts into a snapshot, given G-06-B / H-84 currently forbid freeze-on-send?
4. Expired and public-for-sale behaviours: software enforcement, or operating practice only (H-74/H-75)?
5. Confirm mixed `SupRate` remains non-authoritative for OR-08 when fields diverge.

Until (1) is answered, engineering must not start H-114 as an implementation tranche.

---

## 15. Confirmation — no code or database changes

This action performed **repository and governance inspection only**.

- No application code modified
- No test files modified
- No migration created or executed
- Bounded database `127.0.0.1:5432/eos` not altered
- Full-schema database `127.0.0.1:5435/eos_h112_full` not altered
- H-80 / H-81 / I1–I11 / Gate B / `eos_gateb` not modified
- Rate identity **not** implemented
- H-114 **not** started

The only new artefact is this file.

---

## 16. Repository state

Recorded **before** adding this file, then re-checked after:

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | **EMPTY** |
| Porcelain (before this file) | **480** |
| Porcelain (after this file) | **481** (expected: +1 untracked report) |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

## Final classification

```text
H-113 RATE IDENTITY — PARTIALLY DEFINED
```

**Minimum next action:** an Owner/POA governance decision answering §14 question (1) — remain STOPPED, or grant a bounded overlay-only increment — **before** any rate-identity code, UI, or migration.

**Not claimed:** Production, UAT, H-81, H-80 exit, EOS adoption, implementation-ready rate identity, or a complete unique-rate commercial SoR.
