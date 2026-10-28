import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yayincikral.com";

  // Sabit Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/siparis-sorgula`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/iptal-iade-kosullari`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/musteri-sozlesmesi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  try {
    // 1. Platform Sayfaları (/servis/twitch, /servis/kick, /servis/youtube vb.)
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const platformUrls: MetadataRoute.Sitemap = platforms.map((p) => ({
      url: `${baseUrl}/servis/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    // 2. Kategori Sayfaları (/servis/twitch-saatlik-canli-izleyici vb.)
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/servis/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
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
      lastModified: pkg.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...platformUrls, ...categoryUrls, ...packageUrls];
  } catch (error) {
    console.error("Sitemap oluşturulurken hata:", error);
    return staticPages;
  }
}
