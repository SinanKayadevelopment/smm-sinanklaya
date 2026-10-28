"use client";

import React, { useState } from "react";
import { Search, X, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderLookupModal({ isOpen, onClose }: OrderLookupModalProps) {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderCode.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Sipariş bulunamadı. Lütfen kodunuzu kontrol ediniz.");
      } else {
        setOrderData(data.order);
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu, lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { text: "Tamamlandı", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "IN_PROGRESS":
        return { text: "İşleniyor & Aktarılıyor", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "PROCESSING":
        return { text: "Hazırlanıyor", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "WAITING":
        return { text: "Ödeme / Onay Bekliyor", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      default:
        return { text: status, color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0C1833] border border-[#1A3060] p-6 sm:p-7 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sipariş Durumu Sorgula</h3>
            <p className="text-xs text-gray-400">Sipariş kodunuz ile anlık teslimat durumunu öğrenin.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Sipariş Kodunuz (Örn: DST-849201)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="DST-XXXXXX"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                className="w-full input-theme px-4 py-3 text-sm font-mono tracking-wider uppercase placeholder-gray-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl btn-theme text-xs font-bold disabled:opacity-50 transition flex items-center space-x-1"
              >
                {loading ? "Sorgulanıyor..." : "Sorgula"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {orderData && (
          <div className="mt-6 p-4 rounded-2xl bg-[#0F1E3D] border border-[#1A3060] space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A3060]/70">
              <span className="text-xs text-gray-400">Sipariş No:</span>
              <span className="text-xs font-mono font-bold text-[#00F2FE]">{orderData.orderCode}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Paket:</span>
              <span className="text-xs font-medium text-white text-right">
                {orderData.platformName} - {orderData.packageName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Hedef Bağlantı:</span>
              <span className="text-xs font-mono text-cyan-300 truncate max-w-[200px]">
                {orderData.targetLink}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Durum:</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  getStatusBadge(orderData.orderStatus).color
                }`}
              >
                {getStatusBadge(orderData.orderStatus).text}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Tutar:</span>
              <span className="text-xs font-bold text-[#00F2FE]">
                {orderData.totalAmount.toFixed(2)} ₺
              </span>
            </div>

            <div className="pt-2">
              <Link
                href={`/siparis-sorgula?kod=${orderData.orderCode}`}
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-1 py-2 text-xs text-[#00F2FE] hover:text-[#38BDF8] hover:underline font-bold"
              >
                <span>Detaylı Takip Sayfasını Görüntüle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
