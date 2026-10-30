"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, ArrowRight, TrendingUp, AlertCircle, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Giriş başarısız. Bilgilerinizi kontrol ediniz.");
      }
    } catch (err: any) {
      setError("Bağlantı hatası oluştu, lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Glow Efektleri */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9146FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#53FC18]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9146FF] to-[#53FC18] p-0.5 mx-auto shadow-2xl shadow-purple-600/30 mb-3">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#53FC18]" />
            </div>
          </div>
          <h1 className="font-black text-2xl text-white tracking-tight">
            YAYINCI<span className="text-[#53FC18]">KRAL</span>
          </h1>
          <p className="text-xs text-purple-300 font-bold uppercase tracking-widest mt-1">
            Yönetim & Kontrol Merkezi
          </p>
        </div>

        {/* Giriş Kartı */}
        <div className="p-8 rounded-3xl bg-[#0F172A] border border-gray-800 shadow-2xl space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-800">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Yönetici Girişi</h2>
              <p className="text-[11px] text-gray-400">Yönetim paneline erişmek için kimliğinizi doğrulayın.</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Kullanıcı Adı */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-gray-300 font-bold">Kullanıcı Adı</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="58672205858"
                  required
                  autoFocus
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#9146FF] transition"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-gray-300 font-bold">Şifre</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#9146FF] transition"
                />
              </div>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-[#9146FF] to-blue-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Doğrulanıyor..." : "GÜVENLİ GİRİŞ YAP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-800/80">
            <span className="text-[11px] text-gray-500 flex items-center justify-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL Şifreli Yönetici Oturumu</span>
            </span>
          </div>
        </div>

        {/* Ana Sayfaya Dön Linki */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition underline underline-offset-4"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}

