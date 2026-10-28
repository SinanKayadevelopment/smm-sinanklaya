import { prisma } from "../src/lib/prisma";

async function main() {
  const platforms = await prisma.platform.findMany({
    include: {
      categories: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  for (const p of platforms) {
    console.log(`\nPlatform: ${p.name} (slug: ${p.slug})`);
    console.log(`Categories count: ${p.categories.length}`);
    for (const c of p.categories) {
      console.log(`  - [${c.id}] ${c.name} (slug: ${c.slug})`);
    }
  }
}

main().finally(() => prisma.$disconnect());
