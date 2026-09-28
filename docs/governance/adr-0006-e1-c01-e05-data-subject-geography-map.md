# E-05 — Data-Subject / Client / Destination / Processing Geography Map

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: PARTIALLY EVIDENCED` / `DRAFT` / `REQUIRES HUMAN REVIEW`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**  
> **`PRODUCTION PROCESSING/STORAGE GEOGRAPHY: NOT SELECTED`**

These four geographies are **not interchangeable**.

| Layer | Meaning | Must not be confused with |
| --- | --- | --- |
| **A. Client / organisation geography** | Country/market of the **client organisation** (legal person or booking entity) | Individual data-subject location; programme destination; EOS hosting |
| **B. Individual data-subject geography** | Location/residence/presence of a **natural person** whose data EOS processes | Client HQ; safari destination; server region |
| **C. Programme destination** | Where the **itinerary/event** occurs (e.g. Tanzania/Kenya parks and hotels) | Where the planner lives; where EOS is hosted |
| **D. EOS processing/storage geography** | Where EOS **systems** process and store data (app, DB, objects, backup, DR, email, IdP, monitoring) | Any of A–C |

COMPANY POSITION (LA-05 and related): SEDMC source markets include South Africa, Europe, Middle East, Canada, United States, Latin America, plus Tanzania/Kenya as destination and commercial markets. That list is **`TARGET MARKET`**, not a verified **`ACTUAL DATA-SUBJECT JURISDICTION`** census.

---

## 1. Evidence quality

| Layer | FACT in repository | COMPANY POSITION | DESIGN INTENT | Census of actual Production subjects |
| --- | --- | --- | --- | --- |
| A | Schema **can store** `crm_organizations.country` / `region` / `market` | Target commercial markets listed | — | **Not evidenced** |
| B | Schema **can store** `crm_contacts.country`; principals have email (not a country census) | Intended subjects include staff, clients, planners, suppliers, and (if later processed) delegates | Delegate identity **`FUTURE / NOT CURRENTLY EVIDENCED`** as structured processing | **Not evidenced** |
| C | RFP/programme `destinations` / day `location` **text fields**; Dev seed location `ARU` Arusha | Tanzania and Kenya are significant destinations | Dev seed ≠ operating establishment evidence | No Production itinerary census |
| D | Dev/Test: local/in-memory/Gate-B disposable PostgreSQL; Dev `LocalFsDocumentStorage` | Tanzania hosting **preferred**, **not selected** | Production topology undefined | **NOT SELECTED** |

Human Legal/DPO determination of **legal geography** (which law applies) is **not** this map. See [`adr-0006-e1-c01-e18-source-market-applicability-screening.md`](adr-0006-e1-c01-e18-source-market-applicability-screening.md).

---

## 2. Layer A — Client / organisation geography

| Market / region | Relevance to SEDMC | Classification | Actual client-org census in EOS Production? | Evidence |
| --- | --- | --- | --- | --- |
| Tanzania | COMPANY POSITION: home/commercial market and destination operations | **`TARGET MARKET`** | **Not evidenced** | Company position LA-01/LA-05; schema `country` field only |
| Kenya | COMPANY POSITION: significant destination and commercial market | **`TARGET MARKET`** | **Not evidenced** | Company position LA-03 |
| South Africa | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position source-market list |
| Europe / EU-EEA | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position LA-05 |
| United Kingdom | COMPANY POSITION: included in Europe/UK source-market discussion | **`TARGET MARKET`** | **Not evidenced** | Company position LA-05; UK treated separately for legal screening (E-18) |
| Middle East | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position |
| Canada | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position |
| United States | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position |
| Latin America | COMPANY POSITION: source market | **`TARGET MARKET`** | **Not evidenced** | Company position |

EOS **capability** to record organisation country: FACT (`crm_organizations.country`). That is **not** a list of actual clients.

---

## 3. Layer B — Individual data-subject geography

| Data-subject class (from E-04) | Structured in EOS today? | Actual jurisdiction census? | Notes |
| --- | --- | --- | --- |
| SEDMC employees / contractors (principals) | Email + display name; **no** country field on `principals` | **Not evidenced** | Do not infer from `@` domain or names |
| CRM contacts | Optional `country` field | **Not evidenced** as Production population | `TARGET MARKET` ≠ contact country |
| Supplier / hotel contacts | Via CRM or supplier records | **Not evidenced** | Vendor location ≠ contact residence |
| Named delegates / travellers | **`FUTURE / NOT CURRENTLY EVIDENCED`** as structured processing | **Not evidenced** | Do not treat programme destination as delegate residence |
| Document-file subjects | Unknown bytes | **Not evidenced** | Residual risk |

**`ACTUAL DATA-SUBJECT JURISDICTION`:** **MISSING** for Production. No verified individual geography census exists in this repository.

---

## 4. Layer C — Programme destination

| Destination | Relevance | Evidence type | Interchangeability warning |
| --- | --- | --- | --- |
| Tanzania | COMPANY POSITION: core destination | Business position; RFP/programme destination **text**; Dev seed `ARU` | Presence of a Tanzania itinerary does **not** prove TZ PDPA applicability by itself (counsel L-16 correction) |
| Kenya | COMPANY POSITION: significant destination | Business position; destination **text** capability | Kenya programme ≠ Kenya DPA automatically |
| Other destinations | Possible in free-text `destinations` / `location` | Schema capability only | Do not invent a destination list beyond documented markets |

Dev seed location Arusha is **DESIGN / DEV SEED**, not evidence of legal establishment (see E-01).

---

## 5. Layer D — EOS processing / storage geography

| Component | Current evidence | Production geography |
| --- | --- | --- |
| Application | Dev/Test local | **NOT SELECTED** |
| PostgreSQL | Intended durable SoR; Gate-B/Dev PostgreSQL is **not** Production | **NOT SELECTED** |
| Document/object storage | Dev `LocalFsDocumentStorage` | **CANDIDATE — NOT SELECTED** |
| Backups | Gate-B/Gate-C Dev/Test dumps **excluded** as Production evidence | **NOT SELECTED** |
| DR | Not selected | **NOT SELECTED** |
| IdP | ADR-0013 OPEN; Dev local password IdP | **NOT SELECTED** |
| Email | Production email **not selected** | **NOT SELECTED** |
| Monitoring / logs | **Not selected** | **NOT SELECTED** |
| CDN / WAF / KMS | **Not selected** | **NOT SELECTED** |

Tanzania is the **preferred** hosting jurisdiction in company position LA-06. Preferred ≠ selected.

---

## 6. Worked non-equivalence examples (illustrative, not facts)

These examples show **why** layers must stay separate. They are **not** claims about actual current clients.

| Scenario (hypothetical) | A Client org | B Individual | C Destination | D Processing |
| --- | --- | --- | --- | --- |
| EU agency books a Tanzania safari; planner emails from France | Possibly EU/France org | Planner **might** be in France — **not evidenced** | Tanzania | Unknown until hosting selected |
| Kenya hotel as supplier | Kenya vendor org possible | Hotel contact **might** be in Kenya — **not evidenced** | Kenya (service location) | Unknown |
| SEDMC staff in Arusha using EOS | SEDMC (entity **MISSING** — E-01) | Staff location **not evidenced** | n/a | Unknown |

---

## 7. Gaps

| Gap | Owner | Blocks |
| --- | --- | --- |
| Authoritative client-org market list vs actual accounts | Commercial | Completeness of A |
| Contact/staff country census (if required for L-16) | Privacy/ops | Completeness of B; E-18 |
| Confirmation whether named delegates will be processed | Product + privacy | B and E-04 P-PRG-03 |
| Production processing geography | Architecture (later phase) | Layer D; E-08/E-19–E-28 |
| Human Legal characterisation of “legal geography” | Legal/DPO | E-18; LA-05 |

---

## 8. Status

| Field | Value |
| --- | --- |
| Map status | **`DRAFT` · `PARTIALLY EVIDENCED`** (target markets + schema capability) |
| Actual data-subject jurisdiction | **`MISSING`** |
| Processing geography | **`MISSING`** · architecture-dependent |
| Closes E-05? | **No** |
