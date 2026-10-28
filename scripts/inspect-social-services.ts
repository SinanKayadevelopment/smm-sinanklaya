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

function printTop(label: string, filterFn: (s: Service) => boolean) {
  console.log(`\n=== ${label} ===`);
  services
    .filter(filterFn)
    .slice(0, 8)
    .forEach((s) => {
      console.log(`[ID: ${s.service}] [Rate: $${s.rate}] [Min: ${s.min} - Max: ${s.max}]`);
      console.log(`Cat: ${s.category}`);
      console.log(`Name: ${s.name}\n`);
    });
}

// YouTube Subscribers
printTop("YOUTUBE SUBSCRIBERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return (
    text.includes("youtube") &&
    (text.includes("abone") || text.includes("subscriber")) &&
    !text.includes("dislike") &&
    !text.includes("comment")
  );
});

// TikTok Followers
printTop("TIKTOK FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return (
    text.includes("tiktok") &&
    (text.includes("takip") || text.includes("follower")) &&
    !text.includes("live") &&
    !text.includes("view")
  );
});

// Instagram Followers
printTop("INSTAGRAM FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return (
    text.includes("instagram") &&
    (text.includes("takip") || text.includes("follower")) &&
    (text.includes("refill") || text.includes("garant") || text.includes("stabil"))
  );
});

// Twitter Followers
printTop("TWITTER / X FOLLOWERS", (s) => {
  const text = (s.name + " " + s.category).toLowerCase();
  return (
    (text.includes("twitter") || text.includes(" x ")) &&
    (text.includes("takip") || text.includes("follower")) &&
    (text.includes("refill") || text.includes("stabil") || text.includes("hızlı"))
  );
});
