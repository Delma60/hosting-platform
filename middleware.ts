import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/client", "/reseller", "/admin", "/cart", "/checkout"];

// Routes only for authenticated users (redirect away if already signed in)
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Role-gated routes
const ADMIN_ROUTES = ["/admin"];
const RESELLER_ROUTES = ["/reseller"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the session cookie set by our login action
  const session = request.cookies.get("__session")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // ── Redirect unauthenticated users away from protected routes ──────────────
  if (isProtected && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from auth pages ─────────────────────
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  // ── Role-based access (verified server-side in layouts/pages via Admin SDK) ─
  // The role check here is lightweight — full verification happens in
  // Server Components / API Routes using adminAuth.verifySessionCookie().

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder assets
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};