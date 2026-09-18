# WebSim Mağaza

Öğrenme amaçlı, uçtan uca çalışan bir e-ticaret uygulaması.
Next.js + TypeScript ile; veritabanından siparişe tüm temel akışlar gerçek kod ile uygulanmıştır.

**Canlı:** https://websitem-umber.vercel.app · **Stack:** Next.js 16, TypeScript, Prisma, Neon Postgres, Auth.js

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
| ORM / DB | Prisma 6 + Neon Postgres (serverless) |
| Auth | Auth.js (next-auth) v5, Credentials + bcryptjs |
| Test/Doğrulama | Manuel uçtan uca (tarayıcı) + `tsc` |

## Çalıştırma

```bash
npm install                # postinstall: prisma generate çalışır
npx prisma migrate deploy  # tabloları oluştur
npx prisma db seed         # örnek ürünler
npm run dev                # http://localhost:3000
```

Gerekli `.env`:

```env
DATABASE_URL="postgresql://<kullanıcı>:<şifre>@<host>/<db>?sslmode=require"
AUTH_SECRET="<rastgele 32+ karakter>"   # openssl rand -base64 32
```

Lokal geliştirmede de Neon bağlantısı kullanılıyor (tek kaynak, kopyasız).
Vercel'de `DATABASE_URL` + `AUTH_SECRET` panel üzerinden ayarlanır.

## Öğrenme Notları (kayda değer tuzaklar)

- **SQLite yol çözümleme tutarsızlığı** (SQLite dönemi): Prisma CLI göreli
  `file:` yollarını şema klasörüne, adapter ise `process.cwd()`'ye göre çözer.
  Aynı string iki araç için farklı dosya açar. Postgres'e geçince bu sınıf
  sorun tamamen ortadan kalktı — bir deploy modeli seçiminin gizli maliyeti.
- **Native modül ABI uyuşmazlığı**: `better-sqlite3` binary'si, onu yükleyen
  Node sürümünün ABI'siyle derlenmek zorundadır. `npm rebuild better-sqlite3`.
- **Parasal değerler kuruş cinsinden** (`priceCents`): Float ile para tutmak
  yuvarlama hatası doğurur; görselleştirme `Intl.NumberFormat` ile yapılır.
- **Soft-nav yarışı**: Auth.js `signIn`'in kendi redirect'i ile client
  yönlendirmesi çakışır; bu proje form POST + hard navigation'ı tercih eder.

## Yol haritası

- [x] Vercel + Neon Postgres deploy
- [x] Admin paneli (ürün CRUD + stok) — `ADMIN_EMAIL` env guard'ı
- [x] Kafka event pipeline (aşağıda)
- [ ] Stripe test modunda gerçek ödeme akışı (`src/app/api/checkout/route.ts` hazır)

## Kafka event pipeline (öğretici)

Checkout, sipariş yazıldıktan sonra bir event yayınlar; ayrı bir consumer
süreci bu olayı kalıcı günlüğe düşer:

```text
PRODUCER                       BROKER (lokal, KRaft)      CONSUMER (ayrı süreç)
checkout Server Action ──TCP──▶ docker: websitem-kafka ──TCP──▶ scripts/kafka-consumer.ts
(src/lib/kafka.ts · kafkajs)    topic: orders, p0              group: websitem-log
                                                               → EventLog tablosu
                                                               (partition·offset)
```

- **Broker:** `docker compose up -d` — tek düğümlük KRaft (zookeeper yok),
  `apache/kafka:3.9.0`. Topic: `docker exec websitem-kafka
  /opt/kafka/bin/kafka-topics.sh --create --topic orders --bootstrap-server
  localhost:9092 --partitions 1 --replication-factor 1` (ya da ilk produce'da
  otomatik oluşur).
- **Producer** (`src/lib/kafka.ts`): checkout transaction'ı *sonrasında*
  `ORDER_CREATED` yayınlar — best-effort: broker kapalıysa (KAFKA_BROKER
  env yok) checkout PATLAMAZ (`eventPublished: false`). Event payload'ı
  snapshot: tüm sipariş durumu taşınır (event-carried state transfer).
- **Consumer** (`scripts/kafka-consumer.ts`): `npm run kafka:consume` —
  consumer group `websitem-log` ile offset yönetimi; her mesaj EventLog'a
  idempotent yazılır (`(topic,partition,offset)` unique — çift yazım yok).
  Ayrı süreç: Next.js'ten bağımsız — Kafka'nın "ayrı servis" fikrinin ta kendisi.
- **Görünüm:** admin → Event pipeline (`kafka:on/off`, partition·offset satırları).
- **Vercel notu:** broker bu makinede olduğundan canlıda event katmanı kapalı
  kalır (graceful). Canlıda da Kafka istenirse HTTP tabanlı broker (Upstash)
  eklenir — lib fonksiyonları zaten adapter-desenli.
- **Neden Kafka burada?** Checkout'u yan etkilerinden (denetim kaydı,
  bildirim, analitik) ayırmak: aynı event'i farklı consumer'lar farklı
  hızlarda işleyebilir, replay edilebilir. 6 ürünlük demo için overkill —
  öğretici bilinçli tercih; "doğru araç" tartışmasının iki yüzünü görmek için.

### Deploy'da öğrenilen tuzaklar (Vercel + Turbopack + Prisma)

- **Query engine platform uyuşmazlığı**: build makinesi Debian'da `debian` engine
  üretir, Vercel runtime `rhel-openssl-3.0.x` ister. Kalıcı çözüm: Rust engine'i
  deployment'tan tamamen çıkarmak — `engineType = "client"` + `@prisma/adapter-pg`.
  (binaryTargets + `outputFileTracingIncludes` kombinasyonu Turbopack build'inde
  güvenilir çalışmadı.)
- **npm install scriptleri**: `@prisma/client`, `@prisma/engines`, `prisma`
  postinstall'ları onaysız atlanırsa `prisma generate` engine'siz client üretir.
  `package.json > allowScripts` ile onaylandı; `postinstall: prisma generate`.
- **`product` id'leri seed'i tekrar edince kayar**: Postgres serial sequence
  `deleteMany` ile sıfırlanmaz; seed'i tekrarlayan tablolarda
  `TRUNCATE ... RESTART IDENTITY` gerekir.

## Bilinen sınırlar

- Sipariş geçmişi misafir için `localStorage`'da; giriş yaptıktan sonra DB'ye bağlanır.
- Ödemeler demo: sipariş `PAID` olarak oluşturulur, gerçek ödeme akışı Stripe işine kaldı.
