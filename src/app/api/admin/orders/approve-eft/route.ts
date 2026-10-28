import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Sipariş ID gereklidir." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        package: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Sipariş bulunamadı." },
        { status: 404 }
      );
    }

    // 1. Ödemeyi 'PAID' yap
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
      },
    });

    // 2. MoreThanPanel'e gönder
    const serviceId = order.package.providerServiceId || 101;
    const quantity = order.package.quantity;
    const link = order.targetLink;

    const providerResult = await createProviderOrder(serviceId, link, quantity);

    let updatedOrder;
    if (providerResult.order) {
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          providerOrderId: providerResult.order.toString(),
          orderStatus: "PROCESSING",
          errorMessage: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: `EFT/Havale ödemesi onaylandı ve sipariş otomatik olarak tedarikçiye iletildi. (Tedarik No: ${providerResult.order})`,
        order: updatedOrder,
      });
    } else {
      const errorMsg = providerResult.error || "Tedarik servisi hatası.";
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "ERROR",
          errorMessage: errorMsg,
        },
      });

      return NextResponse.json({
        success: false,
        message: `Ödeme onaylandı fakat tedarikçiye iletirken hata oluştu: ${errorMsg}`,
        order: updatedOrder,
      });
    }
  } catch (error: any) {
    console.error("EFT onay hatası:", error);
    return NextResponse.json(
      { success: false, message: "Onay işlemi sırasında sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
