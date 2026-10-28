import { getProviderServices, MtpServiceItem } from "../src/lib/morethanpanel";

async function main() {
  const services = await getProviderServices();
  if (!Array.isArray(services)) {
    console.error("Could not fetch services");
    return;
  }

  console.log("Searching for Twitch monthly/weekly/duration services in MoreThanPanel...");

  const twitchServices = services.filter((s) => {
    const text = (s.name + " " + s.category).toLowerCase();
    return text.includes("twitch");
  });

  console.log(`Total Twitch services: ${twitchServices.length}`);

  // Let's filter specifically for live viewers or monthly/weekly
  twitchServices.forEach((s) => {
    const text = (s.name + " " + s.category).toLowerCase();
    if (
      text.includes("ay") ||
      text.includes("month") ||
      text.includes("30") ||
      text.includes("gün") ||
      text.includes("day") ||
      text.includes("hafta") ||
      text.includes("week") ||
      text.includes("izleyici") ||
      text.includes("viewer")
    ) {
      console.log(`[ID: ${s.service}] [Rate: $${s.rate}] [Min: ${s.min} - Max: ${s.max}] [Type: ${s.type}]`);
      console.log(`Cat: ${s.category}`);
      console.log(`Name: ${s.name}\n`);
    }
  });
}

main();
