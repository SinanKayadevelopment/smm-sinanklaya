"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Crown,
  Search,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Tv,
  Video,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
  ExternalLink,
} from "lucide-react";
import OrderLookupModal from "./OrderLookupModal";
import PlatformLogo from "./PlatformLogo";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Platform {
  id: string;
  name: string;
  slug: string;
  icon: string;
  colorCode: string;
  categories: Category[];
}

const INITIAL_PLATFORMS: Platform[] = [
  {
    id: "twitch",
    name: "Twitch",
    slug: "twitch",
    icon: "Twitch",
    colorCode: "#9146FF",
    categories: [
      { id: "twitch-saatlik", name: "Saatlik Canlı İzleyici", slug: "twitch-saatlik-canli-izleyici" },
      { id: "twitch-24saatlik", name: "24 Saatlik Canlı İzleyici", slug: "twitch-24-saatlik-canli-izleyici" },
      { id: "twitch-takipci", name: "Takipçi & Topluluk Desteği", slug: "twitch-takipci-topluluk-destegi" },
    ],
  },
  {
    id: "kick",
    name: "Kick",
    slug: "kick",
    icon: "Tv",
    colorCode: "#53FC18",
    categories: [
      { id: "kick-saatlik", name: "Saatlik Canlı İzleyici", slug: "kick-saatlik-canli-izleyici" },
      { id: "kick-24saatlik", name: "24 Saatlik Canlı İzleyici", slug: "kick-24-saatlik-canli-izleyici" },
      { id: "kick-haftalik", name: "Haftalık Canlı İzleyici", slug: "kick-haftalik-canli-izleyici" },
      { id: "kick-aylik", name: "Aylık Stabil Canlı İzleyici", slug: "kick-aylik-canli-izleyici" },
      { id: "kick-takipci", name: "Takipçi & Kanal Güçlendirme", slug: "kick-takipci-topluluk" },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    slug: "youtube",
    icon: "Youtube",
    colorCode: "#FF0000",
    categories: [
      { id: "yt-abone", name: "Abone & Topluluk Yükselişi", slug: "youtube-abone-topluluk-yukselisi" },
      { id: "yt-izlenme", name: "Video İzlenme & 4.000 Saat Desteği", slug: "youtube-video-izlenme-saat" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    icon: "Video",
    colorCode: "#00F2FE",
    categories: [
      { id: "tiktok-takipci", name: "Takipçi & Canlı Yayın Yetkisi", slug: "tiktok-takipci-canli-yayin-yetkisi" },
      { id: "tiktok-kesfet", name: "Video İzlenme & Keşfet Desteği", slug: "tiktok-video-izlenme-kesfet" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    icon: "Instagram",
    colorCode: "#E1306C",
    categories: [
      { id: "ig-takipci", name: "Takipçi & Prestij Güçlendirme", slug: "instagram-takipci-prestij-guclendirme" },
    ],
  },
  {
    id: "twitter-x",
    name: "Twitter / X",
    slug: "twitter-x",
    icon: "Twitter",
    colorCode: "#1DA1F2",
    categories: [
      { id: "x-takipci", name: "Etkileşim & Takipçi Desteği", slug: "twitter-x-etkilesim-takipci-destegi" },
    ],
  },
];

export default function Navbar() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePlatformDropdown, setActivePlatformDropdown] = useState<string | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActivePlatformDropdown(id);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActivePlatformDropdown(null);
    }, 250);
  };

  useEffect(() => {
    fetch("/api/platforms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlatforms(data.platforms);
        }
      })
      .catch((err) => console.error("Platform yüklenemedi:", err));

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const getPlatformIcon = (iconName: string, color: string) => {
    return <PlatformLogo platform={iconName} size={18} />;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#7C1CF5] via-[#6F14DC] to-[#5500B8] text-white shadow-lg shadow-purple-950/20">
        {/* Üst Bilgilendirme Şeridi */}
        <div className="bg-[#49028F]/70 border-b border-white/10 py-1.5 px-4 text-center text-xs font-medium text-purple-100 flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#53FC18] animate-pulse"></span>
            <span className="text-white font-semibold">Aktif Tedarik Ağı:</span>
            <span>Tüm yayıncı ve sosyal medya destek sistemlerimiz anlık aktiftir.</span>
          </div>
          <span className="hidden md:inline text-white/30">|</span>
          <div className="hidden md:flex items-center space-x-1 text-white">
            <Zap className="w-3.5 h-3.5 text-[#53FC18]" />
            <span className="text-purple-100">%100 Şifresiz & Güvenli Teslimat</span>
          </div>
        </div>

        {/* Ana Menü */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Sol: Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Crown className="w-6 h-6 text-[#7C1CF5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-white">
                  YAYINCI<span className="text-[#53FC18]">KRAL</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white text-[#7C1CF5] uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-purple-200 font-medium tracking-wide">
                Yayıncı & Sosyal Medya Hizmetleri
              </p>
            </div>
          </Link>

          {/* Orta: Masaüstü Platform Açılır Menüleri */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              Ana Sayfa
            </Link>

            {platforms.map((platform) => {
              const isOpen = activePlatformDropdown === platform.id;
              return (
                <div
                  key={platform.id}
                  className="relative py-2"
                  onMouseEnter={() => handleMouseEnter(platform.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActivePlatformDropdown(isOpen ? null : platform.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-sm font-semibold transition ${
                      isOpen
                        ? "bg-white text-[#7C1CF5]"
                        : "text-white/95 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <PlatformLogo platform={platform.slug} size={16} className="rounded shrink-0" />
                    <span>{platform.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#7C1CF5]" : ""
                      }`}
                    />
                  </button>

                  {/* Açılır Mega Menü - Beyaz Botcubey Kartı */}
                  {isOpen && (
                    <div
                      className="absolute left-0 top-full pt-2 w-80 z-50 animate-in fade-in duration-150"
                      onMouseEnter={() => handleMouseEnter(platform.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="rounded-2xl bg-white border border-[#EDE9FE] p-3 shadow-2xl text-[#1E1B4B]">
                        <a
                          href={`/servis/${platform.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3 py-2.5 border-b border-[#F3E8FF] mb-2 flex items-center justify-between hover:bg-[#FAF5FF] rounded-xl transition text-left cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="p-1 rounded-lg bg-[#FAF5FF] border border-[#EDE9FE] shadow-sm flex items-center justify-center shrink-0">
                              <PlatformLogo platform={platform.slug} size={22} />
                            </span>
                            <p className="text-xs font-bold text-[#1E1B4B] group-hover:text-[#7C1CF5] transition">
                              {platform.name} Tüm Paketleri
                            </p>
                          </div>
                          <span className="text-[10px] text-[#7C1CF5] font-black group-hover:translate-x-0.5 transition-transform flex items-center space-x-1 bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                            <span>Yeni Sekmede Seç</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </span>
                        </a>

                        <div className="space-y-1">
                          {platform.categories && platform.categories.length > 0 ? (
                            platform.categories.map((cat) => (
                              <a
                                key={cat.id}
                                href={`/servis/${cat.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#7C1CF5] hover:bg-[#FAF5FF] transition group text-left cursor-pointer"
                              >
                                <span>{cat.name}</span>
                                <span className="text-[10px] px-2.5 py-0.5 rounded font-bold bg-[#F3E8FF] text-[#7C1CF5] group-hover:bg-[#7C1CF5] group-hover:text-white transition shadow-sm flex items-center space-x-1">
                                  <span>Seç</span>
                                  <span>›</span>
                                </span>
                              </a>
                            ))
                          ) : (
                            <div className="p-2 text-xs text-gray-400">Kategori hazırlanıyor...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sağ: Aksiyon Butonları */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsLookupOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-md"
            >
              <Search className="w-4 h-4 text-purple-200" />
              <span>Sipariş Sorgula</span>
            </button>

            <a
              href="https://wa.me/905331948396"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white text-[#7C1CF5] hover:bg-purple-50 transition shadow-lg shadow-purple-950/20"
            >
              <MessageCircle className="w-4 h-4 text-[#7C1CF5]" />
              <span>✉ WhatsApp Destek</span>
            </a>
          </div>

          {/* Mobil Menü Butonu */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsLookupOpen(true)}
              className="p-2 rounded-xl bg-white/10 text-white"
              aria-label="Sorgula"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#6005BA] p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              <p className="text-xs font-bold text-purple-200 uppercase px-2 mb-2">Platform Hizmetleri</p>
              {platforms.map((p) => (
                <div key={p.id} className="space-y-1 bg-white/5 p-2 rounded-2xl mb-2">
                  <div className="px-2 py-1 text-sm font-bold text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-1 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                        <PlatformLogo platform={p.slug} size={20} />
                      </span>
                      <span>{p.name}</span>
                    </div>
                    <a
                      href={`/servis/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#7C1CF5] bg-white font-black px-2.5 py-1 rounded-full flex items-center space-x-1"
                    >
                      <span>Tümü</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                  <div className="pl-4 space-y-1 pt-1">
                    {p.categories.map((c) => (
                      <a
                        key={c.id}
                        href={`/servis/${c.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full text-left px-2 py-2 text-xs text-purple-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-white font-bold px-2 py-0.5 rounded-full bg-white/20">
                          Seç ›
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLookupOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-xs font-semibold text-white bg-white/10"
              >
                <Search className="w-4 h-4 text-purple-200" />
                <span>Sipariş Sorgula</span>
              </button>

              <a
                href="https://wa.me/905331948396"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold bg-white text-[#7C1CF5]"
              >
                <MessageCircle className="w-4 h-4 text-[#7C1CF5]" />
                <span>7/24 WhatsApp (+90 533 194 83 96)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Sipariş Sorgulama Modalı */}
      <OrderLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} />
    </>
  );
}
