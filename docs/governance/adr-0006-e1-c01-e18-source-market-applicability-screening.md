# E-18 — International Source-Market Applicability Screening (Phase 1)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: PARTIALLY EVIDENCED` / `DRAFT` / `REQUIRES HUMAN REVIEW`**  
> **`This is a factual screening, not a legal memorandum and not a finding that any law applies.`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

A jurisdiction on SEDMC’s **target-market list** does **not** make that jurisdiction’s privacy law applicable.

Do **not** treat programme destination, client HQ, or hosting preference as equivalent (see E-05).

Applicability conclusion for every row: **`REQUIRES HUMAN/DPO/LEGAL DETERMINATION`**.

---

## 1. Screening questions used (factual)

For each market:

1. Why is the market relevant to SEDMC? (COMPANY POSITION / FACT)
2. Are actual EOS data subjects in that jurisdiction **evidenced**? (E-05 Layer B)
3. Is an **establishment** in that jurisdiction **evidenced**? (E-01 for Tanzania; others)
4. Are services **offered** to people there? (business position vs evidenced offering)
5. Is **monitoring** of individuals there involved? (Production monitoring **NOT SELECTED**)
6. May **international transfer** arise? (Processing geography **NOT SELECTED**)
7. Is deeper legal analysis required?
8. What evidence exists now?

This screening does **not** apply GDPR Art. 3, UK GDPR, Kenya DPA s.4, or Tanzania PDPA tests as completed legal results. AI counsel analysis exists separately and is **not** copied as a determination.

---

## 2. Screening table

| Jurisdiction / market | Why relevant to SEDMC | Actual EOS data subjects evidenced? | Establishment evidenced? | Services offered to people there? | Monitoring involved? | International transfer may arise? | Deeper legal analysis required? | Evidence currently available | Applicability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Tanzania** | COMPANY POSITION: Tanzania-based DMC; core destination; preferred hosting jurisdiction (not selected) | **No Production census.** Schema can store TZ country codes. Staff location **not evidenced** | **No.** E-01 placeholder: no incorporation/establishment extract. Dev seed Arusha ≠ establishment | COMPANY POSITION: yes, as a DMC operating in TZ. **Offering** not independently evidenced beyond business position | Production monitoring **NOT SELECTED**. No evidenced behavioural monitoring of TZ residents | **Unknown** until Layer D selected. If hosting is outside TZ, outbound transfer **may** arise; if inside TZ, inbound from source markets **may** arise — both hypothetical | **Yes** (primary framework candidate in company LA-09 — still a position, not attestation) | Company LA-01/LA-06/LA-09; E-01 **MISSING**; fact pack L1 establishment UNKNOWN | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **Kenya** | COMPANY POSITION: significant destination and commercial market; hotels/suppliers/programmes may be Kenya-related | **No.** Named delegates **`FUTURE / NOT CURRENTLY EVIDENCED`**. Contact `country` not censused | **No** Kenya establishment extract in repository | COMPANY POSITION: commercial/destination activity. Not evidenced as an EOS “offering to Kenyan residents” census | Not evidenced | **Unknown** (architecture). Kenya destination ≠ transfer automatically | **Yes** (company LA-03 says do not treat destination as automatic applicability — Legal must still screen) | Company LA-03; E-04/E-05 | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **EU / EEA** | COMPANY POSITION: Europe is a source market | **No** verified EU data-subject census | **No** EU establishment evidenced | COMPANY POSITION: target market. “Offering services” to people in the EU is a **legal-test fact** — **not evidenced** (no Production marketing/contract geography pack) | Production monitoring **NOT SELECTED**; systematic monitoring of EU persons **not evidenced** | **Unknown**; likely **if** EU personal data is processed and storage is outside the EEA — facts incomplete | **Yes**, **if** offering or monitoring facts are later evidenced; not automatic from the market list | Company LA-05; E-05 target market | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **United Kingdom** | COMPANY POSITION: Europe/UK source-market discussion | **No** UK census | **No** UK establishment evidenced | Same as EU: target market ≠ evidenced offering | Not evidenced | Unknown | **Yes**, separately from EU, **if** facts later support UK GDPR territorial screening | Company LA-05; counsel treats UK as distinct | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **South Africa** | COMPANY POSITION: source market | **No** | **No** | Target market only | Not evidenced | Unknown | Screening-level unless actual SA subjects/offering evidenced | Company source-market list | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **Middle East** | COMPANY POSITION: source market (region, not a single law) | **No** | **No** | Target market only | Not evidenced | Unknown | **Yes** as a **region** (multiple national laws) — do **not** treat as one statute. Deeper memo only if facts require | Company list | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **Canada** | COMPANY POSITION: source market | **No** | **No** | Target market only | Not evidenced | Unknown | Screening-level; federal/provincial complexity if facts arise | Company list | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **United States** | COMPANY POSITION: source market | **No** | **No** | Target market only | Not evidenced | Unknown | Screening-level; state laws if facts arise. Not a full US memo | Company list | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |
| **Latin America** | COMPANY POSITION: source market (region) | **No** | **No** | Target market only | Not evidenced | Unknown | **Region**, not one law. Deeper analysis only if actual markets evidenced | Company list | **REQUIRES HUMAN/DPO/LEGAL DETERMINATION** |

---

## 3. Cross-cutting factual constraints

| Constraint | Implication |
| --- | --- |
| E-01 legal entity **MISSING** | Tanzania establishment test cannot be completed |
| E-05 Layer B census **MISSING** | “Data subjects in the jurisdiction” remains unverified |
| Production hosting **NOT SELECTED** | Transfer screening cannot be completed (E-09/E-10) |
| Named delegates not structured in EOS | Do not assume traveller-residency triggers |
| Monitoring vendor **NOT SELECTED** | “Monitoring” territorial tests have no Production fact pattern |
| AI counsel TZ/KE/GDPR/UK notes | **AI COUNSEL ANALYSIS** only — not human determination |

---

## 4. What this screening does **not** do

- Conclude that Tanzania PDPA, Kenya DPA, GDPR, UK GDPR, POPIA, or any other law **applies**.
- Produce a full legal memorandum per jurisdiction.
- Select a primary legal framework (company LA-09 remains a **position**).
- Authorise Production hosting in any region.

---

## 5. Recommended next legal questions (for humans; unanswered)

1. On documented Tanzania facts (once E-01 exists), does TZ PDPA apply to EOS Production processing?
2. On Kenya facts, is there establishment, offering, or other connecting factor **beyond** destination?
3. Is there evidenced offering or monitoring of people in the EU or UK?
4. Which, if any, other source markets have **actual** contracts/contacts requiring a deeper memo?

---

## 6. Status

| Field | Value |
| --- | --- |
| Screening | **`DRAFT` · `PARTIALLY EVIDENCED`** (relevance from company position) |
| Applicability findings | **None** — all **`REQUIRES HUMAN/DPO/LEGAL DETERMINATION`** |
| Closes E-18? | **No** |
