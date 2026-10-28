import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Kuponlar alınamadı." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, discountPercent } = await request.json();

    if (!code || !discountPercent) {
      return NextResponse.json(
        { success: false, message: "Kupon kodu ve indirim yüzdesi zorunludur." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const percent = parseInt(discountPercent, 10);

    const coupon = await prisma.coupon.upsert({
      where: { code: cleanCode },
      update: { discountPercent: percent, isActive: true },
      create: { code: cleanCode, discountPercent: percent, isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: `"${coupon.code}" kuponu %${coupon.discountPercent} indirim oranıyla tanımlandı.`,
      coupon,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Kupon eklenemedi." }, { status: 500 });
  }
}
