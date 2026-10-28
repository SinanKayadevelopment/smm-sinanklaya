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

console.log("=== ALL KICK SERVICES ===");
services
  .filter((s) => (s.name + " " + s.category).toLowerCase().includes("kick"))
  .forEach((s) => {
    console.log(`[ID: ${s.service}] [Rate: $${s.rate}] [Min: ${s.min} - Max: ${s.max}] [Type: ${s.type}]`);
    console.log(`Cat: ${s.category}`);
    console.log(`Name: ${s.name}\n`);
  });

console.log("\n=== ALL TWITCH VIEWER SERVICES ===");
services
  .filter((s) => {
    const text = (s.name + " " + s.category).toLowerCase();
    return text.includes("twitch") && (text.includes("view") || text.includes("live") || text.includes("izleyici"));
  })
  .forEach((s) => {
    console.log(`[ID: ${s.service}] [Rate: $${s.rate}] [Min: ${s.min} - Max: ${s.max}] [Type: ${s.type}]`);
    console.log(`Cat: ${s.category}`);
    console.log(`Name: ${s.name}\n`);
  });
