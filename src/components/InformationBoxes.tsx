"use client";

import React from "react";
import {
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
  Coins,
  RefreshCw,
  Layout,
  FileText,
  UserCheck,
  SlidersHorizontal,
} from "lucide-react";

export default function InformationBoxes() {
  const boxes = [
    {
      icon: <Zap className="w-5 h-5 text-[#7C1CF5]" />,
      title: "1. Hızlı ve Otomatik İşlem",
      description:
        "Siparişiniz tamamlandığı andan itibaren akıllı tedarik altyapımız saniyeler içinde yayınınızı veya profilinizi algılayarak yükseliş sürecini başlatır.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: "2. %100 Güvenlik & Şifresiz",
      description:
        "Hesabınızın güvenliği her şeyden önce gelir. Platformumuz hiçbir aşamada sizden şifre talep etmez; yalnızca herkese açık kanal veya profil bağlantınız yeterlidir.",
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-600" />,
      title: "3. 7/24 Canlı Destek Ekibi",
      description:
        "Yayın saatiniz ne olursa olsun; gece ya da gündüz fark etmeksizin uzman teknik destek kadromuz WhatsApp ve destek hattı üzerinden anında yanıt verir.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#7C1CF5]" />,
      title: "4. Yüksek Kalite Standardı",
      description:
        "Yayıncı algoritmalarıyla tam uyumlu, keşfet trafiğini ve kanal görünürlüğünü artıran en stabil ve sürdürülebilir etkileşim yöntemlerini kullanıyoruz.",
    },
    {
      icon: <Coins className="w-5 h-5 text-amber-500" />,
      title: "5. Rekabetçi ve Şeffaf Fiyatlandırma",
      description:
        "Gizli ücretler, ek komisyonlar veya sürpriz kesintiler olmadan, doğrudan üretici fiyatlarıyla en avantajlı destek paketlerini sunuyoruz.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-blue-500" />,
      title: "6. Sürekli Güncelleme & Adaptasyon",
      description:
        "Sosyal medya platformlarının algoritma değişimlerini anlık takip ederek tüm sistemlerimizi kesintisiz ve sorunsuz çalışacak şekilde daima güncelliyoruz.",
    },
    {
      icon: <Layout className="w-5 h-5 text-indigo-500" />,
      title: "7. Kullanıcı Dostu Arayüz",
      description:
        "Üyelik zorunluluğu olmaksızın sadece birkaç adımda dilediğiniz paketi seçip güvenle siparişinizi tamamlayabileceğiniz sade ve hızlı sipariş akışı.",
    },
    {
      icon: <FileText className="w-5 h-5 text-[#7C1CF5]" />,
      title: "8. Sayfa Notları ve Tavsiyeler",
      description:
        "Yayın açtıktan 1-2 dakika sonra canlı destek başlatmanız, platform algoritmalarının kanalınızı doğal keşfet listelerine taşımasına en yüksek verimle katkı sağlar.",
    },
    {
      icon: <UserCheck className="w-5 h-5 text-rose-500" />,
      title: "9. Kullanım Şartları & Hesap Uyumu",
      description:
        "Hizmetlerimizi sadece kendi sosyal medya hesabınız için satın alabilirsiniz. Başkasına ait kanallara izinsiz yönlendirme yapılması kesinlikle yasaktır.",
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-purple-700" />,
      title: "10. Hizmet Sınırlamaları ve Esneklik",
      description:
        "Aynı kanala aynı anda çakışan iki farklı işlem girilmemeli, bir paketin tamamlanmasının ardından yeni paket tanımlanmalıdır.",
    },
  ];

  return (
    <section className="py-20 bg-[#F8F9FD] relative border-t border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7C1CF5]" />
            <span>Şeffaf & Güvenilir Hizmet İlkeleri</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E1B4B] tracking-tight">
            Genel Bilgilendirmeler ve Standartlarımız
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Platformumuzdan alacağınız tüm yayıncı ve büyüme destek hizmetleri hakkında bilmeniz gereken
            temel detaylar.
          </p>
        </div>

        {/* 10 Kutu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {boxes.map((box, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-[#EDE9FE] p-5 hover:border-[#C084FC] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#F8F5FE] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {box.icon}
                </div>
                <h3 className="text-sm font-black text-[#1E1B4B] mb-2 leading-snug group-hover:text-[#7C1CF5] transition-colors">
                  {box.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">{box.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
