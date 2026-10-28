import { prisma } from "../src/lib/prisma";

async function main() {
  const platforms = await prisma.platform.findMany({
    include: {
      categories: {
        include: {
          packages: true,
        },
      },
    },
  });

  for (const p of platforms) {
    console.log(`\n=== Platform: ${p.name} (slug: ${p.slug}) ===`);
    for (const c of p.categories) {
      console.log(`  Category: ${c.name} (id: ${c.id}, slug: ${c.slug}) -> Packages count: ${c.packages.length}`);
      for (const pkg of c.packages) {
        console.log(`    - ${pkg.name} (${pkg.slug}) | MTP #${pkg.providerServiceId} | ${pkg.price} TL`);
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
