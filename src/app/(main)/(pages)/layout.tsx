export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen border-l-[1px] border-t-[1px] pb-20 rounded-l-3xl border-muted-foreground/20 overflow-scroll">
      {children}
    </div>
  );
}
