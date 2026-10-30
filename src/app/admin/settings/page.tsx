"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Key,
  CreditCard,
  Building2,
  Trash2,
  Plus,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Mail,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Activity,
  Globe,
  Sparkles,
  Copy,
  Check,
  Zap,
} from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branchCode?: string | null;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Ayarları
  const [mtpUrl, setMtpUrl] = useState("https://morethanpanel.com/api/v2");
  const [mtpKey, setMtpKey] = useState("");
  
  // PayTR Ayarları
  const [paytrId, setPaytrId] = useState("");
  const [paytrKey, setPaytrKey] = useState("");
  const [paytrSalt, setPaytrSalt] = useState("");
  const [testMode, setTestMode] = useState(true);

  // Shopier REST API v1 & OSB Ayarları
  const [shopierShopSlug, setShopierShopSlug] = useState("yayincikral");
  const [shopierPat, setShopierPat] = useState("");
  const [shopierOsbUser, setShopierOsbUser] = useState("21cb1a38edac99d3e4b2e1c0c43f02e4");
  const [shopierOsbPass, setShopierOsbPass] = useState("07b8c8931dd1504f51e4711754ebe8f7");
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // İletişim Ayarları
  const [whatsapp, setWhatsapp] = useState("+90 533 194 83 96");
  const [supportEmail, setSupportEmail] = useState("destek@yayincikral.com");

  // Google Analytics & Clarity Ayarları
  const [gaId, setGaId] = useState("");
  const [clarityId, setClarityId] = useState("");

  // Banka Hesapları
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [newIban, setNewIban] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [addingBank, setAddingBank] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.MTP_API_URL) setMtpUrl(data.settings.MTP_API_URL);
        if (data.settings.MTP_API_KEY) setMtpKey(data.settings.MTP_API_KEY);
        if (data.settings.PAYTR_MERCHANT_ID) setPaytrId(data.settings.PAYTR_MERCHANT_ID);
        if (data.settings.PAYTR_MERCHANT_KEY) setPaytrKey(data.settings.PAYTR_MERCHANT_KEY);
        if (data.settings.PAYTR_MERCHANT_SALT) setPaytrSalt(data.settings.PAYTR_MERCHANT_SALT);
        if (data.settings.TEST_PAYMENT_MODE !== undefined) {
          setTestMode(data.settings.TEST_PAYMENT_MODE === "true");
        }
        
        // Shopier REST API v1 & OSB
        if (data.settings.SHOPIER_SHOP_SLUG) setShopierShopSlug(data.settings.SHOPIER_SHOP_SLUG);
        if (data.settings.SHOPIER_PAT) setShopierPat(data.settings.SHOPIER_PAT);
        if (data.settings.SHOPIER_OSB_USERNAME) setShopierOsbUser(data.settings.SHOPIER_OSB_USERNAME);
        if (data.settings.SHOPIER_OSB_PASSWORD) setShopierOsbPass(data.settings.SHOPIER_OSB_PASSWORD);

        if (data.settings.WHATSAPP_PHONE) setWhatsapp(data.settings.WHATSAPP_PHONE);
        if (data.settings.SUPPORT_EMAIL) setSupportEmail(data.settings.SUPPORT_EMAIL);
        if (data.settings.GOOGLE_ANALYTICS_ID) setGaId(data.settings.GOOGLE_ANALYTICS_ID);
        if (data.settings.MICROSOFT_CLARITY_ID) setClarityId(data.settings.MICROSOFT_CLARITY_ID);
      }

      const bankRes = await fetch("/api/admin/bank-accounts");
      const bankData = await bankRes.json();
      if (bankData.success) {
        setBankAccounts(bankData.accounts);
      }
    } catch (e) {
      console.error("Ayarlar yüklenemedi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        MTP_API_URL: mtpUrl.trim(),
        MTP_API_KEY: mtpKey.trim(),
        PAYTR_MERCHANT_ID: paytrId.trim(),
        PAYTR_MERCHANT_KEY: paytrKey.trim(),
        PAYTR_MERCHANT_SALT: paytrSalt.trim(),
        TEST_PAYMENT_MODE: testMode ? "true" : "false",
        
        // Shopier REST API v1 & OSB
        SHOPIER_SHOP_SLUG: shopierShopSlug.trim(),
        SHOPIER_PAT: shopierPat.trim(),
        SHOPIER_OSB_USERNAME: shopierOsbUser.trim(),
        SHOPIER_OSB_PASSWORD: shopierOsbPass.trim(),

        WHATSAPP_PHONE: whatsapp.trim(),
        SUPPORT_EMAIL: supportEmail.trim(),
        GOOGLE_ANALYTICS_ID: gaId.trim(),
        MICROSOFT_CLARITY_ID: clarityId.trim(),
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Ayarlar kaydedildi.");
    } catch (e) {
      alert("Ayarlar kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const copyShopierWebhook = () => {
    const url = "https://yayincikral.com/api/payment/shopier-webhook";
    navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim() || !newAccountHolder.trim() || !newIban.trim()) {
      alert("Lütfen banka adı, alıcı adı ve IBAN alanlarını doldurunuz.");
      return;
    }

    try {
      setAddingBank(true);
      const res = await fetch("/api/admin/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: newBankName.trim(),
          accountHolder: newAccountHolder.trim(),
          iban: newIban.trim(),
          branchCode: newBranchCode.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBankAccounts([...bankAccounts, data.account]);
        setNewBankName("");
        setNewAccountHolder("");
        setNewIban("");
        setNewBranchCode("");
      } else {
        alert(data.message || "Banka hesabı eklenemedi.");
      }
    } catch (e) {
      alert("Hesap eklenirken hata oluştu.");
    } finally {
      setAddingBank(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Bu banka hesabını silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/bank-accounts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBankAccounts(bankAccounts.filter((b) => b.id !== id));
      } else {
        alert(data.message || "Banka hesabı silinemedi.");
      }
    } catch (e) {
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400 text-sm animate-pulse">Sistem ayarları yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Sistem & Ödeme Ayarları</h1>
        <p className="text-xs text-gray-400 mt-1">
          Shopier REST API v1 (Kişisel Erişim Anahtarı / PAT), Tedarikçi API entegrasyonu, Google Analytics & Clarity takip kodları ve EFT/Havale banka hesapları.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Resmi Shopier 2026 REST API v1 (PAT & Hosted Checkout) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#141b2d] border border-orange-500/30 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400 shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">Shopier REST API v1 (2026 Güncel) & OSB</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                    REST API v1 Aktif
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Shopier Kişisel Erişim Anahtarı (PAT) ve Otomatik Sipariş Bildirimi (OSB) entegrasyonu.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-bold">
              <span className={`px-2.5 py-1 rounded-full border ${shopierPat ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {shopierPat ? 'Shopier PAT: Bağlı' : 'Shopier PAT: Eksik'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Shop Slug */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">Shopier Mağaza Kısa Adı (Shop Slug)</label>
              <input
                type="text"
                value={shopierShopSlug}
                onChange={(e) => setShopierShopSlug(e.target.value)}
                placeholder="yayincikral"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">Shopier mağaza bağlantı adınız (örn: yayincikral)</span>
            </div>

            {/* Kişisel Erişim Anahtarı (PAT) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-gray-300 font-bold">Kişisel Erişim Anahtarı (Personal Access Token - PAT)</label>
              <textarea
                rows={3}
                value={shopierPat}
                onChange={(e) => setShopierPat(e.target.value)}
                placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">
                Shopier Panel &gt; Hesap Yönetimi &gt; Kişisel Erişim Anahtarı bölümünden oluşturulan Bearer Token
              </span>
            </div>

            {/* OSB Kullanıcı Adı */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">OSB Kullanıcı Adı ($username)</label>
              <input
                type="text"
                value={shopierOsbUser}
                onChange={(e) => setShopierOsbUser(e.target.value)}
                placeholder="21cb1a38edac..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">Sipariş Bildirimi (OSB) sayfasındaki kullanıcı adı</span>
            </div>

            {/* OSB Şifresi */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">OSB Şifresi ($key)</label>
              <input
                type="password"
                value={shopierOsbPass}
                onChange={(e) => setShopierOsbPass(e.target.value)}
                placeholder="07b8c8931dd1..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">Sipariş Bildirimi (OSB) hash doğrulama anahtarı</span>
            </div>
          </div>

          {/* Geri Dönüş URL'si (Webhook / Callback URL) Kutusu */}
          <div className="p-4 rounded-2xl bg-[#131D33] border border-orange-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Shopier Bildirim / Webhook URL</span>
              </span>
              <span className="text-[10px] text-gray-400">Sipariş Bildirimi (OSB) ekranına yapıştırınız</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-[#0B0F19] border border-gray-800">
              <span className="font-mono text-xs text-purple-300 break-all select-all font-bold">
                https://yayincikral.com/api/payment/shopier-webhook
              </span>
              <button
                type="button"
                onClick={copyShopierWebhook}
                className="px-4 py-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0"
              >
                {copiedWebhook ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Adresi Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Müşteri Shopier üzerinden ödemesini tamamladığı anda Shopier bu adrese bildirim gönderir. Sistemimiz gelen bildirimi doğrular, siparişi <strong>&apos;PAID&apos;</strong> yapar, <strong>MoreThanPanel</strong> üzerinden otomatik tedariği başlatır ve geçici oluşturulan ürünü siler.
            </p>
          </div>
        </div>

        {/* 2. Site Trafik & Analitik Takip Kodları */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Site Trafik & Analitik Takip Kodları</h3>
                <p className="text-xs text-gray-400">
                  Google Analytics 4 ve Microsoft Clarity entegrasyonu. Girildiğinde sitenin &lt;head&gt; alanına otomatik eklenir.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold">
              <span className={`px-2.5 py-1 rounded-full border ${gaId ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                GA4: {gaId ? 'Aktif' : 'Boş'}
              </span>
              <span className={`px-2.5 py-1 rounded-full border ${clarityId ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                Clarity: {clarityId ? 'Aktif' : 'Boş'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Google Analytics ID */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#131D33] border border-gray-700/60">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Analytics ID (G-XXXXXX)</span>
                </label>
                <span className="text-[10px] text-gray-400 font-mono">gtag.js</span>
              </div>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="Örn: G-12345ABCDE"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">
                Google Analytics 4 ölçüm kimliğiniz. Girildiğinde anlık ziyaretçiler izlenir.
              </span>
            </div>

            {/* Microsoft Clarity ID */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#131D33] border border-gray-700/60">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Microsoft Clarity Proje Kodu</span>
                </label>
                <span className="text-[10px] text-gray-400 font-mono">clarity.ms</span>
              </div>
              <input
                type="text"
                value={clarityId}
                onChange={(e) => setClarityId(e.target.value)}
                placeholder="Örn: z5g2hnll19"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">
                Clarity ısı haritası ve oturum kaydı takip kodu.
              </span>
            </div>
          </div>
        </div>

        {/* 3. MoreThanPanel (Tedarikçi API) Ayarları */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MoreThanPanel (Tedarikçi API)</h3>
              <p className="text-xs text-gray-400">
                Siparişlerin aktarılacağı ana sağlayıcı API uç noktası ve anahtarı.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">MTP API URL</label>
              <input
                type="url"
                value={mtpUrl}
                onChange={(e) => setMtpUrl(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">MTP API Anahtarı (API Key)</label>
              <input
                type="password"
                value={mtpKey}
                onChange={(e) => setMtpKey(e.target.value)}
                placeholder="API anahtarınız..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>
          </div>
        </div>

        {/* 4. İletişim & Destek Ayarları */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">İletişim & Canlı Destek Kanalları</h3>
              <p className="text-xs text-gray-400">
                Sitedeki yüzen destek butonu ve bildirimlerde gösterilecek resmi iletişim hatları.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">WhatsApp Destek Hattı</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Kurumsal Destek E-Postası</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#9146FF]"
              />
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-orange-500 via-[#9146FF] to-blue-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}</span>
          </button>
        </div>
      </form>

      {/* 5. EFT / Havale Banka Hesapları Yönetimi */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">EFT / Havale Banka Hesapları</h3>
            <p className="text-xs text-gray-400">
              Müşterilerin ödeme adımı 4&apos;te göreceği resmi banka IBAN bilgileri.
            </p>
          </div>
        </div>

        {/* Mevcut Hesaplar */}
        <div className="space-y-3">
          {bankAccounts.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#1E293B] border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">{b.bankName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                    Şube: {b.branchCode || "Merkez"}
                  </span>
                </div>
                <div className="text-gray-300 mt-1">Alıcı: {b.accountHolder}</div>
                <div className="font-mono text-purple-300 mt-0.5 font-bold">{b.iban}</div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteBank(b.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 self-start sm:self-center transition"
                title="Hesabı Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {bankAccounts.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl">
              Kayıtlı banka hesabı bulunmuyor. Aşağıdan yeni bir IBAN ekleyebilirsiniz.
            </div>
          )}
        </div>

        {/* Yeni Banka Ekle Formu */}
        <form
          onSubmit={handleAddBank}
          className="p-5 rounded-2xl bg-[#131D33] border border-gray-700/60 space-y-4"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Yeni Banka Hesabı Tanımla</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Banka Adı</label>
              <input
                type="text"
                placeholder="Örn: Garanti BBVA"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Hesap Sahibi (Alıcı)</label>
              <input
                type="text"
                placeholder="Örn: Sinan Kaya"
                value={newAccountHolder}
                onChange={(e) => setNewAccountHolder(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">IBAN Numarası</label>
              <input
                type="text"
                placeholder="TR00 0000 0000..."
                value={newIban}
                onChange={(e) => setNewIban(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Şube Kodu / Adı (Opsiyonel)</label>
              <input
                type="text"
                placeholder="Örn: 1234 - Kadıköy"
                value={newBranchCode}
                onChange={(e) => setNewBranchCode(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#9146FF]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={addingBank}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-purple-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addingBank ? "Ekleniyor..." : "Banka Hesabını Ekle"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
