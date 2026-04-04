import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import BottomNav from "@/components/dashboard/BottomNav";
import AppSidebar from "@/components/dashboard/AppSidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background lg:flex">

      {/* Sidebar — visible only on desktop */}
      <AppSidebar />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardNavbar />
        <DashboardContent />
      </div>

      {/* Bottom nav — visible only on mobile/tablet */}
      <BottomNav />

    </div>
  );
}
