"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, BookOpen, Star, ShieldCheck, Zap } from "lucide-react";
import { SeoPageData } from "@/lib/seo-data";

interface SeoContentSectionProps {
  seoData: SeoPageData;
  platformName?: string;
  categoryName?: string;
}

export default function SeoContentSection({
  seoData,
  platformName,
  categoryName,
}: SeoContentSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#F8F9FD] border-t border-[#EDE9FE] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* 1. Müşteri Puanı & Güven Rozeti (Yıldızlı Google Görünümü Bannerı) */}
        <div className="bg-gradient-to-r from-[#F3E8FF] via-white to-[#F3E8FF] border border-[#DDD6FE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-extrabold text-[#1E1B4B]">
                {seoData.ratingValue} / 5.0
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1E1B4B]">
              Google Doğrulanmış Müşteri Memnuniyeti
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Bu kategori için toplam <strong>{seoData.reviewCount}</strong> gerçek kullanıcı değerlendirmesi ve <strong>%99.8</strong> memnuniyet oranı.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#DDD6FE] shadow-sm flex items-center space-x-2 text-xs font-bold text-[#7C1CF5]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>%100 Şifresiz & Ban Risksiz</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#7C1CF5] text-white shadow-md shadow-purple-600/20 flex items-center space-x-2 text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Anında Teslimat</span>
            </div>
          </div>
        </div>

        {/* 2. SEO Makale ve Rehber Alanı */}
        <article className="space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{seoData.badgeText} Rehberi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
              {seoData.h2}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              {seoData.articleIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {seoData.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-[0_4px_20px_rgba(124,28,245,0.03)] hover:border-[#C084FC] transition-all space-y-3"
              >
                <h3 className="text-base sm:text-lg font-bold text-[#1E1B4B] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#7C1CF5] shrink-0" />
                  <span>{sec.title}</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {sec.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* 3. Sıkça Sorulan Sorular (SSS / FAQ Accordion) */}
        {seoData.faqs && seoData.faqs.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7C1CF5] text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Sıkça Sorulan Sorular</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
                {platformName || "Yayıncı"} Hizmetleri Hakkında Merak Edilenler
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Sipariş süreci, teslimat koşulları ve teknik altyapımızla ilgili en çok sorulan soruların yanıtları.
              </p>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {seoData.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-[#EDE9FE] rounded-2xl bg-white overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1E1B4B] hover:text-[#7C1CF5] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#F3E8FF] text-[#7C1CF5] text-xs font-black flex items-center justify-center shrink-0">
                          ?
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#7C1CF5] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-50 bg-[#FAF5FF]/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
