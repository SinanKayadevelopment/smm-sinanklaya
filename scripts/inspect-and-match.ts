import { prisma } from "../src/lib/prisma";
import { getProviderServices, MtpServiceItem } from "../src/lib/morethanpanel";
import * as fs from "fs";

async function main() {
  console.log("Fetching packages from database...");
  const dbPackages = await prisma.package.findMany({
    include: {
      category: {
        include: {
          platform: true,
        },
      },
    },
    orderBy: [
      { category: { platform: { sortOrder: "asc" } } },
      { category: { sortOrder: "asc" } },
      { sortOrder: "asc" },
    ],
  });

  console.log(`Found ${dbPackages.length} packages in DB.`);

  console.log("Fetching live services from MoreThanPanel...");
  const rawServices = await getProviderServices();

  if (!Array.isArray(rawServices)) {
    console.error("Failed to fetch MTP services:", rawServices);
    return;
  }

  console.log(`Fetched ${rawServices.length} services from MoreThanPanel.`);

  // Write all MTP services to a json file in scratch or artifact directory so we can inspect and search them cleanly
  fs.writeFileSync("mtp_services_dump.json", JSON.stringify(rawServices, null, 2), "utf-8");
  console.log("Dumped MTP services to mtp_services_dump.json");

  // Let's summarize categories in MTP
  const categories = new Set<string>();
  for (const s of rawServices) {
    if (s.category) categories.add(s.category);
  }
  console.log(`Total MTP categories: ${categories.size}`);

  // Let's search services related to Kick, Twitch, YouTube, TikTok, Instagram, Twitter
  const keywords = ["kick", "twitch", "youtube", "tiktok", "instagram", "twitter"];
  for (const kw of keywords) {
    const matching = rawServices.filter(
      (s) =>
        s.name.toLowerCase().includes(kw) ||
        s.category.toLowerCase().includes(kw)
    );
    console.log(`Keyword "${kw}": ${matching.length} services found.`);
  }

  // Print current DB packages
  console.log("\n--- CURRENT DB PACKAGES ---");
  for (const p of dbPackages) {
    console.log(`[ID: ${p.id}] [Current providerServiceId: ${p.providerServiceId}]`);
    console.log(`Platform: ${p.category.platform.name} | Category: ${p.category.name} | Name: ${p.name} | Quantity: ${p.quantity} | Slug: ${p.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
