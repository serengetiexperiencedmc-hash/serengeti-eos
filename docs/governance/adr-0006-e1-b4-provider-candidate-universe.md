# E1-B4 — Provider Candidate Universe

> **`E1-B4 CANDIDATE UNIVERSE — INFORMATION-GATHERING ONLY`**  
> **`NOT PROVIDER SELECTION`** · **`NOT RANKING`** · **`NOT SCORING`** · **`NOT SHORTLIST`** · **`NOT RECOMMENDATION`**  
> **`NOT CONTRACTING`** · **`NOT RFI SENT`** · **`NO NAMED RECIPIENT FABRICATED`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`E1-B3 = FRAMEWORK PREPARED — NO PROVIDER RESPONSE RECEIVED`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Repository calendar date / public-source access date:** 2026-09-16.

This file documents a **market universe** of organizations that, on public information, appear capable of providing one or more services in the frozen E1-B RFI/RFQ scope. A human issuer **may later** choose which members to contact under the already-authorized information-gathering activity.

**Every organization below is a candidate for information-gathering only.**

This file does **not** send the RFI/RFQ, identify a named recipient, create a vendor account, ingest evidence, or select architecture or provider.

**Frozen files not modified:** E1-B questionnaire (168 questions); PE-01–PE-48; issuance authorization; E1-B3 framework and intake/custody files; ADR-0006; DP-0006.

---

## 1. Purpose and limits

| This file is | This file is not |
| --- | --- |
| A documented universe for possible later RFI recipients | A shortlist |
| Factual public-market coverage across classes A–D | A ranking or score |
| Input to a **human issuer decision** on whom to contact | Proof that an RFI was sent |
| Compatible with E1-B3 intake **after** a genuine response | E1-B3 evaluation of any organization |

Geographic presence, published regions, certifications, data-centre addresses, and marketing claims are **candidate-universe facts only**. They are **not** evidence of SEDMC suitability. Suitability, if ever assessed, is through E1-B3 against an actual response.

**Africa ≠ Tanzania.** A South Africa or Kenya facility does **not** establish Tanzania Production residency. Tanzania remains **not** an approved Production location.

---

## 2. Inclusion criteria (not ranking)

An organization may be recorded if public information indicates it can provide **one or more** of:

- managed cloud hosting;
- African-region cloud infrastructure;
- EU/EEA cloud infrastructure;
- Tanzania-controlled colocation;
- Tanzania/local infrastructure;
- hybrid infrastructure;
- managed PostgreSQL;
- backup/PITR;
- DR;
- object/document storage;
- networking/security;
- managed operations;
- relevant support services.

Inclusion means only: **in the universe for possible information-gathering**. Exclusion from this first pass does **not** mean unsuitability. This universe is **not exhaustive**.

An organization may be tagged with **more than one** architecture class if public facts support multiple capabilities. Tags are **potential relevance**, not selection.

Architecture classes (**not ranked**; **no class is stated as better than another**):

| Class | Meaning |
| --- | --- |
| A | African managed cloud |
| B | EU/EEA managed cloud |
| C | Tanzania-controlled colocation / local infrastructure |
| D | Hybrid |

Category **E** in §4 is **managed infrastructure / colocation** (may overlap A–D). It is a coverage bucket, not a fifth architecture class and not a rank.

---

## 3. Evidence vocabulary

| Label | Meaning |
| --- | --- |
| CONFIRMED PUBLIC FACT | Stated on an official public page cited below (region list, company facility page, PeeringDB). Still not SEDMC suitability. |
| PROVIDER SELF-DESCRIPTION | Organization’s own marketing or product page. |
| UNVERIFIED / REQUIRES RFI | Not established for SEDMC; the frozen questionnaire is the verification path. |
| UNKNOWN | Not established from sources inspected on 2026-09-16. |

Service availability (PostgreSQL 16, PITR, backup geography, DR, Tanzania lock, support countries): **REQUIRES RFI** unless an official public page **explicitly** documents the specific service **in that location**. **Region existence ≠ every required service.**

Claim types: (1) publicly confirmed fact; (2) provider self-description; (3) candidate claim requiring RFI verification; (4) unknown.

**CONFIRMED** / **UNKNOWN** / **REQUIRES RFI** are used for service-availability fields.

Contact route: **public website only**. No personal names, no fabricated emails, no assertion that a recipient was identified.

---

## 4. Candidate records

Order is **alphabetical by organization name**. Order is **not** a rank.

### CU-01 — Africa Data Centres

| Field | Record |
| --- | --- |
| Candidate ID | CU-01 |
| Organization name | Africa Data Centres |
| Organization type | Colocation / data-centre operator (public description) |
| Architecture class(es) potentially relevant | D (interconnect/hybrid **possible** — REQUIRES RFI); E coverage bucket (colo). **Not** Class C: no Tanzania facility confirmed here. |
| Country/region presence | Nairobi, Kenya (NBO1, Sameer Industrial Park); Johannesburg / Centurion, South Africa (Samrand / JHB1, 17 Waterloo Road) |
| Relevant service category | Colocation; interconnection; claimed multi-cloud on-ramps |
| Publicly documented infrastructure location | Nairobi; Samrand Business Park, Centurion, South Africa |
| Public evidence source | https://www.africadatacentres.com/nairobi/ · https://www.africadatacentres.com/samrand-2/ |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Public colo/interconnect presence in African locations relevant to Class A/D **coverage**, not Tanzania residency |
| Evidence status | CONFIRMED PUBLIC FACT (facility pages exist). Managed PostgreSQL / PITR / Tanzania hosting: REQUIRES RFI / not shown. |
| Unknowns | Contracting entity; Tanzania presence; PostgreSQL; backup/DR geography; support personnel countries |
| Notes | Kenya/South Africa ≠ Tanzania. Candidate for information-gathering only. |

### CU-02 — Amazon Web Services

| Field | Record |
| --- | --- |
| Candidate ID | CU-02 |
| Organization name | Amazon Web Services (public brand). Contracting legal entity: UNKNOWN / REQUIRES RFI. |
| Organization type | Public cloud |
| Architecture class(es) potentially relevant | A, B, D |
| Country/region presence | Africa (Cape Town) `af-south-1` (South Africa). Multiple EU regions on the same AWS Regions page (e.g. Europe geography entries). **No Tanzania region on the cited page.** |
| Relevant service category | Managed cloud; object storage; managed databases (service-by-region REQUIRES RFI); backup/DR (REQUIRES RFI); networking/security |
| Publicly documented infrastructure location | Africa (Cape Town), South Africa — AWS Regions documentation |
| Public evidence source | https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website / documentation only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented African and EU/EEA region list |
| Evidence status | CONFIRMED PUBLIC FACT (region table). PostgreSQL 16 in a given region, backup copy location, Tanzania lock: REQUIRES RFI. |
| Unknowns | Contracting entity for SEDMC; service catalogue per region; subprocessors; support geography; residency contractual lock |
| Notes | Cape Town is not Tanzania. Candidate for information-gathering only. |

### CU-03 — Google Cloud

| Field | Record |
| --- | --- |
| Candidate ID | CU-03 |
| Organization name | Google Cloud (public brand). Contracting entity: UNKNOWN / REQUIRES RFI. |
| Organization type | Public cloud |
| Architecture class(es) potentially relevant | A, B, D |
| Country/region presence | `africa-south1` Johannesburg, South Africa (zones a/b/c). EU/EEA regions exist on the same Compute Engine regions/zones page. **No Tanzania region cited.** |
| Relevant service category | Managed cloud; object storage; managed databases (per-region REQUIRES RFI) |
| Publicly documented infrastructure location | Johannesburg, South Africa |
| Public evidence source | https://docs.cloud.google.com/compute/docs/regions-zones |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website / documentation only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented African and EU/EEA region list |
| Evidence status | CONFIRMED PUBLIC FACT (region/zone table). SEDMC service fit: REQUIRES RFI. |
| Unknowns | Contracting entity; PostgreSQL 16; backup/DR locations; Tanzania capability |
| Notes | Johannesburg is not Tanzania. Candidate for information-gathering only. |

### CU-04 — Hetzner Online

| Field | Record |
| --- | --- |
| Candidate ID | CU-04 |
| Organization name | Hetzner Online |
| Organization type | Cloud, dedicated servers, colocation (public description) |
| Architecture class(es) potentially relevant | B; E coverage bucket (colo in DE/FI) |
| Country/region presence | Cloud locations `fsn1` Falkenstein (Germany), `nbg1` Nuremberg (Germany), `hel1` Helsinki (Finland — EEA). Additional non-EEA locations exist (US, Singapore) and are **out of Class B** unless separately scoped. |
| Relevant service category | Cloud compute; dedicated; colocation; object storage (product availability REQUIRES RFI) |
| Publicly documented infrastructure location | Falkenstein; Nuremberg; Helsinki (own parks per Hetzner Docs) |
| Public evidence source | https://docs.hetzner.com/cloud/general/locations/ · https://www.hetzner.com/unternehmen/rechenzentrum |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented EU/EEA data-centre locations |
| Evidence status | CONFIRMED PUBLIC FACT (locations). Managed PostgreSQL 16, DR, Tanzania: UNKNOWN / not offered on cited pages — REQUIRES RFI. |
| Unknowns | Contracting entity; managed PostgreSQL; African/Tanzania presence (none on cited pages) |
| Notes | Candidate for information-gathering only. Support geography REQUIRES RFI. |

### CU-05 — Liquid C2 / Liquid Intelligent Technologies

| Field | Record |
| --- | --- |
| Candidate ID | CU-05 |
| Organization name | Liquid C2 (Liquid Intelligent Technologies — public brand) |
| Organization type | Connectivity / cloud-connect (public description) |
| Architecture class(es) potentially relevant | D; E coverage bucket (connectivity). Not Class C on cited page. |
| Country/region presence | Public page describes ExpressRoute/CloudConnect and Microsoft peering at Cape Town, Johannesburg, Nairobi, Lagos, London |
| Relevant service category | Networking; claimed cloud interconnect; managed operations UNKNOWN |
| Publicly documented infrastructure location | Peering/connect locations as listed on liquidc2.com/connect/ — not a Tanzania Production hosting confirmation |
| Public evidence source | https://liquidc2.com/connect/ |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Public interconnect/hybrid-path offering relevant to Class D **coverage** |
| Evidence status | PROVIDER SELF-DESCRIPTION of connectivity products. Hosting of EOS PostgreSQL: UNKNOWN / REQUIRES RFI. |
| Unknowns | Whether they host customer PostgreSQL; Tanzania DC; contracting entity |
| Notes | Candidate for information-gathering only. Not a cloud-region substitute for Class A by itself. |

### CU-06 — Microsoft Azure

| Field | Record |
| --- | --- |
| Candidate ID | CU-06 |
| Organization name | Microsoft Azure (public brand). Contracting entity: UNKNOWN / REQUIRES RFI. |
| Organization type | Public cloud |
| Architecture class(es) potentially relevant | A, B, D |
| Country/region presence | South Africa North (Johannesburg, `southafricanorth`); South Africa West (Cape Town, `southafricawest`) described as access-restricted on Microsoft’s regions list. EU/EEA regions exist on the same list. **No Tanzania region cited.** |
| Relevant service category | Managed cloud; databases; object storage; identity (service-by-region REQUIRES RFI) |
| Publicly documented infrastructure location | Johannesburg; Cape Town (South Africa) |
| Public evidence source | https://learn.microsoft.com/en-us/azure/reliability/regions-list |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website / documentation only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented African and EU/EEA region list |
| Evidence status | CONFIRMED PUBLIC FACT (region table). South Africa West access restriction: CONFIRMED PUBLIC FACT on that page — **not** a suitability score. PostgreSQL 16 / Tanzania: REQUIRES RFI. |
| Unknowns | Contracting entity; per-region PostgreSQL; backup/DR copies; support geography |
| Notes | South Africa ≠ Tanzania. Candidate for information-gathering only. |

### CU-07 — Oracle Cloud Infrastructure

| Field | Record |
| --- | --- |
| Candidate ID | CU-07 |
| Organization name | Oracle Cloud Infrastructure |
| Organization type | Public cloud |
| Architecture class(es) potentially relevant | A, B, D |
| Country/region presence | South Africa Central (Johannesburg) `af-johannesburg-1` — Live on Oracle public-cloud-regions page. Kenya listed **Coming soon** on that page — **not** treated as live. EU/EEA regions exist on Oracle region documentation. **No Tanzania region cited.** |
| Relevant service category | Managed cloud; object storage endpoints documented for `af-johannesburg-1`; database services per-region REQUIRES RFI |
| Publicly documented infrastructure location | Johannesburg, South Africa |
| Public evidence source | https://docs.oracle.com/iaas/Content/General/Concepts/regions.htm · https://www.oracle.com/cloud/public-cloud-regions/ · https://docs.public.content.oci.oraclecloud.com/en-us/iaas/releasenotes/changes/8b70bb98-9542-4dae-92d9-8d3f05cc8417/ |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website / documentation only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented African (Johannesburg) and EU region catalogues |
| Evidence status | CONFIRMED PUBLIC FACT (Johannesburg live; Kenya coming soon). PostgreSQL 16 / Tanzania: REQUIRES RFI. |
| Unknowns | Contracting entity; managed PostgreSQL version; backup geography |
| Notes | Do not treat “Coming soon” Kenya as an available region. Candidate for information-gathering only. |

### CU-08 — OVHcloud

| Field | Record |
| --- | --- |
| Candidate ID | CU-08 |
| Organization name | OVHcloud |
| Organization type | Public cloud / hosting |
| Architecture class(es) potentially relevant | B |
| Country/region presence | Official location pages list EU/EEA sites including France (Gravelines, Paris, Roubaix, Strasbourg), Germany (Frankfurt, Limburg), Finland (Helsinki), Poland (Warsaw), Italy (Milan). United Kingdom (London) is **not** EEA — Class B tag does not automatically cover UK. |
| Relevant service category | Cloud; dedicated; object storage (product-by-region REQUIRES RFI) |
| Publicly documented infrastructure location | EU/EEA cities listed on OVHcloud location pages |
| Public evidence source | https://www.ovhcloud.com/en/about-us/global-infrastructure/regions/ · https://www.ovhcloud.com/en/datacenter/ |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Officially documented EU/EEA data-centre countries |
| Evidence status | CONFIRMED PUBLIC FACT (location list). African/Tanzania presence: not on cited pages — UNKNOWN. PostgreSQL 16: REQUIRES RFI. |
| Unknowns | Contracting entity; Tanzania; managed PostgreSQL; DR geography |
| Notes | Candidate for information-gathering only. |

### CU-09 — Raxio Group (Tanzania TZ1 — announced)

| Field | Record |
| --- | --- |
| Candidate ID | CU-09 |
| Organization name | Raxio Group |
| Organization type | Colocation developer/operator (public description) |
| Architecture class(es) potentially relevant | C **if and when** a Tanzania facility is operational — current public pages describe a **2026 launch**, not demonstrated live Production colo for SEDMC |
| Country/region presence | Public Tanzania page: Dar es Salaam facility “Launching 2026” |
| Relevant service category | Planned colocation |
| Publicly documented infrastructure location | Outskirts of Dar es Salaam (company page; exact operational status REQUIRES RFI) |
| Public evidence source | https://www.raxiogroup.com/data-centres/tanzania/ |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Public announcement of a Tanzania colo project — universe coverage for Class C, **not** confirmation the site is live |
| Evidence status | PROVIDER SELF-DESCRIPTION of a future/launching facility. Operational date, Tier claims, power, racks: UNVERIFIED / REQUIRES RFI. |
| Unknowns | Whether TZ1 is accepting customers on 2026-09-16; contracting entity; managed PostgreSQL (typically colo, not DBaaS) |
| Notes | Do not treat as a live equivalent of a documented operating DC. Candidate for information-gathering only. |

### CU-10 — SEACOM Limited

| Field | Record |
| --- | --- |
| Candidate ID | CU-10 |
| Organization name | SEACOM Limited |
| Organization type | Submarine cable / facility operator (PeeringDB) |
| Architecture class(es) potentially relevant | C (colo at cable-landing facility — scope REQUIRES RFI); E coverage bucket |
| Country/region presence | PeeringDB facility: SEACOM Dar Es Salaam CLS, 49 Silver Sands Area, Kunduchi, Dar es Salaam, TZ |
| Relevant service category | Colocation at CLS (extent REQUIRES RFI); connectivity |
| Publicly documented infrastructure location | Kunduchi, Dar es Salaam, Tanzania |
| Public evidence source | https://www.peeringdb.com/fac/1932 |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public PeeringDB / seacom.mu website — recipient not identified; RFI not sent |
| Eligibility rationale | Independently listed Tanzania facility record (PeeringDB), not a ranking |
| Evidence status | CONFIRMED PUBLIC FACT (PeeringDB address/country). Managed PostgreSQL, SLA, certifications: UNKNOWN / REQUIRES RFI. Third-party colo directories with generic certification boilerplate were **not** used as confirmation. |
| Unknowns | Whether EOS-class hosting is offered; contracting entity; support access geography |
| Notes | Candidate for information-gathering only. |

### CU-11 — WIA

| Field | Record |
| --- | --- |
| Candidate ID | CU-11 |
| Organization name | WIA (public site wia.co.tz) |
| Organization type | ISP / colocation (public description) |
| Architecture class(es) potentially relevant | C; E coverage bucket |
| Country/region presence | Public site: Dar es Salaam, Tanzania; colocation product page |
| Relevant service category | Cabinet/cage/suite colocation (self-description); carrier-neutral claim (self-description) |
| Publicly documented infrastructure location | Tanzania (facility address on colo page is product-level; precise DC coordinates REQUIRES RFI) |
| Public evidence source | https://wia.co.tz/datacenter-colocation |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Public Tanzania colo offering |
| Evidence status | PROVIDER SELF-DESCRIPTION of colo services and “ISO and Tier III” wording on that page — **not** independently verified here. PostgreSQL: UNKNOWN (colo ≠ DBaaS). REQUIRES RFI. |
| Unknowns | Independent certification artefacts; DC address; managed database; DR; support countries |
| Notes | Marketing adjectives on the source page are **not** reproduced as SEDMC findings. Candidate for information-gathering only. |

### CU-12 — Wingu Africa (Tanzania)

| Field | Record |
| --- | --- |
| Candidate ID | CU-12 |
| Organization name | Wingu Africa |
| Organization type | Data-centre / colo / claimed cloud services (public description) |
| Architecture class(es) potentially relevant | C; D (if hybrid/cloud products exist — REQUIRES RFI); E coverage bucket |
| Country/region presence | Public Tanzania market page: Mbezi data centre, Dar es Salaam; described as carrier-neutral; cable access claims (SEACOM, EASSy, 2Africa) as **self-description** |
| Relevant service category | Colocation; claimed cloud services (REQUIRES RFI) |
| Publicly documented infrastructure location | Mbezi Industrial Area, Dar es Salaam, Tanzania (also listed on third-party colo directory; primary source = wingu.africa) |
| Public evidence source | https://www.wingu.africa/markets/tanzania |
| Evidence date/access date | 2026-09-16 |
| Contact route | Public website only — recipient not identified; RFI not sent |
| Eligibility rationale | Public Tanzania data-centre page |
| Evidence status | PROVIDER SELF-DESCRIPTION of facility and connectivity. Independent “first in country” / Tier claims: UNVERIFIED / REQUIRES RFI. Managed PostgreSQL: REQUIRES RFI. |
| Unknowns | Contracting entity; operating vs marketing cloud; backup/DR; support geography |
| Notes | Candidate for information-gathering only. |

---

## 5. Coverage map (not a rank)

Counts are **how many CU records are tagged** with a class. Multi-tag is allowed. Not a score.

| Coverage bucket | Candidate IDs | Count |
| --- | --- | --- |
| A African managed cloud | CU-02, CU-03, CU-06, CU-07 | 4 |
| B EU/EEA managed cloud | CU-02, CU-03, CU-04, CU-06, CU-07, CU-08 | 6 |
| C Tanzania-controlled colo/local | CU-09, CU-10, CU-11, CU-12 | 4 |
| D Hybrid (potential, REQUIRES RFI) | CU-01, CU-02, CU-03, CU-05, CU-06, CU-07, CU-12 | 7 |
| E Managed infrastructure / colo (coverage bucket) | CU-01, CU-04, CU-05, CU-09, CU-10, CU-11, CU-12 | 7 |
| Unique organizations in this universe | CU-01–CU-12 | **12** |

**Coverage observations (non-evaluative):**

- Class A public-cloud regions cited are in **South Africa**, not Tanzania.
- Class C includes one **announced/launching** facility (CU-09) that must not be treated as confirmed live capacity.
- Hybrid tags are **potential** (product lines or interconnect). They are not a selected topology.
- No organization in this universe is recorded as having a **confirmed** public-cloud **Tanzania** region.

---

## 6. Service-availability snapshot (universe-level)

| Service | Availability in this universe |
| --- | --- |
| African public-cloud **region** (South Africa) | CONFIRMED PUBLIC FACT for CU-02, CU-03, CU-06, CU-07 |
| EU/EEA public-cloud **region** | CONFIRMED PUBLIC FACT for CU-02, CU-03, CU-04, CU-06, CU-07, CU-08 |
| Tanzania public-cloud **region** | UNKNOWN / none on cited official region lists |
| Tanzania colo **facility page** | CONFIRMED or SELF-DESCRIPTION for CU-10, CU-11, CU-12; CU-09 launching 2026 |
| Managed PostgreSQL 16 in a named location | REQUIRES RFI (all) |
| Backup / PITR / WAL geography | REQUIRES RFI (all) |
| DR / warm standby geography | REQUIRES RFI (all) |
| Contractual Tanzania residency lock | REQUIRES RFI (all) |
| Support personnel countries | REQUIRES RFI (all) |

---

## 7. RFI recipient control (blank)

No recipient is identified. No RFI is recorded as sent.

| Candidate ID | Organization | RFI Eligible? | Reason | Recipient identified? | Recipient verification status | RFI sent? | Date sent | Sender | Response received? | Response ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-02 | Amazon Web Services | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-03 | Google Cloud | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-04 | Hetzner Online | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-05 | Liquid C2 / Liquid Intelligent Technologies | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-06 | Microsoft Azure | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-07 | Oracle Cloud Infrastructure | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-08 | OVHcloud | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-09 | Raxio Group | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-10 | SEACOM Limited | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-11 | WIA | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |
| CU-12 | Wingu Africa | UNDECIDED — human issuer | In universe | NO | NOT STARTED | NO | | | NO | |

**RFI Eligible?** remains **UNDECIDED — human issuer**. This table does **not** decide whom to contact. Eligibility for the **universe** is already recorded in §4; **sending** requires a separate human act.

---

## 8. Explicit non-actions

This file does not: rank, score, shortlist, or recommend; select a provider or architecture; approve ADR-0006 or DP-0006; send email or the RFI/RFQ; fabricate recipient identities or contact details; ingest provider evidence; claim an RFI has been sent.

Preserved: E1-B information-gathering authorization; E1-B3 no-response state; Legal Counsel COMPLETE (THOMAS NGULUMA LEGAL COUNSEL ONLY); DPO NOT ESTABLISHED; Combined Legal/DPO INCOMPLETE; E-01/E-02 unverified; E-03 DPO not established; L-05/L-17 architecture-dependent.

**Exact next governed trigger:** Human issuer decision to send the already-authorized provider-neutral RFI/RFQ to selected members of the candidate universe. Sending is an external communication action and must not be represented as completed unless an actual transmission occurs. In that sentence, “selected members” means only **whom the human issuer chooses to contact**. It is **not** provider selection, ranking, scoring, shortlist, or architecture selection.
