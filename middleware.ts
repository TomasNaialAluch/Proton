import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE } from "@/lib/auth/demoSession";

function hasDemoSession(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === DEMO_SESSION_VALUE;
}

/** Compat: `?genre=` → path; `/charts` → default genre (sin tocar `searchParams` en páginas). */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const genre = url.searchParams.get("genre");

  if (pathname === "/charts") {
    const target =
      genre && genre.length > 0
        ? `/charts/${encodeURIComponent(genre)}`
        : "/charts/progressive";
    url.pathname = target;
    url.searchParams.delete("genre");
    if (url.search === "" || url.search === "?") url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname === "/shows" && genre && genre.length > 0) {
    url.pathname = `/shows/${encodeURIComponent(genre)}`;
    url.searchParams.delete("genre");
    if (url.search === "" || url.search === "?") url.search = "";
    return NextResponse.redirect(url);
  }

  const session = hasDemoSession(request);

  /** Siempre mostrar `/login` (p. ej. prototipo Account) aunque exista sesión demo — no redirigir a dashboard. */
  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("callbackUrl", pathname + (url.search || ""));
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/charts", "/shows", "/login", "/dashboard", "/dashboard/:path*"],
};
