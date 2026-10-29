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
    const msg = error?.message || "Ödeme oturumu oluşturulurken bir hata oluştu.";
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Ödeme Hatası</title></head>
<body style="background:#0F172A;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;">
  <div style="background:#1E293B;padding:32px;border-radius:16px;max-width:480px;text-align:center;border:1px solid #334155;">
    <h2 style="color:#F87171;margin-bottom:12px;">Ödeme Hazırlanamadı</h2>
    <p style="color:#CBD5E1;font-size:14px;line-height:1.6;">${msg}</p>
    <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#9146FF;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;">Ana Sayfaya Dön</a>
  </div>
</body>
</html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

