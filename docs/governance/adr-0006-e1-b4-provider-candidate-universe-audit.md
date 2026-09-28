# E1-B4 — Provider Candidate Universe Audit

> **`READ-ONLY GOVERNANCE AUDIT`**  
> **`E1-B4 CANDIDATE UNIVERSE — INFORMATION-GATHERING ONLY`**  
> **`NOT PROVIDER SELECTION`** · **`NOT RANKING`** · **`NOT SCORING`** · **`NOT SHORTLIST`** · **`NOT RECOMMENDATION`**  
> **`RFI SENT = NO`** · **`NO EXTERNAL COMMUNICATION FROM THIS SESSION`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Audit date (repository calendar):** 2026-09-16.  
**Object:** [`adr-0006-e1-b4-provider-candidate-universe.md`](adr-0006-e1-b4-provider-candidate-universe.md)

Finding labels: **PASS** · **PASS WITH NON-BLOCKING OBSERVATION** · **REQUIRES AMENDMENT** · **BLOCKED**.

This audit does not contact providers, send the RFI/RFQ, or ingest evidence.

---

## 1. Scope

Audited against: E1-B issuance authorization; frozen 168-question questionnaire (not modified); PE-01–PE-48 (not modified); E1-B3 framework and evidence-intake controls; architecture/provider neutrality; Production/UAT/migration/deployment/contracting restrictions.

---

## 2. Integrity of frozen / authoritative files

| File | Modified by E1-B4? |
| --- | --- |
| E1-B RFI/RFQ (168 questions) | **No** |
| PE-01–PE-48 | **No** |
| Issuance authorization | **No** |
| E1-B3 framework / intake / custody / register | **No** |
| ADR-0006 / DP-0006 | **No** |

---

## 3. Audit tests

| # | Test | Result |
| --- | --- | --- |
| 1 | Provider neutrality (universe, not award) | **PASS** |
| 2 | Architecture neutrality (A–D unranked; no class stated as better) | **PASS** |
| 3 | No ranking / scoring / numerical weights | **PASS** |
| 4 | No recommendation / winner / strongest / most suitable / top provider | **PASS** |
| 5 | No shortlist language as a decision | **PASS** — universe ≠ shortlist; stated |
| 6 | Evidence provenance (URL + access date; claim class) | **PASS** |
| 7 | Four-class coverage A–D | **PASS** |
| 8 | Tanzania/local coverage | **PASS WITH NON-BLOCKING OBSERVATION** (§4 F-08) |
| 9 | African coverage | **PASS WITH NON-BLOCKING OBSERVATION** (§4 F-07) |
| 10 | EU/EEA coverage | **PASS** |
| 11 | Hybrid coverage (tagged potential, REQUIRES RFI) | **PASS** |
| 12 | Separation of candidate identification vs provider selection | **PASS** |
| 13 | E1-B authorization preserved (information gathering; RFI sent = NO) | **PASS** |
| 14 | E1-B3 evidence controls preserved (no ingestion, no fabricated response) | **PASS** |
| 15 | Recipient identities not fabricated; contact = public website only | **PASS** |
| 16 | Region existence not treated as full service catalogue | **PASS** |
| 17 | Production/UAT/migration/deployment/contracting still unauthorized | **PASS** |

---

## 4. Findings

| ID | Classification | Finding |
| --- | --- | --- |
| F-01 | PASS | 12 CU records; alphabetical order stated as not a rank. Each is “candidate for information-gathering only.” |
| F-02 | PASS | Recipient-control table: RFI sent = NO; Response received = NO; Recipient identified? = NO for all. |
| F-03 | PASS | Public-cloud African regions cited are South Africa; file states Africa ≠ Tanzania. |
| F-04 | PASS | CU-09 Raxio recorded as launching 2026 / not live capacity. |
| F-05 | PASS | Third-party colo directory certification boilerplate for SEACOM was explicitly not used. |
| F-06 | PASS | PostgreSQL 16, backup/PITR, DR, Tanzania lock, support countries: REQUIRES RFI for all. |
| F-07 | PASS WITH NON-BLOCKING OBSERVATION | Class A coverage is **South Africa public-cloud regions**, not Tanzania. That is factual coverage of Class A as defined, not a defect of neutrality. |
| F-08 | PASS WITH NON-BLOCKING OBSERVATION | Class C has four names but mixed evidence quality (PeeringDB vs self-description vs announced 2026). The file does not equalize them into a rank. Universe is **not exhaustive**. |
| F-09 | PASS WITH NON-BLOCKING OBSERVATION | Hybrid tags are potential (interconnect/product lines). They could be misread as “these orgs are hybrid-ready.” The file marks REQUIRES RFI. |
| F-10 | PASS WITH NON-BLOCKING OBSERVATION | The mandated next-trigger sentence contains “selected members.” The universe file disambiguates: human chooses whom to **contact**, not provider selection. |
| F-11 | PASS WITH NON-BLOCKING OBSERVATION | DP-0006 C/D letter swap vs E1-A/B class letters remains in the wider record; E1-B4 uses E1-A/B letters and does not rewrite DP-0006. |

**REQUIRES AMENDMENT:** none.  
**BLOCKED:** none.

---

## 5. Leakage search (E1-B4 files)

| Token | Used as provider/architecture award? |
| --- | --- |
| selected | Only in the mandated next-trigger phrase, disambiguated as **contact choice**, plus UNSELECTED banners |
| preferred | **Not** applied to any candidate or class in E1-B4 |
| recommended / best / winner / strongest / ranking / score / shortlist | **Not** as a decision; shortlist appears only as **negated** |
| approved provider / approved architecture | **No** |
| Production / UAT / deployment / contracting approval | **No** — remain NOT AUTHORIZED |

**Leakage verdict:** **NO AUTHORIZATION LEAKAGE REQUIRING AMENDMENT.**

---

## 6. Overall determination

**PASS WITH NON-BLOCKING OBSERVATION**

The universe is usable as a **contact menu for a later human issuer**. It is **not** a provider decision.

---

## 7. Counts (from universe file)

| Class | Unique CU tags |
| --- | --- |
| A | 4 |
| B | 6 |
| C | 4 |
| D | 7 |
| Unique organizations | 12 |

---

## 8. Current state (unchanged)

Architecture UNSELECTED. Provider UNSELECTED. No RFI sent. No response received. No evidence ingested. ADR-0006 OPEN. DP-0006 OPEN. Production / UAT / migration / deployment / contracting NOT AUTHORIZED.

**Exact next governed trigger:**

Human issuer decision to send the already-authorized provider-neutral RFI/RFQ to selected members of the candidate universe. Sending is an external communication action and must not be represented as completed unless an actual transmission occurs.

---

## 9. Technical / Git integrity

No application, schema, migration, infrastructure, email, vendor account, commit, push, PR, merge, or deploy. Frozen questionnaire and PE-01–PE-48 unmodified.
