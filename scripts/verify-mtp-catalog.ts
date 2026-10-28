import { getProviderServices, MtpServiceItem } from "../src/lib/morethanpanel";

async function main() {
  const services = await getProviderServices();
  if (!Array.isArray(services)) {
    console.error("Servisler alınamadı");
    return;
  }

  const idsToVerify = [
    // Twitch
    7788, // Twitch Viewer 1h
    3317, // Twitch Viewer 2h
    7782, // Twitch Viewer 1d
    4164, // Twitch Follower 90d refill
    // Kick
    6114, // Kick Viewer 1h
    3784, // Kick Viewer 1d
    3785, // Kick Viewer 1w
    3786, // Kick Viewer 1m
    3796, // Kick Viewer 1m (no bot)
    7813, // Kick Follower 90d refill
    // YouTube
    8125, // YouTube Subs Lifetime
    9648, // YouTube Subs Lifetime
    // TikTok
    5818, // TikTok Follower 30d refill
    // Instagram
    5440, // Instagram Follower 30d refill
    5542, // Instagram Follower Elite
    // Twitter
    2603, // Twitter Follower 7d refill
    3635, // Twitter Follower 7d refill
  ];

  console.log("Verifying service IDs against MoreThanPanel live catalog:");
  for (const id of idsToVerify) {
    const s = services.find((item) => item.service.toString() === id.toString());
    if (s) {
      console.log(`[PASS] #${id} -> ${s.name} | Rate: $${s.rate} | Min: ${s.min} | Max: ${s.max}`);
    } else {
      console.log(`[FAIL] #${id} NOT FOUND IN MTP`);
    }
  }

  // Also let's find the best Instagram likes, YouTube views, and Twitter impressions
  console.log("\nSearching for Instagram likes:");
  services
    .filter((s) => s.category.includes("Instagram") && s.name.toLowerCase().includes("beğeni"))
    .slice(0, 3)
    .forEach((s) => console.log(`  #${s.service} - ${s.name} ($${s.rate})`));

  console.log("\nSearching for TikTok views:");
  services
    .filter((s) => s.category.includes("Tiktok") && (s.name.toLowerCase().includes("izlen") || s.name.toLowerCase().includes("views")))
    .slice(0, 3)
    .forEach((s) => console.log(`  #${s.service} - ${s.name} ($${s.rate})`));

  console.log("\nSearching for YouTube views:");
  services
    .filter((s) => s.category.includes("Youtube") && (s.name.toLowerCase().includes("izlen") || s.name.toLowerCase().includes("views")))
    .slice(0, 3)
    .forEach((s) => console.log(`  #${s.service} - ${s.name} ($${s.rate})`));
}

main();
