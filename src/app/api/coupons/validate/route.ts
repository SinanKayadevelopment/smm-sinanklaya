import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code, amount } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Lütfen geçerli bir kupon kodu giriniz." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "Geçersiz veya süresi dolmuş kupon kodu." },
        { status: 404 }
      );
    }

    const originalAmount = Number(amount) || 0;
    const discountAmount = Number(((originalAmount * coupon.discountPercent) / 100).toFixed(2));
    const newTotal = Number((originalAmount - discountAmount).toFixed(2));

    return NextResponse.json({
      success: true,
      couponCode: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      newTotal,
      message: `%${coupon.discountPercent} indirim başarıyla uygulandı!`,
    });
  } catch (error: any) {
    console.error("Kupon kontrol hatası:", error);
    return NextResponse.json(
      { success: false, message: "Kupon uygulanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
