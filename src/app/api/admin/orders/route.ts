import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const paymentStatus = searchParams.get("paymentStatus") || "ALL";
    const paymentMethod = searchParams.get("paymentMethod") || "ALL";

    const where: any = {};

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderCode: { contains: q } },
        { customerName: { contains: q } },
        { customerEmail: { contains: q } },
        { targetLink: { contains: q } },
        { providerOrderId: { contains: q } },
      ];
    }

    if (status !== "ALL") {
      where.orderStatus = status;
    }

    if (paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }

    if (paymentMethod !== "ALL") {
      where.paymentMethod = paymentMethod;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        package: {
          include: {
            category: {
              include: {
                platform: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Admin orders hatası:", error);
    return NextResponse.json(
      { success: false, message: "Siparişler yüklenemedi." },
      { status: 500 }
    );
  }
}
