import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            platform: true,
          },
        },
      },
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { success: false, message: "Paket bulunamadı veya pasif durumda." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, package: pkg });
  } catch (error: any) {
    console.error("Paket getirme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Paket bilgisi alınırken hata oluştu." },
      { status: 500 }
    );
  }
}
