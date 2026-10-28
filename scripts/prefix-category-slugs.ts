import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Setting unique, platform-prefixed slugs for all categories...");

  const categories = await prisma.category.findMany({
    include: { platform: true },
  });

  for (const c of categories) {
    let newSlug = c.slug;
    const prefix = c.platform.slug; // e.g. twitch, kick, youtube, etc.

    if (!newSlug.startsWith(prefix) && !newSlug.startsWith(prefix === "twitter-x" ? "x-" : prefix)) {
      newSlug = `${prefix}-${newSlug}`;
    }

    if (newSlug !== c.slug) {
      await prisma.category.update({
        where: { id: c.id },
        data: { slug: newSlug },
      });
      console.log(`Updated [${c.platform.name}] "${c.name}": ${c.slug} -> ${newSlug}`);
    } else {
      console.log(`Already prefixed [${c.platform.name}] "${c.name}": ${newSlug}`);
    }
  }

  console.log("\nAll category slugs are now unique and platform-specific!");
}

main().finally(() => prisma.$disconnect());
