"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function OrderLookupContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("kod") || "";

  const [orderCode, setOrderCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const fetchOrder = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(codeToSearch.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Belirtilen sipariş koduna ait kayıt bulunamadı.");
      } else {
        setOrder(data.order);
      }
    } catch (e) {
      setError("Sorgulama esnasında bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderCode);
  };

  const getOrderStatusConfig = (currentOrder: any) => {
    const status = currentOrder?.orderStatus;
    const title = currentOrder?.statusTitle || "Siparişiniz Alındı";
    const description = currentOrder?.statusDescription || "İşleminiz sistemimiz tarafından kontrol edilmektedir.";
    const progress = currentOrder?.progressPercent ?? 30;

    let badge = "bg-gray-500/20 text-gray-400 border-gray-500/30";
    if (status === "COMPLETED") {
      badge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    } else if (status === "IN_PROGRESS") {
      badge = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    } else if (status === "PROCESSING") {
      badge = "bg-purple-500/20 text-purple-400 border-purple-500/30";
    } else if (status === "WAITING") {
      badge = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    } else if (status === "ERROR") {
      badge = "bg-red-500/20 text-red-400 border-red-500/30";
    }

    return {
      title,
      description,
      badge,
      progress,
    };
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col justify-between selection:bg-[#00F2FE] selection:text-[#060B18]">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Parıltı Efektleri */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00F2FE]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          {/* Başlık */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Canlı Sipariş Sorgulama</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sipariş Durumu Takip Merkezi
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
              Siparişinizi oluştururken size iletilen <strong className="text-[#00F2FE]">DST-XXXXXX</strong> kodunu girerek
              anlık teslimat ve tedarik durumunu canlı izleyin.
            </p>
          </div>

          {/* Sorgulama Kartı */}
          <div className="rounded-3xl bg-[#0C1833] border border-[#1A3060] p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-semibold text-gray-300">
                Sipariş Takip Numaranız
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Örn: DST-849201"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  className="flex-1 input-theme font-mono tracking-wider text-sm placeholder-gray-500 uppercase px-4 py-3"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-8 rounded-xl btn-theme text-xs uppercase tracking-wider disabled:opacity-50 font-black"
                >
                  {loading ? "Sorgulanıyor..." : "Siparişi Bul"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Sonuç Kartı */}
          {order && (
            <div className="rounded-3xl bg-[#0C1833] border border-[#1A3060] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
              {/* İlerleme Çubuğu */}
              <div className="space-y-3 pb-6 border-b border-[#1A3060]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {getOrderStatusConfig(order).title}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-bold ${
                      getOrderStatusConfig(order).badge
                    }`}
                  >
                    %{getOrderStatusConfig(order).progress} Tamamlandı
                  </span>
                </div>

                <div className="w-full bg-[#060B18] h-3 rounded-full overflow-hidden border border-[#1A3060]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-white rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(0,242,254,0.6)]"
                    style={{ width: `${getOrderStatusConfig(order).progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400">
                  {getOrderStatusConfig(order).description}
                </p>
              </div>

              {/* Sipariş Detayları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                  <span className="text-gray-400 block mb-1">Sipariş Kodu</span>
                  <span className="font-mono font-black text-sm text-[#00F2FE]">
                    {order.orderCode}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                  <span className="text-gray-400 block mb-1">Müşteri (KVKK Maskeli)</span>
                  <span className="font-semibold text-white">{order.customerName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                  <span className="text-gray-400 block mb-1">Hizmet / Paket</span>
                  <span className="font-semibold text-white">
                    {order.platformName} — {order.packageName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                  <span className="text-gray-400 block mb-1">Ödenen Tutar</span>
                  <span className="font-black text-[#00F2FE] text-sm">
                    {order.totalAmount.toFixed(2)} ₺
                  </span>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060]">
                  <span className="text-gray-400 block mb-1">Hedef Kanal / Profil Linki</span>
                  <a
                    href={order.targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-cyan-300 hover:text-white hover:underline flex items-center space-x-1.5 break-all transition-colors"
                  >
                    <span>{order.targetLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#00F2FE]" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderLookupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060B18]" />}>
      <OrderLookupContent />
    </Suspense>
  );
}
