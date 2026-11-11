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

  function pickCheapest(ids, qty) {
    const found = ids.map((id) => findById(id)).filter(Boolean);
    if (found.length === 0) return null;
    const withinMax = found.filter((s) => (Number(s.max) || 0) >= qty);
    const pool = withinMax.length > 0 ? withinMax : found;
    return [...pool].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0];
  }

  function matchMtpService(pkg) {
    const platform = cleanTurkish(pkg.category.platform.name);
    const category = cleanTurkish(pkg.category.name);
    const name = cleanTurkish(pkg.name);
    const qty = pkg.quantity;

    // 1. KICK (En Ucuz Muadil)
    if (platform.includes("kick")) {
      if (name.includes("anket") || category.includes("anket")) {
        return pickCheapest([8051], qty);
      }
      if (name.includes("chat") || name.includes("sohbet") || category.includes("chat") || category.includes("sohbet")) {
        return pickCheapest([3787], qty);
      }
      if (name.includes("istirat") || name.includes("kombo") || name.includes("affiliate")) {
        return pickCheapest([7265, 7260], qty);
      }
      if (name.includes("takipci") || category.includes("takipci")) {
        return pickCheapest([7265, 7260], qty);
      }
      if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
        if (name.includes("2 saat")) return pickCheapest([3772, 7819], qty);
        if (category.includes("24 saat") || name.includes("24 saat") || name.includes("1 gun")) {
          return pickCheapest([3776, 3784], qty);
        }
        if (category.includes("haftalik") || name.includes("hafta")) return pickCheapest([3777, 3785], qty);
        if (category.includes("aylik") || name.includes("ay")) return pickCheapest([3778, 3786], qty);
        return pickCheapest([3771, 6114, 7818], qty);
      }
      if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
        return pickCheapest([7512, 8050, 7820], qty);
      }
    }

    // 2. TWITCH (En Ucuz Muadil)
    if (platform.includes("twitch")) {
      if (name.includes("takipci") || category.includes("takipci")) {
        return pickCheapest([7189, 7188, 4753, 7190], qty);
      }
      if (category.includes("saatlik") || name.includes("saatlik") || name.includes("izleyici")) {
        if (name.includes("2 saat")) return pickCheapest([3948, 8153], qty);
        if (category.includes("24 saat") || name.includes("24 saat")) return pickCheapest([3951, 3898, 8157], qty);
        return pickCheapest([3947, 8151, 3897], qty);
      }
      if (category.includes("klip") || category.includes("video") || name.includes("klip")) {
        return pickCheapest([7511, 10160, 10159], qty);
      }
    }

    // 3. YOUTUBE (En Ucuz Muadil)
    if (platform.includes("youtube")) {
      if (
        name.includes("saat") ||
        name.includes("watchtime") ||
        name.includes("60-75") ||
        name.includes("low drop") ||
        category.includes("para kazanma")
      ) {
        return pickCheapest([8868, 10236, 10100, 10101, 8867], qty);
      }
      if (name.includes("abone") || (category.includes("abone") && !name.includes("izlenme"))) {
        return pickCheapest([10226, 7478, 8073, 8355], qty);
      }
      if (category.includes("video") || category.includes("izlenme") || name.includes("izlenme")) {
        return pickCheapest([1385, 6183, 6182, 9662], qty);
      }
    }

    // 4. TIKTOK (En Ucuz Muadil)
    if (platform.includes("tiktok")) {
      if (name.includes("takipci")) {
        return pickCheapest([9405, 5760, 5447, 7720], qty);
      }
      if (name.includes("pk") || name.includes("canli") || category.includes("pk")) {
        if (name.includes("60") || name.includes("1 saat")) {
          return pickCheapest([2836, 9855], qty);
        }
        return pickCheapest([2835, 9855], qty);
      }
      if (category.includes("izlenme") || name.includes("izlenme")) {
        return pickCheapest([9924, 9592, 9593], qty);
      }
      if (category.includes("begeni") || name.includes("begeni")) {
        return pickCheapest([7710], qty);
      }
    }

    // 5. INSTAGRAM (En Ucuz Muadil)
    if (platform.includes("instagram")) {
      if (name.includes("takipci") || category.includes("takipci")) {
        return pickCheapest([5752, 9598, 5839, 5542], qty);
      }
      if (category.includes("begeni") || name.includes("begeni")) {
        return pickCheapest([10305], qty);
      }
      if (category.includes("reels") || category.includes("izlenme") || name.includes("izlenme")) {
        return pickCheapest([10239], qty);
      }
    }

    // 6. TWITTER / X (En Ucuz Muadil)
    if (platform.includes("twitter") || platform.includes("x")) {
      if (category.includes("takipci") || name.includes("takipci")) {
        return pickCheapest([5125, 4786, 8354, 9888], qty);
      }
    }

    // 7. DISCORD (En Ucuz Muadil)
    if (platform.includes("discord")) {
      if (name.includes("tepki") || name.includes("reaction")) {
        return pickCheapest([9631, 9632], qty);
      }
      if (name.includes("cevrimici") || name.includes("online") || name.includes("topluluk") || name.includes("uye") || category.includes("uye")) {
        return pickCheapest([7344, 10220], qty);
      }
      if (category.includes("boost")) return pickCheapest([5135], qty);
    }

    // 8. SPOTIFY (En Ucuz Muadil)
    if (platform.includes("spotify")) {
      if (name.includes("aylik") || name.includes("dinleyici") || category.includes("dinleyici")) {
        return pickCheapest([2069, 9410, 9431, 9434], qty);
      }
      if (name.includes("dinlenme") || category.includes("dinlenme") || name.includes("sarki")) {
        return pickCheapest([10215, 1612, 2549], qty);
      }
      if (category.includes("takipci")) return pickCheapest([1981, 5479], qty);
    }

    // 9. TELEGRAM (En Ucuz Muadil)
    if (platform.includes("telegram")) {
      if (name.includes("tepki") && !name.includes("goruntulenme")) {
        return pickCheapest([8510, 2737], qty);
      }
      if (name.includes("goruntulenme") || category.includes("tepki")) {
        return pickCheapest([4880, 8500, 9213, 8510], qty);
      }
      if (name.includes("kanal") || name.includes("uye") || category.includes("uye")) {
        return pickCheapest([1640, 7670, 5753, 7507], qty);
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

