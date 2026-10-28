import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";

export async function POST(request: NextRequest) {
  try {
    const { orderCode, method } = await request.json();

    if (!orderCode) {
      return NextResponse.json(
        { success: false, message: "Sipariş kodu zorunludur." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderCode: orderCode.trim().toUpperCase() },
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

    const isEft = method === "EFT_HAVALE";

    if (isEft) {
      // EFT / Havale bildirimi alındı
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PENDING",
          orderStatus: "WAITING",
        },
      });

      return NextResponse.json({
        success: true,
        message:
          "EFT/Havale ödeme bildiriminiz başarıyla iletildi. Finans departmanımız kontrol ettikten sonra yükseliş desteğiniz derhal başlatılacaktır.",
        order: updatedOrder,
      });
    }

    // ONLINE ÖDEME / PAYTR SİMÜLASYONU
    // 1. Mükerrer kontrolü
    if (order.providerOrderId) {
      return NextResponse.json({
        success: true,
        message: "Ödeme ve tedarik işlemi zaten tamamlanmış durumdadır.",
        order,
      });
    }

    // 2. Ödeme durumunu 'PAID' yap
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
      },
    });

    // 3. MoreThanPanel'e otomatik tedarik isteği gönder
    const serviceId = order.package.providerServiceId || 101;
    const quantity = order.package.quantity;
    const link = order.targetLink;

    const providerResult = await createProviderOrder(serviceId, link, quantity);

    let updatedOrder;
    if (providerResult.order) {
      // 4. Başarılı tedarik
      const providerOrderIdStr = providerResult.order.toString();
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          providerOrderId: providerOrderIdStr,
          orderStatus: "PROCESSING",
          errorMessage: null,
        },
      });
    } else {
      // 5. Hata durumu
      const errorMsg = providerResult.error || "Tedarik servisiyle iletişim kurulamadı.";
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "ERROR",
          errorMessage: errorMsg,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Ödemeniz 3D Secure güvencesiyle başarıyla onaylandı! Siparişiniz otomatik olarak işleme alındı.",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Ödeme simülasyonu hatası:", error);
    return NextResponse.json(
      { success: false, message: "İşlem sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
