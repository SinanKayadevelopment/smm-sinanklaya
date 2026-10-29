import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePayTrToken } from "@/lib/paytr";
import { generateShopierPayment, getShopierConfig } from "@/lib/shopier";

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
      paymentMethod = "ONLINE_SHOPIER",
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

    // Online Ödeme Seçilmişse Shopier API anahtarlarının tanımlı olduğunu doğrula
    if (paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR") {
      const config = await getShopierConfig();
      if (!config.apiKey || !config.apiSecret) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Shopier Sanal POS henüz yapılandırılmamış. Lütfen Yönetim Paneli > Sistem & Ödeme Ayarları (/admin/settings) sayfasından Shopier API Key ve API Secret bilgilerinizi kaydediniz.",
          },
          { status: 400 }
        );
      }
    }

    const totalAmount = Number((pkg.price - discountAmount).toFixed(2));
    const orderCode = generateOrderCode();

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
        orderStatus: "WAITING",
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

    let shopierData: any = null;
    let paytrData: any = null;
    let bankAccounts: any = null;

    // Online Ödeme için Shopier verilerini hazırla (ONLINE_SHOPIER veya ONLINE_PAYTR)
    if (paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR") {
      try {
        const packageName = `${pkg.category.platform.name} - ${pkg.name}`;
        const shopierPayment = await generateShopierPayment({
          orderCode: order.orderCode,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          packageName,
          billingAddress: companyName ? companyName.trim() : "Türkiye",
          billingCity: "İstanbul",
        });

        shopierData = {
          actionUrl: shopierPayment.actionUrl,
          fields: shopierPayment.fields,
          autoSubmitUrl: `/api/payment/shopier-pay?orderCode=${order.orderCode}`,
        };
      } catch (err) {
        console.error("Shopier parametre oluşturma hatası:", err);
      }

      // Geriye dönük PayTR token'ı da üret
      try {
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
          await prisma.order.update({
            where: { id: order.id },
            data: { paytrToken: tokenRes.token },
          });

          paytrData = {
            token: tokenRes.token,
            isTestMode: tokenRes.isTestMode ?? false,
          };
        }
      } catch (err) {
        console.warn("PayTR token üretimi atlandı:", err);
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
      shopier: shopierData,
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
