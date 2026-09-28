# GPTA-H-19 — Owner Business Rules Resolution & C1–C10 Process Walkthrough Validation

> **`GOVERNANCE-ONLY`** · **GPTA-H-20 overlay: OWNER DECISION CAPTURE**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION STATE CHANGE`**  
> **`NO C1–C10 MODIFY`** · **`NO C11+`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. **Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Authoritative freeze/requirements/gap records are **not** rewritten: GPTA-H-16, H-17, H-18. This file remains the **single** Owner business-rules form. GPTA-H-19 Part B walkthrough below is **historical and intact**.

---

## GPTA-H-20 change control (2026-09-17T23:48:00+03:00)

| Item | Record |
| --- | --- |
| Previous status (GPTA-H-19) | `OWNER BUSINESS RULES PARTIALLY RESOLVED — FURTHER OWNER INPUT REQUIRED` |
| GPTA-H-19 auditable timestamp (preserved) | 2026-09-17T23:43:00+03:00 |
| GPTA-H-20 date | 2026-09-17 |
| GPTA-H-20 auditable timestamp | 2026-09-17T23:48:00+03:00 |
| Already resolved | **OR-04** = `NO NUMERICAL TARGET AUTHORIZED` (**not reopened**) |
| Newly answered in this instruction | **None** — Owner did not supply OR-01, OR-02, OR-03, PCO, market/buyer, follow-up role, send role, channel mix, or rate practice |
| Still outstanding | OR-01, OR-02, OR-03, OR-03-PCO, market vs buyer, follow-up ownership, proposal-send role, channel mix, supplier-rate practice |
| Intentionally deferred | Numerical targets (OR-04) |
| Historical Part B | Unchanged |

**Decision status values (exactly one per question):** `OWNER APPROVED` · `OWNER DEFERRED` · `OWNER INTENTIONALLY LEFT OPEN` · `OWNER DECISION REQUIRED` · `NOT APPLICABLE`

> Completion of these business rules does **not** authorize development.  
> The decisions establish **business requirements only**. Mapping to C1–C10, modification, extension, new capability, migration, UAT, deployment, or Production requires a **separate** governance decision.

---

## 1. Method (historical GPTA-H-19)

**Part A:** Owner completion fields. GPTA-H-20 makes them unambiguous. **Do not invent answers.**

**Part B:** walkthrough of the Owner-stated current process (GPTA-H-11 / H-14). Unchanged below. Source-code existence is **not** operational use.

**Live EOS (GPTA-H-19, preserved):** no authenticated census (would create session state). Dev/Test demo seed is **not** live operational evidence. Owner EX-08: EOS **not currently used operationally**.

```text
NO LIVE OPERATIONAL EVIDENCE AVAILABLE
```

---

# PART A — Owner / 1A business rules

Fill this page. Completing it does **not** authorize development, C1–C10 change, seed-data change, or C11+.

**Do not** infer from code, seed data, workflow, CRM practice, industry standards, or GPTA-H-17 wording.

---

## Decision ledger

| ID | Topic | Class | Status |
| --- | --- | --- | --- |
| OR-04 | Numerical targets | Previously answered | **OWNER APPROVED** as `NO NUMERICAL TARGET AUTHORIZED` |
| OR-01 | Qualification definition | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-02 | Loss-reason catalogue | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-03 | Account/buyer classification | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-03-PCO | PCO as explicit class | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-03-M | Market vs buyer as separate dimensions | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-FU | Follow-up ownership | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-PS | Proposal-send responsibility | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-CH | RFP/opportunity source classification | Still outstanding | **OWNER DECISION REQUIRED** |
| OR-SR | Supplier-rate practice | Still outstanding | **OWNER DECISION REQUIRED** |

---

## OR-01 — Qualification definition

**Question:** What does SEDMC mean by a **Qualified RFP**? Plain business language. Do **not** treat C2 `new_qualified` as the definition.

**`OWNER INPUT REQUIRED — QUALIFICATION DEFINITION NOT YET APPROVED`**

### OR-01-A — Definition

Owner's exact definition:

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-01-B — Minimum conditions

What **must** be known or true before an RFP is considered qualified? Write the actual conditions. The following are **prompts only, not assumptions:** identifiable buyer/account; travel/event requirement; destination; approximate group size; dates; budget; decision timeline; genuine commercial opportunity.

Mandatory conditions: ________________

Optional conditions (if any): ________________

**Status:** `OWNER DECISION REQUIRED`

### OR-01-C — Qualification authority

Who decides that an RFP is qualified? (**Role**, not an invented name.)

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-01-D — Qualification timing

When is qualification determined?

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-01-E — Qualification evidence

What evidence must exist to support the qualification decision?

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-01-F — Qualification changes

Can a qualified RFP later become unqualified?

- [ ] YES  
- [ ] NO  
- [ ] OWNER TO DEFINE  

If YES: who may change it? ________________  
Under what circumstances? ________________  
Must a reason be recorded? Yes / No / ________________  

No technical statuses or database fields are created here.

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02 — Loss-reason catalogue

**Question:** When an RFP does not become a booking, how should SEDMC classify the reason it was lost?

**`OWNER INPUT REQUIRED — LOSS-REASON CATALOGUE NOT YET APPROVED`**

Do **not** pre-populate approved reasons. Add or delete rows as needed. Leave unused rows blank.

| Code | Loss reason | Definition | Mandatory? | Owner approved? |
| --- | --- | --- | --- | --- |
| LR-01 | | | | |
| LR-02 | | | | |
| LR-03 | | | | |
| LR-04 | | | | |
| LR-05 | | | | |
| LR-06 | | | | |
| LR-07 | | | | |
| LR-08 | | | | |
| LR-09 | | | | |
| LR-10 | | | | |
| LR-__ | | | | |

1. Can an opportunity have more than one loss reason? ________________  
2. Is **Other** permitted? ________________  
3. If Other is used, is explanation mandatory? ________________  
4. Who records the loss reason (role)? ________________  
5. When is it finalized? ________________  
6. Can it subsequently be changed? ________________  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-03 — Account / buyer classification

**Question:** How should SEDMC classify the organisations and buyers it sells to?

This is a **business taxonomy**, not a seed-data or schema decision.

**`OWNER INPUT REQUIRED — ACCOUNT CLASSIFICATION RULES NOT YET APPROVED`**

Fill the approved list. Rows below are **blank**. Discussion **prompts only** (not approved): Incentive Agency; MICE Agency; Event Agency; PCO; Travel Agency; Corporate Travel Company; Corporate; Destination/Event Specialist; Other.

| Classification | Business definition | Primary / secondary | Owner approved? |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

Multiple classifications allowed? ________________  
Who assigns classification (role)? ________________  
May classification change? ________________  

**Status:** `OWNER DECISION REQUIRED`

### OR-03-PCO — Explicit PCO classification

**Does SEDMC want PCO to be an explicit account/buyer classification?**

- [ ] `YES` — Owner definition of PCO: ________________  
- [ ] `NO`  
- [ ] `DEFER`  

**Do not** add a `pco` seed key, modify organisation types, modify database records, or modify application logic.

**Status:** `OWNER DECISION REQUIRED`

### OR-03-M — Market vs buyer type

**Market** (prompts only, not approved): South Africa; Europe; USA; Canada; Middle East; Latin America; Other.

**Buyer/account classification:** the Owner-approved taxonomy in OR-03.

Market and buyer type are **not** assumed to be interchangeable.

**Should market and account/buyer classification be maintained as separate commercial dimensions?**

- [ ] `YES`  
- [ ] `NO`  
- [ ] `DEFER`  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-04 — Numerical targets (previously answered — not reopened)

**Class:** previously answered. **Not reopened** unless the Owner voluntarily changes it.

```text
NO NUMERICAL TARGET AUTHORIZED
```

**Status:** `OWNER APPROVED` (as no targets)

### Future target decision (optional; default unchanged)

If the Owner **later** wishes to set targets, mark each: `TARGET NOW` / `BASELINE FIRST` / `DEFER` / `NOT APPLICABLE`. Until then the default remains **`NO NUMERICAL TARGET AUTHORIZED`**.

| Category | Future mark (optional) |
| --- | --- |
| RFP volume | |
| Qualified RFP volume | |
| Conversion | |
| Response time | |
| Proposal turnaround | |
| Pipeline value | |
| Revenue | |
| Repeat business | |
| Profit / margin | |

---

## Other Owner-dependent items (unresolved unless explicitly decided)

### OR-FU — Follow-up ownership

Current evidence: follow-up owner role = **UNNAMED**.

**Which role owns follow-up after a proposal has been sent?**

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-PS — Proposal-send responsibility

Current evidence: proposals are sent through the Office/email workflow. C7 is **not** assumed to be today’s process.

**Which role has responsibility for sending the final commercial proposal to the client?**

```text
[OWNER TO COMPLETE]
```

**Status:** `OWNER DECISION REQUIRED`

### OR-CH — Channel / source mix

**How should SEDMC classify the source of an RFP/opportunity?**

Write the approved list. **Prompts only, not approved:** referral; existing account; trade show; LinkedIn; website/SEO; Google Ads; Instagram; direct corporate enquiry; partner/travel agency; other.

Approved source classes: ________________

**Status:** `OWNER DECISION REQUIRED`

### OR-SR — Supplier-rate practice

**How does SEDMC currently determine supplier rates for commercial proposals?** Record **actual practice**, not a designed system.

| Topic | Owner response |
| --- | --- |
| Source of rate | |
| Season | |
| Validity | |
| Currency | |
| Verification | |
| Who verifies (role) | |
| How often rates are refreshed | |
| Negotiated vs public rates distinguished? | |

**Status:** `OWNER DECISION REQUIRED`

---

# PART B — Read-only process walkthrough

Authoritative current process (Owner):

`RFP received` → `clarifying questions` → `programme/itinerary` → `financial proposal` → `proposal sent` → `manual follow-up` → `confirm/reject`

Tools in practice (EX-07): Microsoft Office, Excel, Outlook/Gmail, WhatsApp, telephone. EOS: **`NOT CURRENTLY USED OPERATIONALLY`** (EX-08). Current follow-up owner **role unnamed** (EX-06). Programme BUSINESS OWNER role (EX-30) is **not** automatically today’s first-touch owner.

---

## PW-01 — RFP receipt

| # | Answer |
| --- | --- |
| 1. Today | Process **starts** at RFP received. Channel mix **not censused**. |
| 2. Role | **UNKNOWN** (EX-06). |
| 3. Tool | Outlook/Gmail, WhatsApp, telephone, Office/Excel (EX-07). |
| 4. EOS used? | **No.** |
| 5. Stored where | Those tools; named mailbox/workbook **UNKNOWN**. |
| 6. C1–C10 | C3 capture; C1 org/account; C3 `receivedAt`, `source`; C1 `market`, org type. |
| 7. Used? | **Structurally present, not used.** |
| 8. Evidence | GPTA-H-11 EX-04–EX-08. |
| 9. Requirements | PR-001, BR-007, DR-006, KR-M01, MR-005. |
| 10. Gap | No operational census of source/market/buyer/owner/deadline. |

**South Africa / incentive agency:** frozen first market/buyer is **South African incentive agencies**. Current recording method does **not** evidence a controlled pair `market = South Africa` + buyer type = incentive agency. C1 *can* store `market` and `incentive_house` **if used** — **not used live**. Seed data **not** changed.

---

## PW-02 — Qualification

| # | Answer |
| --- | --- |
| 1. Today | **UNKNOWN** — Owner named “not enough qualified RFPs” but did not describe when/how staff qualify. |
| 2. Role | **UNKNOWN.** |
| 3. Tool | **UNKNOWN** (not EOS). |
| 4. EOS used? | **No.** |
| 5. Stored where | **UNKNOWN.** |
| 6. C2 | Stage `new_qualified` exists. |
| 7. Used? | **Not used.** Correspondence to business qualification: **unknown until OR-01.** |
| 8. Evidence | GPTA-H-16 problem; H-18; OR-01 blank. |
| 9. Requirements | BR-001, PR-009, DR-002, AC-002. |
| 10. Gap | No approved definition; `new_qualified` **not assumed** to be that definition. |

---

## PW-03 — Clarification

| # | Answer |
| --- | --- |
| 1. Today | SEDMC **does** send clarifying questions (Owner workflow step 2). |
| 2. Role | **UNKNOWN.** |
| 3. Tool | Email (implied by Outlook/Gmail); WhatsApp/phone possible, **not split**. |
| 4. EOS used? | **No.** |
| 5. Stored where | Mail/chat; **no** retained timestamp set evidenced. |
| 6. C3 | **No clarification stage**; no BR-003 clarification stamps. |
| 7. Used? | C3 unused. |
| 8. Evidence | GPTA-H-14 workflow; `packages/kernel/src/rfp.ts` stages. |
| 9. Requirements | PR-002, BR-003, AC-006. |
| 10. Gap | See § Special items — C3. |

---

## PW-04 — Programme / itinerary

| # | Answer |
| --- | --- |
| 1. Today | SEDMC builds itinerary/programme as part of the proposal. |
| 2. Role | **UNKNOWN.** |
| 3. Tool | Microsoft Office (Word/Excel implied, **not** named files). |
| 4. EOS / C5 used? | **No.** |
| 5. Stored where | Office documents. |
| 6. C5 | Day/item programme exists in Dev/Test. |
| 7. Used? | **Available, not used.** |
| 8. Evidence | EX-07; H-14; C5 preview. |
| 9. Requirements | CR-013, PR-003, AC-001. |
| 10. Gap | Office vs C5 uncompared on a live file; versioning in Office **UNKNOWN**. |

C5 **not** altered.

---

## PW-05 — Supplier rates / costing

| # | Answer |
| --- | --- |
| 1. Today | Financial proposal is included in the programme/proposal. How rates are obtained/verified/seasonalised: **UNKNOWN**. |
| 2. Role | **UNKNOWN.** |
| 3. Tool | Excel/Office. |
| 4. C4/C6 used? | **No.** |
| 5. Stored where | Excel/Office; named rate files **UNKNOWN**. |
| 6. C4/C6 | Rate cards, seasons, cost sheets exist in Dev/Test. |
| 7. Used? | **Available, not used.** |
| 8. Evidence | EX-07; H-14; H-18. |
| 9. Requirements | CR-S01–S04, CR-020, AC-010S. |
| 10. Gap | Live rate practice vs C4 **not evidenced.** |

No rates or costing data modified.

---

## PW-06 — Financial proposal

| # | Answer |
| --- | --- |
| 1. Today | Financial proposal is **included in** the programme/proposal sent to agent/client. |
| 2. Role | **UNKNOWN.** |
| 3. Tool | **Office workflow** (Excel and/or Word). Exact split **UNKNOWN**. |
| 4. C8 used? | **No.** |
| 5. Stored where | Office; version identity **UNKNOWN**. |
| 6. C8 | Proposal engine exists (totals, `sentAt`, versions). |
| 7. Used? | **Available, not used.** |
| 8. Evidence | H-14 steps 3–5; EX-07–EX-08. |
| 9. Requirements | CR-014, CR-020, AC-011. |
| 10. Gap | C8 is **not** the current send vehicle. Relationship = **unused product vs Office original**. |

Finance workflow **not** redesigned.

---

## PW-07 — Approval

| # | Answer |
| --- | --- |
| 1. Today | **No** EOS C7 step in the Owner workflow. Non-EOS approval (manager sign-off, informal): **UNKNOWN**. |
| 2. Role | **UNKNOWN.** |
| 3. Tool | Not C7. |
| 4. C7 used? | **No.** |
| 5. Evidence | Owner 7-step process omits approval; H-18 C7 unused live. |
| 6. Requirements | CR-017, CR-025. |
| 7. Gap | **C7 does not correspond to the documented current process.** Do not force-fit. |

---

## PW-08 — Proposal send

| # | Answer |
| --- | --- |
| 1. Today | Proposal sent to agent/client for review. |
| 2. Who | **UNKNOWN** (role). |
| 3. Tool | Email (Outlook/Gmail). |
| 4. EOS | **No.** |
| 5. Sent timestamp | **Not evidenced** as a controlled field (mail timestamps may exist; not a commercial register). |
| 6. Final version | **UNKNOWN** (file naming). |
| 7. C8 | `sentAt` / versions exist, unused. |
| 8. Requirements | PR-004, CR-018, DR-B14. |
| 9. Gap | Send path is mail, not C8. |

Sending workflow **not** changed.

---

## PW-09 — Follow-up

| # | Answer |
| --- | --- |
| 1. Today | Manual email follow-up **after some time**. |
| 2. Who | **UNKNOWN** (EX-06). |
| 3. Tool | Email. |
| 4. EOS | **No.** |
| 5. Bound to RFP? | **In practice:** likely the email thread — **not evidenced** as a register. **In EOS:** H-18 confirmed tasks are **not** first-class bound to RFP IDs. |
| 6. Next action / overdue | **Not evidenced** as a controlled field. Cadence unspecified. |
| 7. Requirements | PR-005, PR-008, AC-004. |
| 8. Gap | Follow-up **not** bound to RFP in EOS; operational binding **UNKNOWN** beyond “email later”. |

No follow-up automation created.

---

## PW-10 — Confirm / reject

| # | Answer |
| --- | --- |
| 1. Today | Client confirms or rejects proposal/destination. |
| 2. Recording | **UNKNOWN** beyond that outcome occurring. |
| 3. Loss reason | **Not captured** as an approved catalogue (OR-02 blank). |
| 4. Booking linked to RFP | **UNKNOWN** in current files; C9 can link **if** used. |
| 5. Repeat business | **UNKNOWN** (DR-B10). |
| 6. EOS / C2–C9 | Unused. |
| 7. Requirements | PR-006, BR-006, AC-005, AC-007, PR-010. |
| 8. Gap | Outcome exists as a **business event**; not a governed register. |

Loss catalogue **not** created.

---

## Validation matrix

| Process step | Current real-world method | EOS/C1–C10 | Actually used? | Evidence | Requirement IDs | Gap | Owner input | Further validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PW-01 Receipt | Mail/WhatsApp/phone; start = RFP received | C3 + C1 | **No** | EX-04–08 | PR-001, BR-007 | Channel/market/owner/deadline not in a register; SA+incentive pair not evidenced | OR-03 (buyer types) | Named inbox/workbook |
| PW-02 Qualification | **UNKNOWN** | C2 `new_qualified` | **No** | H-16; OR-01 blank | BR-001, PR-009, AC-002 | Definition missing; stage ≠ approved rule | **OR-01** | After OR-01, staff method |
| PW-03 Clarification | Questions sent; tool ≈ email | C3 **no** clarification stage | **No** | H-14; `rfp.ts` | PR-002, BR-003, AC-006 | No stamps; no C3 stage | — | Whether mail is the audit trail |
| PW-04 Programme | Office itinerary | C5 | **No** | EX-07 | CR-013, PR-003 | Office original vs unused C5 | — | Sample file vs C5 (read-only later) |
| PW-05 Rates/costing | Excel/Office; method **UNKNOWN** | C4, C6 | **No** | EX-07; H-18 | CR-S01–S04 | C4/C6 unused; verification/season **UNKNOWN** | — | How rates are actually sourced |
| PW-06 Financial proposal | Included in Office proposal | C8 | **No** | H-14 | CR-014, CR-020, AC-011 | C8 unused | Finance **rules** | Excel vs Word split |
| PW-07 Approval | Not in Owner 7 steps; other approval **UNKNOWN** | C7 | **No** | H-14 vs C7 | CR-017, CR-025 | C7 ≠ current process | Who may send | Informal approval? |
| PW-08 Send | Email to agent/client | C8 `sentAt` | **No** | EX-07 | PR-004 | Timestamp/version not governed | — | Mail vs file version |
| PW-09 Follow-up | Manual email after some time | C1 tasks (not RFP-bound) | **No** | EX-06 | PR-005, PR-008, AC-004 | Unbound in EOS; cadence unknown | Follow-up **role** | Thread vs register |
| PW-10 Confirm/reject | Client confirm or reject | C2/C8/C9 | **No** | H-14 | PR-006, BR-006 | No loss catalogue; booking link unknown | **OR-02** | How bookings are filed today |

Where a cell is not known: **`UNKNOWN — NO OPERATIONAL EVIDENCE`**.

---

## Live EOS inspection

| Check | Result |
| --- | --- |
| Authenticated live count of RFPs / qualified RFPs / proposals / follow-ups / bookings / accounts / SA opportunities | **Not performed** (would require login/session; forbidden to insert/update; demo seed ≠ live) |
| Owner operational use | EX-08 **not used operationally** |
| Dev/Test demo seed | Documented mocks only — **not** live evidence |

```text
NO LIVE OPERATIONAL EVIDENCE AVAILABLE
```

---

## Special items (GPTA-H-18)

### C3 — clarification and BR-003 stamps

| Question | Determination |
| --- | --- |
| Missing clarification **stage** | **Capability gap** (no stage in `rfp.ts`) **and** **data/evidence gap** (no commercial timestamp register today). Clarification **does occur** in process (email). |
| Process-only? | Staff **can** clarify by email without EOS — **process exists**. Measuring BR-003 is **not** process-complete. |
| Classification | **Process-only (doing the work) + capability gap (C3 model) + evidence gap (stamps).** |
| C3 modified? | **No.** Gap ≠ rebuild authorization. |

### C2 — `new_qualified`

Until OR-01: **`new_qualified` is a pipeline stage in Dev/Test, not an approved business qualification state.** Operational correspondence: **unknown** (EOS unused). Controlling rule = Owner definition **once approved**. **Do not assume they match.**

### Follow-up bound to RFP

**EOS:** **confirmed not** first-class bound (H-18; C1 task FKs). **Current process:** follow-up is email “after some time”; systematic RFP binding **`UNKNOWN — NO OPERATIONAL EVIDENCE`**. No binding functionality built.

### C4 / C5 / C6 / C8

**Available in Dev/Test. Not used operationally.** Office/Excel/mail is the real system of work.

### C10

**Confirmed:** booking command-center rollup is **not** the GPTA-H-17 KPI pack (qualified RFPs, SA market, response time, follow-up completion, digital attribution, etc.). **KPI evidence gap:** categories defined; live feeds **absent**; C11+ **not** authorized as the fill.

### Digital channels

C1–C10 contain **no** LinkedIn / SEO-website / Google Ads / Instagram attribution spine. C3 `source` is email/portal/advisor/other. **None created.**

### PCO

**Business-rule question only** (OR-03). **No seed-data modification.** Default C1 keys still omit `pco`.

---

## Requirement status update (affected GPTA-H-17)

| ID | Status |
| --- | --- |
| BR-001, PR-009, DR-002, DR-B02, KR-D02, KR-S03, AC-002 | **OWNER INPUT STILL REQUIRED** (OR-01) |
| BR-006, DR-005, DR-B12, AC-007 | **OWNER INPUT STILL REQUIRED** (OR-02) |
| BR-005, DR-008, AC-010, MR-005 (buyer labels), PCO | **OWNER INPUT STILL REQUIRED** (OR-03) |
| BR-009, all KR targets | **OWNER INPUT STILL REQUIRED** / **`NO NUMERICAL TARGET AUTHORIZED`** |
| BR-002, BR-003, BR-004, BR-007, PR-001, PR-003–PR-008, PR-010, CR-013–CR-019, CR-S01–S04, CR-020–CR-025 | **PARTIALLY VALIDATED** + **GAP CONFIRMED** (unused EOS vs Office process) |
| PR-002 | **GAP CONFIRMED** (clarification: process yes; C3 stage/stamps no) |
| CR-017, CR-025 | **GAP CONFIRMED** (C7 ≠ documented current process) |
| MR-001–MR-004 | **GAP CONFIRMED** (no digital attribution spine) |
| CR-026 | Unchanged **Deferred** |
| BR-008, AC-012 | **VALIDATED** as governance gate — still no implementation |
| Live counts DR-B01, DR-B03, etc. | **LIVE VALIDATION NOT POSSIBLE** as operational EOS evidence → **`NO LIVE OPERATIONAL EVIDENCE AVAILABLE`** |
| AC-001, AC-003–AC-006, AC-008, AC-009, AC-011, AC-010S | **PARTIALLY VALIDATED** / still Owner or live dependent |

**No confirmed gap is an implementation task.**

---

## GAPS ARE FINDINGS — NOT BUILD AUTHORIZATION

* A capability gap does **not** authorize development.  
* An Owner decision (when later recorded) does **not** authorize development.  
* A process mismatch (Office vs C5/C6/C8, no C7 step, unbound follow-up) does **not** authorize rebuilding C1–C10.  
* C1–C10 remain **frozen** pending a **future** governance decision.  
* **No C11+** work is authorized.  
* Implementation requires a **subsequent** governance decision after Owner rules and any further validation the Owner grants.

Unchanged: E1-D **PARKED**; E1-C **PAUSE**; Path B **HOLD**; application `NEXT_INCREMENT=NONE_AUTHORIZED`.

---

## Final status (GPTA-H-19 historical)

Four Owner inputs were **not** supplied in the GPTA-H-19 instruction. Documented process walkthrough **completed** from GPTA-H-11/H-14. Live EOS operational evidence **not available**.

```text
GPTA-H-19 STATUS = OWNER BUSINESS RULES PARTIALLY RESOLVED — FURTHER OWNER INPUT REQUIRED
```

(Walkthrough of the **documented** current process is done. Remaining block is Owner business rules.)

---

## GPTA-H-20 final status

OR-01, OR-02, and OR-03 remain unanswered. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`. No answers were inferred.

```text
GPTA-H-20 STATUS = OWNER BUSINESS RULES PARTIALLY RESOLVED — FURTHER OWNER INPUT REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = COMPLETE OUTSTANDING OWNER BUSINESS RULES
```

---

# GPTA-H-21 — OWNER DECISION SHEET

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T23:55:00+03:00**.  
**Purpose:** Owner-completion fields for outstanding commercial business rules. **No answers invented.** Historical GPTA-H-19 / H-20 records **above are not overwritten**.

> These answers define **business rules only**. They do not authorize software development, C1–C10 modification, C11+ development, database changes, migration, UAT, Production deployment, procurement, vendor engagement, advertising spend, or campaign launch.

> **Owner instruction:** Please provide the actual SEDMC business decision in each field. If you do not want to decide an item yet, write `DEFER`. If the item does not apply, write `NOT APPLICABLE`. Do not use the examples as pre-selected answers.

---

## OR-01 — Qualification definition

> `C2 new_qualified` is an existing technical pipeline stage. It must **not** be treated as the Owner's qualification definition.

### OR-01-A — Definition

**In your own words, what makes an RFP a "Qualified RFP"?**

Owner answer:

```text
[ ]
```

### OR-01-B — Minimum conditions

**What information or conditions must be present before an RFP is considered qualified?**

Owner answer:

```text
[ ]
```

### OR-01-C — Qualification authority

**Who decides whether an RFP is qualified?**

Owner answer:

```text
[ ]
```

### OR-01-D — Qualification timing

**At what point in the RFP process is qualification decided?**

Owner answer:

```text
[ ]
```

### OR-01-E — Qualification evidence

**What evidence should support the qualification decision?**

Owner answer:

```text
[ ]
```

### OR-01-F — Qualification changes

**Can a Qualified RFP later become unqualified?**

Owner decision:

```text
YES / NO / DEFER
```

If YES:

**Who can change it and why?**

```text
[ ]
```

---

## OR-02 — Loss-reason catalogue

### OR-02-A — Approved loss reasons

The Owner may add or remove rows. Do **not** treat empty rows as approved reasons.

| # | Loss reason | Definition / meaning |
| --- | --- | --- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |

### OR-02-B — Multiple reasons

**Can one lost RFP have more than one loss reason?**

```text
YES / NO / DEFER
```

### OR-02-C — Other

**Should "Other" be available as a loss reason?**

```text
YES / NO / DEFER
```

### OR-02-D — Other explanation

**If "Other" is selected, must an explanation be provided?**

```text
YES / NO / DEFER
```

### OR-02-E — Responsibility

**Who records the loss reason?**

```text
[ ]
```

### OR-02-F — Finalization

**At what point is the loss reason finalized?**

```text
[ ]
```

### OR-02-G — Changes

**Can a finalized loss reason subsequently be changed?**

```text
YES / NO / DEFER
```

If YES:

**Who may change it and why?**

```text
[ ]
```

---

## OR-03 — Account classification

**How does SEDMC want to classify the organisations/buyers it sells to?**

Owner-approved taxonomy (blank; not pre-populated):

| Classification | Business definition |
| --- | --- |
| | |
| | |
| | |
| | |
| | |
| | |
| | |
| | |
| | |
| | |

Discussion **prompts only** — **not approved:** Incentive Agency; MICE Agency; Event Agency; PCO; Travel Agency; Corporate Travel Company; Corporate; Destination/Event Specialist; Other.

---

## OR-03-PCO — PCO business decision

**Should PCO be an explicit SEDMC account/buyer classification?**

```text
YES / NO / DEFER
```

If YES:

**What does SEDMC mean by PCO for this classification?**

```text
[ ]
```

> This is a **business taxonomy** decision. It does **not** authorize creation of a `pco` seed key or any technical change.

---

## OR-03-M — Market vs buyer classification

**Should "Market" and "Account/Buyer Classification" be treated as separate commercial dimensions?**

```text
YES / NO / DEFER
```

If YES:

### Market definition

**What markets should SEDMC recognize?**

Owner answer:

```text
[ ]
```

### Buyer/account definition

**What classifications should SEDMC recognize?**

Owner answer:

```text
[ ]
```

South Africa, Europe, USA, and similar names are **not** inferred as the approved taxonomy.

---

## Follow-up ownership

Current evidence: follow-up owner role is **unnamed**.

**Which role is responsible for follow-up after a proposal has been sent?**

Owner answer:

```text
[ ]
```

**Does the same role remain responsible until confirm/reject, or can ownership transfer?**

```text
[ ]
```

If ownership can transfer:

**Who can transfer it?**

```text
[ ]
```

---

## Proposal-send role

**Which role is responsible for sending the final commercial proposal to the client?**

Owner answer:

```text
[ ]
```

**Who approves the proposal before it is sent?**

Owner answer:

```text
[ ]
```

C7 is **not** assumed to be the current approval workflow.

---

## Channel / source mix

**How should SEDMC classify where an RFP/opportunity originated?**

Owner-approved source categories (blank; not pre-approved):

| Source category | Business definition |
| --- | --- |
| | |
| | |
| | |
| | |
| | |
| | |
| | |
| | |

**Examples only — not approved:** referral; existing account; trade show; LinkedIn; website/SEO; Google Ads; Instagram; direct corporate enquiry; partner/travel agency; other.

**Can one RFP have more than one source?**

```text
YES / NO / DEFER
```

If YES:

**Which source is considered primary?**

```text
[ ]
```

---

## Supplier-rate practice

Describe **actual current practice**, not a desired future system.

### Rate source

**Where do supplier rates normally come from?**

```text
[ ]
```

### Season

**How is seasonality determined?**

```text
[ ]
```

### Validity

**How is rate validity determined and recorded?**

```text
[ ]
```

### Currency

**How is currency handled?**

```text
[ ]
```

### Verification

**Who verifies supplier rates?**

```text
[ ]
```

### Verification frequency

**How often are rates checked or refreshed?**

```text
[ ]
```

### Negotiated vs public

**Does SEDMC distinguish negotiated supplier rates from public/published rates?**

```text
YES / NO / DEFER
```

If YES, explain:

```text
[ ]
```

---

## OR-04 — Numerical targets (not reopened)

```text
OR-04 = NO NUMERICAL TARGET AUTHORIZED
```

Optional future note only:

```text
Targets may be considered after a reliable baseline is established.
```

No target values are requested or recorded here.

---

## GPTA-H-21 status

This sheet contains **questions and blank fields only**. Owner answers were **not** supplied in this instruction. Business rules are **not** marked resolved.

```text
GPTA-H-21 STATUS = OWNER DECISION SHEET PREPARED — OWNER INPUT REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = OWNER TO COMPLETE OUTSTANDING BUSINESS RULES
```

---

# GPTA-H-22 — Capture and validate Owner business-rule decisions

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:03:00+03:00**.  
**Mode:** capture and validation only. Historical H-19 / H-20 / H-21 records **above are not overwritten**. GPTA-H-21 blank fields **left blank**.

> Completion of Owner business rules does **not** authorize modifying or rebuilding C1–C10, creating C11+, database changes, migrations, UAT, Production, procurement, vendors, advertising spend, or digital campaigns. A later governance decision is required.

```text
IMPLEMENTATION = NOT AUTHORIZED
```

**Method:** read GPTA-H-21 Owner Decision Sheet. Record only explicit Owner answers. Do **not** treat examples, discussion prompts, blank `[ ]`, unselected `YES / NO / DEFER`, technical terminology, or C1–C10 structures as decisions.

**Finding:** no new Owner answers were present on the H-21 sheet. Unselected `YES / NO / DEFER` is **not** a choice of `DEFER`.

---

## Capture ledger

| Item | Owner answer on H-21 sheet | Status | Clarification required |
| --- | --- | --- | --- |
| OR-01-A Definition | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes — Owner must write the definition |
| OR-01-B Minimum conditions | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-01-C Authority | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-01-D Timing | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-01-E Evidence | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-01-F Changes | unselected `YES / NO / DEFER`; change-who blank | `OWNER DECISION REQUIRED` | Yes — no option selected |
| OR-02-A Catalogue | all 10 rows empty | `OWNER DECISION REQUIRED` | Yes — list incomplete because **empty**, not because rows were omitted from a supplied list |
| OR-02-B Multiple reasons | unselected `YES / NO / DEFER` | `OWNER DECISION REQUIRED` | Yes |
| OR-02-C Other | unselected `YES / NO / DEFER` | `OWNER DECISION REQUIRED` | Yes |
| OR-02-D Other explanation | unselected `YES / NO / DEFER` | `OWNER DECISION REQUIRED` | Yes |
| OR-02-E Responsibility | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-02-F Finalization | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| OR-02-G Changes | unselected `YES / NO / DEFER`; who/why blank | `OWNER DECISION REQUIRED` | Yes |
| OR-03 Taxonomy | all classification rows empty | `OWNER DECISION REQUIRED` | Yes — prompt labels **not** recorded as approved |
| OR-03-PCO | unselected `YES / NO / DEFER`; definition blank | `OWNER DECISION REQUIRED` | Yes — no `pco` technical value created |
| OR-03-M Separate dimensions | unselected `YES / NO / DEFER` | `OWNER DECISION REQUIRED` | Yes |
| OR-03-M Markets | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes — SA/Europe/USA **not** inferred |
| OR-03-M Buyer classes | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Follow-up role | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes — no role inferred |
| Follow-up transfer | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Follow-up who may transfer | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Proposal-send role | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes — C7 **not** assumed |
| Proposal approval role | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Channel / source catalogue | all source rows empty | `OWNER DECISION REQUIRED` | Yes — example channels **not** approved |
| Multiple sources | unselected `YES / NO / DEFER` | `OWNER DECISION REQUIRED` | Yes |
| Primary source | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Rate source | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Season | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Validity | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Currency | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Verification | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Verification frequency | *(blank `[ ]`)* | `OWNER DECISION REQUIRED` | Yes |
| Negotiated vs public | unselected `YES / NO / DEFER`; explain blank | `OWNER DECISION REQUIRED` | Yes — current vs future **not** distinguishable |
| OR-04 Numerical targets | `NO NUMERICAL TARGET AUTHORIZED` | **OWNER APPROVED** (existing; **not reopened**) | No |

`C2 new_qualified` remains an existing technical pipeline stage. It is **not** the Owner qualification definition.

No `CURRENT PRACTICE` vs `DESIRED FUTURE STATE` distinction can be recorded for supplier rates: both fields are unanswered.

---

## Consistency check

No contradiction among captured Owner answers is possible: the only captured rule is OR-04.

**Not treated as a contradiction:** GPTA-H-16 froze first market/buyer as **South African incentive agencies**. That freeze is **not** an OR-03 taxonomy, **not** an OR-03-M market list, and **not** an OR-03-PCO decision. Do **not** copy it into those fields.

**Ambiguity (sheet mechanics, not Owner language):** unselected `YES / NO / DEFER` must not be read as `DEFER`. Blank `[ ]` must not be read as `NOT APPLICABLE`.

No `BUSINESS CLARIFICATION REQUIRED` items arise from conflicting Owner text, because no new Owner text exists.

---

## Traceability (resolved rules only)

| Owner decision | GPTA-H-17 requirement | Affected C1–C10 capability | Existing gap / constraint |
| --- | --- | --- | --- |
| OR-04 = `NO NUMERICAL TARGET AUTHORIZED` | BR-009; KR-* target cells remain unset; AC-009 (categories only, no values) | C10 Command Center / commercial analytics **not** a KPI-target pack | Numerical targets **not authorized**; C10 ≠ approved KPI pack; **no implementation task** |

Outstanding items remain **blocked** on Owner input. Mapping below is **dependency only**, not resolution:

| Outstanding item | GPTA-H-17 (blocked until Owner answers) | Affected capability (constraint only) |
| --- | --- | --- |
| OR-01 | BR-001; PR-009; DR-002; DR-B02; KR-D02; KR-S03; AC-002 | C2 `new_qualified` is a stage, **not** the business rule |
| OR-02 | BR-006; PR-006 (loss reason); DR-005; DR-B12; AC-007 | C2 `lost` has **no** Owner catalogue |
| OR-03 / PCO / market vs buyer | BR-005; DR-008; AC-010; MR-005 (buyer labels) | C1 org types / `market` field **not** the taxonomy |
| Follow-up ownership | PR-005; PR-008; AC-004 | C1 tasks are **not** RFP-bound |
| Proposal-send / approval | CR-017; CR-025 | C7 **not** assumed as today’s send process |
| Channel / source | PR-001; BR-007; DR-006; KR-M01; MR-001–MR-005 (attribution) | C3 `source` enum **not** an Owner-approved mix |
| Supplier-rate practice | CR-013–CR-016 (costing / rates) | C5 rate objects **not** recorded current practice |

**No implementation tasks created.**

---

## GPTA-H-22 status

OR-01, OR-02, and OR-03 remain unanswered on the Owner Decision Sheet. OR-04 remains unchanged.

```text
GPTA-H-22 STATUS = OWNER BUSINESS RULES PARTIALLY RESOLVED — FURTHER OWNER INPUT REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
C1–C10 DEVELOPMENT = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
NEXT ACTION = COMPLETE OUTSTANDING OWNER BUSINESS RULES
```

---

## GPTA-H-23 pointer (additive — does not overwrite H-22)

Companion completion sheet: [`gpta-h-23-owner-business-rules-completion-sheet.md`](gpta-h-23-owner-business-rules-completion-sheet.md). Historical H-19 / H-20 / H-21 / H-22 records **above are not rewritten**. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`.

---

## GPTA-H-24 pointer (additive — does not overwrite H-23)

Decision record: [`gpta-h-24-owner-business-rules-decision-record.md`](gpta-h-24-owner-business-rules-decision-record.md). H-23 fields remain blank. Capture found **no new Owner answers**. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`.

---

## GPTA-H-25 pointer (additive — does not overwrite H-24)

Authorized baseline: [`gpta-h-25-authorized-commercial-business-rules.md`](gpta-h-25-authorized-commercial-business-rules.md). H-19–H-24 history **above is not rewritten**. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-26 pointer (additive — does not overwrite H-25)

Requirements closure: [`gpta-h-26-business-requirements-closure-and-implementation-readiness.md`](gpta-h-26-business-requirements-closure-and-implementation-readiness.md). H-16–H-25 history **above is not rewritten**. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-27 pointer (additive — does not overwrite H-26)

Targeted closure + 1B plan: [`gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md`](gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md). H-16–H-26 history **above is not rewritten**. 1B **not executed**. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-28 pointer (additive — does not overwrite H-27)

1B C1–C10 live validation results: [`gpta-h-28-c1-c10-live-validation-results.md`](gpta-h-28-c1-c10-live-validation-results.md). H-16–H-27 history **above is not rewritten**. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-29 pointer (additive — does not overwrite H-28)

C1–C10 remediation requirements and source-of-truth: [`gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md`](gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md). H-16–H-28 history **above is not rewritten**. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-30 pointer (additive — does not overwrite H-29)

Implementation authorization readiness and Owner decision: [`gpta-h-30-implementation-authorization-readiness-and-owner-decision.md`](gpta-h-30-implementation-authorization-readiness-and-owner-decision.md). H-16–H-29 history **above is not rewritten**. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-31 pointer (additive — does not overwrite H-30)

Owner decision capture: [`gpta-h-31-owner-decision-capture-and-commercial-implementation-governance.md`](gpta-h-31-owner-decision-capture-and-commercial-implementation-governance.md). H-16–H-30 history **above is not rewritten**. Decisions 1–4 **APPROVED**. Decision 5 = **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-32 pointer (additive — does not overwrite H-31)

F0 governance and requirements baseline specification: [`gpta-h-32-f0-governance-and-requirements-baseline-specification.md`](gpta-h-32-f0-governance-and-requirements-baseline-specification.md). H-16–H-31 history **above is not rewritten**. F0 = **SPECIFIED**, not reviewed. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-33 pointer (additive — does not overwrite H-32)

F0 baseline governance review: [`gpta-h-33-f0-baseline-governance-review.md`](gpta-h-33-f0-baseline-governance-review.md). H-16–H-32 history **above is not rewritten**. F0 = **ACCEPTED WITH CONDITIONS**. F1 not started. Implementation remains **NOT AUTHORIZED**.

---

## GPTA-H-34 pointer (additive — does not overwrite H-33)

F1 detailed design specification: [`gpta-h-34-f1-detailed-design-and-implementation-specification.md`](gpta-h-34-f1-detailed-design-and-implementation-specification.md). H-16–H-33 history **above is not rewritten**. F1 = **IN PROGRESS — SPECIFICATION ONLY**. F2 **NOT AUTHORIZED**.

---

## GPTA-H-35 pointer (additive — does not overwrite H-34)

F1 specification review: [`gpta-h-35-f1-specification-review.md`](gpta-h-35-f1-specification-review.md). H-16–H-34 history **above is not rewritten**. F1 = **ACCEPTED WITH CONDITIONS**. F2 **NOT AUTHORIZED**. M0 is **not** an Owner-approved migration decision.

---

## GPTA-H-36 pointer (additive — does not overwrite H-35)

F1 condition closure and F2 blocker register: [`gpta-h-36-f1-condition-closure-and-f2-blocker-register.md`](gpta-h-36-f1-condition-closure-and-f2-blocker-register.md). H-16–H-35 history **above is not rewritten**. F1 = **ACCEPTED WITH CONDITIONS**. F2 **NOT AUTHORIZED**. Closing an F1 condition does **not** authorize F2. M0 is **not** an Owner-approved migration decision. DR-008 remains **DEFERRED**.

---

## GPTA-H-37 pointer (additive — does not overwrite H-36)

Remaining F2 blocker Owner decision pack: [`gpta-h-37-remaining-f2-blocker-owner-decision-pack.md`](gpta-h-37-remaining-f2-blocker-owner-decision-pack.md). H-16–H-36 history **above is not rewritten**. F1 = **ACCEPTED WITH CONDITIONS**. F2 **NOT AUTHORIZED**. Owner Decision fields remain **blank**. Resolving a blocker does **not** authorize F2. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-38 pointer (additive — does not overwrite H-37)

Owner Decision Completion Record: [`gpta-h-38-owner-decision-completion-record.md`](gpta-h-38-owner-decision-completion-record.md). H-16–H-37 history **above is not rewritten**. F1 = **ACCEPTED WITH CONDITIONS**. F2 **NOT AUTHORIZED**. Path B and M0 are **governance direction only**. F1-C-07 and F1-C-06 appointments remain **open**. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-39 pointer (additive — does not overwrite H-38)

Technical Increment Owner appointment decision: [`gpta-h-39-technical-increment-owner-appointment.md`](gpta-h-39-technical-increment-owner-appointment.md). H-16–H-38 history **above is not rewritten**. F1-C-07 remains **OPEN — PERSON NOT YET NAMED**. Role defined; no person invented. F2 **NOT AUTHORIZED**. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-40 pointer (additive — does not overwrite H-39)

Technical Increment Owner and UAT Authority appointment record: [`gpta-h-40-technical-owner-and-uat-authority-appointment-record.md`](gpta-h-40-technical-owner-and-uat-authority-appointment-record.md). H-16–H-39 history **above is not rewritten**. F1-C-07 and F1-C-06 remain **OPEN — PERSON NOT YET NAMED**. Combined-role question remains **open**. F2 **NOT AUTHORIZED**. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-41 pointer (additive — does not overwrite H-40)

Owner appointment recording: [`gpta-h-41-owner-appointment-record.md`](gpta-h-41-owner-appointment-record.md). H-16–H-40 history **above is not rewritten**. F1-C-07 = **APPOINTED — PATRICK MAKUNDI**. F1-C-06 = **APPOINTED — PATRICK MAKUNDI**. Combined role = **YES**. Appointment does **not** authorize F2. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-42 pointer (additive — does not overwrite H-41)

F2 entry readiness review: [`gpta-h-42-f2-entry-readiness-review.md`](gpta-h-42-f2-entry-readiness-review.md). H-16–H-41 history **above is not rewritten**. Assessment: **F2 MAY BE PRESENTED FOR OWNER AUTHORIZATION — NO AUTHORIZATION HAS BEEN GRANTED**. F2 = **NOT AUTHORIZED**. Implementation = **NOT AUTHORIZED**. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-43 pointer (additive — does not overwrite H-42)

F2 implementation authorization decision pack: [`gpta-h-43-f2-implementation-authorization-decision-pack.md`](gpta-h-43-f2-implementation-authorization-decision-pack.md). H-16–H-42 history **above is not rewritten**. Decision pack **prepared**. Owner F2 decision = **PENDING**. F2 = **NOT AUTHORIZED**. Implementation = **NOT AUTHORIZED**. H-31 Decision 5 remains **IMPLEMENTATION NOT AUTHORIZED**.

---

## GPTA-H-44 pointer (additive — does not overwrite H-43)

F2 implementation authorization record: [`gpta-h-44-f2-implementation-authorization-record.md`](gpta-h-44-f2-implementation-authorization-record.md). H-16–H-43 history **above is not rewritten**. F2 = **AUTHORIZED** — C1–C10 Dev/Test only. Implementation = **AUTHORIZED — WITHIN F2 SCOPE ONLY**. Production / procurement / C11+ / ingest / numerical CPR remain **NOT AUTHORIZED**. H-31 Decision 5 = **SUPERSEDED FOR AUTHORIZED F2 SCOPE**. Execution is a **separate subsequent step**.

---

## GPTA-H-45 pointer (additive — does not overwrite H-44)

F2 implementation execution baseline: [`gpta-h-45-f2-implementation-execution-baseline.md`](gpta-h-45-f2-implementation-execution-baseline.md). H-16–H-44 history **above is not rewritten**. Inspection/plan only. F2 = **AUTHORIZED**. Implementation = **AUTHORIZED — C1–C10 DEV/TEST ONLY**. **IMPLEMENTATION CHANGES IN THIS STEP = NONE**. Next increment = **F2-I1 kernel identity / taxonomy / Path B types**. Production / procurement / C11+ / ingest / numerical CPR remain **NOT AUTHORIZED**.

---

## GPTA-H-46 pointer (additive — does not overwrite H-45)

F2-I1 kernel contract implementation: [`gpta-h-46-f2-i1-kernel-contract-implementation.md`](gpta-h-46-f2-i1-kernel-contract-implementation.md). H-16–H-45 history **above is not rewritten**. F2-I1 = **COMPLETED**. Kernel contract **implemented**. Qualification ≠ stage; SOURCE ≠ CHANNEL; PCO represented; LR-01–LR-12 represented; Path B qualitative. **250k / 20% not implemented in the I1 contract** (legacy mixed-caller gate retained). Schema / persistence / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I2 C2/C3 structured facts (in-memory/preview, additive only)**.

---

## GPTA-H-47 pointer (additive — does not overwrite H-46)

F2-I2 C2/C3 commercial facts: [`gpta-h-47-f2-i2-c2-c3-commercial-facts.md`](gpta-h-47-f2-i2-c2-c3-commercial-facts.md). H-16–H-46 history **above is not rewritten**. F2-I2 = **COMPLETED**. Qualification ≠ stage; SOURCE ≠ CHANNEL; LR-01–LR-12; follow-up ownership — on **in-memory/preview sidecar**. Legacy `RfpRecord.source` retained non-authoritative. Legacy 250k/20% gate **retained**. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I3 Path B on in-memory/preview C7 caller**.

---

## GPTA-H-48 pointer (additive — does not overwrite H-47)

F2-I3 Path B preview send: [`gpta-h-48-f2-i3-path-b-c7-preview.md`](gpta-h-48-f2-i3-path-b-c7-preview.md). H-16–H-47 history **above is not rewritten**. F2-I3 = **COMPLETED**. Path B qualitative categories consume at **proposal send**. Legacy 250k/20% gate **retained** (generate still uses mixed `evaluateCommercialApprovalGate`). Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I4 in-memory generate independent of legacy numerical gate when Path B not required / approved**.

---

## GPTA-H-49 pointer (additive — does not overwrite H-48)

F2-I4 in-memory proposal generation Path B: [`gpta-h-49-f2-i4-in-memory-proposal-generation-path-b.md`](gpta-h-49-f2-i4-in-memory-proposal-generation-path-b.md). H-16–H-48 history **above is not rewritten**. F2-I4 = **COMPLETED**. Preview generate proceeds when Path B is `not_required` or Path B-approved; outstanding Path B blocks generate. Mixed 250k/20% request gate **retained**. Durable generate still requires `ComApprovalRequest`. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I5 in-memory C1 OR-03 / OR-03-M (PCO + market)**.

---

## GPTA-H-50 pointer (additive — does not overwrite H-49)

F2-I5 C1 account type and market preview: [`gpta-h-50-f2-i5-c1-account-market-preview.md`](gpta-h-50-f2-i5-c1-account-market-preview.md). H-16–H-49 history **above is not rewritten**. F2-I5 = **COMPLETED**. Preview CRM accounts expose distinct **PCO** and the approved **15-value market** as independent F2 facts. Legacy `CrmAccount.market` / organization-type keys **retained** and non-authoritative for F2. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I6 in-memory C4 / OR-08 supplier-rate identity**.

---

## GPTA-H-51 pointer (additive — does not overwrite H-50)

F2-I6 C4 supplier-rate identity preview: [`gpta-h-51-f2-i6-c4-supplier-rate-identity-preview.md`](gpta-h-51-f2-i6-c4-supplier-rate-identity-preview.md). H-16–H-50 history **above is not rewritten**. F2-I6 = **COMPLETED**. Preview OR-08 identity (source class, rate type, original currency, season/validity, version) is observable on supplier rates and costing `supplierRateId` consumption. Mixed unit `rateType` / `preferredInConflict` **retained** and non-authoritative for F2. FX **not** implemented. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I7 in-memory C10 commercial KPI observation**.

---

## GPTA-H-52 pointer (additive — does not overwrite H-51)

F2-I7 C10 commercial KPI preview: [`gpta-h-52-f2-i7-c10-commercial-kpi-preview.md`](gpta-h-52-f2-i7-c10-commercial-kpi-preview.md). H-16–H-51 history **above is not rewritten**. F2-I7 = **COMPLETED**. Preview KPI observation over existing commercial facts. Revenue / response time / profit **unavailable** where facts are insufficient. No numerical targets. 250k/20% **not** used as a KPI threshold. Mixed J3 analytics **not** rewritten. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I8 in-memory C3 receivedAt / clarification observation**.

---

## GPTA-H-53 pointer (additive — does not overwrite H-52)

F2-I8 C3 RFP timestamp and clarification preview: [`gpta-h-53-f2-i8-c3-rfp-timestamp-clarification-preview.md`](gpta-h-53-f2-i8-c3-rfp-timestamp-clarification-preview.md). H-16–H-52 history **above is not rewritten**. F2-I8 = **COMPLETED**. Explicit sidecar `receivedAt` and clarification event timestamps only. `createdAt` is not receipt. Mixed RFP persist **not** rewritten. Response-time KPI remains **unavailable** without explicit `firstResponseAt`. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I9 remaining C-spine preview residuals (C5 programme / C9 booking)**.

---

## GPTA-H-54 pointer (additive — does not overwrite H-53)

F2-I9 C3 explicit first-response preview: [`gpta-h-54-f2-i9-c3-first-response-preview.md`](gpta-h-54-f2-i9-c3-first-response-preview.md). H-16–H-53 history **above is not rewritten**. H-53 residual numbering of I9 as C5/C9 is **not rewritten**; this record executes I9 as first-response observation. F2-I9 = **COMPLETED**. Explicit sidecar `firstResponseAt` only. KPI `response_time` is **derived** only for a complete explicit preview population. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I10 remaining C-spine preview residuals (C5 programme / C9 booking)**.

---

## GPTA-H-55 pointer (additive — does not overwrite H-54)

F2-I10 C5/C9 residual assessment and narrow C5 programme identity preview: [`gpta-h-55-f2-i10-c5-c9-residual-assessment.md`](gpta-h-55-f2-i10-c5-c9-residual-assessment.md). H-16–H-54 history **above is not rewritten**. F2-I10 = **COMPLETED**. Selected residual = H-29 C5 programme identity/trace observation. Full C5/C9 **not** claimed. C9 booking win dimensions **deferred**. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I11 C9 booking win-dimension observation**.

---

## GPTA-H-56 pointer (additive — does not overwrite H-55)

F2-I11 costing and proposal trace preview: [`gpta-h-56-f2-i11-costing-proposal-trace-preview.md`](gpta-h-56-f2-i11-costing-proposal-trace-preview.md). H-16–H-55 history **above is not rewritten**. H-55 residual numbering of I11 as C9 booking is **not rewritten**; this record executes I11 as costing/proposal trace. F2-I11 = **COMPLETED**. Explicit mixed FK chain only. Partial traces remain partial. Full C5/C6/C7/C8 **not** claimed. Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**. Next increment = **F2-I12 C9 booking win-dimension observation**.

---

## GPTA-H-57 pointer (additive — does not overwrite H-56)

F2 C1–C10 residual readiness assessment: [`gpta-h-57-f2-c1-c10-residual-readiness-assessment.md`](gpta-h-57-f2-c1-c10-residual-readiness-assessment.md). H-16–H-56 history **above is not rewritten**. **Assessment only — no new feature implemented.** F2-I1–I11 remain preview evidence, not operational SoR, not durable F2 facts, not UAT. Full C1–C10 **not** claimed. No scope violation identified. Owner disposition required: controlled pause **or** optional C9 booking win-dimension preview (not selected). Schema / persist / Gate B **not modified**. UAT **not performed**. Commit / push **not performed**.

---

## GPTA-H-58 pointer (additive — does not overwrite H-57)

F2 controlled pause and UAT readiness: [`gpta-h-58-f2-controlled-pause-and-uat-readiness.md`](gpta-h-58-f2-controlled-pause-and-uat-readiness.md). H-16–H-57 history **above is not rewritten**. **Owner decision = OPTION A — CONTROLLED PAUSE.** F2-I12 **not started**. C9 booking win-dimension preview **not implemented**. F2-I1–I11 frozen as preview evidence baseline. Next gate = **UAT planning/readiness**, not another implementation increment. UAT **not performed**. Schema / persist / Gate B **not modified**. Commit / push **not performed**.

---

## GPTA-H-59 pointer (additive — does not overwrite H-58)

C1–C10 UAT planning and scenario pack: [`gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md`](gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md). H-16–H-58 history **above is not rewritten**. **UAT NOT EXECUTED.** **NO F2-I12 IMPLEMENTATION AUTHORIZED.** F2 remains in controlled pause. Scenario pack only; no application change. Next gate = **UAT Authority review of this pack, then Owner authorization of preview-only UAT execution if granted**. Schema / persist / Gate B **not modified**. Commit / push **not performed**.

---

## GPTA-H-60 pointer (additive — does not overwrite H-59)

UAT execution readiness and evidence preparation: [`gpta-h-60-uat-execution-readiness-and-evidence-preparation.md`](gpta-h-60-uat-execution-readiness-and-evidence-preparation.md). H-16–H-59 history **above is not rewritten**. **UAT NOT EXECUTED.** **F2-I12 NOT AUTHORIZED.** No application / schema / migration / production change. 51 H-59 scenarios mapped to frozen F2-I1–I11 surfaces. Next gate = **UAT Authority review of execution readiness, then a separate Owner decision whether preview-only UAT execution may begin** (not granted here). Commit / push **not performed**.

---

## GPTA-H-61 pointer (additive — does not overwrite H-60)

UAT Authority review of execution readiness: [`gpta-h-61-uat-authority-review.md`](gpta-h-61-uat-authority-review.md). H-16–H-60 history **above is not rewritten**. Review outcome = **READY_TO_SEEK_UAT_EXECUTION_AUTHORIZATION**. **UAT EXECUTION NOT AUTHORIZED BY GPTA-H-61.** **F2-I12 IMPLEMENTATION NOT AUTHORIZED.** UAT-C8-03 reclassified **NOT_READY** (no booking-cancel API). H-59 pack **not rewritten**. No application change. Next gate = **separate Owner decision on preview-only UAT execution** (not granted here). Commit / push **not performed**.

---

## GPTA-H-62 pointer (additive — does not overwrite H-61)

Owner authorization for controlled preview-only UAT execution: [`gpta-h-62-owner-authorization-for-controlled-preview-uat.md`](gpta-h-62-owner-authorization-for-controlled-preview-uat.md). H-16–H-61 history **above is not rewritten**. **OWNER DECISION = AUTHORIZE CONTROLLED PREVIEW-ONLY UAT EXECUTION.** **UAT EXECUTION IS NOT UAT APPROVAL.** UAT **not executed** in this record. UAT-C8-03, UAT-C8-04, UAT-C9-04 **excluded**. **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** Next step = **separate controlled UAT execution session**. Commit / push **not performed**.

---

## GPTA-H-63 pointer (additive — does not overwrite H-62)

Controlled preview-only UAT execution: [`gpta-h-63-controlled-preview-uat-execution.md`](gpta-h-63-controlled-preview-uat-execution.md). H-16–H-62 history **above is not rewritten**. **GPTA-H-63 STATUS = CONTROLLED PREVIEW-ONLY UAT EXECUTION COMPLETED.** 48 scenarios executed; 3 excluded. **UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL.** **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-64 pointer (additive — does not overwrite H-63)

Post-UAT findings and disposition review: [`gpta-h-64-post-uat-findings-and-disposition-review.md`](gpta-h-64-post-uat-findings-and-disposition-review.md). H-16–H-63 history **above is not rewritten**. **GPTA-H-64 STATUS = POST-UAT FINDINGS AND DISPOSITION REVIEW COMPLETED.** H-63 not rewritten. **F2-I12 IMPLEMENTATION NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-65 pointer (additive — does not overwrite H-64)

Post-UAT Owner strategic disposition / next-increment decision readiness: [`gpta-h-65-post-uat-owner-strategic-disposition-readiness.md`](gpta-h-65-post-uat-owner-strategic-disposition-readiness.md). H-16–H-64 history **above is not rewritten**. **GPTA-H-65 STATUS = POST-UAT OWNER STRATEGIC DISPOSITION / NEXT-INCREMENT DECISION READINESS COMPLETED.** Options A / B / C presented; **none selected**. **F2-I12 IMPLEMENTATION NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-66 pointer (additive — does not overwrite H-65)

Owner decision — commercial process validation before further software: [`gpta-h-66-owner-decision-commercial-process-validation.md`](gpta-h-66-owner-decision-commercial-process-validation.md). H-16–H-65 history **above is not rewritten**. **OWNER DECISION = OPTION C.** **GPTA-H-66 STATUS = OWNER DECISION RECORDED — COMMERCIAL PROCESS VALIDATION BEFORE FURTHER SOFTWARE.** **NO IMPLEMENTATION IS AUTHORIZED BY H-66.** **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-67 pointer (additive — does not overwrite H-66)

Commercial process validation execution readiness: [`gpta-h-67-commercial-process-validation-execution-readiness.md`](gpta-h-67-commercial-process-validation-execution-readiness.md). H-16–H-66 history **above is not rewritten**. **GPTA-H-67 STATUS = COMMERCIAL PROCESS VALIDATION EXECUTION READINESS COMPLETED.** **VALIDATION EXECUTION = NOT YET EXECUTED.** **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-68 pointer (additive — does not overwrite H-67)

Controlled commercial process validation execution: [`gpta-h-68-controlled-commercial-process-validation-execution.md`](gpta-h-68-controlled-commercial-process-validation-execution.md). H-16–H-67 history **above is not rewritten**. **GPTA-H-68 STATUS = CONTROLLED COMMERCIAL PROCESS VALIDATION EXECUTION BLOCKED — OPERATIONAL EVIDENCE NOT ACCESSIBLE.** **VALIDATION EXECUTION = BLOCKED.** Cases examined = **0**. **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-69 pointer (additive — does not overwrite H-68)

Operational evidence access / validation blocker review: [`gpta-h-69-operational-evidence-access-validation-blocker-review.md`](gpta-h-69-operational-evidence-access-validation-blocker-review.md). H-16–H-68 history **above is not rewritten**. **GPTA-H-69 STATUS = OPERATIONAL EVIDENCE ACCESS / VALIDATION BLOCKER REVIEW COMPLETED.** Validation **not** re-executed. Operational evidence **not** newly accessible. **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-70 pointer (additive — does not overwrite H-69)

Operational evidence access Owner decision pack: [`gpta-h-70-operational-evidence-access-owner-decision.md`](gpta-h-70-operational-evidence-access-owner-decision.md). H-16–H-69 history **above is not rewritten**. **GPTA-H-70 STATUS = OPERATIONAL EVIDENCE ACCESS OWNER DECISION COMPLETED.** **H-70 RECORD = COMPLETED.** **OWNER DECISION STATUS = DECISIONS RECORDED UNDER COMPANY POA.** **OPERATIONAL EVIDENCE ACCESS = CONTROLLED ACCESS APPROVED — MODEL B.** **VALIDATION EXECUTION = NOT YET EXECUTED.** **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-71 pointer (additive — does not overwrite H-70)

Controlled commercial process validation execution: [`gpta-h-71-controlled-commercial-process-validation-execution.md`](gpta-h-71-controlled-commercial-process-validation-execution.md). H-16–H-70 history **above is not rewritten**. **GPTA-H-71 STATUS = CONTROLLED COMMERCIAL PROCESS VALIDATION EXECUTED.** Three genuine email cases; package partial. **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-72 pointer (additive — does not overwrite H-71)

Commercial process validation findings and future-capability disposition: [`gpta-h-72-commercial-process-validation-findings-and-future-capability-disposition.md`](gpta-h-72-commercial-process-validation-findings-and-future-capability-disposition.md). H-16–H-71 history **above is not rewritten**. **GPTA-H-72 STATUS = COMMERCIAL PROCESS VALIDATION FINDINGS AND FUTURE-CAPABILITY DISPOSITION COMPLETED.** Process **partially observed**; full conclusion **not** established. **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.

---

## GPTA-H-73 pointer (additive — does not overwrite H-72)

Owner disposition of H-72 Paths A–D: [`gpta-h-73-owner-disposition-of-h-72-paths.md`](gpta-h-73-owner-disposition-of-h-72-paths.md). H-16–H-72 history **above is not rewritten**. **GPTA-H-73 STATUS = OWNER DISPOSITION RECORDED — PATH A + PATH D SELECTED.** Path A process refinement **ACTIVE**. Path D requirements track **ACTIVE**. Path B **DEFERRED**. Path C **DEFERRED**. **IMPLEMENTATION = NOT AUTHORIZED.** **F2-I12 NOT AUTHORIZED.** **PRODUCTION NOT AUTHORIZED.** No application change. Commit / push **not performed**.
