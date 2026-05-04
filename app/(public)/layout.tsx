import PublicMain from "@/components/player/global-player/PublicMain";
import PublicNavbar from "@/components/public/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <PublicNavbar />
      <PublicMain>{children}</PublicMain>
    </div>
  );
}
