import { NextResponse } from "next/server";
import { syncAllPackagesWithMtp } from "@/lib/service-sync";

export const dynamic = "force-dynamic";

/**
 * GET: MoreThanPanel servis eşleştirmelerini önizler (veritabanına yazmaz).
 */
export async function GET() {
  try {
    const summary = await syncAllPackagesWithMtp(false);
    return NextResponse.json({
      success: true,
      mode: "preview",
      summary,
    });
  } catch (error: any) {
    console.error("Servis eşleştirme önizleme hatası:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "MoreThanPanel servis listesi alınamadı.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Tüm paketleri MoreThanPanel gerçek servisleriyle eşleştirir,
 * miktar ve satış fiyatlarını (%350 kâr marjı, min 19.90 TL) hesaplar
 * ve veritabanına kaydeder.
 */
export async function POST() {
  try {
    const summary = await syncAllPackagesWithMtp(true);
    return NextResponse.json({
      success: true,
      mode: "applied",
      message: `${summary.updatedCount} adet paket MoreThanPanel gerçek servisleriyle başarıyla eşleştirildi ve fiyatları güncellendi.`,
      summary,
    });
  } catch (error: any) {
    console.error("Servis senkronizasyon hatası:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Servisler senkronize edilirken bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}

