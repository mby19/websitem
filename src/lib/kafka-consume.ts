// CONSUMER TICK ÇEKİRDEĞİ — /api/events/consume ve admin action'ı paylaşır.
// Kafka'dan consumer group ile bir parti mesaj çeker, EventLog'a idempotent
// yazar. (Detaylı öğretici notlar route.ts'te.)
import { Kafka } from "@upstash/kafka";
import { db } from "@/lib/prisma";
import { KAFKA_ENABLED, KAFKA_TOPIC } from "@/lib/kafka";

// Upstash consumer mesajı: dış dünya verisi — sınırda zorunlu alanları daralt
type KafkaMessage = {
  topic: string;
  partition: number;
  offset: number;
  value?: string;
};

function asKafkaMessage(value: unknown): KafkaMessage | null {
  if (!value || typeof value !== "object") return null;
  if (!("partition" in value) || !("offset" in value)) return null;
  const m = value as Record<string, unknown>;
  if (typeof m.partition !== "number" || typeof m.offset !== "number") return null;
  return {
    topic: typeof m.topic === "string" ? m.topic : KAFKA_TOPIC,
    partition: m.partition,
    offset: m.offset,
    value: typeof m.value === "string" ? m.value : undefined,
  };
}

function extractType(payloadText: string): string {
  try {
    const parsed = JSON.parse(payloadText);
    if (parsed && typeof parsed === "object" && "type" in parsed && typeof parsed.type === "string") {
      return parsed.type;
    }
  } catch {
    // bozuk JSON: UNKNOWN olarak kaydet, sessizce çöketme
  }
  return "UNKNOWN";
}

export type ConsumeResult = { consumed: number } | { error: string };

export async function consumeTick(): Promise<ConsumeResult> {
  if (!KAFKA_ENABLED) return { error: "Kafka yapılandırılmamış — UPSTASH_KAFKA_* env değerlerini ayarla" };

  const kafka = new Kafka({
    url: process.env.UPSTASH_KAFKA_REST_URL!,
    username: process.env.UPSTASH_KAFKA_USERNAME!,
    password: process.env.UPSTASH_KAFKA_PASSWORD!,
  });

  // Consumer group: "websitem-log" (consume() çağrısında iletilir). Grup sayesinde
  // offset grup içinde ilerler — aynı mesaj aynı grupta bir kez işlenir; yeni
  // grup baştan okur (replay).
  const consumer = kafka.consumer();

  const messages = await consumer.consume({
    consumerGroupId: "websitem-log",
    instanceId: "websitem-log-1",
    topics: [KAFKA_TOPIC],
    timeout: 1000,
    autoCommit: true,
  });

  let processed = 0;
  for (const raw of messages) {
    const message = asKafkaMessage(raw);
    if (!message) continue; // beklenmeyen format: atla, sessizce

    const payloadText = message.value ?? "";

    // Idempotent yazım: aynı partition/offset iki kez EventLog'a düşmez
    const existing = await db.eventLog.findUnique({
      where: {
        topic_partition_offset: {
          topic: message.topic,
          partition: message.partition,
          offset: message.offset,
        },
      },
    });
    if (existing) continue;

    await db.eventLog.create({
      data: {
        topic: message.topic,
        partition: message.partition,
        offset: message.offset,
        type: extractType(payloadText),
        payload: payloadText,
      },
    });
    processed += 1;
  }

  return { consumed: processed };
}

