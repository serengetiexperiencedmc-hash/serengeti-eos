# H-131 — Controlled TIN Certificate Evidence Intake

> **GOVERNANCE / EVIDENCE ONLY**  
> Local inspection of an Owner-provided TIN certificate held **outside** the EOS repository.  
> The certificate itself is **not** copied into Git, `docs/`, application assets, fixtures, or logs.  
> **NOT** PDPC registration. **NOT** Production authorization. **NOT** Production ready.  
> Prior records H-125, H-126, H-128, H-129, H-130 inspected and **not modified**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 508.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.  
**Commit / push:** **NONE**.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```

> Verification of the TIN certificate does not constitute PDPC registration or Production authorization.

---

## 1. Repository state (Task 1)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain count (before this file) | 508 |
| Existing dirty worktree | Preserved — no reset, clean, stash, revert, discard, or overwrite |

---

## 2. External evidence location (Task 2)

The illustrative path `C:\Users\PC\Branding MICE\sedmc-external-evidence\` **does not exist**. That directory was **not** created by this increment.

The Owner **explicitly supplied** an alternative local folder **outside** the EOS repository:

`C:\Serengeti Experience DMC\Company Docs\`

That folder exists. Inspection was limited to that explicitly supplied location. Arbitrary personal directories were **not** searched. The document was **not** uploaded and was **not** copied into the repository.

| Item | Result |
| --- | --- |
| Evidence ID | **H-131-E-01** |
| Evidence type | TRA Certificate of Registration for Taxpayer Identification Number (TIN) |
| Filename only | `TIN - MAKUNDI Serengeti Experience DMC.pdf` |
| File type | PDF (CamScanner image scan; 1 page) |
| Evidence location | **External to repository** (Owner company-docs folder; not in Git) |
| Expected `sedmc-external-evidence` folder | **Absent** — unused |

A separately named file `Extract Makundi Serengeti Experience.pdf` is present in the same explicitly supplied folder. It is the BRELA extract already recorded in H-128. It is **not** a TIN certificate and was **not** re-ingested here.

Directory listing of the same folder also showed a similarly named `TIN - Serengeti Experience DMC.pdf`. That sibling file was **not** treated as the H-131 primary artefact and was **not** inspected in this increment.

---

## 3. Document inspection (summary only)

The inspected PDF is an **actual** Tanzania Revenue Authority tax/TIN certificate, not an unrelated letter or licence. Face of the document:

| Field | As observed on the certificate (minimally recorded) |
| --- | --- |
| Issuing authority | Tanzania Revenue Authority (TRA) |
| Document title | Certificate of Registration for Taxpayer Identification Number (TIN) |
| Legal basis printed | Issued under section 23 of the Tax Administration Act 2015 |
| Named taxpayer | Patrick Daniel Makundi |
| Trading-as name printed | T/A Veroted Group |
| TIN | Recorded only as **TIN ending 673** (matches the Owner-supplied identifier already held in H-128 §B / H-129 §A; full number **not** reproduced here) |
| Certificate tracking number (CTIN) | Present on the face of the document |
| Effective date | 21 August 2007 |
| TRA location / tax office | Kinondoni / Mwenge |
| Physical location printed | Street/area in Kinondoni (Makongo CCM) |
| Official seal / signatory | Official seal present; Commissioner for Domestic Revenue signatory present |

The CamScanner overlay / filename refers to Makundi Serengeti Experience DMC. That overlay is **not** treated as TRA-printed business-name evidence. The TRA form itself names **Patrick Daniel Makundi T/A Veroted Group**.

The full certificate image and full TIN are **not** reproduced in this file.

---

## 4. Comparison with established Owner facts (Task 3)

Established facts (H-126 / H-128; not re-opened):

| Fact | Established value | Certificate |
| --- | --- | --- |
| Business | Makundi Serengeti Experience DMC | **Not printed** on the TRA form; trading-as name is **Veroted Group** |
| BRELA registration number | 550040 | **Not present** on this TIN certificate |
| Proprietor | Patrick Daniel Makundi | **Corresponds** |
| Owner-supplied TIN | Held in H-128 §B / H-129 §A | **Corresponds** (TIN ending 673) |
| Principal place (BRELA extract) | Arusha, Tanzania | Certificate physical location is **Kinondoni**, not Arusha |
| BRELA registration date | 06/08/2023 | TIN effective **21 August 2007** |

### Classification

```text
B. DOCUMENT PRESENT — REQUIRES REVIEW
```

**Not A (VERIFIED — DOCUMENT MATCH):** the certificate is a genuine TRA TIN certificate and the TIN corresponds to the already Owner-supplied identifier, but it does **not** clearly identify the relevant current business **Makundi Serengeti Experience DMC**. The printed trading-as name is **Veroted Group**. Location and effective date also do not align with the 2023 BRELA extract for the DMC. A match is **not** forced.

**Not C (MISMATCH — STOP):** the TIN does **not** conflict with the Owner-supplied TIN, and the named individual corresponds to the recorded proprietor. The existing TIN in H-128 §B is **not** modified. The discrepancy is the **business / trading name and location**, which requires Owner review rather than a conclusion that a different taxpayer number was presented.

**Not D (NOT FOUND):** the explicitly supplied certificate file was present and inspected.

Owner review is required to determine whether this 2007 TRA certificate (Patrick Daniel Makundi T/A Veroted Group) is the current authoritative TIN certificate for **Makundi Serengeti Experience DMC**, or whether a later TRA certificate / amendment naming the current business exists.

---

## 5. EI mapping (H-130)

| Item | Result |
| --- | --- |
| EI item addressed | **EI-01** (TIN certificate) |
| EI-02 (audited financial report) | **Not addressed** by this document |
| Does this close the TIN-certificate evidence requirement? | **NO** |
| EI-01 status after H-131 | Remains **OPEN** pending Owner review of trading-name / location alignment. Status is **not** `RECORDED — EXTERNAL DOCUMENT VERIFIED`. |

H-130 is **not** rewritten in this increment. EI-01 is not closed by intake of a document that does not clearly name the current business.

---

## 6. PDPC readiness (Task 5 / Task 8)

Classification is **not** `VERIFIED — DOCUMENT MATCH`. Therefore the TIN certificate requirement is **not** marked `RECORDED — EXTERNAL DOCUMENT VERIFIED`.

Unchanged (do not infer from this intake):

| Item | Status |
| --- | --- |
| TIN certificate (EI-01) | **OPEN** — document present externally; **requires Owner review**; not closed |
| PDPC registration status | **OPEN** / **not completed** (H-126 / H-129) |
| PDPC certificate / registration evidence | **OPEN** — not issued |
| Audited-financial evidence | **OPEN** |
| DPO regulatory / regulator-facing status | **OPEN** (internal appointment remains separately recorded in H-125) |
| Corporate identity / IdP | **OPEN** — no formal corporate IdP |
| Hosting / provider status | Unchanged — ADR-0006 / DP-0006 **OPEN** |
| Production authorization / readiness | **NOT AUTHORIZED / NOT READY** |

No PDPC application was prepared, submitted, or filed in this increment.

> Verification of the TIN certificate does not constitute PDPC registration or Production authorization.

---

## 7. Security and privacy (Task 7)

| Control | Result |
| --- | --- |
| Certificate copied into Git | **NO** |
| Certificate copied into `docs/` | **NO** |
| Repository copy of the certificate created | **NO** |
| Full certificate contents placed in this Markdown file | **NO** |
| Full TIN reproduced in this file | **NO** (minimally exposed as **TIN ending 673**) |
| Certificate placed in application assets, configuration, tests, fixtures, or logs | **NO** |
| Uploaded | **NO** |
| Existing TIN in H-128 §B overwritten | **NO** |

The external evidence folder remains **outside** the EOS repository.

---

## 8. Production status

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```

H-80 **ACTIVE**. H-81 **NOT STARTED**. Commercial SoR unchanged.

---

## 9. Required Owner review

PDM / Owner must confirm **one** of the following against TRA records or a later certificate — Cursor must not guess:

1. The 2007 TRA TIN for Patrick Daniel Makundi T/A Veroted Group is still the current TIN for Makundi Serengeti Experience DMC; or  
2. A later TRA TIN certificate / amendment naming Makundi Serengeti Experience DMC exists and should be presented for a subsequent intake increment.

Until that review, EI-01 remains **OPEN**.

---

## 10. Next material progress

```text
Next material progress on EI-01 requires Owner review of the trading-name discrepancy
and/or a TRA certificate that clearly names Makundi Serengeti Experience DMC.
This increment does not authorize PDPC submission or Production.
```
