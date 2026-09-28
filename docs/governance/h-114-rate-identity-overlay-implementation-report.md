# H-114 — Bounded Rate Identity overlay implementation

> **Engineering increment only.**  
> **`NOT UAT` · `NOT PRODUCTION` · `NOT H-81` · `NOT H-80 EXIT` · `NOT EOS ADOPTION` · `NOT GATE B`**  
> **`NO COMMIT` · `NO PUSH` · `NO PRODUCTION CREDENTIALS`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T19:15:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged).  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** Owner/POA H-114 grant (bounded overlay-only Rate Identity implementation).  
**Prior record:** H-113 `H-113 RATE IDENTITY — PARTIALLY DEFINED`.

This action implements only the Rate Identity overlay semantics already established in the repository. It does **not** invent overlap winners, FX, live-proposal freeze, expired-rate live-use, public-for-sale approval, or mixed-C4 promotion.

---

## 1. Scope authorized

Implemented:

- five I1 source classes;
- five OR-08 rate types;
- original currency (no FX);
- validity observation;
- append-only `versionIdentity` with HTTP 409 on duplicate;
- amount excluded from identity;
- supplier owns the rate; supplier identity is not the rate identity;
- sidecar persist to `f2_rate_identities`;
- existing GET/PUT overlay routes;
- mixed C4 parent-row lookup for overlay attachment on full-schema (H-112 class);
- operator UI for those overlay fields on the existing suppliers page;
- focused tests and full-schema Dev/Test live validation.

Not in this grant and **not implemented:** overlap resolution / winner / preferred / ranking; freeze-on-send / CostSheetVersion snapshots; expired-rate live-proposal policy; public-for-sale approval; FX conversion; promotion of mixed C4 `SupRate` (unit type, amount, `preferredInConflict`); overlay-versus-mixed precedence.

---

## 2. Requirements used

Authoritative names and contracts reused from:

- H-113 closure matrix (overlay-only subset);
- F2-I1 catalogues (`SUPPLIER_RATE_SOURCE_CLASSES`, `SUPPLIER_RATE_TYPE_KEYS`);
- F2-I6 GET/PUT `/v1/suppliers/:supplierId/rates/:rateId/commercial-facts` and costing observation GET;
- sidecar `f2_rate_identities` / `writeRateIdentity` / `hydrateF2CommercialFacts`;
- existing `supplier:read:supplier` / `supplier:write:supplier` and route 401 guard;
- H-112 dual-environment model and mixed-SQL lookup pattern.

No replacement terminology was introduced. Persistence observability `f2FactsPersistenceMeta` was added to the overlay GET/PUT response using the same field already used by Account/RFP/Programme facts. That is not a commercial field.

---

## 3. Files changed

| Path | Change |
| --- | --- |
| `apps/api/src/commercial-facts/rate-identity.ts` | Mixed parent lookup; `persistence` meta on GET/PUT |
| `apps/api/src/commercial-facts/entity-lookup.ts` | `lookupSupplier` / `lookupRate` (mixed SQL first when durable; process-local on bounded sidecar-only) |
| `apps/api/src/persistence/pg-repository.ts` | `getSupSupplierById` / `getSupRateById`; `mapSupRateRow` extracted |
| `apps/web/src/lib/commercial-facts-api.ts` | Overlay client, catalogues, append payload helper, 409/403 mapping |
| `apps/web/src/components/commercial/RateIdentityCommercialFactsPanel.tsx` | Overlay-only panel |
| `apps/web/src/components/commercial/RateIdentityOverlayHost.tsx` | Load/append host |
| `apps/web/src/app/commercial/suppliers/page.tsx` | Panel on existing rate rows; mixed C4 labelled non-F2 |
| `apps/api/src/h114-rate-identity-overlay.test.ts` | Identity / version / persist / security |
| `apps/api/src/h114-mixed-sql-rate-lookup.test.ts` | Mixed vs bounded lookup |
| `apps/web/src/rate-identity-commercial-facts-panel.test.tsx` | UI field / exclusion tests |
| `docs/governance/h-114-rate-identity-overlay-implementation-report.md` | This record |

No migrations. No H-80 / H-81 / H-29 / I1–I11 / G-06-B / Gate B / F2-I12 / SoR / Production / UAT / booking / KPI / revenue / profit / FX / Path D / ingestion / H-91 residue deletion edits.

---

## 4. API contract

Unchanged paths:

- `GET /v1/suppliers/:supplierId/rates/:rateId/commercial-facts`
- `PUT /v1/suppliers/:supplierId/rates/:rateId/commercial-facts`
- `GET /v1/costing/sheets/:id/rate-identities` (observation only; `costSheetVersionSnapshotModified: false` retained)

PUT body remains `PutRateIdentityInput`: `versionIdentity`, `sourceClass`, `rateType`, `originalCurrency`, `validFrom`, `validTo`, optional season/source/verification/expiry/`itemIdentity`. Amount is ignored if sent.

GET/PUT now also return `persistence` (`recorded`, `mode`, `mixedSqlDurable`) plus the existing overlay flags:

- `overlapResolution: "none"`
- `fxProviderImplemented: false`
- `preferredInConflictAuthoritativeForF2: false`
- identity `amountIsNotIdentity: true`
- `legacyAmount` / `legacyCurrency` / `legacyUnitRateType` with `*AuthoritativeForF2: false`

Authz: unauthenticated **401**; `authorize()` deny **403** (`supplier:read:supplier` / `supplier:write:supplier` on the supplier resource). Duplicate `versionIdentity` **409** `version_identity_exists`.

---

## 5. Persistence contract

- Overlay rows write through existing `writeRateIdentity` → `f2_rate_identities`.
- Application PUT remains append-only; SQL `ON CONFLICT … DO UPDATE` is unchanged (historical immutability is the HTTP 409 rule, as H-113 recorded).
- Mixed C4 `sup_rates` is not rewritten by overlay PUT.
- Full-schema restart hydrates mixed C4 via existing `hydrateSupFromPostgres` and overlay via `hydrateF2CommercialFacts`.
- Overlay GET/PUT look up the mixed parent with `lookupSupplier` / `lookupRate` when `mixedSqlDurable` (full-schema). Bounded F2-DP-01 sidecar-only continues to use process-local collections and does **not** query mixed SQL.

Divergence is exposed, not reconciled: overlay `originalCurrency` vs mixed `legacyCurrency`.

---

## 6. UI scope

Minimal overlay panel on `apps/web/src/app/commercial/suppliers/page.tsx` for each existing mixed rate:

- view versions: source class, OR-08 type, supplier ownership, original currency, validity observation, `versionIdentity`;
- append a new `versionIdentity` (does not edit prior versions);
- distinguish overlay from legacy mixed C4 amount/unit/`preferredInConflict`.

Existing C4 calendar “Prefer …” buttons remain **legacy mixed C4** on that page. They were not added to the overlay panel and are not F2 identity controls.

Unresolved policies are displayed as text, not controls: overlap winner, live-proposal freeze, expired live-use, public-for-sale approval, FX, overlay-versus-mixed precedence.

Operator UI markup was verified by focused render tests. A live browser click-through of the suppliers drawer was not repeated after the full-schema API was shut down.

---

## 7. Test results

| Suite | Result |
| --- | --- |
| `apps/api` `h114-rate-identity-overlay.test.ts` | **6 passed** (valid identity; five source classes + five OR-08 types; invalid combinations 400; append + 409; sidecar persist/hydrate; 401/403) |
| `apps/api` `h114-mixed-sql-rate-lookup.test.ts` | **2 passed** (mixed SQL parent lookup; bounded sidecar-only stays process-local) |
| `apps/api` `f2-i6.c4-supplier-rate-identity-preview.test.ts` | **9 passed** (not weakened) |
| `apps/api` `h112-mixed-sql-facts-lookup.test.ts` | passed |
| `apps/api` `f2-dp-01.commercial-facts-persist.test.ts` | passed |
| Combined API run | **5 files, 22 tests passed** |
| `apps/web` `rate-identity-commercial-facts-panel.test.tsx` | **3 passed** |
| `apps/web` `account-commercial-facts-panel.test.tsx` | **3 passed** (no regression) |

Assertions cover: amount excluded from identity; original currency; supplier ownership ≠ identity id; legacy `SupRate` unit type remains compatibility; `overlapResolution: "none"`; no FX; no freeze field; unauthenticated 401; Alice finance 403.

---

## 8. TypeScript results

- `apps/api` `tsc -p tsconfig.json --noEmit` → **0 errors**
- `apps/web` `tsc -p tsconfig.json --noEmit` → **0 errors**
- No `as any`, `@ts-ignore`, or `@ts-expect-error` added. No tests disabled.

---

## 9. Full-schema live validation

Target: **`127.0.0.1:5435/eos_h112_full`** via `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP=true`, listen **`127.0.0.1:18116`**, `EOS_SEED_DEMO=false`.  
Bounded **`127.0.0.1:5432/eos`** was **not** migrated and was **not** used as the overlay write target.

Startup (first process):

- `database_migrated` `applied: []` `namedBranch: H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` `mixedSqlDurable: true`
- `f2_dp01_commercial_facts_hydrate` `rates: 0` then overlay write
- `api_listening` `http://127.0.0.1:18116`

| # | Check | Result |
| ---: | --- | --- |
| 1 | health | **200** |
| 2 | ready | **200** `applicationReady: true` |
| 3 | authenticated operator | Carol login **200**; overlay GET/PUT **200** |
| 4 | rate identity create/write | PUT overlay **200**; mixed C4 POST rate **201** `per_room_per_night` amount **250** USD |
| 5 | GET | **200** identities length 1 |
| 6 | persistence | sidecar `f2_rate_identities` row `rate_id=830d9201-…` `version_identity=1` `originalCurrency=TZS`; `persistence.mode=f2_dp01_sidecar` `recorded=true` `mixedSqlDurable=true` |
| 7–8 | restart / GET after hydrate | SIGTERM listen PID; second process `f2_dp01_commercial_facts_hydrate` **`rates: 1`**; GET **200** `versionIdentity=1` `originalCurrency=TZS` |
| 9 | duplicate versionIdentity | **409** `{"error":"conflict","reason":"version_identity_exists"}`; identities remain 1 |
| 10 | original currency | overlay **TZS**; mixed legacy **USD** `legacyCurrencyAuthoritativeForF2=false` |
| 11 | amount not identity | `amountIsNotIdentity=true`; `legacyAmount=250`; extra PUT `amount: 999` did not become identity |
| 12 | legacy SupRate compatibility | mixed `rateType=per_room_per_night` unchanged |
| 13 | no winner | `overlapResolution=none` `overlapWinnerInvented=false` `preferredInConflictAuthoritativeForF2=false` |
| 14 | no FX | `fxProviderImplemented=false` |
| 15 | no live-proposal freeze | GET body has no `freezeOnSend` |
| 16 | shutdown | Port **18116 released** after SIGTERM of listen PID |

Authz live: unauthenticated overlay GET **401**; Alice finance GET/PUT **403**.

Bounded catalog control after this action:

- `127.0.0.1:5432/eos`: `schema_migrations` **NULL** (124-only preserved); `f2_rate_identities` still the pre-existing residue row `91919191-…` / `originalCurrency=XXX` — **not** the H-114 live rate id.

Gate B `eos_gateb` and Production were not targeted.

---

## 10. Authentication / authorization evidence

- Route principal missing → **401** (focused test + live).
- Existing `authorize()` on supplier resource → Alice finance **403** on GET and PUT (focused test + live).
- No new permission invented. No Production IdP change.

---

## 11. Restart / hydration evidence

Second full-schema process:

```text
f2_dp01_commercial_facts_hydrate ... rates:1
GET /v1/suppliers/0eb981f7-…/rates/830d9201-…/commercial-facts → 200
originalCurrency=TZS versionIdentity=1 persistence.recorded=true
```

Process-local overlay cache was empty at process start; sidecar hydrate restored the row.

---

## 12. Duplicate 409 evidence

```text
HTTP=409
{"error":"conflict","reason":"version_identity_exists"}
```

Sidecar still one row for that `rate_id`. Original currency remained **TZS** (duplicate EUR body was refused).

---

## 13. Excluded policies — confirmation they were NOT implemented

| Excluded policy | Confirmation |
| --- | --- |
| A. Overlap / winner / preferred / ranking | No F2 winner logic. Overlay returns `overlapResolution: "none"`. C4 prefer UI remains legacy-labelled. |
| B. Live-proposal freeze | No freeze-on-send; costing observation flag unchanged; overlay has no freeze field. |
| C. Expired-rate live-proposal use | Validity observation only (`current`/`future`/`expired`). No block/permit rule. |
| D. Public-for-sale approval | No approval workflow or status added. |
| E. FX | No conversion. Original currency authoritative. |
| F. Legacy C4 SupRate | Unit types, amount, `preferredInConflict` remain compatibility. Mixed persist files were not rewritten by overlay PUT. |
| G. Supplier identity = rate identity | Overlay `identityId` ≠ `supplierId`; supplier code/name are ownership display only. |
| H. Overlay/mixed precedence | Both values returned; no invented winner. |

H-29 / I6 unresolved live-proposal semantics and G-06-B remain unchanged.

---

## 14. Bounded / full-schema environment separation

| Environment | Used in H-114? |
| --- | --- |
| Bounded F2 `127.0.0.1:5432/eos` (124-only) | **No writes, no migrate.** Control query only. |
| Full-schema `127.0.0.1:5435/eos_h112_full` | **Yes** — overlay live validation. |
| Gate B / Production | **Not used.** |

---

## 15. Findings

1. **Windows SIGTERM of the listen PID** (node owning `127.0.0.1:18116`) released the port and ended the `npx tsx` wrapper with **exit 1**, without `shutdown_started` / `shutdown_completed` log lines. Same class as H-112. This is **not** a Production drain and **not** a Windows SIGINT experiment.
2. Operator UI was verified by focused render tests, not a post-shutdown browser pass against a live API.

Neither finding invents commercial policy. Overlay operator capability on the authorized contract is in place.

---

## 16. Repository state

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | **EMPTY** |
| Porcelain lines | **488** (481 at H-114 start + this increment; prior dirty tree preserved) |

No commit. No push.

---

## 17. Classification

```text
H-114 RATE IDENTITY OVERLAY — COMPLETE WITH FINDINGS
NOT UAT
NOT PRODUCTION
NOT H-81
NOT H-80 EXIT
NOT EOS ADOPTION
IMPLEMENTATION = OVERLAY-ONLY OPERATOR CAPABILITY
NO FURTHER TRANCHE STARTED
```
