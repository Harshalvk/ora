import InfoBar from "@/components/InfoBar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar/>
      <div className="w-full">
        <InfoBar/>
        {children}</div>
    </div>
  );
}
