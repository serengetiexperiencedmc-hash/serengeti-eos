export function SlaIndicator({
  status,
  label,
}: {
  status: "on-track" | "at-risk" | "overdue";
  label: string;
}) {
  const colors = {
    "on-track": "text-success",
    "at-risk": "text-warning",
    overdue: "text-danger",
  };
  const dots = {
    "on-track": "bg-success",
    "at-risk": "bg-warning",
    overdue: "bg-danger",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-medium ${colors[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {label}
    </span>
  );
}
