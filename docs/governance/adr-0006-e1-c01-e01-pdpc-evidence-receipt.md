# E1-C01 E-01 / PDPC Evidence Receipt

> **`CONTROLLED RECEIPT / INDEX — NOT A CERTIFICATE`**  
> **`THIS FILE IS NOT LEGAL-ENTITY EVIDENCE`**  
> **`THIS FILE IS NOT PDPC REGISTRATION EVIDENCE`**  
> **`THIS FILE DOES NOT APPOINT A DPO`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`DPO DETERMINATION: NOT ESTABLISHED`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE: UNSELECTED`**

**Receipt date (repository calendar):** 2026-09-16.  
**Pass type:** repository evidence-collection and verification for E-01 and E-02; subsequent company-provided legal-name recording.  
**Authoritative-document result:**

**NO AUTHORITATIVE E-01 / PDPC DOCUMENT RECEIVED OR VERIFIED DURING THIS PASS.**

**Company-provided fact (not a document):** legal name **Makundi Serengeti Experience DMC**.

No attachment, filename, registration number, certificate number, TIN, incorporation date, or registered-office line is manufactured here.

---

## 1. Scope of this pass

| Item | In scope | Out of scope |
| --- | --- | --- |
| E-01 legal entity / establishment | Yes | Inventing BRELA/TIN/office facts |
| E-02 PDPC registration status | Yes | Claiming SEDMC is registered |
| DPO appointment (E-03) | Checked only to keep it **separate** | Appointing a DPO |
| LA/L re-attestation | No | Re-opening Legal Counsel determinations |
| Architecture / UAT / Production | No | Provider or region selection |

Legal Counsel remains THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N. That attestation is **not** E-01 or PDPC evidence.

---

## 2. Search performed

| Search | Result |
| --- | --- |
| Binary/office artefacts (`pdf`, `png`, `jpg`, `doc`, `docx`, certificates) under the repository | **None found** |
| Filename patterns (`brela`, `pdpc`, `incorp`, `certificate`, `TIN`, `registry`, `extract`) as corporate/PDPC documents | **No matching authoritative documents** (unrelated `costing` / ADR-0006 hosting files only) |
| Text search: BRELA, certificate of incorporation/registration, TIN certificate, memorandum/articles, PDPC registration certificate/number/correspondence | **Mentions of gaps only** — no artefact contents |
| Governance placeholder [`adr-0006-e1-c01-e01-legal-entity-establishment.md`](adr-0006-e1-c01-e01-legal-entity-establishment.md) | Records absence; is **not** an extract |
| Fact pack L1 | Establishment **UNKNOWN** |
| EA-02 `https://pdpc.go.tz/services/registration/` | Official **process page**; **not** SEDMC registration |

No company **corporate document** was supplied in this governed action. The company subsequently supplied the legal-name **string** recorded in §3 (COMPANY-PROVIDED FACT only).

---

## 3. Receipt status (E-01)

| State | Status |
| --- | --- |
| Evidence requested | Yes — E-01 legal-entity / establishment extract |
| Company-provided legal name received | **Yes** — **Makundi Serengeti Experience DMC** (**COMPANY-PROVIDED FACT**) |
| Authoritative corporate document received | **No** |
| Evidence verified | **No** |
| Evidence absent | **Authoritative extract: Yes, absent.** Company-provided name: recorded, **not verified** |
| Evidence requiring external acquisition | **Yes** — corporate/registry evidence |

**E-01: NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED.**

Distinguish:

| | |
| --- | --- |
| **COMPANY-PROVIDED FACT** | Legal name **Makundi Serengeti Experience DMC** |
| **AUTHORITATIVE CORPORATE EVIDENCE** | **NOT AVAILABLE** — no certificate, extract, TIN, incorporation date, or registered office |

### Classification of what *was* found

| Class | Finding |
| --- | --- |
| A. AUTHORITATIVE CORPORATE EVIDENCE | **None** |
| B. COMPANY-PROVIDED FACT | (1) Tanzania-based DMC (company position LA-01). (2) Legal name **Makundi Serengeti Experience DMC** (company-supplied 2026-09-16). **Not** a registry extract. |
| C. APPLICATION/SEED DATA | `apps/api/src/store.ts`: tenant `name: "Serengeti Experience DMC"`; organisation `name: "Serengeti Experience DMC"`; `legalName: "Serengeti Experience DMC Ltd"`; location seed `ARU` / Arusha. Schema can store `legal_name`. |
| D. WEBSITE/BRAND INFORMATION | `README.md`, package description, UI shell, architecture docs: **Serengeti Experience DMC** as product/programme brand. |
| E. UNSUPPORTED INFERENCE | Not used. Seed, Arusha, branding, and the company-provided name are **not** treated as incorporation. |

Document title / issuing authority / registration identifier / incorporation date / registered office: **not present** (nothing to record). No certificate or registry reference is created here.

---

## 4. Entity-name reconciliation

Full table: [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md).

| Name string | Classification | Relationship |
| --- | --- | --- |
| **Makundi Serengeti Experience DMC** | **company-stated** (current company-provided legal name) | **NOT AUTHORITATIVELY VERIFIED** |
| **Serengeti Experience DMC Ltd** | **application-derived** (unverified legacy seed `legalName`) | **NOT AUTHORITATIVELY VERIFIED.** **Not** the verified legal entity |
| **Serengeti Experience DMC** | **brand/trading reference** (tenant/org `name`; README; UI) | **NOT AUTHORITATIVELY VERIFIED** |
| **SEDMC** | **drafting shorthand** | **NOT AUTHORITATIVELY VERIFIED** |

**Exact legal entity name on an authoritative document:** **not evidenced.**  
**Relationship between the strings:** **NOT AUTHORITATIVELY VERIFIED.** Do not assume they are the same legal entity.

---

## 5. Receipt status (E-02 PDPC registration)

| State | Status |
| --- | --- |
| Evidence requested | Yes — SEDMC-specific PDPC registration/status |
| SEDMC-specific authoritative evidence received | **No** |
| Evidence verified | **No** |
| Finding | **NO REGISTRATION EVIDENCE AVAILABLE** (not **AUTHORITATIVELY CONFIRMED NON-REGISTRATION**) |
| Evidence requiring external acquisition | **Yes** |

**NO SEDMC-SPECIFIC PDPC REGISTRATION DOCUMENT WAS AVAILABLE FOR VERIFICATION DURING THIS PASS.**

**Final checkpoint (2026-09-16):** re-search confirmed **no new** SEDMC-specific PDPC artefact. **NO SEDMC-SPECIFIC AUTHORITATIVE PDPC REGISTRATION/STATUS EVIDENCE IS AVAILABLE IN THE REPOSITORY.** Public PDPC guidance was **not** converted into company evidence.

**E-02: NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED.**

Do **not** claim that SEDMC is registered. Do **not** claim that SEDMC is not registered. Public PDPC guidance (EA-02) is **not** converted into company evidence.

Acquisition checklist: [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md) — **not evidence**.

Not treated as registration evidence:

- privacy notice draft;
- Legal Counsel attestation;
- P1 role key `dpo`;
- privacy policy / analysis;
- PDPC website URL (EA-02);
- application code;
- operating in Tanzania / Tanzania hosting preference;
- the company-provided legal name **Makundi Serengeti Experience DMC**.

**E-03 (separate):** DPO appointment search in the same window found **no** appointment artefact. **DPO APPOINTMENT NOT ESTABLISHED.** See [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md). THOMAS NGULUMA remains LEGAL COUNSEL ONLY.

---

## 6. PDPC evidence acquisition checklist

This checklist is **not evidence**. It does **not** prescribe a document format beyond asking for whatever official confirmation the Commission (or SEDMC’s own PDPC file) actually holds.

SEDMC should obtain from **PDPC and/or SEDMC Legal files**, then file a copy for E-02:

| Obtain (if it exists) | Record when received | Do not invent |
| --- | --- | --- |
| Registration confirmation or certificate **if issued** | Document title; date as shown; copy location | A fake certificate |
| Any registration number **if shown** | Identifier exactly as printed | A number |
| Registered entity name **as shown on the PDPC artefact** | Exact string | Alignment with seed `legalName` |
| Registration date **if shown** | Date as printed | An incorporation or PDPC date |
| Controller vs processor category **if shown** | As printed | A role conclusion |
| Any organization or DPO details **if shown on that artefact** | Transcribe as artefact content only | A DPO **appointment** in EOS (see §7) |
| Issuing authority | As printed (expected: Tanzania Personal Data Protection Commission, if that is what the artefact states) | Another regulator |
| Authenticity | Original, certified copy, or official portal record as actually obtained; how authenticity was checked | Portal screenshots of the **public process page** as SEDMC registration |

If SEDMC is **not** registered, obtain a written company/Legal record of that **absence** (or PDPC confirmation of non-registration if the Commission issues such a record). Record the absence; do not convert absence into “registered”.

If registration is later determined **not required**, that determination is a separate Legal/DPO artefact — it is **not** created by this checklist.

---

## 7. DPO separation

This PDPC collection pass did **not** create, imply, or recommend a DPO appointment.

| Statement | Status |
| --- | --- |
| DPO APPOINTMENT | **NOT ESTABLISHED** |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |
| P1 role key `dpo` | **Not** an appointment |
| E-03 | **Separate evidence gap** — remains open |

If a future PDPC artefact names a data-protection officer, that name is **artefact content only** until a separate appointment record is evidenced for E-03. Do **not** assign or recommend a named DPO as though an appointment has occurred. Do **not** identify Thomas Nguluma as DPO.

---

## 8. What SEDMC must obtain externally

1. **E-01:** Authoritative corporate extract matching or reconciling **Makundi Serengeti Experience DMC**. Source: SEDMC company files and/or the competent registry. Verify: original or certified copy; entity name as printed; identifiers only if present. The company-provided name is **not** a substitute.  
2. **E-02:** PDPC registration confirmation **or** documented non-registration / not-required determination. Source: PDPC and SEDMC Legal files. Verify: official artefact vs public process webpage.  
3. **E-03 (separate):** DPO appointment evidence **if** required — not part of this receipt’s collected set.

Production relevance: E-01 and E-02 remain **E1 and Production blockers** while **NOT VERIFIED** (E-02 Production-blocking if registration is required; unknown status still blocks treating registration as done).

---

## 9. Governance status (preserved)

| Item | Status |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO | **NOT COMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| Migration | **NOT AUTHORIZED** |
| Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |
| Tanzania | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** |

---

## 10. Technical integrity

This receipt did **not** change application code, schema, migrations, infrastructure, cloud/provider/region, deployment, UAT, or Production. No git commit, push, PR, or merge.

**STOP.** This file is a receipt of **absence**, not a substitute extract.
