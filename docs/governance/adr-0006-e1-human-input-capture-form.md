# E1 — Human Input Capture Form

> **`PREPARATION FORM — ADDITIVE OWNER-DECISION CURRENT STATUS IN SECTION K`**  
> **`NO FACT, NAME, SIGNATURE, NUMBER, APPOINTMENT, BUDGET, OR DECISION INVENTED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`DPO = OWNER-DESIGNATED (WENSLEY SHIRIMA); FORMAL APPOINTMENT EVIDENCE REQUIRED; PDPC NOT ESTABLISHED`**  
> **`CD-01 = CLOSED / FORMALLY CONFIRMED (S2; PATRICK MAKUNDI; PDM)`**  
> **`E1-B = 9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD / 0 TRANSMISSIONS`**  
> **`NAMED SENDER = PATRICK MAKUNDI; SEND CONFIRMED; NOT YET TRANSMITTED`**  
> **`E1 = NOT APPROVED / BLOCKED`**  
> **Sections A–J below retain preparation-time wording except where Section K supersedes live status.**

**Date of form creation:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**How to use:** a competent human completes only fields they can truthfully complete. Leave blanks. Do not treat a completed field as `CLOSED` unless Section J records `VERIFIED` against an artefact.

Status vocabulary for Section J (do **not** use `CLOSED` merely because a field exists):

`NOT ESTABLISHED` · `EVIDENCE PROVIDED` · `DECISION PROVIDED` · `VERIFIED` · `REQUIRES EXTERNAL EVIDENCE`

---

## SECTION A — CORPORATE IDENTITY

**HUM-01 / HR-01 / E-01.** Type: **human evidence**.

| Field | Current known value | Human input |
| --- | --- | --- |
| Legal entity name | **Makundi Serengeti Experience DMC** (company-provided; **NOT VERIFIED**) | |
| Registration jurisdiction | **NOT ESTABLISHED** | |
| Registration number | **NOT ESTABLISHED** | |
| Registration certificate/extract reference | **NOT ESTABLISHED** | |
| Registered office | **NOT ESTABLISHED** | |
| Evidence filename/reference | **NOT ESTABLISHED** | |
| Evidence date | **NOT ESTABLISHED** | |
| Source | Company-provided name in E1-B/E-01 registers only. Seed `Serengeti Experience DMC Ltd` is **not** verification | |
| Verification status | **NOT ESTABLISHED** | |

Do not invent a BRELA number. Legal Counsel attestation is **not** a registry extract.

---

## SECTION B — PDPC

**HUM-02 / HR-02 / E-02.** Type: **human evidence** + may be **REQUIRES EXTERNAL EVIDENCE**.

If no PDPC artefact exists, status remains **`NOT ESTABLISHED`**. Absence of a file is **not** proof of unregistered, exempt, or unnecessary.

| Field | Current known value | Human input |
| --- | --- | --- |
| PDPC registration/status | **NOT ESTABLISHED** | |
| Registration/reference number if applicable | **NOT ESTABLISHED** | |
| Certificate/document reference | **NOT ESTABLISHED** | |
| Date | **NOT ESTABLISHED** | |
| Source | Public PDPC process pages ≠ SEDMC status | |
| Verification status | **NOT ESTABLISHED** | |

Do not infer status. Legal Counsel L-01 rule (registration as Production prerequisite **if** required) is **not** a certificate.

---

## SECTION C — DPO

**HUM-03 / HR-03 / E-03.** Type: **human evidence** and **human decision**.

### Established Legal Counsel (not DPO)

| Field | Value |
| --- | --- |
| Name | **THOMAS NGULUMA** |
| Role | **LEGAL COUNSEL only** |
| Date | **15TH SEPTEMBER 2026** |
| Approval | **A.T.N.** |
| DPO? | **NO — do not convert Legal Counsel into DPO** |

### DPO appointment (human completes)

| Field | Current known value | Human input |
| --- | --- | --- |
| DPO appointed? | **NOT YET DECIDED** (repository: **NOT ESTABLISHED**) | YES / NO / NOT YET DECIDED |
| DPO full name if appointed | **NOT ESTABLISHED** | |
| Title | **NOT ESTABLISHED** | |
| Appointment date | **NOT ESTABLISHED** | |
| Appointment instrument/reference | **NOT ESTABLISHED** | |
| Scope | **NOT ESTABLISHED** | |
| Evidence reference | **NOT ESTABLISHED** | |
| Documented non-appointment (if NO) | **NOT ESTABLISHED** | |
| Verification status | **NOT ESTABLISHED** | |

P1 application key `dpo` is **not** an appointment. Combined Legal/DPO remains **INCOMPLETE** until this section is evidenced.

---

## SECTION D — DATA GEOGRAPHY

**HUM-04 / HUM-10.** Type: **human evidence** (census); Production/backup/DR **locations are not selected here**.

Preparatory lists already in the repository (drafts, **not** a census; **not** Production approval):

- Target-market list (company-supplied draft): ZA, Europe, ME, CA, US, LATAM  
- Destination list (company-supplied draft): TZ, KE, RW, UG, Zanzibar, ET, SC, MU  
- Tanzania = **PREFERRED BASELINE ONLY** — **not** an approved Production location

| Field | Current known value | Human input |
| --- | --- | --- |
| Client organization jurisdiction | **NOT ESTABLISHED** as verified census | |
| Individual / data-subject jurisdiction where known | **NOT ESTABLISHED** (draft lists ≠ census) | |
| Processing location | Dev/Test process-local / dual-path PG — **not** Production | |
| Proposed Production location | **UNSELECTED** (preference ≠ proposal unless the human records one) | |
| Backup location | **UNSELECTED** | |
| DR location | **UNSELECTED** | |
| Support location | **UNSELECTED** | |
| Transfer destination | **UNKNOWN** — no mechanism approved | |
| Evidence source | **NOT ESTABLISHED** | |
| Verification status | **NOT ESTABLISHED** | |

Do **not** select Production geography on this form. HUM-10 remains waiting for provider region evidence before **approval**.

---

## SECTION E — CURRENT CORPORATE IDENTITY PROVIDER

**HUM-05.** Type: **human evidence** (current state only). Do **not** choose a future Production IdP.

| Field | Current known value | Human input |
| --- | --- | --- |
| Current corporate IdP | **NOT ESTABLISHED** | |
| Authentication provider | Dev `local-password-dev` is **not** corporate IdP | |
| Ownership | **NOT ESTABLISHED** | |
| MFA status (corporate today) | **NOT ESTABLISHED** (no MFA implemented in EOS Dev/Test as Production MFA) | |
| Administrative ownership | **NOT ESTABLISHED** | |
| Current environment | EOS Dev/Test uses local password IdP | |
| Evidence source | **NOT ESTABLISHED** | |
| Verification status | **NOT ESTABLISHED** | |

---

## SECTION F — BCM SEQUENCE DECISION

**HUM-07 / CD-01.** Type: **human decision**.

**No sequence is selected unless the human decision owner records it.**

**Additive 2026-09-17:** a **provisional** S2 company direction exists ([`adr-0006-e1-c-provisional-bcm-direction-record.md`](adr-0006-e1-c-provisional-bcm-direction-record.md)). It is **not** formal confirmation. Formal HUM-07 confirmation still belongs in the human-input fields below. Do not treat provisional direction as `VERIFIED` or `CLOSED`.

### Existing sequence S1 (do not preselect)

`Commercial → Finance → Operations → CRM → Procurement`

Programme Building is a **dependency** (depends on Finance and Suppliers), not a numbered step.

### Existing sequence S2 (do not preselect)

`Commercial → Programme Building → Operations → CRM → Finance → Procurement`

| Field | Current known value | Human input |
| --- | --- | --- |
| Selected sequence | **NOT ESTABLISHED** — neither S1 nor S2 is preselected | S1 / S2 / new dated sequence (write in full) |
| Decision date | **NOT ESTABLISHED** | |
| Decision owner | Named person **NOT ESTABLISHED** | |
| Rationale | **NOT ESTABLISHED** | |
| Dependencies | Both texts agree Programme Building **depends on** Finance and Suppliers; they **disagree** on recovery **order** | |
| Evidence/reference | Owner pack “CHANGED” does **not** close CD-01 | |
| Verification status | **NOT ESTABLISHED** | |

Do not infer a decision from the architecture-evidence workplan printing S2 as a baseline.

---

## SECTION G — OPERATING OWNERSHIP / RACI

**HUM-08 / HUM-12 (owner title).** Type: **human decision**. Do **not** invent names. The E1-B Reservations Consultant sender role is **not** Production ops.

| Function | Name | Title | Responsibility | Backup | Evidence/reference |
| --- | --- | --- | --- | --- | --- |
| Commercial owner | **NOT ESTABLISHED** | | | | |
| Programme Building owner | **NOT ESTABLISHED** | | | | |
| Finance owner | **NOT ESTABLISHED** | | | | |
| Operations owner | **NOT ESTABLISHED** | | | | |
| CRM owner | **NOT ESTABLISHED** | | | | |
| Procurement/Supplier owner | **NOT ESTABLISHED** | | | | |
| Incident owner | **NOT ESTABLISHED** | | | | |
| Privacy owner | **NOT ESTABLISHED** (DPO **NOT ESTABLISHED**; Counsel is not default privacy owner) | | | | |
| Security owner | **NOT ESTABLISHED** | | | | |
| Recovery owner | **NOT ESTABLISHED** | | | | |

Titles without personal names are acceptable if names are unknown. Completing titles is **not** Production go-live.

---

## SECTION H — RFI SENDER AUTHORITY

**HUM-11 / HR-04.** Type: **human decision** (who executes send) + **human evidence** (named person if the process demands one).

| Field | Current known value | Human input |
| --- | --- | --- |
| Named sender | **NOT ESTABLISHED** | |
| Title | Role recorded: **Reservations Consultant** (not a named person) | |
| Approved email address | **`rfp@serengetiexperiencedmc.com`** — **role mailbox only** | |
| Authorization basis | E1-B **EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY**. Named authorizer identity **not recorded — not fabricated** | |
| Date authorized | Issuance authorization recorded in governance session; personal send-authorization date **NOT ESTABLISHED** | |
| Evidence/reference | [`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md); [`adr-0006-e1-b-rfi-human-sender-readiness.md`](adr-0006-e1-b-rfi-human-sender-readiness.md) | |
| Verification status | Role mailbox **confirmed for preparation**. Named sender **NOT ESTABLISHED** | |

Do **not** convert the role mailbox into a named person.

---

## SECTION I — RFI RECIPIENT

**HR-05 / HUM-11.** Type: **human evidence** for named person; organizational routes already recorded.

**`verified organizational route ≠ named recipient`**

Do not invent recipient names. CU-05 receives **nothing**. CU-10 and CU-11 are **SCOPE CLARIFICATION** only (not full-pack).

| CU | Provider | Set | Organizational route (recorded) | Named recipient person | Recipient title | Email / contact form | Source/reference | Verification date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | FULL-RFI | enquiries@africadatacentres.com (EMAIL, ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | same as route | E1-B6 checklist / routing reconciliation | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-02 | AWS | FULL-RFI | Official Sales Support / Contact Sales **form** (ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | Form — not submitted | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-03 | Google Cloud | FULL-RFI | Official Contact Sales **form** (ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | Form — not submitted | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-04 | Hetzner | FULL-RFI | info@hetzner.com (EMAIL, ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | same as route | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-05 | Liquid C2 | HOLD | **N/A — receives nothing** | **NOT ESTABLISHED** | — | — | HOLD | No transmission |
| CU-06 | Azure | FULL-RFI | Official Contact Sales **form** (ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | Form — not submitted | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-07 | Oracle | FULL-RFI | Official Contact Sales / Sub-Saharan Africa route (ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | Form / official sales route — not submitted | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-08 | OVHcloud | FULL-RFI | Official Dedicated/Cloud Sales route (ROUTE VERIFIED). **No invented email** | **NOT ESTABLISHED** | **NOT ESTABLISHED** | Official sales form — not submitted | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-09 | Raxio | FULL-RFI | info@raxiogroup.com (EMAIL, ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | same as route | same | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-10 | SEACOM | SCOPE CLARIFICATION | info@seacom.com — request Tanzania Sales / Enterprise RFI routing (ROUTE VERIFIED). **Not** Tanzania-only; **not** CLS primary | **NOT ESTABLISHED** | **NOT ESTABLISHED** | same as route | E1-B4.6 only if sent | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-11 | WIA | SCOPE CLARIFICATION | info@wia.co.tz (EMAIL, ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | same as route | E1-B4.6 only if sent | Route 2026-09-17; person **NOT ESTABLISHED** |
| CU-12 | Wingu | FULL-RFI | Primary info@wingu.africa (EMAIL, ROUTE VERIFIED) | **NOT ESTABLISHED** | **NOT ESTABLISHED** | email unless form required at execution | same | Route 2026-09-17; person **NOT ESTABLISHED** |

Transmission status for all rows: **NOT TRANSMITTED**. Completing a named person later is **not** provider selection.

---

## SECTION J — HUMAN DECISION / EVIDENCE STATUS

Do **not** mark `VERIFIED` without an artefact. Creating this form is **not** `EVIDENCE PROVIDED`.

| Item | Kind | Status now |
| --- | --- | --- |
| HUM-01 entity extract | human evidence | **NOT ESTABLISHED** |
| HUM-02 PDPC | human evidence / may require external evidence | **NOT ESTABLISHED** (also **REQUIRES EXTERNAL EVIDENCE** if no internal artefact exists) |
| HUM-03 DPO | human evidence + human decision | **NOT ESTABLISHED** |
| HUM-04 geography census | human evidence | **NOT ESTABLISHED** (draft lists exist; census does not) |
| HUM-05 current IdP | human evidence | **NOT ESTABLISHED** |
| HUM-06 KMS product | wait for architecture / provider | **NOT ESTABLISHED** — do not decide on this form |
| HUM-07 / CD-01 BCM sequence | human decision | **NOT ESTABLISHED** |
| HUM-08 operational RACI | human decision | **NOT ESTABLISHED** |
| HUM-09 budget | human decision; quotes are provider evidence | **NOT ESTABLISHED** |
| HUM-10 jurisdictions | wait for provider + later human attestation | **NOT ESTABLISHED** |
| HUM-11 send vs hold | human decision | **NOT ESTABLISHED** as executed send; package **READY / NOT SENT** |
| HUM-12 notice/IR owner | human decision (title); publication waits | **NOT ESTABLISHED** |
| HUM-13 ADR/DP/E1 approval | wait for pack | **NOT ESTABLISHED** |
| HUM-14 contracting process / signatory | human evidence / process | **NOT ESTABLISHED** |
| HUM-15 PITR adopt | wait for provider | **NOT ESTABLISHED** |
| Named RFI sender person | human evidence | **NOT ESTABLISHED** |
| Named RFI recipient person | human evidence | **NOT ESTABLISHED** |
| E1-B transmissions | provider path (after human send) | **NOT ESTABLISHED** (0 transmissions) |

When a human later supplies an artefact, change only that row to `EVIDENCE PROVIDED` or `DECISION PROVIDED`, then `VERIFIED` after independent check. Do not use `CLOSED` on this form without an owner instrument. **Section J below is the preparation-time snapshot. Current owner-decision status is Section K.**

---

## SECTION K — CURRENT STATUS AFTER 2026-09-17 OWNER DECISION (additive)

Instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md). DPO: [`adr-0006-e1-c-dpo-owner-designation-record.md`](adr-0006-e1-c-dpo-owner-designation-record.md). RFI prep: [`adr-0006-e1-b-owner-authorized-rfi-transmission-preparation.md`](adr-0006-e1-b-owner-authorized-rfi-transmission-preparation.md).

| Item | Kind | Status now |
| --- | --- | --- |
| HUM-01 entity extract | human evidence | **NOT PROVIDED / EVIDENCE REQUIRED** |
| HUM-02 PDPC | human evidence / external | **NOT ESTABLISHED / EXTERNAL EVIDENCE REQUIRED** |
| HUM-03 DPO company decision | human decision | **CLOSED / OWNER-CONFIRMED** — **Wensley Shirima**, IT Manager, DPO; designated by Patrick Makundi, PDM |
| HUM-03 appointment evidence | human evidence | **REQUIRED / TO BE RECORDED** |
| HUM-04 geography census | human evidence | **NOT ESTABLISHED** |
| HUM-05 current IdP | human evidence | **NOT ESTABLISHED** |
| HUM-06 KMS product | wait for architecture / provider | **NOT ESTABLISHED** |
| HUM-07 / CD-01 BCM sequence | human decision | **CLOSED / FORMALLY CONFIRMED** — **S2**; Patrick Makundi, Owner, PDM. S1 retained, not selected. Technical RTO/RPO **NOT DEMONSTRATED** |
| HUM-08 operational RACI | human decision | Privacy/DPO = **Wensley Shirima**. **Other personnel = NOT ESTABLISHED** |
| HUM-09 budget | human decision | **NOT FIXED** · **TCO-FIRST** confirmed. No dollar amount |
| HUM-10 jurisdictions | wait for provider | **OPEN** |
| HUM-11 named sender | human decision | **CLOSED / FORMALLY CONFIRMED** — **Patrick Makundi**, Owner, PDM; mailbox `rfp@serengetiexperiencedmc.com` |
| HUM-11 RFI decision | human decision | **SEND** |
| HUM-11 actual transmission | evidence | **NOT YET COMPLETED** (0 transmissions) |
| HUM-11 named recipient people | human evidence | **NOT ESTABLISHED** |
| HUM-12 notice/IR owner | human decision | Privacy/DPO = **Wensley Shirima**. Notice ownership = **DPO function**. IR ownership **NOT YET NAMED** |
| HUM-13 ADR/DP/E1 approval | wait for pack | **NOT ESTABLISHED** — E1 **NOT APPROVED / BLOCKED** |
| HUM-14 contracting process / signatory | human evidence / process | **NOT ESTABLISHED**. RFI send authority ≠ MSA/DPA signatory |
| HUM-15 PITR adopt | wait for provider | **OPEN / PROVIDER- AND ARCHITECTURE-DEPENDENT** |
| E1-B transmissions | provider path | **0** — **NOT YET TRANSMITTED** |
