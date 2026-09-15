// Bu dosya Prisma CLI'nin VERİTABANINA nasıl bağlanacağını söyler.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Şema dosyasının yeri
  schema: "prisma/schema.prisma",

  // Migration (veritabanı versiyonlama) klasörü + seed script'i
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Veritabanı bağlantı adresi (.env → DATABASE_URL, Neon Postgres)
  datasource: {
    url: env("DATABASE_URL"),
  },
});
