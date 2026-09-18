// SEED — veritabanını örnek ürünlerle dolduran script.
// Çalıştırmak için: npx prisma db seed
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
// Fiyatlar kuruş cinsinden: 129990 = 1299.90 TL
const products = [
  { name: "Mekanik Klavye KX-1", description: "Hot-swap destekli, RGB aydınlatmalı %75 klavye.", priceCents: 129990, stock: 15, emoji: "⌨️" },
  { name: "Kablosuz Mouse MX-3", description: "Sessiz tık, 4000 DPI, USB-C hızlı şarj.", priceCents: 54950, stock: 30, emoji: "🖱️" },
  { name: "USB-C Hub 7'li", description: "HDMI 4K, 100W PD, SD kart okuyucu.", priceCents: 79900, stock: 22, emoji: "🔌" },
  { name: "Monitör Standı", description: "Gaz armalı, 13-32 inç uyumlu masaüstü standı.", priceCents: 104900, stock: 8, emoji: "🖥️" },
  { name: "Webcam 1080p", description: "Oto odak, çift mikrofon, gizlilik kapağı.", priceCents: 64900, stock: 18, emoji: "📷" },
  { name: "Maske Lambası", description: "Ekran arkası ambient ışık, app kontrolü.", priceCents: 39900, stock: 40, emoji: "💡" },
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
