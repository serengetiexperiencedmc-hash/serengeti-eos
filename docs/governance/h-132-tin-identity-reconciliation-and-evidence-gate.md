# H-132 — TIN Identity Reconciliation and Evidence Gate

> **GOVERNANCE / EVIDENCE ONLY**  
> Reconciles the unresolved TIN identity discrepancy identified by H-131.  
> Does **not** convert the 2007 TRA certificate into verified DMC TIN evidence.  
> Does **not** modify H-128 TIN, H-128 BRELA evidence, H-131 intake classification, or the H-131 privacy-by-design boundary.  
> **NOT** PDPC registration. **NOT** a PDPC exemption. **NOT** Production authorization.  
> Prior records H-125, H-126, H-128, H-129, H-130, `h-131-tin-certificate-evidence-reconciliation.md`, and `h-131-eos-personal-data-boundary-and-privacy-by-design.md` inspected and **not modified**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 510.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.  
**Commit / push:** **NONE**.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

The TRA certificate remains **external to the repository**. Filename reference only: `TIN - MAKUNDI Serengeti Experience DMC.pdf`. The certificate is **not** copied into Git, `docs/`, `src/`, `.env`, or any configuration file. The full TIN is **not** reproduced here.

---

## 1. Purpose

Keep the H-131 discrepancy **explicit** and define the evidence gate for EI-01.

H-131 classified the inspected TRA certificate:

```text
B. DOCUMENT PRESENT — REQUIRES REVIEW
```

This increment **does not** reclassify that certificate as `VERIFIED — DOCUMENT MATCH`. It records that current evidence does **not** establish that the 2007 TRA certificate is the current tax certificate for **Makundi Serengeti Experience DMC**.

This increment does **not**:

- conclude that the certificate is invalid;
- conclude that the TIN itself is invalid;
- conclude that Veroted Group and Makundi Serengeti Experience DMC are unrelated;
- infer that T/A Veroted Group is Makundi Serengeti Experience DMC;
- infer that the 2007 certificate is the current DMC tax certificate;
- fabricate a current TRA certificate or TRA registration details;
- modify the TIN already recorded in H-128 §B.

---

## 2. Evidence reviewed

Reviewed in prior records only (not re-copied, not re-ingested):

| Source | Artefact | Use in this increment |
| --- | --- | --- |
| H-128 | Owner-supplied 2025 BRELA extract facts | Business identity baseline |
| H-128 §B / H-129 §A | Owner-supplied TIN fact | Identifier already on record; **not modified**; full number **not** repeated here |
| H-131 TIN intake | External TRA certificate inspection | Classification and face-of-document characteristics |
| H-130 | EI-01 register item | Status vocabulary; register file **not** rewritten here |
| H-131 privacy-by-design | EOS personal-data boundary | Unchanged; **not** modified |

No new TRA document was inspected in this increment. No certificate was copied into the repository.

---

## 3. Established facts

From H-128 (BRELA extract; 2025 documentary evidence; **not** live 2026 verification):

| Field | Established value |
| --- | --- |
| Business name | Makundi Serengeti Experience DMC |
| Registration number | 550040 |
| Proprietor | Patrick Daniel Makundi |
| Registration date | 06/08/2023 |
| Extract generation | 09/04/2025 17:21:34 |
| Principal place | Arusha, Tanzania (remaining location details as printed on the extract; not re-invented) |

From H-128 §B (restricted; **not duplicated** as a full identifier here):

| Field | Established value |
| --- | --- |
| Owner-supplied TIN | TIN ending **673** |
| Status | `RECORDED — OWNER-SUPPLIED TIN` — **not** a verified certificate |

These facts are **reused**, not restated as new evidence, and **not** overwritten.

---

## 4. H-131 TRA certificate characteristics

As recorded in H-131 (external document; not reproduced):

| Field | As recorded |
| --- | --- |
| Source description | TRA Certificate of Registration for Taxpayer Identification Number (TIN), held outside the repository |
| Filename | `TIN - MAKUNDI Serengeti Experience DMC.pdf` |
| Classification | `DOCUMENT PRESENT — REQUIRES REVIEW` |
| Issuing authority | Tanzania Revenue Authority (TRA) |
| Named taxpayer | Patrick Daniel Makundi |
| Trading-as designation | T/A Veroted Group |
| TIN (minimally exposed) | TIN ending **673** |
| Effective date | 21 August 2007 |
| Printed location | Kinondoni (tax office Mwenge) |
| DMC name on TRA form | **Not printed** (CamScanner/filename overlay is not TRA-printed business-name evidence) |

H-131 classification is **preserved**. This increment does not convert it to verified DMC TIN evidence.

---

## 5. Discrepancy analysis

The discrepancy remains explicit:

1. Owner / TIN identity **appears to correspond** to Patrick Daniel Makundi.
2. TIN ending 673 **corresponds** to the Owner-supplied TIN fact already recorded in H-128 §B.
3. The TRA certificate’s taxpayer / trading designation is **T/A Veroted Group**.
4. The certificate **predates** the BRELA registration of Makundi Serengeti Experience DMC (effective 21 August 2007 versus BRELA registration 06/08/2023).
5. The certificate’s printed location (**Kinondoni**) differs from the BRELA business location (**Arusha**).
6. Therefore, **no equivalence** between the certificate and the DMC is asserted without additional evidence.

A filename or scanner overlay containing “Makundi Serengeti Experience DMC” is **not** treated as TRA evidence that the DMC is the named taxpayer/trading identity on the certificate.

Equivalence is **not inferred**. Non-relationship is **not inferred**. Invalidity of the certificate or of the TIN is **not inferred**.

---

## 6. What is established

The following is established **from existing records**, and no more:

1. A 2025 BRELA extract records Makundi Serengeti Experience DMC, registration 550040, proprietor Patrick Daniel Makundi (H-128; not live 2026 verification).
2. The Owner has supplied a TIN ending 673 associated with the business as an **Owner-supplied fact** (H-128 §B). That fact is **not** modified here.
3. An external TRA TIN certificate was inspected (H-131). It names Patrick Daniel Makundi, TIN ending 673, T/A Veroted Group, effective 21 August 2007, printed location Kinondoni.
4. H-131 correctly left that certificate as `DOCUMENT PRESENT — REQUIRES REVIEW`.
5. Production remains **not authorized / not ready**.
6. PDPC registration remains **not completed**.

---

## 7. What is NOT established

The available evidence is **insufficient** to establish that the 2007 TRA certificate is the **current TIN evidence** for Makundi Serengeti Experience DMC.

Not established:

- that T/A Veroted Group **is** Makundi Serengeti Experience DMC;
- that the 2007 certificate **is** the current DMC tax certificate;
- that the certificate is **invalid**;
- that the TIN itself is **invalid**;
- that Veroted Group and Makundi Serengeti Experience DMC are **unrelated**;
- that EI-01 is closed;
- that PDPC registration is complete, unnecessary, or exempt.

```text
No equivalence between the 2007 TRA certificate and Makundi Serengeti Experience DMC
is asserted without additional evidence.
```

---

## 8. EI-01 status

```text
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

EI-01 must **not** move to `RECORDED — EXTERNAL DOCUMENT VERIFIED` merely because the named individual and TIN ending correspond.

H-130 is **not** rewritten in this increment. The status recorded here is the H-132 evidence-gate conclusion for EI-01.

---

## 9. Required evidence to close EI-01

**Preferred evidence:** a **current** TRA document, or other **authoritative TRA evidence**, that clearly connects **all** of:

- Patrick Daniel Makundi;
- the relevant TIN (already Owner-supplied; full number not repeated here);
- Makundi Serengeti Experience DMC.

If TRA documentation uses a different legal / trading-name structure, that relationship must be **evidenced**, not inferred.

This increment does **not** prescribe a specific TRA document title. No specific TRA form name is established by the evidence already on record beyond the inspected “Certificate of Registration for Taxpayer Identification Number (TIN)”, which does **not** itself close EI-01 for the DMC.

The Owner may need to obtain **clarification or update evidence from TRA** if the tax identity was established under an earlier trading / business name.

Until such evidence is presented and accepted under §14, EI-01 remains **OPEN / REQUIRES OWNER EVIDENCE REVIEW**.

---

## 10. PDPC impact

```text
PDPC registration remains OPEN. The tax-identity evidence required for any future PDPC application remains unresolved.
```

This discrepancy does **not** close PDPC registration and does **not** reopen a completed registration (none exists).

This document does **not** claim that PDPC registration is unnecessary. No PDPC exemption is asserted. H-129 is unchanged.

Verification or non-verification of TIN-certificate evidence does **not** constitute PDPC registration or Production authorization.

---

## 11. Production-readiness impact

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```

Unresolved tax-identity evidence for EI-01 is **one** outstanding evidence item. It does not, by itself, authorize or refuse Production independently of the remaining H-119 / H-120 P0 gates, PDPC status, identity, hosting, and infrastructure gates already recorded as open.

This increment does **not** change Production authorization, UAT acceptance (H-119 remains valid with documented limitations), H-80 (**ACTIVE**), or H-81 (**NOT STARTED**).

---

## 12. Privacy-by-design relationship

The H-131 privacy-by-design boundary remains **unchanged**:

```text
EOS is not intended to be a system of record for personal data.
```

`h-131-eos-personal-data-boundary-and-privacy-by-design.md` is **not** modified.

This TIN/identity reconciliation is **governance evidence work**. It does not authorize EOS to store the TRA certificate, the full TIN, personal identity documents, or other personal data. The certificate must remain **outside** the repository.

---

## 13. Owner action required

PDM / Owner:

1. Obtain current authoritative TRA evidence that connects Patrick Daniel Makundi, the relevant TIN, and Makundi Serengeti Experience DMC; **or**
2. Obtain TRA clarification / update evidence if the tax identity was established under an earlier trading / business name (including T/A Veroted Group), so that the relationship to the DMC is **documented by TRA**, not inferred here.

Place any such evidence in a controlled location **outside** the EOS repository. Do **not** copy certificates into Git.

Cursor / this increment must **not** guess the TRA outcome.

---

## 14. Evidence acceptance rule

EI-01 may only move to:

```text
RECORDED — EXTERNAL DOCUMENT VERIFIED
```

when **authoritative** evidence establishes the connection between the TIN and **Makundi Serengeti Experience DMC**.

Until then:

```text
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

Do **not** use “verified” merely because the person’s name and TIN ending match.

Acceptance still requires the H-130 §4 tests (actual document; date where applicable; issuing authority; clear relationship to Makundi Serengeti Experience DMC; no inference from unrelated documents; no fabricated evidence). The 2007 certificate, as inspected, does **not** meet the “clear relationship to Makundi Serengeti Experience DMC” test.

---

## 15. Change-control requirement

Any later proposal to:

- treat the 2007 TRA certificate as verified DMC TIN evidence;
- modify the TIN recorded in H-128 §B;
- infer legal equivalence between T/A Veroted Group and Makundi Serengeti Experience DMC without new TRA evidence;
- copy TRA certificates or the full TIN into the repository;
- close EI-01;
- assert PDPC exemption or PDPC completion from this tax-identity file;

requires a **new** governed evidence increment **after** additional authoritative evidence exists.

This increment performs **no** implementation, **no** PDPC filing, **no** commit, and **no** push.

---

## 16. Sensitive-data handling

| Control | Result |
| --- | --- |
| Certificate copied into the repository | **NO** |
| Full TIN reproduced in this file | **NO** (TIN ending **673** only) |
| H-128 TIN modified | **NO** |
| H-131 files modified | **NO** |

---

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
Next material progress on EI-01 requires Owner-obtained TRA evidence, not another repository-only inference.
```
