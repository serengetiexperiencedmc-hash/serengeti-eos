# GPTA-H-50 — F2-I5 C1 Account Type and Market Preview

> **`F2-I5 IMPLEMENTATION EVIDENCE — PREVIEW C1 OR-03 / OR-03-M`**  
> **`NOT UAT`** · **`NOT FULL C1 COMPLETION`** · **`NOT PRODUCTION READINESS`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / PERSISTENCE REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T17:06:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-49 historical bodies are **not rewritten**.

---

## Authorization

F2 remains authorized (H-44). F2-I1, I2, I3, I4 remain completed.

Closes the H-49 residual: preview C1 can represent distinct **PCO** and the approved **15-value market** independently of buyer/account type.

---

## Exact C1 preview path changed

Existing mixed CRM create/read (`POST/GET /v1/crm/accounts`) is **unchanged**. Mixed `crm/account.ts`, `crm/routes.ts`, persist, and kernel `CrmAccount` were **not** edited.

F2 OR-03 / OR-03-M are additive on the established commercial-facts sidecar:

* `GET/PUT /v1/crm/accounts/:id/commercial-facts`
* in-memory `f2FactsMemory(store).accounts`
* C2 observation: opportunity commercial facts include `c1Account` when `opportunity.accountId` is set

Durable SoR returns `f2_i5_in_memory_preview_only`.

---

## PCO representation

Canonical key: `pco`. Label: `PCO`. Distinct from `event_agency` / `Event Agency`. Not folded into legacy `DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` (`mice_agency` remains a legacy org-type key and is **not** a valid OR-03 value).

---

## Market representation

Canonical keys remain the I1 15-value catalogue. Labels include `South Africa` and `United Kingdom` (H-27 display “UK” = I1 `united_kingdom`). Market is not inferred from telephone, email, name, destination, or account type.

---

## Independent dimensions

`PCO + South Africa` and `PCO + UK` (`united_kingdom`) share account type and differ by market. `PCO + South Africa` and `Incentive House/Agency + South Africa` share market and differ by account type. No one-to-one mapping.

---

## Validation

Unsupported account types (`mice_agency`, `incentive_house`, `corporate`, free text) → `400` / `invalid_account_type`.  
Unsupported markets (`Kenya`, `Europe`) → `400` / `invalid_market`.  
Legacy `CrmAccount.market` (e.g. `"Europe"`) is preserved as non-authoritative (`legacyCrmMarketAuthoritativeForF2 = false`).

Keys and exact I1 labels are accepted. No extra market or buyer-type catalogue was created.

---

## C2/C3 compatibility

Commercial-facts sidecar was **not** duplicated. Opportunity facts still own qualification / follow-up; RFP facts still own SOURCE/CHANNEL. `c1Account` is an observation pointer only.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/account.ts` | **Created** — GET/PUT account commercial facts |
| `apps/api/src/commercial-facts/memory.ts` | Additive `accounts` map |
| `apps/api/src/commercial-facts/routes.ts` | Additive `/v1/crm/accounts/:id/commercial-facts` |
| `apps/api/src/commercial-facts/service.ts` | Additive `c1Account` on opportunity facts view |
| `apps/api/src/f2-i5.c1-account-market-preview.test.ts` | **Created** |

**Not changed:** `crm/account.ts`, `crm/routes.ts`, persist, schema, migrations, Gate B, `evaluateCommercialApprovalGate`, `server.ts`.

---

## Tests executed

Narrow I5:

```text
npx vitest run src/f2-i5.c1-account-market-preview.test.ts
```

**1 file, 8 tests passed.** Duration 5.64s.

C1 regression:

```text
npx vitest run --maxWorkers=1 src/c1.accounts-notes-tasks.test.ts src/c1.organizations.test.ts
```

**2 files, 20 tests passed.** Duration 8.87s.

I2 / I3 / I4 / C8:

```text
npx vitest run --maxWorkers=1 src/f2-i2.commercial-facts.test.ts src/f2-i3.path-b-c7-preview.test.ts src/f2-i4.in-memory-generation-path-b.test.ts src/c8.proposal.test.ts
```

**4 files, 19 tests passed.** Duration 10.85s.

A combined six-file run without `--maxWorkers=1` OOM’d the worker; that is an environment limit, not an I5 product failure. Serial reruns passed.

Automated tests are **not** UAT.

---

## Remaining residuals

* Legacy `DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` still lack PCO and are not OR-03.
* Legacy `CrmAccount.market` remains free-text and is not OR-03-M.
* Durable CRM does not persist F2 account type / market.
* Mixed `evaluateCommercialApprovalGate` 250k/20% remains.
* C4 OR-08 rate identity, C6 costing snapshot, and C10 KPI pack remain unused on preview.

---

## Next increment (from I5 evidence)

**F2-I6 — in-memory C4 / OR-08 supplier-rate identity** on the preview costing/rate path, additive, no persist/schema.

Rationale: preview C1 OR-03 / OR-03-M is now observable. The next unused I1 identity contract on the C-spine is supplier-rate identity. Do not globally replace mixed CRM organization types in this next increment.

---

## Governance status

```text
GPTA-H-50 STATUS = F2-I5 C1 ACCOUNT TYPE AND MARKET PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
SCOPE = C1 / IN-MEMORY CRM PREVIEW / DEV-TEST ONLY

PCO = DISTINCT OR-03 VALUE
MARKET = 15-VALUE OR-03-M CATALOGUE
ACCOUNT TYPE AND MARKET = INDEPENDENT
LEGACY CRM MARKET / ORG TYPES = RETAINED, NON-AUTHORITATIVE FOR F2

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
