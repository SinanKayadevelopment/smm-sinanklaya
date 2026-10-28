"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Settings,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (e) {
      console.error("Dashboard verisi alınamadı:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Sayfa Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Yönetim ve Performans Özeti</h1>
          <p className="text-xs text-gray-400 mt-1">
            Platform cirosu, sipariş durumları ve anlık tedarik hattı istatistikleri.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/orders?paymentStatus=PENDING&paymentMethod=EFT_HAVALE"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Bekleyen Havaleleri Gör</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Yeni Paket Ekle</span>
          </Link>
        </div>
      </div>

      {/* 5 Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Bugünkü Ciro */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Bugünkü Ciro</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.todayRevenue.toFixed(2) : "0.00"} ₺
          </div>
          <p className="text-[11px] text-gray-500">Bugün onaylanan ödemeler</p>
        </div>

        {/* 2. Bu Ayki Ciro */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Bu Ayki Ciro</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.monthRevenue.toFixed(2) : "0.00"} ₺
          </div>
          <p className="text-[11px] text-gray-500">Ay başından itibaren toplam</p>
        </div>

        {/* 3. Toplam Sipariş */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Toplam Sipariş</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-[#9146FF]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.totalOrdersCount : 0}
          </div>
          <p className="text-[11px] text-gray-500">Kayıtlı tüm talepler</p>
        </div>

        {/* 4. Bekleyen EFT/Havale */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Bekleyen Havale</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats ? stats.pendingEftCount : 0}
          </div>
          <p className="text-[11px] text-gray-500">Onay bekleyen bildirimler</p>
        </div>

        {/* 5. Hatalı Sipariş */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Hatalı Sipariş</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-400">
            {stats ? stats.errorOrdersCount : 0}
          </div>
          <p className="text-[11px] text-gray-500">Müdahale bekleyenler</p>
        </div>
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white">Son Sipariş Hareketleri</h3>
            <p className="text-xs text-gray-400">En son oluşturulan 6 siparişin canlı durumu.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#9146FF] hover:underline flex items-center space-x-1"
          >
            <span>Tüm Siparişleri Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-3 px-2 font-semibold">Sipariş No</th>
                <th className="py-3 px-2 font-semibold">Müşteri</th>
                <th className="py-3 px-2 font-semibold">Hizmet / Paket</th>
                <th className="py-3 px-2 font-semibold">Tutar</th>
                <th className="py-3 px-2 font-semibold">Ödeme</th>
                <th className="py-3 px-2 font-semibold">Durum</th>
                <th className="py-3 px-2 font-semibold text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-2 font-mono font-bold text-purple-300">
                    {ord.orderCode}
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-white">{ord.customerName}</div>
                    <div className="text-[11px] text-gray-500">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="font-medium text-gray-200">
                      {ord.package.category.platform.name} - {ord.package.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-bold text-emerald-400">
                    {ord.totalAmount.toFixed(2)} ₺
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {ord.paymentStatus === "PAID" ? "ÖDENDİ" : "BEKLİYOR"}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-gray-300">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-gray-500 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
