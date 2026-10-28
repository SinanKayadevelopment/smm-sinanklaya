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

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Durumu
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
        // Platform kategorilerini yerel state'te güncelle
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

  // Platform değiştiğinde kategori güncelle
  const currentPlatform = platforms.find((p) => p.id === selectedPlatformId);
  useEffect(() => {
    if (currentPlatform && currentPlatform.categories.length > 0) {
      setSelectedCategoryId(currentPlatform.categories[0].id);
    } else {
      setSelectedCategoryId("");
    }
  }, [selectedPlatformId]);

  // "Vitrine Paket Olarak Ekle" tıklandığında kurumsal isim önerisi
  const handleOpenAddModal = (srv: ServiceItem) => {
    setSelectedService(srv);

    // Otomatik isim temizleme & öneri
    let cleanProposal = srv.name
      .replace(/bot[lu]?/gi, "Desteği")
      .replace(/panel/gi, "Altyapı")
      .replace(/hile/gi, "Yükseliş")
      .replace(/sahte/gi, "Kaliteli")
      .replace(/\[.*?\]/g, "")
      .trim();

    if (!cleanProposal.includes("Desteği") && !cleanProposal.includes("Yükseliş")) {
      cleanProposal += " Desteği";
    }

    setPackageName(cleanProposal);
    setQuantity(srv.min ? srv.min.toString() : "100");
    setPrice("49.90");
    setOldPrice("69.90");
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedCategoryId || !packageName.trim() || !price) {
      alert("Lütfen gerekli alanları doldurunuz.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/packages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          name: packageName.trim(),
          price: parseFloat(price),
          oldPrice: oldPrice ? parseFloat(oldPrice) : null,
          quantity: parseInt(quantity, 10),
          providerServiceId: selectedService.service,
          features: features.split("\n").filter(Boolean),
          isPopular,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        setSelectedService(null);
      } else {
        alert(data.message || "Paket eklenemedi.");
      }
    } catch (e) {
      alert("Sunucu hatası oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // Servis Arama Filtresi
  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.service.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            MoreThanPanel Servis Tarayıcı & Hızlı Paket Oluşturucu
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Tedarik altyapısındaki servisleri inceleyin ve tek tıkla sitenizde satışa açılacak yeni
            paketler üretin.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Servisleri Yenile</span>
        </button>
      </div>

      {/* Arama Barı */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Servis adı, ID veya kategori ara (Örn: Kick, Twitch, YouTube, İzleyici)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#9146FF]"
          />
        </div>
      </div>

      {/* Servisler Tablosu */}
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
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    MoreThanPanel servisleri yükleniyor...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Aramanıza uygun servis bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.service} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                      #{srv.service}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 font-medium">
                      {srv.category || "Genel"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-md">
                      {srv.name}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                      ${srv.rate}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                      {srv.min} - {srv.max}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAddModal(srv)}
                        className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-[#9146FF] to-blue-600 hover:opacity-95 text-white font-bold text-[11px] transition shadow-md flex items-center space-x-1.5 ml-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Vitrine Paket Yap</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vitrine Paket Olarak Ekleme Modalı */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0F172A] border border-gray-800 p-6 sm:p-7 shadow-2xl text-white space-y-5">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[#9146FF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Yeni Paket Olarak Vitrine Ekle</h3>
                <p className="text-xs text-gray-400">
                  Tedarikçi Servis ID: #{selectedService.service} (Maliyet: ${selectedService.rate} / 1k)
                </p>
              </div>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              {/* Platform & Kategori Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Hedef Platform</label>
                  <select
                    value={selectedPlatformId}
                    onChange={(e) => setSelectedPlatformId(e.target.value)}
                    className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none"
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
                    <label className="text-gray-400 font-semibold">Kategori</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-[11px] text-[#9146FF] hover:text-purple-300 font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingCategory ? "Vazgeç" : "Yeni Kategori Ekle"}</span>
                    </button>
                  </div>

                  {!isAddingCategory ? (
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9146FF]"
                      required
                    >
                      {currentPlatform?.categories && currentPlatform.categories.length > 0 ? (
                        currentPlatform.categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Bu platformda henüz kategori yok</option>
                      )}
                    </select>
                  ) : (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Örn: Canlı Yayın İzleyici Desteği"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 bg-[#131D33] border border-purple-500/60 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-xs focus:outline-none"
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
                        {currentPlatform?.name} platformu için anında yeni kategori açılır ve otomatik seçilir.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Kurumsal Paket Adı */}
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Müşteriye Görünecek Kurumsal Paket Adı (Yasaklı kelimeler otomatik temizlenir)
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
                  <label className="block text-gray-400 mb-1 font-semibold">Gönderilecek Miktar</label>
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
                  Paket Özellikleri (Her satıra bir özellik yazın)
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
