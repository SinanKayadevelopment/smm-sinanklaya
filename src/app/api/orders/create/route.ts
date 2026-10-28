import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePayTrToken } from "@/lib/paytr";

function generateOrderCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DST-${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      targetLink,
      customerType = "BIREYSEL",
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      taxNumber,
      couponCode,
      paymentMethod = "ONLINE_PAYTR",
    } = body;

    if (!packageId || !targetLink || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "Lütfen gerekli tüm alanları eksiksiz doldurunuz." },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        category: {
          include: {
            platform: true,
          },
        },
      },
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { success: false, message: "Seçilen paket bulunamadı veya hizmete kapalıdır." },
        { status: 404 }
      );
    }

    // Kupon İndirimi Kontrolü
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        discountAmount = Number(((pkg.price * coupon.discountPercent) / 100).toFixed(2));
      }
    }

    const totalAmount = Number((pkg.price - discountAmount).toFixed(2));
    const orderCode = generateOrderCode();

    // Sipariş Başlangıç Durumları
    const initialOrderStatus = paymentMethod === "EFT_HAVALE" ? "WAITING" : "WAITING";

    const order = await prisma.order.create({
      data: {
        orderCode,
        packageId: pkg.id,
        targetLink: targetLink.trim(),
        customerType,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        companyName: companyName ? companyName.trim() : null,
        taxNumber: taxNumber ? taxNumber.trim() : null,
        couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
        discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: initialOrderStatus,
      },
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

    // Müşteri IP tespiti
    const forwardedHeader = request.headers.get("x-forwarded-for");
    const userIp = forwardedHeader ? forwardedHeader.split(",")[0].trim() : "127.0.0.1";

    let paytrData: any = null;
    let bankAccounts: any = null;

    if (paymentMethod === "ONLINE_PAYTR") {
      const tokenRes = await generatePayTrToken({
        orderCode: order.orderCode,
        totalAmount: order.totalAmount,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        packageName: `${pkg.category.platform.name} - ${pkg.name}`,
        userIp,
      });

      if (tokenRes.status === "success" && tokenRes.token) {
        // Token'ı siparişe kaydet
        await prisma.order.update({
          where: { id: order.id },
          data: { paytrToken: tokenRes.token },
        });

        paytrData = {
          token: tokenRes.token,
          isTestMode: tokenRes.isTestMode ?? false,
        };
      } else {
        console.warn("PayTR token üretilemedi:", tokenRes.reason);
        // Geliştirme modu için test token sağla
        paytrData = {
          token: `paytr_fallback_token_${order.orderCode}`,
          isTestMode: true,
        };
      }
    } else if (paymentMethod === "EFT_HAVALE") {
      bankAccounts = await prisma.bankAccount.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sipariş kaydı başarıyla oluşturuldu.",
      order,
      paytr: paytrData,
      bankAccounts,
    });
  } catch (error: any) {
    console.error("Sipariş oluşturma hatası:", error);
    return NextResponse.json(
      { success: false, message: "Sipariş oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}
