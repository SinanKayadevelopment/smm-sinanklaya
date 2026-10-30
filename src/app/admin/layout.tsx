"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Settings,
  Tag,
  TrendingUp,
  ExternalLink,
  Wallet,
  RefreshCw,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [balance, setBalance] = useState<string>("0.00");
  const [currency, setCurrency] = useState<string>("USD");
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [pendingEftCount, setPendingEftCount] = useState<number>(0);

  // /admin/login sayfasında layout sidebarını ve üst barı gösterme
  const isLoginPage = pathname === "/admin/login";

  const fetchStats = async () => {
    if (isLoginPage) return;
    try {
      setLoadingBalance(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setBalance(data.stats.providerBalance);
        setCurrency(data.stats.providerCurrency);
        setPendingEftCount(data.stats.pendingEftCount || 0);
      }
    } catch (e) {
      console.error("Bakiye yüklenemedi", e);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [pathname]);

  const handleLogout = async () => {
    if (!confirm("Yönetim oturumundan çıkmak istediğinize emin misiniz?")) return;
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    {
      name: "Genel Bakış",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Sipariş & Havale",
      href: "/admin/orders",
      icon: <ShoppingCart className="w-4 h-4" />,
      badge: pendingEftCount > 0 ? pendingEftCount : null,
    },
    {
      name: "Servisler & Paket Oluştur",
      href: "/admin/services",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      name: "Kupon Yönetimi",
      href: "/admin/coupons",
      icon: <Tag className="w-4 h-4" />,
    },
    {
      name: "Sistem & Ödeme Ayarları",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080B12] text-gray-200 flex flex-col md:flex-row">
      {/* Sol Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Başlık */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9146FF] to-[#53FC18] p-0.5">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#53FC18]" />
                </div>
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight">
                  YAYINCI<span className="text-[#53FC18]">KRAL</span>
                </span>
                <span className="block text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                  Yönetim Paneli
                </span>
              </div>
            </Link>
          </div>

          {/* Menü Linkleri */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-purple-600/15 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? "text-[#9146FF]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Alt Kısım: Siteye Git & Çıkış Yap */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition"
          >
            <span>Platform Vitrinine Git</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Sağ Ana İçerik */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Üst Bar: Canlı MTP Bakiye & Kullanıcı Bilgisi */}
        <header className="h-16 bg-[#0B0F19]/90 border-b border-gray-800 px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-bold text-white hidden sm:block">
              Yayıncı Kral Yönetim & Kontrol Merkezi
            </h2>
          </div>

          {/* Canlı Tedarikçi Bakiyesi ve Admin Rozeti */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Wallet className="w-4 h-4" />
              <span className="font-semibold text-gray-300">MoreThanPanel Bakiye:</span>
              <span className="font-black font-mono text-emerald-400 text-sm">
                ${balance} {currency}
              </span>
              <button
                onClick={fetchStats}
                disabled={loadingBalance}
                title="Bakiyeyi Yenile"
                className="p-1 hover:text-white transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingBalance ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#9146FF] text-[11px] font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>58672205858</span>
            </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
