// GET /api/products?ids=1,2,3 → sepet sayfasının ürün bilgilerini getirdiği API.
// Neden Server Component değil? Sepet sayfası client-side state kullanıyor;
// cart localStorage'dan okunduğu için sunucu ilk render'da id'leri bilemez.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ error: "ids parametresi gerekli" }, { status: 400 });
  }

  // "1,2,3" → [1, 2, 3]; geçersiz parçalar filtrelenir
  const ids = idsParam
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (ids.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // Sadece sepetin ihtiyaç duyduğu alanları seç (güvenlik: tüm tabloyu sızmamak için)
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, priceCents: true, stock: true },
  });

  return NextResponse.json(products);
}
