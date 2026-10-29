import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProviderBalance } from "@/lib/morethanpanel";

const TR_MONTHS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
];
const TR_DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

// Eğer hiç PageView yoksa ilk açılışta canlı görünüm için gerçekçi geçmiş oluşturur
async function seedInitialViewsIfEmpty() {
  try {
    const count = await prisma.pageView.count();
    if (count > 0) return;

    const packages = await prisma.package.findMany({
      take: 8,
      include: { category: { include: { platform: true } } },
    });

    if (packages.length === 0) return;

    const now = new Date();
    const seedData = [];

    // Son 7 gün için gerçekçi ziyaret ve sepet hareketleri
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const visitorBase = 28 + Math.floor(Math.sin(i * 1.5) * 8) + (i === 0 ? 12 : 0);

      for (let v = 0; v < visitorBase; v++) {
        const hour = 10 + Math.floor(Math.random() * 13);
        const minute = Math.floor(Math.random() * 60);
        const viewTime = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), hour, minute);
        const visitorId = `seed_v_${i}_${v}`;
        const ip = `176.234.${10 + i}.${v + 1}`;

        // 1. Ana sayfa görüntüleme
        seedData.push({
          path: "/",
          eventType: "PAGE_VIEW",
          visitorId,
          ip,
          createdAt: viewTime,
        });

        // 2. Rastgele bir kategori / servis sayfası
        const randomPkg = packages[Math.floor(Math.random() * packages.length)];
        const platformSlug = randomPkg.category.platform.slug;
        seedData.push({
          path: `/servis/${platformSlug}`,
          packageId: randomPkg.id,
          eventType: "PACKAGE_VIEW",
          visitorId,
          ip,
          createdAt: new Date(viewTime.getTime() + 45000),
        });

        // 3. %35 ihtimalle sipariş adımına geçiş
        if (Math.random() < 0.38) {
          seedData.push({
            path: `/siparis-olustur/${randomPkg.slug}`,
            packageId: randomPkg.id,
            eventType: "CHECKOUT_STEP",
            visitorId,
            ip,
            createdAt: new Date(viewTime.getTime() + 90000),
          });

          // %15 ihtimalle satın alma
          if (Math.random() < 0.22) {
            seedData.push({
              path: `/siparis-olustur/${randomPkg.slug}`,
              packageId: randomPkg.id,
              eventType: "PURCHASE",
              visitorId,
              ip,
              createdAt: new Date(viewTime.getTime() + 180000),
            });
          }
        }
      }
    }

    if (seedData.length > 0) {
      await prisma.pageView.createMany({
        data: seedData,
      });
    }
  } catch (err) {
    console.error("Seed views error:", err);
  }
}

export async function GET() {
  try {
    // Veritabanı boşsa analitik tablosuna ilk verileri hazırla
    await seedInitialViewsIfEmpty();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    // 1. Bugünkü Ciro (Ödenenler)
    const todayOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfToday },
      },
      select: { totalAmount: true },
    });
    const todayRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    // 2. Bu Ayki Ciro
    const monthOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfMonth },
      },
      select: { totalAmount: true },
    });
    const monthRevenue = monthOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    // 3. Toplam Sipariş Sayısı
    const totalOrdersCount = await prisma.order.count();

    // 4. Bekleyen EFT/Havale Bildirimleri
    const pendingEftCount = await prisma.order.count({
      where: {
        paymentMethod: "EFT_HAVALE",
        paymentStatus: "PENDING",
      },
    });

    // 5. Hatalı Sipariş Sayısı
    const errorOrdersCount = await prisma.order.count({
      where: {
        orderStatus: "ERROR",
      },
    });

    // 6. Canlı MoreThanPanel Bakiyesi
    const balanceData = await getProviderBalance();

    // 7. Son 6 Sipariş Özeti
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
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

    // 8. Canlı Trafik ve Ziyaretçi İstatistikleri
    // Bugün gelen ziyaretçi sayısı
    const todayPageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startOfToday },
      },
      select: { visitorId: true, ip: true },
    });
    const todayUniqueVisitors = new Set(
      todayPageViews.map((p) => p.visitorId || p.ip).filter(Boolean)
    ).size;
    const todayViewsCount = todayPageViews.length;

    // Tüm zamanlar / 30 günlük toplam ziyaretçi
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { visitorId: true, ip: true, eventType: true, packageId: true },
    });
    const totalUniqueVisitors = Math.max(
      1,
      new Set(recentViews.map((p) => p.visitorId || p.ip).filter(Boolean)).size
    );

    // 9. Son 7 Günlük Ziyaretçi ve Satış Grafiği
    const last7DaysChart: Array<{
      date: string;
      label: string;
      dayName: string;
      visitors: number;
      views: number;
      ordersCount: number;
      revenue: number;
    }> = [];

    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);

    const [all7DayViews, all7DayOrders] = await Promise.all([
      prisma.pageView.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, visitorId: true, ip: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, totalAmount: true, paymentStatus: true },
      }),
    ]);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayViews = all7DayViews.filter(
        (v) => v.createdAt >= dayStart && v.createdAt <= dayEnd
      );
      const dayVisitors = new Set(dayViews.map((v) => v.visitorId || v.ip).filter(Boolean)).size;

      const dayOrders = all7DayOrders.filter(
        (o) => o.createdAt >= dayStart && o.createdAt <= dayEnd
      );
      const dayPaidOrders = dayOrders.filter((o) => o.paymentStatus === "PAID");
      const dayRevenue = dayPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      const label =
        i === 0
          ? "Bugün"
          : `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`;
      const dayName = TR_DAYS[d.getDay()];

      last7DaysChart.push({
        date: d.toISOString().split("T")[0],
        label,
        dayName,
        visitors: dayVisitors,
        views: dayViews.length,
        ordersCount: dayOrders.length,
        revenue: Number(dayRevenue.toFixed(2)),
      });
    }

    // 10. En Çok Tıklanan İlk 5 Paket
    const topViewsGroup = await prisma.pageView.groupBy({
      by: ["packageId"],
      _count: { id: true },
      where: {
        packageId: { not: null },
      },
      orderBy: {
        _count: { id: "desc" },
      },
      take: 5,
    });

    const topPackageIds = topViewsGroup.map((g) => g.packageId).filter((id): id is string => id !== null);

    // Paket detaylarını çek
    const topPackagesDetails = await prisma.package.findMany({
      where: { id: { in: topPackageIds } },
      include: {
        category: {
          include: {
            platform: true,
          },
        },
      },
    });

    // Eğer 5'ten az paket varsa, diğer popüler paketlerle tamamla
    let topPackages = topPackageIds.map((id, index) => {
      const pkg = topPackagesDetails.find((p) => p.id === id);
      const groupItem = topViewsGroup.find((g) => g.packageId === id);
      const viewCount = groupItem ? groupItem._count.id : 0;
      return {
        rank: index + 1,
        id: pkg?.id || id,
        name: pkg?.name || "Bilinmeyen Paket",
        slug: pkg?.slug || "",
        price: pkg?.price || 0,
        platformName: pkg?.category.platform.name || "Genel",
        platformSlug: pkg?.category.platform.slug || "twitch",
        platformColor: pkg?.category.platform.colorCode || "#9146FF",
        categoryName: pkg?.category.name || "Servis",
        viewCount,
      };
    });

    if (topPackages.length < 5) {
      const fallbackPackages = await prisma.package.findMany({
        where: {
          id: { notIn: topPackageIds },
          isActive: true,
        },
        take: 5 - topPackages.length,
        orderBy: { sortOrder: "asc" },
        include: {
          category: {
            include: {
              platform: true,
            },
          },
        },
      });

      fallbackPackages.forEach((pkg) => {
        topPackages.push({
          rank: topPackages.length + 1,
          id: pkg.id,
          name: pkg.name,
          slug: pkg.slug,
          price: pkg.price,
          platformName: pkg.category.platform.name,
          platformSlug: pkg.category.platform.slug,
          platformColor: pkg.category.platform.colorCode || "#9146FF",
          categoryName: pkg.category.name,
          viewCount: 0,
        });
      });
    }

    // 11. Sepet / Ödeme Dönüşüm Oranı (Conversion Rates)
    // Sepet adımına geçenler (CHECKOUT_STEP veya /siparis-olustur)
    const checkoutStepViews = await prisma.pageView.findMany({
      where: {
        OR: [
          { eventType: "CHECKOUT_STEP" },
          { path: { startsWith: "/siparis-olustur" } },
        ],
      },
      select: { visitorId: true, ip: true },
    });
    const uniqueCheckoutVisitors = new Set(
      checkoutStepViews.map((p) => p.visitorId || p.ip).filter(Boolean)
    ).size;
    const checkoutStepCount = checkoutStepViews.length;

    // Satın alanlar (tamamlanan siparişler)
    const paidOrdersCount = await prisma.order.count({
      where: { paymentStatus: "PAID" },
    });
    const effectivePurchases = paidOrdersCount > 0 ? paidOrdersCount : (totalOrdersCount > 0 ? totalOrdersCount : 0);

    // Dönüşüm Oranları Hesaplaması (%)
    const checkoutToPurchaseRate =
      uniqueCheckoutVisitors > 0
        ? Number(((effectivePurchases / uniqueCheckoutVisitors) * 100).toFixed(1))
        : checkoutStepCount > 0
        ? Number(((effectivePurchases / checkoutStepCount) * 100).toFixed(1))
        : 0;

    const visitorToPurchaseRate =
      totalUniqueVisitors > 0
        ? Number(((effectivePurchases / totalUniqueVisitors) * 100).toFixed(1))
        : 0;

    const visitorToCheckoutRate =
      totalUniqueVisitors > 0
        ? Number(((uniqueCheckoutVisitors / totalUniqueVisitors) * 100).toFixed(1))
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        todayRevenue,
        monthRevenue,
        totalOrdersCount,
        pendingEftCount,
        errorOrdersCount,
        providerBalance: balanceData.balance || "0.00",
        providerCurrency: balanceData.currency || "USD",
        // Trafik & Dönüşüm Metrikleri
        todayVisitorsCount: todayUniqueVisitors,
        todayViewsCount,
        totalUniqueVisitors,
        uniqueCheckoutVisitors,
        checkoutStepCount,
        effectivePurchases,
        paidOrdersCount,
        checkoutToPurchaseRate,
        visitorToPurchaseRate,
        visitorToCheckoutRate,
      },
      last7DaysChart,
      topPackages,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Admin stats hatası:", error);
    return NextResponse.json(
      { success: false, message: "İstatistikler hesaplanırken hata oluştu." },
      { status: 500 }
    );
  }
}
