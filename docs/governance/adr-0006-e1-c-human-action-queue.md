# E1-C — Human Action Queue

> **`INTERNAL WORKFLOW SEQUENCING ONLY`**  
> **`NO NUMERICAL SCORES`** · **`NO RANKING OF PROVIDERS OR EXTERNAL ENTITIES`**  
> **`ADDITIVE 2026-09-17: SEE END — E1-B TRANSMISSION PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`ADDITIVE 2026-09-17: SEE END — CD-01 CLOSED; DPO OWNER-DESIGNATED; SENDER CONFIRMED; NOT YET TRANSMITTED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`E1-B = 9 / 2 / 1 ; 0 TRANSMISSIONS`**

**Date:** 2026-09-17.  
**Matrix:** [`adr-0006-e1-c-human-decision-evidence-closure-matrix.md`](adr-0006-e1-c-human-decision-evidence-closure-matrix.md).  
**Pack:** [`adr-0006-e1-c-human-evidence-request-pack.md`](adr-0006-e1-c-human-evidence-request-pack.md).

Buckets are **sequencing**, not political ranking. **URGENT / MULTI-GATE IMPACT** means the item feeds several later gates and can proceed **without** a provider reply.

---

## URGENT / MULTI-GATE IMPACT

| Action | Required input | Evidence/decision owner | Downstream gates affected | Current status | Next action |
| --- | --- | --- | --- | --- | --- |
| Supply legal-entity extract (HUM-01) | Registry artefact for **Makundi Serengeti Experience DMC** | Company officer / corporate secretary — **OWNER NOT ESTABLISHED**. Legal Counsel may review | Contracting identity; notice entity; Production identity | NOT VERIFIED | Company locates extract; do not invent number |
| Supply PDPC status artefact (HUM-02) | Company-specific PDPC evidence or documented status | Company + Legal Counsel (**THOMAS NGULUMA**). DPO once established | Legal/privacy closure; Combined privacy evidence | NOT VERIFIED | File search / regulator artefact; do not infer from absence |
| Record DPO appointment **or** non-appointment (HUM-03) | Appointment instrument or written non-appointment | Company appointment authority — **OWNER NOT ESTABLISHED**. **DPO NOT ESTABLISHED**. Do **not** use Thomas Nguluma as DPO | Combined Legal/DPO; Production privacy; E1 close | DPO NOT ESTABLISHED | Company records appointment or non-appointment |
| Geography census (HUM-04) | Data-subject facts distinct from target market / destinations | Commercial/ops + Legal Counsel — ops named owner **OWNER NOT ESTABLISHED** | Applicable-law; transfer conclusions | DRAFT | Census from internal records |
| Decide governing BCM sequence (HUM-07 / CD-01) | S1 vs S2 vs new dated sequence | Owner / BCM authority — **OWNER NOT ESTABLISHED** | Recovery design; RACI packaging; recovery tests | OPEN / DECISION REQUIRED | Human decision record; do not infer from Owner pack “CHANGED” |
| Decide whether to execute authorized sends (HUM-11) | Send vs not-yet; artefacts if sent | Reservations Consultant (role). Personal name **OWNER NOT ESTABLISHED** | Existence of provider responses; E1-B3 intake; Class C | PACKAGE READY / NOT SENT; 0 transmissions | Human send per checklist **or** record hold; Cursor does not send |

---

## HIGH

| Action | Required input | Evidence/decision owner | Downstream gates affected | Current status | Next action |
| --- | --- | --- | --- | --- | --- |
| Current corporate IdP fact (HUM-05) | Entra / Google Workspace / none / other **today** | Company IT — **OWNER NOT ESTABLISHED** | ADR-0013; security architecture | UNKNOWN | IT inventory; Dev IdP is not Production |
| Paper Production ops RACI (HUM-08) | Restore / backup / on-call roles | Company — **OWNER NOT ESTABLISHED** | Operational readiness; Production authorization | TBD | Assign roles; do not use RFI sender as Production ops |
| Assign notice / IR owner title (HUM-12 ownership only) | Role title | Company; Legal Counsel for text. Owner named person **OWNER NOT ESTABLISHED** | Publication/go-live later | DRAFT | Assign owner; **do not publish** complete notice |
| Harvest existing contracts (GAP-LEG-05 existing paper) | Actual agreements on file | Legal / company — **OWNER NOT ESTABLISHED** | Existing-processor picture; **not** vendor selection | Absent in repo | Collect files; no invented DPA |

---

## MEDIUM

| Action | Required input | Evidence/decision owner | Downstream gates affected | Current status | Next action |
| --- | --- | --- | --- | --- | --- |
| Identify whether later contracting needs a named instrument (HUM-14) | Process fact; leave names blank if unknown | Board / company officer — **OWNER NOT ESTABLISHED** | Contracting only | BLANK | Do not fabricate signatory; Counsel is not default MSA signatory |
| Optional budget **envelope** if one already exists (HUM-09) | Amount/currency/period **only if real** | Finance / Owner — **OWNER NOT ESTABLISHED** | Cost-acceptance later | NO APPROVED NUMBER | Do **not** invent a figure; quotes can still be received |

---

## WAIT FOR PROVIDER EVIDENCE

Do **not** execute as decisions now.

| Action | Required input | Evidence/decision owner | Downstream gates affected | Current status | Next action |
| --- | --- | --- | --- | --- | --- |
| Production jurisdiction (HUM-10) | PE-03 / actual regions **then** Owner+Legal decision | Owner + Legal Counsel — Owner named **OWNER NOT ESTABLISHED** | ADR-0006; DP-0006; Production infra | UNSELECTED; Tanzania preference only | Wait provider regions |
| Backup jurisdiction (HUM-10) | PE-06 then decision | Owner + Legal Counsel | Backup architecture; transfers | UNSELECTED | Wait PE-06 |
| DR jurisdiction (HUM-10) | PE-07 then decision | Owner + Legal Counsel | Failover; Restricted+; recovery validation | UNSELECTED | Wait PE-07 |
| KMS/secrets **product** (HUM-06) | Hosting evidence + KMS offering | IT + Owner — **OWNER NOT ESTABLISHED** | ADR-0012; UAT/Production secrets | proposed — blocked | Wait; keep Dev secrets out of git |
| Production IdP **hosting** if hosted (HUM-05 remaining) | Identity processing location | Company IT + later architecture | ADR-0013 Production | UNKNOWN | Inventory now; hosting later |
| TCO / cost-acceptance (HUM-09 remaining) | Quotes | Finance / Owner | Commercial decision | NO APPROVED NUMBER | Wait quotes |
| Adopt PITR as Production control (HUM-15) | WAL/PITR capability | Owner + IT — **OWNER NOT ESTABLISHED** | Backup architecture; zero-loss envelope | CANDIDATE | Wait; do not claim RPO=0 |
| ADR-0006 / DP-0006 / E1 approval (HUM-13) | Full evidence pack | Owner — **OWNER NOT ESTABLISHED** | Production / UAT hosting finalization | NOT RECORDED | Do not approve now |
| Technical RTO/RPO acceptance | Measured tests labelled Dev/Test or Production | Owner after tests | GAP-REC-02 (Class E) | Unmeasured in Production | Do not invent measurements |

---

## Not in this queue (out of sprint)

- Select provider or architecture  
- Approve Production, UAT, migration, or deployment  
- Provision infrastructure  
- Contact providers from Cursor  
- Implement Production security code  
- Close CD-01 without an authorized human decision  

---

## Additive — 2026-09-17 owner decision (not a rewrite of queue tables)

Instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md).

| Queue item | Current status |
| --- | --- |
| HUM-07 / CD-01 BCM sequence | **CLOSED / FORMALLY CONFIRMED** — S2; Patrick Makundi; PDM |
| HUM-03 company DPO decision | **CLOSED / FORMALLY CONFIRMED** — Wensley Shirima designated. Appointment evidence **REQUIRED** |
| HUM-11 send vs hold | **SEND CONFIRMED**. Named sender **Patrick Makundi**. Actual send **NOT YET COMPLETED** |
| HUM-01, HUM-02, HUM-04 | Still outstanding |
| HUM-09 | **TCO-FIRST / BUDGET NOT YET FIXED** |
| HUM-08 other names | **NOT ESTABLISHED** except Privacy/DPO |

CD-01 is **no longer** waiting on a sequence choice. The “out of sprint” bullet forbidding close-without-decision remains historically correct; the authorized human decision **now exists**. Cursor still must **not** send RFI.

---

## Additive — 2026-09-17 SEDMC-owned infrastructure direction (HUM-11 current execution)

Direction: [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md).

HUM-11 **SEND CONFIRMED** remains a **historical** owner decision. **Current execution of that send is PAUSED.** Do **not** treat “SEND CONFIRMED” as the current next action. External provider contact requires a **new explicit owner decision**.

| Queue item | Current status |
| --- | --- |
| HUM-11 send vs hold | **SEND was confirmed; CURRENT TRANSMISSION = PAUSED / SUPERSEDED AS NEXT ACTION**. **0 transmissions** |
| Facility / hardware / procurement | **NOT SELECTED / NOT AUTHORIZED** |
| HUM-01, HUM-02, HUM-04, HUM-09 | Still outstanding (entity, PDPC, geography census, TCO/budget) |

**Current next action:** SEDMC-owned infrastructure requirements and local Dev/Test.  
