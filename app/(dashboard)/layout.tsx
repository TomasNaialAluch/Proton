import { Suspense } from "react";
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
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Suspense fallback={null}>
          <DashboardNavbar />
        </Suspense>
        <DashboardMainArea>{children}</DashboardMainArea>
      </div>

      <BottomNav />
    </div>
  );
}
