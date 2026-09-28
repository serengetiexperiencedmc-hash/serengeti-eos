# GPTA-H-70 — Operational Evidence Access Owner Decision

> **`OWNER DECISION RECORD`**  
> **`DECISIONS RECORDED UNDER COMPANY POA`**  
> **`CONTROLLED ACCESS APPROVED — MODEL B`**  
> **`NOT VALIDATION EXECUTION`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO CONNECTORS / INGEST / MIGRATION`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Pack created:** **2026-09-18T23:28:00+03:00** (fields then `OWNER DECISION REQUIRED`).  
**Decisions recorded:** **2026-09-18T23:33:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-70 STATUS = OPERATIONAL EVIDENCE ACCESS OWNER DECISION COMPLETED

H-70 RECORD = COMPLETED
OWNER DECISION STATUS = DECISIONS RECORDED UNDER COMPANY POA
OPERATIONAL EVIDENCE ACCESS = CONTROLLED ACCESS APPROVED — MODEL B
VALIDATION EXECUTION = NOT YET EXECUTED
COMMERCIAL PROCESS VALIDATION = NOT YET EXECUTED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

```text
ACCESS AUTHORIZATION = APPROVED
ACTUAL EVIDENCE AVAILABLE = TO BE ESTABLISHED DURING H-71 PREPARATION/EXECUTION
```

H-70 authorizes **access preparation / controlled evidence review** for the next validation gate. It does **not** execute commercial-process validation. Actual evidence has **not** been accessed merely because access is now approved.

---

## Owner decision authority

The decisions below are recorded as **authorized company decisions** under the previously granted company power of attorney held by:

**Patrick Makundi**

Role for this governance process:

- Commercial decision authority under the granted POA;
- Technical Increment Owner;
- UAT Authority.

The combined Technical Increment Owner / UAT role does **NOT** mean Patrick is the custodian of every evidence source.

Evidence custodians / providers remain the relevant commercial / operational source owners.

This record does **not** invent a POA instrument number, date, or legal opinion. It records the Owner instruction that these H-70 decisions are made under that previously granted POA.

---

## Controlling sequence

H-66 → H-67 → H-68 → H-69 → **H-70** (pack then decisions)

| Record | Role |
| --- | --- |
| H-66 | Option C — process validation before further software |
| H-67 | Execution readiness |
| H-68 | Execution **blocked** — operational evidence not accessible; 0 cases |
| H-69 | Blocker review; this Owner decision |
| H-70 pack (earlier same day) | Decision pack with all rows `OWNER DECISION REQUIRED` |
| **H-70 decisions (this amendment)** | Decisions recorded under company POA |

H-64 / H-65 / H-66 / H-67 / H-68 / H-69 historical bodies are **not overwritten**.

---

## Decision A — Evidence sources permitted

Approval is for **controlled evidence review** for the specific commercial-process validation. It is **NOT** approval for system integration, automated ingestion, production access, migration, or operational adoption.

| Evidence source | Owner decision | Handling | Conditions |
| --- | --- | --- | --- |
| Excel / Office trackers | **APPROVED** | **Model B** | Controlled temporary review; original files stay outside the repository |
| Outlook / Gmail | **APPROVED — selected case correspondence only** | **Model B** | Selected cases only; no mailbox ingest; no connector |
| WhatsApp | **APPROVED — selected case correspondence only** | **Model B** | Selected cases only; no full-history copy; no connector |
| Telephone logs | **APPROVED — summary evidence where available** | **Model B** | Summary where available; `CATEGORY NOT AVAILABLE` if logs do not exist |
| Proposal / commercial files | **APPROVED — selected cases** | **Model B** | Selected cases; do not copy complete contracts into the repository |
| Case-linked supplier quotations | **APPROVED — selected cases** | **Model B** | Selected cases; no FX inference |
| Booking / contract records | **APPROVED — selected cases** | **Model B** | Selected cases; do not copy complete contracts into the repository |
| Internal commercial records | **APPROVED — selected cases** | **Model B** | Selected cases; owner/SOURCE/CHANNEL/OR-01/loss as evidenced |

**Owner-approved:** all eight sources, under Model B and the conditions above.  
**Owner-declined:** none.  
**Owner-deferred:** none.  
**Still blocked:** none at the *authorization* layer. A specific source may still be `ACCESS REMAINS BLOCKED — SPECIFIC SOURCE RESTRICTION` if a legal/privacy restriction cannot be resolved through minimization/redaction **during H-71**.  
**Not applicable:** none established until H-71 tests whether telephone logs or a category actually exist.

---

## Handling model

```text
OWNER DECISION = MODEL B — CONTROLLED TEMPORARY REVIEW
```

Model B rules:

1. Original operational evidence remains outside the EOS repository.
2. Evidence may be reviewed temporarily in a controlled manner.
3. Only validation-relevant observations should be recorded.
4. Original source documents must not be imported into EOS.
5. No automatic ingestion is authorized.
6. No connector implementation is authorized.
7. No operational-data migration is authorized.
8. No production access is authorized.
9. Evidence provenance must remain identifiable.
10. Retrospective reconstruction must be distinguished from contemporaneous evidence.

---

## Confidentiality / privacy decision

```text
OWNER DECISION = CONTROLLED MINIMIZATION / REDACTION REQUIRED
```

Apply:

- Minimize personal information.
- Redact unnecessary names / contact details where they are not needed for validation.
- Do not expose passwords, credentials, payment information, or unrelated personal financial information.
- Do not copy complete client correspondence into the repository merely for convenience.
- Do not copy complete contracts into the repository.
- Do not copy complete WhatsApp histories into the repository.
- Review only the portions necessary to establish the relevant commercial fact.
- Preserve sufficient provenance to establish that the evidence is genuine.
- If a source contains information that cannot appropriately be reviewed, do not circumvent the restriction; mark that evidence category as blocked.

No legal conclusion is made. No privacy policy is invented beyond this Owner control set.

Where a particular source has a legal/privacy restriction that cannot be resolved through minimization/redaction:

```text
ACCESS REMAINS BLOCKED — SPECIFIC SOURCE RESTRICTION
```

---

## Evidence owners / custodians

Do not invent personal names.

```text
EVIDENCE PROVIDER / CUSTODIAN = RELEVANT COMMERCIAL / OPERATIONAL SOURCE OWNER OR CUSTODIAN — TO PROVIDE
```

| Role | Person / status |
| --- | --- |
| Evidence provider / custodian | **RELEVANT COMMERCIAL / OPERATIONAL SOURCE OWNER OR CUSTODIAN — TO PROVIDE** |
| Validator | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| UAT Authority | **Patrick Makundi** |
| Governance authority | Company Owner / POA authority as already established (**Patrick Makundi** under granted POA for these decisions) |

Patrick is **not** automatically custodian of every source.

| Evidence category | Named provider | Evidence custodian | Validation access responsibility | Status |
| --- | --- | --- | --- | --- |
| RFP / enquiry | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| Clarification | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| Proposal | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| Won booking | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| Lost / deferred opportunity | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| Existing / repeat client | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |
| New / prospect account | Relevant commercial / operational source owner or custodian — to provide | Same — to provide | Validator: Patrick Makundi | **OPEN — TO PROVIDE** |

---

## Minimum viable validation package

**Authorized for assembly** (evidence-selection categories, **not** synthetic test records):

1. One real RFP / opportunity.
2. One real clarification exchange.
3. One real proposal.
4. One real won booking.
5. One real lost / deferred opportunity.
6. One existing-client / repeat example, **if available**.
7. One new / prospect example, **if available**.

Do **not** use: F2 demo seed; UAT demo data; fabricated opportunities / proposals / bookings; the historical ~25 / ~3 / ~12% estimate as test data.

If a category genuinely does not exist:

```text
CATEGORY NOT AVAILABLE
```

```text
MINIMUM EVIDENCE PACKAGE STATUS = AUTHORIZED FOR ASSEMBLY — NOT YET ASSEMBLED
```

All seven categories remain unassembled until H-71 preparation. They are **not** converted to available merely by this authorization.

---

## Validation authorization boundary

```text
H-70 = OWNER DECISION COMPLETED
COMMERCIAL PROCESS VALIDATION = NOT YET EXECUTED
VALIDATION EXECUTION = NOT YET EXECUTED
```

The next gate may proceed **only after** the approved evidence has actually been assembled and made available for review under Model B.

---

## Future software boundary

**NOT AUTHORIZED:**

- Gmail connector;
- Outlook connector;
- WhatsApp connector;
- telephone-log integration;
- Excel importer;
- Office-document ingestion;
- supplier integration;
- booking integration;
- historical KPI ingestion;
- mailbox ingestion;
- automatic data synchronization;
- F2-I12;
- subsequent implementation increment;
- production deployment;
- production migration;
- operational EOS adoption.

Access difficulty must **not** be converted into a software-development mandate.

---

## Owner Decision Record

| Field | Value |
| --- | --- |
| Owner Decision Status | **DECISIONS RECORDED UNDER COMPANY POA** |
| Evidence Access Decision | **CONTROLLED ACCESS APPROVED — MODEL B** |
| Approved Evidence Sources | Excel/Office; Outlook/Gmail (selected correspondence); WhatsApp (selected correspondence); telephone logs (summary where available); proposal/commercial files (selected); case-linked quotations (selected); booking/contract records (selected); internal commercial records (selected) |
| Declined Evidence Sources | **None** |
| Deferred Evidence Sources | **None** |
| Handling Model by Source | **Model B** for all approved sources |
| Privacy / Confidentiality Decision | **CONTROLLED MINIMIZATION / REDACTION REQUIRED** |
| Named Evidence Owners | **RELEVANT COMMERCIAL / OPERATIONAL SOURCE OWNER OR CUSTODIAN — TO PROVIDE** (names not invented) |
| Validator | **Patrick Makundi** |
| Validation Access Conditions | Model B rules 1–10; selected cases; no ingest; no production access |
| Minimum Evidence Package Status | **AUTHORIZED FOR ASSEMBLY — NOT YET ASSEMBLED** |
| Actual evidence available | **TO BE ESTABLISHED DURING H-71 PREPARATION/EXECUTION** |
| H-70 Exit Status | **RECORD COMPLETED — DECISIONS RECORDED — VALIDATION NOT EXECUTED** |
| Next Gate | **GPTA-H-71 — CONTROLLED COMMERCIAL PROCESS VALIDATION EXECUTION** |

H-71 may begin **only after** the minimum viable evidence package is actually assembled and accessible under Model B controls. **H-71 is not executed in this task.**

---

## Required non-claims

H-70 does **NOT**:

- execute commercial validation;
- establish that actual evidence is already in the validator’s hands;
- approve operational adoption;
- approve F2-I12;
- authorize another software increment;
- authorize production;
- authorize production data access;
- authorize migration;
- authorize connectors;
- authorize mailbox ingestion;
- authorize WhatsApp integration;
- replace the H-29 business rules;
- replace the approved SoR;
- replace the F2 preview baseline;
- replace the H-64 dispositions;
- authorize replacement of the legacy 250k/20% commercial gate.

---

## Resumption criteria for H-71 (still apply)

H-71 execution still requires that:

1. at least one authorized evidence-access path exists (**now authorized** — Model B);
2. evidence has a named provider / custodian (**role defined; individuals still TO PROVIDE**);
3. the handling model is approved (**Model B**);
4. confidentiality / privacy requirements are resolved sufficiently for Model B (**minimization/redaction recorded; source-specific legal block remains possible**);
5. evidence can be tied to real commercial cases (**to be established when assembled**);
6. provenance can be distinguished from retrospective reconstruction;
7. the minimum viable evidence diversity can be assessed (**package authorized, not assembled**);
8. no manufactured demo / UAT data is substituted;
9. review occurs without unauthorized production access;
10. validation remains within H-66 commercial-process scope.

Items 5 and 7 are **not yet satisfied**. Therefore validation is **not** started here.

---

## Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — pre-existing Class A/B and F2-I1–I11 **preserved** |
| This task | H-70 amended + additive pointer updates only |
| Operational evidence newly accessed | **No** |
| Application / schema / persist / infrastructure | **NOT MODIFIED** |
| Tests run | **NONE** |
| Staged | **NONE** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

```text
NEXT GATE = GPTA-H-71 — CONTROLLED COMMERCIAL PROCESS VALIDATION EXECUTION
H-71 MAY BEGIN ONLY AFTER THE MINIMUM VIABLE EVIDENCE PACKAGE IS ACTUALLY ASSEMBLED AND ACCESSIBLE UNDER MODEL B
APPLICATION NEXT_INCREMENT = NONE AUTHORIZED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

```text
GPTA-H-70 STATUS = OPERATIONAL EVIDENCE ACCESS OWNER DECISION COMPLETED
```
