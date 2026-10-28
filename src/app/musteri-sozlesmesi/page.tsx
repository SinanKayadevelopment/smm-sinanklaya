import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | Yayıncı Kral",
  description: "Yayıncı Kral (yayincikral.com) üzerinden gerçekleştirilen dijital destek hizmeti alımlarına ilişkin Mesafeli Satış Sözleşmesi.",
};

export default function CustomerAgreementPage() {
  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col justify-between selection:bg-[#00F2FE] selection:text-[#060B18]">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] shadow-2xl">
          <div className="border-b border-[#1A3060] pb-6">
            <h1 className="text-3xl font-extrabold text-white">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-xs text-gray-400 mt-2">
              Son Güncelleme: 1 Ocak 2026 • 6502 sayılı Tüketicinin Korunması Hakkında Kanun Uyarınca Düzenlenmiştir.
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">Madde 1: Taraflar</h2>
              <p>
                <strong>SATICI:</strong> Yayıncı Kral Yayıncı Destek ve Bilişim Hizmetleri
                <br />
                E-Posta: destek@yayincikral.com | Telefon: +90 (533) 194 83 96
              </p>
              <p>
                <strong>ALICI (MÜŞTERİ):</strong> www.yayincikral.com internet sitesi üzerinden üyeliksiz veya kayıtlı olarak sipariş formunda belirtilen dijital destek paketini satın alan kişi veya kurumdur.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">Madde 2: Sözleşmenin Konusu</h2>
              <p>
                İşbu sözleşmenin konusu; ALICI&apos;nın SATICI&apos;ya ait internet sitesinden elektronik ortamda siparişini yaptığı, sitede özellikleri ve satış fiyatı belirtilen dijital yayıncı etkileşim ve sosyal medya büyüme destek hizmetlerinin satışı ve teslimi ile ilgili hak ve yükümlülüklerin belirlenmesidir.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">Madde 3: Hizmetin Niteliği ve İfa Şekli</h2>
              <p>
                Satın alınan hizmetler elektronik ortamda anında ifa edilen gayri maddi nitelikteki dijital etkileşim, canlı yayın görünürlük ve kanal güçlendirme çözümleridir.
                ALICI, sipariş esnasında yalnızca kendi mülkiyetindeki veya yetkili olduğu kanal / profil bağlantısını girmekle yükümlüdür.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">Madde 4: Ödeme ve Teslimat Koşulları</h2>
              <p>
                Ödemeler PayTR 3D Güvenli Ortak Ödeme Altyapısı veya resmi banka hesaplarımıza EFT/Havale yoluyla gerçekleştirilir. Ödemesi onaylanan siparişler, seçilen paketin türüne göre belirtilen süre zarfında otomatik olarak işleme alınır.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">Madde 5: Cayma Hakkı İstisnası</h2>
              <p>
                6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi 1. fıkrası (ğ) bendi uyarınca; <em>&ldquo;Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler&rdquo;</em> kapsamında cayma hakkı bulunmamaktadır. Hizmet ifası başladıktan sonra iptal veya iade talep edilemez.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
