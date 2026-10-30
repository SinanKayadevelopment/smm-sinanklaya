import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { getShopierConfig, getShopierClient, deleteShopierProduct } from "@/lib/shopier";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("code") || searchParams.get("kod");

    if (!orderCode) {
      return NextResponse.json({ success: false, message: "Sipariş kodu belirtilmedi." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderCode: orderCode.trim().toUpperCase() },
      include: { package: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Sipariş bulunamadı." }, { status: 404 });
    }

    // Eğer zaten ödendiyse ve tedarik edildiyse direkt başarılı dön
    if (order.paymentStatus === "PAID" && order.providerOrderId) {
      return NextResponse.json({
        success: true,
        paymentStatus: "PAID",
        providerOrderId: order.providerOrderId,
        orderStatus: order.orderStatus,
      });
    }

    // Shopier API üzerinden son siparişleri sorgula
    try {
      const config = await getShopierConfig();
      if (config.pat) {
        const client = await getShopierClient();
        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const dateStart = past.toISOString().split(".")[0] + "Z";
        const dateEnd = now.toISOString().split(".")[0] + "Z";

        const shopierOrders = await client.listOrders({ dateStart, dateEnd });

        // Siparişi eşleştir (lineItems title, customNote veya orderCode)
        const matched = shopierOrders.find((so) => {
          const itemTitle = so.lineItems?.[0]?.title || "";
          const note = so.note || "";
          const pid = so.lineItems?.[0]?.productId;

          return (
            itemTitle.includes(order.orderCode) ||
            note.includes(order.orderCode) ||
            (order.shopierProductId && pid && String(pid) === String(order.shopierProductId))
          );
        });

        if (matched && matched.paymentStatus === "paid") {
          console.log(`Shopier Check: ${order.orderCode} ödendiği doğrulandı! Tedarik başlatılıyor...`);

          // 1. Ödemeyi PAID yap
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              paymentMethod: "ONLINE_SHOPIER",
            },
          });

          // 2. Mükerrer olmadan tedarikçiye aktar
          if (!order.providerOrderId) {
            const serviceId = order.package.providerServiceId || 101;
            const quantity = order.package.quantity;
            const link = order.targetLink;

            const providerResult = await createProviderOrder(serviceId, link, quantity);

            if (providerResult.order) {
              const pIdStr = providerResult.order.toString();
              await prisma.order.update({
                where: { id: order.id },
                data: {
                  providerOrderId: pIdStr,
                  orderStatus: "PROCESSING",
                  errorMessage: null,
                },
              });
              console.log(`Sipariş ${order.orderCode} başarıyla MTP tedariğine iletildi (#${pIdStr})`);
            } else {
              console.error("MTP tedarik hatası:", providerResult.error);
              await prisma.order.update({
                where: { id: order.id },
                data: {
                  orderStatus: "ERROR",
                  errorMessage: providerResult.error || "Tedarik servisi hatası",
                },
              });
            }
          }

          // 3. Geçici ürünü temizle
          if (order.shopierProductId) {
            deleteShopierProduct(order.shopierProductId).catch(() => {});
          }

          return NextResponse.json({
            success: true,
            paymentStatus: "PAID",
            verifiedVia: "Shopier API",
          });
        }
      }
    } catch (checkErr) {
      console.warn("Shopier API sipariş doğrulama hatası:", checkErr);
    }

    return NextResponse.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });
  } catch (error: any) {
    console.error("Sipariş kontrol hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}

