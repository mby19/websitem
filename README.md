# WebSim Mağaza

Öğrenme amaçlı, uçtan uca çalışan bir e-ticaret uygulaması.
Next.js + TypeScript ile; veritabanından siparişe tüm temel akışlar gerçek kod ile uygulanmıştır.

## Özellikler

- **Ürün kataloğu** — listeleme ve detay sayfaları (Server Component + SSR)
- **Sepet** — Context API + `localStorage` kalıcılığı; sayfa yenilense de korunur
- **Checkout** — sunucu tarafında transaction ile sipariş oluşturma:
  - Fiyat hile koruması: fiyat **asla** istemciden alınmaz, DB'den okunur
  - Stok kontrolü + sipariş sonrası atomik stok düşüşü
  - Sipariş anındaki fiyat kopyalanır (snapshot) — geçmiş siparişler fiyatlardan bağımsız
- **Siparişler** — teşekkür sayfası ve misafir sipariş geçmişi
- **Giriş / Kayıt** — Auth.js v5 + Credentials provider, bcrypt hash, JWT session
- **Veri modeli** — Prisma ORM (SQLite): `User`, `Product`, `Order`, `OrderItem`, `CartItem`

## Teknolojiler

| Katman | Araç |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| ORM / DB | Prisma 6 + SQLite |
| Auth | Auth.js (next-auth) v5, Credentials + bcryptjs |
| Test/Doğrulama | Manuel uçtan uca + `tsc` |

## Çalıştırma

```bash
npm install
npx prisma migrate deploy   # tabloları oluştur
npx prisma db seed          # örnek ürünler
npm run dev                 # http://localhost:3000
```

Gerekli `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<rastgele 32+ karakter>"   # openssl rand -base64 32
```

## Öğrenme Notları (kayda değer tuzaklar)

- **SQLite yol çözümleme tutarsızlığı**: Prisma CLI göreli `file:` yollarını
  şema klasörüne (`prisma/`), driver adapter ise `process.cwd()`'ye göre çözer.
  Aynı string iki araç için farklı dosya açabilir. `src/lib/prisma.ts` ve
  `prisma.config.ts` bu dönüşümü tek merkezde yapar.
- **Native modül ABI uyuşmazlığı**: `better-sqlite3` binary'si, onu yükleyen
  Node sürümünün ABI'siyle derlenmek zorundadır. `npm rebuild better-sqlite3`.
- **Parasal değerler kuruş cinsinden** (`priceCents`): Float ile para tutmak
  yuvarlama hatası doğurur; görselleştirme `Intl.NumberFormat` ile yapılır.
- **Soft-nav yarışı**: Auth.js `signIn`'in kendi redirect'i ile client
  yönlendirmesi çakışır; bu proje form POST + hard navigation'ı tercih eder.

## Yol haritası

- [ ] Stripe test modunda gerçek ödeme akışı (`src/app/api/checkout/route.ts` hazır)
- [ ] Admin paneli (ürün CRUD + stok)
- [ ] Vercel + Neon Postgres deploy (SQLite yerine)

## Bilinen sınırlar

- Sipariş geçmişi misafir için `localStorage`'da; giriş yaptıktan sonra DB'ye bağlanır.
- Ödemeler demo: sipariş `PAID` olarak oluşturulur, gerçek ödeme akışı Stripe işine kaldı.
