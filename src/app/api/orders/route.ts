import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { success: false, message: "Seçilen paket bulunamadı veya hizmete kapalıdır." },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: "Sipariş kaydı başarıyla oluşturuldu.",
      order,
    });
  } catch (error: any) {
    console.error("Sipariş oluşturma hatası:", error);
    return NextResponse.json(
      { success: false, message: "Sipariş oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}
