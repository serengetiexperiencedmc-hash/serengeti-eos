# H-116 — UAT data plan

> **Synthetic Dev/Test records only.**  
> **Do not insert automatically.** **Do not use Production, customer, employee, or live financial data.**  
> **Do not delete H-91 residue on `eos`.**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Catalog for UAT preparation (not a formal UAT designation):** `127.0.0.1:5435/eos_h112_full`.

IDs below are **logical labels**. Runtime UUIDs are assigned by the API on create. Record actual UUIDs in the evidence pack. Do not invent fixed UUIDs that collide with leftover H-112 rows; use unique **codes**.

---

## 1. Users / roles

| Label | Email | Role (seed) | UAT use | Secret source |
| --- | --- | --- | --- | --- |
| USER-CAROL | `carol.admin@sedmc.local` | `platform.admin` | Authorized operator for all IN SCOPE writes | `.env.example` `EOS_BOOTSTRAP_CAROL_PASSWORD` |
| USER-ALICE | `alice.finance@sedmc.local` | `finance.member` | Unauthorized for supplier overlay (expect 403) | `EOS_BOOTSTRAP_ALICE_PASSWORD` |
| USER-NONE | — | — | Unauthenticated 401 | — |

Tenant slug: `sedmc`. These are **Dev/Test bootstrap principals**, not Production identity.

Do not create additional roles in this plan. Do not copy passwords into UAT tickets.

---

## 2. Organization / account

| Label | Field | Synthetic value |
| --- | --- | --- |
| ORG-UAT-001 | legalName | `UAT Synthetic Client Ltd` |
| ORG-UAT-001 | organizationTypeKey | Use key `corporate` **via GET `/v1/crm/organization-types` id after hydrate** |
| ORG-UAT-001 | country | `United Kingdom` |
| ACC-UAT-001 | accountName | `UAT Synthetic Account` |
| ACC-UAT-001 | overlay accountType | `pco` |
| ACC-UAT-001 | overlay market | `united_kingdom` |

Do not infer type/market from the legal name. Mixed CRM `market` string (if required on create) is **not** F2 overlay market.

---

## 3. Opportunity

| Label | Field | Synthetic value |
| --- | --- | --- |
| OPP-UAT-001 | opportunityCode | `UAT-OPP-001` |
| OPP-UAT-001 | title | `UAT synthetic opportunity` |
| OPP-UAT-001 | paxCount | `12` |
| OPP-UAT-001 | nextAction.description | `UAT follow-up with buyer` |
| OPP-UAT-001 | qualification | Existing overlay contract only (no 250k/20%) |

Owner: Carol principal id from login/`/v1/me`.

---

## 4. RFP / Path B

| Label | Field | Synthetic value |
| --- | --- | --- |
| RFP-UAT-001 | rfpCode | `UAT-RFP-001` |
| RFP-UAT-001 | title | `UAT synthetic RFP` |
| RFP-UAT-001 | mixed source (create, if required) | `email` (legacy; **not** F2 SOURCE) |
| RFP-UAT-001 | overlay primarySource | `referral` |
| RFP-UAT-001 | overlay channel | `email` |
| RFP-UAT-001 | receivedAt | omit **or** `2026-09-10T08:00:00.000Z` (explicit only) |
| RFP-UAT-001 | clarificationStatus | `not_started` |
| PB-UAT-001 | categories | `["significant_contractual_commitments"]` |

SOURCE must remain `referral`. CHANNEL must remain `email`. Do not copy CHANNEL into SOURCE.

---

## 5. Programme

| Label | Field | Synthetic value |
| --- | --- | --- |
| PRG-UAT-001 | title | `UAT synthetic programme` |
| PRG-UAT-001 | days | one day, item title `UAT transfer` |
| PRG-UAT-001 | facts note | `UAT identifier-trace only` |

---

## 6. Supplier / mixed rate / overlay

| Label | Field | Synthetic value |
| --- | --- | --- |
| SUP-UAT-001 | supplierCode | `UAT-SUP-001` |
| SUP-UAT-001 | legalName | `UAT Synthetic Lodge` |
| SUP-UAT-001 | category | `accommodation` |
| SUP-UAT-001 | country | `TZ` |
| SUP-UAT-001 | defaultCurrency | `TZS` |
| RATE-UAT-001 (mixed C4) | rateCode | `UAT-SGL` |
| RATE-UAT-001 mixed | rateType | `per_room_per_night` (legacy unit; **not** OR-08) |
| RATE-UAT-001 mixed | amount | `250` |
| RATE-UAT-001 mixed | currency | `USD` |
| RATE-UAT-001 mixed | validFrom/To | `2026-01-01` / `2026-12-31` |
| RATE-UAT-001 overlay v1 | versionIdentity | `1` |
| RATE-UAT-001 overlay v1 | sourceClass | `direct_supplier_contract` |
| RATE-UAT-001 overlay v1 | rateType | `negotiated_contracted` |
| RATE-UAT-001 overlay v1 | originalCurrency | `TZS` |
| RATE-UAT-001 overlay v1 | itemIdentity | `UAT-SGL` |
| RATE-UAT-001 overlay v2 | versionIdentity | `2` |
| RATE-UAT-001 overlay v2 | originalCurrency | `EUR` (still no FX conversion) |

Amount **250 USD** remains mixed compatibility. Overlay identity currency is **TZS** then **EUR** on v2. Do not treat amount as identity.

---

## 7. Commercial facts maps (sidecar)

Expected sidecar tables after successful UAT writes (counts ≥ synthetic rows; leftover H-112 rows may also exist):

- `f2_account_facts`
- `f2_opportunity_facts`
- `f2_rfp_facts`
- `f2_path_b`
- `f2_programme_facts`
- `f2_rate_identities`

Do not require a clean-zero catalog unless a human authorizes reset of the disposable full-schema container.

---

## 8. Insertion policy

- Data is created **during UAT execution** by the named tester using Carol (except 401/403 scenarios).
- H-116 does **not** insert rows.
- Do not load spreadsheets from real operations.
- Do not copy H-91 `H91-TEST-*` residue from `eos` into UAT evidence as if it were UAT data.
- If a code collision occurs (`UAT-OPP-001` already used), suffix with a date (`UAT-OPP-001-20260921`) rather than overwriting.

---

## 9. Data handling

- Synthetic only.
- Redact tokens in evidence.
- Do not commit `.env` or live connection strings.
- After UAT, disposal of `eos_h112_full` remains a Dev/Test operational choice (`docker rm` per runbook) — not a Production rollback.
