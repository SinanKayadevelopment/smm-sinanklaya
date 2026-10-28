import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularPackages from "@/components/PopularPackages";
import Testimonials from "@/components/Testimonials";
import InformationBoxes from "@/components/InformationBoxes";
import FloatingSupportWidgets from "@/components/FloatingSupportWidgets";
import Footer from "@/components/Footer";
import PlatformLogo from "@/components/PlatformLogo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

async function getData() {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
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

    const popularPackages = await prisma.package.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      orderBy: { sortOrder: "asc" },
      include: {
        category: {
          include: {
            platform: true,
          },
        },
      },
      take: 8,
    });

    return { platforms, popularPackages };
  } catch (err) {
    console.error("Veri yükleme hatası:", err);
    return { platforms: [], popularPackages: [] };
  }
}

export default async function HomePage() {
  const { platforms, popularPackages } = await getData();

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B] flex flex-col justify-between selection:bg-[#7C1CF5] selection:text-white">
      {/* 1. Üst Menü (Navbar) */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Bölümü & 5 Servis Butonu (Screenshot 2) */}
        <HeroSection initialPlatforms={platforms as any} />

        {/* 3. Çok Satanlar Vitrini (Screenshot 2) */}
        <PopularPackages packages={popularPackages as any} />

        {/* 4. Platformlara Göre Tüm Hizmetler Bölümü */}
        <section id="hizmetler" className="py-20 bg-white relative border-t border-[#EDE9FE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#7C1CF5]" />
                <span>Kapsamlı Destek Kataloğu</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1E1B4B] tracking-tight">
                Tüm Platformlar ve Yükseliş Kategorileri
              </h2>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                Hedeflediğiniz platforma özel tasarlanmış, algoritma uyumlu ve kesintisiz dijital
                destek çözümlerini keşfedin.
              </p>
            </div>

            {/* Platformlar ve Alt Kategoriler Listesi */}
            <div className="space-y-12">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  id={`platform-${platform.slug}`}
                  className="scroll-mt-28 rounded-3xl bg-[#FAF5FF] border border-[#EDE9FE] p-6 sm:p-8 hover:border-[#C084FC] transition-all duration-300 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#EDE9FE] gap-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-[#EDE9FE] shadow-md flex items-center justify-center p-2.5 shrink-0 group-hover:scale-105 transition-transform">
                        <PlatformLogo platform={platform.slug} size={36} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                          {platform.name} Destek Hizmetleri
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {platform.categories.length} farklı yükseliş ve büyüme kategorisi
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/servis/${platform.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs font-black bg-white text-[#7C1CF5] border border-[#EDE9FE] hover:bg-[#7C1CF5] hover:text-white transition shadow-sm flex items-center space-x-1.5 self-start sm:self-center"
                    >
                      <span>Tüm Paketleri Yeni Sekmede Aç</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {platform.categories.map((cat) => (
                      <div
                        key={cat.id}
                        id={`kategori-${platform.slug}-${cat.slug}`}
                        data-category-slug={cat.slug}
                        className="scroll-mt-32 rounded-3xl bg-white border border-[#EDE9FE] p-6 flex flex-col justify-between hover:border-[#7C1CF5] hover:shadow-xl transition-all duration-300 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <PlatformLogo platform={platform.slug} size={18} className="shrink-0" />
                              <h4 className="text-base font-black text-[#1E1B4B] group-hover:text-[#7C1CF5] transition-colors">
                                {cat.name}
                              </h4>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] shrink-0">
                              {cat.packages.length} Paket
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 font-medium">
                            {cat.shortDescription ||
                              "Kanalınızı ve profilinizi üst sıralara taşıyacak stabil çözümler."}
                          </p>
                        </div>

                        <div>
                          <div className="space-y-2 pt-3 border-t border-[#F3E8FF]">
                            {cat.packages.slice(0, 2).map((p) => (
                              <Link
                                key={p.id}
                                href={`/siparis-olustur/${p.slug}`}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#EDE9FE] text-xs transition duration-200 group/item"
                              >
                                <span className="font-semibold text-gray-700 group-hover/item:text-[#7C1CF5] truncate max-w-[170px]">
                                  {p.name}
                                </span>
                                <div className="flex items-center space-x-1 font-black text-[#7C1CF5] shrink-0">
                                  <span>{p.price.toFixed(2)} ₺</span>
                                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover/item:text-[#7C1CF5] group-hover/item:translate-x-0.5 transition-transform" />
                                </div>
                              </Link>
                            ))}
                          </div>

                          <a
                            href={`/servis/${cat.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#7C1CF5] bg-[#F3E8FF] hover:bg-[#7C1CF5] hover:text-white transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                          >
                            <span>Tüm Paketleri Gör (Yeni Sekme)</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Neden Bizi Tercih Etmelisiniz & Müşteri Değerlendirmeleri Bölümü */}
        <Testimonials />

        {/* 6. Genel Bilgilendirmeler Bölümü (10 Kutu) */}
        <InformationBoxes />
      </main>

      {/* 7. Sol Alt Büyüteç ve Sağ Alt Çevrim İçi Canlı Destek Butonları */}
      <FloatingSupportWidgets />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
