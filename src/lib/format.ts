// Fiyatı kuruş → "129.99 TL" biçiminde görüntüler.
// Intl.NumberFormat tarayıcı ve Node'da aynı sonucu verir.
const formatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

export function formatPrice(priceCents: number): string {
  return formatter.format(priceCents / 100);
}
