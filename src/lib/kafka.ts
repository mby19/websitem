// KAFKA İSTEMCİSİ — Upstash Kafka (HTTP tabanlı Kafka).
// Serverless'tan (Vercel) Kafka'ya giden tek güvenli yol: HTTP. Upstash,
// Kafka protokolüyle de uyumlu ama HTTP API'si fetch tabanlı olduğundan
// soğuk serverless fonksiyonlarında TCP bağlantısı yönetme derdi yok.
//
// Öğretici mimari:
//   PRODUCER (checkout) → topic: orders → CONSUMER (EventLog + transcript)
// Event yayını "best-effort": Kafka kapalıysa (env yok) checkout PATLAMAZ —
// sipariş DB'ye zaten yazıldı; event katmanı yan etki (side-effect).
import { Kafka } from "@upstash/kafka";

const url = process.env.UPSTASH_KAFKA_REST_URL;
const username = process.env.UPSTASH_KAFKA_USERNAME;
const password = process.env.UPSTASH_KAFKA_PASSWORD;

export const KAFKA_ENABLED = Boolean(url && username && password);
export const KAFKA_TOPIC = "orders";

function getKafka(): Kafka {
  if (!url || !username || !password) {
    throw new Error("Kafka env eksik — KAFKA_ENABLED ile kontrol et");
  }
  return new Kafka({ url, username, password });
}

// PRODUCER — order.created event'ini yayınlar.
// Event payload'ı snapshot: o anki siparişin tüm durumu taşınır; consumer
// sipariş tablosuna bakmak zorunda kalmasın (event-carried state transfer).
export async function publishOrderCreated(order: {
  id: number;
  totalCents: number;
  itemCount: number;
  firstName: string;
}): Promise<boolean> {
  if (!KAFKA_ENABLED) return false;

  try {
    const kafka = getKafka();
    const key = String(order.id); // aynı sipariş aynı partition'a → sıralama korunur
    const value = JSON.stringify({
      type: "ORDER_CREATED",
      orderId: order.id,
      totalCents: order.totalCents,
      itemCount: order.itemCount,
      firstName: order.firstName,
      occurredAt: new Date().toISOString(),
    });
    // Upstash HTTP produce: topic, key, value
    await kafka.producer().produce(KAFKA_TOPIC, { value, key, partition: 0 });
    return true;
  } catch {
    // Producer hatası checkout'u bloklamaz — event kaybı kabul edilebilir (demo)
    // Gerçek sistemde: outbox deseni (DB'de beklet, ayrı relay ile tekrar dene)
    return false;
  }
}
