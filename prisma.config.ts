// Bu dosya Prisma CLI'nin VERİTABANINA nasıl bağlanacağını söyler.
import "dotenv/config";
import { resolve } from "path";
import { defineConfig, env } from "prisma/config";

// SQLite yol tuzağı: göreli "file:" yolu CLI şema klasörüne, adapter ise
// çalışma dizinine göre çözer. İkisini de aynı mutlak yola sabitliyoruz.
const rawUrl = env("DATABASE_URL") ?? "file:./prisma/dev.db";
const dbFile = resolve(process.cwd(), rawUrl.startsWith("file:") ? rawUrl.slice(5) : rawUrl);

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
