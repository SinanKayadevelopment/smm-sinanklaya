import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Ayarlar alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === "string" || typeof val === "boolean") {
        const stringVal = val.toString();
        await prisma.setting.upsert({
          where: { key },
          update: { value: stringVal },
          create: { key, value: stringVal },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sistem ve ödeme ayarları başarıyla güncellendi.",
    });
  } catch (error: any) {
    console.error("Ayar kaydetme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Ayarlar kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}
