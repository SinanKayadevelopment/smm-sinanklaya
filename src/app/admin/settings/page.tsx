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

  // Shopier Sanal POS Ayarları
  const [shopierApiKey, setShopierApiKey] = useState("");
  const [shopierApiSecret, setShopierApiSecret] = useState("");
  const [shopierWebsiteIndex, setShopierWebsiteIndex] = useState("1");
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
        // Shopier
        if (data.settings.SHOPIER_API_KEY) setShopierApiKey(data.settings.SHOPIER_API_KEY);
        if (data.settings.SHOPIER_API_SECRET) setShopierApiSecret(data.settings.SHOPIER_API_SECRET);
        if (data.settings.SHOPIER_WEBSITE_INDEX) setShopierWebsiteIndex(data.settings.SHOPIER_WEBSITE_INDEX);

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
        SHOPIER_API_KEY: shopierApiKey.trim(),
        SHOPIER_API_SECRET: shopierApiSecret.trim(),
        SHOPIER_WEBSITE_INDEX: shopierWebsiteIndex.trim() || "1",
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
          branchCode: newBranchCode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewBankName("");
        setNewAccountHolder("");
        setNewIban("");
        setNewBranchCode("");
        loadSettings();
      } else {
        alert(data.message || "Banka hesabı eklenemedi.");
      }
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setAddingBank(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Bu banka hesabını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/bank-accounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadSettings();
      }
    } catch (e) {
      alert("Silinemedi.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Sistem & Ödeme Ayarları</h1>
        <p className="text-xs text-gray-400 mt-1">
          Shopier Sanal POS (api_pay4.php), Tedarikçi API entegrasyonu, Google Analytics & Clarity takip kodları ve EFT/Havale banka hesapları.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Resmi Shopier 3D Secure Sanal POS (api_pay4.php) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#141b2d] border border-orange-500/30 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400 shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">Shopier 3D Secure Sanal POS (api_pay4.php)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black border border-orange-500/20">
                    Resmi Entegrasyon
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  yayincikral.com için onaylanan Shopier hesabınızın API Key, Secret ve Webhook yapılandırması.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-bold">
              <span className={`px-2.5 py-1 rounded-full border ${shopierApiKey && shopierApiSecret ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {shopierApiKey && shopierApiSecret ? 'Shopier: Aktif' : 'Shopier: Yapılandırılmadı'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* API Key */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">Shopier API Kullanıcı (API Key)</label>
              <input
                type="text"
                value={shopierApiKey}
                onChange={(e) => setShopierApiKey(e.target.value)}
                placeholder="Örn: 98a7bc..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">Shopier panelindeki genel anahtarınız</span>
            </div>

            {/* API Secret */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">Shopier API Şifre (API Secret)</label>
              <input
                type="password"
                value={shopierApiSecret}
                onChange={(e) => setShopierApiSecret(e.target.value)}
                placeholder="Örn: 4321fedc..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">HMAC-SHA256 imzası için gizli şifre</span>
            </div>

            {/* Website Index */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-bold">Shopier Website Index (Varsayılan: 1)</label>
              <input
                type="number"
                value={shopierWebsiteIndex}
                onChange={(e) => setShopierWebsiteIndex(e.target.value)}
                placeholder="1"
                min="1"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500 transition"
              />
              <span className="text-[10px] text-gray-500 block">Shopier mağaza web sitesi sıra numarası</span>
            </div>
          </div>

          {/* Geri Dönüş URL'si (Webhook / Callback URL) Kutusu */}
          <div className="p-4 rounded-2xl bg-[#131D33] border border-orange-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Shopier Geri Dönüş URL (Callback / Webhook URL)</span>
              </span>
              <span className="text-[10px] text-gray-400">Entegrasyonlar sayfasında tanımlayınız</span>
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
              Shopier yönetim panelinizde <strong>Ayarlar &gt; Webhook / Geri Dönüş URL</strong> alanına bu adresi yapıştırınız. Müşteri ödemeyi tamamladığı anda Shopier bu adrese otomatik bildirim gönderir; sistem ödemeyi <strong>&apos;PAID&apos;</strong> yapar, tedarik siparişini MoreThanPanel&apos;e iletir ve müşteriyi <strong>/siparis-basarili</strong> sayfasına aktarır.
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
                {gaId && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Entegre Edildi</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="Örn: G-ABC123XYZ0"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Google Analytics 4 panelinden aldığınız Ölçüm Kimliği. Ziyaretçi sayıları, sayfa görüntülenmeleri ve dönüşümleri anlık izler.
              </p>
            </div>

            {/* Microsoft Clarity Proje Kodu */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#131D33] border border-gray-700/60">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Microsoft Clarity Proje Kodu</span>
                </label>
                {clarityId && (
                  <span className="text-[10px] text-blue-400 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Entegre Edildi</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={clarityId}
                onChange={(e) => setClarityId(e.target.value)}
                placeholder="Örn: z5g2hnll19"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Microsoft Clarity kontrol panelinizdeki Proje ID&apos;si. Oturum kayıtları ve ısı haritaları sağlar.
              </p>
            </div>
          </div>
        </div>

        {/* 3. MoreThanPanel API Ayarları */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-[#9146FF]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MoreThanPanel API v2 Yapılandırması</h3>
              <p className="text-xs text-gray-400">
                Siparişlerin otomatik tedarikçiye iletilmesini sağlayan altyapı bağlantısı.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">API Endpoint URL</label>
              <input
                type="text"
                value={mtpUrl}
                onChange={(e) => setMtpUrl(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">
                MoreThanPanel API Key (Gizli Anahtar)
              </label>
              <input
                type="password"
                value={mtpKey}
                onChange={(e) => setMtpKey(e.target.value)}
                placeholder="Örn: 98f12c8b74..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Anahtar boş veya DEMO ise test simülasyonu çalışır.
              </span>
            </div>
          </div>
        </div>

        {/* 4. PayTR Sanal POS Ayarları (Yedek) */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">PayTR 3D Secure Sanal POS (Yedek POS)</h3>
                <p className="text-xs text-gray-400">
                  Kredi ve banka kartı ödemeleri için alternatif PayTR mağaza bilgileri.
                </p>
              </div>
            </div>

            {/* Test Modu Toggle */}
            <div
              onClick={() => setTestMode(!testMode)}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-[#1E293B] border border-gray-700"
            >
              <span className="text-xs font-semibold text-gray-300">Test Modu:</span>
              {testMode ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <span>AÇIK</span>
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                </span>
              ) : (
                <span className="text-xs font-bold text-gray-500 flex items-center space-x-1">
                  <span>KAPALI</span>
                  <ToggleLeft className="w-5 h-5 text-gray-500" />
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">PayTR Mağaza No (Merchant ID)</label>
              <input
                type="text"
                value={paytrId}
                onChange={(e) => setPaytrId(e.target.value)}
                placeholder="Örn: 123456"
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">PayTR Mağaza Parolası (Merchant Key)</label>
              <input
                type="password"
                value={paytrKey}
                onChange={(e) => setPaytrKey(e.target.value)}
                placeholder="Örn: X1y2Z3a4..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">PayTR Gizli Tuz (Merchant Salt)</label>
              <input
                type="password"
                value={paytrSalt}
                onChange={(e) => setPaytrSalt(e.target.value)}
                placeholder="Örn: aB3cD4..."
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[#9146FF]"
              />
            </div>
          </div>
        </div>

        {/* 5. İletişim & Destek Ayarları */}
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

      {/* 6. EFT / Havale Banka Hesapları Yönetimi */}
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
        </div>

        {/* Yeni Banka Ekleme Formu */}
        <form
          onSubmit={handleAddBank}
          className="p-4 rounded-2xl bg-[#131D33] border border-gray-700/80 space-y-3 text-xs"
        >
          <h4 className="font-bold text-white">Yeni Banka Hesabı Ekle</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                placeholder="Banka Adı (Örn: Ziraat)"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Hesap Sahibi / Şirket"
                value={newAccountHolder}
                onChange={(e) => setNewAccountHolder(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="TRXX XXXX..."
                value={newIban}
                onChange={(e) => setNewIban(e.target.value.toUpperCase())}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Şube Kodu (Opsiyonel)"
                value={newBranchCode}
                onChange={(e) => setNewBranchCode(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={addingBank}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addingBank ? "Ekleniyor..." : "Hesabı Kaydet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
