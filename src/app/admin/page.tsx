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
  Users,
  ShoppingBag,
  Target,
  Percent,
  Eye,
  MousePointerClick,
  BarChart2,
  Flame,
  Zap,
  RefreshCw,
  ArrowUpRight,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [last7DaysChart, setLast7DaysChart] = useState<any[]>([]);
  const [topPackages, setTopPackages] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<"all" | "visitors" | "sales">("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLast7DaysChart(data.last7DaysChart || []);
        setTopPackages(data.topPackages || []);
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

  // Grafik hesaplamaları
  const maxVisitors = Math.max(
    ...(last7DaysChart.map((d) => d.visitors) || [1]),
    1
  );
  const maxOrders = Math.max(
    ...(last7DaysChart.map((d) => d.ordersCount) || [1]),
    1
  );

  const total7DayVisitors = last7DaysChart.reduce((acc, d) => acc + (d.visitors || 0), 0);
  const total7DayOrders = last7DaysChart.reduce((acc, d) => acc + (d.ordersCount || 0), 0);
  const total7DayRevenue = last7DaysChart.reduce((acc, d) => acc + (d.revenue || 0), 0);

  const activeDay =
    selectedDayIndex !== null && last7DaysChart[selectedDayIndex]
      ? last7DaysChart[selectedDayIndex]
      : last7DaysChart[last7DaysChart.length - 1]; // Varsayılan olarak bugünü göster

  const maxPackageViews = Math.max(
    ...(topPackages.map((p) => p.viewCount) || [1]),
    1
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Sayfa Başlığı ve Canlı Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white">Yönetim ve Performans Özeti</h1>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Canlı Takip</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Site ziyaretçi trafiği, satış dönüşüm hunisi, paket ilgisi ve sipariş hareketleri.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-[#0F172A] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            title="Verileri Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
          </button>
          <Link
            href="/admin/settings"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span>Takip Kodları</span>
          </Link>
          <Link
            href="/admin/orders?paymentStatus=PENDING&paymentMethod=EFT_HAVALE"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Bekleyen Havaleler ({stats?.pendingEftCount || 0})</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Yeni Paket</span>
          </Link>
        </div>
      </div>

      {/* 2. Site Trafik & Dönüşüm Metrikleri (4 Ana Kart) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kart 1: Bugün Gelen Ziyaretçi Sayısı */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#131D33] border border-cyan-500/20 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Bugün Gelen Ziyaretçi
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              {stats ? stats.todayVisitorsCount : 0}
            </span>
            <span className="text-xs text-gray-400 font-medium">tekil kişi</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-gray-800/80">
            <span className="text-gray-400">Sayfa Görüntüleme:</span>
            <span className="font-bold text-cyan-300">
              {stats ? stats.todayViewsCount : 0} hit
            </span>
          </div>
        </div>

        {/* Kart 2: Sipariş Adımına Geçenler (Sepete Ulaşan) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#131D33] border border-blue-500/20 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Sipariş Adımına Geçen
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              {stats ? stats.uniqueCheckoutVisitors : 0}
            </span>
            <span className="text-xs text-gray-400 font-medium">tekil kullanıcı</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-gray-800/80">
            <span className="text-gray-400">Ziyaretçiden Sepete Oran:</span>
            <span className="font-bold text-blue-300">
              %{stats ? stats.visitorToCheckoutRate : 0}
            </span>
          </div>
        </div>

        {/* Kart 3: Sepet / Ödeme Dönüşüm Oranı (%) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1a1233] border border-purple-500/30 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Sepet ➔ Satın Alma Oranı
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-[#9146FF] group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              %{stats ? stats.checkoutToPurchaseRate : 0}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
              CR (Conversion)
            </span>
          </div>
          {/* İlerleme çubuğu */}
          <div className="mt-3 pt-2.5 border-t border-gray-800/80">
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, stats ? stats.checkoutToPurchaseRate : 0))}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1.5">
              <span>Sepetten Tamamlanan Sipariş</span>
              <span className="font-bold text-white">{stats ? stats.effectivePurchases : 0} adet</span>
            </div>
          </div>
        </div>

        {/* Kart 4: Genel Ziyaretçi Satın Alma Oranı */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0c1f19] border border-emerald-500/30 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Genel Satış Dönüşümü
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#53FC18] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#53FC18]">
              %{stats ? stats.visitorToPurchaseRate : 0}
            </span>
            <span className="text-xs text-gray-400 font-medium">tüm trafik</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-gray-800/80">
            <span className="text-gray-400">Toplam Başarılı Satış:</span>
            <span className="font-bold text-emerald-400">
              {stats ? stats.paidOrdersCount : 0} sipariş
            </span>
          </div>
        </div>
      </div>

      {/* 3. İki Sütunlu Bölüm: Sol: 7 Günlük Ziyaretçi & Satış Grafiği | Sağ: En Çok Tıklanan İlk 5 Paket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Son 7 Günlük Ziyaretçi ve Satış Grafiği (8 Col) */}
        <div className="lg:col-span-7 xl:col-span-8 p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-[#9146FF]" />
                <h3 className="text-base font-bold text-white">
                  Son 7 Günlük Ziyaretçi ve Satış Grafiği
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Günlük tekil ziyaretçi hacmi ile sipariş/satış adetlerinin karşılaştırmalı performansı.
              </p>
            </div>

            {/* Görünüm Filtresi */}
            <div className="flex items-center space-x-1 p-1 bg-[#1E293B] rounded-xl text-xs">
              <button
                onClick={() => setChartMode("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chartMode === "all"
                    ? "bg-[#9146FF] text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setChartMode("visitors")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chartMode === "visitors"
                    ? "bg-[#9146FF] text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Ziyaretçi
              </button>
              <button
                onClick={() => setChartMode("sales")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chartMode === "sales"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Satış
              </button>
            </div>
          </div>

          {/* Grafik Alanı */}
          <div className="space-y-4">
            {/* Canlı Gösterge & Lejant */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-2">
              <div className="flex items-center space-x-4">
                {(chartMode === "all" || chartMode === "visitors") && (
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#9146FF]"></span>
                    <span>Tekil Ziyaretçi ({total7DayVisitors})</span>
                  </div>
                )}
                {(chartMode === "all" || chartMode === "sales") && (
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#53FC18]"></span>
                    <span>Satış / Sipariş ({total7DayOrders})</span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-500 hidden sm:block">
                Detaylar için sütunların üzerine geliniz
              </div>
            </div>

            {/* Sütun Grafiği */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-gray-800">
              {last7DaysChart.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const visitorHeightPercent = Math.max(
                  8,
                  Math.round((day.visitors / maxVisitors) * 100)
                );
                const orderHeightPercent = Math.max(
                  6,
                  Math.round((day.ordersCount / maxOrders) * 100)
                );

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setSelectedDayIndex(idx)}
                    className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer relative"
                  >
                    {/* Hover Tooltip Balonu */}
                    {isSelected && (
                      <div className="absolute -top-16 z-20 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl text-[11px] whitespace-nowrap pointer-events-none transform -translate-y-2">
                        <div className="font-bold text-white text-xs mb-1">
                          {day.label} ({day.dayName})
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-purple-300">
                            👥 {day.visitors} Ziyaretçi
                          </span>
                          <span className="text-emerald-400">
                            🛍️ {day.ordersCount} Satış ({day.revenue.toFixed(2)} ₺)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Çift Sütun Bar Grubu */}
                    <div className="w-full max-w-[48px] h-full flex items-end justify-center space-x-1.5">
                      {/* Ziyaretçi Sütunu (Mor) */}
                      {(chartMode === "all" || chartMode === "visitors") && (
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 relative group-hover:brightness-125"
                          style={{
                            height: `${visitorHeightPercent}%`,
                            background:
                              idx === last7DaysChart.length - 1
                                ? "linear-gradient(180deg, #C084FC 0%, #9146FF 100%)"
                                : "linear-gradient(180deg, #9146FF 0%, #6005BA 100%)",
                          }}
                        >
                          {/* Sütun Üzerindeki Değer */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.visitors}
                          </div>
                        </div>
                      )}

                      {/* Satış Sütunu (Yeşil) */}
                      {(chartMode === "all" || chartMode === "sales") && (
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 relative group-hover:brightness-125"
                          style={{
                            height: `${orderHeightPercent}%`,
                            background:
                              "linear-gradient(180deg, #53FC18 0%, #209907 100%)",
                          }}
                        >
                          {/* Sütun Üzerindeki Değer */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.ordersCount}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gün Etiketi */}
                    <div className="mt-2 text-center">
                      <span
                        className={`text-[11px] block font-bold ${
                          idx === last7DaysChart.length - 1
                            ? "text-[#53FC18]"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {day.label}
                      </span>
                      <span className="text-[9px] text-gray-500 block">
                        {day.dayName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seçili Gün Özeti Kartı */}
            {activeDay && (
              <div className="p-3.5 rounded-2xl bg-[#1E293B]/70 border border-gray-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                    {activeDay.label} Detayları
                  </span>
                  <span className="text-gray-400 font-medium">
                    {activeDay.dayName} günü kaydedilen canlı hareketler
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-gray-400 text-[11px] block">Tekil Ziyaretçi</span>
                    <span className="text-sm font-black text-white">{activeDay.visitors} kişi</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Sayfa Görüntüleme</span>
                    <span className="text-sm font-black text-cyan-400">{activeDay.views} hit</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Verilen Sipariş</span>
                    <span className="text-sm font-black text-emerald-400">{activeDay.ordersCount} adet</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Günün Cirosu</span>
                    <span className="text-sm font-black text-white">{activeDay.revenue.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kolon: En Çok Tıklanan İlk 5 Paket (4 Col) */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">En Çok Tıklanan 5 Paket</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                Popülerlik
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Kullanıcıların site genelinde en çok incelediği ve sepet adımı başlattığı paketler.
            </p>

            {/* Paket Listesi */}
            <div className="mt-4 space-y-2.5">
              {topPackages.slice(0, 5).map((pkg, idx) => {
                const rankColors = [
                  "bg-amber-400 text-gray-950 font-black", // #1 Altın
                  "bg-gray-300 text-gray-950 font-bold",   // #2 Gümüş
                  "bg-amber-700 text-white font-bold",     // #3 Bronz
                  "bg-gray-800 text-gray-300 font-medium", // #4
                  "bg-gray-800 text-gray-300 font-medium", // #5
                ];

                const viewPercent = Math.max(
                  10,
                  Math.round((pkg.viewCount / maxPackageViews) * 100)
                );

                return (
                  <div
                    key={pkg.id || idx}
                    className="p-3 rounded-2xl bg-[#1E293B]/70 border border-gray-700/60 hover:border-gray-600 transition group space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {/* Sıralama Rozeti */}
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                            rankColors[idx] || "bg-gray-800 text-gray-300"
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition" title={pkg.name}>
                            {pkg.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                            <span
                              className="font-semibold"
                              style={{ color: pkg.platformColor || "#9146FF" }}
                            >
                              {pkg.platformName}
                            </span>
                            <span>•</span>
                            <span>{pkg.categoryName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-emerald-400">
                          {pkg.price ? pkg.price.toFixed(2) : "0.00"} ₺
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center justify-end space-x-1">
                          <MousePointerClick className="w-3 h-3 text-cyan-400" />
                          <span className="font-bold text-white">{pkg.viewCount}</span>
                          <span>hit</span>
                        </div>
                      </div>
                    </div>

                    {/* Popülerlik İlerleme Çizgisi */}
                    <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-[#9146FF] to-cyan-400 transition-all duration-500"
                        style={{ width: `${viewPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {topPackages.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-500">
                  Henüz paket tıklama verisi oluşmadı.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/admin/services"
            className="w-full py-2.5 px-3 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span>Tüm Hizmet & Paketleri Yönet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Finansal Özet Metrikleri (Orijinal 5 Kart) */}
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

      {/* 5. Son Sipariş Hareketleri Tablosu */}
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
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Henüz kayıtlı bir sipariş bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
