import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.yayincikral.com";
  const now = new Date();

  // Sabit Kurumsal ve Genel Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/siparis-sorgula`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/iptal-iade-kosullari`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/musteri-sozlesmesi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  try {
    // 1. Platform Sayfaları (/servis/kick, /servis/twitch, /servis/youtube vb.)
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const platformUrls: MetadataRoute.Sitemap = platforms.map((p) => ({
      url: `${baseUrl}/servis/${p.slug}`,
      lastModified: p.updatedAt || now,
      changeFrequency: "daily",
      priority: 0.9,
    }));

    // 2. Kategori Sayfaları (/servis/kick-saatlik-canli-izleyici vb.)
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/servis/${c.slug}`,
      lastModified: c.updatedAt || now,
      changeFrequency: "daily",
      priority: 0.9,
    }));

    // 3. Paket Sipariş Sayfaları (/siparis-olustur/[slug])
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const packageUrls: MetadataRoute.Sitemap = packages.map((pkg) => ({
      url: `${baseUrl}/siparis-olustur/${pkg.slug}`,
      lastModified: pkg.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...platformUrls, ...categoryUrls, ...packageUrls];
  } catch (error) {
    console.error("Sitemap oluşturulurken hata:", error);
    return staticPages;
  }
}
