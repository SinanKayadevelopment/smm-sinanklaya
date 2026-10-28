import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProviderOrderStatus } from "@/lib/morethanpanel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderCode: string }> }
) {
  try {
    const { orderCode } = await params;
    const cleanCode = orderCode.trim().toUpperCase();

    const order = await prisma.order.findUnique({
      where: { orderCode: cleanCode },
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
      return NextResponse.json(
        { success: false, message: "Belirtilen sipariş koduna ait kayıt bulunamadı." },
        { status: 404 }
      );
    }

    // Eğer sipariş tedarikçiye iletildiyse ve henüz tamamlanmadıysa, canlı durumu çekip DB'yi güncelle
    let currentOrderStatus = order.orderStatus;
    let startCount = order.startCount || 0;
    let remains = order.remains || 0;

    if (
      order.providerOrderId &&
      order.orderStatus !== "COMPLETED" &&
      order.orderStatus !== "CANCELED"
    ) {
      try {
        const liveStatus = await getProviderOrderStatus(order.providerOrderId);
        if (liveStatus && !liveStatus.error && liveStatus.status) {
          const rawStatus = liveStatus.status.toLowerCase();
          let mappedStatus = order.orderStatus;

          if (rawStatus.includes("completed")) {
            mappedStatus = "COMPLETED";
          } else if (rawStatus.includes("in progress")) {
            mappedStatus = "IN_PROGRESS";
          } else if (rawStatus.includes("pending") || rawStatus.includes("processing")) {
            mappedStatus = "PROCESSING";
          } else if (rawStatus.includes("partial")) {
            mappedStatus = "PARTIAL";
          } else if (rawStatus.includes("cancel")) {
            mappedStatus = "CANCELED";
          }

          startCount = liveStatus.start_count ? parseInt(liveStatus.start_count, 10) : startCount;
          remains = liveStatus.remains ? parseInt(liveStatus.remains, 10) : remains;

          // Veritabanını güncelle
          await prisma.order.update({
            where: { id: order.id },
            data: {
              orderStatus: mappedStatus,
              startCount,
              remains,
            },
          });

          currentOrderStatus = mappedStatus;
        }
      } catch (liveErr) {
        console.warn("Canlı durum çekilemedi, kayıtlı durum gösteriliyor:", liveErr);
      }
    }

    // KVKK için müşteri adı maskeleme (Örn: A*** Y***)
    const maskedName = order.customerName
      .split(" ")
      .map((part) => (part.length > 1 ? part[0] + "*".repeat(part.length - 1) : part))
      .join(" ");

    // Kurumsal durum metinleri (Asla bot/panel dili kullanılmaz)
    let statusTitle = "Siparişiniz Alındı";
    let statusDescription = "Talebiniz sistem tarafından işleme konulmaktadır.";
    let progressPercent = 25;

    switch (currentOrderStatus) {
      case "COMPLETED":
        statusTitle = "Hizmet Tamamlandı";
        statusDescription = "Talep ettiğiniz tüm yükseliş ve etkileşim desteği hedefinize eksiksiz olarak aktarıldı.";
        progressPercent = 100;
        break;
      case "IN_PROGRESS":
        statusTitle = "Yükseliş Desteği Devam Ediyor";
        statusDescription = "Kanalınıza veya profilinize anlık etkileşim akışı başarıyla sağlanmaktadır.";
        progressPercent = 75;
        break;
      case "PROCESSING":
        statusTitle = "Destek Paketiniz Hazırlanıyor";
        statusDescription = "Sistemimiz yayınınızı veya kanalınızı algılayarak destek hattını devreye alıyor.";
        progressPercent = 40;
        break;
      case "WAITING":
        statusTitle = "Ödeme ve Onay Bekleniyor";
        statusDescription = "Ödeme bildiriminiz finans departmanımızca kontrol edilmektedir.";
        progressPercent = 15;
        break;
      case "PARTIAL":
        statusTitle = "Kısmi Aktarım Yapıldı";
        statusDescription = "Etkileşim desteğinin büyük bir kısmı hedefe başarıyla aktarılmıştır.";
        progressPercent = 90;
        break;
      case "CANCELED":
        statusTitle = "İptal Edildi & İade Sırasında";
        statusDescription = "Siparişiniz iptal edilmiş olup ilgili tutar iade havuzuna aktarılmıştır.";
        progressPercent = 0;
        break;
      case "ERROR":
        statusTitle = "Teknik Destek İncelemesinde";
        statusDescription = "Siparişiniz öncelikli destek hattımız tarafından incelenmektedir.";
        progressPercent = 30;
        break;
    }

    return NextResponse.json({
      success: true,
      order: {
        orderCode: order.orderCode,
        customerName: maskedName,
        customerType: order.customerType,
        targetLink: order.targetLink,
        packageName: order.package.name,
        categoryName: order.package.category.name,
        platformName: order.package.category.platform.name,
        platformColor: order.package.category.platform.colorCode,
        quantity: order.package.quantity,
        totalAmount: order.totalAmount,
        discountAmount: order.discountAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: currentOrderStatus,
        statusTitle,
        statusDescription,
        progressPercent,
        startCount,
        remains,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Sipariş sorgulama hatası:", error);
    return NextResponse.json(
      { success: false, message: "Sipariş bilgisi sorgulanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
