// PRISMA CLIENT SINGLETON
// Next.js dev modunda her hot-reload'da yeni bir PrismaClient oluşursa
// veritabanı bağlantıları birikir. Çözüm: global cache'e bir tane koy.
import { join, resolve } from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// SQLite yol çözümleme tuzağı: Prisma CLI göreli "file:" yollarını şema
// klasörüne (prisma/) göre çözer; adapter ise süreç çalışma dizinine
// (process.cwd()) göre çözer. Aynı string iki araç için farklı dosya açar!
// Çözüm: CLI ile AYNI konvansiyonu uygula — göreli yolu prisma/ altında çöz.
function toAbsoluteFileUrl(raw: string): string {
  const rawPath = raw.startsWith("file:") ? raw.slice(5) : raw;
  const absolute = resolve(join(process.cwd(), "prisma"), rawPath);
  return `file:${absolute}`;
}

const adapter = new PrismaBetterSqlite3({
  url: toAbsoluteFileUrl(process.env.DATABASE_URL ?? "file:./dev.db"),
});
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
