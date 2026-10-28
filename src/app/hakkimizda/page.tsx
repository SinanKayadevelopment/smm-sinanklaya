import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Target, Award, Users, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | Yayıncı Kral - Yayıncı ve Sosyal Medya Hizmetleri",
  description: "Türkiye'nin lider yayıncı destek ve sosyal medya büyüme platformu Yayıncı Kral hakkında kurumsal bilgiler ve misyonumuz.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col justify-between selection:bg-[#00F2FE] selection:text-[#060B18]">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00F2FE]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          {/* Üst Başlık */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Kurumsal Profilimiz</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Yayıncı Kral Destek Çözümleri
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Yayıncıların, içerik üreticilerinin ve dijital markaların sosyal medya ekosisteminde
              güvenle zirveye yerleşmesini sağlayan yeni nesil teknoloji altyapısı.
            </p>
          </div>

          {/* Vizyon ve Misyon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] space-y-4 hover:border-[#00F2FE]/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Misyonumuz</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Yayıncılık ve sosyal medya dünyasına yeni adım atan veya mevcut kitlesini daha üst
                seviyelere taşımak isteyen içerik üreticilerine; stabil, şeffaf, 7/24 kesintisiz ve
                en yüksek kalitede etkileşim desteği sağlamak.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] space-y-4 hover:border-[#38BDF8]/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Güven ve Gizlilik İlkemiz</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Tüm operasyonlarımızda kullanıcı gizliliğini ve hesap güvenliğini en ön planda
                tutuyoruz. Platformumuz hiçbir şart altında şifre talep etmez; siparişler 256-bit
                SSL ve 3D Güvenli Ödeme altyapısıyla korunur.
              </p>
            </div>
          </div>

          {/* Şirket Bilgileri */}
          <div className="p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white border-b border-[#1A3060] pb-3">
              Kurumsal İletişim ve Şirket Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
              <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                <strong className="text-white block mb-1">Unvan:</strong>
                Yayıncı Kral Yayıncı Destek ve Bilişim Hizmetleri
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                <strong className="text-white block mb-1">Web Sitesi:</strong>
                yayincikral.com
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                <strong className="text-white block mb-1">E-Posta:</strong>
                destek@yayincikral.com
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                <strong className="text-white block mb-1">Müşteri Destek Hattı:</strong>
                +90 (533) 194 83 96 (7/24 WhatsApp & Destek)
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
