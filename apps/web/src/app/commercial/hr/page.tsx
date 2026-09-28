"use client";

import { Card, PageHeader } from "@/components/commercial/ui";

export default function HrPage() {
  return (
    <>
      <PageHeader
        eyebrow="HR"
        title="HR"
        subtitle="Employee, leave, and skills records are not part of this application."
      />
      <Card>
        <p className="text-sm text-muted">
          This person-data surface has been retired. Sign-in and user-management are unchanged.
        </p>
      </Card>
    </>
  );
}
