import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";

export async function POST(request: NextRequest) {
  try {
    const { orderId, newTargetLink } = await request.json();

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

    const linkToUse = newTargetLink && newTargetLink.trim() ? newTargetLink.trim() : order.targetLink;
    const serviceId = order.package.providerServiceId || 101;
    const quantity = order.package.quantity;

    const providerResult = await createProviderOrder(serviceId, linkToUse, quantity);

    if (providerResult.order) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          targetLink: linkToUse,
          providerOrderId: providerResult.order.toString(),
          orderStatus: "PROCESSING",
          errorMessage: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Sipariş başarıyla tekrar iletildi! (Tedarik ID: ${providerResult.order})`,
        order: updatedOrder,
      });
    } else {
      const errorMsg = providerResult.error || "Tedarik servisi hatası.";
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          targetLink: linkToUse,
          orderStatus: "ERROR",
          errorMessage: errorMsg,
        },
      });

      return NextResponse.json({
        success: false,
        message: `Tekrar gönderim başarısız: ${errorMsg}`,
        order: updatedOrder,
      });
    }
  } catch (error: any) {
    console.error("Retry sipariş hatası:", error);
    return NextResponse.json(
      { success: false, message: "Tekrar gönderim sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
