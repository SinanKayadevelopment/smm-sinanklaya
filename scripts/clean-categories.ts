import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Cleaning empty categories and organizing package assignments...");

  // 1. Delete categories with 0 packages that are redundant duplicates
  const categories = await prisma.category.findMany({
    include: {
      packages: true,
      platform: true,
    },
  });

  for (const c of categories) {
    if (c.packages.length === 0) {
      console.log(`- Removing unused empty category: [${c.platform.name}] "${c.name}" (${c.slug})`);
      await prisma.category.delete({ where: { id: c.id } });
    }
  }

  // 2. For Twitch: create/ensure "24-saatlik-canli-izleyici" exists under Twitch
  const twitch = await prisma.platform.findUnique({ where: { slug: "twitch" } });
  if (twitch) {
    let twitch24h = await prisma.category.findFirst({
      where: { platformId: twitch.id, slug: "24-saatlik-canli-izleyici" },
    });

    if (!twitch24h) {
      twitch24h = await prisma.category.create({
        data: {
          platformId: twitch.id,
          name: "24 Saatlik Canlı İzleyici",
          slug: "24-saatlik-canli-izleyici",
          shortDescription: "Twitch yayınlarınızda 24 saat (1 gün) boyunca kesintisiz ve stabil izleyici desteği.",
          sortOrder: 2,
          isActive: true,
        },
      });
      console.log(`+ Created Twitch category: "24 Saatlik Canlı İzleyici"`);
    }

    // Move the 24h Twitch packages into this category
    const twitch24hPkgs = await prisma.package.findMany({
      where: {
        slug: { in: ["twitch-24-saatlik-25-canli-izleyici", "twitch-24-saatlik-50-canli-izleyici"] },
      },
    });

    for (const p of twitch24hPkgs) {
      await prisma.package.update({
        where: { id: p.id },
        data: { categoryId: twitch24h.id },
      });
      console.log(`  -> Moved "${p.name}" to Twitch "24 Saatlik Canlı İzleyici" category.`);
    }
  }

  // 3. Print final clean catalog
  console.log("\n=== FINAL CLEAN CATALOG ===");
  const platforms = await prisma.platform.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          packages: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  for (const p of platforms) {
    console.log(`\nPlatform: ${p.name} (${p.slug})`);
    for (const c of p.categories) {
      console.log(`  Category: ${c.name} (slug: ${c.slug}) -> ${c.packages.length} packages`);
      for (const pkg of c.packages) {
        console.log(`    * ${pkg.name} | MTP #${pkg.providerServiceId} | ${pkg.price} TL`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
