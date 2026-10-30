import { prisma } from "@/lib/prisma";

export interface MtpService {
  service: number | string;
  name: string;
  type?: string;
  category: string;
  rate: string;
  min: number | string;
  max: number | string;
  refill?: boolean;
}

export interface SyncPackageItem {
  packageId: string;
  packageName: string;
  platform: string;
  category: string;
  oldServiceId: number | null;
  newServiceId: number;
  serviceName: string;
  serviceCategory: string;
  min: number;
  max: number;
  rateUSD: number;
  oldQuantity: number;
  newQuantity: number;
  costUSD: number;
  costTRY: number;
  oldPrice: number | null;
  newPrice: number;
  status: "UPDATED" | "MATCHED" | "UNMATCHED";
}

export interface SyncSummary {
  totalPackages: number;
  matchedCount: number;
  unmatchedCount: number;
  updatedCount: number;
  results: SyncPackageItem[];
}

/**
 * Türkçe karakterleri ASCII eşdeğerlerine normalize eder.
 */
export function cleanTurkish(str: string): string {
  return (str || "")
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

/**
 * MoreThanPanel API'sinden güncel canlı servis listesini çeker.
 */
export async function fetchMtpServices(): Promise<MtpService[]> {
  let apiUrl = process.env.MTP_API_URL || "https://morethanpanel.com/api/v2";
  let apiKey = process.env.MTP_API_KEY || "";

  try {
    const dbUrl = await prisma.setting.findUnique({ where: { key: "MTP_API_URL" } });
    if (dbUrl?.value) apiUrl = dbUrl.value.trim();

    const dbKey = await prisma.setting.findUnique({ where: { key: "MTP_API_KEY" } });
    if (dbKey?.value) apiKey = dbKey.value.trim();
  } catch (e) {
    console.warn("MTP ayarları okunurken hata:", e);
  }

  if (!apiKey || apiKey.startsWith("DEMO_")) {
    throw new Error("MoreThanPanel API Key tanımlı değil veya geçersiz.");
  }

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("action", "services");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`MoreThanPanel HTTP ${res.status} hatası döndürdü.`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error(data?.error || "MoreThanPanel servis listesi alınamadı.");
  }

  return data;
}

/**
 * Bir paket için en uygun MoreThanPanel servisini eşleştirir.
 */
export function matchMtpServiceForPackage(
  pkg: {
    name: string;
    quantity: number;
    category: { name: string; platform: { name: string } };
  },
  services: MtpService[]
): MtpService | null {
  const findById = (id: number) => services.find((s) => Number(s.service) === Number(id)) || null;

  const platform = cleanTurkish(pkg.category.platform.name);
  const category = cleanTurkish(pkg.category.name);
  const name = cleanTurkish(pkg.name);

  // 1. KICK EŞLEŞTİRMELERİ
  if (platform.includes("kick")) {
    if (name.includes("anket") || category.includes("anket")) {
      return findById(8051) || findById(3771); // Kick Anket Oyları
    }
    if (name.includes("chat") || name.includes("sohbet") || category.includes("chat") || category.includes("sohbet")) {
      return findById(3787) || findById(3771); // Kick Chat & Sohbet
    }
    if (name.includes("istirat") || name.includes("kombo") || name.includes("affiliate")) {
      return findById(7260); // Kick İştirak Takipçi & İzleyici Desteği
    }
    if (name.includes("takipci") || category.includes("takipci")) {
      return findById(7260); // 90 Gün Refill Kick Takipçi
    }
    if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
      if (name.includes("2 saat")) return findById(3772); // 2 Saatlik Smooth Canlı İzleyici
      if (category.includes("24 saat") || name.includes("24 saat") || name.includes("1 gun")) return findById(3776); // 1 Günlük Canlı İzleyici
      if (category.includes("haftalik") || name.includes("hafta")) return findById(3777); // 1 Haftalık Canlı İzleyici
      if (category.includes("aylik") || name.includes("ay")) return findById(3778); // 1 Aylık Canlı İzleyici
      return findById(3771); // 1 Saatlik Smooth Canlı İzleyici
    }
    if (category.includes("klip") || category.includes("video") || name.includes("klip") || name.includes("izlenme")) {
      return findById(3779) || findById(3768);
    }
  }

  // 2. TWITCH EŞLEŞTİRMELERİ
  if (platform.includes("twitch")) {
    if (name.includes("takipci") || category.includes("takipci")) {
      return findById(4753) || findById(10162); // 30 Gün Refill Twitch Takipçi
    }
    if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
      if (name.includes("2 saat")) return findById(8153); // 120 Dk %100 Eşzamanlı İzleyici
      if (category.includes("24 saat") || name.includes("24 saat")) return findById(8157); // 1440 Dk (24 Saat) %100 Eşzamanlı
      return findById(8151); // 60 Dk %100 Eşzamanlı İzleyici
    }
    if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
      return findById(10160) || findById(10159);
    }
  }

  // 3. YOUTUBE EŞLEŞTİRMELERİ
  if (platform.includes("youtube")) {
    if (name.includes("abone") || category.includes("abone")) {
      return findById(9694) || findById(7478); // 30 Gün Refill Gerçek Abone
    }
    if (name.includes("saat") || category.includes("saat") || name.includes("watchtime")) {
      return findById(9681) || findById(9662); // YouTube Yüksek Tutma Oranlı Watchtime İzlenmeleri
    }
    if (category.includes("video") || category.includes("izlenme") || name.includes("izlenme")) {
      return findById(9662); // 60 Gün Refill Real Video Views
    }
  }

  // 4. TIKTOK EŞLEŞTİRMELERİ
  if (platform.includes("tiktok")) {
    if (name.includes("takipci")) {
      return findById(7720) || findById(10295); // 30 Gün Refill TikTok Takipçi
    }
    if (name.includes("pk") || name.includes("canli") || category.includes("pk")) {
      return findById(9855) || findById(9197); // TikTok Canlı Yayın & PK Desteği
    }
    if (category.includes("izlenme") || name.includes("izlenme")) {
      return findById(9592) || findById(9593); // TikTok Monetizable Views
    }
    if (category.includes("begeni") || name.includes("begeni")) {
      return findById(7710);
    }
  }

  // 5. INSTAGRAM EŞLEŞTİRMELERİ
  if (platform.includes("instagram")) {
    if (name.includes("takipci") || category.includes("takipci")) {
      return findById(5542) || findById(10304); // 30 Gün Refill Hızlı Takipçi
    }
    if (category.includes("begeni") || name.includes("begeni")) {
      return findById(10305);
    }
    if (category.includes("reels") || category.includes("izlenme") || name.includes("izlenme")) {
      return findById(10239);
    }
  }

  // 6. TWITTER / X EŞLEŞTİRMELERİ
  if (platform.includes("twitter") || platform.includes("x")) {
    if (category.includes("takipci") || name.includes("takipci")) {
      return findById(9888); // 30 Gün Refill Power Followers
    }
  }

  // 7. DISCORD
  if (platform.includes("discord")) {
    if (name.includes("cevrimici") || name.includes("online")) {
      return findById(6373) || findById(10220); // Discord Çevrimiçi Üye
    }
    if (name.includes("tepki") || name.includes("reaction")) {
      return findById(9631); // Discord Emoji Tepki
    }
    if (name.includes("topluluk") || name.includes("uye") || category.includes("uye")) {
      return findById(7344) || findById(10220); // Discord Topluluk Üyesi 30 Gün Refill
    }
    if (category.includes("boost")) {
      return findById(5135);
    }
  }

  // 8. SPOTIFY
  if (platform.includes("spotify")) {
    if (name.includes("aylik") || name.includes("dinleyici") || category.includes("dinleyici")) {
      return findById(9434) || findById(9433); // Spotify Aylık Dinleyici
    }
    if (name.includes("dinlenme") || category.includes("dinlenme") || name.includes("sarki")) {
      return findById(2549) || findById(10070); // Spotify Şarkı Dinlenme
    }
    if (category.includes("takipci")) {
      return findById(5479) || findById(3491);
    }
  }

  // 9. TELEGRAM
  if (platform.includes("telegram")) {
    if (name.includes("goruntulenme") || name.includes("tepki") || category.includes("tepki")) {
      return findById(9213) || findById(7509); // Telegram Gönderi Görüntülenme & Tepki
    }
    if (name.includes("kanal") || name.includes("uye") || category.includes("uye")) {
      return findById(7507) || findById(9244) || findById(10229); // Telegram Kanal Üyesi
    }
  }

  // 10. AKILLI DİNAMİK ANAHTAR KELİME ARAMASI (FALLBACK)
  const candidates = services.filter((s) => {
    const sCat = cleanTurkish(s.category);
    const sName = cleanTurkish(s.name);
    return (sCat.includes(platform) || sName.includes(platform)) && !sName.includes("👇");
  });

  if (candidates.length > 0) {
    // Kategoriye ve miktara en yakın servisi seç
    const matched = candidates.find((c) => {
      const cName = cleanTurkish(c.name);
      return (
        (cName.includes("refill") || cName.includes("garanti") || cName.includes("non drop")) &&
        Number(c.min) <= pkg.quantity
      );
    });
    if (matched) return matched;
    return candidates[0];
  }

  return null;
}

/**
 * Fiyat hesaplama:
 * - 1 USD = 36 TL baz alınır.
 * - %350 kâr marjı (Maliyet x 4.5) uygulanır.
 * - Minimum paket satış fiyatı 19.90 TL olur.
 * - E-ticaret standartlarında .90 kuruşa tamamlanır.
 */
export function calculateSellingPrice(
  rateUSDPer1k: number,
  quantity: number
): { costUSD: number; costTRY: number; price: number; oldPrice: number } {
  const USD_TRY = 36.0;
  const MARGIN_MULTIPLIER = 4.5; // %350 kâr marjı (1 + 3.5)

  const costUSD = (rateUSDPer1k / 1000) * quantity;
  const costTRY = costUSD * USD_TRY;
  let sellingPrice = costTRY * MARGIN_MULTIPLIER;

  if (sellingPrice < 19.90) {
    sellingPrice = 19.90;
  } else {
    sellingPrice = Math.round(sellingPrice) - 0.10;
    if (sellingPrice < 19.90) sellingPrice = 19.90;
  }

  const oldPrice = Number((sellingPrice * 1.35).toFixed(2));

  return {
    costUSD: Number(costUSD.toFixed(4)),
    costTRY: Number(costTRY.toFixed(2)),
    price: Number(sellingPrice.toFixed(2)),
    oldPrice,
  };
}

/**
 * Tüm veritabanı paketlerini MoreThanPanel ile senkronize eder.
 * applyUpdate true ise veritabanına kaydeder.
 */
export async function syncAllPackagesWithMtp(applyUpdate: boolean = true): Promise<SyncSummary> {
  const services = await fetchMtpServices();

  const packages = await prisma.package.findMany({
    include: {
      category: {
        include: {
          platform: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const results: SyncPackageItem[] = [];
  let updatedCount = 0;

  for (const pkg of packages) {
    const matchedService = matchMtpServiceForPackage(pkg, services);

    if (!matchedService) {
      results.push({
        packageId: pkg.id,
        packageName: pkg.name,
        platform: pkg.category.platform.name,
        category: pkg.category.name,
        oldServiceId: pkg.providerServiceId,
        newServiceId: pkg.providerServiceId || 0,
        serviceName: "Eşleşen servis bulunamadı",
        serviceCategory: "-",
        min: 0,
        max: 0,
        rateUSD: 0,
        oldQuantity: pkg.quantity,
        newQuantity: pkg.quantity,
        costUSD: 0,
        costTRY: 0,
        oldPrice: pkg.oldPrice ?? pkg.price,
        newPrice: pkg.price,
        status: "UNMATCHED",
      });
      continue;
    }

    const serviceMin = Number(matchedService.min) || 1;
    const serviceMax = Number(matchedService.max) || 100000;
    const rateUSD = parseFloat(matchedService.rate) || 0;

    // Minimum Miktar Kuralı: Paketin miktarı MoreThanPanel min değerinden küçük olamaz!
    let targetQuantity = pkg.quantity;
    if (targetQuantity < serviceMin) {
      targetQuantity = serviceMin;
    }

    const { costUSD, costTRY, price: newPrice, oldPrice } = calculateSellingPrice(
      rateUSD,
      targetQuantity
    );

    const newServiceId = Number(matchedService.service);

    if (applyUpdate) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          providerServiceId: newServiceId,
          quantity: targetQuantity,
          price: newPrice,
          oldPrice,
        },
      });
      updatedCount++;
    }

    results.push({
      packageId: pkg.id,
      packageName: pkg.name,
      platform: pkg.category.platform.name,
      category: pkg.category.name,
      oldServiceId: pkg.providerServiceId,
      newServiceId,
      serviceName: matchedService.name,
      serviceCategory: matchedService.category,
      min: serviceMin,
      max: serviceMax,
      rateUSD,
      oldQuantity: pkg.quantity,
      newQuantity: targetQuantity,
      costUSD,
      costTRY,
      oldPrice: pkg.price,
      newPrice,
      status: applyUpdate ? "UPDATED" : "MATCHED",
    });
  }

  const matchedCount = results.filter((r) => r.status !== "UNMATCHED").length;
  const unmatchedCount = results.length - matchedCount;

  return {
    totalPackages: packages.length,
    matchedCount,
    unmatchedCount,
    updatedCount,
    results,
  };
}
