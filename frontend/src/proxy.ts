import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/terms"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) return NextResponse.next();

  let session = null;

  try {
    const res = await fetch(`${API_URL}/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (res.ok) {
      session = await res.json();
    }
  } catch {
    // network error — treat as unauthenticated
  }

  if (!session) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("pm.auth");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|bmp|tiff)$).*)",
  ],
};
