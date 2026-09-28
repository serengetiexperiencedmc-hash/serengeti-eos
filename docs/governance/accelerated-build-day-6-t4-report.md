# H-111 Day 6 D6-T4 Report

> **`H-111 DAY 6 D6-T4`**  
> **`WEB TS2345 INVESTIGATION AND MINIMUM TYPE-SAFE REMEDIATION`**  
> **`EosSessionProvider.tsx LINES 206 AND 218`**  
> **`NO COMMERCIAL FACTS CHANGE`** · **`NO AUTHZ MODEL CHANGE`**  
> **`NO PERSISTENCE`** · **`NO SCHEMA`** · **`NO LIVE EOS`**  
> **`NO UAT`** · **`NO PRODUCTION`** · **`NO GATE B`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T16:05:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Slice:** Owner/POA **D6-T4** (this increment).  
**Prior:** Days 1–5 reports; D6-T1 verification **PASS**.

```text
DAY 6 D6-T4 STATUS = PASS — REMEDIATED
INCREMENT = EOS-7D-ACCEL
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

---

## 1. Authority

D6-T4 investigation of the two known web `TS2345` errors in `EosSessionProvider.tsx`, with a minimum type-safe fix only if justified. No new commercial facts, routes, permission model, persistence, schema, live eos, UAT, Production, Gate B, H-81, rate identity, G-08-B, commit, or push.

---

## 2. Initial repository state (before any D6-T4 edit)

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | EMPTY |
| Porcelain | **455** |

No reset, clean, stash, revert, or restore from HEAD.

---

## 3. Exact TS2345 errors (before fix)

```text
src/components/commercial/EosSessionProvider.tsx(206,43): error TS2345:
  Argument of type 'string' is not assignable to parameter of type 'SetStateAction<"carol.admin@sedmc.local">'.

src/components/commercial/EosSessionProvider.tsx(218,42): error TS2345:
  Argument of type 'string' is not assignable to parameter of type 'SetStateAction<"test-carol-not-for-prod">'.
```

Expressions: `setFormEmail(e.target.value)` and `setPassword(e.target.value)` in `DevLoginPanel`.

---

## 4. Root-cause investigation

| Item | Finding |
| --- | --- |
| Expected type | `SetStateAction<"carol.admin@sedmc.local">` / `SetStateAction<"test-carol-not-for-prod">` |
| Supplied type | `string` (`HTMLInputElement.value`) |
| Source of expected type | `useState(DEV_PREVIEW_LOGIN.email)` / `useState(DEV_PREVIEW_LOGIN.password)` with React initializer inference |
| Source of literals | `apps/web/src/lib/eos-session.ts` `DEV_PREVIEW_LOGIN … as const` |
| Runtime intent | Editable Dev/Test login fields; user may type any email/password |

`DEV_PREVIEW_LOGIN` is a documented Dev/Test credential object (`as const`). Using those literals as `useState` initializers without an explicit `string` type parameter freezes state to the credential literals. The `<input onChange>` contract is `string`. That mismatch is TS2345.

This is **not** caused by commercial-facts GET/PUT contracts, F2-DP-01 sidecar, SOURCE/CHANNEL, or Days 2–5 panel `canWrite` / PUT 403 mapping.

Login still calls `login(email: string, password: string)`. Authorization remains server `authorize()`. Fail-closed session hydrate/401 handling was not touched.

---

## 5. Whether the errors are genuinely pre-existing relative to Days 2–5

**Yes, relative to Days 2–5 commercial-facts work.**

Evidence:

- Last **committed** change to `EosSessionProvider.tsx`: `02dadf1` (2026-08-22), before H-111.
- Days 2–5 reports record that this file was **not modified** by those increments; web `tsc` already failed at these two lines from Day 2 onward.
- D6-T1 classified the same two errors as pre-existing and did not edit the file.

The **current dirty-tree** (protected, predates H-111 Days 2–5) already differed from HEAD: it introduced `DEV_PREVIEW_LOGIN` (`as const`) and switched the panel from `useState("carol.admin@sedmc.local")` / `useState("")` to `useState(DEV_PREVIEW_LOGIN.email)` / `useState(DEV_PREVIEW_LOGIN.password)`. That dirty-tree combination is what produced the literal `useState` types. Days 2–5 did not add that.

---

## 6. Whether they are related to Days 2–5

**Not caused by Days 2–5 commercial UI/API.** Days 2–5 **exposed** them by running web `tsc` as focused verification.

They are **in scope for D6-T4** because this slice names these two errors and allows a minimum type-safe correction of the **existing editable-form contract**, not a session-architecture rewrite.

---

## 7. Exact remediation

Two explicit type parameters on existing `useState` calls in `DevLoginPanel`:

```ts
const [formEmail, setFormEmail] = useState<string>(DEV_PREVIEW_LOGIN.email);
const [password, setPassword] = useState<string>(DEV_PREVIEW_LOGIN.password);
```

Runtime defaults remain `carol.admin@sedmc.local` / `test-carol-not-for-prod`. `DEV_PREVIEW_LOGIN` remains `as const`. No `as any`, `@ts-ignore`, or `@ts-expect-error`. No change to login/logout, `/v1/me`, token storage, or permissions.

---

## 8. Files changed

| File | Why |
| --- | --- |
| `apps/web/src/components/commercial/EosSessionProvider.tsx` | `useState<string>` on the two DevLoginPanel fields |
| `docs/governance/accelerated-build-day-6-t4-report.md` | This report |

**Not changed:** `eos-session.ts`, commercial-facts API/UI, tests, schema, migrations, `/v1/me`.

---

## 9. Tests executed and exact results

| Command | Result |
| --- | --- |
| `apps/web` Opportunity + RFP vitest | **24 passed / 2 files** (11 + 13) |
| `apps/api` D1 + RFP PUT + persist + mixed-SQL `--maxWorkers=1` | **25 passed / 4 files** (6+13+3+3) |
| `apps/api` startup + shutdown observability + trigger `--maxWorkers=1` | **30 passed / 3 files** (14+9+7) |

First parallel attempt of API `tsc`/vitest hit **JavaScript heap out of memory** (environment/tooling while several Node processes ran together). Sequential reruns **passed**. Not classified as a product regression.

Not run: workspace `npm test`, CI, Playwright, live eos, migrations.

---

## 10. Type-check results

| Check | Before D6-T4 | After D6-T4 |
| --- | --- | --- |
| `apps/web` `tsc -p tsconfig.json --noEmit` | FAIL — 2× TS2345 | **0 errors** |
| `apps/api` `tsc --noEmit` | 0 errors (D6-T1) | **0 errors** |

---

## 11. Regression assessment

| Check | Result |
| --- | --- |
| Opportunity panel | 11 passed |
| RFP panel | 13 passed |
| API focused commercial-facts | 25 passed |
| API TypeScript | 0 errors |
| Web TypeScript | **clean** |
| Unrelated files | not modified |
| Schema / migration / live DB | not touched |

---

## 12. Governance / scope compliance

Authentication and authorization semantics unchanged. Fail-closed session behaviour unchanged. F2-DP-01 sidecar-only boundary unchanged. No new SoR, SOURCE/CHANNEL change, commercial rule, booking/KPI/revenue/profit change, G-08-B, rate identity, H91 deletion, Windows SIGINT, UAT, Production, Gate B, `eos_gateb`, H-113, commit, or push.

H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Rate identity remains **STOPPED**.

This report is **not** H-80 exit evidence, adoption evidence, UAT evidence, Production evidence, or H-81 evidence.

---

## 13. Final classification

```text
PASS — REMEDIATED
```

The two TS2345 errors were dirty-tree `as const` + `useState` inference, not Days 2–5 commercial-facts contracts. D6-T4 applied the minimum `useState<string>` correction. Web `tsc` is clean. Focused Days 2–5 suites remain passing.

---

## Final repository state

| Item | Before D6-T4 | After D6-T4 |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Branch | `master` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **455** | **456** (455 + this report; `EosSessionProvider.tsx` was already dirty) |
| Commit / push | not performed | not performed |

**STOP.** D6-T4 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 6 D6-T4 report.**
