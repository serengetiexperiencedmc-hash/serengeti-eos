import { MockupBanner, Sidebar, Topbar } from "@/components/commercial/Shell";
import { DevLoginPanel, EosSessionProvider } from "@/components/commercial/EosSessionProvider";

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return (
    <EosSessionProvider>
      <MockupBanner />
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-[260px] flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 p-7">
            <DevLoginPanel />
            {children}
          </main>
        </div>
      </div>
    </EosSessionProvider>
  );
}