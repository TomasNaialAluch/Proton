"use client";

import { usePathname } from "next/navigation";

/** Slug desde `pathname` (evita `useParams` / proxy que el inspector enumera como `params`). */
export default function ArtistProfileView() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const artistName = segments[0] ?? "";

  return (
    <div>
      {/* PERFIL PÚBLICO del artista: {artistName} — Bio + Discografía */}
    </div>
  );
}
