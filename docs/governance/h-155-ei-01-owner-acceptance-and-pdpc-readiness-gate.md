# H-155 — EI-01 Owner Acceptance and PDPC Readiness Gate

> **GOVERNANCE / EVIDENCE GATE ONLY**  
> Records an explicit Owner/POA acceptance of the previously inspected TRA TIN certificate for the **internal EI-01 governance gate**, then assesses the next PDPC readiness dependency from existing records.  
> **NOT** independent TRA verification. **NOT** live TRA confirmation. **NOT** a reissued certificate. **NOT** PDPC registration, filing, contact, or compliance. **NOT** a PDPC exemption. **NOT** Production authorization.  
> Prior records H-125, H-126, H-128, H-129, H-130, H-131 TIN intake, H-132 TIN reconciliation, H-147, H-153, and H-154 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved — no reset, clean, stash, revert, discard, or overwrite)  
**Porcelain at start of this increment:** 649  
**Porcelain after this increment:** 650 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**Commit / push:** **NONE**  
**H-156:** **NOT CREATED**

```text
H-155 STATUS = COMPLETE — EI-01 OWNER ACCEPTANCE RECORDED
EI-01 = CLOSED BY OWNER ACCEPTANCE
PDPC = OPEN
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
ADR-0006 OPEN
DP-0006 OPEN
CURRENT-CODE UAT = ACCEPTED WITH DOCUMENTED LIMITATIONS
```

---

## A. Authority

The Owner/POA has explicitly directed:

> Treat the previously inspected TRA TIN certificate as sufficient for EI-01 closure and proceed to the next best action.

This increment records that direction as an **Owner/POA acceptance decision** for the internal EI-01 governance gate.

It does **not**:

- contact TRA or PDPC;
- re-inspect or copy the certificate into Git;
- alter the Owner-supplied TIN;
- register with PDPC;
- claim that all legal identity questions have been externally resolved;
- close PDPC, E1-C, blocker 18, or Production.

H-130 is **not** rewritten. The EI-01 status transition is recorded **here**, so that prior intake wording is preserved as historical.

---

## B. Baseline reconciled

| Item | Before H-155 | After H-155 |
| --- | --- | --- |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | Unchanged |
| Index | empty | empty |
| Current-code UAT | ACCEPTED WITH DOCUMENTED LIMITATIONS (H-153) | Unchanged |
| Production | NOT AUTHORIZED / NOT READY | Unchanged |
| `productionReady` | `false` | Unchanged |
| PDPC | OPEN | **OPEN** |
| EI-01 | OPEN / REQUIRES OWNER EVIDENCE REVIEW (H-132, H-154) | **CLOSED BY OWNER ACCEPTANCE** |
| ADR-0006 | OPEN | **OPEN** |
| DP-0006 | OPEN | **OPEN** |
| Migration 126 | NOT CREATED | NOT CREATED |
| Production migration | NOT authorized | NOT authorized |
| Current migration worktree | 125 | 125 |
| Commercial SoR | Office / Excel / Outlook-Gmail / WhatsApp / phone | Unchanged |
| H-81 / C11+ / F2-I12 / Path D | NOT STARTED / NOT AUTHORIZED | Unchanged |

Sources read (actual filenames):

| Topic | File |
| --- | --- |
| H-125 | `docs/governance/h-125-owner-decision-and-evidence-pack.md` |
| H-126 | `docs/governance/h-126-owner-confirmed-status-and-pdpc-identity-readiness.md` |
| H-128 | `docs/governance/h-128-brela-tin-evidence-reconciliation.md` |
| H-129 | `docs/governance/h-129-pdpc-registration-readiness-pack.md` |
| H-130 | `docs/governance/h-130-external-evidence-intake-register.md` |
| H-131 TIN | `docs/governance/h-131-tin-certificate-evidence-reconciliation.md` |
| H-132 TIN | `docs/governance/h-132-tin-identity-reconciliation-and-evidence-gate.md` |
| H-154 | `docs/governance/h-154-production-readiness-closure-plan.md` |

---

## C. Owner/POA decision (EI-01)

```text
OWNER/POA DECISION (H-155):
The previously inspected TRA TIN certificate is accepted as sufficient
for closure of the internal EI-01 governance gate.
```

| Field | Record |
| --- | --- |
| Decision type | Explicit Owner/POA acceptance |
| Decision owner | Owner/POA |
| Artefact accepted | The TRA Certificate of Registration for Taxpayer Identification Number already inspected in H-131 (external file; not in Git) |
| Gate closed | **Internal EI-01 evidence gate only** |
| Independent TRA verification | **NOT claimed** |
| Live TRA confirmation | **NOT claimed** |
| Certificate reissued | **NOT claimed** |
| Legal identity fully resolved externally | **NOT claimed** |
| Status token used | `CLOSED BY OWNER ACCEPTANCE` |
| Status token **not** used | `RECORDED — EXTERNAL DOCUMENT VERIFIED` (H-132 §14) |

H-132 §14 reserved `RECORDED — EXTERNAL DOCUMENT VERIFIED` for authoritative evidence establishing a clear relationship to **Makundi Serengeti Experience DMC**, and recorded that the 2007 certificate, as inspected, did **not** meet that test without additional TRA evidence.

H-155 does **not** rewrite H-132 and does **not** convert the certificate into independently verified DMC TIN evidence. The Owner/POA has directed that the **same** inspected artefact is sufficient for the **internal** EI-01 gate. That is Owner acceptance, not H-132 §14 external verification.

---

## D. Exact evidence accepted

The accepted artefact is **H-131-E-01**, unchanged:

| Field | As already recorded (H-131 / H-132) |
| --- | --- |
| Evidence ID | H-131-E-01 |
| Type | TRA Certificate of Registration for Taxpayer Identification Number (TIN) |
| Location | External to the repository (Owner company-docs folder). **Not** copied into Git, `docs/`, application assets, fixtures, `.env`, or logs |
| Filename only | `TIN - MAKUNDI Serengeti Experience DMC.pdf` |
| Issuing authority | Tanzania Revenue Authority (TRA) |
| Legal basis printed | Issued under section 23 of the Tax Administration Act 2015 |
| Named taxpayer | Patrick Daniel Makundi |
| Trading-as name printed | T/A Veroted Group |
| TIN | Corresponds to the Owner-supplied identifier already held in H-128 §B / H-129 §A. Recorded here only as **TIN ending 673**. Full number **not** reproduced |
| Effective date | 21 August 2007 |
| TRA location / tax office | Kinondoni / Mwenge |
| DMC name on TRA form | **Not printed** (CamScanner/filename overlay is not TRA-printed business-name evidence) |
| H-131 classification (preserved) | `DOCUMENT PRESENT — REQUIRES REVIEW` |

Related identity facts **not** altered:

| Fact | Source | Status |
| --- | --- | --- |
| Business name Makundi Serengeti Experience DMC; BRELA 550040; proprietor Patrick Daniel Makundi; registration 06/08/2023 | H-128 2025 extract | `RECORDED — OWNER-SUPPLIED DOCUMENTARY EVIDENCE` (not live 2026 BRELA verification) |
| Owner-supplied TIN | H-128 §B | `RECORDED — OWNER-SUPPLIED TIN` — identifier **not** modified |

No new TIN is invented. The H-128 identifier is **not** copied into this file.

---

## E. EI-01 disposition

### E.1 Prior classification

From H-131, H-132, H-147, H-153, and H-154:

```text
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

H-131 left the certificate as `DOCUMENT PRESENT — REQUIRES REVIEW` because the TRA form names T/A Veroted Group, is dated 2007, and prints Kinondoni, while the 2025 BRELA extract records Makundi Serengeti Experience DMC in Arusha from 2023. H-132 did **not** accept the 2007 certificate as sufficient **current DMC** TIN evidence and required Owner evidence review.

### E.2 Closure recorded here

```text
EI-01 = CLOSED BY OWNER ACCEPTANCE
```

Named H-147/H-154 Production blocker **28** is closed **as an individual internal evidence gate** on this Owner direction.

### E.3 What this closure is not

Owner acceptance **does not** mean:

- independent TRA verification or a TRA confirmation that the DMC is the named taxpayer/trading identity;
- that T/A Veroted Group **is** Makundi Serengeti Experience DMC as a TRA-evidenced equivalence;
- that the 2007 certificate has been reissued or updated;
- that the certificate is invalid, or that the TIN is invalid;
- that Veroted Group and the DMC are unrelated;
- PDPC registration, PDPC compliance, or PDPC exemption;
- closure of blocker 18 (E1-C legal/privacy), E1-C, or Production.

The documented limitations of the certificate (trading-as name, 2007 effective date, Kinondoni vs Arusha, DMC name not printed on the TRA form) **remain on the record**. They are accepted **by Owner direction** for the internal gate; they are not erased.

H-130 row EI-01 historically reads `OPEN` / “certificate not located”. That file is **left unchanged** as a prior intake snapshot. The governing current status for EI-01 is this H-155 token: `CLOSED BY OWNER ACCEPTANCE`.

---

## F. Four distinctions (must not be conflated)

| # | Layer | Meaning after H-155 |
| ---: | --- | --- |
| 1 | EOS privacy-by-design boundary | Unchanged: EOS is **not** intended to be a system of record for personal data (H-131 privacy companion). The TRA certificate stays **outside** the repository. H-142/H-146 remain Dev/Test privacy-engineering evidence. |
| 2 | SEDMC operational processing | The business continues to process personal data in Office / Excel / Outlook-Gmail / WhatsApp / phone (current commercial SoR). That is **not** EOS Production and is **not** assessed here as compliant. |
| 3 | PDPC regulatory readiness | **OPEN.** EI-01 Owner acceptance supplies internal TIN-certificate evidence for a future PDPC pack. It is **not** PDPC registration, a certificate, an exemption, or live-process confirmation. |
| 4 | Production legal/privacy readiness | **NOT READY.** H-154 blocker 18 remains OPEN (PDPC, DPO combined close, DPAs). Production remains unauthorized. |

```text
EI-01 CLOSED BY OWNER ACCEPTANCE
≠ PDPC / regulatory readiness
≠ Production legal/privacy readiness
≠ Production authorization
```

---

## G. PDPC readiness assessment

```text
PDPC OPEN
```

No PDPC registration, contact, upload, filing, or compliance claim is made. SEDMC is **not** declared exempt.

### G.1 Current PDPC status

Owner-confirmed (H-126): PDPC registration **has not yet been completed**. OA-05 remains OPEN for **authoritative PDPC status evidence**. L-01 remains a **rule** (confirm actual PDPC status before Production personal-data processing if PDPA applies) — **not** a certificate.

H-129: authoritative PDPC requirement source (live form, current attachment list, Act/regulations text) is **not** present in the repository. Catalogued URLs (including `https://pdpc.go.tz/services/registration/`) are **not** a captured copy of the current application.

### G.2 Evidence inventory after EI-01 Owner acceptance

| Item | Status after H-155 | Notes |
| --- | --- | --- |
| Business name / proprietor | RECORDED | Makundi Serengeti Experience DMC; Patrick Daniel Makundi |
| BRELA extract | RECORDED — 2025 documentary evidence | Registration 550040; generated 09/04/2025 17:21:34; **not** live 2026 verification (H-128). H-125 OA-04 text is historical; later H-128 evidence is not overwritten here |
| TIN (identifier) | RECORDED — Owner-supplied | H-128 §B; not modified; not copied here |
| TIN certificate (internal EI-01 gate) | **CLOSED BY OWNER ACCEPTANCE** | Same H-131 artefact; not TRA-verified |
| Audited financial statements | **OPEN** | H-129 / EI-02: required **if** the live PDPC process requires them. Requirement text **not** stored in-repo |
| DPO internal appointment | RECORDED (Owner-attested) | Wensley Shirima (H-125 OA-03). THOMAS NGULUMA remains Legal Counsel only |
| DPO appointment letter / distinct PDF | **OPEN** if the live process requires a document beyond H-125 markdown (H-129 §C; EI-08) | Internal record ≠ regulator artefact |
| DPO regulator notification / combined E1 close | **OPEN** | H-125 OA-06 MIXED; question 5 OPEN |
| Current PDPC application requirements | **PENDING EXTERNAL EVIDENCE** (EI-03) | Live fields, attachment list, controller vs processor, DPO introduction mechanics |
| PDPC application / submission | **NOT STARTED** (EI-04) | No submission claimed |
| PDPC registration / written regulatory determination | **NOT STARTED / NOT ISSUED** (EI-05); OA-05 still requires one of: SEDMC-specific PDPC status evidence **or** an authoritative written determination | Neither exists |
| Privacy / data-processing documentation required by the live PDPC process | **PENDING EXTERNAL EVIDENCE** (EI-09 / EI-10) | Depends on live requirements. EOS privacy-by-design work is **not** a PDPC filing pack |
| Provider DPAs | **NOT STARTED** (EI-16) | Depend on future provider selection; ADR-0006 / DP-0006 remain OPEN |

### G.3 Remaining legal/privacy gates (not closed by H-155)

1. **PDPC status evidence** — registration outcome or authoritative written determination (OA-05 / blocker 18).
2. **Live PDPC process confirmation** — EI-03 (application fields and attachments).
3. **Attachments that the live process actually requires** — audited financials if required; distinct DPO letter if required; other supporting business/privacy documents.
4. **DPO combined E1 close** — internal appointment recorded; regulator-facing component OPEN.
5. **Vendor DPAs** — blocked on provider selection (after ADR-0006).
6. **E1-C legal/privacy Production-blocking set** — H-154 blocker 18 remains OPEN as a whole.

H-142/H-146 privacy remediation does **not** close any of the above.

---

## H. Production blocker reconciliation (H-154 inventory, not silently reduced)

Named inventory remains **28** rows. EI-01 is closed as **one** evidence gate. No other blocker is closed.

| # | Gate | After H-155 |
| ---: | --- | --- |
| 1 | Production authorization grant | **OPEN** |
| 2 | Hosting/provider/region | **OPEN** |
| 3 | ADR-0006 formal approval | **OPEN** |
| 4 | DP-0006 named option approval | **OPEN** |
| 5 | Production database/catalog | **OPEN** |
| 6 | Authorized Production schema migrate | **OPEN** |
| 7 | Secrets/KMS | **OPEN** |
| 8 | Identity provider | **OPEN** |
| 9 | MFA at IdP | **OPEN** |
| 10 | HTTPS | **OPEN** |
| 11 | DNS | **OPEN** |
| 12 | Database TLS on a real Production DB | **OPEN** |
| 13 | Production CORS origins | **OPEN** |
| 14 | Backup product | **OPEN** |
| 15 | Restore evidence of Production state | **OPEN** |
| 16 | Operations ownership (HUM-08) | **OPEN** / partial Owner-attested titles only |
| 17 | On-call roster | **OPEN** |
| 18 | E1-C legal/privacy (PDPC, DPO combined close, DPAs) | **OPEN** |
| 19 | Production event transport | **OPEN** |
| 20 | Production email product + DPA | **OPEN** |
| 21 | Process supervision | **OPEN** |
| 22 | Observability sink + alerting | **OPEN** |
| 23 | Production-like start on real config | **OPEN** |
| 24 | Rollback/DR on Production topology | **OPEN** |
| 25 | SoR / adoption | **OPEN** — H-81 NOT STARTED |
| 26 | Production security/access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** (H-153) |
| 28 | EI-01 TIN identity reconciliation | **CLOSED BY OWNER ACCEPTANCE** (this increment) |

**OPEN Production blockers: 26 of the 28 named items** (1–26). Item 27 remains UAT-evidence only. Item 28 is closed as Owner acceptance, not as TRA verification.

H-154 Stage 1 (EI-01) is complete **as an internal gate**. Remaining PDPC-critical path continues at Stage 2. ADR-0006 / DP-0006 still require a named option after the legal/residency pack; that pack is **not** complete because PDPC status evidence is still missing.

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
```

---

## I. Single next executable action

**Exactly one** next action:

```text
Owner/authorized representative: confirm the current PDPC registration
application requirements on the authoritative PDPC channel
(live application fields, current attachment list, controller vs
processor category, and DPO introduction mechanics) — H-130 EI-03 /
H-129 outstanding item 4.
```

**Why this is next:** H-154 placed EI-01 first because H-129 listed TIN certificate evidence among Owner-must-obtain PDPC materials. That internal TIN-certificate gate is now Owner-accepted. The next PDPC dependency that actually determines whether audited financials, a distinct DPO letter, or other privacy documents are required is **live process confirmation**. Repository URLs are not a captured current form. H-129 forbids inventing a mandatory attachment list.

**Who can execute it:** Owner / authorized representative on the live PDPC channel (catalogued process page: `https://pdpc.go.tz/services/registration/`).

**Cursor cannot execute this action.** This increment does **not** contact PDPC, open a PDPC account, scrape or archive the live form, or start registration. HUM-08 naming can proceed in parallel but does not reduce the PDPC critical path. A DPO letter, audited financials, privacy notice, or DPA is **not** selected as the next action because each is either already internally recorded, conditional on live requirements, or blocked on a later vendor selection.

Do not start PDPC registration from this repository.

---

## J. Explicitly excluded (not started)

```text
H-156: NOT CREATED
PDPC registration / contact / upload / filing: NOT PERFORMED
PDPC exemption / compliance: NOT CLAIMED
TRA verification / live TRA confirmation: NOT CLAIMED
certificate reissue: NOT CLAIMED
H-130 rewritten: NO
TIN altered: NO
certificate copied into Git: NO
Production deployment / infrastructure / credentials / DNS / TLS / IdP / MFA: NOT PERFORMED
Production database / live migration / migration 126: NOT CREATED / NOT PERFORMED
ADR-0006 / DP-0006: still OPEN
H-81 / C11+ / F2-I12 / Path D: NOT STARTED / NOT AUTHORIZED
hydration repair: NOT PERFORMED
commercial SoR: UNCHANGED
```

---

## K. Repository safety (this increment)

| Check | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Application / schema / infrastructure changes | **NONE** |
| Migration 126 / live migration | **NONE** |
| Prior governance records modified | **NONE** (H-130 not updated) |
| Porcelain | 649 → 650 |
| Files created | `docs/governance/h-155-ei-01-owner-acceptance-and-pdpc-readiness-gate.md` only |
| Commit | **NONE** |
| Push | **NONE** |
| Existing dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
H-156 WAS NOT CREATED
```
