import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "İptal ve İade Koşulları | Yayıncı Kral",
  description: "Yayıncı Kral dijital yayıncı ve sosyal medya destek hizmetlerinin iptal, telafi ve iade politikaları.",
};

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col justify-between selection:bg-[#00F2FE] selection:text-[#060B18]">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 p-8 rounded-3xl bg-[#0C1833] border border-[#1A3060] shadow-2xl">
          <div className="border-b border-[#1A3060] pb-6">
            <h1 className="text-3xl font-extrabold text-white">İptal ve İade Koşulları</h1>
            <p className="text-xs text-gray-400 mt-2">
              Dijital Etkileşim ve Yayıncı Destek Hizmetlerinde İade ve Telafi Esasları.
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 space-y-6 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Dijital Hizmetlerin Niteliği</h2>
              <p>
                Platformumuzda sunulan tüm hizmetler anında elektronik ortamda işleme alınan dijital destek ürünleridir. İşleme alınan veya tamamlanan siparişlerde teknik olarak işlemin geri alınması veya iptal edilmesi mümkün değildir.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Koşulsuz İade Durumları</h2>
              <p>
                Aşağıdaki hallerde müşterilerimize ödedikleri tutar kesintisiz olarak iade edilir:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sistem kaynaklı bir arıza sebebiyle siparişin 24 saat içerisinde hiç başlatılamaması durumunda,</li>
                <li>Müşterinin yanlışlıkla mükerrer (çift) ödeme yapması durumunda,</li>
                <li>Tedarik altyapısı kaynaklı kalıcı bir servis kesintisi oluşması halinde.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Telafi ve Destek Garantisi</h2>
              <p>
                Paket açıklamalarında &ldquo;Düşüşe Karşı Garanti&rdquo; veya &ldquo;Telafi Garantisi&rdquo; belirtilen hizmetlerde, belirtilen süre içerisinde olası bir azalma meydana gelirse 7/24 destek ekibimiz üzerinden ücretsiz otomatik telafi tanımlanır.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. İade Süreci ve Geri Ödeme Şekli</h2>
              <p>
                Onaylanan iadeler, ödemenin yapıldığı kredi kartına veya banka hesabına 1-3 iş günü içerisinde PayTR / Banka takas sistemleri aracılığıyla yansıtılır.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
