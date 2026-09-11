// Geçici doğrulama scripti — Prisma + adapter zincirini Next dışında test eder
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const db = new PrismaClient({ adapter });

async function main() {
  const count = await db.product.count();
  console.log("Prisma+adapter sorgusu OK, ürün sayısı:", count);
}

main()
  .catch((e) => {
    console.error("HATA:", e.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
