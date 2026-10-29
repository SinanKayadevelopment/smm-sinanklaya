"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  X,
} from "lucide-react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialPaymentStatus = searchParams.get("paymentStatus") || "ALL";
  const initialPaymentMethod = searchParams.get("paymentMethod") || "ALL";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState(initialPaymentStatus);
  const [filterOrderStatus, setFilterOrderStatus] = useState("ALL");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState(initialPaymentMethod);

  // Aksiyon Yükleniyor Durumları
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Retry Modal Durumu
  const [retryModalOrder, setRetryModalOrder] = useState<any | null>(null);
  const [retryLink, setRetryLink] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchTerm.trim()) query.set("search", searchTerm.trim());
      if (filterPaymentStatus !== "ALL") query.set("paymentStatus", filterPaymentStatus);
      if (filterOrderStatus !== "ALL") query.set("orderStatus", filterOrderStatus);
      if (filterPaymentMethod !== "ALL") query.set("paymentMethod", filterPaymentMethod);

      const res = await fetch(`/api/admin/orders?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Siparişler yüklenemedi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterPaymentStatus, filterOrderStatus, filterPaymentMethod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  // 1. EFT / Havale Onaylama
  const handleApproveEft = async (orderId: string) => {
    if (!confirm("EFT/Havale ödemesini onaylayıp siparişi tedarikçiye göndermek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setActionLoadingId(orderId);
      const res = await fetch("/api/admin/orders/approve-eft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      alert(data.message);
      loadOrders();
    } catch (e) {
      alert("İşlem sırasında hata oluştu.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 2. Retry / Tekrar Gönderim
  const handleRetrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retryModalOrder) return;

    try {
      setActionLoadingId(retryModalOrder.id);
      const res = await fetch("/api/admin/orders/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: retryModalOrder.id,
          newTargetLink: retryLink.trim(),
        }),
      });
      const data = await res.json();
      alert(data.message);
      setRetryModalOrder(null);
      loadOrders();
    } catch (e) {
      alert("Tekrar gönderim hatası.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Başlık ve Buton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Sipariş & EFT/Havale Yönetimi</h1>
          <p className="text-xs text-gray-400 mt-1">
            Gelen siparişleri onaylayın, tedarik durumunu canlı izleyin ve hatalı işlemleri telafi edin.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yenile</span>
        </button>
      </div>

      {/* Arama ve Filtre Çubuğu */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Sipariş no (DST-...), müşteri adı, telefon, hedef link veya tedarik ID ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#9146FF]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition"
          >
            Filtrele
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-800/60 text-xs">
          {/* Ödeme Durumu Filtresi */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Ödeme Durumu</label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Tüm Ödeme Durumları</option>
              <option value="PENDING">Bekliyor (PENDING)</option>
              <option value="PAID">Ödendi (PAID)</option>
              <option value="FAILED">Başarısız (FAILED)</option>
            </select>
          </div>

          {/* Sipariş / Teslimat Durumu */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Tedarik / İşlem Durumu</label>
            <select
              value={filterOrderStatus}
              onChange={(e) => setFilterOrderStatus(e.target.value)}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Tüm İşlem Durumları</option>
              <option value="WAITING">Onay / Sıra Bekliyor</option>
              <option value="PROCESSING">Hazırlanıyor (PROCESSING)</option>
              <option value="IN_PROGRESS">Aktarılıyor (IN_PROGRESS)</option>
              <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
              <option value="ERROR">Hatalı (ERROR - Müdahale Gerek)</option>
            </select>
          </div>

          {/* Ödeme Yöntemi */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Ödeme Yöntemi</label>
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Tüm Yöntemler</option>
              <option value="ONLINE_SHOPIER">Online (Shopier 3D Secure)</option>
              <option value="EFT_HAVALE">EFT / Havale</option>
              <option value="MOBIL_ODEME">Mobil Ödeme</option>
            </select>
          </div>
        </div>
      </div>

      {/* Siparişler Tablosu */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131D33] border-b border-gray-800 text-gray-400">
                <th className="py-3.5 px-4 font-semibold">Sipariş No</th>
                <th className="py-3.5 px-4 font-semibold">Müşteri Bilgisi</th>
                <th className="py-3.5 px-4 font-semibold">Paket & Adet</th>
                <th className="py-3.5 px-4 font-semibold">Hedef Bağlantı</th>
                <th className="py-3.5 px-4 font-semibold">Tutar & Yöntem</th>
                <th className="py-3.5 px-4 font-semibold">Ödeme</th>
                <th className="py-3.5 px-4 font-semibold">Tedarik Durumu</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Filtrelere uygun sipariş kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const isEftPending =
                    ord.paymentMethod === "EFT_HAVALE" && ord.paymentStatus === "PENDING";
                  const isError = ord.orderStatus === "ERROR";

                  return (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                      {/* Sipariş No */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sm text-[#9146FF] block">
                          {ord.orderCode}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Müşteri */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-400">{ord.customerPhone}</div>
                        <div className="text-[11px] text-gray-500">{ord.customerEmail}</div>
                        {ord.companyName && (
                          <div className="text-[10px] text-purple-400 font-semibold mt-0.5">
                            {ord.companyName}
                          </div>
                        )}
                      </td>

                      {/* Paket */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-200">
                          {ord.package.category.platform.name} - {ord.package.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Miktar: <strong>{ord.package.quantity}</strong> adet
                        </div>
                      </td>

                      {/* Hedef Bağlantı */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <a
                          href={ord.targetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline truncate block font-mono text-[11px]"
                          title={ord.targetLink}
                        >
                          {ord.targetLink}
                        </a>
                      </td>

                      {/* Tutar & Yöntem */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-emerald-400 text-sm">
                          {ord.totalAmount.toFixed(2)} ₺
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-medium">
                          {ord.paymentMethod === "ONLINE_SHOPIER" || ord.paymentMethod === "ONLINE_PAYTR"
                            ? "Shopier 3D"
                            : ord.paymentMethod === "EFT_HAVALE"
                            ? "EFT / Havale"
                            : "Mobil Ödeme"}
                        </span>
                      </td>

                      {/* Ödeme Durumu */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : ord.paymentStatus === "FAILED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      {/* Tedarik Durumu & Tedarik ID */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.orderStatus === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : ord.orderStatus === "ERROR"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-purple-500/10 text-purple-400"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>

                        {ord.providerOrderId && (
                          <div className="text-[10px] text-gray-500 font-mono mt-1">
                            Tedarik: #{ord.providerOrderId}
                          </div>
                        )}

                        {ord.errorMessage && (
                          <div className="text-[10px] text-red-400 truncate max-w-[150px] mt-0.5" title={ord.errorMessage}>
                            Hata: {ord.errorMessage}
                          </div>
                        )}
                      </td>

                      {/* Aksiyon Butonları */}
                      <td className="py-3.5 px-4 text-right space-y-1.5">
                        {/* 1. EFT Havale Onay Butonu */}
                        {isEftPending && (
                          <button
                            onClick={() => handleApproveEft(ord.id)}
                            disabled={actionLoadingId === ord.id}
                            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-md disabled:opacity-50 flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Ödemeyi Onayla & Gönder</span>
                          </button>
                        )}

                        {/* 2. Retry Butonu */}
                        {isError && (
                          <button
                            onClick={() => {
                              setRetryModalOrder(ord);
                              setRetryLink(ord.targetLink);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition shadow-md flex items-center justify-center space-x-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Düzenle & Tekrar Gönder</span>
                          </button>
                        )}

                        {/* Detay Görüntüle */}
                        <a
                          href={`/siparis-sorgula?kod=${ord.orderCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white"
                        >
                          <span>Müşteri Sayfası</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retry Modal */}
      {retryModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-gray-800 p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => setRetryModalOrder(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold">Hatalı Siparişi Telafi Et (Retry)</h3>
            </div>

            <p className="text-xs text-gray-400">
              Sipariş: <strong>{retryModalOrder.orderCode}</strong> — {retryModalOrder.package.name}
            </p>

            {retryModalOrder.errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                Önceki Hata: {retryModalOrder.errorMessage}
              </div>
            )}

            <form onSubmit={handleRetrySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Hedef Kanal / Profil Bağlantısı (Gerekirse düzeltin):
                </label>
                <input
                  type="url"
                  value={retryLink}
                  onChange={(e) => setRetryLink(e.target.value)}
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#9146FF] font-mono"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRetryModalOrder(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === retryModalOrder.id}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {actionLoadingId === retryModalOrder.id
                      ? "İletiliyor..."
                      : "Tekrar API'ye Gönder"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Siparişler yükleniyor...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
