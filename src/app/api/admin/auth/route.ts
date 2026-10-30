import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ADMIN_COOKIE_NAME,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/admin-auth";

/**
 * Mevcut giriş durumunu kontrol et
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { username: session.username, role: session.role },
  });
}

/**
 * Giriş yap
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Geçersiz kullanıcı adı veya şifre!" },
        { status: 401 }
      );
    }

    // Token oluştur
    const token = await signAdminToken(ADMIN_USERNAME);

    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı. Yönetim merkezine yönlendiriliyorsunuz...",
      user: { username: ADMIN_USERNAME, role: "admin" },
    });

    // HTTP-only güvenli çerez tanımla (7 gün)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

/**
 * Çıkış yap
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Başarıyla çıkış yapıldı.",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
