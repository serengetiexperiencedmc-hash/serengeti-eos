# H-180 — Owner/POA Outbound Identity & Scope Decision Gate

> **GOVERNANCE / INTERNAL IDENTITY–CHANNEL–SCOPE ONLY**  
> Resolves, to the extent the repository supports, internal decisions on sender, sender address, recipient, channel, and D12/D13 scope.  
> **NOT** send authorization. **NOT** sending. **NOT** external contact. **NOT** evidence collection. **NOT** quotation, negotiation, legal/commercial acceptance, or Production implementation.  
> Historical ADR-0006, DP-0006, H-170 through H-179 were **inspected and not modified**. H-177 drafts were **not** rewritten.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 674  
**Porcelain after this increment:** 675 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal engagement / purchase / quotation:** **NONE**  
**External connectors invoked:** **NONE**  
**Evidence requests sent:** **NONE**  
**Evidence received / accepted:** **NONE**  
**Commit / push:** **NONE**  
**H-181:** **NOT CREATED**

```text
H-180 STATUS = COMPLETE — IDENTITY UNRESOLVED; D12/D13 SCOPE CLASSIFIED; SEND NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

Lifecycle: H-180 addresses only the internal identity/channel/scope layer. It does **not** authorize sending.

`who could send` / `where from` / `who could receive` / `through which channel` / `what internal scope applies`  
≠  
`authorization to send` / `evidence collection` / `quotation` / `procurement` / `legal acceptance` / `Production implementation`

The next send-authorization gate remains **separate** and is **not** this increment.

**H-177 ID authority:** H177-D12 is legal/residency (P11). H177-D13 is cost/procurement (P12). Scope decisions below follow those IDs, not swapped labels.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 674 (matches H-179 after-count) |
| H-179 path | `docs/governance/h-179-owner-poa-sender-recipient-channel-appointment-gate.md` |
| H-179 outcome | **C — APPOINTMENTS NOT ESTABLISHED** |

---

## 2. H-179 confirmation (not rewritten)

| H-179 fact | Confirmed |
| --- | --- |
| Outcome C | **YES** |
| Sender appointed | **NO** |
| Recipient appointed | **NO** |
| Channel appointed | **NO** |
| D01–D11 and D14 | `CANDIDATE FOR FUTURE SEND` |
| D12 / D13 | `REQUIRES INTERNAL REVIEW` |
| D15 | `NOT SELECTED FOR OUTBOUND` |
| Send authorization | **NOT GRANTED** |

No new named outbound identity has appeared in the repository since H-179.

---

## 3. Sender decision

**S180-S3 — NOT APPOINTED**

A valid outbound sender appointment requires: identifiable real person; role/authority; **actual communication identity**; authorized outbound scope.

| Candidate | Finding |
| --- | --- |
| Git / repository owner | **Not used** |
| H-125 **PDM** Owner signatory | Internal Owner accountability. **Not** converted automatically into an outbound sender (H-179; this increment). No mailbox or email is on file for H-177 sends |

No person **and** authorized communication identity are jointly supported for H-177 outbound use. A placeholder is **not** treated as an appointment.

---

## 4. Recipient decision

No email, account manager, legal adviser, DPO, or procurement contact is invented. Generic roles are not named recipients.

| Audience | Organization known? | Person / routable destination | Outcome |
| --- | --- | --- | --- |
| Provider technical (selected hosting direction H-158/H-169) | **Google Cloud / GCP** as selected **provider organization** | **NO** | **R180-R2** — organization known; person/destination unresolved |
| Commercial / procurement | Not as a named contracting counterparty on file for H-177 | **NO** | **R180-R3** |
| Legal / compliance (D12) | Not as an appointed H-177 destination. E1-C01 counsel is a **different** process | **NO** | **R180-R3** |
| Internal SEDMC (D01, D02, D04, D08, D14) | SEDMC as the company | **NO** named internal recipient for these drafts | **R180-R3** (person unresolved) |

**R180-R1** is **not** used. H-180 cannot manufacture an external identity.

---

## 5. Channel decision

**Status: `NOT APPOINTED`**

Corporate email, provider portal, and support mechanisms are **candidates in the abstract**. None is evidenced as authorized **for this H-177 process**. Convenience is not approval. No channel was invoked. No message was sent.

**SEND AUTHORIZATION REMAINS NOT GRANTED** even if a later increment approves a channel for future use.

---

## 6. D12 — legal / residency scope (H177-D12, P11)

H177-D12 seeks review of Johannesburg primary residency and the Belgium DR exception. It does **not** state that Belgium is legally approved.

| Mode | H-180 classification |
| --- | --- |
| Information / review request | **YES** — documentation and factual clarification for later counsel |
| Legal advice | **Not obtained** and **not** requested by this increment |
| Legal acceptance | **NOT** recorded |

**Decision:** `INFORMATIONAL / REVIEW INPUT ONLY`

Also: `LEGAL REVIEW REQUIREMENT REMAINS OPEN`

Not claimed: legal approval; DPA approval; regulatory approval; contractual acceptance; residency approval. No legal adviser invented.

**INTERNAL COMMERCIAL/LEGAL SCOPE CONTROL REQUIRED** remains until a named legal destination and a later send grant exist. D12 is **not** cleared for outbound use.

---

## 7. D13 — commercial / cost scope (H177-D13, P12)

H177-D13 identifies calculator **inputs** and quotation **requirements**. It is **not** a quotation and H-176 still forbids obtaining quotes.

| Mode | H-180 classification |
| --- | --- |
| Information request | **YES** — factual cost-category / input identification |
| Procurement | **NO** |
| Commercial acceptance | **NO** |

**Decision:** `INFORMATIONAL ONLY — NO PURCHASE OR COMMERCIAL COMMITMENT AUTHORIZED`

No quotation was requested through an external system. No purchase. No pricing accepted. No SEDMC commitment. No cost figures invented.

Obtaining live quotations remains **NOT AUTHORIZED**. D13 is **not** cleared for outbound use. **INTERNAL COMMERCIAL/LEGAL SCOPE CONTROL REQUIRED** remains for any future send that would seek quotes.

---

## 8. D15

**`NOT SELECTED FOR OUTBOUND — NOT A DR-TEST AUTHORIZATION`**

No DR test may be scheduled, requested, executed, simulated against Production, or represented as authorized.

---

## 9. Owner/POA decision register

| Decision ID | Question | Decision | Evidence basis | Scope | Status |
| --- | --- | --- | --- | --- | --- |
| O180-01 | Outbound sender person | **S180-S3 — NOT APPOINTED.** PDM is not auto-converted | H-125; H-179; no H-177 outbound appointment | Internal identity only | **OPEN — OWNER/POA INPUT REQUIRED** |
| O180-02 | Sender communication identity / mailbox | **NOT APPOINTED.** None invented | No authorized address on file for this process | Outbound address | **OPEN — OWNER/POA INPUT REQUIRED** |
| O180-03 | Recipient strategy | Provider **organization** = GCP (H-158/H-169) as direction only. **R180-R2** for that org; **R180-R3** for named persons and for legal/commercial destinations | H-158/H-169; H-179 | Recipients | Organization direction recorded; **person/destination OPEN — OWNER/POA INPUT REQUIRED** |
| O180-04 | Communication channel | **NOT APPOINTED** | H-179; no process-specific channel evidence | Channel | **OPEN — OWNER/POA INPUT REQUIRED** |
| O180-05 | H177-D13 commercial scope (P12) | `INFORMATIONAL ONLY — NO PURCHASE OR COMMERCIAL COMMITMENT AUTHORIZED` | H-177-D13; H-176 quotes not authorized | Commercial | **DECIDED — LIMITED GOVERNANCE SCOPE** (not send clearance) |
| O180-06 | H177-D12 legal scope (P11) | `INFORMATIONAL / REVIEW INPUT ONLY`; `LEGAL REVIEW REQUIREMENT REMAINS OPEN` | H-177-D12; H-168/H-169 exception not legal acceptance | Legal | **DECIDED — LIMITED GOVERNANCE SCOPE** (not send clearance; legal review OPEN) |
| O180-07 | H177-D15 | `NOT SELECTED FOR OUTBOUND — NOT A DR-TEST AUTHORIZATION` | H-177-D15; H-178; H-179 | Validation | **DECIDED** |

No decisions were fabricated for missing identities.

---

## 10. Draft-specific identity matrix

| Draft | Sender | Recipient | Channel | Scope status | Future-send status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| H177-D01 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | Internal governance | CANDIDATE FOR FUTURE SEND | P01; unsent |
| H177-D02 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | Not project create | CANDIDATE FOR FUTURE SEND | P02 |
| H177-D03 | S180-S3 NOT APPOINTED | R180-R2 (GCP org; destination unresolved) | NOT APPOINTED | Version not selected | CANDIDATE FOR FUTURE SEND | P03 |
| H177-D04 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | No invented numbers | CANDIDATE FOR FUTURE SEND | P04 |
| H177-D05 | S180-S3 NOT APPOINTED | R180-R2 (GCP org; destination unresolved) | NOT APPOINTED | Path not selected | CANDIDATE FOR FUTURE SEND | P05 |
| H177-D06 | S180-S3 NOT APPOINTED | R180-R2 (GCP org; destination unresolved) | NOT APPOINTED | Product not selected | CANDIDATE FOR FUTURE SEND | P06 |
| H177-D07 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | No credentials | CANDIDATE FOR FUTURE SEND | P07 |
| H177-D08 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | Tenant not invented | CANDIDATE FOR FUTURE SEND | P08 |
| H177-D09 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | Not deploy | CANDIDATE FOR FUTURE SEND | P09 |
| H177-D10 | S180-S3 NOT APPOINTED | R180-R2 (GCP org; destination unresolved) | NOT APPOINTED | Not implementation | CANDIDATE FOR FUTURE SEND | P14 context |
| H177-D11 | S180-S3 NOT APPOINTED | R180-R2 / R180-R3 mixed (DNS dest unknown) | NOT APPOINTED | No DNS created | CANDIDATE FOR FUTURE SEND | P10 |
| H177-D12 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | `INTERNAL COMMERCIAL/LEGAL SCOPE CONTROL REQUIRED`; informational/review only; legal review OPEN | REQUIRES INTERNAL REVIEW | P11; **not** outbound-cleared |
| H177-D13 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | `INTERNAL COMMERCIAL/LEGAL SCOPE CONTROL REQUIRED`; informational only; no purchase | REQUIRES INTERNAL REVIEW | P12; **not** outbound-cleared |
| H177-D14 | S180-S3 NOT APPOINTED | R180-R3 | NOT APPOINTED | Names not invented | CANDIDATE FOR FUTURE SEND | P13 |
| H177-D15 | S180-S3 NOT APPOINTED | N/A | NOT APPOINTED | `NOT SELECTED FOR OUTBOUND — NOT A DR-TEST AUTHORIZATION` | NOT SELECTED FOR OUTBOUND | P19/P20 |

---

## 11. Contact control

| Required contact | Actual identity | Evidence | Status |
| --- | --- | --- | --- |
| Outbound sender | None | H-125 PDM not converted | **NOT APPOINTED** |
| Provider recipient | None (org direction: GCP) | H-158/H-169 organization only | **NOT APPOINTED** (person/destination) |
| Commercial recipient | None | None | **NOT APPOINTED** |
| Legal/compliance recipient | None | E1-C01 not reused | **NOT APPOINTED** |

No fictional identities.

---

## 12. Channel control

| Channel | Purpose | Status | Evidence | Sending permitted? |
| --- | --- | --- | --- | --- |
| Corporate email | Possible future H-177 send | **NOT APPOINTED** | None for this process | **NO** |
| Provider portal | Possible future provider evidence | **NOT APPOINTED** | None | **NO** |
| Support mechanism | Possible future provider evidence | **NOT APPOINTED** | None | **NO** |
| Other | — | **NOT APPOINTED** | None | **NO** |

---

## 13. Send-authorization separation

H-180 **may** establish who could send, where from, who could receive, through which channel, and what internal scope applies. It **did** classify D12/D13/D15 scope. It **did not** appoint sender address, named recipients, or a channel.

H-180 does **NOT** establish: authorization to send; evidence-collection authorization; quotation authorization; procurement authorization; legal acceptance; Production implementation authorization.

---

## 14. P01–P13

| P | Status |
| --- | --- |
| P01–P13 | **OPEN** |

No EV-ID accepted. No evidence recorded as received.

---

## 15. Production state (unchanged)

| Topic | State |
| --- | --- |
| GCP resources | **NONE** |
| Production data | **NONE** |
| Implementation authorization | **NOT AUTHORIZED** |
| DR replica | **NOT CREATED** |
| DR testing | **NOT PERFORMED** |
| Measured RTO/RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

---

## 16. Absolute no-action control

```text
No email sent.
No WhatsApp sent.
No phone call.
No meeting arranged.
No provider portal submission.
No support ticket.
No quotation request.
No legal engagement.
No procurement.
No GCP action.
No Production action.
No DR action.
No external connector invoked.
Send authorization NOT GRANTED.
```

---

## 17. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 674 → 675 |
| Files changed this increment | `docs/governance/h-180-owner-poa-outbound-identity-scope-decision-gate.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-180
H-181 NOT CREATED
NEXT GATE (not executed): Owner/POA must still supply a named outbound
  sender (person + authorized communication identity), named routable
  recipients, and an approved channel. D12/D13 scope is classified as
  informational only; they remain not outbound-cleared. A subsequent
  explicit send-authorization gate remains mandatory even after those
  appointments. P01–P13 remain OPEN.
```
