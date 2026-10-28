import { prisma } from "../src/lib/prisma";

interface CategoryData {
  name: string;
  slug: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
}

const PLATFORM_CATEGORIES: Record<string, CategoryData[]> = {
  twitch: [
    {
      name: "Saatlik Canlı İzleyici",
      slug: "saatlik-canli-izleyici",
      shortDescription: "1 ile 5 saat arası kesintisiz ve stabil canlı izleyici desteği.",
      seoTitle: "Twitch Saatlik Canlı İzleyici Desteği",
      seoDescription: "Twitch canlı yayınlarınız için saatlik güvenli ve stabil izleyici desteği.",
      sortOrder: 1,
    },
    {
      name: "Haftalık Canlı İzleyici",
      slug: "haftalik-canli-izleyici",
      shortDescription: "7 gün boyunca her canlı yayınınızda otomatik ve stabil izleyici etkileşimi.",
      seoTitle: "Twitch Haftalık Canlı İzleyici Desteği",
      seoDescription: "7 gün boyunca tüm Twitch canlı yayınlarınızda kesintisiz izleyici desteği.",
      sortOrder: 2,
    },
    {
      name: "Aylık Stabil Canlı İzleyici",
      slug: "aylik-stabil-canli-izleyici",
      shortDescription: "30 gün boyunca her yayında aktif olan uzun soluklu izleyici desteği.",
      seoTitle: "Twitch Aylık Canlı İzleyici Desteği",
      seoDescription: "Twitch yayıncılığınızda 30 gün boyunca stabil görünürlük ve izleyici desteği.",
      sortOrder: 3,
    },
    {
      name: "Takipçi & Topluluk Desteği",
      slug: "takipci-topluluk-destegi",
      shortDescription: "Twitch kanalınızın prestijini artıran organik dağılımlı takipçi yükselişi.",
      seoTitle: "Twitch Takipçi Desteği",
      seoDescription: "Twitch kanalınızı güçlendirecek garantili ve güvenli takipçi desteği paketleri.",
      sortOrder: 4,
    },
    {
      name: "Canlı Yayın Sohbet & Etkileşim",
      slug: "canli-yayin-sohbet-destegi",
      shortDescription: "Yayın sırasında sohbet akışını hareketlendiren güvenli mesaj desteği.",
      seoTitle: "Twitch Canlı Sohbet ve Etkileşim Desteği",
      seoDescription: "Twitch canlı yayınlarınızda dinamik ve aktif sohbet akışı oluşturun.",
      sortOrder: 5,
    },
    {
      name: "Video & Klip İzlenme Desteği",
      slug: "video-klip-izlenme",
      shortDescription: "Twitch VOD ve klip izlenmelerinizi artırarak öne çıkın.",
      seoTitle: "Twitch Video ve Klip İzlenme",
      seoDescription: "Twitch kliplerinizi daha geniş kitlelere ulaştıracak izlenme çözümleri.",
      sortOrder: 6,
    },
  ],

  kick: [
    {
      name: "Saatlik Canlı İzleyici",
      slug: "saatlik-canli-izleyici",
      shortDescription: "Kick yayınlarınıza özel 1 saatten başlayan anlık ve kesintisiz izleyici desteği.",
      seoTitle: "Kick Saatlik Canlı İzleyici Desteği",
      seoDescription: "Kick canlı yayınlarınız için 1 saatlik esnek ve bütçe dostu izleyici paketleri.",
      sortOrder: 1,
    },
    {
      name: "24 Saatlik Canlı İzleyici",
      slug: "24-saatlik-canli-izleyici",
      shortDescription: "Günün 24 saati boyunca yayınlarınızda kalıcı ve güçlü etkileşim.",
      seoTitle: "Kick 24 Saatlik Canlı İzleyici Desteği",
      seoDescription: "24 saat boyunca kesintisiz canlı izleyici desteği ile Kick kanalınızı zirveye taşıyın.",
      sortOrder: 2,
    },
    {
      name: "Haftalık Canlı İzleyici",
      slug: "haftalik-canli-izleyici",
      shortDescription: "7 gün boyunca her canlı yayınınızda kesintisiz ve stabil izleyici etkileşimi.",
      seoTitle: "Kick Haftalık Canlı İzleyici Desteği",
      seoDescription: "Kick yayınlarınız için 7 gün geçerli stabil canlı izleyici desteği.",
      sortOrder: 3,
    },
    {
      name: "Aylık Stabil Canlı İzleyici",
      slug: "aylik-canli-izleyici",
      shortDescription: "30 gün boyunca her yayınınızda otomatik ve stabil izleyici desteği.",
      seoTitle: "Kick Aylık Canlı İzleyici Desteği",
      seoDescription: "Kick yayıncıları için aylık düzenli ve güvenli canlı izleyici yükselişi.",
      sortOrder: 4,
    },
    {
      name: "Takipçi & Kanal Güçlendirme",
      slug: "kick-takipci-topluluk",
      shortDescription: "Kick kanalınızın takipçi sayısını artırarak doğrulanmış yayıncı hedefinize ulaşın.",
      seoTitle: "Kick Takipçi Desteği",
      seoDescription: "Kick profilinizi büyütmek için garantili ve telafili takipçi desteği.",
      sortOrder: 5,
    },
    {
      name: "Klip & Video İzlenme Desteği",
      slug: "kick-klip-video-izlenme",
      shortDescription: "Kick klip ve video görüntülenmelerini yükselterek keşfete çıkın.",
      seoTitle: "Kick Klip İzlenme Desteği",
      seoDescription: "Kick kliplerinizin etkileşimini ve izlenme sayılarını hızla artırın.",
      sortOrder: 6,
    },
  ],

  youtube: [
    {
      name: "Abone & Topluluk Yükselişi",
      slug: "abone-topluluk-yukselisi",
      shortDescription: "YouTube kanalınızın büyümesine ivme kazandıran güvenli abone desteği.",
      seoTitle: "YouTube Abone Desteği - Kanal Güçlendirme",
      seoDescription: "YouTube kanalınız için doğal dağılımlı, kalıcı abone desteği.",
      sortOrder: 1,
    },
    {
      name: "Canlı Yayın İzleyici Desteği",
      slug: "youtube-canli-yayin-izleyici",
      shortDescription: "YouTube canlı yayınlarınızda izleyici sayısını ve sıralamasını yükseltin.",
      seoTitle: "YouTube Canlı Yayın İzleyici Desteği",
      seoDescription: "YouTube canlı yayınlarınız için anlık ve stabil izleyici desteği paketleri.",
      sortOrder: 2,
    },
    {
      name: "Video İzlenme & 4.000 Saat Desteği",
      slug: "youtube-video-izlenme-saat",
      shortDescription: "Para kazanma şartı olan 4.000 saat eşiğini aşmanız için yüksek kalıcılıklı izlenme.",
      seoTitle: "YouTube 4000 Saat ve Video İzlenme",
      seoDescription: "YouTube kanalınızın para kazanmasını açmak için güvenli izlenme süresi desteği.",
      sortOrder: 3,
    },
    {
      name: "Beğeni & Etkileşim Güçlendirme",
      slug: "youtube-begeni-etkilesim",
      shortDescription: "Videolarınıza kaliteli beğeni sağlayarak algoritma önerilerine girin.",
      seoTitle: "YouTube Beğeni Desteği",
      seoDescription: "YouTube videolarınız için hızlı ve doğal beğeni yükseliş çözümleri.",
      sortOrder: 4,
    },
    {
      name: "Shorts İzlenme & Keşfet Desteği",
      slug: "youtube-shorts-izlenme",
      shortDescription: "YouTube Shorts videolarınızın keşfete düşmesini hızlandıran viral izlenmeler.",
      seoTitle: "YouTube Shorts İzlenme Desteği",
      seoDescription: "Shorts videolarınızın görünürlüğünü katlayan etkileşim çözümleri.",
      sortOrder: 5,
    },
  ],

  tiktok: [
    {
      name: "Takipçi & Canlı Yayın Yetkisi",
      slug: "takipci-canli-yayin-yetkisi",
      shortDescription: "Canlı yayın açma şartını hızla karşılayarak kanalınızı aktif hale getirin.",
      seoTitle: "TikTok Takipçi Desteği - Hızlı Yükseliş",
      seoDescription: "TikTok hesabınızı büyütmek ve canlı yayın özelliğini açmak için kaliteli takipçi desteği.",
      sortOrder: 1,
    },
    {
      name: "Canlı Yayın İzleyici & Etkileşim",
      slug: "tiktok-canli-yayin-izleyici",
      shortDescription: "TikTok canlı yayınlarınızda izleyici ve hediye/beğeni etkileşimini yükseltin.",
      seoTitle: "TikTok Canlı Yayın İzleyici Desteği",
      seoDescription: "TikTok canlı yayınlarınız için stabil ve canlı izleyici desteği.",
      sortOrder: 2,
    },
    {
      name: "Video İzlenme & Keşfet Desteği",
      slug: "tiktok-video-izlenme-kesfet",
      shortDescription: "Videolarınızın Keşfet akışına girmesini sağlayan yüksek izlenme desteği.",
      seoTitle: "TikTok Keşfet ve Video İzlenme",
      seoDescription: "TikTok videolarınızın viral hale gelmesini destekleyen güvenli izlenmeler.",
      sortOrder: 3,
    },
    {
      name: "Beğeni & Paylaşım Güçlendirme",
      slug: "tiktok-begeni-paylasim",
      shortDescription: "Videolarınıza gerçekçi beğeni ve paylaşım ekleyerek etkileşim oranınızı katlayın.",
      seoTitle: "TikTok Beğeni Desteği",
      seoDescription: "TikTok videolarınız için güvenli, şifresiz ve anlık beğeni çözümleri.",
      sortOrder: 4,
    },
  ],

  instagram: [
    {
      name: "Takipçi & Prestij Güçlendirme",
      slug: "takipci-prestij-guclendirme",
      shortDescription: "Profilinizi daha çekici ve güven verici kılan estetik takipçi desteği.",
      seoTitle: "Instagram Takipçi Desteği - Prestij Yükselişi",
      seoDescription: "Instagram profilinizi güçlendirecek şifresiz ve güvenli takipçi desteği paketleri.",
      sortOrder: 1,
    },
    {
      name: "Beğeni & Keşfet Etkileşimi",
      slug: "instagram-begeni-kesfet",
      shortDescription: "Gönderilerinizin Keşfet sayfalarında öne çıkmasını destekleyen kaliteli beğeniler.",
      seoTitle: "Instagram Beğeni ve Keşfet Desteği",
      seoDescription: "Fotoğraf ve albüm gönderileriniz için hızlı, şifresiz beğeni paketleri.",
      sortOrder: 2,
    },
    {
      name: "Reels İzlenme & Viral Yükseliş",
      slug: "instagram-reels-izlenme",
      shortDescription: "Reels videolarınızın milyonlarca kullanıcıya ulaşmasını sağlayan izlenme desteği.",
      seoTitle: "Instagram Reels İzlenme Desteği",
      seoDescription: "Instagram Reels videolarınızı zirveye taşıyacak güvenli izlenme çözümleri.",
      sortOrder: 3,
    },
    {
      name: "Canlı Yayın İzleyici Desteği",
      slug: "instagram-canli-yayin-izleyici",
      shortDescription: "Instagram canlı yayınlarınızda prestij ve güven sağlayan izleyici desteği.",
      seoTitle: "Instagram Canlı Yayın İzleyici",
      seoDescription: "Canlı yayınlarınıza anlık dahil olan stabil izleyici desteği.",
      sortOrder: 4,
    },
    {
      name: "Hikaye (Story) İzlenme & Etkileşim",
      slug: "instagram-hikaye-izlenme",
      shortDescription: "24 saatlik hikayelerinizin izlenme sayısını ve profil ziyaretlerini artırın.",
      seoTitle: "Instagram Hikaye (Story) İzlenme",
      seoDescription: "Hikaye paylaşımlarınız için anında başlayan organik izlenme desteği.",
      sortOrder: 5,
    },
  ],

  "twitter-x": [
    {
      name: "Etkileşim & Takipçi Desteği",
      slug: "etkilesim-takipci-destegi",
      shortDescription: "X platformunda paylaşımlarınızın görünürlüğünü ve etkileşimini artıran çözümler.",
      seoTitle: "Twitter / X Takipçi ve Etkileşim Desteği",
      seoDescription: "Twitter / X hesabınız için güvenli takipçi ve etkileşim desteği.",
      sortOrder: 1,
    },
    {
      name: "Beğeni (Like) & Retweet Desteği",
      slug: "x-begeni-retweet-destegi",
      shortDescription: "Tweetlerinizin beğeni ve yeniden gönderi (RT) sayılarını güvenle yükseltin.",
      seoTitle: "Twitter / X Beğeni ve Retweet Desteği",
      seoDescription: "Tweetlerinizin etkileşimini zirveye taşıyacak güvenli RT ve beğeni paketleri.",
      sortOrder: 2,
    },
    {
      name: "Tweet Görüntülenme (İzlenme)",
      slug: "x-tweet-goruntulenme",
      shortDescription: "Tweetlerinizin altındaki görüntülenme (analytics) metriklerini katlayın.",
      seoTitle: "Twitter / X Görüntülenme Desteği",
      seoDescription: "X paylaşımlarınızın analitik izlenme sayılarını artıran güvenli çözümler.",
      sortOrder: 3,
    },
    {
      name: "Premium Onaylı Etkileşim",
      slug: "x-premium-etkilesim",
      shortDescription: "Mavi tikli ve onaylı hesaplardan gelen prestijli yanıt ve etkileşim desteği.",
      seoTitle: "Twitter / X Onaylı Hesap Etkileşim Desteği",
      seoDescription: "X platformunda marka değerinizi artıran mavi tikli etkileşimler.",
      sortOrder: 4,
    },
  ],
};

async function main() {
  console.log("Enriching categories for all platforms in Supabase PostgreSQL...");

  for (const [platformSlug, categories] of Object.entries(PLATFORM_CATEGORIES)) {
    const platform = await prisma.platform.findUnique({
      where: { slug: platformSlug },
    });

    if (!platform) {
      console.warn(`Platform not found: ${platformSlug}`);
      continue;
    }

    console.log(`\nPlatform: ${platform.name} (${platform.slug})`);

    for (const cat of categories) {
      const existing = await prisma.category.findFirst({
        where: {
          platformId: platform.id,
          OR: [{ slug: cat.slug }, { name: cat.name }],
        },
      });

      if (existing) {
        console.log(`  - Exists: "${existing.name}" (ID: ${existing.id})`);
      } else {
        const created = await prisma.category.create({
          data: {
            platformId: platform.id,
            name: cat.name,
            slug: cat.slug,
            shortDescription: cat.shortDescription,
            seoTitle: cat.seoTitle,
            seoDescription: cat.seoDescription,
            sortOrder: cat.sortOrder,
            isActive: true,
          },
        });
        console.log(`  + Created: "${created.name}" (ID: ${created.id})`);
      }
    }
  }

  console.log("\nAll categories enriched successfully!");
}

main()
  .catch((e) => {
    console.error("Error enriching categories:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
