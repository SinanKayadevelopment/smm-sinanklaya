import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProviderOrder } from "@/lib/morethanpanel";
import { verifyShopierOsb, decodeShopierOsb, deleteShopierProduct, getShopierClient } from "@/lib/shopier";

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
    let isOsb = false;
    let shopierProductId: string | null = null;

    let res = "";
    let hash = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      res = (formData.get("res") as string) || "";
      hash = (formData.get("hash") as string) || "";
      platform_order_id =
        (formData.get("platform_order_id") as string) ||
        (formData.get("order_id") as string) ||
        (formData.get("orderId") as string) ||
        "";
      status = (formData.get("status") as string) || "success";
    } else {
      // JSON formatı (REST Webhook: order.created veya simülasyon)
      const json = await request.json().catch(() => ({}));
      res = json.res || "";
      hash = json.hash || "";

      // REST Webhook payload desteği
      if (json.event === "order.created" || json.data?.order) {
        const orderData = json.data?.order || json.data || json;
        platform_order_id = orderData.orderId || orderData.order_id || orderData.customNote || "";
        status = "success";
        if (orderData.lineItems?.[0]?.productId) {
          shopierProductId = String(orderData.lineItems[0].productId);
        }
      } else {
        platform_order_id = json.platform_order_id || json.order_id || json.orderCode || json.orderId || "";
        status = json.status || "success";
      }
    }

    // 1. Resmi Shopier OSB (res & hash) Kontrolü
    if (res && hash) {
      isOsb = true;
      const isHashValid = await verifyShopierOsb(res, hash);
      if (!isHashValid) {
        console.warn("Shopier OSB hash doğrulama uyuşmazlığı!");
        return new NextResponse("invalid hash", { status: 400 });
      }

      const osbPayload = decodeShopierOsb(res);
      if (osbPayload) {
        console.log("Shopier OSB verisi çözümlendi:", osbPayload);
        // Sipariş kodu customernote, orderid veya customerNote içinde olabilir
        platform_order_id =
          osbPayload.customerNote ||
          (osbPayload.raw as any)?.customernote ||
          osbPayload.orderId ||
          (osbPayload.raw as any)?.orderid ||
          "";
        status = "success";
        if (osbPayload.productId) {
          shopierProductId = String(osbPayload.productId);
        }
      }
    }

    // Tarayıcı yönlendirmesi mi yoksa sunucu webhook çağrısı mı tespiti
    const secFetchDest = request.headers.get("sec-fetch-dest") || "";
    const acceptHeader = request.headers.get("accept") || "";
    const isBrowserNavigation =
      !isOsb && (secFetchDest === "document" || (acceptHeader.includes("text/html") && !acceptHeader.includes("*/*")));

    const origin = request.nextUrl.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    const baseUrl = isLocal ? origin : "https://yayincikral.com";

    // Eğer Shopier OSB panelinden parametresiz test ping'i geldiyse
    if (!platform_order_id && !res) {
      console.log("Shopier OSB genel ping testi başarıyla karşılandı.");
      return new NextResponse("success", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Siparişi veritabanından bul (orderCode ile eşleştir)
    let order = null;
    if (platform_order_id) {
      const cleanCode = platform_order_id.trim().toUpperCase();
      order = await prisma.order.findUnique({
        where: { orderCode: cleanCode },
        include: { package: true },
      });

      // DST-xxxxxx formatında regex araması
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

    // Eğer sipariş kodundan bulunamadıysa productId ile eşleştir
    if (!order && shopierProductId) {
      order = await prisma.order.findFirst({
        where: { shopierProductId: shopierProductId },
        include: { package: true },
      });
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
      await prisma.pageView
        .create({
          data: {
            path: `/siparis-basarili?code=${order.orderCode}`,
            packageId: order.packageId,
            eventType: "PURCHASE",
            ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
            referer: "https://www.shopier.com",
          },
        })
        .catch(() => {});

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

      // 4. Geçici oluşturulan Shopier ürününü API üzerinden silerek temizle
      const targetProductId = order.shopierProductId || shopierProductId;
      if (targetProductId) {
        deleteShopierProduct(targetProductId).catch((err) =>
          console.warn("Shopier ürün temizliği atlandı:", err)
        );
      }
    } else {
      console.log(`Shopier OSB Testi veya harici sipariş bildirimi karşılandı: ${platform_order_id}`);
    }

    // Yanıt Stratejisi:
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
    return new NextResponse("success", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
