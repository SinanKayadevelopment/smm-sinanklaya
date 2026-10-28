import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Gizlilik ve Çerez Politikası | Yayıncı Kral",
  description: "6698 sayılı KVKK kapsamında kişisel verilerinizin korunması ve gizlilik taahhütlerimiz.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col justify-between selection:bg-[#00F2FE] selection:text-[#060B18]">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] shadow-2xl">
          <div className="border-b border-[#1A3060] pb-6">
            <h1 className="text-3xl font-extrabold text-white">Gizlilik ve Kişisel Verilerin Korunması</h1>
            <p className="text-xs text-gray-400 mt-2">
              KVKK Aydınlatma Metni ve Veri Güvenliği Standartlarımız.
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Veri Sorumlusu</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca kişisel verileriniz; veri sorumlusu olarak Yayıncı Kral Yayıncı Destek ve Bilişim Hizmetleri tarafından aşağıda açıklanan kapsamda işlenmektedir.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Hangi Bilgileri Topluyoruz?</h2>
              <p>
                Platformumuz üyelik gerektirmemektedir. Sipariş sırasında yalnızca siparişin takibi, faturalandırılması ve ifası için zorunlu olan:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ad Soyad (veya Kurumsal Unvan)</li>
                <li>E-Posta Adresi (Sipariş bilgilendirmesi için)</li>
                <li>Telefon Numarası (SMS veya WhatsApp bildirimleri için)</li>
                <li>Hedef Kanal / Profil Bağlantısı (Herkese açık bağlantı adresi)</li>
              </ul>
              <p className="text-emerald-400 font-semibold mt-2">
                Şifreniz veya hesabınıza ait özel giriş bilgileriniz KESİNLİKLE talep edilmez ve saklanmaz.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Ödeme Bilgilerinin Güvenliği</h2>
              <p>
                Kredi kartı ve banka kartı ödemeleriniz doğrudan PayTR Sanal POS ortak ödeme sayfası üzerinden SSL şifreli ve PCI-DSS uyumlu olarak gerçekleştirilir. Kart bilgileriniz firmamız sunucularında asla tutulmaz ve işlenmez.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
