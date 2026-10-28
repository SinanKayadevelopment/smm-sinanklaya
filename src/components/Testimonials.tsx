"use client";

import React from "react";
import { Star, Quote, CheckCircle, Award } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      author: "GizliYoutuber",
      badge: "Doğrulanmış Yayıncı",
      platform: "Twitch & Instagram Destek",
      content:
        "Sundukları Twitch ve Instagram destek hizmetleri gerçekten etkileyici! Kısa sürede kanalımda gözle görülür bir iyileşme ve yükseliş yaşadım. Stabil, hızlı ve güvenilir yardımları için teşekkürler. Sosyal medya hedeflerime ulaşmamda büyük rol oynadılar!",
      stars: 5,
    },
    {
      author: "Gizliİnfluencer",
      badge: "İçerik Üreticisi",
      platform: "Sosyal Medya Büyüme Çözümleri",
      content:
        "Bugün ulaştığım bu seviyede katkınız oldukça büyük. Genellikle bu tür dijital destek sitelerine karşı çekimserdim, fakat sizi keşfettikten sonra fikrim tamamen değişti. Sunduğunuz hizmetlerin kalitesi ve profesyonelliğiniz sayesinde sosyal medya üzerindeki varlığımı güçlendirdim.",
      stars: 5,
    },
    {
      author: "YayıncıPartner",
      badge: "Partner Yayıncı",
      platform: "Twitch & Kick Canlı İzleyici",
      content:
        "Twitch ve Kick yayınlarımda gözle görülür bir yükseliş yaşamaya başladım, bunu tamamen sunduğunuz kesintisiz izleyici desteğine borçluyum. Hem çok hızlılar hem de keşfet görünürlüğüne süper etkisi var! Kesinlikle tavsiye ederim.",
      stars: 5,
    },
    {
      author: "DijitalİçerikÜreticisi",
      badge: "Topluluk Yöneticisi",
      platform: "Etkileşim & Kanal Güçlendirme",
      content:
        "Sosyal medya büyüme sürecimde aradığım profesyonel yardımı burada buldum. Artık yayınlarım daha aktif ve popüler, bu da organik takipçi sayımın artmasına doğrudan yardımcı oldu. Hızlı sonuç ve destek almak isteyenlere öneririm.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-b border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Bölüm Başlığı */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#7C1CF5]" />
            <span>Kullanıcı Deneyimleri</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E1B4B] tracking-tight">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Yayıncılarımızın ve dijital içerik üreticilerimizin platformumuz aracılığıyla elde ettiği
            başarı ve yükseliş hikayeleri.
          </p>
        </div>

        {/* Değerlendirme Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#FAF5FF] border border-[#EDE9FE] p-6 sm:p-8 flex flex-col justify-between hover:border-[#C084FC] hover:shadow-lg transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-9 h-9 text-[#7C1CF5]/15 pointer-events-none group-hover:scale-110 transition-transform" />

              <div className="space-y-4">
                {/* Yıldızlar */}
                <div className="flex items-center space-x-1">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Yorum */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-medium">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Kullanıcı Bilgisi */}
              <div className="pt-6 mt-6 border-t border-[#EDE9FE] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-[#1E1B4B]">{rev.author}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#53FC18]" />
                  </div>
                  <span className="text-xs text-[#7C1CF5] font-semibold">{rev.platform}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#7C1CF5] border border-[#EDE9FE]">
                  {rev.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
