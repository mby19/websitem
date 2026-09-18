// KAFKA CONSUMER — gerçek Kafka protokolü (kafkajs) ile çalışan kalıcı worker.
// npm run kafka:consume
//
// Bu script demo'da "ayrı servis" rolündedir: Next.js'in hiçbir parçası değil;
// kendi süreci, kendi consumer group'u (websitem-log), kendi offset'i.
// Her mesaj EventLog tablosuna idempotent yazılır: (topic,partition,offset)
// unique — consumer group zaten offset ilerletse de çift yazımı garantiler.
import "dotenv/config";
import { Kafka, logLevel } from "kafkajs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const BROKER = process.env.KAFKA_BROKER ?? "localhost:9092";
const TOPIC = "orders";
const GROUP = "websitem-log";

// Consumer, Next.js'ten bağımsız bir süreç — kendi DB bağlantısı
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const db = new PrismaClient({ adapter });

const kafka = new Kafka({
  clientId: "websitem-consumer",
  brokers: [BROKER],
  logLevel: logLevel.WARN,
});

const consumer = kafka.consumer({ groupId: GROUP });

async function main(): Promise<void> {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
  console.log(`[consumer] bağlı: ${BROKER} · topic: ${TOPIC} · group: ${GROUP}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payloadText = message.value?.toString() ?? "";

      // Idempotent: aynı partition/offset iki kez EventLog'a düşmez
      const existing = await db.eventLog.findUnique({
        where: {
          topic_partition_offset: {
            topic,
            partition,
            offset: Number(message.offset),
          },
        },
      });
      if (existing) return;

      await db.eventLog.create({
        data: {
          topic,
          partition,
          offset: Number(message.offset),
          type: extractType(payloadText),
          payload: payloadText,
        },
      });
      console.log(`[consumer] ${topic} · p${partition} · off${message.offset} → kaydedildi`);
    },
  });
}

function extractType(payloadText: string): string {
  try {
    const parsed = JSON.parse(payloadText);
    if (parsed && typeof parsed === "object" && "type" in parsed && typeof parsed.type === "string") {
      return parsed.type;
    }
  } catch {
    // bozuk JSON: UNKNOWN olarak kaydet
  }
  return "UNKNOWN";
}

main()
  .catch((error) => {
    console.error("[consumer] çöküş:", error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
