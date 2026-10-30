"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
  CheckCircle,
  X,
  DollarSign,
  AlertTriangle,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sliders,
  ExternalLink,
} from "lucide-react";

interface ServiceItem {
  service: number | string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

interface Platform {
  id: string;
  name: string;
  categories: { id: string; name: string }[];
}

interface SyncItem {
  packageId: string;
  packageName: string;
  platform: string;
  category: string;
  oldServiceId: number;
  newServiceId: number;
  serviceName: string;
  serviceCategory: string;
  min: number;
  max: number;
  rateUSD: number;
  oldQuantity: number;
  newQuantity: number;
  costUSD: number;
  costTRY: number;
  oldPrice: number;
  newPrice: number;
  status: "UPDATED" | "MATCHED" | "UNMATCHED";
}

interface SyncSummary {
  totalPackages: number;
  matchedCount: number;
  unmatchedCount: number;
  updatedCount: number;
  results: SyncItem[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Otomatik Eşleştirme (Sync) Durumu
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<SyncSummary | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncModalSearch, setSyncModalSearch] = useState("");

  // Manuel Paket Ekleme Modal Durumu
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [features, setFeatures] = useState("Anlık Başlar\nStabil Görünürlük\n7/24 Kesintisiz Destek");
  const [isPopular, setIsPopular] = useState(false);
  const [saving, setSaving] = useState(false);

  // Yeni Kategori Ekleme Durumu
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !selectedPlatformId) return;
    try {
      setCreatingCategory(true);
      const res = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: selectedPlatformId,
          name: newCategoryName.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.category) {
        setPlatforms((prev) =>
          prev.map((p) => {
            if (p.id === selectedPlatformId) {
              const alreadyExists = p.categories.some((c) => c.id === data.category.id);
              return {
                ...p,
                categories: alreadyExists ? p.categories : [...p.categories, data.category],
              };
            }
            return p;
          })
        );
        setSelectedCategoryId(data.category.id);
        setNewCategoryName("");
        setIsAddingCategory(false);
      } else {
        alert(data.message || "Kategori oluşturulamadı.");
      }
    } catch (e) {
      alert("Kategori oluşturulurken hata meydana geldi.");
    } finally {
      setCreatingCategory(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
        setPlatforms(data.platforms);
        if (data.platforms.length > 0) {
          setSelectedPlatformId(data.platforms[0].id);
          if (data.platforms[0].categories.length > 0) {
            setSelectedCategoryId(data.platforms[0].categories[0].id);
          }
        }
      }
    } catch (e) {
      console.error("Servisler yüklenemedi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Otomatik MoreThanPanel Senkronizasyon Tetikleyici
  const handleAutoSync = async () => {
    const confirmed = confirm(
      "Tüm vitrin paketleri MoreThanPanel'deki GERÇEK servislerle eşleştirilecek, minimum sipariş limitleri uygulanacak ve satış fiyatları (1 USD = 36 TL, %350 kâr marjı, min 19.90 TL) otomatik güncellenecektir. Onaylıyor musunuz?"
    );
    if (!confirmed) return;

    try {
      setSyncing(true);
      const res = await fetch("/api/admin/sync-services", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success && data.summary) {
        setSyncSummary(data.summary);
        setShowSyncModal(true);
        loadData();
      } else {
        alert(data.message || "Eşleştirme işlemi gerçekleştirilemedi.");
      }
    } catch (err: any) {
      alert("Senkronizasyon hatası: " + err?.message);
    } finally {
      setSyncing(false);
    }
  };

  // Bir Servisi Seçip Manuel Paket Üretme
  const handleSelectService = (s: ServiceItem) => {
    setSelectedService(s);

    let cleanName = s.name
      .replace(/[🔵🟢🟡🔴👇]/g, "")
      .replace(/\|/g, "-")
      .replace(/⌊.*?⌉/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/MTP Exclusive/gi, "")
      .replace(/New!/gi, "")
      .trim();

    cleanName = cleanName.replace(/\s+/g, " ");

    setPackageName(cleanName);
    const minQty = parseInt(s.min, 10) || 100;
    setQuantity(minQty.toString());

    const rate = parseFloat(s.rate);
    const costTL = (rate / 1000) * minQty * 36;
    const initialPrice = Math.max(19.9, Math.round(costTL * 4.5) - 0.1);
    setPrice(initialPrice.toFixed(2));
    setOldPrice((initialPrice * 1.35).toFixed(2));

    const matchedPlat = platforms.find(
      (p) =>
        s.category.toLowerCase().includes(p.name.toLowerCase()) ||
        s.name.toLowerCase().includes(p.name.toLowerCase())
    );

    if (matchedPlat) {
      setSelectedPlatformId(matchedPlat.id);
      if (matchedPlat.categories.length > 0) {
        setSelectedCategoryId(matchedPlat.categories[0].id);
      }
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedCategoryId) {
      alert("Lütfen platform ve kategori seçiniz.");
      return;
    }

    try {
      setSaving(true);
      const featureArray = features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/packages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          name: packageName,
          price: parseFloat(price),
          oldPrice: oldPrice ? parseFloat(oldPrice) : null,
          quantity: parseInt(quantity, 10),
          providerServiceId: Number(selectedService.service),
          features: featureArray,
          isPopular,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Paket başarıyla oluşturuldu ve sitede satışa açıldı!");
        setSelectedService(null);
      } else {
        alert(data.message || "Paket kaydedilemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Paket kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const currentPlatform = platforms.find((p) => p.id === selectedPlatformId);

  // Servis Arama Filtresi
  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.service.toString().includes(q)
    );
  });

  // Modal içindeki senkronize paket arama filtresi
  const filteredSyncResults = (syncSummary?.results || []).filter((item) => {
    const q = syncModalSearch.toLowerCase();
    return (
      item.packageName.toLowerCase().includes(q) ||
      item.platform.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.newServiceId.toString().includes(q) ||
      item.serviceName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. ÜST BUTON: MORETHANPANEL OTOMATİK EŞLEŞTİRME & FİYAT GÜNCELLEME BANNERI */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#240046] via-[#1E1B4B] to-[#3B0764] border-2 border-[#A855F7]/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#7C1CF5]/30 text-purple-200 text-xs font-bold border border-[#A855F7]/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Otomatik Akıllı Servis & Kâr Motoru</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            MoreThanPanel ile Tüm Paketleri Otomatik Eşleştir ve Güncelle
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-2xl font-normal leading-relaxed">
            Vitrinindeki 31 paketin Service ID&apos;lerini MoreThanPanel&apos;deki gerçek servislerle bağlar, minimum sipariş miktarını denetler ve 1 USD = 36 TL + %350 kâr marjıyla satış fiyatlarını anında günceller.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10 w-full lg:w-auto">
          <button
            onClick={handleAutoSync}
            disabled={syncing}
            className="w-full lg:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7C1CF5] via-[#8B5CF6] to-[#A855F7] hover:from-[#6D14DF] hover:to-[#9333EA] text-white text-xs sm:text-sm font-black shadow-xl shadow-purple-900/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>MoreThanPanel Taranıyor & Güncelleniyor...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>MoreThanPanel ile Tüm Paketleri Otomatik Eşleştir ve Güncelle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Başlık ve Manuel Servis Yenile Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-white">
            MoreThanPanel Canlı Servis Havuzu
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            MoreThanPanel&apos;de bulunan 4.000+ servisi inceleyin veya tek tıkla sitenize özel yeni paketler türetin.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Servisleri Yenile ({services.length})</span>
        </button>
      </div>

      {/* 3. Arama Barı */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Servis adı, ID veya kategori ara (Örn: Kick, Twitch, YouTube, İzleyici, Takipçi)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#9146FF]"
          />
        </div>
      </div>

      {/* 4. Servisler Tablosu */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131D33] border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 font-semibold">Servis ID</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Tedarik Servis Adı</th>
                <th className="py-3 px-4 font-semibold">Maliyet (1k USD)</th>
                <th className="py-3 px-4 font-semibold">Min / Max</th>
                <th className="py-3 px-4 font-semibold text-right">Vitrine Ekle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="inline-flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#9146FF]" />
                      <span>MoreThanPanel servis listesi taranıyor...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Aramanızla eşleşen servis bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredServices.slice(0, 50).map((s) => (
                  <tr key={s.service} className="hover:bg-[#1E293B]/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#A855F7]">
                      #{s.service}
                    </td>
                    <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">
                      {s.category}
                    </td>
                    <td className="py-3 px-4 font-medium text-white max-w-[340px]">
                      <div className="truncate" title={s.name}>
                        {s.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      ${s.rate}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400">
                      {s.min} / {s.max}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleSelectService(s)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#7C1CF5] hover:bg-[#6D14DF] text-white font-bold transition shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Paket Yap</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SENKRONİZASYON SONUÇLARI MODALI */}
      {showSyncModal && syncSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#1E1B4B] to-[#0F172A] border-b border-gray-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white">
                    MoreThanPanel Servis Eşleştirme & Fiyat Güncelleme Raporu
                  </h3>
                </div>
                <p className="text-xs text-gray-400">
                  Toplam {syncSummary.totalPackages} paketten {syncSummary.matchedCount} tanesi başarıyla eşleştirildi ve veritabanında güncellendi.
                </p>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal İstatistik Kartları */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 pb-2">
              <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-gray-700">
                <div className="text-[11px] text-gray-400 font-medium">Toplam Paket</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {syncSummary.totalPackages}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-emerald-500/30">
                <div className="text-[11px] text-emerald-400 font-medium">Başarıyla Eşleşen</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {syncSummary.matchedCount}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-purple-500/30">
                <div className="text-[11px] text-purple-300 font-medium">Uygulanan Kâr Marjı</div>
                <div className="text-xl font-black text-purple-300 font-mono mt-0.5">
                  %350 (Maliyet x 4.5)
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-amber-500/30">
                <div className="text-[11px] text-amber-300 font-medium">Taban Satış Fiyatı</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                  19.90 ₺ (1 USD=36 TL)
                </div>
              </div>
            </div>

            {/* Modal Arama */}
            <div className="px-6 py-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Eşleşen paket veya servis ara..."
                  value={syncModalSearch}
                  onChange={(e) => setSyncModalSearch(e.target.value)}
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Modal Tablosu */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#131D33] border-b border-gray-800 text-gray-400 sticky top-0">
                    <th className="py-2.5 px-3 font-semibold">Paket Adı</th>
                    <th className="py-2.5 px-3 font-semibold">Platform / Kategori</th>
                    <th className="py-2.5 px-3 font-semibold">Eşleşen MTP Servisi</th>
                    <th className="py-2.5 px-3 font-semibold">Miktar</th>
                    <th className="py-2.5 px-3 font-semibold">Maliyet (USD/TRY)</th>
                    <th className="py-2.5 px-3 font-semibold">Yeni Satış Fiyatı</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium">
                  {filteredSyncResults.map((item) => (
                    <tr key={item.packageId} className="hover:bg-[#1E293B]/40">
                      <td className="py-2.5 px-3 text-white font-bold">{item.packageName}</td>
                      <td className="py-2.5 px-3 text-gray-400">
                        {item.platform} › {item.category}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-purple-400">
                            #{item.newServiceId}
                          </span>
                          <span className="text-gray-300 max-w-[220px] truncate" title={item.serviceName}>
                            {item.serviceName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {item.newQuantity} adet
                        {item.oldQuantity !== item.newQuantity && (
                          <span className="text-amber-400 text-[10px] ml-1">(Min {item.min})</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-300">
                        ${item.costUSD} / {item.costTRY} ₺
                      </td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-400">
                        {item.newPrice.toFixed(2)} ₺
                        <span className="text-[10px] text-gray-500 line-through ml-1 font-normal">
                          {item.oldPrice.toFixed(2)} ₺
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          ✓ Güncellendi
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#131D33] border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowSyncModal(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MANUEL PAKET OLUŞTURMA MODALI */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-gray-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#9146FF]" />
                  <span>Seçilen Servisi Vitrine Ekle</span>
                </h3>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Tedarik ID: #{selectedService.service} - {selectedService.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              {/* Platform ve Kategori Seçimi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Hedef Platform</label>
                  <select
                    value={selectedPlatformId}
                    onChange={(e) => {
                      setSelectedPlatformId(e.target.value);
                      const p = platforms.find((plat) => plat.id === e.target.value);
                      if (p && p.categories.length > 0) {
                        setSelectedCategoryId(p.categories[0].id);
                      } else {
                        setSelectedCategoryId("");
                      }
                    }}
                    className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#9146FF]"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 font-semibold">Hedef Kategori</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-[10px] text-[#9146FF] hover:underline font-bold"
                    >
                      {isAddingCategory ? "İptal" : "+ Yeni Kategori"}
                    </button>
                  </div>

                  {!isAddingCategory ? (
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#9146FF]"
                    >
                      {currentPlatform?.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Yeni kategori adı..."
                          className="flex-1 bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#9146FF]"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory || !newCategoryName.trim()}
                          className="px-3.5 py-2 rounded-xl bg-[#9146FF] hover:bg-purple-600 text-white font-bold text-xs transition disabled:opacity-50"
                        >
                          {creatingCategory ? "..." : "Oluştur"}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {currentPlatform?.name} platformu için anında yeni kategori açılır.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Kurumsal Paket Adı */}
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Müşteriye Görünecek Kurumsal Paket Adı
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-[#9146FF]"
                  placeholder="Örn: Kick 1 Saatlik 100 Canlı İzleyici Desteği"
                  required
                />
              </div>

              {/* Miktar ve Fiyatlar */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Miktar</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Satış Fiyatı (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2.5 text-emerald-400 font-black font-mono focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Eski Fiyat (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2.5 text-gray-400 font-mono focus:outline-none"
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>

              {/* Özellikler */}
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Paket Özellikleri (Her satıra bir özellik)
                </label>
                <textarea
                  rows={3}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#9146FF]"
                />
              </div>

              {/* Çok Satan İşareti */}
              <label className="flex items-center space-x-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1E293B] border-gray-700 text-purple-600 focus:ring-0"
                />
                <span className="text-gray-300 font-semibold">
                  Bu paketi ana sayfadaki &ldquo;Çok Satanlar&rdquo; vitrininde sergile
                </span>
              </label>

              {/* Kaydet Butonu */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9146FF] to-blue-600 hover:opacity-95 text-white font-bold transition disabled:opacity-50"
                >
                  {saving ? "Ekleniyor..." : "Kaydet ve Satışa Aç"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
