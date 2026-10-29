import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { verifyShopierWebhookSignature } from "@/lib/shopier";

export async function POST(request: NextRequest) {
  try {
    let platform_order_id = "";
    let status = "";
    let installment = "";
    let payment_id = "";
    let random_nr = "";
    let signature = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      platform_order_id = (formData.get("platform_order_id") as string) || "";
      status = (formData.get("status") as string) || "";
      installment = (formData.get("installment") as string) || "";
      payment_id = (formData.get("payment_id") as string) || "";
      random_nr = (formData.get("random_nr") as string) || "";
      signature = (formData.get("signature") as string) || "";
    } else {
      // JSON formatı (Simülasyon veya API testi için)
      const json = await request.json().catch(() => ({}));
      platform_order_id = json.platform_order_id || json.orderCode || "";
      status = json.status || "";
      installment = json.installment ? String(json.installment) : "";
      payment_id = json.payment_id ? String(json.payment_id) : "";
      random_nr = json.random_nr ? String(json.random_nr) : "";
      signature = json.signature || "";
    }

    if (!platform_order_id) {
      return new NextResponse("Shopier Hatası: platform_order_id bulunamadı.", { status: 400 });
    }

    // Siparişi veritabanından bul
    const order = await prisma.order.findUnique({
      where: { orderCode: platform_order_id.trim().toUpperCase() },
      include: {
        package: true,
      },
    });

    if (!order) {
      console.error(`Shopier Webhook: Sipariş bulunamadı: ${platform_order_id}`);
      return new NextResponse("Shopier Hatası: Belirtilen sipariş sistemde kayıtlı değil.", { status: 404 });
    }

    // Yönlendirme URL belirleme (Localhost veya canlı yayincikral.com)
    const origin = request.nextUrl.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    const baseUrl = isLocal ? origin : "https://yayincikral.com";

    // İmza doğrulaması
    const isSignatureValid = await verifyShopierWebhookSignature(random_nr, platform_order_id, signature);
    if (!isSignatureValid) {
      console.error(`Shopier Webhook Geçersiz İmza! Sipariş: ${platform_order_id}`);
      return new NextResponse("Shopier Güvenlik Hatası: İmza doğrulanamadı.", { status: 400 });
    }

    // Eğer ödeme başarılı değilse
    if (status.toLowerCase() !== "success") {
      console.warn(`Shopier ödeme başarısız bildirimi: ${platform_order_id}, Durum: ${status}`);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "CANCELED",
          errorMessage: `Shopier ödeme reddedildi veya iptal edildi (Durum: ${status})`,
        },
      });

      return NextResponse.redirect(`${baseUrl}/siparis-basarili?code=${order.orderCode}&status=failed`, {
        status: 302,
      });
    }

    // ==========================================
    // ÖDEME BAŞARILI (status === 'success')
    // ==========================================

    // a) Siparişin paymentStatus durumunu 'PAID' yap
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        paymentMethod: "ONLINE_SHOPIER",
      },
    });

    // Analitik dönüşüm kaydı ekle
    await prisma.pageView.create({
      data: {
        path: `/siparis-basarili?code=${order.orderCode}`,
        packageId: order.packageId,
        eventType: "PURCHASE",
        ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
        referer: "https://www.shopier.com",
      },
    }).catch(() => {});

    // b) Mükerrer gönderimi önlemek için providerOrderId kontrol et
    if (!order.providerOrderId) {
      const serviceId = order.package.providerServiceId || 101;
      const quantity = order.package.quantity;
      const link = order.targetLink;

      console.log(
        `Shopier Onayı: MoreThanPanel tedarik isteği başlatılıyor. Sipariş: ${order.orderCode}, Servis: ${serviceId}, Miktar: ${quantity}`
      );

      const providerResult = await createProviderOrder(serviceId, link, quantity);

      if (providerResult.order) {
        const providerOrderIdStr = providerResult.order.toString();
        await prisma.order.update({
          where: { id: order.id },
          data: {
            providerOrderId: providerOrderIdStr,
            orderStatus: "PROCESSING",
          },
        });
        console.log(`MoreThanPanel siparişi oluşturuldu: ${providerOrderIdStr}`);
      } else {
        console.error("MoreThanPanel sipariş hatası:", providerResult.error);
        await prisma.order.update({
          where: { id: order.id },
          data: {
            orderStatus: "ERROR",
            errorMessage: providerResult.error || "Tedarik servisi hatası",
          },
        });
      }
    } else {
      console.log(`Sipariş ${order.orderCode} için zaten tedarik ID mevcut (${order.providerOrderId}), mükerrer çağrı engellendi.`);
    }

    // c) Kullanıcıyı https://yayincikral.com/siparis-basarili?code=[platform_order_id] sayfasına yönlendir (302 Redirect)
    const successRedirectUrl = `${baseUrl}/siparis-basarili?code=${order.orderCode}`;
    return NextResponse.redirect(successRedirectUrl, { status: 302 });
  } catch (error: any) {
    console.error("Shopier webhook genel hatası:", error);
    return new NextResponse("Sunucu hatası oluştu.", { status: 500 });
  }
}
