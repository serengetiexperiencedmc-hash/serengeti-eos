# E1-B6 — RFI Transmission Execution and Evidence Register

> **`OPERATIONAL SEND SET SUPERSEDED 2026-09-17 — SEE ROUTING RECONCILIATION`**  
> **Authoritative operational routing:** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md)  
> **ADDITIVE 2026-09-17 live execution sheet / evidence register:** [`adr-0006-e1-b-final-transmission-execution-sheet.md`](adr-0006-e1-b-final-transmission-execution-sheet.md) · [`adr-0006-e1-b-transmission-evidence-register.md`](adr-0006-e1-b-transmission-evidence-register.md) — still **0 TRANSMISSIONS**  
> **Historical 11 SEND rows below are preserved. They are not the current full-RFI instruction.**  
> **Current: 9 FULL-RFI ELIGIBLE / 2 SCOPE CLARIFICATION (CU-10, CU-11) / 1 HOLD (CU-05); 0 TRANSMISSIONS**  
> **`E1-B6 = ROUTE VERIFIED / NOT TRANSMITTED`**  
> **`PACKAGE READY / NOT SENT`**  
> **`11 OFFICIAL ROUTES VERIFIED`** · **`0 TRANSMISSIONS EVIDENCED`**  
> **`ROUTE VERIFICATION ≠ TRANSMISSION`**  
> **`PUBLIC CONTACT PAGE ≠ RFI SENT`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`NOT RANKING`** · **`NOT SCORING`**  
> **`NO EMAIL SENT`** · **`NO FORM SUBMITTED`** · **`NO TELEPHONE`** · **`NO VENDOR ACCOUNT`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`HR-04 = CONFIRMED FOR TRANSMISSION PREPARATION`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment / Contracting = NOT AUTHORIZED`**

**Date of this register:** 2026-09-17.  
**Evidence-review date:** 2026-09-17.  
**Route-reconciliation date:** 2026-09-17.  
**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Routing source of truth (unmodified):** [`adr-0006-e1-b5-rfi-final-recipient-routing.md`](adr-0006-e1-b5-rfi-final-recipient-routing.md)  
**Payloads (internal, unmodified):** [`adr-0006-e1-b5-provider-form-submission-payloads.md`](adr-0006-e1-b5-provider-form-submission-payloads.md)  
**Issuance package version:** `E1-B5-ISSUANCE-PACKAGE`

This file is the **controlled evidence record** for actual external issuance of the authorized E1-B RFI/RFQ. The Reservations Consultant completes a row **after** a real transmission. Completing this register in its initial state is **not** a send.

Do **not** move a row to TRANSMITTED, DELIVERY/FORM ACCEPTANCE CONFIRMED, PROVIDER ACKNOWLEDGED, or PROVIDER RESPONSE RECEIVED without evidence of that event. Those four events are **distinct**. Preparation and a narrative claim of send are **not** transmission evidence.

---

## 0. Evidence review of 2026-09-17 send claim

A later instruction in this governance session **asserted** that the authorized Reservations Consultant had externally transmitted the E1-B RFI/RFQ.

**Acceptable evidence actually supplied in that instruction:** **none.**

Not supplied for any CU-01–CU-12 SEND row:

- sent timestamp  
- sender-used / recipient-used pair as a sent-mail record  
- Message-ID  
- delivery or bounce artefact  
- form URL as a completed submission  
- submission timestamp  
- confirmation/reference number  
- confirmation page  
- screenshot/PDF  
- provider acknowledgement  
- provider response  

The assertion that transmission “has now” occurred is **not** an acceptable email or web-form artefact. It is **not** used to advance status.

| Result | Value |
| --- | --- |
| SEND rows advanced to TRANSMITTED | **0 / 11** |
| Overall E1-B6 state | **PACKAGE READY / NOT SENT** (none of 11 have actual transmission evidence) |
| CU-05 | HOLD — SCOPE CLARIFICATION — not recorded as transmitted |

---

## 1. Status model (use exactly)

| Status | Meaning | Requires |
| --- | --- | --- |
| **NOT TRANSMITTED** | No external send recorded. Initial state of every SEND row. | Default until evidence of send. |
| **TRANSMISSION PREPARED** | Pack and route ready; still not sent. | Optional later use; **not** applied in this initial register. |
| **TRANSMITTED** | Consultant performed a send (email or form submit). | Timestamp, destination, sender, channel evidence. |
| **DELIVERY/FORM ACCEPTANCE CONFIRMED** | Provider mail system accepted / form returned a confirmation. | Delivery or form-acceptance artefact. **Not** the same as TRANSMITTED. |
| **PROVIDER ACKNOWLEDGED** | Provider human or official auto-reply acknowledges receipt of the RFI. | Acknowledgement artefact. **Not** a completed questionnaire. |
| **PROVIDER RESPONSE RECEIVED** | A genuine RFI response (answers/evidence) arrived. | Receipt; then E1-B3 intake. |
| **TRANSMISSION FAILED** | Send attempt failed (client error, form error, refused). | Failure evidence. |
| **BOUNCED / REJECTED** | Email bounce or explicit rejection of the channel. | Bounce/reject artefact. |
| **FOLLOW-UP REQUIRED** | Human follow-up decided after a recorded send. | Based on transmission evidence, not preparation date. |
| **CLOSED — NO RESPONSE** | Later closure after send with no response. | Requires prior TRANSMITTED (or equivalent) evidence. |

Do not skip forward without evidence.

---

## 2. Authorized sender (intended — not a completed send)

| Field | Record |
| --- | --- |
| Sender role | Reservations Consultant |
| Sender email | rfp@serengetiexperiencedmc.com |
| Personal name | **Not recorded — not fabricated** |
| Status | **CONFIRMED FOR TRANSMISSION PREPARATION** |

`Actual sender address used` and all other actual-transmission fields are **EVIDENCE NOT SUPPLIED**. Official-route verification does **not** fill them.

---

## 0A. Independent concepts (do not collapse)

| Concept | This register |
| --- | --- |
| Official route | Published contact channel |
| Official-source evidence | Provider webpage URL confirming that channel |
| Route verification status | **ROUTE VERIFIED** (plus the channel class below) |
| Actual transmission status | **NOT TRANSMITTED** for all 11 SEND rows |
| Actual transmission evidence | **EVIDENCE NOT SUPPLIED** |
| Delivery/form acceptance evidence | **EVIDENCE NOT SUPPLIED** |
| Provider acknowledgement | **EVIDENCE NOT SUPPLIED** |
| Provider response | **EVIDENCE NOT SUPPLIED** |

A public webpage proves **only that a route exists**. It does **not** mean the RFI was sent, a provider was contacted, a form was submitted, or delivery was confirmed.

---

## 3. Frozen external attachment package (only these four)

| # | Component | Path |
| --- | --- | --- |
| 1 | Approved E1-B transmittal letter | `docs/governance/adr-0006-e1-b5-rfi-transmittal-template.md` |
| 2 | Frozen 168-question provider-neutral RFI/RFQ | `docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md` |
| 3 | Frozen PE-01–PE-48 evidence requirements | `docs/governance/adr-0006-e1-b-provider-evidence-requirements.md` |
| 4 | Frozen standard provider response template | `docs/governance/adr-0006-e1-b-standard-provider-response-template.md` |

**Not default external attachments:** company response; human-required register; company-response summary; E1-B3 framework/intake; E1-B4 universe; E1-B5 control register, manifest, checklist, readiness audit, routing sheet, payloads file; legal/DPO internal documents — unless a later governed decision authorizes an excerpt.

### Frozen hashes (re-verified on disk 2026-09-17; files not altered by this reconciliation)

| File | SHA-256 |
| --- | --- |
| Questionnaire | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE pack | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Standard response template | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

Transmittal version/reference: `E1-B5-ISSUANCE-PACKAGE` / `adr-0006-e1-b5-rfi-transmittal-template.md`.

---

## 4. SEND records (11) — routes ROUTE VERIFIED; transmission NOT TRANSMITTED

Intended sender on every SEND row: Reservations Consultant / rfp@serengetiexperiencedmc.com. Personal name not recorded. Attachment package: four external documents in §3. Frozen hashes as §3. Transmittal: E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md.

### CU-01 — Africa Data Centres

| Field | Record |
| --- | --- |
| CU-ID | CU-01 |
| Provider | Africa Data Centres |
| Disposition | SEND |
| Official route | enquiries@africadatacentres.com (primary). Official enquiry form also exists on the same contact page. |
| Official-source evidence | https://www.africadatacentres.com/contact/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL GENERAL CHANNEL |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | enquiries@africadatacentres.com |
| Intended geographic routing | Official contact channel (E1-B4 facilities Kenya/South Africa; not Tanzania) |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Official source confirms the email and an official enquiry form. Route verification is not a send. |

### CU-02 — Amazon Web Services

| Field | Record |
| --- | --- |
| CU-ID | CU-02 |
| Provider | Amazon Web Services |
| Disposition | SEND |
| Official route | AWS Sales Support / Contact Sales form |
| Official-source evidence | https://aws.amazon.com/contact-us/ · https://aws.amazon.com/contact-us/sales-support/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL FORM |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Official sales-support form (enquiry channel, not an RFI/procurement portal) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | https://aws.amazon.com/contact-us/sales-support/ |
| Intended geographic routing | Official global sales-support form |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider-Neutral RFI/RFQ — hosting, data residency and recovery *(form title prepared; not submitted)* |
| Attachment package | Four external documents in §3 — attach only if the form allows; otherwise request enterprise/RFI email or secure upload |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Do not invent an AWS mailbox or named person. Public form URL ≠ a completed submission. |

### CU-03 — Google Cloud

| Field | Record |
| --- | --- |
| CU-ID | CU-03 |
| Provider | Google Cloud |
| Disposition | SEND |
| Official route | Google Cloud Contact Sales form |
| Official-source evidence | https://cloud.google.com/contact/form |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL FORM |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Official Contact Sales form (enquiry channel, not an RFI/procurement portal) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | https://cloud.google.com/contact/form |
| Intended geographic routing | Official global Contact Sales |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider-Neutral RFI/RFQ — hosting, data residency and recovery *(form title prepared; not submitted)* |
| Attachment package | Four external documents in §3 — if the form cannot accept them, request email/upload |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Do not invent a Google Cloud mailbox or named person. Public form URL ≠ a completed submission. |

### CU-04 — Hetzner Online

| Field | Record |
| --- | --- |
| CU-ID | CU-04 |
| Provider | Hetzner Online |
| Disposition | SEND |
| Official route | info@hetzner.com |
| Official-source evidence | https://www.hetzner.com/legal/legal-notice/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL GENERAL CHANNEL |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | info@hetzner.com |
| Intended geographic routing | Germany / EU-EEA Class B (legal notice) |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Legal-notice mailbox. Route verification is not a send. |

### CU-06 — Microsoft Azure

| Field | Record |
| --- | --- |
| CU-ID | CU-06 |
| Provider | Microsoft Azure |
| Disposition | SEND |
| Official route | Azure Contact Sales |
| Official-source evidence | https://azure.microsoft.com/contact/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL FORM |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Official Azure Contact Sales (enquiry channel, not an RFI/procurement portal) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | https://azure.microsoft.com/contact/ |
| Intended geographic routing | Official Azure Contact Sales |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider-Neutral RFI/RFQ — hosting, data residency and recovery *(form title prepared; not submitted)* |
| Attachment package | Four external documents in §3 — if the channel cannot accept them, request email/upload |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Do not invent an Azure mailbox or named person. Public Contact Sales page ≠ a completed submission. |

### CU-07 — Oracle Cloud Infrastructure

| Field | Record |
| --- | --- |
| CU-ID | CU-07 |
| Provider | Oracle Cloud Infrastructure |
| Disposition | SEND |
| Official route | **Primary:** Oracle Contact Sales / Sub-Saharan Africa (Africa) sales route. Official pages also publish Contact Sales form, `contact@oracle.com`, and Sub-Saharan Africa sales routing. No individual recipient invented. |
| Official-source evidence | https://www.oracle.com/africa/corporate/contact/ · https://www.oracle.com/corporate/contact/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL FORM / REGIONAL SALES ROUTE |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Official Contact Sales / Sub-Saharan Africa sales route (enquiry channel, not an RFI/procurement portal) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | Primary: Africa/Sub-Saharan Contact Sales pages. `contact@oracle.com` is published on official contact pages; it is **not** substituted as a named individual and is **not** treated as a completed send. |
| Intended geographic routing | Sub-Saharan Africa / Africa sales region as published by Oracle |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider-Neutral RFI/RFQ — hosting, data residency and recovery *(form title prepared; not submitted)* |
| Attachment package | Four external documents in §3 — if the form cannot accept them, request email/upload |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Primary intended E1-B5/E1-B6 route remains Contact Sales / Sub-Saharan Africa. Public pages ≠ a completed submission. |

### CU-08 — OVHcloud

| Field | Record |
| --- | --- |
| CU-ID | CU-08 |
| Provider | OVHcloud |
| Disposition | SEND |
| Official route | OVHcloud Dedicated Sales / Cloud Sales. Official worldwide contact page; official sales form where applicable: https://us.ovhcloud.com/contact-sales/. **No email address invented.** |
| Official-source evidence | https://www.ovhcloud.com/en/contact/ · https://us.ovhcloud.com/contact-sales/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL SALES ROUTE |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Official Dedicated Sales / Cloud Sales contact (enquiry channel, not an RFI/procurement portal) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | https://www.ovhcloud.com/en/contact/ (Europe/Dedicated Sales). Additional official form: https://us.ovhcloud.com/contact-sales/. |
| Intended geographic routing | Dedicated Sales / Cloud Sales as published |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider-Neutral RFI/RFQ — hosting, data residency and recovery *(prepared for contact page; not submitted)* |
| Attachment package | Four external documents in §3 — request email/upload if the page cannot accept files |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Do not invent an OVHcloud mailbox or named person. Public sales pages ≠ a completed submission. |

### CU-09 — Raxio Group

| Field | Record |
| --- | --- |
| CU-ID | CU-09 |
| Provider | Raxio Group |
| Disposition | SEND |
| Official route | info@raxiogroup.com |
| Official-source evidence | https://www.raxiogroup.com/contact/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL GENERAL CHANNEL |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | info@raxiogroup.com |
| Intended geographic routing | Official general channel. Tanzania TZ1 is described on Raxio’s Tanzania page as “Launching 2026” / “Coming soon” — **not** treated as proof that Raxio Tanzania is operational. |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | TZ1 “Launching 2026” / “Coming soon” is a public-page fact, not operational proof and not a send. |

### CU-10 — SEACOM Limited

| Field | Record |
| --- | --- |
| CU-ID | CU-10 |
| Provider | SEACOM Limited |
| Disposition | SEND |
| Official route | info@seacom.com — published SEACOM email for a **Tanzania Sales / Enterprise RFI routing request**. **Not** a Tanzania-specific mailbox. **Not** CLS as primary RFI route. Official site lists Tanzania office, Tanzania Sales Office, Tanzania CLS Office, and info@seacom.com. |
| Official-source evidence | https://seacom.com/contact-us |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL GENERAL CHANNEL — TANZANIA ROUTING |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | info@seacom.com |
| Intended geographic routing | Tanzania Sales / Enterprise RFI (routing request). CLS is not the primary RFI route. |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery — Tanzania Sales / Enterprise RFI *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Do not describe info@seacom.com as a Tanzania-only mailbox. Route verification is not a send. |

### CU-11 — WIA Tanzania

| Field | Record |
| --- | --- |
| CU-ID | CU-11 |
| Provider | WIA Tanzania |
| Disposition | SEND |
| Official route | info@wia.co.tz. Official contact page also publishes local Sales contacts and a contact form. |
| Official-source evidence | https://wia.co.tz/contact.html |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL TANZANIA CHANNEL |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | info@wia.co.tz |
| Intended geographic routing | Tanzania |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Local Sales contacts and contact form are published; they are not treated as a completed submission. |

### CU-12 — Wingu Africa

| Field | Record |
| --- | --- |
| CU-ID | CU-12 |
| Provider | Wingu Africa |
| Disposition | SEND |
| Official route | **Primary:** info@wingu.africa. **Secondary:** official contact form / sales enquiry form. Locations page provides a sales enquiry form with Dar es Salaam, Tanzania as an available interested location. |
| Official-source evidence | https://www.wingu.africa/contact · https://www.wingu.africa/our-locations/ |
| Route verification status | **ROUTE VERIFIED** — VERIFIED OFFICIAL GENERAL CHANNEL / TANZANIA SALES ROUTE |
| Actual transmission status | **NOT TRANSMITTED** |
| Actual transmission evidence | EVIDENCE NOT SUPPLIED |
| Delivery/form acceptance evidence | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response | EVIDENCE NOT SUPPLIED |
| Transmission method (intended) | Email primary; official form secondary (no submission artefact) |
| Sender (intended) | Reservations Consultant / rfp@serengetiexperiencedmc.com |
| Destination email or form URL (intended) | info@wingu.africa (primary); https://www.wingu.africa/contact (secondary) |
| Intended geographic routing | Tanzania / Dar es Salaam as an available interested location on the official sales enquiry form |
| Current status | **NOT TRANSMITTED** |
| Transmission date | EVIDENCE NOT SUPPLIED |
| Transmission time | EVIDENCE NOT SUPPLIED |
| Time zone | EVIDENCE NOT SUPPLIED |
| Actual sender address used | EVIDENCE NOT SUPPLIED |
| Actual destination used | EVIDENCE NOT SUPPLIED |
| Subject | SEDMC E1-B Provider RFI/RFQ — Infrastructure, Hosting, Data Residency & Recovery *(prepared; not sent)* |
| Attachment package | Four external documents in §3 |
| Questionnaire SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE-pack SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response-template SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |
| Transmittal version/reference | E1-B5-ISSUANCE-PACKAGE / adr-0006-e1-b5-rfi-transmittal-template.md |
| Provider form confirmation/reference number | EVIDENCE NOT SUPPLIED |
| Email Message-ID, if available | EVIDENCE NOT SUPPLIED |
| Delivery confirmation | EVIDENCE NOT SUPPLIED |
| Provider acknowledgement | EVIDENCE NOT SUPPLIED |
| Provider response received date | EVIDENCE NOT SUPPLIED |
| Provider response reference | EVIDENCE NOT SUPPLIED |
| Evidence file/reference | EVIDENCE NOT SUPPLIED |
| Follow-up due date | RESPONSE DEADLINE — NOT ESTABLISHED |
| Notes | Leadership names are not recipients. Public form/location pages ≠ a completed submission. |

---

## 5. HOLD record (not a SEND transmission record)

### CU-05 — Liquid C2 (Liquid Intelligent Technologies)

| Field | Record |
| --- | --- |
| CU-ID | CU-05 |
| Provider | Liquid C2 (Liquid Intelligent Technologies) |
| Disposition | **HOLD — SCOPE CLARIFICATION** |
| Transmission method | **None — no SEND route** |
| Official route | **Not assigned — no SEND route** |
| Official-source evidence | E1-B4 universe only (unmodified). No SEND contact channel recorded here. |
| Route verification status | **Not applicable — HOLD** |
| Actual transmission status | **Not applicable — HOLD.** Not recorded as transmitted. |
| Actual transmission evidence | Not recorded (HOLD). |
| Delivery/form acceptance evidence | Not recorded (HOLD). |
| Provider acknowledgement | Not recorded (HOLD). |
| Provider response | Not recorded (HOLD). |
| Current status | **HOLD — SCOPE CLARIFICATION** |
| Reason | The existing E1-B4 evidence does not yet establish the required EOS PostgreSQL hosting scope needed to treat Liquid C2 as a directly comparable candidate for this RFI. |
| Transmission | **No transmission.** Do not record as sent or ready to send. |
| Notes | Remains outside INITIAL_RFI_SEND_SET until scope is separately resolved. |

---

## 6. Snapshot

| CU-ID | Provider | Disposition | Route verification | Actual transmission status |
| --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-02 | Amazon Web Services | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-03 | Google Cloud | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-04 | Hetzner Online | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-05 | Liquid C2 | HOLD — SCOPE CLARIFICATION | N/A | N/A — not transmitted |
| CU-06 | Microsoft Azure | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-07 | Oracle Cloud Infrastructure | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-08 | OVHcloud | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-09 | Raxio Group | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-10 | SEACOM Limited | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-11 | WIA Tanzania | SEND | ROUTE VERIFIED | NOT TRANSMITTED |
| CU-12 | Wingu Africa | SEND | ROUTE VERIFIED | NOT TRANSMITTED |

**SEND records:** 11. **HOLD records:** 1. **Official routes independently verified:** 11. **TRANSMITTED:** 0.

---

## 7. Transmission evidence rule

**Email.** After a real send, capture where available: sent timestamp; recipient; sender; subject; Message-ID; delivery/bounce; sent-mail evidence; any provider acknowledgement.

**Web form.** After a real submit, capture: provider; form URL; submission timestamp; sender email; exact submitted text; attachments submitted; confirmation page or number; screenshot/PDF confirmation where available; any automated acknowledgement.

Distinguish:

| Event | Not the same as |
| --- | --- |
| TRANSMITTED | Delivery confirmation, acknowledgement, or a completed RFI response |
| DELIVERY/FORM ACCEPTANCE CONFIRMED | Provider acknowledgement or a completed RFI response |
| PROVIDER ACKNOWLEDGED | A filled questionnaire / evidence pack (that is PROVIDER RESPONSE RECEIVED) |
| PROVIDER RESPONSE RECEIVED | Selection, scoring, or architecture decision |

Do not fabricate any of these artefacts.

---

## 8. Follow-up control

**Provider response deadline: per approved E1-B transmittal/RFI.**

The approved transmittal (`adr-0006-e1-b5-rfi-transmittal-template.md`) does **not** establish a numeric deadline. The `[DEADLINE]` line is to be **omitted entirely** unless a deadline is actually authorized/established elsewhere. No deadline is invented here.

After transmission, follow-up is based on **evidence of actual transmission**, not on this register’s preparation date. Until a send is evidenced, follow-up due date is **RESPONSE DEADLINE — NOT ESTABLISHED**.

---

## 9. Response receipt handoff (E1-B3)

When a **genuine** provider response is received:

1. Receive  
2. Register (this E1-B6 row → PROVIDER RESPONSE RECEIVED, with date and reference)  
3. Preserve original  
4. Assign evidence IDs (E1-B3 convention)  
5. Separate provider assertion from independent verification  
6. Verify evidence  
7. Record clarifications/replacements as **new** receipts  
8. Evaluate under E1-B3  
9. Maintain provider-neutral comparison  
10. Do **not** select provider or architecture until the appropriate later governance decision gate  

E1-B6 does **not** score, rank, shortlist, or recommend.

---

## 10. Audit — 2026-09-17 route reconciliation

| Check | Result |
| --- | --- |
| SEND providers | **11** |
| HOLD providers | **1** (CU-05) |
| Official routes independently verified | **11** |
| Actual transmissions evidenced | **0** |
| Delivery confirmations | **0** |
| Acknowledgements | **0** |
| Provider responses | **0** |
| Providers selected | **0** |
| Architectures selected | **0** |
| SEND rows marked TRANSMITTED | **0** |
| Frozen questionnaire hash | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` — **unchanged** |
| PE pack hash | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` — **unchanged** |
| Response template hash | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` — **unchanged** |
| Frozen files modified | **NO** |
| E1-B4 unchanged | **YES** |
| E1-B5 authorization unchanged | **YES** |
| Current state | **PACKAGE READY / NOT SENT** |

**Discrepancy closed by this reconciliation:** public contact pages were previously usable as intended routes but are now explicitly labelled **ROUTE VERIFIED** and kept separate from **NOT TRANSMITTED**. No transactional artefact was added. CU-02 intended form URL aligned to https://aws.amazon.com/contact-us/sales-support/. CU-07 records published `contact@oracle.com` without inventing a person and without changing the primary Contact Sales / Sub-Saharan Africa route. CU-08 records the official US sales form URL without inventing an email. CU-09 records TZ1 “Launching 2026” / “Coming soon” without treating TZ as operational.

No E1-B3 intake opened.

---

## 11. Consultant use after a real send

Update **only** the row that was actually sent. Move status only as far as the evidence supports. Store evidence paths in `Evidence file/reference`. Then, if a response arrives, open E1-B3 intake.

To advance a SEND row to **TRANSMITTED**, supply at least: timestamp; actual sender; actual destination (mailbox or form URL); and a sent-mail record or form-submission artefact.

**Exact next governed action:** Remain **PACKAGE READY / NOT SENT** until actual transmission artefacts exist. Current operational categories are in [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md) (9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD), not the historical 11 SEND rows. This file does not itself send the RFI.
