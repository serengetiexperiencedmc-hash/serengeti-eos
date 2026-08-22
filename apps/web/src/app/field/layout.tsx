import { EosSessionProvider } from "@/components/commercial/EosSessionProvider";
import Link from "next/link";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <EosSessionProvider>
      <div className="min-h-screen bg-ink text-paper">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div>
              <div className="font-display text-lg font-semibold text-gold">Field Ops</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted">I9 · Offline sync</div>
            </div>
            <Link href="/commercial" className="text-xs text-sand hover:text-gold">
              Commercial →
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-4 py-5">{children}</main>
      </div>
    </EosSessionProvider>
  );
}
