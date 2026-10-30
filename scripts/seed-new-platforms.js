const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  console.log("==================================================================");
  console.log("🌱 YENİ PLATFORMLAR, KATEGORİLER VE PAKETLER EKLENİYOR...");
  console.log("==================================================================");

  // 1. Platformları Bul veya Oluştur
  const platformsData = [
    { name: "Discord", slug: "discord", icon: "Discord", colorCode: "#5865F2", sortOrder: 7 },
    { name: "Spotify", slug: "spotify", icon: "Spotify", colorCode: "#1DB954", sortOrder: 8 },
    { name: "Telegram", slug: "telegram", icon: "Telegram", colorCode: "#229ED9", sortOrder: 9 },
  ];

  for (const p of platformsData) {
    await prisma.platform.upsert({
      where: { slug: p.slug },
      update: { name: p.name, icon: p.icon, colorCode: p.colorCode, sortOrder: p.sortOrder, isActive: true },
      create: { name: p.name, slug: p.slug, icon: p.icon, colorCode: p.colorCode, sortOrder: p.sortOrder, isActive: true },
    });
    console.log(`✓ Platform eklendi/güncellendi: ${p.name}`);
  }

  // Mevcut platformları al
  const kick = await prisma.platform.findUnique({ where: { slug: "kick" } });
  const youtube = await prisma.platform.findUnique({ where: { slug: "youtube" } });
  const tiktok = await prisma.platform.findUnique({ where: { slug: "tiktok" } });
  const discord = await prisma.platform.findUnique({ where: { slug: "discord" } });
  const spotify = await prisma.platform.findUnique({ where: { slug: "spotify" } });
  const telegram = await prisma.platform.findUnique({ where: { slug: "telegram" } });

  // 2. Kategoriler Listesi
  const categoriesData = [
    // KICK
    {
      platformId: kick.id,
      name: "Kick Canlı Sohbet (Aktif Chat) Desteği",
      slug: "kick-canli-sohbet-aktif-chat",
      shortDescription: "Yayınlarınızda doğal, hareketli ve etkileşimi artıran akıcı canlı sohbet mesajı desteği.",
      sortOrder: 6,
    },
    {
      platformId: kick.id,
      name: "Kick İştirak (Affiliate) Başlangıç Kombo Paketi",
      slug: "kick-istirat-affiliate-kombo",
      shortDescription: "Kick İştirak gereksinimlerini hızla tamamlamanızı sağlayan takipçi ve stabil canlı izleyici kombo desteği.",
      sortOrder: 7,
    },
    {
      platformId: kick.id,
      name: "Kick Anket Oyu Desteği",
      slug: "kick-anket-oyu-destegi",
      shortDescription: "Yayın anketlerinizde kitlenizi yönlendiren hızlı, güvenli ve anlık anket oyu desteği.",
      sortOrder: 8,
    },

    // DISCORD
    {
      platformId: discord.id,
      name: "Discord Çevrimiçi (Online) Sunucu Üyesi",
      slug: "discord-cevrimici-online-uye",
      shortDescription: "Sunucunuzun üye listesinde sürekli çevrimiçi görünen, aktif ve prestijli topluluk üyeleri.",
      sortOrder: 1,
    },
    {
      platformId: discord.id,
      name: "Discord Topluluk Üyesi & Emoji Tepki Desteği",
      slug: "discord-topluluk-emoji-tepki",
      shortDescription: "Sunucunuzun genel üye sayısını artıran telafili üyeler ve duyuru mesajlarınıza anlık emoji tepkileri.",
      sortOrder: 2,
    },

    // YOUTUBE
    {
      platformId: youtube.id,
      name: "YouTube 4.000 Saat İzlenme Süresi (Para Kazanma Desteği)",
      slug: "youtube-4000-saat-para-kazanma",
      shortDescription: "YouTube İş Ortağı Programı (YPP) para kazanma onayını açmak için gereken 4.000 saat izlenme süresi desteği.",
      sortOrder: 3,
    },

    // TIKTOK
    {
      platformId: tiktok.id,
      name: "TikTok Canlı Yayın Etkileşim & Karşılaşma (PK) Desteği",
      slug: "tiktok-canli-yayin-etkilesim-pk",
      shortDescription: "Canlı yayınlarınızda ve PK karşılaşmalarınızda etkileşimi zirveye taşıyan izleyici ve beğeni desteği.",
      sortOrder: 3,
    },

    // SPOTIFY
    {
      platformId: spotify.id,
      name: "Spotify Aylık Dinleyici (Monthly Listeners) Desteği",
      slug: "spotify-aylik-dinleyici",
      shortDescription: "Sanatçı profilinizin aylık dinleyici metriğini yükselterek editoryal listelerin radarına girmenizi sağlayan destek.",
      sortOrder: 1,
    },
    {
      platformId: spotify.id,
      name: "Spotify Şarkı Dinlenme & Kaydetme Desteği",
      slug: "spotify-sarki-dinlenme-kaydetme",
      shortDescription: "Şarkılarınızın algoritma tarafından Keşfet ve Haftalık Keşif listelerine önerilmesini sağlayan premium dinlenmeler.",
      sortOrder: 2,
    },

    // TELEGRAM
    {
      platformId: telegram.id,
      name: "Telegram Kanal Üyesi",
      slug: "telegram-kanal-uyesi",
      shortDescription: "Kanal ve grubunuza prestij ve güven kazandıracak garantili, kalıcı Telegram topluluk üyeleri.",
      sortOrder: 1,
    },
    {
      platformId: telegram.id,
      name: "Telegram Gönderi Görüntülenme & Emoji Tepki Paketi",
      slug: "telegram-goruntulenme-tepki",
      shortDescription: "Kanal paylaşımlarınızın okunma sayısını artıran ve etkileşim katan pozitif emoji tepkileri.",
      sortOrder: 2,
    },
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: {
        platformId_slug: {
          platformId: c.platformId,
          slug: c.slug,
        },
      },
      update: { name: c.name, shortDescription: c.shortDescription, sortOrder: c.sortOrder, isActive: true },
      create: {
        platformId: c.platformId,
        name: c.name,
        slug: c.slug,
        shortDescription: c.shortDescription,
        sortOrder: c.sortOrder,
        isActive: true,
      },
    });
    catMap[c.slug] = cat.id;
    console.log(`✓ Kategori eklendi/güncellendi: ${c.name}`);
  }

  // 3. Paketler Listesi
  const packagesData = [
    // KICK CANLI SOHBET
    {
      categorySlug: "kick-canli-sohbet-aktif-chat",
      name: "1 Saatlik 50 Aktif Chat Mesajı Desteği",
      slug: "kick-1-saatlik-50-aktif-chat",
      quantity: 50,
      price: 39.90,
      providerServiceId: 3787,
      features: JSON.stringify([
        "1 Saat Boyunca Akıcı Sohbet",
        "Doğal ve Türkçe Mesaj Dağılımı",
        "Yayın Etkileşimini Katlar",
        "%100 Şifresiz İşlem",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "kick-canli-sohbet-aktif-chat",
      name: "1 Saatlik 100 Aktif Chat Mesajı Desteği",
      slug: "kick-1-saatlik-100-aktif-chat",
      quantity: 100,
      price: 69.90,
      providerServiceId: 3787,
      features: JSON.stringify([
        "1 Saat Boyunca Yoğun Sohbet Akışı",
        "Organik Görünümlü Profil Hesapları",
        "Keşfette Dikkat Çekme Gücü",
        "7/24 Kesintisiz Teslimat",
      ]),
      isPopular: false,
      sortOrder: 2,
    },

    // KICK İŞTİRAK KOMBO
    {
      categorySlug: "kick-istirat-affiliate-kombo",
      name: "Kick İştirak Başlangıç Paketi (75 Takipçi + 3 Ortalama Canlı İzleyici)",
      slug: "kick-istirat-affiliate-baslangic-kombo",
      quantity: 75,
      price: 49.90,
      providerServiceId: 7260,
      features: JSON.stringify([
        "75 Adet Kalıcı Kick Takipçi",
        "3 Eşzamanlı Stabil İzleyici Desteği",
        "İştirak Metriklerini Hızla Sağlar",
        "90 Gün Düşüş Koruması",
      ]),
      isPopular: true,
      sortOrder: 1,
    },

    // KICK ANKET OYU
    {
      categorySlug: "kick-anket-oyu-destegi",
      name: "500 Kick Yayın Anket Oyu Desteği",
      slug: "kick-500-yayin-anket-oyu",
      quantity: 500,
      price: 29.90,
      providerServiceId: 8051,
      features: JSON.stringify([
        "500 Adet Canlı Anket Oyu",
        "Anında Başlayan Hızlı Gönderim",
        "Seçtiğiniz Şıkka Yönlendirme",
        "Şifresiz Güvenli Altyapı",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "kick-anket-oyu-destegi",
      name: "1.000 Kick Yayın Anket Oyu Desteği",
      slug: "kick-1000-yayin-anket-oyu",
      quantity: 1000,
      price: 49.90,
      providerServiceId: 8051,
      features: JSON.stringify([
        "1.000 Adet Canlı Anket Oyu",
        "Turnuva ve Yarışmalarda Güç",
        "Doğal Akışlı Dağılım",
        "Canlı Destek Güvencesi",
      ]),
      isPopular: false,
      sortOrder: 2,
    },

    // DISCORD ÇEVRİMİÇİ ÜYE
    {
      categorySlug: "discord-cevrimici-online-uye",
      name: "100 Discord Çevrimiçi Sunucu Üyesi",
      slug: "discord-100-cevrimici-uye",
      quantity: 100,
      price: 49.90,
      providerServiceId: 6373,
      features: JSON.stringify([
        "100 Adet Çevrimiçi (Yeşil Işık) Üye",
        "Sunucu Sağ Panelinde Aktif Görünür",
        "Profil Resimli Kaliteli Hesaplar",
        "Davet Linkiniz Yeterlidir",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "discord-cevrimici-online-uye",
      name: "250 Discord Çevrimiçi Sunucu Üyesi",
      slug: "discord-250-cevrimici-uye",
      quantity: 250,
      price: 99.90,
      providerServiceId: 6373,
      features: JSON.stringify([
        "250 Adet Çevrimiçi Üye Desteği",
        "Sunucunuza Kalabalık ve Canlı İntiba",
        "Oyun ve Topluluk Sunucuları İçin İdeal",
        "30 Gün Garanti",
      ]),
      isPopular: true,
      sortOrder: 2,
    },
    {
      categorySlug: "discord-cevrimici-online-uye",
      name: "500 Discord Çevrimiçi Sunucu Üyesi",
      slug: "discord-500-cevrimici-uye",
      quantity: 500,
      price: 189.90,
      providerServiceId: 6373,
      features: JSON.stringify([
        "500 Adet Aktif Çevrimiçi Üye",
        "Maksimum Prestij ve Güven",
        "Hızlı ve Doğal Dağılım",
        "Yetki veya Giriş İstenmez",
      ]),
      isPopular: false,
      sortOrder: 3,
    },

    // DISCORD TOPLULUK & EMOJİ TEPKİ
    {
      categorySlug: "discord-topluluk-emoji-tepki",
      name: "250 Discord Topluluk Üyesi (30 Gün Garantili)",
      slug: "discord-250-topluluk-uyesi",
      quantity: 250,
      price: 39.90,
      providerServiceId: 7344,
      features: JSON.stringify([
        "250 Adet Kalıcı Topluluk Üyesi",
        "Sunucu Seviyesini Yükseltir",
        "30 Gün Otomatik Telafi Koruması",
        "Şifresiz İşlem",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "discord-topluluk-emoji-tepki",
      name: "500 Discord Topluluk Üyesi (30 Gün Garantili)",
      slug: "discord-500-topluluk-uyesi",
      quantity: 500,
      price: 69.90,
      providerServiceId: 7344,
      features: JSON.stringify([
        "500 Adet Kalıcı Topluluk Üyesi",
        "Sunucu İstatistiklerini Güçlendirir",
        "Düşüşlere Karşı Telafili",
        "7/24 Hızlı Gönderim",
      ]),
      isPopular: false,
      sortOrder: 2,
    },
    {
      categorySlug: "discord-topluluk-emoji-tepki",
      name: "1.000 Discord Mesaj Tepki (Reaction) Desteği",
      slug: "discord-1000-mesaj-tepki",
      quantity: 1000,
      price: 59.90,
      providerServiceId: 9631,
      features: JSON.stringify([
        "Duyuru Mesajlarına 1.000 Emoji Tepkisi",
        "Topluluğun İlgisini Canlandırır",
        "İstediğiniz Emojiyi Belirleyin",
        "Anında Başlangıç",
      ]),
      isPopular: false,
      sortOrder: 3,
    },

    // YOUTUBE 4.000 SAAT
    {
      categorySlug: "youtube-4000-saat-para-kazanma",
      name: "1.000 Saat YouTube İzlenme Süresi Desteği",
      slug: "youtube-1000-saat-izlenme",
      quantity: 1000,
      price: 199.90,
      providerServiceId: 9662,
      features: JSON.stringify([
        "1.000 Saat İzlenme Süresi (Watchtime)",
        "YouTube Analytics Panelinde Doğrulanır",
        "Yüksek Tutma Oranlı İzleme",
        "Kanal Güvenliği %100 Korunur",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "youtube-4000-saat-para-kazanma",
      name: "4.000 Saat YouTube Para Kazanma Tamamlama Paketi",
      slug: "youtube-4000-saat-tamamlama-paketi",
      quantity: 4000,
      price: 649.90,
      providerServiceId: 9662,
      features: JSON.stringify([
        "4.000 Saat Tamamlama Desteği",
        "İş Ortağı Programı (YPP) Başvurusu İçin Uygun",
        "Düşmeyen Kalıcı Süre Garantisi",
        "Özel Danışmanlık ve Destek",
      ]),
      isPopular: true,
      sortOrder: 2,
    },

    // TIKTOK PK / CANLI YAYIN
    {
      categorySlug: "tiktok-canli-yayin-etkilesim-pk",
      name: "30 Dakikalık 50 TikTok Canlı İzleyici & PK Desteği",
      slug: "tiktok-30-dk-50-canli-izleyici-pk",
      quantity: 50,
      price: 49.90,
      providerServiceId: 9855,
      features: JSON.stringify([
        "30 Dakika Boyunca 50 Canlı İzleyici",
        "PK Karşılaşmalarında Güçlü Görünürlük",
        "Keşfet Algoritmasını Tetikler",
        "Anlık Başlama Garantisi",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "tiktok-canli-yayin-etkilesim-pk",
      name: "60 Dakikalık 100 TikTok Canlı İzleyici & PK Desteği",
      slug: "tiktok-60-dk-100-canli-izleyici-pk",
      quantity: 100,
      price: 89.90,
      providerServiceId: 9855,
      features: JSON.stringify([
        "1 Saat Boyunca 100 Stabil Canlı İzleyici",
        "PK Galibiyetleri ve Kutu Desteği",
        "Yayın Sıralamasında Tepeye Yerleşme",
        "Şifresiz ve Ban Korumalı",
      ]),
      isPopular: true,
      sortOrder: 2,
    },

    // SPOTIFY AYLIK DİNLENME
    {
      categorySlug: "spotify-aylik-dinleyici",
      name: "1.000 Spotify Aylık Dinleyici Desteği",
      slug: "spotify-1000-aylik-dinleyici",
      quantity: 1000,
      price: 39.90,
      providerServiceId: 9434,
      features: JSON.stringify([
        "1.000 Gerçek Aylık Dinleyici Metriği",
        "Sanatçı Profilinizi Prestijli Gösterir",
        "Spotify for Artists Paneline Yansır",
        "Telif ve Kural Uyumlu",
      ]),
      isPopular: true,
      sortOrder: 1,
    },
    {
      categorySlug: "spotify-aylik-dinleyici",
      name: "5.000 Spotify Aylık Dinleyici Desteği",
      slug: "spotify-5000-aylik-dinleyici",
      quantity: 5000,
      price: 139.90,
      providerServiceId: 9434,
      features: JSON.stringify([
        "5.000 Aylık Dinleyici Yükselişi",
        "Editoryal ve Algoritmik Listelere Uygun",
        "30 Gün Boyunca Profilde Sabit",
        "Müzik Şirketlerine Güvenli Sunum",
      ]),
      isPopular: false,
      sortOrder: 2,
    },

    // SPOTIFY ŞARKI DİNLENME
    {
      categorySlug: "spotify-sarki-dinlenme-kaydetme",
      name: "2.500 Spotify Şarkı Dinlenme Desteği (Algoritma Uyumlu)",
      slug: "spotify-2500-sarki-dinlenme",
      quantity: 2500,
      price: 29.90,
      providerServiceId: 2549,
      features: JSON.stringify([
        "2.500 Kaliteli Şarkı Dinlenmesi",
        "Algoritmik Keşif Motoru Desteği",
        "Ömür Boyu Kalıcı İstatistik",
        "Şarkı Linkiniz Yeterlidir",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "spotify-sarki-dinlenme-kaydetme",
      name: "10.000 Spotify Şarkı Dinlenme Desteği (Algoritma Uyumlu)",
      slug: "spotify-10000-sarki-dinlenme",
      quantity: 10000,
      price: 99.90,
      providerServiceId: 2549,
      features: JSON.stringify([
        "10.000 Şarkı Dinlenme Desteği",
        "Haftalık Keşif & Release Radar Uyumu",
        "Yüksek Dinleme Süresi (Retention)",
        "Telif Hakkı Korumalı",
      ]),
      isPopular: true,
      sortOrder: 2,
    },

    // TELEGRAM KANAL ÜYESİ
    {
      categorySlug: "telegram-kanal-uyesi",
      name: "500 Telegram Kanal / Grup Üyesi (Garantili)",
      slug: "telegram-500-kanal-uyesi",
      quantity: 500,
      price: 29.90,
      providerServiceId: 7507,
      features: JSON.stringify([
        "500 Adet Kalıcı Kanal Üyesi",
        "Kanalınıza Güvenilirlik Katar",
        "Düşüşlere Karşı Garantili",
        "Herkese Açık Kanal Linki Yeterlidir",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "telegram-kanal-uyesi",
      name: "1.000 Telegram Kanal / Grup Üyesi (Garantili)",
      slug: "telegram-1000-kanal-uyesi",
      quantity: 1000,
      price: 49.90,
      providerServiceId: 7507,
      features: JSON.stringify([
        "1.000 Kaliteli Topluluk Üyesi",
        "Hızlı ve Doğal Dağılım",
        "Kanal Arama Sıralamasını Yükseltir",
        "7/24 Anında Başlar",
      ]),
      isPopular: true,
      sortOrder: 2,
    },

    // TELEGRAM GÖRÜNTÜLENME & TEPKİ
    {
      categorySlug: "telegram-goruntulenme-tepki",
      name: "1.000 Telegram Gönderi Görüntülenme Desteği",
      slug: "telegram-1000-gonderi-goruntulenme",
      quantity: 1000,
      price: 19.90,
      providerServiceId: 9213,
      features: JSON.stringify([
        "1.000 Gönderi Görüntülenmesi",
        "Son Paylaşımlara Otomatik Dağılım",
        "Kanalın Okunma Oranını Katlar",
        "Hızlı ve Güvenli",
      ]),
      isPopular: false,
      sortOrder: 1,
    },
    {
      categorySlug: "telegram-goruntulenme-tepki",
      name: "5.000 Telegram Gönderi Görüntülenme & Pozitif Tepki",
      slug: "telegram-5000-gonderi-goruntulenme",
      quantity: 5000,
      price: 39.90,
      providerServiceId: 9213,
      features: JSON.stringify([
        "5.000 Görüntülenme + Pozitif Emojiler",
        "Gönderilere Organik İlgi Havası",
        "Yüksek Hızlı Teslimat",
        "Şifresiz İşlem",
      ]),
      isPopular: false,
      sortOrder: 2,
    },
  ];

  let addedPackages = 0;
  for (const p of packagesData) {
    const categoryId = catMap[p.categorySlug];
    if (!categoryId) {
      console.warn("Kategori bulunamadı:", p.categorySlug);
      continue;
    }

    const oldPrice = Number((p.price * 1.35).toFixed(2));

    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {
        categoryId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        oldPrice,
        providerServiceId: p.providerServiceId,
        features: p.features,
        isPopular: p.isPopular,
        sortOrder: p.sortOrder,
        isActive: true,
      },
      create: {
        categoryId,
        name: p.name,
        slug: p.slug,
        quantity: p.quantity,
        price: p.price,
        oldPrice,
        providerServiceId: p.providerServiceId,
        features: p.features,
        isPopular: p.isPopular,
        sortOrder: p.sortOrder,
        isActive: true,
      },
    });

    addedPackages++;
    console.log(`✓ Paket eklendi/güncellendi: ${p.name}`);
  }

  console.log(`\n==================================================================`);
  console.log(`🎉 TOPLAM ${addedPackages} YENİ PAKET VERİTABANINA KAYDEDİLDİ!`);
  console.log(`==================================================================`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
