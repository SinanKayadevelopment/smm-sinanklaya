import { NextResponse } from "next/server";
import { getProviderServices } from "@/lib/morethanpanel";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await getProviderServices();

    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      services: Array.isArray(services) ? services : [],
      platforms,
    });
  } catch (error: any) {
    console.error("Servis getirme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Servis listesi alınamadı." },
      { status: 500 }
    );
  }
}
