import { prisma } from "../src/lib/prisma";

interface PackageDefinition {
  platformSlug: string;
  categorySlug: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  quantity: number;
  providerServiceId: number;
  isPopular: boolean;
  sortOrder: number;
  features: string[];
}

const MASTER_PACKAGES: PackageDefinition[] = [
  // ==========================================
  // 1. TWITCH
  // ==========================================
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 50 Canlı İzleyici",
    slug: "twitch-1-saatlik-50-canli-izleyici",
    price: 19.90,
    oldPrice: 29.90,
    quantity: 50,
    providerServiceId: 7788,
    isPopular: true,
    sortOrder: 1,
    features: [
      "Anlık Gönderim Başlar",
      "50 Canlı İzleyici Desteği",
      "1 Saat Kesintisiz Yayın Desteği",
      "Stabil Görünürlük",
      "Şifresiz Güvenli İşlem",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 100 Canlı İzleyici",
    slug: "twitch-1-saatlik-100-canli-izleyici",
    price: 34.90,
    oldPrice: 49.90,
    quantity: 100,
    providerServiceId: 7788,
    isPopular: true,
    sortOrder: 2,
    features: [
      "Hızlı Başlangıç (0-5 Dk)",
      "100 Aktif İzleyici Desteği",
      "Kategori Üst Sıralarına Yükseliş",
      "1 Saat Boyunca Kesintisiz",
      "7/24 Canlı Destek",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 250 Canlı İzleyici",
    slug: "twitch-1-saatlik-250-canli-izleyici",
    price: 79.90,
    oldPrice: 109.90,
    quantity: 250,
    providerServiceId: 7788,
    isPopular: false,
    sortOrder: 3,
    features: [
      "Güçlü Kategori Görünürlüğü",
      "250 Canlı İzleyici Desteği",
      "Doğal Dalgalanmalı Stabil Akış",
      "1 Saat Boyunca Aktif",
      "Yayıncı İştirak Hedefine Yardım",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "2 Saatlik 100 Canlı İzleyici",
    slug: "twitch-2-saatlik-100-canli-izleyici",
    price: 59.90,
    oldPrice: 85.00,
    quantity: 100,
    providerServiceId: 3317,
    isPopular: false,
    sortOrder: 4,
    features: [
      "120 Dakika (2 Saat) Kesintisiz",
      "100 Canlı İzleyici",
      "Uzun Yayınlar İçin İdeal",
      "Stabil ve Güvenilir",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "24 Saatlik 25 Canlı İzleyici",
    slug: "twitch-24-saatlik-25-canli-izleyici",
    price: 49.90,
    oldPrice: 69.90,
    quantity: 25,
    providerServiceId: 7782,
    isPopular: false,
    sortOrder: 5,
    features: [
      "24 Saat (1 Gün) Boyunca Aktif",
      "25 Kesintisiz İzleyici Desteği",
      "Yayın Açtıkça Otomatik Devrede",
      "Sabit ve Güvenilir Görünürlük",
      "Şifre Kesinlikle İstenmez",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "saatlik-canli-izleyici",
    name: "24 Saatlik 50 Canlı İzleyici",
    slug: "twitch-24-saatlik-50-canli-izleyici",
    price: 89.90,
    oldPrice: 125.00,
    quantity: 50,
    providerServiceId: 7782,
    isPopular: true,
    sortOrder: 6,
    features: [
      "Tam 24 Saatlik Süre",
      "50 Canlı İzleyici Desteği",
      "Maraton Yayınlar İçin Mükemmel",
      "İzleyici Listesi Dahil",
      "7/24 VIP Destek",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "takipci-topluluk-destegi",
    name: "1.000 Takipçi Desteği (90 Gün Garantili)",
    slug: "twitch-1000-takipci-destegi",
    price: 45.00,
    oldPrice: 65.00,
    quantity: 1000,
    providerServiceId: 4164,
    isPopular: true,
    sortOrder: 1,
    features: [
      "90 Gün Telafi & Yenileme Garantisi",
      "Organik Dağılımlı Gönderim",
      "Twitch İştirak Eşiğini Karşılama",
      "Kalıcı ve Güvenli Profiller",
      "Şifresiz Güvenli Gönderim",
    ],
  },
  {
    platformSlug: "twitch",
    categorySlug: "takipci-topluluk-destegi",
    name: "2.500 Takipçi Desteği (90 Gün Garantili)",
    slug: "twitch-2500-takipci-destegi",
    price: 95.00,
    oldPrice: 140.00,
    quantity: 2500,
    providerServiceId: 4164,
    isPopular: false,
    sortOrder: 2,
    features: [
      "90 Gün Telafi & Yenileme Garantisi",
      "Yüksek Kalite Hesaplar",
      "Kanal Prestijinde Ciddi Artış",
      "Hızlı ve Güvenilir İletim",
      "7/24 Kesintisiz Destek",
    ],
  },

  // ==========================================
  // 2. KICK
  // ==========================================
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 5 İzleyici",
    slug: "kick-1-saatlik-5-izleyici",
    price: 6.50,
    oldPrice: 9.90,
    quantity: 5,
    providerServiceId: 6114,
    isPopular: true,
    sortOrder: 1,
    features: [
      "Anlık Başlar",
      "5 Canlı İzleyici",
      "5 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 10 İzleyici",
    slug: "kick-1-saatlik-10-izleyici",
    price: 7.00,
    oldPrice: 12.00,
    quantity: 10,
    providerServiceId: 6114,
    isPopular: false,
    sortOrder: 2,
    features: [
      "Anlık Başlar",
      "10 Canlı İzleyici",
      "10 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 15 İzleyici",
    slug: "kick-1-saatlik-15-izleyici",
    price: 7.50,
    oldPrice: 14.00,
    quantity: 15,
    providerServiceId: 6114,
    isPopular: false,
    sortOrder: 3,
    features: [
      "Anlık Başlar",
      "15 Canlı İzleyici",
      "15 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 20 İzleyici",
    slug: "kick-1-saatlik-20-izleyici",
    price: 7.80,
    oldPrice: 15.00,
    quantity: 20,
    providerServiceId: 6114,
    isPopular: false,
    sortOrder: 4,
    features: [
      "Anlık Başlar",
      "20 Canlı İzleyici",
      "20 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 50 İzleyici",
    slug: "kick-1-saatlik-50-izleyici",
    price: 14.90,
    oldPrice: 22.00,
    quantity: 50,
    providerServiceId: 6114,
    isPopular: true,
    sortOrder: 5,
    features: [
      "Anlık Başlar",
      "50 Canlı İzleyici",
      "50 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "saatlik-canli-izleyici",
    name: "1 Saatlik 100 İzleyici",
    slug: "kick-1-saatlik-100-izleyici",
    price: 26.90,
    oldPrice: 39.00,
    quantity: 100,
    providerServiceId: 6114,
    isPopular: false,
    sortOrder: 6,
    features: [
      "Anlık Başlar",
      "100 Canlı İzleyici",
      "100 İzleyici Listesi",
      "Stabil Görünürlük",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "24-saatlik-canli-izleyici",
    name: "24 Saatlik 25 Canlı İzleyici",
    slug: "kick-24-saatlik-25-canli-izleyici",
    price: 35.00,
    oldPrice: 49.00,
    quantity: 25,
    providerServiceId: 3784,
    isPopular: true,
    sortOrder: 1,
    features: [
      "24 Saat Boyunca Aktif",
      "25 Canlı İzleyici",
      "Smooth ve Doğal Dağılım",
      "Günün Her Saati Kesintisiz",
      "Şifresiz Güvenli Gönderim",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "24-saatlik-canli-izleyici",
    name: "24 Saatlik 50 Canlı İzleyici",
    slug: "kick-24-saatlik-50-canli-izleyici",
    price: 65.00,
    oldPrice: 89.00,
    quantity: 50,
    providerServiceId: 3784,
    isPopular: false,
    sortOrder: 2,
    features: [
      "24 Saat Boyunca Aktif",
      "50 Canlı İzleyici",
      "Yayın Sıralamasında Hızlı Yükseliş",
      "Doğal İzleyici Hareketi",
      "7/24 Destek",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "haftalik-canli-izleyici",
    name: "50 Canlı İzleyici 1 Haftalık",
    slug: "kick-50-canli-izleyici-1-haftalik",
    price: 199.00,
    oldPrice: 275.00,
    quantity: 50,
    providerServiceId: 3785,
    isPopular: true,
    sortOrder: 1,
    features: [
      "7 Gün Boyunca Her Canlı Yayında Aktif",
      "50 Stabil Canlı İzleyici",
      "Doğrulanmış Yayıncı Hedefine Yardım",
      "Otomatik Başlama Garantisi",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "aylik-canli-izleyici",
    name: "25 Canlı İzleyici (1 Aylık Paket)",
    slug: "kick-25-canli-izleyici-1-aylik",
    price: 249.00,
    oldPrice: 349.00,
    quantity: 25,
    providerServiceId: 3796,
    isPopular: false,
    sortOrder: 1,
    features: [
      "30 Gün Boyunca Her Canlı Yayında Devrede",
      "25 Canlı İzleyici Desteği",
      "Aylık Sabit İzleyici Kitlesi",
      "Kick Partnerlik Şartlarını Karşılama",
      "7/24 Kesintisiz Destek",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "aylik-canli-izleyici",
    name: "50 Canlı İzleyici (1 Aylık Paket)",
    slug: "kick-50-canli-izleyici-1-aylik",
    price: 449.00,
    oldPrice: 599.00,
    quantity: 50,
    providerServiceId: 3796,
    isPopular: true,
    sortOrder: 2,
    features: [
      "30 Gün Boyunca Yayınlarda Otomatik",
      "50 Stabil Canlı İzleyici",
      "Kategori Öne Çıkma ve Zirve Görünürlük",
      "En Çok Tercih Edilen Yayıncı Paketi",
      "Şifresiz Güvenli İşlem",
    ],
  },
  {
    platformSlug: "kick",
    categorySlug: "kick-takipci-topluluk",
    name: "1.000 Kick Takipçi (90 Gün Garantili)",
    slug: "kick-1000-takipci-destegi",
    price: 55.00,
    oldPrice: 79.00,
    quantity: 1000,
    providerServiceId: 7813,
    isPopular: true,
    sortOrder: 1,
    features: [
      "90 Gün Boyunca Düşüş Koruması",
      "Hızlı Başlangıç (0-30 Dk)",
      "Profil Güvenilirliğini Katlama",
      "Doğrulanmış Partner Şartına Yardım",
      "Şifre İstenmez",
    ],
  },

  // ==========================================
  // 3. YOUTUBE
  // ==========================================
  {
    platformSlug: "youtube",
    categorySlug: "abone-topluluk-yukselisi",
    name: "500 YouTube Abone Desteği (Ömür Boyu Garantili)",
    slug: "youtube-500-abone-destegi",
    price: 149.00,
    oldPrice: 199.00,
    quantity: 500,
    providerServiceId: 8125,
    isPopular: false,
    sortOrder: 1,
    features: [
      "Ömür Boyu Düşüş Telafisi Garantili",
      "Doğal ve Güvenli Gönderim Hızı",
      "Para Kazanma Eşiğine Destek",
      "Kanal Prestijinde Ciddi Artış",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "youtube",
    categorySlug: "abone-topluluk-yukselisi",
    name: "1.000 YouTube Abone Desteği (Ömür Boyu Garantili)",
    slug: "youtube-1000-abone-destegi",
    price: 269.00,
    oldPrice: 379.00,
    quantity: 1000,
    providerServiceId: 8125,
    isPopular: true,
    sortOrder: 2,
    features: [
      "Para Kazanma Eşiği (1.000 Abone) Desteği",
      "Ömür Boyu Telafi & Yenileme Garantisi",
      "Doğal Algoritmaya Uygun Akış",
      "Kanal Güvenliği %100 Korunur",
      "7/24 Kesintisiz Canlı Destek",
    ],
  },
  {
    platformSlug: "youtube",
    categorySlug: "youtube-video-izlenme-saat",
    name: "5.000 Video İzlenme Desteği (60 Gün Garantili)",
    slug: "youtube-5000-video-izlenme",
    price: 49.00,
    oldPrice: 69.00,
    quantity: 5000,
    providerServiceId: 9662,
    isPopular: false,
    sortOrder: 1,
    features: [
      "60 Gün Boyunca Düşüş Koruması",
      "Yüksek Kalıcılık Süresi",
      "Algoritmada Önerilen Videolara Girme",
      "Drip-Feed Doğal Dağılım",
      "Şifresiz Güvenli Gönderim",
    ],
  },

  // ==========================================
  // 4. TIKTOK
  // ==========================================
  {
    platformSlug: "tiktok",
    categorySlug: "takipci-canli-yayin-yetkisi",
    name: "1.000 TikTok Takipçi (Canlı Yayın Açma Şartı)",
    slug: "tiktok-1000-takipci-destegi",
    price: 69.00,
    oldPrice: 95.00,
    quantity: 1000,
    providerServiceId: 5818,
    isPopular: true,
    sortOrder: 1,
    features: [
      "Canlı Yayın Açma Özelliğini Aktifleştirir",
      "30 Gün Boyunca Telafi Garantili",
      "Hızlı ve Güvenli Teslimat",
      "Gerçekçi Profil Görünümleri",
      "Şifresiz İşlem",
    ],
  },
  {
    platformSlug: "tiktok",
    categorySlug: "takipci-canli-yayin-yetkisi",
    name: "2.500 TikTok Takipçi Desteği (30 Gün Garantili)",
    slug: "tiktok-2500-takipci-destegi",
    price: 149.00,
    oldPrice: 210.00,
    quantity: 2500,
    providerServiceId: 5818,
    isPopular: false,
    sortOrder: 2,
    features: [
      "30 Gün Telafi & Yenileme",
      "Profil Güvenilirliğinde Hızlı Artış",
      "Keşfet Algoritması İçin Güçlü Sinyal",
      "Şifresiz Güvenli İşlem",
      "7/24 Destek",
    ],
  },
  {
    platformSlug: "tiktok",
    categorySlug: "tiktok-video-izlenme-kesfet",
    name: "10.000 Video İzlenme & Keşfet Desteği",
    slug: "tiktok-10000-video-izlenme",
    price: 29.00,
    oldPrice: 45.00,
    quantity: 10000,
    providerServiceId: 9592,
    isPopular: false,
    sortOrder: 1,
    features: [
      "Keşfet Akışına Girme Desteği",
      "Anında Başlayan Hızlı İletim",
      "Video Etkileşim Oranını Katlama",
      "Şifresiz İşlem",
      "Maksimum Güvenlik",
    ],
  },

  // ==========================================
  // 5. INSTAGRAM
  // ==========================================
  {
    platformSlug: "instagram",
    categorySlug: "takipci-prestij-guclendirme",
    name: "1.000 Instagram Takipçi (30 Gün Garantili)",
    slug: "instagram-1000-takipci-destegi",
    price: 59.00,
    oldPrice: 85.00,
    quantity: 1000,
    providerServiceId: 5440,
    isPopular: true,
    sortOrder: 1,
    features: [
      "30 Gün Otomatik Düşüş Telafisi",
      "Estetik ve Gerçekçi Profil Dağılımı",
      "Hesap Prestijinde Hızlı Artış",
      "Şifre Kesinlikle İstenmez",
      "7/24 Kesintisiz Destek",
    ],
  },
  {
    platformSlug: "instagram",
    categorySlug: "takipci-prestij-guclendirme",
    name: "2.500 Instagram Takipçi (30 Gün Garantili)",
    slug: "instagram-2500-takipci-destegi",
    price: 129.00,
    oldPrice: 179.00,
    quantity: 2500,
    providerServiceId: 5440,
    isPopular: false,
    sortOrder: 2,
    features: [
      "30 Gün Otomatik Düşüş Telafisi",
      "Hızlı ve Doğal Dağılım",
      "Marka & İçerik Üretici Görünürlüğü",
      "Şifresiz Güvenli İşlem",
      "VIP Müşteri Hizmetleri",
    ],
  },
  {
    platformSlug: "instagram",
    categorySlug: "takipci-prestij-guclendirme",
    name: "5.000 Instagram Takipçi (30 Gün Garantili)",
    slug: "instagram-5000-takipci-destegi",
    price: 239.00,
    oldPrice: 320.00,
    quantity: 5000,
    providerServiceId: 5440,
    isPopular: false,
    sortOrder: 3,
    features: [
      "Büyük Hesaplar İçin Prestij Paketi",
      "30 Gün Telafi & Yenileme",
      "Sipariş Sonrası Hızlı Başlangıç",
      "Hesap Güvenliği Tam Koruma",
      "7/24 VIP Destek",
    ],
  },

  // ==========================================
  // 6. TWITTER / X
  // ==========================================
  {
    platformSlug: "twitter-x",
    categorySlug: "etkilesim-takipci-destegi",
    name: "1.000 X Takipçi Desteği (7 Gün Garantili)",
    slug: "x-1000-takipci-destegi",
    price: 79.00,
    oldPrice: 110.00,
    quantity: 1000,
    providerServiceId: 2603,
    isPopular: true,
    sortOrder: 1,
    features: [
      "7 Günlük Yenileme / Refill Garantisi",
      "Hızlı Gönderim (10-50K/Gün Hız)",
      "Profil Etkileşiminde Belirgin Artış",
      "Şifresiz Güvenli İşlem",
      "7/24 Destek",
    ],
  },
  {
    platformSlug: "twitter-x",
    categorySlug: "etkilesim-takipci-destegi",
    name: "2.500 X Takipçi Desteği (7 Gün Garantili)",
    slug: "x-2500-takipci-destegi",
    price: 179.00,
    oldPrice: 245.00,
    quantity: 2500,
    providerServiceId: 2603,
    isPopular: false,
    sortOrder: 2,
    features: [
      "7 Gün Refill Garantisi",
      "Yüksek Kalite Hesaplar",
      "Paylaşımlara Organik Görünürlük Katkısı",
      "Şifresiz İşlem",
      "VIP Destek",
    ],
  },
];

async function main() {
  console.log("Starting complete catalog rebuild backed 100% by live MoreThanPanel services...");

  // 1. Delete existing orders and packages
  console.log("Cleaning old packages and orders...");
  await prisma.order.deleteMany();
  await prisma.package.deleteMany();
  console.log("Old packages and test orders cleaned.");

  let insertedCount = 0;

  for (const p of MASTER_PACKAGES) {
    const platform = await prisma.platform.findUnique({
      where: { slug: p.platformSlug },
    });

    if (!platform) {
      console.warn(`Platform not found: ${p.platformSlug}`);
      continue;
    }

    let category = await prisma.category.findFirst({
      where: {
        platformId: platform.id,
        slug: p.categorySlug,
      },
    });

    if (!category) {
      // Find by partial slug or create
      category = await prisma.category.findFirst({
        where: {
          platformId: platform.id,
        },
      });
    }

    if (!category) {
      console.warn(`Category not found for: ${p.categorySlug} under ${p.platformSlug}`);
      continue;
    }

    await prisma.package.create({
      data: {
        categoryId: category.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        oldPrice: p.oldPrice,
        quantity: p.quantity,
        providerServiceId: p.providerServiceId,
        features: JSON.stringify(p.features),
        isPopular: p.isPopular,
        sortOrder: p.sortOrder,
        isActive: true,
      },
    });

    console.log(`✓ Added [${platform.name}] -> "${p.name}" (MTP #${p.providerServiceId}) | ${p.price} TL`);
    insertedCount++;
  }

  console.log(`\nRebuild finished! Total fresh packages added: ${insertedCount}/${MASTER_PACKAGES.length}`);
}

main()
  .catch((e) => {
    console.error("Error rebuilding catalog:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
