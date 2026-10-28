import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function sanitizePackageName(name: string): string {
  let cleaned = name;
  // Kurumsal kırmızı çizgi filtreleri
  cleaned = cleaned.replace(/bot[lu]?/gi, "Desteği");
  cleaned = cleaned.replace(/panel/gi, "Altyapı");
  cleaned = cleaned.replace(/hile/gi, "Yükseliş");
  cleaned = cleaned.replace(/sahte/gi, "Kaliteli");
  cleaned = cleaned.replace(/takipçi basma/gi, "Takipçi Yükselişi");
  return cleaned.trim();
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      name,
      price,
      oldPrice,
      quantity,
      providerServiceId,
      features,
      isPopular = false,
    } = body;

    if (!categoryId || !name || !price || !quantity || !providerServiceId) {
      return NextResponse.json(
        { success: false, message: "Lütfen tüm zorunlu alanları doldurunuz." },
        { status: 400 }
      );
    }

    const cleanName = sanitizePackageName(name);
    let slug = generateSlug(cleanName);

    // Slug çakışma kontrolü
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let parsedFeatures = ["Anlık Başlangıç", "Stabil Destek", "7/24 Canlı Yardım"];
    if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (typeof features === "string") {
      parsedFeatures = features.split("\n").map((f) => f.trim()).filter(Boolean);
    }

    const newPackage = await prisma.package.create({
      data: {
        categoryId,
        name: cleanName,
        slug,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        quantity: parseInt(quantity, 10),
        providerServiceId: parseInt(providerServiceId, 10),
        features: JSON.stringify(parsedFeatures),
        isPopular: Boolean(isPopular),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paket başarıyla oluşturuldu ve sitede satışa açıldı!",
      package: newPackage,
    });
  } catch (error: any) {
    console.error("Paket oluşturma hatası:", error);
    return NextResponse.json(
      { success: false, message: "Paket eklenirken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}
