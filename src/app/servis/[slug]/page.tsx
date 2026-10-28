import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlatformLogo from "@/components/PlatformLogo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Tv,
  Video,
  Share2,
  Globe,
  MessageCircle,
} from "lucide-react";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getServiceData(slug: string) {
  // 1. Önce doğrudan Platform slug'ı kontrolü (Örn: /servis/twitch, /servis/kick)
  const platform = await prisma.platform.findUnique({
    where: { slug: slug },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          packages: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (platform) {
    // Platforma ait tüm aktif paketleri topla
    const allPackages = platform.categories.flatMap((c) => c.packages);
    return {
      isAll: true,
      platform,
      category: {
        id: "all",
        name: "Tüm",
        slug: platform.slug,
        shortDescription: `${platform.name} kanalınız ve içerikleriniz için en kaliteli, stabil ve garantili yükseliş paketleri.`,
      },
      packages: allPackages,
      otherCategories: platform.categories,
    };
  }

  // 2. Kategori slug'ı ile ara (Örn: /servis/twitch-saatlik-canli-izleyici veya fallback saatlik-canli-izleyici)
  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: slug },
        { slug: slug.replace(/^([a-z0-9]+)-/, "") },
      ],
      isActive: true,
    },
    include: {
      platform: {
        include: {
          categories: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      packages: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (category) {
    return {
      isAll: false,
      platform: category.platform,
      category,
      packages: category.packages || [],
      otherCategories: category.platform.categories || [],
    };
  }

  return null;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getServiceData(slug);
  if (!data) {
    return {
      title: "Hizmet Bulunamadı | Yayıncı Kral",
    };
  }

  const title = data.isAll
    ? `${data.platform.name} Paketleri Satın Al | Yayıncı Kral`
    : `${data.platform.name} ${data.category.name} Satın Al | Yayıncı Kral`;

  const description =
    data.category.shortDescription ||
    `${data.platform.name} ${data.category.name} hizmetleri en ucuz fiyatlar, 7/24 anlık teslimat ve %100 şifresiz işlem garantisiyle Yayıncı Kral'da.`;

  return {
    title,
    description,
    keywords: [
      `${data.platform.name.toLowerCase()} satın al`,
      `${data.platform.name.toLowerCase()} izleyici`,
      `${data.category.name.toLowerCase()}`,
      "yayıncı kral",
      "yayincikral",
    ],
    openGraph: {
      title,
      description,
      siteName: "Yayıncı Kral",
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const serviceData = await getServiceData(slug);

  if (!serviceData) {
    notFound();
  }

  const { platform, category, packages, otherCategories } = serviceData;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B] flex flex-col justify-between selection:bg-[#7C1CF5] selection:text-white">
      {/* 1. Üst Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Botcubey Mor Geometrik Banner Başlık Bölümü */}
        <section className="relative bg-gradient-to-br from-[#7C1CF5] via-[#6D14DF] to-[#5500B8] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Geometrik Facet / Low-Poly Poligon Deseni */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 1440 600"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,0 320,0 160,260" fill="#FFFFFF" opacity="0.12" />
              <polygon points="320,0 680,0 480,210" fill="#9D4EDD" opacity="0.25" />
              <polygon points="680,0 1060,0 880,280" fill="#C77DFF" opacity="0.18" />
              <polygon points="1060,0 1440,0 1250,220" fill="#FFFFFF" opacity="0.15" />
              <polygon points="0,0 160,260 0,440" fill="#3C096C" opacity="0.3" />
              <polygon points="160,260 480,210 360,460" fill="#FFFFFF" opacity="0.1" />
              <polygon points="480,210 880,280 640,490" fill="#9D4EDD" opacity="0.2" />
              <polygon points="880,280 1250,220 1100,470" fill="#C77DFF" opacity="0.15" />
              <polygon points="1250,220 1440,0 1440,420" fill="#3C096C" opacity="0.25" />
              <polygon points="0,440 360,460 200,600" fill="#240046" opacity="0.35" />
              <polygon points="360,460 640,490 520,600" fill="#5A189A" opacity="0.2" />
              <polygon points="640,490 1100,470 900,600" fill="#FFFFFF" opacity="0.08" />
              <polygon points="1100,470 1440,420 1320,600" fill="#7B2CBF" opacity="0.2" />
            </svg>
          </div>

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            {/* Büyük Platform Logo Rozeti */}
            <div className="mx-auto w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-3.5 transform hover:scale-105 transition duration-300 border-2 border-white/60">
              <PlatformLogo platform={platform?.slug || slug} size={56} />
            </div>

            {/* Başlık */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              {platform?.name} {category.name} Paketleri
            </h1>

            {/* Açıklama Metni */}
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-purple-100 font-medium leading-relaxed">
              {category.shortDescription ||
                `${platform?.name} canlı yayınlarınızın etkileşimini ve görünürlüğünü artırarak daha geniş kitlelere ulaşın! Hızlı, güvenilir ve uygun fiyatlı yükseliş paketlerimiz sayesinde kanalınızı güçlendirin, topluluğunuzu ve etkileşiminizi artırın. Şimdi hedeflerinize daha hızlı ulaşın!`}
            </p>

            {/* Kategori Değiştirme Butonları (Pills) */}
            {otherCategories.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href={`/servis/${platform?.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                    category.id === "all"
                      ? "bg-white text-[#7C1CF5] scale-105 shadow-purple-900/30 font-black"
                      : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-md"
                  }`}
                >
                  Tüm Paketler
                </Link>
                {otherCategories.map((cat) => {
                  const isActive = cat.id === category.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/servis/${cat.slug}`}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                        isActive
                          ? "bg-white text-[#7C1CF5] scale-105 shadow-purple-900/30 font-black"
                          : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-md"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Yumuşak Dalgalı Alt Geçiş */}
          <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className="relative block w-full h-12 sm:h-16"
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

        {/* 3. Paket Kartları Grid Bölümü */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {packages.map((pkg) => {
              let featureList: string[] = [];
              try {
                featureList = JSON.parse(pkg.features);
              } catch (e) {
                featureList = [
                  "Anlık Başlar",
                  `${pkg.quantity} Destek`,
                  "Stabil Performans",
                ];
              }

              return (
                <div
                  key={pkg.id}
                  className="relative p-6 flex flex-col justify-between rounded-3xl bg-white border border-[#EDE9FE] shadow-[0_10px_30px_rgba(124,28,245,0.06)] hover:shadow-[0_20px_40px_rgba(124,28,245,0.18)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
                >
                  {/* Arka Plan Filigran İkonu */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform flex items-center justify-center opacity-15">
                    <PlatformLogo platform={platform?.slug || slug} size={70} />
                  </div>

                  <div>
                    {/* Platform Adı & Resmi Logo */}
                    <div className="flex items-center justify-center space-x-2 mb-1.5">
                      <PlatformLogo platform={platform?.slug || slug} size={18} />
                      <span className="text-sm font-black text-[#7C1CF5] tracking-tight">
                        {platform?.name}
                      </span>
                    </div>

                    {/* Paket Adı */}
                    <h3 className="text-sm font-bold text-[#1E1B4B] text-center mb-4 min-h-[40px] flex items-center justify-center">
                      {pkg.name}
                    </h3>

                    {/* Özellikler Listesi */}
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
                    {/* Fiyat Etiketi Rozeti */}
                    <div className="text-center mb-3">
                      <div className="inline-block px-5 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] font-black text-base shadow-sm">
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
                      <span>Satın Al</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {packages.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#EDE9FE] shadow-sm">
              <p className="text-gray-500 font-medium">
                Bu kategori için paketler hazırlanmaktadır. Lütfen canlı destek üzerinden bilgi alınız.
              </p>
            </div>
          )}
        </section>

        {/* 4. Güven Rozetleri */}
        <section className="bg-white border-t border-[#EDE9FE] py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#7C1CF5] flex items-center justify-center mx-auto font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#1E1B4B]">Anında Başlangıç</h4>
              <p className="text-xs text-gray-500">
                Siparişiniz onaylandığı anda sistem otomatik olarak gönderimi başlatır.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#7C1CF5] flex items-center justify-center mx-auto font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#1E1B4B]">%100 Şifresiz & Güvenli</h4>
              <p className="text-xs text-gray-500">
                Hiçbir paketimizde hesap şifreniz istenmez. Yalnızca hedef kanal bağlantınız yeterlidir.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#7C1CF5] flex items-center justify-center mx-auto font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#1E1B4B]">7/24 Canlı Destek</h4>
              <p className="text-xs text-gray-500">
                Tüm sorularınız ve talepleriniz için WhatsApp destek ekibimiz kesintisiz yanınızdadır.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sağ Alttaki Canlı Destek Butonu */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
        <div className="hidden sm:block bg-white text-[#1E1B4B] px-3.5 py-2 rounded-2xl shadow-xl text-xs font-bold border border-[#EDE9FE] animate-bounce">
          Merhaba! Size nasıl yardımcı olabilirim?
        </div>
        <a
          href="https://wa.me/905331948396"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-[#7C1CF5] hover:bg-[#6005BA] shadow-2xl hover:scale-105 transition-all"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-pulse"></span>
          <span>Çevrim içi</span>
          <span className="ml-1 w-5 h-5 rounded-full bg-white text-[#7C1CF5] text-[10px] font-black flex items-center justify-center">
            1
          </span>
        </a>
      </div>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
