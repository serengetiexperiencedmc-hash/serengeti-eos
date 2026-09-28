# GPTA-H-07 — Commercial Objective Definition & Stage 1 Readiness

> **`GOVERNANCE-ONLY — STAGE 1 DEFINITION PACKAGE`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NOT A STAGE 1 APPROVAL`**  
> **`NOT A COMMERCIAL OBJECTIVE AUTHORIZATION`**  
> **`NO IMPLEMENTATION`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**  
> **`NA-A-23 IS NOT CREATED`**  
> **`C11+ IS NOT CREATED`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T22:12:00+03:00**.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Working tree:** **DIRTY** — preserved. Index: **EMPTY**.

This package does **not** choose a candidate. Candidates 1–5 are **unranked**. Evaluation frame (this Owner instruction, not a frozen grant): EOS should support **measurable commercial growth** for Serengeti Experience DMC rather than technical features without a demonstrated business need.

---

## 1. Purpose

GPTA-H-06 concluded: **`NO CURRENTLY AUTHORIZED NEW IMPLEMENTATION OBJECTIVE IDENTIFIED`** and **`OWNER DECISION REQUIRED TO ESTABLISH THE NEXT GOVERNED WORKSTREAM`**.

This file prepares a **Stage 1 definition package** so the Owner can subsequently **approve, amend, reject, or defer** a new commercial/business objective. It does **not** implement, authorize implementation, or treat previously discussed commercial activity as already authorized.

---

## 2. Authoritative baseline

GPTA-H-06; GPTA-H-05 (`NO CURRENTLY AUTHORIZED NEW IMPLEMENTATION INCREMENT`); GPTA-H-04 E1-D parked; GPTA-H-01 Path B HOLD; post-Path-B checkpoint; portfolio transition; [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md); [`adr-0006-e1-b-company-response-to-provider-rfi-rfq.md`](adr-0006-e1-b-company-response-to-provider-rfi-rfq.md); [`commercial-roadmap.md`](../architecture/commercial-roadmap.md); [`c1-crm-preview.md`](../architecture/c1-crm-preview.md); [`c1-implementation-authorized.md`](c1-implementation-authorized.md); [`cd-phase1-commercial-foundation-authorized.md`](cd-phase1-commercial-foundation-authorized.md); [`crm-mice-authorization-gate.md`](crm-mice-authorization-gate.md).

---

## 3. Repository authorization state

**Unchanged by this file.**

| Item | Status |
| --- | --- |
| HEAD / branch | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` / `master` |
| Working tree / index | **DIRTY** / **EMPTY** |
| Commit / push / UAT | **NOT GRANTED** |
| E1-D | **FORMALLY PARKED / DEFERRED** |
| E1-C | **CONTROLLED PAUSE** |
| E1-B RFI | **CONTROLLED PAUSE** |
| GPTA-H-01 | **CLOSED — PATH B ON HOLD** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| Standing Dev/Test | **AVAILABLE** — not a new increment |
| New commercial Stage 1 | **NOT APPROVED** |
| Production | **NOT AUTHORIZED** |
| SEO / website / paid media / LinkedIn | **NO CURRENT REPOSITORY WORKSTREAM AUTHORIZATION IDENTIFIED** |
| C11+ | **NOT CREATED / NOT AUTHORIZED** |

---

## 4. Commercial context

**Documented company position** (not a census; not Production authorization):

* SEDMC is a Tanzania-based DMC operating destination-management, MICE, incentive-travel and related commercial activities (LA-01).
* SEDMC **intends to operate EOS as its internal commercial operating platform** (LA-01).
* Destinations (company-supplied): Tanzania, Kenya, Rwanda, Uganda, Zanzibar, Ethiopia, Seychelles, Mauritius.
* Target markets (company-supplied): South Africa, Europe, Middle East, Canada, USA, Latin America (and other international markets as stated).
* Buyer categories (company-supplied): incentive/event agencies, PCOs, corporate travel, MICE, destination specialists, travel/luxury advisors, consortia, tour operators.

**Not documented as authorized EOS workstreams:** SEO; website commercial architecture programme; Google Ads; LinkedIn strategy; South African market-penetration campaign; MICE sales development programme; CRM expansion increment; C11+.

South Africa appears as a **target/source market** in Legal/E1-C01/E1-B company-position records. That is **not** authorization of a South Africa go-to-market implementation.

---

## 5. Repository evidence

| Class | Content |
| --- | --- |
| **Documented evidence** | C1–C10 **IMPLEMENTED / CLOSED** Dev/Test (orgs, contacts, accounts, activities, tasks, opportunities, RFP, supplier, programme, costing, approval, proposal, booking). CD Phase 1 **consumed** (RFP-to-programme foundation; Dev/Test UAT PASS historically). Duplicate detection, merge, import, tags, audit/outbox exist in C1/I0–I4. Commercial analytics domain **J** labelled **later**. Production CRM **NOT APPROVED**. Forecast/revenue field historically **out of C1 scope**. Org-type keys include `incentive_house`, `mice_agency`, `corporate_travel_agency`, `travel_advisor`, `corporate`; **no** dedicated `pco` / `event_agency` seed keys (gap vs company position — labels configurable). |
| **Business-context evidence** | This GPTA-H-07 Owner instruction to evaluate a **new commercial objective**. Prior GPTA-H-06 Objective E. Company position that EOS is intended as the internal commercial platform. Markets/buyers/destinations as above. |
| **Assumption (not fact)** | That staff currently capture all RFPs in EOS; that live pipeline value exists in Production; that website/SEO/Ads/LinkedIn currently produce measurable EOS enquiries; that South Africa is under-penetrated vs a baseline; any numeric win-rate/RFP-volume/revenue. |
| **Evidence gap** | Owner/business confirmation of the **actual** problem (unused Dev/Test platform vs missing capability vs missing Production vs missing demand-generation vs missing operating discipline); named Owner for this objective; baselines; which buyer/market is in-scope first; whether existing C1–C10 should be **used** rather than rebuilt. |

GPTA-H-01 commercial trigger assessment found **no sufficient trigger for Path B leftover nouns**. That finding is **not** a finding that SEDMC has no commercial business. It does **not** authorize Candidates 1–5.

---

## 6. Commercial objective candidate map

**Unranked. None selected. None authorized.**

| ID | Candidate | Business purpose (candidate) | Documented in repo as grant? | Can be defined as Stage 1 draft? |
| --- | --- | --- | --- | --- |
| **1** | Commercial lead generation | Measurable generate / capture / qualify / track B2B opportunities | **No** | **Yes**, with gaps |
| **2** | MICE market development | Systematic priority-market and buyer-relationship development | **No** (markets are company position only) | **Yes**, with gaps |
| **3** | Digital demand generation | Measurable inbound demand via digital channels | **No** (SEO/ads/LinkedIn **NOT AUTHORIZED**) | **Yes as business problem**, not as channel build |
| **4** | Commercial pipeline / CRM effectiveness | Visibility/control of contacts, opportunities, RFPs, proposals, conversion | Capability **exists Dev/Test**; **no** new effectiveness programme | **Yes**, must not rebuild C1–C10 |
| **5** | Commercial operating system / EOS commercial capability | Broader operating capability across the commercial spine | LA-01 intent; C1–C10 **already** the Dev/Test spine | **Yes only as operating/adoption/Production-use problem**, not as a new parallel platform |

### Candidate 1 — Commercial lead generation

* Target buyer: company-position B2B types (agencies, PCOs, corporate travel, MICE, specialists, advisors, consortia, operators). **Actual current buyers: UNKNOWN.**
* Lead source: **UNKNOWN** (no authorized digital workstream; RFP intake exists in C3 Dev/Test).
* Qualification / RFP capture / pipeline / response tracking: C2–C3 **PARTIALLY COVERED** as product; live operating use **UNKNOWN**.
* Conversion / revenue attribution: commercial analytics **NOT COVERED** (later); C1 stripped estimated commercial value from domain historically.
* Current workaround: **UNKNOWN**.
* Measurable consequence: **UNKNOWN** until Owner supplies baselines.

### Candidate 2 — MICE market development

* Target markets: company-position list including **South Africa** as a named source market.
* Target buyers: same company-position categories.
* Account/contact/opportunity/follow-up: C1–C2 **PARTIALLY COVERED** (Dev/Test records exist).
* Conversion measurement: **NOT COVERED** as an authorized market-development programme.
* Current process/gaps/consequences: **UNKNOWN** as operating facts (no market-penetration KPI in repo).

### Candidate 3 — Digital demand generation

* SEO / website / Google Ads / LinkedIn / landing pages: **`NOT CURRENTLY AUTHORIZED`**.
* Enquiry/RFP conversion into EOS: C3 exists Dev/Test; website-to-RFP path **UNKNOWN**.
* Attribution: **NOT COVERED**.
* Target markets/buyers: company position only.

### Candidate 4 — Pipeline / CRM effectiveness

* Existing CRM: C1 **ALREADY COVERED** (Dev/Test).
* Opportunity lifecycle: C2 **ALREADY COVERED** (Dev/Test).
* RFP–proposal spine: C3–C8 **ALREADY COVERED** (Dev/Test); CD Phase 1 consumed.
* Data quality / duplicates: C1.6–C1.7 **ALREADY COVERED** (Dev/Test).
* Reporting / intelligence: domain J **NOT COVERED** (later).
* Current data: Production live CRM **NOT APPROVED**; actual data quality **UNKNOWN**.
* Workaround / impact: **UNKNOWN**.

### Candidate 5 — EOS as commercial operating capability

* Broader coverage (accounts, contacts, opportunities, RFPs, proposals, activities, tasks, follow-ups, reporting, ownership, conversion): **PARTIALLY / ALREADY COVERED** by C1–C10 in Dev/Test.
* Concrete business problem that would justify **defining a new capability**: **not established**. A concrete problem that would justify **adopting / measuring / Production-governing the existing spine**: **possible**, Owner-confirmable, distinct from rebuilding EOS.

---

## 7. Existing-capability coverage analysis

Do **not** propose rebuilding consumed increments.

| Business concern | Coverage |
| --- | --- |
| Organizations, contacts, relationships, accounts, activities, tasks, notes, tags, ownership | **ALREADY COVERED** (C1 Dev/Test) |
| Duplicate detection, merge, import | **ALREADY COVERED** (C1.6–C1.7 Dev/Test) |
| Tenant isolation, RBAC/SoD, audit, workflow, outbox | **ALREADY COVERED** (I0–I4 Dev/Test; C1 consumes them) |
| Opportunities / stages | **ALREADY COVERED** (C2 Dev/Test) |
| RFP intake, versions, SLA | **ALREADY COVERED** (C3 Dev/Test) |
| Supplier / programme / costing / approval / proposal / booking | **ALREADY COVERED** (C4–C10 Dev/Test; CD Phase 1 on C3–C8 spine) |
| Dedicated PCO / event-agency org-type keys | **PARTIALLY COVERED** (configurable types; seed keys incomplete vs LA-04/LA-05) |
| Pipeline revenue / forecasting as Product analytics | **NOT COVERED** / historically out of C1 scope; domain J **later** |
| Source attribution (SEO/ads/LinkedIn → opportunity) | **NOT COVERED** |
| Website / SEO / Google Ads / LinkedIn programmes | **NOT COVERED** (not an EOS grant) |
| Production CRM/MICE operation | **NOT COVERED** (Production **NOT APPROVED**) |
| Live commercial data census / current win rate / RFP volume | **UNKNOWN** |
| Path B Lineage / QualityRule catalogues | **NOT COVERED** as this commercial problem; HOLD; do **not** select |
| Gate A/B persist | **ALREADY COVERED** as Dev/Test persist design/implementation; **not** a commercial objective |

Principle: if the Owner’s problem is “we do not have a CRM/RFP system in EOS Dev/Test,” that is **false**. If the problem is “we do not run commercial work on EOS in Production with measured outcomes,” that is a **different** Stage 1 problem (operating/adoption/Production governance), not C11+ by default.

---

## 8. Stage 1 definitions

Shared for every candidate unless a row overrides:

**P. Implementation boundary:** Stage 1 definition **does not** authorize implementation.  
**Q. UAT boundary:** UAT only if **separately** granted later; Dev/Test vs Production UAT remain distinct; **not executed** here.  
**R. Production boundary:** Production remains a **separate** E1/DP-0006 decision. **NOT AUTHORIZED.**  
**O. Owner:** **SEDMC Owner**. No named individual is established in the repository as Owner of **this new** commercial Stage 1. HUM-CAP-01 recorded Patrick Makundi for that **assessment only** — not reused here as a fabricated commercial-programme Owner.

Do **not** invent baseline metric values.

### 8.1 Candidate 1 — Commercial lead generation (Stage 1 draft)

| Element | Definition |
| --- | --- |
| **A Problem** | B2B opportunities may be generated and handled outside a single measurable capture-to-qualification path. **Whether that is current SEDMC practice is UNKNOWN.** |
| **B Objective** | A measurable process for generating, capturing, qualifying, and tracking B2B opportunities through to RFP/opportunity records **using existing C1–C3 where they already cover the record types**. |
| **C Users** | Commercial / sales / DMC coordinators; Owner; (future) any named BD role the Owner confirms. |
| **D Current process** | **UNKNOWN** as live operations. Product path exists: Organization/Contact → Opportunity (C2) → RFP (C3). |
| **E Pain** | **UNKNOWN** until Owner confirms (e.g. lost enquiries, untracked sources, delayed qualification). |
| **F Consequence** | **UNKNOWN** (no repository baselines). |
| **G Desired outcome** | Qualified opportunities are captured with source, owner, and status; conversion can be counted. |
| **H Success metrics** (indicators only) | Qualified opportunities; RFP volume; source attribution completeness; response time; conversion — **baselines not in repo**. |
| **I Scope** | Business rules for capture/qualification/tracking; use of existing EOS records; measurement definitions. |
| **J Exclusions** | New parallel CRM; SEO/ads/LinkedIn implementation; Production; Path B leftover nouns; E1-D; rebuilding C1–C10; C11+ unless later named. |
| **K Dependencies** | Existing C1–C3; commercial data (**UNKNOWN**); people/process; legal/privacy if personal data of buyers; Production **if** live use is intended (separate). Website **only if** Owner later names digital capture. |
| **L Risks** | Rebuilding existing modules; treating marketing channels as EOS features; Production-by-implication. |
| **M Evidence required** | Owner confirmation of current capture process; whether problem is process vs product vs Production; first market/buyer; baselines or explicit “no baseline / start counting”. |
| **N Acceptance (Stage 1)** | Named problem, objective, scope, exclusions, metrics **types**, evidence gaps closed or explicitly deferred by Owner; **implementation still not granted**. |

### 8.2 Candidate 2 — MICE market development (Stage 1 draft)

| Element | Definition |
| --- | --- |
| **A Problem** | Priority MICE markets and buyer relationships may not be developed systematically. **Coverage vs target list is UNKNOWN.** |
| **B Objective** | Systematic development of **Owner-named** priority market(s) and buyer categories, tracked on accounts/opportunities. |
| **C Users** | Commercial team; Owner. |
| **D Current process** | **UNKNOWN**. C1 account/contact and C2 opportunity exist Dev/Test. |
| **E Pain** | **UNKNOWN** (e.g. South Africa named as market without a governed coverage plan — **assumption** unless Owner confirms). |
| **F Consequence** | **UNKNOWN**. |
| **G Desired outcome** | Named market/buyer coverage with follow-up and opportunity tracking. |
| **H Success metrics** | Account coverage; follow-up completion; qualified opportunities; win rate — **no baselines**. |
| **I Scope** | One (or Owner-named few) source market and buyer set; operating cadence; tracking on **existing** C1–C2. |
| **J Exclusions** | Selecting all markets at once; paid media/SEO; Production; facility/provider; Path B; new CRM. |
| **K Dependencies** | C1–C2; people; legal/privacy for international contacts; E1-C **not required** for a Dev/Test process definition, **required** if Production live personal data. |
| **L Risks** | Equating company-position market list with a campaign grant; PII processing in Production without E1. |
| **M Evidence required** | Which market is first; current coverage; owners; what “penetration” means without invented percentages. |
| **N Acceptance (Stage 1)** | Named market/buyer, exclusions, use of existing records, evidence gaps closed or deferred. |

### 8.3 Candidate 3 — Digital demand generation (Stage 1 draft)

| Element | Definition |
| --- | --- |
| **A Problem** | Inbound digital demand may be unmeasured or disconnected from EOS opportunity/RFP records. **Website/SEO/ads performance: UNKNOWN / not an EOS grant.** |
| **B Objective** | Measurable inbound commercial demand **if** the Owner later names channels; conversion into enquiry/RFP. |
| **C Users** | Marketing/commercial (roles **UNKNOWN** if not named). |
| **D Current process** | **UNKNOWN**. No authorized SEO/ads/LinkedIn workstream. |
| **E Pain** | **UNKNOWN**. |
| **F Consequence** | **UNKNOWN**. |
| **G Desired outcome** | Countable inbound enquiries attributable to named channels, captured into existing RFP/opportunity records. |
| **H Success metrics** | Enquiry/RFP volume by source; conversion — **no baselines**. |
| **I Scope** | Business definition of inbound demand and capture; **not** channel implementation in this Stage 1 draft. |
| **J Exclusions** | Modifying website; launching Google Ads; LinkedIn automation; Production; EOS schema work unless later separately granted. |
| **K Dependencies** | External platforms; website (not an EOS grant); legal/privacy (tracking/consent); C2–C3 for capture. |
| **L Risks** | Starting with ads/SEO tech; treating this repo as a marketing-ops codebase without a grant. |
| **M Evidence required** | Current digital properties; whether demand is actually the constraint vs capture; consent/legal. |
| **N Acceptance (Stage 1)** | Named channels **or** explicit deferral of channels; capture into existing EOS; no implementation. |

### 8.4 Candidate 4 — Pipeline / CRM effectiveness (Stage 1 draft)

| Element | Definition |
| --- | --- |
| **A Problem** | Commercial control over contacts, opportunities, RFPs, proposals and conversion may be incomplete **in operations**, despite Dev/Test product coverage. |
| **B Objective** | Improve **visibility and control** using **existing** C1–C8, with measurement of follow-up and conversion. |
| **C Users** | Commercial users of EOS; Owner. |
| **D Current process** | Product workflow: Relationship → Opportunity → RFP → … → Proposal (roadmap). **Live use: UNKNOWN.** |
| **E Pain** | **UNKNOWN** (possible: unused system, incomplete data, no reporting). |
| **F Consequence** | **UNKNOWN**. |
| **G Desired outcome** | Pipeline states are complete enough to manage follow-up and conversion without a second CRM. |
| **H Success metrics** | Follow-up completion; pipeline completeness; win rate; response time — **no baselines**. |
| **I Scope** | Operating rules, data-quality expectations, reporting **definitions**; optional later analytics increment **only if** Owner names it after Stage 1 (not C11+ auto-create). |
| **J Exclusions** | Rebuilding C1–C10; Lineage/QualityRule; E1-D; Production-by-default. |
| **K Dependencies** | Existing C1–C10; data; people; Production if live SoR required (separate). |
| **L Risks** | “CRM effectiveness” used to authorize a new module that duplicates C1–C2. |
| **M Evidence required** | Whether users use EOS today; data-quality examples; which lifecycle stage fails. |
| **N Acceptance (Stage 1)** | Problem framed as **effectiveness/adoption/measurement**, not new CRM; exclusions include no rebuild. |

### 8.5 Candidate 5 — EOS commercial operating capability (Stage 1 draft)

| Element | Definition |
| --- | --- |
| **A Problem** | LA-01 states EOS is intended as the internal commercial platform. A **broader new capability** is **not** evidenced as missing in Dev/Test (C1–C10 exist). The residual problem, if any, is **operating, measuring, and (separately) Production-governing** that platform. |
| **B Objective** | If selected: treat EOS as the commercial operating system **for named processes**, not a feature factory. |
| **C Users** | SEDMC commercial/operations as Owner names. |
| **D Current process** | Dev/Test spine exists. Production **not** the SoR. |
| **E Pain** | Dual running (EOS vs spreadsheets/email) — **ASSUMPTION** unless Owner confirms. |
| **F Consequence** | **UNKNOWN**. |
| **G Desired outcome** | Named commercial processes run on EOS with ownership and conversion visibility. |
| **H Success metrics** | Process completeness; ownership; conversion indicators — **no baselines**. |
| **I Scope** | Operating model over **existing** modules; gap list only for **NOT COVERED** items (e.g. analytics later). |
| **J Exclusions** | Parallel platform; Path B leftover nouns; Production approval; procurement; E1-C resume by implication. |
| **K Dependencies** | C1–C10; people; legal/privacy; E1/DP-0006 **only** for Production. |
| **L Risks** | Re-scoping C1–C10 as “new”; converting intent (LA-01) into implementation authorization. |
| **M Evidence required** | Confirmation that the need is operating/adoption, not missing modules; named processes in/out. |
| **N Acceptance (Stage 1)** | Explicit **ALREADY COVERED** list; only true gaps remain; implementation still not granted. |

---

## 9. Evidence gaps

Before **Stage 1 approval** (still not implementation), the Owner/business should confirm:

1. Which candidate (or amendment/deferral) is selected.  
2. The actual current commercial process (where RFPs/leads live today).  
3. Whether the constraint is **demand**, **capture**, **qualification**, **follow-up**, **conversion**, **Production use**, or **something else**.  
4. First market and buyer set (if Candidate 2).  
5. Metric **types** plus either baselines or “count from zero.”  
6. Named Owner for this objective.  
7. Confirmation **not** to rebuild C1–C10.  
8. Whether digital channels are in or out (Candidate 3).  
9. That E1-D remains parked; E1-C paused; Path B HOLD unless separately reopened.  
10. Legal/privacy implication if live personal data of international buyers is processed in Production (does **not** resume E1-C by this file).

---

## 10. Dependencies

| Dependency | Relation to a commercial Stage 1 |
| --- | --- |
| Existing C1–C10 / CD Phase 1 | **Reuse**; do not reopen as new build |
| Commercial data | **UNKNOWN** live; Production CRM **NOT APPROVED** |
| Website / SEO / ads / LinkedIn | **Not authorized**; Candidate 3 only if Owner names them later |
| People / ownership | Required for any operating objective |
| Legal/privacy / DPO | Combined Legal/DPO **incomplete**; Production personal data **not** authorized here |
| Production infrastructure / E1-C / NA-A-22 | **Not** required to **define** Stage 1; **required** before Production commercial SoR |
| E1-D / Path B leftover nouns / Gate C remainder | **Out of scope**; do not reopen |
| GPTA-H-02 commit | Separate; dirty tree **not** this objective |

---

## 11. Risks

* Authorizing implementation from this definition file.  
* Rebuilding ALREADY COVERED CRM/RFP modules.  
* Treating company-position markets as a campaign grant.  
* Starting with Google Ads/SEO/schema.  
* Using commercial growth to reopen E1-D, E1-C, or Path B.  
* Implying Production SoR.  
* Inventing KPIs.

---

## 12. Explicit exclusions (this package)

Does **not** authorize or perform: application/SQL/schema/API/website/SEO/ads/LinkedIn/CRM code; integrations; deploy; UAT; commit; push; staging; working-tree mutation; E1-D reopen; E1-C resume; GPTA-H-01 reopen; LINEAGE_REGISTER / QUALITY_RULE_REGISTER selection; E1-B send; supplier/validator contact; procurement; Production provider selection; Production activity; C11+ creation; NA-A-23.

---

## 13. Owner decision package

**Unranked candidates remain 1–5.** This file does **not** choose.

The Owner may record **exactly one** of:

`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE`

followed by a **named** objective (Candidate 1, 2, 3, 4, 5, or an Owner-amended name), **or**

`OWNER DECISION = MAINTAIN CONTROLLED PAUSE`

Optional companion lines if later used (not granted here): named exclusions; “Stage 1 freeze **not** implied”; “implementation **NOT GRANTED**.”

`ESTABLISH COMMERCIAL OBJECTIVE` **without** a name is **incomplete**.  
Selecting a name **without** Stage 1 freeze/approval **does not** authorize implementation.

---

## 14. Next governance sequence

**Do not execute steps 2–12 in this task.**

1. GPTA-H-07 commercial objective definition (**this file**).  
2. Owner selects / amends / defers objective.  
3. Stage 1 objective freeze.  
4. Stage 1 approval.  
5. Implementation scope definition.  
6. Separate implementation authorization.  
7. Dev/Test implementation.  
8. Verification.  
9. UAT (**separate** grant).  
10. Separate commit authorization.  
11. Separate push authorization.  
12. Later Production decision under E1/DP-0006.

---

## 15. Authorization boundary

**Unauthorized:** implementation; Stage 1 approval (this is a **draft package**); C11+; SEO/website/ads/LinkedIn; CRM code changes; UAT; commit; push; E1-D; E1-C; Path B; RFI send; procurement; Production; schema/migrations/infrastructure.

Standing Dev/Test preview remains available and is **not** this commercial increment.

---

## 16. Final status

Five **unranked** Stage 1 **candidate drafts** exist. None is approved. None is an implementation grant. Existing EOS commercial spine is **ALREADY COVERED** in Dev/Test for core CRM–RFP–booking records; residual problems, if confirmed by the Owner, are operating/measurement/demand/Production-use — not a silent rebuild.

`GPTA-H-07 STATUS = COMMERCIAL OBJECTIVE CANDIDATE READY FOR OWNER SELECTION`
