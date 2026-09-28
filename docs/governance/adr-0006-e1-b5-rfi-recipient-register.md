# E1-B5 — RFI Recipient Register (preparation only)

> **`HISTORICAL RECIPIENT PREPARATION — OPERATIONAL SEND SET SUPERSEDED 2026-09-17`**  
> **Authoritative operational routing:** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md)  
> **`INITIAL_RFI_SEND_SET (11) BELOW IS PRESERVED AS HISTORY AND IS NOT THE CURRENT TRANSMISSION INSTRUCTION`**  
> **Current: 9 FULL-RFI ELIGIBLE / 2 SCOPE CLARIFICATION (CU-10, CU-11) / 1 HOLD (CU-05); 0 TRANSMISSIONS**  
> **Do not transmit the frozen four-document pack to CU-10, CU-11, or CU-05 from this register.**  
> **`RECIPIENT PREPARATION — NOT SENT`**  
> **`NOT PROVIDER SELECTION`** · **`NOT RANKING`** · **`NOT SCORING`** · **`NOT SHORTLIST`**  
> **`NO NAMED INDIVIDUAL INVENTED`** · **`NO EMAIL INFERRED FROM A NAME`**  
> **`NO WEB FORM SUBMITTED`** · **`NO TELEPHONE CALL`** · **`NO PROVIDER CONTACT`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`PACKAGE READY / NOT SENT`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment / Contracting = NOT AUTHORIZED`**

**Date of this register:** 2026-09-17.  
**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Universe source of truth:** [`adr-0006-e1-b4-provider-candidate-universe.md`](adr-0006-e1-b4-provider-candidate-universe.md) (unmodified).  
**Issuance control register (unmodified):** [`adr-0006-e1-b5-rfi-issuance-control-register.md`](adr-0006-e1-b5-rfi-issuance-control-register.md).  
**Transmittal template (unmodified):** [`adr-0006-e1-b5-rfi-transmittal-template.md`](adr-0006-e1-b5-rfi-transmittal-template.md).

This file extracts the **exact** CU-01–CU-12 universe and records **official** contact channels found on provider sites. It does **not** send the RFI. It does **not** amend E1-B4, the frozen questionnaire, PE-01–PE-48, the response template, issuance authorization, or the E1-B5 frozen package.

**RFI disposition** here is a **contact-preparation classification** (SEND / HOLD / EXCLUDE). It is **not** provider selection, ranking, scoring, or architecture selection. E1-B4 architecture tags A–D are **copied unchanged**.

Verification statuses used:

| Status | Meaning in this register |
| --- | --- |
| VERIFIED | Official provider source confirms a **named** RFI contact. **None in this file.** |
| OFFICIAL GENERAL CONTACT | Official sales/enquiry channel exists; **no named** RFI contact identified. |
| NOT FOUND | No suitable official contact identified. |
| REQUIRES HUMAN CONFIRMATION | Information exists but a company human must confirm which channel/office to use, or whether a web form is an acceptable transmittal method. |
| DO NOT USE | Source is unsuitable. **None in this file.** |

A published generic “enquiries / info / sales form” address is **OFFICIAL GENERAL CONTACT**, not a verified named recipient. Actual transmission still requires **HR-04** (sender) and **HR-05** (recipient for that send). Completing this register is **not** RECIPIENT VERIFIED on the issuance control register.

Public-source access date for contact fields: **2026-09-17**. E1-B4 facility facts remain dated **2026-09-16**.

---

## 1. Exact 12-candidate extraction (from E1-B4 — not reconstructed)

Organization names, tags, locations, evidence URLs, and types are copied from E1-B4 §4 and §5. **No candidate added or removed. No organization renamed.**

| CU-ID | Exact organization name (E1-B4) | Architecture tags A/B/C/D (unchanged) | Country / region / facility identified by E1-B4 | Official website / evidence already recorded in E1-B4 | E1-B4 type | E1-B4 status / notes (abridged, not altered in meaning) |
| --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | **D** (hybrid possible — REQUIRES RFI). Not Class C. | Nairobi, Kenya (NBO1, Sameer Industrial Park); Johannesburg / Centurion, South Africa (Samrand / JHB1). | https://www.africadatacentres.com/nairobi/ · https://www.africadatacentres.com/samrand-2/ | Colocation / data-centre operator | CONFIRMED PUBLIC FACT (facility pages). Kenya/South Africa ≠ Tanzania. Managed PostgreSQL / PITR / Tanzania hosting: REQUIRES RFI. |
| CU-02 | Amazon Web Services (public brand). Contracting legal entity: UNKNOWN / REQUIRES RFI. | **A, B, D** | Africa (Cape Town) `af-south-1` (South Africa). EU regions on the same AWS Regions page. No Tanzania region on the cited page. | https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html | Public cloud | CONFIRMED PUBLIC FACT (region table). PostgreSQL 16 / backup geography / Tanzania lock: REQUIRES RFI. Cape Town is not Tanzania. |
| CU-03 | Google Cloud (public brand). Contracting entity: UNKNOWN / REQUIRES RFI. | **A, B, D** | `africa-south1` Johannesburg, South Africa. EU/EEA regions on the same Compute Engine regions/zones page. No Tanzania region cited. | https://docs.cloud.google.com/compute/docs/regions-zones | Public cloud | CONFIRMED PUBLIC FACT (region/zone table). SEDMC service fit: REQUIRES RFI. Johannesburg is not Tanzania. |
| CU-04 | Hetzner Online | **B** | Cloud locations `fsn1` Falkenstein (Germany), `nbg1` Nuremberg (Germany), `hel1` Helsinki (Finland — EEA). | https://docs.hetzner.com/cloud/general/locations/ · https://www.hetzner.com/unternehmen/rechenzentrum | Cloud, dedicated servers, colocation | CONFIRMED PUBLIC FACT (locations). Managed PostgreSQL 16, DR, Tanzania: UNKNOWN / REQUIRES RFI. |
| CU-05 | Liquid C2 (Liquid Intelligent Technologies — public brand) | **D** | ExpressRoute/CloudConnect and Microsoft peering at Cape Town, Johannesburg, Nairobi, Lagos, London (cited product page). | https://liquidc2.com/connect/ | Connectivity / cloud-connect | PROVIDER SELF-DESCRIPTION of connectivity. Hosting of EOS PostgreSQL: UNKNOWN / REQUIRES RFI. Not a cloud-region substitute for Class A by itself. |
| CU-06 | Microsoft Azure (public brand). Contracting entity: UNKNOWN / REQUIRES RFI. | **A, B, D** | South Africa North (Johannesburg); South Africa West (Cape Town) described as access-restricted on Microsoft’s regions list. EU/EEA regions on the same list. No Tanzania region cited. | https://learn.microsoft.com/en-us/azure/reliability/regions-list | Public cloud | CONFIRMED PUBLIC FACT (region table). PostgreSQL 16 / Tanzania: REQUIRES RFI. South Africa ≠ Tanzania. |
| CU-07 | Oracle Cloud Infrastructure | **A, B, D** | South Africa Central (Johannesburg) `af-johannesburg-1` — Live. Kenya listed Coming soon — not treated as live. EU/EEA regions exist. No Tanzania region cited. | https://docs.oracle.com/iaas/Content/General/Concepts/regions.htm · https://www.oracle.com/cloud/public-cloud-regions/ | Public cloud | CONFIRMED PUBLIC FACT (Johannesburg live; Kenya coming soon). PostgreSQL 16 / Tanzania: REQUIRES RFI. |
| CU-08 | OVHcloud | **B** | EU/EEA sites including France, Germany, Finland, Poland, Italy on OVHcloud location pages. UK is not EEA — Class B tag does not automatically cover UK. | https://www.ovhcloud.com/en/about-us/global-infrastructure/regions/ · https://www.ovhcloud.com/en/datacenter/ | Public cloud / hosting | CONFIRMED PUBLIC FACT (location list). African/Tanzania presence: UNKNOWN on cited pages. PostgreSQL 16: REQUIRES RFI. |
| CU-09 | Raxio Group | **C** if and when a Tanzania facility is operational | Public Tanzania page: Dar es Salaam facility “Launching 2026”. Outskirts of Dar es Salaam. | https://www.raxiogroup.com/data-centres/tanzania/ | Colocation developer/operator | PROVIDER SELF-DESCRIPTION of a future/launching facility. Not treated as live Production colo. Operational date: UNVERIFIED / REQUIRES RFI. |
| CU-10 | SEACOM Limited | **C** (colo at cable-landing facility — scope REQUIRES RFI) | PeeringDB facility: SEACOM Dar Es Salaam CLS, 49 Silver Sands Area, Kunduchi, Dar es Salaam, TZ. | https://www.peeringdb.com/fac/1932 · E1-B4 also records seacom.mu website (recipient not identified). | Submarine cable / facility operator (PeeringDB) | CONFIRMED PUBLIC FACT (PeeringDB address/country). Whether EOS-class hosting is offered: UNKNOWN / REQUIRES RFI. |
| CU-11 | WIA (public site wia.co.tz) | **C** | Dar es Salaam, Tanzania; colocation product page (E1-B4). | https://wia.co.tz/datacenter-colocation | ISP / colocation | PROVIDER SELF-DESCRIPTION of colo. PostgreSQL UNKNOWN (colo ≠ DBaaS). REQUIRES RFI. **2026-09-17 note:** that E1-B4 colo URL returned HTTP 404 on fetch; organization and CU-ID are **not** removed. Current homepage still identifies WIA at wia.co.tz. |
| CU-12 | Wingu Africa | **C**; **D** (if hybrid/cloud products exist — REQUIRES RFI) | Mbezi data centre, Dar es Salaam, Tanzania. | https://www.wingu.africa/markets/tanzania | Data-centre / colo / claimed cloud services | PROVIDER SELF-DESCRIPTION. Managed PostgreSQL: REQUIRES RFI. |

**Unique organizations:** 12. **Coverage counts (E1-B4, unchanged):** A4 · B6 · C4 · D7.

---

## 2. RFI disposition method (information-gathering, not selection)

The frozen questionnaire is a **Production hosting and data-residency** RFI/RFQ for architecture classes A–D, covering hosting, Tanzania/regional cloud, colocation, managed infrastructure, PostgreSQL-capable infrastructure, backup/PITR, DR/warm standby, hybrid infrastructure, data residency, security/support/SLA, and pricing/TCO.

| Disposition | Use when |
| --- | --- |
| **SEND** | E1-B4 records the organization as offering (or announcing) hosting, colo, managed cloud, or hybrid infrastructure **directly in RFI scope**. |
| **HOLD** | E1-B4 records only a **narrower adjacent** capability (e.g. connectivity/interconnect) and does **not** establish that the organization hosts EOS-class compute/PostgreSQL. Clarification before sending the full 168-question pack. |
| **EXCLUDE** | Not sufficiently relevant to the RFI scope. **Not used** for any CU-01–CU-12 row: universe membership already required at least one in-scope capability. |

No ranking. No “best” / cheapest / preferred language. SEND ≠ selected provider.

---

## 3. Recipient information register (CU-01–CU-12)

Named recipient, job title, and personal email are **blank** unless an official page names an RFI contact **and** publishes that person’s address. None did. Leadership-page names **without** an RFI mailbox are **not** copied into the named-recipient field.

### CU-01 — Africa Data Centres

| Field | Record |
| --- | --- |
| CU-ID | CU-01 |
| Organization | Africa Data Centres |
| RFI disposition | **SEND** |
| Official website | https://www.africadatacentres.com/ |
| Official sales/contact page | https://www.africadatacentres.com/contact/ · enquiry email published on https://www.africadatacentres.com/services/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | enquiries@africadatacentres.com |
| Recipient telephone | +27 11 585 0000 |
| Recipient country | South Africa (head office on contact page: Midrand). Nairobi facility also recorded in E1-B4. |
| Source of recipient information | Official ADC services page (email and telephone); official contact page (head-office address). |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: colo / interconnect / claimed hybrid on-ramps are in RFI scope (Class D). Not Tanzania colo. Human issuer should confirm ZA enquiry mailbox vs any later Kenya-facility channel. Do not submit the website form from this session. |

### CU-02 — Amazon Web Services

| Field | Record |
| --- | --- |
| CU-ID | CU-02 |
| Organization | Amazon Web Services |
| RFI disposition | **SEND** |
| Official website | https://aws.amazon.com/ |
| Official sales/contact page | https://aws.amazon.com/contact-us/sales-support/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published on the official sales-support page — form only)* |
| Recipient telephone | *(none published as a general RFI number on that page)* |
| Recipient country | *(not stated on the sales-support form page)* |
| Source of recipient information | Official AWS Sales support form. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** (web form). **REQUIRES HUMAN CONFIRMATION** of transmittal method: current issuance pack is document/email-style; this session does **not** submit the form. |
| Notes | SEND: Class A/B/D managed cloud is in RFI scope. No named sales person recorded. |

### CU-03 — Google Cloud

| Field | Record |
| --- | --- |
| CU-ID | CU-03 |
| Organization | Google Cloud |
| RFI disposition | **SEND** |
| Official website | https://cloud.google.com/ |
| Official sales/contact page | https://cloud.google.com/contact |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published — chat / contact form)* |
| Recipient telephone | *(callback via official form; no standalone RFI mailbox found)* |
| Recipient country | *(not stated as a single RFI country)* |
| Source of recipient information | Official Google Cloud Contact Sales page. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** (web form / chat). **REQUIRES HUMAN CONFIRMATION** of transmittal method. Form **not** submitted. |
| Notes | SEND: Class A/B/D managed cloud is in RFI scope. |

### CU-04 — Hetzner Online

| Field | Record |
| --- | --- |
| CU-ID | CU-04 |
| Organization | Hetzner Online |
| RFI disposition | **SEND** |
| Official website | https://www.hetzner.com/ |
| Official sales/contact page | https://www.hetzner.com/legal/legal-notice · https://www.hetzner.com/support/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | info@hetzner.com |
| Recipient telephone | +49 (0)9831 505-0 |
| Recipient country | Germany (Hetzner Online GmbH, Gunzenhausen, per legal notice) |
| Source of recipient information | Official legal notice (Impressum). Support page lists Sales as a request category. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: Class B EU/EEA cloud / dedicated / colo. `info@` is a general company address, not a named RFI officer. Do not use tco@ or dsa-authorities@ (statutory contact points, not sales). |

### CU-05 — Liquid C2 / Liquid Intelligent Technologies

| Field | Record |
| --- | --- |
| CU-ID | CU-05 |
| Organization | Liquid C2 (Liquid Intelligent Technologies — public brand) |
| RFI disposition | **HOLD** |
| Official website | https://liquidc2.com/ |
| Official sales/contact page | https://liquidc2.com/contact/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published on the contact page — form plus country offices)* |
| Recipient telephone | Tanzania office listed: +255 688 111 222 |
| Recipient country | Tanzania office address published (Dar es Salaam). Other country offices also listed. |
| Source of recipient information | Official Liquid C2 contact page. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** (form + published office telephone). **REQUIRES HUMAN CONFIRMATION** whether any later send should use the form, the Tanzania office number, or another published office. |
| Notes | **HOLD, not EXCLUDE.** E1-B4 records connectivity / cloud-connect (Class D potential) and states hosting of EOS PostgreSQL is UNKNOWN and that this is not a Class A cloud-region substitute. The frozen RFI’s primary addressee is a Production hosting / residency provider. Clarify whether Liquid should receive the **full 168-question hosting pack** or a narrower interconnect inquiry. `support@liquid.tech` / `support@liquidcloud.africa` are **support desks**, not used here as RFI mailboxes. Form **not** submitted. Call **not** made. |

### CU-06 — Microsoft Azure

| Field | Record |
| --- | --- |
| CU-ID | CU-06 |
| Organization | Microsoft Azure |
| RFI disposition | **SEND** |
| Official website | https://azure.microsoft.com/ |
| Official sales/contact page | https://azure.microsoft.com/en-us/contact |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published — chat / regional sales telephone directory)* |
| Recipient telephone | Official page publishes a **regional** sales-number table. No Tanzania-specific number confirmed in this register. Number not copied as a “selected” country line. |
| Recipient country | *(regional; not a single RFI country)* |
| Source of recipient information | Official Azure Contact Sales page (directory confirmed via public official URL; full telephone table not reproduced). |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** (chat / regional phone directory). **REQUIRES HUMAN CONFIRMATION** of transmittal method and which regional sales line, if any, a human issuer would use. |
| Notes | SEND: Class A/B/D managed cloud is in RFI scope. No named person. Form/chat **not** used in this session. |

### CU-07 — Oracle Cloud Infrastructure

| Field | Record |
| --- | --- |
| CU-ID | CU-07 |
| Organization | Oracle Cloud Infrastructure |
| RFI disposition | **SEND** |
| Official website | https://www.oracle.com/cloud/ |
| Official sales/contact page | https://www.oracle.com/corporate/contact/ · https://www.oracle.com/cloud/ (Contact sales) |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published as a general OCI RFI mailbox — sales message / chat)* |
| Recipient telephone | Official contact page offers “Call Oracle Sales” / regional numbers. No Tanzania-specific OCI RFI number recorded here. |
| Recipient country | *(regional; not a single RFI country)* |
| Source of recipient information | Official Oracle Contacts and OCI product pages. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** (sales form / chat). **REQUIRES HUMAN CONFIRMATION** of transmittal method. |
| Notes | SEND: Class A/B/D managed cloud is in RFI scope. Form **not** submitted. |

### CU-08 — OVHcloud

| Field | Record |
| --- | --- |
| CU-ID | CU-08 |
| Organization | OVHcloud |
| RFI disposition | **SEND** |
| Official website | https://www.ovhcloud.com/ |
| Official sales/contact page | https://www.ovhcloud.com/en/contact/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | *(none published as a general sales mailbox on the worldwide contact page)* |
| Recipient telephone | Ireland/Europe sales team: +353 1 920 36 82 (official worldwide contact page) |
| Recipient country | Ireland / Europe sales line as published (Class B is EU/EEA). |
| Source of recipient information | Official OVHcloud Worldwide contact page. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: Class B EU/EEA cloud. US `contact-sales` form exists on a US site; not used as the EEA-class channel. `media@us.ovhcloud.com` is **not** used (media, not RFI). Call **not** made. |

### CU-09 — Raxio Group

| Field | Record |
| --- | --- |
| CU-ID | CU-09 |
| Organization | Raxio Group |
| RFI disposition | **SEND** |
| Official website | https://www.raxiogroup.com/ |
| Official sales/contact page | https://www.raxiogroup.com/contact/ · Tanzania facility page: https://www.raxiogroup.com/data-centres/tanzania/ |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | info@raxiogroup.com |
| Recipient telephone | +31 20 800 4953 |
| Recipient country | Netherlands (headquarters on contact page). Tanzania facility is recorded in E1-B4 as launching 2026, not live. |
| Source of recipient information | Official Raxio contact page. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: Class C Tanzania colo **coverage** for information-gathering, including operational-status questions. Do **not** treat TZ1 as live capacity. `complaints@raxiogroup.com` is a grievance channel — **not** used for RFI. Uganda marketplace third-party emails on other Raxio pages are **not** used. |

### CU-10 — SEACOM Limited

| Field | Record |
| --- | --- |
| CU-ID | CU-10 |
| Organization | SEACOM Limited |
| RFI disposition | **SEND** |
| Official website | https://seacom.com/ (E1-B4 also cited seacom.mu / PeeringDB; organization name unchanged) |
| Official sales/contact page | https://seacom.com/contact-us |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | info@seacom.com |
| Recipient telephone | Tanzania reception +255 76 470 1515; Tanzania sales office +255 739 602 827; Tanzania CLS office +255 748 771 130; Mauritius HQ reception +230 660 5000 |
| Recipient country | Mauritius (HQ) and Tanzania (Dar es Salaam office and CLS) as published. |
| Source of recipient information | Official SEACOM contact-us page. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT**. **REQUIRES HUMAN CONFIRMATION** of which published office/number to address (HQ `info@` vs Tanzania sales vs CLS). |
| Notes | SEND: Class C Tanzania facility is in RFI scope; whether EOS-class hosting is offered remains REQUIRES RFI. `support@seacom.com` is a support address — not used as the RFI mailbox. Call **not** made. |

### CU-11 — WIA

| Field | Record |
| --- | --- |
| CU-ID | CU-11 |
| Organization | WIA |
| RFI disposition | **SEND** |
| Official website | https://wia.co.tz/ |
| Official sales/contact page | https://wia.co.tz/ (homepage, 2026-09-17). E1-B4 colo URL https://wia.co.tz/datacenter-colocation returned **404** on this date — universe row **not** deleted. |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | info@wia.co.tz |
| Recipient telephone | Sales +255 766 232 222 · Switchboard +255 699 910 800 |
| Recipient country | Tanzania (Masaki, Dar es Salaam, per homepage) |
| Source of recipient information | Official WIA homepage. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: E1-B4 Class C Tanzania colo self-description. Homepage is ISP-forward; colo product page was not retrievable on this date. Human issuer may re-check colo URL before send. `support@wia.co.tz` not used as RFI mailbox. |

### CU-12 — Wingu Africa

| Field | Record |
| --- | --- |
| CU-ID | CU-12 |
| Organization | Wingu Africa |
| RFI disposition | **SEND** |
| Official website | https://www.wingu.africa/ |
| Official sales/contact page | https://www.wingu.africa/contact · Tanzania market page recorded in E1-B4 |
| Named recipient | *(blank — not invented)* |
| Recipient job title | *(blank)* |
| Recipient email | info@wingu.africa |
| Recipient telephone | *(none published on the contact page fetch)* |
| Recipient country | Tanzania (Mbezi DC and Oysterbay office listed on the official contact page) |
| Source of recipient information | Official contact page (locations, form); `info@wingu.africa` on official services footer. |
| Verification date | 2026-09-17 |
| Verification status | **OFFICIAL GENERAL CONTACT** |
| Notes | SEND: Class C Tanzania DC/colo; Class D potential. Leadership biographies on https://www.wingu.africa/leadership name commercial roles **without** RFI email addresses; those names are **not** entered as recipients and emails are **not** inferred. Contact form **not** submitted. |

---

## 4. INITIAL_RFI_SEND_SET

**Not a ranking. Not a shortlist. Not provider selection. Not architecture selection.**

| Include | CU-IDs |
| --- | --- |
| **INITIAL_RFI_SEND_SET** | **CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-10, CU-11, CU-12** |
| HOLD (not in send set) | **CU-05** |
| EXCLUDE | **none** |

**11 of 12** candidates are classified **SEND** because E1-B4 already records them as public-cloud, colo/DC, or hybrid-infrastructure parties for classes A–D. The frozen RFI is the verification path for PostgreSQL, backup/PITR, DR, residency, SLA, and TCO.

**Not all 12.** **CU-05** is **HOLD**:

| CU-ID | Why not SEND |
| --- | --- |
| CU-05 | E1-B4 type is connectivity / cloud-connect. Hosting of EOS PostgreSQL is UNKNOWN. E1-B4 states this is not a Class A cloud-region substitute. Direct relevance to the **full** hosting/residency questionnaire is not established; clarify scope before sending. |

CU-09 remains **SEND** even though TZ1 is **launching 2026 / not treated as live**: Class C Tanzania colo questions (including “can you host in Tanzania?” / operational status) are in the frozen RFI. SEND is information-gathering, not a finding that the site is in production.

---

## 5. Contact-status summary

| CU-ID | Disposition | Contact status | Named verified recipient? |
| --- | --- | --- | --- |
| CU-01 | SEND | OFFICIAL GENERAL CONTACT | **No** |
| CU-02 | SEND | OFFICIAL GENERAL CONTACT (form) + REQUIRES HUMAN CONFIRMATION (channel) | **No** |
| CU-03 | SEND | OFFICIAL GENERAL CONTACT (form/chat) + REQUIRES HUMAN CONFIRMATION (channel) | **No** |
| CU-04 | SEND | OFFICIAL GENERAL CONTACT | **No** |
| CU-05 | HOLD | OFFICIAL GENERAL CONTACT (form/office) + REQUIRES HUMAN CONFIRMATION (scope and channel) | **No** |
| CU-06 | SEND | OFFICIAL GENERAL CONTACT (chat/phone directory) + REQUIRES HUMAN CONFIRMATION (channel) | **No** |
| CU-07 | SEND | OFFICIAL GENERAL CONTACT (form/chat) + REQUIRES HUMAN CONFIRMATION (channel) | **No** |
| CU-08 | SEND | OFFICIAL GENERAL CONTACT | **No** |
| CU-09 | SEND | OFFICIAL GENERAL CONTACT | **No** |
| CU-10 | SEND | OFFICIAL GENERAL CONTACT + REQUIRES HUMAN CONFIRMATION (which office) | **No** |
| CU-11 | SEND | OFFICIAL GENERAL CONTACT | **No** |
| CU-12 | SEND | OFFICIAL GENERAL CONTACT | **No** |

**Named verified recipients:** **none (0/12).**  
**Official general sales/contact channel only:** **all 12.**  
**No suitable official contact yet:** **none.**  
**DO NOT USE:** **none.**

Human confirmation still required **before any actual send** for every row: **HR-04** sender identity and **HR-05** chosen recipient/channel. Control-register recipient fields remain blank until a human records a real, confirmed address. This file does **not** tick those fields.

---

## 6. Governance safety

| Item | Status |
| --- | --- |
| E1-B4 candidate universe modified? | **NO** |
| Frozen questionnaire / PE-01–PE-48 / response template modified? | **NO** |
| External issuance authorization modified? | **NO** |
| E1-B5 frozen package (control register, manifest, transmittal, checklist, readiness audit) modified? | **NO** |
| ADR-0006 / DP-0006 amended? | **NO** |
| Provider contacted / telephoned / emailed? | **NO** |
| Web form submitted / vendor account created? | **NO** |
| RFI sent? | **NO** |
| Provider or architecture selected? | **NO** |
| UAT / Production / migration / deployment? | **NO** |
| Commit / push? | **NO** |

**Current issuance state remains:** **PACKAGE READY / NOT SENT**.

**Historical next action (SUPERSEDED):** transmit the frozen pack to INITIAL_RFI_SEND_SET (11). **Do not use that set.**

**Current next governed action:** Follow [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md). Full four-document pack only for the 9 FULL-RFI ELIGIBLE candidates. CU-10 and CU-11: E1-B4.6 nine-question clarification only, if separately executed. CU-05: no transmission. Do not automatically send. This file does not itself send.
