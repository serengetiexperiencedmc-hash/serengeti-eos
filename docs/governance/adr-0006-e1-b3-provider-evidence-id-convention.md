# E1-B3 — Provider Evidence Identifier Convention

> **`IDENTIFIER SCHEME ONLY`**  
> **`NO EVIDENCE OBJECTS EXIST`**  
> **`DO NOT MINT IDENTIFIERS FOR NONEXISTENT EVIDENCE`**  
> **`AN IDENTIFIER MEANS ONLY: received / evidence object reference`**  
> **`AN IDENTIFIER DOES NOT MEAN: verified · accepted · compliant · suitable · preferred · selected`**  
> **`Provider UNSELECTED`** · **`Architecture UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**

**Repository calendar date:** 2026-09-16.  
**Used by:** [`adr-0006-e1-b3-provider-evidence-receipt-register.md`](adr-0006-e1-b3-provider-evidence-receipt-register.md) · [`adr-0006-e1-b3-provider-evidence-chain-of-custody.md`](adr-0006-e1-b3-provider-evidence-chain-of-custody.md) · [`adr-0006-e1-b3-provider-response-intake-template.md`](adr-0006-e1-b3-provider-response-intake-template.md) · [`adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md`](adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md)

This convention is **provider-neutral**. IDs contain **no** quality, rank, score, class-winner, or compliance token.

---

## 1. Meaning of an identifier

An assigned identifier means **only**:

**received / evidence object reference**

It does **not** mean:

- verified  
- accepted  
- compliant  
- suitable  
- preferred  
- selected  
- ranked  
- scored  
- shortlisted  
- recommended  
- contracted  
- Production-ready  

Verification status is a **separate field** (framework §H). Receipt and verification must not be collapsed.

---

## 2. Scheme

Sequential integers start at `001` **when the first genuine object is received**. They are **not** pre-allocated. `nnn` / `mmm` below are placeholders for the pattern, not minted IDs.

| Prefix | Pattern | What it identifies |
| --- | --- | --- |
| Receipt | `RCPT-nnn` | One **transmission event** (email, package, portal drop). May contain several files. |
| Submission | `SUB-nnn` | One **logical response package** from a stated party. A later clarification or supplement is a **new** `RCPT` linked to the same or a new `SUB` (see chain of custody). |
| Evidence object | `EV-SUB-nnn-mmm` | One **immutable original file or discrete artefact** inside a submission. Canonical ID. |
| Intake short alias | `EV-nn` | Local alias **inside one intake copy**, as already specified in the E1-B3 framework. **Must resolve** to exactly one `EV-SUB-nnn-mmm`. Do not use `EV-nn` as a second original. |
| Working copy | `WC-EV-SUB-nnn-mmm-k` | Derived copy used for review (e.g. extracted text). Never replaces the original. |
| Clarification ticket | `CL-nn` | Question to be asked or already asked — **not** evidence until a response is received as a new `RCPT`. Unchanged from the framework. |
| Contradiction | `CX-nn` | Recorded discrepancy. Unchanged from the framework. |
| Finding | `FN-nn` | Evaluation finding. Must cite evidence or be marked internal observation. |

**Canonical evidence reference form:**

`EV-SUB-{submission sequence}-{document sequence}`

Example **pattern only** (not assigned; no such object exists):

`EV-SUB-001-001`

That string, **if later assigned to a real file**, would mean “first document of first submission received.” It would **not** mean verified, accepted, or selected.

Do **not** embed provider names, architecture class letters as quality marks, or words such as `PASS`, `GOLD`, or `PREFERRED` in the ID.

A **filing label** for architecture class A–D may appear on an intake *copy* (framework: filing label, not selection). It is **not** part of the evidence object ID.

---

## 3. Reconciliation with existing E1-B3 IDs

| Existing framework token | This convention |
| --- | --- |
| `EV-nn` | Short alias → `EV-SUB-nnn-mmm` |
| `CL-nn` | Unchanged |
| `CX-nn` | Unchanged |
| Frozen `Q-A-01` … `Q-N-12` | Unchanged; not evidence IDs |
| Frozen `PE-01` … `PE-48` | Unchanged; not evidence IDs |

This scheme does **not** rewrite the 168 questions or PE-01–PE-48. Mapping is many-to-many: one evidence object may support several Q-IDs/PE-IDs; one Q-ID may cite several evidence objects.

---

## 4. Allocation rules

1. Mint an ID **only** when an actual object or event exists.  
2. Never reuse an ID.  
3. Never delete an ID because a later document “replaces” it — link instead (`replaces` / `replaced-by` / `clarifies` / `clarified-by` / `supplements`).  
4. Do not skip numbers to imply priority.  
5. Do not encode evaluation outcome in the ID.  
6. Independent certificates or third-party reports received **with** a provider pack still get `EV-SUB-nnn-mmm`; their **claim class** (hierarchy rank 4 vs 1–3) is a field, not an ID prefix that implies they are already verified for SEDMC.

**IDs minted in this document:** **none**.

---

## 5. Current state

No `RCPT`, `SUB`, `EV-SUB`, `WC`, `CL`, `CX`, or `FN` identifier is allocated. No provider is named. No architecture is selected.
