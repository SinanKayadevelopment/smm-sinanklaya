"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  User,
  Tag,
  AlertTriangle,
  Lock,
  Smartphone,
  Copy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PlatformLogo from "@/components/PlatformLogo";

interface PackageDetails {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  quantity: number;
  features: string;
  category: {
    name: string;
    platform: {
      name: string;
      colorCode: string;
      slug: string;
    };
  };
}

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branchCode?: string | null;
}

export default function OrderCreatePage() {
  const params = useParams();
  const router = useRouter();
  const packageSlug = params.packageSlug as string;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pkg, setPkg] = useState<PackageDetails | null>(null);
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // Adım 1: İşlem Detayları
  const [targetLink, setTargetLink] = useState("");

  // Adım 2: Kişisel Bilgiler
  const [customerType, setCustomerType] = useState<"BIREYSEL" | "KURUMSAL">("BIREYSEL");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNumber, setTaxNumber] = useState("");

  // Adım 3: Ödeme Bilgileri
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE_SHOPIER" | "ONLINE_PAYTR" | "EFT_HAVALE" | "MOBIL_ODEME">(
    "ONLINE_PAYTR"
  );

  // Adım 4: Sipariş Sonucu / Ödeme Ekranı
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  useEffect(() => {
    if (!packageSlug) return;
    setLoadingPkg(true);
    fetch(`/api/packages/${packageSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPkg(data.package);
        }
      })
      .catch((err) => console.error("Paket yüklenemedi:", err))
      .finally(() => setLoadingPkg(false));

    fetch(`/api/bank-accounts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBankAccounts(data.bankAccounts);
        }
      })
      .catch((err) => console.error("Banka hesapları yüklenemedi:", err));
  }, [packageSlug]);

  const originalPrice = pkg?.price || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  // Kupon Uygulama
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), amount: originalPrice }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon({
          code: data.couponCode,
          discountPercent: data.discountPercent,
          discountAmount: data.discountAmount,
        });
      } else {
        setCouponError(data.message || "Geçersiz kupon kodu.");
      }
    } catch (e) {
      setCouponError("Kupon kontrol edilirken bir hata oluştu.");
    } finally {
      setCouponLoading(false);
    }
  };

  // 3. Adımdan 4. Adıma Geçiş (Siparişi DB'de Oluşturma)
  const handleProceedToPayment = async () => {
    if (!pkg) return;
    setOrderSubmitting(true);

    try {
      const payload = {
        packageId: pkg.id,
        targetLink: targetLink.trim(),
        customerType,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        companyName: customerType === "KURUMSAL" ? companyName.trim() : null,
        taxNumber: customerType === "KURUMSAL" ? `${taxOffice} / ${taxNumber}` : null,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod,
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrder(data.order);
        if (data.shopier?.fields && (paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR")) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.shopier.actionUrl || "https://www.shopier.com/ShowProduct/api_pay4.php";
          form.style.display = "none";
          for (const [k, v] of Object.entries(data.shopier.fields)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = k;
            input.value = String(v);
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          return;
        }
        setStep(4);
      } else {
        alert(data.message || "Sipariş oluşturulamadı.");
      }
    } catch (e) {
      alert("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  // 4. Adım Ödeme Onayı / Simülasyonu
  const handleConfirmPayment = async () => {
    if (!createdOrder) return;
    setPaymentLoading(true);

    try {
      const res = await fetch("/api/orders/pay-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: createdOrder.orderCode,
          method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccess(true);
      } else {
        alert(data.message || "İşlem sırasında bir hata oluştu.");
      }
    } catch (e) {
      alert("Ödeme servisiyle iletişim kurulamadı.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(text);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  if (loadingPkg) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#7C1CF5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Yükseliş paketi bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B] flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Paket Bulunamadı</h2>
          <p className="text-sm text-gray-500 font-medium">
            Aradığınız destek paketi bulunamadı veya hizmete kapatılmıştır.
          </p>
          <Link
            href="/"
            className="btn-theme inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B] py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#7C1CF5] selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Üst Gezinme */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-[#7C1CF5] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paket Seçimine Dön</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5 text-[#7C1CF5]" />
            <span>256-Bit SSL Korumalı Güvenli Sipariş</span>
          </div>
        </div>

        {/* 4 Adımlı Stepper Bar */}
        <div className="mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, title: "İşlem Detayları" },
              { num: 2, title: "Kişisel Bilgiler" },
              { num: 3, title: "Ödeme Bilgileri" },
              { num: 4, title: "Ödeme Adımı" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    step === s.num
                      ? "bg-gradient-to-r from-[#7C1CF5] to-[#9333EA] text-white shadow-[0_4px_18px_rgba(124,28,245,0.4)] font-black"
                      : step > s.num
                      ? "bg-[#F3E8FF] text-[#7C1CF5] border border-[#EDE9FE]"
                      : "bg-white text-gray-400 border border-[#EDE9FE]"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-semibold truncate w-full ${
                    step === s.num
                      ? "text-[#7C1CF5] font-black"
                      : step > s.num
                      ? "text-gray-700 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Paket Özet Kartı */}
        <div className="rounded-3xl bg-white border border-[#EDE9FE] p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg text-[#1E1B4B]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] shadow-sm flex items-center justify-center p-2 shrink-0">
              <PlatformLogo platform={pkg.category.platform.slug} size={30} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5]"
                >
                  {pkg.category.platform.name}
                </span>
                <span className="text-xs text-gray-500 font-medium">{pkg.category.name}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#1E1B4B] mt-0.5">{pkg.name}</h2>
            </div>
          </div>

          <div className="flex items-baseline space-x-2 text-right self-end sm:self-center">
            <span className="text-2xl font-black text-[#7C1CF5] font-mono">{pkg.price.toFixed(2)} ₺</span>
            {pkg.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {pkg.oldPrice.toFixed(2)} ₺
              </span>
            )}
          </div>
        </div>

        {/* ADIM İÇERİKLERİ */}
        <div className="rounded-3xl bg-white border border-[#EDE9FE] p-6 sm:p-8 shadow-xl text-[#1E1B4B]">
          {/* ========================================================= */}
          {/* 1. ADIM: İŞLEM DETAYLARI */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#1E1B4B] mb-1">1. Adım: İşlem Detayları</h3>
                <p className="text-xs text-gray-500">
                  Lütfen yükseliş desteğinin aktarılacağı herkese açık bağlantı adresinizi belirtin.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Kanal / Profil Bağlantı Adresi <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder={`https://www.${pkg.category.platform.slug}.com/kanal-veya-profil-adiniz`}
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  className="input-theme w-full px-4 py-3.5 text-xs text-[#1E1B4B] placeholder-gray-400 font-mono"
                  required
                />
              </div>

              {/* Uyarı Kutusu */}
              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] text-[#6D28D9] text-xs flex items-start space-x-3 leading-relaxed">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#7C1CF5] mt-0.5" />
                <div>
                  <span className="font-bold block mb-1 text-[#1E1B4B]">Önemli Hatırlatma:</span>
                  Sadece kanal veya profil bağlantı adresinizi girin. Başka herhangi bir bilgi
                  girmeyin. Kanal adının doğru olduğundan emin olun, işlem başladıktan sonra bağlantı
                  değiştirilemez.
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!targetLink.trim()) {
                      alert("Lütfen kanal veya profil bağlantı adresinizi giriniz.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="btn-theme py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 font-black"
                >
                  <span>Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ADIM: KİŞİSEL BİLGİLER */}
          {/* ========================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#1E1B4B] mb-1">2. Adım: Kişisel Bilgiler</h3>
                <p className="text-xs text-gray-500">
                  Sipariş takibi ve e-fatura bildirimi için iletişim bilgilerinizi giriniz.
                </p>
              </div>

              {/* Sekme Seçimi: Bireysel / Kurumsal */}
              <div className="flex p-1 rounded-xl bg-[#FAF5FF] border border-[#EDE9FE] max-w-xs">
                <button
                  type="button"
                  onClick={() => setCustomerType("BIREYSEL")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                    customerType === "BIREYSEL"
                      ? "bg-[#7C1CF5] text-white shadow-md font-black"
                      : "text-gray-500 hover:text-[#1E1B4B]"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Bireysel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("KURUMSAL")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                    customerType === "KURUMSAL"
                      ? "bg-[#7C1CF5] text-white shadow-md font-black"
                      : "text-gray-500 hover:text-[#1E1B4B]"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Kurumsal</span>
                </button>
              </div>

              {/* Form Alanları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Adınız ve Soyadınız"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-botcubey w-full px-4 py-3 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    E-Posta Adresi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ornek@domain.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="input-botcubey w-full px-4 py-3 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Telefon Numarası <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input-botcubey w-full px-4 py-3 text-xs"
                    required
                  />
                </div>

                {customerType === "KURUMSAL" && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Firma / Şirket Unvanı <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: ABC Medya Ltd. Şti."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="input-botcubey w-full px-4 py-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Vergi Dairesi
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Kadıköy V.D."
                        value={taxOffice}
                        onChange={(e) => setTaxOffice(e.target.value)}
                        className="input-botcubey w-full px-4 py-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Vergi Kimlik Numarası (VKN)
                      </label>
                      <input
                        type="text"
                        placeholder="10 Haneli VKN"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                        className="input-botcubey w-full px-4 py-3 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Butonlar */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-6 rounded-xl bg-[#FAF5FF] text-gray-700 font-bold text-xs hover:bg-[#F3E8FF] transition flex items-center space-x-2 border border-[#EDE9FE]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
                      alert("Lütfen ad, e-posta ve telefon alanlarını doldurunuz.");
                      return;
                    }
                    setStep(3);
                  }}
                  className="btn-theme py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 font-black"
                >
                  <span>Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. ADIM: ÖDEME BİLGİLERİ */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#1E1B4B] mb-1">3. Adım: Ödeme Bilgileri</h3>
                <p className="text-xs text-gray-500">
                  Kupon kodunuzu tanımlayın ve dilediğiniz ödeme yöntemini seçin.
                </p>
              </div>

              {/* Kupon Kodu Alanı */}
              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] space-y-3">
                <label className="block text-xs font-bold text-gray-700">
                  İndirim Kuponu Kodu
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Örn: YUKSELIS10 veya YAYINCI15"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-theme w-full pl-10 pr-4 py-2.5 text-xs font-mono uppercase bg-white border border-[#EDE9FE] text-[#1E1B4B]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-theme px-6 rounded-xl text-xs font-black disabled:opacity-50"
                  >
                    {couponLoading ? "Kontrol..." : "UYGULA"}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center space-x-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>{appliedCoupon.code}</strong> kodu ile %
                      {appliedCoupon.discountPercent} indirim uygulandı (-
                      {appliedCoupon.discountAmount.toFixed(2)} ₺).
                    </span>
                  </div>
                )}

                {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
              </div>

              {/* 3 Ödeme Yöntemi Seçenek Kartı */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">
                  Ödeme Yöntemi Tercihi <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Online Ödeme */}
                  <div
                    onClick={() => setPaymentMethod("ONLINE_SHOPIER")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR"
                        ? "bg-[#FAF5FF] border-[#7C1CF5] shadow-[0_4px_20px_rgba(124,28,245,0.18)]"
                        : "bg-white border-[#EDE9FE] hover:border-[#7C1CF5]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CreditCard className="w-5 h-5 text-[#7C1CF5]" />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR"
                            ? "border-[#7C1CF5] bg-[#7C1CF5]"
                            : "border-gray-300"
                        }`}
                      >
                        {(paymentMethod === "ONLINE_SHOPIER" || paymentMethod === "ONLINE_PAYTR") && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1B4B] mb-0.5">Online Ödeme</h4>
                      <p className="text-[11px] text-gray-500 font-medium">Kredi / Banka Kartı (Shopier 3D Secure)</p>
                    </div>
                  </div>

                  {/* 2. EFT / Havale */}
                  <div
                    onClick={() => setPaymentMethod("EFT_HAVALE")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === "EFT_HAVALE"
                        ? "bg-[#FAF5FF] border-[#7C1CF5] shadow-[0_4px_20px_rgba(124,28,245,0.18)]"
                        : "bg-white border-[#EDE9FE] hover:border-[#7C1CF5]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Building2 className="w-5 h-5 text-emerald-500" />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "EFT_HAVALE"
                            ? "border-[#7C1CF5] bg-[#7C1CF5]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "EFT_HAVALE" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1B4B] mb-0.5">EFT / Havale</h4>
                      <p className="text-[11px] text-gray-500 font-medium">Banka Hesabına Anında Transfer</p>
                    </div>
                  </div>

                  {/* 3. Mobil Ödeme */}
                  <div
                    onClick={() => setPaymentMethod("MOBIL_ODEME")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === "MOBIL_ODEME"
                        ? "bg-[#FAF5FF] border-[#7C1CF5] shadow-[0_4px_20px_rgba(124,28,245,0.18)]"
                        : "bg-white border-[#EDE9FE] hover:border-[#7C1CF5]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Smartphone className="w-5 h-5 text-[#7C1CF5]" />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "MOBIL_ODEME"
                            ? "border-[#7C1CF5] bg-[#7C1CF5]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "MOBIL_ODEME" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1B4B] mb-0.5">Mobil Ödeme</h4>
                      <p className="text-[11px] text-gray-500 font-medium">Faturaya Yansıtma İmkanı</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiyat Özeti */}
              <div className="p-5 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] space-y-3">
                <h4 className="text-xs font-black text-[#1E1B4B] uppercase tracking-wider mb-2">
                  Fiyat Özeti
                </h4>
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Ürün Ücreti:</span>
                  <span className="font-bold text-[#1E1B4B]">{originalPrice.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Hizmet Bedeli:</span>
                  <span className="font-bold text-emerald-600">0.00 ₺ (Ücretsiz)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Kupon İndirimi:</span>
                  <span className="font-bold text-[#7C1CF5]">
                    -{discountAmount.toFixed(2)} ₺
                  </span>
                </div>
                <div className="pt-3 border-t border-[#EDE9FE] flex justify-between items-baseline">
                  <span className="text-sm font-black text-[#1E1B4B]">Ödenmesi Gereken Tutar:</span>
                  <span className="text-2xl font-black text-[#7C1CF5] font-mono">
                    {finalPrice.toFixed(2)} ₺
                  </span>
                </div>
              </div>

              {/* Butonlar */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl bg-[#FAF5FF] text-gray-700 font-bold text-xs hover:bg-[#F3E8FF] transition flex items-center space-x-2 border border-[#EDE9FE]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={orderSubmitting}
                  className="btn-theme py-4 px-9 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 disabled:opacity-50 font-black"
                >
                  <span>{orderSubmitting ? "Sipariş Hazırlanıyor..." : "ÖDEMEYE GEÇ"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. ADIM: ÖDEME ADIMI */}
          {/* ========================================================= */}
          {step === 4 && createdOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
                <div>
                  <h3 className="text-xl font-black text-[#1E1B4B]">4. Adım: Ödeme Adımı</h3>
                  <p className="text-xs text-gray-500">
                    Sipariş Kodunuz:{" "}
                    <span className="font-mono font-bold text-[#7C1CF5]">
                      {createdOrder.orderCode}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Ödenecek Tutar</span>
                  <span className="text-xl font-black text-[#7C1CF5] font-mono">
                    {createdOrder.totalAmount.toFixed(2)} ₺
                  </span>
                </div>
              </div>

              {paymentSuccess ? (
                /* Başarı Ekranı */
                <div className="p-8 rounded-3xl bg-[#FAF5FF] border border-[#EDE9FE] text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F3E8FF] text-[#7C1CF5] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-[#1E1B4B]">İşleminiz Başarıyla Alındı!</h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Siparişiniz sistemimize kaydedilmiş olup otomatik tedarik kuyruğuna alınmıştır.
                    Sipariş kodunuzla durumunuzu canlı olarak takip edebilirsiniz.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE] max-w-xs mx-auto font-mono text-sm text-[#7C1CF5] font-black shadow-sm">
                    {createdOrder.orderCode}
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={`/siparis-sorgula?kod=${createdOrder.orderCode}`}
                      className="btn-theme px-6 py-3 rounded-xl text-xs font-black shadow-md"
                    >
                      Sipariş Durumunu Takip Et
                    </Link>
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-xl bg-white border border-[#EDE9FE] hover:bg-gray-50 text-gray-700 text-xs font-bold transition shadow-sm"
                    >
                      Ana Sayfaya Dön
                    </Link>
                  </div>
                </div>
              ) : paymentMethod === "EFT_HAVALE" ? (
                /* EFT / Havale Ekranı */
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] text-[#6D28D9] text-xs flex items-center space-x-2.5">
                    <Building2 className="w-5 h-5 shrink-0 text-[#7C1CF5]" />
                    <span>
                      Lütfen aşağıdaki banka hesaplarımızdan birine{" "}
                      <strong>{createdOrder.totalAmount.toFixed(2)} ₺</strong> tutarı transfer ediniz.
                      Açıklama kısmına <strong>{createdOrder.orderCode}</strong> kodunu yazmayı unutmayınız.
                    </span>
                  </div>

                  {/* Banka Hesapları Listesi */}
                  <div className="space-y-3">
                    {bankAccounts.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-white border border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-[#7C1CF5]/50 transition"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-[#1E1B4B]">{b.bankName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5FF] text-gray-500 font-semibold">
                              Şube: {b.branchCode || "Merkez"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Alıcı: {b.accountHolder}</p>
                          <p className="text-xs font-mono text-[#7C1CF5] font-bold mt-1">{b.iban}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(b.iban)}
                          className="px-3.5 py-2 rounded-xl bg-[#F3E8FF] hover:bg-[#7C1CF5] hover:text-white text-xs font-bold text-[#7C1CF5] flex items-center space-x-1.5 self-start sm:self-center transition shadow-sm"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedIban === b.iban ? "Kopyalandı!" : "IBAN Kopyala"}</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={paymentLoading}
                      className="btn-theme w-full py-4 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50 font-black"
                    >
                      {paymentLoading ? "Bildirim İletiliyor..." : "Ödemeyi Yaptım, Bildirim Gönder"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Online Ödeme / PayTR Simülasyon Ekranı */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#FAF5FF] border border-[#EDE9FE] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-[#7C1CF5]" />
                        <span className="text-xs font-bold text-[#1E1B4B]">Shopier 3D Secure Güvenli Ödeme Ekranı</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C1CF5] font-black">
                        Shopier 3D Secure Doğrulandı
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <p>
                        Güvenli ortak ödeme simülasyonu devrededir. Tek tıkla ödemeyi onaylayabilir
                        ve gerçek zamanlı sipariş/tedarik akışını deneyimleyebilirsiniz.
                      </p>
                      <div className="p-3.5 rounded-xl bg-white border border-[#EDE9FE] space-y-1 font-mono text-[11px] text-[#1E1B4B] shadow-sm">
                        <div>Sipariş Kodu: {createdOrder.orderCode}</div>
                        <div>Müşteri: {createdOrder.customerName} ({createdOrder.customerEmail})</div>
                        <div>Tutar: {createdOrder.totalAmount.toFixed(2)} ₺</div>
                      </div>
                    </div>

                    <a
                      href={`/api/payment/shopier-pay?orderCode=${createdOrder.orderCode}`}
                      className="btn-theme w-full py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 font-black shadow-lg shadow-purple-600/30 mb-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Shopier ile Güvenli Öde ({createdOrder.totalAmount.toFixed(2)} ₺)</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>

                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={paymentLoading}
                      className="w-full py-2.5 rounded-xl text-[11px] text-gray-500 hover:text-gray-700 underline flex items-center justify-center space-x-1 font-medium transition"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {paymentLoading ? "3D Güvenlik Doğrulanıyor..." : "Test Ödemesini Onayla (Simülasyon)"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
