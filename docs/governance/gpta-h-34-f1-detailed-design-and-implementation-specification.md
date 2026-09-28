# GPTA-H-34 — F1 Detailed Design and Implementation Specification

> **`F1 — DOCUMENTATION / DESIGN ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO PROCUREMENT`** · **`NO EXTERNAL SUPPLIER ENGAGEMENT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:34:00+03:00**.  
**HEAD at commissioning:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Commissioned after GPTA-H-33: F0 **ACCEPTED WITH CONDITIONS**. H-16–H-33 historical bodies are **not rewritten**.

H-33 conditions C-01–C-10 apply. H-20/H-21/H-22 remain sections inside H-19 (no standalone files).

```text
THIS SPECIFICATION ≠ F2
THIS SPECIFICATION ≠ CODING
THIS SPECIFICATION ≠ SCHEMA
LOGICAL DATA REQUIREMENTS ≠ DATABASE DESIGN
EXISTING DEV/TEST STRUCTURE ≠ REUSE GRANT
```

---

## 1. F1 governance and scope

| Item | Status |
| --- | --- |
| F0 | **ACCEPTED WITH CONDITIONS** (H-33) |
| F1 | **IN PROGRESS — SPECIFICATION ONLY** |
| F1 design completeness | **SPECIFIED — PENDING F1 REVIEW** |
| F1 documentation readiness | **THIS PACK COMMISSIONED** |
| F1 implementation readiness | **NO** |
| F2 implementation readiness | **NO** |
| Implementation authorization | **NO** (H-31 Decision 5) |
| Production readiness | **NO** |
| Scope | **C1–C10 ONLY** |
| C11+ | **NOT IN SCOPE** |
| Production / migration execution / procurement | **NOT AUTHORIZED** |
| Commit / push | **NOT AUTHORIZED** |
| OR-04 | `NO NUMERICAL TARGET AUTHORIZED` |
| Commercial floor **value** | **NOT AUTHORIZED** (`CPR-FLOOR` placeholder only) |
| DR-008 | **DEFERRED** |
| NA-A-22 / E1 / E1-C / E1-D / Path B | Unchanged |

**No commitment** to a particular technical implementation approach (store, API shape, UI framework, dual-path PostgreSQL vs in-memory). F1 states **logical** requirements. Physical design is F2 **after** a separate implementation authorization.

F0→F6 remains the H-31 **governance lifecycle**. H-30 §H technical-slice labels are **not** the approved sequence.

---

## 2. Target commercial operating workflow

Future operating process (H-16 / H-19 / H-25 / H-31). **Not** assumed to be fully supported by current software.

| Step | Business event | Structured facts required in EOS (future SoR) | Evidence / artefacts (may remain outside EOS as documents/channels) |
| --- | --- | --- | --- |
| 1 | Enquiry/RFP received | RFP identity; received timestamp distinct from system created time | Original email/WhatsApp/phone note; attachment allowed |
| 2 | Intake details recorded | Title; destinations; dates or decision window if known; pax/profile if known; requirements text | Intake CHANNEL (one) |
| 3 | Account / Market / buyer type / SOURCE / CHANNEL | Account identity; OR-03 type including PCO; Market from 15-value list; exactly one primary SOURCE; 0–2 secondaries; one intake CHANNEL | SOURCE change later requires audit |
| 4 | Initial review and clarification | Clarification started; completed **or** N/A; distinguishable from general notes | Correspondence remains in email/WhatsApp |
| 5 | Qualification decision | Status `qualified` / `not_qualified` / `not_yet_assessed`; date; owner; OR-01-B conditions; evidence refs | Unqualified remain visible; not counted as qualified |
| 6 | Opportunity ownership | One accountable opportunity owner; follow-up owner = same unless transfer record | Transfer: previous owner, new owner, next action, who, when |
| 7 | Programme and costing preparation | Programme identity linked to RFP; dates/group/items/suppliers; costing identity; quantities; currencies; rate version or explicit ad-hoc | Office/Excel may be working tools; sent basis must later exist in EOS |
| 8 | Commercial review/approval | Approval required Y/N + trigger class if Y; status; approver; decided at; approved version **or** reject/rework | Ordinary in-parameter: no unnecessary executive approval |
| 9 | Proposal production in Office | Optional; not required to disappear | Client-facing Word/PDF |
| 10 | Structured proposal identity in EOS | Proposal id/version; links to RFP, programme, costing, approval (or “approval not required”); owner | Office file identifiable against EOS version **if** used |
| 11 | Proposal sent | Sender (opportunity owner after required approval); send timestamp; recipient type (agent/client) | Email remains the send channel unless later authorized otherwise |
| 12 | Follow-up / next action | Next action; timing; owner; overdue = timing passed and not done | Escalation point = Commercial Director (process) |
| 13 | Negotiation and revisions | New proposal/costing **version**; prior sent snapshot retained | Later edits ≠ overwrite sent basis |
| 14 | Confirmed booking **or** closed-lost | Booking id + win date **or** closed-lost + loss date | Confirm/reject may arrive by email/WhatsApp/phone |
| 15 | Loss reasons | Exactly one primary LR-01–LR-12; 0+ contributing from same catalogue; LR-12 explanation | Change after finalization only with new evidence + audit |
| 16 | KPI facts | Derived from the structured events above | No targets; no forecasts; not Domain J / C11+ |

Pipeline stage (including `new_qualified`) may move independently of qualification status. Qualification **before** significant costing/proposal resource (OR-01-D).

---

## 3. Source-of-truth and system boundaries

| Layer | Owns | Must not own as sole SoR |
| --- | --- | --- |
| **EOS** | Structured commercial facts (H-31 Decision 2 / H-29 §C.A) | Client document layout |
| **Office** | Programme/itinerary/proposal **presentation**; Excel as working calculator until sent | Workflow status, qualification, owner, next action, SOURCE/CHANNEL, loss, KPI facts |
| **Email / WhatsApp / phone** | Communication | SOURCE attribution; commercial ownership; next action as the only record |
| **Supplier information** | Source rates maintained by supplier-management function; Sales flags discrepancies | Silent use of expired/unverified rates on live proposals |
| **Reporting / KPI** | Facts **derived** from EOS structured records | Invented baselines; C11+ analytics product |

**References required in EOS when artefacts stay outside:** Office file/version identifier against proposal/programme version; original RFP attachment or correspondence pointer **where available** (OR-01-E). **Mailbox ingest, WhatsApp API, and advertising pixels are not authorized.**

**Preserved distinctions:** SOURCE ≠ CHANNEL; Market ≠ buyer type; qualification ≠ pipeline stage; send ≠ approval; Dev/Test ≠ operational fitness.

---

## 4. C1–C10 detailed design requirements

Logical requirements only. Existing Dev/Test is **not** a reuse grant.

**Common roles (all C*):** Opportunity owner (Sales & BD); Commercial Director (oversight/escalation/triggered approval); designated commercial approver **only if** later named under the parameter register; supplier-management function (C4); technical increment owner **not named** (Owner decision). Permissions are **need-to-know commercial records**; Production IAM is E1-gated.

**Common audit:** who, when, previous value, new value, reason for SOURCE, owner, qualification, loss-reason, and approval decisions. Sent costing/proposal snapshots are **immutable**.

---

### 4.1 C1 CRM

1. **Objective:** Stable account identity; OR-03 including PCO; Market; SOURCE/CHANNEL on the opportunity (account may hold relationship-level origin); owner distinguishable from opportunity owner; repeat identifiable from prior win/booking.  
2. **Workflow:** Create/link account at intake; classify type and Market; do not collapse Market into country or type.  
3. **Structured data:** Account identity; organization; OR-03 type; Market (15 values); optional strategicClassification as **visibility aid only** (DR-008 deferred).  
4. **Relationships:** Account ↔ many opportunities; opportunity requires account/org.  
5. **Roles:** Account owner vs opportunity owner distinguishable.  
6. **Audit:** Type/Market changes; no silent erase.  
7. **Validation:** PCO selectable and distinct; Market independent of destination.  
8. **Exceptions:** Unknown Market → use **Other** with later correction + audit; do not invent a 16th value.  
9. **Reporting:** Filter by Market, buyer type, SOURCE, CHANNEL, repeat-from-history.  
10. **Dev/Test:** Orgs/accounts/owner exist (H-28).  
11. **H-28 gap:** No PCO key; Market unset; no SOURCE/CHANNEL pair; tasks not RFP-bound.  
12. **Remediation:** H-29 D1.  
13. **Dependencies:** DEP-15 DR-008; DEP-05 SOURCE audit representation.  
14. **AC:** AC-C1-01–06; AC-S; AC-M.  
15. **Owner decision:** DR-008 flags; technical increment owner.

### 4.2 C2 Opportunity management

1. **Objective:** Pipeline visibility plus **distinct** qualification and loss capture.  
2. **Workflow:** Stage moves independently of qualification; lost requires OR-02; won links to booking.  
3. **Structured data:** Opportunity code/id; stage (`new_qualified` remains a **stage**); status; owner; value when available else explicit unknown; qualification object (status, date, owner, OR-01-B, evidence refs).  
4. **Relationships:** Opportunity → account; → RFP (one or more over time, but each RFP → one opportunity).  
5. **Roles:** Qualification owner = opportunity owner.  
6. **Audit:** Qualification change; material/strategic reclassification **visible to Commercial Director**.  
7. **Validation:** Cannot treat `new_qualified` stage as qualified count.  
8. **Exceptions:** Not-yet-assessed remains listed.  
9. **Reporting:** Qualified vs not vs not assessed; pipeline by stage/owner/Market/type.  
10. **Dev/Test:** Three opportunities; stage history.  
11. **H-28 gap:** No qualification object; no LR catalogue.  
12. **Remediation:** H-29 D2.  
13. **Dependencies:** DEP-16 definition version label (optional).  
14. **AC:** AC-Q; AC-C2-01–06; AC-L.  
15. **Owner decision:** None new for OR-01 text; CD visibility **mechanism** (queue vs notice vs access) chosen in this F1 as **process**: Commercial Director must be able to list material reclassifications — mechanism not a product invention.

**F1 mechanism choice (process, not a build grant):** CD visibility = **queryable record** of material/strategic qualification reclassification (who, when, from, to, reason). Notification product is **not** required in C1–C10.

### 4.3 C3 RFP management

1. **Objective:** RFP identity, received stamp, clarification as a distinct step, follow-up bound to RFP/opportunity.  
2. **Workflow:** Receive → intake → clarification (or N/A) → qualify → programme path.  
3. **Structured data:** RFP id; opportunity id; `receivedAt`; clarification started/completed/N/A; next action + timing on active qualified items.  
4. **Relationships:** RFP → opportunity → account; follow-up task → RFP **and** opportunity (H-33 C-09: do **not** treat existing combined `source` as AC-S).  
5. **Roles:** Assigned owner = opportunity owner unless transfer.  
6. **Audit:** Owner transfer; CHANNEL correction.  
7. **Validation:** SOURCE and CHANNEL stored as **separate** facts; clarification ≠ free-text dump.  
8. **Exceptions:** Clarification N/A when not required, explicit.  
9. **Reporting:** Action list: which RFPs need action, who owns, what next — without opening email.  
10. **Dev/Test:** `RFP-2026-0847`; `receivedAt`; no clarification.  
11. **H-28 gap:** No clarification stamps; source absent/combined; tasks `[]`.  
12. **Remediation:** H-29 D3.  
13. **Dependencies:** DEP-07, DEP-08, DEP-09.  
14. **AC:** AC-C3-01–07; AC-F; AC-T.  
15. **Owner decision:** None for the rule; UAT authority later.

### 4.4 C4 Supplier rates

1. **Objective:** Live-proposal rates are typed, dated, verified, currency-true, versioned, and snapshotable.  
2. **Workflow:** Maintain rates; resolve overlap before live use; reconfirm expiry; flag discrepancies.  
3. **Structured data:** Supplier; rate identity/version; OR-08 source class; one of five types; original currency; season/applicability; valid from/to; verification date/state; status current vs not current.  
4. **Relationships:** Rate → supplier; costing line → rate version **or** explicit Quoted/Ad hoc.  
5. **Roles:** Supplier-management maintains; Sales flags.  
6. **Audit:** Version history not overwritten; supersession retains prior version.  
7. **Validation:** Expired ≠ silently selectable as current; overlap identifiable.  
8. **Exceptions:** Public usable for sale only if explicitly approved for sale.  
9. **Reporting:** Which rate version underpinned a sent proposal.  
10. **Dev/Test:** Validity/season/currency fields exist; expired still active in H-28.  
11. **H-28 gap:** Types/verification/expiry behaviour/snapshot.  
12. **Remediation:** H-29 D4; this pack §8.  
13. **Dependencies:** DEP-10, DEP-11.  
14. **AC:** AC-R; AC-C4-01–05.  
15. **Owner decision:** FX **provider** must **not** be selected here.

### 4.5 C5 Programme / itinerary

1. **Objective:** Commercial programme identity for the RFP; Office may present.  
2. **Workflow:** Build structured days/items/suppliers/dates/group; version if client-facing content changes.  
3. **Structured data:** Programme id; RFP id; dates; pax; items; supplier ids.  
4. **Relationships:** RFP → programme → costing → proposal.  
5. **Roles:** Opportunity owner accountable for commercial programme facts.  
6. **Audit:** Programme version when client-facing change.  
7. **Validation:** Costing/proposal reference that programme id.  
8. **Exceptions:** Incomplete programme cannot be the sent commercial basis.  
9. **Reporting:** Programme linked in funnel.  
10. **Dev/Test:** `PRG-2026-0847`.  
11. **H-28 gap:** Not operational SoR; dayCount vs title.  
12. **Remediation:** H-29 D5. Document generation **not** required.  
13. **Dependencies:** None Owner-new.  
14. **AC:** AC-C5-01–03.  
15. **Owner decision:** None for generation (excluded).

### 4.6 C6 Costing

1. **Objective:** Reconstruct why a **sent** proposal cost what it cost.  
2. **Workflow:** Lines with quantity, unit cost, currency, supplier, rate version or ad-hoc; version on send.  
3. **Structured data:** Cost sheet id; links; line facts; calculated margin as **fact**; **no** Owner margin target.  
4. **Relationships:** Costing → programme, RFP, opportunity; → proposal.  
5. **Roles:** Preparer identifiable; not the same as approver/sender by requirement.  
6. **Audit:** Sent snapshot immutable; later edits new version.  
7. **Validation:** Do not preserve 20% / 250k as Owner rules.  
8. **Exceptions:** Ad-hoc/unverified rate must be explicit.  
9. **Reporting:** Margin as stored fact when present; profit only when cost and sell exist.  
10. **Dev/Test:** `CST-2026-0847`; missing rate ids on sample lines.  
11. **H-28 gap:** Snapshot incompleteness; numerical floor artifact.  
12. **Remediation:** H-29 D6.  
13. **Dependencies:** DEP-01 (`CPR-FLOOR`).  
14. **AC:** AC-C6-01–04; AC-P costing portion.  
15. **Owner decision:** Floor **value**.

### 4.7 C7 Commercial approval

1. **Objective:** H-27 eight categories; send ≠ approval; in-parameter path.  
2. **Workflow:** Determine if any trigger applies; if none, approval not required; if any, request → decide → approved version or reject/rework → then send.  
3. **Structured data:** Required Y/N; trigger class(es); status; requester; approver; timestamps; notes.  
4. **Relationships:** Approval → costing/RFP/programme; proposal records approval id **or** not-required.  
5. **Roles:** Approver ≠ sender when both acted; CD or designated approver when required.  
6. **Audit:** Decision immutable except recorded rework cycle.  
7. **Validation:** Must not use 250k/20% as governing rule (H-33 C-08).  
8. **Exceptions:** Rejection/rework representable.  
9. **Reporting:** Approval status on sent proposals where required.  
10. **Dev/Test:** `APR-2026-0847` numerical gate.  
11. **H-28 gap:** Wrong rule.  
12. **Remediation:** H-29 D7; this pack §7.  
13. **Dependencies:** DEP-01–03.  
14. **AC:** AC-C7-01–05.  
15. **Owner decision:** Parameter values or increment waiver; designated approver title if not CD.

### 4.8 C8 Proposal management

1. **Objective:** EOS holds what was proposed, to whom, by whom, when, on which costing/approved version.  
2. **Workflow:** Create from costing/programme; send after OR-05; Office PDF/Word optional.  
3. **Structured data:** Proposal id/version; owner; sender; `sentAt`; recipient type; snapshot (not day-counts only); links.  
4. **Relationships:** Proposal → RFP, programme, costing, approval.  
5. **Roles:** Owner vs sender vs approver distinguishable.  
6. **Audit:** Sent version retained.  
7. **Validation:** AC-C8-01 holds even if PDF is produced outside EOS.  
8. **Exceptions:** Resend = new version or recorded same-version resend with timestamp.  
9. **Reporting:** Proposals sent count from send events.  
10. **Dev/Test:** `PROP-2026-0847`.  
11. **H-28 gap:** Snapshot/sender; Office remains SoR.  
12. **Remediation:** H-29 D8. No document automation required.  
13. **Dependencies:** C6/C7.  
14. **AC:** AC-P; AC-C8-01–03.  
15. **Owner decision:** None for automation (excluded).

### 4.9 C9 Booking

1. **Objective:** Win traces to origin; dimensions persist.  
2. **Workflow:** Accepted/confirmed → booking; copy Market, buyer type, SOURCE at win (immutable-at-win or audited).  
3. **Structured data:** Booking id; FKs; value; win date; owner; dimensions.  
4. **Relationships:** Booking → proposal, RFP, programme, opportunity, account.  
5. **Roles:** Commercial owner at close; operations assignee may differ.  
6. **Audit:** Win dimensions not silently rewritten by later account edits.  
7. **Validation:** Same account as opportunity.  
8. **Exceptions:** Cancelled booking status distinct from closed-lost opportunity.  
9. **Reporting:** Conversion qualified→booking.  
10. **Dev/Test:** `BKG-2026-0847`.  
11. **H-28 gap:** No Market/SOURCE/type on booking.  
12. **Remediation:** H-29 D9. No real bookings in tests.  
13. **Dependencies:** C1 dimensions exist first.  
14. **AC:** AC-C9-01–03.  
15. **Owner decision:** None new.

### 4.10 C10 KPI / reporting

1. **Objective:** H-17 categories from structured facts; **no** targets, forecasts, scoring, or C11+.  
2. **Workflow:** Derive counts/filters from C1–C9 events.  
3. **Structured data:** No separate “KPI product”; facts are the operational records.  
4. **Relationships:** All prior identities.  
5. **Roles:** Commercial management readers; no extra Production analytics role invented.  
6. **Audit:** Reproducible calculation from stamps.  
7. **Validation:** Qualified counts ≠ `new_qualified` stage; command center ≠ pack.  
8. **Exceptions:** Missing stamps → “not measurable”, not invented.  
9. **Reporting:** Funnel, speed, pipeline, loss, commercial, acquisition (H-29 D10).  
10. **Dev/Test:** Command center rollup; Domain J summary.  
11. **H-28 gap:** Pack not demonstrated.  
12. **Remediation:** H-29 D10.  
13. **Dependencies:** F0–F9 facts.  
14. **AC:** AC-C10-01–04; AC-009 categories.  
15. **Owner decision:** OR-04 remains no targets.

---

## 5. Business-rule representation

| Rule | F1 representation (logical) | Parameter |
| --- | --- | --- |
| OR-01-A–F | Qualification **record** with status, owner, date, nine conditions, evidence refs, change history, CD-visible material reclass | No numeric threshold |
| LR-01–LR-12 | Controlled catalogue; one primary mandatory at closed-lost; 0+ contributing same list; LR-12 text mandatory | Catalogue closed |
| OR-03 + PCO | Controlled account-type list; PCO distinct | No seed-key coding in F1 |
| Market | Controlled 15-value list; ≠ type ≠ destination | Add 16th only via governance |
| SOURCE | One primary; 0–2 secondaries; change audit (who/when/previous/new/reason) | Catalogues closed |
| CHANNEL | One initial intake; later media = follow-up unless intake correction + audit | Separate from SOURCE |
| OR-04-FU | Follow-up owner = opportunity owner; transfer stores new owner + next action | CD escalation = process |
| OR-05 / OR-06 | Send after required approval; eight trigger **classes**; in-parameter = none of eight | `CPR-FLOOR` **undefined** |
| OR-08 | Five types; source priority class; validity; season; currency; verification; snapshot | FX provider **unselected** |

```text
OR-04 = NO NUMERICAL TARGET AUTHORIZED
CPR-FLOOR = COMMERCIAL MARGIN FLOOR VALUE — NOT AUTHORIZED
CPR-DISCOUNT / CPR-CREDIT / CPR-SIZE / CPR-LIABILITY = NOT AUTHORIZED
H-28 250k/20% = NOT AN APPROVED BUSINESS RULE
```

**In-parameter (until values exist):** no H-27 trigger class applies, using documented professional judgement — **only** if a later F2 authorization **waives** values for that increment (H-33 C-02). F1 does **not** waive.

---

## 6. Data and identity-chain design

**Logical chain (required):**  
Account → Opportunity → Qualification → RFP → Clarification → Programme → Costing → Approval (or not-required) → Proposal → Follow-up → Booking **or** Loss → KPI facts.

**Dev/Test demonstration only (not operational fitness):**  
`OPP-2026-GLOB → RFP-2026-0847 → PRG-2026-0847 → CST-2026-0847 → APR-2026-0847 → PROP-2026-0847 → BKG-2026-0847`

| Topic | Requirement |
| --- | --- |
| Identity | Stable business codes/ids for opp, RFP, programme, costing, approval, proposal, booking, account, rate version |
| Integrity | Each RFP one opportunity; costing and proposal reference the same programme/RFP; booking traces to originating opportunity |
| Transitions | Stage ≠ qualification; RFP workflow must **represent** clarification even if current software stages omit it |
| Immutable at event | Sent costing/proposal snapshot; win-time Market/type/SOURCE; decided approval; finalized loss unless audited correction |
| Editable | Draft programme/costing; next action; notes; not-yet-sent versions |
| Reassignment | New owner + next action; previous owner retained |
| Closed-record | Won/lost/closed RFP not silently reopened without audit |
| Follow-up task | Bound to RFP **and** opportunity (not only CRM account) |
| Physical store | **Not prescribed.** F1 forbids assuming H-28 in-memory = Production SoR (DEP-22) |

No database schema or migration is specified or created.

---

## 7. Approval and commercial-risk design

| Trigger class | Condition (qualitative) | Role | Evidence | Decision | Audit | Escalation | Exception |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Exceptional discounting | Discounting outside ordinary practice | CD or designated approver | What is exceptional vs ordinary (process note) | Approve / reject / rework | Who/when/version | CD | Do not invent % |
| 2 Below approved floor | Margin below `CPR-FLOOR` **when that value exists** | Same | Calculated margin vs register | Same | Same | CD | **Blocked as auto-rule until `CPR-FLOOR` authorized or increment waiver** |
| 3 Unusual payment/credit | Terms outside ordinary practice | Same | Terms text | Same | Same | CD | `CPR-CREDIT` undefined |
| 4 Non-standard cancellation/liability | Non-standard terms | Same | Terms text | Same | Same | CD | `CPR-LIABILITY` undefined |
| 5 Significant contractual commitments | Qualitative “significant” | Same | Commitment description | Same | Same | CD | `CPR-SIZE` undefined |
| 6 Strategic/high-risk accounts | Account flagged strategic **or** CD-designated high risk — **not** a silent DR-008 close | Same | Why high-risk | Same | Same | CD | DR-008 still deferred; type OR-03 remains |
| 7 Unusually large/complex programmes | Qualitative | Same | Why complex | Same | Same | CD | No pax/value number invented |
| 8 Policy deviation | Deviation from approved supplier/commercial policy | Same | Which policy | Same | Same | CD | Policy corpus not created here |

**Sender** = opportunity owner after required decision. **Approver ≠ sender** when both acted. Reject/rework must be representable.

---

## 8. Supplier-rate design

| Topic | Requirement |
| --- | --- |
| Source | OR-08 priority class recorded |
| Type | Exactly one of five |
| Currency | Original supplier currency preserved |
| Season | Supplier-specific; dates explicit |
| Effective / expiry | From/to; expired = not current without reconfirmation |
| Versioning | New version; prior retained |
| Overlap | Identifiable; resolved before live proposal (preferred-in-conflict is a **hint**, not silent winner without record) |
| Supersession | Status superseded/not current; history kept |
| Verification | Date/state before live use |
| FX | Basis and date if converted; **provider unselected** |
| Snapshot | Sent costing/proposal retains rate version or explicit ad-hoc |
| Conflicting info | Sales flags; supplier-management owns source | 
| Exceptions | Public-for-sale requires explicit approval |

Unresolved: overlap **resolution algorithm** beyond “must be resolved and recorded”; FX provider; verification SLA as a **number** (H-25 says at least quarterly as **process**, not a coded target).

---

## 9. Security, roles, and auditability

Requirements-level only. **No** permission or authentication change in this task.

| Control | Requirement |
| --- | --- |
| Opportunity / follow-up ownership | One accountable owner; follow-up same unless transfer |
| Reassignment | Audited; next action required |
| Proposal preparation vs send vs approval | Distinct actors when they differ |
| CD oversight | Queryable material qualification reclassifications and overdue follow-up |
| Sensitive commercial information | Need-to-know; classification already exists on commercial objects — F1 does not redesign classification |
| Audit trails | SOURCE, owner, qualification, approval, loss, sent snapshots |
| Record lifecycle | Draft vs sent vs closed |
| Unauthorized access | Production IAM = E1; preview identity ≠ Production |
| Error handling | Failed send/approval recorded; no silent drop |
| Data correction | Audited amendment; no erase of previous SOURCE/loss/approval |
| External comms bodies | **Not** ingested unless separately authorized |

---

## 10. Migration, compatibility, and document strategy

**Decision not selected.** Options and criteria only (H-33 C-04; DEP-12).

| Option | Description | Criterion | Default if Owner silent |
| --- | --- | --- | --- |
| M0 | No historic Office/Excel ingest | Safest; EOS starts at go-live capture | **Default assumed for F1** |
| M1 | Selective forward-only capture of **new** RFPs from a cutover date | Needs cutover date (Owner) | Not selected |
| M2 | Manual backfill of key open opportunities | Quality unknown; dual-key risk | Not selected |
| M3 | Automatic Office/Excel import | **Not assumed suitable**; completeness unknown | **Not authorized** |

Dev/Test structures may be **reused, adapted, or replaced** only after F2 authorization and validation — not by F1. Existing rates/documents are **not** presumed complete. Deduplication rules: not invented; C1 duplicate capability exists in Dev/Test but is unused live.

Rollback of a future F2 increment: restore prior application behaviour and do not destroy sent snapshots if any were written; detailed steps are F2 after authorization. F1 requires that a rollback **note** exist in the F2 request.

**Data ownership after cutover:** EOS §3; until cutover, Office remains live SoR.

---

## 11. Testing and UAT design

**No testing or UAT has occurred under this pack.**

### 11.1 Future technical tests (after F2 authorization)

Unit; integration; API; UI; data-integrity (identity chain); role/permission; audit; workflow lifecycle including clarification and qualification≠stage; rate expiry/overlap/snapshot; approval categories (in-parameter vs triggered — **without** treating 250k/20% as expected Owner rule); proposal/booking chain; KPI from structure not stage name; regression of OPP→BKG chain **on disposable data**; failure recovery; rollback validation.

Store under test must be **named** (DEP-22). Disposable Dev/Test data only. No live customer/supplier commitments.

### 11.2 UAT

| Item | Requirement |
| --- | --- |
| Authority | **Not named.** Owner must name (DEP-14). F1 proposes: Commercial Director or designated business acceptor |
| Scenarios | Steps in §2 using disposable data; Office file optional against EOS version |
| Evidence | Recorded results vs H-29 ACs |
| Defect class | Blocker / major / minor / documentation |
| Retest | Blockers retested after fix |
| Sign-off | Named authority; not inferred from compile or unit tests |
| Reject | Any AC-Q/AC-S/AC-L/AC-F/AC-C7 failure on the in-scope increment |

UAT is F5 in the H-31 lifecycle. A Dev/Test-only F2 may proceed **only if** the F2 grant says UAT is not required for that increment.

---

## 12. F1 acceptance criteria

Classification of **this specification pack**, not of software.

| ID | Criterion | Result | Evidence |
| --- | --- | --- | --- |
| F1-AC-01 | Requirements traceable to H-16–H-33 | `MET` | §§1–5 cite freeze, H-25/27/28/29/31/33 |
| F1-AC-02 | C1–C10 individually addressed | `MET` | §4.1–4.10 |
| F1-AC-03 | Workflow completeness | `MET` | §2 sixteen steps |
| F1-AC-04 | SoR clarity | `MET` | §3 |
| F1-AC-05 | Business-rule representation | `MET` | §5; no invented numbers |
| F1-AC-06 | Identity-chain integrity specified | `MET` | §6; demo chain labelled Dev/Test only |
| F1-AC-07 | Approval and auditability specified | `MET` | §§7, 9 |
| F1-AC-08 | Supplier-rate requirements specified | `MET` | §8 |
| F1-AC-09 | Migration strategy | `PARTIALLY MET` | Options M0–M3; **selection** `REQUIRES OWNER DECISION` |
| F1-AC-10 | Testing strategy | `MET` as a **plan** | §11.1; execution `REQUIRES FUTURE EVIDENCE` |
| F1-AC-11 | UAT strategy | `PARTIALLY MET` | §11.2; authority `REQUIRES OWNER DECISION` |
| F1-AC-12 | Rollback strategy | `PARTIALLY MET` | Principle stated; detailed procedure `REQUIRES FUTURE EVIDENCE` at F2 request |
| F1-AC-13 | Dependency treatment | `MET` | Placeholders; DR-008 deferred; E1 separate |
| F1-AC-14 | Security considerations | `MET` as requirements | §9; no IAM implemented |
| F1-AC-15 | Scope control (no C11+) | `MET` | §1, §4.10 |
| F1-AC-16 | F1 specification **review** | `NOT MET` | Next governance action |
| F1-AC-17 | Technical increment owner named | `REQUIRES OWNER DECISION` | H-33 C-10 |
| F1-AC-18 | Parameter values or F2 waiver | `REQUIRES OWNER DECISION` | `CPR-*` |

Overall F1 design completeness: **SPECIFIED — PENDING F1 REVIEW**. Content ACs `MET` here are **not** F2 evidence (H-33 C-07).

---

## 13. F2 entry conditions

F1 **does not** satisfy these automatically.

| # | Condition | Now |
| --- | --- | --- |
| 1 | F1 specification **review** complete | **Outstanding** |
| 2 | Requirements traceability confirmed in that review | Outstanding |
| 3 | Design completeness accepted (open items listed, not hidden) | Outstanding |
| 4 | Open parameters **authorized or explicitly waived** for the increment | Outstanding (Owner) |
| 5 | Security and role review (requirements vs Production IAM) | Outstanding |
| 6 | Migration **decision** (M0 default unless Owner selects otherwise) | Outstanding (Owner) |
| 7 | Test plan accepted for the increment | Outstanding |
| 8 | UAT plan accepted **or** Owner waives UAT for Dev/Test-only increment | Outstanding |
| 9 | Rollback plan for that increment | Outstanding |
| 10 | Operational/technical ownership named | Outstanding |
| 11 | **Explicit implementation authorization** (Decision 5-class) naming the increment | **Absent** |
| 12 | Production remains **separately** gated (E1) | **Still gated** |
| 13 | Commit/push **separately** granted | **Absent** |

---

## 14. Governance status

```text
GPTA-H-34 STATUS = F1 DETAILED DESIGN SPECIFICATION COMMISSIONED — DOCUMENTATION ONLY

F0 = ACCEPTED WITH CONDITIONS
F1 = IN PROGRESS — SPECIFICATION ONLY
F1 DESIGN COMPLETENESS = SPECIFIED — PENDING F1 REVIEW
F1 IMPLEMENTATION READINESS = NO
IMPLEMENTATION READINESS = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

NEXT ACTION = F1 SPECIFICATION REVIEW — DOCUMENTATION ONLY
```
