export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Navbar pública — pendiente */}
      <main>{children}</main>
      {/* Global Player — pendiente */}
    </div>
  );
}
