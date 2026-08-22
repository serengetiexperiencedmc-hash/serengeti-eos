import type { BadgeVariant } from "@/lib/mock-data";

const styles: Record<BadgeVariant, string> = {
  urgent: "bg-danger-bg text-danger",
  progress: "bg-info-bg text-info",
  review: "bg-warning-bg text-warning",
  won: "bg-success-bg text-success",
  draft: "bg-sand text-muted",
};

const labels: Record<BadgeVariant, string> = {
  urgent: "New RFP",
  progress: "In Progress",
  review: "Awaiting Approval",
  won: "Complete",
  draft: "Draft",
};

export function Badge({ variant, label }: { variant: BadgeVariant; label?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${styles[variant]}`}>
      {label ?? labels[variant]}
    </span>
  );
}
