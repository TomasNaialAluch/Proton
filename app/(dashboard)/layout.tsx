import AppSidebar from "@/components/dashboard/AppSidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardMainArea from "@/components/dashboard/DashboardMainArea";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <AppSidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardNavbar />
        <DashboardMainArea>{children}</DashboardMainArea>
      </div>

      <BottomNav />
    </div>
  );
}
