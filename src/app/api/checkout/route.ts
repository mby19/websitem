// POST /api/checkout — sepeti siparişe dönüştürür.
// Bu, e-ticaretin EN KRİTİK kodu: tutarlılık burada korunmalı.
// Transaction: ya her şey olur (sipariş + kalemler + stok düşüşü) ya hiçbir şey.
// (Ödeme sağlayıcı yokken "ödeme başarılı" varsayıyoruz; Stripe gelince
//  sadece bu dosyanın başına gerçek ödeme adımı eklenir.)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// Gelen gövdenin tipi — runtime'da yine doğrulayacağız
type CheckoutBody = {
  items: Array<{ productId: number; quantity: number }>;
};

export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
  }

  // Her satır geçerli mi? (temel giriş doğrulaması)
  const valid = items.every(
    (i) => Number.isInteger(i.productId) && i.productId > 0 && Number.isInteger(i.quantity) && i.quantity > 0
  );
  if (!valid) {
    return NextResponse.json({ error: "Geçersiz sepet satırı" }, { status: 400 });
  }

  // FİYAT HİLE KORUMASI: fiyatları ASLA istemciden almıyoruz.
  // İstemci yalnız productId + quantity gönderir; fiyatı DB'den biz okuruz.
  // Aksi halde saldırgan 0 TL'ye ürün alabilir.
  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: `Ürün bulunamadı: ${item.productId}` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Yetersiz stok: ${product.name} (kalan ${product.stock})` },
        { status: 409 } // 409 Conflict: durum çakışması
      );
    }
  }

  // TRANSACTION: atomik iş birimi — tümü ya da hiçbiri.
  // Yarım sipariş (stok düşüldü ama sipariş oluşmadı gibi) veri bozulmasıdır.
  const order = await db.$transaction(async (tx) => {
    const totalCents = items.reduce((sum, item) => {
      const p = products.find((prod) => prod.id === item.productId)!;
      return sum + p.priceCents * item.quantity;
    }, 0);

    const created = await tx.order.create({
      data: {
        status: "PAID", // ödeme sağlayıcı yok: ödemenin başarılı varsaydığımızı belirtiyoruz
        totalCents,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            // Snapshot: sipariş anındaki fiyatı KOPYALA (ürün fiyatı sonra değişse geçmiş bozulmaz)
            priceCents: products.find((prod) => prod.id === item.productId)!.priceCents,
          })),
        },
      },
      include: { items: true },
    });

    // Stokları düş: her ürün için tek UPDATE (aynı ürün iki satırdaysa birikir)
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
