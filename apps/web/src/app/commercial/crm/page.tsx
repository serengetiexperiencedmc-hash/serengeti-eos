"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/commercial/Badge";
import { CrmImportModal } from "@/components/commercial/CrmImportModal";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  formatRelativeDate,
  getActivity,
  getTask,
  listAccounts,
  listActivities,
  listContacts,
  listOrganizationTypes,
  listOrganizations,
  listRelationships,
  listTasks,
  orgStatusVariant,
  type CrmAccount,
  type CrmActivity,
  type CrmContact,
  type CrmOrganization,
  type CrmOrganizationType,
  type CrmRelationship,
  type CrmTask,
} from "@/lib/crm-api";

const tabs = ["Organizations", "Contacts", "Accounts", "Activities", "Tasks"] as const;
type Tab = (typeof tabs)[number];

type CrmData = {
  organizations: CrmOrganization[];
  contacts: CrmContact[];
  accounts: CrmAccount[];
  activities: CrmActivity[];
  tasks: CrmTask[];
  relationships: CrmRelationship[];
  orgTypes: CrmOrganizationType[];
};

function rowClass(id: string, focusId: string | null): string {
  return id === focusId
    ? "border-b border-line bg-gold/15"
    : "border-b border-line hover:bg-sand/30";
}

function EmptyState({ message, onImport }: { message: string; onImport?: () => void }) {
  return (
    <div className="rounded-[10px] border border-dashed border-line bg-ivory p-10 text-center">
      <p className="mb-4 text-sm text-muted">{message}</p>
      {onImport && <Btn onClick={onImport}>Import CSV</Btn>}
    </div>
  );
}

function CrmPageContent() {
  const { token, ready } = useEosSession();
  const searchParams = useSearchParams();
  const focusTaskId = searchParams.get("task");
  const focusActivityId = searchParams.get("activity");
  const [activeTab, setActiveTab] = useState<Tab>(
    focusTaskId ? "Tasks" : focusActivityId ? "Activities" : "Organizations",
  );
  const [data, setData] = useState<CrmData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusMissing, setFocusMissing] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setFocusMissing(false);
    try {
      const [organizations, contacts, accounts, activities, tasks, relationships, orgTypes] = await Promise.all([
        listOrganizations(token),
        listContacts(token),
        listAccounts(token, { limit: 100 }),
        listActivities(token, { limit: 100 }),
        listTasks(token, { limit: 100 }),
        listRelationships(token),
        listOrganizationTypes(token),
      ]);
      let activityItems = activities.items;
      let taskItems = tasks.items;
      if (focusActivityId && !activityItems.some((a) => a.id === focusActivityId)) {
        try {
          const focused = await getActivity(token, focusActivityId);
          activityItems = [focused.activity, ...activityItems];
        } catch {
          setFocusMissing(true);
        }
      }
      if (focusTaskId && !taskItems.some((t) => t.id === focusTaskId)) {
        try {
          const focused = await getTask(token, focusTaskId);
          taskItems = [focused.task, ...taskItems];
        } catch {
          setFocusMissing(true);
        }
      }
      setData({
        organizations: organizations.items,
        contacts: contacts.items,
        accounts: accounts.items,
        activities: activityItems,
        tasks: taskItems,
        relationships: relationships.items,
        orgTypes: orgTypes.items,
      });
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to load CRM data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, focusActivityId, focusTaskId]);

  useEffect(() => {
    if (ready && token) void loadData();
  }, [ready, token, loadData]);

  useEffect(() => {
    if (focusTaskId) setActiveTab("Tasks");
    else if (focusActivityId) setActiveTab("Activities");
  }, [focusTaskId, focusActivityId]);

  useEffect(() => {
    if (!focusTaskId && !focusActivityId) return;
    document.getElementById("crm-applied")?.scrollIntoView({ block: "center" });
  }, [focusTaskId, focusActivityId, data]);

  const orgTypeById = useMemo(() => {
    const map = new Map<string, CrmOrganizationType>();
    for (const t of data?.orgTypes ?? []) map.set(t.id, t);
    return map;
  }, [data?.orgTypes]);

  const contactCountByOrg = useMemo(() => {
    const counts = new Map<string, number>();
    for (const rel of data?.relationships ?? []) {
      if (rel.toOrganizationId && rel.fromContactId) {
        counts.set(rel.toOrganizationId, (counts.get(rel.toOrganizationId) ?? 0) + 1);
      }
    }
    return counts;
  }, [data?.relationships]);

  const lastActivityByOrg = useMemo(() => {
    const map = new Map<string, string>();
    for (const activity of data?.activities ?? []) {
      if (!activity.organizationId) continue;
      const prev = map.get(activity.organizationId);
      if (!prev || activity.occurredAt > prev) {
        map.set(activity.organizationId, activity.occurredAt);
      }
    }
    return map;
  }, [data?.activities]);

  const orgById = useMemo(() => {
    const map = new Map<string, CrmOrganization>();
    for (const org of data?.organizations ?? []) map.set(org.id, org);
    return map;
  }, [data?.organizations]);

  const q = search.trim().toLowerCase();

  const filteredOrganizations = useMemo(() => {
    if (!data) return [];
    if (!q) return data.organizations;
    return data.organizations.filter(
      (o) =>
        o.legalName.toLowerCase().includes(q) ||
        (o.tradingName?.toLowerCase().includes(q) ?? false) ||
        (o.country?.toLowerCase().includes(q) ?? false),
    );
  }, [data, q]);

  const filteredContacts = useMemo(() => {
    if (!data) return [];
    if (!q) return data.contacts;
    return data.contacts.filter(
      (c) =>
        `${c.givenName} ${c.familyName}`.toLowerCase().includes(q) ||
        (c.email?.toLowerCase().includes(q) ?? false),
    );
  }, [data, q]);

  const filteredAccounts = useMemo(() => {
    if (!data) return [];
    if (!q) return data.accounts;
    return data.accounts.filter((a) => a.accountName.toLowerCase().includes(q));
  }, [data, q]);

  const filteredActivities = useMemo(() => {
    if (!data) return [];
    if (!q) return data.activities;
    return data.activities.filter(
      (a) =>
        a.subject.toLowerCase().includes(q) ||
        a.activityType.toLowerCase().includes(q),
    );
  }, [data, q]);

  const filteredTasks = useMemo(() => {
    if (!data) return [];
    if (!q) return data.tasks;
    return data.tasks.filter((t) => t.title.toLowerCase().includes(q) || t.status.toLowerCase().includes(q));
  }, [data, q]);

  const subtitle = useMemo(() => {
    if (!token) return "Sign in to load CRM data from EOS API";
    if (loading) return "Loading CRM records…";
    const count = data?.organizations.length ?? 0;
    return `${count} organization${count === 1 ? "" : "s"} · Live API (C1)`;
  }, [token, loading, data?.organizations.length]);

  return (
    <>
      <PageHeader
        eyebrow="CRM · C1 Foundation"
        title="Clients & Contacts"
        subtitle={subtitle}
        actions={
          token ? (
            <>
              <Btn variant="secondary" onClick={() => setImportOpen(true)}>
                Import CSV
              </Btn>
              <Btn disabled title="Manual create coming soon">
                + Add Organization
              </Btn>
            </>
          ) : undefined
        }
      />

      {token && (
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search current tab…"
            className="w-full max-w-md rounded-full border border-line bg-ivory px-4 py-2 text-sm text-ink outline-none focus:border-gold"
          />
        </div>
      )}

      <div className="mb-5 flex border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            disabled={!token}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              activeTab === tab
                ? "border-gold text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab}
            {data && (
              <span className="ml-2 text-xs text-muted">
                (
                {tab === "Organizations"
                  ? data.organizations.length
                  : tab === "Contacts"
                    ? data.contacts.length
                    : tab === "Accounts"
                      ? data.accounts.length
                      : tab === "Activities"
                        ? data.activities.length
                        : data.tasks.length}
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}. Is the API running on port 8080?
        </div>
      )}
      {focusMissing && (focusTaskId || focusActivityId) && (
        <div className="mb-4 rounded-md border border-line bg-ivory px-4 py-3 text-sm text-muted">
          Applied CRM record is not visible with the current session.
        </div>
      )}

      {!token ? (
        <EmptyState message="CRM data loads from /v1/crm once you sign in." />
      ) : loading ? (
        <div className="h-48 animate-pulse rounded-[10px] bg-sand" />
      ) : (
        <>
          {activeTab === "Organizations" && (
            filteredOrganizations.length === 0 ? (
              <EmptyState
                message="No organizations yet. Import your client list to get started."
                onImport={() => setImportOpen(true)}
              />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Country</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrganizations.map((org) => (
                      <tr key={org.id} className="border-b border-line hover:bg-sand/30">
                        <td className="px-4 py-3">
                          <strong className="text-ink">{org.tradingName ?? org.legalName}</strong>
                          {org.tradingName && org.tradingName !== org.legalName && (
                            <>
                              <br />
                              <span className="text-xs text-muted">{org.legalName}</span>
                            </>
                          )}
                          <br />
                          <span className="text-xs text-muted">
                            {contactCountByOrg.get(org.id) ?? 0} contacts
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {orgTypeById.get(org.organizationTypeId)?.label ?? "—"}
                        </td>
                        <td className="px-4 py-3">{org.country ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={orgStatusVariant(org.status)} label={org.status} />
                        </td>
                        <td className="px-4 py-3">
                          {lastActivityByOrg.has(org.id)
                            ? formatRelativeDate(lastActivityByOrg.get(org.id)!)
                            : formatRelativeDate(org.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {activeTab === "Contacts" && (
            filteredContacts.length === 0 ? (
              <EmptyState message="No contacts yet. Import contacts after organizations exist." onImport={() => setImportOpen(true)} />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Job title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-line hover:bg-sand/30">
                        <td className="px-4 py-3 font-medium text-ink">
                          {contact.givenName} {contact.familyName}
                        </td>
                        <td className="px-4 py-3">{contact.email ?? "—"}</td>
                        <td className="px-4 py-3">{contact.jobTitle ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={contact.status === "Active" ? "progress" : "draft"} label={contact.status} />
                        </td>
                        <td className="px-4 py-3">{formatRelativeDate(contact.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {activeTab === "Accounts" && (
            filteredAccounts.length === 0 ? (
              <EmptyState message="No accounts yet. Accounts are created in CRM after organizations are established." />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="border-b border-line hover:bg-sand/30">
                        <td className="px-4 py-3 font-medium text-ink">{account.accountName}</td>
                        <td className="px-4 py-3">
                          {orgById.get(account.organizationId)?.legalName ?? "—"}
                        </td>
                        <td className="px-4 py-3">{account.priority ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={orgStatusVariant(account.status)} label={account.status} />
                        </td>
                        <td className="px-4 py-3">{formatRelativeDate(account.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {activeTab === "Tasks" && (
            filteredTasks.length === 0 ? (
              <EmptyState message="No CRM tasks yet." />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        id={task.id === focusTaskId ? "crm-applied" : undefined}
                        className={rowClass(task.id, focusTaskId)}
                      >
                        <td className="px-4 py-3 font-medium text-ink">{task.title}</td>
                        <td className="px-4 py-3">
                          <Badge variant={task.status === "Open" || task.status === "InProgress" ? "review" : "draft"} label={task.status} />
                        </td>
                        <td className="px-4 py-3">
                          {task.relatedOrganizationId
                            ? orgById.get(task.relatedOrganizationId)?.legalName ?? "—"
                            : "—"}
                        </td>
                        <td className="px-4 py-3">{task.dueAt ? formatRelativeDate(task.dueAt) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {activeTab === "Activities" && (
            filteredActivities.length === 0 ? (
              <EmptyState message="No activities logged yet." />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        id={activity.id === focusActivityId ? "crm-applied" : undefined}
                        className={rowClass(activity.id, focusActivityId)}
                      >
                        <td className="px-4 py-3 font-medium text-ink">{activity.subject}</td>
                        <td className="px-4 py-3 capitalize">{activity.activityType.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3">
                          {activity.organizationId
                            ? orgById.get(activity.organizationId)?.legalName ?? "—"
                            : "—"}
                        </td>
                        <td className="px-4 py-3">{formatRelativeDate(activity.occurredAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}
        </>
      )}

      {token && (
        <CrmImportModal
          token={token}
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onCommitted={() => void loadData()}
        />
      )}
    </>
  );
}

export default function CrmPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading CRM…</p>}>
      <CrmPageContent />
    </Suspense>
  );
}
