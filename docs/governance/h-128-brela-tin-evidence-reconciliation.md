# H-128 — Owner-Supplied BRELA and TIN Evidence Reconciliation

> **GOVERNANCE / EVIDENCE ONLY**  
> Owner-supplied facts and a 2025 BRELA extract transcription.  
> **NOT** live 2026 BRELA verification. **NOT** a TIN certificate. **NOT** PDPC registration.  
> **NOT Production authorization · NOT Production ready**  
> Signatory for Owner-supplied facts: **PDM**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.

Inspection this increment: `h-126-owner-confirmed-status-and-pdpc-identity-readiness.md` present. **`h-127` not found** in the repository (no H-127 artefact to update). TIN certificate search: no independent certificate/document located (prior E-01 receipt 2026-09-16; H-126; this increment). The Owner-supplied TIN was **not** previously present in the repository.

```text
PRODUCTION: NOT AUTHORIZED / NOT READY
```

---

## A. Authoritative / documentary evidence supplied

### E-01 — BRELA Register Extract

**Status:** `RECORDED — OWNER-SUPPLIED DOCUMENTARY EVIDENCE`

Owner-supplied BRELA Register of Business Names extract facts:

| Field | As supplied |
| --- | --- |
| Business name | Makundi Serengeti Experience DMC |
| Registration number | 550040 |
| Proprietor | Patrick Daniel Makundi |
| Registration date | 06/08/2023 |
| Extract generation date/time | 09/04/2025 17:21:34 |
| Principal place of business | Arusha, Tanzania, with remaining location details **as printed on the supplied extract** (not re-invented here) |
| Business activities | **Exactly as stated on the supplied extract** (activity text not re-transcribed beyond that qualification; not invented) |
| Authorized person | Patrick Daniel Makundi |

The extract states that the information printed from the Register of Business Names is true and complete as per the extract generation date/time and advises reference to the BRELA Online Registration System for up-to-date information.

**Qualification:**

> The supplied BRELA extract establishes the business registration information shown on the extract as at its generation date. It is not treated as a live 2026 verification. Current status remains subject to BRELA's current online register or a newer authoritative extract.

This is **not** a claim of current 2026 registration status.

---

## B. Owner-supplied tax identifier (restricted)

### TIN — OWNER-SUPPLIED FACT

**Status:** `RECORDED — OWNER-SUPPLIED TIN`

This subsection is the **only** intended repository location for the identifier in this increment. Do not copy into application code, configuration, `.env`, tests, fixtures, public website content, or logs.

| Item | Record |
| --- | --- |
| Identifier | 105-910-673 |
| Source | Owner-supplied information |
| Certificate / document independently located in this repository | **No** |

> The Owner has supplied the TIN associated with the business. No TIN certificate has been independently evidenced in the current repository unless separately located during this action.

This increment **did not** locate a TIN certificate. The TIN is **not** labelled verified as a certificate. Possession of a TIN is **not** PDPC registration.

---

## C. PDPC registration readiness

Prior Owner confirmation (H-126): **no PDPC registration has yet been completed.** Unchanged.

| Requirement | Status |
| --- | --- |
| BRELA / business registration evidence | **RECORDED** (2025 extract; not live 2026 verification) |
| TIN | **RECORDED — Owner supplied** |
| TIN certificate | **OPEN** (no documentary certificate found) |
| Audited financial report | **OPEN** (not found in repository) |
| DPO appointment / internal designation | **RECORDED** (H-125 internal appointment of Wensley Shirima) |
| PDPC registration | **NOT COMPLETED / OPEN** |
| PDPC certificate / registration evidence | **OPEN** |

Do **not** infer PDPC registration from the TIN. Do **not** infer exemption from PDPC registration.

---

## D. OA reconciliation

| OA | Status after H-128 |
| --- | --- |
| OA-01 | RECORDED — Owner-attested (H-125; unchanged) |
| OA-02 | RECORDED — Owner-attested (H-125; unchanged) |
| OA-03 | RECORDED — internal DPO appointment (H-125; unchanged) |
| OA-04 | **RECORDED — OWNER-SUPPLIED BRELA EXTRACT** (2025-date qualification preserved) |
| OA-05 | **OPEN — PDPC REGISTRATION NOT COMPLETED** (Owner confirmed; TIN does not close this gate) |
| OA-06 | **MIXED** — internal appointment **RECORDED**; regulator-facing PDPC evidence **OPEN** |
| OA-07 | **OPEN — NO FORMAL CORPORATE IDENTITY / IDP** |
| OA-08 | Unchanged from H-125/H-126: **RECORDED** PDM accountable infrastructure owner until delegation; **no Production infrastructure implied**. **Not closed by BRELA/TIN** |
| OA-09 | Unchanged: **OWNER DIRECTION ESTABLISHED / provider-region evidence pending**. ADR-0006 **OPEN**. **Not closed by BRELA/TIN** |
| OA-10 | Unchanged: **OWNER DIRECTION ESTABLISHED / provider-specific evidence pending**. DP-0006 **OPEN**. **Not closed by BRELA/TIN** |

Internal DPO appointment is **not** evidence of PDPC registration.

---

## E. OA-07 identity (no inference)

```text
No formal corporate identity / IdP system currently exists.
```

Not invented or inferred: Microsoft Entra, Google Workspace, SSO, MFA, corporate directory, tenant ID, federation, or corporate administrator account.

ADR-0013 remains **OPEN**. ADR-0012 remains **OPEN**.

---

## F. Infrastructure gates (preserved)

Hosting provider, region, residency, Production infrastructure, secrets/KMS, Production database, backup/restore, TLS/DNS, identity, event/email transport, and related Production evidence remain **separate gates**. BRELA and TIN do **not** close them.

---

## G. Evidence summary

### Newly established

1. Business registration identity is evidenced through the Owner-supplied 2025 BRELA extract.  
2. BRELA registration number is recorded (550040).  
3. Proprietor identity is recorded (Patrick Daniel Makundi).  
4. Owner has supplied the TIN (restricted section B only).  
5. Internal DPO designation/appointment remains recorded from H-125/H-126.

### Still outstanding

1. Current/live BRELA verification if required for Production evidence.  
2. Documentary TIN certificate (not independently located).  
3. Audited financial report, if required for the relevant PDPC registration process.  
4. PDPC registration and registration evidence.  
5. Regulator-facing DPO/PDPC evidence still required.  
6. Formal corporate identity / IdP.  
7. Hosting / provider / region decision and evidence.  
8. Production infrastructure and security controls.  
9. Remaining H-119/H-120 Production P0 gates.

---

## H. Production conclusion

```text
PRODUCTION: NOT AUTHORIZED / NOT READY
```

Availability of BRELA and TIN information is **evidence progress**, not Production authorization. Software/UAT status is unchanged. H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Commercial SoR remains Office / Excel / Outlook-Gmail / WhatsApp / phone. No ingestion, booking, KPI history, revenue/profit, FX, or Rate Identity live-proposal policy change.

---

## I. Privacy minimization

The TIN appears **only** in §B of this file. It must not be duplicated into unrelated documents, application source, configuration, `.env`, tests, public website content, or logs.
