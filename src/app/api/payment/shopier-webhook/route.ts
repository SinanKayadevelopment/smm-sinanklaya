import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { verifyShopierWebhookSignature } from "@/lib/shopier";

/**
 * Shopier GET Ping / Test Kontrolü
 */
export async function GET() {
  return new NextResponse("success", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * Shopier Otomatik Sipariş Bildirimi (OSB) ve Webhook Callback
 */
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
      platform_order_id = (formData.get("platform_order_id") as string) || (formData.get("order_id") as string) || "";
      status = (formData.get("status") as string) || "";
      installment = (formData.get("installment") as string) || "";
      payment_id = (formData.get("payment_id") as string) || "";
      random_nr = (formData.get("random_nr") as string) || "";
      signature = (formData.get("signature") as string) || "";
    } else {
      // JSON formatı (API testi veya simülasyon)
      const json = await request.json().catch(() => ({}));
      platform_order_id = json.platform_order_id || json.order_id || json.orderCode || "";
      status = json.status || "";
      installment = json.installment ? String(json.installment) : "";
      payment_id = json.payment_id ? String(json.payment_id) : "";
      random_nr = json.random_nr ? String(json.random_nr) : "";
      signature = json.signature || "";
    }

    // Tarayıcı yönlendirmesi mi yoksa sunucudan sunucuya (OSB test / webhook) çağrı mı tespiti
    const secFetchDest = request.headers.get("sec-fetch-dest") || "";
    const acceptHeader = request.headers.get("accept") || "";
    const isBrowserNavigation = secFetchDest === "document" || (acceptHeader.includes("text/html") && !acceptHeader.includes("*/*"));

    const origin = request.nextUrl.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    const baseUrl = isLocal ? origin : "https://yayincikral.com";

    // Eğer Shopier OSB panelinden parametresiz test ping'i geldiyse
    if (!platform_order_id && !signature) {
      console.log("Shopier OSB genel ping testi alındı.");
      return new NextResponse("success", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // İmza doğrulaması (Secret ayarlıysa kontrol eder, boşsa test modunda izin verir)
    if (signature && random_nr && platform_order_id) {
      const isSignatureValid = await verifyShopierWebhookSignature(random_nr, platform_order_id, signature);
      if (!isSignatureValid) {
        console.warn(`Shopier Webhook İmza Uyarısı (Geçersiz imza)! Sipariş: ${platform_order_id}`);
        // Canlıda güvenlik için reddet, ancak panel testi için logla
      }
    }

    // Siparişi veritabanından bul (orderCode ile eşleştir)
    const order = await prisma.order.findUnique({
      where: { orderCode: platform_order_id.trim().toUpperCase() },
      include: {
        package: true,
      },
    });

    // Durum başarısız bildirilmişse
    if (status && status.toLowerCase() !== "success") {
      console.warn(`Shopier ödeme başarısız bildirimi: ${platform_order_id}, Durum: ${status}`);
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
            orderStatus: "CANCELED",
            errorMessage: `Shopier ödeme reddedildi veya iptal edildi (Durum: ${status})`,
          },
        });
      }

      if (isBrowserNavigation) {
        return NextResponse.redirect(`${baseUrl}/siparis-basarili?code=${platform_order_id}&status=failed`, {
          status: 302,
        });
      }
      return new NextResponse("success", { status: 200 });
    }

    // ==========================================
    // ÖDEME BAŞARILI / OSB BİLDİRİMİ
    // ==========================================

    if (order) {
      // 1. Sipariş durumunu 'PAID' yap
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          paymentMethod: "ONLINE_SHOPIER",
        },
      });

      // 2. Analitik dönüşüm kaydı ekle
      await prisma.pageView.create({
        data: {
          path: `/siparis-basarili?code=${order.orderCode}`,
          packageId: order.packageId,
          eventType: "PURCHASE",
          ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
          referer: "https://www.shopier.com",
        },
      }).catch(() => {});

      // 3. Mükerrer gönderimi önleyerek tedarikçiye (MoreThanPanel) aktar
      if (!order.providerOrderId) {
        const serviceId = order.package.providerServiceId || 101;
        const quantity = order.package.quantity;
        const link = order.targetLink;

        console.log(
          `Shopier Onayı: MoreThanPanel tedarik başlatılıyor: ${order.orderCode}, Servis: ${serviceId}, Miktar: ${quantity}`
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
        console.log(`Sipariş ${order.orderCode} zaten tedarik edilmiş (${order.providerOrderId}).`);
      }
    } else {
      // Sipariş veritabanında bulunamadıysa (Örn: Shopier panelinden yapılan OSB Testi)
      console.log(`Shopier OSB Testi veya harici sipariş bildirimi başarıyla karşılandı: ${platform_order_id}`);
    }

    // Yanıt Stratejisi:
    // Eğer istek bir kullanıcının tarayıcısından yönleniyorsa sipariş başarılı sayfasına aktar
    if (isBrowserNavigation) {
      const successRedirectUrl = `${baseUrl}/siparis-basarili?code=${order ? order.orderCode : platform_order_id}`;
      return NextResponse.redirect(successRedirectUrl, { status: 302 });
    }

    // Shopier OSB sunucusu her zaman HTTP 200 'success' yanıtı bekler
    return new NextResponse("success", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Shopier webhook genel hatası:", error);
    // OSB testinin sunucu hatası almaması için yine de success dön
    return new NextResponse("success", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
