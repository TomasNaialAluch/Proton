import LibraryView from "./LibraryView";

/** Página síncrona: evita que el inspector enumere `searchParams` en RSC async de Next 15. */
export default function LibraryPage() {
  return <LibraryView />;
}
