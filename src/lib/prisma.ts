// PRISMA CLIENT SINGLETON
// Next.js dev modunda her hot-reload'da yeni bir PrismaClient oluşursa
// veritabanı bağlantıları birikir. Çözüm: global cache'e bir tane koy.
//
// engineType = "client" (şemada): JS query engine + pg driver adapter.
// Rust engine binary'si olmadan serverless'ta (Vercel) taşınabilir.
// .env'i açıkça yüklüyoruz: bazı runtime'larda Next'in env yüklemesi
// eski/çevresel değerleri geçirebiliyor; dotenv .env'i garantiler.
// (Vercel'de .env dosyası yok — gerçek env'ler dotenv'i etkilemez.)
import { config } from "dotenv";
config({ override: true });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
