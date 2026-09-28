# H-203 — Commercial Core: Programme / RFP / Finance Development

> **OWNER/POA DIRECTION.** Production infrastructure implementation is on **HOLD**. Immediate priority is **software development** of Programme Building, RFP Management, and Finance as one connected commercial workflow.  
> H-154 through H-202 were inspected and **not rewritten**. Hosting direction from H-202 (SEDMC-owned/controlled local infrastructure) is **preserved** and **not implemented**.

**Date / time:** 2026-09-27 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged; no commit)  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of first H-203 increment:** 725 (H-202 end)  
**Porcelain at start of proposal-preparation continuation:** 739  
**Porcelain at start of Commercial Decision Gate (governance-only):** 742  
**Porcelain at start of authorized commercial policy implementation:** dirty worktree preserved (no commit)  
**Porcelain at start of Dev/Test UAT and integrity hardening:** 750  
**Porcelain at start of client-issued proposal governance gate:** 750  
**Porcelain at start of A–J client-issue decision closure:** 750  
**Porcelain at start of Client-Issue Foundation implementation (this increment):** 750

```text
H-203 STATUS = AUTHORIZED COMMERCIAL POLICY ENCODED IN DEV/TEST — COMMERCIAL SYSTEM NOT COMPLETE
PRODUCTION INFRASTRUCTURE IMPLEMENTATION = HOLD
SOFTWARE DEVELOPMENT PRIORITY = APPROVED
Immediate commercial scope = Programme / RFP / Finance / internal working draft / authorized commercial policy / internal issued-proposal identity
Hosting direction (H-202) = SEDMC-owned/controlled local infrastructure — SELECTED, NOT IMPLEMENTED
Production infrastructure untouched: YES
Production deployment: NONE
productionReady = false
P01 = NOT GRANTED
H-81 = NOT STARTED
Internal client PDF (DOC-*) = GENERATED IN DEV/TEST ONLY — NOT CLIENT DELIVERY
Email / SMTP / dispatch / client access = NOT IMPLEMENTED AND NOT AUTHORIZED
CLIENT-FACING PROPOSAL AUTHORIZATION = STILL BLOCKED FOR EMAIL/DISPATCH/CLIENT ACCESS
CLIENT-FACING COMMERCIAL CONFIDENTIALITY = AUTHORIZED AND ENCODED AT DOMAIN/API/VIEW-MODEL BOUNDARY
This increment = CLIENT-ISSUE FOUNDATION (internal identity/snapshot only; PDF/email/dispatch STILL NOT AUTHORIZED)
Durable internal chain (Dev/Test verified) = Final Programme → ISS-* → DOC-* → PDF artifact (§13–§20)
External delivery / email / SMTP / dispatch / client access = NOT AUTHORIZED FOR PRODUCTION
Dev/Test DEL/DLA mock delivery = IMPLEMENTED (§23) — NOT REAL EMAIL
Production Delivery Readiness & Provider Gate = §24 — PRODUCTION STILL NOT AUTHORIZED
Recipient PII Remediation & Production Schema Design = §25 — OPTIONS RECORDED
Recipient PII architecture = §26 OPTION B SELECTED — SCHEMA/PII IMPLEMENTATION AND SEND STILL NOT AUTHORIZED
Recipient-PII privacy/legal controls = §27 PROPOSED OWNER/CD DIRECTION RECORDED — D1–D4 DPO VALIDATION STILL REQUIRED
DPO/Owner privacy decision pack = §27.7 OWNER/POA D1–D7 RECORDED
H-131 §13 = §27.8 ISSUED FOR OPTION B RECIPIENT-PII
D1–D4 Owner/POA determinations = §27.9 CLOSED — DPO/INFRA VALIDATION OUTSTANDING
DPO/privacy + infrastructure validation pack = h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md — D1–D4 DPO/INFRA OUTSTANDING; D6 §13 ISSUED
Option B implementation design = §27.10 / h-203-production-recipient-pii-implementation-design-specification.md — PREPARED; EXECUTION NOT AUTHORIZED
Option B implementation-design consistency audit = §27.11 / h-203-production-recipient-pii-implementation-design-consistency-audit.md — PASS WITH OPEN VALIDATION DEPENDENCY
Specialist-validation handoff = §27.12 / h-203-production-recipient-pii-specialist-validation-handoff.md — REVIEW-READY; DPO/INFRA OPEN
Specialist-validation gate freeze audit = §27.13 / h-203-production-recipient-pii-specialist-validation-gate-freeze-audit.md — PASS; GATE FROZEN; SPECIALIST EVIDENCE REQUIRED
Specialist review package = §27.14 / h-203-production-recipient-pii-specialist-review-package.md — HANDOFF FOR DPO/INFRA; EVIDENCE STILL REQUIRED
Specialist-validation execution register = §27.15 / h-203-production-recipient-pii-specialist-validation-execution-register.md — EXECUTION GATE OPEN; SPECIALIST EVIDENCE REQUIRED
Specialist-validation requests = §27.16 / h-203-production-recipient-pii-specialist-validation-requests.md — ISSUED; AWAITING DPO/INFRA EVIDENCE
```

This increment does **not** provision cloud resources, create Production servers/databases, continue infrastructure-provider evaluation, or produce infrastructure architecture documents.

---

## 1. Owner/POA direction recorded

| Decision | H-203 record |
| --- | --- |
| Production infrastructure implementation | **HOLD** — SEDMC does not yet have the physical plant to host Production EOS |
| Provisioning / cloud resources / Production servers or databases | **Not performed** |
| Infrastructure-provider evaluation | **Not continued** |
| Infrastructure architecture documents this cycle | **Not produced** |
| Existing infrastructure governance history (H-181–H-202) | **Preserved; not rewritten** |
| Current hosting direction | **SEDMC-owned/controlled local infrastructure** (H-202) — selected, not in place |
| When infrastructure is revisited | When SEDMC has physical infrastructure available |
| Immediate priority | **Software development** |

---

## 2. Commercial software priority

Focus is the three core commercial departments as **one connected workflow**:

1. Programme Building  
2. RFP Management  
3. Finance  

Desired lifecycle (governance target; not all statuses exist as governed RFP stages):

RFP received → requirements captured → programme created → programme designed → supplier services/costs added → client pricing built → margin / commercial review → proposal prepared → RFP submitted → revision / negotiation → won / lost → if won, programme becomes the operational commercial source.

---

## 3. Repository audit findings (what the code actually did before this increment)

### 3.1 Programme (C5)

| Topic | What exists |
| --- | --- |
| Entity/model | `PrgProgramme`, `PrgDay`, `PrgItem`, `PrgProgrammeVersion` in `@sedmc/kernel` |
| API | `/v1/programmes` create/list/get/by-rfp, days, items, patch, numeric versions |
| UI | `/commercial/programme?rfpId=` Programme Builder |
| Itinerary/day structure | Ordered `prg_days` (`dayNumber`, `title`, `location`, `calendarDate`, `sortOrder`) |
| Services/components | `prg_items` with `sortOrder`, optional supplier label/id |
| Accommodation / activities / transport / flights / meals / events | Item **types** existed: `accommodation`, `activity`, `experience`, `transport`, `flight`, `meal`, `meeting_event`, `other`. UI did **not** send `itemType`. No day-level meal/rooming flags |
| Excursion / guide / equipment | **Not** in the pre-H-203 type list |
| Rooming | **Not** a programme entity |
| Inclusions/exclusions | **Not** a programme entity |
| Programme versions | Numeric snapshots (`prg_programme_versions`) with `{ title, dayCount, itemCount, destinations }` — **not** Draft/Revised/Client/Final labels |
| Status/lifecycle | `draft \| active \| archived` only |
| Costing / client pricing | Separate C6 cost sheet linked by `programmeId`; items were not linked to cost lines |
| Notes | `internalNotes`, `clientNotes` |
| Documents/attachments | Commercial documents on RFP, not programme-native |
| Supplier relationships | Optional `supplierId` / `supplierLabel` on items; no product catalogue required |
| Validation | Title required; quantity ≥ 0; one programme per RFP; duplicate day numbers rejected |
| Tests | `c5.programme.test.ts`, kernel `buildProgrammeCode` |

Create Programme **required** an RFP. One programme per RFP (409 `programme_exists_for_rfp`). Creating a programme from `intake` advances RFP to `programme`.

### 3.2 RFP (C3)

| Topic | What exists |
| --- | --- |
| Entity/model | `RfpRecord` + `RfpVersion` |
| API | `/v1/rfps` CRUD, stage transitions, versions |
| UI | `/commercial/rfps`, `/commercial/rfps/[id]` with “Open Programme Builder” |
| Client/account | `organizationId` via Opportunity; CRM organization is the account |
| Requirements | `requirementsText`, `programmeType`, notes, source, `receivedAt` |
| Destination / dates / pax / budget / deadline | `destinations`, `travelDates`, `paxCount`, `budgetMin`/`budgetMax`/`currency`, `slaDueAt` |
| Accommodation / programme / supplier requirements | Free text / type fields only — **not** structured requirement rows |
| Clarification/questions | **Not** a dedicated entity |
| Proposal versions | Separate proposal module + RFP numeric versions |
| Submission status | RFP stages: `intake \| programme \| costing \| approval \| proposal \| sent \| closed` |
| Win/loss status | **Not** on RFP. Opportunity stages include `won` / `lost` |
| Links to Programme | `PrgProgramme.rfpId` (mandatory); GET by-rfp |
| Links to Finance/costing | Cost sheet `rfpId` + `programmeId` |

### 3.3 Finance

| Topic | What exists |
| --- | --- |
| Programme costing | C6 `CostSheet` / `CostLineItem` — supplier `unitCost` × `quantity` = `lineTotal`; `sellPrice` override or `markupPercent`; else sell = cost |
| Formula | `computeCostTotals` — **governed in kernel**; `marginAmount = sellPrice - totalCost`; `marginPercent` of sellPrice |
| Gross margin / markup | Present on cost sheet; **not** Owner-approved commercial policy beyond this code |
| Fees / taxes / commissions / FX | **Not** implemented as commercial rules. Currency is a string (default USD) |
| Payment schedules / deposits / balances / invoices | Booking finance (`/commercial/finance`) — quotes/invoices/payments/reconciliation for **bookings**, not programme costing |
| Financial approval | Commercial approval requests on RFP, plus booking payment SoD |
| Tests | `c6.costing.test.ts`, kernel costing tests |

**Do not assume commercial correctness** of existing fields. `computeCostTotals` is what the code does; it is not an Owner/Commercial Director policy document.

### 3.4 Integrated model (pre-H-203)

Account (`crm_organizations`) → Opportunity → **RFP** → **Programme** (1:1) → Days → Items  
Programme → **Cost sheet** (1:1) → Lines (not linked to items) → totals / optional sell override  
RFP → Proposal (separate module)  
Win/lost → Opportunity, not RFP stage.

---

## 4. Implementation performed (Dev/Test only)

Smallest coherent slice. Did **not** finish EOS. Did **not** invent rates, FX, KPI baselines, or historical profit.

### Programme Builder

- Commercial version labels: `draft | revised | client | final` (distinct from `draft|active|archived` status and numeric snapshots).
- **Final** programmes reject day/item/header mutations (`programme_version_locked`) until the label is changed (e.g. to `revised`). Labelling **final** creates a numeric snapshot.
- Item types extended: `excursion`, `guide`, `equipment`.
- Optional day `description` and calendar date on add-day UI.
- Builder UI sends `itemType`; shows originating RFP, commercial version, costing status.
- Date range validation (`start <= end`); ISO date-only check.

### Programme ↔ RFP

- Existing mandatory `rfpId` preserved; still one programme per RFP.
- `GET /v1/rfps/:id/commercial-workspace` returns RFP + programme header + financial summary without duplicating RFP requirements.
- RFP detail UI shows programme / costing / proposal status next to the original request fields.

### Programme costing / Finance

- Optional `programmeItemId` on cost lines (must belong to the same programme).
- `financialSummary` on cost sheets: `supplierCost`, `clientSellingPrice`, `grossProfit`, `grossMarginPercent`, `currency`, `financialStatus`, `formula: kernel.computeCostTotals`, `sellPriceSource`.
- `GET /v1/costing/sheets/by-programme/:programmeId/summary`.
- Reject negative quantity / unit cost.
- Finance page lists programme cost sheets separately from booking invoices.

### RFP workflow

- **No new RFP stages.** Won/lost remain on Opportunity. Workspace records `wonLostRecord: "opportunity"`.

### Schema

- Migration `126_h203_commercial_core_programme_rfp_finance.sql` (Dev/Test additive).
- **No additional migration** for proposal preparation (would risk encoding unapproved commercial rules).

### Proposal preparation (internal working draft)

Read-only assembly of existing sources of truth. **Not** a new RFP stage and **not** the C8 generate/send path (`canGenerateProposal` still requires commercial approval and remains unused here).

Presented workflow: **RFP → linked Programme → Programme version/label → Programme content → Programme cost sheet → existing financial summary → Proposal Working Draft**.

| Topic | What was implemented |
| --- | --- |
| Kind | Derived `internal_working_draft`. Explicit WORKING DRAFT / PREPARATION state. `clientIssued: false`. |
| API | `GET /v1/rfps/:id/proposal-preparation` |
| Workspace | `GET /v1/rfps/:id/commercial-workspace` includes `proposalPreparation` (kind, readiness, unresolved required count) |
| Programme version | Live `commercialVersionLabel` plus latest numeric `PrgProgrammeVersion` when one exists |
| Days/items | Existing programme detail; RFP `requirementsText` is referenced, not copied |
| Finance | Existing `financialSummary` copied as stored (`formula: kernel.computeCostTotals`). **No new formula.** |
| Missing inputs | Unresolved tax/commission/FX/markup/margin-floor/deposit/inclusions/night-count policy is listed. Values are **not invented**. |
| Won/lost | Still Opportunity. No `proposal_draft` / `proposal_final` / `won` / `lost` RFP stages. |
| `final` lock | Unchanged. Preparation GET remains available while writes still 409. |
| UI | `/commercial/rfps/[id]/proposal-preparation` plus links from RFP detail, Programme Builder, and Finance programme sheets |
| Deferred | PDF, email, client dispatch, proposal approval workflow, C8 generate/send |

Readiness is `incomplete` when programme or cost sheet is missing; otherwise `internal_working_draft`. That readiness is **not** authorization to issue a client proposal.

Proposal-preparation files (this continuation):

- `packages/kernel/src/proposal-preparation.ts` (+ test, barrel + subpath export)
- `apps/api/src/commercial/workspace.ts`
- `apps/api/src/rfp/routes.ts` (`GET /v1/rfps/:id/proposal-preparation`)
- `apps/api/src/persistence/programme-repository.ts` (`listProgrammeVersions`)
- `apps/web/src/lib/rfp-api.ts`
- `apps/web/src/app/commercial/rfps/[id]/proposal-preparation/page.tsx`
- Links on RFP detail, Programme Builder, Finance
- `apps/api/src/h203-commercial-core-programme-rfp-finance.test.ts`

---

## 5. Business rules still requiring Owner / Commercial Director decisions

The inventory below remains unresolved. The **binding register** (decision required, current behaviour, technical vs authoritative, consequence of leaving unresolved) is **§9 Commercial Decision Gate — Required Before Client-Facing Proposal**. This section does **not** approve any of those rules.

1. Whether programme **nights** = days − 1 (not computed).  
2. Room-night, room count, guide ratios, vehicle ratios.  
3. Tax, commission, fee, and markup **policy** (code has optional markup % and sell override only).  
4. Approved gross-margin floor (code default 20% is a technical default, not an Owner policy).  
5. FX source and whether multi-currency lines may mix on one sheet.  
6. Whether `final` lock is the correct commercial rule, and whether `client` should also lock.  
7. Whether RFP should gain won/lost stages vs remaining on Opportunity.  
8. Mapping of desired lifecycle steps 1–10 onto existing RFP stages.  
9. Deposit / milestone / payment-schedule rules for **programme** (vs booking invoices).  
10. Inclusions/exclusions, rooming lists, structured RFP requirement rows.  
11. Whether sell price may equal supplier cost when no override/markup is set (current code does this).  
12. Responsible commercial user vs `createdByPrincipalId` / RFP `assignedPrincipalId`.

---

## 6. Tests executed

Dev/Test only. Passing tests do **not** mean the commercial system is complete.

### First increment (Programme / RFP / Finance)

| Suite | Result |
| --- | --- |
| `@sedmc/kernel` programme / costing / commercial-document | 11 passed |
| `@sedmc/db` H-135 / H-136 | 10 passed |
| `@sedmc/api` H-203 + C5 + C6 | 13 passed |
| `@sedmc/api` H-112 / H-135 / H-136 / H-137 / H-145 last-file updates | 20 passed |

### Proposal-preparation continuation (2026-09-26)

| Suite | Result |
| --- | --- |
| `@sedmc/kernel` `proposal-preparation` / `proposal` / `costing` | 11 passed |
| `@sedmc/kernel` programme + proposal-prep + proposal + costing | 14 passed |
| `@sedmc/api` `h203-commercial-core-programme-rfp-finance.test.ts` | 5 passed |
| `@sedmc/api` C5 programme + C6 costing + C8 proposal | 14 passed |

H-203 API slice now also covers: RFP with linked programme loads proposal-preparation context; programme/version/label resolved; programme items present; cost sheet + existing financial summary reused (`kernel.computeCostTotals`, figures match `/summary`); unresolved policy gaps surfaced (no invented tax/20% floor); no new RFP won/lost or `proposal_draft` stages; `final` lock still 409 on writes; incomplete readiness without programme or cost sheet.

---

## 7. Remaining gaps (deliberately deferred)

- Client-issued proposal generation; PDF; email; dispatch  
- C8 generate/send/accept as a client-facing document workflow  
- Supplier/product master catalogue  
- Structured RFP requirement objects; Q&A  
- Rooming, inclusions/exclusions  
- Booking-invoice merger with programme costing  
- Statutory accounting, tax engines, revenue recognition  
- Production hosting implementation  
- UAT / Production readiness claims  

Internal proposal preparation is a **working draft only**. It does **not** make the commercial system complete and does **not** make EOS production-ready.

---

## 8. Confirmations

| Item | Record |
| --- | --- |
| Production infrastructure untouched | **YES** |
| Production deployment | **NONE** |
| External data / client / supplier contact / email | **NONE** |
| Invented supplier/FX/KPI/history | **NONE** |
| Invented tax/commission/markup/margin-floor/FX/deposit rules | **NONE** — surfaced as unresolved gaps |
| New RFP stages / won-lost on RFP | **NONE** |
| New migration this continuation | **NONE** |
| Commit / push | **NONE** |
| Dirty worktree preserved | **YES** |
| `productionReady` | **false** |
| Dev/Test only | **YES** |
| Commercial Decision Gate increment (2026-09-26) | **Governance-only.** No application, schema, API, formula, lock, RFP-stage, or Production change. |
| Client-facing proposal authorization | **BLOCKED** pending §9 decisions **and** a subsequent implementation authorization |

---

## 9. Commercial Decision Gate — Required Before Client-Facing Proposal

**Status:** OPEN / BLOCKING.  
**Nature of this increment:** governance register only. No commercial rule was implemented, changed, or approved here.

### 9.1 Scope statement

| Item | Record |
| --- | --- |
| Internal proposal preparation | **Implemented in Dev/Test** as a read-only working draft (`internal_working_draft`) |
| Financial figures | Working draft **reuses** the existing cost-sheet `financialSummary` (`formula: kernel.computeCostTotals`). No second formula. |
| Client-issued proposal | **Not issued.** Preparation `clientIssued: false`. Readiness `internal_working_draft` is not authorization to send. |
| PDF generation | **Deferred.** Not implemented. Not authorized by this gate. |
| Email / client dispatch | **Deferred.** Not implemented. Not authorized by this gate. |
| Production | **Untouched.** No deploy, provision, credentials, DNS, or hosting change. |
| `productionReady` | **false** |
| Client-facing proposal authorization | **BLOCKED** until (a) the decisions in §9.3–§9.5 are resolved in an Owner/Commercial Director governance record, **and** (b) a subsequent increment is explicitly authorized to implement the client-facing proposal/PDF/email path. |

This gate does **not** authorize contributors to encode any of the unresolved items as schema defaults, API-required values, or “obvious” commercial policy.

### 9.2 Special requirement — 20% floor is not company policy

**Any existing 20% floor or default visible in technical implementation is NOT an approved commercial policy.**

Inspected records (H-145, H-147, H-148, H-149, H-150, H-153, H-154, GPTA-H-111 and related F2 artefacts) state that the legacy **250k / 20%** qualification/approval threshold is **NOT AUTHORIZED** as an F2 commercial rule and must not be treated as a substituted number. Separately, cost-sheet creation uses `marginFloorPercent: input.marginFloorPercent ?? 20` in Dev/Test code. That `?? 20` is a **technical default in software**, not an Owner or Commercial Director decision.

| Must not be done | Why |
| --- | --- |
| Treat `marginFloorPercent ?? 20` as SEDMC’s approved margin policy | No authoritative governance record approves 20% as company policy |
| Treat legacy 250k/20% as the client-proposal pricing rule | Repeatedly recorded as **NOT AUTHORIZED** / **legacy** |
| Copy 20% into a migration, proposal PDF, or “required company margin” copy | Would launder a technical default into an apparent approved rule |
| Approve, change, or remove the floor in code under this gate | This increment does not decide the commercial answer |

**Decision still required (item 2 below):** whether a 20% margin floor is approved, changed, or removed. Until that decision exists in an Owner/Commercial Director record, future contributors **must not** mistake the technical default for an approved company rule.

### 9.3 Client-facing pricing

#### 1. Markup versus margin policy

| Field | Record |
| --- | --- |
| Decision required | Whether client price is set by **markup on cost**, by a **target margin on selling price**, by a **manual selling-price override**, or by another Owner-approved method — and which of those may appear on a client proposal. |
| Why it matters | A client-facing proposal must state a selling price. Markup % and margin % are different economics. Publishing one as if it were the other would misstate the commercial offer. |
| Current system behavior | `computeCostTotals`: if `sellPrice` override is stored, use it; else if `markupPercent` is stored, `sellPrice = totalCost × (1 + markupPercent/100)`; else `sellPrice = totalCost`. Gross margin is then `(sellPrice − totalCost) / sellPrice`. Optional `markupPercent` is a cost-sheet field, not a company policy engine. |
| Authoritative or technical | **Technical.** Code behaviour is not an Owner-approved pricing policy. |
| If left unresolved | Client-facing generation remains **blocked**. Internal draft may show whatever selling price is already stored; it must not present markup or margin as an approved commercial rule. |

#### 2. Whether a 20% margin floor is approved, changed, or removed

| Field | Record |
| --- | --- |
| Decision required | Approve 20% as company policy, replace it with another floor, or remove any floor from commercial operations — **explicitly**. |
| Why it matters | A client proposal and any “below floor / cannot submit” gate would assert a company minimum. Using an unapproved 20% would invent SEDMC pricing policy. |
| Current system behavior | New cost sheets default `marginFloorPercent` to **20** when the caller omits it (`?? 20`). `marginMeetsFloor` and commercial-approval request gating compare computed margin to that stored number. This is independent of the legacy F2 **250k/20%** path, which governance already records as **not authorized**. |
| Authoritative or technical | **Technical default only.** Not approved company policy. See §9.2. |
| If left unresolved | Client-facing generation remains **blocked**. Do not show 20% on a client document as “company minimum.” Do not hard-code a replacement number. |

#### 3. Whether client selling price may equal supplier cost when no override exists

| Field | Record |
| --- | --- |
| Decision required | Whether a proposal may be issued when selling price equals supplier cost (zero gross profit), or whether an override/markup is mandatory before client release. |
| Why it matters | Equality is commercially a zero-margin offer. Issuing it without a policy is an implicit discount/at-cost decision. |
| Current system behavior | When neither `sellPrice` nor `markupPercent` is stored, `computeCostTotals` sets sell price equal to supplier cost (`sellPriceSource: equalsSupplierCost`). Internal preparation surfaces this as a gap; it does not invent a markup. |
| Authoritative or technical | **Technical** (existing formula fallback). Not an approved “we sell at cost” policy. |
| If left unresolved | Client-facing generation remains **blocked**. Internal draft may display the stored equality and must label it as existing formula behaviour, not policy. |

#### 4. Tax treatment

| Field | Record |
| --- | --- |
| Decision required | Whether proposals are tax-exclusive or tax-inclusive; which taxes apply (e.g. VAT); who owns the calculation; whether tax is shown as a line, a rate, or omitted. |
| Why it matters | A client-facing price without a tax rule can under- or over-state the amount due. |
| Current system behavior | No programme/proposal tax engine. Currency is a string on the cost sheet. Tax is not computed. |
| Authoritative or technical | **Absent.** Not a hidden default. |
| If left unresolved | Client-facing generation remains **blocked**. Do not invent VAT or other tax on the draft. |

#### 5. Commission and/or commercial fee treatment

| Field | Record |
| --- | --- |
| Decision required | Whether agent commission, handling fees, or other commercial fees are included in cost, added to sell price, shown separately, or excluded from programme proposals. |
| Why it matters | Fees change the client total and the apparent margin. |
| Current system behavior | No commission/fee policy on programme costing. Optional cost-line categories exist; they are not a commission model. |
| Authoritative or technical | **Absent.** |
| If left unresolved | Client-facing generation remains **blocked**. Do not invent commission percentages. |

#### 6. FX source, conversion timing, and rounding treatment

| Field | Record |
| --- | --- |
| Decision required | Source of rates; whether multi-currency lines may mix on one sheet; when conversion is applied (quote date vs travel date vs invoice); rounding rules; which currency the client sees. |
| Why it matters | A client total in one currency is an FX position. Guessing a rate would invent a commercial number. |
| Current system behavior | Cost sheet `currency` is a stored string (often default USD). No FX provider, no conversion, no rounding policy beyond existing two-decimal rounding inside `computeCostTotals`. Prior governance repeatedly records FX providers as **not authorized**. |
| Authoritative or technical | **Technical storage of a currency code.** Not an FX policy. |
| If left unresolved | Client-facing generation remains **blocked**. Do not convert or invent rates. |

### 9.4 Programme / proposal rules

#### 7. Whether Programme label `client` should lock content in the same manner as `final`

| Field | Record |
| --- | --- |
| Decision required | Whether `commercialVersionLabel: client` must reject day/item/header writes (`programme_version_locked`) as `final` does, or remain editable. |
| Why it matters | A client-facing document implies a frozen itinerary. If `client` does not lock, the issued programme can still change. If it does lock, operations need a revision path. **This gate does not decide that `client` should lock.** |
| Current system behavior | Only `final` locks (`programmeIsCommerciallyLocked` is `label === "final"`). `client` is a label only. Writes under `final` return 409 until the label is changed (e.g. to `revised`). |
| Authoritative or technical | **Technical implementation of `final` lock only.** Not an approved rule that `client` should (or should not) lock. |
| If left unresolved | Client-facing generation remains **blocked**. Do not extend lock to `client` without a later authorization. |

#### 8. Deposit requirements

| Field | Record |
| --- | --- |
| Decision required | Whether a programme proposal must state a deposit (amount, percent, due date, refundability). |
| Why it matters | Deposit terms are a client commercial commitment. Inventing them would create false contract language. |
| Current system behavior | Booking finance can create deposit invoices for **bookings**. Programme costing has **no** deposit rule. |
| Authoritative or technical | **Absent** on programme/proposal. Booking deposits are a different operational path, not this policy. |
| If left unresolved | Client-facing generation remains **blocked**. Do not copy booking deposit behaviour onto the proposal. |

#### 9. Payment milestones

| Field | Record |
| --- | --- |
| Decision required | Milestone schedule (e.g. deposit / pre-travel / final), amounts or percentages, and what document carries them. |
| Why it matters | Payment schedule is part of the client offer. |
| Current system behavior | Booking invoices/progress payments exist for bookings. No programme-proposal milestone model. |
| Authoritative or technical | **Absent** for programme proposals. |
| If left unresolved | Client-facing generation remains **blocked**. |

#### 10. Inclusions and exclusions model

| Field | Record |
| --- | --- |
| Decision required | Whether inclusions/exclusions are structured entities, free text, copied from RFP requirements, or omitted until a later product. |
| Why it matters | Clients treat inclusions/exclusions as contractual scope. |
| Current system behavior | Not a programme entity. RFP `requirementsText` remains the requirements source of truth and is not duplicated onto the draft. |
| Authoritative or technical | **Absent** as a governed model. |
| If left unresolved | Client-facing generation remains **blocked**. Do not invent a standard inclusions list. |

#### 11. Night-count calculation

| Field | Record |
| --- | --- |
| Decision required | Whether nights = days − 1, nights are stored independently, or night count is not used on proposals. |
| Why it matters | Accommodation and some supplier costs are night-based. A guessed night count would misstate the programme. |
| Current system behavior | Day count is stored. Night count is **not** computed. Internal preparation flags that nights = days − 1 is not an approved rule. |
| Authoritative or technical | **Not computed.** Showing day count is storage, not a night policy. |
| If left unresolved | Client-facing generation remains **blocked**. Do not compute nights. |

#### 12. Rooming ratios

| Field | Record |
| --- | --- |
| Decision required | Twin/double/single/triple rules, how pax maps to rooms, and whether that appears on the proposal. |
| Why it matters | Room configuration changes cost and client wording. |
| Current system behavior | No rooming entity. `paxCount` may exist on RFP/programme/cost sheet without a rooming model. |
| Authoritative or technical | **Absent.** |
| If left unresolved | Client-facing generation remains **blocked**. Do not invent rooms from pax. |

#### 13. Guide ratios

| Field | Record |
| --- | --- |
| Decision required | Guests per guide (and whether that is a commercial standard vs a per-programme choice). |
| Why it matters | Guide count is cost and client-facing staffing language. |
| Current system behavior | `guide` is an item **type** only. No ratio engine. |
| Authoritative or technical | **Absent.** |
| If left unresolved | Client-facing generation remains **blocked**. |

#### 14. Vehicle ratios

| Field | Record |
| --- | --- |
| Decision required | Guests per vehicle / vehicle type rules for costing and proposal text. |
| Why it matters | Vehicle count drives transport cost and programme wording. |
| Current system behavior | Transport/excursion items may exist. No vehicle-ratio engine. |
| Authoritative or technical | **Absent.** |
| If left unresolved | Client-facing generation remains **blocked**. |

### 9.5 Commercial ownership / workflow

#### 15. Whether RFP won/lost remains exclusively on Opportunity

| Field | Record |
| --- | --- |
| Decision required | Keep won/lost only on Opportunity, or add RFP won/lost stages — as an explicit commercial-ownership decision. |
| Why it matters | A client-facing “closed/won” proposal status would change where commercial outcome is recorded. Moving it without a decision would split the source of truth. |
| Current system behavior | RFP stages remain `intake \| programme \| costing \| approval \| proposal \| sent \| closed`. Opportunity stages include `won` / `lost`. Workspace records `wonLostRecord: "opportunity"`. H-203 did not move won/lost. |
| Authoritative or technical | **Current ownership is the implemented model.** It is **not** a new H-203 decision that this must never change; changing it still requires a later Owner decision. This gate does **not** move won/lost. |
| If left unresolved | Client-facing generation remains **blocked** from introducing RFP won/lost. Do not add `won`/`lost` RFP stages under this gate. |

#### 16. Mapping of the commercial lifecycle onto existing RFP stages

| Field | Record |
| --- | --- |
| Decision required | How the desired lifecycle (received → programme → costing → review → proposal prepared → submitted → revision → won/lost) maps onto existing RFP stages, without adding `proposal_draft` / `proposal_final` unless separately decided. |
| Why it matters | Client-facing “proposal sent” vs internal working draft must not be confused with RFP `proposal` / `sent`. |
| Current system behavior | Existing RFP stages only. Internal preparation is **not** an RFP stage. C8 proposal statuses (`draft \| pending_approval \| approved \| sent \| …`) are a separate module and are not this working draft. |
| Authoritative or technical | **Technical use of existing stages.** Desired lifecycle mapping is **not** approved. |
| If left unresolved | Client-facing generation remains **blocked**. Do not add RFP stages to represent the working draft. |

#### 17. Responsible commercial user / owner field

| Field | Record |
| --- | --- |
| Decision required | Which principal is the commercial owner of the RFP/programme/proposal (vs `createdByPrincipalId` / RFP `assignedPrincipalId`), and whether that name appears on the client document. |
| Why it matters | A client proposal typically names who is responsible. Guessing from `createdBy` would mis-state ownership. |
| Current system behavior | Audit/created-by and optional RFP `assignedPrincipalId` exist. No dedicated “responsible commercial user” policy. |
| Authoritative or technical | **Technical identity fields.** Not an approved commercial-owner role. |
| If left unresolved | Client-facing generation remains **blocked**. Do not invent an owner on the PDF. |

### 9.6 Exact gate preventing client-facing proposal authorization

Client-facing proposal generation (including PDF, email, and dispatch) is **not authorized** while this gate is open.

**The gate is:** Owner/Commercial Director resolution of decisions **1–17** in this section, recorded in an authoritative governance artefact, **plus** a subsequent explicit implementation authorization. Until both exist:

- do not generate a client-issued proposal;
- do not implement PDF/email/dispatch for this path;
- do not treat technical defaults (including **20%**) as approved policy;
- do not encode unresolved rules in a migration or API-required value.

Internal proposal preparation in Dev/Test may continue as a working draft that reuses existing `financialSummary` and surfaces remaining client-issue gaps.

**This does not make EOS production-ready. `productionReady = false`.**

---

## 10. Authorized commercial policy (Owner / Commercial Director — implemented in Dev/Test)

The Commercial Decision Gate in section 9 is **closed for the decisions listed below**. Those decisions are now AUTHORIZED by the Owner/Commercial Director under the company's POA and encoded in Dev/Test.

PDF / email / client dispatch remain **not authorized**.

### 10.1 Authorized decisions recorded

| # | Decision | Authorized rule |
| --- | --- | --- |
| 1 | Default pricing basis | **25% default markup** on supplier cost (`base sell = cost × 1.25`). Resulting gross margin **before other components is approximately 20%**. That 25%/~20% pair is **not** a client-facing figure. Manual selling-price override remains available to authorized internal users. |
| 2 | Minimum margin floor | **15% gross margin**. Replaces the previously technical/non-authoritative `marginFloorPercent ?? 20` default on the H-203 costing path. The system must not silently permit a normal client selling price below this floor. |
| 3 | Sell equal to cost | **Not** a normal permitted commercial price (0% GM violates the 15% floor). |
| 4 | Below-floor exception | Only with explicit authorization by CEO/MD or Commercial Director (`platform.admin` is the Dev/Test stand-in), recorded reason, actor, and timestamp. The stored floor is never silently downgraded below 15%. |
| 5 | Tax | **Manual commercial input** (`none` / rate / amount). No statutory tax rate is invented. Rate vs amount is distinguished by `taxMode`. |
| 6 | Commission / file fee | Internal **US$200 file fee**, incorporated into the client selling price. Must **not** appear as a separate client-facing line. |
| 7 | FX | **Manual input**: currency pair, rate, as-of date, source/reference. No external FX provider or lookup. |
| 8 | Client-facing commercial confidentiality | Client-facing outputs expose **only** the final client selling price and client-appropriate programme information. Internal: supplier cost, GP, GM, markup %, markup value, commission, separate $200 file fee, internal pricing adjustments. Authorized internal users retain those figures. |
| 9 | Programme labels | `draft` = internal working; `revised` = internally revised; **client remains editable**; **final remains locked**. Final-lock semantics otherwise unchanged. |
| 10 | Deposit | Default **30%**, configurable per programme. |
| 11 | Payment milestones | Default **30% on confirmation / 40% at 90 days before arrival / 30% at 30 days before arrival**, totalling 100%. Programme-specific override allowed if the total remains 100%. |
| 12 | Inclusions / exclusions | Explicit **manual programme inputs**. Not inferred from costing lines. |
| 13 | Night count | **nights = departure date − arrival date** (10 June → 24 June = 14). Invalid date range rejected. Manual override requires an explicit reason. |
| 14 | Rooming | Explicit input (room type, count, occupancy, crew/staff, supplements). **No** universal ratio. |
| 15 | Guide planning | Existing operational default: **driver-guide maximum = 6 guests**. Larger groups: existing planning up to 10 vehicles / 60 guests. Not an immutable commercial law. |
| 16 | Safari vehicle capacity | Default **maximum 6 passengers per safari vehicle**. `required vehicles = ceiling(guests / 6)`. Programme-specific operational override allowed with reason. |
| 17 | Won/Lost | Remains on the **Opportunity**. **Consultant** operational ownership. Not duplicated on RFP. |
| 18 | RFP lifecycle | Unchanged: `intake → programme → costing → approval → proposal → sent → closed`. Programme labels are document/version states and do not replace RFP stages. |
| 19 | Commercial responsibility | **CEO/MD** and **Commercial Director**. Consultant remains owner of Opportunity Won/Lost. |
| 20 | Legacy 250k/20% and technical 20% floor | Remain **non-authoritative**. They must not silently control the H-203 commercial path. Historical C6 callers that **explicitly** store a 20% floor keep that stricter stored floor. |

### 10.2 Implementation notes (Dev/Test)

- Pricing reuses `kernel.computeCostTotals` for cost + markup/override. `composeH203ClientPrice` layers the authorized file fee and manual tax **after** that formula. It is not a second margin engine.
- Manual `sellPrice` override is treated as the **final** client selling price (file fee recorded, not added twice), so existing C6/C8 override figures remain valid.
- Empty cost sheets (supplier cost 0) do not trip the floor.
- Client-facing sanitization is `toClientFacingCommercialView({ currency, clientSellingPrice })` on cost-sheet, commercial workspace / proposal-preparation, and C8 proposal APIs. Internal fields remain on authorized staff representations.
- Dev/Test migration only: `packages/db/migrations/127_h203_authorized_commercial_policy.sql`. Production migration was **not** executed.
- PDF/email/dispatch were **not** implemented.

### 10.3 Unresolved architectural items (do not guess)

| Item | Status |
| --- | --- |
| Client-issued PDF / email / dispatch | **Not authorized.** Confidentiality boundary is encoded so a later authorization cannot accidentally expose internal composition. |
| Non-USD automatic conversion of the US$200 file fee | **Not invented.** Non-USD sheets default file fee to 0 unless an explicit amount is supplied. |
| Statutory tax rates | **Not invented.** |
| External FX provider | **Not invented.** |
| Merging programme milestones with booking invoices | **Not done** (explicitly out of scope). |
| Production hosting / P01 / H-81 | **Unchanged HOLD.** |

**productionReady = false.**

---

## 11. Dev/Test UAT and integrity hardening (2026-09-27)

Validation and targeted defect-fix only. No new commercial policy. No PDF / email / client dispatch. No Production change. HEAD remained `75ee4c3`. Index remained empty. `productionReady = false`.

### 11.1 Defect fixed

**Invalid date PATCH no longer mutates in-memory programme state before rejection.**

`patchProgramme` now validates the complete proposed date range and all other mutating fields **before** writing title, notes, destinations, dates, pax, deposit, milestones, inclusions, nights, or vehicles. Rejected input returns 400; subsequent GET and the in-memory store retain the original valid programme. Night-count rule unchanged: `nights = departure − arrival`.

Regression coverage:

- `apps/api/src/h203-authorized-commercial-policy.test.ts` — combined invalid dates + title + inclusions; GET and `store.prgProgrammes` unchanged.
- `apps/api/src/h203-commercial-core-programme-rfp-finance.test.ts` — GET after invalid dates returns the original 2026-06-01 / 2026-06-08 range.

Live in-memory preview (`npm run dev:preview`, no `EOS_PREVIEW_USE_DATABASE`): PATCH reversed dates + title + inclusions → **400**; title/dates/nights/inclusions unchanged.

### 11.2 Browser UAT

Performed against the documented Dev/Test preview:

- API `http://127.0.0.1:8080` (memory-only; `productionReady: false` on `/health`)
- UI `http://127.0.0.1:3001/commercial`
- Login: `carol.admin@sedmc.local` (Dev sign-in)

Workflows exercised:

| Surface | Result |
| --- | --- |
| RFP `RFP-2026-0847` (`/commercial/rfps/{id}`) | Originating RFP visible; linked to programme/costing/proposal; stages shown as intake→programme→costing→approval→proposal→sent. Demo seed has this RFP **closed** and proposal **accepted**. |
| Programme Builder | Programme `PRG-2026-0847` linked; days/items loaded; nights 14 (10→24 Jun); deposit 30%; milestones 30/40/30; 65 pax → 11 vehicles (ceil(65/6)); explicit rooming 4×twin occ 2 without rewriting pax; internal figures + client-facing price $285,000. **Preview PDF remains disabled.** |
| Costing on Programme Builder | Supplier cost $198,400; client selling price $285,000; GP $86,600; file-fee note internal-only; client-facing card shows only $285,000. |
| Proposal preparation | Internal working draft; days loaded; unresolved gaps include tax/FX manual, internal file fee, and `client_issued_proposal_not_generated`. RFP stage remained **closed** (seed), not changed by opening proposal-prep. |
| Proposal `PROP-2026-0847` | Internal summary (cost/sell/margin) + sanitized client-facing $285,000. PDF/email deferred copy present. |

**List caveat:** `/commercial/rfps` filters `status=active`, so the seeded closed demo RFP does not appear in the Active RFPs list. Direct RFP URL was used.

**UI caveat:** Next.js hydration overlay from `src/components/commercial/Shell.tsx` appeared on the RFP list. It did not block signed-in commercial pages after hydration. Not a commercial-policy change.

### 11.3 API / kernel tests (exact)

Targeted first, then listed suites. `--fileParallelism false --maxWorkers 1`. No tests deleted or weakened.

| Suite | Result |
| --- | --- |
| `apps/api` `h203-authorized-commercial-policy.test.ts` | **11 passed** |
| `apps/api` `h203-commercial-core-programme-rfp-finance.test.ts` | **5 passed** |
| `packages/kernel` `h203-commercial-policy.test.ts` | **12 passed** |
| `packages/kernel` `proposal-preparation.test.ts` | **3 passed** |
| `apps/api` `c5.programme.test.ts` | **5 passed** |
| `apps/api` `c6.costing.test.ts` | **5 passed** |
| `apps/api` `c8.proposal.test.ts` | **4 passed** |
| `apps/api` H-112 (startup, org-type, mixed-sql facts, migrate-inventory) | **10 passed** (5+1+2+2) |
| `apps/api` `h145-owner-authorized-structural-keys.test.ts` | **3 passed** |
| `apps/api` H-135–H-141 | **49 passed** (5+5+4+6+6+7+3+6+7) |
| `packages/db` `h135-phase1-personal-data-domain.test.ts` | **3 passed** |
| `packages/db` `h136-phase-a-personal-data-domain.test.ts` | **7 passed** |

Exact recorded runs:

1. API authorized policy: **11/11 PASS**
2. API H-203 core + C5 + C6 + C8: **19/19 PASS**
3. Kernel H-203 + proposal-prep: **15/15 PASS**
4. API H-112 + H-145: **13/13 PASS**
5. API H-135–H-141: **49/49 PASS**
6. DB H-135 + H-136: **10/10 PASS**

No suite in this list failed. No obsolete-test vs H-203 conflict required a behavior change in this increment.

### 11.4 Client-facing sanitization

Verified on the **API/view-model**, not UI hiding only.

Live GET `/v1/rfps/{id}/proposal-preparation`, `/v1/costing/sheets/{id}`, and `/v1/proposals/{id}`:

- `clientFacing` keys: **`currency`, `clientSellingPrice` only** (USD / 285000 on the seeded file).
- Internal staff representations still include supplier cost, GP, GM, file fee, tax mode.

Internal proposal-prep and proposal UI show both the internal card and the sanitized client-facing card. Markup % / ~20% GM / $200 fee are **not** on the client-facing object.

### 11.5 Pricing / floor / fee / tax / FX

| Check | Result |
| --- | --- |
| Cost 100 → base 125 (~20% GM before fee); USD client price 325 with $200 fee | PASS (authorized-policy API + kernel) |
| Manual sell override is final (fee not added twice) | PASS (kernel + authorized-policy) |
| Sell-at-cost / below 15% rejected as normal price | PASS (`margin_below_authorized_floor`) |
| Below-floor exception: authorized role + reason; stored floor remains 15 | PASS (`platform.admin`; finance.member cannot authorize) |
| File fee not a client-facing field | PASS |
| Tax modes none/rate/amount; no statutory rate invented | PASS (kernel tax test + API taxMode none) |
| Manual FX pair/rate/as-of/source; no external lookup | PASS |
| Seeded demo sheet `marginFloorPercent: 20` | Observed. Matches authorized note that **explicitly stored** historical 20% remains a stricter stored floor; H-203 **create** path defaults to **15**. Floor was not silently lowered globally. |

### 11.6 Programme / dates / rooming / vehicles

| Check | Result |
| --- | --- |
| `client` editable; `final` locked (409 `programme_version_locked`) | PASS on live preview |
| Unlock `final` → `revised` then edit | PASS |
| Multi-night 10→24 Jun = 14 | PASS |
| One-night 10→11 Jun = 1 | PASS |
| Reversed range rejected; no mutation | PASS |
| Same-day 10→10 Jun | **Currently permitted; nights = 0.** No same-day commercial exception was invented. |
| Default deposit 30%; default milestones 30/40/30; invalid totals 400 | PASS |
| Inclusions/exclusions persist | PASS |
| Explicit rooming create/read; pax/vehicles not rewritten by rooming | PASS |
| Vehicles: 6→1, 12→2, 18→3, 25→5, 60→10 (65 demo pax → 11) | PASS |
| Driver-guide max 6 | PASS (planning default; not converted into an immutable commercial lock) |

### 11.7 Remaining defects / governance observations

1. **Same-day programmes** (`start = end`, nights = 0) remain **permitted**. §12.6 **K** records that no blanket same-day/zero-night rejection rule is authorized. Night calculation remains `nights = departure − arrival`.
2. **Active RFPs list** hides the seeded closed demo RFP (`status=active` filter). Direct URL works.
3. **Next.js hydration overlay** on `Shell.tsx` during RFP list load — UI, not commercial policy.
4. Demo seed still **explicitly stores** `marginFloorPercent: 20` (stricter than the authorized 15% default). Displayed as “Above 20% floor” on that file. Not a silent global floor change.

### 11.8 Production and dispatch

- No Production database changed.
- Migration 127 was **not** applied to Production (preview ran memory-only; `EOS_DATABASE_URL` stripped).
- No Production credentials/configuration, hosting, or deployment.
- PDF / email / client dispatch **were not implemented**. Programme Builder “Preview PDF” remains **disabled**.
- `productionReady = false`.

**Recommended next governed action:** a **separate explicit implementation authorization** is still required before PDF, email, dispatch, or client access are built. Decisions A–J are now recorded in §12.6; recording them is **not** implementation authorization. Same-day / zero-night programmes remain permitted. Do not treat this as Production readiness.

---

## 12. Client-issued proposal capability — NOT AUTHORIZED (governance gate, 2026-09-27)

**Status:** Decisions **A–J closed** as SEDMC commercial governance (this increment). **K closed** (zero-night programmes remain permitted). **Implementation of PDF / email / dispatch / unauthenticated client access remains NOT AUTHORIZED.**

**Nature of this increment:** governance record only. No application code, schema, migration, PDF, email, dispatch, C8 workflow, RFP-stage, client GET, or Production change.

This gate does **not** reopen the authorized H-203 commercial pricing, floor, fee, tax, FX, deposit, milestone, rooming, or vehicle rules recorded in §10. Programme-label **runtime behavior is unchanged** in this increment (`client` remains editable; `final` remains locked). **Client-issued proposal generation, PDF, email, dispatch, and unauthenticated client access remain NOT AUTHORIZED.**

Same-day / zero-night programmes remain **permitted** (`nights = 0` when arrival = departure). No blanket same-day rejection rule is authorized. Night calculation remains `nights = departure − arrival`.

`productionReady = false`. Production remains untouched.

### 12.1 Paths inspected (current code)

| Path | Kind | What it does today | Client-issued? |
| --- | --- | --- | --- |
| `GET /v1/rfps/:id/proposal-preparation` | Authenticated staff GET | Assembles RFP + live programme + days + existing cost-sheet `financialSummary`. `kind = internal_working_draft`. `clientIssued: false`. Always includes gap `client_issued_proposal_not_generated` with `requiredForClientRelease: true`. | **No.** Read-only working draft. |
| `GET /v1/rfps/:id/commercial-workspace` | Authenticated staff GET | Includes `proposalPreparation` summary (`readiness`, `clientIssued: false`, unresolved required count). | **No.** |
| UI `/commercial/rfps/[id]/proposal-preparation` | Internal UI | Displays working draft, internal figures, sanitized client-facing price. Copy states it does not generate PDF, send email, or issue a client proposal. | **No.** |
| UI Programme Builder “Preview PDF” | Disabled button | `disabled` with no handler. | **No.** |
| `POST /v1/proposals` (`generateProposal`) | Authenticated C8 write | Creates an internal `PropProposal` after `canGenerateProposal` (programme + cost sheet + commercial approval / Path B). Status starts as `approved`. Copies composed client selling price. Does **not** render PDF or send mail. | **No.** Internal C8 record. |
| UI RFP “Generate Proposal” | Internal UI | Calls `POST /v1/proposals`. | **No.** |
| `POST /v1/proposals/:id/transitions` `toStatus=sent` | Authenticated C8 status stamp | Permission `proposal:transition:status`. Sets `sentAt`. May advance RFP `proposal → sent` if the RFP is already at `proposal`. Path B send check. **Does not call the email adapter.** | **No.** Workflow stamp only. Must not be read as external dispatch. |
| UI “Send Proposal” | Internal UI | Calls the `sent` transition. Label is a status name, not SMTP. | **No.** |
| `GET /v1/proposals/:id` | Authenticated staff GET | Returns `proposal` (including internal `totalCost`, `marginPercent`, `approvalRequestId`) **plus** nested `clientFacing`, programme days, **supplier cost lines**, version snapshots (which include `totalCost` / `marginPercent`), and Path B metadata. Requires login. | **No public client document.** Staff representation. Nested `clientFacing` is the sanitization boundary. |
| Notification email dispatch (`/v1/notifications/email/dispatch-*`) | Internal ops digest | Allowlist/DLQ/digest dispatch. Not a proposal-to-client path. | **No.** Unrelated to client proposals. |
| Document storage PDF upload | Authenticated file store | Generic document bytes. Not a generated client proposal PDF. | **No.** |

There is **no** unauthenticated client-proposal endpoint, **no** proposal PDF renderer, **no** proposal email template send, and **no** client portal.

### 12.2 Current authorization and lifecycle boundaries

| Boundary | Current rule | Implication for a future client-issued feature |
| --- | --- | --- |
| Programme labels | `draft` / `revised` / `client` editable. **`final` locks** (`programmeIsCommerciallyLocked`). Runtime **unchanged** this increment. | **B closed:** only `final` may be issued to a client. `client` remains the editable client-review version. |
| Numeric / commercial snapshot | Optional on the internal working draft. | **A closed:** an issued proposal must identify the exact programme/version and commercial snapshot. That identity is not implemented here. |
| RFP stages | Unchanged: `intake → programme → costing → approval → proposal → sent → closed`. Preparation GET does **not** change stage. | **C closed:** no new RFP stage for client issuance. Client issue is a separate document/event. RFP `sent` is not delivery evidence. |
| C8 statuses | `draft \| pending_approval \| approved \| sent \| accepted \| rejected`. Generate currently lands on `approved`. | **D closed:** C8 `sent` remains an internal workflow stamp. It is not email sent/delivered, download, receipt, or acceptance. |
| Commercial approval (C7) | `canGenerateProposal` requires `approvalStatus === "approved"` (or preview Path B not-required / Path B-approved). SoD: requester cannot decide. | C7/Path B still gates **C8 record creation** only. **E closed:** client issuance requires a **separate** attributable approval by CEO/MD or Commercial Director (not implemented here). |
| Proposal-prep readiness | `incomplete` if programme or cost sheet missing; otherwise `internal_working_draft`. | Working draft is **not** a client-issued document. |
| Commercial responsibility | Programme field `commercialResponsibleRole` is `ceo_md` \| `commercial_director`. Won/Lost remains Opportunity / Consultant. | **F closed:** future client document identifies Serengeti Experience DMC and the authorized commercial representative/signatory. Exact signatory configuration is a later implementation authorization. Do not hard-code a personal signatory. |
| Audit | C8 generate/transition write chained audit + outbox events. Preparation GET is not an issue event. | **I closed:** future dispatch must audit approved version → issued identity → attempt → result. Not implemented. |
| Same-day nights | `start <= end` allowed; nights may be 0. | **K closed:** permitted. No blanket same-day rejection. `nights = departure − arrival`. |

### 12.3 Nested `clientFacing` sanitization (verified)

Constructed by `toClientFacingCommercialView` (preparation/workspace/cost sheet) or the equivalent two-field object on C8 `sanitizeProposal`.

**Exposed on `clientFacing`:** `currency`, `clientSellingPrice` only.

**Not exposed on `clientFacing`:** supplier cost, gross profit, gross margin, markup, file fee, tax composition, FX composition, internal adjustments, below-floor exception fields, internal approval metadata.

Kernel `h203-commercial-policy` (12), `proposal-preparation` (3), `proposal` (3); API `h203-authorized-commercial-policy` (11) and `c8.proposal` (4) **PASS** in this increment. No tests weakened.

**Staff GET bodies are not client documents.** `GET /v1/proposals/:id` still includes internal cost, margin, cost lines, version snapshots, `approvalRequestId`, and Path B. A future client-issued payload **must not** reuse that staff response as the issued document.

### 12.4 Endpoints and UI that must not be interpreted as external dispatch

The following exist and remain **internal**:

1. **“Send Proposal”** / `POST .../transitions` `{ toStatus: "sent" }` — status stamp; may move RFP to `sent`; **no email**.
2. **“Generate Proposal”** / `POST /v1/proposals` — creates C8 record; **no PDF**.
3. **Proposal-preparation** — working draft; gap `client_issued_proposal_not_generated` remains required for client release.
4. **Preview PDF** — disabled; not implemented.
5. Notification digest dispatch — not a client-proposal channel.

Until an Owner/Commercial Director implementation authorization exists, contributors **must not** treat C8 `sent`, RFP `sent`, or `sentAt` as client delivery.

### 12.5 Readiness / approval records — not added

Current readiness (`incomplete` / `internal_working_draft`) remains sufficient for the **internal working draft**.

Decisions **A**, **E**, and **D** now specify that a future client-issued proposal needs a distinct issued identity, explicit CEO/MD or Commercial Director approval, and that C8 `sent` must not be redefined as delivery. **None of those identities, approval mechanisms, PDF, email, or dispatch behaviors were implemented in this increment.**

### 12.6 Client-issue decisions A–J — CLOSED (governance record)

**Closed as SEDMC commercial governance.** These decisions do **not** authorize implementation. They do **not** re-open §10 pricing policy. Application code, C8 workflow, RFP stages, and programme-label runtime behavior are **unchanged**.

| # | Status | Authorized decision |
| --- | --- | --- |
| **A** | **CLOSED** | A client-issued proposal must have a **distinct immutable issued-proposal identity/version**. The internal C8 proposal record **must not** itself be treated as the client-issued document. An issued proposal must identify the **exact programme/version and commercial snapshot** from which it was issued. |
| **B** | **CLOSED** | Only a programme labelled **`final`** may be issued to a client. Meaning: `draft` = internal preparation; `revised` = internal working revision; `client` = client-review version and **remains editable**; `final` = approved/locked commercial programme eligible for client issuance. Existing programme-label runtime behavior is **not** changed in this increment. |
| **C** | **CLOSED** | Do **not** create new RFP lifecycle stages. Keep `intake → programme → costing → approval → proposal → sent → closed`. Client issuance is a **separate document/event** and must not be represented by inventing another RFP stage. |
| **D** | **CLOSED** | C8 `sent` remains an **internal workflow stamp**. It does **not** mean email sent, email delivered, client downloaded, client received, or client accepted the proposal. The existing field/state is **not** reinterpreted in this increment. |
| **E** | **CLOSED** | Creation of a client-issued proposal requires **explicit approval** by an authorized commercial authority: **CEO/MD** or **Commercial Director**. The approval must be attributable/auditable. The approval **mechanism is not implemented** in this increment. |
| **F** | **CLOSED** | The future client document must identify **Serengeti Experience DMC** and the authorized commercial representative/signatory appropriate to the approved issuance process. Do **not** hard-code a personal signatory. Exact signatory configuration remains an implementation detail to be authorized separately if required. |
| **G** | **CLOSED** | Future client-issued documents may contain client-appropriate programme and commercial information, including client/programme identification, itinerary/programme information, dates, destinations, inclusions, exclusions, applicable commercial terms, **final client selling price**, **currency**, and other client-safe information **explicitly approved** for the document. The following are **INTERNAL** and **MUST NOT** appear in client-issued output: supplier cost; gross profit; gross margin; markup; internal $200 file fee; tax composition; FX composition; internal pricing adjustments; below-floor exception details; approval-request identifiers; internal snapshots; internal cost lines; internal workflow/audit data. This is a **confidentiality / data-exposure requirement**, not a presentation preference. |
| **H** | **CLOSED** | Email delivery requires a **separately defined and authorized contract** covering at minimum: recipient source; recipient validation; sender identity; template; attachment/document identity; delivery status; failure behavior. **No automatic external email is authorized** by this governance increment. |
| **I** | **CLOSED** | Future dispatch must preserve an auditable relationship: **approved commercial version → issued proposal identity → delivery attempt → delivery result**. Retries must **not** silently alter the underlying commercial document. A failed dispatch must **not** imply successful client delivery. Dispatch and retry are **not implemented** now. |
| **J** | **CLOSED** | **Unauthenticated client access** to proposal documents is **NOT authorized by default**. Any future client-access mechanism requires a separate authorization covering: authentication/authorization model; document identity; access expiration/revocation; auditability; exposure of client-safe data only. Client GET/download is **not implemented** now. |
| **K** | **CLOSED** | A programme with `departure date = arrival date` remains **permitted** with `nights = 0`. **No** blanket same-day/zero-night rejection rule is authorized. Night calculation is unchanged: `nights = departure − arrival`. |

Until a **subsequent increment is explicitly authorized to implement** client-issued proposals, do not:

- generate a client-issued proposal;
- implement PDF / email / dispatch / client GET;
- enable Preview PDF;
- treat C8/RFP `sent` as client delivery;
- treat the internal C8 record or nested `clientFacing` as the issued document;
- add issued-identity, client-issue approval, or client-access mechanisms.

### 12.7 Required governance statements

1. **Proposal preparation** remains an **internal working draft**.
2. **C8 proposal creation** remains an **internal workflow capability**. The C8 record is **not** the client-issued document (**A**).
3. **C8 `sent` is not delivery evidence** (**D**). It does not mean email sent, delivered, downloaded, received, or accepted.
4. Nested **`clientFacing`** is a **sanitized commercial view** (`currency` + `clientSellingPrice`), **not** a client-issued document.
5. A future client-issued proposal requires a **distinct issued identity** (**A**) and **explicit commercial approval** by CEO/MD or Commercial Director (**E**), and may be issued only from a programme labelled **`final`** (**B**).
6. **PDF, email, dispatch, and unauthenticated client access remain unauthorized.**
7. **Production remains untouched.**
8. **`productionReady = false`.**

### 12.8 Confirmations (this increment)

| Item | Record |
| --- | --- |
| Client-issued proposal implementation | **NOT AUTHORIZED** |
| Decisions A–J | **CLOSED as governance** (not implemented) |
| Decision K (zero-night) | **CLOSED:** permitted; no blanket rejection |
| PDF / email / dispatch / client GET this increment | **NONE** |
| Application / schema / migration / test files | **Unchanged** |
| C8 workflow / RFP stages | **Unchanged** |
| Production infrastructure / DB / migration 127 on Production | **Untouched / not applied** |
| `productionReady` | **false** |
| Dirty worktree / no commit / no push | **YES** |

---

## 13. Client-Issue Foundation — authorized Dev/Test implementation

**Authorization scope (this increment only):** implement the **internal** foundation required to represent:

`final Programme → authorized commercial approval → immutable Issued Proposal identity/snapshot`

This is a **new implementation authorization**. §12.6–§12.8 closed decisions A–K as policy; they did not previously authorize application code. This increment encodes A, B, D, E, G, and K at the kernel/API boundary for **Dev/Test only**. Decisions **H, I, J** (email contract, dispatch, unauthenticated client GET) remain **unimplemented and unauthorized**. Decision **F** is represented only as issuing entity `Serengeti Experience DMC` plus attributable authority role — **no hard-coded personal signatory**, no client document.

**PDF/email/dispatch/client access remain unauthorized.** No PDF generation/render, no email prepare/send, no dispatch/retry adapters, no unauthenticated client GET/download, no client portal.

### 13.1 Files changed

| Path | Change |
| --- | --- |
| `packages/kernel/src/issued-proposal.ts` | Issued identity, `final`-only eligibility, CEO/MD / Commercial Director / `platform.admin` Dev/Test stand-in, immutable client-safe snapshot |
| `packages/kernel/src/issued-proposal.test.ts` | Kernel proofs for eligibility, approval, identity, freeze, leak-stripping, nights=0, no RFP-stage change |
| `packages/kernel/src/index.ts` | Export issued-proposal module |
| `packages/kernel/package.json` | Subpath `./issued-proposal` |
| `packages/kernel/src/h203-commercial-policy.ts` | Export `CLIENT_FACING_FORBIDDEN` for reuse |
| `apps/api/src/issued-proposal/issued-proposal.ts` | Authenticated staff issue/list/get; in-memory store only |
| `apps/api/src/issued-proposal/routes.ts` | `POST/GET /v1/issued-proposals` (auth required) |
| `apps/api/src/issued-proposal/collections.ts` | Ensure in-memory collection |
| `apps/api/src/store.ts` | `issuedProposals[]` |
| `apps/api/src/server.ts` | Register issued-proposal routes |
| `apps/api/src/h203-client-issue-foundation.test.ts` | API proofs for the 12 required validations |
| `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` | This section |

### 13.2 Schema / API / kernel

| Layer | Change |
| --- | --- |
| Kernel | New `IssuedProposal` identity (`ISS-…` / UUID), **not** the C8 proposal ID. Frozen `clientSafe` snapshot at issue time. |
| API | Authenticated `POST /v1/issued-proposals` and `GET /v1/issued-proposals[/:id]`. No PATCH. No public/client/download/pdf routes. |
| Schema / SQL | **None.** No migration 128. In-memory Dev/Test only. Migration 127 **not** applied to Production. |
| C8 / RFP | **Unchanged.** `sent` remains an internal workflow stamp. No new RFP stages. |
| Proposal-preparation | **Unchanged** internal working draft. |

### 13.3 Tests

- `packages/kernel/src/issued-proposal.test.ts`
- `apps/api/src/h203-client-issue-foundation.test.ts`
- Existing H-203 / C8 / kernel / API regression suites (not weakened)

Proofs: non-final cannot issue; final eligible; missing CEO/MD or CD (or `platform.admin` stand-in) blocks issue; authorized authority permits; distinct identity from C8; snapshot immutable; later programme/costing mutations do not mutate snapshot; client-safe fields only; internals cannot leak; C8 `sent` is not delivery; no client GET/download; same-day `nights = 0` permitted.

### 13.4 Status

| Item | Record |
| --- | --- |
| Environment | **Dev/Test only** |
| PDF / email / dispatch / client access | **Unauthorized; not implemented** |
| Production infrastructure / DB / migration 127 on Production | **Untouched / not applied** |
| `productionReady` | **false** (`productionReady = false`) |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (no commit / no push) |
| Index | empty |

**Recommended next governed action:** a **separate explicit authorization** is still required before PDF, email, dispatch, durable SQL persist of issued proposals, or client access are built. Do not treat this as Production readiness.

---

## 14. Issued Proposal Foundation — Dev/Test UAT & integrity verification

**Authorization:** verify the live Dev/Test API and browser workflow for `final Programme → authorized commercial approval → ISS-* issued proposal`. **Do not** implement new product capability. **Do not** generate/render PDF, implement email/dispatch/retry/delivery, client GET/download/portal, add a SQL migration, apply any migration to Production, deploy, modify Production, commit, or push.

No new commercial-policy, authorization-model, schema-persistence, PDF/email/dispatch, or client-access decision was required. No application/schema code was changed in this increment.

### 14.1 Environment

| Item | Record |
| --- | --- |
| Target | Local `npm run dev:preview` (in-memory). API `http://127.0.0.1:8080`, UI `http://127.0.0.1:3001/commercial` |
| Persistence | **In-memory Dev/Test only.** `EOS_PREVIEW_USE_DATABASE` was not set. |
| `GET /health` | `productionReady: false` |
| Authorized stand-in | `platform.admin` via `carol.admin@sedmc.local` |
| Unauthorized staff | `alice.finance@sedmc.local` (`finance.member`) — existing Dev/Test authority model; no new roles |
| Production | **Untouched** |

A prior preview process started before the Client-Issue Foundation returned `GET /v1/issued-proposals` **404**. Local preview was restarted for this UAT only (not Production). That restart dropped earlier in-memory RFPs and is itself evidence of the durability limit in §14.9.

### 14.2 Live API UAT

Exercised against the running API with a structural script (not unit tests). **60/60 PASS.**

#### Non-final rejection (`draft`, `revised`, `client`)

| Check | Result |
| --- | --- |
| `POST /v1/issued-proposals` | **409** `programme_not_final` for each of `draft` / `revised` / `client` |
| ISS identity | **None created** (list count unchanged) |
| Programme | **Unmutated** by the rejected issue attempt |
| Approval / C8 / RFP stage | **Unmutated** |

#### Final issuance

Live issued record (14-night final programme, with C8 cross-reference):

| Field | Value |
| --- | --- |
| Issued id | `484c090a-ab62-4663-9dc1-45cb6e8b78bd` |
| Issued code | `ISS-cf07b05b-1111-4a7c-be5f-5dcf00e1be9b` |
| Kind | `issued_proposal` |
| C8 id / code | `1dded8ee-7ca3-42a6-96a4-5825c18d18db` / `PROP-UAT-mujootw8-final` — **distinct** |
| Principal | `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee` (Carol) |
| Authority | `platform.admin` |
| `issuedAt` / `approvalRecordedAt` | `2026-09-27T10:36:47.802Z` (recorded) |
| Programme / version | programme `064b00af-5212-4dcc-b833-242f6ff3d744`, label `final`, version `1` |
| Client-safe snapshot | present: entity `Serengeti Experience DMC`, USD **1450**, original programme title |

Unauthenticated `GET /v1/issued-proposals` → **401**. `POST` as `platform.admin` on a final programme with authorized commercial approval → **201**.

### 14.3 Authorization UAT

| Principal | Result |
| --- | --- |
| Alice (`finance.member`) | `POST /v1/issued-proposals` → **403** (`rbac`; existing `proposal:write:proposal` gate). **No** ISS identity. **No** partial issued record. Programme/C8/RFP unchanged. |
| Carol (`platform.admin`) | Authorized Dev/Test issue path **succeeds**. No additional roles invented. |

### 14.4 Snapshot immutability

After issue:

1. Captured complete issued + `clientSafe` representation.
2. Added a costing line (`Later balloon`, unit cost 500) — live sheet selling price rose to **2075**.
3. Unlocked programme to `revised` and renamed title to `Later mutated programme UAT`.
4. Re-read `GET /v1/issued-proposals/{id}`.

| Assertion | Result |
| --- | --- |
| Issued id / `ISS-*` code | **Unchanged** |
| Programme id / version number | **Unchanged** |
| Snapshot dates / nights | **Unchanged** (14 nights; original start/end) |
| Snapshot itinerary / terms | **Unchanged** |
| Snapshot client selling price | **Unchanged at 1450** (live sheet 2075) |
| Snapshot programme title | **Unchanged** (live title mutated) |
| `PATCH` / `PUT` issued | **404** (no mutate route) |

No integrity defect required a code fix. The issued object was not mutated.

### 14.5 Client-safe sanitization

Structural key assertions on the live `clientSafe` object (not visual inspection).

**Present (approved):** `issuingEntity` (Serengeti Experience DMC), issued identity on the wrapper, programme code/title/version, dates, nights, pax, destinations, itinerary, deposit/milestones, inclusions/exclusions where entered, `currency`, `clientSellingPrice`.

**Absent (forbidden):** supplier cost, GP, GM, markup, internal file fee, tax composition, FX composition, internal pricing adjustments, below-floor exception details, approval IDs, internal cost lines, internal snapshots, internal workflow/audit fields. JSON blob scan for those terms: **none**.

Wrapper `delivery` remains `{ implemented, pdf, email, dispatch, clientAccess }` all **false**. Staff GET of the issued record is authenticated; client/public/download/pdf routes are **404**.

Internal costing remains inspectable on staff costing endpoints (file fee, totals) and is **not** copied into `clientSafe`.

### 14.6 C8 / RFP separation

| Check | Result |
| --- | --- |
| New RFP stage | **None.** Same-day UAT RFP `578f810e-…` remains `workflowStage: costing`. Issue did not invent `issued` / `client_issued` / `delivered`. |
| C8 `sent` | Internal workflow stamp only (`status: sent`, `sentAt` set). `emailSent` / `deliveredAt` **absent**. |
| Email / receipt implied | **No** |
| Client download / portal record | **No.** `GET /v1/client/issued-proposals`, `/v1/public/issued-proposals`, `…/download`, `…/pdf` → **404** |
| Proposal-preparation | Internal working draft; `clientIssued: false`; gap `client_issued_proposal_not_generated` |

C8 staff UI continues to show the **live** programme title (`Later mutated programme UAT`) and live costing lines. That is C8 internal workflow, not the frozen ISS snapshot.

### 14.7 Browser UAT

Signed in as Carol on `http://127.0.0.1:3001/commercial`. Next.js hydration overlay on `Shell.tsx` is pre-existing and did not block the flows.

| Surface | Observation |
| --- | --- |
| RFP `RFP-UAT-mujootw8-sameday` | Opened. Stages remain Intake → Programme → Costing → Approval → Proposal → Sent. No issued stage. No Issue-to-client / generate-PDF / client-portal controls. Staff commercial summary still shows internal supplier cost/GM (internal RFP page). |
| Programme Builder | Commercial version select **Final**. **NIGHTS = 0**. `Preview PDF` **disabled**. No issue/email/dispatch/client-access control. (C5 `PROGRAMME STATUS` label can still read `draft` as a distinct workflow field; issuance eligibility uses commercial version `final`.) |
| Proposal preparation | Banner: internal working draft; does not generate PDF, send email, or issue a client proposal. Commercial label **final**. Workflow stage **costing**. Client-facing price $1,450 with internals excluded. Gap `client_issued_proposal_not_generated`. **No issuance UI control** — none added. |
| C8 Proposals | `PROP-UAT-mujootw8-final` **SENT**. No `ISS-*` row. No PDF/email/dispatch/client-access controls. |
| C8 detail `PROP-UAT-mujootw8-final` | Status **Sent**. Copy: “PDF/email remain deferred.” `Send Proposal` is the existing C8 status transition (shown only when `approved`); this issued record is already `sent`. `Accept & Create Booking` is pre-existing C8/C9 internal workflow. No ISS identity, download, or client portal. |

**Browser issuance UI is not implemented.** Live issue was exercised via API only. Do not add a UI control in this increment.

### 14.8 Same-day programme

| Check | Result |
| --- | --- |
| Arrival = departure | `2026-06-10` / `2026-06-10` |
| `nights` | **0** (Programme Builder and `clientSafe.nights`) |
| Issuance | **201** `ISS-6bfb116a-f19d-4aaf-b746-9350bcea8a60` — zero nights did **not** block issue |

No new same-day rule was introduced.

### 14.9 In-memory durability limitation (known; not solved here)

Issued proposals are stored on the in-memory Dev/Test collection only. **A process restart may remove issued-proposal records.** Confirmed operationally: restarting local preview to pick up foundation routes dropped prior in-memory RFPs. **No migration 128. No SQL persist in this increment.** Future durable persist is a **separate owner/POA decision**.

### 14.10 Regression

Tests were not weakened, skipped, or rewritten.

| Suite | Result |
| --- | --- |
| `packages/kernel/src/issued-proposal.test.ts` | **7 passed** |
| `apps/api/src/h203-client-issue-foundation.test.ts` | **9 passed** |
| `apps/api/src/h203-authorized-commercial-policy.test.ts` | **11 passed** |
| `apps/api/src/h203-commercial-core-programme-rfp-finance.test.ts` | **5 passed** |
| `apps/api/src/c8.proposal.test.ts` | **4 passed** |
| `apps/api/src/c5.programme.test.ts` | **5 passed** |
| `apps/api/src/c6.costing.test.ts` | **5 passed** |
| API combined (those six files) | **6 files / 39 tests passed** |

### 14.11 Repository safety (this increment)

| Item | Before | After |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | **same** (no commit / no push) |
| Index | empty | **empty** |
| Porcelain | 754 | 754 (governance file already untracked; unrelated dirty files preserved) |
| Files changed this increment | — | `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` only (§14 appended) |
| Application / schema / migration / UI | — | **Unchanged** |
| Reset / clean / stash / revert | — | **Not used** |
| Production | — | **Untouched** |

### 14.12 Confirmations (this increment)

| Item | Record |
| --- | --- |
| PDF | **Unauthorized; not implemented** |
| Email | **Unauthorized; not implemented** |
| Dispatch | **Unauthorized; not implemented** |
| Client access / GET / download / portal | **Unauthorized; not implemented** |
| Production | **Untouched** |
| `productionReady` | **false** |
| Browser issue UI | **Not implemented** (API-only issue path) |
| Durable issued-proposal persist | **Not implemented** (in-memory Dev/Test limitation) |

---

## 15. Issued Proposal Durability — Dev/Test persistence foundation

**Authorization:** persist Issued Proposal records so an `ISS-*` identity and client-safe snapshot survive application restart. **Dev/Test only.** PDF, email, dispatch, client/public GET, download, portal, external integrations, Production deployment, and Production database migration remain **unauthorized**.

No new commercial-policy, approval-role, programme-label, client-facing-content, delivery, client-access, or RFP-stage decision was required. C7 `com_approval_requests` already supports a durable FK; issuance still uses the existing CEO/MD / Commercial Director / `platform.admin` stand-in and **does not** invent a parallel approval system. A C7 row is linked when an approved request exists (or via C8 `approvalRequestId`); it is **not** newly required for issuance.

### 15.1 Persistence design

Reuse the mixed C-spine SQL path (`isMixedSqlDurable` + `runDurableTx` + insert-only repository), not a sidecar-only parallel store.

| Concern | Mechanism |
| --- | --- |
| Identity | `issued_proposals.id` UUID PK; `issued_code` `ISS-*` UNIQUE per tenant |
| Programme | FK `programme_id → prg_programmes`; label CHECK `final`; optional `programme_version_id → prg_programme_versions` plus recorded `programme_version_number` |
| C8 | Optional FK `c8_proposal_id → prop_proposals` (never the issued identity) |
| Authority | `issued_by_principal_id → principals`; `approval_authority` CHECK (`ceo_md` / `commercial_director` / `platform.admin`); optional FK `approval_request_id → com_approval_requests` |
| Snapshot | `client_safe JSONB` — client-facing fields only; CHECK forbids internal commercial keys; application `pickIssuedClientSafe` on write and read |
| Immutability | INSERT-only table; `BEFORE UPDATE OR DELETE` trigger `issued_proposals_immutable`; no PATCH/PUT API; GET does not recompose from live Programme/costing |
| Atomicity | Issued row + chained audit in one transaction. Failure rolls back; in-memory collection is updated only after commit |
| Read | Authenticated staff `GET /v1/issued-proposals` and `GET /v1/issued-proposals/:id` with existing `proposal:read:proposal`. No `/public`, `/client`, download, or pdf routes |

In-memory preview **without** a mixed-SQL pool remains process-local. Mixed SQL (`store.dbPool` and not F2-DP-01 sidecar-only) is the durable SoR.

### 15.2 Migration

**Number:** `128`  
**File:** `packages/db/migrations/128_h203_issued_proposal_durability.sql`  
**Applied this increment:** **No.** Dev/Test file added only. **Not applied to Production.** Migration 127 was not applied to Production.

### 15.3 Files changed (this increment)

| Path | Change |
| --- | --- |
| `packages/db/migrations/128_h203_issued_proposal_durability.sql` | Insert-only `issued_proposals` table, JSONB snapshot CHECKs, immutability trigger |
| `apps/api/src/persistence/issued-proposal-repository.ts` | Map/insert/get/list |
| `apps/api/src/persistence/commercial-approval-repository.ts` | `findLatestApprovedApprovalForProgramme` |
| `apps/api/src/issued-proposal/issued-proposal.ts` | Durable TX persist; PG read after restart; optional C7 FK; memory fallback when PG graph is empty |
| `apps/api/src/issued-proposal/routes.ts` | Await async list/get |
| `packages/kernel/src/issued-proposal.ts` | Optional `approvalRequestId` / `programmeVersionId` on the internal wrapper (not `clientSafe`) |
| `apps/api/src/h203-issued-proposal-durability.test.ts` | Persistence, restart, uniqueness, approval link, immutability, authz, no client routes, orphan rollback |
| Existing “latest migration” pointer tests | Updated from 127/no-128 to **128 / no 129** (not weakened) |
| `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` | This section |

PDF/email/dispatch/client UI were **not** added.

### 15.4 Restart / durability UAT

Gate B-style simulated new process (`newProcessAgainstPool`) against the same Dev/Test pool:

1. Final Programme + costing created.
2. `platform.admin` issued `ISS-*`.
3. Identity and `clientSafe` captured.
4. New store attached to the same pool with empty in-memory `issuedProposals`.
5. `GET /v1/issued-proposals/:id` returned the same id, code, and snapshot.

Then Programme was unlocked/renamed and costing mutated. Re-read from the pool: snapshot **unchanged** (price remained the issued value). `UPDATE`/`DELETE` on `issued_proposals` rejected as insert-only.

The running in-memory `npm run dev:preview` process was **not** pointed at a database and was **not** restarted in this increment (restarting it would still drop process-local records). Preview remains in-memory unless mixed SQL is attached. **Production was not used.**

### 15.5 Tests

| Suite | Result |
| --- | --- |
| Kernel `issued-proposal.test.ts` | **7 passed** |
| `h203-issued-proposal-durability.test.ts` | **11 passed** (covers the 10 required persistence proofs) |
| `h203-client-issue-foundation.test.ts` | **9 passed** |
| `h203-authorized-commercial-policy.test.ts` | **11 passed** |
| `h203-commercial-core-programme-rfp-finance.test.ts` | **5 passed** |
| C8 / C5 / C6 | **4 / 5 / 5 passed** |
| Combined API files above | **7 files / 50 passed** |
| `packages/db` h135 + h136 pointer tests | **10 passed** |
| `h112-full-schema-migrate-inventory.test.ts` | **2 passed** |

Tests were not weakened, skipped, or deleted.

### 15.6 Confirmations

| Item | Record |
| --- | --- |
| PDF | **Unauthorized; not implemented** |
| Email | **Unauthorized; not implemented** |
| Dispatch | **Unauthorized; not implemented** |
| Client access / GET / download / portal | **Unauthorized; not implemented** |
| Production migration applied | **No** |
| Production infrastructure / credentials | **Untouched** |
| `productionReady` | **false** |
| Environment | **Dev/Test only** |

---

## 16. Issued Proposal durability — live mixed-SQL UAT (Dev/Test)

**Date:** 2026-09-27.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

This increment is integrity verification of the already-implemented durability path. **No new product capability.** **PDF/email/dispatch/client access remain unauthorized.** `productionReady = false`.

### 16.1 Dev/Test database

| Fact | Value |
| --- | --- |
| Target | Isolated H-112 full-schema catalog `eos_h112_full` |
| Bind | `127.0.0.1:5435` (`serengeti-eos-h112-full-pg`, `postgres:16-alpine`) |
| User | `eos_h112` (Dev/Test disposable; not Production) |
| Mechanism | Existing `npm run migrate -w @sedmc/db` / `migrate()` |
| Named API branch | `H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` (`EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP=true`) |
| API | `http://127.0.0.1:18116` (`EOS_LISTEN_HOST=127.0.0.1`) |
| `mixedSqlDurable` | **true** (startup log) |
| Bounded flag | unset (mutually exclusive) |
| Demo seed | `EOS_SEED_DEMO=false` |

**Not used:** Production; `127.0.0.1:5432/eos` (124-only sidecar); Gate B `127.0.0.1:5434/eos_gateb`; UAT catalogs `:5436/eos_h117_uat`, `:5439/eos_h149_uat`, `:5440/eos_h152_uat`.

### 16.2 Migration 128 application

**Before (SELECT-only):** `schema_migrations` **120** rows; latest `migrations/124_f2_dp01_commercial_facts.sql`; `issued_proposals` absent.

**Control:** CLI migrate against `127.0.0.1:5432/eos` refused `h111_eos_124_only_preserved` (exit 1, nothing applied). After this work, `eos` still has `schema_migrations` **NULL** and no `issued_proposals`. `eos_h117_uat` remained **120** rows.

**Apply (existing mechanism, `eos_h112_full` only):**

```json
{"ok":true,"applied":["migrations/125_h135_phase1_personal_data_domain.sql","migrations/126_h203_commercial_core_programme_rfp_finance.sql","migrations/127_h203_authorized_commercial_policy.sql","migrations/128_h203_issued_proposal_durability.sql"],"productionReady":false}
```

Pending files **125–127** were applied first because `migrate()` applies the chain in order; **128** was then recorded. **No 129** file exists. After: **124** `schema_migrations` rows; `to_regclass('issued_proposals')` present; trigger `issued_proposals_no_update` `BEFORE DELETE OR UPDATE` → `issued_proposals_immutable()`. History was not edited by hand.

**Production migration was not applied.**

### 16.3 Real durable API startup

First process `npx tsx src/main.ts` in `apps/api`:

- `database_migrated` `applied:[]` `namedBranch=H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` `mixedSqlDurable=true`
- `gate_b_durable_sor` per-request SQL for opportunity/RFP/programme/costing/commercial-approval
- `GET /health` 200, `productionReady: false`, identity `local-password-dev`
- `GET /ready` 200, `productionReady: false`
- Listen `http://127.0.0.1:18116`

No Production connection string was set.

### 16.4 Real issuance

Principal: `carol.admin@sedmc.local` / tenant `sedmc` (`platform.admin`).

Path: CRM org import → opportunity → RFP (`workflowStage=intake`) → programme (itinerary day Arrival / Arusha) → costing (`sellPrice` 14500, transport 1000) → C7 request (pending) → Bob approves → programme labelled **final** → C8 `POST /v1/proposals` (`PROP-H203E-Dju4bc8-MAIN`, status `approved`) → `POST /v1/issued-proposals`.

| Check | Result |
| --- | --- |
| HTTP | **201** |
| UUID | `005ec8e4-c987-42b8-b47f-e43882b74629` |
| ISS identity | `ISS-5b566d2e-0c62-42ba-a54f-8117ff923adc` (distinct from C8 id and `PROP-*`) |
| Programme / version | programme `61906a63-…`; label `final`; version **1** / `8110998e-…` |
| Issuer / authority | Carol `eeeeeeee-…` / `platform.admin` |
| C7 FK | `approvalRequestId=af585268-…` on the staff wrapper; **absent from `clientSafe`** |
| Timestamp | `issuedAt=2026-09-27T13:08:49.089Z` |
| Snapshot price | `clientSellingPrice=14500` USD |
| Delivery flags | all **false** |
| Postgres row | present with matching ISS code, C7 FK, C8 FK |

C8 create (existing C8 behaviour) moved that RFP `intake` → `proposal`. Issuance did **not** introduce a new RFP stage: after issue the RFP remained `proposal`; C8 remained `approved` (not `sent`); no `sentAt` / `clientViewedAt` / download/portal evidence.

### 16.5 Unauthorized issue

Existing principal `alice.finance@sedmc.local` (`finance.member`, no `proposal:write:proposal`, not a commercial issue authority). Same `POST /v1/issued-proposals` **before** the successful Carol issue:

| Check | Result |
| --- | --- |
| HTTP | **403** `forbidden` / `rbac` |
| `issued_proposals` count | **0** (unchanged) |
| `audit_events` `issue:issued_proposal` | **0** (no partial issue audit) |
| Programme | still `final` |
| C8 | still `approved` |

No new roles were created.

### 16.6 Database immutability

Against the live issued row:

- `UPDATE issued_proposals …` → `ERROR: issued_proposals are insert-only`
- `DELETE FROM issued_proposals …` → same error; row count remained **1**
- Application `PATCH` / `PUT` / `DELETE` `/v1/issued-proposals/:id` → **404** (routes not registered)

Trigger was not weakened.

### 16.7 Transaction / audit atomicity

No application fail-audit hook exists. A **temporary Dev/Test-only** `BEFORE INSERT` trigger on `audit_events` raised `h203_uat_forced_audit_failure` when `action = 'issue:issued_proposal'`. A separate final Programme was then issued.

| Check | Result |
| --- | --- |
| HTTP | **500** (`P0001` / `h203_uat_forced_audit_failure`) |
| `issued_proposals` count | unchanged (**2**, the prior successful rows) |
| Orphan ISS for the failed programme | **none** |

The probe trigger/function were dropped immediately. This did not change application behaviour.

### 16.8 Restart durability

API process on `:18116` was stopped (`HEALTH_DOWN`). The issued row remained in Postgres. A **new** process started against the same `eos_h112_full` URL (`database_migrated applied:[]`, `mixedSqlDurable=true`).

`GET /v1/issued-proposals/005ec8e4-…` after restart (empty process-local store):

same UUID, `ISS-*`, programme id, version 1, `clientSellingPrice=14500`, title, dates, itinerary Arrival/Arusha, issuer, `platform.admin`, `issuedAt`, delivery unimplemented.

JSONB key order on itinerary objects differed after the PG round-trip; values were unchanged.

### 16.9 Post-issue mutation

After restart: programme unlocked to `revised`, title changed to `Later mutated programme after restart`, costing line added (live `totalCost` **1000 → 1500**; live `sellPrice` override remained 14500). Re-GET issued: ISS identity, version 1, title, dates, itinerary, deposit/milestones, and `clientSellingPrice=14500` **unchanged**.

### 16.10 Tenant isolation

`partner@external.local` / `partner-demo` (existing second tenant): `GET` issued UUID **403** `rbac`; list did not expose the sedmc row. `issued_code` uniqueness is `UNIQUE (tenant_id, issued_code)`; duplicate insert of the same ISS code in tenant sedmc → `23505` `issued_proposals_tenant_id_issued_code_key`.

### 16.11 Read authorization

| Caller | Result |
| --- | --- |
| Carol (`proposal:read:proposal`) | GET **200**; list contains the row |
| Alice (no proposal read) | GET **403** `rbac` |
| Unauthenticated | GET **401** |

### 16.12 Client-safe sanitization

Staff response exposes ISS id, C8 id, C7 id, issuer, authority, timestamps **outside** `clientSafe`. `clientSafe` keys were only: `issuingEntity`, `programmeCode`, `programmeTitle`, `commercialVersionLabel`, `programmeVersionNumber`, `startDate`, `endDate`, `nights`, `paxCount`, `destinations`, `depositPercent`, `paymentMilestones`, `itinerary`, `currency`, `clientSellingPrice`. No supplier cost / GP / GM / markup / file fee / tax / FX / floor / cost lines / workflow / audit / `approvalRequestId`.

### 16.13 Public / client routes

**404** for `/v1/client/issued-proposals`, `/v1/client/proposals`, `/v1/public/issued-proposals`, `…/download`, `…/pdf`, `/portal/issued-proposals/:id`. None were added.

### 16.14 Same-day

Programme `startDate=endDate=2026-06-10` → `nightCount=0`; labelled final; issue **201**; `clientSafe.nights=0`. No new same-day policy.

### 16.15 Regression

| Suite | Result |
| --- | --- |
| Kernel `issued-proposal.test.ts` | **7 passed** |
| `h203-issued-proposal-durability.test.ts` | **11 passed** |
| `h203-client-issue-foundation.test.ts` | **9 passed** |
| `h203-authorized-commercial-policy.test.ts` | **11 passed** |
| `h203-commercial-core-programme-rfp-finance.test.ts` | **5 passed** |
| C8 / C5 / C6 | **4 / 5 / 5 passed** |
| Combined API files above + H-112 inventory | **8 files / 52 passed** |
| `packages/db` h135 + h136 | **10 passed** |
| `h112-full-schema-migrate-inventory.test.ts` | **2 passed** |

Tests were not weakened, skipped, or deleted.

### 16.16 Files changed (this UAT increment)

| Path | Change |
| --- | --- |
| `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` | This section |

No application/schema/test files were modified in this UAT increment. Migration 128 was **applied** to `eos_h112_full` only (file already present from the durability implementation).

### 16.17 Confirmations

| Item | Record |
| --- | --- |
| PDF | **Unauthorized; not implemented** |
| Email | **Unauthorized; not implemented** |
| Dispatch | **Unauthorized; not implemented** |
| Client access / GET / download / portal | **Unauthorized; not implemented** |
| Production migration applied | **No** |
| Production infrastructure / credentials | **Untouched** |
| `productionReady` | **false** (`productionReady = false`) |
| Environment | **Dev/Test only** |

---

## 17. Replacement-process continuation UAT (Dev/Test)

**Date:** 2026-09-27.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

The first mixed-SQL API process was stopped for restart proof. Continuation used the **already-running replacement** process at `http://127.0.0.1:18116` against `eos_h112_full`. The process was **not** restarted again. Persistence-under-test remained issued UUID `005ec8e4-c987-42b8-b47f-e43882b74629` / `ISS-5b566d2e-0c62-42ba-a54f-8117ff923adc`.

**No new product capability.** **PDF/email/dispatch/client access remain unauthorized.** `productionReady = false`.

| Check | Result | Evidence |
| --- | --- | --- |
| Replacement-process GET | **PASS** | Authorized Carol `GET /v1/issued-proposals/005ec8e4-…` **200** |
| Replacement-process list | **PASS** | `GET /v1/issued-proposals` **200**, list count 2, includes the ISS row |
| Same ISS identity | **PASS** | UUID, `ISS-5b566d2e-…`, version 1 / `8110998e-…`, issuer Carol, `issuedAt=2026-09-27T13:08:49.089Z`, C8 `070c16ce-…` unchanged vs pre-restart snapshot |
| Snapshot immutability | **PASS** | Canonical `clientSafe` matched the original snapshot (title still `H203 E2E Programme MAIN`, price **14500**) |
| Post-issue mutation protection | **PASS** | Live programme already `revised` / renamed; continuation further set title `Continuation mutated title` and `POST …/recalculate` `sellPrice=19999` (live cost 1500). Re-GET issued still 14500 / original title. Snapshot was **not** rebuilt from live Programme/costing |
| DB UPDATE trigger | **PASS** | `ERROR: issued_proposals are insert-only` |
| DB DELETE trigger | **PASS** | same error; row count remained 1 |
| Approval linkage | **PASS** | `approvalAuthority=platform.admin` (Dev/Test stand-in for CEO/MD / Commercial Director); `approvalRequestId=af585268-…`; C7 GET still `approved`; C7 id **absent** from `clientSafe` |
| Authorization | **PASS** | Carol GET/list 200; Alice GET/list **403** `rbac` (no ISS code in body); unauthenticated GET/list **401** |
| Tenant isolation | **PASS** | `partner-demo` GET/list **403** `rbac`; ISS code not leaked |
| Transaction atomicity | **PASS** | Replacement-process issue with temporary Dev/Test `audit_events` trigger → HTTP **500** `h203_uat_forced_audit_failure`; `issued_proposals` count stayed **2**; `issue:issued_proposal` audit count stayed **2**; original ISS GET still 200. Trigger dropped. Existing durability suite also covers mock TX rollback |
| Sanitization | **PASS** | `clientSafe` keys only authorized client fields; no supplier cost / GP / GM / markup / file-fee field / tax / FX / floor / cost lines / workflow / audit / approval IDs. Selling price 14500 present |
| No client/public routes | **PASS** | `/v1/client/…`, `/v1/public/…`, `…/download`, `…/pdf`, `/portal/…` **404** staff and anonymous |
| C8/RFP separation | **PASS** | ISS ≠ C8 UUID/`PROP-*`; C8 still `approved` (not `sent`); RFP `workflowStage=proposal`; workspace stages `intake → programme → costing → approval → proposal → sent → closed` (no `issued`/`won`); `wonLostRecord=opportunity`; `sourceOfTruth.wonLostOwner=consultant` on proposal-preparation; C8 record still GET 200; `proposalPreparation.clientIssued=false` |
| Same-day issuance | **PASS** | Persisted `ISS-ffd4cac8-…` GET 200, `clientSafe.nights=0` |
| Regression | **PASS** | Kernel 7; durability 11; client-issue 9; policy 11; core 5; C8/C5/C6 4/5/5; API combined 8 files / 52; db pointers 10; H-112 inventory 2 |
| Production untouched | **PASS** | `127.0.0.1:5432/eos` still has no `issued_proposals`; migrate 128 not applied to Production |

`platform.admin` remains the authorized Dev/Test issuance stand-in. No new roles. No new RFP stage. No PDF/email/dispatch/client access.

### 17.1 Files changed

`docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` — this section only.

---

## 18. Client Document Generation Foundation (Dev/Test)

**CLIENT DOCUMENT GENERATION FOUNDATION**

**Date:** 2026-09-27.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

**Authorization:** Owner/POA-governed increment to generate an internal client-safe PDF from an existing immutable `ISS-*` issued proposal. Dev/Test only.

PDF generation is now implemented only as an internal document-generation capability.  
PDF generation is NOT client delivery.  
Email remains unauthorized.  
Dispatch remains unauthorized.  
Client/public access remains unauthorized.  
Download/client portal access remains unauthorized.  
Production remains untouched.  
`productionReady = false`.

### 18.1 Scope

Smallest governed foundation:

- Distinct `DOC-*` document identity, referencing the source `ISS-*` record.
- PDF rendered exclusively from the persisted issued `clientSafe` snapshot.
- Insert-only Dev/Test document metadata (migration **129**) plus LocalFs artifact bytes.
- Authenticated staff generate/read only. No client, public, download, unauthenticated PDF, email, SMTP, WhatsApp, or dispatch routes.

Out of scope (stop conditions; not implemented): client download, client/public access, email, dispatch, delivery tracking, client portal, new commercial policy, new RFP stage, new approval authority, change to issued-proposal identity, change to pricing/tax/FX/fee policy, Production migration.

### 18.2 Document identity

| Identity | Role |
| --- | --- |
| RFP ID | Unchanged workflow record |
| C8 `PROP-*` | Internal proposal/workflow only |
| `ISS-*` | Immutable issued-proposal snapshot |
| `DOC-*` | Generated client-document identity |

A document record stores: document ID / `DOC-*` code, issued proposal ID / `ISS-*` code, document type `client_proposal_pdf`, sequence, generation timestamp, generating principal, generation context `internal_document_generation`, immutable reference to the ISS record, client-content SHA-256, PDF artifact SHA-256, status `generated`. There is no editable document state.

### 18.3 Source of truth

The PDF is composed only from `composeIssuedClientDocumentPayload(issued.clientSafe)`. Generation does not query live Programme, costing, C7, C8, or RFP values to populate client-facing content. Regeneration of the same ISS snapshot reproduces the same client-content hash. Generation timestamp and `DOC-*` identity are metadata, not client-content.

### 18.4 Client-safe content boundary

Allowed client-facing fields are the issued snapshot fields already authorized (Serengeti Experience DMC, programme title/code, destination, dates, nights, itinerary, inclusions/exclusions, currency, client selling price, and already-approved deposit/milestone text when present). Legal terms, cancellation penalties, tax rates, payment terms beyond snapshot fields, supplier names, hotel confirmations, statutory claims, guarantees, and signatory names are not invented.

### 18.5 Prohibited internal data

Payload sanitization (automated, before render) forbids supplier cost, internal cost lines, GP/GM/markup, separate $200 file fee, tax/FX composition, pricing floor / below-floor exception, approval request IDs, internal audit/workflow/snapshot identifiers, and non-client database IDs. The same patterns are scanned in PDF bytes.

### 18.6 Immutability model

- ISS records remain insert-only; PDF generation does not update them.
- `issued_client_documents` is insert-only (`BEFORE UPDATE OR DELETE` trigger).
- No PATCH/PUT/DELETE document routes.
- Frozen kernel records cannot be reassigned to a different ISS snapshot.

Content hash = SHA-256 of canonical JSON client payload. Artifact hash = SHA-256 of PDF bytes. Binary PDF equality is provided for the same payload because the renderer does not embed generation timestamps in the content stream. Metadata timestamps live on the document record, not in the client-content payload.

### 18.7 PDF generation behavior

`POST /v1/issued-proposal-documents` with `{ issuedProposalId }` only. Eligibility is “an existing valid ISS record”; programme/C8/RFP/costing IDs are rejected. Staff permission: `proposal:write:proposal`. `platform.admin` remains the Dev/Test stand-in. Delivery flags stay unimplemented: `ISSUED_PROPOSAL_DELIVERY.pdf/email/dispatch/clientAccess = false`. Separate flag: `ISSUED_CLIENT_DOCUMENT_GENERATION.implemented = true` with `delivery/email/dispatch/clientAccess = false`.

Staff GET `/v1/issued-proposal-documents` and `/v1/issued-proposal-documents/:id` and authenticated `/content` reuse `proposal:read:proposal`. `/content` is internal application retrieval, not a client download.

### 18.8 Artifact persistence

Migration **129** `issued_client_documents` (Dev/Test). Bytes are stored via existing LocalFs `DocumentStorage` (`storage_ref`). Insert metadata in the same durable transaction as the audit row when mixed-SQL is attached; compensate (delete) bytes if the transaction fails. In-memory Dev/Test keeps the insert-only collection `store.issuedClientDocuments`.

Applied only to `eos_h112_full`. Not applied to `eos` `:5432` or Production. Migration **128** is unchanged.

**Apply (existing mechanism, `eos_h112_full` only):**

```json
{"ok":true,"applied":["migrations/129_h203_issued_client_document.sql"],"productionReady":false}
```

After: `schema_migrations` **125** rows; `128` and `129` present; no `130`; `to_regclass('issued_client_documents')` present; trigger `issued_client_documents_no_update` `BEFORE DELETE OR UPDATE`. Control: CLI migrate against catalog `eos` remains refused (`h111_eos_124_only_preserved`). `127.0.0.1:5432/eos` still has no `issued_proposals` / `issued_client_documents`.

**Production migration was not applied.**

### 18.9 Authorization

Existing commercial proposal permissions. No new role. Unauthorized staff and unauthenticated callers are denied. Tenant isolation follows the existing principal tenant filter.

### 18.10 Failure behavior

If render or storage put fails: no document record, ISS unchanged, no email/dispatch. If metadata TX fails: bytes compensated, no successful document row, ISS unchanged.

### 18.11 Test evidence

| Suite | Result |
| --- | --- |
| Kernel `issued-client-document.test.ts` | **4 passed** |
| Kernel `issued-proposal.test.ts` | **7 passed** |
| `h203-client-document-generation.test.ts` | **9 passed** |
| `h203-issued-proposal-durability.test.ts` | **11 passed** |
| `h203-client-issue-foundation.test.ts` | **9 passed** |
| `h203-authorized-commercial-policy.test.ts` | **11 passed** |
| `h203-commercial-core-programme-rfp-finance.test.ts` | **5 passed** |
| C8 / C5 / C6 | **4 / 5 / 5 passed** |
| Combined API files (durability, client-issue, policy, core, C8/C5/C6, H-112 inventory) | **8 files / 52 passed** |
| `packages/db` h135 + h136 | **10 passed** |
| `h112-full-schema-migrate-inventory.test.ts` | **2 passed** |

### 18.12 Production status

| Item | Record |
| --- | --- |
| PDF generation | **Implemented internally; not delivery** |
| Email | **Unauthorized; not implemented** |
| Dispatch | **Unauthorized; not implemented** |
| Client/public GET / download / portal | **Unauthorized; not implemented** |
| Production migration applied | **No** |
| `productionReady` | **false** (`productionReady = false`) |
| Environment | **Dev/Test only** |

RFP stages remain `intake → programme → costing → approval → proposal → sent → closed`. C8 remains an internal proposal/workflow record. `C8 sent` remains an internal workflow stamp and is NOT delivery. `ISS-*` remains the immutable issued-proposal identity. `DOC-*` is the generated-document identity. No `document sent` / `delivered` RFP stage.

---

## 19. Client Document durable persistence + restart UAT (Dev/Test)

**Date:** 2026-09-27.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

This increment is integrity verification of the already-implemented Client Document Generation Foundation on the real mixed-SQL path. **No architecture redesign.** **No migration 130.** `productionReady = false`.

Client-document generation is internally durable, but PDF generation is not client delivery.

Email, dispatch, client/public access, portal/download, and external delivery remain unauthorized.

### 19.1 Execution path

| Fact | Value |
| --- | --- |
| Catalog | Isolated H-112 full-schema `eos_h112_full` |
| Bind | `127.0.0.1:5435` (`serengeti-eos-h112-full-pg`) |
| User | `eos_h112` (Dev/Test disposable) |
| Named API branch | `H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` |
| API | `http://127.0.0.1:18116` |
| `mixedSqlDurable` | **true** (`database_migrated` `applied:[]`) |
| Artifact store | Existing LocalFs `DocumentStorage` |
| `EOS_DOCUMENT_ROOT` | `%TEMP%\serengeti-eos-h203-doc-uat` (pinned for restart) |
| Migration | **129** already applied; not re-applied; no **130** |
| Preview `:8080` | In-memory; **not** used as evidence |

The process that had been running on `:18116` since the issued-proposal UAT **predated** document-generation routes (unauthenticated `GET /v1/issued-proposal-documents` **404**). It was stopped (`HEALTH_DOWN`). A new mixed-SQL process was started with current code against the **same** catalog and a pinned document root. That process generated the DOC. It was then stopped (`HEALTH_DOWN`, owning PID 31624). A **replacement** process started against the **same** URL, catalog, and LocalFs root (`database_migrated applied:[]`, `mixedSqlDurable=true`). Retrieval did **not** regenerate.

**Not used:** Production; `127.0.0.1:5432/eos`; Gate B; UAT catalogs.

### 19.2 Real mixed-SQL generation

Authorized Carol `POST /v1/issued-proposal-documents` `{ "issuedProposalId": "005ec8e4-c987-42b8-b47f-e43882b74629" }` → **201**.

| Field | Value |
| --- | --- |
| DOC UUID | `567533d3-1fc3-4ee1-901f-541bfe9d8f13` |
| DOC code | `DOC-7d88205b-387a-4399-b4f1-14e472fa03b0` |
| ISS UUID | `005ec8e4-c987-42b8-b47f-e43882b74629` |
| ISS code | `ISS-5b566d2e-0c62-42ba-a54f-8117ff923adc` |
| Sequence | **1** |
| Principal | Carol `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee` / `platform.admin` |
| `generatedAt` | `2026-09-27T15:09:35.220Z` |
| Content SHA-256 | `a89156f6e982336750c29b568cca655a3295fcaeff1b38b0ce013bd3cb854c7e` |
| Artifact SHA-256 | `ea860dc30308b91627a08ac2ad740fad4991c02f6fc5567b010aaf4289edf8cb` |
| `storage_ref` | `11111111-1111-4111-8111-111111111111/567533d3-1fc3-4ee1-901f-541bfe9d8f13` |
| Snapshot price / title | **14500** USD / `H203 E2E Programme MAIN` |
| `generation` | `implemented=true`, `delivery/email/dispatch/clientAccess=false` |
| `delivery` | `ISSUED_PROPOSAL_DELIVERY` unchanged (all false) |

This was **not** a kernel-only test.

### 19.3 Postgres row

`SELECT` on `issued_client_documents` matched the HTTP record: DOC/ISS identities, sequence 1, Carol principal, timestamp, both hashes, `storage_ref`, `immutable=t`, `status=generated`. `client_content` title `H203 E2E Programme MAIN`, price **14500**, `issuedCode` ISS, `supplierCost` / `approvalRequestId` keys **absent**. The row exists independently of process memory.

The row was **not** modified.

### 19.4 LocalFs artifact

File present at the pinned root. Header `%PDF-`, size **1242**. File SHA-256 **equals** recorded artifact hash `ea860dc3…`. PDF text contains original programme title and **14500**; does **not** match supplierCost / GP / GM / markup / fileFee / approvalRequest / taxAmount / fxRate.

### 19.5 Live API retrieval (pre-restart)

`GET /v1/issued-proposal-documents/567533d3-…` **200** — metadata matched the Postgres row.  
`GET …/content` **200** (authenticated staff only) — decoded PDF SHA-256 `ea860dc3…`. Not anonymous, not client/public download.

### 19.6 Replacement-process retrieval

Replacement `GET` metadata **200**: same DOC id/code, ISS reference, sequence **1**, both hashes, `storage_ref`, `generatedAt`, generating principal, client-facing title/price **14500**.  
Replacement `GET …/content` **200**: PDF SHA-256 still `ea860dc3…`; original title present; live mutated title absent; **14500** present; **19999** absent.

JSONB key order on `clientContent` differed after the PG round-trip (`nights` first vs `issuingEntity` first on POST). Values were unchanged. Stored content hash was **not** recomputed from live records.

### 19.7 Live-data mutation isolation

After replacement-process retrieval, live programme title set to `Post-restart mutated programme for DOC UAT` (`commercialVersionLabel=revised`) and costing `sellPrice=22222` (`clientSellingPrice=22222`, `totalCost=1500`). Re-GET DOC: title still `H203 E2E Programme MAIN`, price **14500**, hashes/sequence/ISS/`generatedAt` unchanged. ISS `clientSafe` still 14500 / original title.

### 19.8 Regeneration

The implementation **creates a new DOC identity/sequence** from the same ISS. Observed:

| Seq | DOC code | Content hash | Artifact hash |
| --- | --- | --- | --- |
| 1 | `DOC-7d88205b-…` | `a89156f6…` | `ea860dc3…` |
| 2 | `DOC-1a945da8-…` | `a89156f6…` | `ea860dc3…` |
| 3 | `DOC-4a333dc2-…` | `a89156f6…` | `ea860dc3…` |

Original sequence-1 row was not mutated. Regenerated payloads still used the ISS snapshot (14500 / original title), not live 19999/22222.

### 19.9 Database immutability

`UPDATE issued_client_documents SET immutable = false WHERE id = '567533d3-…'` → `ERROR: issued_client_documents are insert-only`.  
`DELETE FROM issued_client_documents WHERE id = '567533d3-…'` → same error.  
Row count remained **3**. Trigger was not weakened.

### 19.10 Failure atomicity

**A. Artifact storage failure.** Existing controlled test `h203-client-document-generation.test.ts` (“leaves the ISS record unchanged when PDF persistence fails”): put throws → HTTP ≥500, no DOC record, ISS unchanged. Not re-manufactured on the live listener (would require breaking the shared LocalFs root).

**B. Database transaction failure (live).** Temporary `AFTER INSERT` trigger `h203_uat_forced_document_failure` on `issued_client_documents`. Carol POST → **500** `P0001` `h203_uat_forced_document_failure`. `issued_client_documents` count stayed **3**; LocalFs file count stayed **3** (bytes compensated); ISS row count stayed **1**. Trigger/function dropped immediately.

### 19.11 Authorization

| Caller | POST | GET metadata | GET content |
| --- | --- | --- | --- |
| Carol | **201** | **200** | **200** |
| Alice (`finance.member`) | **403** `{"error":"forbidden","reason":"rbac"}` | **403** same | **403** same |
| Unauthenticated | **401** `{"error":"unauthenticated"}` | **401** same | **401** same |

Unauthorized bodies did not contain DOC/ISS identities, hashes, or `storage_ref`. No new roles.

### 19.12 Tenant isolation

`partner@external.local` / `partner-demo`: GET metadata, GET content, and list all **403** `{"error":"forbidden","reason":"rbac"}`. DOC metadata, PDF bytes, and `storage_ref` were not leaked.

This is **RBAC 403**, not a tenant-SQL `404`. Cross-tenant SQL visibility was **not** claimed.

### 19.13 Sanitization (post-replacement)

Replacement GET `clientContent` and PDF bytes: Serengeti Experience DMC, original title, itinerary Arrival/Arusha, currency USD, **14500**. No supplier cost, cost lines, GP/GM/markup, separate file fee, tax/FX composition, floor exception, approval IDs, audit/workflow/snapshot internals.

### 19.14 Route / email / dispatch / C8-RFP

Staff and anonymous **404** for `/v1/client/issued-proposal-documents`, `/v1/public/issued-proposal-documents`, `…/:id/download`, `…/:id/pdf`, `/v1/public/download`, `/portal/…`. Authenticated `…/:id/content` is staff-only (401 without token).

Email outbox `{items:[]}`; email health `adapter=dev-outbox`, `smtpConfigured=false`, `sesConfigured=false`, `deliveryEventCount=0`. `generation.email/dispatch=false`. `ISSUED_PROPOSAL_DELIVERY` unchanged.

ISS ≠ C8 UUID/`PROP-H203E-Dju4bc8-MAIN`; DOC ≠ ISS. C8 still `approved` (not treated as delivery). RFP `workflowStage=proposal`. Workspace stages `intake → programme → costing → approval → proposal → sent → closed`. `wonLostRecord=opportunity`; `sourceOfTruth.wonLostOwner=consultant`. `proposalPreparation.clientIssued=false`.

### 19.15 Regression

| Suite | Result |
| --- | --- |
| Kernel issued-client-document + issued-proposal | **4 + 7 passed** |
| `h203-client-document-generation.test.ts` | **9 passed** |
| Durability / client-issue / policy / core / C8 / C5 / C6 / H-112 | included in **9 files / 61 passed** |
| `packages/db` h135 + h136 | **10 passed** |

Pointer tests still expect last migration **129** / no **130**. Tests were not weakened.

### 19.16 Production / repo

`127.0.0.1:5432/eos` still has no `issued_proposals` / `issued_client_documents`. `eos_h112_full` `schema_migrations` **125** rows; **128** and **129** present; no **130**. Production migration not applied.

HEAD `75ee4c3`. Index empty. Porcelain **762**. No commit. No push. `productionReady = false`.

---

## 20. Replacement-process continuation UAT — client document durability (Dev/Test)

**Date:** 2026-09-27.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

The prior API process exits were intentional `HEALTH_DOWN` lifecycle stops for restart UAT and were not crashes.

This continuation used the **already-running replacement** mixed-SQL process at `http://127.0.0.1:18116` against `eos_h112_full`. **The replacement process was not restarted again.** Health `ok`, `applicationReady=true`, `database.ok=true`, `productionReady=false`.

Test subject is the already-generated sequence-1 document. **No new DOC was generated to replace the test subject.**

Client-document generation is internally durable. PDF generation is not client delivery.

Email, dispatch, client/public access, portal/download, and external delivery remain unauthorized.

### 20.1 Document under test

| Field | Value |
| --- | --- |
| DOC UUID | `567533d3-1fc3-4ee1-901f-541bfe9d8f13` |
| DOC code | `DOC-7d88205b-387a-4399-b4f1-14e472fa03b0` |
| ISS UUID | `005ec8e4-c987-42b8-b47f-e43882b74629` |
| ISS code | `ISS-5b566d2e-0c62-42ba-a54f-8117ff923adc` |
| Sequence | **1** |
| Content SHA-256 | `a89156f6e982336750c29b568cca655a3295fcaeff1b38b0ce013bd3cb854c7e` |
| Artifact SHA-256 | `ea860dc30308b91627a08ac2ad740fad4991c02f6fc5567b010aaf4289edf8cb` |
| `storage_ref` | `11111111-1111-4111-8111-111111111111/567533d3-1fc3-4ee1-901f-541bfe9d8f13` |
| `generatedAt` | `2026-09-27T15:09:35.220Z` |
| Principal | Carol `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee` |

### 20.2 Replacement-process GET

Authorized Carol `GET /v1/issued-proposal-documents/567533d3-…` **200**. DOC id/code, ISS reference, sequence 1, principal, `generatedAt`, both hashes, and `storage_ref` matched the pre-restart record. `generation.email/dispatch=false`. `delivery` remains `ISSUED_PROPOSAL_DELIVERY` (all false).

### 20.3 Replacement-process PDF

`GET …/content` **200** (staff auth required). Bytes start `%PDF-1.4`. SHA-256 of returned bytes = `ea860dc3…` (equals recorded artifact hash). Client-facing title `H203 E2E Programme MAIN` and **14500** present. No supplierCost / GP / GM / markup / fileFee / approvalRequest / taxAmount / fxRate. Document was **not** regenerated for this retrieval.

### 20.4 Postgres and LocalFs

`issued_client_documents` row matches the API response (immutable, generated, hashes, ISS FK). File exists at the pinned LocalFs path; file SHA-256 = API = DB = original. Size 1242. Row was not modified.

`schema_migrations` **125** rows; **128** and **129** present; no **130**. `:5432/eos` still has no `issued_client_documents` / `issued_proposals`. Production not migrated.

### 20.5 Live-data mutation isolation

Through this same replacement process: programme title → `Continuation UAT mutated title after replacement GET`; costing `sellPrice` / `clientSellingPrice` → **23333**. Re-GET DOC and PDF: identity, ISS, sequence, `generatedAt`, both hashes unchanged; title still original; price still **14500**; live title and **23333** absent from PDF.

### 20.6 Database immutability

`UPDATE` and `DELETE` on the DOC row → `ERROR: issued_client_documents are insert-only`. Trigger remains. Row still present; subsequent GET **200**. Artifact still present.

### 20.7 Authorization and tenant

| Caller | GET metadata | GET content |
| --- | --- | --- |
| Carol | **200** | **200** |
| Alice | **403** `{"error":"forbidden","reason":"rbac"}` | **403** same |
| Unauthenticated | **401** `{"error":"unauthenticated"}` | **401** same |
| `partner-demo` | **403** `rbac` | **403** `rbac` (list also **403**) |

Unauthorized bodies did not contain DOC/ISS/hash/`storage_ref`. Tenant result is **RBAC 403**, not SQL `404`. No new roles.

### 20.8 Failure atomicity

**Artifact write failure:** existing test in `h203-client-document-generation.test.ts` (put throws → ≥500, no DOC, ISS unchanged). Re-run this increment: that file **9 passed**. Not re-injected on the live shared LocalFs root.

**Transaction failure (live, this process):** temporary `AFTER INSERT` trigger → POST **500** `P0001` `h203_uat_forced_document_failure`; document count stayed **3**; LocalFs file count stayed **3**; ISS stayed **1**; original DOC GET still **200**. Trigger/function dropped immediately.

### 20.9 Routes / email / C8-RFP

Staff and anonymous **404** for `/v1/client/…`, `/v1/public/…`, `…/download`, `…/pdf`, `/portal/…`. `…/content` remains authenticated internal retrieval.

Outbox `{items:[]}`. Email health `adapter=dev-outbox`, `outboxCount=0`, `deliveryEventCount=0`. DOC ≠ ISS ≠ C8 `PROP-H203E-Dju4bc8-MAIN`. C8 still `approved`. RFP stages `intake → programme → costing → approval → proposal → sent → closed`; current `proposal`; `wonLostRecord=opportunity`; `wonLostOwner=consultant`; `clientIssued=false`.

### 20.10 Regression

Kernel issued-client-document **4** + issued-proposal **7**. API combined **9 files / 61 passed** (generation 9, durability 11, client-issue 9, policy 11, core 5, C8/C5/C6 4/5/5, H-112 2). `packages/db` h135+h136 **10**. Pointer last migration **129** / no **130**. Tests not weakened.

### 20.11 Files changed

`docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` — this section. No application/schema change. No commit. `productionReady = false`.

---

## 21. External delivery — governance and design gate (NOT AUTHORIZED)

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

**Nature of this increment:** governance/design assessment only. No email, SMTP, dispatch, client/public routes, download, portal, delivery queue, delivery tracking code, provider connection, ISS/DOC/RFP/policy/schema change, or migration 130. No external message was sent. No external recipient was contacted. Production remains untouched. `productionReady = false`.

**Verified internal foundation (do not modify in this gate):**

`Final Programme → ISS-* → DOC-* → PDF artifact`

Internal ISS/DOC persistence, immutability, hash integrity, staff retrieval, sanitization, failure atomicity, and RBAC/tenant boundary passed Dev/Test (§13–§20). Migration **128** and **129** present; **no 130**.

**Required statements:**

- Durable DOC foundation is complete in Dev/Test.
- PDF generation is internal only.
- External delivery remains unauthorized.
- Client-document generation is internally durable. PDF generation is not client delivery.
- Email, dispatch, client/public access, portal/download, and external delivery remain unauthorized.

This gate does **not** authorize implementation. Recording a proposed contract is not a send capability.

### 21.1 How to read this section

| Label | Meaning |
| --- | --- |
| **APPROVED POLICY** | Already closed in this artefact (especially §10, §12.6 A–K, and the ISS/DOC implementation records). Binding. Not reopened here. |
| **PROPOSED DESIGN** | Engineering recommendation for a *future* increment. Not approved. Not implemented. |
| **UNRESOLVED — owner/POA** | Required before any delivery code. Not a decision. Must not be treated as implied by ISS or DOC existence. |

Existing H-203 authority to **issue** a commercial proposal and to **generate** an internal PDF is **not** automatically authority to **transmit** that PDF externally.

### 21.2 APPROVED POLICY that already constrains delivery

These remain binding. They are not new decisions.

| Id | Binding rule |
| --- | --- |
| **H** | Email delivery requires a **separately defined and authorized contract** covering at least: recipient source; recipient validation; sender identity; template; attachment/document identity; delivery status; failure behavior. **No automatic external email is authorized.** |
| **I** | Dispatch must preserve: **approved commercial version → issued proposal identity → delivery attempt → delivery result**. Retries must **not** silently alter the underlying commercial document. A failed dispatch must **not** imply successful client delivery. |
| **J** | Unauthenticated client access is **not authorized by default**. Any client-access/link/download/portal requires a separate authorization. |
| **E** | **Creation of ISS-*** requires explicit attributable approval by **CEO/MD** or **Commercial Director** (`platform.admin` is the Dev/Test stand-in). |
| **G** | Client-facing output may include client-safe programme/commercial information and the **final client selling price**. Internal cost, GP/GM, markup, $200 file fee, tax/FX composition, below-floor exception, approval IDs, snapshots, cost lines, and workflow/audit data **must not** appear in client-issued output. |
| **D / C** | C8 `sent` and RFP `sent` are **not** delivery evidence. No new RFP stage. |
| **A** | ISS is distinct from C8 `PROP-*`. DOC is distinct from ISS (implemented later; not a delivery identity). |
| Confidentiality / staff GET | `GET /v1/issued-proposal-documents/:id/content` is **authenticated staff retrieval**, not client delivery. |
| Personal-data direction (H-131/H-133) | Ordinary persistence of individual client personal emails is **not** an approved commercial default. Recipient storage for delivery must not silently contradict that direction. |
| Production email | Production email product remains **UNSELECTED**. Production-like environments already refuse silent stub/outbox substitution. |

**H and I close the requirement that a contract exist. They do not close the contents of recipient, send-authorization, superseded-document, or channel (attachment vs link) rules.** Those contents remain owner/POA items below.

### 21.3 Delivery object — PROPOSED DESIGN

DOC must **not** become the delivery identity. A document can exist without ever being sent. A send can fail, retry, or be cancelled without mutating DOC or ISS.

**PROPOSED DESIGN** (not approved, not implemented):

- Distinct immutable **delivery** identity: `DEL-{uuid}`
- Distinct append-only **attempt** identity: `DLA-{uuid}` (or `DEL-*` + monotonic `attemptNumber`)
- Relationship: **`Delivery → DOC → ISS`**
- ISS remains the frozen commercial snapshot.
- DOC remains the frozen PDF artifact.
- Delivery/attempt records the transmission event.
- Identities remain distinct from RFP, C8 `PROP-*`, `ISS-*`, and `DOC-*`.

This matches **I** (attempt/result distinct from issued identity) and retry/audit needs. Exact code prefix is design, not policy.

**Existing policy sufficient?** Yes for *distinct attempt identity* (**I**).  
**New owner/POA decision required?** No for distinctness. Yes only if Owner instead wants DOC or ISS to *be* the delivery identity (that would conflict with **I**).

### 21.4 Delivery eligibility

**APPROVED POLICY already requires, in substance:**

1. DOC exists (no send without a generated document).
2. DOC references an immutable ISS.
3. ISS was created under **E** (CEO/MD or Commercial Director / Dev/Test `platform.admin` stand-in).
4. DOC represents the ISS `clientSafe` snapshot (generation contract).
5. PDF artifact exists and its bytes match the recorded artifact SHA-256 (**PROPOSED DESIGN** fail-closed check at send time; see §21.12).
6. Document remains client-safe (**G**).
10. Failed delivery must never be represented as successful delivery (**I**).

**UNRESOLVED — owner/POA (do not invent):**

7. **What counts as explicit authorization to transmit** (ISS approval vs a separate send approval vs a staff send action under existing commercial roles).
8. **Recipient identity/address source** (see §21.6). **H** requires this to be defined; it does not define it.
9. **Whether a superseded DOC may be sent** (see §21.13).

Until 7–9 are closed **and** an implementation increment is explicitly authorized, no document is eligible for external delivery.

### 21.5 Who may authorize delivery

Distinguish three acts. They are **not** automatically equivalent.

| Act | What existing policy covers | Status |
| --- | --- | --- |
| Authority to **issue** the commercial proposal (`ISS-*`) | **E**: CEO/MD or Commercial Director; Dev/Test `platform.admin` stand-in | **APPROVED POLICY** for ISS creation |
| Authority to **generate** the PDF (`DOC-*`) | Authorized as **internal** generation from a valid ISS; staff `proposal:write:proposal`; not delivery | **APPROVED** as internal generation only |
| Authority to **transmit** the PDF externally | **H** requires a separate email contract. **E** does not mention send. Existing roles are not an automatic send grant. | **UNRESOLVED — owner/POA** |

**PROPOSED DESIGN** (not approved): do not treat ISS creation or PDF generation as send authorization. Require an explicit, attributable send decision by the same commercial authorities (CEO/MD or Commercial Director; Dev/Test `platform.admin` stand-in only). Do not create a new role unless Owner rejects reuse of those authorities.

**Existing policy sufficient?** No — **E** is issue, not transmit.  
**New owner/POA decision required?** **Yes.** Options Owner must choose:

- **B1.** ISS approval + later staff send by CEO/MD or CD (`platform.admin` stand-in in Dev/Test) is sufficient.
- **B2.** Each external transmission needs a distinct attributable send approval (same roles, separate act).
- **B3.** A new role is required (only if Owner states a governance reason; none is invented here).

No new role is created in this gate.

### 21.6 Recipient safety — contract required by H; contents UNRESOLVED

**H** requires recipient source and validation. The following answers are **not invented as policy**. Current facts:

- No approved H-203 recipient-source rule exists.
- Notification allowlists and `/v1/notifications/email/dispatch-*` are **internal ops digest**, not a client-proposal channel (§12.1).
- H-131/H-133 direct EOS **away from** ordinary persistence of individual client personal emails.

**UNRESOLVED — owner/POA** (every row):

| Question | Why it is unresolved |
| --- | --- |
| Where does the recipient email originate? | **H** names the field; does not source it. CRM/contact personal email is in tension with H-133. |
| Is the address mutable after authorization? | Not decided. **PROPOSED DESIGN:** freeze the authorized recipient on the delivery record; changing recipient is a new delivery, not a mutation. |
| Confirmation before send? | Not decided. |
| Multiple recipients? CC/BCC? | Not decided. **PROPOSED DESIGN until decided:** single explicit To; no CC/BCC. |
| Internal SEDMC recipients allowed? | Not decided. Dev/Test must still never reach a real client. |
| Invalid address handling | **PROPOSED DESIGN:** reject before queue; status `failed`; **failure ≠ delivery**. |
| Accidental external disclosure | **PROPOSED DESIGN:** Dev/Test allowlist/mock only; Production forbids stub/outbox; no send without authorized recipient + integrity check. |
| Address unrelated to the RFP/Opportunity? | Not decided. Must not be assumed permitted. |

Do not implement address collection or validation in this gate.

**Existing policy sufficient?** No.  
**New owner/POA decision required?** **Yes** (source, mutability, multiplicity, internal vs client, relatedness).

### 21.7 What is delivered

**Default candidate (PROPOSED DESIGN):** the immutable PDF artifact referenced by the DOC (bytes whose SHA-256 equals `artifactSha256`).

| Channel | Policy status |
| --- | --- |
| PDF **attachment** on an authorized outbound message | Covered as a *possible* H contract element; **not authorized to implement** |
| **Secure link** / client download / portal | **J**: not authorized by default. Would be a separate client-access increment |
| Both | Not authorized |

**APPROVED POLICY:**

- Internal `GET /v1/issued-proposal-documents/:id/content` remains **staff-authenticated internal retrieval**.
- That endpoint **must not** become a client delivery mechanism, public download, or unauthenticated PDF access.
- Existence of a DOC does **not** make any external capability reachable.

**PROPOSED DESIGN:** first future delivery increment, if authorized, should be **attachment of the existing PDF** under the H/I contract — not a client link. A link would reopen **J**.

**Existing policy sufficient?** Sufficient to forbid treating staff GET as delivery and to forbid public links by default (**J**). Not sufficient to authorize attachment send.  
**New owner/POA decision required?** **Yes** to authorize the attachment channel (and separately if a link is ever wanted).

### 21.8 Delivery state machine — PROPOSED DESIGN

Do not implement. Smallest lifecycle that satisfies **I**:

```text
requested → authorized → queued → accepted_by_provider → (optional) provider_confirmed
                 ↘ failed
                 ↘ cancelled
```

Vocabulary (proposed; not approved nicknames):

| Term | Meaning |
| --- | --- |
| `requested` | Staff asked to send; not yet authorized and not sent |
| `authorized` | Attributable send decision recorded; not sent |
| `queued` | Durable outbox row exists; not sent |
| `accepted_by_provider` | Outbound provider accepted the message (e.g. SMTP `250` / provider message id). **Not** recipient mailbox proof |
| `provider_confirmed` | Only if a later provider delivery/bounce event exists and is recorded separately |
| `failed` / `cancelled` | Terminal unsuccessful. **failure ≠ delivery** |
| Opening / viewing | **Not delivery.** Not in this lifecycle. Would be **J**-adjacent |

Do **not** name provider acceptance `delivered`. Do **not** claim delivery because an API returned 200. C8/RFP `sent` remain unrelated stamps (**D**/**C**).

Retry creates a **new attempt** (`DLA-*`); it does not mutate the delivery header’s DOC/ISS/hash or the PDF.

**Existing policy sufficient?** Yes for attempt/result and failure≠success (**I**).  
**New owner/POA decision required?** Yes only if Owner wants `sent` to mean recipient-mailbox delivery (not recommended; would over-claim).

### 21.9 Retry semantics — PROPOSED DESIGN

Grounded in **I**: retries must not silently alter the commercial document.

| Rule | Proposed |
| --- | --- |
| Failed send may be retried | Yes, as a **new attempt**, after eligibility/integrity still pass |
| Each retry has an attempt identity | Yes (`DLA-*` / attempt number) |
| Retry may alter DOC | **No** |
| Retry may alter PDF | **No** — reuse the same artifact bytes and `artifactSha256` |
| Retry may alter recipient | **UNRESOLVED — owner/POA.** Proposed: no; recipient change is a new `DEL-*` |
| Duplicate delivery | Represent as a **second attempt** or reject as idempotent replay; never as a mutated DOC |
| Same PDF/hash | **Yes:** `Delivery Attempt → same DOC → same ISS` unless a **new DOC** was explicitly generated and (if required) newly authorized |

**Existing policy sufficient?** Yes for “same commercial document.”  
**New owner/POA decision required?** Recipient-change-on-retry, and whether retry needs a fresh send approval.

### 21.10 Idempotency — PROPOSED DESIGN

Prevent duplicate sends from double-click, API retry, worker retry, network/provider timeout, and process restart. Do **not** rely on an in-memory flag.

**PROPOSED DESIGN:** persist an idempotency key on the delivery/attempt row, unique per tenant. Candidate key:

`tenantId + issuedClientDocumentId + normalizedRecipient + clientIdempotencyKey`

Replay of the same key returns the **existing** delivery/attempt and must not enqueue a second provider call. Timeout after provider uncertainty is **not** success; it is `failed` or `queued` until a durable provider reference exists. Process restart resumes from the durable outbox, not from RAM.

**Existing policy sufficient?** Principle yes (**I**). Mechanism is design.  
**New owner/POA decision required?** No for “durable idempotency required.”

### 21.11 Audit chain — PROPOSED DESIGN

Durable, insert-oriented records (delivery + attempts). Internal audit **must never** enter the client-facing PDF (**G**).

Minimum fields to evaluate (proposed):

- delivery identity (`DEL-*`)
- attempt identity / number (`DLA-*`)
- DOC identity and code
- ISS identity and code
- recipient (as authorized; personal-data handling **UNRESOLVED**)
- authorization principal and timestamp
- request timestamp
- send-attempt timestamp
- provider name / message id / response (no secrets)
- status and failure reason
- PDF `artifactSha256` and `contentSha256` copied from DOC at authorize/send time
- actor/principal, tenant, account/opportunity/RFP ids as already bound through ISS

Provider is **not** source of truth for the commercial document. DOC/ISS remain source of truth for content.

**Existing policy sufficient?** Yes for the chain shape (**I**) and PDF exclusion (**G**).  
**New owner/POA decision required?** How recipient personal data is stored vs H-133.

### 21.12 Provider boundary — PROPOSED DESIGN

| Option | Assessment |
| --- | --- |
| Existing notification digest adapter | **Reject as the client-proposal path.** It is internal ops email (§12.1). |
| Generic `notif_email_outbox` reuse | Insufficient as commercial source of truth; no DOC/ISS/attempt model |
| Dedicated commercial delivery outbox | **PROPOSED DESIGN** for a future increment |
| Production SES/SMTP | **UNSELECTED.** Do not install or connect. Do not send a test email. |

A future provider integration must support failure, timeout, retry, duplicate suppression, provider acknowledgement, and bounce/delivery events **where the provider actually supplies them**. EOS records those as provider facts. They do not mutate ISS or DOC.

**Existing policy sufficient?** Sufficient to forbid treating current notification dispatch as proposal delivery.  
**New owner/POA decision required?** **Yes** for Production email product/DPA (already open at platform level). Dev/Test mock/outbox may be used **only** if implementation is later authorized and never reaches a real client.

### 21.13 Document integrity at send time — PROPOSED DESIGN

Before any provider call:

1. Re-read DOC; confirm `issuedProposalId` unchanged.
2. Read artifact bytes from `storage_ref`.
3. Compute SHA-256; require equality with DOC `artifactSha256` (and generation-time hash).
4. Re-run client-safe checks on stored `clientContent` (**G**).

If either ISS reference or artifact integrity fails: **do not send**. Record `failed` with a non-success reason. Do not repair by regenerating a PDF inside the send path.

**APPROVED principle:** do not send a document whose persisted artifact integrity cannot be established.

**Existing policy sufficient?** Yes as fail-closed integrity.  
**New owner/POA decision required?** No.

### 21.14 Stale / superseded documents — UNRESOLVED

Scenario: DOC-1 from ISS-1 exists; later ISS-2/DOC-2 exist; someone attempts to send DOC-1.

| Option | Meaning |
| --- | --- |
| **S1** | DOC-1 remains sendable because it is an immutable authorized snapshot |
| **S2** | DOC-1 is superseded; send requires renewed authorization (and possibly only the latest DOC) |

**Not chosen.** Silent default would be a commercial-policy invention.

**Existing policy sufficient?** No.  
**New owner/POA decision required?** **Yes.**

### 21.15 External vs internal boundary (preserve)

**Internal (exists; not delivery):** programme, costing, C8 preparation, ISS, DOC generation, staff PDF retrieval.

**External (unauthorized; not reachable because a DOC exists):** email transmission, delivery provider, recipient, delivery acknowledgement, client access.

C8/RFP `sent` stay internal workflow stamps.

### 21.16 Failure semantics — PROPOSED DESIGN

**APPROVED POLICY:** **failure ≠ delivery** (**I**).

| Failure | Proposed behavior |
| --- | --- |
| Invalid recipient | Reject; no provider call; `failed` |
| Provider unavailable / timeout / reject | `failed` or remain `queued`; not success; retry = new attempt |
| Provider accepts, later bounce | `accepted_by_provider` plus later failure event; **not** rewritten as never-sent; **not** “delivered” |
| API/worker restart | Resume durable outbox; in-memory flags ignored |
| Database failure | No false-success HTTP; no “sent” |
| Artifact missing / hash mismatch | Do not send |
| Authorization revoked before send | Do not send |
| Duplicate send request | Idempotent replay of existing attempt; no second provider call |

**Provider acceptance ≠ confirmed recipient delivery**, unless a later owner-authorized mapping to a specific provider event is recorded. HTTP 200 is never delivery evidence.

**Existing policy sufficient?** Yes for failure≠success.  
**New owner/POA decision required?** No for the principle; yes if Owner wants a specific provider’s bounce webhook to change commercial status.

### 21.17 Production gate

Any future external-delivery **implementation** requires **explicit Production authorization** in addition to Dev/Test implementation authorization.

**PROPOSED DESIGN safeguards (not an implementation):**

- Dev/Test may use `platform.admin`, a Dev/Test outbox, and a fake/mock provider.
- Dev/Test must **never** accidentally reach a real client (allowlist/mock; no live SMTP/SES to client domains unless separately authorized — none is).
- Production-like env already refuses silent stub/outbox substitution.
- Production email product remains UNSELECTED until Owner/infra select it.
- `productionReady` remains **false** until a later Production readiness gate.
- No migration 130 in this gate; no Production migration.
- Staff content GET remains internal.

**Existing policy sufficient?** Yes to keep Production closed.  
**New owner/POA decision required?** **Yes** before any Production send path (provider, DPA, real recipients).

### 21.18 Proposed minimum architecture (future; do not build now)

Only after unresolved owner/POA items are closed **and** an implementation increment is explicitly authorized:

1. Kernel: delivery eligibility, integrity check, idempotency key, attempt state — no SMTP.
2. Insert-only Dev/Test tables for `DEL-*` / attempts (would be a **future** migration, not 130 in this gate).
3. Dedicated commercial delivery outbox, distinct from notification digest dispatch.
4. Staff-only authorize/request endpoints; **no** `/v1/client`, `/v1/public`, `/download`, `/pdf`, `/portal`.
5. Mock provider in Dev/Test; refuse real client send.
6. Leave ISS, DOC, RFP stages, C8 `sent`, and `GET …/content` unchanged.

Smallest subsequent implementation action, **if and only if** Owner closes §21.5–§21.7, §21.14, and recipient rules **and** then issues an implementation authorization: a Dev/Test-only `DEL-*` persistence + mock-provider attempt recorder that **still does not send email**. **That action is not authorized and is not executed in this gate.**

Required decisions are **not** all covered. Design **must not** proceed to delivery code on this assessment alone.

### 21.19 Unresolved policy questions (Owner/POA)

1. Is transmit authority distinct from ISS issue authority (B1 / B2 / B3)?
2. Recipient source, validation, confirmation, multiplicity, CC/BCC, internal SEDMC, and relatedness to RFP/Opportunity?
3. How is recipient personal data stored without contradicting H-131/H-133?
4. Attachment only, or is a client link ever in scope (**J**)?
5. May a superseded DOC (DOC-1 after ISS-2/DOC-2) be sent (S1 vs S2)?
6. Production email product / DPA / real recipients?
7. Does retry require a new send approval? May retry change recipient?

Until these are closed in an Owner/Commercial Director record, contributors must not implement email, SMTP, dispatch, client access, or delivery tracking.

**Successor record:** §22 (2026-09-28) closes Owner/POA decisions 1–8 listed above. Closing those policy questions is **not** Dev/Test or Production implementation authorization. Residual H-contract items (sender identity, message template) and Production privacy/provider selection remain open in §22. `DEL/DLA IMPLEMENTATION: NOT AUTHORIZED`. `PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`.

### 21.20 Implementation prerequisites (when later authorized)

- Close §21.19 in this governance artefact (or an Owner-authorized successor).
- Explicit implementation authorization naming Dev/Test vs Production.
- Keep ISS/DOC/migrations 128–129 unchanged unless a genuine defect is found.
- Do not create migration 130 merely to begin experiments.
- Do not reuse C8/RFP `sent` as delivery.
- Do not convert staff `…/content` into a client download.
- Personal-data and notification-allowlist boundaries respected.
- Tests must prove: no send on integrity failure; failure≠delivery; idempotent replay; no client routes.

### 21.21 Security / data-exposure

- External send is a confidentiality event: only **G**-safe PDF bytes.
- Audit/authorization/provider ids stay off the PDF.
- Unauthorized/other-tenant responses must not leak DOC, ISS, hash, storage_ref, or PDF (already proven for internal GET; delivery APIs must inherit that).
- Accidental real-client send in Dev/Test is a stop condition.
- Secure links/portals remain **J**-blocked.

### 21.22 Files changed / repo

`docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` — this section only. No application, schema, provider, or test-code change. No commit. No push. Production untouched. `productionReady = false`.

---

## 22. Owner/POA decision record — external delivery policy (not implementation)

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Unrelated dirty tree preserved. No commit. No push.

**Nature of this increment:** Owner/POA policy record only. It closes the unresolved questions in §21 decisions 1–8. It does **not** implement `DEL-*` / `DLA-*`, email, SMTP, provider, outbox, dispatch, client/public access, secure links, portal, download, migration 130, ISS/DOC schema or API change, C8/RFP lifecycle change, commercial pricing change, or Production change. No external message was sent. No recipient was contacted. `productionReady = false`.

Labels used below:

| Label | Meaning |
| --- | --- |
| **OWNER/POA DECISION** | Selected in this record. Binding commercial policy for H-203 delivery. |
| **APPROVED POLICY** | Binding after this record (includes prior A–K / H / I / J / E / G where restated). |
| **REJECTED / NOT AUTHORIZED** | Explicitly refused. Must not be built or assumed. |
| **REMAINING OPEN** | Still required before the named scope can proceed. Not a hidden yes. |
| **IMPLEMENTATION GATE** | Whether code may be written. Distinct from policy closure. |

§21 **PROPOSED DESIGN** remains design unless an item is explicitly promoted here. Closing policy is not a send capability.

**Required statements:**

- Durable DOC foundation remains complete in Dev/Test. PDF generation remains internal only.
- External delivery remains unauthorized to implement.
- C8/RFP `sent` remains an internal workflow stamp and is not delivery.
- `GET /v1/issued-proposal-documents/:id/content` remains staff-authenticated internal retrieval and must not become client delivery.

### 22.1 Decision 1 — Transmission authority

**OWNER/POA DECISION:** **B2.**

Authority to **issue** `ISS-*` (**E**), authority to **generate** an internal `DOC-*` PDF, and authority to **transmit** that PDF externally are three distinct acts. They are not equivalent.

| Act | Who | What this record does |
| --- | --- | --- |
| Issue ISS | CEO/MD or Commercial Director; Dev/Test `platform.admin` stand-in | Unchanged (**E**) |
| Generate DOC/PDF | Existing internal generation from a valid ISS | Unchanged; still not delivery |
| Transmit PDF | Same commercial authorities, as a **separate attributable send authorization** | **B2** selected |

**APPROVED POLICY:**

- Each external transmission requires a distinct, attributable send authorization by **CEO/MD** or **Commercial Director**.
- Dev/Test stand-in remains `platform.admin` only. No new role.
- ISS existence, DOC existence, or staff `proposal:write:proposal` does **not** authorize send.
- The send authorization must name the specific DOC, its ISS, the confirmed recipient, and the authorizing principal and timestamp.

**REJECTED / NOT AUTHORIZED:**

- **B1** — staff may transmit after a valid ISS/DOC without a separate send approval.
- **B3** — a new dedicated send role. None is created.

### 22.2 Decision 2 — Recipient authority and source

**OWNER/POA DECISION:** reject-by-default. Recipient is explicit, related, and confirmed on the B2 send authorization. Unrelated addresses are forbidden.

**APPROVED POLICY:**

- **Authoritative source:** the recipient address **explicitly supplied and recorded on the B2 send-authorization act**. It is not silently harvested from CRM/contact personal-email fields, notification allowlists, or C8/RFP `sent`.
- **Relatedness required:** the recipient must belong to the same commercial relationship already bound through that ISS: tenant + the account/organisation (and originating opportunity/RFP/programme) already linked on that commercial file.
- **What “related” means:** an address the authorizing principal confirms as an address of that client organisation/account for this commercial file. It is not a third-party, competitor, press, or otherwise unrelated person or organisation.
- **Manual supply at send time:** permitted **only** as that explicit B2 input, and only if relatedness is satisfied and confirmed.
- **Confirmation:** required. Authorization is incomplete until the authorizing principal confirms the exact address.
- **Invalid or unrecognized recipient:** reject before queue. No provider call. Record unsuccessful. **failure ≠ delivery**.
- After authorization, the recipient on that `DEL-*` is **frozen**. Changing it is a new delivery (Decision 3 and 6).

**REJECTED / NOT AUTHORIZED:**

- Addressing a delivery to an **unrelated** external recipient.
- Auto-selecting a CRM personal email as the send target without B2 confirmation.
- Treating notification digest allowlists as the client-proposal recipient source.

### 22.3 Decision 3 — Recipient multiplicity

**OWNER/POA DECISION:** first implementation boundary is **single `To` only**. This is a deliberate scope restriction, not an accident.

**APPROVED POLICY:**

- One `DEL-*` carries **exactly one** confirmed `To` recipient.
- Each send attempt is a `DLA-*` (or `DEL-*` + attempt number) for that single delivery.
- Changing recipient requires a **new** `DEL-*` and a **new** B2 authorization.

**REJECTED / NOT AUTHORIZED** (first boundary):

- Multiple `To`
- CC
- BCC
- Copying internal SEDMC addresses as delivery recipients (staff retrieval remains `GET …/content`)
- One delivery containing a recipient set

A later increment may reopen multiplicity only with a new Owner/POA record.

### 22.4 Decision 4 — Recipient personal data

**OWNER/POA DECISION (repository governance only):** an authorized delivery may persist the confirmed recipient address on that delivery’s own audit chain. This is not a legal determination that Production processing of client personal email is lawful.

**APPROVED POLICY (repository):**

- The confirmed recipient address **may** be persisted on the immutable `DEL-*` record, on `DLA-*` attempt records, and on the internal audit of that delivery.
- It **must not** appear in the client-facing PDF (**G**).
- It **must not** be written into ISS/DOC `clientSafe`.
- It **must not** create or update a general CRM/contact directory (H-131/H-133 ordinary persistence of individual client personal emails remains not an approved commercial default).
- Provider response metadata may store provider message id and non-secret status codes. It **must not** store additional harvested personal data.
- Dev/Test may persist only **mock / non-client / test** recipient strings. Real client addresses are forbidden in Dev/Test.

**REMAINING OPEN:**

- Legal / DPO / privacy-owner determination of lawful basis, retention, and Production processing of real recipient personal data under H-131/H-133. This record invents **no** legal conclusion.

**REJECTED / NOT AUTHORIZED:**

- Copying recipient or audit data into the PDF.
- Using delivery persistence as a substitute CRM contact store.
- Production persistence of real client recipient PII until the privacy/legal item is closed **and** Production delivery is separately authorized.

### 22.5 Decision 5 — Superseded DOC/ISS handling

**OWNER/POA DECISION:** **S2** for **new transmission**. ISS and DOC rows remain immutable; supersession is a send-eligibility rule only. Do not alter ISS/DOC behavior.

**APPROVED POLICY:**

- **What constitutes superseded (for send eligibility):**
  - A **newer ISS** for the **same programme** supersedes earlier ISS records of that programme for new transmission.
  - A **newer DOC sequence** for the **same ISS** supersedes earlier DOCs of that ISS for new transmission.
- A newer ISS **does** automatically supersede previous ISS records of that programme for new sends.
- A newer DOC for the same ISS **does** supersede an earlier DOC of that ISS for new sends.
- An older DOC **must not** be transmitted unless a **new B2 authorization explicitly names that older DOC** (renewed authorization). Absent that, only the current non-superseded DOC is eligible.
- An already-authorized **queued** delivery that has not yet been accepted by a provider **must be re-checked at send time**. If the named DOC/ISS is now superseded and the authorization does not still explicitly name that older DOC as an exception, **do not send**. Record unsuccessful. Require renewed B2 authorization.
- An already **provider-accepted** attempt is **unaffected** as history. It is not rewritten as unsent. It is not proof that the older DOC remains the current sendable document.
- Retry after supersession **requires new B2 authorization**. Original authorization does not cover a superseded document.

**REJECTED / NOT AUTHORIZED:**

- **S1** as a standing rule (older DOC remains freely sendable after a newer ISS/DOC exists merely because it is immutable).
- Mutating or deleting ISS/DOC rows to represent supersession.

### 22.6 Decision 6 — Retry and recipient changes

**OWNER/POA DECISION:** retry is a new attempt against the **same** frozen `DEL-*` (same DOC, ISS, recipient, hashes) while original B2 authorization and S2 eligibility still hold. Any change of recipient, document, or artifact is a new delivery.

**APPROVED POLICY:**

- Retry with identical DOC + ISS + recipient **may** proceed under the original B2 authorization as a new `DLA-*`, if integrity checks pass and the DOC is not superseded under Decision 5.
- Changing **recipient** requires a new `DEL-*` and new B2 authorization.
- Changing **document** (different DOC/ISS) requires a new `DEL-*` and new B2 authorization.
- Changing **artifact/hash** requires a new `DEL-*` and new B2 authorization (that is a different document).
- A failed provider attempt **may** be retried as a new `DLA-*` under the original authorization if still eligible. Automatic worker **resume** of the same queued attempt is allowed. Automatic creation of additional attempts after recorded failure is permitted only while eligibility still holds; it is never success.
- Process restart **may** resume an authorized queued attempt from durable state. In-memory flags are irrelevant.
- Duplicate-send prevention **is required** across process restarts (durable idempotency). Replay of the same idempotency key must not call the provider a second time.
- **failure ≠ delivery.**
- Provider acceptance **≠** confirmed recipient delivery. HTTP 200 is not delivery. C8/RFP `sent` is not delivery.

**REJECTED / NOT AUTHORIZED:**

- Mutating DOC, ISS, PDF bytes, or recipient on retry.
- Treating provider acceptance as mailbox delivery unless a later Owner/POA record maps a specific provider event (none is selected here).

### 22.7 Decision 7 — Production delivery

**OWNER/POA DECISION:** Dev/Test and Production are separate gates. This record authorizes **neither** a Dev/Test send implementation nor Production send.

**APPROVED POLICY — Dev/Test (when a later implementation increment exists):**

- Mock provider only.
- No real client recipients.
- No real external communication.
- `platform.admin` remains the Dev/Test authority stand-in for **E** and **B2**.

**APPROVED POLICY — Production:**

Real external delivery requires a **separate** Owner/POA and Production authorization covering at least:

- production provider/product (currently **UNSELECTED**)
- provider credentials/secrets
- real recipient communication
- operational ownership
- privacy/data-processing requirements (Decision 4 remaining open)
- monitoring and failure handling
- Production migration/application deployment authorization where required

**REJECTED / NOT AUTHORIZED:**

- Selecting or connecting a Production email provider in this increment.
- Any Production send path, Production migration 130, or `productionReady=true`.
- Silent use of Dev/Test stub/outbox in a production-like environment (already refused by the email adapter).

### 22.8 Decision 8 — Initial delivery scope

**OWNER/POA DECISION:** the following is **approved as design direction / first-implementation boundary**. It is **not** implementation authorization.

**APPROVED POLICY (design direction):**

- PDF **attachment** of the existing DOC artifact only
- Dedicated `DEL-*` delivery identity
- Dedicated `DLA-*` attempt identity
- Relationship: **Delivery → DOC → ISS**
- Durable idempotency
- Immutable delivery/attempt audit chain
- Dev/Test mock provider only, if and when implementation is later authorized
- No Production send

**REJECTED / NOT AUTHORIZED:**

- Client link / secure link
- Client portal
- Client download route
- Public / unauthenticated routes
- Repurposing staff `GET /v1/issued-proposal-documents/:id/content` as client delivery
- Reusing C8 or RFP `sent` as delivery state
- Implementing this boundary in this increment

### 22.9 REMAINING OPEN

These remain required for the named scope. They are not implied yes.

| Item | Blocks |
| --- | --- |
| Sender identity (From/display name) under **H** | Any real or mock **message** construction that claims a SEDMC sender |
| Message template (subject/body) under **H** | Same |
| Legal / DPO / privacy-owner basis for Production recipient PII (H-131/H-133) | Production recipient persistence and Production send |
| Production email product, DPA, credentials, operational ownership | Production send |
| Mapping of provider bounce/delivery webhooks to commercial status | Any claim that `accepted_by_provider` means recipient delivery |
| **Explicit implementation increment** naming Dev/Test `DEL-*`/`DLA-*` (and separately Production) | **All code**, including mock-only persistence |

### 22.10 IMPLEMENTATION GATE

| Requirement | Decision status | Owner/POA decision | Implementation consequence |
| --- | --- | --- | --- |
| Transmit ≠ issue ≠ generate PDF | **Closed** | **B2**; same CEO/MD / CD roles; `platform.admin` Dev/Test stand-in; no new role | Do not send from ISS/DOC existence alone |
| Recipient source, relatedness, confirmation | **Closed** | Explicit B2 input; related to ISS commercial file; confirm exact address; reject-by-default | Unrelated/invalid = no queue/send |
| Unrelated external recipient | **Closed** | **REJECTED / NOT AUTHORIZED** | Do not implement an exception path |
| Multiplicity | **Closed** | Single `To`; one `DEL-*` per recipient | No CC/BCC/multi-To/internal copy in first boundary |
| Recipient change | **Closed** | New `DEL-*` + new B2 | Retry must not change recipient |
| Recipient PII on DEL/DLA/audit (repository) | **Closed** | Persist confirmed address on that delivery chain only; never on PDF/ISS/DOC | Dev/Test mock strings only until Production privacy is closed |
| Production recipient PII lawful basis | **REMAINING OPEN** | No legal conclusion invented | `PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED` |
| Superseded DOC/ISS | **Closed** | **S2** for new transmission; queued re-check; accepted attempts historical; retry after supersession needs new B2 | Do not send superseded DOC without renewed named authorization |
| Retry / idempotency / restart | **Closed** | Same DOC+ISS+recipient under original B2 if eligible; durable idempotency; failure ≠ delivery | No in-memory-only duplicate suppression |
| Attachment vs link | **Closed** (design direction) | Attachment only; **J** still blocks client access | No link/portal/download/`/content` as delivery |
| `DEL-*` / `DLA-*` identities | **Closed** (design direction) | Distinct from RFP / C8 / ISS / DOC | Do not use DOC as delivery identity |
| Dev/Test mock provider | **Closed** (policy) | Mock only; no real client; no real send | Still needs an implementation increment |
| Production provider/product | **REMAINING OPEN** | UNSELECTED | No Production provider work |
| Sender identity / template | **REMAINING OPEN** | Not specified in this record | Do not invent From or template copy |
| Dev/Test `DEL-*`/`DLA-*` code, schema, migration 130 | **Open as implementation** | This record does **not** authorize it | **`DEL/DLA IMPLEMENTATION: NOT AUTHORIZED`** |
| Production external delivery | **Open as implementation** | Separate Production authorization required | **`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`** |

### 22.11 Final conclusion

1. **Policy decisions now closed:** transmission authority **B2**; recipient source/relatedness/confirmation/reject-unrelated; single-`To` first boundary; repository rule for persisting confirmed recipient on the delivery audit chain; superseded handling **S2**; retry/recipient-change/idempotency/restart; Dev/Test vs Production split; first-boundary design direction (attachment-only `DEL-*`/`DLA-*`, no client access).
2. **Decisions still open:** sender identity; message template; Production privacy/legal basis for real recipient PII; Production provider/product/DPA/credentials/ops; provider-event mapping to “delivered”; **explicit implementation authorization**.
3. **`DEL/DLA IMPLEMENTATION: NOT AUTHORIZED`**
4. **`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`**

Because residual **H** items and an explicit implementation increment remain open, contributors **must not** proceed into `DEL-*`/`DLA-*` code, migration 130, email, SMTP, provider, outbox, or dispatch on the strength of this record.

**Successor:** §23 (2026-09-28) is the explicit POA Dev/Test implementation authorization that closed sender/template for mock-only use and implemented `DEL-*`/`DLA-*` with a mock provider. **`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED` remains.** Real email/SMTP remain unauthorized.

### 22.12 Files changed / repo

`docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` — this section and the §21.19 successor pointer. No application, schema, provider, test, or migration file. No commit. No push. Production untouched. `productionReady = false`.

---

## 23. Dev/Test DEL/DLA mock delivery — implemented (2026-09-28)

**Date:** 2026-09-28.  
**HEAD at start of increment:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index empty. Unrelated dirty tree preserved. No commit. No push.

**POA implementation authorization:** Dev/Test `DEL-*` / `DLA-*` with a **mock provider only**. This increment does **not** authorize real external communication or Production delivery.

`IMPLEMENTED — DEV/TEST MOCK ONLY`

`PRODUCTION EXTERNAL DELIVERY — NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

### 23.1 Scope

Chain:

`Final Programme → ISS-* → DOC-* → PDF artifact → B2 send authorization → DEL-* → DLA-* attempt(s)`

Identities remain distinct from RFP, C8 `PROP-*`, `ISS-*`, and `DOC-*`. C8/RFP `sent` is unchanged and is not delivery. Staff `GET /v1/issued-proposal-documents/:id/content` remains internal and is not client delivery.

### 23.2 Sender identity (closed for Dev/Test mock)

**APPROVED POLICY (this increment):** sender is governed configuration, not a hard-coded employee mailbox.

- Organization: Serengeti Experience DMC
- Mode: `devtest-mock`
- Address: `noreply@sedmc.invalid` (non-routable)
- Key: `h203.devtest.organizational_sender`
- `productionConfigured = false`

Production sender remains unset/unusable. No personal employee email was invented.

### 23.3 Message template (closed for Dev/Test mock)

Versioned constant `h203-del-v1`. No template editor.

May contain: SEDMC organizational identity, client-safe programme title, dates, document/ISS references, final client selling price, neutral wording, PDF attachment.

Must not contain: supplier cost, GP/GM, markup, $200 file fee, tax/FX composition, floor/exception, approval/audit IDs, supplier/internal cost lines, snapshots, or governance internals.

### 23.4 Implementation boundary

| Item | Record |
| --- | --- |
| `DEL-*` | Insert-only authorization: tenant, DOC, ISS, recipient, sender config, B2 principal/authority/time, hashes, idempotency key, queued state |
| `DLA-*` | Insert-only attempts: hashes, attempt number, mock provider result/reference, `recipientDelivered=false` |
| Eligibility | Fail-closed (DOC/ISS/artifact hashes/client-safe/B2/related confirmed recipient/S2/tenant/production-like) |
| S2 | Newer ISS/DOC blocks new transmission unless `authorizeSupersededDocument` names the older DOC; queued execute re-checks |
| Idempotency | Durable key `sha256(tenant\|DOC\|recipient\|clientKey)`; unique per tenant+DOC+recipient; restart-safe |
| Mock provider | No Internet, SMTP, mailbox, or Production credentials; accept/reject/timeout; acceptance ≠ mailbox delivery |
| APIs | Staff `POST/GET /v1/issued-proposal-document-deliveries` and `POST …/:id/attempts`. No client/public/portal/download |
| Recipient | Explicit confirmed related address on the delivery chain only — not ISS, DOC, CRM, or PDF |

### 23.5 Mock-provider boundary

`createDevTestMockDeliveryProvider`. `contactsInternet/contactsSmtp/usesProductionCredentials = false`. Provider reference prefix `mock-devtest-`. Production-like env refuses this path (`production_delivery_not_authorized`).

### 23.6 Tests (this increment)

| Suite | Result |
| --- | --- |
| Kernel issued-client-document-delivery | **6 passed** |
| Kernel issued-client-document + issued-proposal | **4 + 7 passed** |
| API `h203-client-document-delivery.test.ts` | **4 passed** |
| API generation / client-issue | **9 + 9 passed** |
| API durability / policy / core / C8 / C5 / C6 / H-112 | **51 passed** across 10 files |
| `packages/db` h135 + h136 pointers | **10 passed** |

Pointer tests now expect last migration **130** / no **131**. Existing suites were not weakened.

### 23.7 Production prohibition

- No SMTP, SES, real provider, real recipient, or Production credentials
- Migration 130 is Dev/Test schema. Applied to `eos_h112_full` only (`applied:["migrations/130_h203_issued_client_document_delivery.sql"]`). **Not** applied to Production / `eos` `:5432`.
- `ISSUED_PROPOSAL_DELIVERY.email/dispatch/clientAccess` remain **false**
- `productionReady = false`

### 23.8 Remaining Production blockers

- Production email product / DPA / credentials / operational ownership
- Legal/DPO basis for real recipient PII (H-131/H-133)
- Explicit Production implementation authorization
- Provider bounce/delivery webhook mapping (not claimed here)

**Successor:** §24 (2026-09-28) is the Production Delivery Readiness & Provider Gate. It does **not** authorize real email, SMTP, a provider, credentials, migration 131, or Production send.

### 23.9 Files

Kernel delivery module + tests; API delivery service/routes/repository; store collections; migration `130_h203_issued_client_document_delivery.sql`; pointer-test last-migration updates; this section. No commit. No push.

---

## 24. H-203 Production Delivery Readiness & Provider Gate

**Date:** 2026-09-28.  
**Nature:** governance / readiness assessment only.  
**HEAD at assessment:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index empty. Unrelated dirty tree preserved. No commit. No push.

This section does **not** implement Production email delivery. It does **not** select or connect a provider, configure SMTP, create credentials, send external communication, modify Production, create migration 131, or change the Dev/Test DEL/DLA implementation.

`DEV/TEST MOCK DELIVERY: COMPLETE`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`

Classification used below:

| Class | Meaning |
| --- | --- |
| **1 — Implemented and evidenced** | Dev/Test code, tests, and §23 record exist |
| **2 — Technically ready; owner approval required** | Design exists; Production enablement is an Owner/POA decision |
| **3 — Legally / privacy dependent** | H-131 / H-133 / DPO / legal-owner evidence required; this record makes **no legal conclusion** |
| **4 — Provider-dependent** | Cannot close until a Production product is selected and contracted |
| **5 — Operationally dependent** | People, monitoring, incident, secrets, reconciliation |
| **6 — Explicitly not authorized** | Must not be treated as implied by Dev/Test or this gate |

Current approved chain remains Dev/Test only:

`Final Programme → ISS-* → DOC-* → PDF → B2 → DEL-* → DLA-* → Dev/Test mock provider`

---

### 24.1 Privacy / recipient-data gate (H-131 / H-133)

**No legal conclusion is made here.** Production recipient PII remains **blocked**.

**What is persisted (Dev/Test):**

| Field | Where | Purpose |
| --- | --- | --- |
| `recipient_email` (normalized) | `issued_client_document_deliveries`, `issued_client_document_delivery_attempts` | Delivery/audit To address |
| `recipient_confirmed = true` | DEL row | B2 confirmation flag |
| `related_organization_id` | DEL row | Commercial-file relatedness (organization, not a person record) |
| Sender mock identity | DEL row | Organizational From (`noreply@sedmc.invalid`) |
| Artifact/content hashes, DOC/ISS ids, B2 principal/authority/time | DEL / DLA / chained audit | Commercial integrity |

Recipient data is **not** on ISS, DOC, CRM, or the client PDF. Audit evidence for authorize/attempt currently records delivery/DOC/ISS ids, hashes, and result — **not** the recipient address in the chained audit payload. Staff GET/LIST APIs **do** return `recipientEmail` to callers with `proposal:read:proposal`.

**H-131 alignment (capability, not legality):**

- H-131: EOS shall not be a system of record for personal data; work emails of named natural persons are a personal-data **category** for that boundary.
- H-131 §6–§7: external communications must not become an ordinary person store; new personal-data capability requires change-control.
- H-131 §8: logs/audit/backups must not become a personal-data archive.
- §23 authorized **Dev/Test mock strings only**. Real Production recipient persistence is a **new** personal-data capability relative to H-131, even though it is limited to the delivery chain.

**H-133 alignment:**

- H-133 §5.6 (outbound notification recipient email) remains **`UNKNOWN / OWNER DECISION REQUIRED`**. DEL/DLA `recipient_email` is a **sibling surface** to `notif_email_outbox.recipient_email` (classification **D** in the H-133 audit). This gate does not close §5.6.
- Whether a work mailbox of a named contact is “personal data” in law is **not decided here**. Capability: an email address that can identify a natural person is persisted.

**Retention:** insert-only tables and insert-only triggers. There is **no** governed retention clock, erasure job, or anonymisation path. Production backups of `eos` (if later authorized) would retain these rows for the backup lifetime.

**Deletion / rectification:** UPDATE and DELETE are forbidden by trigger. A Production DSR (access/erasure/rectification) against `recipient_email` **cannot** be executed on this schema without a separately authorized exception. That conflict is a **blocking Owner/DPO decision**, not a defect to patch in this assessment.

**Tenant isolation / access:**

- Rows are `tenant_id`-scoped; API loads filter by `principal.tenantId`.
- Write: `proposal:write:proposal` **and** B2 (`ceo_md` / `commercial_director` / Dev/Test `platform.admin`).
- Read: `proposal:read:proposal` — **broader than B2**. Production must decide whether recipient addresses may be listed to all proposal readers.

**Does Production require DPO / legal-owner confirmation?** **Yes.** Required evidence package (Owner / DPO / legal — not invented here):

1. Purpose limitation statement: B2 transmission of the already-generated client-safe PDF to one confirmed related recipient.
2. Lawful-basis assessment under the law the Owner determines applies (this record does not determine PDPA/PDPC applicability).
3. Decision whether Production EOS may persist `recipient_email` at all, or must keep the address only in an external mail system.
4. Whether recipients are limited to **organisational** mailboxes vs named-person addresses.
5. Retention period and backup treatment.
6. DSR procedure compatible with insert-only audit (export-only vs governed erasure vs do-not-store).
7. Access-control decision for `proposal:read` vs B2-only visibility of recipient addresses.
8. Confirmation that client PDF content remains free of recipient PII (already the Dev/Test rule).

**`PRODUCTION RECIPIENT PII: BLOCKED`** until that package is supplied and a later increment is explicitly authorized.

---

### 24.2 Provider gate (selection checklist — no provider selected)

**Class 4 + 6.** Production email product remains **UNSELECTED**. Do not connect one. Do not create credentials. Existing `createEmailAdapter` / SES / SMTP env validation is a **separate notification adapter** (H-133 §5.6 still open) and is **not** the authorized H-203 commercial delivery path.

Minimum Owner checklist before a product may even be **proposed** for authorization:

| Requirement | Must be evidenced |
| --- | --- |
| Transactional email (not marketing blast) | Product supports authenticated transactional send of PDF attachments |
| Sender / domain authentication | SPF, DKIM, DMARC aligned to the approved SEDMC sending domain |
| Transport | TLS in transit for provider API and (if used) SMTP submission |
| API authentication | Non-shared keys; rotation; no credentials in git/env examples |
| Secret management | Mechanism the Owner already approves for Production secrets (none is selected here) |
| Data-processing terms / DPA | Signed DPA covering recipient addresses, message metadata, and attachment processing |
| Region / transfer | Where recipient addresses, subjects, and PDF bytes are processed and stored; transfer tool if required |
| Provider logging / retention | What the vendor logs; retention; subprocessors |
| Webhooks | Signed events for bounce, complaint, deferred, delivery, reject |
| Bounce / complaint / suppression | Permanent vs transient; complaint/abuse; suppression list ownership |
| Rate limits / outage | Documented limits; queue behaviour; status page / SLA |
| Operational monitoring | Metrics EOS can consume without treating vendor “delivered” as mailbox proof |
| Fail closed | EOS must not claim commercial delivery on HTTP 200 or provider acceptance alone |

**Do not select** SES, SMTP relay, Mailgun, Postmark, SendGrid, or any other vendor in this record.

---

### 24.3 Sender identity gate

**Dev/Test (closed in §23.2):** organizational SEDMC identity; config key `h203.devtest.organizational_sender`; address `noreply@sedmc.invalid`; `productionConfigured = false`; not an employee mailbox.

**Production must still supply (do not invent an address here):**

| Item | Requirement |
| --- | --- |
| From address | Owner-approved **organizational** mailbox on an Owner-approved sending domain |
| Sending domain | DNS ownership; SPF/DKIM/DMARC |
| Display name | Policy (e.g. `Serengeti Experience DMC`) — not a personal employee name unless Owner later authorizes it |
| Reply-To | Explicit policy: none / organizational shared inbox / named role mailbox |
| Ownership | Which SEDMC role owns the mailbox, DNS, and provider console |
| Authentication | Domain authentication complete **before** first Production send |
| Individual employee From | **Remains prohibited** unless a later Owner decision reverses §22/§23 |

H-180 recorded that a **real outbound sender appointment** for a different channel set was **not appointed**. That record is not rewritten. Commercial client-proposal From is a **separate** appointment that still does not exist for Production.

Migration 130 **CHECKs** lock `sender_address = 'noreply@sedmc.invalid'` and `sender_mode = 'devtest-mock'`. Production sender cannot be stored on 130-as-written. See §24.8.

---

### 24.4 Message / template gate

**Dev/Test:** versioned constant `h203-del-v1`. No editor. Client-safe fields only; forbidden commercial internals tested. Body **explicitly states it is a Dev/Test mock and not mailbox delivery**.

**Production requirements (not implemented):**

| Topic | Production requirement |
| --- | --- |
| Owner | Named template owner (Commercial Director or Owner-appointed) |
| Versioning | New version id (must not ship `h203-del-v1` mock disclaimer to clients) |
| Subject / body | Owner-approved copy; SEDMC identity; programme title; dates; DOC/ISS client-safe refs; selling price only if still permitted on the DOC |
| Attachment name | Client-safe (`DOC-*.pdf`); no internal codes that leak governance |
| Contact / reply | Per sender/Reply-To policy |
| Localization | Not required for first Production boundary; if later required, new versioned templates |
| Internals | Never: supplier cost, GP/GM, markup, $200 file fee, tax/FX composition, floor/exception, approval/audit IDs, supplier lines, snapshots, governance |

Internal commercial information must **never** enter the external message or the attached PDF. That rule is already encoded for Dev/Test generation + template sanitization; Production must keep it and re-approve copy.

No template editor in this gate.

---

### 24.5 Delivery semantics

Current Dev/Test states:

| State | How it is represented | Meaning |
| --- | --- | --- |
| `requested` / `authorized` | Type vocabulary; DEL row is insert-only `queued` after B2 | Authorization persisted |
| `queued` | DEL `state='queued'`; no accepted attempt | Authorized, not yet mock-accepted |
| `accepted_by_provider` | Derived from a DLA with that result | Mock (or later provider) **accepted the request** |
| `failed` | Latest DLA `failed` | Attempt failed; **not** delivery |
| `cancelled` | DLA `cancelled` (e.g. S2 ineligible on execute) | Must not transmit |

`recipient_delivered` is **constrained false**. HTTP 200, API success, and provider acceptance are **not** recipient/mailbox delivery and **not** evidence the recipient opened or read the message.

**Production additional states (design only — not in schema):**

| Distinct event | Must not be collapsed into |
| --- | --- |
| Provider accepted the API/SMTP request | `accepted_by_provider` |
| Provider reports delivery to the *receiving MTA* (if offered) | **not** `accepted_by_provider`; **not** “opened” |
| Provider reports bounce (permanent / transient) | new attempt-event or webhook row |
| Provider reports complaint / spam | new event; suppression handling |
| Unknown / late / duplicate webhook | store; do not invent commercial success |

These belong in a **new insert-only event table** (or expanded DLA result vocabulary via a **new** migration). They must not mutate historical DLA rows. Current `result` CHECK only allows `accepted_by_provider | failed | cancelled`.

---

### 24.6 Webhook boundary (design only — no routes)

Webhook processing is a **separate implementation increment** after a provider is selected. Do not add webhook routes now.

**Contract (design):**

| Topic | Rule |
| --- | --- |
| Authentication | Provider signature (HMAC or equivalent) verified before parse; unsigned = reject |
| Event identity | Persist `provider_event_id`; unique `(tenant_id, provider, provider_event_id)` |
| Idempotency | Duplicate delivery of the same event is a no-op success |
| Ordering / late events | Apply to DLA via `provider_reference`; late bounce after “accepted” is a **new event**, not a rewrite of the accepted DLA |
| Unknown events | Persist payload class `unknown`; do not change DEL derived commercial state |
| Tenant association | Resolve tenant from **EOS** DEL/DLA lookup on `provider_reference`, not from an untrusted tenant claim in the payload |
| Mapping | Bounce / complaint / permanent failure / transient failure map to event types; **never** to “recipient opened” |
| Provider retries | Signature + idempotency make retries safe |
| Failure | Signature or persistence failure must not mark DEL accepted |

Until this increment exists, EOS **must not** claim bounce-aware or provider-reported-delivery commercial status.

---

### 24.7 Production authorization package

Dev/Test §23 authorization is **not** Production authorization.

Minimum package before Production external delivery may be **considered**:

1. Production provider **selected** (Owner) and DPA/privacy requirements **closed** (Owner/DPO).
2. Approved organizational sender identity and sending domain (Owner).
3. Approved Production template version (Commercial / Owner).
4. Approved recipient-data treatment including DSR vs insert-only (Owner/DPO).
5. Operational owner; monitoring/incident owner; credential rotation owner.
6. Secrets provisioned only through the Owner-approved Production secret mechanism.
7. Production **schema** increment authorized (see §24.8 — **not** 130-as-is).
8. Production **application deployment** authorized (hosting remains H-202 HOLD / P01 not granted).
9. Staged test strategy completed without real-client send (§24.11).
10. **Explicit Production send authorization** (Owner/POA) naming this commercial PDF path.

Missing any item = **do not send**.

---

### 24.8 Migration 130 — not promotable unchanged

**Assessed. Not executed. No migration 131 created. 130 not modified.**

| Check | Finding |
| --- | --- |
| Schema safety (Dev/Test) | Insert-only DEL/DLA; FKs to `tenants`, `issued_client_documents`, `issued_proposals`, `prg_programmes`, `principals` |
| Insert-only / triggers | UPDATE/DELETE raise; historical attempts immutable |
| Indexes | Tenant+DOC; tenant+delivery+attempt_number; unique idempotency and unique (tenant, DOC, recipient) |
| `related_organization_id` | **No FK** — application-enforced relatedness only |
| Data migration | None for empty tables |
| Rollback | Forward-only repo convention; insert-only forbids in-place undo; drop would be destructive and is **not authorized** |
| Production `eos` compatibility | Production migrate remains **refused**; 125–129 (personal-data domain + H-203 ISS/DOC) are also **not** on Production. 130 is not the first missing file |

**130 cannot be promoted to Production unchanged.** Binding CHECKs:

- `sender_key` / `sender_address` / `sender_mode` locked to Dev/Test mock
- `provider_name` locked to `devtest-mock`
- `template_version` locked to `h203-del-v1`
- `recipient_delivered` locked `false` (correct as a “mailbox delivered” claim; insufficient as a place to store bounce/delivery events)
- `state` locked `queued` on DEL (derived state is fine; Production events still need another table or CHECK expansion)
- `authorization_authority` includes `platform.admin` (Dev/Test stand-in)

**GOVERNANCE DECISION REQUIRED (not taken in this increment):** a **later, separately authorized** schema increment (would be **131+** only after explicit authorization) to introduce Production-capable sender/provider/event vocabulary **without rewriting historical §23 Dev/Test 130**. **Do not alter 130 now. Do not apply 130 to Production.**

---

### 24.9 Security review

**Dev/Test controls that exist:** B2 + `proposal:write`; fail-closed eligibility; related confirmed recipient; S2 re-check on queue execute; artifact/content hash immediately before mock send; no PDF regeneration; tenant filter; no client/public/download/portal routes; staff `/content` not repurposed; idempotency unique keys; production-like env → `production_delivery_not_authorized`; mock cannot route.

**Insufficient for Production (do not claim readiness because Dev/Test passed):**

| Control | Gap |
| --- | --- |
| Provider credentials | None; no vault; mock only |
| Webhook authentication | No webhook |
| Bounce / complaint / suppression | Not modeled |
| Recipient relatedness | Organization match + operator-supplied address; **not** a verified org-contact binding (by design: no CRM auto-select). Production may require a tighter confirmation ritual |
| Recipient visibility | Any `proposal:read` principal can list recipient emails |
| `platform.admin` B2 | Dev/Test only; unsafe as Production send authority |
| Template / sender CHECKs | Cannot represent a real From |
| PDF sanitization | Forbidden-token scan exists; not a full PDF threat model (embedded files, JS) — Owner may require a later hardening increment |
| Audit exposure | APIs return recipient email; backups would copy it |
| Secret in repo | Must remain absent |

---

### 24.10 Operational readiness (not implemented)

Required before Production send, owned by named people (none appointed here):

- Monitoring/alerting: attempt rate, fail rate, queue age, webhook verify failures
- Provider outage: fail closed; no silent mock fallback in Production
- Backlog / failed attempts / bounced recipients / complaints
- Credential expiry and rotation
- Audit review cadence
- Support ownership for “client says they did not receive”
- Incident response (wrong recipient, leaked PDF, complaint)
- Manual cancellation that re-checks eligibility and does not mutate history
- Retry policy (same DEL; new DLA; never change recipient)
- Reconciliation job: EOS DLA `provider_reference` vs provider message id (read-only audit)

---

### 24.11 Production test strategy (design only — no contact)

Prevent accidental real-client communication:

1. Keep `ISSUED_CLIENT_DOCUMENT_DELIVERY.production = false` and `ISSUED_PROPOSAL_DELIVERY.email/dispatch = false` until explicit send authorization.
2. Keep production-like fail-closed unless an **explicit production-send capability gate** is authorized.
3. First live path: provider **sandbox** (if any) or dedicated **non-client** test domain/address allowlist — never a live client To.
4. Restricted allowlist of Owner-named internal mailboxes only; no CRM discovery.
5. Feature flag separate from “schema exists”.
6. Reconciliation and webhook tests against sandbox events before any client address.
7. Do **not** use Dev/Test `.invalid` / `.local` as a Production From.

**Not implemented. No recipient contacted.**

---

### 24.12 Final readiness matrix

| Gate | Current state | Evidence | Remaining requirement | Owner | Blocks Production? |
| ---- | ------------- | -------- | --------------------- | ----- | ------------------ |
| DEL/DLA implementation | **1** Dev/Test mock complete | §23; kernel/API tests | Production adapter + schema increment | POA (later increment) | Yes, until Production increment |
| Migration 130 | **1** on Dev/Test `eos_h112_full` only; **6** for Production apply | migrate-cli `applied: 130`; CHECKs mock-locked | Do not apply 130 to Production; authorize a later schema | POA / DBA | Yes |
| B2 authority | **1** encoded; **2** Production roles | Kernel eligibility; API 403 for non-B2 | Confirm Production excludes `platform.admin` stand-in | Owner/POA | Yes until confirmed |
| Recipient relatedness | **1** org-id match | Kernel/API tests | Optional tighter binding is Owner policy | Owner | Policy; current reject-unrelated holds |
| Recipient confirmation | **1** explicit flag | `recipient_confirmed = true` CHECK | Production confirmation ritual / evidence | Owner | Yes for real send |
| S2 supersession | **1** | Kernel + API S2 tests | Keep on Production execute path | — | No additional if schema preserved |
| Idempotency | **1** durable | Unique keys; restart test | Survive Production restart with new schema | — | No additional if unique keys preserved |
| Artifact integrity | **1** | Hash before mock send | Same against Production object store (store **UNSELECTED**) | Infra Owner | Yes (hosting/store) |
| Sender identity | **2/6** mock only | `noreply@sedmc.invalid` | Approved org From + domain | Owner | Yes |
| Template | **2/6** `h203-del-v1` mock copy | §23.3 | Approved Production version; no mock disclaimer | Commercial / Owner | Yes |
| Recipient privacy | **3** | H-131; H-133 §5.6; DEL/DLA emails | DPO/legal package §24.1 | DPO / Owner | **Yes** |
| DPA | **3/4** | None | Signed DPA with selected processor | Legal / Owner | **Yes** |
| Provider selection | **4/6** UNSELECTED | §22.7; this gate | Owner selects product | Owner | **Yes** |
| Credentials | **6** none | No SMTP/SES for DEL | Vault + rotation | Ops Owner | **Yes** |
| Webhook | **6** not implemented | No routes | Separate increment §24.6 | POA | **Yes** for bounce-aware claims; **Yes** for send if Owner requires it first |
| Bounce handling | **6** | `recipient_delivered=false` only | Event model + ops | Ops / POA | **Yes** if Owner requires it before send |
| Monitoring | **5/6** | None for DEL | Metrics/alerts/owners | Ops | **Yes** |
| Operations ownership | **5** unappointed | — | Named owners | Owner | **Yes** |
| Production deployment authorization | **6** | P01 not granted; H-202 HOLD | Hosting + migrate train 125–129 **and** Production delivery schema | Owner/POA | **Yes** |
| Production send authorization | **6** | §23/§24 | Explicit POA send grant | Owner/POA | **Yes** |

---

### 24.13 Final decision

`DEV/TEST MOCK DELIVERY: COMPLETE`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`

**Smallest remaining set — owner decisions (must precede code):**

1. **Privacy/DPO:** may Production EOS persist `recipient_email` on the delivery chain; lawful basis; retention; DSR vs insert-only; organisational vs named-person addresses; who may read those rows.
2. **Sender:** approved organizational From, domain, display name, Reply-To; employee From remains prohibited until reversed.
3. **Template:** named owner and Production version replacing `h203-del-v1` mock copy.
4. **Provider + DPA + region/transfer** (selection only — still no connect in that decision record unless separately authorized).
5. **Ops:** operational owner, monitoring/incident owner, secret mechanism, staged allowlist recipients.
6. **Explicit Production schema increment** (not 130-as-is) **and** hosting/deployment authorization (P01 / H-202 still HOLD).
7. **Explicit Production send authorization.**

**Smallest remaining implementation increments (only after the matching decisions):**

| Increment | Purpose |
| --- | --- |
| A | Privacy-closed recipient persistence model (may change columns/access) |
| B | Production-capable delivery schema **new migration** (131+ only if authorized); leave 130 as Dev/Test history |
| C | Production provider adapter (after selection); fail closed without credentials |
| D | Signed webhook processor + bounce/complaint events (insert-only) |
| E | Monitoring, allowlist/sandbox send gate, reconciliation |
| F | Production send capability flag — default off until the send grant |

No increment above is authorized by this section.

**Successor:** §25 (2026-09-28) is the Recipient PII Remediation & Production Schema Design Gate. It does **not** authorize schema, provider, webhooks, monitoring, send, or Production PII persistence.

### 24.14 Files / safety

This section only: `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md`. No application, schema, provider, credential, or migration-131 change. No Production change. No external communication. `productionReady = false`.

---

## 25. H-203 Recipient PII Remediation & Production Schema Design

**Date:** 2026-09-28.  
**Nature:** governance / architecture design only.  
**HEAD at this gate:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index empty. Unrelated dirty tree preserved. No commit. No push.

This section does **not** modify application code, schema, migration 130, or create migration 131. It does **not** connect a provider, configure SMTP, create credentials, implement webhooks or monitoring, enable a send flag, send email, contact a recipient, or modify Production.

Inspected and **not rewritten:** H-131 personal-data boundary; H-133 disposition (including §5.6 / §5.10); H-135–H-140 person-domain remediation artefacts; H-203 §§21–24; kernel/API DEL/DLA; migration `130_h203_issued_client_document_delivery.sql`; `audit_events` insert-only convention; logger `REDACT_KEYS`; `PERSON_DOMAIN_REMOVED` fail-closed person domains.

`DEV/TEST DEL/DLA: COMPLETE`  
`MIGRATION 130: DEV/TEST ONLY — NOT PROMOTABLE`  
`PRODUCTION RECIPIENT PII: BLOCKED`  
`PRODUCTION SCHEMA IMPLEMENTATION: NOT AUTHORIZED`  
`PRODUCTION PROVIDER: NOT SELECTED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

No legal conclusion, PDPC exemption, lawful-basis finding, or retention period is invented here.

---

### 25.1 Conflicts identified (do not paper over)

These are **explicit** and remain until Owner/DPO/POA close them. A pattern elsewhere is **not** automatically applicable.

| ID | Conflict | Consequence |
| --- | --- | --- |
| C1 | **H-131** (EOS shall not be a personal-data SoR; personal/work emails of named persons are not ordinary records; §13 change-control for new PD capability) vs **H-203 §22.4** (repository may persist confirmed recipient on the delivery audit chain) | §22.4 is **repository location**, not a legal determination and not Production authorization. Production persistence of a real To address is still an H-131 §13 event. |
| C2 | **§23 / migration 130** store `recipient_email` on **insert-only** DEL and DLA vs **H-131 §8** (audit/backups must not become a PD archive) and any future erasure/rectification | 130 cannot execute DSR erasure. That is why 130 is not Production-promotable (§24.8), independent of mock sender CHECKs. |
| C3 | **H-131 §10.5** (hashing/tokenising is **not** an approved privacy architecture unless separately governed) vs any design that keeps only an email hash on immutable DEL | Option C is **not** a silent workaround. It requires explicit H-131 §13 authorization of that architecture. |
| C4 | **H-133 §5.6** outbound notification `recipient_email` remains **UNKNOWN / OWNER DECISION REQUIRED** vs H-203 DEL/DLA as a **sibling** send-side address store | Closing H-203 delivery PII does **not** close notification outbox. Do not copy `notif_email_outbox` as the Production commercial-delivery model. |
| C5 | **H-133 §5.10** (do not assume EOS must run a DSR casefile keyed by a data-subject label; DSR for wider operations stays outside EOS if EOS holds no PD) vs holding Production recipient email **inside** EOS | If EOS holds the To address, DSR cannot be “all external.” If EOS does **not** hold it (Option D), H-133 §5.10 remains coherent. Owner/DPO must choose. |
| C6 | **H-133 §5.1 / H-135+** CRM contacts **REMOVE** / `PERSON_DOMAIN_REMOVED` vs using CRM contacts for relatedness or auto-To | Production relatedness **must not** re-open `crm_contacts`. Organization relationship is the commercial key; named-contact relationship is not an authorized EOS SoR. |
| C7 | **H-140** organization `primaryEmail` may be a person’s mailbox (deferred Owner policy) vs treating org switchboard email as a verified delivery recipient | Auto-select from org email is **not** authorized (no silent discovery). |
| C8 | **Insert-only `audit_events`** vs putting `recipient_email` in audit evidence | Current authorize/attempt chained audit **omits** the address (good). Production must **keep** that omission. Logger redacts key `email` but APIs return `recipientEmail` — redaction is **not** an access control. |
| C9 | **§22.6** retry is the same frozen recipient on the same DEL vs later erasure of the To address | After governed erasure, retry **cannot** transmit unless the operator re-supplies and re-confirms (new B2 if policy requires). Idempotency must not require a live email column on the immutable row. |
| C10 | **§22.4** “persist on immutable DEL/DLA” vs this gate’s Production requirement to separate PII from immutable commercial identity | Production **refines** the *form* of §22.4 (delivery-chain purpose, not CRM) without rewriting the historical decision. Dev/Test 130 remains historical mock. |

---

### 25.2 Production recipient-data purpose

**Proposed purpose (architecture; not a lawful-basis finding):**

Store only what is required to (1) execute one B2-authorized transmission of an **already generated** client-safe DOC PDF to **one** confirmed recipient that is related to the commercial file’s **organization**, and (2) support retry under that same authorization while still eligible, and (3) support bounded operational investigation of that transmission.

This purpose is **narrower than CRM**. It is **not** customer-master data.

| Class | What it is | What EOS may retain in Production (design) | What EOS must not become |
| --- | --- | --- | --- |
| **Delivery execution data** | Address and confirmation needed **to call the provider** and to retry | Held only in the **governed recipient-PII record** (or not at all — Option D), for an Owner/DPO-set operational period | A reusable address book |
| **Delivery audit data** | Who authorized which DOC/ISS, when, hashes, provider reference, result | Immutable DEL/DLA/audit **without** raw email | A personal-data archive |
| **Commercial customer data** | Organization, programme, RFP, amounts, statuses | Existing commercial objects | A person dossier |
| **CRM / contact-master data** | Named individuals, directories, phones | **Out of scope** (`PERSON_DOMAIN_REMOVED`) | Delivery tables as CRM |
| **Document content** | Client-safe PDF / ISS snapshot | DOC artifact; **no recipient email in PDF** | Identity document store |

---

### 25.3 Separate delivery identity from recipient PII

**Durable delivery / audit identity (insert-only; Production schema direction):**

- tenant; `DEL-*` / `DLA-*`; DOC / ISS / programme ids and codes
- `related_organization_id` (organization, not a person)
- B2 principal id, authority, authorized-at
- content SHA-256, artifact SHA-256
- opaque idempotency / recipient-**binding** (see Options)
- delivery-recipient **record id** (not the email)
- confirmation **boolean + confirming principal id + confirmed-at** (not the address)
- attempt timestamps, result, failure reason, provider name/reference (non-harvested)
- `recipient_delivered = false` unless a later Owner-authorized event model says otherwise; never “opened”

**Recipient PII (independently governed):**

- the To address (and only that, unless Owner later authorizes a display label)
- visibility, retention, erasure, rectification
- **not** on ISS, DOC, PDF, CRM, or ordinary proposal GET

Evaluated storage forms (not implemented):

| Form | Evaluation |
| --- | --- |
| Direct on immutable DEL/DLA (current 130) | Audit-simple; **fails C2**. **Not** Production. |
| Separate mutable/erasable delivery-recipient record | Matches purpose limitation; DEL stays immutable. Requires access control so it does not become CRM. **Recommended direction if EOS may hold the address.** |
| Encrypted column on DEL | Ciphertext remains stored; keys unselected; erasure still needs key destruction or row mutation; **does not** by itself satisfy H-131. Not chosen as the primary control. |
| Non-PII reference + separately controlled PII | Same as separate record. A **binding hash** on DEL is Option C adjunct — only if H-131 §13 authorizes that architecture (**C3**). |
| Operational retention only | Period is an **Owner/DPO decision**, not invented here. After that period, PII record is erased; commercial identity remains. |

---

### 25.4 Immutability vs H-131/H-133 — Options A–D

Preserve `DEL → DLA → DOC → ISS` as **commercial/audit integrity**. Do not mutate ISS/DOC. Do not mutate historical DLA rows into different attempts.

#### Option A — recipient email immutable forever on DEL/DLA

| | |
| --- | --- |
| Advantages | Strongest literal reading of §22.4 “on the immutable record”; simplest provider reconciliation while the row exists |
| Disadvantages | Directly conflicts **C1/C2**; backups become a PD archive; no erasure/rectification |
| Audit | Full To address forever |
| Operations | Retry trivial |
| Privacy | **Worst** alignment with H-131 |
| Historical evidence | Sufficient **and** excessive |
| **Status** | **Not recommended for Production** unless DPO/Owner conclude EOS has **no** erasure obligation for this processing (**legal conclusion not made here**) |

#### Option B — email outside the immutable delivery record; erasable; DEL keeps non-PII identity

| | |
| --- | --- |
| Advantages | Fixes **C2** without destroying commercial history; stays on the **delivery chain** (not CRM); matches §22.4 *purpose* |
| Disadvantages | Retry after erasure needs re-supply; two-table discipline; support must use record id not inbox search |
| Audit | Proves send to recipient-record `R-*`, not the string forever |
| Operations | Execute/retry load PII only when present and not erased |
| Privacy | Best of the “EOS holds To” options |
| Historical evidence | Sufficient **if** R-* + org + B2 + hashes + provider_ref remain |
| **Status** | **Recommended Production schema direction if** Owner/DPO authorize EOS to hold the To address at all. **Not implemented. Not legally closed.** |

#### Option C — governed erasable value plus non-PII identity/hash on historical DEL

| | |
| --- | --- |
| Advantages | Idempotency/restart without a live email column; collision detection after erasure |
| Disadvantages | **C3**: hash/token is not an approved privacy architecture until §13; some laws may still treat email hashes as personal data — **DPO must say**; rainbow risk if unsalted |
| Audit | Binding + R-* ; not the raw address |
| Retry | Same as B if PII present; after erasure, re-supply must match stored binding or start a new DEL |
| Privacy | Only as **adjunct** to B, never as a substitute SoR |
| **Status** | **Permitted as adjunct** only after Owner/DPO **explicitly authorize** that privacy architecture. Not a silent default. |

#### Option D — EOS never persists the To address (transient at send; provider/external mail holds it)

| | |
| --- | --- |
| Advantages | Strongest H-131 / H-133 §5.10 alignment; no EOS DSR for delivery email |
| Disadvantages | Refines §22.4 *form* for Production; restart/retry must re-accept the address; provider becomes the operational To-store (**DPA critical**); EOS cannot show the address in support UI |
| Audit | “Authorized send of DOC/ISS to a confirmed related recipient of org O at T” + provider_ref |
| Privacy | Best H-131 alignment |
| Historical evidence | Weaker for “exactly which mailbox” unless provider evidence is retained under DPA |
| **Status** | **H-131-maximal alternative.** Owner/DPO may select D instead of B. Not implemented. |

**This gate does not legally select B, C, or D.** It records **B as the schema direction if EOS holds PII**, **C only as a separately authorized adjunct**, **D as the alternative if EOS must not hold PII**, and **A as not recommended**.

---

### 25.5 Rectification semantics

“Confirmed” is **operator attestation**, not mailbox-ownership verification.

| Moment | Design |
| --- | --- |
| Before DEL exists | Change the typed address; nothing to rectify in EOS |
| After queued, before provider acceptance | **Not** a mutation of DEL. Wrong address ⇒ **cancel** (new ineligible/cancelled DLA) and **new DEL + new B2** (§22.3/§22.6). Optionally erase the unused PII record under Owner/DPO process |
| After provider acceptance | Historical DLA stays. Correction of the mailbox is **not** rewriting history. New DOC/recipient ⇒ new DEL. PII record may be rectified for **future** operational display only if Owner/DPO allow; the accepted attempt still points at the same R-* |
| After bounce | New event row (future webhook increment). Address correction still new DEL. Bounce metadata must not accumulate extra harvested PII |
| After “completion” (provider-reported delivery, if later modeled) | Same: history immutable; PII erasable on the recipient record only |
| Erasure after historical delivery | Erase/blank the **PII record**; leave DEL/DLA/DOC/ISS; leave R-* tombstone (`erased_at`, `erased_by_principal_id`). Do not delete commercial audit |

**What must remain provable without the raw email:**

`which B2 principal authorized which DEL, for which DOC and ISS, related to which organization, bound to which recipient-record, at what time, with which content/artifact hashes, with what attempt result and provider reference`

**Still required from DPO/Owner (not invented):** whether that proof is legally sufficient; whether hashes are personal data; retention clocks; whether provider copies must also be erased.

---

### 25.6 Recipient read-access boundary

Current Dev/Test: `proposal:read:proposal` list/GET returns `recipientEmail`. That is **not** acceptable as Production default (**§24.9**).

| Surface | Production design |
| --- | --- |
| Commercial proposal / ISS / DOC read | **No** recipient email. Existing proposal/DOC permissions unchanged |
| Delivery **metadata** read | DEL/DLA ids, DOC/ISS, hashes, state, provider_ref, org id, confirmation flags — `proposal:read:proposal` **may** remain if PII is stripped |
| Recipient **PII** read | **Not** via ordinary proposal list. Reuse **existing** `proposal:write:proposal` **plus** B2 authority (same principals who may authorize send). **No new role** is created here |

If Owner/POA later decide write+B2 is still too wide or too narrow, a **dedicated capability** is an **Owner/POA decision**, not this increment. Do not implement a new role.

PII access, if any, must be **audit-logged** (resource = recipient-record id, **not** the address in the log line).

---

### 25.7 Recipient relatedness

| Kind | Production |
| --- | --- |
| Organization relationship | **Minimum required:** `relatedOrganizationId` equals the ISS programme’s organization in the same tenant (current Dev/Test rule) |
| Named contact relationship | **Not authorized** as EOS SoR (C6). Do not require `crm_contacts` |
| Manually entered recipient | **Required input** — operator supplies the To address at B2 time |
| Verified recipient | **Not claimed.** Operator confirmation ≠ proof of mailbox control |
| CRM-derived / auto-discovered | **Rejected** (C6/C7). No global allowlist. No silent org-primaryEmail send |

**Minimum evidence before Production send (design):** tenant-valid DOC+ISS; org relatedness; explicit address; `recipientConfirmed=true`; confirming principal; confirmed-at; B2 authority. Stronger verification (challenge, client-portal ack) is a **future capability**, not this gate.

---

### 25.8 Recipient confirmation

**Operational meaning:** the B2 principal attests that this exact address is the intended To for this commercial file, at this timestamp.

Store on the **PII record or DEL metadata (non-PII):** `recipient_confirmed`, `confirmed_by_principal_id`, `confirmed_at`. Changes after confirmation are **not** edits: they are cancel + new DEL + new B2.

Client-provided RFP letterhead / external mail remains the **operational SoR** (H-126). EOS does not ingest that source as a contact row. The operator may **copy** an address into the B2 field; that copy is execution data, not CRM.

Do **not** claim email-ownership verification.

---

### 25.9 Production retention design (decision required — no periods invented)

Owner/DPO must set clocks independently:

| Stream | Distinct question |
| --- | --- |
| Operational delivery PII | How long may the To address remain in the erasable record for retry/support? |
| Immutable commercial/audit (DEL/DLA/ISS/DOC/hashes) | How long must commercial evidence remain? **Not the same clock** as PII |
| Failed-attempt metadata | Commercial failure reasons vs any address in error text (forbid address in `failure_reason`) |
| Provider-reference | Correlate with vendor; may outlive PII |
| Backup | How backups of the PII table vs commercial tables are retained and restored (H-131 §8) |
| Deletion propagation | EOS PII erase **plus** provider deletion request under DPA — process, not a number |

**PII retention ≠ immutable commercial/audit retention.** Option D sets operational PII retention in EOS to **zero**.

---

### 25.10 Security design (not implemented)

Encryption is **not** selected as the primary control (keys unselected; ciphertext is still stored; does not replace purpose limitation).

**Minimum controls for a future Production schema/application increment:**

1. Separate PII storage from insert-only DEL/DLA (if Option B).
2. Field-level API restriction (§25.6); mask PII in list/default GET.
3. Extend log redaction to `recipientEmail` / `recipient_email` keys; never log the address in `msg` strings.
4. No recipient email in `audit_events.evidence`.
5. Audit **access** to PII by recipient-record id.
6. Tenant isolation on both commercial and PII tables.
7. Hosting encryption-at-rest when a Production store is later selected (H-202 HOLD; not chosen here).
8. Application-level encryption **optional Owner/ops** only after a secret-management product is authorized — not a substitute for (1)–(6).

---

### 25.11 Migration 130 reconciliation

130 remains **Dev/Test history**. Do not modify it. Do not copy it into Production.

| | |
| --- | --- |
| Reuse conceptually | `DEL-*` / `DLA-*` identities; tenant FKs; DOC/ISS/programme FKs; insert-only commercial/attempt rows; unique tenant+DOC+**binding**; S2/eligibility as application rules |
| Must change | Remove raw `recipient_email` from insert-only tables; mock sender/provider/template CHECKs; `platform.admin` as Production authority; event vocabulary for bounce/complaint (separate increment) |
| Must not be promoted | `noreply@sedmc.invalid`; `devtest-mock`; `h203-del-v1` mock disclaimer; `recipient_email` on immutable rows |
| Data migration | **None** to Production (Production has no 130 data). Dev/Test 130 rows stay on Dev/Test |
| Dev/Test compatibility | Leave 130 as-is for mock tests; Production uses a **new** additive migration (131+ **only if later authorized**) creating commercial tables **and** (if Option B) a separate PII table |
| Additive | Yes: new objects. Do not ALTER 130 in Production (130 must not be applied there) |

---

### 25.12 Provider implications (provider unselected)

To send, the provider **must receive** the To address at transmission time (from the PII record or from a transient B2 payload under Option D).

| Topic | PII-model requirement |
| --- | --- |
| Return metadata | Message id / provider_reference; status codes; **not** extra harvested person fields |
| Events | Bounce/complaint ids mapped to DLA via provider_reference |
| Provider retention | DPA; EOS erase does not automatically erase vendor copies |
| Transfer / region | Owner/legal with product selection |
| Webhook minimization | Persist event class + provider_event_id + mapped DLA; **do not** store raw payloads that embed the address if avoidable |
| Deletion | Provider API/DPA process; vendor must not become an **uncontrolled** EOS contact SoR |

---

### 25.13 Audit model after PII erasure

Immutable proof target:

`principal P (B2 authority A) authorized DEL-* at time T to transmit DOC-* / ISS-* (hashes Hc, Ha) related to organization O, bound to recipient-record R-*, attempt DLA-* result R with provider_reference X`

Without retaining the raw email. PDF and ordinary commercial proposal responses **never** contain the recipient email.

---

### 25.14 Design decision matrix

| Design issue | Current Dev/Test | Production requirement | Decision status | Owner/DPO/POA action |
| ------------ | ---------------- | ---------------------- | --------------- | -------------------- |
| PII purpose | Mock To on DEL/DLA for mock send | Narrow execution+bounded support; not CRM | **Proposed; not legally closed** | Owner accept purpose; DPO lawful basis |
| PII storage location | `recipient_email` on insert-only DEL+DLA | Separate erasable record **or** Option D (none in EOS) | **B recommended if held; D alternative; A not recommended** | Owner/DPO **select B or D** |
| Immutability | DEL/DLA insert-only **including** email | Commercial/audit insert-only **excluding** raw email | **Design closed as direction; schema not authorized** | POA later schema increment |
| Erasure | Impossible on 130 | Erase PII record; tombstone R-*; no DLA rewrite | **Awaiting DPO** (whether required) | DPO process; Owner accept |
| Rectification | N/A (mock) | Wrong address = new DEL+B2; not UPDATE DEL | **Design closed as direction** | Commercial Director operating procedure |
| Retention | None | Distinct PII vs audit vs backup clocks | **OPEN — do not invent periods** | Owner/DPO |
| API visibility | `proposal:read` returns email | Metadata without PII; PII only write+B2 (or later dedicated capability) | **Design closed as direction; capability name OPEN if Owner wants a new one** | Owner/POA (new capability **only if they require it**) |
| Recipient relatedness | Org id + typed address | Same minimum; no CRM; no auto-discovery | **Design closed as direction** | Owner confirm |
| Recipient confirmation | Boolean on DEL | Boolean + principal + timestamp; not mailbox proof | **Design closed as direction** | Commercial Director |
| CRM relationship | Not used as SoR | Must not be used | **Closed (forbid)** | POA enforce in later increment |
| Audit evidence | Address omitted from chained audit; present in API | Keep omission; prove via R-* | **Design closed as direction** | POA |
| Provider transmission | Mock only | To required at send; DPA for vendor copy | **Blocked on provider+DPA** | Owner select product; Legal DPA |
| Webhook minimization | None | No raw address in stored payload if avoidable | **Separate increment** | POA later |
| Tenant isolation | `tenant_id` on DEL/DLA | Same on commercial **and** PII tables | **Design closed as direction** | POA |
| Migration strategy | 130 Dev/Test only | New additive Production migration; do not copy 130 | **Closed as direction; 131 not authorized** | POA + Owner deploy grant |
| Security controls | Authz + mock fail-closed | §25.10 minimum; encryption not primary | **Design closed as direction** | Owner/ops when hosting exists |
| Backup implications | H-112 disposable Dev/Test | PII table vs commercial table backup policy | **OPEN** | Owner/DPO + infra (H-202 HOLD) |
| Option C binding hash | Idempotency hashes email into key **and** stores email | Hash on DEL only if §13 authorizes | **OPEN** | Owner/DPO (H-131 §13) |
| Organisational vs named-person mailbox | Any email-shaped string except `@sedmc.local` | Policy whether only org mailboxes allowed | **OPEN** | Owner/DPO |
| H-133 §5.6 notification outbox | Separate surface | Not closed by this gate | **Remains OPEN** | Owner (notifications, not H-203 send) |

---

### 25.15 Final gate — who must decide what

`DEV/TEST DEL/DLA: COMPLETE`

`MIGRATION 130: DEV/TEST ONLY — NOT PROMOTABLE`

`PRODUCTION RECIPIENT PII: BLOCKED`

`PRODUCTION SCHEMA IMPLEMENTATION: NOT AUTHORIZED`

`PRODUCTION PROVIDER: NOT SELECTED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

| Actor | Decisions still required |
| --- | --- |
| **Owner** | Accept delivery-PII **purpose**; choose **B vs D** (hold To in EOS or not); organisational vs named-person mailboxes; backup policy; whether a **new permission** is required; H-131 §13 grant for any Production PD capability; hosting/deploy grant later |
| **DPO / privacy owner** | Lawful basis (no conclusion here); whether erasure is required; whether an email hash is personal data; PII vs audit **retention clocks**; DSR procedure; PDPA/PDPC applicability remains **outside** this record |
| **Commercial Director** | Confirmation operating procedure; relatedness practice (org only); template still separate (§24) |
| **POA** | Keep 130 unmodified; refuse Production copy of 130; later authorize schema/API increment **only after** Owner+DPO selection; no new role unless Owner asks |
| **Future implementation authorization** | Schema (131+ if granted); API split; optional Option C; provider/webhooks/monitoring/send flags remain **later and separate** (§24 increments A–F, with A now meaning “implement the Owner-selected B or D model”) |

**Smallest next step:** Owner + DPO select **B or D** and close lawful basis / erasure / retention. Until then: no Production schema, no 131, no provider, no send.

**Successor:** §26 (2026-09-28) records the Owner/POA **architecture** selection of **Option B**. Privacy/legal clocks, H-131 §13, schema, provider, and send remain **blocked**.

### 25.16 Files / safety

This increment: `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` only. No application/schema/provider/credential/migration-131 change. No Production change. No external communication. `productionReady = false`.

---

## 26. Owner/POA decision — Production recipient-PII architecture Option B (2026-09-28)

**Date:** 2026-09-28.  
**Nature:** governance / architecture decision record only.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index empty. Unrelated dirty tree preserved. No commit. No push.

This prompt is explicit Owner/POA authorization to **close the §25 architecture choice**. It is **not** implementation authorization. It does **not** modify application code, schema, migration 130, or create migration 131. It does **not** select a provider, configure SMTP or credentials, send email, contact any recipient, change Production, or set `productionReady=true`.

Historical §25 is **not rewritten**. It remains the options analysis. This section records the selection.

`OPTION B: SELECTED AS PRODUCTION RECIPIENT-PII ARCHITECTURE`

`PRODUCTION RECIPIENT PII IMPLEMENTATION: NOT AUTHORIZED`

`PRODUCTION SCHEMA IMPLEMENTATION: NOT AUTHORIZED`

`MIGRATION 131: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION EXTERNAL DELIVERY: NOT AUTHORIZED`

---

### 26.1 Owner/POA architecture decision

**SELECTED:** Option B.

> Erasable delivery-recipient record; DEL/DLA remain immutable without raw recipient email.

| Item | Decision |
| --- | --- |
| Production recipient architecture | **Option B** |
| Where raw recipient email may exist | **Only** in a dedicated **erasable** delivery-recipient record associated with the delivery identity (`DEL-*`) |
| DEL / DLA | Remain **immutable** historical delivery/attempt records |
| Raw email on DEL/DLA after erasure | **Must not** be retained |
| After erasure | Delivery chain retains only the minimum **non-PII tombstone/reference** (`R-*` or equivalent) needed for audit integrity |

**Not selected:**

- **Option A** — immutable email forever on DEL/DLA — **rejected** as the Production direction (§25.4).
- **Option C** — binding hash plus erasable value — **not selected at this stage**. Still requires a separate H-131 §13 privacy-architecture grant if ever proposed.
- **Option D** — EOS never stores the To address — **not selected**.

**Refinement of §22.4 (form, not purpose):** Dev/Test 130 may keep mock `recipient_email` on insert-only DEL/DLA. Production must **not** copy that form. The approved Production *purpose* remains the delivery chain (not CRM). The approved Production *form* is Option B.

Dev/Test DEL/DLA implementation (§23) and migration 130 are **unchanged** by this record.

---

### 26.2 Purpose limitation

Recipient email exists **solely** for:

1. executing an authorized **B2** transmission of an **already-generated** client-safe PDF;
2. retrying that **same** authorized transmission where §22.6 still permits;
3. **bounded** operational investigation/support of that transmission.

It is **not** a CRM or customer-master contact store and **must not** become one. It is not ISS/DOC/PDF content. It is not a reusable address book.

This is an **architecture/purpose** statement. It is **not** a lawful-basis finding.

---

### 26.3 No CRM discovery

Preserved and binding:

- EOS **must not** silently discover recipients from CRM/contact records.
- EOS **must not** automatically populate recipients from an allowlist.
- `crm_contacts` / `PERSON_DOMAIN_REMOVED` remain not a delivery source.
- Organization `primaryEmail` is **not** an auto-To.

Recipient remains **operator-supplied** at B2 time.

---

### 26.4 Recipient confirmation and relatedness

Preserved and binding:

- Address must be **explicitly supplied** and **confirmed**.
- Recipient must be **related** to the ISS commercial file’s **organization** (`relatedOrganizationId` match; tenant-valid).
- Confirmation is operator attestation (principal + timestamp in a future implementation), **not** mailbox-ownership verification.
- Recipient change remains **new DEL + new B2**, not a mutation of the existing DEL.

---

### 26.5 Erasure architecture (intended future Production behavior — not implemented)

When an authorized erasure event later occurs (timing **unset** — DPO/Owner):

1. The erasable recipient **value** is removed or rendered non-identifying.
2. Immutable **DEL / DLA / audit** history **survives**.
3. Historical delivery evidence is **not rewritten** (no mutation of attempts into different attempts; no back-dating).
4. The resulting staff-readable commercial/delivery metadata **must not** expose the former raw email through normal reads.
5. **Backups and replicas** must be covered by the **eventual** approved retention/erasure policy (policy **not** specified here; no period invented).

After erasure, retry that still needs a To address requires **re-supply and re-confirmation** under the applicable B2/S2 rules; the tombstone alone is not a sendable mailbox.

---

### 26.6 Privacy / legal decisions still OPEN

**Architecture (this section) ≠ legal/privacy closure.**

Still **OPEN** — do not invent values:

| Item | Status |
| --- | --- |
| Lawful basis | **OPEN** — no conclusion |
| Retention period (PII vs commercial audit) | **OPEN** — no period invented |
| Erasure timing / DSR trigger | **OPEN** |
| Backup / replica treatment | **OPEN** |
| Organizational mailbox vs named-person mailbox | **OPEN** |
| Whether H-131 §13 requires **additional** authorization before Production PII persistence | **OPEN** — this Option B record does **not** itself close §13 |
| Whether a **dedicated permission** is required to view recipient PII (vs `proposal:write` + B2) | **OPEN** |

H-133 §5.6 (notification outbox) remains a **separate** OPEN Owner decision and is **not** closed here.

Selecting Option B means Production EOS **would** hold the To address in the erasable record if/when implemented. That makes in-EOS DSR for that record a live design consequence (**§25 C5**). It does **not** invent a DSR procedure or legal duty.

---

### 26.7 Production implementation gate

| Statement | Binding |
| --- | --- |
| Option B is the approved **architectural direction** | **Yes** |
| Production schema implementation | **NOT AUTHORIZED** |
| Migration 131 | **NOT AUTHORIZED** |
| Migration 130 promotion / modification | **NOT AUTHORIZED** (130 remains Dev/Test history) |
| Real external delivery / Production send | **NOT AUTHORIZED** |
| Provider / credentials / SMTP / webhooks / monitoring / deployment | **NOT AUTHORIZED** (remain §24 gates) |

Production implementation remains gated on:

1. closure of the outstanding **privacy/legal** controls in §26.6 (and H-131 §13 if Owner/DPO determine it is required);
2. the separate **provider / DPA / sender / template / operations / secrets / monitoring / deployment** gates in §24;
3. a **later explicit** implementation increment **and** explicit Production send authorization.

`productionReady = false`.

---

### 26.8 Decision matrix (architecture vs remaining gates)

| Design issue | Status after this record |
| --- | --- |
| PII storage architecture | **CLOSED — Option B** |
| Purpose limitation (architecture) | **CLOSED** as §26.2 |
| CRM discovery | **CLOSED — forbidden** |
| Confirmation + org relatedness | **CLOSED** as operating rules (implementation later) |
| Erasure **architecture** (tombstone; no rewrite) | **CLOSED** as direction |
| Erasure **timing**, retention, backups, lawful basis | **OPEN** |
| H-131 §13 additional grant | **OPEN** |
| Dedicated PII-read permission | **OPEN** |
| Mailbox class (org vs named person) | **OPEN** |
| Option C | **NOT SELECTED** |
| Schema / 131 / send / provider | **NOT AUTHORIZED** |

---

### 26.9 Files / safety

This record: `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` only (§26 plus status/successor pointers). No application, schema, provider, credential, or migration change. Migration 130 untouched. Migration 131 absent. Dev/Test DEL/DLA untouched. Production untouched. No email sent. `productionReady = false`. No commit. No push.

**Successor:** §27 (2026-09-28) records **proposed Owner/Commercial Director** operating controls for Option B. DPO/privacy validation (A–D), H-131 §13, and Production implementation remain **required / not authorized**. Historical §27 template fields are superseded by the populated §27.2 record below; §25 and §26 are **not rewritten**.

---

## 27. Production recipient-PII privacy/legal decision closure — Option B controls

**Date:** 2026-09-28 (populated Owner/Commercial Director proposed direction).  
**Nature:** governance record of **proposed business-control positions**. This is **not** DPO/legal approval, legal advice, or Production implementation authorization.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index empty. Unrelated dirty tree preserved. No commit. No push.

Historical **§25** (options) and **§26** (Option B architecture) are **not rewritten** and are **not reopened**.

This section does **not** modify application code, APIs, RBAC, schema, migration 130, or create migration 131. It does **not** add `proposal:read:recipient_pii`, implement retention/erasure jobs, configure backups, select a provider, send email, or change `productionReady`.

**Authority distinction:** Owner/Commercial Director direction below is the proposed business-control position. Privacy/legal questions (especially A–D) are marked **OWNER/COMMERCIAL DIRECTION — DPO/PRIVACY VALIDATION REQUIRED** (or the adjacent validation label stated on that item). They are **not** recorded as DPO/legal approval.

---

### 27.1 Already CLOSED (do not reopen)

From §26 (and preserved §22 recipient rules):

| Closed item | Binding record |
| --- | --- |
| Production recipient-PII **architecture** | **Option B** |
| Where recipient email may exist if later authorized | Dedicated **erasable** delivery-recipient record associated with `DEL-*` |
| DEL / DLA | **Immutable** historical delivery/attempt records |
| After approved erasure | Raw recipient email **must not** remain in immutable delivery history; only a non-PII tombstone/reference |
| Purpose limitation | B2 transmission of an already-generated client-safe PDF; permitted same-authorization retry; bounded support — **not** CRM/customer-master |
| CRM / allowlist discovery | **Forbidden** |
| Confirmation + relatedness | Explicit supply/confirmation; related to the ISS commercial file’s **organization** |

Architecture is **closed**. Proposed A–G operating controls are **recorded** below. DPO/privacy validation and H-131 §13 remain **required** before Production implementation.

---

### 27.2 Proposed Owner/Commercial Director decisions (A–G)

#### A. Lawful basis

**Proposed Owner/Commercial Director position:** process recipient email under legitimate interests for the narrowly defined purpose of executing an explicitly authorized B2 client-document transmission, with a documented balancing assessment and DPO/privacy validation before Production implementation. Where an existing contractual relationship makes contract performance the applicable basis, that basis may be documented separately for the relevant processing context.

| Field | Value |
| --- | --- |
| Status | **OWNER/COMMERCIAL DIRECTION — DPO/PRIVACY VALIDATION REQUIRED** |
| DPO/legal approval | **Not recorded. Not claimed.** |
| Legal advice | **This is not legal advice.** |
| PDPA/PDPC applicability | **Not determined here. No exemption asserted.** |

#### B. Retention

**Proposed Owner position:** raw recipient email should be retained for no longer than 30 days after the final delivery attempt, cancellation, or expiry of the delivery authorization, whichever occurs first, unless a documented legal/support hold applies.

| Field | Value |
| --- | --- |
| Status | **OWNER DIRECTION — DPO/PRIVACY VALIDATION REQUIRED** |
| Raw PII vs immutable audit/DEL/DLA retention | Distinct clocks. The 30-day figure applies to **raw recipient email** on the erasable record only. Immutable commercial/audit retention is **not** set by this 30-day direction. |
| Retention job / schema | **Not implemented** |

#### C. Erasure

**Proposed Owner position:** after the applicable retention period, raw recipient email is to be erased from the erasable recipient record. Immutable DEL/DLA history remains intact but must retain only the minimum non-PII tombstone/reference necessary for audit integrity.

**Also:** a cancelled, expired, or otherwise completed delivery must not retain raw recipient email indefinitely merely because no successful delivery occurred.

| Field | Value |
| --- | --- |
| Status | **OWNER DIRECTION — DPO/PRIVACY VALIDATION REQUIRED** |
| Erasure clock (proposed) | Starts from final delivery attempt, cancellation, or expiry of the delivery authorization, subject to legal/support hold |
| DEL/DLA/audit after erasure | Intact; no rewrite; no raw email |
| Erasure workflow | **Not implemented** |

#### D. Backups, replicas and logs

**Proposed Owner position:** raw recipient email must not be written to ordinary application logs or immutable audit events.

**Proposed Owner position:** Production backups and replicas must be governed by a documented retention/erasure policy compatible with the approved recipient-PII retention boundary. Restoration must not silently reintroduce erased recipient PII into active Production without the approved erasure controls being reapplied.

**Backup retention duration:** **not invented** in this record.

| Field | Value |
| --- | --- |
| Status | **OWNER DIRECTION — DPO/INFRASTRUCTURE VALIDATION REQUIRED** |
| Backup product / SLA | **Not selected. No deletion SLA invented.** |
| H-202 hosting | Remains **HOLD** |

#### E. Recipient mailbox type

**Proposed Owner position:** both organizational and named-person **business** email addresses may be permitted, provided the address is explicitly supplied/confirmed by an authorized operator and is demonstrably related to the commercial organization/file.

Preserved restrictions (binding):

- no CRM discovery
- no silent allowlist discovery
- no unrelated recipient
- no CC
- no BCC
- one To recipient per DEL
- changing recipient requires a new DEL and new B2 authorization

| Field | Value |
| --- | --- |
| Status | **OWNER DIRECTION** |
| Additional named-person controls beyond confirmation + relatedness | Not added in this increment beyond the preserved restrictions |

#### F. H-131 §13

**Proposed Owner position:** additional H-131 §13 authorization is required before Production recipient-PII implementation because the capability introduces a dedicated EOS persistence surface for recipient personal data.

| Field | Value |
| --- | --- |
| Status | **OWNER AUTHORIZATION REQUIRED BEFORE IMPLEMENTATION** |
| §13 grant itself | **Not issued in this increment** |
| Authorization mechanism | **Not implemented** |

#### G. PII read permission

**Proposed Owner position:** raw recipient email must not be exposed through ordinary `proposal:read:proposal`.

**Proposed future permission:** `proposal:read:recipient_pii` — intended to protect raw recipient-email visibility separately from ordinary commercial proposal access.

| Field | Value |
| --- | --- |
| Status | **OWNER DIRECTION — IMPLEMENTATION NOT YET AUTHORIZED** |
| RBAC / permission added | **No** |

---

### 27.3 Explicit implementation gate

Proposed A–G Owner/Commercial Director direction is **recorded**. It does **not** authorize Production recipient-PII work.

Still required **before**:

- Production recipient-PII **schema** implementation
- **Migration 131**
- Production recipient **API** behavior
- Production **erasure** workflow
- Production **handling** of recipient PII
- adding `proposal:read:recipient_pii` or any RBAC change

are:

1. **DPO/privacy validation** of A–D (and DPO/infrastructure validation of backup/replica/log treatment);
2. **Additional H-131 §13 authorization** (F);
3. a later increment that is explicitly authorized to implement G and Option B schema.

Even after those close, **separate** §24 Production delivery gates remain:

- provider + DPA
- sender identity / domain
- approved Production template
- secrets / credentials
- monitoring and operations
- deployment authorization
- explicit Production send authorization

---

### 27.4 Status block

`OPTION B ARCHITECTURE: APPROVED`

`PROPOSED A–G OWNER DIRECTION: RECORDED`

`DPO/PRIVACY VALIDATION: REQUIRED FOR A–D`

`H-131 §13 ADDITIONAL AUTHORIZATION: REQUIRED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`

`MIGRATION 131: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION: UNTOUCHED`

`productionReady=false`

### 27.5 Files / safety

This increment: `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` only (populate §27; status/successor pointers). No code, schema, API, RBAC, provider, credential, retention/erasure job, backup config, or migration change. Migration 130 untouched. Migration 131 absent. Production untouched. No email sent. No commit. No push.

### 27.6 Reconfirmation (same date)

A later same-day Owner/Commercial Director governance prompt required the same proposed A–G positions and the same implementation gates. Those positions were **already recorded** in §27.2–§27.4. This subsection confirms inspection: **no** DPO/legal approval was added; **no** A–G text was silently closed as final law; **§25 and §26 were not rewritten**; Option B was **not** reopened. No schema, RBAC, `proposal:read:recipient_pii`, migration 131, provider, send, or Production change is authorized.

**Successor:** §27.7 is the DPO/Owner **decision pack** (D1–D7). It does **not** answer those questions and does **not** rewrite A–G.

---

### 27.7 DPO/Owner decision pack (D1–D7)

**Date:** 2026-09-28. Original pack left Decision fields blank as a checklist. **Same-date correction:** Owner/POA positions below are **recorded**. That does **not** rewrite §25, §26, or §27.1–§27.6. It does **not** claim DPO, legal-counsel, or implementation approval.

**Layer legend**

| Layer | Meaning |
| --- | --- |
| `OWNER/POA DECISION` | Recorded Owner/POA position for this item |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | Still required where stated; **not completed**; **not claimed** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** for every D1–D7 item |

Owner/CD A–G in §27.2 remain the source of the same business positions. This subsection aligns D1–D7 with those positions so they are **not** treated as unanswered Owner/POA questions.

**Closing Owner/POA D1–D7 does not authorize Production external delivery.** Separate gates remain: Production recipient-PII schema/API; provider + DPA; sender identity/domain; Production template; secrets/credentials; operations/monitoring; deployment authorization; explicit Production send authorization. Migration 131 remains **NOT AUTHORIZED**. `proposal:read:recipient_pii` remains **unimplemented**.

#### D1 — Lawful basis

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Legitimate interests for the narrowly defined purpose of transmitting an already-authorized client proposal; supported by a documented balancing assessment; contract performance may apply where appropriate. |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **REQUIRED** (DPO/privacy). **Not completed. Not claimed.** Not legal advice. PDPA/PDPC applicability not determined here. |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** |

#### D2 — Raw recipient-email retention

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Raw recipient email retained for no longer than 30 days after the final delivery attempt, cancellation, or expiry of delivery authorization, whichever occurs first, except where a documented legal/support hold requires longer retention. Distinct from immutable DEL/DLA/audit retention (not set by this 30-day figure). |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **REQUIRED** (DPO/privacy). **Not completed. Not claimed.** No legal/DPO approval of the 30-day period is asserted. |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** (no retention job) |

#### D3 — Erasure trigger and treatment

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Erase raw recipient email after the applicable retention period. Immutable DEL/DLA history may retain only the minimum non-PII tombstone/reference necessary for historical integrity. Cancelled, expired, or completed delivery records must not retain raw recipient email indefinitely merely because delivery was unsuccessful. |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **REQUIRED** (DPO/privacy). **Not completed. Not claimed.** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** (no erasure workflow) |

#### D4 — Backups / replicas / logs

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | No raw recipient email in ordinary application logs or immutable audit events. Backups and replicas must be governed by a documented retention/erasure policy compatible with the recipient-PII boundary. Restore procedures must not silently reintroduce erased recipient PII without corresponding erasure controls. **No backup duration is invented.** |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **REQUIRED** (DPO/privacy **and** infrastructure). **Not completed. Not claimed.** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** (no backup/log product change) |

#### D5 — Mailbox type

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Organizational and named-person business email addresses may be permitted when explicitly supplied/confirmed and related to the commercial organization/file. No CRM discovery. No allowlist discovery. No unrelated recipients. No CC/BCC. One `To` recipient. Changing recipient means a new DEL and new B2 authorization. |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **Not stated as a remaining DPO gate for this item** (Owner/POA operating rule). Does **not** authorize send. |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** (no recipient-validation code change) |

#### D6 — H-131 §13

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Additional H-131 §13 authorization is **required** before Production recipient-PII implementation. This does **not** authorize the implementation itself. The §13 **grant is not issued** by this record. |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | Owner/legal/regulatory acceptance of the §13 grant remains **outstanding**. **Not claimed as granted.** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** |

#### D7 — PII read permission

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | Raw recipient email must not be exposed through ordinary `proposal:read:proposal`. Dedicated `proposal:read:recipient_pii` is the approved Owner/POA direction for any **future** controlled PII read capability. |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **Not stated as a remaining DPO gate for this item.** Permission is **not implemented**. |
| `IMPLEMENTATION AUTHORIZATION` | **NOT AUTHORIZED** (RBAC unchanged; `proposal:read:recipient_pii` **not** added) |

#### Production gate (this pack)

`OWNER/POA DECISIONS: RECORDED`

`DPO/PRIVACY/INFRASTRUCTURE VALIDATION: REQUIRED WHERE STATED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`

`MIGRATION 131: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION: UNTOUCHED`

`productionReady=false`

`OPTION B ARCHITECTURE: APPROVED`

This correction: documentation only. No code, schema, API, RBAC, migration 131, provider, credentials, send, or Production change.

**Successor:** `docs/governance/h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md` (2026-09-28) is the human DPO/privacy and infrastructure **validation pack** for D1–D4 and the D6 §13 gate. It does **not** reopen or replace §27.7 Owner/POA decisions. It does **not** infer approval or authorize implementation.

**Successor:** §27.8 (2026-09-28) records that H-131 §13 additional authorization is **issued** for the Option B Production recipient-PII capability. Historical §27.7 D6 text (grant not issued by that correction) is **not rewritten**. D1–D4 validation remains outstanding. Real send and migration 131 execution remain unauthorized.

---

### 27.8 H-131 §13 additional authorization — ISSUED (2026-09-28)

**Nature:** governance record of Owner/POA **H-131 §13** issuance. Does **not** rewrite §25, §26, or §27.1–§27.7. Does **not** implement recipient PII. Does **not** constitute DPO/legal approval. Does **not** close D1–D4.

`OWNER/POA DECISION: H-131 §13 AUTHORIZATION ISSUED`

`H-131 §13 ADDITIONAL AUTHORIZATION: ISSUED`

**Purpose:** authorization for the dedicated Production recipient-PII implementation required by the already-approved H-203 **Option B** architecture — the controlled Production recipient-PII persistence/access capability necessary to implement Option B.

This issuance does **NOT** by itself authorize:

- real external email delivery;
- Production provider selection;
- SMTP/API credentials;
- Production sending;
- sender-domain configuration;
- client-facing delivery;
- deployment;
- **migration 131 execution**;
- closure of D1–D4 DPO/privacy/infrastructure validation;
- any other H-203 Production gate that remains open.

| Layer | Record |
| --- | --- |
| `OWNER/POA DECISION` | `H-131 §13 AUTHORIZATION ISSUED` for Option B Production recipient-PII implementation contemplated by H-203 |
| `DPO/PRIVACY/INFRASTRUCTURE VALIDATION` | **Not** supplied by this grant. D1–D3 DPO/privacy, D4 DPO/privacy, and D4 infrastructure remain **OUTSTANDING** |
| `IMPLEMENTATION AUTHORIZATION` | Production recipient-PII implementation is **authorized in principle, subject to remaining applicable H-203 validation/governance gates**. This record does **not** authorize writing schema, APIs, RBAC, or executing migration 131 |

`H-131 §13 AUTHORIZATION: ISSUED`

`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: AUTHORIZED IN PRINCIPLE, SUBJECT TO REMAINING APPLICABLE H-203 VALIDATION/GOVERNANCE GATES`

`MIGRATION 131: NOT AUTHORIZED FOR EXECUTION BY THIS RECORD`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION SEND: NOT AUTHORIZED`

`PRODUCTION: UNTOUCHED`

`productionReady=false`

H-131 §13 alone does **not** make Production ready.

**Successor:** §27.9 (2026-09-28) records Owner/POA **D1–D4 determinations as closed**. DPO/privacy (D1–D4) and D4 infrastructure validation remain **OUTSTANDING**. Historical §27.8 is **not rewritten**.

---

### 27.9 Owner/POA D1–D4 determinations — CLOSED (2026-09-28)

**Nature:** Owner/POA governance determinations in the company's best interest. Does **not** rewrite §25, §26, or §27.1–§27.8. Does **not** constitute DPO, legal-counsel, or infrastructure approval. Does **not** implement recipient PII, execute migration 131, or authorize send.

`D1 OWNER/POA DECISION: CLOSED`  
`D2 OWNER/POA DECISION: CLOSED`  
`D3 OWNER/POA DECISION: CLOSED`  
`D4 OWNER/POA DECISION: CLOSED`  
`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`  
`D6 H-131 §13 AUTHORIZATION: ISSUED`

#### D1 — Lawful basis

`OWNER/POA DECISION: LEGITIMATE INTERESTS ADOPTED`

Legitimate interests are adopted for the narrowly defined B2 transmission purpose. A documented balancing assessment is required. Contract performance may apply where genuinely applicable to the specific processing context.

`OWNER/POA DECISION: CLOSED`  
`DPO/PRIVACY VALIDATION: OUTSTANDING`

#### D2 — Retention

`OWNER/POA DECISION: 30-DAY MAXIMUM RAW-EMAIL RETENTION ADOPTED`

Raw recipient email may be retained for no longer than 30 days after whichever occurs first: final delivery attempt; cancellation; or expiry of delivery authorization. A documented legal/support hold may require longer retention. The hold must be documented and must not become an implicit indefinite-retention mechanism. This is **not** legal/DPO approval of the 30-day period.

`OWNER/POA DECISION: CLOSED`  
`DPO/PRIVACY VALIDATION: OUTSTANDING`

#### D3 — Erasure

`OWNER/POA DECISION: RAW RECIPIENT EMAIL ERASURE REQUIRED`

Raw recipient email must be erased after the applicable retention period. Immutable DEL/DLA history may retain only the minimum non-PII tombstone/reference necessary for historical integrity. Failed, cancelled, or expired delivery does not justify indefinite retention of raw recipient email. Erasure must cover the designated erasable recipient-PII storage boundary. Provider-side copies, backups, replicas, and other derived copies must be addressed by their applicable retention/erasure controls.

`OWNER/POA DECISION: CLOSED`  
`DPO/PRIVACY VALIDATION: OUTSTANDING`

#### D4 — Backups / replicas / logs

`OWNER/POA DECISION: PII-MINIMIZATION AND CONTROLLED BACKUP/RESTORE POLICY ADOPTED`

Raw recipient email must not appear in ordinary application logs or immutable audit events. Backups and replicas must be governed by a documented retention/erasure policy compatible with the recipient-PII boundary. Restoration must not silently reintroduce recipient PII that was previously erased. Restore/rehydration procedures must include appropriate controls for previously erased recipient PII. **No backup-retention duration is invented or hard-coded by this record.** No infrastructure implementation is authorized by this record.

`OWNER/POA DECISION: CLOSED`  
`DPO/PRIVACY VALIDATION: OUTSTANDING`  
`INFRASTRUCTURE VALIDATION: OUTSTANDING`

#### Gates not changed by D1–D4 Owner closure

Owner/POA D1–D4 closure does **not** bypass remaining DPO/privacy or infrastructure validation.

`PRODUCTION RECIPIENT-PII IMPLEMENTATION EXECUTION: NOT YET AUTHORIZED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`PRODUCTION SEND: NOT AUTHORIZED`  
`PROVIDER/SMTP/API CREDENTIALS: NOT AUTHORIZED`  
`PRODUCTION DEPLOYMENT: NOT AUTHORIZED`  
`PRODUCTION: UNTOUCHED`  
`productionReady=false`

**Successor:** §27.10 (2026-09-28) records the Option B **implementation design specification** as prepared. DPO/privacy (D1–D4) and D4 infrastructure validation remain **OUTSTANDING**. Implementation execution remains **NOT AUTHORIZED**. Historical §27.9 is **not rewritten**.

---

### 27.10 Option B Production recipient-PII implementation design — PREPARED (2026-09-28)

**Nature:** governance/design specification only. Does **not** rewrite §25, §26, or §27.1–§27.9. Does **not** constitute DPO, legal-counsel, or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-implementation-design-specification.md`.

`IMPLEMENTATION DESIGN: PREPARED`  
`MIGRATION 131 DESIGN: PREPARED`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`PRODUCTION SEND: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.11 (2026-09-28) records the Option B implementation-design **consistency audit**. Specialist DPO/privacy and D4 infrastructure validation remain **OUTSTANDING**. Implementation execution remains **NOT AUTHORIZED**. Historical §27.10 is **not rewritten**.

---

### 27.11 Option B implementation-design consistency audit — PASS WITH OPEN VALIDATION DEPENDENCY (2026-09-28)

**Nature:** governance/read-only audit. Does **not** rewrite §25, §26, or §27.1–§27.10. Does **not** constitute DPO, legal-counsel, or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-implementation-design-consistency-audit.md`.

`IMPLEMENTATION DESIGN CONSISTENCY AUDIT: PASS WITH OPEN VALIDATION DEPENDENCY`  
`READY FOR SPECIALIST VALIDATION REVIEW: YES`  
`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.12 (2026-09-28) records the **specialist-validation handoff**. DPO/privacy and D4 infrastructure remain **OPEN / OUTSTANDING**. Implementation execution remains **NOT AUTHORIZED**. Historical §27.11 is **not rewritten**.

---

### 27.12 Specialist-validation handoff — REVIEW-READY (2026-09-28)

**Nature:** governance/handoff preparation only. Does **not** rewrite §25, §26, or §27.1–§27.11. Does **not** constitute DPO, legal-counsel, or infrastructure approval. Does **not** authorize implementation execution. Does **not** reopen Owner/POA D1–D7.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-specialist-validation-handoff.md`.

`READY FOR SPECIALIST VALIDATION REVIEW: YES`  
`DPO/PRIVACY: OPEN`  
`D4 INFRASTRUCTURE: OPEN`  
`D1–D4 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.13 (2026-09-28) records the specialist-validation **gate freeze audit**. Specialist evidence remains **required**. Historical §27.12 is **not rewritten**.

---

### 27.13 Specialist-validation gate freeze audit — PASS (2026-09-28)

**Nature:** freeze/readiness audit only. Does **not** rewrite §25, §26, or §27.1–§27.12. Does **not** answer open questions. Does **not** constitute DPO or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-specialist-validation-gate-freeze-audit.md`.

`PASS — SPECIALIST VALIDATION GATE CORRECTLY FROZEN`  
`DPO/PRIVACY: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`D4 INFRASTRUCTURE: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.14 (2026-09-28) records the **specialist review package** for DPO/privacy and infrastructure reviewers. Specialist evidence remains **required**. Historical §27.13 is **not rewritten**.

---

### 27.14 Specialist review package — HANDOFF (2026-09-28)

**Nature:** governance packaging only. Does **not** rewrite §25, §26, or §27.1–§27.13. Does **not** answer specialist questions. Does **not** constitute DPO or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-specialist-review-package.md`.

`READY FOR SPECIALIST VALIDATION REVIEW: YES`  
`DPO/PRIVACY: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`D4 INFRASTRUCTURE: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.15 (2026-09-28) records the **specialist-validation execution register**. Specialist evidence remains **required**. Historical §27.14 is **not rewritten**.

---

### 27.15 Specialist-validation execution register — GATE OPEN (2026-09-28)

**Nature:** governance execution-register only. Does **not** rewrite §25, §26, or §27.1–§27.14. Does **not** answer Q1–Q13 or I1–I12. Does **not** constitute DPO or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-specialist-validation-execution-register.md`.

`SPECIALIST VALIDATION EXECUTION GATE: OPEN`  
`DPO/PRIVACY: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`D4 INFRASTRUCTURE: OPEN — SPECIALIST EVIDENCE REQUIRED`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`productionReady=false`

**Successor:** §27.16 (2026-09-28) records **issuance** of specialist-validation Request A (DPO/privacy) and Request B (infrastructure). `REQUEST ISSUED` is **not** validation completed. Historical §27.15 is **not rewritten**.

---

### 27.16 Specialist-validation requests — ISSUED (2026-09-28)

**Nature:** governance issuance of specialist review requests only. Does **not** rewrite §25, §26, or §27.1–§27.15. Does **not** answer Q1–Q13 or I1–I12. Does **not** constitute DPO or infrastructure approval. Does **not** authorize implementation execution.

Authoritative artefact: `docs/governance/h-203-production-recipient-pii-specialist-validation-requests.md`.

`SPECIALIST VALIDATION REQUESTS: ISSUED`  
`REQUEST ISSUED ≠ SPECIALIST VALIDATION`  
`DPO/PRIVACY: AWAITING SPECIALIST EVIDENCE`  
`D4 INFRASTRUCTURE: AWAITING SPECIALIST EVIDENCE`  
`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`  
`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`  
`productionReady=false`
