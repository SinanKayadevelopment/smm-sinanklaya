"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, ShieldCheck, Zap } from "lucide-react";
import PlatformLogo from "./PlatformLogo";

interface PackageProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  features: string;
  category: {
    name: string;
    platform: {
      name: string;
      colorCode: string;
      slug: string;
    };
  };
}

interface CreatorShowcaseProps {
  packages?: PackageProps[];
}

export default function CreatorShowcase({ packages = [] }: CreatorShowcaseProps) {
  if (!packages || packages.length === 0) return null;

  return (
    <section id="ozel-paketler" className="py-16 sm:py-24 bg-gradient-to-b from-[#F8F9FD] via-white to-[#F8F9FD] relative border-t border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FAF5FF] border border-[#DDD6FE] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#7C1CF5]" />
            <span>Yayıncı & Sanatçı Özel Kataloğu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E1B4B] tracking-tight">
            Özel Yayıncı & Sanatçı Yükseliş Paketleri
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Kick aktif sohbet, Discord sunucu üyesi, Spotify sanatçı dinlenme, YouTube 4.000 saat ve Telegram topluluk çözümleriyle rakiplerinizin bir adım önüne geçin.
          </p>
        </div>

        {/* Paket Kartları Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {packages.map((pkg) => {
            let featureList: string[] = [];
            try {
              featureList = JSON.parse(pkg.features);
            } catch (e) {
              featureList = ["Anlık Başlar", "Garantili Yükseliş", "Algoritma Uyumlu"];
            }

            const platformSlug = pkg.category.platform.slug.toLowerCase();

            return (
              <div
                key={pkg.id}
                className="relative p-6 flex flex-col justify-between rounded-3xl bg-white border border-[#EDE9FE] shadow-[0_10px_30px_rgba(124,28,245,0.06)] hover:shadow-[0_20px_40px_rgba(124,28,245,0.18)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
              >
                {/* Arka Plan Filigran İkonu */}
                <div className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform flex items-center justify-center opacity-15">
                  <PlatformLogo platform={platformSlug} size={70} />
                </div>

                <div>
                  {/* Platform Adı & Resmi Logo */}
                  <div className="flex items-center justify-center space-x-2 mb-1.5">
                    <PlatformLogo platform={platformSlug} size={18} />
                    <span className="text-base font-black text-[#7C1CF5] tracking-tight">
                      {pkg.category.platform.name}
                    </span>
                  </div>

                  {/* Kategori Etiketi */}
                  <div className="text-center mb-2">
                    <span className="text-[11px] font-semibold text-gray-400">
                      {pkg.category.name}
                    </span>
                  </div>

                  {/* Paket Adı */}
                  <h3 className="text-sm font-bold text-[#1E1B4B] text-center mb-4 min-h-[40px] flex items-center justify-center">
                    {pkg.name}
                  </h3>

                  {/* Özellikler */}
                  <div className="space-y-2 py-3 border-t border-b border-[#F3E8FF] my-4 text-xs font-medium text-gray-600">
                    {featureList.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center text-left">
                        <span className="text-[#7C1CF5] font-black mr-2 text-sm">›</span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Fiyat Etiketi */}
                  <div className="text-center mb-3">
                    <div className="inline-block px-5 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] font-black text-sm shadow-sm">
                      {pkg.price.toFixed(2)} ₺
                    </div>
                    {pkg.oldPrice && (
                      <div className="text-[11px] text-gray-400 line-through mt-0.5 font-medium">
                        {pkg.oldPrice.toFixed(2)} ₺
                      </div>
                    )}
                  </div>

                  {/* Satın Al Butonu */}
                  <Link
                    href={`/siparis-olustur/${pkg.slug}`}
                    className="w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold text-white bg-[#7C1CF5] hover:bg-[#6005BA] transition-all duration-200 shadow-md shadow-purple-600/30 group-hover:shadow-lg group-hover:shadow-purple-600/40"
                  >
                    <span>Hemen Yüksel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
