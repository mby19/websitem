// KAFKA CONSUMER SCRIPT — npm run kafka:consume
// Kalıcı döngü: her 3 sn'de /api/events/consume endpoint'ine tick atar
// (endpoint Kafka'dan batch çeker ve EventLog'a yazar). Gerçek üretimde
// bu döngünün kendisi Kafka protokolüyle konuşan kalıcı bir worker olurdu;
// serverless demo'da tick modeli HTTP consumer'ı canlı tutar.
const BASE = process.env.APP_URL ?? "http://localhost:3000";
export {}; // top-level await için module işareti

async function tick(): Promise<void> {
  try {
    const res = await fetch(`${BASE}/api/events/consume`, { method: "POST" });
    const body = (await res.json()) as { consumed?: number; error?: string };
    if (body.error) {
      console.log(`[consumer] hata: ${body.error}`);
      return;
    }
    if ((body.consumed ?? 0) > 0) {
      console.log(`[consumer] ${body.consumed} yeni olay kayda geçti`);
    }
  } catch {
    console.log(`[consumer] ${BASE} erişilemiyor — dev server çalışıyor mu?`);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// sonsuz döngü: Ctrl+C ile durur (process SIGINT default terminate)
for (;;) {
  await tick();
  await sleep(3000);
}
