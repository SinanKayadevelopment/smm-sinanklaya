import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /admin yollarını koru (/admin/login ve /api/admin/auth hariç)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";
    const session = await verifyAdminToken(token);

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Korunan API yolları (/api/admin/... ama /api/admin/auth hariç)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";
    const session = await verifyAdminToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim! Lütfen giriş yapınız." },
        { status: 401 }
      );
    }
  }

  // Zaten giriş yapmışsa /admin/login'e girerse doğrudan /admin'e yönlendir
  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";
    const session = await verifyAdminToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
