async function testUrls() {
  const urls = [
    "http://localhost:3000/servis/twitch",
    "http://localhost:3000/servis/kick",
    "http://localhost:3000/servis/twitch-saatlik-canli-izleyici",
    "http://localhost:3000/servis/kick-aylik-canli-izleyici",
    "http://localhost:3000/servis/youtube",
    "http://localhost:3000/servis/instagram",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const hasOldAylik = text.includes("twitch-50-canli-izleyici-1-aylik");
      const hasNew24h = text.includes("24 Saatlik 25 Canlı İzleyici");
      const hasNew1h = text.includes("1 Saatlik 50 Canlı İzleyici");
      const hasKickAylik = text.includes("25 Canlı İzleyici (1 Aylık Paket)");

      console.log(`\nURL: ${url}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  Has New 1 Saatlik: ${hasNew1h}`);
      console.log(`  Has New 24 Saatlik: ${hasNew24h}`);
      console.log(`  Has Old Twitch 1 Aylik (Should be false): ${hasOldAylik}`);
      console.log(`  Has Kick 1 Aylik Paket: ${hasKickAylik}`);
    } catch (e: any) {
      console.error(`Error on ${url}:`, e.message);
    }
  }
}

testUrls();
