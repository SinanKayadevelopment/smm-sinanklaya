"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Lock,
  CreditCard,
  MessageCircle,
  Mail,
  Search,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [quickCode, setQuickCode] = useState("");

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    router.push(`/siparis-sorgula?kod=${encodeURIComponent(quickCode.trim().toUpperCase())}`);
  };

  const scrollToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <footer className="bg-[#0B041C] border-t border-[#2D1254] text-purple-200/80 text-xs">
      {/* Üst Kısım: Hızlı Sipariş Sorgulama Şeridi */}
      <div className="border-b border-[#2D1254] bg-[#160633] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#7C1CF5]/20 border border-[#7C1CF5]/40 text-[#A855F7] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Siparişinizi Anlık Sorgulayın</h4>
                <p className="text-xs text-purple-200/70">
                  Size verilen sipariş kodu (Örn: DST-849201) ile teslimat sürecini canlı izleyin.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickLookup} className="flex items-center w-full md:w-auto space-x-2">
              <input
                type="text"
                placeholder="DST-XXXXXX"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                className="w-full md:w-60 bg-[#250952] border border-[#3E1678] text-white rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase focus:border-[#7C1CF5] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl btn-theme text-xs font-bold shrink-0 flex items-center space-x-1"
              >
                <span>Sorgula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ana Footer Kolonları */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* 1. Kolon: Marka ve Açıklama */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C1CF5] to-[#53FC18] p-0.5">
                <div className="w-full h-full bg-[#060B18] rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#53FC18]" />
                </div>
              </div>
              <span className="text-xl font-black text-white">
                YAYINCI<span className="text-[#53FC18]">KRAL</span>
              </span>
            </Link>

            <p className="text-gray-400 leading-relaxed text-xs max-w-sm">
              Türkiye&apos;nin lider yayıncı ve sosyal medya destek platformu Yayıncı Kral (yayincikral.com).
              Üyelik şartı olmaksızın, tamamen şifresiz, anlık ve garantili büyüme çözümleri sunuyoruz.
            </p>

            <div className="pt-2 space-y-2">
              <a
                href="https://wa.me/905331948396"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition group"
              >
                <MessageCircle className="w-4 h-4 text-[#53FC18] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">WhatsApp Canlı Destek: +90 (533) 194 83 96</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium">Kurumsal Destek: destek@yayincikral.com</span>
              </div>
            </div>
          </div>

          {/* 2. Kolon: Popüler Platformlar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platformlar
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  Twitch Canlı İzleyici
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  Twitch Takipçi Desteği
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  Kick Canlı İzleyici
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  Kick Takipçi Yükselişi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  YouTube Abone & Etkileşim
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  TikTok Topluluk Desteği
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Kolon: Hızlı Bağlantılar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/siparis-sorgula" className="hover:text-white transition">
                  Sipariş Durumu Takibi
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("cok-satanlar")}
                  className="hover:text-white transition text-left"
                >
                  Çok Satan Paketler
                </button>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition">
                  Hakkımızda & Vizyon
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                  Yönetim Paneli (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Kolon: Kurumsal & Yasal Sözleşmeler (PayTR İçin Zorunlu) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Kurumsal & Yasal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/musteri-sozlesmesi" className="hover:text-white transition">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-white transition">
                  Gizlilik & Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/iptal-iade-kosullari" className="hover:text-white transition">
                  İptal ve İade Koşulları
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition">
                  Şirket ve İletişim Bilgileri
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ödeme Güvenlik Rozetleri */}
        <div className="pt-10 mt-10 border-t border-[#2D1254] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#160633] border border-[#2D1254] text-[11px] text-purple-200">
              <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>256-Bit SSL Koruması</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#160633] border border-[#2D1254] text-[11px] text-purple-200">
              <CreditCard className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>PayTR 3D Secure</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#160633] border border-[#2D1254] text-[11px] text-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#53FC18]" />
              <span>EFT / Havale Anında Onay</span>
            </span>
          </div>

          <p className="text-xs text-purple-300/60">
            © {new Date().getFullYear()} Yayıncı Kral (yayincikral.com). Tüm hakları saklıdır.
          </p>
        </div>

        {/* En Alt Zorunlu Yasal Uyarı Metni */}
        <div className="mt-8 pt-6 border-t border-gray-900 text-center">
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-5xl mx-auto">
            <strong className="text-gray-400">Yasal Uyarı:</strong> Bu web sitesi; Twitch (Twitch
            Interactive, Inc.), Kick (Kick Streaming Pty Ltd), YouTube (Google LLC), Instagram (Meta
            Platforms, Inc.), TikTok (ByteDance Ltd.) ve Facebook (Meta Platforms, Inc.)
            şirketlerinden hiçbiriyle bağlantılı değildir; bu şirketler tarafından
            yetkilendirilmemiş, yönetilmemekte veya desteklenmemektedir. Belirtilen platformlara ait
            tüm ticari markalar ve logolar ilgili şirketlerin kendi mülkiyetindedir.
          </p>
        </div>
      </div>
    </footer>
  );
}
