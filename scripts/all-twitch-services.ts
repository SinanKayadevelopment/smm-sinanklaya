import { getProviderServices } from "../src/lib/morethanpanel";

async function main() {
  const services = await getProviderServices();
  if (!Array.isArray(services)) return;

  console.log("Searching MTP for all Twitch services containing any number or duration...");
  const twitchServices = services.filter((s) => {
    return s.name.toLowerCase().includes("twitch") || s.category.toLowerCase().includes("twitch");
  });

  twitchServices.forEach((s) => {
    console.log(`[#${s.service}] [${s.category}] -> ${s.name} (Rate: $${s.rate})`);
  });
}

main();
