import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-[#F8F9FD] text-[#1E1B4B] selection:bg-[#7C1CF5] selection:text-white">
        {children}
      </body>
    </html>
  );
}
