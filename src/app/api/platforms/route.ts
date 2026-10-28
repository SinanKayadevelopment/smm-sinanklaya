import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            packages: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, platforms });
  } catch (error: any) {
    console.error("Platform getirme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Platformlar yüklenemedi." },
      { status: 500 }
    );
  }
}
