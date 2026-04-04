interface ArtistPageProps {
  params: Promise<{ "artist-name": string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { "artist-name": artistName } = await params;

  return (
    <div>
      {/* PERFIL PÚBLICO del artista: {artistName} — Bio + Discografía */}
    </div>
  );
}
