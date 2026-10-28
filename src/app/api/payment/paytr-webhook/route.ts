import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { verifyPayTrWebhook } from "@/lib/paytr";

export async function POST(request: NextRequest) {
  try {
    let merchantOid = "";
    let status = "";
    let totalAmount = "";
    let hash = "";
    let isSimulation = false;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      merchantOid = (formData.get("merchant_oid") as string) || "";
      status = (formData.get("status") as string) || "";
      totalAmount = (formData.get("total_amount") as string) || "";
      hash = (formData.get("hash") as string) || "";
    } else {
      // JSON formatı (Frontend test simülasyonu veya manuel tetikleyici)
      const json = await request.json();
      merchantOid = json.merchantOid || json.orderCode || "";
      status = json.status || "success";
      totalAmount = json.totalAmount ? json.totalAmount.toString() : "";
      hash = json.hash || "TEST_HASH";
      isSimulation = json.isSimulation ?? true;
    }

    if (!merchantOid) {
      return new NextResponse("FAIL: Missing merchant_oid", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderCode: merchantOid.trim().toUpperCase() },
      include: {
        package: true,
      },
    });

    if (!order) {
      return new NextResponse("FAIL: Order not found", { status: 404 });
    }

    // Gerçek PayTR çağrısı ise imza doğrulaması yap
    if (!isSimulation) {
      const isHashValid = await verifyPayTrWebhook(merchantOid, status, totalAmount, hash);
      if (!isHashValid) {
        console.error(`PayTR Webhook geçersiz imza: ${merchantOid}`);
        return new NextResponse("PAYTR HASH FAILED", { status: 400 });
      }
    }

    // Ödeme başarısız ise
    if (status !== "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "CANCELED",
          errorMessage: "PayTR ödeme işlemi başarısız olarak bildirildi.",
        },
      });
      return new NextResponse("OK", { status: 200 });
    }

    // 1. Mükerrer gönderimi önleme: Eğer sipariş zaten tedarik edildiyse veya providerOrderId doluysa
    if (order.providerOrderId) {
      console.log(`Sipariş ${order.orderCode} zaten tedarikçiye iletilmiş. Mükerrer çağrı engellendi.`);
      return new NextResponse("OK", { status: 200 });
    }

    // 2. Ödeme durumunu 'PAID' olarak güncelle
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
      },
    });

    // 3. Paketin providerServiceId ve quantity değerlerini al, createProviderOrder çağır
    const serviceId = order.package.providerServiceId || 101;
    const quantity = order.package.quantity;
    const link = order.targetLink;

    console.log(`MoreThanPanel tedarik isteği başlatılıyor: Sipariş: ${order.orderCode}, Servis: ${serviceId}, Adet: ${quantity}`);

    const providerResult = await createProviderOrder(serviceId, link, quantity);

    // 4 & 5. Sonuç değerlendirme
    if (providerResult.order) {
      // 4. Başarılı tedarik
      const providerOrderIdStr = providerResult.order.toString();
      await prisma.order.update({
        where: { id: order.id },
        data: {
          providerOrderId: providerOrderIdStr,
          orderStatus: "PROCESSING",
          errorMessage: null,
        },
      });

      console.log(`Tedarik başarıyla oluşturuldu! Provider Order ID: ${providerOrderIdStr}`);
    } else {
      // 5. Tedarik hatası (bakiye yetersizliği, servis kapalı vb.)
      const errorMsg = providerResult.error || "Tedarik altyapısından geçersiz yanıt alındı.";
      console.error(`Tedarik hatası (${order.orderCode}): ${errorMsg}`);

      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "ERROR",
          errorMessage: errorMsg,
        },
      });
    }

    // 6. PayTR'ye beklediği 'OK' yanıtını dön
    return new NextResponse("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("PayTR Webhook genel işleme hatası:", error);
    return new NextResponse("FAIL", { status: 500 });
  }
}
