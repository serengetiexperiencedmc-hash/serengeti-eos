# E1 — Formal Owner Decision Record (Patrick Makundi)

> **`FORMAL OWNER DECISION RECORDED`**  
> **`DECISION AUTHORITY = PATRICK MAKUNDI, OWNER`**  
> **`SIGNATURE NOTATION = PDM`**  
> **`NOT A WET-INK SIGNATURE IMAGE`**  
> **`E1 = NOT APPROVED / BLOCKED`** · **`E1-D = OPEN`**  
> **`PRODUCTION / UAT / MIGRATION / DEPLOYMENT = NOT AUTHORIZED`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO PRODUCTION GEOGRAPHY SELECTED`**  
> **`TECHNICAL RTO/RPO = NOT DEMONSTRATED`**  
> **`ADDITIVE 2026-09-17: E1-B TRANSMISSION PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`RFI = AUTHORIZED TO SEND / NOT YET TRANSMITTED`**  · **`CURRENT EXECUTION = PAUSED`**  
> **`DPO = OWNER-DESIGNATED; FORMAL APPOINTMENT EVIDENCE REQUIRED`**  
> **`PDPC = NOT ESTABLISHED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**

**Decision date:** 2026-09-17.  
**HEAD at recording:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` on `master`.  
**This file does not send RFI, appoint by fabricating an instrument, or approve Production.**

Companions:

| Artefact | Path |
| --- | --- |
| DPO owner designation | [`adr-0006-e1-c-dpo-owner-designation-record.md`](adr-0006-e1-c-dpo-owner-designation-record.md) |
| RFI transmission preparation | [`adr-0006-e1-b-owner-authorized-rfi-transmission-preparation.md`](adr-0006-e1-b-owner-authorized-rfi-transmission-preparation.md) |

---

## 1. Decision authority

| Field | Value |
| --- | --- |
| Name | **Patrick Makundi** |
| Company role | **Owner**, Serengeti Experience DMC / Makundi Serengeti Experience DMC |
| Signature notation | **PDM** |
| Wet-ink signature image | **NOT FABRICATED** |
| Decision date | **2026-09-17** (actual date of this owner decision) |

This record is the **formal company-owner instrument** for the decisions listed below. It supersedes **provisional** directions on those same points. It does **not** rewrite historical records that correctly described earlier OPEN / provisional status.

---

## 2. BCM / recovery order (HUM-07 / CD-01)

**FORMALLY CONFIRMED** governing sequence (**S2**):

`Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers`

Numbered:

1. Commercial  
2. Programme Building  
3. Operations  
4. CRM  
5. Finance  
6. Procurement/Suppliers  

| Field | Status |
| --- | --- |
| CD-01 | **CLOSED / FORMALLY CONFIRMED** |
| HUM-07 | **CLOSED / FORMALLY CONFIRMED** |
| Decision | **S2** |
| Decision authority | Patrick Makundi, Owner |
| Signature notation | **PDM** |
| S1 | **Preserved as the alternative previously considered. Not selected.** |
| Technical RTO/RPO | **NOT DEMONSTRATED.** This is a **business continuity / recovery priority** decision only. |

S1 remains:

`Commercial → Finance → Operations → CRM → Procurement/Suppliers`

Do **not** describe S1 as selected. Do **not** claim recovery objectives have been tested or achieved.

Prior provisional S2 direction: [`adr-0006-e1-c-provisional-bcm-direction-record.md`](adr-0006-e1-c-provisional-bcm-direction-record.md) — now points here.

---

## 3. DPO designation (HUM-03 company-decision component)

**FORMALLY CONFIRMED** owner designation:

| Field | Value |
| --- | --- |
| DPO designated | **Wensley Shirima** |
| Position | **IT Manager** |
| Function | **Data Protection Officer (DPO)** |
| Designating authority | Patrick Makundi, Owner |
| Signature notation | **PDM** |
| Effective date | **2026-09-17** |
| OWNER DESIGNATION | **CONFIRMED** |
| HUM-03 company decision component | **CLOSED / FORMALLY CONFIRMED** |
| FORMAL APPOINTMENT EVIDENCE | **REQUIRED / TO BE RECORDED** |
| Formal appointment instrument | **REQUIRED** (not fabricated in this record) |
| PDPC registration/status | **NOT ESTABLISHED** |
| DPO independence assessment | **NOT FABRICATED** |
| DPO contact details beyond name/role | **NOT PROVIDED — NOT INVENTED** |

**Thomas Nguluma** remains **Legal Counsel** and is **NOT DPO**.

Combined Legal/DPO remains **INCOMPLETE** until appointment evidence (and outstanding statutory items including PDPC / entity extract as applicable) exist.

Detail: [`adr-0006-e1-c-dpo-owner-designation-record.md`](adr-0006-e1-c-dpo-owner-designation-record.md).

---

## 4. RFI sender and SEND decision (HUM-11)

**FORMALLY CONFIRMED:**

| Field | Value |
| --- | --- |
| Named sender | **Patrick Makundi** |
| Role | **Owner** |
| Authority | Authorized by company owner |
| Mailbox | `rfp@serengetiexperiencedmc.com` |
| Decision | **SEND** the authorized E1-B RFI package |
| HUM-11 named sender | **CLOSED / FORMALLY CONFIRMED** |
| HUM-11 RFI decision | **SEND** |
| Actual transmission | **NOT YET COMPLETED** |
| Named recipient people | **NOT ESTABLISHED** |
| Package | **READY** |
| Transmissions | **0** |

The mailbox remains a **role mailbox**. It is **not** itself a named person. Patrick Makundi is the named sender authorized to use it.

### Scope (unchanged routing)

**9 FULL-RFI**

1. Africa Data Centres (CU-01)  
2. Amazon Web Services (CU-02)  
3. Google Cloud (CU-03)  
4. Hetzner (CU-04)  
5. Microsoft Azure (CU-06)  
6. Oracle Cloud Infrastructure (CU-07)  
7. OVHcloud (CU-08)  
8. Raxio Group (CU-09)  
9. Wingu Africa (CU-12)  

**2 SCOPE CLARIFICATION** (E1-B4.6 questions only; **not** the four-document pack)

10. SEACOM Limited (CU-10)  
11. WIA (CU-11)  

**1 HOLD** (receives **nothing**)

12. Liquid C2 (CU-05)  

**Purpose:** information gathering and market evidence only.

The RFI does **not** constitute provider selection, architecture selection, contracting, Production approval, or deployment authorization.

**Required transmittal sentence (unchanged):**

> RFI/RFQ issuance is an information-gathering and market-evidence activity only; responses will be subject to a separate governed evaluation and do not constitute provider or architecture selection, contracting, Production approval, or deployment authorization.

Official verified provider routes remain authoritative. Named individual recipients remain **NOT ESTABLISHED**. A generic sales mailbox or form is **not** a named person.

This decision **authorizes** send. This file **does not transmit**.

---

## 5. Budget / TCO (HUM-09)

**COMPANY DECISION: TCO-FIRST / BUDGET NOT YET FIXED**

- No fixed Production infrastructure budget is established at this stage.  
- Provider RFI/TCO evidence must be collected before a final budget envelope is established.  
- **No dollar amount is recorded.**

HUM-09: Production budget **NOT FIXED**; TCO-first decision **confirmed**.

---

## 6. Production hosting, architecture, geography, PITR

| Item | Status |
| --- | --- |
| Production provider | **NONE SELECTED** |
| Production geography | **NONE SELECTED** |
| Production architecture | **NONE SELECTED** |
| ADR-0006 | **OPEN** (not approved by this decision) |
| DP-0006 | **OPEN — NOT APPROVED** |
| E1 | **NOT APPROVED / BLOCKED** |
| E1-D | **OPEN** |
| UAT | **NOT APPROVED** |
| Migration / deployment | **NOT AUTHORIZED** |
| HUM-10 jurisdictions | **OPEN** (provider-dependent) |
| HUM-15 PITR/WAL | **OPEN / PROVIDER- AND ARCHITECTURE-DEPENDENT** — candidate only; not selected as Production architecture |
| Technical RTO/RPO | **NOT DEMONSTRATED** |

---

## 7. Human evidence still outstanding

| ID | Status after this owner decision |
| --- | --- |
| HUM-01 entity extract | **NOT PROVIDED / EVIDENCE REQUIRED** |
| HUM-02 PDPC | **NOT ESTABLISHED / EXTERNAL EVIDENCE REQUIRED** |
| HUM-03 designation | **CLOSED / OWNER-CONFIRMED** (Wensley Shirima, IT Manager, DPO) |
| HUM-03 appointment evidence | **REQUIRED / TO BE RECORDED** |
| HUM-04 geography census | **NOT ESTABLISHED** |
| HUM-05 current corporate IdP | **NOT ESTABLISHED** |
| HUM-07 BCM | **CLOSED / FORMALLY CONFIRMED** (S2; Patrick Makundi; PDM) |
| HUM-08 named RACI | Privacy/DPO = **Wensley Shirima**. **Other personnel = NOT ESTABLISHED** |
| HUM-09 budget | **NOT FIXED** · TCO-first **confirmed** |
| HUM-10 jurisdictions | **OPEN** |
| HUM-11 named sender | **CLOSED / FORMALLY CONFIRMED** (Patrick Makundi) |
| HUM-11 transmission | **NOT YET COMPLETED** |
| HUM-11 named recipients | **NOT ESTABLISHED** |
| HUM-12 privacy owner | **Wensley Shirima** (DPO function). Incident-response ownership **NOT YET NAMED**. Privacy-notice ownership = **DPO function** unless another owner is later designated |
| HUM-13 ADR/DP/E1 | **NOT RECORDED** as approved |
| HUM-14 signatory process | **NOT ESTABLISHED**. RFI authorization **is not** MSA/DPA signing authority |
| HUM-15 PITR | **OPEN / PROVIDER- AND ARCHITECTURE-DEPENDENT** |

---

## 8. Explicit limitations

This owner decision:

- **does not** approve E1, E1-D, ADR-0006, DP-0006, Production, UAT, deployment, or migration;  
- **does not** select a provider, architecture, or Production geography;  
- **does not** demonstrate technical RTO/RPO;  
- **does not** transmit the RFI;  
- **does not** fabricate PDPC registration, entity extract, appointment letter, regulator filing, DPO independence assessment, or extra personnel;  
- **does not** convert Thomas Nguluma to DPO;  
- **does not** treat Combined Legal/DPO as complete;  
- **does not** modify frozen E1-B questionnaire, PE pack, or response template;  
- **does not** implement application code or migrations;  
- **does not** commit or push.

---

## 9. Contradiction audit (this recording session)

Search target: current statements that would incorrectly say CD-01 is still merely provisional; S2 is not selected; DPO is not designated; Thomas Nguluma is DPO; Wensley Shirima is not DPO; RFI sender is unknown; RFI is unauthorized; RFI was already sent; provider selected; Production geography selected; Production approved; technical RTO/RPO achieved.

| ID | Location | Issue | Class | Treatment |
| --- | --- | --- | --- | --- |
| CX-01 | `adr-0006-e1-c-provisional-bcm-direction-record.md` opening banners | CD-01 not closed / S2 provisional | **CURRENT** | Additive current-status section pointing here |
| CX-02 | `adr-0006-e1-c-bcm-sequence-decision-record.md` §§11–14 | OPEN / DECISION REQUIRED; provisional S2 | **CURRENT** (body historical + prior additive) | Additive §15 formal confirmation; historical §§ retained |
| CX-03 | `adr-0006-e1-c-provisional-dpo-direction-record.md` | DPO NOT ESTABLISHED; proposed direction only | **CURRENT** | Additive current-status: owner-designated Wensley Shirima; appointment evidence still required |
| CX-04 | `adr-0006-e1-b-provisional-issuance-direction-record.md` | Named sender NOT ESTABLISHED | **CURRENT** | Additive: Patrick Makundi; SEND; not yet transmitted |
| CX-05 | Capture form / human-closure pack, form, agenda, checklist | Live session artefacts still OPEN / NOT ESTABLISHED | **CURRENT** | Additive current-status; do not rewrite preparation snapshots as if they never existed |
| CX-06 | Next-action + parallel-work opening banners / last additive rows | CD-01 OPEN; DPO NOT ESTABLISHED; sender unknown | **CURRENT** | New additive 2026-09-17 owner-decision sections |
| CX-07 | Interim RACI Privacy named person NOT ESTABLISHED | Now designated | **CURRENT** | Update Privacy row; other names remain NOT ESTABLISHED |
| CX-08 | Sender readiness `NAMED SENDER NOT ESTABLISHED` | Now confirmed | **CURRENT** | Additive current-status |
| CX-09 | Human evidence required register / action queue / HR register | HUM-03/07/11/CD-01 still OPEN in live tables | **CURRENT** | Additive current-status sections; historical table rows retained |
| CX-10 | E1-C01 Legal Counsel packs; frozen E1-B headers; Class A/B implementation records; consistency audit | DPO NOT ESTABLISHED / CD-01 OPEN **as of those artefacts** | **HISTORICAL** | **Retain.** Do not rewrite. Combined Legal/DPO still incomplete for appointment evidence + PDPC |
| CX-11 | Frozen E1-B Reservations Consultant sender role | Historical intended operational sender for preparation | **HISTORICAL** | **Retain** in frozen materials. Live sender is now Patrick Makundi |
| CX-12 | Architecture-evidence workplan §1 S2 as recovery-order baseline | Previously risked looking selected before CD-01 closed | **NON-MATERIAL** now that Owner confirmed S2; workplan remains **DRAFT — NOT AN APPROVAL** for Production | No rewrite |
| CX-13 | Any claim Thomas Nguluma is DPO | None found as a current assertion | **NON-MATERIAL** | Continue Legal Counsel only |
| CX-14 | Any claim RFI already sent / provider selected / Production approved / RTO achieved | None found as current live claims | **NON-MATERIAL** | Preserve 0 transmissions; UNSELECTED; NOT DEMONSTRATED |

No current record is authorized to claim Production approval or completed transmission.

---

## 10. Next governed action

**Preparation for the actual authorized RFI transmission** by named sender **Patrick Makundi** via `rfp@serengetiexperiencedmc.com`, using frozen E1-B materials and verified official routes, **9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD**.

This recording session **does not transmit**.

---

## 11. Additive — 2026-09-17 SEDMC-owned infrastructure direction (does not erase §4 SEND)

Companion: [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md).

Section 4 **SEND** authorization **remains a historical owner decision**. It is **not** treated as never having existed. For **current execution**, provider RFI transmission is **PAUSED / SUPERSEDED AS THE CURRENT NEXT ACTION**.

| Item | Current status |
| --- | --- |
| SEDMC-owned infrastructure | **Preferred current direction** — servers **not** in place |
| Tanzanian facility | **Preferred future location** — **not selected** |
| Hardware / procurement | **Not selected** / **not authorized** |
| Cloud provider | **Not selected** — optional future contingency only |
| E1-B transmissions / responses / receipts | **0 / 0 / 0** |
| External provider contact | **Requires a new explicit owner decision** |
| Production architecture / deployment / migration | **NOT APPROVED / NOT AUTHORIZED** |
| Technical RTO/RPO | **NOT DEMONSTRATED** |

**Current next action is not** preparation for RFI transmission. **Current next action:** SEDMC-owned infrastructure requirements and deployment-readiness planning while continuing local Dev/Test.
