// GET /api/orders/recent — ana sayfadaki canlı transcript'in veri kaynağı.
// Neon'dan gerçek son PAID siparişleri döndürür; sahte veri girilmez.
// Bu endpoint ürünün kanıt katmanı: "mağaza gerçekten çalışıyor"un gösterimi.
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const orders = await db.order.findMany({
    where: { status: "PAID" },
    orderBy: { id: "desc" },
    take: 6,
    include: {
      items: {
        include: {
          product: { select: { name: true, emoji: true } },
        },
      },
    },
  });

  const lines = orders.map((order) => ({
    id: order.id,
    totalCents: order.totalCents,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    firstName: order.items[0]?.product.name ?? "ürün",
    at: order.createdAt.toISOString().slice(11, 16), // UTC — demo için yeterli, sunucu TZ'i belirsiz
  }));

  return NextResponse.json(lines);
}
