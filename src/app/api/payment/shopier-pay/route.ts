import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateShopierPayment } from "@/lib/shopier";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("orderCode") || searchParams.get("code");

    if (!orderCode) {
      return new NextResponse("Sipariş kodu belirtilmedi.", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderCode: orderCode.trim().toUpperCase() },
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

    if (!order) {
      return new NextResponse("Sipariş bulunamadı.", { status: 404 });
    }

    const packageName = `${order.package.category.platform.name} - ${order.package.name}`;
    const payment = await generateShopierPayment({
      orderCode: order.orderCode,
      totalAmount: order.totalAmount,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      packageName,
      billingAddress: order.companyName || "Türkiye",
      billingCity: "İstanbul",
    });

    return new NextResponse(payment.htmlForm, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Shopier pay yönlendirme hatası:", error);
    return new NextResponse("Ödeme oturumu oluşturulurken bir hata oluştu.", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

