"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  approveLeave,
  assignEmployeeSkill,
  cancelLeave,
  createEmployee,
  createLeave,
  createSkill,
  EMPLOYEE_STATUS_LABELS,
  getEmployee,
  getHrHealth,
  LEAVE_TYPE_LABELS,
  listEmployees,
  listLeave,
  listSkills,
  patchEmployee,
  rejectLeave,
  removeEmployeeSkill,
  submitLeave,
  type HrEmployee,
  type HrEmployeeDetail,
  type HrLeave,
  type HrSkill,
} from "@/lib/hr-api";

type Tab = "employees" | "leave" | "skills";

function employeeBadge(status: HrEmployee["status"]) {
  if (status === "active") return <Badge variant="won" label="Active" />;
  if (status === "on_leave") return <Badge variant="review" label="On leave" />;
  return <Badge variant="draft" label="Terminated" />;
}

function leaveBadge(status: HrLeave["status"]) {
  if (status === "submitted") return <Badge variant="review" label="Submitted" />;
  if (status === "approved") return <Badge variant="won" label="Approved" />;
  if (status === "rejected") return <Badge variant="urgent" label="Rejected" />;
  if (status === "cancelled") return <Badge variant="draft" label="Cancelled" />;
  return <Badge variant="progress" label="Draft" />;
}

export default function HrPage() {
  const { token, ready } = useEosSession();
  const [tab, setTab] = useState<Tab>("employees");
  const [employees, setEmployees] = useState<HrEmployee[]>([]);
  const [skills, setSkills] = useState<HrSkill[]>([]);
  const [leave, setLeave] = useState<HrLeave[]>([]);
  const [health, setHealth] = useState<{ employees: number; skills: number; leavePending: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<HrEmployeeDetail | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startDate, setStartDate] = useState("");

  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [assignSkillId, setAssignSkillId] = useState("");
  const [assignProficiency, setAssignProficiency] = useState<HrEmployeeDetail["skills"][number]["proficiency"]>("intermediate");

  const [leaveEmployeeId, setLeaveEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState<HrLeave["leaveType"]>("annual");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveNotes, setLeaveNotes] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<HrEmployee["status"]>("active");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [emp, sk, lv, h] = await Promise.all([
        listEmployees(token),
        listSkills(token),
        listLeave(token),
        getHrHealth(token),
      ]);
      setEmployees(emp.items);
      setSkills(sk.items);
      setLeave(lv.items);
      setHealth({ employees: h.employees, skills: h.skills, leavePending: h.leavePending });
      setLeaveEmployeeId((current) => current || emp.items[0]?.id || "");
      setAssignSkillId((current) => current || sk.items[0]?.id || "");
    } catch (err) {
      setEmployees([]);
      setSkills([]);
      setLeave([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load HR data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setDetail(null);
      return;
    }
    getEmployee(token, selectedId)
      .then((d) => {
        setDetail(d);
        setEditTitle(d.employee.jobTitle ?? "");
        setEditStatus(d.employee.status);
      })
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load employee"));
  }, [token, selectedId]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      if (selectedId) {
        const d = await getEmployee(token, selectedId);
        setDetail(d);
        setEditTitle(d.employee.jobTitle ?? "");
        setEditStatus(d.employee.status);
      }
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const pendingLeave = useMemo(
    () => leave.filter((item) => item.status === "draft" || item.status === "submitted"),
    [leave],
  );

  const visibleEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((emp) => {
      if (statusFilter && emp.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${emp.employeeCode} ${emp.displayName} ${emp.email ?? ""} ${emp.jobTitle ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [employees, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the HR directory.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I10 · People"
        title="HR"
        subtitle="Employee directory · skills · leave (no payroll)"
        actions={
          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" href="/commercial/hr/certifications">
              Certifications
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Employees">
            <div className="font-display text-2xl font-semibold text-ink">{health.employees}</div>
          </Card>
          <Card title="Skills">
            <div className="font-display text-2xl font-semibold text-ink">{health.skills}</div>
          </Card>
          <Card title="Pending leave">
            <div className="font-display text-2xl font-semibold text-ink">{health.leavePending}</div>
          </Card>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(["employees", "leave", "skills"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${
              tab === key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:bg-sand/40"
            }`}
          >
            {key === "employees" ? "Employees" : key === "leave" ? "Leave" : "Skills"}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading HR…</p>}

      {tab === "employees" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <div className="space-y-5 xl:col-span-2">
            <Card title="Add employee">
              <form
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void run(async () => {
                    await createEmployee(token!, {
                      givenName,
                      familyName,
                      email: email || undefined,
                      jobTitle: jobTitle || undefined,
                      startDate: startDate || undefined,
                    });
                    setGivenName("");
                    setFamilyName("");
                    setEmail("");
                    setJobTitle("");
                    setStartDate("");
                    setMessage("Employee created");
                  });
                }}
              >
                <input className="rounded-md border border-line px-3 py-2 text-sm" placeholder="Given name" value={givenName} onChange={(e) => setGivenName(e.target.value)} required />
                <input className="rounded-md border border-line px-3 py-2 text-sm" placeholder="Family name" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required />
                <input className="rounded-md border border-line px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="rounded-md border border-line px-3 py-2 text-sm" placeholder="Job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                <input className="rounded-md border border-line px-3 py-2 text-sm sm:col-span-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <div className="sm:col-span-2">
                  <Btn type="submit" disabled={busy}>
                    Create employee
                  </Btn>
                </div>
              </form>
            </Card>

            <Card
              title="Directory"
              headerExtra={
                <div className="flex gap-2">
                  <input
                    className="w-36 rounded-md border border-line px-2 py-1 text-xs"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <select
                    className="rounded-md border border-line px-2 py-1 text-xs"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="on_leave">On leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              }
            >
              {visibleEmployees.length === 0 && !loading ? (
                <p className="text-sm text-muted">No employees match the current filter.</p>
              ) : (
                <div className="divide-y divide-line">
                  {visibleEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => setSelectedId(emp.id)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${
                        selectedId === emp.id ? "bg-sand/50" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium text-ink">{emp.displayName}</div>
                        <div className="text-xs text-muted">
                          {emp.employeeCode}
                          {emp.jobTitle ? ` · ${emp.jobTitle}` : ""}
                          {emp.orgUnitName ? ` · ${emp.orgUnitName}` : ""}
                        </div>
                      </div>
                      {employeeBadge(emp.status)}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-3">
            {!selectedId || !detail ? (
              <Card title="Employee detail">
                <p className="text-sm text-muted">Select an employee to view skills, leave, and status.</p>
              </Card>
            ) : (
              <div className="space-y-5">
                <Card
                  title={detail.employee.displayName}
                  headerExtra={employeeBadge(detail.employee.status)}
                >
                  <p className="mb-4 text-sm text-muted">
                    {detail.employee.employeeCode}
                    {detail.employee.linkedAccountEmail ? ` · ${detail.employee.linkedAccountEmail}` : ""}
                    {detail.employee.locationName ? ` · ${detail.employee.locationName}` : ""}
                  </p>
                  <form
                    className="flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await patchEmployee(token!, detail.employee.id, {
                          jobTitle: editTitle || undefined,
                          status: editStatus,
                        });
                        setMessage("Employee updated");
                      });
                    }}
                  >
                    <label className="text-xs text-muted">
                      Job title
                      <input className="mt-1 block rounded-md border border-line px-3 py-2 text-sm text-ink" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </label>
                    <label className="text-xs text-muted">
                      Status
                      <select className="mt-1 block rounded-md border border-line px-3 py-2 text-sm text-ink" value={editStatus} onChange={(e) => setEditStatus(e.target.value as HrEmployee["status"])}>
                        {(Object.keys(EMPLOYEE_STATUS_LABELS) as HrEmployee["status"][]).map((status) => (
                          <option key={status} value={status}>
                            {EMPLOYEE_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Btn type="submit" disabled={busy}>
                      Save
                    </Btn>
                  </form>
                </Card>

                <Card title="Skills">
                  <form
                    className="mb-4 flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await assignEmployeeSkill(token!, detail.employee.id, {
                          skillId: assignSkillId,
                          proficiency: assignProficiency,
                        });
                        setMessage("Skill assigned");
                      });
                    }}
                  >
                    <label className="text-xs text-muted">
                      Skill
                      <select className="mt-1 block rounded-md border border-line px-3 py-2 text-sm text-ink" value={assignSkillId} onChange={(e) => setAssignSkillId(e.target.value)}>
                        {skills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs text-muted">
                      Proficiency
                      <select
                        className="mt-1 block rounded-md border border-line px-3 py-2 text-sm text-ink"
                        value={assignProficiency}
                        onChange={(e) => setAssignProficiency(e.target.value as typeof assignProficiency)}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </label>
                    <Btn type="submit" disabled={busy || !assignSkillId}>
                      Assign
                    </Btn>
                  </form>
                  {detail.skills.length === 0 ? (
                    <p className="text-sm text-muted">No skills assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.skills.map((skill) => (
                        <div key={skill.skillId} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                          <span>
                            {skill.name}
                            <span className="text-muted"> · {skill.proficiency}</span>
                          </span>
                          <Btn
                            variant="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={() =>
                              void run(async () => {
                                await removeEmployeeSkill(token!, detail.employee.id, skill.skillId);
                                setMessage("Skill removed");
                              })
                            }
                          >
                            Remove
                          </Btn>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card title="Leave history">
                  {detail.leave.length === 0 ? (
                    <p className="text-sm text-muted">No leave records.</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.leave.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                          <span>
                            {LEAVE_TYPE_LABELS[item.leaveType]} · {item.startDate} → {item.endDate} ({item.days}d)
                          </span>
                          {leaveBadge(item.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "leave" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card title="Request leave">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const created = await createLeave(token!, {
                    employeeId: leaveEmployeeId,
                    leaveType,
                    startDate: leaveStart,
                    endDate: leaveEnd,
                    notes: leaveNotes || undefined,
                  });
                  await submitLeave(token!, created.leave.id);
                  setLeaveNotes("");
                  setMessage("Leave submitted");
                });
              }}
            >
              <label className="block text-xs text-muted">
                Employee
                <select className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm text-ink" value={leaveEmployeeId} onChange={(e) => setLeaveEmployeeId(e.target.value)}>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.displayName} ({emp.employeeCode})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-muted">
                Type
                <select className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm text-ink" value={leaveType} onChange={(e) => setLeaveType(e.target.value as HrLeave["leaveType"])}>
                  {(Object.keys(LEAVE_TYPE_LABELS) as HrLeave["leaveType"][]).map((type) => (
                    <option key={type} value={type}>
                      {LEAVE_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-muted">
                  Start
                  <input className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm text-ink" type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} required />
                </label>
                <label className="text-xs text-muted">
                  End
                  <input className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm text-ink" type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} required />
                </label>
              </div>
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Notes" value={leaveNotes} onChange={(e) => setLeaveNotes(e.target.value)} />
              <Btn type="submit" disabled={busy || !leaveEmployeeId}>
                Submit leave
              </Btn>
            </form>
          </Card>

          <Card title="Leave queue">
            {leave.length === 0 && !loading ? (
              <p className="text-sm text-muted">No leave requests.</p>
            ) : (
              <div className="space-y-3">
                {leave.map((item) => (
                  <div key={item.id} className="rounded border border-line p-3">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-ink">{item.employeeName}</div>
                        <div className="text-xs text-muted">
                          {LEAVE_TYPE_LABELS[item.leaveType]} · {item.startDate} → {item.endDate} · {item.days} day{item.days === 1 ? "" : "s"}
                        </div>
                      </div>
                      {leaveBadge(item.status)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.status === "draft" && (
                        <>
                          <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await submitLeave(token!, item.id); setMessage("Leave submitted"); })}>
                            Submit
                          </Btn>
                          <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await cancelLeave(token!, item.id); setMessage("Leave cancelled"); })}>
                            Cancel
                          </Btn>
                        </>
                      )}
                      {item.status === "submitted" && (
                        <>
                          <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await approveLeave(token!, item.id); setMessage("Leave approved"); })}>
                            Approve
                          </Btn>
                          <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await rejectLeave(token!, item.id); setMessage("Leave rejected"); })}>
                            Reject
                          </Btn>
                          <Btn size="sm" variant="ghost" disabled={busy} onClick={() => void run(async () => { await cancelLeave(token!, item.id); setMessage("Leave cancelled"); })}>
                            Cancel
                          </Btn>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {pendingLeave.length === 0 && leave.length > 0 && (
                  <p className="text-xs text-muted">No draft or submitted items remain in the queue.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "skills" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card title="Add skill">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  await createSkill(token!, { name: skillName, category: skillCategory || undefined });
                  setSkillName("");
                  setSkillCategory("");
                  setMessage("Skill added");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Skill name" value={skillName} onChange={(e) => setSkillName(e.target.value)} required />
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Category (optional)" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Add skill
              </Btn>
            </form>
          </Card>
          <Card title="Catalogue">
            {skills.length === 0 && !loading ? (
              <p className="text-sm text-muted">No skills in the catalogue.</p>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between rounded border border-line px-3 py-2 text-sm">
                    <span>{skill.name}</span>
                    <span className="text-muted">{skill.category ?? "uncategorised"}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
