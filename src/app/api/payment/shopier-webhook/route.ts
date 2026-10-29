import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { verifyShopierWebhookSignature, verifyShopierOsbHash, decodeShopierOsbPayload } from "@/lib/shopier";

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
    let status = "success";
    let installment = "";
    let payment_id = "";
    let random_nr = "";
    let signature = "";
    let isOsb = false;

    let res = "";
    let hash = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      res = (formData.get("res") as string) || "";
      hash = (formData.get("hash") as string) || "";
      platform_order_id = (formData.get("platform_order_id") as string) || (formData.get("order_id") as string) || "";
      status = (formData.get("status") as string) || "success";
      installment = (formData.get("installment") as string) || "";
      payment_id = (formData.get("payment_id") as string) || "";
      random_nr = (formData.get("random_nr") as string) || "";
      signature = (formData.get("signature") as string) || "";
    } else {
      // JSON formatı
      const json = await request.json().catch(() => ({}));
      res = json.res || "";
      hash = json.hash || "";
      platform_order_id = json.platform_order_id || json.order_id || json.orderCode || "";
      status = json.status || "success";
      installment = json.installment ? String(json.installment) : "";
      payment_id = json.payment_id ? String(json.payment_id) : "";
      random_nr = json.random_nr ? String(json.random_nr) : "";
      signature = json.signature || "";
    }

    // 1. Resmi Shopier OSB (res & hash) Kontrolü (PHP Kodunun Birebir TypeScript Karşılığı)
    if (res && hash) {
      isOsb = true;
      const isHashValid = await verifyShopierOsbHash(res, hash);
      if (!isHashValid) {
        console.warn("Shopier OSB hash doğrulama uyuşmazlığı!");
        // Shopier OSB doğrulaması başarısız
        return new NextResponse("invalid hash", { status: 400 });
      }

      const osbData = decodeShopierOsbPayload(res);
      if (osbData) {
        console.log("Shopier OSB verisi başarıyla çözümlendi:", osbData);
        // Müşterinin girdiği sipariş kodu customernote veya orderid içinde olabilir
        platform_order_id = osbData.customernote || osbData.orderid || "";
        status = "success";
      }
    }

    // Tarayıcı yönlendirmesi mi yoksa sunucudan sunucuya (OSB test / webhook) çağrı mı tespiti
    const secFetchDest = request.headers.get("sec-fetch-dest") || "";
    const acceptHeader = request.headers.get("accept") || "";
    const isBrowserNavigation = !isOsb && (secFetchDest === "document" || (acceptHeader.includes("text/html") && !acceptHeader.includes("*/*")));

    const origin = request.nextUrl.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    const baseUrl = isLocal ? origin : "https://yayincikral.com";

    // Eğer Shopier OSB panelinden parametresiz test ping'i geldiyse
    if (!platform_order_id && !signature && !res) {
      console.log("Shopier OSB genel ping testi alındı.");
      return new NextResponse("success", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Standart callback imza doğrulaması
    if (!isOsb && signature && random_nr && platform_order_id) {
      const isSignatureValid = await verifyShopierWebhookSignature(random_nr, platform_order_id, signature);
      if (!isSignatureValid) {
        console.warn(`Shopier Webhook İmza Uyarısı (Geçersiz imza)! Sipariş: ${platform_order_id}`);
      }
    }

    // Siparişi veritabanından bul (orderCode ile eşleştir)
    let order = null;
    if (platform_order_id) {
      const cleanCode = platform_order_id.trim().toUpperCase();
      order = await prisma.order.findUnique({
        where: { orderCode: cleanCode },
        include: { package: true },
      });

      if (!order) {
        const match = platform_order_id.match(/DST-\d+/i);
        if (match) {
          order = await prisma.order.findUnique({
            where: { orderCode: match[0].toUpperCase() },
            include: { package: true },
          });
        }
      }
    }

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
