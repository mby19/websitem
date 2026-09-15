// PRISMA CLIENT SINGLETON
// Next.js dev modunda her hot-reload'da yeni bir PrismaClient oluşursa
// veritabanı bağlantıları birikir. Çözüm: global cache'e bir tane koy.
//
// .env'i açıkça yüklüyoruz: bazı runtime'larda Next'in env yüklemesi
// eski/çevresel değerleri geçirebiliyor; dotenv .env'i garantiler.
// (Vercel'de .env dosyası yok — gerçek env'ler dotenv'i etkilemez.)
import { config } from "dotenv";
config({ override: true });
// Postgres sürümü: driver adapter'a gerek yok — Prisma 6 Postgres'i
// native (Rust query engine ile) çalıştırır. Bağlantı adresi .env'den gelir.
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Neon pooled connection kullanılırken bile Prisma'nın kendi bağlantı
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
