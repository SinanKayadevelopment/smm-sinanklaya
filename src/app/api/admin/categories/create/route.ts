import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { platformId, name, shortDescription } = body;

    if (!platformId || !name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Platform ve kategori adı zorunludur." },
        { status: 400 }
      );
    }

    const platform = await prisma.platform.findUnique({
      where: { id: platformId },
    });

    if (!platform) {
      return NextResponse.json(
        { success: false, message: "Geçersiz platform seçimi." },
        { status: 404 }
      );
    }

    const cleanName = name.trim();
    let slug = generateSlug(cleanName);

    // Check slug uniqueness
    const existing = await prisma.category.findFirst({
      where: {
        platformId,
        OR: [{ slug }, { name: cleanName }],
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Bu kategori zaten mevcut.",
        category: existing,
      });
    }

    const count = await prisma.category.count({ where: { platformId } });

    const newCategory = await prisma.category.create({
      data: {
        platformId,
        name: cleanName,
        slug,
        shortDescription: shortDescription || `${platform.name} için güvenli ve profesyonel ${cleanName} çözümleri.`,
        seoTitle: `${platform.name} ${cleanName} - Yükseliş Platformu`,
        seoDescription: `${platform.name} ${cleanName} çözümleriyle hesabınızı güvenle büyütün.`,
        sortOrder: count + 1,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Yeni kategori başarıyla oluşturuldu.",
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Kategori oluşturma hatası:", error);
    return NextResponse.json(
      { success: false, message: "Kategori oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
