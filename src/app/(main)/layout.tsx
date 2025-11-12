import InfoBar from "@/components/InfoBar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full h-full flex flex-col flex-1">
        <InfoBar />
        <main className="flex-1 overflow-y-auto border-l border-t rounded-l-3xl border-muted-foreground/20">
          {children}
        </main>
      </div>
    </div>
  );
}
