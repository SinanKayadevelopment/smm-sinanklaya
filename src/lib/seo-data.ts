/**
 * Teknik SEO ve Anahtar Kelime Optimizasyon Veritabanı
 * Google Arama Motoru Optimizasyonu (SEO), Zengin Metinler ve FAQ Schema.org
 */

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoArticleSection {
  title: string;
  content: string[];
}

export interface SeoPageData {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonical: string;
  h1: string;
  h2: string;
  badgeText: string;
  articleIntro: string;
  sections: SeoArticleSection[];
  faqs: SeoFaqItem[];
  ratingValue: string;
  reviewCount: number;
}

const BASE_URL = "https://www.yayincikral.com";

// Platform ve Kategoriye Özel Zengin SEO Verileri
const SEO_DICTIONARY: Record<string, Partial<SeoPageData>> = {
  // 1. KICK ANA PLATFORM SAYFASI
  kick: {
    title: "Kick Canlı Yayın İzleyici Satın Al & Kick İzleyici Botu | Yayıncı Kral",
    metaDescription:
      "Kick canlı yayın izleyici satın al ve Kick izleyici botu hizmetlerimizle kanalınızı büyütün. Saatlik, haftalık ve aylık stabil izleyici desteği %100 şifresiz!",
    keywords: [
      "kick izleyici botu",
      "kick canlı izleyici satın al",
      "kick izleyici satın al",
      "kick botu",
      "kick canlı yayın botu",
      "kick takipçi satın al",
      "kick saatlik izleyici",
      "kick aylık izleyici",
      "kick yayıncı paneli",
    ],
    h1: "Kick Canlı Yayın İzleyici Satın Al & Kick İzleyici Botu",
    h2: "Kick Canlı Yayınlarınızı Zirveye Taşıyacak Güçlü ve Stabil İzleyici Altyapısı",
    badgeText: "Kick Yayıncı Çözümleri",
    articleIntro:
      "Kick platformunda yayın yapmak, yeni nesil yayıncılar için en büyük büyüme ve gelir fırsatlarından biridir. Ancak yüzlerce yayıncı arasından sıyrılıp ana sayfada veya kategori listelerinin en başında yer almak zorlu olabilir. Yayıncı Kral, Kick canlı yayın izleyici satın al ve Kick izleyici botu hizmetleriyle kanalınızın keşfete çıkmasını, organik izleyiciler çekmesini ve yayıncı gelir programına (KCIP) çok daha hızlı kabul edilmesini sağlar.",
    sections: [
      {
        title: "Kick Canlı İzleyici Satın Almanın Kanalınıza Sağladığı Avantajlar",
        content: [
          "Kick algoritması, canlı yayınları sıralarken anlık izleyici sayısı ve izleyici tutma süresine doğrudan öncelik verir. Sıralamada ilk 5 kanal arasında yer aldığınızda, organik kullanıcıların kanalınıza tıklama olasılığı %80'in üzerine çıkar.",
          "Yayıncı Kral'ın sunduğu Kick izleyici desteği, yayın başlangıcından itibaren kademeli ve doğal bir şekilde akışa dahil olur. Bu sayede platform algoritmaları tarafından şüpheli görülmez ve kanalınız güvenle önerilen yayınlar arasına yükselir.",
          "İster tek seferlik saatlik yayın maratonu düzenleyin, ister 1 ay boyunca tüm yayınlarınızda kesintisiz aktif kalacak aylık paket tercih edin; kanalınıza en uygun stabil çözümü anında başlatabilirsiniz.",
        ],
      },
      {
        title: "Kick İzleyici Botu Güvenli midir? Ban Riski Var mıdır?",
        content: [
          "Yayıncı Kral olarak sunduğumuz hiçbir hizmette sizden şifre, hesap girişi veya yetkilendirme talep edilmez. Yalnızca hedef kanal bağlantınız (kick.com/kullaniciadi) üzerinden işlem sağlanır.",
          "Sistemimiz gerçek kullanıcı davranışlarını simüle eden yüksek kaliteli proxy ağları ve izleyici profilleri kullanır. Bu sayede Kick kurallarına zarar vermez, kanalınıza herhangi bir ban veya kısıtlama cezası uygulanmaz.",
          "7/24 kesintisiz teknik destek ve anlık bildirim altyapımızla siparişinizin her anını takip edebilir, canlı destek hattımızdan destek alabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kick canlı izleyici botu satın aldığımda izleyiciler ne zaman gelir?",
        answer:
          "Ödemeniz onaylandığı anda sistemimiz otomatik olarak tetiklenir ve izleyiciler genellikle 1-5 dakika içerisinde kanalınıza stabil şekilde aktarılmaya başlar.",
      },
      {
        question: "Kick izleyici botu satın almak kanalıma zarar verir mi veya ban riski var mı?",
        answer:
          "Kesinlikle hayır. Hizmetlerimizde şifre istenmez, yalnızca kanal linkiniz kullanılır. Gelişmiş korumalı ve doğal akışlı teslimat protokollerimiz sayesinde ban veya ceza riski bulunmamaktadır.",
      },
      {
        question: "Kick aylık izleyici paketi nasıl çalışır?",
        answer:
          "Aylık izleyici paketlerinde 30 gün boyunca açtığınız her canlı yayında sistem yayın açtığınızı otomatik algılar ve taahhüt edilen miktarda izleyiciyi yayınınız boyunca sabit tutar.",
      },
      {
        question: "Kick izleyici satın alırken şifre vermem gerekir mi?",
        answer:
          "Hayır! Yayıncı Kral hiçbir hizmetinde sizden Kick hesap şifrenizi istemez. Siparişiniz sadece herkese açık olan yayın linkinize gönderilir.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 382,
  },

  // 2. KICK SAATLİK CANLI İZLEYİCİ
  "kick-saatlik-canli-izleyici": {
    title: "Kick Saatlik Canlı İzleyici Satın Al & İzleyici Botu | Yayıncı Kral",
    metaDescription:
      "Kick saatlik canlı izleyici satın al, yayının boyunca stabil ve düşmeyen izleyici botu desteği al. En ucuz fiyatlar ve anında teslimat avantajıyla hemen tıkla!",
    keywords: [
      "kick saatlik canlı izleyici satın al",
      "kick saatlik izleyici",
      "kick izleyici botu saatlik",
      "kick ucuz izleyici satın al",
      "kick anlık izleyici",
      "kick canlı yayın izleyicisi",
    ],
    h1: "Kick Saatlik Canlı İzleyici Satın Al & Hızlı İzleyici Desteği",
    h2: "Yayınınız Süresince Sabit Kalan, Düşmeyen ve Anında Başlayan İzleyici Paketleri",
    badgeText: "Saatlik Canlı Destek",
    articleIntro:
      "Belirli bir yayın maratonu veya özel turnuva yayınınız için hızlı, ekonomik ve esnek bir çözüm mü arıyorsunuz? Kick saatlik canlı izleyici satın alma paketlerimiz, belirlediğiniz süre (1 saat, 2 saat, 3 saat veya daha uzun) boyunca kanalınızı istediğiniz izleyici sayısında tutarak anında keşfete çıkmanızı sağlar.",
    sections: [
      {
        title: "Kick Saatlik Canlı İzleyici Hizmeti Nasıl Çalışır?",
        content: [
          "Sipariş esnasında kanal linkinizi ve yayınınızın süresini belirlemeniz yeterlidir. Ödeme tamamlandıktan sonra sistem yayın durumunuzu kontrol eder ve dakikalar içinde izleyicileri yayına gönderir.",
          "Yayın esnasında ani düşüşler yaşanmaz. Sistem akıllı dengeleme yaparak satın aldığınız saat dilimi boyunca sabit ve stabil izleyici sayısını korur.",
          "Saatlik paketler özellikle yeni izleyicilerin dikkatini çekmek, sohbeti hareketlendirmek ve rakiplerinizin önüne geçmek için en popüler bütçe dostu tercihtir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kick saatlik izleyiciler yayın ortasında düşer mi?",
        answer:
          "Hayır. Sistemimiz yayın süreniz boyunca stabilite garantisi verir. Paket süresi bitene kadar izleyiciler sabit kalır.",
      },
      {
        question: "Yayınım paketteki süreden önce biterse ne olur?",
        answer:
          "Yayını erkenden kapatırsanız paket o yayına özel kullanılmış sayılır. Bu nedenle paketi yayınınızın planlanan süresine göre seçmenizi öneririz.",
      },
      {
        question: "Sipariş verdikten kaç dakika sonra izleyiciler görünür?",
        answer:
          "Sistemimiz otomatik API entegrasyonuna sahiptir; ödeme onayından 1-3 dakika sonra izleyiciler yayınınızda görünmeye başlar.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 264,
  },

  // 3. KICK AYLIK CANLI İZLEYİCİ
  "kick-aylik-canli-izleyici": {
    title: "Kick Aylık Canlı İzleyici Satın Al & 30 Günlük İzleyici Botu | Yayıncı Kral",
    metaDescription:
      "Kick aylık canlı izleyici satın al! 30 gün boyunca açtığın her yayında otomatik başlayan stabil izleyici botu ile Kick ortaklık ve partnerlik şartlarını yakala.",
    keywords: [
      "kick aylık canlı izleyici",
      "kick aylık izleyici botu",
      "kick 30 günlük izleyici",
      "kick ortaklık izleyici şartı",
      "kick sınırsız izleyici botu",
      "kick otomatik yayın izleyici",
    ],
    h1: "Kick Aylık Canlı İzleyici Satın Al (30 Gün Otomatik)",
    h2: "Her Yayında Otomatik Devreye Giren VIP 30 Günlük Stabil Canlı İzleyici Sistemi",
    badgeText: "Aylık VIP Paket",
    articleIntro:
      "Düzenli olarak haftanın belirli günlerinde veya her gün canlı yayın açan bir Kick yayıncısıysanız, her yayında ayrı paket satın almak yerine Kick aylık canlı izleyici hizmetimizi tercih edin. 30 gün boyunca her yayın açtığınızda botlar yayınınızı otomatik tespit eder ve belirlediğiniz izleyici kitlesini yayınınız boyunca sabit tutar.",
    sections: [
      {
        title: "Kick Partnerlik ve Gelir Ortaklığı İçin Aylık İzleyicinin Gücü",
        content: [
          "Kick Creator Incentive Program (KCIP) ve yayıncı rozetleri belirli bir ortalama izleyici sayısı ve toplam izlenme süresi şartı koşar. Aylık paketlerimiz, 30 günlük ortalamanızı yüksek tutarak bu hedeflere hızla ulaşmanızı sağlar.",
          "Tek tek sipariş vermenize gerek kalmaz; yayın açtığınız anda akıllı takip botumuz canlı yayında olduğunuzu algılar ve 3-5 dakika içinde izleyicileri yayına gönderir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Günde birden fazla yayın açarsam aylık paket çalışır mı?",
        answer:
          "Evet! 30 gün boyunca günde kaç kez yayın açarsanız açın, sistem yayınınızı otomatik algılayarak izleyicileri aktif eder.",
      },
      {
        question: "Aylık izleyici paketi Kick partnerlik şartları için geçerli midir?",
        answer:
          "Evet, sistemimizin sağladığı izleyiciler Kick istatistiklerine yansıyarak ortalama izleyici sayınızı ve yayın saati metriklerinizi yükseltir.",
      },
    ],
    ratingValue: "5.0",
    reviewCount: 195,
  },

  // 4. KICK TAKİPÇİ
  "kick-takipci-topluluk": {
    title: "Kick Takipçi Satın Al & Kanal Güçlendirme Paketleri | Yayıncı Kral",
    metaDescription:
      "Kick takipçi satın al, kanalının takipçi sayısını anında artır. %100 güvenli, şifresiz ve garantili Kick takipçi paketleriyle yayıncı profilini güçlendir.",
    keywords: [
      "kick takipçi satın al",
      "kick takipçi botu",
      "kick takipçi hilesi",
      "kick takipçi arttırma",
      "kick ucuz takipçi",
      "kick onaylı kanal takipçi",
    ],
    h1: "Kick Takipçi Satın Al & Hızlı Topluluk Büyütme",
    h2: "Profilinize Güven ve Prestij Katacak Kaliteli Kick Takipçi Paketleri",
    badgeText: "Garantili Takipçi",
    articleIntro:
      "Canlı yayınlarınızın yanı sıra kanal profilinizin takipçi sayısı da ilk kez gelen ziyaretçilerin kalıcı olmasında büyük rol oynar. Kick takipçi satın alarak profilinize kurumsal ve popüler bir görünüm kazandırabilir, takipçi hedeflerinizi kısa sürede tamamlayabilirsiniz.",
    sections: [
      {
        title: "Kick Takipçi Satın Almanın Faydaları Nelerdir?",
        content: [
          "Yüksek takipçili kanallar, yeni izleyiciler üzerinde güçlü bir sosyal kanıt (social proof) oluşturur. İnsanlar kalabalık topluluklara daha kolay katılır.",
          "Gönderilen takipçiler garantilidir ve düşüşlere karşı telafi koruması mevcuttur. Şifresiz ve tamamen güvenli şekilde teslim edilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kick takipçi siparişi ne kadar sürede tamamlanır?",
        answer:
          "Sipariş miktarınıza bağlı olarak doğal görünüm korunacak şekilde genellikle 1-6 saat içerisinde tamamlanır.",
      },
      {
        question: "Takipçiler zamanla silinir mi?",
        answer:
          "Yayıncı Kral takipçi paketleri yüksek kalitelidir ve düşüş yaşanmaması için özel optimize edilmiştir. Olası düşüşlerde telafi desteğimiz bulunmaktadır.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 178,
  },

  // 5. TWITCH ANA PLATFORM SAYFASI
  twitch: {
    title: "Twitch Canlı İzleyici Satın Al & Twitch İzleyici Botu | Yayıncı Kral",
    metaDescription:
      "Twitch canlı izleyici satın al ve Twitch izleyici botu ile yayınlarını üst sıralara taşı! Stabil, kesintisiz, anında teslimat ve %100 şifresiz Twitch izleyici paketleri.",
    keywords: [
      "twitch izleyici botu",
      "twitch canlı izleyici satın al",
      "twitch izleyici satın al",
      "twitch botu",
      "twitch stabil canlı izleyici",
      "twitch takipçi satın al",
      "twitch saatlik izleyici",
      "twitch iştirak izleyici botu",
      "twitch keşfet desteği",
    ],
    h1: "Twitch Canlı İzleyici Satın Al & Twitch İzleyici Botu",
    h2: "Twitch Sıralamasında Zirveye Çıkaran Stabil, Dalgalanmayan Canlı İzleyici Desteği",
    badgeText: "Twitch Yayıncı Çözümleri",
    articleIntro:
      "Dünyanın en popüler canlı yayın platformu olan Twitch'te keşfedilmek, sıfırdan başlayan yayıncılar için algoritma nedeniyle oldukça zordur. İzleyicisi olmayan bir kanal kategori listelerinde en alt sayfalarda kalır. Yayıncı Kral, Twitch canlı izleyici satın al ve Twitch izleyici botu çözümleriyle yayınlarınızı kategorinin en üst sıralarına taşıyarak organik izleyici kitlesi edinmenizi kolaylaştırır.",
    sections: [
      {
        title: "Twitch İzleyici Botu ile İştirak ve Partnerlik Sürecini Hızlandırın",
        content: [
          "Twitch İştirak (Affiliate) statüsüne hak kazanmak için en az 3 ortalama eşzamanlı izleyiciye, Partnerlik statüsü için ise en az 75 ortalama izleyiciye ihtiyaç duyulur. Stabil Twitch izleyici paketlerimizle bu ortalamaları kolayca yakalayabilirsiniz.",
          "Yayıncı Kral'ın sunduğu izleyiciler yayınınız boyunca sabit kalır; ani düşmeler veya dalgalanmalar yaşanmaz. Bu da kanalınızın grafiklerini dengeli ve organik gösterir.",
          "Yalnızca kullanıcı adı / kanal linkiniz yeterlidir. Hiçbir şifre istemeyen güvenli altyapımızla 7/24 dilediğiniz zaman sipariş oluşturabilirsiniz.",
        ],
      },
      {
        title: "Neden Yayıncı Kral Twitch Hizmetlerini Seçmelisiniz?",
        content: [
          "Gelişmiş proxy rotasyon altyapımız sayesinde Twitch algoritmalarının spam filtrelerine takılmayan yüksek kaliteli izleme oturumları sağlanır.",
          "Anında başlangıç özelliği sayesinde yayınınızı açtıktan sonra beklemenize gerek kalmaz; ödemeniz tamamlanır tamamlanmaz izleyiciler kanalınıza giriş yapar.",
          "Saatlik, 24 saatlik maraton ve garantili takipçi seçenekleriyle kanalınızın tüm ihtiyaçlarını tek bir güvenilir panelden karşılayabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Twitch izleyici botu satın almak kanalımın kapanmasına yol açar mı?",
        answer:
          "Hayır. Yayıncı Kral kesinlikle şifre istemez ve zararlı yöntemler kullanmaz. Doğal izleyici protokolleri kullanıldığı için kanalınız güvenle korunur.",
      },
      {
        question: "Twitch canlı izleyici siparişi kaç dakikada başlar?",
        answer:
          "Siparişiniz onaylandığı andan itibaren 1 ila 5 dakika içerisinde izleyiciler yayınınıza aktarılmaya başlar.",
      },
      {
        question: "Twitch İştirak şartlarını sağlamak için uygun mudur?",
        answer:
          "Evet, paketlerimiz Twitch kontrol paneline (Dashboard) doğrudan yansır ve ortalama eşzamanlı izleyici metriğinizi yükseltir.",
      },
      {
        question: "Twitch takipçi satın alırken nelere dikkat edilmelidir?",
        answer:
          "Takipçilerin düşüş garantili olması ve şifre talep edilmemesi en önemli kriterdir. Yayıncı Kral'da tüm takipçi paketleri telafi korumalı ve şifresizdir.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 412,
  },

  // 6. TWITCH SAATLİK CANLI İZLEYİCİ
  "twitch-saatlik-canli-izleyici": {
    title: "Twitch Saatlik Canlı İzleyici Satın Al & İzleyici Botu | Yayıncı Kral",
    metaDescription:
      "Twitch saatlik canlı izleyici satın al, yayının süresince stabil izleyici desteği ile keşfette üst sıralara yerleş! Anında teslimat ve uygun fiyat garantisi.",
    keywords: [
      "twitch saatlik canlı izleyici",
      "twitch saatlik izleyici botu",
      "twitch anlık izleyici satın al",
      "twitch izleyici botu ucuz",
      "twitch canlı yayın izleyicisi",
    ],
    h1: "Twitch Saatlik Canlı İzleyici Satın Al & Stabil İzleyici Botu",
    h2: "Yayın Süreniz Boyunca Düşmeyen ve Kanalınızı Zirveye Taşıyan Canlı İzleyici Desteği",
    badgeText: "Saatlik Canlı Destek",
    articleIntro:
      "Twitch üzerinde oyun veya sohbet yayını yaparken kategorinizde ilk sıralarda görünmek istiyorsanız, Twitch saatlik canlı izleyici paketleri en etkili yöntemdir. İstediğiniz izleyici sayısını ve süresini belirleyin, yayınınız anında canlansın.",
    sections: [
      {
        title: "Twitch Saatlik Paketlerin Avantajları",
        content: [
          "Bütçenize göre 1 saatten başlayarak dilediğiniz süre kadar izleyici alabilirsiniz.",
          "Sabit izleyici akışı sayesinde yayınınızın önerilme oranı artar, kategoriye göz atan gerçek kullanıcılar kanalınıza yönelir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Twitch saatlik izleyiciler yayın esnasında düşer mi?",
        answer:
          "Hayır, satın aldığınız süre boyunca izleyici sayısı stabil olarak korunur.",
      },
      {
        question: "Ödeme sonrası ne zaman başlar?",
        answer:
          "Ödeme tamamlandığı anda sistem otomatik olarak gönderimi 1-3 dakika içinde başlatır.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 298,
  },

  // 7. TWITCH 24 SAATLİK CANLI İZLEYİCİ
  "twitch-24-saatlik-canli-izleyici": {
    title: "Twitch 24 Saatlik Canlı İzleyici Botu Satın Al | Yayıncı Kral",
    metaDescription:
      "Twitch 24 saatlik canlı izleyici satın al! Gün boyu ve maraton yayınlarında kesintisiz, stabil izleyici desteği ile izleyici ortalamanı tavan yaptır.",
    keywords: [
      "twitch 24 saatlik canlı izleyici",
      "twitch maraton yayın izleyici",
      "twitch 24 saat izleyici botu",
      "twitch günlük izleyici",
      "twitch kesintisiz canlı izleyici",
    ],
    h1: "Twitch 24 Saatlik Canlı İzleyici Satın Al (Maraton Paketi)",
    h2: "24 Saat Boyunca Kesintisiz Devam Eden Özel Maraton Canlı İzleyici Desteği",
    badgeText: "24 Saat Kesintisiz",
    articleIntro:
      "Uzun soluklu yayın maratonları, özel etkinlikler veya 24 saatlik yayınlar düzenleyen yayıncılar için özel olarak hazırlanan 24 saatlik canlı izleyici paketimiz, gün boyunca sabit izleyici kitlesi sunarak kanalınızı sürekli zirvede tutar.",
    sections: [
      {
        title: "24 Saatlik Maraton Yayınlarında Neden Stabil İzleyici Gerekir?",
        content: [
          "Uzun yayınlarda izleyici sayıları günün saatine göre dalgalanabilir. 24 saatlik paketimiz bu düşüşleri engelleyerek gece veya gündüz fark etmeksizin kanalınızın istatistiklerini yüksek seviyede tutar.",
        ],
      },
    ],
    faqs: [
      {
        question: "24 saat dolmadan yayını kapatırsam ne olur?",
        answer:
          "Sipariş 24 saatlik tek bir kesintisiz yayın seansı içindir. Yayınınız açık kaldığı sürece izleyiciler yayında kalacaktır.",
      },
    ],
    ratingValue: "5.0",
    reviewCount: 142,
  },

  // 8. TWITCH TAKİPÇİ TOPLULUK
  "twitch-takipci-topluluk-destegi": {
    title: "Twitch Takipçi Satın Al & Topluluk Desteği | Yayıncı Kral",
    metaDescription:
      "Twitch takipçi satın al, kanalına güven ve prestij kazandır. %100 garantili, telafili ve şifresiz Twitch takipçi paketleriyle hemen profilini yükselt.",
    keywords: [
      "twitch takipçi satın al",
      "twitch takipçi botu",
      "twitch takipçi arttırma",
      "twitch ucuz takipçi",
      "twitch garantili takipçi",
      "twitch iştirak takipçi sayısı",
    ],
    h1: "Twitch Takipçi Satın Al & Kaliteli Topluluk Desteği",
    h2: "İştirak Şartlarını Hızla Tamamlayan Güvenilir ve Telafili Twitch Takipçi Paketleri",
    badgeText: "Garantili Takipçi",
    articleIntro:
      "Twitch'te İştirak için gereken 50 takipçi şartını veya kanalınızın popülerliğini artıracak binlerce takipçiyi Yayıncı Kral'ın garantili takipçi paketleriyle dakikalar içinde tamamlayabilirsiniz.",
    sections: [
      {
        title: "Twitch Takipçi Paketlerinin Avantajları",
        content: [
          "Kanalınıza gelen takipçiler profil resimli ve doğal görünümlü hesaplardır.",
          "Hiçbir şekilde hesap şifresi istenmez, sadece Twitch kanal linkiniz yeterlidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Twitch takipçileri ne kadar sürede gelir?",
        answer:
          "Sipariş onayından hemen sonra doğal bir akışla gönderim başlar ve miktara göre birkaç saatte tamamlanır.",
      },
      {
        question: "Düşüş yaşanırsa telafi ediliyor mu?",
        answer:
          "Evet, paketlerimiz 90 gün boyunca düşüşlere karşı telafi garantilidir.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 310,
  },

  // 9. YOUTUBE ANA PLATFORM
  youtube: {
    title: "YouTube Abone & İzlenme Satın Al | 4.000 Saat Desteği | Yayıncı Kral",
    metaDescription:
      "YouTube abone satın al, video izlenme ve 4.000 saat para kazanma desteğiyle kanalını büyüt. %100 organik, şifresiz ve garantili YouTube hizmetleri.",
    keywords: [
      "youtube abone satın al",
      "youtube izlenme satın al",
      "youtube 4000 saat satın al",
      "youtube abone botu",
      "youtube para kazanma şartı",
      "youtube izlenme arttırma",
    ],
    h1: "YouTube Abone ve İzlenme Satın Al & 4.000 Saat Desteği",
    h2: "YouTube Para Kazanma Şartlarını Karşılayan Garantili ve Güvenli Hizmetler",
    badgeText: "YouTube Çözümleri",
    articleIntro:
      "YouTube kanalınızın para kazanmasını açmak için gereken 1.000 abone ve 4.000 saat izlenme süresini Yayıncı Kral ile kolayca tamamlayın.",
    sections: [
      {
        title: "YouTube Kanal Büyümesinde Güvenli Çözümler",
        content: [
          "Tamamen algoritma uyumlu izleme süreleri ve yüksek tutma oranlı izlenmeler ile videolarınız önerilenlere çıkar.",
          "Şifresiz ve güvenli altyapı sayesinde kanalınız riske girmeden büyür.",
        ],
      },
    ],
    faqs: [
      {
        question: "YouTube 4.000 saat izlenme para kazanma için geçerli mi?",
        answer:
          "Evet, sunduğumuz izlenme süreleri YouTube Analytics paneline yansır ve para kazanma başvurusunda geçerlidir.",
      },
    ],
    ratingValue: "4.8",
    reviewCount: 220,
  },

  // 10. TIKTOK ANA PLATFORM
  tiktok: {
    title: "TikTok Takipçi & Canlı Yayın Yetkisi & İzlenme Satın Al | Yayıncı Kral",
    metaDescription:
      "TikTok takipçi satın al ve 1.000 takipçi ile anında canlı yayın açma yetkisi kazan! Keşfet etkili video izlenme ve beğeni paketleriyle TikTok'ta viral ol.",
    keywords: [
      "tiktok takipçi satın al",
      "tiktok canlı yayın yetkisi 1000 takipçi",
      "tiktok izlenme satın al",
      "tiktok takipçi botu",
      "tiktok keşfet hilesi",
    ],
    h1: "TikTok Takipçi Satın Al & Canlı Yayın Yetkisi Açma",
    h2: "1.000 Takipçiyle Canlı Yayın Yetkinizi Açın, Videolarınızı Keşfete Taşıyın",
    badgeText: "TikTok Çözümleri",
    articleIntro:
      "TikTok'ta canlı yayın açabilmek için gereken 1.000 takipçi şartını ve videolarınızın milyonlarca kişiye ulaşmasını sağlayacak keşfet izlenme paketlerini hemen deneyin.",
    sections: [
      {
        title: "TikTok Canlı Yayın Yetkisi Nasıl Açılır?",
        content: [
          "TikTok algoritması 1.000 takipçiye ulaşan tüm hesaplara otomatik olarak canlı yayın özelliği sunar. Yayıncı Kral'ın hızlı takipçi paketleriyle aynı gün canlı yayın açabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "1.000 takipçi aldıktan sonra hemen canlı yayın açabilir miyim?",
        answer:
          "Evet, takipçileriniz hesabınıza tanımlandıktan kısa süre sonra TikTok canlı yayın butonunu aktif hale getirir.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 350,
  },

  // 11. INSTAGRAM ANA PLATFORM
  instagram: {
    title: "Instagram Takipçi Satın Al & Gerçek Türk Takipçi | Yayıncı Kral",
    metaDescription:
      "Instagram takipçi satın al, güvenilir ve garantili Türk takipçi paketleriyle profilini büyüt. Şifresiz, anında teslimat ve 3D secure ödeme güvencesi.",
    keywords: [
      "instagram takipçi satın al",
      "instagram türk takipçi",
      "instagram takipçi botu",
      "instagram beğeni satın al",
      "instagram profil büyütme",
    ],
    h1: "Instagram Takipçi Satın Al & Türk Gerçek Takipçi Desteği",
    h2: "Profilinize Popülerlik ve Müşteri Güveni Kazandıracak Kaliteli Takipçi Paketleri",
    badgeText: "Instagram Çözümleri",
    articleIntro:
      "Instagram hesabınızın takipçi sayısını artırarak güvenilir bir profil oluşturun. Şifresiz işlem garantisiyle takipçileriniz anında hesabınıza yüklensin.",
    sections: [
      {
        title: "Instagram Takipçi Satın Alırken Dikkat Edilmesi Gerekenler",
        content: [
          "Asla hesap şifrenizi paylaşmayın. Yayıncı Kral sadece kullanıcı adınızla işlem yapar.",
          "Düşüş garantili ve telafili paketleri tercih ederek takipçi sayınızı daima koruyun.",
        ],
      },
    ],
    faqs: [
      {
        question: "Instagram şifremi vermem gerekiyor mu?",
        answer:
          "Kesinlikle hayır. Hesabınızın herkese açık olması ve kullanıcı adınızı belirtmeniz yeterlidir.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 285,
  },

  // 12. DISCORD PLATFORM
  discord: {
    title: "Discord Çevrimiçi Sunucu Üyesi & Emoji Tepki Satın Al | Yayıncı Kral",
    metaDescription:
      "Discord çevrimiçi sunucu üyesi, kalıcı topluluk üyeleri ve mesaj emoji tepkileriyle sunucunu canlandır. Yetki veya şifre gerekmez, anında teslimat!",
    keywords: [
      "discord sunucu üyesi satın al",
      "discord çevrimiçi üye",
      "discord online üye satın al",
      "discord emoji tepki satın al",
      "discord topluluk büyütme",
    ],
    h1: "Discord Sunucu Üyesi & Emoji Tepki Desteği",
    h2: "Sunucunuzun Üye Listesini Canlandıran Çevrimiçi ve Aktif Topluluk Desteği",
    badgeText: "Discord Çözümleri",
    articleIntro:
      "Oyun, yayıncı veya topluluk sunucunuzun ilk izlenimini güçlendirmek için çevrimiçi görünen aktif üyelere ve etkileşimli duyurulara ihtiyaç duyarsınız. Yayıncı Kral, yetki veya giriş bilgisi istemeden sunucu davet linkinizle güvenle üye teslimatı sağlar.",
    sections: [
      {
        title: "Discord Çevrimiçi (Online) Üyelerin Önemi",
        content: [
          "Yeni gelen kullanıcılar öncelikle sağ paneldeki yeşil ışıklı çevrimiçi üye sayısına bakar. Kalabalık ve canlı görünen sunucularda kalma oranı %85 artar.",
          "Duyuru mesajlarına eklenen emoji tepkileri (reactions), topluluğunuzun organik ve dinamik bir hava yakalamasını sağlar.",
        ],
      },
    ],
    faqs: [
      {
        question: "Discord sunucuma bot yetkisi vermem gerekir mi?",
        answer:
          "Kesinlikle hayır. Yalnızca süresiz bir sunucu davet bağlantısı (discord.gg/...) paylaşmanız yeterlidir.",
      },
      {
        question: "Çevrimiçi üyeler sunucuda ne kadar kalır?",
        answer:
          "Paket türüne bağlı olarak belirlenen süre boyunca yeşil ışıklı aktif oturum korunur ve sunucunuz canlı görünür.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 215,
  },

  // 13. SPOTIFY PLATFORM
  spotify: {
    title: "Spotify Aylık Dinleyici & Şarkı Dinlenme Satın Al | Yayıncı Kral",
    metaDescription:
      "Spotify aylık dinleyici ve şarkı dinlenme desteğiyle sanatçı profilini yükselt. Algoritma uyumlu, telif korumalı ve garantili Spotify müzik paketleri.",
    keywords: [
      "spotify aylık dinleyici satın al",
      "spotify dinlenme satın al",
      "spotify şarkı dinlenme",
      "spotify sanatçı yükselişi",
      "spotify haftalık keşif desteği",
    ],
    h1: "Spotify Aylık Dinleyici & Şarkı Dinlenme Desteği",
    h2: "Şarkılarınızı Keşfet ve Editoryal Çalma Listelerine Taşıyan Müzik Büyüme Çözümleri",
    badgeText: "Spotify Sanatçı Çözümleri",
    articleIntro:
      "Bağımsız sanatçılar ve müzik üreticileri için Spotify algoritması en kritik basamaktır. Aylık dinleyici sayısı ve yüksek dinleme süreleri (retention), parçalarınızın Release Radar ve Haftalık Keşif listelerine girmesini tetikler.",
    sections: [
      {
        title: "Spotify Algoritmasında Aylık Dinleyicinin Rolü",
        content: [
          "Aylık dinleyici metriği, Spotify for Artists profilinizde 30 gün boyunca görünür kalır ve müzik şirketleri ile dinleyiciler nezdinde güçlü bir itibar oluşturur.",
          "Tüm dinlenmeler telif ve platform standartlarına uygundur; hesabınıza veya şarkınıza herhangi bir zarar vermez.",
        ],
      },
    ],
    faqs: [
      {
        question: "Spotify istatistikleri for Artists paneline yansır mı?",
        answer:
          "Evet, tüm dinlenme ve aylık dinleyiciler resmi Spotify for Artists panelinizde ve sanatçı sayfanızda doğrulanır.",
      },
      {
        question: "Şarkı linki vermem yeterli mi?",
        answer:
          "Evet, şarkınızın veya sanatçı profilinizin herkese açık Spotify bağlantısını girmeniz yeterlidir.",
      },
    ],
    ratingValue: "5.0",
    reviewCount: 260,
  },

  // 14. TELEGRAM PLATFORM
  telegram: {
    title: "Telegram Kanal Üyesi & Gönderi Görüntülenme Satın Al | Yayıncı Kral",
    metaDescription:
      "Telegram kanal üyesi, grup üyesi ve gönderi görüntülenme paketleriyle topluluğunu büyüt. Şifresiz, anında teslimat ve düşüş garantili Telegram hizmetleri.",
    keywords: [
      "telegram kanal üyesi satın al",
      "telegram grup üyesi satın al",
      "telegram görüntülenme satın al",
      "telegram emoji tepki",
      "telegram kanal büyütme",
    ],
    h1: "Telegram Kanal Üyesi & Gönderi Görüntülenme Desteği",
    h2: "Kanalınızı Arama Sıralamasında Zirveye Taşıyacak Güvenilir Topluluk Paketleri",
    badgeText: "Telegram Çözümleri",
    articleIntro:
      "Telegram üzerinde haber, kripto, e-ticaret veya topluluk kanalı yönetiyorsanız yüksek üye sayısı ve aktif gönderi okunma oranları kanalınızın güvenilirliğini belirler. Yayıncı Kral garantili ve hızlı teslimat sağlar.",
    sections: [
      {
        title: "Telegram Kanallarında Etkileşimin Gücü",
        content: [
          "Yüksek üyeli kanallar Telegram global arama sonuçlarında (Search) üst sıralarda çıkar ve organik kullanıcıların kanalınıza katılmasını sağlar.",
          "Gönderilerinize eklenen görüntülenme ve pozitif emoji tepkileri kanalınızın daima canlı olduğunu kanıtlar.",
        ],
      },
    ],
    faqs: [
      {
        question: "Telegram kanalımın linki dışında bir bilgi gerekir mi?",
        answer:
          "Hayır, yalnızca herkese açık kanal veya grup bağlantınız (t.me/kanaladi) yeterlidir.",
      },
      {
        question: "Üyeler kalıcı mıdır?",
        answer:
          "Paketlerimiz düşüşlere karşı telafi garantilidir; siparişiniz tamamlandıktan sonra güvenle kanalınızda kalır.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 195,
  },
};

/**
 * Verilen slug, platform veya kategoriye göre en uygun SEO başlık, açıklama ve makaleyi üretir
 */
export function getSeoData(
  slug: string,
  platform?: { name: string; slug: string } | null,
  category?: { name: string; slug: string; shortDescription?: string | null } | null
): SeoPageData {
  const custom = SEO_DICTIONARY[slug];

  const platformName = platform?.name || "Yayıncı";
  const categoryName = category?.name || "Paketleri";
  const fallbackCanonical = `${BASE_URL}/servis/${slug}`;

  if (custom && custom.title && custom.metaDescription) {
    return {
      title: custom.title,
      metaDescription: custom.metaDescription,
      keywords: custom.keywords || [
        `${platformName.toLowerCase()} izleyici botu`,
        `${platformName.toLowerCase()} canlı izleyici satın al`,
        `${platformName.toLowerCase()} takipçi satın al`,
        "yayıncı kral",
      ],
      canonical: fallbackCanonical,
      h1: custom.h1 || `${platformName} ${categoryName}`,
      h2: custom.h2 || `${platformName} İçin Profesyonel Dijital Büyüme ve İzleyici Çözümleri`,
      badgeText: custom.badgeText || `${platformName} Hizmetleri`,
      articleIntro:
        custom.articleIntro ||
        `${platformName} içerikleriniz ve canlı yayınlarınız için en stabil, güvenli ve şifresiz paketler Yayıncı Kral güvencesiyle sunulmaktadır.`,
      sections: custom.sections || [
        {
          title: `${platformName} Hizmetlerimizin Öne Çıkan Ayrıcalıkları`,
          content: [
            "Tüm paketlerimiz 7/24 anlık otomatik teslimat protokolüyle çalışır ve bekleme süresini minimuma indirir.",
            "Hiçbir işlemde hesap şifreniz istenmez; yalnızca herkese açık kanal veya profil bağlantınız yeterlidir.",
            "Gelişmiş anti-spam ve güvenli akış filtreleri sayesinde kanalınızın algoritma uyumu en üst düzeyde tutulur.",
          ],
        },
      ],
      faqs: custom.faqs || [
        {
          question: `${platformName} paketleri ne kadar sürede teslim edilir?`,
          answer:
            "Siparişiniz onaylandığı anda sistemimiz otomatik olarak işlem başlatır ve genellikle 1-5 dakika içinde teslimat başlar.",
        },
        {
          question: "Hizmet alırken hesap şifremi vermem gerekir mi?",
          answer:
            "Hayır, Yayıncı Kral hiçbir zaman sizden şifre talep etmez. Sadece açık bağlantınızı girmeniz yeterlidir.",
        },
        {
          question: "Ödeme seçenekleri nelerdir?",
          answer:
            "Shopier ile 3D Secure kredi kartı/banka kartı ve güvenli EFT/Havale seçenekleriyle ödeme yapabilirsiniz.",
        },
      ],
      ratingValue: custom.ratingValue || "4.9",
      reviewCount: custom.reviewCount || 240,
    };
  }

  // Dinamik Genel Fallback
  return {
    title: `${platformName} ${categoryName} Satın Al | Yayıncı Kral`,
    metaDescription:
      category?.shortDescription ||
      `${platformName} ${categoryName} paketleri en ucuz fiyatlar, 7/24 anlık teslimat ve %100 şifresiz işlem garantisiyle Yayıncı Kral'da.`,
    keywords: [
      `${platformName.toLowerCase()} izleyici botu`,
      `${platformName.toLowerCase()} canlı izleyici satın al`,
      `${platformName.toLowerCase()} takipçi satın al`,
      `${platformName.toLowerCase()} ${categoryName.toLowerCase()}`,
      "yayıncı kral",
    ],
    canonical: fallbackCanonical,
    h1: `${platformName} ${categoryName}`,
    h2: `${platformName} Canlı Yayın ve Profilinizi Zirveye Taşıyacak Güçlü Altyapı`,
    badgeText: `${platformName} Çözümleri`,
    articleIntro:
      category?.shortDescription ||
      `${platformName} kanalınızın ve içeriklerinizin etkileşimini yükseltmek için özel olarak geliştirilmiş garantili paketlerimizi inceleyin.`,
    sections: [
      {
        title: `Neden Yayıncı Kral ${platformName} Paketlerini Tercih Etmelisiniz?`,
        content: [
          "Sistemimiz 7/24 otomatik sipariş teslimat altyapısıyla çalışır; siparişiniz onaylandığı anda işlem sırasına alınır.",
          "Şifresiz, güvenli ve ban korumalı yapısıyla profilinizin ve kanalınızın güvenliğini %100 korur.",
          "Uygun fiyatlar ve kesintisiz canlı destek hattımızla her zaman yanınızdayız.",
        ],
      },
    ],
    faqs: [
      {
        question: `Sipariş ne zaman başlar?`,
        answer:
          "Ödeme onayının hemen ardından otomatik API altyapımız işlemi tetikler ve 1-5 dakika içinde teslimat başlar.",
      },
      {
        question: `Şifre paylaşmam gerekir mi?`,
        answer:
          "Asla. Yayıncı Kral üzerinden verilen hiçbir siparişte şifreniz istenmez.",
      },
      {
        question: `Herhangi bir sorun yaşarsam kime ulaşabilirim?`,
        answer:
          "Sitemizin sağ alt köşesindeki WhatsApp destek butonundan veya iletişim sayfamızdan 7/24 ekibimize ulaşabilirsiniz.",
      },
    ],
    ratingValue: "4.9",
    reviewCount: 180,
  };
}

