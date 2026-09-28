"use client";

import { Card, PageHeader } from "@/components/commercial/ui";

export default function HrCertificationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="HR"
        title="Certifications"
        subtitle="Employee certification records are not part of this application."
      />
      <Card>
        <p className="text-sm text-muted">
          This person-data surface has been retired. Sign-in and user-management are unchanged.
        </p>
      </Card>
    </>
  );
}
