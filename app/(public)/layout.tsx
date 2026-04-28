import PublicNavbar from "@/components/public/Navbar";
import GlobalPlayer from "@/components/player/GlobalPlayer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <PublicNavbar />
      <main className="pb-20">{children}</main>
      <GlobalPlayer />
    </div>
  );
}
