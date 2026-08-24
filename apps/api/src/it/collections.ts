import type { CmdbCi, CmdbRelationship, ItsmTicket, ItsmTicketCi } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const IT_SEED = {
  webCiId: "61616161-6161-4616-8616-616161616161",
  apiCiId: "60606060-6060-4606-8606-606060606060",
  dbCiId: "62626262-6262-4626-8626-626262626262",
  webDependsApiId: "63636363-6363-4636-8636-636363636363",
  apiDependsDbId: "64646464-6464-4646-8646-646464646464",
  outageTicketId: "70707070-7070-4707-8707-707070707070",
  ticketCiLinkId: "71717171-7171-4717-8717-717171717171",
} as const;

export function ensureItCollections(store: Store): void {
  if (!store.cmdbCis) store.cmdbCis = [];
  if (!store.cmdbRelationships) store.cmdbRelationships = [];
  if (!store.itsmTickets) store.itsmTickets = [];
  if (!store.itsmTicketCis) store.itsmTicketCis = [];
}

export function seedDefaultIt(store: Store): void {
  ensureItCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.cmdbCis.some((c) => c.tenantId === tenant.id)) return;

  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T08:00:00.000Z";

  const cis: CmdbCi[] = [
    {
      id: IT_SEED.webCiId,
      tenantId: tenant.id,
      ciCode: "CI-0001",
      name: "EOS Web",
      ciClass: "application",
      lifecycle: "active",
      environment: "development",
      criticality: "high",
      classification: "Internal",
      sourceOfTruth: "manual",
      ownerName: "Platform",
      custodianName: "IT",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
    {
      id: IT_SEED.apiCiId,
      tenantId: tenant.id,
      ciCode: "CI-0002",
      name: "EOS API",
      ciClass: "application",
      lifecycle: "active",
      environment: "development",
      criticality: "critical",
      classification: "Internal",
      sourceOfTruth: "manual",
      ownerName: "Platform",
      custodianName: "IT",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
    {
      id: IT_SEED.dbCiId,
      tenantId: tenant.id,
      ciCode: "CI-0003",
      name: "EOS OLTP",
      ciClass: "database",
      lifecycle: "active",
      environment: "development",
      criticality: "critical",
      classification: "Confidential",
      sourceOfTruth: "manual",
      ownerName: "Platform",
      custodianName: "IT",
      rtoMinutes: 60,
      rpoMinutes: 15,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
  ];
  store.cmdbCis.push(...cis);

  const rels: CmdbRelationship[] = [
    {
      id: IT_SEED.webDependsApiId,
      tenantId: tenant.id,
      fromCiId: IT_SEED.webCiId,
      toCiId: IT_SEED.apiCiId,
      relType: "depends_on",
      createdAt: now,
      createdByPrincipalId: carol.id,
    },
    {
      id: IT_SEED.apiDependsDbId,
      tenantId: tenant.id,
      fromCiId: IT_SEED.apiCiId,
      toCiId: IT_SEED.dbCiId,
      relType: "depends_on",
      createdAt: now,
      createdByPrincipalId: carol.id,
    },
  ];
  store.cmdbRelationships.push(...rels);

  const ticket: ItsmTicket = {
    id: IT_SEED.outageTicketId,
    tenantId: tenant.id,
    ticketCode: "TKT-0001",
    title: "API health checks failing in Dev/Test",
    description: "Seeded incident against EOS API — not a production outage.",
    ticketType: "incident",
    severity: "high",
    status: "open",
    environment: "development",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.itsmTickets.push(ticket);

  const link: ItsmTicketCi = {
    id: IT_SEED.ticketCiLinkId,
    tenantId: tenant.id,
    ticketId: ticket.id,
    ciId: IT_SEED.apiCiId,
    createdAt: now,
  };
  store.itsmTicketCis.push(link);
}
