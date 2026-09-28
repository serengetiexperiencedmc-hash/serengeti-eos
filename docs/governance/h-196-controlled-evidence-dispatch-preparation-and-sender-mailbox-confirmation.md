# H-196 — Controlled Evidence Dispatch Preparation and Sender-Mailbox Confirmation

> **GOVERNANCE / DISPATCH PREPARATION ONLY.**  
> Records the Owner/POA-confirmed sending arrangement and prepares the seven H-181-eligible H-177 drafts for **manual, controlled** dispatch.  
> **Does not** send. **Does not** contact Google Cloud. **Does not** re-authorize or expand H-181.  
> **Does not** claim delegated-send / send-as permission exists.  
> H-169 through H-195 were **inspected and not rewritten**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 711 (H-195 start 709; H-195 final 711)  
**Outbound communications this increment:** **NONE**  
**Evidence received / accepted:** **NONE**  
**GCP / Production implementation:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-196 STATUS = COMPLETE
REQUESTS SENT = NONE
EVIDENCE RECEIVED = NONE
EVIDENCE ACCEPTED = NONE
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
AUTHORIZED SENDER IDENTITY = rfp@serengetiexperiencedmc.com
SENDING MAILBOX = info@serengetiexperience.com
DELEGATED-SEND / SEND-AS PERMISSION = NOT EVIDENCED — REQUIRES CONFIRMATION
GCP ROUTABLE RECIPIENT / OFFICIAL CHANNEL = PENDING
OPERATOR = PENDING EXECUTION-TIME CONFIRMATION
EXECUTION TIMESTAMP = PENDING
DISPATCH STATUS = NOT READY — GCP RECIPIENT/CHANNEL AND EXECUTION CONTROLS PENDING
```

---

## 1. Repository baseline and preservation

| Item | Observed |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | **711** |
| Dirty worktree | **preserved** — no reset, clean, stash, revert, discard, or overwrite of unrelated files |
| H-195 status | **COMPLETE** |
| H-195 final porcelain | 711 |

Existing dirty-lineage files are **not** modified by this increment except the new H-196 artefact and its focused governance test.

---

## 2. Authority boundary (no expansion)

| Fact | State |
| --- | --- |
| H-181 outbound authorization | **EXISTS** — not expanded |
| H-194 evidence workstream | **AUTHORIZED FOR EXECUTION** — not re-authorized |
| H-195 intake / readiness | **COMPLETE** — not rewritten |
| H-196 | Sender/mailbox confirmation + dispatch **preparation** only |
| Requests sent | **NONE** |
| Evidence received | **NONE** |
| Evidence accepted | **NONE** |

H-196 does **not** add H-177 drafts. It does **not** prepare D01, D04, D08, D09, D12, D13, D14, or D15. It does **not** create outbound drafts for EV-G08 / EV-G11 / EV-G12.

H-181 §10 “authorized for controlled outbound execution” remains permission-to-send **once remaining execution controls are confirmed**. It is not a claim of send.

---

## 3. Reconciliation with H-177 / H-181 / H-194 / H-195

| Prior fact | H-196 treatment |
| --- | --- |
| H-177 D02, D03, D05, D06, D07, D10, D11 = unsent drafts | **Preserved.** Wording **not rewritten.** Request version = those draft IDs. |
| H-181 sender mailbox = TO BE CONFIRMED AT EXECUTION | H-196 records Owner/POA **named** identity and sending mailbox; **execution** still blocked on delegated-send, GCP destination, operator, timestamp. |
| H-181 / H-195: RFP mailbox must not be **automatically** substituted | H-196 is **not** automatic substitution and **not** E1-B RFI transmission. It is a later **explicit** Owner/POA confirmation of a split identity/mailbox arrangement for this workstream. |
| E1-B `rfp@…` process (ADR-0006) | **Different process.** Not adopted as the GCP destination, form payload, or operator identity. |
| H-195 `CONFIRMED SENDER IDENTITY: [PENDING]` | Historical H-195 state. **Not rewritten.** Superseded for current execution-prep **only** by this file’s §4. |
| H-195 eligible = 7; READY = 0 | Eligible remains 7. Still **not** `READY FOR AUTHORIZED EXECUTION`. Status taxonomy updated only for these seven rows (GCP recipient/channel + execution controls). |
| H-194 D194-01 / D194-18 / D194-19 | Unchanged: P01 not granted; Belgium DR legal deferred; no procurement. |

---

## 4. Confirmed sender and mailbox arrangement

Recorded **exactly** as Owner/POA-confirmed for this workstream:

```text
Authorized sender identity:  rfp@serengetiexperiencedmc.com
Sending mailbox / channel:   info@serengetiexperience.com
```

| Field | Recorded value |
| --- | --- |
| Authorized sender identity | `rfp@serengetiexperiencedmc.com` |
| Sending mailbox / channel | `info@serengetiexperience.com` |
| Sender arrangement | The sending mailbox must be authorized to send **using** the authorized sender identity, including any applicable **delegated-send** or **send-as** permission. |
| Delegated-send / send-as | **NOT EVIDENCED — REQUIRES CONFIRMATION.** H-196 does **not** claim this permission exists. |
| Personal Gmail / WhatsApp | **Not** a sending channel. **Not** invented as a default. |
| Generic SEDMC mailbox as sender identity | **Not** used as the authorized identity. Identity is the named `rfp@…` address. Sending envelope is `info@…`. |
| PDM Owner status | Does **not** by itself prove mailbox control or send-as. |
| Operator | **PENDING EXECUTION-TIME CONFIRMATION** — personal name **not invented**. |
| Execution timestamp | **PENDING** — **not invented**. |
| Requests sent | **NONE** |

Standing execution rule: if delegated-send / send-as cannot be confirmed without fabrication, **queue** — do not send.

This is **not** a claim that `info@serengetiexperience.com` has already sent as `rfp@serengetiexperiencedmc.com`. It is a record of the intended arrangement plus an open control.

---

## 5. GCP recipient / channel confirmation requirements

Preserve H-181 R181-GCP:

```text
Organization: Google Cloud / GCP
Function: official organizational account, sales, technical, support, or customer-contact function
Individual name: NOT REQUIRED / UNKNOWN — MUST NOT BE INVENTED
Personal email: MUST NOT BE INVENTED
Channel: Official Google Cloud organizational / account / contact channel
Routable address or official contact channel: PENDING
```

H-196 does **not** invent:

* an individual Google Cloud employee;
* an email address;
* a customer account representative;
* a support case number;
* a contact-form submission;
* a delivery confirmation.

The E1-B CU-03 “Official Contact Sales form” is a **different** workstream route. It is **not** adopted here as a confirmed H-177 destination.

### Recipient-confirmation checklist (must all hold before dispatch)

1. Official Google Cloud **domain** or **verified official** channel.
2. Appropriate sales, technical, support, or customer-contact **function**.
3. Recipient suitability **for each** of the seven requests (account/billing vs technical vs architecture).
4. No personal Gmail, WhatsApp, or unverified third-party address.
5. Evidence of dispatch authorization **and** timestamp (filled only at actual send).

Until these are independently confirmed:

```text
RECIPIENT STATUS = ORGANIZATION KNOWN — ROUTABLE ADDRESS / OFFICIAL CHANNEL PENDING
CHANNEL STATUS = OFFICIAL CORPORATE CHANNEL INTENDED — DESTINATION NOT CONFIRMED
```

---

## 6. Dispatch-status taxonomy (this increment)

The seven prepared rows use:

`NOT READY — GCP RECIPIENT/CHANNEL AND EXECUTION CONTROLS PENDING`

They are **not**:

* `READY FOR AUTHORIZED EXECUTION`
* `SENT`
* `RESPONSE RECEIVED`
* `EVIDENCE ACCEPTED`

`SENT = NONE` remains independently true.

Blocked drafts keep their H-195 classes: internal / legal / commercial / not selected. H-196 does **not** upgrade them.

---

## 7. Seven-request dispatch register

**Request version** for every row = the corresponding H-177 draft in `docs/governance/h-177-controlled-unsent-evidence-request-draft-package.md`. Bodies are **not** rewritten. **No fabricated attachments.**

Shared fields (all seven):

| Shared control | Value |
| --- | --- |
| Sending mailbox | `info@serengetiexperience.com` |
| Authorized sender identity | `rfp@serengetiexperiencedmc.com` |
| Intended recipient function | R181-GCP — Google Cloud official organizational account, sales, technical, support, or customer-contact function |
| Recipient status | Organization known; routable address / official channel **PENDING** |
| Channel status | Official SEDMC corporate communication **intended**; destination **not confirmed**; delegated-send **not evidenced** |
| Dispatch status | `NOT READY — GCP RECIPIENT/CHANNEL AND EXECUTION CONTROLS PENDING` |
| Information-only boundary | **Information / evidence request only.** No purchase, procurement, legal acceptance, DPA execution, quotation acceptance, or Production implementation. |
| Evidence-intake root | `docs/governance/evidence/production-prerequisite-intake/{evidence-id}/` |
| Operator | **PENDING** |
| Execution timestamp | **PENDING** |
| Sent | **NO** |
| Received | **NO** |
| Accepted | **NO** |

### H196-R01 — H177-D02

| Field | Value |
| --- | --- |
| Request ID | H177-D02 |
| Draft subject | SEDMC EOS — request for GCP ownership, billing, and support-policy evidence |
| Evidence / decision dependency | EV-G01, EV-C01 (H-195); EV-C01, EV-M03 (H-177); D194-02, D194-19 |
| H-181 disposition | Controlled outbound — GCP account/billing **information** only |
| Required attachments / references | **None fabricated.** Reference: H-177 D02 body. Identifiers remain `[GCP PROJECT ID TO BE DETERMINED]` / `[BILLING ACCOUNT TO BE DETERMINED]`. |
| Required response | Ownership/billing model; commercial/technical **roles**; procurement route; support-arrangement **policy**; budget-control policy — **without** creating a project. |
| Acceptance criteria | Named model and policy; not a live project; provenance identifiable; stored under intake path; receipt ≠ acceptance. |

### H196-R02 — H177-D03

| Field | Value |
| --- | --- |
| Request ID | H177-D03 |
| Draft subject | SEDMC EOS — request for PostgreSQL / Cloud SQL Enterprise Plus compatibility evidence |
| Evidence / decision dependency | EV-G04 (H-195); EV-T01–EV-T03 (H-177); D194-09 |
| H-181 disposition | Controlled outbound — PostgreSQL version **not** selected by sending |
| Required attachments / references | **None fabricated.** Reference: H-177 D03 body. ADR-0003 / lab 16.15 remain Dev/Test, not a Production lock. |
| Required response | Plus-supported versions in intended regions; EOS migrate/runtime compatibility implications; extensions/collations/features; upgrade implications; Advanced DR version prerequisites. |
| Acceptance criteria | Dated attributable matrix; distinguish provider docs vs EOS tests; version **not** treated as selected; stored under intake path. |

### H196-R03 — H177-D05

| Field | Value |
| --- | --- |
| Request ID | H177-D05 |
| Draft subject | SEDMC EOS — request for PSA vs PSC and DR-path connectivity evidence |
| Evidence / decision dependency | EV-G07 (H-195); EV-T06, EV-T07 (H-177); D194-10 |
| H-181 disposition | Controlled outbound — PSA vs PSC **not** selected by sending |
| Required attachments / references | **None fabricated.** Reference: H-177 D05 body. DNS names remain `[PRODUCTION DNS NAME TO BE DETERMINED]`. |
| Required response | PSA vs PSC comparison; app-to-Cloud-SQL options; regional networking; DNS **requirements** (no records); TLS design; failover/write-endpoint implications; DR-path design (not built). |
| Acceptance criteria | Named differences and failover behaviour without implementing network resources. |

### H196-R04 — H177-D06

| Field | Value |
| --- | --- |
| Request ID | H177-D06 |
| Draft subject | SEDMC EOS — request for Cloud SQL encryption (Google-managed vs CMEK) options evidence |
| Evidence / decision dependency | EV-T08 (H-177); related EV-G09 / D194-05 |
| H-181 disposition | Controlled outbound — encryption product **not** selected by sending |
| Required attachments / references | **None fabricated.** Reference: H-177 D06 body. |
| Required response | Google-managed vs CMEK implications for selected regions; CMEK key-management **only if** later chosen; Advanced DR interaction (design). |
| Acceptance criteria | Options recorded; no keys created; product selection remains later Owner decision (H-194 default remains Google-managed). |

### H196-R05 — H177-D07

| Field | Value |
| --- | --- |
| Request ID | H177-D07 |
| Draft subject | SEDMC EOS — request for secrets-management and KMS options evidence |
| Evidence / decision dependency | EV-G09 (H-195); EV-T09 (H-177); D194-04 |
| H-181 disposition | Controlled outbound (product information) + internal ADR-0012 |
| Required attachments / references | **None fabricated.** Reference: H-177 D07 body. No credentials attached. |
| Required response | Secrets-storage / KMS / Secret Manager **options**; rotation, service identity, least privilege, break-glass **design**; operational **roles**. |
| Acceptance criteria | Options paper; no secrets/credentials/keys created; managed-platform requirement remains; product **OPEN**. |

### H196-R06 — H177-D10

| Field | Value |
| --- | --- |
| Request ID | H177-D10 |
| Draft subject | SEDMC EOS — request for Cloud SQL Enterprise Plus / Advanced DR provider confirmation |
| Evidence / decision dependency | EV-G02–G06, EV-G13 (H-195); EV-P01–EV-P05 (H-177); D194-02 |
| H-181 disposition | Controlled outbound — architecture not implemented |
| Required attachments / references | **None fabricated.** Reference: H-177 D10 body. H-169 citations remain class-1 capability references, not intake ACCEPTED. |
| Required response | Distinguish documented capability / proposed architecture / EOS implementation / measured test. Plus + Advanced DR + designated replica + N2 in both regions; backup/PITR; limitations; failover/switchback; versions informational; connectivity unselected. |
| Acceptance criteria | Dated confirmation distinguishing the four categories. Class 1 ≠ class 2 ≠ measured RTO/RPO. Do not create project/instance/replica. |

### H196-R07 — H177-D11

| Field | Value |
| --- | --- |
| Request ID | H177-D11 |
| Draft subject | SEDMC EOS — request for write-endpoint, DNS, and failover-strategy evidence |
| Evidence / decision dependency | EV-A02 (H-177); D194-12 |
| H-181 disposition | Controlled outbound — hostname **OPEN**; no DNS invented |
| Required attachments / references | **None fabricated.** Reference: H-177 D11 body. `[PRODUCTION DNS NAME TO BE DETERMINED]` remains. |
| Required response | Write-endpoint vs application-URL strategy; DNS ownership **role**; TTL design; failover/switchback; operational **roles**. |
| Acceptance criteria | Written strategy; no DNS records created; actual hostname remains OPEN. |

**Prepared count = 7. Currently READY FOR AUTHORIZED EXECUTION = 0. SENT = 0.**

---

## 8. Before-send checklist

Do **not** send until every item is independently confirmed:

- [ ] Authorized sender identity confirmed as `rfp@serengetiexperiencedmc.com` (Owner/POA recorded in this file)
- [ ] Sending mailbox confirmed as `info@serengetiexperience.com` (Owner/POA recorded in this file)
- [ ] Delegated-send / send-as permission for that identity **from** that mailbox **independently evidenced** (currently **not evidenced**)
- [ ] Operator / authorized human sender confirmed (currently **PENDING** — do not invent a personal name)
- [ ] Corporate channel confirmed (official SEDMC communication only)
- [ ] Recipient **organization** remains Google Cloud official function (H-181); no invented person
- [ ] Routable destination or verified official GCP channel confirmed (currently **PENDING**)
- [ ] Recipient suitable for the specific request ID being sent
- [ ] Request version = exact H-177 draft ID (D02 / D03 / D05 / D06 / D07 / D10 / D11)
- [ ] No prohibited personal data
- [ ] No confidential credentials
- [ ] No commercial commitment implied
- [ ] No purchase, subscription, quote acceptance, legal acceptance, or DPA execution implied
- [ ] Evidence deadline only if **separately** authorized (none recorded here)
- [ ] Audit record prepared (this register + send log)
- [ ] H-181 scope not expanded (no D12/D13/D15; no new drafts)

---

## 9. At-send checklist

Fill **only** when a real send occurs. **Not invented by H-196.**

| Field | Value at H-196 |
| --- | --- |
| Sender identity | `rfp@serengetiexperiencedmc.com` (intended; send not performed) |
| Sending mailbox | `info@serengetiexperience.com` (intended; send not performed) |
| Recipient | **blank until confirmed** |
| Channel | **blank until confirmed** |
| Timestamp | **PENDING** |
| Operator | **PENDING** |
| Request identifier | H177-D0x as sent |
| Exact request version | H-177 draft ID / artefact path |
| Delegated-send evidence reference | **NONE** |

---

## 10. Response and evidence-intake controls

On any later response:

1. Preserve the **original** response (do not paraphrase away provenance).
2. Record provider/source, timestamp, request ID, classification.
3. Store under `docs/governance/evidence/production-prerequisite-intake/{evidence-id}/`.
4. Apply H-195 §8 acceptance criteria (provenance, authority, relevance, scope/date/version, specificity, contradictory evidence, auditable storage, separate Owner/POA decision).
5. Receipt ≠ **ACCEPTED**. Marketing pages remain supporting material only.
6. Do not treat H-169 Google documentation citations as intake ACCEPTED.
7. Do not treat Dev/Test `docs/governance/evidence/e2-lab/` as Production-prerequisite evidence.
8. Record reviewer and decision impact against H-192 / H-193 / H-194 separately.

Current intake (unchanged from H-195):

```text
Intake count = 24
RECEIVED = 0
ACCEPTED = 0
STORAGE REFERENCE = NONE
```

---

## 11. Explicit non-authorizations

H-196 does **not** authorize and this run did **not** perform:

* sending email, WhatsApp, forms, or any outbound message;
* contacting Google Cloud;
* connecting or configuring mailboxes;
* asserting delegated-send / send-as permission;
* inventing GCP individuals, emails, case numbers, or form submissions;
* purchase, quotation acceptance, procurement, or commercial commitment;
* legal acceptance, DPA execution, or Belgium DR legal clearance;
* creating GCP / Cloud Run / Cloud SQL / replica / DNS / TLS / IdP / secrets / KMS resources;
* Production implementation, migration, deployment, or data movement;
* DR testing or measured RTO/RPO claims;
* expanding H-181 beyond the seven already-authorized **information** requests;
* rewriting H-169 through H-195;
* commit, push, reset, clean, stash, revert, or discard.

```text
Belgium DR:              DEFERRED — LEGAL REVIEW
Commercial quotes:       DEFERRED — COMMERCIAL REVIEW
Procurement:             NO COMMITMENT (D194-19)
Legal acceptance:        NONE
Provider terms accepted: NONE
```

Provider-selection freeze (H-194, unchanged):

| Direction | Remains |
| --- | --- |
| Google Identity Platform | **Candidate**, not final |
| SMTP | **Integration direction**, not provider |
| Managed object storage | **Requirement**, provider OPEN |
| Managed NATS | **Requirement**, vendor OPEN |
| Managed secrets | **Requirement**, platform OPEN |
| Cloud Run / Cloud SQL | **Architecture direction**, not deployed |

---

## 12. Production and H-181 status (unchanged)

```text
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED

H-181 OUTBOUND AUTHORIZATION = EXISTS
REQUESTS SENT = NONE
EVIDENCE RECEIVED = NONE
EVIDENCE ACCEPTED = NONE

Production resources / data = NONE
Production migration / deployment = NONE
DR test = NOT PERFORMED
```

---

## 13. Current status and next execution dependency

H-196 dispatch preparation is **complete** as a record. Dispatch itself is **not** ready.

**Next execution dependency (all required):**

1. Independently evidence delegated-send / send-as from `info@serengetiexperience.com` using identity `rfp@serengetiexperiencedmc.com`, **or** record a different Owner/POA-confirmed arrangement that does not require fabrication.
2. Identify the actual routable GCP organizational address **or** verified official channel (no invented person or mailbox).
3. Confirm the human operator / authorized sender at execution time (no invented personal name).
4. Record execution timestamp at actual send.
5. Complete §8 before-send checks per request ID.
6. Only then may a **human** authorized sender execute H-181 §5–§7 for the seven drafts.

H-196 itself sends **nothing**.

---

## 14. Contradiction scan

| Check | Result |
| --- | --- |
| H-181 “RFP mailbox not automatically substituted” vs named `rfp@` identity | **Consistent if read as:** H-181 forbade unconfirmed automatic substitution. H-196 is later explicit Owner/POA confirmation of **identity**, with a **different** sending mailbox, and send-as still unproven. Not an E1-B send. |
| H-195 sender `[PENDING]` vs H-196 named addresses | **Consistent:** H-195 not rewritten; H-196 is the later confirmation increment. |
| Named mailbox vs READY | **Consistent:** identity/mailbox named ≠ destination confirmed ≠ delegated-send evidenced ≠ sent. |
| E1-B Contact Sales form vs GCP destination | **Consistent:** form route **not** adopted; destination remains PENDING. |
| Eligible 7 vs prepared 7 | **Consistent:** same set; none SENT. |
| H-169 docs vs intake ACCEPTED | **Consistent:** capability refs ≠ received evidence. |

---

## 15. Final status

```text
H-196 STATUS = COMPLETE
AUTHORIZED SENDER IDENTITY = rfp@serengetiexperiencedmc.com
SENDING MAILBOX = info@serengetiexperience.com
DELEGATED-SEND / SEND-AS PERMISSION = NOT EVIDENCED — REQUIRES CONFIRMATION
GCP ROUTABLE RECIPIENT / OFFICIAL CHANNEL = PENDING
OPERATOR = PENDING EXECUTION-TIME CONFIRMATION
EXECUTION TIMESTAMP = PENDING
Prepared dispatch records = 7
Currently READY FOR AUTHORIZED EXECUTION = 0
DISPATCH STATUS = NOT READY — GCP RECIPIENT/CHANNEL AND EXECUTION CONTROLS PENDING
REQUESTS SENT = NONE
EVIDENCE RECEIVED = NONE
EVIDENCE ACCEPTED = NONE
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
```
