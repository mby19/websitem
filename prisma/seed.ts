// SEED — veritabanını örnek ürünlerle dolduran script.
// Çalıştırmak için: npx prisma db seed
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { join } from "path";

const adapter = new PrismaBetterSqlite3({
  // .env'deki göreli yol CLI ile aynı konvansiyonda: prisma/ klasörü bazlı
  url: `file:${join(process.cwd(), "prisma", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

// Fiyatlar kuruş cinsinden: 12999 = 129.99 TL
const products = [
  { name: "Mekanik Klavye KX-1", description: "Hot-swap destekli, RGB aydınlatmalı %75 klavye.", priceCents: 129990, stock: 15 },
  { name: "Kablosuz Mouse MX-3", description: "Sessiz tık, 4000 DPI, USB-C hızlı şarj.", priceCents: 54950, stock: 30 },
  { name: "USB-C Hub 7'li", description: "HDMI 4K, 100W PD, SD kart okuyucu.", priceCents: 79900, stock: 22 },
  { name: "Monitör Standı", description: "Gaz armalı, 13-32 inç uyumlu masaüstü standı.", priceCents: 104900, stock: 8 },
  { name: "Webcam 1080p", description: "Oto odak, çift mikrofon, gizlilik kapağı.", priceCents: 64900, stock: 18 },
  { name: "Maske Lambası", description: "Ekran arkası ambient ışık, app kontrolü.", priceCents: 39900, stock: 40 },
];

async function main() {
  // Tekrar çalıştırmaya dayanıklı olsun diye önce temizle
  // FK sırası önemli: bağlı kalemler önce, ana tablolar sonra silinir
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`${products.length} ürün eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
