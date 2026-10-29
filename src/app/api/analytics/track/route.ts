import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      path = "/",
      packageSlug,
      packageId: rawPackageId,
      eventType: rawEventType,
      visitorId,
      referer,
    } = body;

    // Admin veya API rotalarını sayma
    if (typeof path === "string" && (path.startsWith("/admin") || path.startsWith("/api"))) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // IP adresini al
    const forwardedHeader = request.headers.get("x-forwarded-for");
    const ip = forwardedHeader ? forwardedHeader.split(",")[0].trim() : "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || null;

    let packageId = rawPackageId || null;
    let eventType = rawEventType || "PAGE_VIEW";

    // Eğer /siparis-olustur/[slug] rotasındaysa otomatik olarak CHECKOUT_STEP yap ve paketi bul
    if (typeof path === "string" && path.startsWith("/siparis-olustur/")) {
      eventType = "CHECKOUT_STEP";
      const slugFromPath = path.replace("/siparis-olustur/", "").split("/")[0].split("?")[0];
      if (slugFromPath && !packageId) {
        const pkg = await prisma.package.findUnique({
          where: { slug: slugFromPath },
          select: { id: true },
        });
        if (pkg) {
          packageId = pkg.id;
        }
      }
    } else if (packageSlug && !packageId) {
      const pkg = await prisma.package.findUnique({
        where: { slug: packageSlug },
        select: { id: true },
      });
      if (pkg) {
        packageId = pkg.id;
      }
    }

    // PageView kaydını oluştur
    await prisma.pageView.create({
      data: {
        path: typeof path === "string" ? path.substring(0, 500) : "/",
        packageId,
        eventType,
        visitorId: typeof visitorId === "string" ? visitorId.substring(0, 100) : null,
        ip: ip.substring(0, 100),
        userAgent: userAgent ? userAgent.substring(0, 500) : null,
        referer: typeof referer === "string" ? referer.substring(0, 500) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Analytics track hatası:", error);
    // Analitik hataları kullanıcıyı asla engellememelidir
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

