const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function cleanTurkish(str) {
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

function calculateSellingPrice(rateUSDPer1k, quantity) {
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

async function runSync() {
  console.log("==================================================================");
  console.log("🚀 MORETHANPANEL OTOMATİK SERVİS EŞLEŞTİRME VE FİYAT GÜNCELLEME");
  console.log("==================================================================");

  let apiUrl = process.env.MTP_API_URL || "https://morethanpanel.com/api/v2";
  let apiKey = process.env.MTP_API_KEY || "";

  const dbUrl = await prisma.setting.findUnique({ where: { key: "MTP_API_URL" } });
  if (dbUrl?.value) apiUrl = dbUrl.value.trim();

  const dbKey = await prisma.setting.findUnique({ where: { key: "MTP_API_KEY" } });
  if (dbKey?.value) apiKey = dbKey.value.trim();

  console.log("Tedarikçi API:", apiUrl);

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("action", "services");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const services = await res.json();
  if (!Array.isArray(services)) {
    throw new Error(services?.error || "Servis listesi alınamadı.");
  }
  console.log(`MoreThanPanel'den ${services.length} adet canlı servis çekildi.`);

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

  console.log(`Veritabanında taranacak toplam ${packages.length} paket var.\n`);

  const findById = (id) => services.find((s) => Number(s.service) === Number(id)) || null;

  function matchMtpService(pkg) {
    const platform = cleanTurkish(pkg.category.platform.name);
    const category = cleanTurkish(pkg.category.name);
    const name = cleanTurkish(pkg.name);

    // 1. KICK
    if (platform.includes("kick")) {
      if (name.includes("anket") || category.includes("anket")) {
        return findById(8051) || findById(3771);
      }
      if (name.includes("chat") || name.includes("sohbet") || category.includes("chat") || category.includes("sohbet")) {
        return findById(3787) || findById(3771);
      }
      if (name.includes("istirat") || name.includes("kombo") || name.includes("affiliate")) {
        return findById(7260);
      }
      if (name.includes("takipci") || category.includes("takipci")) {
        return findById(7260);
      }
      if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
        if (name.includes("2 saat")) return findById(3772);
        if (category.includes("24 saat") || name.includes("24 saat") || name.includes("1 gun")) return findById(3776);
        if (category.includes("haftalik") || name.includes("hafta")) return findById(3777);
        if (category.includes("aylik") || name.includes("ay")) return findById(3778);
        return findById(3771);
      }
      if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
        return findById(3779) || findById(3768);
      }
    }

    // 2. TWITCH
    if (platform.includes("twitch")) {
      if (name.includes("takipci") || category.includes("takipci")) {
        return findById(4753) || findById(10162);
      }
      if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
        if (name.includes("2 saat")) return findById(8153);
        if (category.includes("24 saat") || name.includes("24 saat")) return findById(8157);
        return findById(8151);
      }
      if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
        return findById(10160) || findById(10159);
      }
    }

    // 3. YOUTUBE
    if (platform.includes("youtube")) {
      if (name.includes("abone") || category.includes("abone")) {
        return findById(9694) || findById(7478);
      }
      if (name.includes("saat") || category.includes("saat") || name.includes("watchtime")) {
        return findById(9681) || findById(9662);
      }
      if (category.includes("video") || category.includes("izlenme") || name.includes("izlenme")) {
        return findById(9662);
      }
    }

    // 4. TIKTOK
    if (platform.includes("tiktok")) {
      if (name.includes("takipci")) {
        return findById(7720) || findById(10295);
      }
      if (name.includes("pk") || name.includes("canli") || category.includes("pk")) {
        return findById(9855) || findById(9197);
      }
      if (category.includes("izlenme") || name.includes("izlenme")) {
        return findById(9592) || findById(9593);
      }
      if (category.includes("begeni") || name.includes("begeni")) {
        return findById(7710);
      }
    }

    // 5. INSTAGRAM
    if (platform.includes("instagram")) {
      if (name.includes("takipci") || category.includes("takipci")) {
        return findById(5542) || findById(10304);
      }
      if (category.includes("begeni") || name.includes("begeni")) {
        return findById(10305);
      }
      if (category.includes("reels") || category.includes("izlenme") || name.includes("izlenme")) {
        return findById(10239);
      }
    }

    // 6. TWITTER / X
    if (platform.includes("twitter") || platform.includes("x")) {
      if (category.includes("takipci") || name.includes("takipci")) {
        return findById(9888);
      }
    }

    // 7. DISCORD
    if (platform.includes("discord")) {
      if (name.includes("cevrimici") || name.includes("online")) {
        return findById(6373) || findById(10220);
      }
      if (name.includes("tepki") || name.includes("reaction")) {
        return findById(9631);
      }
      if (name.includes("topluluk") || name.includes("uye") || category.includes("uye")) {
        return findById(7344) || findById(10220);
      }
      if (category.includes("boost")) return findById(5135);
    }

    // 8. SPOTIFY
    if (platform.includes("spotify")) {
      if (name.includes("aylik") || name.includes("dinleyici") || category.includes("dinleyici")) {
        return findById(9434) || findById(9433);
      }
      if (name.includes("dinlenme") || category.includes("dinlenme") || name.includes("sarki")) {
        return findById(2549) || findById(10070);
      }
      if (category.includes("takipci")) return findById(5479);
    }

    // 9. TELEGRAM
    if (platform.includes("telegram")) {
      if (name.includes("goruntulenme") || name.includes("tepki") || category.includes("tepki")) {
        return findById(9213) || findById(7509);
      }
      if (name.includes("kanal") || name.includes("uye") || category.includes("uye")) {
        return findById(7507) || findById(9244);
      }
    }

    return null;
  }

  let updatedCount = 0;

  for (const pkg of packages) {
    const s = matchMtpService(pkg);
    if (!s) {
      console.warn(`[UYARI] Eşleşmeyen paket: ${pkg.name} (${pkg.category.platform.name})`);
      continue;
    }

    const min = Number(s.min) || 1;
    let targetQty = pkg.quantity;
    if (targetQty < min) {
      console.log(`[MİKTAR DÜZELTME] ${pkg.name}: Miktar ${pkg.quantity} -> ${min} (MTP Min Kuralı)`);
      targetQty = min;
    }

    const rate = parseFloat(s.rate);
    const { costUSD, costTRY, price: newPrice, oldPrice } = calculateSellingPrice(rate, targetQty);
    const newServiceId = Number(s.service);

    await prisma.package.update({
      where: { id: pkg.id },
      data: {
        providerServiceId: newServiceId,
        quantity: targetQty,
        price: newPrice,
        oldPrice,
      },
    });

    updatedCount++;
    console.log(
      `✓ [${pkg.category.platform.name}] ${pkg.name} -> MTP #${newServiceId} | Miktar: ${targetQty} | Maliyet: ${costTRY} TL | Satış: ${newPrice} TL`
    );
  }

  console.log(`\n==================================================================`);
  console.log(`🎉 BAŞARILI: ${updatedCount} / ${packages.length} paket gerçek servislerle güncellendi!`);
  console.log(`==================================================================`);
}

runSync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

