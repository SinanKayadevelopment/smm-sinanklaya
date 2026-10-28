"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, CheckCircle2, Percent, RefreshCw } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error("Kuponlar yüklenemedi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountPercent) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountPercent: parseInt(discountPercent, 10),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCode("");
        setDiscountPercent("");
        loadCoupons();
      } else {
        alert(data.message || "Kupon eklenemedi.");
      }
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadCoupons();
      }
    } catch (e) {
      alert("Silinemedi.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">İndirim Kuponu Yönetimi</h1>
          <p className="text-xs text-gray-400 mt-1">
            Müşterilerinizin ödeme adımında kullanabileceği promosyon ve indirim kodları.
          </p>
        </div>
        <button
          onClick={loadCoupons}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yenile</span>
        </button>
      </div>

      {/* Yeni Kupon Ekle Formu */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-[#9146FF]">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Yeni İndirim Kuponu Oluştur</h3>
            <p className="text-xs text-gray-400">
              Kupon kodu büyük harfle otomatik tanımlanır (Örn: YUKSELIS25).
            </p>
          </div>
        </div>

        <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 mb-1 font-semibold">Kupon Kodu</label>
            <input
              type="text"
              placeholder="Örn: YAYINCI20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono uppercase font-bold focus:outline-none focus:border-[#9146FF]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-semibold">İndirim Yüzdesi (%)</label>
            <input
              type="number"
              min="1"
              max="99"
              placeholder="Örn: 20"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-[#9146FF]"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition disabled:opacity-50"
            >
              {submitting ? "Oluşturuluyor..." : "Kuponu Tanımla"}
            </button>
          </div>
        </form>
      </div>

      {/* Mevcut Kuponlar Tablosu */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131D33] border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 font-semibold">Kupon Kodu</th>
                <th className="py-3 px-4 font-semibold">İndirim Oranı</th>
                <th className="py-3 px-4 font-semibold">Durum</th>
                <th className="py-3 px-4 font-semibold">Oluşturulma</th>
                <th className="py-3 px-4 font-semibold text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Henüz kupon tanımlanmadı.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-mono font-black text-sm text-[#9146FF]">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                      %{c.discountPercent} İndirim
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        AKTİF
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Kuponu Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
