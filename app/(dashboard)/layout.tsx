import AppSidebar from "@/components/dashboard/AppSidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <AppSidebar />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <DashboardNavbar />
        {children}
      </div>

      <BottomNav />
    </div>
  );
}
