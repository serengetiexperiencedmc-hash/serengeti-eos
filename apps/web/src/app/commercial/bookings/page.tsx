"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import {
  BOOKING_STATUS_LABELS,
  bookingStatusBadge,
  formatBookingValue,
  listBookings,
  type BookingSummary,
} from "@/lib/booking-api";
import { EosApiError } from "@/lib/eos-client";

export default function BookingsPage() {
  const { token, ready } = useEosSession();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setBookings([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([listBookings(token), listOrganizations(token)])
      .then(([list, orgList]) => {
        setBookings(list.items);
        setOrgs(orgList.items);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load bookings");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const orgNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const org of orgs) map[org.id] = org.tradingName ?? org.legalName;
    return map;
  }, [orgs]);

  return (
    <>
      <PageHeader
        eyebrow="Operations Handover"
        title="Bookings"
        subtitle={
          token && !loading
            ? `${bookings.length} booking${bookings.length === 1 ? "" : "s"} · Live · C9 API`
            : "Confirmed programmes ready for operations"
        }
        actions={
          <Link href="/commercial/proposals">
            <Btn variant="secondary">From Proposals</Btn>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {ready && !token && (
        <p className="mb-4 text-sm text-muted">Sign in to load bookings from the API.</p>
      )}

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Travel</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!token ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  Sign in to view bookings.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  Loading bookings…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  No bookings yet. Accept a sent proposal to create a booking.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-b border-line hover:bg-sand/30">
                  <td className="px-4 py-3">
                    <strong className="text-ink">{b.bookingCode}</strong>
                    <br />
                    <span className="text-xs text-muted">{b.title}</span>
                  </td>
                  <td className="px-4 py-3">{orgNames[b.organizationId] ?? "Client"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={bookingStatusBadge(b.status)} label={BOOKING_STATUS_LABELS[b.status] ?? b.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {b.travelDates ?? "—"}
                    {b.paxCount ? ` · ${b.paxCount} pax` : ""}
                  </td>
                  <td className="px-4 py-3">{formatBookingValue(b)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/commercial/bookings/${b.id}`}>
                      <Btn variant="secondary" size="sm">
                        Open
                      </Btn>
                    </Link>
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
