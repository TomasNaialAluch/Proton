import HomeView from "./HomeView";

/** Página síncrona: evita que el inspector enumere `searchParams` en RSC async de Next 15. */
export default function HomePage() {
  return <HomeView />;
}
