import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProviderBalance } from "@/lib/morethanpanel";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
      },
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
