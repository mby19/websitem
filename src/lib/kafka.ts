// KAFKA İSTEMCİSİ — gerçek Kafka protokolü (kafkajs) + lokal broker.
// Broker: docker-compose'daki websitem-kafka (localhost:9092, KRaft).
//
// Öğretici mimari:
//   PRODUCER (checkout) → topic: orders → CONSUMER (scripts/kafka-consumer.ts)
//   → EventLog tablosu (partition·offset kalıcı kayıt)
//
// Sınır: broker bu makinede — Vercel fonksiyonu ona erişemez; canlıda
// KAFKA_BROKER env olmadığından event katmanı kapalı kalır (graceful).
// Canlıya da Kafka için: HTTP tabanlı broker (Upstash) gerekir — aynı
// lib fonksiyonlarının ikinci bir adapter'ı olarak eklenebilir.
import { Kafka, logLevel } from "kafkajs";
import type { Producer } from "kafkajs";

export const KAFKA_BROKER = process.env.KAFKA_BROKER ?? "localhost:9092";
export const KAFKA_ENABLED = Boolean(process.env.KAFKA_BROKER);
export const KAFKA_TOPIC = "orders";

// Producer singleton: her checkout'ta TCP bağlantı kurmak yerine global cache —
// (kafkajs bağlantısı pahalı; prisma.ts'teki singleton deseniyle aynı fikir)
const globalForKafka = globalThis as unknown as { producer?: Producer };

function getKafka(): Kafka {
  return new Kafka({
    clientId: "websitem",
    brokers: [KAFKA_BROKER],
    logLevel: logLevel.NOTHING, // dev loglarını kirletmesin
  });
}

// PRODUCER — order.created event'ini yayınlar (best-effort).
export async function publishOrderCreated(order: {
  id: number;
  totalCents: number;
  itemCount: number;
  firstName: string;
}): Promise<boolean> {
  if (!KAFKA_ENABLED) return false;

  try {
    const producer = globalForKafka.producer ?? getKafka().producer();
    await producer.connect();
    globalForKafka.producer = producer;

    // key = orderId: aynı key aynı partition'a gider → sipariş sırası korunur
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [
        {
          key: String(order.id),
          value: JSON.stringify({
            type: "ORDER_CREATED",
            orderId: order.id,
            totalCents: order.totalCents,
            itemCount: order.itemCount,
            firstName: order.firstName,
            occurredAt: new Date().toISOString(),
          }),
        },
      ],
    });
    return true;
  } catch {
    // Producer hatası checkout'u bloklamaz — event kaybı demo'da kabul edilebilir.
    // Gerçek sistemde: outbox deseni (DB'de beklet, ayrı relay ile tekrar dene)
    return false;
  }
}
