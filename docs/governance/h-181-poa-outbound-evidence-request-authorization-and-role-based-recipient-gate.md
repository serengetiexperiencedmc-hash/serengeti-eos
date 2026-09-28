# H-181 — POA Outbound Evidence-Request Authorization and Role-Based Recipient Gate

> **GOVERNANCE / CONTROLLED OUTBOUND AUTHORIZATION**  
> Records Owner/POA authorization to collect Production-prerequisite evidence through **role-based organizational channels** where individual names are unknown.  
> **NOT** a claim that any request has been sent. **NOT** Production implementation. **NOT** legal acceptance, DPA execution, quotation acceptance, purchase, or DR test.  
> Historical ADR-0006, DP-0006, and H-170 through H-180 were **inspected and not modified**. H-177 draft **wording** was not rewritten.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 675  
**Porcelain after this increment:** 676 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP resources created:** **NONE**  
**External connectors invoked:** **NONE**  
**Requests actually sent:** **NONE**  
**Evidence received / accepted:** **NONE**  
**Commit / push:** **NONE**  
**H-182:** **NOT CREATED**

```text
H-181 STATUS = COMPLETE — OUTBOUND EVIDENCE COLLECTION AUTHORIZED; REQUESTS SENT = NONE
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Purpose

H-181 records Owner/POA decisions that:

1. authorize controlled outbound evidence collection;
2. appoint a **role-based** sender without inventing a personal name or mailbox;
3. appoint **organizational/role-based** recipients where individual names are unavailable;
4. authorize official outbound channels (not personal accounts);
5. clarify D12 legal/residency and D13 commercial/pricing **information** scope;
6. convert the H-177–H-180 package from “identity/scope unresolved / send not authorized” to **authorized for controlled outbound execution**, subject to the constraints below;
7. preserve an audit trail;
8. ensure no person, email, mailbox, contract, quotation, purchase, legal acceptance, or infrastructure is fabricated.

The absence of individual names must not unnecessarily block controlled evidence collection **where an appropriate official organizational channel exists**. Individual names are **not** mandatory where the request can be addressed to an identifiable organization or official function. Personal names, guessed personal emails, and fabricated mailbox aliases remain **forbidden**.

This Owner/POA decision is a **governance authorization**. It is **not** evidence that any external party has been contacted.

---

## 2. Governance authority

**Controlling instruction:** Owner/POA, this increment.

H-176 reserved actual sending to a later **explicit** send-authorization increment. H-178–H-180 left named persons and channels unresolved and did **not** grant send. H-181 **is** that later explicit authorization, using **roles and official corporate channels** rather than invented identities.

| Prior gate | Carried fact | H-181 effect |
| --- | --- | --- |
| H-175 | Requirements package COMPLETE; collection not executed | Unchanged as requirements; collection **authorized**, not executed |
| H-176 | Sending not authorized | **Superseded for send authorization only**; other H-176 prohibitions (purchase, legal acceptance, provisioning) **remain** |
| H-177 | H177-D01–D15 unsent drafts | Disposition in §10; wording not rewritten |
| H-178 | 15 drafts conditional on missing named contacts | Named **persons** still not invented; **roles** now appointed |
| H-179 | Outcome C — appointments not established | **Superseded** by role-based appointments below |
| H-180 | S180-S3; channel not appointed; D12/D13 informational scope | Sender/channel **role-appointed**; D12/D13 moved to controlled **information-request** authorization, not legal/commercial acceptance |

H-177 ID authority remains: **D12 = P11 legal/residency**; **D13 = P12 cost/procurement**.

---

## 3. Prior-gate references

| Artefact | Path |
| --- | --- |
| H-177 | `docs/governance/h-177-controlled-unsent-evidence-request-draft-package.md` |
| H-178 | `docs/governance/h-178-controlled-outbound-evidence-request-approval-gate.md` |
| H-179 | `docs/governance/h-179-owner-poa-sender-recipient-channel-appointment-gate.md` |
| H-180 | `docs/governance/h-180-owner-poa-outbound-identity-scope-decision-gate.md` |

The E1-B / RFP hosting-RFI mailboxes (ADR-0006 routing) are a **different** process. They are **not** adopted as the H-177 sender mailbox unless later execution evidence shows they are approved **for this activity**. They are **not** so evidenced here.

---

## 4. Owner/POA decision

| ID | Decision |
| --- | --- |
| O181-01 | Individual recipient names are **not** mandatory where an official organizational channel exists |
| O181-02 | Personal names, guessed personal emails, and fabricated aliases remain **forbidden** |
| O181-03 | Sender = role in §5; actual mailbox **TO BE CONFIRMED AT EXECUTION** |
| O181-04 | Recipients = R181-GCP, R181-LEGAL (no external legal person), R181-COMMERCIAL (§6) |
| O181-05 | Channel = official SEDMC corporate communication → official organizational GCP channel (§7) |
| O181-06 | If sender mailbox or official GCP destination cannot be established at execution, **queue** the request; do not fabricate identity |
| O181-07 | `Outbound evidence collection: AUTHORIZED`. `Requests actually sent: NONE` unless independently evidenced |
| O181-08 | D12 = authorized for controlled **information** request; **not** LEGAL APPROVED |
| O181-09 | D13 = authorized for controlled **information** request; **not** purchase/procurement |
| O181-10 | D15 remains not selected for outbound; **not** a DR-test authorization |
| O181-11 | Production implementation remains **NOT AUTHORIZED** |

---

## 5. Sender appointment

| Field | Appointment |
| --- | --- |
| Sender role | **SEDMC Commercial Director / Owner-authorized representative** |
| Personal name | **NOT APPOINTED** — not invented |
| Email / mailbox | **Actual corporate outbound mailbox: TO BE CONFIRMED AT EXECUTION** |
| RFP / E1-B mailbox | **NOT** substituted for this activity |
| Outbound scope | H-177 drafts classified in §10 as authorized for controlled outbound or controlled information request, using official corporate channel only |

This is acceptable and intentional. A placeholder mailbox is **not** treated as a confirmed address. Execution must confirm the real corporate mailbox **before** send; otherwise the item stays queued.

---

## 6. Recipient appointment

### R181-GCP

| Field | Value |
| --- | --- |
| Organization | Google Cloud / GCP |
| Recipient function | Appropriate GCP account, cloud sales, technical account, support, or official customer-contact function capable of providing the requested information |
| Individual name | **NOT REQUIRED / UNKNOWN** |
| Personal email | **NOT REQUIRED / MUST NOT BE INVENTED** |
| Approved channel | Official Google Cloud organizational / account / contact channel |
| Purpose | Production hosting evidence; Cloud SQL Enterprise Plus; Advanced DR; regional availability; `africa-south1`; `europe-west1`; backup/PITR/DR; relevant architecture and commercial **information** |

Frame every request as an **information/evidence request only**.

### R181-LEGAL

**No external legal person is appointed.**

D12 remains an informational request concerning data-residency implications; contractual/legal **documentation** relevant to the proposed architecture; provider documentation; DPA/terms **information** where relevant; material residency limitations or conditions SEDMC should review.

Every D12 request must state that:

- SEDMC is requesting **information only**;
- no legal advice is being requested or represented as received;
- no legal terms are being accepted;
- no DPA is being executed;
- no residency representation is being made by SEDMC;
- no contractual commitment is being created.

The final legal decision remains with the appropriate SEDMC Owner/legal authority. `LEGAL REVIEW REQUIREMENT REMAINS OPEN`.

### R181-COMMERCIAL

| Field | Value |
| --- | --- |
| Organization | Google Cloud / relevant official GCP commercial/account channel |
| Recipient function | Account / sales / commercial / procurement-**information** channel |
| Individual name | **UNKNOWN / NOT REQUIRED** |

No personal identity may be invented.

---

## 7. Channel appointment

**Approved outbound channel:** Official SEDMC corporate communication channel → official organizational GCP channel.

**Preference (execution time, not performed here):**

1. Official corporate email to an identifiable official GCP organizational/account contact, **if available**.
2. Otherwise an official Google Cloud contact/account/support mechanism that creates an **auditable** interaction.

**Do not use:** personal Gmail; personal WhatsApp; personal social-media accounts; guessed employee email addresses; unverified third-party contact details.

If the actual corporate sender mailbox or official GCP destination cannot be established at execution time, the request **remains queued**.

**Sending during this Cursor run:** **NOT PERFORMED.** Channel approval ≠ message sent.

---

## 8. D12 decision

**D12 — INFORMATIONAL LEGAL/RESIDENCY REQUEST: AUTHORIZED WITH CONDITIONS**

May seek factual/provider information on: regional hosting; cross-region DR; data residency; applicable provider documentation; DPA/terms **documentation**; relevant contractual **conditions** (as information).

**Conditions:** informational only; no legal commitment; no acceptance of terms; no legal conclusion; no statement that SEDMC has obtained legal clearance; no statement that Belgium residency has been legally approved beyond the existing Owner/POA **architectural** decision (H-168 in principle; H-169 DR-only `europe-west1`); any received material must be routed to a later legal review gate.

| From (H-180) | To (H-181) | Still not |
| --- | --- | --- |
| `INFORMATIONAL / REVIEW INPUT ONLY` | `AUTHORIZED FOR CONTROLLED INFORMATION REQUEST` | `LEGAL APPROVED` |

---

## 9. D13 decision

**D13 — COMMERCIAL/PRICING INFORMATION REQUEST: AUTHORIZED WITH CONDITIONS**

May seek: indicative pricing; Enterprise Plus pricing inputs; Cloud SQL sizing inputs; Advanced DR / cross-region replica cost inputs; regional pricing; backup/storage considerations; cross-region replication/data-transfer cost considerations; licensing or subscription **assumptions** (as information); commercial calculator inputs; quotation **process** requirements.

**Must not:** authorize a purchase; authorize a subscription; accept a quote; accept commercial terms; create a contract; commit company funds; select a vendor; create a procurement obligation.

| From (H-180) | To (H-181) | Still not |
| --- | --- | --- |
| `INFORMATIONAL ONLY — NO PURCHASE OR COMMERCIAL COMMITMENT AUTHORIZED` | `AUTHORIZED FOR CONTROLLED INFORMATION REQUEST` | purchase / procurement / commercial acceptance |

Obtaining live quotes remains a **later execution choice** under these conditions; H-181 does **not** itself request a quote through any live system.

---

## 10. H177 request disposition

Substantive H-177 technical requirements are **not** rewritten. Disposition only. “Authorized for controlled outbound execution” means **permitted to send** through §5–§7 once mailbox/destination are confirmed at execution — **not** that they have been sent.

| Draft | Disposition | Channel / recipient | Notes |
| --- | --- | --- | --- |
| H177-D01 | **Authorized only as internal review material** | Internal Owner/POA | P01 grant is an SEDMC decision, not a GCP ticket |
| H177-D02 | **Authorized for controlled outbound execution** (GCP account/billing **information** only) plus internal ownership model | R181-GCP / R181-COMMERCIAL | Must not create a project |
| H177-D03 | **Authorized for controlled outbound execution** | R181-GCP | PostgreSQL version **not** selected by sending |
| H177-D04 | **Authorized only as internal review material** | Internal ops/engineering | Workload figures must not be invented; not primarily a GCP identity question |
| H177-D05 | **Authorized for controlled outbound execution** | R181-GCP | PSA vs PSC **not** selected by sending |
| H177-D06 | **Authorized for controlled outbound execution** | R181-GCP | Encryption product **not** selected by sending |
| H177-D07 | **Authorized for controlled outbound execution** (product information) + internal ADR-0012 | R181-GCP | No credentials created |
| H177-D08 | **Authorized only as internal review material** | Internal directory / HUM-05 | Corporate IdP facts are not invented; GCP is not the directory source |
| H177-D09 | **Authorized only as internal review material** (app-DR design) with optional GCP Cloud Run **information** via R181-GCP | Internal engineering; optional R181-GCP | Not a deploy; RTO/RPO remain requirements |
| H177-D10 | **Authorized for controlled outbound execution** | R181-GCP | Four evidence classes preserved; architecture not implemented |
| H177-D11 | **Authorized for controlled outbound execution** | R181-GCP | `[PRODUCTION DNS NAME TO BE DETERMINED]` remains; no DNS invented |
| H177-D12 | **Authorized for controlled information request** | R181-GCP (provider docs/terms) + R181-LEGAL (no external lawyer appointed) | §8 conditions |
| H177-D13 | **Authorized for controlled information request** | R181-COMMERCIAL | §9 conditions |
| H177-D14 | **Authorized only as internal review material** | Internal Owner Session | HUM-08 names not invented |
| H177-D15 | **Not applicable / not selected for outbound** | — | §11 |

---

## 11. D15 disposition

**`NOT SELECTED FOR OUTBOUND`**

D15 is a future validation/test artefact only. It must **not** be converted into DR-test authorization. No DR test may be scheduled, requested, executed, or simulated against Production.

---

## 12. Outbound authorization

```text
Outbound evidence collection: AUTHORIZED
Requests actually sent: NONE unless independently evidenced by execution
```

This Cursor run executed **no** outbound action. Therefore:

| Item | State |
| --- | --- |
| Outbound evidence collection | **AUTHORIZED** |
| Requests actually sent | **NONE** |
| Google Cloud contacted | **NO** |
| Evidence received | **NONE** |
| Evidence accepted | **NONE** |
| Mock / simulated provider responses | **NONE** |

---

## 13. Actual-send / evidence distinction

| State | Meaning | After H-181 |
| --- | --- | --- |
| Authorized to send | Governance permission to execute through §5–§7 | **YES** (controlled) |
| Queued pending mailbox/destination | Execution blocked until identities exist without fabrication | **YES** until execution confirms them |
| Sent | Auditable outbound action occurred | **NO** |
| Received | External artefact on file | **NO** |
| Verified | Completeness/relevance reviewed | **NO** |
| Accepted | Accepted as in-scope evidence | **NO** |
| Prerequisite closed | P01–P13 closed | **NO** |

Do not claim that Google Cloud or any other external organization has been contacted merely because H-181 exists.

---

## 14. Prohibited actions (this increment and standing)

H-181 does **not** authorize and this run did **not** perform:

- inventing persons, personal emails, or mailbox aliases;
- using personal Gmail/WhatsApp/social accounts;
- substituting the RFP mailbox without activity-specific evidence;
- sending from Cursor;
- simulating provider responses;
- purchase, subscription, quote acceptance, contract, fund commitment, vendor selection, procurement obligation;
- legal advice receipt, legal-term acceptance, DPA execution, residency legal clearance;
- GCP project/instance/replica/Cloud Run/DNS/IAM/KMS/secrets creation;
- application, schema, migration, or deployment changes;
- Production implementation;
- DR testing or measured RTO/RPO claims.

RTO ≤ 4 hours and RPO ≤ 1 hour remain **business acceptance requirements**, not demonstrated performance.

---

## 15. Production-state preservation

| Topic | State |
| --- | --- |
| Production implementation | **NOT AUTHORIZED** |
| GCP Production resources | **NONE** |
| Production database / Cloud SQL instance | **NONE** |
| DR replica | **NONE** / **NOT CREATED** |
| Production data | **NONE** |
| Production credentials/secrets | **NONE** |
| Production DNS | **NONE** |
| Production deployment | **NONE** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |
| P01–P13 | **OPEN** |

---

## 16. Open items after H-181

Genuinely external or execution-dependent (not closed by this file):

- actual SEDMC corporate sender mailbox confirmation;
- actual official GCP destination/channel identification where required;
- outbound execution evidence;
- GCP responses;
- provider capability evidence;
- pricing/commercial evidence;
- legal/residency review (and any contractual documentation);
- sizing evidence;
- PostgreSQL/version compatibility evidence;
- connectivity evidence;
- encryption/KMS/secrets evidence;
- IdP/MFA evidence;
- operational ownership / HUM-08;
- later Production implementation authorization;
- later DR implementation;
- later DR validation;
- measured RTO/RPO.

---

## 17. Evidence status

| Class | Status |
| --- | --- |
| Provider documentation already cited in H-159–H-170 | Class (1) — **not** reclassified as received H-181 responses |
| Provider-specific confirmation | **NOT RECEIVED** |
| Commercial quotation | **NOT RECEIVED** |
| Legal/contractual review artefact | **NOT RECEIVED**; review remains OPEN |
| Implementation evidence | **NONE** |
| Runtime validation / measured RTO/RPO | **NONE** |

No EV-ID is marked accepted.

---

## 18. Audit trail

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 675 → 676 |
| Files this increment | this file only |
| Personal names invented | **NONE** |
| Emails invented | **NONE** |
| External send claimed | **NO** |
| Commit / push | **NONE** |

No existing H-series sequential index required an update (UAT / E1-C01 / query-plan indexes are different processes).

---

## 19. Stop conditions

```text
No email sent.
No WhatsApp sent.
No phone call.
No meeting arranged.
No provider portal submission.
No support ticket.
No quotation requested through a live system.
No legal engagement opened.
No procurement initiated.
No GCP provisioned.
No DR test performed.
No fictional external response created.
```

If execution cannot confirm the corporate sender mailbox or official GCP destination without fabrication, **queue** — do not send.

---

## 20. Final governance outcome

```text
H-181 COMPLETE
Outbound evidence collection: AUTHORIZED (role-based; conditions in §§5–9)
Requests actually sent: NONE
Evidence received: NONE
Evidence accepted: NONE
D12: AUTHORIZED FOR CONTROLLED INFORMATION REQUEST — not LEGAL APPROVED
D13: AUTHORIZED FOR CONTROLLED INFORMATION REQUEST — not purchase
D15: NOT SELECTED FOR OUTBOUND
Production: NOT AUTHORIZED / NOT READY
Item 24: OPEN
P01–P13: OPEN
```

```text
PROCESS STOPPED AFTER H-181
H-182 NOT CREATED
NEXT ACTION (not executed): human execution — confirm SEDMC corporate
  sender mailbox and official GCP destination, then send only the
  drafts disposed as outbound/information-request, or queue if those
  identities cannot be confirmed without fabrication. Responses, when
  any exist, require a later evidence-receipt/review increment.
  Do not provision GCP. Do not grant Production.
```
