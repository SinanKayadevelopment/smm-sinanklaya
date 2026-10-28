"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ShieldCheck,
  Smile,
  ArrowRight,
  Zap,
  Check,
  Tv,
  Video,
  Share2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import PlatformLogo from "./PlatformLogo";

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  quantity: number;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  packages: PackageItem[];
}

interface PlatformItem {
  id: string;
  name: string;
  slug: string;
  colorCode: string;
  icon: string;
  categories: CategoryItem[];
}

interface HeroSectionProps {
  initialPlatforms?: PlatformItem[];
}

export default function HeroSection({ initialPlatforms = [] }: HeroSectionProps) {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<PlatformItem[]>(initialPlatforms);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string>("");
  const [showQuickOrder, setShowQuickOrder] = useState<boolean>(false);

  useEffect(() => {
    if (initialPlatforms.length === 0) {
      fetch("/api/platforms")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.platforms.length > 0) {
            setPlatforms(data.platforms);
            setSelectedPlatformId(data.platforms[0].id);
          }
        })
        .catch((err) => console.error(err));
    } else {
      setSelectedPlatformId(initialPlatforms[0]?.id || "");
    }
  }, [initialPlatforms]);

  const currentPlatform = platforms.find((p) => p.id === selectedPlatformId);
  const availableCategories = currentPlatform?.categories || [];

  useEffect(() => {
    if (availableCategories.length > 0) {
      setSelectedCategoryId(availableCategories[0].id);
    } else {
      setSelectedCategoryId("");
    }
  }, [selectedPlatformId]);

  const currentCategory = availableCategories.find((c) => c.id === selectedCategoryId);
  const availablePackages = currentCategory?.packages || [];

  useEffect(() => {
    if (availablePackages.length > 0) {
      setSelectedPackageSlug(availablePackages[0].slug);
    } else {
      setSelectedPackageSlug("");
    }
  }, [selectedCategoryId]);

  const handleStartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageSlug) return;
    router.push(`/siparis-olustur/${selectedPackageSlug}`);
  };

  const selectedPackage = availablePackages.find((p) => p.slug === selectedPackageSlug);

  const getHeroPlatformIcon = (slug: string) => {
    return <PlatformLogo platform={slug} size={18} />;
  };

  return (
    <div className="relative">
      {/* 1. Botcubey Mor Geometrik Facet Hero Alanı */}
      <section className="relative bg-gradient-to-br from-[#7C1CF5] via-[#6F14DC] to-[#5500B8] text-white pt-10 pb-24 sm:pb-32 overflow-hidden">
        {/* Geometrik Low-Poly Poligon Deseni */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="0,0 350,0 180,270" fill="#FFFFFF" opacity="0.12" />
            <polygon points="350,0 720,0 520,220" fill="#9D4EDD" opacity="0.25" />
            <polygon points="720,0 1100,0 920,290" fill="#C77DFF" opacity="0.18" />
            <polygon points="1100,0 1440,0 1280,230" fill="#FFFFFF" opacity="0.15" />
            <polygon points="0,0 180,270 0,460" fill="#3C096C" opacity="0.3" />
            <polygon points="180,270 520,220 390,480" fill="#FFFFFF" opacity="0.1" />
            <polygon points="520,220 920,290 680,510" fill="#9D4EDD" opacity="0.2" />
            <polygon points="920,290 1280,230 1140,490" fill="#C77DFF" opacity="0.15" />
            <polygon points="1280,230 1440,0 1440,440" fill="#3C096C" opacity="0.25" />
            <polygon points="0,460 390,480 220,600" fill="#240046" opacity="0.35" />
            <polygon points="390,480 680,510 560,600" fill="#5A189A" opacity="0.2" />
            <polygon points="680,510 1140,490 940,600" fill="#FFFFFF" opacity="0.08" />
            <polygon points="1140,490 1440,440 1340,600" fill="#7B2CBF" opacity="0.2" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Sol Sütun: Başlık & Alt Metin & 3 Rozet */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
                Türkiye‘nin En Kaliteli <br className="hidden sm:inline" />
                Yayıncı & Sosyal Medya Hizmetleri
              </h1>

              <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Yayıncı Kral ile 7/24 hızlı, şifresiz, güvenilir ve garantili canlı yayın izleyici, abone ve etkileşim hizmetleri.
              </p>

              {/* 3 Beyaz Rozet Butonu */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white text-[#7C1CF5] text-xs font-black shadow-md">
                  <Award className="w-3.5 h-3.5 text-[#7C1CF5]" />
                  <span>Kaliteli Hizmet</span>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white text-[#7C1CF5] text-xs font-black shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7C1CF5]" />
                  <span>✔ Güvenli Ödeme</span>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white text-[#7C1CF5] text-xs font-black shadow-md">
                  <Smile className="w-3.5 h-3.5 text-[#7C1CF5]" />
                  <span>☺ Mutlu Müşteriler</span>
                </div>
              </div>
            </div>

            {/* Sağ Sütun: Screenshot 2'deki 5 Beyaz Servis Kartı Listesi */}
            <div className="lg:col-span-5 space-y-2.5 max-w-md mx-auto lg:ml-auto w-full">
              {[
                { name: "Twitch", label: "Twitch Servisleri", slug: "twitch" },
                { name: "Kick", label: "Kick Servisleri", slug: "kick" },
                { name: "YouTube", label: "YouTube Servisleri", slug: "youtube" },
                { name: "TikTok", label: "TikTok Servisleri", slug: "tiktok" },
                { name: "Instagram", label: "Instagram Servisleri", slug: "instagram" },
                { name: "Twitter / X", label: "Twitter / X Servisleri", slug: "twitter-x" },
              ].map((item) => (
                <a
                  key={item.slug}
                  href={`/servis/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-3.5 bg-white text-[#1E1B4B] rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 group cursor-pointer border border-[#EDE9FE]"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] border border-[#EDE9FE] shadow-sm flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform shrink-0">
                      <PlatformLogo platform={item.slug} size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-extrabold text-[#1E1B4B] group-hover:text-[#7C1CF5] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-gray-500 font-semibold">
                        Servisleri & Paketleri
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#FAF5FF] group-hover:bg-[#7C1CF5] text-[#7C1CF5] group-hover:text-white flex items-center justify-center transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Yumuşak Dalgalı Alt Kenarlık */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-12 sm:h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
              fill="#F8F9FD"
            ></path>
          </svg>
        </div>
      </section>

      {/* 2. Dalga Ortasındaki Yüzen "⚡ Hızlı Sipariş Formu" Butonu */}
      <div className="relative -mt-6 sm:-mt-8 z-30 flex justify-center px-4">
        <button
          type="button"
          onClick={() => setShowQuickOrder(!showQuickOrder)}
          className="px-6 py-3 rounded-full bg-white text-[#7C1CF5] hover:bg-[#FAF5FF] font-black text-xs sm:text-sm shadow-xl border border-[#EDE9FE] flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 text-[#7C1CF5]" />
          <span>⚡ Hızlı Sipariş Formu</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showQuickOrder ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Açılır Hızlı Sipariş Sihirbazı */}
      {showQuickOrder && (
        <div className="max-w-4xl mx-auto px-4 mt-6 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white border border-[#EDE9FE] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F3E8FF] gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1E1B4B]">
                  Hızlı Sipariş Sihirbazı
                </h3>
                <p className="text-xs text-gray-500">
                  Platform ve paket seçerek doğrudan sipariş adımına geçin.
                </p>
              </div>

              {selectedPackage && (
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Tutar:</span>
                  <span className="text-xl font-black text-[#7C1CF5]">
                    {selectedPackage.price.toFixed(2)} ₺
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleStartOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Platform */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={selectedPlatformId}
                    onChange={(e) => setSelectedPlatformId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#1E1B4B] bg-[#FAF5FF] focus:border-[#7C1CF5] outline-none"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Kategori */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    disabled={availableCategories.length === 0}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#1E1B4B] bg-[#FAF5FF] focus:border-[#7C1CF5] outline-none"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Paket */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Paket
                  </label>
                  <select
                    value={selectedPackageSlug}
                    onChange={(e) => setSelectedPackageSlug(e.target.value)}
                    disabled={availablePackages.length === 0}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#1E1B4B] bg-[#FAF5FF] focus:border-[#7C1CF5] outline-none"
                  >
                    {availablePackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.slug}>
                        {pkg.name} ({pkg.price.toFixed(2)} ₺)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedPackageSlug}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C1CF5] hover:bg-[#6005BA] transition shadow-md shadow-purple-500/25 flex items-center space-x-1.5"
                >
                  <span>Siparişi Başlat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
