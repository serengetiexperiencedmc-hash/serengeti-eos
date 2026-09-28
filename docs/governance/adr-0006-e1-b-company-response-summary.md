# E1-B — Company Response Summary

> **`INTERNAL SUMMARY`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`RFI NOT SENT`**  
> **`FROZEN QUESTIONNAIRE NOT MODIFIED`**

**Date:** 2026-09-17.  
**Parent:** [`adr-0006-e1-b-company-response-to-provider-rfi-rfq.md`](adr-0006-e1-b-company-response-to-provider-rfi-rfq.md)  
**Human register:** [`adr-0006-e1-b-company-response-human-required-register.md`](adr-0006-e1-b-company-response-human-required-register.md)

---

## A. Recovery of the frozen pack

| Item | Result |
| --- | --- |
| Questionnaire path | `docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md` |
| Source | **Current working tree** (untracked). **Not** present on `master` commit `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. No git history, stash, or dangling commit located for this path. |
| Question count | **168** (Q-A-01–Q-N-12) |
| SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| Exact frozen content recovered? | **YES** — from the local worktree; not reconstructed from memory. |
| PE path | `docs/governance/adr-0006-e1-b-provider-evidence-requirements.md` |
| PE count | **48** (PE-01–PE-48) |
| PE SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response template | `docs/governance/adr-0006-e1-b-standard-provider-response-template.md` |
| Template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Template fields recovered | Standard block (answer, evidence reference, document, section, page, URL, contractual guarantee, assumptions, exceptions, verification status, reviewer notes); quantitative (Provider value, SEDMC requirement, Provider evidence, Gap, Condition); geography table (country, region/city, operator, contractual lock, automatic movement, remote support access). |

---

## B. Status counts (168 Q-IDs)

Primary status = who must fill the Q-ID blank. Company requirements are still written in the parent file for evaluation.

| Status | Count |
| --- | --- |
| ANSWERED | 4 |
| ANSWERED WITH CONDITION | 57 |
| COMPANY DECISION (as primary Q-ID) | 0 |
| HUMAN EVIDENCE REQUIRED (as primary Q-ID) | 0 |
| PROVIDER RESPONSE REQUIRED | 107 |
| NOT APPLICABLE | 0 |
| DO NOT ANSWER / OUT OF SCOPE | 0 |
| **Total** | **168** |

ANSWERED Q-IDs: Q-B-18; Q-C-14; Q-I-07; Q-I-08.

Planning assumptions (500 / 200 / 30%) and business recovery targets (≤3h / ≤4h / zero business loss ≠ technical RPO=0) are **answered in section baselines**; Q-K and Q-G capability rows remain PROVIDER RESPONSE REQUIRED.

PE-01–PE-48: **48 / 48 PROVIDER RESPONSE REQUIRED** (no evidence ingested).

Human-required register: **8** items (HR-01–HR-08), none of which is a substitute for answering the 168 Q-IDs. Company decisions CD-01 (BCM sequence reconciliation) and CD-02 (whom to contact) are extra.

---

## C. Executive summary

### 1. Non-negotiable requirements

- Production SoR: PostgreSQL 16-class; process-local Store is not Production SoR.
- Fail-closed if the database is unavailable (no silent local buffering of Production writes).
- Hosting, processing, storage, backup, DR, support-access, and subprocessor locations identified **separately**.
- Encrypted backups and **demonstrable restore** (restore-from-backup is desired; warm standby/geo-DR unselected).
- Restricted / Highly Restricted **must not** fail over to an **unapproved** geography.
- Restricted+ remains **internal**, not automatically statutory.
- No raw payment-card storage; no invented PCI claims.
- Portability / export of PostgreSQL, documents, dumps, logs; low lock-in.
- No architecture or provider is selected by this response.
- Business data-loss tolerance is zero **business** loss and **must not** be translated into technical RPO=0.

### 2. Preferred commercial protections

- Transparent TCO line-items (setup through exit/retrieval); monthly / annual / one-time / optional / usage-based kept separate.
- Indicative quotes only under E1-B; no invented SEDMC budget; no minimums/termination/egress fees accepted until disclosed and later decided.
- MSA/DPA/SLA/security/subprocessor/incident/deletion/residency/transfer/audit/liability drafts for **information only** — no contract under this step.
- Exit assistance and successor-migration assistance to be described; Production migration remains unauthorized.

### 3. Privacy / residency

- Tanzania PDPA 2022 is the primary baseline. Kenya DPA, GDPR, and UK GDPR are **fact-specific**, not automatic all-data findings.
- Foreign hosting is not automatically prohibited and not automatically lawful.
- No universal transfer mechanism selected. No Production / backup / DR country selected.
- DPA, subprocessor list and change notice, residency clause or explicit inability, deletion including replicas, audit rights, and government-access process are required **from the provider**.
- PDPC **NOT VERIFIED**. DPO **NOT ESTABLISHED**. E-01 name **NOT VERIFIED**.
- Cross-border processing must be documented (origin, destination, recipient, purpose, data, mechanism, safeguards).

### 4. Recovery

- Critical ≤ 3 hours; overall ≤ 4 hours; MTD 3h as stated in this session’s company context.
- Technical RTO/RPO, PITR, measured restore, failover/failback, and test evidence: **provider**.
- Prefer (as a **requirement to evaluate**, not a class ranking) that offered architecture **can** meet the business 3h/4h targets.
- This session’s function criticality/sequence differs from the historical BCM pack; **CD-01** to reconcile; pack not rewritten.

### 5. Security

Evaluate (do not claim Production implementation): TLS; encryption at rest; backup encryption; KMS/key control; secrets; least privilege; MFA (including support); privileged access; audit logging; monitoring; vulnerability management; incident response; network isolation; WAF/DDoS where offered; support-access approval, logging, and time-limits; certification **scope**.

Foreign support: conditionally permissible with those controls. ADR-0012 / ADR-0013 remain OPEN.

### 6. TCO information

Provider must quote the frozen Q-L structure. Company budget number: **HR-07**. Absence of a budget does **not** block issuing the RFI or receiving quotes.

### 7. Cannot complete without human evidence

- E-01 registry/TIN/address/certificate (HR-01).
- E-02 PDPC artefact (HR-02).
- E-03 DPO appointment (HR-03).
- Named RFI sender (HR-04) — **blocks actual send**.
- Named recipient address (HR-05) — **blocks actual send to that party**.
- Later MSA signatory (HR-06) — blocks contracting.
- Approved budget number (HR-07) — blocks cost **acceptance**, not quotes.
- Wet-ink corporate instrument if later demanded (HR-08).

Legal Counsel THOMAS NGULUMA / 15TH SEPTEMBER 2026 / A.T.N. is **already recorded** and is **not** DPO.

---

## D. Provider-required categories (107 Q-IDs)

| Category | Examples |
| --- | --- |
| Provider identity | Q-A-01–Q-A-08 |
| Component geography / Tanzania capability | Q-B-01–Q-B-17; Q-D-01–Q-D-02; Q-D-05–Q-D-07 |
| Provider legal artefacts | Q-C-01–Q-C-03, Q-C-10, Q-C-13; Q-N-01–Q-N-04, Q-N-11 |
| PostgreSQL / object capability | Q-E-01–Q-E-06, Q-E-08, Q-E-14; Q-F-01, Q-F-03–Q-F-04, Q-F-06, Q-F-09, Q-F-11 |
| Technical recovery evidence | Q-G-01–Q-G-10, Q-G-12 |
| Assurance / secrets offering | Q-H-05, Q-H-15–Q-H-16 |
| Support facts | Q-I-01, Q-I-03–Q-I-04, Q-I-10 |
| SLA / HA / DR commercial packaging | Q-J-01–Q-J-10 |
| Sizing proposals | Q-K-01–Q-K-10 |
| Prices | Q-L-01–Q-L-08 |
| Exit mechanics / fees | Q-M-06–Q-M-08, Q-M-11–Q-M-14 |

---

## E. Governance safety

| Question | Answer |
| --- | --- |
| Frozen questionnaire changed? | **NO** |
| PE-01–PE-48 changed? | **NO** |
| Response template changed? | **NO** |
| Issuance authorization / E1-B5 changed? | **NO** |
| ADR-0006 / DP-0006 changed? | **NO** |
| Provider contacted? | **NO** |
| RFI sent? | **NO** |
| Provider selected? | **NO** |
| Architecture selected? | **NO** |
| UAT / Production / migration? | **NO** |
| Commit / push? | **NO** |

---

## F. Next governed action

**Do not automatically send the RFI.**

Exact next action:

A human issuer may (a) verify sender and recipient (HR-04, HR-05) and then **actually transmit** the already-authorized frozen pack with the required transmittal sentence, still as information gathering only; or (b) leave state as **PACKAGE READY / NOT SENT**.

Until a genuine provider response arrives, E1-B3 intake does not start. Human evidence HR-01–HR-03 does not need to be complete before send, and must not be fabricated.
