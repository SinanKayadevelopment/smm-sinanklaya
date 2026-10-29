"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Copy,
  AlertCircle,
  Home,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code") || searchParams.get("kod") || "";
  const status = searchParams.get("status") || "success";
  const isFailed = status === "failed";

  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F9FD]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full">
          {isFailed ? (
            /* Başarısız Ödeme Kartı */
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-100 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black uppercase tracking-wider">
                  Ödeme Tamamlanamadı
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] mt-3">
                  Ödeme İşlemi İptal Edildi
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                  Shopier üzerinden gerçekleştirilen ödeme işlemi onaylanamadı veya iptal edildi. Kartınızdan herhangi bir ücret çekilmediyse tekrar deneyebilirsiniz.
                </p>
              </div>

              {orderCode && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[11px] text-gray-400 block font-semibold">Sipariş Kodunuz:</span>
                    <span className="font-mono text-sm font-black text-gray-800">{orderCode}</span>
                  </div>
                  <Link
                    href={`/siparis-sorgula?kod=${orderCode}`}
                    className="text-xs font-bold text-[#7C1CF5] hover:underline"
                  >
                    Detayları İncele
                  </Link>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#7C1CF5] text-white text-xs font-bold hover:bg-[#6005BA] transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30"
                >
                  <Home className="w-4 h-4" />
                  <span>Ana Sayfaya Dön</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Başarılı Ödeme Kartı */
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE9FE] shadow-[0_20px_50px_rgba(124,28,245,0.08)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Kutlama Rozeti */}
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-11 h-11" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md">
                  <div className="w-4 h-4 rounded-full bg-[#7C1CF5] flex items-center justify-center text-white text-[9px] font-black">
                    ✓
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider border border-emerald-100">
                  Shopier 3D Secure Doğrulandı
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] mt-3">
                  Ödemeniz Başarıyla Alındı!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                  Tebrikler! Yükseliş siparişiniz başarıyla onaylandı ve anlık tedarik hattına iletildi. Gönderiminiz en kısa sürede profilinize/kanalınıza yansıyacaktır.
                </p>
              </div>

              {/* Sipariş Kodu Kartı */}
              {orderCode && (
                <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[11px] text-gray-400 block font-semibold">Takip Kodunuz:</span>
                    <span className="font-mono text-base font-black text-[#7C1CF5]">{orderCode}</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#EDE9FE] text-xs font-bold text-gray-700 hover:text-[#7C1CF5] hover:border-[#7C1CF5] transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
                  </button>
                </div>
              )}

              {/* Bilgilendirme Adımları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Otomatik Başlangıç</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Sistem siparişinizi kuyruğa aldı, işlem dakikalar içinde profilinize aktarılacaktır.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Garantili Teslimat</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Tüm işlemlerimiz %100 şifresiz, güvenli ve telafi garantilidir.
                  </p>
                </div>
              </div>

              {/* Eylem Butonları */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {orderCode && (
                  <Link
                    href={`/siparis-sorgula?kod=${orderCode}`}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#7C1CF5] text-white text-xs font-black uppercase tracking-wider hover:bg-[#6005BA] transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30"
                  >
                    <span>Canlı Durumu Takip Et</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Ana Sayfaya Dön</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#7C1CF5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
