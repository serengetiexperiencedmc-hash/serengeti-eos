export function StatCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
}) {
  const deltaColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted";

  return (
    <div className="rounded-[10px] border border-line bg-paper p-5 shadow-sm">
      <div className="mb-2 text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="font-display text-3xl font-semibold text-ink">{value}</div>
      <div className={`mt-2 text-xs ${deltaColor}`}>{delta}</div>
    </div>
  );
}
