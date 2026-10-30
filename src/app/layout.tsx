import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import TrackingScripts from "@/components/TrackingScripts";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yayincikral.com"),
  title: {
    default: "Yayıncı Kral | Türkiye'nin 1 Numaralı Yayıncı ve Sosyal Medya Hizmetleri",
    template: "%s | Yayıncı Kral",
  },
  description:
    "Yayıncı Kral ile Twitch, Kick, YouTube, TikTok ve Instagram için anlık, şifresiz ve garantili canlı yayın izleyici, abone ve takipçi paketleri. 7/24 kesintisiz destek.",
  keywords: [
    "kick izleyici botu",
    "kick canlı izleyici satın al",
    "twitch izleyici botu",
    "twitch takipçi satın al",
    "kick saatlik izleyici",
    "kick aylık izleyici desteği",
    "twitch stabil canlı izleyici",
    "yayıncı kral",
    "yayincikral",
    "yayincikral.com",
    "yayıncı desteği",
    "twitch canlı izleyici satın al",
    "kick canlı izleyici",
    "youtube abone satın al",
    "tiktok izlenme satın al",
    "instagram takipçi satın al",
    "yayıncı paneli",
    "canlı yayın botu",
    "sosyal medya paketleri",
    "smm panel türkiye",
  ],
  authors: [{ name: "Yayıncı Kral" }],
  creator: "Yayıncı Kral",
  publisher: "Yayıncı Kral",
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    title: "Yayıncı Kral | Türkiye'nin 1 Numaralı Yayıncı ve Sosyal Medya Hizmetleri",
    description:
      "Twitch, Kick, YouTube, TikTok ve Instagram için %100 şifresiz, anlık ve garantili canlı yayın izleyici, abone ve takipçi hizmetleri.",
    url: "https://yayincikral.com",
    siteName: "Yayıncı Kral",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yayıncı Kral | Yayıncı ve Sosyal Medya Hizmetleri",
    description:
      "Twitch, Kick, YouTube, TikTok ve Instagram için en kaliteli dijital büyüme ve izleyici çözümleri.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${jakarta.variable} font-sans h-full antialiased`}>
      <head>
        {/* Organization ve WebSite Schema.org Yapısal Veri (Google SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.yayincikral.com/#organization",
                  name: "Yayıncı Kral",
                  url: "https://www.yayincikral.com",
                  logo: "https://www.yayincikral.com/og-image.png",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+905331948396",
                    contactType: "customer service",
                    areaServed: "TR",
                    availableLanguage: "Turkish",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.yayincikral.com/#website",
                  url: "https://www.yayincikral.com",
                  name: "Yayıncı Kral",
                  description:
                    "Türkiye'nin 1 Numaralı Yayıncı ve Sosyal Medya Hizmetleri. Kick izleyici botu, Twitch canlı izleyici ve takipçi paketleri.",
                  publisher: {
                    "@id": "https://www.yayincikral.com/#organization",
                  },
                },
              ],
            }),
          }}
        />
        {/* Microsoft Clarity Resmi İzleme Kodu */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "z5g2hnll19");
          `}
        </Script>
        <Suspense fallback={null}>
          <TrackingScripts />
        </Suspense>
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F9FD] text-[#1E1B4B] selection:bg-[#7C1CF5] selection:text-white">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
