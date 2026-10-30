import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface PackageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ packageSlug: string }>;
}

async function getPackageData(slug: string) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            platform: true,
          },
        },
      },
    });
    return pkg;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ packageSlug: string }>;
}): Promise<Metadata> {
  const { packageSlug } = await params;
  const pkg = await getPackageData(packageSlug);

  if (!pkg) {
    return {
      title: "Paket Satın Al | Yayıncı Kral",
      description: "Yayıncı ve sosyal medya paketleri en uygun fiyatlarla Yayıncı Kral'da.",
    };
  }

  const platformName = pkg.category.platform.name;
  const title = `${platformName} ${pkg.name} Satın Al | Yayıncı Kral`;
  const description = `${platformName} için ${pkg.name} paketini sadece ${pkg.price.toFixed(
    2
  )} ₺'ye satın alın. %100 şifresiz, anında teslimat ve 3D Secure güvenli ödeme.`;

  return {
    title,
    description,
    keywords: [
      `${platformName.toLowerCase()} ${pkg.name.toLowerCase()}`,
      `${platformName.toLowerCase()} izleyici satın al`,
      `${platformName.toLowerCase()} izleyici botu`,
      `${platformName.toLowerCase()} takipçi satın al`,
      "yayıncı kral",
    ],
    alternates: {
      canonical: `https://www.yayincikral.com/siparis-olustur/${pkg.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.yayincikral.com/siparis-olustur/${pkg.slug}`,
      siteName: "Yayıncı Kral",
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PackageLayout({
  children,
  params,
}: PackageLayoutProps) {
  const { packageSlug } = await params;
  const pkg = await getPackageData(packageSlug);

  if (!pkg) {
    return <>{children}</>;
  }

  const platformName = pkg.category.platform.name;
  const canonicalUrl = `https://www.yayincikral.com/siparis-olustur/${pkg.slug}`;

  // 1. Google Yıldızlı Görünüm İçin Schema.org Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${platformName} ${pkg.name}`,
    description: `${platformName} için ${pkg.name} paketi. %100 şifresiz ve anında teslimat.`,
    image: "https://www.yayincikral.com/og-image.png",
    brand: {
      "@type": "Brand",
      name: "Yayıncı Kral",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: pkg.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      seller: {
        "@type": "Organization",
        name: "Yayıncı Kral",
        url: "https://www.yayincikral.com",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: 145,
      bestRating: "5",
      worstRating: "1",
    },
  };

  // 2. Breadcrumb Schema.org
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://www.yayincikral.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: platformName,
        item: `https://www.yayincikral.com/servis/${pkg.category.platform.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.category.name,
        item: `https://www.yayincikral.com/servis/${pkg.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: pkg.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

