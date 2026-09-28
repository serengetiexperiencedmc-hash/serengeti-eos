# GPTA-H-18 — C1–C10 Capability-Gap Analysis and Requirements Validation

> **`GOVERNANCE-ONLY — ANALYSIS`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`A GAP IS NOT A BUILD GRANT`**  
> **`SOURCE EXISTENCE ≠ LIVE USE ≠ PRODUCTION READY`**  
> **`NO C11+`** · **`NO C1–C10 MODIFY`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T23:35:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved; not cleaned, staged, or discarded).

**Requirements baseline:** [`gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md`](gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md).  
**Freeze:** [`gpta-h-16-owner-decision-and-stage-1-freeze.md`](gpta-h-16-owner-decision-and-stage-1-freeze.md).

Owner operational finding (GPTA-H-11 EX-08): EOS is **`NOT CURRENTLY USED OPERATIONALLY`**. That finding is **not** a technical diagnosis and **not** a rebuild authorization.

---

## 1. Dirty-tree snapshot (inspection only)

Inspected before analysis: `git status --short`, `git diff --stat`, `git diff --cached --stat`.

| Item | Record |
| --- | --- |
| HEAD / branch | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` / `master` |
| Index | **EMPTY** (`git diff --cached --stat` empty) |
| Worktree | **DIRTY** — pre-existing Class A/B, persistence, preview-login, and governance files **preserved** |
| Staged changes | **None** |
| This increment | **Creates** this file and **additive** register rows only |

---

## 2. Method

1. GPTA-H-17 requirement IDs are the baseline.  
2. C1–C10 purpose and Dev/Test state from `docs/architecture/commercial-roadmap.md` and `c1`–`c10` previews.  
3. Field/API evidence from kernel types and preview API lists (read-only).  
4. Live use is **not** inferred from source. Production is **not** inferred from Dev/Test.  
5. Owner/1A inputs are **not** invented: qualification text, loss-reason list, account classification rules, numerical targets.  
6. Additional development = **UNKNOWN** unless a gap is purely a missing Owner definition (then development is **not** implied).

**Reuse classes (this document):**

| Class | Meaning |
| --- | --- |
| **REUSE — DEMONSTRATED** | Dev/Test evidence shows the **structure** satisfies the requirement. **Not** live/operational demonstration. |
| **REUSE — WITH VALIDATION** | Structure appears relevant; live/process validation required. |
| **PARTIAL REUSE** | Some required facts exist; a **specific** gap remains. |
| **NO REUSE EVIDENCE** | No reliable C1–C10 structure for that requirement. |
| **UNKNOWN** | Insufficient evidence. |

Live column: **`UNKNOWN — LIVE VALIDATION REQUIRED`** wherever EOS is unused in operations.

---

## 3. C1–C10 inventory (read-only)

Documented state for all ten: **IMPLEMENTED / CLOSED (Dev/Test)**. Persistence historically dual-path (in-memory read SoR + PostgreSQL schema). Production CRM **NOT APPROVED**. Demo/seed data ≠ live pipeline.

| ID | Name | Documented purpose | Dev/Test state | Primary evidence | Known interfaces | Persistence (docs) | Operational deps | Documented limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **C1** | CRM Foundation | Orgs, contacts, relationships, accounts, activities, tasks, notes, tags, import/merge | **CLOSED** Dev/Test | `docs/architecture/c1-crm-preview.md`; `packages/kernel/src/crm.ts`; `apps/api/src/crm/` | `/v1/crm` (historical C1 API pack) | C1 CRM tables / dual-path overlay | I0–I4 | Not opportunities/RFP; no 3,000+ contact import executed; Production not approved; `estimatedCommercialValue` historically **out of C1 scope** |
| **C2** | Opportunity / Pipeline | Opportunities, stages, board, stage history, forecasting **hooks** | **CLOSED** Dev/Test | `c2-opportunity-preview.md`; `packages/kernel/src/opportunity.ts`; `apps/api/src/pipeline/` | `/v1/pipeline`; UI `/commercial/pipeline` | `015_c2_opportunity.sql` | C1 | **Demo seed** of three mock opportunities; not live SoR |
| **C3** | RFP Management | Intake, workflow stages, versions, SLA helpers | **CLOSED** Dev/Test | `c3-rfp-preview.md`; `packages/kernel/src/rfp.ts`; `apps/api/src/rfp/` | `/v1/rfps`; UI `/commercial/rfps` | `016_c3_rfp.sql` | C2 | Demo RFP seed; SLA is due-at helper, not full BR-003 stamp set |
| **C4** | Supplier Management | Supplier master, contacts, rate cards, seasons, import | **CLOSED** Dev/Test | `c4-supplier-preview.md`; `packages/kernel/src/supplier.ts` | `/v1/suppliers`; UI supplier library | `014_c4_supplier.sql`; `055_pg17_rate_seasons.sql` | I1, C1 refs | Rate **metadata**/cards — live rate completeness unknown |
| **C5** | Programme Builder | Day/item itinerary linked to RFP; supplier on items | **CLOSED** Dev/Test | `c5-programme-preview.md`; `packages/kernel/src/programme.ts`; `apps/api/src/programme/` | `/v1/programmes`; builder UI | `017_c5_programme.sql` | C3, C4 | **No builder coding authorized** by this analysis |
| **C6** | Costing Engine | Cost sheet, lines, sell/margin, versions | **CLOSED** Dev/Test | `c6-costing-preview.md`; `packages/kernel/src/costing.ts`; `apps/api/src/costing/` | `/v1/costing`; Live Costing panel | `018_c6_costing.sql` | C4, C5 | Demo cost sheet; not accounting |
| **C7** | Commercial Approval | Margin/threshold workflow via I2 | **CLOSED** Dev/Test | `c7-commercial-approval-preview.md`; `apps/api/src/commercial-approval/` | Approval APIs | C7 schema | C6, I2 | Unused live |
| **C8** | Proposal Engine | Proposal from approved programme + costing; send/accept/reject; versions | **CLOSED** Dev/Test | `c8-proposal-preview.md`; `packages/kernel/src/proposal.ts` | `/v1/proposals`; UI `/commercial/proposals` | `020_c8_proposal.sql` | C6, C7 | Generate path expects C7 approval; demo PROP seed |
| **C9** | Booking & Handover | Booking from **accepted** proposal; handover tasks; **no live banking** | **CLOSED** Dev/Test | `c9-booking-preview.md`; `packages/kernel/src/booking.ts` | Booking APIs | C9 schema | C8 | Deposit invoice is a **handover checklist item**, not an invoice product |
| **C10** | Booking Command Center | Booking rollup | **CLOSED** Dev/Test | `c10-booking-command-center-preview.md`; `packages/kernel/src/booking-command-center.ts` | Command-center UI | C10 | C9 | Not a commercial analytics pack (domain J later) |

**Not C1–C10 (do not treat as Stage 1 C-spine reuse):** I8 `fin_invoices` (accounting-adjacent Dev/Test finance); domain J / `CommercialAnalyticsSummary` scaffolding; C11+. **`COMMERCIAL FINANCIAL REQUIREMENTS` ≠ `ACCOUNTING / FINANCE-SYSTEM INTEGRATION`** (GPTA-H-17 CR-026 **Deferred**).

---

## 4. Gap-analysis matrix (C1–C10)

`Reusable` here means **Dev/Test structure**, not live operations. **Governance status = NOT AUTHORIZED** on every row. **Additional development potentially required** is **UNKNOWN** unless noted — a gap may be process/Excel after 1A.

| Capability | Name | GPTA-H-17 IDs | Business need | Existing Dev/Test capability | Evidence | Reusable (structure) | Coverage | Specific gap | Live validation | Add. dev potentially required | Dev scope known | Dependencies | Owner input | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | CRM Foundation | BR-004, BR-005, BR-007, PR-005, PR-007, PR-010, DR-004, DR-006, DR-008, KR-D03, KR-D04, KR-C04, KR-M01–M05, MR-005, AC-003, AC-004, AC-008, AC-010 | Account, owner, market/buyer, follow-up tasks, classification | Orgs/contacts/accounts/activities/tasks; `market` on org/account; `ownerPrincipalId`; org types include `incentive_house`, `mice_agency`, `corporate`; account `strategicClassification`, `priority`, `nextAction`; tasks `dueAt`/`status`; relationship lifecycle includes Strategic | `crm.ts`; C1 preview | **YES** (structure) | **Partial** | (1) No seed key `pco` or `event_agency` (configurable, not present). (2) No Owner-approved meaning of strategic/repeat/direct/agency flags. (3) Tasks are not first-class linked to RFP/opportunity IDs (`relatedAccountId` etc. only). (4) `source` is CRM provenance, not LinkedIn/Ads/SEO/Instagram. (5) Unused live. | **YES** | **UNKNOWN** | **NO** | I0–I4 | **YES** (classification rules) | **NOT AUTHORIZED** |
| C2 | Opportunity / Pipeline | BR-002, BR-004, BR-006, PR-006–PR-009, DR-001, DR-002, DR-005, DR-007, KR-S05, KR-C01, AC-001, AC-002, AC-005, AC-007, AC-009 | Funnel, owner, value, outcome | Stages `new_qualified`→`rfp_received`→`proposal_sent`→`negotiation`→`won`/`lost`; `ownerPrincipalId`; `estimatedValue`+`currency`; `expectedCloseDate`; stage history + free-text `notes`; board totals | `opportunity.ts`; C2 preview | **YES** (structure) | **Partial** | (1) Stage `new_qualified` **assumes** qualification; no RFP-level qualified/not/not-assessed field or definition version (DR-002). (2) No loss-reason **catalogue** — only optional history notes. (3) No opportunity `nextAction`/`deadline` fields (account has nextAction; opportunity does not). (4) No probability/weighting (not to be invented). (5) Demo seed ≠ live. | **YES** | **UNKNOWN** | **NO** | C1 | **YES** (qualification; loss reasons) | **NOT AUTHORIZED** |
| C3 | RFP Management | BR-001–BR-003, BR-007, PR-001–PR-004, DR-001–DR-003, DR-006, DR-B01, DR-B14, KR-D01, KR-D02, KR-S01, AC-001, AC-006, AC-008 | Capture, source, SLA, received time, workflow | Workflow `intake`→`programme`→`costing`→`approval`→`proposal`→`sent`→`closed`; versions; `receivedAt`; `source` (email/portal/advisor/other); `slaDueAt`/`slaStatus`; `assignedPrincipalId`; link `opportunityId`/`organizationId` | `rfp.ts`; C3 preview | **YES** (structure) | **Partial** | (1) **No clarification stage** and no stamps for clarification requested/completed (Owner process step 2; BR-003). (2) No qualification status on RFP. (3) No stamps for proposal **started** (only workflow at proposal/sent). (4) `source` ≠ market/buyer and ≠ digital channel. (5) SLA helper ≠ measured elapsed times for each BR-003 step. | **YES** | **UNKNOWN** | **NO** | C2 | **YES** (qualification) | **NOT AUTHORIZED** |
| C4 | Supplier Management | CR-S01–CR-S04, AC-010S | Supplier, item, season, rate, currency, validity | Supplier master; `SupRate`: amount, currency, `validFrom`/`validTo`, `unitDescription`, `seasonLabel`/`seasonId`, status; season catalogue; import | `supplier.ts`; C4 preview; PG.17 | **YES** (structure) | **Partial** | (1) No explicit per-rate **last verification** timestamp (supplier has `dataQualityStatus`, not rate-level verification). (2) No explicit “ad hoc vs controlled rate used on this proposal” flag (CR-S04). (3) Live rate completeness **unknown**. | **YES** | **UNKNOWN** | **NO** | I1, C1 | **NO** for catalogue existence; **YES** if business rules for verification | **NOT AUTHORIZED** |
| C5 | Programme Builder | CR-013, CR-015, PR-003, AC-001 | Itinerary/programme creation, version identity | Programme + days + items; link to RFP; supplier on items; APIs/UI | C5 preview; `programme.ts` | **YES** (structure) | **Partial** | (1) Business “client last saw this version” vs internal programme record — proposal versions are on **C8**, not proven as client-facing programme snapshot. (2) Unused live. (3) **Must not** be rebuilt from this gap. | **YES** | **UNKNOWN** | **NO** | C3, C4 | **NO** (rules in 1C) | **NOT AUTHORIZED** |
| C6 | Costing Engine | CR-014, CR-020, CR-021, CR-024, AC-011 | Cost vs sell, margin, currency, versions | Cost sheet + lines; `computeCostTotals`; versions; currency | C6 preview; `costing.ts` | **YES** (structure) | **Partial** | (1) Itemized **client** financial proposal rules (CR-020) are not the same as internal cost-sheet lines — mapping unvalidated. (2) Demo $ figures ≠ SEDMC live. | **YES** | **UNKNOWN** | **NO** | C4, C5 | **YES** (commercial finance rules) | **NOT AUTHORIZED** |
| C7 | Commercial Approval | CR-017, CR-025, AC-011 | Who may commit price / send | I2 margin/threshold approval; C8 generate expects approved request | C7 preview; C8 preview | **YES** (structure) | **Partial** | Owner current process does **not** evidence an EOS approval step; C7 may be extra vs today’s send-from-Office. Fit-to-process **unknown**. | **YES** | **UNKNOWN** | **NO** | C6, I2 | **YES** (who may send) | **NOT AUTHORIZED** |
| C8 | Proposal Engine | CR-014–CR-019, PR-004, PR-006, DR-B14, KR-S02, AC-001, AC-005, AC-011 | Proposal prepare/send/outcome, financial totals, versions, `sentAt` | Status draft→sent→accepted/rejected; `sentAt`; `clientViewedAt`; versions; totals cost/sell/margin; links RFP/programme/cost/approval | `proposal.ts`; C8 preview | **YES** (structure) | **Partial** | (1) No recipient type agent vs client (PR-004). (2) `rejected` has no loss-reason catalogue. (3) Generate-from-C7 may not match manual Office proposal. (4) Not an invoice. | **YES** | **UNKNOWN** | **NO** | C6, C7 | **YES** (loss reasons; send rules) | **NOT AUTHORIZED** |
| C9 | Booking & Handover | BR-002, PR-006, PR-010, DR-B03, KR-S05, AC-005 | Confirmed booking linkage | Booking from **accepted** proposal; links opportunity, RFP, programme; statuses confirmed… | `booking.ts`; C9 preview | **YES** (structure) | **Partial** | (1) Confirm in Owner process may occur **without** EOS accepted-proposal path. (2) Handover “deposit invoice” ≠ CR-022 invoice product. (3) Repeat-business flag not on booking. | **YES** | **UNKNOWN** | **NO** | C8 | **NO** | **NOT AUTHORIZED** |
| C10 | Command Center | BR-004, AC-009, KR-C01 | Rollup visibility | Booking/invoice-count rollup types | C10 preview; `booking-command-center.ts` | **YES** (structure) | **Partial** | Does **not** produce GPTA-H-17 KPI pack (qualified RFPs, SA market, response time, follow-up completion, digital attribution). Domain J **later**; C11+ **not authorized**. | **YES** | **UNKNOWN** | **NO** | C9 | **NO** | **NOT AUTHORIZED** |

---

## 5. Domain findings (A–I)

### A. Qualified RFP management

| Need | C* | Finding |
| --- | --- | --- |
| RFP capture | C3 | **PARTIAL** — create RFP + `receivedAt` optional; unused live |
| RFP source | C3 | **PARTIAL** — `source` = intake channel, not market/buyer/digital |
| Buyer/account | C1+C3 | **PARTIAL** — org/account link; buyer type via org type keys |
| Ownership | C2/C3/C1 | **PARTIAL** — `ownerPrincipalId` / `assignedPrincipalId`; live owner unknown (EX-06) |
| Qualification status/criteria/evidence | C2 | **PARTIAL / Owner** — stage name `new_qualified` only; **no** DR-002 definition version. **Do not invent definition.** |
| Status progression | C2+C3+C8 | **PARTIAL** — product stages ≠ Owner clarification step |
| Deadline / next action / follow-up | C1 account/task; not C2/C3 first-class | **PARTIAL** |
| Proposal status | C8 | **PARTIAL** — product statuses exist |
| Outcome / booking linkage | C2 lost/won; C8 accepted/rejected; C9 booking | **PARTIAL** |

### B. RFP conversion

C2+C8+C9 can **count** RFP→proposal→booking **if** records exist in EOS. Conversion **by source/market/account/buyer** needs C1 `market`/org type + C3 `source` used consistently — **not evidenced live**. Loss **recording** = C2 `lost` / C8 `rejected`; **loss-reason analysis** has **no catalogue**. **Do not invent the list.**

### C. Response speed

| Stamp (BR-003) | Evidence |
| --- | --- |
| RFP received | C3 `receivedAt` optional; else `createdAt` |
| Acknowledgement | **NO REUSE EVIDENCE** as a dedicated stamp |
| Clarification requested/completed | **NO REUSE EVIDENCE** as dedicated fields/stage |
| Proposal initiation | **NO** dedicated `proposalStartedAt`; C8 `createdAt` is a proxy **only if** create = start |
| Proposal sent | C8 `sentAt`; C3 stage `sent` |
| Follow-up | C1 task `dueAt`/`completedAt` — **not** bound to RFP in type |
| Elapsed times | **No** KPI engine in C1–C10 for BR-003 elapsed set; C3 SLA is `slaDueAt` vs now |

**Do not invent SLA targets.**

### D. Pipeline visibility

Status/owner/`estimatedValue`/`expectedCloseDate`/org link: **C2 structure**. Probability/expected-value models: **must not be invented**; **NO REUSE EVIDENCE** for probability. Next action: **C1 account**, not opportunity. Reporting: board totals in C2 UI; **not** GPTA-H-17 KPI pack. Live board = demo seed.

### E. Account management

Identification: **C1**. Classification fields exist (`strategicClassification`, `priority`) but **rules are Owner/1A**. Repeat business: relationship/account history possible; **no** measured repeat-rate. Account-level revenue: **not** a C1–C10 report; would need bookings+finance rules. **Do not invent classification rules.**

### F. Programme / proposal

Itinerary: **C5**. Versioning: programme record + **C8** proposal versions. Client-facing output: C8 proposal **UI/API in Dev/Test**, not proven as Owner’s Office-proposal equivalent. Financial linkage: C8 totals from C6. **Do not build a programme builder.**

### G. Supplier / costing

Supplier/service/item/season/dates/rate/currency/unit/validity: **C4 `SupRate` + seasons**. Source: import `sourceSystem` on supplier, not per-rate verification. Cost calculation/client pricing/margin: **C6**. **Do not create supplier hub.**

### H. Commercial finance vs accounting

| Topic | C1–C10 | Note |
| --- | --- | --- |
| Itemized commercial proposal | C6 lines + C8 totals | Rules unvalidated vs Owner Office proposal |
| Supplier cost / client price / margin | C6/C8 | Demo math ≠ live |
| Invoices / statements | **Not C1–C10** | I8 `fin_invoices` is **out of C-spine**; CR-022 software **Deferred**; CR-026 accounting integration **Deferred** |
| Currency / versioning / C7 approvals | C6/C8/C7 | Structure exists |
| KPI reporting pack | **Not C1–C10** | Domain J later; C10 is booking rollup |

### I. KPI / reporting

| Category | Structure that could feed a count **if data existed** | Gap |
| --- | --- | --- |
| RFP volume | C3 count | Live empty; baseline is Owner estimate |
| Qualified RFP volume | Needs BR-001 | Definition missing |
| Source/market/buyer | C3 source; C1 market/org type | Not used as SA/digital attribution |
| Conversion | C2 won/lost; C9 bookings | Mix of stages; 12% is **not** from EOS |
| Response / turnaround | Incomplete stamps | See §5.C |
| Follow-up | C1 tasks | Not RFP-bound |
| Loss analysis | No taxonomy | Owner list |
| Pipeline value | C2 `estimatedValue` | EX-13 unknown; demo values |
| Revenue/profit | C8/C6/C9 amounts | Not live; accounting deferred |
| Repeat | C1 history | Unmeasured |
| SA/EU/US/corporate/PCO | C1 market + org type | No `pco` seed key; unused live |

**Do not create numerical targets.**

---

## 6. Digital programmes (briefs only)

C1–C10 do **not** contain LinkedIn, SEO/website, Google Ads, or Instagram objects, spend, or automation.

| Programme | Relevant C* dependency | Attribution/reporting | Gap | Unknown |
| --- | --- | --- | --- | --- |
| LinkedIn | C3 `source` / C1 `source` **if** values include LinkedIn (not in documented enum of email/portal/advisor/other) | **NO REUSE EVIDENCE** for LinkedIn-specific reporting | Channel not in C3 source catalogue as specified | Whether process will stamp source |
| SEO/website | Same generic `source` | **NO REUSE EVIDENCE** for SEO/site conversion path | Website not an EOS module | Enquiry→RFP path |
| Google Ads | Same | **NO REUSE EVIDENCE** for Ads economics | Spend/campaigns excluded | Qualified-lead mapping after BR-001 |
| Instagram | Same | **NO REUSE EVIDENCE** | B2B role undefined | Measurable outcome |

**Not authorized:** campaigns, website changes, ad accounts, spend, automation.

---

## 7. South African incentive agencies

| Dimension | Structure | Gap |
| --- | --- | --- |
| Market | C1 `market` free text | No controlled “South Africa” value; unused live |
| Buyer type | Org type `incentive_house` | Incentive **agencies** vs houses: labels configurable; not validated |
| Account / RFP / opportunity | C1+C2+C3 links | No SA filter/programme object |
| Conversion / revenue / repeat | Counts possible **if** `market` populated | Not populated operationally; **no SA targets invented** |

**Not authorized:** outreach lists, campaigns, outreach.

---

## 8. C1–C10 reuse decision (summary)

| Capability | Reuse class | Why |
| --- | --- | --- |
| C1 | **PARTIAL REUSE** + live **UNKNOWN** | Account/org/task/market fields exist; PCO key, RFP-bound follow-up, digital source, Owner classification rules missing |
| C2 | **PARTIAL REUSE** + live **UNKNOWN** | Funnel/value/owner/lost exist; qualification definition, loss catalogue, opportunity next-action missing |
| C3 | **PARTIAL REUSE** + live **UNKNOWN** | Capture/versions/SLA/receivedAt/source exist; clarification stamps and qualification on RFP missing |
| C4 | **REUSE — WITH VALIDATION** | Rate/season/supplier structure matches CR-S01–S03 substantially; verification/ad-hoc flag and live data unknown |
| C5 | **REUSE — WITH VALIDATION** | Itinerary builder exists in Dev/Test; unused live; not a rebuild cue |
| C6 | **REUSE — WITH VALIDATION** | Cost/sell/margin/versions exist; mapping to Owner financial-proposal rules unknown |
| C7 | **REUSE — WITH VALIDATION** | Approval exists; may not match current manual send process |
| C8 | **PARTIAL REUSE** + live **UNKNOWN** | Proposal lifecycle/`sentAt`/totals exist; recipient type and loss reasons missing |
| C9 | **REUSE — WITH VALIDATION** | Booking from accepted proposal exists; Owner confirm path unused |
| C10 | **PARTIAL REUSE** | Rollup only; not KPI pack |

**No row is REUSE — DEMONSTRATED for live operations.** Dev/Test structure ≠ operational satisfaction.

**Do not convert Partial / Unknown into development authorization.**

---

## 9. Live validation register

Proposed method is **read-only process walkthrough** (staff + current Excel/mail). **Not** UAT, **not** Production, **not** application-state change.

| ID | Validation question | Capability | Requirement | Evidence now | Missing | Method | Role | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LV-01 | Can staff complete Owner workflow **in EOS** without new code? | C1–C10 | AC-001, BR-008 | EX-08 unused; product spine exists | Live trial evidence | Process workshop mapping Excel→screens | Commercial Director / Sales & BD | **LIVE VALIDATION REQUIRED** |
| LV-02 | Are C3 stages usable for clarification? | C3 | PR-002, BR-003 | No clarification stage in `rfp.ts` | Process workaround or not | Workshop | Same | **LIVE VALIDATION REQUIRED** |
| LV-03 | Are C1 tasks used as RFP follow-up? | C1 | PR-005, AC-004 | Task type exists; no RFP FK | Practice | Observe current follow-up | Same | **LIVE VALIDATION REQUIRED** |
| LV-04 | Does C8 replace Office proposals? | C8 | CR-013–CR-019 | C8 Dev/Test; live = Office | Equivalence | Side-by-side one sample **without** UAT programme | Same | **LIVE VALIDATION REQUIRED** |
| LV-05 | Do C4 rates match seasonal/item practice? | C4 | CR-S01–S04 | Rate fields exist | Live rate cards | Sample mapping | Same | **LIVE VALIDATION REQUIRED** |
| LV-06 | Is C7 approval wanted before send? | C7 | CR-017, CR-025 | C7 exists | Owner send rule | Decision in 1A/1C | Owner | **LIVE VALIDATION REQUIRED** |
| LV-07 | Can `market`+`incentive_house` represent SA incentive agencies? | C1 | MR-005, KR-M01 | Fields exist | Populated data; naming | Data design in 1A **without** schema change | Owner | **LIVE VALIDATION REQUIRED** |
| LV-08 | Any live EOS records to count RFPs/bookings? | C3, C9 | DR-B01, DR-B03 | Owner estimates only | EOS counts | Confirm empty vs unused | Same | **LIVE VALIDATION REQUIRED** |

If live evidence cannot be obtained without changing application state or creating UAT: remain **UNKNOWN**.

---

## 10. Owner-dependent items (unresolved)

| Owner/1A input | Do not invent | C1–C10 / requirements that **depend** on it |
| --- | --- | --- |
| **1. Qualification definition text** | No substitute | BR-001, BR-002, PR-009, DR-002, DR-B02, KR-D02, KR-S03, KR-S05, AC-002, C2 `new_qualified` meaning, C3 lack of qualified flag |
| **2. Loss-reason list** | No substitute | BR-006, PR-006, DR-005, DR-B12, KR-S05 (loss analysis), AC-007, C2 `lost` notes, C8 `rejected` |
| **3. Account classification rules** | No substitute | BR-005, DR-008, PR-010, KR-D03, KR-C04, AC-010, C1 `strategicClassification`/`priority` |
| **4. Numerical targets** | `OWNER TARGET NOT YET DEFINED` | BR-009, all KR-* targets, AC-009 (categories only) |

---

## 11. GPTA-H-17 requirements validation (traceability)

| Requirement ID | Classification | C* | Evidence | Gap / validation |
| --- | --- | --- | --- | --- |
| BR-001 | **REQUIRES OWNER INPUT** | C2/C3 | Stage name only | Definition text |
| BR-002 | **PARTIALLY VALIDATED** | C2, C8, C9 | Stages/status exist | Qualification + loss list + live data |
| BR-003 | **PARTIALLY VALIDATED** | C3, C8, C1 | `receivedAt`, `sentAt`, tasks | Clarification/start stamps |
| BR-004 | **PARTIALLY VALIDATED** | C2, C1 | Board, owner, value, account nextAction | Opportunity nextAction; live |
| BR-005 | **REQUIRES OWNER INPUT** | C1 | Classification fields exist | Rules |
| BR-006 | **REQUIRES OWNER INPUT** | C2, C8 | lost/rejected | Catalogue |
| BR-007 | **PARTIALLY VALIDATED** | C1, C3 | `market`, org type, `source` | SA convention; live |
| BR-008 | **VALIDATED AGAINST EXISTING EVIDENCE** | — | GPTA-H-16/H-17 | Process-first gate; this analysis is 1B inventory not live 1B complete |
| BR-009 | **VALIDATED AGAINST EXISTING EVIDENCE** | — | No targets set | Keep empty |
| PR-001 | **PARTIALLY VALIDATED** | C3 | RFP + assignee + receivedAt | Channel mix; live |
| PR-002 | **NO CURRENT CAPABILITY EVIDENCE** (dedicated) | C3 | No clarification stage | Process workaround **UNKNOWN** |
| PR-003 | **PARTIALLY VALIDATED** | C5, C6, C8 | Programme/cost/proposal | Live/Office fit |
| PR-004 | **PARTIALLY VALIDATED** | C8 | `sentAt`, versions | Recipient type |
| PR-005 | **PARTIALLY VALIDATED** | C1 | Tasks | RFP binding; EX-06 role |
| PR-006 | **PARTIALLY VALIDATED** | C2, C8, C9 | Outcome statuses | Loss reasons |
| PR-007 | **PARTIALLY VALIDATED** | C2 | `ownerPrincipalId` | Live assignment |
| PR-008 | **PARTIALLY VALIDATED** | C1 account | `nextAction` | Not on opportunity/RFP |
| PR-009 | **REQUIRES OWNER INPUT** | C2 | — | BR-001 |
| PR-010 | **PARTIALLY VALIDATED** | C1, C9 | Account/booking history | Repeat rules |
| DR-001–DR-008 | **PARTIALLY VALIDATED** / **REQUIRES OWNER INPUT** | C1–C3, C8 | See matrix | DR-002/005/008 Owner |
| DR-B01–B14 | **REQUIRES LIVE VALIDATION** / estimates | — | Owner ~25/~3 | EOS empty vs Excel |
| CR-013–CR-019 | **PARTIALLY VALIDATED** | C5, C7, C8 | Previews | Live/Office; send rules |
| CR-S01–S04 | **PARTIALLY VALIDATED** | C4, C6 | Rates | Verification/ad-hoc; live |
| CR-020–CR-025 | **PARTIALLY VALIDATED** | C6–C8 | Totals/approval | Finance **rules** |
| CR-026 | **VALIDATED AGAINST EXISTING EVIDENCE** | — | Deferred | Out of C1–C10 |
| KR-* | **PARTIALLY VALIDATED** (categories) | mixed | Some counts possible | Targets Owner; stamps/taxonomy; **no C11+** |
| MR-001–MR-004 | **NO CURRENT CAPABILITY EVIDENCE** (channel objects) | C3 source only | Generic source | Programme briefs, not C-spine |
| MR-005 | **PARTIALLY VALIDATED** | C1 | `incentive_house` + `market` | SA programme definition |
| MR-006 | **PARTIALLY VALIDATED** | C1 | Org types except PCO key | Subsequent; no campaigns |
| CR-001 / BR-008 gate | **PARTIALLY VALIDATED** | all | This document | Live LV-* still open |

---

## 12. Acceptance-criteria validation

| AC | Objectively testable as written? | Owner input? | Live validation? | Capability not evidenced? | Fit for a **future** implementation phase? |
| --- | --- | --- | --- | --- | --- |
| AC-001 | **Yes** (lifecycle trail) | No | **Yes** | Clarification stamps **weak** | **Yes**, after 1A field mapping |
| AC-002 | **No** until definition exists | **Yes** | After definition | Qualification flag incomplete | **Not yet** |
| AC-003 | **Yes** | No | **Yes** | C2 owner exists | **Yes** |
| AC-004 | **Yes** | No | **Yes** | RFP-bound next action **weak** | **Partial** |
| AC-005 | **Yes** (method) | Qualification | **Yes** | Live data | **Yes** as method; 12% stays estimate |
| AC-006 | **Partial** (depends on stamps) | No | **Yes** | Clarification/start | **After** stamp mapping |
| AC-007 | **No** until list exists | **Yes** | After list | No catalogue | **Not yet** |
| AC-008 | **Yes** if market/type filled | SA convention | **Yes** | PCO key | **Partial** |
| AC-009 | **Partial** (categories, no targets) | Targets | **Yes** | C10 ≠ full pack | **Process/report**, not C11+ |
| AC-010 | **No** until rules | **Yes** | After rules | Field exists, rules don’t | **Not yet** |
| AC-010S | **Yes** (controlled vs ad hoc) | Rate policy | **Yes** | Ad-hoc flag | **Partial** |
| AC-011 | **Partial** | Finance rules | **Yes** | Office vs C8 | **After** 1C/1E rules |
| AC-012 | **Yes** (governance gate) | No | This analysis incomplete for live 1B | — | **Yes** — still no implementation |

Ambiguities **identified, not rewritten:** AC-002/007/010 blocked on Owner text; AC-006/001 vs missing clarification stage; AC-009 vs domain J; C7 vs current send process.

---

## 13. IMPLEMENTATION BOUNDARY

This analysis **does not** authorize coding.

Capability gaps **do not** authorize development.

C1–C10 **must not** be rebuilt or extended **solely** because a gap is identified.

**No C11+** is authorized.

Future development requires a **separate** governance decision **after** Owner inputs and live validation.

**UAT is not authorized. Production is not authorized. Procurement/spend is not authorized.**

Application `NEXT_INCREMENT=NONE_AUTHORIZED`. E1-D **PARKED**. E1-C **PAUSE**. Path B **HOLD**.

---

## 14. OUT-OF-SCOPE / FUTURE CONSIDERATION

Not added to GPTA-H-17:

* Probability/weighting models  
* Dedicated `pco` / `event_agency` seed keys (configuration **could** be later; **not** a requirement change here)  
* I8 invoice/accounting integration as Stage 1 C-spine  
* Domain J / C11+ analytics module  
* Digital-channel objects inside EOS  
* Website, Ads, LinkedIn, Instagram execution  

---

## 15. Final status

Analysis is complete as a **repository + requirements** validation. Remaining items are labelled Owner input or live validation — they do **not** block recording this analysis.

```text
GPTA-H-18 STATUS = C1–C10 CAPABILITY-GAP ANALYSIS AND REQUIREMENTS VALIDATION COMPLETE

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
C1–C10 DEVELOPMENT = NOT AUTHORIZED
C11+ = NOT AUTHORIZED

NEXT ACTION = RESOLVE IDENTIFIED OWNER INPUTS AND VALIDATE OPEN C1–C10 REQUIREMENT GAPS
```
