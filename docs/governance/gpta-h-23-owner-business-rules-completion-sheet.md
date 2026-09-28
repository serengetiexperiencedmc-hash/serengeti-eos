# GPTA-H-23 — Owner Business Rules Completion Sheet

> **`GOVERNANCE-ONLY — OWNER DECISION CAPTURE`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION STATE CHANGE`**  
> **`NO C1–C10 MODIFY`** · **`NO C11+`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:07:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Authoritative (not rewritten): [`gpta-h-16-owner-decision-and-stage-1-freeze.md`](gpta-h-16-owner-decision-and-stage-1-freeze.md) · [`gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md`](gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md) · [`gpta-h-18-c1-c10-capability-gap-analysis.md`](gpta-h-18-c1-c10-capability-gap-analysis.md) · [`gpta-h-19-owner-business-rules-resolution.md`](gpta-h-19-owner-business-rules-resolution.md) (contains GPTA-H-20 overlay, **GPTA-H-21 Owner Decision Sheet**, and GPTA-H-22 capture).

**Note:** `docs/governance/gpta-h-21-owner-business-rules-decision-sheet.md` does **not** exist as a separate file. GPTA-H-21 is the additive section inside GPTA-H-19.

```text
GPTA-H-23 STATUS = OWNER DECISION SHEET — OWNER INPUT REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
C1–C10 DEVELOPMENT = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
```

GPTA-H-22 result (unchanged): `OWNER BUSINESS RULES PARTIALLY RESOLVED — FURTHER OWNER INPUT REQUIRED`.

---

## Protected OR-04 — numerical targets

```text
OR-04 NUMERICAL TARGETS = NO NUMERICAL TARGET AUTHORIZED
```

Do **not** reopen, reinterpret, or calculate targets. The ~25 RFP / ~3 booking figures remain **unaudited Owner estimates only**.

`OR-04-FU` below is a **different** identifier (follow-up ownership). It does **not** reopen numerical targets.

---

## Decision semantics

| What appears on this sheet | Status to record |
| --- | --- |
| blank field | `OWNER DECISION REQUIRED` |
| unselected YES / NO / DEFER | `OWNER DECISION REQUIRED` |
| Owner writes `DEFER` | `OWNER DEFERRED` |
| Owner writes `NOT APPLICABLE` | `NOT APPLICABLE` |

Do **not** convert blanks into NO, DEFER, or NOT APPLICABLE. Do **not** infer from code, seed data, GPTA-H-16 freeze wording, GPTA-H-17 text, examples, or C1–C10 structures.

`C2 new_qualified` remains a technical pipeline stage. It is **not** the Owner qualification definition unless the Owner explicitly says so.

---

## Owner instructions

1. Answer only what is actually decided.  
2. Do not use examples as decisions.  
3. If a rule is not decided, leave it blank.  
4. If you intentionally want to postpone a decision, write `DEFER`.  
5. If something genuinely does not apply, write `NOT APPLICABLE`.  
6. No numerical targets are being requested because OR-04 is frozen as `NO NUMERICAL TARGET AUTHORIZED`.  
7. Completing this sheet does **NOT** authorize software implementation.

> Completing this sheet does **not** authorize modifying or rebuilding C1–C10, creating C11+, database changes, migrations, UAT, Production, procurement, vendors, advertising spend, or digital campaigns. A later governance decision is required.

---

## Identifier crosswalk (historical H-19 / H-21 → this sheet)

| This sheet | Historical H-19 / H-21 field |
| --- | --- |
| OR-01-A–F | OR-01-A–F |
| OR-02-A–G | OR-02-A–G |
| OR-03 / OR-03-PCO / OR-03-M | OR-03 / OR-03-PCO / OR-03-M |
| OR-04 numerical targets | OR-04 (`NO NUMERICAL TARGET AUTHORIZED`) |
| OR-04-FU | Follow-up ownership (OR-FU) |
| OR-05 | Proposal-send role |
| OR-06 | Proposal approval role |
| OR-07 | Channel / source mix |
| OR-08 | Supplier-rate practice |

No new GPTA-H-17 requirements are created by these identifiers.

---

# OR-01 — Qualified RFP definition

## OR-01-A — Definition

**What must be true before an enquiry/RFP is considered a QUALIFIED RFP?**

Owner answer:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-01-B — Qualification conditions

**Which conditions must be present for an RFP to become qualified?**

Owner answer (write the actual conditions):

```text
[ ]
```

The following are **`EXAMPLE — NOT A DECISION`** only. Do not treat ticks as a pre-selected rule:

* client/buyer identified  
* travel/event dates known  
* destination known  
* estimated group size known  
* programme requirement sufficiently defined  
* budget known  
* decision-maker identified  
* decision timeline known  
* genuine opportunity confirmed  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-01-C — Qualification authority

**Who has authority to mark an RFP as qualified?**

Role / title:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-01-D — Qualification timing

**At what point in the current workflow should qualification occur?**

Owner answer:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-01-E — Qualification evidence

**What evidence must exist before an RFP can be marked qualified?**

Owner answer:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-01-F — Qualification changes

**Can qualification status subsequently change? If yes, under what circumstances and who may change it?**

Owner answer:

```text
[ ]
```

Optional explicit choice (leave unselected unless deciding):

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If YES — who may change it, and under what circumstances:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

# OR-02 — Loss reasons

## OR-02-A — Loss reason catalogue

**What official loss reasons should SEDMC use when an RFP does not become a booking?**

The catalogue is **empty**. Do **not** invent reasons. The Owner may add or remove rows.

| Code | Loss reason | Description | Owner decision |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-B — Multiple loss reasons

**Can one RFP have more than one loss reason?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-C — Other reason

**Should an `OTHER` loss reason be permitted?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-D — Other explanation

If OTHER is permitted: **Must the user provide a free-text explanation?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-E — Responsibility

**Who is responsible for recording the final loss reason?**

Role / title:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-F — Finalization timing

**At what point is the loss reason considered final?**

Owner answer:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

## OR-02-G — Changes

**Can a finalized loss reason be changed? If yes, who may change it and under what circumstances?**

Owner answer:

```text
[ ]
```

Optional explicit choice (leave unselected unless deciding):

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If YES — who may change it, and under what circumstances:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

# OR-03 — Account taxonomy

## OR-03 — Account classification

**What account/customer classification taxonomy should SEDMC use?**

> GPTA-H-16's "South African incentive agencies" is the frozen first-market/buyer selection. It does **not** itself define the account taxonomy.

Owner-defined classes (blank; not pre-populated):

| Classification | Business definition | Owner decision |
| --- | --- | --- |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

**Status:** `OWNER DECISION REQUIRED`

---

## OR-03-PCO

**Should PCO be a distinct account/buyer classification in the commercial taxonomy?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If YES — what SEDMC means by PCO for this classification:

```text
[ ]
```

Do **not** infer from GPTA-H-16. This does **not** authorize a `pco` seed key or any technical change.

**Status:** `OWNER DECISION REQUIRED`

---

## OR-03-M — Market vs buyer

**Should "market" and "buyer/account type" be stored as separate classifications?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If deciding the lists, write them. Do **not** pre-populate.

`MARKET = __________________`

`BUYER / ACCOUNT TYPE = __________________`

**Status:** `OWNER DECISION REQUIRED`

---

# OR-04-FU — Follow-up ownership

**Who owns follow-up after a proposal/RFP has been sent?**

Primary responsible role:

```text
[ ]
```

Transfer / delegation rule:

```text
[ ]
```

Escalation / backup role, if any:

```text
[ ]
```

Do **not** invent role names.

**Status:** `OWNER DECISION REQUIRED`

---

# OR-05 — Proposal send authority

**Who is authorized to send the commercial proposal/financial proposal to the client?**

Role / title:

```text
[ ]
```

Do **not** assume C7 is the current send process.

**Status:** `OWNER DECISION REQUIRED`

---

# OR-06 — Proposal approval authority

**Who must approve the proposal before it is sent, if approval is required?**

Proposal send (OR-05) and proposal approval (OR-06) are **not** assumed to be the same role.

Is approval required?

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

Approving role / title:

```text
[ ]
```

Circumstances requiring approval, if applicable:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

# OR-07 — Channel / source classification

**What official channel/source categories should SEDMC use to identify where an enquiry/RFP originated?**

The catalogue is **empty**. Do **not** invent the final catalogue.

| Code | Channel / source | Definition | Owner decision |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

**`EXAMPLE — NOT A DECISION`:** referral; existing account; trade show; LinkedIn; website/SEO; Google Ads; Instagram; direct corporate enquiry; partner/travel agency; other.

Can one RFP have more than one source?

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If YES — which source is considered primary:

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

# OR-08 — Supplier rate governance

Describe **actual current practice**, not a designed technical solution.

### 1. Rate source

**Where do supplier rates come from?**

```text
[ ]
```

### 2. Season

**How is seasonality represented?**

```text
[ ]
```

### 3. Validity

**How are rate validity dates handled?**

```text
[ ]
```

### 4. Currency

**How is supplier currency recorded?**

```text
[ ]
```

### 5. Verification

**How are supplier rates verified?**

```text
[ ]
```

### 6. Verification frequency

**How often are rates checked?**

```text
[ ]
```

### 7. Negotiated vs public

**Does the business process distinguish negotiated rates from public rates?**

- [ ] YES  
- [ ] NO  
- [ ] DEFER  

If YES, explain:

```text
[ ]
```

### 8. Ownership

**Who is responsible for maintaining/validating rates?**

```text
[ ]
```

**Status:** `OWNER DECISION REQUIRED`

---

# Traceability register

No new GPTA-H-17 requirements are created here.

| Owner rule | Business requirement / acceptance criteria | Status |
| --- | --- | --- |
| OR-01 | BR-001 / PR-009 / DR-002 / DR-B02 / KR-D02 / KR-S03 / AC-002 | OWNER INPUT REQUIRED |
| OR-02 | BR-006 / PR-006 / DR-005 / DR-B12 / AC-007 | OWNER INPUT REQUIRED |
| OR-03 | BR-005 / DR-008 / AC-010 / MR-005 | OWNER INPUT REQUIRED |
| OR-03-PCO | Account taxonomy dependency | OWNER INPUT REQUIRED |
| OR-03-M | Market/buyer classification dependency | OWNER INPUT REQUIRED |
| OR-04 numerical targets | BR-009 / KR-* / AC-009 | RESOLVED — NO NUMERICAL TARGET AUTHORIZED |
| OR-04-FU | Follow-up ownership dependency | OWNER INPUT REQUIRED |
| OR-05 | Proposal-send authority dependency | OWNER INPUT REQUIRED |
| OR-06 | Proposal approval dependency | OWNER INPUT REQUIRED |
| OR-07 | Channel/source dependency | OWNER INPUT REQUIRED |
| OR-08 | Supplier-rate governance dependency | OWNER INPUT REQUIRED |

---

# GPTA-H-23 status

This sheet contains **questions and blank fields only**. Owner answers were **not** supplied in this instruction. Business rules are **not** marked resolved.

```text
GPTA-H-23 STATUS = OWNER DECISION SHEET PREPARED — OWNER INPUT REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = OWNER TO COMPLETE GPTA-H-23
```
