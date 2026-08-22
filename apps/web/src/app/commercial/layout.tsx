"use client";

import CommercialLayoutClient from "@/components/commercial/CommercialLayoutClient";

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return <CommercialLayoutClient>{children}</CommercialLayoutClient>;
}
