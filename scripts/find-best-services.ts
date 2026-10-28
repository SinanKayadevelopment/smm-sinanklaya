import * as fs from "fs";

interface Service {
  service: number | string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

const services: Service[] = JSON.parse(fs.readFileSync("mtp_services_dump.json", "utf-8"));

function printMatches(label: string, filterFn: (s: Service) => boolean, limit = 15) {
  console.log(`\n================== ${label} ==================`);
  const matches = services.filter(filterFn);
  matches.slice(0, limit).forEach((s) => {
    console.log(`ID: ${s.service} | Rate: $${s.rate}/1k | Min: ${s.min} | Max: ${s.max} | Type: ${s.type}`);
    console.log(`Cat: ${s.category}`);
    console.log(`Name: ${s.name}`);
    console.log("--------------------------------------------------");
  });
  console.log(`Total found: ${matches.length}`);
}

// 1. Kick Viewers
printMatches("KICK LIVE VIEWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("kick") && (text.includes("view") || text.includes("live") || text.includes("izleyici"));
});

// 2. Twitch Viewers
printMatches("TWITCH LIVE VIEWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("twitch") && (text.includes("view") || text.includes("live") || text.includes("izleyici"));
});

// 3. Twitch Followers
printMatches("TWITCH FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("twitch") && (text.includes("follow") || text.includes("takip"));
});

// 4. YouTube Subscribers
printMatches("YOUTUBE SUBSCRIBERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("youtube") && (text.includes("sub") || text.includes("abone"));
});

// 5. TikTok Followers
printMatches("TIKTOK FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("tiktok") && (text.includes("follow") || text.includes("takip"));
});

// 6. Instagram Followers
printMatches("INSTAGRAM FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return text.includes("instagram") && (text.includes("follow") || text.includes("takip"));
});

// 7. Twitter / X Followers
printMatches("TWITTER FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return (text.includes("twitter") || text.includes(" x ")) && (text.includes("follow") || text.includes("takip"));
});
