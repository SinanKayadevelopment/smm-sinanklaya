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
  const pickCheapest = (ids: number[]): MtpService | null => {
    const found = ids.map((id) => findById(id)).filter((s): s is MtpService => Boolean(s));
    if (found.length === 0) return null;
    const withinMax = found.filter((s) => (Number(s.max) || 0) >= pkg.quantity);
    const pool = withinMax.length > 0 ? withinMax : found;
    return [...pool].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0];
  };

  const platform = cleanTurkish(pkg.category.platform.name);
  const category = cleanTurkish(pkg.category.name);
  const name = cleanTurkish(pkg.name);

  // 1. KICK EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("kick")) {
    if (name.includes("anket") || category.includes("anket")) {
      return pickCheapest([8051]); // Kick Anket Oyları ($1.95)
    }
    if (name.includes("chat") || name.includes("sohbet") || category.includes("chat") || category.includes("sohbet")) {
      return pickCheapest([3787]); // Kick Chat & Sohbet ($1.22)
    }
    if (name.includes("istirat") || name.includes("kombo") || name.includes("affiliate")) {
      return pickCheapest([7265, 7260]); // Kick Takipçi 30 Gün Refill ($0.68)
    }
    if (name.includes("takipci") || category.includes("takipci")) {
      return pickCheapest([7265, 7260]); // Kick Takipçi En Ucuz ($0.68)
    }
    if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
      if (name.includes("2 saat")) return pickCheapest([3772, 7819]);
      if (category.includes("24 saat") || name.includes("24 saat") || name.includes("1 gun")) {
        return pickCheapest([3776, 3784]); // Kick 1 Gün Canlı İzleyici ($9.05)
      }
      if (category.includes("haftalik") || name.includes("hafta")) {
        return pickCheapest([3777, 3785]); // Kick 1 Hafta Canlı İzleyici ($40.25)
      }
      if (category.includes("aylik") || name.includes("ay")) {
        return pickCheapest([3778, 3786]); // Kick 1 Ay Canlı İzleyici ($75.35)
      }
      return pickCheapest([3771, 6114, 7818]); // Kick 1 Saat Canlı İzleyici ($0.75)
    }
    if (category.includes("klip") || category.includes("video") || name.includes("klip") || name.includes("izlenme")) {
      return pickCheapest([7512, 8050, 7820]);
    }
  }

  // 2. TWITCH EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("twitch")) {
    if (name.includes("takipci") || category.includes("takipci")) {
      return pickCheapest([7189, 7188, 4753, 7190]); // Twitch Takipçi 30 Gün Refill ($0.07)
    }
    if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
      if (name.includes("2 saat")) return pickCheapest([3948, 8153]); // Twitch 2 Saat İzleyici ($1.66)
      if (category.includes("24 saat") || name.includes("24 saat")) {
        return pickCheapest([3951, 3898, 8157]); // Twitch 24 Saat İzleyici ($9.09)
      }
      return pickCheapest([3947, 8151, 3897]); // Twitch 1 Saat İzleyici ($0.84)
    }
    if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
      return pickCheapest([7511, 10160, 10159]);
    }
  }

  // 3. YOUTUBE EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("youtube")) {
    if (
      name.includes("saat") ||
      name.includes("watchtime") ||
      name.includes("60-75") ||
      name.includes("low drop") ||
      category.includes("para kazanma")
    ) {
      return pickCheapest([8868, 10236, 10100, 10101, 8867]); // WatchTime 1000=1000H 60+ dk ($18.20)
    }
    if (name.includes("abone") || (category.includes("abone") && !name.includes("izlenme"))) {
      return pickCheapest([10226, 7478, 8073, 8355]); // YouTube Abone En Ucuz ($0.01)
    }
    if (category.includes("video") || category.includes("izlenme") || name.includes("izlenme")) {
      return pickCheapest([1385, 6183, 6182, 9662]); // YouTube Yüksek İzlenme Süreli ($0.60)
    }
  }

  // 4. TIKTOK EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("tiktok")) {
    if (name.includes("takipci")) {
      return pickCheapest([9405, 5760, 5447, 7720]); // TikTok Takipçi ($0.84)
    }
    if (name.includes("pk") || name.includes("canli") || category.includes("pk")) {
      if (name.includes("60") || name.includes("1 saat")) {
        return pickCheapest([2836, 9855]); // TikTok Canlı 60 Dk ($15.66)
      }
      return pickCheapest([2835, 9855]); // TikTok Canlı 30 Dk ($7.83, min=50)
    }
    if (category.includes("izlenme") || name.includes("izlenme")) {
      return pickCheapest([9924, 9592, 9593]); // TikTok Video İzlenme ($0.01)
    }
    if (category.includes("begeni") || name.includes("begeni")) {
      return pickCheapest([7710]);
    }
  }

  // 5. INSTAGRAM EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("instagram")) {
    if (name.includes("takipci") || category.includes("takipci")) {
      return pickCheapest([5752, 9598, 5839, 5542]); // Instagram Takipçi ($0.54)
    }
    if (category.includes("begeni") || name.includes("begeni")) {
      return pickCheapest([10305]);
    }
    if (category.includes("reels") || category.includes("izlenme") || name.includes("izlenme")) {
      return pickCheapest([10239]);
    }
  }

  // 6. TWITTER / X EŞLEŞTİRMELERİ (En Ucuz Muadil)
  if (platform.includes("twitter") || platform.includes("x")) {
    if (category.includes("takipci") || name.includes("takipci")) {
      return pickCheapest([5125, 4786, 8354, 9888]); // X Takipçi ($0.69)
    }
  }

  // 7. DISCORD (En Ucuz Muadil)
  if (platform.includes("discord")) {
    if (name.includes("tepki") || name.includes("reaction")) {
      return pickCheapest([9631, 9632]); // Discord Mesaj Tepki ($1.87)
    }
    if (name.includes("cevrimici") || name.includes("online") || name.includes("topluluk") || name.includes("uye") || category.includes("uye")) {
      return pickCheapest([7344, 10220]); // Discord Üye 30 Gün Refill, Max 6500 ($1.68)
    }
    if (category.includes("boost")) {
      return pickCheapest([5135]);
    }
  }

  // 8. SPOTIFY (En Ucuz Muadil)
  if (platform.includes("spotify")) {
    if (name.includes("aylik") || name.includes("dinleyici") || category.includes("dinleyici")) {
      return pickCheapest([2069, 9410, 9431, 9434]); // Spotify Aylık Dinleyici ($1.69)
    }
    if (name.includes("dinlenme") || category.includes("dinlenme") || name.includes("sarki")) {
      return pickCheapest([10215, 1612, 2549]); // Spotify Şarkı Dinlenme Global ($0.16)
    }
    if (category.includes("takipci")) {
      return pickCheapest([1981, 5479, 3491]);
    }
  }

  // 9. TELEGRAM (En Ucuz Muadil)
  if (platform.includes("telegram")) {
    if (name.includes("tepki") && !name.includes("goruntulenme")) {
      return pickCheapest([8510, 2737]);
    }
    if (name.includes("goruntulenme") || category.includes("tepki")) {
      return pickCheapest([4880, 8500, 9213, 8510]); // Telegram Gönderi Görüntülenme ($0.02)
    }
    if (name.includes("kanal") || name.includes("uye") || category.includes("uye")) {
      return pickCheapest([1640, 7670, 5753, 7507]); // Telegram Kanal Üyesi ($0.03)
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
 * - 1 USD = 51 TL baz alınır.
 * - %350 kâr marjı (Maliyet x 4.5) uygulanır.
 * - Minimum paket satış fiyatı 19.90 TL olur.
 * - E-ticaret standartlarında .90 kuruşa tamamlanır.
 */
export function calculateSellingPrice(
  rateUSDPer1k: number,
  quantity: number
): { costUSD: number; costTRY: number; price: number; oldPrice: number } {
  const USD_TRY = 51.0;
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
