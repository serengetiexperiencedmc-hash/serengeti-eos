"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { BOOKING_STATUS_LABELS, bookingStatusBadge } from "@/lib/booking-api";
import { EosApiError } from "@/lib/eos-client";
import { listOpsWorkbench, type OpsWorkbenchItem } from "@/lib/ops-api";

type Filter = "all" | "attention";

export default function OperationsWorkbenchPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<OpsWorkbenchItem[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      listOpsWorkbench(token, filter === "attention" ? { attention: true } : undefined),
      listOrganizations(token).catch(() => ({ items: [] as CrmOrganization[] })),
    ])
      .then(([list, orgList]) => {
        setItems(list.items);
        setOrgs(orgList.items);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load operations workbench");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [token, filter]);

  const orgNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const org of orgs) map[org.id] = org.tradingName ?? org.legalName;
    return map;
  }, [orgs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const client = orgNames[item.organizationId] ?? "";
      return (
        item.bookingCode.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        client.toLowerCase().includes(q)
      );
    });
  }, [items, orgNames, query]);

  return (
    <>
      <PageHeader
        eyebrow="O5 · Operations"
        title="Operations Workbench"
        subtitle={
          token && !loading
            ? `${items.length} active booking${items.length === 1 ? "" : "s"} · supplier · manifest · vouchers · field`
            : "Queue of confirmed bookings ready for operational execution"
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/commercial/bookings">
              <Btn variant="secondary">Bookings</Btn>
            </Link>
            <Btn variant="secondary" href="/commercial/operations/issues">
              Issues
            </Btn>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {ready && !token && (
        <p className="mb-4 text-sm text-muted">Sign in to load the operations workbench.</p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "attention"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              filter === key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:bg-sand/40"
            }`}
          >
            {key === "all" ? "All active" : "Needs attention"}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search booking, title, or client"
          className="min-w-[240px] flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Handover</th>
              <th className="px-4 py-3">Attention</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!token ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  Sign in to view operational bookings.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  Loading workbench…
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  {filter === "attention"
                    ? "No bookings need operational attention."
                    : "No active bookings. Confirm a proposal to create a booking, then open its operations workspace."}
                </td>
              </tr>
            ) : (
              visible.map((item) => (
                <tr key={item.bookingId} className="border-b border-line hover:bg-sand/30">
                  <td className="px-4 py-3">
                    <strong className="text-ink">{item.bookingCode}</strong>
                    <br />
                    <span className="text-xs text-muted">{item.title}</span>
                  </td>
                  <td className="px-4 py-3">{orgNames[item.organizationId] ?? "Client"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={bookingStatusBadge(item.status)} label={BOOKING_STATUS_LABELS[item.status] ?? item.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{item.handoverProgressPercent}%</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {item.attentionRequired ? (
                      <span className="text-terracotta">
                        {[
                          item.pendingHandoverTasks > 0 ? `${item.pendingHandoverTasks} handover` : null,
                          item.supplierConfirmationsPending > 0
                            ? `${item.supplierConfirmationsPending} suppliers`
                            : null,
                          item.vouchersDraft > 0 ? `${item.vouchersDraft} vouchers` : null,
                          item.fieldTasksOpen > 0 ? `${item.fieldTasksOpen} field` : null,
                          item.syncConflicts > 0 ? `${item.syncConflicts} sync` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ) : (
                      "Clear"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/commercial/operations/${item.bookingId}`}>
                        <Btn variant="gold" size="sm">
                          Workspace
                        </Btn>
                      </Link>
                      <Link href={`/commercial/bookings/${item.bookingId}`}>
                        <Btn variant="secondary" size="sm">
                          Command center
                        </Btn>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
