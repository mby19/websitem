// Bu dosya Prisma CLI'nin VERİTABANINA nasıl bağlanacağını söyler.
import "dotenv/config";
import { join, resolve } from "path";
import { defineConfig, env } from "prisma/config";

// SQLite yol tuzağı: göreli "file:" yolu CLI şema klasörüne göre çözülür.
// Aynı davranışı burada açıkça uygulayıp mutlak yola sabitliyoruz.
const rawUrl = env("DATABASE_URL") ?? "file:./dev.db";
const dbFile = resolve(join(process.cwd(), "prisma"), rawUrl.startsWith("file:") ? rawUrl.slice(5) : rawUrl);
export default defineConfig({
  // Şema dosyasının yeri
  schema: "prisma/schema.prisma",

  // Migration (veritabanı versiyonlama) klasörü + seed script'i
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Veritabanı bağlantı adresi — mutlak yol
  datasource: {
    url: `file:${dbFile}`,
  },
});
