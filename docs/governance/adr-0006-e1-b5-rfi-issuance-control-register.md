# E1-B5 — RFI Issuance Control Register

> **`E1-B5 ISSUANCE PACKAGE PREPARED — NOT SENT`**  
> **`PACKAGE READY ≠ SENT`**  
> **`RECIPIENT IDENTIFIED ≠ PROVIDER SELECTED`**  
> **`RESPONSE RECEIVED ≠ PROVIDER APPROVED`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment / Contracting = NOT AUTHORIZED`**

**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Repository calendar date:** 2026-09-16.  
**Issuance package version:** `E1-B5-ISSUANCE-PACKAGE`  
**Candidate universe:** [`adr-0006-e1-b4-provider-candidate-universe.md`](adr-0006-e1-b4-provider-candidate-universe.md)  
**Manifest:** [`adr-0006-e1-b5-rfi-issuance-package-manifest.md`](adr-0006-e1-b5-rfi-issuance-package-manifest.md)

This register tracks **possible later transmissions**. It does **not** send email, identify recipients, or record a send that has not occurred.

**RFI sent = NO** for every row. **Response received = NO** for every row. Recipient identity and address are **blank** — not fabricated.

RFI eligibility status: **UNDECIDED — HUMAN ISSUER**. Universe inclusion is not a send decision and not provider selection.

---

## 1. Issuance state machine

Permitted lifecycle (no stage silently authorizes the next):

```
CANDIDATE IDENTIFIED
        ↓
RECIPIENT NOT VERIFIED
        ↓
RECIPIENT VERIFIED
        ↓
PACKAGE READY
        ↓
READY FOR TRANSMISSION
        ↓
ACTUALLY SENT
        ↓
DELIVERY CONFIRMED
        ↓
RESPONSE RECEIVED
        ↓
E1-B3 EVIDENCE INTAKE
```

**Current row state:** CANDIDATE IDENTIFIED → **RECIPIENT NOT VERIFIED**.  
**Current package state:** **PACKAGE READY / NOT SENT**.

**Prohibited equivalences:**

| Must not treat | As |
| --- | --- |
| PACKAGE READY | SENT |
| RECIPIENT IDENTIFIED | PROVIDER SELECTED |
| RESPONSE RECEIVED | PROVIDER APPROVED |
| Universe inclusion | Shortlist, rank, or award |
| E1-B authorization | Actual transmission |

A row may move to ACTUALLY SENT **only** when an authorized human records a real transmission (channel, datetime, sender). This session records **no** such transmission.

---

## 2. Register (CU-01–CU-12)

Architecture class letters are **potential relevance from E1-B4**, not selection.

| Candidate ID | Organization | Candidate-universe reference | Potential architecture class(es) | RFI eligibility status | Recipient identity | Recipient email/address | Recipient source | Recipient verification status | Issuance package version | RFI sent | Date/time sent | Sender | Transmission channel | Delivery confirmation | Response received | Response ID | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | E1-B4 CU-01 | D (potential) | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-02 | Amazon Web Services | E1-B4 CU-02 | A, B, D | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-03 | Google Cloud | E1-B4 CU-03 | A, B, D | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-04 | Hetzner Online | E1-B4 CU-04 | B | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-05 | Liquid C2 / Liquid Intelligent Technologies | E1-B4 CU-05 | D (potential) | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-06 | Microsoft Azure | E1-B4 CU-06 | A, B, D | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-07 | Oracle Cloud Infrastructure | E1-B4 CU-07 | A, B, D | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-08 | OVHcloud | E1-B4 CU-08 | B | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-09 | Raxio Group | E1-B4 CU-09 | C (facility announced / launching — not treated as live) | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-10 | SEACOM Limited | E1-B4 CU-10 | C | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-11 | WIA | E1-B4 CU-11 | C | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |
| CU-12 | Wingu Africa | E1-B4 CU-12 | C; D (potential) | UNDECIDED — HUMAN ISSUER | | | | RECIPIENT NOT VERIFIED | E1-B5-ISSUANCE-PACKAGE | NO | | | | | NO | | Candidate for information-gathering only. |

**Rows:** 12. **RFI sent NO:** 12/12. **Response received NO:** 12/12. **Recipient identity populated:** 0/12.

---

## 3. Current state

**PACKAGE READY / NOT SENT**

No external transmission occurred in this session. Completing this register is **not** issuance.
