"use client";

import dynamic from "next/dynamic";

const CommercialLayoutClient = dynamic(() => import("@/components/commercial/CommercialLayoutClient"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-paper" />,
});

export default function CommercialLayoutRoot({ children }: { children: React.ReactNode }) {
  return <CommercialLayoutClient>{children}</CommercialLayoutClient>;
}
