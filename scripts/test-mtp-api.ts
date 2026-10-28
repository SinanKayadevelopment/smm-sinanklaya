import { prisma } from "../src/lib/prisma";
import { getProviderBalance, getProviderServices } from "../src/lib/morethanpanel";

async function main() {
  console.log("Updating MTP_API_KEY in database...");
  await prisma.setting.upsert({
    where: { key: "MTP_API_KEY" },
    update: { value: "4fdcbf79666d7abe0bcc0c6ed8e4b6cc" },
    create: { key: "MTP_API_KEY", value: "4fdcbf79666d7abe0bcc0c6ed8e4b6cc" },
  });

  console.log("Testing MoreThanPanel API connection...");
  const balanceRes = await getProviderBalance();
  console.log("Balance Response:", JSON.stringify(balanceRes, null, 2));

  const services = await getProviderServices();
  if (Array.isArray(services)) {
    console.log("Total Services Fetched from MoreThanPanel:", services.length);
    if (services.length > 0) {
      console.log("Sample Service #1:", services[0]);
    }
  } else {
    console.log("Services Error:", services);
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
