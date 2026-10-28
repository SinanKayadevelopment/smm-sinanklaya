import { prisma } from "../src/lib/prisma";

interface PackageMatch {
  slug: string;
  providerServiceId: number;
  providerServiceName: string;
  ratePer1kUsd: number;
}

const MATCHES: PackageMatch[] = [
  // --- TWITCH ---
  {
    slug: "twitch-1-saatlik-50-canli-izleyici",
    providerServiceId: 7788,
    providerServiceName: "Twitch İzleyici | %100 Kullanıcı Listesi | 1 Saat",
    ratePer1kUsd: 2.36,
  },
  {
    slug: "twitch-1-saatlik-100-canli-izleyici",
    providerServiceId: 7788,
    providerServiceName: "Twitch İzleyici | %100 Kullanıcı Listesi | 1 Saat",
    ratePer1kUsd: 2.36,
  },
  {
    slug: "twitch-1-saatlik-250-canli-izleyici",
    providerServiceId: 7788,
    providerServiceName: "Twitch İzleyici | %100 Kullanıcı Listesi | 1 Saat",
    ratePer1kUsd: 2.36,
  },
  {
    slug: "twitch-50-canli-izleyici-1-aylik",
    providerServiceId: 7782,
    providerServiceName: "Twitch İzleyici | %100 Kullanıcı Listesi | Günlük/Aylık",
    ratePer1kUsd: 12.84,
  },
  {
    slug: "twitch-100-canli-izleyici-1-aylik",
    providerServiceId: 7782,
    providerServiceName: "Twitch İzleyici | %100 Kullanıcı Listesi | Günlük/Aylık",
    ratePer1kUsd: 12.84,
  },
  {
    slug: "twitch-1000-takipci-destegi",
    providerServiceId: 4164,
    providerServiceName: "Twitch Takipçi | 90 Gün Refill",
    ratePer1kUsd: 0.33,
  },
  {
    slug: "twitch-2500-takipci-destegi",
    providerServiceId: 4164,
    providerServiceName: "Twitch Takipçi | 90 Gün Refill",
    ratePer1kUsd: 0.33,
  },

  // --- KICK ---
  {
    slug: "kick-1-saatlik-5-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-1-saatlik-10-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-1-saatlik-15-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-1-saatlik-20-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-1-saatlik-50-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-1-saatlik-100-izleyici",
    providerServiceId: 6114,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Saat",
    ratePer1kUsd: 0.72,
  },
  {
    slug: "kick-50-canli-izleyici-1-haftalik",
    providerServiceId: 3785,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Hafta",
    ratePer1kUsd: 58.94,
  },
  {
    slug: "kick-24-saatlik-25-canli-izleyici",
    providerServiceId: 3784,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Gün / 24 Saat",
    ratePer1kUsd: 13.21,
  },
  {
    slug: "kick-24-saatlik-100-canli-izleyici",
    providerServiceId: 3784,
    providerServiceName: "Kick Canlı İzleyici | Smooth | 1 Gün / 24 Saat",
    ratePer1kUsd: 13.21,
  },
  {
    slug: "kick-takipci-30-gun-refill-hiz-1-5b-gunluk-maks-100b-destegi",
    providerServiceId: 7813,
    providerServiceName: "Kick Takipçi | 90 Gün Refill",
    ratePer1kUsd: 0.71,
  },

  // --- YOUTUBE ---
  {
    slug: "youtube-1000-abone-destegi",
    providerServiceId: 8125,
    providerServiceName: "Youtube Abone | Lifetime Guaranteed | Düşük Drop",
    ratePer1kUsd: 15.63,
  },

  // --- TIKTOK ---
  {
    slug: "tiktok-1000-takipci-destegi",
    providerServiceId: 5818,
    providerServiceName: "TikTok Takipçi | 30 Gün Refill | Hızlı",
    ratePer1kUsd: 0.98,
  },

  // --- INSTAGRAM ---
  {
    slug: "instagram-1000-takipci-destegi",
    providerServiceId: 5440,
    providerServiceName: "Instagram Takipçileri | 30 Gün Refill",
    ratePer1kUsd: 1.87,
  },

  // --- TWITTER / X ---
  {
    slug: "x-1000-takipci-destegi",
    providerServiceId: 2603,
    providerServiceName: "X/Twitter Takipçi | 7 Günlük Yenileme",
    ratePer1kUsd: 2.29,
  },
];

async function main() {
  console.log("Starting MoreThanPanel service matching...");

  let updatedCount = 0;
  for (const match of MATCHES) {
    const pkg = await prisma.package.findUnique({
      where: { slug: match.slug },
    });

    if (!pkg) {
      console.warn(`Package not found for slug: ${match.slug}`);
      continue;
    }

    await prisma.package.update({
      where: { id: pkg.id },
      data: {
        providerServiceId: match.providerServiceId,
      },
    });

    console.log(`✓ [${match.slug}] matched to MTP Service #${match.providerServiceId} (${match.providerServiceName})`);
    updatedCount++;
  }

  console.log(`\nMatching completed! Total packages updated: ${updatedCount}/${MATCHES.length}`);
}

main()
  .catch((e) => {
    console.error("Error during matching:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
