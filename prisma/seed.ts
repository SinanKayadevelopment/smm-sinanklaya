import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed başlatılıyor...");

  // Temizleme (sıralı)
  await prisma.order.deleteMany();
  await prisma.package.deleteMany();
  await prisma.category.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.setting.deleteMany();

  // 1. Ayarlar
  const settings = [
    { key: "SITE_NAME", value: "Yükseliş Dijital Yayıncı ve Sosyal Medya Destek Platformu" },
    { key: "SITE_SLOGAN", value: "7/24 Kesintisiz Yayıncı ve Sosyal Medya Yükseliş Çözümleri" },
    { key: "WHATSAPP_PHONE", value: "+90 555 123 45 67" },
    { key: "SUPPORT_EMAIL", value: "destek@yukselisdijital.com" },
    { key: "MTP_API_URL", value: "https://morethanpanel.com/api/v2" },
    { key: "MTP_API_KEY", value: "DEMO_KEY_MTP_V2" },
    { key: "PAYTR_MERCHANT_ID", value: "987654" },
    { key: "PAYTR_MERCHANT_KEY", value: "DEMO_PAYTR_KEY" },
    { key: "PAYTR_MERCHANT_SALT", value: "DEMO_PAYTR_SALT" },
  ];
  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }

  // 2. Kuponlar
  const coupons = [
    { code: "YUKSELIS10", discountPercent: 10, isActive: true },
    { code: "YAYINCI15", discountPercent: 15, isActive: true },
    { code: "DESTEK20", discountPercent: 20, isActive: true },
  ];
  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 3. Banka Hesapları
  const bankAccounts = [
    {
      bankName: "Ziraat Bankası",
      accountHolder: "Yükseliş Dijital Destek ve Bilişim Hizmetleri",
      iban: "TR12 0001 0090 1234 5678 5001",
      branchCode: "1090",
      isActive: true,
      sortOrder: 1,
    },
    {
      bankName: "Garanti BBVA",
      accountHolder: "Yükseliş Dijital Destek ve Bilişim Hizmetleri",
      iban: "TR62 0006 2000 0001 2987 6543 21",
      branchCode: "0620",
      isActive: true,
      sortOrder: 2,
    },
    {
      bankName: "İş Bankası",
      accountHolder: "Yükseliş Dijital Destek ve Bilişim Hizmetleri",
      iban: "TR44 0006 4000 0011 2233 4455 66",
      branchCode: "1040",
      isActive: true,
      sortOrder: 3,
    },
  ];
  for (const b of bankAccounts) {
    await prisma.bankAccount.create({ data: b });
  }

  // 4. Platformlar & Kategoriler & Paketler
  // TWITCH
  const twitch = await prisma.platform.create({
    data: {
      name: "Twitch",
      slug: "twitch",
      icon: "Twitch",
      colorCode: "#9146FF",
      sortOrder: 1,
      isActive: true,
    },
  });

  const catTwitch1Saat = await prisma.category.create({
    data: {
      platformId: twitch.id,
      name: "1 Saatlik Canlı İzleyici Desteği",
      slug: "1-saatlik-canli-izleyici",
      shortDescription: "Yayın açtığınız anda kanalınıza aktarılan stabil ve kesintisiz izleyici etkileşimi.",
      seoTitle: "Twitch 1 Saatlik Canlı İzleyici Desteği - Anlık Yükseliş",
      seoDescription: "Twitch kanalınız için güvenli, stabil ve anlık başlayan 1 saatlik canlı izleyici desteği ile keşfette üst sıralara yükselin.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catTwitch1Saat.id,
        name: "1 Saatlik 50 Canlı İzleyici",
        slug: "twitch-1-saatlik-50-canli-izleyici",
        price: 21.50,
        oldPrice: 29.90,
        quantity: 50,
        providerServiceId: 101,
        features: JSON.stringify([
          "Anlık Başlar",
          "50 Canlı İzleyici",
          "Stabil Görünürlük",
          "7/24 Kesintisiz Destek",
          "Şifre Kesinlikle İstenmez",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
      {
        categoryId: catTwitch1Saat.id,
        name: "1 Saatlik 100 Canlı İzleyici",
        slug: "twitch-1-saatlik-100-canli-izleyici",
        price: 39.00,
        oldPrice: 55.00,
        quantity: 100,
        providerServiceId: 102,
        features: JSON.stringify([
          "Anlık Başlar",
          "100 Canlı İzleyici",
          "Görünürlük Yükselişi",
          "Yayın Boyu Stabil Performans",
          "Güvenilir Altyapı",
        ]),
        isPopular: false,
        sortOrder: 2,
      },
      {
        categoryId: catTwitch1Saat.id,
        name: "1 Saatlik 250 Canlı İzleyici",
        slug: "twitch-1-saatlik-250-canli-izleyici",
        price: 89.00,
        oldPrice: 120.00,
        quantity: 250,
        providerServiceId: 103,
        features: JSON.stringify([
          "Hızlı Aktivasyon",
          "250 Canlı İzleyici",
          "Kategori Keşfetinde Üst Sıra",
          "Öncelikli Destek Ekibi",
          "Yüksek Dönüşüm Potansiyeli",
        ]),
        isPopular: false,
        sortOrder: 3,
      },
    ],
  });

  const catTwitchAylik = await prisma.category.create({
    data: {
      platformId: twitch.id,
      name: "Aylık Stabil Canlı İzleyici",
      slug: "aylik-stabil-canli-izleyici",
      shortDescription: "30 gün boyunca her yayın açtığınızda otomatik olarak devreye giren profesyonel destek.",
      seoTitle: "Twitch Aylık Canlı İzleyici Desteği - Otomatik Yükseliş",
      seoDescription: "30 gün sınırsız yayın boyunca otomatik başlayan stabil canlı izleyici desteği ile kanalınızı büyütün.",
      sortOrder: 2,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catTwitchAylik.id,
        name: "50 Canlı İzleyici 1 Aylık",
        slug: "twitch-50-canli-izleyici-1-aylik",
        price: 827.50,
        oldPrice: 1100.00,
        quantity: 50,
        providerServiceId: 104,
        features: JSON.stringify([
          "30 Gün Boyunca Yayın Açtıkça Otomatik Destek",
          "50 Stabil Canlı İzleyici",
          "Sınırsız Yayın Saati & Sayısı",
          "Otomatik Sistem Algılama",
          "Öncelikli VIP Müşteri Desteği",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
      {
        categoryId: catTwitchAylik.id,
        name: "100 Canlı İzleyici 1 Aylık",
        slug: "twitch-100-canli-izleyici-1-aylik",
        price: 1540.00,
        oldPrice: 1990.00,
        quantity: 100,
        providerServiceId: 105,
        features: JSON.stringify([
          "30 Gün Boyunca Otomatik Başlangıç",
          "100 Stabil Canlı İzleyici",
          "İştirak ve Partnerlik Hedeflerine Destek",
          "Sınırsız Süre Yayında Kalma",
          "Özel Destek Temsilcisi",
        ]),
        isPopular: false,
        sortOrder: 2,
      },
    ],
  });

  const catTwitchTakipci = await prisma.category.create({
    data: {
      platformId: twitch.id,
      name: "Takipçi & Topluluk Desteği",
      slug: "takipci-topluluk-destegi",
      shortDescription: "Kanalınızın güvenilirliğini ve kitlesini güçlendiren kaliteli takipçi yükseliş paketleri.",
      seoTitle: "Twitch Takipçi Desteği - Topluluk Güçlendirme",
      seoDescription: "Twitch kanalınız için şifresiz, anında teslim edilen kaliteli takipçi desteği.",
      sortOrder: 3,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catTwitchTakipci.id,
        name: "1.000 Takipçi Desteği",
        slug: "twitch-1000-takipci-destegi",
        price: 107.60,
        oldPrice: 149.00,
        quantity: 1000,
        providerServiceId: 106,
        features: JSON.stringify([
          "Anlık Teslimat",
          "Global Hesaplar",
          "Kaliteli Hizmet",
          "Düşüşe Karşı Garanti",
          "Kanal İstatistiklerini Güçlendirme",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
      {
        categoryId: catTwitchTakipci.id,
        name: "2.500 Takipçi Desteği",
        slug: "twitch-2500-takipci-destegi",
        price: 249.00,
        oldPrice: 320.00,
        quantity: 2500,
        providerServiceId: 107,
        features: JSON.stringify([
          "Hızlı ve Doğal Dağılım",
          "Kanal Prestij Artışı",
          "Şifresiz ve Güvenli",
          "30 Gün Telafi Garantisi",
        ]),
        isPopular: false,
        sortOrder: 2,
      },
    ],
  });

  // KICK
  const kick = await prisma.platform.create({
    data: {
      name: "Kick",
      slug: "kick",
      icon: "Tv",
      colorCode: "#53FC18",
      sortOrder: 2,
      isActive: true,
    },
  });

  const catKickHaftalik = await prisma.category.create({
    data: {
      platformId: kick.id,
      name: "Haftalık Canlı İzleyici",
      slug: "haftalik-canli-izleyici",
      shortDescription: "7 gün boyunca her canlı yayınınızda kesintisiz ve stabil izleyici etkileşimi.",
      seoTitle: "Kick Haftalık Canlı İzleyici Desteği",
      seoDescription: "Kick yayınlarınız için 7 gün geçerli stabil canlı izleyici desteği ile yükselişe geçin.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catKickHaftalik.id,
        name: "50 Canlı İzleyici 1 Haftalık",
        slug: "kick-50-canli-izleyici-1-haftalik",
        price: 216.00,
        oldPrice: 290.00,
        quantity: 50,
        providerServiceId: 201,
        features: JSON.stringify([
          "Anlık Başlar",
          "50 Stabil İzleyici Desteği",
          "7 Gün Boyunca Yayınlarda Otomatik",
          "Kesintisiz İletişim ve Destek",
          "Kick Doğrulanmış Partnerlik Hedefine Yardım",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
    ],
  });

  const catKick24Saat = await prisma.category.create({
    data: {
      platformId: kick.id,
      name: "24 Saatlik Canlı İzleyici",
      slug: "24-saatlik-canli-izleyici",
      shortDescription: "Günün 24 saati boyunca yayınlarınızda kalıcı ve güçlü etkileşim.",
      seoTitle: "Kick 24 Saatlik Canlı İzleyici Desteği",
      seoDescription: "24 saat boyunca kesintisiz canlı izleyici desteği ile Kick kanalınızı zirveye taşıyın.",
      sortOrder: 2,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catKick24Saat.id,
        name: "24 Saatlik 25 Canlı İzleyici",
        slug: "kick-24-saatlik-25-canli-izleyici",
        price: 31.00,
        oldPrice: 45.00,
        quantity: 25,
        providerServiceId: 202,
        features: JSON.stringify([
          "Anlık Başlar",
          "Kesintisiz Yayın Desteği",
          "24 Saat Aktif Görünürlük",
          "7/24 Canlı Destek",
          "Güvenli ve Şifresiz",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
      {
        categoryId: catKick24Saat.id,
        name: "24 Saatlik 100 Canlı İzleyici",
        slug: "kick-24-saatlik-100-canli-izleyici",
        price: 110.00,
        oldPrice: 150.00,
        quantity: 100,
        providerServiceId: 203,
        features: JSON.stringify([
          "Yüksek Görünürlük Desteği",
          "24 Saat Kesintisiz",
          "Stabil Performans",
          "Kategori Öne Çıkarma",
          "VIP Destek",
        ]),
        isPopular: false,
        sortOrder: 2,
      },
    ],
  });

  // YOUTUBE
  const youtube = await prisma.platform.create({
    data: {
      name: "YouTube",
      slug: "youtube",
      icon: "Youtube",
      colorCode: "#FF0000",
      sortOrder: 3,
      isActive: true,
    },
  });

  const catYtAbone = await prisma.category.create({
    data: {
      platformId: youtube.id,
      name: "Abone & Topluluk Yükselişi",
      slug: "abone-topluluk-yukselisi",
      shortDescription: "YouTube kanalınızın büyümesine ivme kazandıran güvenli abone desteği.",
      seoTitle: "YouTube Abone Desteği - Kanal Güçlendirme",
      seoDescription: "YouTube kanalınız için doğal dağılımlı, kalıcı abone desteği.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catYtAbone.id,
        name: "1.000 YouTube Abone Desteği",
        slug: "youtube-1000-abone-destegi",
        price: 189.00,
        oldPrice: 260.00,
        quantity: 1000,
        providerServiceId: 301,
        features: JSON.stringify([
          "Kalıcı ve Güvenli Etkileşim",
          "Para Kazanma Eşiğine Destek",
          "Doğal Gönderim Hızı",
          "Telafi Garantisi",
          "Şifresiz İşlem",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
    ],
  });

  // TIKTOK
  const tiktok = await prisma.platform.create({
    data: {
      name: "TikTok",
      slug: "tiktok",
      icon: "Video",
      colorCode: "#00F2FE",
      sortOrder: 4,
      isActive: true,
    },
  });

  const catTiktokTakipci = await prisma.category.create({
    data: {
      platformId: tiktok.id,
      name: "Takipçi & Canlı Yayın Yetkisi",
      slug: "takipci-canli-yayin-yetkisi",
      shortDescription: "Canlı yayın açma şartını hızla karşılayarak kanalınızı aktif hale getirin.",
      seoTitle: "TikTok Takipçi Desteği - Hızlı Yükseliş",
      seoDescription: "TikTok hesabınızı büyütmek ve canlı yayın özelliğini açmak için kaliteli takipçi desteği.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catTiktokTakipci.id,
        name: "1.000 TikTok Takipçi Desteği",
        slug: "tiktok-1000-takipci-destegi",
        price: 75.00,
        oldPrice: 105.00,
        quantity: 1000,
        providerServiceId: 401,
        features: JSON.stringify([
          "Anında Yükleme Başlangıcı",
          "Canlı Yayın Açma Özelliğini Aktifleştirme",
          "Gerçekçi ve Kaliteli Profiller",
          "7/24 Kesintisiz Destek",
          "Güvenli Gönderim",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
    ],
  });

  // INSTAGRAM
  const instagram = await prisma.platform.create({
    data: {
      name: "Instagram",
      slug: "instagram",
      icon: "Instagram",
      colorCode: "#E1306C",
      sortOrder: 5,
      isActive: true,
    },
  });

  const catInstaTakipci = await prisma.category.create({
    data: {
      platformId: instagram.id,
      name: "Takipçi & Prestij Güçlendirme",
      slug: "takipci-prestij-guclendirme",
      shortDescription: "Profilinizi daha çekici ve güven verici kılan estetik takipçi desteği.",
      seoTitle: "Instagram Takipçi Desteği - Prestij Yükselişi",
      seoDescription: "Instagram profilinizi güçlendirecek şifresiz ve güvenli takipçi desteği paketleri.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catInstaTakipci.id,
        name: "1.000 Instagram Takipçi Desteği",
        slug: "instagram-1000-takipci-destegi",
        price: 65.00,
        oldPrice: 95.00,
        quantity: 1000,
        providerServiceId: 501,
        features: JSON.stringify([
          "Organik Görünümlü Profiller",
          "Hızlı Başlangıç",
          "Şifre Kesinlikle İstenmez",
          "Profil Prestij Artışı",
          "30 Gün Düşüş Koruması",
        ]),
        isPopular: true,
        sortOrder: 1,
      },
    ],
  });

  // TWITTER / X
  const twitter = await prisma.platform.create({
    data: {
      name: "Twitter / X",
      slug: "twitter-x",
      icon: "Twitter",
      colorCode: "#1DA1F2",
      sortOrder: 6,
      isActive: true,
    },
  });

  const catTwitterTakipci = await prisma.category.create({
    data: {
      platformId: twitter.id,
      name: "Etkileşim & Takipçi Desteği",
      slug: "etkilesim-takipci-destegi",
      shortDescription: "X platformunda paylaşımlarınızın görünürlüğünü ve etkileşimini artıran çözümler.",
      seoTitle: "Twitter / X Takipçi ve Etkileşim Desteği",
      seoDescription: "Twitter / X hesabınız için güvenli takipçi ve etkileşim desteği.",
      sortOrder: 1,
    },
  });

  await prisma.package.createMany({
    data: [
      {
        categoryId: catTwitterTakipci.id,
        name: "1.000 X Takipçi Desteği",
        slug: "x-1000-takipci-destegi",
        price: 85.00,
        oldPrice: 119.00,
        quantity: 1000,
        providerServiceId: 601,
        features: JSON.stringify([
          "Doğal Görünüm",
          "Hızlı İletim",
          "Şifresiz İşlem",
          "Hesap Etkileşim Artışı",
          "7/24 Müşteri Hizmetleri",
        ]),
        isPopular: false,
        sortOrder: 1,
      },
    ],
  });

  console.log("Seed başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
