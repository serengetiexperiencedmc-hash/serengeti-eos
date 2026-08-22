# Serengeti EOS — Commercial Web UI

Next.js App Router workspace for Sales and Marketing teams.

## Run (Development)

Start the API first, then the web app:

```bash
cd serengeti-eos
npm install

# Terminal 1 — API on http://127.0.0.1:8080
npm run dev -w @sedmc/api

# Terminal 2 — Commercial UI on http://localhost:3001
npm run dev -w @sedmc/web
```

Open [http://localhost:3001/commercial](http://localhost:3001/commercial) — **Suppliers** and **CRM** are on the live API.

Sign in with a Development account (e.g. `carol.admin@sedmc.local` and the password from your `.env` bootstrap secrets).

The web app proxies API calls through `/eos-api/*` → `http://127.0.0.1:8080/*` (override with `EOS_API_URL`).

## Routes

| Path | Screen | Data source |
| --- | --- | --- |
| `/commercial` | Dashboard — live supplier/CRM stats + mock RFPs | **Hybrid** |
| `/commercial/pipeline` | Opportunity kanban | Mock |
| `/commercial/rfps` | RFP detail — workflow, team, costing | Mock |
| `/commercial/programme` | Programme Builder — 3-panel itinerary + live costing | Mock |
| `/commercial/proposals` | Proposal list with client view tracking | Mock |
| `/commercial/suppliers` | Supplier Library + CSV import | **Live API** |
| `/commercial/crm` | CRM orgs, contacts, accounts, activities + import | **Live API** |

## Supplier Library (C4)

- Lists suppliers from `GET /v1/suppliers` with category filters and search
- Supplier detail drawer: contacts, rates, content blocks via `GET /v1/suppliers/:id`
- CSV import modal: create → validate → commit (`POST /v1/suppliers/imports/*`)

Import order: suppliers → contacts → rates → content blocks. Templates: `docs/c4/import/`.

## CRM (C1)

- Tabbed views: Organizations, Contacts, Accounts, Activities
- Endpoints: `GET /v1/crm/organizations`, `/contacts`, `/accounts`, `/activities`
- CSV import modal: organizations then contacts (`POST /v1/crm/imports/*`)

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS v4
- Serengeti brand tokens (Cormorant Garamond + Outfit)

## Static mockup

A standalone HTML version also exists at:

`C:\Users\PC\SEDMC Software\mockups\commercial-workspace\index.html`
